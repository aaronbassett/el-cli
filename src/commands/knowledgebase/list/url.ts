import { Args, Command, Flags } from '@oclif/core';
import { getElevenLabsApiKey } from '../../../utils/elevenlabs.js';

type Document = {
  id: string
  name: string
  type: string
  url: string
}

export default class KnowledgebaseListUrl extends Command {
  static override aliases = ['kb:create:text']
  public static enableJsonFlag = true
  static override args = {
    url: Args.string({description: 'url to search for in the knowledge base', required: false}),
  }
  static override description = 'Search the knowledge base for the supplied url'
  static override examples = [
    '<%= config.bin %> <%= command.id %> "https://www.example.com"',
  ]
  static override flags = {
    name: Flags.string({char: 'n', description: 'optional name to filter the results by', required: false}),
  }

  private async getAllDocuments({elevenLabsApiKey}: {elevenLabsApiKey: string}): Promise<Document[]> {
    // !NOTE: Endpoint 500s when sending cursor qs param, so we'e limited to only deleting 100 docs at a time.
    const response = await fetch("https://api.elevenlabs.io/v1/convai/knowledge-base?page_size=100", {
      method: "GET",
      headers: {
        "xi-api-key": elevenLabsApiKey,
      },
    });

    const body = await response.json()
    if (response.ok) {
      return body.documents.map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        url: doc.url,
      }))
    } else {
      this.error(JSON.stringify(body), { exit: 1 })
    }
  }

  public async run(): Promise<{ count: number, url: string | undefined, name: string | undefined, documents: Document[] }> {
    const {args, flags} = await this.parse(KnowledgebaseListUrl)

    if (!args.url && !flags.name) {
      this.error('Either a url or name must be provided', { exit: 1 })
    }

    const elevenLabsApiKey = getElevenLabsApiKey(this.config.configDir)

    if (!elevenLabsApiKey) {
      this.error('ElevenLabs API key not found.`', { exit: 1 })
    }

    const allDocuments = await this.getAllDocuments({elevenLabsApiKey})
    let filteredDocuments = allDocuments.filter(doc => doc.type === 'url')

    if(args.url) {
      filteredDocuments = filteredDocuments.filter(doc => doc.url === args.url)
    }

    if(flags.name) {
      filteredDocuments = filteredDocuments.filter(doc => doc.name === flags.name)
    }

    this.log(`Found ${filteredDocuments.length} documents`)
    return {
      count: filteredDocuments.length,
      url: args.url,
      name: flags.name,
      documents: filteredDocuments,
    }
  }
}
