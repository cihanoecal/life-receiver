/*
**  Live Video Experience (LiVE)
**  Copyright (c) 2020-2022 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

/*  external requirements  */
const fs        = require("fs")
const os        = require("os")
const path      = require("path")
const glob      = require("glob")
const shell     = require("shelljs")
const execa     = require("execa")
const zip       = require("cross-zip")
const DSIG      = require("dsig")
const PromptPW  = require("prompt-password")

/*  establish asynchronous environment  */
;(async () => {
    /*  remove previously generated files  */
    console.log("++ cleanup")
    shell.rm("-rf", "dist")

    /*  reduce the size of the development tree  */
    console.log("++ reducing source-tree")
    const remove = glob.sync("node_modules/typopro-web/web/TypoPRO-*")
        .filter((path) => !path.match(/\/TypoPRO-SourceSansPro$/))
        .filter((path) => !path.match(/\/TypoPRO-SourceCodePro$/))
    for (const file of remove)
        shell.rm("-rf", file)

    /*  helper function for digitally signing distribution artifact  */
    const sign = async (zipfile) => {
        console.log("++ generating digital signature for ZIP distribution archive")
        const prompt = new PromptPW({
            type:    "password",
            message: "Password",
            name:    "password"
        })
        const passPhrase = await prompt.run()
        const sigfile = zipfile.replace(/\.zip$/, ".sig")
        const payload = await fs.promises.readFile(zipfile, { encoding: null })
        const privateKey = await fs.promises.readFile(
            path.join(os.homedir(), ".dsig", "LiVE.prv"), { encoding: "utf8" })
        const signature = await DSIG.sign(payload, privateKey, passPhrase)
        await fs.promises.writeFile(sigfile, signature, { encoding: "utf8" })
        const publicKey = await fs.promises.readFile("npm-package.pk", { encoding: "utf8" })
        await DSIG.verify(payload, signature, publicKey)
    }

    /*   package according to platform...  */
    const electronbuilder = path.resolve(path.join("node_modules", ".bin", "electron-builder"))
    const arch1 = os.arch()
    let arch2 = arch1
    if (arch2 === "arm64")
        arch2 = "a64"
    if (os.platform() === "win32") {
        /*  run Electron-Builder to package the application  */
        console.log("++ packaging App as an Electron distribution for Windows platform")
        execa.sync(electronbuilder, [ "--win", `--${arch1}` ],
            { stdin: "inherit", stdout: "inherit", stderr: "inherit" })

        /*  pack application into a distribution archive
            (notice: under Windows the ZIP does NOT automatically use a top-level directory)  */
        console.log("++ packing App into ZIP distribution archive")
        zip.zipSync(
            path.join(__dirname, "dist/LiVE-Receiver.exe"),
            path.join(__dirname, `dist/LiVE-Receiver-win-${arch2}.zip`))
        await sign(`dist/LiVE-Receiver-win-${arch2}.zip`)
    }
    else if (os.platform() === "darwin") {
        /*  run Electron-Builder to package the application  */
        console.log("++ packaging App as an Electron distribution for macOS platform")
        execa.sync(electronbuilder, [ "--mac", `--${os.arch()}` ],
            { stdin: "inherit", stdout: "inherit", stderr: "inherit" })

        /*  pack application into a distribution archive
            (notice: under macOS the ZIP DOES automatically use a top-level directory)  */
        console.log("++ packing App into ZIP distribution archive")
        shell.mv("dist/mac/LiVE-Receiver.app", "dist/LiVE-Receiver.app")
        zip.zipSync(
            path.join(__dirname, "dist/LiVE-Receiver.app"),
            path.join(__dirname, `dist/LiVE-Receiver-mac-${arch2}.zip`))
        await sign(`dist/LiVE-Receiver-mac-${arch2}.zip`)
    }
    else if (os.platform() === "linux") {
        /*  run Electron-Builder to package the application  */
        console.log("++ packaging App as an Electron distribution for Linux platform")
        execa.sync(electronbuilder, [ "--linux", `--${os.arch()}` ],
            { stdin: "inherit", stdout: "inherit", stderr: "inherit" })

        /*  pack application into a distribution archive  */
        console.log("++ packing App into ZIP distribution archive")
        shell.mv("dist/LiVE-Receiver-*.AppImage", "dist/LiVE-Receiver")
        zip.zipSync(
            path.join(__dirname, "dist/LiVE-Receiver"),
            path.join(__dirname, `dist/LiVE-Receiver-lnx-${arch2}.zip`))
        await sign(`dist/LiVE-Receiver-lnx-${arch2}.zip`)
    }
})().catch((err) => {
    console.log(`** package: ERROR: ${err}`)
})

