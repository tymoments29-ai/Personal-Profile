"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface BlogActionsProps {
  id: string;
}

export function BlogActions({ id }: BlogActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete blog post");
      }

      toast.success("Blog post deleted successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete blog post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Link href={`/admin/blog/${id}/edit`}>
        <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}
