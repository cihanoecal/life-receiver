##
##  Live Free Video Experience (LiFE)
##  Copyright (c) 2022 Cihan Öcal <mailto:cihanoecal@tuta.io>
##  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
##

SHELL = bash

PACKAGE = \
	npx --yes shx rm -rf dist node_modules && \
	npm install && \
	npm run package

all:

package-win:
	/c/Windows/System32/cmd.exe /c "$(PACKAGE)"
package-mac:
	$(PACKAGE)
package-lnx:
	$(PACKAGE)

