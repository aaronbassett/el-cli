el
=================

CLI Wrapper around the Elevenlabs API


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/el.svg)](https://npmjs.org/package/el)
[![Downloads/week](https://img.shields.io/npm/dw/el.svg)](https://npmjs.org/package/el)

![Screencast](./el-demo.gif)


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
el/0.0.1 darwin-arm64 node-v23.10.0
$ el --help [COMMAND]
USAGE
  $ el COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`el autocomplete [SHELL]`](#el-autocomplete-shell)
* [`el commands`](#el-commands)
* [`el help [COMMAND]`](#el-help-command)
* [`el kb backup`](#el-kb-backup)
* [`el kb create file [FILE]`](#el-kb-create-file-file)
* [`el kb create text TEXT`](#el-kb-create-text-text)
* [`el kb del [IDCSV]`](#el-kb-del-idcsv)
* [`el knowledgebase backup`](#el-knowledgebase-backup)
* [`el knowledgebase create file [FILE]`](#el-knowledgebase-create-file-file)
* [`el knowledgebase create text TEXT`](#el-knowledgebase-create-text-text)
* [`el knowledgebase create url URL`](#el-knowledgebase-create-url-url)
* [`el knowledgebase delete [IDCSV]`](#el-knowledgebase-delete-idcsv)
* [`el knowledgebase list url [URL]`](#el-knowledgebase-list-url-url)
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
* [`el user config`](#el-user-config)
* [`el version`](#el-version)

## `el autocomplete [SHELL]`

Display autocomplete installation instructions.

```
USAGE
  $ el autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ el autocomplete

  $ el autocomplete bash

  $ el autocomplete zsh

  $ el autocomplete powershell

  $ el autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.2.33/src/commands/autocomplete/index.ts)_

## `el commands`

List all el commands.

```
USAGE
  $ el commands [--json] [-c id|plugin|summary|type... | --tree] [--deprecated] [-x | ] [--hidden]
    [--no-truncate | ] [--sort id|plugin|summary|type | ]

FLAGS
  -c, --columns=<option>...  Only show provided columns (comma-separated).
                             <options: id|plugin|summary|type>
  -x, --extended             Show extra columns.
      --deprecated           Show deprecated commands.
      --hidden               Show hidden commands.
      --no-truncate          Do not truncate output.
      --sort=<option>        [default: id] Property to sort by.
                             <options: id|plugin|summary|type>
      --tree                 Show tree of commands.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all el commands.
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v4.1.29/src/commands/commands.ts)_

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

## `el kb backup`

Backup all knowledge base documents to a local directory

```
USAGE
  $ el kb backup [--json] [-o <value>] [-M] [--no-index] [--date-format <value>] [-n <value>] [-e
    replace|keep-both|skip|error] [-d <value>] [-m <value>]

FLAGS
  -M, --merge                  merge all documents into a single file
  -d, --delay=<value>          [default: 500] delay between API requests in milliseconds
  -e, --file-exists=<option>   [default: keep-both] action to take if the file already exists.
                               <options: replace|keep-both|skip|error>
  -m, --max-documents=<value>  [default: 50] maximum number of documents to fetch
  -n, --name=<value>           [default: {{id}}] document filename template. Available variables: {{id}} {{name}}
                               {{type}}
  -o, --output-dir=<value>     output directory to save the documents to
      --date-format=<value>    [default: yyyy-MM-dd] date format to use for the output directory. Uses date-fns. Set to
                               "0" to disable
      --no-index               do not create an index file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Backup all knowledge base documents to a local directory

ALIASES
  $ el kb backup

EXAMPLES
  Backup all knowledge base documents to current directory

    $ el kb backup

  Backup all knowledge base documents to a custom directory

    $ el kb backup --output-dir ./knowledgebase-backup

  Use document name as filename

    $ el kb backup --name "{{name}}"

  Replace documents with the same name

    $ el kb backup --file-exists replace

  Error if documents with the same name

    $ el kb backup --file-exists error

  Don't create an index file

    $ el kb backup --no-index

  Merge all documents into a single file

    $ el kb backup --merge

  Hammer their API (this is mean, don't do it)

    $ el kb backup --delay 0
```

## `el kb create file [FILE]`

Create a knowledge base document from the supplied file

```
USAGE
  $ el kb create file [FILE] [--json] [-n <value>] [--base-path <value>]

ARGUMENTS
  FILE  file to create a knowledge base document from

FLAGS
  -n, --name=<value>       optional name for the knowledge base document
      --base-path=<value>  base path to start the file selector from

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a knowledge base document from the supplied file

ALIASES
  $ el kb create file

EXAMPLES
  $ el kb create file "./test.pdf"

  If not file is supplied, you will be prompted to select a file

    $ el kb create file
```

## `el kb create text TEXT`

Create a knowledge base document from the supplied text

```
USAGE
  $ el kb create text TEXT [--json] [-n <value>]

ARGUMENTS
  TEXT  text to create a knowledge base document from

FLAGS
  -n, --name=<value>  optional name for the knowledge base document

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a knowledge base document from the supplied text

ALIASES
  $ el kb create text

EXAMPLES
  $ el kb create text "This is a test"
```

## `el kb del [IDCSV]`

Delete knowledge base documents

```
USAGE
  $ el kb del [IDCSV] [--json] [-A] [-y] [-I <value>] [-E <value>] [-p] [-c] [-t text|file|url...] [-o]
    [--ignore-dependent-agents]

ARGUMENTS
  IDCSV  comma separated list of ids of the knowledge base documents to delete

FLAGS
  -A, --all                      delete all documents
  -E, --name-excludes=<value>    delete documents that do not contain this string in the name
  -I, --name-includes=<value>    delete documents that contain this string in the name
  -c, --continue-on-error        continue deleting next document on error
  -o, --only-owned               delete only documents owned by the current user
  -p, --include-partial          include partial id matches
  -t, --type=<option>...         type of document to delete
                                 <options: text|file|url>
  -y, --yes-confirm              skip additional confirmation
      --ignore-dependent-agents  delete documents even if they have dependent agents

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete knowledge base documents

ALIASES
  $ el kb del

EXAMPLES
  $ el kb del "LZ3PBN,U1CbRY,jUJmvZ"

  $ el kb del --name-includes "test"

  Be careful with --name-includes, it is simple sub-string match and suffers from the Scunthorpe problem.

    $ el kb del --name-includes "test" --name-excludes "testimonial"

  Delete all documents belonging to the current user without confirmation

    $ el kb del -Ayo

  Delete all documents belonging to the current user without confirmation, even if they have dependent agents

    $ el kb del -Ayo --ignore-dependent-agents

  Do not stop if a document fails to delete, continue onto the next document

    $ el kb del --continue-on-error "LZ3PBN,U1CbRY,jUJmvZ"

  Delete documents of type url or text with matching ids

    $ el kb del --type url text -- "LZ3PBN,U1CbRY,jUJmvZ"
```

## `el knowledgebase backup`

Backup all knowledge base documents to a local directory

```
USAGE
  $ el knowledgebase backup [--json] [-o <value>] [-M] [--no-index] [--date-format <value>] [-n <value>] [-e
    replace|keep-both|skip|error] [-d <value>] [-m <value>]

FLAGS
  -M, --merge                  merge all documents into a single file
  -d, --delay=<value>          [default: 500] delay between API requests in milliseconds
  -e, --file-exists=<option>   [default: keep-both] action to take if the file already exists.
                               <options: replace|keep-both|skip|error>
  -m, --max-documents=<value>  [default: 50] maximum number of documents to fetch
  -n, --name=<value>           [default: {{id}}] document filename template. Available variables: {{id}} {{name}}
                               {{type}}
  -o, --output-dir=<value>     output directory to save the documents to
      --date-format=<value>    [default: yyyy-MM-dd] date format to use for the output directory. Uses date-fns. Set to
                               "0" to disable
      --no-index               do not create an index file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Backup all knowledge base documents to a local directory

ALIASES
  $ el kb backup

EXAMPLES
  Backup all knowledge base documents to current directory

    $ el knowledgebase backup

  Backup all knowledge base documents to a custom directory

    $ el knowledgebase backup --output-dir ./knowledgebase-backup

  Use document name as filename

    $ el knowledgebase backup --name "{{name}}"

  Replace documents with the same name

    $ el knowledgebase backup --file-exists replace

  Error if documents with the same name

    $ el knowledgebase backup --file-exists error

  Don't create an index file

    $ el knowledgebase backup --no-index

  Merge all documents into a single file

    $ el knowledgebase backup --merge

  Hammer their API (this is mean, don't do it)

    $ el knowledgebase backup --delay 0
```

_See code: [src/commands/knowledgebase/backup.ts](https://github.com/aaronbassett/el-cli/blob/v0.0.1/src/commands/knowledgebase/backup.ts)_

## `el knowledgebase create file [FILE]`

Create a knowledge base document from the supplied file

```
USAGE
  $ el knowledgebase create file [FILE] [--json] [-n <value>] [--base-path <value>]

ARGUMENTS
  FILE  file to create a knowledge base document from

FLAGS
  -n, --name=<value>       optional name for the knowledge base document
      --base-path=<value>  base path to start the file selector from

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a knowledge base document from the supplied file

ALIASES
  $ el kb create file

EXAMPLES
  $ el knowledgebase create file "./test.pdf"

  If not file is supplied, you will be prompted to select a file

    $ el knowledgebase create file
```

_See code: [src/commands/knowledgebase/create/file.ts](https://github.com/aaronbassett/el-cli/blob/v0.0.1/src/commands/knowledgebase/create/file.ts)_

## `el knowledgebase create text TEXT`

Create a knowledge base document from the supplied text

```
USAGE
  $ el knowledgebase create text TEXT [--json] [-n <value>]

ARGUMENTS
  TEXT  text to create a knowledge base document from

FLAGS
  -n, --name=<value>  optional name for the knowledge base document

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a knowledge base document from the supplied text

ALIASES
  $ el kb create text

EXAMPLES
  $ el knowledgebase create text "This is a test"
```

_See code: [src/commands/knowledgebase/create/text.ts](https://github.com/aaronbassett/el-cli/blob/v0.0.1/src/commands/knowledgebase/create/text.ts)_

## `el knowledgebase create url URL`

Create a knowledge base document from the supplied url

```
USAGE
  $ el knowledgebase create url URL [--json] [-n <value>]

ARGUMENTS
  URL  url to create a knowledge base document from

FLAGS
  -n, --name=<value>  optional name for the knowledge base document

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a knowledge base document from the supplied url

ALIASES
  $ el kb create text

EXAMPLES
  $ el knowledgebase create url "https://www.example.com"
```

_See code: [src/commands/knowledgebase/create/url.ts](https://github.com/aaronbassett/el-cli/blob/v0.0.1/src/commands/knowledgebase/create/url.ts)_

## `el knowledgebase delete [IDCSV]`

Delete knowledge base documents

```
USAGE
  $ el knowledgebase delete [IDCSV] [--json] [-A] [-y] [-I <value>] [-E <value>] [-p] [-c] [-t text|file|url...] [-o]
    [--ignore-dependent-agents]

ARGUMENTS
  IDCSV  comma separated list of ids of the knowledge base documents to delete

FLAGS
  -A, --all                      delete all documents
  -E, --name-excludes=<value>    delete documents that do not contain this string in the name
  -I, --name-includes=<value>    delete documents that contain this string in the name
  -c, --continue-on-error        continue deleting next document on error
  -o, --only-owned               delete only documents owned by the current user
  -p, --include-partial          include partial id matches
  -t, --type=<option>...         type of document to delete
                                 <options: text|file|url>
  -y, --yes-confirm              skip additional confirmation
      --ignore-dependent-agents  delete documents even if they have dependent agents

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete knowledge base documents

ALIASES
  $ el kb del

EXAMPLES
  $ el knowledgebase delete "LZ3PBN,U1CbRY,jUJmvZ"

  $ el knowledgebase delete --name-includes "test"

  Be careful with --name-includes, it is simple sub-string match and suffers from the Scunthorpe problem.

    $ el knowledgebase delete --name-includes "test" --name-excludes "testimonial"

  Delete all documents belonging to the current user without confirmation

    $ el knowledgebase delete -Ayo

  Delete all documents belonging to the current user without confirmation, even if they have dependent agents

    $ el knowledgebase delete -Ayo --ignore-dependent-agents

  Do not stop if a document fails to delete, continue onto the next document

    $ el knowledgebase delete --continue-on-error "LZ3PBN,U1CbRY,jUJmvZ"

  Delete documents of type url or text with matching ids

    $ el knowledgebase delete --type url text -- "LZ3PBN,U1CbRY,jUJmvZ"
```

_See code: [src/commands/knowledgebase/delete.ts](https://github.com/aaronbassett/el-cli/blob/v0.0.1/src/commands/knowledgebase/delete.ts)_

## `el knowledgebase list url [URL]`

Search the knowledge base for the supplied url

```
USAGE
  $ el knowledgebase list url [URL] [--json] [-n <value>]

ARGUMENTS
  URL  url to search for in the knowledge base

FLAGS
  -n, --name=<value>  optional name to filter the results by

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Search the knowledge base for the supplied url

ALIASES
  $ el kb create text

EXAMPLES
  $ el knowledgebase list url "https://www.example.com"
```

_See code: [src/commands/knowledgebase/list/url.ts](https://github.com/aaronbassett/el-cli/blob/v0.0.1/src/commands/knowledgebase/list/url.ts)_

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

## `el user config`

Manage user configuration file

```
USAGE
  $ el user config [-c] [-f] [-e <value>] [-d]

FLAGS
  -c, --create-new      Create a new configuration file
  -d, --open-directory  Open the configuration directory
  -e, --editor=<value>  Open config file with specified editor
  -f, --force           Force overwrite existing configuration file

DESCRIPTION
  Manage user configuration file

EXAMPLES
  $ el user config

  $ el user config --create-new

  $ el user config --editor cursor

  $ el user config --open-directory
```

_See code: [src/commands/user/config.ts](https://github.com/aaronbassett/el-cli/blob/v0.0.1/src/commands/user/config.ts)_

## `el version`

```
USAGE
  $ el version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v2.2.31/src/commands/version.ts)_
<!-- commandsstop -->
