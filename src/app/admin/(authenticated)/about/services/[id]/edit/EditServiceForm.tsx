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
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Edit Service</h2>
          <p className="text-muted-foreground text-sm">Update item for "What I Do"</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-border bg-card backdrop-blur-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Cloud Infrastructure" className="bg-muted border-border text-foreground" {...field} />
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
                  <FormLabel className="text-muted-foreground">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the service..." className="bg-muted border-border text-foreground min-h-[100px]" {...field} />
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
                    <FormLabel className="text-muted-foreground">Lucide Icon Name</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
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
                    <p className="text-xs text-muted-foreground">Pilih icon yang sesuai dengan jenis layanan IT.</p>
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
                      <Input type="number" className="bg-muted border-border text-foreground" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
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
                    <FormLabel className="text-muted-foreground">Background Gradient</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. from-blue-500/20 to-blue-600/10" className="bg-muted border-border text-foreground" {...field} />
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
                    <FormLabel className="text-muted-foreground">Icon Color</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. text-blue-400" className="bg-muted border-border text-foreground" {...field} />
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
