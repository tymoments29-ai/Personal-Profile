import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function AboutAdminPage() {
  const [services, technologies] = await Promise.all([
    prisma.service.findMany({ orderBy: { order: "asc" } }),
    prisma.technology.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">About Details</h2>
          <p className="text-zinc-400 mt-1">Manage services (What I Do) and Core Technologies</p>
        </div>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="services" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Services (What I Do)
          </TabsTrigger>
          <TabsTrigger value="technologies" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Core Technologies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-end">
            <Link href="/admin/about/services/new">
              <Button className="bg-primary text-black hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Service
              </Button>
            </Link>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <table className="w-full text-sm text-left text-zinc-300">
              <thead className="text-xs uppercase bg-black/40 text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Icon Name</th>
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((item) => (
                  <tr key={item.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{item.title}</td>
                    <td className="px-6 py-4">{item.iconName}</td>
                    <td className="px-6 py-4">{item.order}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/admin/about/services/${item.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No services found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="technologies" className="space-y-4">
          <div className="flex justify-end">
            <Link href="/admin/about/technologies/new">
              <Button className="bg-primary text-black hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Technology
              </Button>
            </Link>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <table className="w-full text-sm text-left text-zinc-300">
              <thead className="text-xs uppercase bg-black/40 text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {technologies.map((item) => (
                  <tr key={item.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                    <td className="px-6 py-4">{item.order}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/admin/about/technologies/${item.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {technologies.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">No technologies found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
