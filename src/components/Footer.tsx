import React from 'react'
import { motion } from 'framer-motion'
import {Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone, Heart} from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useApp } from '../App'
import EditableText from './EditableText'
import './footer-styles.css'

const Footer: React.FC = () => {
  const { language, siteSettings, isEditMode, canEdit } = useApp()
  const t = siteSettings.content.footer
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmitNewsletter = (data: any) => {
    console.log('Newsletter signup:', data)
    toast.success(siteSettings.content.footer.newsletter.success[language])
    reset()
  }

  const socialLinks = [
    { icon: Facebook, href: '#', color: '' },
    { icon: Instagram, href: '#', color: '' },
    { icon: Twitter, href: '#', color: '' },
    { icon: Youtube, href: '#', color: '' }
  ]

  const quickLinks = [
    { name: siteSettings.content.footer.links.about[language], href: '#about' },
    { name: siteSettings.content.footer.links.menu[language], href: '#menu' },
    { name: siteSettings.content.footer.links.reservations[language], href: '#contact' },
    { name: siteSettings.content.footer.links.contact[language], href: '#contact' }
  ]

  return (
    <footer className="relative text-white overflow-hidden footer-container">
      {/* Edit Mode Controls */}
      {isEditMode && canEdit() && (
        <div className="absolute top-4 right-4 z-20 bg-orange-900/70 p-3 rounded-lg">
          <div className="text-white text-sm font-medium">Footer Edit</div>
        </div>
      )}
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 footer-pattern" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center footer-gradient">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              {/* Editable Site Name */}
              <EditableText
                path={`content.siteName.${language}`}
                value={siteSettings.content.siteName[language]}
                type="text"
                className="text-2xl font-display font-bold"
                placeholder="Site Name"
              >
                <span className="text-2xl font-display font-bold">{siteSettings.content.siteName[language]}</span>
              </EditableText>
            </div>
            
            {/* Editable Footer Description */}
            <EditableText
              path={`content.footer.description.${language}`}
              value={siteSettings.content.footer.description[language]}
              type="textarea"
              className="text-gray-300 leading-relaxed mb-6"
              placeholder="Footer description"
              multiline
            >
              <p className="text-gray-300 leading-relaxed mb-6">
                {siteSettings.content.footer.description[language]}
              </p>
            </EditableText>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 glass rounded-lg flex items-center justify-center text-orange-500 transition-colors duration-300 footer-link"
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            {/* Editable Quick Links Title */}
            <EditableText
              path={`content.footer.quickLinks.${language}`}
              value={siteSettings.content.footer.quickLinks[language]}
              type="text"
              className="text-xl font-display font-bold mb-6 footer-accent-text"
              placeholder="Quick Links Title"
            >
              <h3 className="text-xl font-display font-bold mb-6 footer-accent-text">{siteSettings.content.footer.quickLinks[language]}</h3>
            </EditableText>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="text-gray-300 transition-colors duration-300 flex items-center footer-link hover:text-orange-500"
                  >
                    <span className="w-2 h-2 rounded-full mr-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 footer-bg-accent" />
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Editable Contact Title */}
            <EditableText
              path={`content.footer.contact.${language}`}
              value={siteSettings.content.footer.contact[language]}
              type="text"
              className="text-xl font-display font-bold mb-6 footer-accent-text"
              placeholder="Contact Title"
            >
              <h3 className="text-xl font-display font-bold mb-6 footer-accent-text">{siteSettings.content.footer.contact[language]}</h3>
            </EditableText>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="mt-1 flex-shrink-0 text-orange-500" />
                {/* Editable Address */}
                <EditableText
                  path="content.contactInfo.address"
                  value={siteSettings.content.contactInfo.address}
                  type="textarea"
                  className="text-gray-300 text-sm"
                  placeholder="Address"
                  multiline
                >
                  <p className="text-gray-300 text-sm">
                    {siteSettings.content.contactInfo.address}
                  </p>
                </EditableText>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className="flex-shrink-0 text-orange-500" />
                {/* Editable Phone */}
                <EditableText
                  path="content.contactInfo.phone"
                  value={siteSettings.content.contactInfo.phone}
                  type="text"
                  className="text-gray-300 text-sm"
                  placeholder="Phone"
                >
                  <p className="text-gray-300 text-sm">{siteSettings.content.contactInfo.phone}</p>
                </EditableText>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} className="flex-shrink-0 text-orange-500" />
                {/* Editable Email */}
                <EditableText
                  path="content.contactInfo.email"
                  value={siteSettings.content.contactInfo.email}
                  type="text"
                  className="text-gray-300 text-sm"
                  placeholder="Email"
                >
                  <p className="text-gray-300 text-sm">{siteSettings.content.contactInfo.email}</p>
                </EditableText>
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Editable Newsletter Title */}
            <EditableText
              path={`content.footer.newsletter.title.${language}`}
              value={siteSettings.content.footer.newsletter.title[language]}
              type="text"
              className="text-xl font-display font-bold mb-6 footer-accent-text"
              placeholder="Newsletter Title"
            >
              <h3 className="text-xl font-display font-bold mb-6 footer-accent-text">{siteSettings.content.footer.newsletter.title[language]}</h3>
            </EditableText>
            
            {/* Editable Newsletter Description */}
            <EditableText
              path={`content.footer.newsletter.description.${language}`}
              value={siteSettings.content.footer.newsletter.description[language]}
              type="textarea"
              className="text-gray-300 text-sm mb-6"
              placeholder="Newsletter description"
              multiline
            >
              <p className="text-gray-300 text-sm mb-6">
                {siteSettings.content.footer.newsletter.description[language]}
              </p>
            </EditableText>
            
            <form onSubmit={handleSubmit(onSubmitNewsletter)} className="space-y-4">
              <div>
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
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent backdrop-blur-sm transition-all duration-300 footer-input"
                  placeholder={siteSettings.content.footer.newsletter.placeholder[language]}
                />
                {errors.email && (
                  <p className="text-sm mt-1 footer-accent-text">{errors.email.message as string}</p>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full font-semibold py-3 px-6 rounded-xl transition-all duration-300 unified-button"
              >
                {/* Editable Subscribe Button */}
                <EditableText
                  path={`content.footer.newsletter.subscribe.${language}`}
                  value={siteSettings.content.footer.newsletter.subscribe[language]}
                  type="text"
                  className=""
                  placeholder="Subscribe"
                >
                  <span>{siteSettings.content.footer.newsletter.subscribe[language]}</span>
                </EditableText>
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between"
          style={{ borderTop: '1px solid var(--color-footer-accent)' }}
        >
          <p className="text-sm flex items-center" style={{ color: 'var(--color-footer-text)', opacity: '0.8' }}>
            <span>© 2026 {siteSettings.content.siteName[language]}</span>
            <Heart size={16} className="mx-2 text-orange-500" />
          </p>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            {/* Editable Privacy Link */}
            <EditableText
              path={`content.footer.privacy.${language}`}
              value={siteSettings.content.footer.privacy[language]}
              type="text"
              className="text-gray-400 hover:text-orange-500 text-sm transition-colors"
              placeholder="Privacy Policy"
            >
              <a href="#" className="text-sm transition-colors footer-link">
                {siteSettings.content.footer.privacy[language]}
              </a>
            </EditableText>
            
            {/* Editable Terms Link */}
            <EditableText
              path={`content.footer.terms.${language}`}
              value={siteSettings.content.footer.terms[language]}
              type="text"
              className="text-gray-400 hover:text-orange-500 text-sm transition-colors"
              placeholder="Terms of Service"
            >
              <a href="#" className="text-sm transition-colors footer-link">
                {siteSettings.content.footer.terms[language]}
              </a>
            </EditableText>
            
            {/* Editable Cookies Link */}
            <EditableText
              path={`content.footer.cookies.${language}`}
              value={siteSettings.content.footer.cookies[language]}
              type="text"
              className="text-gray-400 hover:text-orange-500 text-sm transition-colors"
              placeholder="Cookie Policy"
            >
              <a href="#" className="text-sm transition-colors footer-link">
                {siteSettings.content.footer.cookies[language]}
              </a>
            </EditableText>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer