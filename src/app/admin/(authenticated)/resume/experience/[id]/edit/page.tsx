import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditExperienceForm } from "./EditExperienceForm";

interface EditExperiencePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({ params }: EditExperiencePageProps) {
  const { id } = await params;

  const experience = await prisma.resumeExperience.findUnique({
    where: { id },
  });

  if (!experience) {
    notFound();
  }

  // Pass plain object to client component
  const experienceData = {
    id: experience.id,
    company: experience.company,
    position: experience.position,
    startDate: experience.startDate,
    endDate: experience.endDate || "",
    descriptionEn: experience.descriptionEn,
    descriptionId: experience.descriptionId || "",
    responsibilities: experience.responsibilities.join("\n"),
    order: experience.order,
  };

  return <EditExperienceForm experience={experienceData} />;
}
