import * as fs from 'fs';
import * as path from 'path';

/**
 * Fetches the ElevenLabs API key from environment variables or config file
 * @param configDir - The configuration directory path
 * @returns The API key if found, null otherwise
 */
export function getElevenLabsApiKey(configDir: string): string | null {
  // First try environment variable
  let apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (apiKey) {
    return apiKey;
  }

  // Fallback to config file
  const configPath = path.join(configDir, 'config.json');
  const configExists = fs.existsSync(configPath);

  if (configExists) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return config.elevenLabsApiKey || null;
    } catch (error) {
      // Silently handle config parsing errors
      return null;
    }
  }

  return null;
} 