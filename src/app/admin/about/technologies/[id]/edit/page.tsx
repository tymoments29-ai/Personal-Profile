import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditTechnologyForm } from "./EditTechnologyForm";

interface EditTechnologyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTechnologyPage({ params }: EditTechnologyPageProps) {
  const { id } = await params;

  const technology = await prisma.technology.findUnique({
    where: { id },
  });

  if (!technology) {
    notFound();
  }

  // Pass plain object to client component
  const technologyData = {
    id: technology.id,
    name: technology.name,
    order: technology.order,
  };

  return <EditTechnologyForm technology={technologyData} />;
}
