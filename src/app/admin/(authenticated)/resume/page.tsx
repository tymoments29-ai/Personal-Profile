"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus, Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number | null;
  order: number;
};

type Experience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  order: number;
};

export default function AdminResumePage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loadingEdu, setLoadingEdu] = useState(true);
  const [loadingExp, setLoadingExp] = useState(true);

  const fetchEducations = async () => {
    try {
      const res = await fetch("/api/resume/education");
      if (!res.ok) throw new Error("Failed to fetch education data");
      const data = await res.json();
      setEducations(data);
    } catch (error) {
      toast.error("Failed to load education data");
    } finally {
      setLoadingEdu(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/resume/experience");
      if (!res.ok) throw new Error("Failed to fetch experience data");
      const data = await res.json();
      setExperiences(data);
    } catch (error) {
      toast.error("Failed to load experience data");
    } finally {
      setLoadingExp(false);
    }
  };

  useEffect(() => {
    fetchEducations();
    fetchExperiences();
  }, []);

  const handleDeleteEdu = async (id: string) => {
    if (!confirm("Delete this education entry?")) return;
    try {
      const res = await fetch(`/api/resume/education/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Education deleted");
      fetchEducations();
    } catch (error) {
      toast.error("Failed to delete education");
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!confirm("Delete this experience entry?")) return;
    try {
      const res = await fetch(`/api/resume/experience/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Experience deleted");
      fetchExperiences();
    } catch (error) {
      toast.error("Failed to delete experience");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume</h1>
        <p className="text-muted-foreground">Manage your education and experience</p>
      </div>

      <Tabs defaultValue="experience" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>
        
        <TabsContent value="experience" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Experience List</h2>
            <Link href="/admin/resume/experience/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="p-0">
              {loadingExp ? (
                <div className="text-center py-8">Loading experience...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {experiences.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No experience entries found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      experiences.map((exp) => (
                        <TableRow key={exp.id}>
                          <TableCell className="font-medium">{exp.company}</TableCell>
                          <TableCell>{exp.position}</TableCell>
                          <TableCell>{exp.startDate} - {exp.endDate || "Present"}</TableCell>
                          <TableCell>{exp.order}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/resume/experience/${exp.id}/edit`}>
                                <Button variant="outline" size="icon" title="Edit">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteExp(exp.id)}
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
        </TabsContent>
        
        <TabsContent value="education" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Education List</h2>
            <Link href="/admin/resume/education/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Education
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="p-0">
              {loadingEdu ? (
                <div className="text-center py-8">Loading education...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Institution</TableHead>
                      <TableHead>Degree</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {educations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No education entries found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      educations.map((edu) => (
                        <TableRow key={edu.id}>
                          <TableCell className="font-medium">{edu.institution}</TableCell>
                          <TableCell>{edu.degree} in {edu.field}</TableCell>
                          <TableCell>{edu.startYear} - {edu.endYear || "Present"}</TableCell>
                          <TableCell>{edu.order}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/resume/education/${edu.id}/edit`}>
                                <Button variant="outline" size="icon" title="Edit">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteEdu(edu.id)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
