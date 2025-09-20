import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {Plus, Edit3, Trash2, Save, X, Star, Clock, Heart, ChefHat, Users, BarChart3, Settings, Moon, Sun, Palette, Image, Type, Layout, Globe, Eye, Code, UserPlus, Hash, Edit} from 'lucide-react'
import toast from 'react-hot-toast'
import { useApp } from '../App'
import { translations } from '../utils/translations.ts'

interface DessertFormData {
  name_en: string
  name_ar: string
  name_de: string
  description_en: string
  description_ar: string
  description_de: string
  price: number
  image: string
  category: string
  featured: boolean
  ingredients: string
  allergens: string
}

interface AdminFormData {
  email: string
  password: string
  name: string
}

const AdminPanel: React.FC = () => {
  const { 
    language, 
    currentAdmin, 
    admins,
    addAdmin,
    deleteAdmin,
    updateAdminNumber,
    desserts, 
    addDessert, 
    updateDessert, 
    deleteDessert,
    favorites,
    theme,
    toggleTheme,
    siteSettings,
    updateSiteSettings,
    isEditMode,
    setEditMode
  } = useApp()
  const t = translations[language]
  
  const [activeTab, setActiveTab] = useState<'desserts' | 'favorites' | 'analytics' | 'admins' | 'site-settings'>('desserts')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false)
  const [editingDessert, setEditingDessert] = useState<any>(null)
  const [editingAdminNumber, setEditingAdminNumber] = useState<string | null>(null)
  const [newAdminNumber, setNewAdminNumber] = useState<number>(1)
  const [settingsCategory, setSettingsCategory] = useState<'colors' | 'images' | 'content' | 'layout'>('colors')
  
  // Ref für das Modal-Content-Element
  const modalContentRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<DessertFormData>()
  const { register: registerAdmin, handleSubmit: handleAdminSubmit, reset: resetAdmin, formState: { errors: adminErrors } } = useForm<AdminFormData>()
  const { register: registerSettings, handleSubmit: handleSettingsSubmit, setValue: setSettingsValue } = useForm()

  // Scroll to top when modal opens
  useEffect(() => {
    if (isAddModalOpen || editingDessert) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        if (modalContentRef.current) {
          modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [isAddModalOpen, editingDessert]);

  // Funktion zum Scrollen zu einem bestimmten Abschnitt im Modal
  const scrollToSection = (sectionId: string) => {
    if (modalContentRef.current) {
      const section = document.getElementById(sectionId);
      if (section) {
        const modalRect = modalContentRef.current.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        
        // Berechne die relative Position des Abschnitts innerhalb des Modals
        const scrollTop = sectionRect.top - modalRect.top + modalContentRef.current.scrollTop;
        
        // Scrolle zu dieser Position
        modalContentRef.current.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    }
  };

  const onSubmit = (data: DessertFormData) => {
    try {
      const dessertData = {
        name: {
          en: data.name_en,
          ar: data.name_ar,
          de: data.name_de
        },
        description: {
          en: data.description_en,
          ar: data.description_ar,
          de: data.description_de
        },
        price: Number(data.price),
        image: data.image,
        category: data.category,
        featured: data.featured,
        ingredients: data.ingredients ? data.ingredients.split(',').map(item => item.trim()) : [],
        allergens: data.allergens ? data.allergens.split(',').map(item => item.trim()) : []
      }

      if (editingDessert) {
        updateDessert(editingDessert.id, dessertData)
        toast.success(t.admin.desserts.success.updated)
        setEditingDessert(null)
      } else {
        addDessert(dessertData)
        toast.success(t.admin.desserts.success.added)
        setIsAddModalOpen(false)
      }
      
      reset()
    } catch (error) {
      console.error('Error submitting dessert:', error);
      toast.error('Fehler beim Hinzufügen des Desserts. Bitte versuchen Sie es erneut.');
    }
  }

  const onAdminSubmit = (data: AdminFormData) => {
    const success = addAdmin(data.email, data.password, data.name)
    if (success) {
      toast.success('Admin erfolgreich hinzugefügt!')
      setIsAddAdminModalOpen(false)
      resetAdmin()
    } else {
      toast.error('Fehler beim Hinzufügen des Admins. Email bereits vergeben?')
    }
  }

  const onSettingsSubmit = (data: any) => {
    if (settingsCategory === 'colors') {
      updateSiteSettings({
        colors: {
          ...siteSettings.colors,
          ...data
        }
      })
    } else if (settingsCategory === 'images') {
      updateSiteSettings({
        images: {
          ...siteSettings.images,
          ...data
        }
      })
    } else if (settingsCategory === 'content') {
      updateSiteSettings({
        content: {
          ...siteSettings.content,
          siteName: {
            en: data.siteName_en,
            ar: data.siteName_ar,
            de: data.siteName_de
          },
          heroTitle: {
            en: data.heroTitle_en,
            ar: data.heroTitle_ar,
            de: data.heroTitle_de
          },
          heroSubtitle: {
            en: data.heroSubtitle_en,
            ar: data.heroSubtitle_ar,
            de: data.heroSubtitle_de
          },
          aboutTitle: {
            en: data.aboutTitle_en,
            ar: data.aboutTitle_ar,
            de: data.aboutTitle_de
          },
          aboutDescription: {
            en: data.aboutDescription_en,
            ar: data.aboutDescription_ar,
            de: data.aboutDescription_de
          },
          footerDescription: {
            en: data.footerDescription_en,
            ar: data.footerDescription_ar,
            de: data.footerDescription_de
          },
          contactInfo: {
            address: data.address,
            phone: data.phone,
            email: data.email
          }
        }
      })
    } else if (settingsCategory === 'layout') {
      updateSiteSettings({
        layout: {
          ...siteSettings.layout,
          ...data
        }
      })
    }
    
    toast.success('Einstellungen erfolgreich gespeichert!')
  }

  const handleEdit = (dessert: any) => {
    setEditingDessert(dessert)
    setValue('name_en', dessert.name.en)
    setValue('name_ar', dessert.name.ar)
    setValue('name_de', dessert.name.de)
    setValue('description_en', dessert.description.en)
    setValue('description_ar', dessert.description.ar)
    setValue('description_de', dessert.description.de)
    setValue('price', dessert.price)
    setValue('image', dessert.image)
    setValue('category', dessert.category)
    setValue('featured', dessert.featured || false)
    setValue('ingredients', dessert.ingredients?.join(', ') || '')
    setValue('allergens', dessert.allergens?.join(', ') || '')
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Dessert löschen möchten?')) {
      deleteDessert(id)
      toast.success(t.admin.desserts.success.deleted)
    }
  }

  const handleDeleteAdmin = (adminId: string, adminName: string) => {
    if (window.confirm(`Sind Sie sicher, dass Sie den Admin "${adminName}" löschen möchten?`)) {
      const success = deleteAdmin(adminId)
      if (success) {
        toast.success('Admin erfolgreich gelöscht!')
      } else {
        toast.error('Fehler beim Löschen des Admins.')
      }
    }
  }

  const handleUpdateAdminNumber = (adminId: string) => {
    const success = updateAdminNumber(adminId, newAdminNumber)
    if (success) {
      toast.success('Admin-Nummer erfolgreich aktualisiert!')
      setEditingAdminNumber(null)
    } else {
      toast.error('Diese Nummer ist bereits vergeben!')
    }
  }

  const favoritesDesserts = desserts.filter(dessert => favorites.includes(dessert.id))

  const stats = {
    totalDesserts: desserts.length,
    featuredDesserts: desserts.filter(d => d.featured).length,
    totalFavorites: favorites.length,
    totalAdmins: admins.filter(a => a.role === 'secondary').length,
    averagePrice: desserts.length > 0 ? (desserts.reduce((sum, d) => sum + d.price, 0) / desserts.length).toFixed(2) : '0'
  }

  // Lade aktuelle Einstellungen in das Formular
  React.useEffect(() => {
    if (settingsCategory === 'colors') {
      Object.entries(siteSettings.colors).forEach(([key, value]) => {
        setSettingsValue(key, value)
      })
    } else if (settingsCategory === 'images') {
      Object.entries(siteSettings.images).forEach(([key, value]) => {
        setSettingsValue(key, value)
      })
    } else if (settingsCategory === 'content') {
      setSettingsValue('siteName_en', siteSettings.content.siteName.en)
      setSettingsValue('siteName_ar', siteSettings.content.siteName.ar)
      setSettingsValue('siteName_de', siteSettings.content.siteName.de)
      setSettingsValue('heroTitle_en', siteSettings.content.heroTitle.en)
      setSettingsValue('heroTitle_ar', siteSettings.content.heroTitle.ar)
      setSettingsValue('heroTitle_de', siteSettings.content.heroTitle.de)
      setSettingsValue('heroSubtitle_en', siteSettings.content.heroSubtitle.en)
      setSettingsValue('heroSubtitle_ar', siteSettings.content.heroSubtitle.ar)
      setSettingsValue('heroSubtitle_de', siteSettings.content.heroSubtitle.de)
      setSettingsValue('aboutTitle_en', siteSettings.content.aboutTitle.en)
      setSettingsValue('aboutTitle_ar', siteSettings.content.aboutTitle.ar)
      setSettingsValue('aboutTitle_de', siteSettings.content.aboutTitle.de)
      setSettingsValue('aboutDescription_en', siteSettings.content.aboutDescription.en)
      setSettingsValue('aboutDescription_ar', siteSettings.content.aboutDescription.ar)
      setSettingsValue('aboutDescription_de', siteSettings.content.aboutDescription.de)
      setSettingsValue('footerDescription_en', siteSettings.content.footerDescription.en)
      setSettingsValue('footerDescription_ar', siteSettings.content.footerDescription.ar)
      setSettingsValue('footerDescription_de', siteSettings.content.footerDescription.de)
      setSettingsValue('address', siteSettings.content.contactInfo.address)
      setSettingsValue('phone', siteSettings.content.contactInfo.phone)
      setSettingsValue('email', siteSettings.content.contactInfo.email)
    } else if (settingsCategory === 'layout') {
      Object.entries(siteSettings.layout).forEach(([key, value]) => {
        if (key === 'fontSize') {
          Object.entries(value).forEach(([fontKey, fontValue]) => {
            setSettingsValue(`fontSize_${fontKey}`, fontValue)
          })
        } else {
          setSettingsValue(key, value)
        }
      })
    }
  }, [settingsCategory, siteSettings, setSettingsValue])

  const presetColors = [
    { name: 'Restaurant Classic', primary: '#FF6B35', secondary: '#004E89', accent: '#00A8E8' },
    { name: 'Elegant Gold', primary: '#FFD700', secondary: '#8B4513', accent: '#FF8C00' },
    { name: 'Modern Blue', primary: '#007BFF', secondary: '#6C757D', accent: '#17A2B8' },
    { name: 'Luxury Purple', primary: '#6F42C1', secondary: '#E83E8C', accent: '#FD7E14' },
    { name: 'Forest Green', primary: '#28A745', secondary: '#20C997', accent: '#FFC107' }
  ]

  const applyColorPreset = (preset: any) => {
    updateSiteSettings({
      colors: {
        ...siteSettings.colors,
        primary: preset.primary,
        secondary: preset.secondary,
        accent: preset.accent,
        buttonPrimary: preset.primary,
        buttonSecondary: preset.secondary
      }
    })
    toast.success(`Farbschema "${preset.name}" angewendet!`)
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold text-white neon-text mb-2">
                {t.admin.title}
              </h1>
              <p className="text-gray-300">
                {t.admin.welcome}, {currentAdmin?.name}!
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* In-Place Editing Toggle - Nur für Haupt-Admin */}
              {currentAdmin?.role === 'main' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditMode(!isEditMode)}
                  className={`p-3 rounded-2xl transition-all duration-300 flex items-center space-x-2 ${
                    isEditMode 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'glass text-white hover:bg-white/20'
                  }`}
                >
                  <Edit size={20} />
                  <span className="text-sm font-medium">
                    {isEditMode ? 'Bearbeitung AUS' : 'Website bearbeiten'}
                  </span>
                </motion.button>
              )}
              
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-3 glass rounded-2xl text-white hover:bg-white/20 transition-all duration-300"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>{t.admin.desserts.add}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
        >
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <ChefHat size={24} className="text-cyan-400" />
              <div>
                <p className="text-gray-400 text-sm">Gesamt Desserts</p>
                <p className="text-2xl font-bold text-white">{stats.totalDesserts}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <Star size={24} className="text-yellow-400" />
              <div>
                <p className="text-gray-400 text-sm">Featured</p>
                <p className="text-2xl font-bold text-white">{stats.featuredDesserts}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <Heart size={24} className="text-red-400" />
              <div>
                <p className="text-gray-400 text-sm">Favoriten</p>
                <p className="text-2xl font-bold text-white">{stats.totalFavorites}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <Users size={24} className="text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Admins</p>
                <p className="text-2xl font-bold text-white">{stats.totalAdmins}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <BarChart3 size={24} className="text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Ø Preis</p>
                <p className="text-2xl font-bold text-white">€{stats.averagePrice}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-4 mb-8 overflow-x-auto"
        >
          {[
            { id: 'desserts', label: 'Desserts', icon: ChefHat },
            { id: 'favorites', label: 'Favoriten', icon: Heart },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            ...(currentAdmin?.role === 'main' ? [
              { id: 'admins', label: 'Admin-Verwaltung', icon: Users },
              { id: 'site-settings', label: 'Website-Einstellungen', icon: Settings }
            ] : [])
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-600 text-white'
                  : 'glass text-gray-300 hover:bg-white/20'
              }`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'desserts' && (
            <motion.div
              key="desserts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {desserts.map((dessert) => (
                <motion.div
                  key={dessert.id}
                  whileHover={{ y: -5 }}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  <img
                    src={dessert.image}
                    alt={dessert.name[language]}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-white">
                        {dessert.name[language]}
                      </h3>
                      <span className="text-cyan-400 font-bold">€{dessert.price}</span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {dessert.description[language]}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-300">
                        {dessert.category}
                      </span>
                      {dessert.featured && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                      {favorites.includes(dessert.id) && (
                        <Heart size={16} className="text-red-400 fill-current" />
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(dessert)}
                        className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-400/30 rounded-lg py-2 px-3 text-sm hover:bg-blue-500/30 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit3 size={14} />
                        <span>Bearbeiten</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(dessert.id)}
                        className="danger-btn py-2 px-3 text-sm flex items-center justify-center space-x-1"
                      >
                        <Trash2 size={14} />
                        <span>Löschen</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {favoritesDesserts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoritesDesserts.map((dessert) => (
                    <motion.div
                      key={dessert.id}
                      whileHover={{ y: -5 }}
                      className="glass-card rounded-2xl overflow-hidden"
                    >
                      <div className="relative">
                        <img
                          src={dessert.image}
                          alt={dessert.name[language]}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <Heart size={20} className="text-red-400 fill-current" />
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-bold text-white">
                            {dessert.name[language]}
                          </h3>
                          <span className="text-cyan-400 font-bold">€{dessert.price}</span>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {dessert.description[language]}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Star size={14} className="text-yellow-400 fill-current" />
                            <span>{dessert.rating || '4.5'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={14} className="text-cyan-400" />
                            <span>{dessert.time || '20 min'}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="glass-card rounded-3xl p-12">
                    <Heart size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-display font-bold text-white mb-4">
                      Keine Favoriten
                    </h3>
                    <p className="text-gray-300">
                      Noch keine Desserts zu den Favoriten hinzugefügt.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <BarChart3 size={24} className="text-cyan-400" />
                  <span>Kategorie-Verteilung</span>
                </h3>
                <div className="space-y-4">
                  {Array.from(new Set(desserts.map(d => d.category))).map((category) => {
                    const count = desserts.filter(d => d.category === category).length
                    const percentage = (count / desserts.length * 100).toFixed(1)
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">{category}</span>
                          <span className="text-white">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="bg-gradient-to-r from-cyan-400 to-purple-600 h-2 rounded-full"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Heart size={24} className="text-red-400" />
                  <span>Beliebte Desserts</span>
                </h3>
                <div className="space-y-4">
                  {favoritesDesserts.slice(0, 5).map((dessert, index) => (
                    <motion.div
                      key={dessert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <span className="text-cyan-400 font-bold text-lg w-6">
                        #{index + 1}
                      </span>
                      <img
                        src={dessert.image}
                        alt={dessert.name[language]}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium">
                          {dessert.name[language]}
                        </h4>
                        <p className="text-gray-400 text-sm">€{dessert.price}</p>
                      </div>
                      <Heart size={16} className="text-red-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'admins' && currentAdmin?.role === 'main' && (
            <motion.div
              key="admins"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Admin-Verwaltung</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAddAdminModalOpen(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <UserPlus size={20} />
                  <span>Admin hinzufügen</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {admins.map((admin) => (
                  <motion.div
                    key={admin.id}
                    whileHover={{ y: -5 }}
                    className="glass-card rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                          admin.role === 'main' 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                            : 'bg-gradient-to-r from-blue-400 to-purple-500'
                        }`}>
                          {admin.role === 'main' ? '👑' : admin.number || '?'}
                        </div>
                        <div>
                          <h4 className="text-white font-bold">{admin.name}</h4>
                          <p className="text-gray-400 text-sm">{admin.email}</p>
                        </div>
                      </div>
                      
                      {admin.role === 'main' ? (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                          Haupt-Admin
                        </span>
                      ) : (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                          Admin #{admin.number}
                        </span>
                      )}
                    </div>

                    {admin.role === 'secondary' && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Hash size={16} className="text-gray-400" />
                          <span className="text-gray-300 text-sm">Admin-Nummer:</span>
                          {editingAdminNumber === admin.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={newAdminNumber}
                                onChange={(e) => setNewAdminNumber(Number(e.target.value))}
                                className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                                min="1"
                                max="999"
                              />
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleUpdateAdminNumber(admin.id)}
                                className="text-green-400 hover:text-green-300"
                              >
                                <Save size={14} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setEditingAdminNumber(null)}
                                className="text-gray-400 hover:text-gray-300"
                              >
                                <X size={14} />
                              </motion.button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-medium">#{admin.number}</span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  setEditingAdminNumber(admin.id)
                                  setNewAdminNumber(admin.number || 1)
                                }}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <Edit3 size={14} />
                              </motion.button>
                            </div>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                          className="w-full danger-btn py-2 text-sm flex items-center justify-center space-x-2"
                        >
                          <Trash2 size={14} />
                          <span>Admin löschen</span>
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'site-settings' && currentAdmin?.role === 'main' && (
            <motion.div
              key="site-settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Settings Navigation */}
                <div className="lg:col-span-1">
                  <div className="glass-card rounded-2xl p-6 sticky top-24">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                      <Settings size={24} className="text-cyan-400" />
                      <span>Einstellungen</span>
                    </h3>
                    <div className="space-y-2">
                      {[
                        { id: 'colors', label: 'Farben', icon: Palette },
                        { id: 'images', label: 'Bilder', icon: Image },
                        { id: 'content', label: 'Inhalte', icon: Type },
                        { id: 'layout', label: 'Layout', icon: Layout }
                      ].map((category) => (
                        <motion.button
                          key={category.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSettingsCategory(category.id as any)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                            settingsCategory === category.id
                              ? 'bg-gradient-to-r from-cyan-400 to-purple-600 text-white'
                              : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          <category.icon size={20} />
                          <span>{category.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3">
                  <div className="glass-card rounded-2xl p-8">
                    <form onSubmit={handleSettingsSubmit(onSettingsSubmit)} className="space-y-6">
                      {settingsCategory === 'colors' && (
                        <div>
                          <h4 className="text-2xl font-bold text-white mb-6">Farbschema anpassen</h4>
                          
                          {/* Color Presets */}
                          <div className="mb-8">
                            <h5 className="text-lg font-medium text-white mb-4">Vordefinierte Farbschemata</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {presetColors.map((preset) => (
                                <motion.button
                                  key={preset.name}
                                  type="button"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => applyColorPreset(preset)}
                                  className="p-4 glass rounded-xl hover:bg-white/20 transition-all duration-300"
                                >
                                  <div className="flex items-center space-x-3 mb-2">
                                    <div className="flex space-x-1">
                                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                                    </div>
                                  </div>
                                  <p className="text-white text-sm font-medium">{preset.name}</p>
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          {/* Individual Color Controls */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(siteSettings.colors).map(([key, value]) => (
                              <div key={key}>
                                <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <div className="flex items-center space-x-3">
                                  <input
                                    {...registerSettings(key)}
                                    type="color"
                                    defaultValue={value}
                                    className="w-12 h-12 rounded-lg border-2 border-white/20 cursor-pointer"
                                  />
                                  <input
                                    {...registerSettings(key)}
                                    type="text"
                                    defaultValue={value}
                                    className="form-input flex-1"
                                    placeholder="#FF6B35"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {settingsCategory === 'images' && (
                        <div>
                          <h4 className="text-2xl font-bold text-white mb-6">Bilder verwalten</h4>
                          <div className="space-y-6">
                            {Object.entries(siteSettings.images).map(([key, value]) => (
                              <div key={key}>
                                <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <input
                                  {...registerSettings(key)}
                                  type="url"
                                  defaultValue={value}
                                  className="form-input"
                                  placeholder="https://example.com/image.jpg"
                                />
                                {value && (
                                  <div className="mt-2">
                                    <img
                                      src={value}
                                      alt={key}
                                      className="w-32 h-20 object-cover rounded-lg border border-white/20"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {settingsCategory === 'content' && (
                        <div>
                          <h4 className="text-2xl font-bold text-white mb-6">Inhalte bearbeiten</h4>
                          <div className="space-y-8">
                            {/* Site Name */}
                            <div>
                              <h5 className="text-lg font-medium text-white mb-4">Website-Name</h5>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm text-gray-300 mb-2">English</label>
                                  <input
                                    {...registerSettings('siteName_en')}
                                    className="form-input"
                                    placeholder="Restaurant Elite"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-gray-300 mb-2">العربية</label>
                                  <input
                                    {...registerSettings('siteName_ar')}
                                    className="form-input"
                                    placeholder="مطعم النخبة"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-gray-300 mb-2">Deutsch</label>
                                  <input
                                    {...registerSettings('siteName_de')}
                                    className="form-input"
                                    placeholder="Restaurant Elite"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Hero Title */}
                            <div>
                              <h5 className="text-lg font-medium text-white mb-4">Hero-Titel</h5>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm text-gray-300 mb-2">English</label>
                                  <input
                                    {...registerSettings('heroTitle_en')}
                                    className="form-input"
                                    placeholder="Culinary Excellence"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-gray-300 mb-2">العربية</label>
                                  <input
                                    {...registerSettings('heroTitle_ar')}
                                    className="form-input"
                                    placeholder="التميز الطهوي"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-gray-300 mb-2">Deutsch</label>
                                  <input
                                    {...registerSettings('heroTitle_de')}
                                    className="form-input"
                                    placeholder="Kulinarische Exzellenz"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Hero Subtitle */}
                            <div>
                              <h5 className="text-lg font-medium text-white mb-4">Hero-Untertitel</h5>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm text-gray-300 mb-2">English</label>
                                  <textarea
                                    {...registerSettings('heroSubtitle_en')}
                                    className="form-input h-20"
                                    placeholder="Experience the finest dining..."
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-gray-300 mb-2">العربية</label>
                                  <textarea
                                    {...registerSettings('heroSubtitle_ar')}
                                    className="form-input h-20"
                                    placeholder="استمتع بأفضل تجربة طعام..."
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-gray-300 mb-2">Deutsch</label>
                                  <textarea
                                    {...registerSettings('heroSubtitle_de')}
                                    className="form-input h-20"
                                    placeholder="Erleben Sie feinste Küche..."
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Contact Info */}
                            <div>
                              <h5 className="text-lg font-medium text-white mb-4">Kontaktinformationen</h5>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm text-gray-300 mb-2">Adresse</label>
                                  <input
                                    {...registerSettings('address')}
                                    className="form-input"
                                    placeholder="123 Gourmet Street..."
                                  />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm text-gray-300 mb-2">Telefon</label>
                                    <input
                                      {...registerSettings('phone')}
                                      className="form-input"
                                      placeholder="+1 (555) 123-4567"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm text-gray-300 mb-2">E-Mail</label>
                                    <input
                                      {...registerSettings('email')}
                                      type="email"
                                      className="form-input"
                                      placeholder="info@restaurant.com"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {settingsCategory === 'layout' && (
                        <div>
                          <h4 className="text-2xl font-bold text-white mb-6">Layout-Einstellungen</h4>
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Border Radius
                                </label>
                                <input
                                  {...registerSettings('borderRadius')}
                                  className="form-input"
                                  placeholder="16px"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Spacing
                                </label>
                                <input
                                  {...registerSettings('spacing')}
                                  className="form-input"
                                  placeholder="24px"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="text-lg font-medium text-white mb-4">Schriftgrößen</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {Object.entries(siteSettings.layout.fontSize).map(([key, value]) => (
                                  <div key={key}>
                                    <label className="block text-sm text-gray-300 mb-2 capitalize">
                                      {key}
                                    </label>
                                    <input
                                      {...registerSettings(`fontSize_${key}`)}
                                      defaultValue={value}
                                      className="form-input"
                                      placeholder="16px"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Eye size={16} />
                          <span className="text-sm">Änderungen werden sofort angewendet</span>
                        </div>
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn-primary flex items-center space-x-2"
                        >
                          <Save size={20} />
                          <span>Speichern</span>
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add/Edit Dessert Modal */}
      <AnimatePresence>
        {(isAddModalOpen || editingDessert) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsAddModalOpen(false)
              setEditingDessert(null)
              reset()
            }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl glass-card rounded-3xl p-8 max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-white neon-text">
                  {editingDessert ? t.admin.desserts.edit : t.admin.desserts.add}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setIsAddModalOpen(false)
                    setEditingDessert(null)
                    reset()
                  }}
                  className="p-2 glass rounded-xl text-white hover:bg-white/20 transition-all duration-300"
                >
                  <X size={20} />
                </motion.button>
              </div>
              
              {/* Quick Navigation Buttons */}
              <div className="flex flex-wrap gap-2 mb-4 p-2 bg-white/5 rounded-xl">
                <button 
                  type="button"
                  onClick={() => scrollToSection('names-section')}
                  className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Namen
                </button>
                <button 
                  type="button"
                  onClick={() => scrollToSection('descriptions-section')}
                  className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Beschreibungen
                </button>
                <button 
                  type="button"
                  onClick={() => scrollToSection('price-category-section')}
                  className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Preis & Kategorie
                </button>
                <button 
                  type="button"
                  onClick={() => scrollToSection('image-section')}
                  className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Bild
                </button>
                <button 
                  type="button"
                  onClick={() => scrollToSection('ingredients-allergens-section')}
                  className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Zutaten & Allergene
                </button>
                <button 
                  type="button"
                  onClick={() => scrollToSection('featured-section')}
                  className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Featured
                </button>
              </div>
              
              {/* Scrollable Content */}
              <div 
                ref={modalContentRef}
                className="flex-1 overflow-y-auto pr-2 -mr-2"
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-8">
                  {/* Names Section */}
                  <div id="names-section" className="scroll-mt-6">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <Type size={18} className="mr-2 text-cyan-400" />
                      Namen in verschiedenen Sprachen
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Name (English)
                        </label>
                        <input
                          {...register('name_en', { required: 'Name ist erforderlich' })}
                          className="form-input"
                          placeholder="Dessert name in English"
                        />
                        {errors.name_en && (
                          <p className="text-red-400 text-sm mt-1">{errors.name_en.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Name (العربية)
                        </label>
                        <input
                          {...register('name_ar', { required: 'Name ist erforderlich' })}
                          className="form-input"
                          placeholder="اسم الحلوى بالعربية"
                        />
                        {errors.name_ar && (
                          <p className="text-red-400 text-sm mt-1">{errors.name_ar.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Name (Deutsch)
                        </label>
                        <input
                          {...register('name_de', { required: 'Name ist erforderlich' })}
                          className="form-input"
                          placeholder="Dessert-Name auf Deutsch"
                        />
                        {errors.name_de && (
                          <p className="text-red-400 text-sm mt-1">{errors.name_de.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Descriptions Section */}
                  <div id="descriptions-section" className="scroll-mt-6">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <Edit3 size={18} className="mr-2 text-cyan-400" />
                      Beschreibungen in verschiedenen Sprachen
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Beschreibung (English)
                        </label>
                        <textarea
                          {...register('description_en', { required: 'Beschreibung ist erforderlich' })}
                          className="form-input h-24 resize-none"
                          placeholder="Description in English"
                        />
                        {errors.description_en && (
                          <p className="text-red-400 text-sm mt-1">{errors.description_en.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Beschreibung (العربية)
                        </label>
                        <textarea
                          {...register('description_ar', { required: 'Beschreibung ist erforderlich' })}
                          className="form-input h-24 resize-none"
                          placeholder="الوصف بالعربية"
                        />
                        {errors.description_ar && (
                          <p className="text-red-400 text-sm mt-1">{errors.description_ar.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Beschreibung (Deutsch)
                        </label>
                        <textarea
                          {...register('description_de', { required: 'Beschreibung ist erforderlich' })}
                          className="form-input h-24 resize-none"
                          placeholder="Beschreibung auf Deutsch"
                        />
                        {errors.description_de && (
                          <p className="text-red-400 text-sm mt-1">{errors.description_de.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price & Category Section */}
                  <div id="price-category-section" className="scroll-mt-6">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <BarChart3 size={18} className="mr-2 text-cyan-400" />
                      Preis und Kategorie
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Preis (€)
                        </label>
                        <input
                          {...register('price', { required: 'Preis ist erforderlich', min: 0, valueAsNumber: true })}
                          type="number"
                          step="0.01"
                          className="form-input"
                          placeholder="0.00"
                        />
                        {errors.price && (
                          <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Kategorie
                        </label>
                        <select
                          {...register('category', { required: 'Kategorie ist erforderlich' })}
                          className="form-input"
                        >
                          <option value="">Kategorie wählen</option>
                          <option value="Hot Desserts">Warme Desserts</option>
                          <option value="Cold Desserts">Kalte Desserts</option>
                          <option value="Ice Cream">Eis</option>
                          <option value="Cakes">Kuchen</option>
                          <option value="Pastries">Gebäck</option>
                        </select>
                        {errors.category && (
                          <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div id="image-section" className="scroll-mt-6">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <Image size={18} className="mr-2 text-cyan-400" />
                      Bild-URL
                    </h3>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bild URL
                      </label>
                      <input
                        {...register('image', { required: 'Bild URL ist erforderlich' })}
                        type="url"
                        className="form-input"
                        placeholder="https://example.com/image.jpg"
                      />
                      {errors.image && (
                        <p className="text-red-400 text-sm mt-1">{errors.image.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Ingredients & Allergens Section */}
                  <div id="ingredients-allergens-section" className="scroll-mt-6">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <ChefHat size={18} className="mr-2 text-cyan-400" />
                      Zutaten und Allergene
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Zutaten (kommagetrennt)
                        </label>
                        <input
                          {...register('ingredients')}
                          className="form-input"
                          placeholder="Schokolade, Butter, Eier, ..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Allergene (kommagetrennt)
                        </label>
                        <input
                          {...register('allergens')}
                          className="form-input"
                          placeholder="Gluten, Milch, Eier, ..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Featured Section */}
                  <div id="featured-section" className="scroll-mt-6">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <Star size={18} className="mr-2 text-cyan-400" />
                      Featured-Einstellungen
                    </h3>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <input
                          {...register('featured')}
                          type="checkbox"
                          id="featured"
                          className="w-4 h-4 text-cyan-400 bg-white/10 border-gray-300 rounded focus:ring-cyan-500"
                        />
                        <label htmlFor="featured" className="text-gray-300">
                          Als Featured-Dessert markieren
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsAddModalOpen(false)
                        setEditingDessert(null)
                        reset()
                      }}
                      className="flex-1 btn-glass py-3"
                    >
                      Abbrechen
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 btn-primary py-3 flex items-center justify-center space-x-2"
                    >
                      <Save size={20} />
                      <span>{t.admin.desserts.save}</span>
                    </motion.button>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsAddAdminModalOpen(false)
              resetAdmin()
            }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md glass-card rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-white neon-text">
                  Admin hinzufügen
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setIsAddAdminModalOpen(false)
                    resetAdmin()
                  }}
                  className="p-2 glass rounded-xl text-white hover:bg-white/20 transition-all duration-300"
                >
                  <X size={20} />
                </motion.button>
              </div>
              
              <form onSubmit={handleAdminSubmit(onAdminSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    {...registerAdmin('name', { required: 'Name ist erforderlich' })}
                    className="form-input"
                    placeholder="Admin Name"
                  />
                  {adminErrors.name && (
                    <p className="text-red-400 text-sm mt-1">{adminErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-Mail
                  </label>
                  <input
                    {...registerAdmin('email', { 
                      required: 'E-Mail ist erforderlich',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Ungültige E-Mail-Adresse'
                      }
                    })}
                    type="email"
                    className="form-input"
                    placeholder="admin@restaurant.com"
                  />
                  {adminErrors.email && (
                    <p className="text-red-400 text-sm mt-1">{adminErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Passwort
                  </label>
                  <input
                    {...registerAdmin('password', { 
                      required: 'Passwort ist erforderlich',
                      minLength: {
                        value: 6,
                        message: 'Passwort muss mindestens 6 Zeichen lang sein'
                      }
                    })}
                    type="password"
                    className="form-input"
                    placeholder="Sicheres Passwort"
                  />
                  {adminErrors.password && (
                    <p className="text-red-400 text-sm mt-1">{adminErrors.password.message}</p>
                  )}
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsAddAdminModalOpen(false)
                      resetAdmin()
                    }}
                    className="flex-1 btn-glass py-3"
                  >
                    Abbrechen
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 btn-primary py-3 flex items-center justify-center space-x-2"
                  >
                    <UserPlus size={20} />
                    <span>Admin erstellen</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminPanel