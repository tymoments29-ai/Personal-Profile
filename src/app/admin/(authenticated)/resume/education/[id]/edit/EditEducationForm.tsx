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
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field is required"),
  startYear: z.number().int().min(1900),
  endYear: z.number().int().optional(),
  descriptionEn: z.string().optional(),
  descriptionId: z.string().optional(),
  order: z.number().int(),
});

interface EditEducationFormProps {
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
    descriptionEn: string;
    descriptionId: string;
    order: number;
  };
}

export function EditEducationForm({ education }: EditEducationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institution: education.institution,
      degree: education.degree,
      field: education.field,
      startYear: education.startYear,
      endYear: education.endYear,
      descriptionEn: education.descriptionEn,
      descriptionId: education.descriptionId,
      order: education.order,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const apiData = {
        ...values,
        endYear: values.endYear || null,
      };

      const res = await fetch(`/api/resume/education/${education.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!res.ok) throw new Error("Failed to update education");

      toast.success("Education updated successfully");
      router.push("/admin/resume");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/resume">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Edit Education</h2>
          <p className="text-muted-foreground text-sm">Update your education entry</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-border bg-card backdrop-blur-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. University of Technology" className="bg-muted border-border text-foreground" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Bachelor of Science" className="bg-muted border-border text-foreground" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Field of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Computer Science" className="bg-muted border-border text-foreground" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Start Year</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 2018" className="bg-muted border-border text-foreground" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">End Year (Leave empty if Present)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 2022" className="bg-muted border-border text-foreground" {...field} onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descriptionEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Description (EN - Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional details..." className="bg-muted border-border text-foreground min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Display Order</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-muted border-border text-foreground max-w-[200px]" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-[var(--gold)] text-black hover:bg-[var(--gold-hover)]" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
