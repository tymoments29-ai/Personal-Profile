import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditPostForm } from "./EditPostForm";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  // Pass plain object to client component
  const postData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    tags: post.tags || "",
    contentEn: post.contentEn,
    excerptEn: post.excerptEn,
    thumbnailUrl: post.thumbnailUrl,
    status: post.status,
  };

  return <EditPostForm post={postData} />;
}
