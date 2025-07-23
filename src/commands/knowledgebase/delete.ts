import { checkbox } from '@inquirer/prompts';
import { Args, Command, Flags } from '@oclif/core';
import * as R from "remeda";
import { getElevenLabsApiKey } from '../../utils/elevenlabs.js';

type Document = {
  id: string
  name: string
  type: string
  isCreator: boolean
  hasDependentAgents: boolean
}

export default class KnowledgebaseDelete extends Command {
  static override aliases = ['kb:del']
  public static enableJsonFlag = true
  static override args = {
    idCsv: Args.string({description: 'comma separated list of ids of the knowledge base documents to delete', required: false}),
  }
  static override description = 'Delete knowledge base documents'
  static override examples = [
    '<%= config.bin %> <%= command.id %> "LZ3PBN,U1CbRY,jUJmvZ"',
    '<%= config.bin %> <%= command.id %> --name-includes "test"',
    {
      description: 'Be careful with --name-includes, it is simple sub-string match and suffers from the Scunthorpe problem.',
      command: '<%= config.bin %> <%= command.id %> --name-includes "test" --name-excludes "testimonial"',
    },
    {
      description: 'Delete all documents belonging to the current user without confirmation',
      command: '<%= config.bin %> <%= command.id %> -Ayo',
    },
    {
      description: 'Delete all documents belonging to the current user without confirmation, even if they have dependent agents',
      command: '<%= config.bin %> <%= command.id %> -Ayo --ignore-dependent-agents',
    },
    {
      description: 'Do not stop if a document fails to delete, continue onto the next document',
      command: '<%= config.bin %> <%= command.id %> --continue-on-error "LZ3PBN,U1CbRY,jUJmvZ"',
    },
    {
      description: 'Delete documents of type url or text with matching ids',
      command: '<%= config.bin %> <%= command.id %> --type url text -- "LZ3PBN,U1CbRY,jUJmvZ"',
    },
  ]
  static override flags = {
    all: Flags.boolean({char: 'A', description: 'delete all documents'}),
    "yes-confirm": Flags.boolean({char: 'y', description: 'skip additional confirmation'}),
    "name-includes": Flags.string({char: 'I', description: 'delete documents that contain this string in the name'}),
    "name-excludes": Flags.string({char: 'E', description: 'delete documents that do not contain this string in the name'}),
    "include-partial": Flags.boolean({char: 'p', description: 'include partial id matches'}),
    "continue-on-error": Flags.boolean({char: 'c', description: 'continue deleting next document on error'}),
    type: Flags.string({char: 't', description: 'type of document to delete', options: ['text', 'file', 'url'], multiple: true}),
    "only-owned": Flags.boolean({char: 'o', description: 'delete only documents owned by the current user'}),
    "ignore-dependent-agents": Flags.boolean({description: 'delete documents even if they have dependent agents'}),
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
        isCreator: doc.access_info.is_creator,
        hasDependentAgents: doc.dependent_agents.length > 0,
      }))
    } else {
      this.error(JSON.stringify(body), { exit: 1 })
    }
  }

  public async run(): Promise<{ deletedCount: number, failedCount: number }> {
    const {args, flags} = await this.parse(KnowledgebaseDelete)
    const elevenLabsApiKey = getElevenLabsApiKey(this.config.configDir)
    if (!elevenLabsApiKey) {
      this.error('ElevenLabs API key not found.`', { exit: 1 })
    }

    let ids = args.idCsv?.split(',') ?? []
    const allDocuments = await this.getAllDocuments({elevenLabsApiKey})
    let filteredDocuments: Document[] = []

    /*
    * Why do we always get all documents? For a few reasons.
    * 1. The KB list endpoint does have a search param, but:
    *   - It can only search by name starts with.
    *   - It ignores it anyway…
    * 2. The get document endpoint doesn't return the dependent agents
    */

    if(flags.all) {
        // If all is set we ignore the other filters and just get all docs.
        filteredDocuments = allDocuments
    } else {
      filteredDocuments = flags['include-partial'] ? allDocuments.filter(doc => ids.some(id => doc.id.includes(id))) : filteredDocuments = allDocuments.filter(doc => ids.includes(doc.id))

      if(flags["name-includes"]) {
        filteredDocuments = R.concat(filteredDocuments, allDocuments.filter(doc => doc.name.includes(flags["name-includes"] ?? "")))
      }

      if(flags["name-excludes"]) {
        filteredDocuments = R.concat(filteredDocuments, allDocuments.filter(doc => !doc.name.includes(flags["name-excludes"] ?? "")))
      }
    }

    // We still apply the type and only-owned filters even if we're not getting all docs.
    if(flags.type) {
      filteredDocuments = filteredDocuments.filter(doc => flags.type?.includes(doc.type))
    }

    if(flags['only-owned']) {
      filteredDocuments = filteredDocuments.filter(doc => doc.isCreator)
    }

    // No docs to delete, exit with code 0.
    if(filteredDocuments.length === 0) {
      this.log('No documents found to delete')
      return { deletedCount: 0, failedCount: 0 }
    }

    if(!flags["yes-confirm"]) {
      const confirmed = await checkbox({
        message: `Found ${filteredDocuments.length} documents. Confirm those you want to delete`,
        choices: filteredDocuments.map(doc => ({
          name: doc.name,
          value: doc.id,
          checked: true,
        })),
      })

      if(confirmed.length === 0) {
        this.log('No documents selected')
        return { deletedCount: 0, failedCount: 0 }
      }

      filteredDocuments = filteredDocuments.filter(doc => confirmed.includes(doc.id))
    }

    // Do any of the selected docs have dependent agents?
    const hasDependentAgents = filteredDocuments.filter(doc => doc.hasDependentAgents)
    if(hasDependentAgents.length > 0 && !flags["ignore-dependent-agents"]) {
      const confirmedWithDependentAgents = await checkbox({
        message: `The following documents have dependent agents. Are you sure you want to delete them?`,
        choices: hasDependentAgents.map(doc => ({
          name: doc.name,
          value: doc.id,
          checked: true,
        })),
      })
      filteredDocuments = filteredDocuments.filter(doc => !doc.hasDependentAgents || confirmedWithDependentAgents.includes(doc.id))
    }

    // No docs to delete, exit with code 0.
    if(filteredDocuments.length === 0) {
      this.log('No documents found to delete')
      return { deletedCount: 0, failedCount: 0 }
    }

    // We can finally start deleting the docs.
    let deletedCount = 0
    let failedCount = 0

    for(const doc of filteredDocuments) {
      const response = await fetch(`https://api.elevenlabs.io/v1/convai/knowledge-base/${doc.id}?force=true`, {
        method: "DELETE",
        headers: {
          "xi-api-key": elevenLabsApiKey,
        },
      })

      if(response.ok) {
        deletedCount++
      } else {
        if(!flags["continue-on-error"]) {
          this.error(`Failed to delete document ${doc.id}`, { exit: 1 })
        }
        failedCount++
      }
    }

    this.log(`Deleted ${deletedCount} documents`)
    this.log(`Failed to delete ${failedCount} documents`)
    return { deletedCount, failedCount }
  }
}
