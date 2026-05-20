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
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  iconName: z.string().min(1, "Icon name is required"),
  colorClass: z.string().min(1, "Color class is required"),
  iconColor: z.string().min(1, "Icon color class is required"),
  order: z.number().int(),
});

export default function NewServicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      iconName: "Cloud",
      colorClass: "from-blue-500/20 to-blue-600/10",
      iconColor: "text-blue-400",
      order: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to create service");

      toast.success("Service created successfully");
      router.push("/admin/about");
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
        <Link href="/admin/about">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Add New Service</h2>
          <p className="text-zinc-400 text-sm">Create a new item for "What I Do"</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Cloud Infrastructure" className="bg-black/40 border-white/10 text-white" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the service..." className="bg-black/40 border-white/10 text-white min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="iconName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Lucide Icon Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Server, Cloud, Code" className="bg-black/40 border-white/10 text-white" {...field} />
                    </FormControl>
                    <p className="text-xs text-zinc-500">Must be a valid Lucide React icon name.</p>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-black/40 border-white/10 text-white" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="colorClass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Background Gradient</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. from-blue-500/20 to-blue-600/10" className="bg-black/40 border-white/10 text-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iconColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Icon Color</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. text-blue-400" className="bg-black/40 border-white/10 text-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-[var(--gold)] text-black hover:bg-[var(--gold-hover)]" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Service
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
