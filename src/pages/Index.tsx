
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import NavbarWithDashboard from '@/components/NavbarWithDashboard';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AIFeatures from '@/components/AIFeatures';
import Footer from '@/components/Footer';
import CommandPalette from '@/components/CommandPalette';

const Index = () => {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Study Bee - Adaptive Learning with AI</title>
        <meta 
          name="description" 
          content="Study Bee is the world's most adaptive, autonomous, and secure learning OS, blending a Python‑first micro‑service architecture, Rust performance kernels, a QuorumForge agent fabric, and cost‑optimised multi‑LLM routing to serve 400+ subjects across school, vocational, professional, and university levels." 
        />
      </Helmet>
      <NavbarWithDashboard />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AIFeatures />
      </main>
      <Footer />
      <CommandPalette open={commandOpen} setOpen={setCommandOpen} />
    </>
  );
};

export default Index;
