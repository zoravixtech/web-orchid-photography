import Link from 'next/link'
import BlogList from '@/components/admin/BlogList'
import { listBlogsForAdmin } from '@/lib/data/admin'

export default async function AdminBlogsPage() {
  const blogs = await listBlogsForAdmin()

  return (
    <div className="w-full">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Blogs</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit and manage blog posts shown on the website.
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Blog
        </Link>
      </header>

      <BlogList initialBlogs={blogs} />
    </div>
  )
}
