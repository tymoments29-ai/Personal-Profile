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

interface EditServiceFormProps {
  service: {
    id: string;
    title: string;
    description: string;
    iconName: string;
    colorClass: string;
    iconColor: string;
    order: number;
  };
}

export function EditServiceForm({ service }: EditServiceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: service.title,
      description: service.description,
      iconName: service.iconName,
      colorClass: service.colorClass,
      iconColor: service.iconColor,
      order: service.order,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to update service");

      toast.success("Service updated successfully");
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
          <h2 className="text-2xl font-bold tracking-tight text-white">Edit Service</h2>
          <p className="text-zinc-400 text-sm">Update item for "What I Do"</p>
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
                      <select
                        className="flex h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                        {...field}
                      >
                        <option value="Terminal" className="bg-zinc-900">Terminal / Linux / CLI</option>
                        <option value="Server" className="bg-zinc-900">Server / Data Center</option>
                        <option value="Cloud" className="bg-zinc-900">Cloud Platform</option>
                        <option value="GitBranch" className="bg-zinc-900">DevOps / CI-CD</option>
                        <option value="Code" className="bg-zinc-900">Web Development</option>
                        <option value="Monitor" className="bg-zinc-900">Web Design</option>
                        <option value="Briefcase" className="bg-zinc-900">Project Manager</option>
                        <option value="Network" className="bg-zinc-900">Networking</option>
                        <option value="Database" className="bg-zinc-900">Database</option>
                        <option value="ShieldCheck" className="bg-zinc-900">Security</option>
                        <option value="Settings" className="bg-zinc-900">SysAdmin</option>
                        <option value="Blocks" className="bg-zinc-900">Containers</option>
                      </select>
                    </FormControl>
                    <p className="text-xs text-zinc-500">Pilih icon yang sesuai dengan jenis layanan IT.</p>
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
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
