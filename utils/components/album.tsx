// components/album.tsx

import Image from 'next/image'

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

      <div className="relative z-10 flex flex-col items-center justify-center w-full text-center">
        <Image
          src={imageUrl}
          alt="album art"
          width={480}
          height={480}
          quality={75}
          className="rounded-xl shadow-xl border border-white"
          priority
        />

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
