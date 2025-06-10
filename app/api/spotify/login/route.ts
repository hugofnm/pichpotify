// app/api/spotify/login/route.ts

import { NextRequest } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(req: NextRequest) {
  const scope = 'user-read-currently-playing'

  const authPath = path.join(process.cwd(), 'auth.json')
  const authData = JSON.parse(fs.readFileSync(authPath, 'utf-8'))

  const client_id = authData.spotify_client_id!
  const redirect_uri = authData.spotify_redirect_uri!

  const authUrl = `https://accounts.spotify.com/authorize?` +
    new URLSearchParams({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
    })

  return Response.redirect(authUrl)
}
