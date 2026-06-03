import { getAdminTestimonials } from "@/features/admin/actions/content";
import { AdminPageHeader } from "@/features/admin/components/shared/admin-page-header";
import { TestimonialManager } from "@/features/admin/components/testimonials/testimonial-manager";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAdminTestimonials();

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Manage client reviews and ratings"
      />
      <TestimonialManager testimonials={testimonials} />
    </div>
  );
}
