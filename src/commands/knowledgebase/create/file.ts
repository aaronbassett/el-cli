import { Args, Command, Flags } from '@oclif/core';
import * as fs from 'fs';
import fileSelector from 'inquirer-file-selector';
import mime from 'mime';
import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import { getElevenLabsApiKey } from '../../../utils/elevenlabs.js';

export default class KnowledgebaseCreateFile extends Command {
  static override aliases = ['kb:create:file']
  public static enableJsonFlag = true
  static override args = {
    file: Args.string({description: 'file to create a knowledge base document from', required: false}),
  }
  static override description = 'Create a knowledge base document from the supplied file'
  static override examples = [
    '<%= config.bin %> <%= command.id %> "./test.pdf"',
    {
      description: 'If not file is supplied, you will be prompted to select a file',
      command: '<%= config.bin %> <%= command.id %>',
    }
  ]
  static override flags = {
    name: Flags.string({char: 'n', description: 'optional name for the knowledge base document'}),
    "base-path": Flags.string({description: 'base path to start the file selector from'}),
  }

  private errorMessage = (filePath: string) => {
    if(filePath === '') {
      return 'No file selected'
    } else {
      return `File ${filePath} does not exist`
    }
  }

  private hasValidFileExtension = (name: string) => {
    return name.endsWith('.pdf') || name.endsWith('.txt') || name.endsWith('.epub') || name.endsWith('.docx') || name.endsWith('.html')
  }

  public async run(): Promise<{ name: string, id: string }> {
    const {args, flags} = await this.parse(KnowledgebaseCreateFile)

    const elevenLabsApiKey = getElevenLabsApiKey(this.config.configDir)

    if (!elevenLabsApiKey) {
      this.error('ElevenLabs API key not found.`', { exit: 1 })
    }

    let filePath = args.file;

    if(!filePath) {
      const selectedFile = await fileSelector({
        message: 'Select a file to create a knowledge base document from',
        filter: (item) => this.hasValidFileExtension(item.name),
        type: 'file',
        allowCancel: true,
        basePath: flags["base-path"],
      });
      filePath = selectedFile === 'canceled' ? '' : selectedFile;
    }

    if(!fs.existsSync(filePath)) {
      this.error(this.errorMessage(filePath), { exit: 1 })
    }

    if(!this.hasValidFileExtension(filePath)) {
      this.error('Invalid file type, must be one of: pdf, txt, epub, docx, html', { exit: 1 })
    }

    const fileData = await readFile(filePath);
    const fileType = mime.getType(extname(filePath)) ?? undefined;
    const doc = new File([fileData], basename(filePath), { type: fileType });

    const form = new FormData();
    form.append("file", doc);

    if(flags.name) {
      form.append("name", flags.name);
    }

    const response = await fetch("https://api.elevenlabs.io/v1/convai/knowledge-base/file", {
      method: "POST",
      headers: {
        "xi-api-key": elevenLabsApiKey,
      },
      body: form,
    });
    const responseBody = await response.json();
    if (response.ok) {
      this.log(`Knowledge base document created: ${responseBody.name} (${responseBody.id})`)
      return { name: responseBody.name, id: responseBody.id }
    } else {
      this.error(JSON.stringify(responseBody), { exit: 1 })
    }
  }
}
