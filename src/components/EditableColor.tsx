
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {Palette, Save, X, Pipette} from 'lucide-react'
import { useApp } from '../App'
import toast from 'react-hot-toast'
// TODO: When API calls are needed, import apiClient:
// import { apiClient } from '../lib/client'

interface EditableColorProps {
  path: string
  value: string
  label: string
  className?: string
}

const EditableColor: React.FC<EditableColorProps> = ({
  path,
  value,
  label,
  className = ''
}) => {
  const { isEditMode, canEdit, updateContent } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isHovered, setIsHovered] = useState(false)

  const handleEdit = () => {
    if (!canEdit() || !isEditMode) return
    setIsEditing(true)
    setEditValue(value)
  }

  const handleSave = () => {
    updateContent(path, editValue)
    setIsEditing(false)
    toast.success(`${label} Farbe gespeichert!`, {
      icon: '🎨',
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
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  // Predefined color presets
  const colorPresets = [
    '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
    '#ef4444', '#ec4899', '#84cc16', '#f97316', '#6b7280'
  ]

  if (!isEditMode || !canEdit()) {
    return (
      <div className={`inline-block ${className}`}>
        <div
          className="w-8 h-8 rounded-xl border-2 border-white/20 shadow-lg"
          style={{ backgroundColor: value }}
          title={`${label}: ${value}`}
        />
      </div>
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
            className="relative w-full max-w-md"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl blur-sm opacity-50"></div>
            <div className="relative bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-xl">
                    <Pipette size={20} className="text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white">{label} bearbeiten</h4>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
                      Farbwähler:
                    </label>
                    <input
                      type="color"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full h-16 rounded-xl border-2 border-white/20 cursor-pointer bg-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
                      Hex-Code:
                    </label>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="#6366f1"
                      className="w-full bg-white/5 border-2 border-indigo-400/50 rounded-xl px-4 py-3 text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
                      Voreinstellungen:
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {colorPresets.map((color) => (
                        <motion.button
                          key={color}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setEditValue(color)}
                          className="w-10 h-10 rounded-lg border-2 border-white/20 shadow-lg transition-all duration-300 hover:border-white/40"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
                      Vorschau:
                    </label>
                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10">
                      <div
                        className="w-16 h-16 rounded-xl border-2 border-white/20 shadow-lg"
                        style={{ backgroundColor: editValue }}
                      />
                      <div className="text-white">
                        <div className="font-medium">Neue Farbe: {editValue}</div>
                        <div className="text-gray-400 text-sm">Original: {value}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
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
                    Enter speichern
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div
          onClick={handleEdit}
          className="cursor-pointer relative inline-block transition-all duration-300"
        >
          <div
            className="w-8 h-8 rounded-xl border-2 border-white/20 shadow-lg transition-all duration-300 hover:scale-110"
            style={{ backgroundColor: value }}
            title={`${label}: ${value} (Klicken zum Bearbeiten)`}
          />
          
          {/* Modern Edit Indicator */}
          {(isHovered || isEditing) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute -top-2 -right-2 z-40"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-1 shadow-2xl border border-white/20 backdrop-blur-sm">
                <Palette size={10} />
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

export default EditableColor
