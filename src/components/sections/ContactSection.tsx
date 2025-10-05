import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {MapPin, Phone, Mail, Clock, Calendar, Users, X} from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useApp } from '../../App'
import EditableText from '../EditableText'
// TODO: When API calls are needed, import apiClient:
// import { apiClient } from '../../lib/client'

const ContactSection: React.FC = () => {
  const { language, siteSettings, isEditMode, canEdit } = useApp()
  const t = siteSettings.content
  
  const [showReservationModal, setShowReservationModal] = useState(false)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const { register: registerReservation, handleSubmit: handleReservationSubmit, reset: resetReservation, formState: { errors: reservationErrors } } = useForm()

  const onSubmitContact = (data: any) => {
    console.log('Contact form:', data)
    toast.success('Message sent successfully!')
    reset()
  }

  const onSubmitReservation = (data: any) => {
    console.log('Reservation:', data)
    toast.success('Reservation confirmed!')
    resetReservation()
    setShowReservationModal(false)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: siteSettings.content.contact.info.address[language],
      content: siteSettings.content.contactInfo.address
    },
    {
      icon: Phone,
      title: siteSettings.content.contact.info.phone[language],
      content: siteSettings.content.contactInfo.phone
    },
    {
      icon: Mail,
      title: siteSettings.content.contact.info.email[language],
      content: siteSettings.content.contactInfo.email
    },
    {
      icon: Clock,
      title: siteSettings.content.contact.info.hours[language],
      content: siteSettings.content.contact.info.hours[language]
    }
  ]

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/50" />
      
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
              path={`content.contact.title.${language}`}
              value={siteSettings.content.contact.title[language]}
              type="title"
              className="text-section font-display font-bold text-gray-900 dark:text-white mb-6"
              placeholder="Contact Title"
            >
              <span>{siteSettings.content.contact.title[language]}</span>
            </EditableText>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            <EditableText
              path={`content.contact.description.${language}`}
              value={siteSettings.content.contact.description[language]}
              type="textarea"
              className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              placeholder="Contact Description"
              multiline
            >
              <span>{siteSettings.content.contact.description[language]}</span>
            </EditableText>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Side - Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="glass rounded-2xl p-6 hover-lift"
                >
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <info.icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                      <EditableText
                        path={`content.contact.info.${info.icon === MapPin ? 'address' : info.icon === Phone ? 'phone' : info.icon === Mail ? 'email' : 'hours'}.${language}`}
                        value={info.title}
                        type="text"
                        className="text-lg font-display font-bold text-gray-900 dark:text-white"
                        placeholder="Contact Info Title"
                      >
                        <span>{info.title}</span>
                      </EditableText>
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    <EditableText
                      path={`content.contactInfo.${info.icon === MapPin ? 'address' : info.icon === Phone ? 'phone' : info.icon === Mail ? 'email' : 'hours'}`}
                      value={info.content}
                      type="textarea"
                      className="text-gray-600 dark:text-gray-400 leading-relaxed"
                      placeholder="Contact Info Content"
                      multiline
                    >
                      <span>{info.content}</span>
                    </EditableText>
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="glass rounded-2xl overflow-hidden h-64"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968459391!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1635959777812!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Restaurant Location"
              />
            </motion.div>

            {/* Reservation Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReservationModal(true)}
                className="unified-button flex items-center space-x-2 mx-auto"
              >
                <Calendar size={20} />
                <span>
                  <EditableText
                    path={`content.contact.reservation.button.${language}`}
                    value={siteSettings.content.contact.reservation.button[language]}
                    type="text"
                    className=""
                    placeholder="Reservation Button"
                  >
                    <span>{siteSettings.content.contact.reservation.button[language]}</span>
                  </EditableText>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
              Contact Form
            </h3>

            <form onSubmit={handleSubmit(onSubmitContact)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <EditableText
                      path={`content.contact.form.name.${language}`}
                      value={siteSettings.content.contact.form.name[language]}
                      type="text"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      placeholder="Name Label"
                    >
                      <span>{siteSettings.content.contact.form.name[language]}</span>
                    </EditableText>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    {...register('name', { required: 'Name is required' })}
                    className="form-input"
                    placeholder={siteSettings.content.contact.form.namePlaceholder[language]}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <EditableText
                      path={`content.contact.form.email.${language}`}
                      value={siteSettings.content.contact.form.email[language]}
                      type="text"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      placeholder="Email Label"
                    >
                      <span>{siteSettings.content.contact.form.email[language]}</span>
                    </EditableText>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="form-input"
                    placeholder={siteSettings.content.contact.form.emailPlaceholder[language]}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <EditableText
                    path={`content.contact.form.subject.${language}`}
                    value={siteSettings.content.contact.form.subject[language]}
                    type="text"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    placeholder="Subject Label"
                  >
                    <span>{siteSettings.content.contact.form.subject[language]}</span>
                  </EditableText>
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  {...register('subject', { required: 'Subject is required' })}
                  className="form-input"
                  placeholder={siteSettings.content.contact.form.subjectPlaceholder[language]}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message as string}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <EditableText
                    path={`content.contact.form.message.${language}`}
                    value={siteSettings.content.contact.form.message[language]}
                    type="text"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    placeholder="Message Label"
                  >
                    <span>{siteSettings.content.contact.form.message[language]}</span>
                  </EditableText>
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.02 }}
                  {...register('message', { required: 'Message is required' })}
                  rows={4}
                  className="form-input"
                  placeholder={siteSettings.content.contact.form.messagePlaceholder[language]}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message as string}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full unified-button"
              >
                <EditableText
                  path={`content.contact.form.send.${language}`}
                  value={siteSettings.content.contact.form.send[language]}
                  type="text"
                  className="w-full"
                  placeholder="Send Button"
                >
                  <span>{siteSettings.content.contact.form.send[language]}</span>
                </EditableText>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Reservation Modal */}
      <AnimatePresence>
        {showReservationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReservationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                  <EditableText
                    path={`content.contact.reservation.title.${language}`}
                    value={siteSettings.content.contact.reservation.title[language]}
                    type="text"
                    className="text-2xl font-display font-bold text-gray-900 dark:text-white"
                    placeholder="Reservation Title"
                  >
                    <span>{siteSettings.content.contact.reservation.title[language]}</span>
                  </EditableText>
                </h3>
                <button
                  onClick={() => setShowReservationModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleReservationSubmit(onSubmitReservation)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <EditableText
                        path={`content.contact.reservation.date.${language}`}
                        value={siteSettings.content.contact.reservation.date[language]}
                        type="text"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        placeholder="Date Label"
                      >
                        <span>{siteSettings.content.contact.reservation.date[language]}</span>
                      </EditableText>
                    </label>
                    <input
                      {...registerReservation('date', { required: 'Date is required' })}
                      type="date"
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {reservationErrors.date && (
                      <p className="text-red-500 text-sm mt-1">{reservationErrors.date.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <EditableText
                        path={`content.contact.reservation.time.${language}`}
                        value={siteSettings.content.contact.reservation.time[language]}
                        type="text"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        placeholder="Time Label"
                      >
                        <span>{siteSettings.content.contact.reservation.time[language]}</span>
                      </EditableText>
                    </label>
                    <input
                      {...registerReservation('time', { required: 'Time is required' })}
                      type="time"
                      className="form-input"
                    />
                    {reservationErrors.time && (
                      <p className="text-red-500 text-sm mt-1">{reservationErrors.time.message as string}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <EditableText
                      path={`content.contact.reservation.guests.${language}`}
                      value={siteSettings.content.contact.reservation.guests[language]}
                      type="text"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      placeholder="Guests Label"
                    >
                      <span>{siteSettings.content.contact.reservation.guests[language]}</span>
                    </EditableText>
                  </label>
                  <select
                    {...registerReservation('guests', { required: 'Number of guests is required' })}
                    className="form-input"
                  >
                    <option value="">Select guests</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                  {reservationErrors.guests && (
                    <p className="text-red-500 text-sm mt-1">{reservationErrors.guests.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <EditableText
                      path={`content.contact.reservation.name.${language}`}
                      value={siteSettings.content.contact.reservation.name[language]}
                      type="text"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      placeholder="Name Label"
                    >
                      <span>{siteSettings.content.contact.reservation.name[language]}</span>
                    </EditableText>
                  </label>
                  <input
                    {...registerReservation('name', { required: 'Name is required' })}
                    className="form-input"
                    placeholder="Your name"
                  />
                  {reservationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{reservationErrors.name.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <EditableText
                      path={`content.contact.reservation.phone.${language}`}
                      value={siteSettings.content.contact.reservation.phone[language]}
                      type="text"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      placeholder="Phone Label"
                    >
                      <span>{siteSettings.content.contact.reservation.phone[language]}</span>
                    </EditableText>
                  </label>
                  <input
                    {...registerReservation('phone', { required: 'Phone is required' })}
                    type="tel"
                    className="form-input"
                    placeholder="Your phone number"
                  />
                  {reservationErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{reservationErrors.phone.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <EditableText
                      path={`content.contact.reservation.notes.${language}`}
                      value={siteSettings.content.contact.reservation.notes[language]}
                      type="text"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      placeholder="Notes Label"
                    >
                      <span>{siteSettings.content.contact.reservation.notes[language]}</span>
                    </EditableText>
                  </label>
                  <textarea
                    {...registerReservation('notes')}
                    rows={3}
                    className="form-input"
                    placeholder="Special requests or dietary requirements"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Users size={20} />
                  <span>
                    <EditableText
                      path={`content.contact.reservation.confirm.${language}`}
                      value={siteSettings.content.contact.reservation.confirm[language]}
                      type="text"
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                      placeholder="Confirm Button"
                    >
                      <span>{siteSettings.content.contact.reservation.confirm[language]}</span>
                    </EditableText>
                  </span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ContactSection