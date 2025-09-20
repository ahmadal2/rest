
import React from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../App'
import EditableText from '../EditableText'
import EditableImage from '../EditableImage'
// TODO: When API calls are needed, import apiClient:
// import { apiClient } from '../../lib/client'

const AboutSection: React.FC = () => {
  const { language, siteSettings } = useApp()

  // Sichere Zugriffe mit Fallback-Werten
  const aboutTitle = siteSettings?.content?.aboutTitle?.[language] || 'Über unser Restaurant'
  const aboutDescription = siteSettings?.content?.aboutDescription?.[language] || 'Wir sind leidenschaftlich dabei, unvergessliche kulinarische Erlebnisse zu schaffen.'
  const aboutImage = siteSettings?.images?.aboutImage || 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg'

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 rounded-full"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-white/20 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <EditableText
                path={`content.aboutTitle.${language}`}
                value={aboutTitle}
                type="title"
                className="text-4xl lg:text-5xl font-display font-bold text-white neon-text leading-tight"
              />

              <EditableText
                path={`content.aboutDescription.${language}`}
                value={aboutDescription}
                type="textarea"
                multiline={true}
                className="text-lg text-white leading-relaxed"
              />
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-cyan-400 mb-2">15+</div>
                <div className="text-gray-300">Jahre Erfahrung</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
                <div className="text-gray-300">Exquisite Desserts</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-pink-400 mb-2">1000+</div>
                <div className="text-gray-300">Zufriedene Gäste</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
                <div className="text-gray-300">Service</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              
              <EditableImage
                path="images.aboutImage"
                value={aboutImage}
                alt="Restaurant Interior"
                className="relative w-full h-96 lg:h-[500px] object-cover rounded-3xl transform group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-3xl" />
              
              <div className="absolute bottom-8 left-8 text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="space-y-2"
                >
                  <div className="text-sm font-medium text-cyan-400">
                    <EditableText
                      path="content.about.overlay.quality"
                      value="Premium Qualität"
                      type="text"
                      className="text-sm font-medium text-cyan-400"
                      placeholder="Quality Text"
                    >
                      <span>Premium Qualität</span>
                    </EditableText>
                  </div>
                  <div className="text-xl font-bold">
                    <EditableText
                      path="content.about.overlay.perfection"
                      value="Handwerkliche Perfektion"
                      type="text"
                      className="text-xl font-bold"
                      placeholder="Perfection Text"
                    >
                      <span>Handwerkliche Perfektion</span>
                    </EditableText>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute -top-8 -right-8 glass-card rounded-2xl p-4 backdrop-blur-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">⭐</span>
                </div>
                <div>
                  <div className="text-white font-bold">4.9/5</div>
                  <div className="text-gray-400 text-sm">
                    <EditableText
                      path="content.about.overlay.rating"
                      value="Bewertung"
                      type="text"
                      className="text-gray-400 text-sm"
                      placeholder="Rating Text"
                    >
                      <span>Bewertung</span>
                    </EditableText>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute -bottom-8 -left-8 glass-card rounded-2xl p-4 backdrop-blur-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🏆</span>
                </div>
                <div>
                  <div className="text-white font-bold">
                    <EditableText
                      path="content.about.overlay.award"
                      value="Award"
                      type="text"
                      className="text-white font-bold"
                      placeholder="Award Text"
                    >
                      <span>Award</span>
                    </EditableText>
                  </div>
                  <div className="text-gray-400 text-sm">
                    <EditableText
                      path="content.about.overlay.winner"
                      value="Winner 2024"
                      type="text"
                      className="text-gray-400 text-sm"
                      placeholder="Winner Text"
                    >
                      <span>Winner 2024</span>
                    </EditableText>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
