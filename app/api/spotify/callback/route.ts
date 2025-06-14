// app/api/spotify/callback/route.ts

import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code')

    if (!code) {
        return NextResponse.json({ error: 'Missing code' }, { status: 400 })
    }

    const authPath = path.join(process.cwd(), 'auth.json')
    const authData = JSON.parse(fs.readFileSync(authPath, 'utf-8'))

    const client_id = authData.spotify_client_id!
    const client_secret = authData.spotify_client_secret!
    const redirect_uri = authData.spotify_redirect_uri!

    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirect_uri,
    })

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
    })

    const data = await tokenResponse.json()

    if (!data.access_token) {
        return NextResponse.json({ error: 'Auth failed', details: data }, { status: 401 })
    }

    // Write the access token to the auth file
    authData.user_token = data.access_token
    authData.user_refresh_token = data.refresh_token
    fs.writeFileSync(authPath, JSON.stringify(authData, null, 2))

    const res = NextResponse.redirect(new URL('/admin', req.url))

    res.cookies.set('spotify_access_token', data.access_token, {
        path: '/',
        // TODO : enable this when prod
        // httpOnly: true,
        maxAge: 3600,
    })

    res.cookies.set('spotify_refresh_token', data.refresh_token, {
        path: '/',
        // httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 jours
    })

    return res
}