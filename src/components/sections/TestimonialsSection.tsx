import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Star, Quote, ChevronLeft, ChevronRight} from 'lucide-react'
import { useApp } from '../../App'
import EditableText from '../EditableText'
// TODO: When API calls are needed, import apiClient:
// import { apiClient } from '../../lib/client'

const TestimonialsSection: React.FC = () => {
  const { language, siteSettings, isEditMode, canEdit } = useApp()
  const t = siteSettings.content
  
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: siteSettings.content.testimonials.reviews[0].role[language],
      content: siteSettings.content.testimonials.reviews[0].content[language],
      rating: 5,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 2,
      name: 'Ahmed Al-Rashid',
      role: siteSettings.content.testimonials.reviews[1].role[language],
      content: siteSettings.content.testimonials.reviews[1].content[language],
      rating: 5,
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 3,
      name: 'Maria Schmidt',
      role: siteSettings.content.testimonials.reviews[2].role[language],
      content: siteSettings.content.testimonials.reviews[2].content[language],
      rating: 5,
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 4,
      name: 'David Chen',
      role: siteSettings.content.testimonials.reviews[3].role[language],
      content: siteSettings.content.testimonials.reviews[3].content[language],
      rating: 5,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ]

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-pink-50/50 dark:from-indigo-900/20 dark:to-pink-900/20" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-section font-display font-bold text-gray-900 dark:text-white mb-6">
            <EditableText
              path={`content.testimonials.title.${language}`}
              value={siteSettings.content.testimonials.title[language]}
              type="title"
              className="text-section font-display font-bold text-gray-900 dark:text-white mb-6"
              placeholder="Testimonials Title"
            >
              <span>{siteSettings.content.testimonials.title[language]}</span>
            </EditableText>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            <EditableText
              path={`content.testimonials.description.${language}`}
              value={siteSettings.content.testimonials.description[language]}
              type="textarea"
              className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              placeholder="Testimonials Description"
              multiline
            >
              <span>{siteSettings.content.testimonials.description[language]}</span>
            </EditableText>
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="glass w-12 h-12 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <ChevronLeft size={24} />
            </motion.button>
          </div>

          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="glass w-12 h-12 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>

          {/* Testimonial Cards */}
          <div className="relative h-96 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className="glass rounded-3xl p-8 h-full flex flex-col justify-center">
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Quote size={28} className="text-white" />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={24}
                        className="text-yellow-500 fill-current mx-1"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 text-center leading-relaxed mb-8 font-medium">
                    <EditableText
                      path={`content.testimonials.reviews.${currentIndex}.content.${language}`}
                      value={testimonials[currentIndex].content}
                      type="textarea"
                      className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 text-center leading-relaxed mb-8 font-medium"
                      placeholder="Testimonial Content"
                      multiline
                    >
                      <span>"{testimonials[currentIndex].content}"</span>
                    </EditableText>
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
                    />
                    <div className="text-center">
                      <h4 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        <EditableText
                          path={`content.testimonials.reviews.${currentIndex}.role.${language}`}
                          value={testimonials[currentIndex].role}
                          type="text"
                          className="text-gray-600 dark:text-gray-400"
                          placeholder="Testimonial Role"
                        >
                          <span>{testimonials[currentIndex].role}</span>
                        </EditableText>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 w-8'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { number: '4.9/5', label: siteSettings.content.testimonials.stats.rating[language] },
            { number: '2,500+', label: siteSettings.content.testimonials.stats.reviews[language] },
            { number: '98%', label: siteSettings.content.testimonials.stats.satisfaction[language] }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                <EditableText
                  path={`content.testimonials.stats.${index === 0 ? 'rating' : index === 1 ? 'reviews' : 'satisfaction'}.${language}`}
                  value={stat.label}
                  type="text"
                  className="text-gray-600 dark:text-gray-400 font-medium"
                  placeholder="Stat Label"
                >
                  <span>{stat.label}</span>
                </EditableText>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection