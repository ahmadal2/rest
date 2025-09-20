
import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {Edit3, Save, X, Type} from 'lucide-react'
import { useApp } from '../App'
import toast from 'react-hot-toast'
// TODO: When API calls are needed, import apiClient:
// import { apiClient } from '../lib/client'

interface EditableTextProps {
  path: string
  value: string
  type?: 'text' | 'textarea' | 'title' | 'subtitle' | 'button' | 'field'
  className?: string
  placeholder?: string
  multiline?: boolean
  children?: React.ReactNode
  elementType?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'button'
}

const EditableText: React.FC<EditableTextProps> = ({
  path,
  value,
  type = 'text',
  className = '',
  placeholder = 'Text eingeben...',
  multiline = false,
  children,
  elementType = 'span'
}) => {
  const { isEditMode, canEdit, updateContent } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isHovered, setIsHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleEdit = () => {
    if (!canEdit() || !isEditMode) return
    setIsEditing(true)
  }

  const handleSave = () => {
    updateContent(path, editValue)
    setIsEditing(false)
    toast.success('Text gespeichert!', {
      icon: '✨',
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
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      handleSave()
    }
  }

  if (!isEditMode || !canEdit()) {
    const Element = elementType as keyof JSX.IntrinsicElements
    return children || <Element className={className}>{value}</Element>
  }

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <div className="relative z-50">
          <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl blur-sm opacity-50"></div>
          <div className="relative bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
            {multiline || type === 'textarea' ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full bg-white/5 border-2 border-indigo-400/50 rounded-xl px-4 py-3 text-white resize-none min-h-[100px] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300"
                rows={4}
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full bg-white/5 border-2 border-indigo-400/50 rounded-xl px-4 py-3 text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300"
              />
            )}
            
            <div className="flex items-center justify-between mt-4">
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
                {multiline ? 'Strg+Enter speichern' : 'Enter speichern'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={handleEdit}
          className="cursor-pointer relative transition-all duration-300"
        >
          {children || <span>{value}</span>}
          
          {/* Modern Edit Indicator */}
          {(isHovered || isEditing) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute -top-3 -right-3 z-40"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-2 shadow-2xl border border-white/20 backdrop-blur-sm">
                <Type size={14} />
              </div>
            </motion.div>
          )}
          
          {/* Modern Hover Outline */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-cyan-500/30 rounded-lg pointer-events-none blur-sm"
            />
          )}
          
          {/* Hover Border */}
          {isHovered && (
            <div className="absolute -inset-1 border-2 border-indigo-400/50 rounded-lg pointer-events-none" />
          )}
        </div>
      )}
    </div>
  )
}

export default EditableText
