import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditEducationForm } from "./EditEducationForm";

interface EditEducationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEducationPage({ params }: EditEducationPageProps) {
  const { id } = await params;

  const education = await prisma.resumeEducation.findUnique({
    where: { id },
  });

  if (!education) {
    notFound();
  }

  // Pass plain object to client component
  const educationData = {
    id: education.id,
    institution: education.institution,
    degree: education.degree,
    field: education.field,
    startYear: education.startYear,
    endYear: education.endYear || undefined,
    descriptionEn: education.descriptionEn || "",
    descriptionId: education.descriptionId || "",
    order: education.order,
  };

  return <EditEducationForm education={educationData} />;
}
