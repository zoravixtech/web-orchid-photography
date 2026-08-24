'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { deleteGalleryMedia, toggleHeroCarousel } from '@/app/admin/actions/gallery'
import UploadModal from '@/components/admin/UploadModal'
import { useToast } from '@/components/admin/Toast'
import type { GalleryMediaItem, GallerySection } from '@/lib/types'

interface GalleryManagerProps {
  initialGallery: GalleryMediaItem[]
  initialKids: GalleryMediaItem[]
  initialHeroCarouselIds: string[]
}

const sections: { value: GallerySection; label: string }[] = [
  { value: 'gallery', label: 'Gallery' },
  { value: 'kids', label: 'Kids Area' },
]

export default function GalleryManager({
  initialGallery,
  initialKids,
  initialHeroCarouselIds,
}: GalleryManagerProps) {
  const router = useRouter()
  const toast = useToast()
  const [section, setSection] = useState<GallerySection>('gallery')
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null)
  const [heroCarouselIds, setHeroCarouselIds] = useState<Set<string>>(
    () => new Set(initialHeroCarouselIds)
  )
  const [isPending, startTransition] = useTransition()

  const images = section === 'gallery' ? initialGallery : initialKids

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteGalleryMedia(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        setHeroCarouselIds((prev) => {
          if (!prev.has(id)) return prev
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        toast.success('Image deleted.')
        router.refresh()
      }
    })
  }

  const handleToggleHero = (id: string) => {
    const nextSelected = !heroCarouselIds.has(id)
    setPendingToggleId(id)
    startTransition(async () => {
      const result = await toggleHeroCarousel(id, nextSelected)
      if (result.error) {
        toast.error(result.error)
      } else {
        setHeroCarouselIds((prev) => {
          const next = new Set(prev)
          if (nextSelected) next.add(id)
          else next.delete(id)
          return next
        })
        toast.success(nextSelected ? 'Added to hero carousel.' : 'Removed from hero carousel.')
      }
      setPendingToggleId(null)
    })
  }

  const handleUploaded = () => {
    router.refresh()
  }

  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Gallery</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage images for the home page gallery and the kids area gallery.
        </p>
      </header>

      {/* Full-width nav card with destination selector + upload button */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex rounded-lg border border-slate-300 overflow-hidden">
            {sections.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSection(s.value)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  section === s.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload
        </button>
      </div>

      {/* Selected section label */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          {section === 'gallery' ? 'Gallery' : 'Kids Area'} images ({images.length})
        </h2>
      </div>

      {images.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-sm text-slate-500">
            No images yet. Click <span className="font-semibold text-purple-600">Upload</span> to
            add some.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0.5">
          {images.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-4/3 overflow-hidden bg-slate-200 border border-slate-200"
            >
              <Image
                src={item.url}
                alt={item.alt || 'Gallery image'}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />

              {/* Persistent badge so carousel membership is visible without hovering */}
              {heroCarouselIds.has(item.id) && (
                <div className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-amber-500 text-white text-[10px] font-semibold px-1.5 py-1 shadow">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.922-.755 1.688-1.538 1.118l-3.367-2.447a1 1 0 00-1.176 0l-3.367 2.447c-.783.57-1.838-.196-1.538-1.118l1.285-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.285-3.958z" />
                  </svg>
                  Hero
                </div>
              )}

              {/* Toggle + delete overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {pendingDeleteId === item.id ? (
                  <span className="text-xs text-white">Deleting…</span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleToggleHero(item.id)}
                      disabled={isPending}
                      aria-pressed={heroCarouselIds.has(item.id)}
                      title={
                        heroCarouselIds.has(item.id)
                          ? 'Remove from hero carousel'
                          : 'Add to hero carousel'
                      }
                      className={`inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold px-3 py-2 transition-colors disabled:opacity-60 ${
                        heroCarouselIds.has(item.id)
                          ? 'bg-amber-500 hover:bg-amber-600 text-white'
                          : 'bg-white/90 hover:bg-white text-slate-700'
                      }`}
                    >
                      {pendingToggleId === item.id ? (
                        '…'
                      ) : (
                        <svg
                          className="w-3.5 h-3.5"
                          fill={heroCarouselIds.has(item.id) ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.922-.755 1.688-1.538 1.118l-3.367-2.447a1 1 0 00-1.176 0l-3.367 2.447c-.783.57-1.838-.196-1.538-1.118l1.285-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.285-3.958z" />
                        </svg>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPendingDeleteId(item.id)
                        handleDelete(item.id)
                      }}
                      disabled={isPending}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 transition-colors disabled:opacity-60"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <UploadModal
        open={modalOpen}
        section={section}
        onClose={() => setModalOpen(false)}
        onUploaded={handleUploaded}
      />
    </div>
  )
}
