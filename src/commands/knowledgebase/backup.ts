import { Command, Flags } from '@oclif/core';
import { MultiBar, Presets, SingleBar } from "cli-progress";
import { format, formatDistanceToNow } from "date-fns";
import filenamify from 'filenamify';
import * as fs from "fs";
import { format as stringFormat } from 'node:util';
import path from 'path';
import * as R from "remeda";
import { match, P } from 'ts-pattern';
import Table from 'tty-table';
import colors from 'yoctocolors';
import { getElevenLabsApiKey } from '../../utils/elevenlabs.js';
import { linkPath } from '../../utils/format.js';
import { getDocumentList } from '../../utils/knowledgebase.js';

const documentTypes = ["text", "file", "url"] as const
type DocumentTypes = (typeof documentTypes)[number]

type Document = {
  id: string,
  name: string,
  metadata: {
    created_at_unix_secs: number,
    last_updated_at_unix_secs: number,
    size_bytes: number
  },
  supported_usages: string[],
  access_info: {
    is_creator: boolean,
    creator_name: string,
    creator_email: string,
    role: string
  },
  dependent_agents: string[],
  type: DocumentTypes
  url?: string
  extracted_inner_html?: string
}

type Stats = {
  numberOfDocuments: number,
  totalSizeBytes: number,
  averageSizeBytes: number,
  totalCharacters: number,
  averageCharacters: number,
  approxTotalTokens: number,
  approxAverageTokens: number,
  averageDocumentAge: number,
  lastUpdatedAt: number,
}

type DocumentStats = {
  [key in DocumentTypes | "combined"]: Stats
}

type DocumentIndex = {
  documents: Document[],
  stats: DocumentStats,
  fetched: number,
  failed: number
}

type FileExistsPreference = "replace" | "keep-both" | "skip" | "error"

export default class KnowledgebaseBackup extends Command {
  static override aliases = ['kb:backup']
  public static enableJsonFlag = true
  static override description = 'Backup all knowledge base documents to a local directory'
  static override examples = [
    {
      description: 'Backup all knowledge base documents to current directory',
      command: '<%= config.bin %> <%= command.id %>',
    },
    {
      description: 'Backup all knowledge base documents to a custom directory',
      command: '<%= config.bin %> <%= command.id %> --output-dir ./knowledgebase-backup',
    },
    {
      description: 'Use document name as filename',
      command: '<%= config.bin %> <%= command.id %> --name "{{name}}"',
    },
    {
      description: 'Replace documents with the same name',
      command: '<%= config.bin %> <%= command.id %> --file-exists replace',
    },
    {
      description: 'Error if documents with the same name',
      command: '<%= config.bin %> <%= command.id %> --file-exists error',
    },
    {
      description: 'Don\'t create an index file',
      command: '<%= config.bin %> <%= command.id %> --no-index',
    },
    {
      description: 'Merge all documents into a single file',
      command: '<%= config.bin %> <%= command.id %> --merge',
    },
    {
      description: 'Hammer their API (this is mean, don\'t do it)',
      command: '<%= config.bin %> <%= command.id %> --delay 0',
    },
  ]
  static override flags = {
    "output-dir": Flags.string({char: 'o', description: 'output directory to save the documents to'}),
    merge: Flags.boolean({char: 'M', description: 'merge all documents into a single file'}),
    "no-index": Flags.boolean({description: 'do not create an index file'}),
    "date-format": Flags.string({description: 'date format to use for the output directory. Uses date-fns. Set to "0" to disable', default: "yyyy-MM-dd"}),
    name: Flags.string({char: 'n', description: 'document filename template. Available variables: {{id}} {{name}} {{type}}', default: "{{id}}"}),
    "file-exists": Flags.string({char: 'e', description: 'action to take if the file already exists.', options: ["replace", "keep-both", "skip", "error"], default: "keep-both"}),
    delay: Flags.string({char: 'd', description: 'delay between API requests in milliseconds', default: "500"}),
  }

