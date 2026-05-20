import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditServiceForm } from "./EditServiceForm";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    notFound();
  }

  // Pass plain object to client component
  const serviceData = {
    id: service.id,
    title: service.title,
    description: service.description,
    iconName: service.iconName,
    colorClass: service.colorClass,
    iconColor: service.iconColor,
    order: service.order,
  };

  return <EditServiceForm service={serviceData} />;
}
