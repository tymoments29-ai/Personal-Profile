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
import { Checkbox } from "@/components/ui/checkbox";

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  avatarUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  quoteEn: z.string().min(1, "English quote is required"),
  quoteId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  order: z.number().int(),
  isActive: z.boolean(),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export default function NewTestimonialPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      position: "",
      avatarUrl: "",
      quoteEn: "",
      quoteId: "",
      rating: 5,
      order: 0,
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  const onSubmit = async (data: TestimonialFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        avatarUrl: data.avatarUrl || null,
      };

      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create testimonial");
      
      toast.success("Testimonial created successfully");
      router.push("/admin/testimonials");
    } catch (error) {
      toast.error("Failed to create testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/testimonials">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Testimonial</h1>
          <p className="text-muted-foreground">Add a new testimonial from a client or colleague</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Testimonial Details</CardTitle>
            <CardDescription>Fill in the feedback provided by the person.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                <Input id="name" {...register("name")} placeholder="e.g. John Doe" />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position/Company <span className="text-red-500">*</span></Label>
                <Input id="position" {...register("position")} placeholder="e.g. CEO at TechCorp" />
                {errors.position && <p className="text-sm text-red-500">{errors.position.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input id="avatarUrl" {...register("avatarUrl")} placeholder="https://example.com/avatar.jpg" />
              {errors.avatarUrl && <p className="text-sm text-red-500">{errors.avatarUrl.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quoteEn">Quote (EN) <span className="text-red-500">*</span></Label>
                <Textarea id="quoteEn" {...register("quoteEn")} rows={4} placeholder="Their feedback in English..." />
                {errors.quoteEn && <p className="text-sm text-red-500">{errors.quoteEn.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="quoteId">Quote (ID)</Label>
                <Textarea id="quoteId" {...register("quoteId")} rows={4} placeholder="Their feedback in Indonesian (optional)..." />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5) <span className="text-red-500">*</span></Label>
                <Input id="rating" type="number" min="1" max="5" {...register("rating", { valueAsNumber: true })} />
                {errors.rating && <p className="text-sm text-red-500">{errors.rating.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order <span className="text-red-500">*</span></Label>
                <Input id="order" type="number" {...register("order", { valueAsNumber: true })} />
                {errors.order && <p className="text-sm text-red-500">{errors.order.message}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="isActive" 
                checked={isActive} 
                onCheckedChange={(checked) => setValue("isActive", checked === true)} 
              />
              <Label htmlFor="isActive" className="text-sm font-normal">
                Display this testimonial publicly
              </Label>
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? "Saving..." : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Testimonial
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
