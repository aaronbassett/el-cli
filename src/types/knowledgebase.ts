const documentTypes = ["text", "file", "url"] as const
export type DocumentTypes = (typeof documentTypes)[number]

export type Document = {
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
  dependent_agents?: string[],
  type: DocumentTypes
  url?: string
  extracted_inner_html?: string
}