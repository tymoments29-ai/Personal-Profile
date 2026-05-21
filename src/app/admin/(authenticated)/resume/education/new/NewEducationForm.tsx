"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, Plus } from "lucide-react";
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
  order: z.number().int().default(0),
});

export function NewEducationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      startYear: new Date().getFullYear(),
      endYear: undefined,
      descriptionEn: "",
      descriptionId: "",
      order: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const apiData = {
        ...values,
        endYear: values.endYear || undefined, // or null based on Prisma requirements
      };

      const res = await fetch(`/api/resume/education`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!res.ok) throw new Error("Failed to add education");

      toast.success("Education added successfully");
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Add Education</h2>
          <p className="text-muted-foreground text-sm">Create a new education entry</p>
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
                  <FormLabel className="text-foreground">Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. University of Technology" className="bg-muted border-border text-foreground" {...field} />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Bachelor of Science" className="bg-muted border-border text-foreground" {...field} />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Field of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Computer Science" className="bg-muted border-border text-foreground" {...field} />
                    </FormControl>
                    <FormMessage className="text-destructive" />
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
                    <FormLabel className="text-foreground">Start Year</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 2018" className="bg-muted border-border text-foreground" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">End Year (Leave empty if Present)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 2022" className="bg-muted border-border text-foreground" {...field} onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descriptionEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Description (EN - Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional details..." className="bg-muted border-border text-foreground min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Display Order</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-muted border-border text-foreground max-w-[200px]" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Add Education
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
