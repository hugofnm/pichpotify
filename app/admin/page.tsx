'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

import { Button } from '@/utils/components/ui/button'
import { Input } from "@/utils/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/utils/components/ui/table"

import { Trash2 } from "lucide-react"

export default function AdminPage() {
  const [gallery, setGallery] = useState<string[]>([])
  const [tempImage, setTempImage] = useState<File | null>(null)

  const GALLERY_API_URL = '/api/gallery'

  useEffect(() => {
    // Fetch the gallery images on component mount
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    const res = await fetch(GALLERY_API_URL)
    const data = await res.json()
    setGallery(data.images || [])
  }

  function createName(imageName: string): string {
    // Change the file name to a random 2 characters string
    const randomChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const uniqueName = randomChars.replace(/./g, () => randomChars[Math.floor(Math.random() * randomChars.length)]).slice(0, 2)

    // Add the original file extension
    const extension = imageName.split('.').pop()
    if (!extension || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension.toLowerCase())) {
      alert('Le fichier doit avoir une extension valide')
      return ''
    }

    return `${uniqueName}.${extension}`
  }

  function addImage(image: File | null) {
    if (!image) return

    if (gallery.length >= 25) {
      alert('La galerie est pleine (25 images maximum)')
      return
    }

    // Gen unique name for the image and check if it already exists
    let uniqueName = createName(image.name)
    while (gallery.includes(uniqueName)) {
      uniqueName = createName(image.name)
    }

    const renamedImage = new File([image], uniqueName, { type: image.type })

    const formData = new FormData()
    formData.append('image', renamedImage)

    fetch(`${GALLERY_API_URL}`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGallery([...gallery, data.image])
          setTempImage(null)
        } else {
          alert('Erreur lors de l\'upload de l\'image')
        }
      })
      .catch(err => {
        console.error('Erreur lors de l\'upload de l\'image:', err)
        alert('Erreur lors de l\'upload de l\'image')
      })
  }

  function deleteImage(image: string) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'image ${image} ?`)) return

    fetch(`${GALLERY_API_URL}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGallery(gallery.filter(img => img !== image))
        } else {
          alert('Erreur lors de la suppression de l\'image')
        }
      })
      .catch(err => {
        console.error('Erreur lors de la suppression de l\'image:', err)
        alert('Erreur lors de la suppression de l\'image')
      })
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-100">
      <h1 className="text-3xl font-bold mb-4">Connexion à Spotify</h1>
      <Button onClick={() => {
        window.location.href = '/api/spotify/login'
      }} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
        Se connecter à Spotify
      </Button>

      <h1 className="text-3xl font-bold mt-8 mb-4">Gestion de la galerie</h1>
      <div className="flex items-center space-x-4 mb-4">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              setTempImage(file)
            }
          }}
          className="file:cursor-pointer file:rounded file:border-0 file:bg-blue-600 file:px-4 file:text-white hover:file:bg-blue-600 transition"
        />
        <Button
          onClick={() => {
            addImage(tempImage)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Ajouter
        </Button>
      </div>
      <div className="flex justify-center w-full px-16 py-4">
        <Table className="w-full bg-white rounded shadow p-4">
          <TableCaption>Liste des images de la galerie</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du fichier</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Supprimer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gallery.map((image, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{image}</TableCell>
                <TableCell>
                  <Image src={`/api/photo${image}`} alt={image} className="w-16 h-16 object-cover rounded" />
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => deleteImage(image)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}
