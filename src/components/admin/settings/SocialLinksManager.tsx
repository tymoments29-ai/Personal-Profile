"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  iconName: string;
  order: number;
};

export default function SocialLinksManager() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    iconName: "Link",
    order: 0,
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    try {
      const res = await fetch("/api/social-links");
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (error) {
      toast.error("Failed to fetch social links");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenNew() {
    setEditingId(null);
    setFormData({ platform: "", url: "", iconName: "Link", order: links.length });
    setIsOpen(true);
  }

  function handleOpenEdit(link: SocialLink) {
    setEditingId(link.id);
    setFormData({ platform: link.platform, url: link.url, iconName: link.iconName, order: link.order });
    setIsOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingId ? `/api/social-links/${editingId}` : "/api/social-links";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingId ? "Social link updated" : "Social link added");
        setIsOpen(false);
        fetchLinks();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save social link");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this social link?")) return;
    try {
      const res = await fetch(`/api/social-links/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Social link deleted");
        fetchLinks();
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="mt-8 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Social Media Links</h3>
          <p className="text-sm text-zinc-400">Manage your dynamic social media icons (e.g. Github, Youtube, Twitter)</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button onClick={handleOpenNew} variant="outline" className="bg-black/20 border-white/10 text-white hover:bg-black/40 hover:text-white shrink-0" />}>
            <Plus className="w-4 h-4 mr-2" /> Add Link
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border border-white/10 text-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Platform Name (e.g. GitHub)</label>
                <Input required value={formData.platform} onChange={e => setFormData({ ...formData, platform: e.target.value })} className="bg-black/40 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">URL</label>
                <Input required type="url" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} className="bg-black/40 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Icon Name (Lucide React)</label>
                <Input required value={formData.iconName} onChange={e => setFormData({ ...formData, iconName: e.target.value })} placeholder="Github, Linkedin, Youtube..." className="bg-black/40 border-white/10 text-white" />
                <p className="text-xs text-zinc-500">Capitalize first letter. Ex: Github, Linkedin, Youtube, Twitch, Twitter, Instagram</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Order</label>
                <Input required type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="bg-black/40 border-white/10 text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="bg-transparent border-white/10 text-white hover:bg-white/5">Cancel</Button>
                <Button type="submit" className="bg-primary text-primary-foreground">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center text-zinc-400 py-8">Loading...</div>
      ) : links.length === 0 ? (
        <div className="text-center text-zinc-500 py-8">No social links added yet. Click "Add Link" to get started.</div>
      ) : (
        <div className="grid gap-3">
          {links.map((link) => {
            const Icon = (LucideIcons as any)[link.iconName] || LucideIcons.Link;
            return (
              <div key={link.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/10 bg-black/20 gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{link.platform}</h4>
                    <p className="text-sm text-zinc-400 truncate">{link.url}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(link)} className="text-zinc-400 hover:text-white hover:bg-white/10">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
