import Link from "next/link";
import { format } from "date-fns";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BlogActions } from "./BlogActions";

export default async function AdminBlogPage() {
  let posts: any[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Error fetching posts:", e);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Blog Posts</h2>
          <p className="text-muted-foreground mt-1">Manage your blog content</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 group">
            <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card backdrop-blur-xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-muted border-b border-border">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Title</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium">Views</TableHead>
              <TableHead className="text-muted-foreground font-medium">Date</TableHead>
              <TableHead className="text-right text-muted-foreground font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No posts found. Create your first post!
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} className="border-b border-white/5 hover:bg-card transition-colors">
                  <TableCell className="font-medium text-foreground">{post.title}</TableCell>
                  <TableCell>
                    {post.status === 'published' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Draft
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-foreground font-medium">
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      {post.views ?? 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                      <BlogActions id={post.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
