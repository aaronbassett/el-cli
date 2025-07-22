el
=================

CLI Wrapper around the Elevenlabs API


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/el.svg)](https://npmjs.org/package/el)
[![Downloads/week](https://img.shields.io/npm/dw/el.svg)](https://npmjs.org/package/el)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g el
$ el COMMAND
running command...
$ el (--version)
el/0.0.0 darwin-arm64 node-v23.10.0
$ el --help [COMMAND]
USAGE
  $ el COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`el hello PERSON`](#el-hello-person)
* [`el hello world`](#el-hello-world)
* [`el help [COMMAND]`](#el-help-command)
* [`el plugins`](#el-plugins)
* [`el plugins add PLUGIN`](#el-plugins-add-plugin)
* [`el plugins:inspect PLUGIN...`](#el-pluginsinspect-plugin)
* [`el plugins install PLUGIN`](#el-plugins-install-plugin)
* [`el plugins link PATH`](#el-plugins-link-path)
* [`el plugins remove [PLUGIN]`](#el-plugins-remove-plugin)
* [`el plugins reset`](#el-plugins-reset)
* [`el plugins uninstall [PLUGIN]`](#el-plugins-uninstall-plugin)
* [`el plugins unlink [PLUGIN]`](#el-plugins-unlink-plugin)
* [`el plugins update`](#el-plugins-update)

## `el hello PERSON`

Say hello

```
USAGE
  $ el hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ el hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/aaronbassett/el-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `el hello world`

Say hello world

```
USAGE
  $ el hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ el hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/aaronbassett/el-cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `el help [COMMAND]`

Display help for el.

```
USAGE
  $ el help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for el.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.31/src/commands/help.ts)_

## `el plugins`

List installed plugins.

```
USAGE
  $ el plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ el plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.45/src/commands/plugins/index.ts)_

## `el plugins add PLUGIN`

Installs a plugin into el.

```
USAGE
  $ el plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into el.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the EL_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the EL_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ el plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ el plugins add myplugin

  Install a plugin from a github url.

    $ el plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ el plugins add someuser/someplugin
```

## `el plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ el plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ el plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.45/src/commands/plugins/inspect.ts)_

## `el plugins install PLUGIN`

Installs a plugin into el.

```
USAGE
  $ el plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into el.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the EL_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the EL_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ el plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ el plugins install myplugin

  Install a plugin from a github url.

    $ el plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ el plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.45/src/commands/plugins/install.ts)_

## `el plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ el plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ el plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.45/src/commands/plugins/link.ts)_

## `el plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ el plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ el plugins unlink
  $ el plugins remove

EXAMPLES
  $ el plugins remove myplugin
```

## `el plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ el plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.45/src/commands/plugins/reset.ts)_

## `el plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ el plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ el plugins unlink
  $ el plugins remove

EXAMPLES
  $ el plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.45/src/commands/plugins/uninstall.ts)_

## `el plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ el plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ el plugins unlink
  $ el plugins remove

EXAMPLES
  $ el plugins unlink myplugin
```

## `el plugins update`

Update installed plugins.

```
USAGE
  $ el plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.45/src/commands/plugins/update.ts)_
<!-- commandsstop -->
