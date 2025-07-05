// components/album.tsx

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Pause, SkipForward, SkipBack } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AlbumWidget({
  album,
  progress,
}: {
  album: any
  progress: number
}) {
  if (!album?.item) return null

  const { name, artists, album: albumData } = album.item
  const imageUrl = albumData.images[0]?.url
  const releaseYear = albumData.release_date?.split('-')[0] ?? ''

  const [paused, setPaused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showArrows, setShowArrows] = useState(false)
  const [arrowDirection, setArrowDirection] = useState<'left' | 'right'>('left')
  const arrowTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if the album is paused on initial load
    setPaused(album.is_playing === false)
  }, [album])

  async function handleToggle() {
    if (loading) return
    setLoading(true)
    try {
      if (paused) {
        // If currently paused, send play request
        await fetch('/api/spotify?action=play', { method: 'GET' })
        setPaused(false)
      } else {
        // If currently playing, send pause request
        await fetch('/api/spotify?action=pause', { method: 'GET' })
        setPaused(true)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleControl(e: React.TouchEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    const touch = e.changedTouches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    setLoading(true);
    try {
      if (x < rect.width / 2) {
        // Left side: previous song
        setArrowDirection('left');
        await fetch('/api/spotify?action=previous', { method: 'GET' });
      } else {
        // Right side: next song
        setArrowDirection('right');
        await fetch('/api/spotify?action=next', { method: 'GET' });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt="background"
          objectFit="cover"
          className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 z-0"
          style={{ filter: 'blur(32px) brightness(0.7)' }}
          width={240}
          height={240}
          quality={5}
        />
      </div>
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        style={{ pointerEvents: 'auto' }}
        onTouchEnd={async (e) => {
          await handleControl(e);
          setShowArrows(true);
          clearTimeout(arrowTimeoutRef.current as any);
          arrowTimeoutRef.current = setTimeout(() => setShowArrows(false), 3000);
        }}
        aria-label="Skip or previous song"
      >
        {showArrows && (
          <motion.div
            className="absolute inset-0 flex items-center justify-between px-8 pointer-events-none select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {arrowDirection === 'left' && (
              <span className="bg-black/40 rounded-full p-2 shadow-[0_0_32px_8px_rgba(0,0,0,0.7)]">
                <SkipBack className="text-white drop-shadow-lg" width={48} height={48} />
              </span>
            )}
            <span className="flex-1" />
            {arrowDirection === 'right' && (
              <span className="bg-black/40 rounded-full p-2 shadow-[0_0_32px_8px_rgba(0,0,0,0.7)]">
                <SkipForward className="text-white drop-shadow-lg" width={48} height={48} />
              </span>
            )}
          </motion.div>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div
          className={`relative transition-all duration-300 ${paused ? 'scale-90' : 'scale-100'}`}
          style={{ display: 'inline-block', cursor: loading ? 'not-allowed' : 'pointer' }}
          onClick={handleToggle}
          tabIndex={0}
          aria-label={paused ? 'Resume album' : 'Pause album'}
        >
          <Image
            src={imageUrl}
            alt="album art"
            width={480}
            height={480}
            quality={75}
            className={`rounded-xl shadow-xl border border-white ${paused ? 'brightness-50' : 'brightness-100'}`}
            priority
            style={{ pointerEvents: 'none' }}
          />
          {paused && (
            <span className="absolute inset-0 flex items-center justify-center z-20">
              <Pause className="text-white drop-shadow-lg opacity-90" width={64} height={64} />
            </span>
          )}
        </div>

        <div className="mb-8 mt-2 text-white min-w-[300px] max-w-[600px]">
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-sm text-gray-200">
            {artists[0].name} &bull; {releaseYear}
          </p>
          <div className="mt-2 w-full bg-white/30 rounded-full h-2">
            <div
              className="bg-green-400 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
