import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

let ticks = 0
let prevUrl = ''

export async function GET(req: NextRequest) {
  try {
    // get token 
    const authPath = path.join(process.cwd(), 'auth.json')
    const authData = JSON.parse(fs.readFileSync(authPath, 'utf-8'))
    const token = authData.user_token || null

    if (!token) {
      return NextResponse.json({ error: 'Missing token' })
    }

    // get action from query parameters
    const action = req.nextUrl.searchParams.get('action') || null
    var status = true

    switch (action) {
      case 'album':
      default:
        const album = await getCurrentAlbum(token)

        if (album?.refresh === true) {
          return NextResponse.json({ refresh: true })
        }

        const url = album?.item?.album?.images?.[0]?.url || null

        if (!url) {
          return NextResponse.json({ error: 'No album image found' })
        }

        if (url !== prevUrl) {
          prevUrl = url
          ticks++
        }

        return NextResponse.json(album)

      case 'pause':
        await fetch('https://api.spotify.com/v1/me/player/pause', {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          if (res.status !== 204) {
            status = false
          }
        })
        return NextResponse.json({ success: status })

      case 'play':
        await fetch('https://api.spotify.com/v1/me/player/play', {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          if (res.status !== 204) {
            status = false
          }
        })
        return NextResponse.json({ success: status })

      case 'next':
        await fetch('https://api.spotify.com/v1/me/player/next', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          if (res.status !== 204) {
            status = false
          }
        })
        return NextResponse.json({ success: status })

      case 'previous':
        await fetch('https://api.spotify.com/v1/me/player/previous', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          if (res.status !== 204) {
            status = false
          }
        })
        return NextResponse.json({ success: status })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' })
  }
}

async function getNewToken() {
  // refresh token that has been previously stored
  const authPath = path.join(process.cwd(), 'auth.json')
  const authData = JSON.parse(fs.readFileSync(authPath, 'utf-8'))
  const client_id = authData.spotify_client_id || null
  const client_secret = authData.spotify_client_secret || null
  const refresh_token = authData.user_refresh_token || null

  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      'grant_type': 'refresh_token',
      'refresh_token': refresh_token,
    }),
  }
  const body = await fetch(url, payload);
  const response = await body.json();

  authData.user_token = response.access_token;
  fs.writeFileSync(authPath, JSON.stringify(authData, null, 2));

  return NextResponse.json({ refresh: true });
}

async function getCurrentAlbum(token: string): Promise<any | null> {
  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (response.status === 204) {
    // No content, meaning no track is currently playing
    return null
  }

  if (!response.ok) return getNewToken()

  const data = await response.json()
  return data ?? null
}