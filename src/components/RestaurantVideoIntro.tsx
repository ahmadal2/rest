import React, { useState, useEffect } from 'react';

const RestaurantVideoIntro = ({ onIntroComplete }: { onIntroComplete: () => void }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [showText, setShowText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const scenes = [
    {
      id: 'pizza',
      emoji: '🍕',
      title: 'Frisch gebacken',
      duration: 2200,
      animation: 'slideInLeft'
    },
    {
      id: 'fries',
      emoji: '🍟',
      title: 'Knusprig frittiert',
      duration: 2200,
      animation: 'slideInRight'
    },
    {
      id: 'burger',
      emoji: '🍔',
      title: 'Perfekt gegrillt',
      duration: 2200,
      animation: 'slideInUp'
    },
    {
      id: 'plate',
      emoji: '🍽️',
      title: 'Liebevoll serviert',
      duration: 2200,
      animation: 'zoomIn'
    },
    {
      id: 'final',
      emoji: '✨',
      title: 'Willkommen',
      subtitle: 'bei DeliciousHub',
      duration: 2200,
      animation: 'fadeIn'
    }
  ];

  useEffect(() => {
    let currentTimeout: ReturnType<typeof setTimeout> | null = null;
    let textTimeout: ReturnType<typeof setTimeout> | null = null;

    const playScene = (sceneIndex: number) => {
      if (sceneIndex >= scenes.length) {
        // Video Ende - fade out and transition to main site
        setTimeout(() => {
          setFadeOut(true);
          // Automatically transition after fade out
          setTimeout(() => {
            onIntroComplete();
          }, 1000);
        }, 1000);
        return;
      }

      setCurrentScene(sceneIndex);
      setShowText(false);

      // Text nach kurzer Verzögerung einblenden
      textTimeout = setTimeout(() => {
        setShowText(true);
      }, 500);

      // Nächste Szene
      currentTimeout = setTimeout(() => {
        playScene(sceneIndex + 1);
      }, scenes[sceneIndex].duration);
    };

    // Intro starten
    playScene(0);

    return () => {
      if (currentTimeout) clearTimeout(currentTimeout);
      if (textTimeout) clearTimeout(textTimeout);
    };
  }, [onIntroComplete]);

  const currentSceneData = scenes[currentScene];

  return (
    <div className={`min-h-screen relative overflow-hidden transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Dynamic Background */}
      <div className="absolute inset-0 transition-all duration-1000">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-yellow-400 via-orange-500 to-red-600 opacity-60"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white bg-opacity-20 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Scene Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          
          {/* Main Food Animation */}
          <div className="mb-8 relative h-48 flex items-center justify-center">
            <div
              key={currentScene}
              className={`transform transition-all duration-1000 ease-out ${
                currentSceneData?.animation === 'slideInLeft' ? 
                  'animate-slideInLeft' :
                currentSceneData?.animation === 'slideInRight' ? 
                  'animate-slideInRight' :
                currentSceneData?.animation === 'slideInUp' ? 
                  'animate-slideInUp' :
                currentSceneData?.animation === 'zoomIn' ? 
                  'animate-zoomIn' :
                  'animate-fadeIn'
              }`}
            >
              <div className="text-9xl md:text-[12rem] filter drop-shadow-2xl animate-pulse">
                {currentSceneData?.emoji}
              </div>
            </div>
            
            {/* Particles around food */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-white bg-opacity-40 rounded-full animate-bounce"
                  style={{
                    left: `${20 + (i * 10)}%`,
                    top: `${30 + (i % 3) * 20}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Text Animation */}
          <div className={`transition-all duration-700 transform ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {currentScene < 4 ? (
              // Food Scenes
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {currentSceneData?.title}
                </h2>
                <div className="w-16 h-1 bg-white bg-opacity-60 mx-auto rounded-full"></div>
              </>
            ) : (
              // Final Scene
              <>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
                  {currentSceneData?.title}
                </h1>
                <h2 className="text-2xl md:text-3xl font-light text-white opacity-90 tracking-wide">
                  {currentSceneData?.subtitle}
                </h2>
                <div className="mt-6">
                  <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-white mx-auto rounded-full shadow-lg animate-pulse"></div>
                </div>
                
                {/* Final Scene Extras */}
                <div className="mt-8 flex justify-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-8 bg-white bg-opacity-40 rounded-full animate-bounce"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '1.5s'
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              {scenes.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index <= currentScene 
                      ? 'bg-white shadow-lg scale-110' 
                      : 'bg-white bg-opacity-30 scale-90'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes slideInLeft {
          0% { 
            transform: translateX(-200px) rotate(-45deg) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: translateX(20px) rotate(5deg) scale(1.1);
            opacity: 0.8;
          }
          100% { 
            transform: translateX(0) rotate(0deg) scale(1);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          0% { 
            transform: translateX(200px) rotate(45deg) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: translateX(-20px) rotate(-5deg) scale(1.1);
            opacity: 0.8;
          }
          100% { 
            transform: translateX(0) rotate(0deg) scale(1);
            opacity: 1;
          }
        }

        @keyframes slideInUp {
          0% { 
            transform: translateY(200px) scale(0.3) rotateY(90deg);
            opacity: 0;
          }
          50% {
            transform: translateY(-30px) scale(1.2) rotateY(-10deg);
            opacity: 0.7;
          }
          100% { 
            transform: translateY(0) scale(1) rotateY(0deg);
            opacity: 1;
          }
        }

        @keyframes zoomIn {
          0% { 
            transform: scale(0.1) rotate(180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.3) rotate(20deg);
            opacity: 0.6;
          }
          100% { 
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          0% { 
            transform: scale(0.8);
            opacity: 0;
          }
          100% { 
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-slideInLeft { animation: slideInLeft 1s ease-out; }
        .animate-slideInRight { animation: slideInRight 1s ease-out; }
        .animate-slideInUp { animation: slideInUp 1s ease-out; }
        .animate-zoomIn { animation: zoomIn 1s ease-out; }
        .animate-fadeIn { animation: fadeIn 1.5s ease-out; }
      `}</style>
    </div>
  );
};

export default RestaurantVideoIntro;