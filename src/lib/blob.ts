import { put, del } from '@vercel/blob'

/**
 * Upload a file to Vercel Blob storage
 * @param file - The file to upload
 * @param folder - The folder path (e.g., 'profile', 'blog', 'portfolio')
 * @returns The public URL of the uploaded file
 */
export async function uploadToBlob(file: File, folder: string = 'uploads'): Promise<string> {
  const filename = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  
  const blob = await put(filename, file, {
    access: 'public',
    addRandomSuffix: false,
  })

  return blob.url
}

/**
 * Delete a file from Vercel Blob storage
 * @param url - The public URL of the file to delete
 */
export async function deleteFromBlob(url: string): Promise<void> {
  if (!url || !url.includes('vercel-storage.com')) return
  await del(url)
}

/**
 * Validate file upload constraints
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  const maxSize = 2 * 1024 * 1024 // 2 MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, WebP, or GIF files are allowed.' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 2 MB.' }
  }

  return { valid: true }
}
