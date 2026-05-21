import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditTestimonialForm } from "./EditTestimonialForm";

interface EditTestimonialPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const { id } = await params;

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial) {
    notFound();
  }

  // Pass plain object to client component
  const testimonialData = {
    id: testimonial.id,
    name: testimonial.name,
    position: testimonial.position,
    avatarUrl: testimonial.avatarUrl || "",
    quoteEn: testimonial.quoteEn,
    quoteId: testimonial.quoteId || "",
    rating: testimonial.rating,
    order: testimonial.order,
    isActive: testimonial.isActive,
  };

  return <EditTestimonialForm testimonial={testimonialData} />;
}