  private addCountToName(dir: string, name: string, count: number = 2): string {
    if(count > 100) {
      this.error(`Too many files named ${name} in ${dir}. Aborting`, { exit: 1 })
    }
    if(fs.existsSync(path.join(dir, stringFormat(name, count)))) {
      return this.addCountToName(dir, name, count + 1)
    }
    return stringFormat(name, count)
  }

  private handleFileExists(outputDirectory: string, name: string, preference: FileExistsPreference): string | undefined {
    let finalName: string | undefined;

    if(fs.existsSync(path.join(outputDirectory, name))) {
      switch(preference) {
        case "replace":
          finalName = name
          break
        case "keep-both":
          const nameParts = name.split(".")
          finalName = this.addCountToName(outputDirectory, `${nameParts.slice(0, -1).join(".")}(%i).${nameParts[nameParts.length - 1]}`)
          break
        case "skip":
          break
        case "error":
          this.error("Index file already exists", { exit: 1 })
      }
      return finalName
    }
    return name
  }

  public async run(): Promise<Omit<DocumentIndex, "documents">> {
    const {flags} = await this.parse(KnowledgebaseBackup)

    const elevenLabsApiKey = getElevenLabsApiKey(this.config.configDir)
    if (!elevenLabsApiKey) {
      this.error('ElevenLabs API key not found.`', { exit: 1 })
    }

    const documents = await getDocumentList({elevenLabsApiKey})

    const fetchedDocuments: {[key in DocumentTypes]: Document[]} = {
      text: [],
      file: [],
      url: [],
    }

    let fetchedCount = 0
    let failedCount = 0

    const progress = new SingleBar({
      hideCursor: true,
      clearOnComplete: true,
      format: 'Documents: ' + colors.green('{bar}') + ' {percentage}% | {value}/{total} (' + colors.red('{failedCount}') + ' failed) | ETA: ' + colors.cyan('{eta_formatted}') + ' | Elapsed: ' + colors.bold('{duration_formatted}'),
      barCompleteChar: '\u25B0',
      barIncompleteChar: '\u25B1',
    }, Presets.shades_grey);

    progress.start(documents.length, 0, {failedCount})

    for (const doc of documents) {
      try {
        const response = await fetch(`https://api.elevenlabs.io/v1/convai/knowledge-base/${doc.id}`, {
          method: "GET",
          headers: {
            "xi-api-key": elevenLabsApiKey,
          },
        })

        const body = await response.json()
        if (response.ok) {
          fetchedCount++
          fetchedDocuments[doc.type].push(body)
        } else {
          failedCount++
        }
      } catch (e) {
        failedCount++
      } finally {
        progress.increment()
        progress.update({failedCount})
      }

      // Add a delay to avoid hamering their API
      await new Promise(resolve => setTimeout(resolve, parseInt(flags["delay"])))
    }

    progress.stop()

    this.log(`${colors.green(fetchedCount.toString())} fetched, ${colors.red(failedCount.toString())} failed`)

    const docsAll = R.values(fetchedDocuments).flat()
    const docsText = fetchedDocuments.text
    const docsFile = fetchedDocuments.file
    const docsUrl = fetchedDocuments.url

    const bytes = (docs: Document[]) => docs.reduce((acc, doc) => acc + doc.metadata.size_bytes, 0)
    const characters = (docs: Document[]) => docs.reduce((acc, doc) => acc + (doc.extracted_inner_html?.length ?? 0), 0)
    const tokens = (docs: Document[]) => docs.reduce((acc, doc) => acc + (doc.extracted_inner_html?.length ?? 0) / 4, 0)

    const age = (docs: Document[]) => {
      return Math.round((docs.reduce((acc, doc) => acc + (Date.now() - doc.metadata.last_updated_at_unix_secs * 1000), 0) / 1000) / docs.length)
    }

    const updated = (docs: Document[]) => docs.reduce((acc, doc) => Math.max(acc, doc.metadata.last_updated_at_unix_secs), 0)

    const calcStats = (docs: Document[]) => {
      return {
        numberOfDocuments: docs.length,
        totalSizeBytes: bytes(docs),
        averageSizeBytes: Math.round(bytes(docs) / docs.length),
        averageDocumentAge: age(docs),
        lastUpdatedAt: updated(docs),
        totalCharacters: characters(docs),
        averageCharacters: Math.round(characters(docs) / docs.length),
        approxTotalTokens: Math.round(tokens(docs)),
        approxAverageTokens: Math.round(tokens(docs) / docs.length),
      }
    }

    const stats: DocumentStats = {
      combined: calcStats(docsAll),
      text: calcStats(docsText),
      file: calcStats(docsFile),
      url: calcStats(docsUrl),
    }

    const outputDirectoryBase = flags["output-dir"] ?? "./"
    const outputDirectory = flags["date-format"] === "0" ? outputDirectoryBase : path.join(outputDirectoryBase, format(new Date(), flags["date-format"]))
    fs.mkdirSync(outputDirectory, { recursive: true })

    if(!flags["no-index"]) {
      const indexFileName = this.handleFileExists(outputDirectory, "index.json", flags["file-exists"] as FileExistsPreference)
      if(indexFileName) {
        fs.writeFileSync(path.join(outputDirectory, indexFileName), JSON.stringify({
          documents,
          stats,
          fetched: fetchedCount,
          failed: failedCount,
        }, null, 2))

        this.log(`Index file: ${colors.magenta(path.join(outputDirectory, indexFileName))}`)
      }
    }

    

    if(flags["merge"]) {
      const knowledgeBaseFileName = this.handleFileExists(outputDirectory, "knowledgebase.json", flags["file-exists"] as FileExistsPreference)
      if(knowledgeBaseFileName) {
        fs.writeFileSync(path.join(outputDirectory, knowledgeBaseFileName), JSON.stringify(docsAll, null, 2))
        this.log(`Backup File: ${colors.magenta(path.join(outputDirectory, knowledgeBaseFileName))}`)
      }
    } else {
      [path.join(outputDirectory, 'text'), path.join(outputDirectory, 'file'), path.join(outputDirectory, 'url')].forEach(dir => fs.mkdirSync(dir, { recursive: true }))

      const truncOrPad = (str: string, length: number) => {
        return str.length > length ? str.slice(0, length - 1) + "…" : str.padEnd(length)
      }
      
      const progress = new MultiBar({
        hideCursor: true,
        clearOnComplete: true,
        barCompleteChar: '\u25B0',
        barIncompleteChar: '\u25B1',
        emptyOnZero: true,
      }, Presets.shades_grey);

      const progressBars = {
        text: progress.create(docsText.length, 0, {type: "Text", id: "     ", name: "               "}, { format: '{type}: ' + colors.blue('{bar}') + ' {id} | {name} | ' + colors.bold('{value}/{total}')}),
        file: progress.create(docsFile.length, 0, {type: "File", id: "     ", name: "               "}, { format: '{type}: ' + colors.magenta('{bar}') + ' {id} | {name} | ' + colors.bold('{value}/{total}')}),
        url: progress.create(docsUrl.length, 0, {type: "URL ", id: "     ", name: "               "}, { format: '{type}: ' + colors.yellow('{bar}') + ' {id} | {name} | ' + colors.bold('{value}/{total}')}),
      }

      const writeCounts: {
        [key in DocumentTypes]: {
          written: number,
          skipped: number,
        }
      } = {
        text: {
          written: 0,
          skipped: 0,
        },
        file: {
          written: 0,
          skipped: 0,
        },
        url: {
          written: 0,
          skipped: 0,
        },
      }

      const name = (doc: Document) => filenamify(flags["name"].replace("{{id}}", doc.id).replace("{{name}}", doc.name).replace("{{type}}", doc.type))

      for(const doc of R.shuffle(docsAll)) {
        // Blank out the id/name of any completed bars at the start of the next iteration after they complete
        for(const type of documentTypes) {
          if(progressBars[type].getProgress() === 1) {
            progressBars[type].update({id: "     ", name: "               "})
          }
        }

        progressBars[doc.type].update({id: truncOrPad(doc.id, 5), name: truncOrPad(filenamify(doc.name), 15)})
        const fileName = this.handleFileExists(path.join(outputDirectory, doc.type), `${name(doc)}.json`, flags["file-exists"] as FileExistsPreference)
        if(fileName) {
          fs.writeFileSync(path.join(outputDirectory, doc.type, fileName), JSON.stringify(doc, null, 2))
          writeCounts[doc.type].written++
        } else {
          writeCounts[doc.type].skipped++
        }
        progressBars[doc.type].increment()
        await new Promise(resolve => setTimeout(resolve, parseInt(flags["delay"])/2))
      }
      progress.stop()

      const typeMaxStrLength = Math.max(...documentTypes.map(type => type.length))
      const wroteMaxStrLength = R.sumBy(R.values(writeCounts), (count) => count.written).toString().length
      const skippedMaxStrLength = R.sumBy(R.values(writeCounts), (count) => count.skipped).toString().length

      const typeStr = (type: DocumentTypes) => colors.bold((type.charAt(0).toUpperCase() + type.slice(1)).padEnd(typeMaxStrLength))
      const wroteStr = (type: DocumentTypes) => colors.green(writeCounts[type].written.toString().padStart(wroteMaxStrLength))
      const skippedStr = (type: DocumentTypes) => colors.red(writeCounts[type].skipped.toString().padStart(skippedMaxStrLength))
      const pathStr = (type: DocumentTypes) => linkPath({text: `${type}/`, relativePath: path.join(outputDirectory, type)})

      for(const type of documentTypes) {
        this.log(`${typeStr(type)} backups: ${pathStr(type)}`)
      }

      const formatAge = (seconds: number) => {
        const pluralize = (count: number, noun: string) => `${count} ${noun}${count !== 1 ? 's' : ''}`

        return match(seconds)
          .with(P.number.gt(60 * 60 * 24 * 365), () => pluralize(Math.round(seconds / 60 / 60 / 24 / 365), "year"))
          .with(P.number.gt(60 * 60 * 24 * 30), () => pluralize(Math.round(seconds / 60 / 60 / 24 / 30), "month"))
          .with(P.number.gt(60 * 60 * 24), () => pluralize(Math.round(seconds / 60 / 60 / 24), "day"))
          .with(P.number.gt(60 * 60), () => pluralize(Math.round(seconds / 60 / 60), "hour"))
          .with(P.number.gt(60), () => pluralize(Math.round(seconds / 60), "minute"))
          .otherwise(() => pluralize(seconds, "second"))
      }

    const formatLastUpdated = (timestamp: number) => `${formatDistanceToNow(new Date(timestamp * 1000))} ago`

      const header = [
        { value: "Type", width: 10 },
        { value: "Written", width: 10 },
        { value: "Skipped", width: 10 },
        { value: "Size (bytes)", width: 15 },
        { value: "Characters", width: 15 },
        { value: "Tokens", width: 15 },
        { value: "Average Age", width: 20 },
        { value: "Last Updated", width: 25 },
      ]
      const rows = []

      for(const type of documentTypes) {
        rows.push([
          linkPath({text: typeStr(type), relativePath: path.join(outputDirectory, type), fallback: "text"}),
          wroteStr(type),
          skippedStr(type),
          Intl.NumberFormat().format(stats[type].totalSizeBytes),
          Intl.NumberFormat().format(stats[type].totalCharacters),
          Intl.NumberFormat().format(stats[type].approxTotalTokens),
          formatAge(stats[type].averageDocumentAge),
          formatLastUpdated(stats[type].lastUpdatedAt),
        ])
      }

      rows.push([
        linkPath({text: "Totals", relativePath: outputDirectory, fallback: "text"}),
        colors.green(R.sumBy(R.values(writeCounts), (count) => count.written).toString()),
        colors.red(R.sumBy(R.values(writeCounts), (count) => count.skipped).toString()),
        Intl.NumberFormat().format(stats.combined.totalSizeBytes),
        Intl.NumberFormat().format(stats.combined.totalCharacters),
        Intl.NumberFormat().format(stats.combined.approxTotalTokens),
        "",
        "",
      ])

      this.log(Table(header, rows, {}).render())
    }

    return {
      stats,
      fetched: fetchedCount,
      failed: failedCount,
    }
  }
}