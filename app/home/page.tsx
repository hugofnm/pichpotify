"use client"

import { use, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

import AlbumWidget from '@/utils/components/album'
import { Button } from '@/utils/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/utils/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/utils/components/ui/dialog"
import { Label } from '@/utils/components/ui/label'
import { Slider } from '@/utils/components/ui/slider'

import { X } from 'lucide-react'

const API_URL = '/api/spotify'
const GALLERY_API_URL = '/api/gallery'

export default function HomeScreen() {
  const [album, setAlbum] = useState<any>(null)
  const [progress, setProgress] = useState<number>(0)
  const [gallery, setGallery] = useState<string[]>([])
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [galleryInterval, setGalleryInterval] = useState(30000)
  const [view, setView] = useState<'center' | 'left' | 'right'>('center')
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [qrCodeShown, setQrCodeShown] = useState(false)

  const birthDate = new Date('2025-06-08') // Date de naissance du Pichpotify

  let touchStart = 0

  useEffect(() => {
    fetchAll()
    const interval = setInterval(() => fetchAll(), 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!album?.item && view === 'center') {
        setView('left')
      } else if (album?.item && view === 'left') {
        setView('center')
      }
    }, 10000)
    return () => clearTimeout(timeout)
  }, [album])

  useEffect(() => {
    if (gallery.length <= 1) return
    const interval = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % gallery.length)
    }, galleryInterval)
    return () => clearInterval(interval)
  }, [gallery.length, galleryInterval])

  const fetchAll = async () => {
    await Promise.all([fetchAlbum(), fetchGallery()])
  }

  const fetchAlbum = async () => {
    const res = await fetch(`${API_URL}`)
    const data = await res.json()

    if (data.refresh) {
      // refresh the page if the album is not found
      window.location.reload()
      return
    }

    setAlbum(data)
    if (data?.progress_ms && data?.item?.duration_ms) {
      setProgress((data.progress_ms / data.item.duration_ms) * 100)
    }
  }

  const fetchGallery = async () => {
    const res = await fetch(GALLERY_API_URL)
    const data = await res.json()
    setGallery(data.images || [])
  }

  const views = {
    left: (
      <div className="relative w-full h-full shadow overflow-hidden flex items-center justify-center bg-black">
        <AnimatePresence mode="wait">
          {gallery.length > 0 && (
            <motion.div
              key={galleryIndex}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {/* Blurred background */}
              <Image
                width={240}
                height={240}
                quality={5}
                src={gallery[galleryIndex]}
                alt={`photo-bg-${galleryIndex}`}
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 z-0"
                style={{ filter: 'blur(32px) brightness(0.7)' }}
                aria-hidden
              />
              {/* Foreground image */}
              <Image
                width={720}
                height={720}
                quality={75}
                src={gallery[galleryIndex]}
                alt={`photo-${galleryIndex}`}
                className="relative z-10 w-full h-auto max-h-full shadow-lg object-contain"
                style={{
                  background: 'rgba(0,0,0,0.2)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
      <div className="flex flex-col items-center justify-center w-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-lg">Paramètres rapides</CardTitle>
            <CardDescription onClick={() => setQrCodeShown(true)}>
              Pour configurer le Pichpotify, utilise ton tel. pour accéder à <u>https://pichpotify.local/admin</u>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <Button onClick={() => window.location.reload()} className="mb-2 text-lg" size={'lg'}>
                Recharger la page
              </Button>
              <Button onClick={() => window.location.href = '/api/power'} className="mb-2 text-lg" size={'lg'}>
                Éteindre le Pichpotify
              </Button>

              <Label className="mt-4 text-lg" htmlFor="slider">Intervalle de lecture gallerie</Label>

              <div className="flex items-center gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setGalleryInterval((prev) => Math.max(5000, prev - (5000)))
                  }
                  aria-label="Diminuer l'intervalle"
                >
                  -
                </Button>
                <Slider
                  id="slider"
                  value={[galleryInterval]}
                  min={5000}
                  max={120000}
                  step={5000}
                  onValueChange={([val]) => setGalleryInterval(val)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setGalleryInterval((prev) => Math.min(120000, prev + 5000))
                  }
                  aria-label="Augmenter l'intervalle"
                >
                  +
                </Button>
                <span className="ml-2 text-m text-gray-500">{galleryInterval / 1000}s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl mt-8 mb-4">À propos</h2>
        <p className="text-m text-gray-500">raspberry PI; PICHot; sPOTIFY</p>
        <p className="text-m text-gray-500">Pichpotify © {new Date().getFullYear()}</p>
        <br />
        <p className="text-m text-gray-500">{Math.floor((Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24))} jours depuis ma naissance :)</p>
        <p className="text-m text-gray-500">Fait avec ❤️ pour mon Pichot par @hugofnm</p>
        <p className="text-m text-gray-500">Powered by Spotify API</p>

        <Dialog open={qrCodeShown}>
          <DialogContent showCloseButton={false} className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Scanne-ça !</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center">
              <Image
                src="/qradmin.png"
                alt="Pichpotify Logo"
                width={256}
                height={256}
              />
            </div>
            <DialogFooter className="flex items-center justify-center w-full">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="mx-auto" onClick={() => setQrCodeShown(false)}>
                  <X />
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 rounded-full bg-white/80 px-4 py-2 shadow">
        {(['left', 'center', 'right'] as const).map((v) => (
          <span
            key={v}
            className={`w-3 h-3 rounded-full transition-all ${view === v ? 'bg-neutral-800 scale-110' : 'bg-neutral-400 opacity-50'
              }`}
          />
        ))}
      </div>
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