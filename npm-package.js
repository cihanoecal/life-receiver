/*
**  Live Video Experience (LiVE)
**  Copyright (c) 2020 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

/*  external requirements  */
const os    = require("os")
const path  = require("path")
const glob  = require("glob")
const shell = require("shelljs")
const execa = require("execa")
const zip   = require("cross-zip")

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

    /*   package according to platform...  */
    const electronbuilder = path.resolve(path.join("node_modules", ".bin", "electron-builder"))
    if (os.platform() === "win32") {
        /*  run Electron-Builder to package the application  */
        console.log("++ packaging App as an Electron distribution for Windows platform")
        execa.sync(electronbuilder, [],
            { stdin: "inherit", stdout: "inherit", stderr: "inherit" })

        /*  pack application into a distribution archive
            (notice: under macOS the ZIP does NOT automatically use a top-level directory)  */
        console.log("++ packing App into ZIP distribution archive")
        zip.zipSync(
            path.join(__dirname, "dist/LiVE-Receiver.exe"),
            path.join(__dirname, "dist/LiVE-Receiver-win-x64.zip")
        )
    }
    else if (os.platform() === "darwin") {
        /*  run Electron-Builder to package the application  */
        console.log("++ packaging App as an Electron distribution for macOS platform")
        execa.sync(electronbuilder, [ "--dir" ],
            { stdin: "inherit", stdout: "inherit", stderr: "inherit" })

        /*  pack application into a distribution archive
            (notice: under macOS the ZIP DOES automatically use a top-level directory)  */
        console.log("++ packing App into ZIP distribution archive")
        shell.mv("dist/mac/LiVE-Receiver.app", "dist/LiVE-Receiver.app")
        zip.zipSync(
            path.join(__dirname, "dist/LiVE-Receiver.app"),
            path.join(__dirname, "dist/LiVE-Receiver-mac-x64.zip")
        )
    }
})().catch((err) => {
    console.log(`** package: ERROR: ${err}`)
})

