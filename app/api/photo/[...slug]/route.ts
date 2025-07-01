import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
    const image = params.slug.join('/')

    if (!image) {
        return NextResponse.json({ error: 'Image name is required' }, { status: 400 })
    }

    // Open image and return it
    const filePath = path.join(process.cwd(), 'public/gallery', image)
    if (fs.existsSync(filePath)) {
        const imageBuffer = fs.readFileSync(filePath)
        const ext = path.extname(filePath).toLowerCase()
        var imageType = 'image/jpeg' // Default type, adjust as needed
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                // Handle JPEG images
                imageType = 'image/jpeg'
                break
            case '.png':
                // Handle PNG images
                imageType = 'image/png'
                break
            case '.gif':
                // Handle GIF images
                imageType = 'image/gif'
                break
            case '.webp':
                // Handle WebP images
                imageType = 'image/webp'
                break
        }
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': imageType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    }
    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
}