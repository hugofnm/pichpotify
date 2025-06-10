import fs from 'fs'
import path from 'path'
import querystring from 'querystring'

let cachedToken: string | null = null
let tokenExpiry = 0

export async function getAccessToken(): Promise<string | null> {
  const now = Date.now()
  if (cachedToken && now < tokenExpiry) return cachedToken

  const authPath = path.join(process.cwd(), 'auth.json')
  const authData = JSON.parse(fs.readFileSync(authPath, 'utf-8'))

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${authData.spotify_client_id}:${authData.spotify_client_secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'client_credentials',
    }),
  })

  const data = await res.json()
  cachedToken = data.access_token || null
  tokenExpiry = now + data.expires_in * 1000
  return cachedToken
}
