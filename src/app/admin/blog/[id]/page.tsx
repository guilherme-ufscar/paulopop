export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BlogPostEditor } from '@/components/admin/BlogPostEditor'

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
    select: {
      id: true, title: true, excerpt: true, content: true,
      coverUrl: true, category: true, tags: true, status: true,
    },
  })

  if (!post) notFound()

  return (
    <BlogPostEditor
      initial={{
        id: post.id,
        title: post.title,
        excerpt: post.excerpt ?? '',
        content: post.content,
        coverUrl: post.coverUrl ?? '',
        category: post.category ?? '',
        tags: post.tags,
        status: post.status,
      }}
    />
  )
}
