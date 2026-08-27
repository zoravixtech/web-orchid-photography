'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BlockEditor from '@/components/admin/BlockEditor'
import type { BlogBlock, BlogPost } from '@/lib/types'
import type { BlogActionResult } from '@/app/admin/actions/blogs'
import { uploadFile } from '@/lib/uploadClient'
import { useToast } from '@/components/admin/Toast'
import { useAdminBlogStore } from '@/stores/adminBlogStore'

interface BlogFormProps {
  initialData?: BlogPost
  submitAction: (prevState: BlogActionResult, formData: FormData) => Promise<BlogActionResult>
  submitLabel: string
  cancelHref: string
}

export default function BlogForm({
  initialData,
  submitAction,
  submitLabel,
  cancelHref,
}: BlogFormProps) {
  const router = useRouter()
  const toast = useToast()
  const [state, formAction, isPending] = useActionState(submitAction, {})
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [date, setDate] = useState(initialData?.date ?? '')
  const [image, setImage] = useState(initialData?.image ?? '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '')
  const [blocks, setBlocks] = useState<BlogBlock[]>(initialData?.content ?? [])
  const [uploading, setUploading] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.error) toast.error(state.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.error])

  useEffect(() => {
    if (state.success && state.post) {
      // Reflect the change in the cached list immediately — no server
      // refetch needed when the admin navigates back to /admin/blogs.
      if (initialData) useAdminBlogStore.getState().updatePost(state.post)
      else useAdminBlogStore.getState().addPost(state.post)

      toast.success(initialData ? 'Blog post updated.' : 'Blog post published.')
      router.push(cancelHref)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.post])

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const { publicUrl } = await uploadFile('blog', file, file.name || '')
      setImage(publicUrl)
      toast.success('Cover image uploaded.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={formAction} className="space-y-6 w-full">
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-slate-900">Post details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label htmlFor="title" className="block text-xs font-medium text-slate-500 mb-1">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g. A Royal Bengali Wedding Story"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-xs font-medium text-slate-500 mb-1">
              Slug (leave empty to auto-generate)
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="a-royal-bengali-wedding-story"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-xs font-medium text-slate-500 mb-1">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-xs font-medium text-slate-500 mb-1">
            Excerpt / short description
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
            rows={2}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="A short summary shown on the blog listing…"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Cover image</h2>

        <div className="flex items-start gap-6">
          <div className="w-40 aspect-16/10 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
            {image ? (
              <Image
                src={image}
                alt="Cover preview"
                width={160}
                height={100}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-slate-400">No image</span>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <label htmlFor="image" className="block text-xs font-medium text-slate-500 mb-1">
                Image URL
              </label>
              <input
                id="image"
                name="image"
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://... or upload an image below"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                  e.target.value = ''
                }}
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white text-sm px-4 py-2 hover:bg-slate-800 disabled:opacity-60 transition-colors"
              >
                {uploading ? 'Uploading & optimizing…' : 'Upload image'}
              </button>
              <span className="text-xs text-slate-400">PNG, JPG, WebP or GIF — optimized automatically on upload</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Content</h2>
        <BlockEditor value={blocks} onChange={setBlocks} />

        {/* Serialized blocks for the server action */}
        <input
          type="hidden"
          name="content"
          value={JSON.stringify(blocks.filter((b) => b.text.trim() !== ''))}
        />
      </section>

      <div className="flex items-center justify-end gap-3">
        <Link
          href={cancelHref}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 transition-colors"
        >
          {isPending ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
