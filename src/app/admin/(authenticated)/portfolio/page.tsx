"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  year: number;
  order: number;
};

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/portfolio");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      toast.error("Failed to load portfolio projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Link href="/admin/portfolio/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading projects...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                      No projects found.
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{project.category}</Badge>
                      </TableCell>
                      <TableCell>{project.year}</TableCell>
                      <TableCell>{project.order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/portfolio/${project.id}/edit`}>
                            <Button variant="outline" size="icon" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="icon"
                            title="Delete"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
