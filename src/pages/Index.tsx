
import PageLayout from '@/components/layout/PageLayout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import StatsSection from '@/components/home/StatsSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CtaSection from '@/components/home/CtaSection';

const Index = () => {
  return (
    <PageLayout>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <FeaturedProperties />
      <TestimonialsSection />
      <CtaSection />
    </PageLayout>
  );
};

export default Index;
