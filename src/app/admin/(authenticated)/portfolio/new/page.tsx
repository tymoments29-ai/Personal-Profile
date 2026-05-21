"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
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

export default function NewPortfolioProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
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

      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create project");
      
      toast.success("Project created successfully");
      router.push("/admin/portfolio");
    } catch (error) {
      toast.error("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/portfolio">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
          <p className="text-muted-foreground">Add a new project to your portfolio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Fill in the details for your new portfolio project.</CardDescription>
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
              {isSubmitting ? "Saving..." : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Project
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
