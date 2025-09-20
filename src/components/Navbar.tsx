import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {Menu, X, Sun, Moon, Globe, User, LogOut, Settings, Shield, UserMinus, Crown, Users, Edit, Eye, Zap, Sparkles, ChevronDown} from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useApp } from '../App'
import { translations } from '../utils/translations'
import { getTextColorClass, getTextColor } from '../utils/colorUtils'

const Navbar: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    language, 
    setLanguage, 
    isAuthenticated, 
    currentAdmin, 
    login, 
    logout, 
    addAdmin,
    admins,
    deleteAdmin,
    updateAdminNumber,
    isEditMode,
    setEditMode,
    canEdit,
    siteSettings
  } = useApp()
  const t = translations[language]
  const location = useLocation()
  const navigate = useNavigate()
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false)
  const [isManageAdminsModalOpen, setIsManageAdminsModalOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [textColorClass, setTextColorClass] = useState('text-white')
  const [textColor, setTextColor] = useState('white')
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lastAttemptTime, setLastAttemptTime] = useState(0)
  const [showLoginError, setShowLoginError] = useState(false)

  const { register: registerLogin, handleSubmit: handleLoginSubmit, reset: resetLogin, formState: { errors: loginErrors } } = useForm()
  const { register: registerAdmin, handleSubmit: handleAdminSubmit, reset: resetAdmin, formState: { errors: adminErrors } } = useForm()

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle key combination for admin login (Ctrl+Shift+L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Ctrl+Shift+L is pressed
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault()
        // Only show login if not already authenticated
        if (!isAuthenticated) {
          setIsLoginModalOpen(true)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAuthenticated])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isDropdownOpen) setIsDropdownOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isDropdownOpen])

  // Particle effect
  useEffect(() => {
    if (showParticles) {
      const timeout = setTimeout(() => setShowParticles(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [showParticles])

  // Update text color based on header background
  useEffect(() => {
    setTextColorClass(getTextColorClass(siteSettings.colors.headerBg))
    setTextColor(getTextColor(siteSettings.colors.headerBg))
  }, [siteSettings.colors.headerBg])

  const navItems = [
    { name: t.nav.home, href: '/', section: 'home' },
    { name: t.nav.about, href: '/#about', section: 'about'},
    { name: t.nav.menu, href: '/#menu', section: 'menu' },
    { name: t.nav.testimonials, href: '/#testimonials', section: 'testimonials'},
    { name: t.nav.contact, href: '/#contact', section: 'contact' },
  ]

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ]

  const onLoginSubmit = (data: any) => {
    // Check if rate limiting is active
    const currentTime = Date.now()
    const timeSinceLastAttempt = currentTime - lastAttemptTime
    
    // If there have been 3 failed attempts and less than 30 seconds have passed, reject the attempt
    if (loginAttempts >= 3 && timeSinceLastAttempt < 30000) {
      toast.error('Zu viele Anmeldeversuche. Bitte warten Sie 30 Sekunden.')
      return
    }
    
    if (login(data.email, data.password)) {
      toast.success('Erfolgreich angemeldet!')
      setIsLoginModalOpen(false)
      resetLogin()
      setShowParticles(true)
      // Reset login attempts on successful login
      setLoginAttempts(0)
      setLastAttemptTime(0)
      setShowLoginError(false)
    } else {
      // Increment login attempts on failed login
      setLoginAttempts(prev => prev + 1)
      setLastAttemptTime(currentTime)
      setShowLoginError(true)
      toast.error('Ungültige Anmeldedaten')
      
      // Show rate limiting message after 3 failed attempts
      if (loginAttempts >= 2) {
        toast.error('Zu viele fehlgeschlagene Versuche. Bitte warten Sie 30 Sekunden.')
      }
    }
  }

  const onAddAdminSubmit = (data: any) => {
    if (addAdmin(data.email, data.password, data.name)) {
      toast.success('Admin erfolgreich hinzugefügt!')
      setIsAddAdminModalOpen(false)
      resetAdmin()
      setShowParticles(true)
    } else {
      toast.error('Admin konnte nicht hinzugefügt werden')
    }
  }

  const handleDeleteAdmin = (adminId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Admin löschen möchten?')) {
      if (deleteAdmin(adminId)) {
        toast.success('Admin erfolgreich gelöscht!')
        setShowParticles(true)
      } else {
        toast.error('Admin konnte nicht gelöscht werden')
      }
    }
  }

  const handleUpdateAdminNumber = (adminId: string, newNumber: number) => {
    if (updateAdminNumber(adminId, newNumber)) {
      toast.success('Admin-Nummer erfolgreich aktualisiert!')
      setShowParticles(true)
    } else {
      toast.error('Admin-Nummer konnte nicht aktualisiert werden')
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Erfolgreich abgemeldet!')
    setIsDropdownOpen(false)
    setShowParticles(true)
  }

  const toggleEditMode = () => {
    if (canEdit()) {
      setEditMode(!isEditMode)
      toast.success(isEditMode ? 'Bearbeitungsmodus deaktiviert' : 'Bearbeitungsmodus aktiviert')
      setShowParticles(true)
    }
  }

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/')
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          // Use requestAnimationFrame for better mobile performance
          requestAnimationFrame(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          })
        }
      }, 300) // Increased timeout to ensure page navigation completes
    } else {
      // If we're already on the home page, just scroll
      const element = document.getElementById(sectionId)
      if (element) {
        // Use requestAnimationFrame for better mobile performance
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
    }
    setIsMenuOpen(false) // Always close mobile menu after navigation
    setShowParticles(true)
  }

  const handleNavClick = (item: any) => {
    if (item.section === 'home') {
      // For home, just navigate to the root
      navigate('/')
      // Use requestAnimationFrame for better mobile performance
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    } else {
      // For other sections, scroll to the section
      scrollToSection(item.section)
    }
    // Always close mobile menu after clicking
    setIsMenuOpen(false)
  }

  const handleMobileNavClick = (item: any) => {
    // Close menu first
    setIsMenuOpen(false)
    
    // Handle navigation after a short delay to ensure menu is closed
    setTimeout(() => {
      if (item.section === 'home') {
        navigate('/')
        // Use requestAnimationFrame for better mobile performance
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        })
      } else {
        // For other sections, navigate to home first if needed, then scroll
        if (location.pathname !== '/') {
          navigate('/')
          // Wait for navigation to complete before scrolling
          setTimeout(() => {
            const element = document.getElementById(item.section)
            if (element) {
              // Use requestAnimationFrame for better mobile performance
              requestAnimationFrame(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
              })
            }
          }, 100)
        } else {
          // If we're already on the home page, just scroll
          const element = document.getElementById(item.section)
          if (element) {
            // Use requestAnimationFrame for better mobile performance
            requestAnimationFrame(() => {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            })
          }
        }
      }
    }, 300) // Delay to ensure menu is closed before navigation
  }

  return (
    <>
      {/* Floating Particles */}
      <AnimatePresence>
        {showParticles && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight
                }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  y: [null, -100]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, delay: i * 0.1 }}
                className="absolute w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Edit Mode Banner */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 px-4 text-center text-sm font-medium"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-center">
              <Edit size={16} className="mr-2" />
              <span>Bearbeitungsmodus aktiviert - Klicken Sie auf Elemente zum Bearbeiten</span>
              <button 
                onClick={toggleEditMode}
                className="ml-4 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs transition-colors"
              >
                Beenden
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lenovo Aura Edition Inspired Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${isEditMode ? 'mt-10' : ''}`}
        style={{
          background: siteSettings.colors.headerBg,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          boxShadow: isScrolled ? '0 10px 25px rgba(0, 0, 0, 0.3)' : 'none'
        }}
      >
        {/* Orange top border like in the image */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo inspired by Lenovo Aura Edition */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-4 cursor-pointer group"
              onClick={() => {
                navigate('/')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <div className="relative">
                {/* Central orange panel like in the image */}
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                  className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/30"
                >
                  <span className="text-white font-black text-2xl font-display">R</span>
                </motion.div>
                
                {/* Glass effect rings */}
                <div className="absolute inset-0 -m-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-18 h-18 border border-orange-300/40 rounded-full"
                  />
                </div>
                <div className="absolute inset-0 -m-4">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="w-22 h-22 border border-orange-200/30 rounded-full"
                  />
                </div>
                
                {/* Floating dots */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"
                />
              </div>
              
              <div className="hidden sm:block">
                <motion.h1 
                  className={`text-2xl font-black ${textColorClass}`}
                  whileHover={{ scale: 1.02 }}
                >
                  Restaurant Elite
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0.6 }}
                  whileHover={{ opacity: 1 }}
                  className={`text-xs font-medium ${textColorClass === 'text-white' ? 'text-orange-300' : 'text-orange-600'} tracking-wider`}
                >
                  AURA EDITION
                </motion.p>
              </div>
            </motion.div>

            {/* Navigation inspired by Smart Modes */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -3,
                    scale: 1.05,
                    rotateY: 10
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMobileNavClick(item)}
                  className={`relative group px-6 py-3 rounded-xl font-medium transition-all duration-500 text-sm ${
                    location.pathname === item.href || 
                    (location.pathname !== '/' && item.section === 'home') ||
                    (location.pathname === '/' && location.hash === `#${item.section}` && item.section !== 'home')
                      ? `bg-gradient-to-r from-orange-400/30 to-amber-400/30 ${textColorClass} shadow-lg border border-orange-200/50`
                      : `${textColorClass} hover:text-orange-300`
                  }`}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>{item.name}</span>
                  </span>
                  
                  {/* Glass effect */}
                  <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                    location.pathname === item.href || 
                    (location.pathname !== '/' && item.section === 'home') ||
                    (location.pathname === '/' && location.hash === `#${item.section}` && item.section !== 'home')
                      ? 'bg-gradient-to-r from-orange-300/10 to-amber-300/10'
                      : 'group-hover:bg-gradient-to-r group-hover:from-orange-400/5 group-hover:to-amber-400/5'
                  }`} />
                  
                  {/* Bottom border like in the image */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                  />
                  
                  {/* Active state effect */}
                  {(location.pathname === item.href || 
                    (location.pathname !== '/' && item.section === 'home') ||
                    (location.pathname === '/' && location.hash === `#${item.section}` && item.section !== 'home')) && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ 
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            x: [0, (Math.random() - 0.5) * 40],
                            y: [0, (Math.random() - 0.5) * 40]
                          }}
                          transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity, repeatDelay: 2 }}
                          className="absolute top-1/2 left-1/2 w-1 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Controls inspired by the image */}
            <div className="flex items-center space-x-2">
              
              {/* Language Selector */}
              <div className="relative group hidden sm:block">
                <motion.button
                  whileHover={{ scale: 1.1, rotateY: 15 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-orange-300/50 transition-all duration-500 shadow-lg"
                >
                  <Globe size={18} className="text-white" />
                </motion.button>
                
                <div className="absolute top-full right-0 mt-3 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-gray-900/90 backdrop-blur-2xl rounded-xl border border-white/20 shadow-2xl overflow-hidden">
                    {languages.map((lang, index) => (
                      <motion.button
                        key={lang.code}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setLanguage(lang.code as 'en' | 'ar' | 'de')}
                        className={`w-full px-5 py-4 text-left transition-all duration-300 ${
                          language === lang.code 
                            ? `bg-gradient-to-r from-orange-400/30 to-amber-400/30 ${textColorClass}` 
                            : `${textColorClass === 'text-white' ? 'text-gray-300' : 'text-gray-700'} hover:bg-gradient-to-r hover:from-orange-400/20 hover:to-amber-400/20`
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                          {language === lang.code && (
                            <Sparkles size={14} className="text-orange-400 ml-auto" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-orange-300/50 transition-all duration-500 shadow-lg relative overflow-hidden"
              >
                <motion.div
                  animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                  transition={{ duration: 0.5 }}
                >
                  {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-orange-400" />}
                </motion.div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
              </motion.button>

              {/* Edit Mode Toggle */}
              {isAuthenticated && canEdit() && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleEditMode}
                  className={`p-3 rounded-xl backdrop-blur-xl border transition-all duration-500 shadow-lg ${isEditMode ? 'bg-gradient-to-br from-orange-400/40 to-amber-400/40 border-orange-300/50' : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-orange-300/50'}`}
                >
                  {isEditMode ? <Eye size={18} className={textColorClass} style={{ color: textColor }} /> : <Edit size={18} className={textColorClass} style={{ color: textColor }} />}
                  
                  {/* Particles effect */}
                  {isEditMode && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0]
                          }}
                          transition={{ 
                            duration: 2, 
                            delay: i * 0.5, 
                            repeat: Infinity 
                          }}
                          className="absolute top-1/2 left-1/2 w-1 h-1 bg-orange-400 rounded-full"
                          style={{
                            transform: 'translate(-50%, -50%) rotate(' + (i * 90) + 'deg) translateX(15px)'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              )}

              {/* Admin Panel - Hidden by default, accessible via key combination */}
              {isAuthenticated ? (
                <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.1, rotateY: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsDropdownOpen(!isDropdownOpen)
                    }}
                    className={`flex items-center space-x-2 p-3 rounded-xl bg-gradient-to-br from-orange-400/40 to-amber-400/40 backdrop-blur-xl border border-orange-300/50 shadow-lg ${textColorClass}`} 
                    style={{ color: textColor }}
                  >
                    {currentAdmin?.role === 'main' ? (
                      <Crown size={18} className="text-amber-400" />
                    ) : (
                      <div className="flex items-center space-x-1">
                        <User size={18} />
                        {currentAdmin?.number !== undefined && (
                          <span className="text-xs bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {currentAdmin.number}
                          </span>
                        )}
                      </div>
                    )}
                    <span className="hidden lg:block font-semibold">{currentAdmin?.name}</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    <Zap size={14} className="text-amber-400 animate-pulse" />
                  </motion.button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-3 w-64 bg-gray-900/90 backdrop-blur-2xl rounded-xl border border-white/20 shadow-2xl overflow-hidden z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-2 space-y-1">
                          <Link
                            to="/admin"
                            className={`flex items-center space-x-3 w-full px-4 py-3 text-left ${textColorClass === 'text-white' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-all rounded-xl`}
                          >
                            <Settings size={16} />
                            <span>Admin Panel</span>
                            <Sparkles size={12} className="ml-auto text-orange-400" />
                          </Link>
                          
                          {currentAdmin?.role === 'main' && (
                            <>
                              <button
                                onClick={() => {
                                  setIsAddAdminModalOpen(true)
                                  setIsDropdownOpen(false)
                                }}
                                className={`flex items-center space-x-3 w-full px-4 py-3 text-left ${textColorClass === 'text-white' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-all rounded-xl`}
                              >
                                <Shield size={16} />
                                <span>Admin hinzufügen</span>
                              </button>
                              <button
                                onClick={() => {
                                  setIsManageAdminsModalOpen(true)
                                  setIsDropdownOpen(false)
                                }}
                                className={`flex items-center space-x-3 w-full px-4 py-3 text-left ${textColorClass === 'text-white' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-all rounded-xl`}
                              >
                                <Users size={16} />
                                <span>Admins verwalten</span>
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={handleLogout}
                            className={`flex items-center space-x-3 w-full px-4 py-3 text-left ${textColorClass === 'text-white' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} transition-all rounded-xl`}
                          >
                            <LogOut size={16} />
                            <span>Abmelden</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Hidden admin login button - shown as a small dot
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30"
                  aria-label="Admin Login"
                />
              )}

              {/* Mobile Menu */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-orange-300/50 transition-all duration-500 shadow-lg"
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="lg:hidden bg-gray-900/90 backdrop-blur-2xl border-t border-white/20"
            >
              <div className="px-4 py-6 space-y-3">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10, scale: 1.02 }}
                    onClick={() => handleMobileNavClick(item)}
                    className={`flex items-center space-x-4 w-full text-left py-4 px-5 rounded-xl font-medium transition-all duration-500 ${
                      location.pathname === item.href || 
                      (location.pathname !== '/' && item.section === 'home') ||
                      (location.pathname === '/' && location.hash === `#${item.section}` && item.section !== 'home')
                        ? `bg-gradient-to-r from-orange-400/30 to-amber-400/30 ${textColorClass} shadow-lg`
                        : `${textColorClass === 'text-white' ? 'text-gray-300 hover:bg-gradient-to-r hover:from-orange-400/20 hover:to-amber-400/20' : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-400/20 hover:to-amber-400/20'}`
                    }`}
                  >
                    <span>{item.name}</span>
                    {(location.pathname === item.href || 
                      (location.pathname !== '/' && item.section === 'home') ||
                      (location.pathname === '/' && location.hash === `#${item.section}` && item.section !== 'home')) && (
                      <Sparkles size={14} className="ml-auto text-orange-400" />
                    )}
                  </motion.button>
                ))}
                
                {/* Mobile Language Selector */}
                <div className="pt-4 border-t border-white/20">
                  <p className="text-xs text-gray-400 uppercase tracking-wider px-5 py-2 font-bold">Sprache wählen</p>
                  <div className="space-y-2">
                    {languages.map((lang) => (
                      <motion.button
                        key={lang.code}
                        whileHover={{ x: 10, scale: 1.02 }}
                        onClick={() => {
                          setLanguage(lang.code as 'en' | 'ar' | 'de');
                          setIsMenuOpen(false);
                        }}
                        className={`flex items-center space-x-3 w-full text-left py-3 px-5 rounded-xl transition-all duration-500 ${
                          language === lang.code 
                            ? `bg-gradient-to-r from-orange-400/30 to-amber-400/30 ${textColorClass}` 
                            : `${textColorClass === 'text-white' ? 'text-gray-300 hover:bg-gradient-to-r hover:from-orange-400/20 hover:to-amber-400/20' : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-400/20 hover:to-amber-400/20'}`
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                        {language === lang.code && (
                          <Sparkles size={14} className="ml-auto text-orange-400" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                {/* Mobile Admin Login */}
                {!isAuthenticated && (
                  <div className="pt-4 border-t border-white/20">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsLoginModalOpen(true)
                        setIsMenuOpen(false)
                      }}
                      className="w-full py-4 px-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-500 shadow-md flex items-center justify-center space-x-2"
                    >
                      <Zap size={16} />
                      <span>Admin Login</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsLoginModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, rotateX: 45 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, y: 50, rotateX: 45 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-gray-900/90 backdrop-blur-3xl rounded-xl p-8 border border-white/20 shadow-2xl"
            >
              {/* Neural connection lines */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      opacity: [0, 0.3, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      delay: i * 0.5, 
                      repeat: Infinity 
                    }}
                    className="absolute w-px bg-gradient-to-b from-orange-400 to-amber-400"
                    style={{
                      left: `${12.5 + i * 12.5}%`,
                      height: '100%'
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-white">Admin Access</h2>
                    <p className="text-gray-400 text-sm mt-1">Anmeldung für Administratoren</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsLoginModalOpen(false)}
                    className="p-2 rounded-xl text-gray-400 hover:bg-gray-800/50 transition-all duration-300"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
                
                {/* Note about key combination */}
                <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-3 mb-6">
                  <p className="text-blue-300 text-sm">
                    Tipp: Drücken Sie Strg+Umschalt+L, um jederzeit auf das Admin-Login zuzugreifen.
                  </p>
                </div>
                
                <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-white mb-3">Admin E-Mail</label>
                    <input
                      {...registerLogin('email', { required: 'E-Mail ist erforderlich' })}
                      type="email"
                      placeholder="admin@restaurant.de"
                      className="w-full bg-gray-800/80 border-2 border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:bg-gray-800 transition-all duration-300"
                    />
                    {loginErrors.email && loginErrors.email.message && (
                      <p className="text-red-400 text-sm mt-1">{String(loginErrors.email.message)}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-white mb-3">Passwort</label>
                    <input
                      {...registerLogin('password', { required: 'Passwort ist erforderlich' })}
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-gray-800/80 border-2 border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:bg-gray-800 transition-all duration-300"
                    />
                    {loginErrors.password && loginErrors.password.message && (
                      <p className="text-red-400 text-sm mt-1">{String(loginErrors.password.message)}</p>
                    )}
                  </div>
                  
                  {/* Show login attempts counter */}
                  {loginAttempts > 0 && loginAttempts < 3 && (
                    <div className="bg-amber-900/30 border border-amber-700 rounded-xl p-3">
                      <p className="text-amber-300 text-sm">
                        Fehlgeschlagene Versuche: {loginAttempts}/3
                      </p>
                    </div>
                  )}
                  
                  {/* Show error message for too many login attempts */}
                  {loginAttempts >= 3 && (
                    <div className="bg-red-900/50 border border-red-700 rounded-xl p-3">
                      <p className="text-red-300 text-sm">
                        Zu viele fehlgeschlagene Anmeldeversuche. Bitte warten Sie 30 Sekunden vor dem nächsten Versuch.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsLoginModalOpen(false)}
                      className="flex-1 bg-gray-800 text-gray-300 px-6 py-4 rounded-xl font-bold hover:bg-gray-700 transition-all duration-300"
                    >
                      Abbrechen
                    </button>
                    <button 
                      type="submit" 
                      disabled={loginAttempts >= 3 && Date.now() - lastAttemptTime < 30000}
                      className={`flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-4 rounded-xl font-bold hover:shadow-2xl transition-all duration-500 flex items-center justify-center space-x-2 ${
                        loginAttempts >= 3 && Date.now() - lastAttemptTime < 30000 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Zap size={16} />
                      <span>Anmelden</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {isAddAdminModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsAddAdminModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, rotateX: 45 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, y: 50, rotateX: 45 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-gray-900/90 backdrop-blur-3xl rounded-xl p-8 border border-white/20 shadow-2xl"
            >
              {/* Neural connection lines */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      opacity: [0, 0.3, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      delay: i * 0.5, 
                      repeat: Infinity 
                    }}
                    className="absolute w-px bg-gradient-to-b from-orange-400 to-amber-400"
                    style={{
                      left: `${12.5 + i * 12.5}%`,
                      height: '100%'
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-white">Admin hinzufügen</h2>
                    <p className="text-gray-400 text-sm mt-1">Neuen Administrator erstellen</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsAddAdminModalOpen(false)}
                    className="p-2 rounded-xl text-gray-400 hover:bg-gray-800/50 transition-all duration-300"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
                
                <form onSubmit={handleAdminSubmit(onAddAdminSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-white mb-3">Name</label>
                    <input
                      {...registerAdmin('name', { required: 'Name ist erforderlich' })}
                      type="text"
                      placeholder="Max Mustermann"
                      className="w-full bg-gray-800/80 border-2 border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:bg-gray-800 transition-all duration-300"
                    />
                    {adminErrors.name && adminErrors.name.message && (
                      <p className="text-red-400 text-sm mt-1">{String(adminErrors.name.message)}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-white mb-3">E-Mail</label>
                    <input
                      {...registerAdmin('email', { required: 'E-Mail ist erforderlich' })}
                      type="email"
                      placeholder="admin@restaurant.de"
                      className="w-full bg-gray-800/80 border-2 border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:bg-gray-800 transition-all duration-300"
                    />
                    {adminErrors.email && adminErrors.email.message && (
                      <p className="text-red-400 text-sm mt-1">{String(adminErrors.email.message)}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-white mb-3">Passwort</label>
                    <input
                      {...registerAdmin('password', { required: 'Passwort ist erforderlich' })}
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-gray-800/80 border-2 border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:bg-gray-800 transition-all duration-300"
                    />
                    {adminErrors.password && adminErrors.password.message && (
                      <p className="text-red-400 text-sm mt-1">{String(adminErrors.password.message)}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddAdminModalOpen(false)}
                      className="flex-1 bg-gray-800 text-gray-300 px-6 py-4 rounded-xl font-bold hover:bg-gray-700 transition-all duration-300"
                    >
                      Abbrechen
                    </button>
                    <button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-4 rounded-xl font-bold hover:shadow-2xl transition-all duration-500 flex items-center justify-center space-x-2">
                      <Zap size={16} />
                      <span>Hinzufügen</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manage Admins Modal */}
      <AnimatePresence>
        {isManageAdminsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsManageAdminsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, rotateX: 45 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, y: 50, rotateX: 45 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-gray-900/90 backdrop-blur-3xl rounded-xl p-6 border border-white/20 shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Neural connection lines */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      opacity: [0, 0.3, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      delay: i * 0.5, 
                      repeat: Infinity 
                    }}
                    className="absolute w-px bg-gradient-to-b from-orange-400 to-amber-400"
                    style={{
                      left: `${12.5 + i * 12.5}%`,
                      height: '100%'
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold text-white">Admins verwalten</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsManageAdminsModalOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-800 transition-all duration-300"
                  >
                    <X size={20} className="text-white" />
                  </motion.button>
                </div>
                
                <div className="overflow-y-auto flex-1 pr-2 -mr-2">
                  <div className="space-y-4">
                    {admins
                      .sort((a, b) => {
                        if (a.role === 'main') return -1
                        if (b.role === 'main') return 1
                        return (a.number || 0) - (b.number || 0)
                      })
                      .map((admin) => (
                      <motion.div
                        key={admin.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center space-x-3">
                          {admin.role === 'main' ? (
                            <Crown size={20} className="text-amber-400" />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <User size={20} className="text-gray-400" />
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-400">Nr:</span>
                                <input
                                  type="number"
                                  min="1"
                                  max="99"
                                  value={admin.number || 1}
                                  onChange={(e) => handleUpdateAdminNumber(admin.id, parseInt(e.target.value))}
                                  className="w-12 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white text-xs"
                                />
                              </div>
                            </div>
                          )}
                          <div>
                            <h3 className="text-white font-medium">{admin.name}</h3>
                            <p className="text-gray-400 text-sm">{admin.email}</p>
                            <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                              admin.role === 'main' 
                                ? 'bg-amber-900/50 text-amber-300' 
                                : 'bg-orange-900/50 text-orange-300'
                            }`}>
                              {admin.role === 'main' ? 'Haupt-Admin' : `Admin #${admin.number || 1}`}
                            </span>
                          </div>
                        </div>
                        
                        {admin.role !== 'main' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md flex items-center space-x-2"
                          >
                            <UserMinus size={16} />
                            <span>Löschen</span>
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                    
                    {admins.filter(a => a.role === 'secondary').length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-400">Keine weiteren Admins gefunden</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
                  <h4 className="text-orange-300 font-medium mb-2">Admin-Berechtigungen:</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li className="flex items-start">
                      <Crown size={16} className="inline text-amber-400 mr-2 mt-0.5" />
                      <span>Haupt-Admin: Vollzugriff auf alle Funktionen</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center mr-2 mt-0.5">1-3</span>
                      <span>Admin #1-3: Kann Website-Inhalte bearbeiten</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center mr-2 mt-0.5">4+</span>
                      <span>Admin #4+: Nur Dessert-Verwaltung</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar