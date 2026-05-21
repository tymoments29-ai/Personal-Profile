"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  thumbnailUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  descriptionEn: z.string().min(1, "English description is required"),
  descriptionId: z.string().optional(),
  techStack: z.string().min(1, "Tech stack is required (comma separated)"),
  repoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  year: z.number().int().min(1900).max(2100),
  order: z.number().int(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function EditPortfolioProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      category: "web-development",
      thumbnailUrl: "",
      descriptionEn: "",
      descriptionId: "",
      techStack: "",
      repoUrl: "",
      liveUrl: "",
      year: new Date().getFullYear(),
      order: 0,
    },
  });

  // Load existing project data
  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/portfolio/${id}`);
        if (!res.ok) throw new Error("Project not found");
        const data = await res.json();
        reset({
          title: data.title || "",
          category: data.category || "web-development",
          thumbnailUrl: data.thumbnailUrl || "",
          descriptionEn: data.descriptionEn || "",
          descriptionId: data.descriptionId || "",
          techStack: Array.isArray(data.techStack) ? data.techStack.join(", ") : "",
          repoUrl: data.repoUrl || "",
          liveUrl: data.liveUrl || "",
          year: data.year || new Date().getFullYear(),
          order: data.order ?? 0,
        });
      } catch (error) {
        toast.error("Failed to load project data");
        router.push("/admin/portfolio");
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [id, reset, router]);

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        techStack: data.techStack.split(",").map((tech) => tech.trim()).filter(Boolean),
        thumbnailUrl: data.thumbnailUrl || null,
        repoUrl: data.repoUrl || null,
        liveUrl: data.liveUrl || null,
      };

      const res = await fetch(`/api/portfolio/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update project");

      toast.success("Project updated successfully");
      router.push("/admin/portfolio");
    } catch (error) {
      toast.error("Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Project deleted successfully");
      router.push("/admin/portfolio");
    } catch (error) {
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/portfolio">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
            <p className="text-muted-foreground">Update your portfolio project details</p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
        >
          {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
          Delete Project
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Update the details for this portfolio project.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input id="title" {...register("title")} placeholder="e.g. My Awesome App" />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                <Input id="category" {...register("category")} placeholder="e.g. web-development" />
                {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input id="thumbnailUrl" {...register("thumbnailUrl")} placeholder="https://example.com/image.jpg" />
              {errors.thumbnailUrl && <p className="text-sm text-red-500">{errors.thumbnailUrl.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="descriptionEn">Description (EN) <span className="text-red-500">*</span></Label>
                <Textarea id="descriptionEn" {...register("descriptionEn")} rows={5} placeholder="English description..." />
                {errors.descriptionEn && <p className="text-sm text-red-500">{errors.descriptionEn.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionId">Description (ID)</Label>
                <Textarea id="descriptionId" {...register("descriptionId")} rows={5} placeholder="Indonesian description..." />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack <span className="text-red-500">*</span></Label>
              <Input id="techStack" {...register("techStack")} placeholder="React, Next.js, TailwindCSS (comma separated)" />
              {errors.techStack && <p className="text-sm text-red-500">{errors.techStack.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="repoUrl">Repository URL</Label>
                <Input id="repoUrl" {...register("repoUrl")} placeholder="https://github.com/..." />
                {errors.repoUrl && <p className="text-sm text-red-500">{errors.repoUrl.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live URL</Label>
                <Input id="liveUrl" {...register("liveUrl")} placeholder="https://..." />
                {errors.liveUrl && <p className="text-sm text-red-500">{errors.liveUrl.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="year">Year <span className="text-red-500">*</span></Label>
                <Input id="year" type="number" {...register("year", { valueAsNumber: true })} />
                {errors.year && <p className="text-sm text-red-500">{errors.year.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order <span className="text-red-500">*</span></Label>
                <Input id="order" type="number" {...register("order", { valueAsNumber: true })} />
                {errors.order && <p className="text-sm text-red-500">{errors.order.message}</p>}
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Save Changes</>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
