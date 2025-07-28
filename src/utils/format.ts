import os from 'node:os';
import path from 'node:path';
import terminalLink from 'terminal-link';

export const linkPath = (args: {
  text: string, hostname?: string, cwd?: string, relativePath: string, fallback?: "text" | "hostname" | "cwd" | "relativePath" 
}) => {
  const {text, hostname = os.hostname(), cwd = process.cwd(), relativePath, fallback = "relativePath"} = args
  if(terminalLink.isSupported) {
    return terminalLink(text, `file://${path.join(hostname, cwd, relativePath)}`)
  }
  return args[fallback]
}