'use client'

import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const match = document.cookie.match(/spotify_access_token=([^;]+)/)
    if (match) setToken(match[1])
  }, [])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Connexion à Spotify</h1>
      {!token ? (
        <a
          href="/api/spotify/login"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Se connecter à Spotify
        </a>
      ) : (
        <p className="text-green-700">Connecté à Spotify avec succès !</p>
      )}
    </main>
  )
}
