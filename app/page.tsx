import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { SuccessStories } from '@/components/SuccessStories';
import { LeadQualityGuarantee } from '@/components/LeadQualityGuarantee';
import { AppointmentBook } from '@/components/AppointmentBook';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { FAQ } from '@/components/FAQ';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute requireAuth={false}>
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <LeadQualityGuarantee />
      <AppointmentBook />
      <WhyChooseUs />
      <SuccessStories />
      <FAQ />
      <Footer />
      </>
    </ProtectedRoute>
  );
}