import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Star, Clock, Flame, Eye, X, Heart, ChefHat, AlertTriangle, Plus} from 'lucide-react'
import { useApp } from '../../App'
import EditableText from '../EditableText'
import toast from 'react-hot-toast'
// TODO: When API calls are needed, import apiClient:
// import { apiClient } from '../../lib/client'

const MenuSection: React.FC = () => {
  const { language, desserts, addToFavorites, removeFromFavorites, isFavorite, siteSettings, isEditMode, canEdit } = useApp()
  const t = siteSettings.content
  
  const [activeCategory, setActiveCategory] = useState('featured')
  const [selectedDessert, setSelectedDessert] = useState<any>(null)

  const categories = [
    { id: 'featured', name: siteSettings.content.menu.categories.featured[language] },
    { id: 'hot', name: 'Warme Desserts' },
    { id: 'cold', name: 'Kalte Desserts' },
    { id: 'all', name: 'Alle Desserts' }
  ]

  // Sample featured items + user desserts
  const featuredItems = [
    {
      id: 'f1',
      name: {
        en: 'Truffle Chocolate Soufflé',
        ar: 'سوفليه الشوكولاتة بالكمأة',
        de: 'Trüffel-Schokoladen-Soufflé'
      },
      description: {
        en: 'Decadent chocolate soufflé with truffle center and gold leaf',
        ar: 'سوفليه الشوكولاتة الفاخر مع مركز الكمأة وورق الذهب',
        de: 'Dekadentes Schokoladen-Soufflé mit Trüffelkern und Blattgold'
      },
      price: 18,
      image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
      rating: 4.9,
      time: '25 min',
      spicy: false,
      category: 'Hot Desserts',
      ingredients: ['Dunkle Schokolade', 'Trüffel', 'Butter', 'Eier', 'Blattgold'],
      allergens: ['Gluten', 'Eier', 'Milch']
    },
    {
      id: 'f2',
      name: {
        en: 'Molecular Strawberry Cloud',
        ar: 'سحابة الفراولة الجزيئية',
        de: 'Molekulare Erdbeer-Wolke'
      },
      description: {
        en: 'Innovative molecular gastronomy dessert with strawberry essence',
        ar: 'حلوى مبتكرة من فن الطبخ الجزيئي مع جوهر الفراولة',
        de: 'Innovative Molekularküche-Dessert mit Erdbeer-Essenz'
      },
      price: 22,
      image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg',
      rating: 4.8,
      time: '15 min',
      spicy: false,
      category: 'Cold Desserts',
      ingredients: ['Erdbeeren', 'Flüssiger Stickstoff', 'Zucker', 'Agar-Agar'],
      allergens: ['Keine']
    }
  ]

  const getFilteredItems = () => {
    const allItems = [...featuredItems, ...desserts.filter(d => d.featured)]
    
    switch (activeCategory) {
      case 'featured':
        return allItems
      case 'hot':
        return [...allItems, ...desserts].filter(item => 
          item.category?.includes('Hot') || item.category?.includes('Warm')
        )
      case 'cold':
        return [...allItems, ...desserts].filter(item => 
          item.category?.includes('Cold') || item.category?.includes('Ice')
        )
      case 'all':
        return [...allItems, ...desserts]
      default:
        return allItems
    }
  }

  const currentItems = getFilteredItems()

  const openDessertModal = (item: any) => {
    setSelectedDessert(item)
  }

  const handleFavoriteToggle = (dessertId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    
    if (isFavorite(dessertId)) {
      removeFromFavorites(dessertId)
      toast.success('Aus Favoriten entfernt!')
    } else {
      addToFavorites(dessertId)
      toast.success('Zu Favoriten hinzugefügt!')
    }
  }

  return (
    <section id="menu" className="py-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-indigo-900/30" />
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-section font-display font-bold text-white mb-6 neon-text"
            animate={{ 
              textShadow: [
                "0 0 20px #00ffff",
                "0 0 40px #00ffff, 0 0 60px #ff0080",
                "0 0 20px #00ffff"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <EditableText
              path={`content.menu.title.${language}`}
              value={siteSettings.content.menu.title[language]}
              type="title"
              className="text-section font-display font-bold text-white mb-6 neon-text"
              placeholder="Menu Title"
            >
              <span>{siteSettings.content.menu.title[language]}</span>
            </EditableText>
          </motion.h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            <EditableText
              path={`content.menu.description.${language}`}
              value={siteSettings.content.menu.description[language]}
              type="textarea"
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              placeholder="Menu Description"
              multiline
            >
              <span>{siteSettings.content.menu.description[language]}</span>
            </EditableText>
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`px-8 py-4 rounded-2xl font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'unified-button'
                  : 'unified-button outline'
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Menu Items Grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {currentItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ 
                y: -15, 
                rotateY: 5, 
                rotateX: 5,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="glass-card rounded-3xl overflow-hidden group cursor-pointer card-3d"
              onClick={() => openDessertModal(item)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <motion.img
                  src={item.image}
                  alt={item.name[language]}
                  className="w-full h-56 object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Favorite Button */}
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleFavoriteToggle(item.id, e)}
                  className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                    isFavorite(item.id) 
                      ? 'bg-orange-500/80 text-white' 
                      : 'unified-button outline p-2'
                  }`}
                >
                  <Heart 
                    size={20} 
                    className={`favorite-heart ${isFavorite(item.id) ? 'active fill-current' : ''}`} 
                  />
                </motion.button>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <motion.div 
                    className="flex items-center space-x-1 glass rounded-full px-3 py-1"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-xs font-medium text-white">{item.rating}</span>
                  </motion.div>
                  {item.spicy && (
                    <motion.div 
                      className="bg-red-500 rounded-full p-1"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Flame size={12} className="text-white" />
                    </motion.div>
                  )}
                </div>
                
                <div className="absolute bottom-4 left-4">
                  <motion.div 
                    className="flex items-center space-x-1 glass rounded-full px-3 py-1"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Clock size={14} className="text-cyan-400" />
                    <span className="text-xs font-medium text-white">{item.time}</span>
                  </motion.div>
                </div>

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  whileHover={{ opacity: 1 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                  >
                    <Eye size={24} className="text-white" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-display font-bold text-white leading-tight">
                    {item.name[language]}
                  </h3>
                  <motion.span 
                    className="text-2xl font-bold text-cyan-400 ml-2"
                    whileHover={{ scale: 1.1 }}
                  >
                    €{item.price}
                  </motion.span>
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                  {item.description[language]}
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full unified-button text-sm py-3"
                  onClick={(e) => {
                    e.stopPropagation()
                    openDessertModal(item)
                  }}
                >
                  Details anzeigen
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {currentItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="glass-card rounded-3xl p-12">
              <h3 className="text-2xl font-display font-bold text-white mb-4">
                Keine Desserts in dieser Kategorie
              </h3>
              <p className="text-gray-300">
                Wählen Sie eine andere Kategorie oder schauen Sie später wieder vorbei.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Dessert Detail Modal */}
      <AnimatePresence>
        {selectedDessert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDessert(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            
            <motion.div
              initial={{ scale: 0.8, rotateY: -30, y: 50 }}
              animate={{ scale: 1, rotateY: 0, y: 0 }}
              exit={{ scale: 0.8, rotateY: 30, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full glass-card rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Header Image */}
              <div className="relative h-80">
                <motion.img
                  src={selectedDessert.image}
                  alt={selectedDessert.name[language]}
                  className="w-full h-full object-cover"
                  layoutId={`dessert-image-${selectedDessert.id}`}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedDessert(null)}
                  className="absolute top-6 right-6 p-3 unified-button outline rounded-full transition-all duration-300"
                >
                  <X size={24} />
                </motion.button>

                {/* Favorite Button */}
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleFavoriteToggle(selectedDessert.id)}
                  className={`absolute top-6 left-6 p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                    isFavorite(selectedDessert.id) 
                      ? 'bg-orange-500/80 text-white' 
                      : 'unified-button outline p-3'
                  }`}
                >
                  <Heart 
                    size={24} 
                    className={`favorite-heart ${isFavorite(selectedDessert.id) ? 'active fill-current' : ''}`} 
                  />
                </motion.button>

                {/* Floating badges */}
                <div className="absolute bottom-6 left-6 flex items-center space-x-4">
                  <motion.div 
                    className="flex items-center space-x-2 glass rounded-full px-4 py-2"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{selectedDessert.rating}</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center space-x-2 glass rounded-full px-4 py-2"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <Clock size={16} className="text-cyan-400" />
                    <span className="text-white font-medium">{selectedDessert.time}</span>
                  </motion.div>
                </div>

                {/* Price badge */}
                <motion.div 
                  className="absolute bottom-6 right-6 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full px-6 py-3"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 20px rgba(0, 255, 255, 0.3)",
                      "0 0 40px rgba(0, 255, 255, 0.6)",
                      "0 0 20px rgba(0, 255, 255, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-white font-bold text-xl">€{selectedDessert.price}</span>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-8">
                <motion.h2 
                  className="text-4xl font-display font-bold text-white mb-4 neon-text"
                  layoutId={`dessert-title-${selectedDessert.id}`}
                >
                  {selectedDessert.name[language]}
                </motion.h2>
                
                <motion.p 
                  className="text-gray-300 text-lg leading-relaxed mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedDessert.description[language]}
                </motion.p>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Ingredients */}
                  {selectedDessert.ingredients && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="glass rounded-2xl p-6"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <ChefHat size={24} className="text-cyan-400" />
                        <h3 className="text-xl font-bold text-white">Zutaten</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedDessert.ingredients.map((ingredient: string, index: number) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="bg-white/10 px-3 py-1 rounded-full text-sm text-gray-300"
                          >
                            {ingredient}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Allergens */}
                  {selectedDessert.allergens && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="glass rounded-2xl p-6"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <AlertTriangle size={24} className="text-orange-400" />
                        <h3 className="text-xl font-bold text-white">Allergene</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedDessert.allergens.map((allergen: string, index: number) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="bg-orange-500/20 border border-orange-400/30 px-3 py-1 rounded-full text-sm text-orange-300"
                          >
                            {allergen}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Category and features */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <motion.span 
                      className="bg-white/10 px-4 py-2 rounded-full text-gray-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      {selectedDessert.category}
                    </motion.span>
                    {selectedDessert.featured && (
                      <motion.span 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full text-white font-bold"
                        animate={{ 
                          boxShadow: [
                            "0 0 20px rgba(255, 165, 0, 0.3)",
                            "0 0 40px rgba(255, 165, 0, 0.6)",
                            "0 0 20px rgba(255, 165, 0, 0.3)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Featured
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 unified-button py-4 text-lg flex items-center justify-center space-x-2"
                  >
                    <Plus size={20} />
                    <span>Bestellen</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFavoriteToggle(selectedDessert.id)}
                    className={`flex-1 py-4 text-lg flex items-center justify-center space-x-2 transition-all duration-300 ${
                      isFavorite(selectedDessert.id)
                        ? 'unified-button secondary'
                        : 'unified-button'
                    }`}
                  >
                    <Heart size={20} className={isFavorite(selectedDessert.id) ? 'fill-current' : ''} />
                    <span>{isFavorite(selectedDessert.id) ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default MenuSection