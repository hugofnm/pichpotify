"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AlbumWidget from '@/utils/components/album'
import { Button } from '@/utils/components/ui/button'

const API_URL = '/api/spotify'
const GALLERY_API_URL = '/api/gallery'

export default function HomeScreen() {
  const [album, setAlbum] = useState<any>(null)
  const [progress, setProgress] = useState<number>(0)
  const [gallery, setGallery] = useState<string[]>([])
  const [view, setView] = useState<'center' | 'left' | 'right'>('center')
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  let touchStart = 0

  useEffect(() => {
    fetchAlbum()
    // fetchGallery()
    const interval = setInterval(() => fetchAlbum(), 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchAlbum = async () => {
    const res = await fetch(`${API_URL}`)
    const data = await res.json()

    setAlbum(data)
    if (data?.progress_ms && data?.item?.duration_ms) {
      setProgress((data.progress_ms / data.item.duration_ms) * 100)
    }
  }

  // const fetchGallery = async () => {
  //   const res = await fetch(GALLERY_API_URL)
  //   const data = await res.json()
  //   setGallery(data.images || [])
  // }

  const views = {
    left: (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <h2 className="text-xl mb-4">Galerie</h2>
        <div className="overflow-hidden w-64 h-64 rounded-xl shadow">
          <div className="animate-scroll-gallery space-y-4">
            {gallery.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-full rounded-lg shadow"
                alt={`photo-${i}`}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    center: (
      <div className="w-screen h-screen aspect-square">
        {album?.item ? (
          <AlbumWidget album={album} progress={progress} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-2xl p-16 text-center">
              Aucun album en cours de lecture ou erreur de configuration...
            </p>
          </div>
        )}
      </div>
    ),
    right: (
      <div className="flex flex-col items-center justify-center p-4">
        <h2 className="text-xl mb-4">Paramètres rapides</h2>
        <Button onClick={() => window.location.reload()} className="mb-2">
          Recharger la page
        </Button>

        <h2 className="text-xl mt-8 mb-4">À propos</h2>
        <p className="text-sm text-gray-500">raspberry PI; PICHot; sPOTIFY</p>
        <p className="text-sm text-gray-500">Pichpotify © {new Date().getFullYear()}</p>
        <p className="text-sm text-gray-500">Fait avec ❤️ pour mon Pichaud par @hugofnm</p>
        <p className="text-sm text-gray-500">Powered by Spotify API</p>
      </div>
    ),
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-neutral-100 flex items-center justify-center"
      onTouchStart={(e) => (touchStart = e.changedTouches[0].clientX)}
      onTouchEnd={(e) => handleSwipe(e.changedTouches[0].clientX)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ x: direction === 'left' ? '-100%' : '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction === 'left' ? '-100%' : '100%', opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {views[view]}
        </motion.div>
      </AnimatePresence>
    </div>
  )

  function handleSwipe(touchEnd: number) {
    const diff = touchEnd - touchStart

    if (diff > 50) {
      // swipe right
      if (view === 'center') {
        setDirection('left')
        setView('left')
      } else if (view === 'right') {
        setDirection('left')
        setView('center')
      }
    } else if (diff < -50) {
      // swipe left
      if (view === 'center') {
        setDirection('right')
        setView('right')
      } else if (view === 'left') {
        setDirection('right')
        setView('center')
      }
    }
  }
}