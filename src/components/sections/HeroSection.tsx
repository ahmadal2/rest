import React from 'react'
import { motion } from 'framer-motion'
import {Star, Clock, Award} from 'lucide-react'
import { useApp } from '../../App'
import EditableText from '../EditableText'
import EditableImage from '../EditableImage'
import EditableColor from '../EditableColor'
// TODO: When API calls are needed, import apiClient:
// import { apiClient } from '../../lib/client'

const HeroSection: React.FC = () => {
  const { language, siteSettings, isEditMode, canEdit } = useApp()
  const t = siteSettings.content

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${siteSettings.images.heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Editable Background */}
      {isEditMode && canEdit() && (
        <div className="absolute top-4 right-4 z-10 bg-black/70 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="text-white text-sm font-medium">Hero Area Edit:</div>
            <EditableImage
              path="images.heroBackground"
              value={siteSettings.images.heroBackground}
              alt="Hero Background"
              className="w-16 h-16 rounded-lg overflow-hidden"
            />
            <EditableColor
              path="colors.heroBg"
              value={siteSettings.colors.heroBg}
              label="Background Overlay"
            />
          </div>
        </div>
      )}

      {/* Modern Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Editable Title */}
          <EditableText
            path={`content.heroTitle.${language}`}
            value={siteSettings.content.heroTitle[language]}
            type="title"
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight"
            placeholder="Enter main title..."
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight">
              {siteSettings.content.heroTitle[language]}
            </h1>
          </EditableText>

          {/* Editable Subtitle */}
          <EditableText
            path={`content.heroSubtitle.${language}`}
            value={siteSettings.content.heroSubtitle[language]}
            type="subtitle"
            className="text-lg md:text-xl lg:text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed"
            placeholder="Enter subtitle..."
            multiline
          >
            <p className="text-lg md:text-xl lg:text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
              {siteSettings.content.heroSubtitle[language]}
            </p>
          </EditableText>

          {/* Modern Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto"
          >
            {[
              { icon: Star, value: '4.9', label: t.hero.stats.rating[language], color: 'text-yellow-400' },
              { icon: Clock, value: '15+', label: t.hero.stats.years[language], color: 'text-blue-400' },
              { icon: Award, value: '25+', label: t.hero.stats.customers[language], color: 'text-green-400' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03, y: -3 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-purple-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-base md:text-lg px-6 py-3 rounded-lg"
              onClick={() => {
                const menuSection = document.getElementById('menu')
                if (menuSection) {
                  menuSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              <EditableText
                path={`content.hero.cta.reservation.${language}`}
                value={siteSettings.content.hero.cta.reservation[language]}
                type="button"
                className="btn-primary text-base md:text-lg px-6 py-3 rounded-lg"
                placeholder="Reservation Button"
              >
                <span>{siteSettings.content.hero.cta.reservation[language]}</span>
              </EditableText>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-glass text-base md:text-lg px-6 py-3 rounded-lg"
              onClick={() => {
                const contactSection = document.getElementById('contact')
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              <EditableText
                path={`content.hero.cta.location.${language}`}
                value={siteSettings.content.hero.cta.location[language]}
                type="button"
                className="btn-glass text-base md:text-lg px-6 py-3 rounded-lg"
                placeholder="Location Button"
              >
                <span>{siteSettings.content.hero.cta.location[language]}</span>
              </EditableText>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border-2 border-purple-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-purple-400 rounded-full mt-1"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection