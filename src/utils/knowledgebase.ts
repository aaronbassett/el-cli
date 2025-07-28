import { error } from "@oclif/core/errors";
import ora from 'ora';
import type { Document } from "../types/knowledgebase.js";

const getSpinner = (showSpinner: boolean) => showSpinner ? ora({
  text: "Fetching all documents…",
  spinner: "dots",
}) : {
  start: () => {},
  succeed: (_: string) => {},
  fail: (_: string) => {},
}

export async function getDocumentList({elevenLabsApiKey, delay=1000, showSpinner=true}: {elevenLabsApiKey: string, delay?: number, showSpinner?: boolean}): Promise<Document[]> {
  const documents: Document[] = []

  let cursor: string = "" // undefined causes a type warning, so we use "" instead
  let hasMore = true

  const spinner = getSpinner(showSpinner)
  spinner.start()

  while(hasMore) {
    const qs = cursor !== "" ? new URLSearchParams({page_size: "100", cursor}).toString() : new URLSearchParams({page_size: "100"}).toString()
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/knowledge-base?${qs.toString()}`, {
      method: "GET",
      headers: {
        "xi-api-key": elevenLabsApiKey,
      },
    });

    const body = await response.json()
    if (response.ok) {
      documents.push(...body.documents)
      hasMore = body.has_more
      cursor = body.next_cursor?? ""
    } else {
      spinner.fail(`Fetching document list failed at cursor ${cursor}`)
      error(JSON.stringify(body), { exit: 1 })
    }

    if(hasMore) { // Don't delay if we're on the last page
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  spinner.succeed(`Fetched document list`)
  return documents
}