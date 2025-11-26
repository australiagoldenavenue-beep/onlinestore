import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Basic validation
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${Date.now()}_${safeName}`
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    const filepath = path.join(uploadDir, filename)

    try {
        await writeFile(filepath, buffer)
        return NextResponse.json({ url: `/uploads/${filename}` })
    } catch (error) {
        console.error('Error saving file:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
