"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
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
  responsibilities: z.array(z.object({ value: z.string().min(1, "Required") })).min(1, "At least one responsibility is required"),
  order: z.number().int().default(0),
});

export function NewExperienceForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      descriptionEn: "",
      descriptionId: "",
      responsibilities: [{ value: "" }],
      order: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "responsibilities",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const apiData = {
        ...values,
        endDate: values.endDate || undefined,
        responsibilities: values.responsibilities.map((r) => r.value),
      };

      const res = await fetch(`/api/resume/experience`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!res.ok) throw new Error("Failed to add experience");

      toast.success("Experience added successfully");
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Add Experience</h2>
          <p className="text-muted-foreground text-sm">Create a new experience entry</p>
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
                    <FormLabel className="text-foreground">Company / Organization</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Google" className="bg-muted border-border text-foreground" {...field} />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Position</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Senior Software Engineer" className="bg-muted border-border text-foreground" {...field} />
                    </FormControl>
                    <FormMessage className="text-destructive" />
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
                    <FormLabel className="text-foreground">Start Date</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jan 2020" className="bg-muted border-border text-foreground" {...field} />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">End Date (Leave empty if Present)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Dec 2022" className="bg-muted border-border text-foreground" {...field} />
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
                  <FormLabel className="text-foreground">Summary (EN)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief summary of your role..." className="bg-muted border-border text-foreground min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="text-foreground mb-2 block">Key Responsibilities</FormLabel>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`responsibilities.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input placeholder="e.g. Developed scalable microservices..." className="bg-muted border-border text-foreground" {...field} />
                            {fields.length > 1 && (
                              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })} className="mt-2 text-foreground border-border bg-background">
                  <Plus className="mr-2 h-3 w-3" /> Add Responsibility
                </Button>
              </div>
            </div>

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
                Add Experience
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
