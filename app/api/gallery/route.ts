import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(req: NextRequest) {
  const folder = path.join(process.cwd(), 'public/gallery')
  const files = fs.readdirSync(folder).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
  const images = files.map(file => `/${file}`)
  return NextResponse.json({ images })
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const image = formData.get('image') as File
    if (!image) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 })
    }
    const buffer = await image.arrayBuffer()
    const filePath = path.join(process.cwd(), 'public/gallery', image.name)
    fs.writeFileSync(filePath, Buffer.from(buffer))
    return NextResponse.json({ success: true, image: `/gallery/${image.name}` })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { image } = await req.json()
    if (!image) {
      return NextResponse.json({ error: 'Image name is required' }, { status: 400 })
    }

    const filePath = path.join(process.cwd(), 'public', image)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}