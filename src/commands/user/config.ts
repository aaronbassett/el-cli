import { Command, Flags } from '@oclif/core';
import * as fs from 'fs';
import { spawn } from 'node:child_process';
import open from 'open';
import * as path from 'path';

export default class UserConfig extends Command {
  static override description = 'Manage user configuration file'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --create-new',
    '<%= config.bin %> <%= command.id %> --editor cursor',
    '<%= config.bin %> <%= command.id %> --open-directory',
  ]
  static override flags = {
    // Create new config file
    'create-new': Flags.boolean({
      char: 'c',
      aliases: ['new'],
      description: 'Create a new configuration file',
    }),
    // Force overwrite existing config
    force: Flags.boolean({
      char: 'f',
      description: 'Force overwrite existing configuration file',
    }),
    // Open with specific editor
    editor: Flags.string({
      char: 'e',
      description: 'Open config file with specified editor',
    }),
    // Open config directory
    'open-directory': Flags.boolean({
      char: 'd',
      aliases: ['dir'],
      description: 'Open the configuration directory',
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(UserConfig)
    
    const configDir = this.config.configDir
    const configPath = path.join(configDir, 'config.json')
    
    // Ensure config directory exists
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }
    
    const configExists = fs.existsSync(configPath)
    
    // Handle config file creation logic
    if (flags['create-new']) {
      if (configExists && !flags.force) {
        this.error('User config already exists. Use --force to overwrite it.', { exit: 1 })
      }
      
      // Create placeholder config
      const placeholderConfig = {
        version: '0.0.1',
        elevenLabsApiKey: 'Your ElevenLabs API Key',
      }
      
      fs.writeFileSync(configPath, JSON.stringify(placeholderConfig, null, 2))
      this.log(`Configuration file created at: ${configPath}`)
    } else if (!configExists) {
      this.error('User config does not exist. Create it with --create-new flag.', { exit: 1 })
    }
    
    // Handle opening operations
    if (flags.editor) {
      // Open with specified editor
      const editor = spawn(flags.editor, [configPath], { 
        stdio: 'inherit',
        detached: true 
      })
      editor.on('error', (err: Error) => this.error(err.message))
    } else {
      await open(configPath)
    }
    
    if (flags['open-directory']) {
      // Open config directory
      await open(configDir)
    }
  }
}
