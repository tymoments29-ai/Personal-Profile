"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  contentEn: z.string().min(1, "Content is required"),
  excerptEn: z.string().optional(),
  published: z.boolean(),
});

export default function NewPostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      contentEn: "",
      excerptEn: "",
      published: false,
    },
  });

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  async function onSubmit(values: z.infer<typeof postSchema>) {
    setIsLoading(true);
    try {
      const apiData = {
        title: values.title,
        slug: values.slug,
        contentEn: values.contentEn,
        excerptEn: values.excerptEn,
        status: values.published ? "published" : "draft",
        publishedAt: values.published ? new Date().toISOString() : null,
      };

      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!res.ok) throw new Error("Failed to create post");
      
      toast.success("Post created successfully");
      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while saving the post");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-card rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Create New Post</h2>
          <p className="text-muted-foreground mt-1">Write and publish a new blog article</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-border bg-card backdrop-blur-xl shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Post Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="The Future of Web Development" 
                        className="bg-muted border-border text-foreground focus-visible:ring-primary h-12" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!form.formState.dirtyFields.slug) {
                            form.setValue("slug", generateSlug(e.target.value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">URL Slug</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="the-future-of-web-development" 
                        className="bg-muted border-border text-foreground focus-visible:ring-primary h-12" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="excerptEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Excerpt (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="A short summary of the post..." 
                      className="bg-muted border-border text-foreground focus-visible:ring-primary" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Content</FormLabel>
                  <FormControl>
                    <RichTextEditor content={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 space-y-0 p-4 rounded-xl border border-border bg-muted/50">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-zinc-200">Publish immediately</FormLabel>
                      <FormDescription className="text-muted-foreground text-xs">
                        Make this post visible to the public.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="h-12 px-8 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Save Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
