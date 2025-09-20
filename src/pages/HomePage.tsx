
import React from 'react'
import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import MenuSection from '../components/sections/MenuSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import ContactSection from '../components/sections/ContactSection'
import Footer from '../components/Footer'

const HomePage: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default HomePage
