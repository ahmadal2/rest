
import React from 'react'
import { motion } from 'framer-motion'
// TODO: When API calls are needed, import apiClient:
// import { apiClient } from '../lib/client'

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Hintergrund mit Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
      
      {/* Animierte Partikel */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hauptinhalt */}
      <div className="relative z-10 text-center">
        {/* Logo/Titel */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1
          }}
          className="mb-8"
        >
          <h1 className="text-6xl font-display font-bold text-white neon-text">
            Restaurant
          </h1>
          <motion.div
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full mx-auto mt-4"
          />
        </motion.div>

        {/* Lade-Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center items-center space-x-2"
        >
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </motion.div>

        {/* Lade-Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-xl text-gray-300 mt-8 animate-pulse-neon"
        >
          Lade die Zukunft des Genusses...
        </motion.p>

        {/* 3D Rotierende Kugel */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-30"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          className="absolute -bottom-20 -left-20 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-30"
          animate={{
            rotate: [360, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </div>
  )
}

export default LoadingScreen
