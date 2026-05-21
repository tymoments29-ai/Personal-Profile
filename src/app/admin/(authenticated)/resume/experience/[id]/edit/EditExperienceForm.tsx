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
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().optional(),
  descriptionEn: z.string().min(1, "Description is required"),
  descriptionId: z.string().optional(),
  responsibilities: z.string().min(1, "Responsibilities are required"),
  order: z.number().int(),
});

interface EditExperienceFormProps {
  experience: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    descriptionEn: string;
    descriptionId: string;
    responsibilities: string;
    order: number;
  };
}

export function EditExperienceForm({ experience }: EditExperienceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: experience.company,
      position: experience.position,
      startDate: experience.startDate,
      endDate: experience.endDate,
      descriptionEn: experience.descriptionEn,
      descriptionId: experience.descriptionId,
      responsibilities: experience.responsibilities,
      order: experience.order,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const apiData = {
        ...values,
        responsibilities: values.responsibilities.split("\n").filter(r => r.trim() !== ""),
        endDate: values.endDate || null,
      };

      const res = await fetch(`/api/resume/experience/${experience.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!res.ok) throw new Error("Failed to update experience");

      toast.success("Experience updated successfully");
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Edit Experience</h2>
          <p className="text-muted-foreground text-sm">Update your work experience entry</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-border bg-card backdrop-blur-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Company</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Google" className="bg-muted border-border text-foreground" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Position</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Software Engineer" className="bg-muted border-border text-foreground" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Start Date</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2021" className="bg-muted border-border text-foreground" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">End Date (Leave empty if Present)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2023" className="bg-muted border-border text-foreground" {...field} />
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
                  <FormLabel className="text-muted-foreground">Description (EN)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Short description of your role..." className="bg-muted border-border text-foreground min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descriptionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Description (ID - Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Deskripsi singkat tentang peran Anda..." className="bg-muted border-border text-foreground min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsibilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Responsibilities (One per line)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="- Developed new features&#10;- Optimized database queries" className="bg-muted border-border text-foreground min-h-[120px]" {...field} />
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
