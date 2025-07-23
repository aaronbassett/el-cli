import { Args, Command, Flags } from '@oclif/core';
import { getElevenLabsApiKey } from '../../../utils/elevenlabs.js';

export default class KnowledgebaseCreateText extends Command {
  static override aliases = ['kb:create:text']
  public static enableJsonFlag = true
  static override args = {
    text: Args.string({description: 'text to create a knowledge base document from', required: true}),
  }
  static override description = 'Create a knowledge base document from the supplied text'
  static override examples = [
    '<%= config.bin %> <%= command.id %> "This is a test"',
  ]
  static override flags = {
    name: Flags.string({char: 'n', description: 'optional name for the knowledge base document', required: false}),
  }

  public async run(): Promise<{ name: string, id: string }> {
    const {args, flags} = await this.parse(KnowledgebaseCreateText)

    const elevenLabsApiKey = getElevenLabsApiKey(this.config.configDir)

    if (!elevenLabsApiKey) {
      this.error('ElevenLabs API key not found.`', { exit: 1 })
    }

    const response = await fetch("https://api.elevenlabs.io/v1/convai/knowledge-base/text", {
      method: "POST",
      headers: {
        "xi-api-key": elevenLabsApiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "text": args.text,
        "name": flags.name
      }),
    });
    const body = await response.json();
    if (response.ok) {
      this.log(`Knowledge base document created: ${body.name} (${body.id})`)
      return { name: body.name, id: body.id }
    } else {
      this.error(JSON.stringify(body), { exit: 1 })
    }
  }
}
