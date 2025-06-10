// pages/api/gallery-images.ts
import fs from 'fs'
import path from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const folder = path.join(process.cwd(), 'public/gallery')
  const files = fs.readdirSync(folder).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
  const images = files.map(file => `/gallery/${file}`)
  res.status(200).json({ images })
}