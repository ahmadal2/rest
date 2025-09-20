
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {Image, Save, X, Upload} from 'lucide-react'
import { useApp } from '../App'
import toast from 'react-hot-toast'
// TODO: When API calls are needed, import apiClient:
// import { apiClient } from '../lib/client'

interface EditableImageProps {
  path: string
  value: string
  alt?: string
  className?: string
  placeholder?: string
  children?: React.ReactNode
}

const EditableImage: React.FC<EditableImageProps> = ({
  path,
  value,
  alt = 'Bearbeitbares Bild',
  className = '',
  placeholder = 'Bild-URL eingeben...',
  children
}) => {
  const { isEditMode, canEdit, updateContent } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleEdit = () => {
    if (!canEdit() || !isEditMode) return
    setIsEditing(true)
    setEditValue(value)
  }

  const handleSave = () => {
    updateContent(path, editValue)
    setIsEditing(false)
    setImageError(false)
    toast.success('Bild gespeichert!', {
      icon: '🖼️',
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        padding: '12px 16px'
      }
    })
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
    setImageError(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  if (!isEditMode || !canEdit()) {
    return children || (
      <img
        src={value}
        alt={alt}
        className={className}
        onError={() => console.log('Bild konnte nicht geladen werden')}
      />
    )
  }

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-lg"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl blur-sm opacity-50"></div>
            <div className="relative bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-xl">
                    <Upload size={20} className="text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Bild bearbeiten</h4>
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-3">
                    Bild-URL:
                  </label>
                  <input
                    type="url"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border-2 border-indigo-400/50 rounded-xl px-4 py-3 text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300"
                  />
                </div>
                
                {editValue && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
                      Vorschau:
                    </label>
                    <div className="w-full h-48 bg-slate-800/50 rounded-xl overflow-hidden border border-white/10">
                      {!imageError ? (
                        <img
                          src={editValue}
                          alt="Vorschau"
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <Image size={32} className="mx-auto mb-3 opacity-50" />
                            <div className="text-sm">Bild konnte nicht geladen werden</div>
                            <div className="text-xs text-gray-500 mt-1">Überprüfen Sie die URL</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                      disabled={imageError}
                    >
                      <Save size={16} />
                      <span>Speichern</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg"
                    >
                      <X size={16} />
                      <span>Abbrechen</span>
                    </motion.button>
                  </div>
                  
                  <div className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-lg">
                    JPG, PNG, GIF, WebP
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div
          onClick={handleEdit}
          className="cursor-pointer relative transition-all duration-300"
        >
          {children || (
            <img
              src={value}
              alt={alt}
              className="w-full h-full object-cover transition-all duration-300"
            />
          )}
          
          {/* Modern Edit Indicator */}
          {(isHovered || isEditing) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute top-3 right-3 z-40"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-3 shadow-2xl border border-white/20 backdrop-blur-sm">
                <Upload size={16} />
              </div>
            </motion.div>
          )}
          
          {/* Modern Hover Overlay */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-lg pointer-events-none flex items-center justify-center backdrop-blur-sm"
            >
              <div className="bg-black/60 text-white px-4 py-2 rounded-xl text-sm font-medium border border-white/20">
                Klicken zum Bearbeiten
              </div>
            </motion.div>
          )}
          
          {/* Hover Border */}
          {isHovered && (
            <div className="absolute inset-0 border-2 border-indigo-400/50 rounded-lg pointer-events-none" />
          )}
        </div>
      )}
    </div>
  )
}

export default EditableImage
