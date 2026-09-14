'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    // Check if the splash screen has already been shown in this session
    const hasShown = sessionStorage.getItem('splashShown')
    if (hasShown) {
      setIsVisible(false)
      return
    }

    // Start fade out after 2500ms
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true)
    }, 2500)

    // Completely unmount after fade out completes
    const unmountTimer = setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem('splashShown', 'true')
    }, 3000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(unmountTimer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#130b05] transition-opacity duration-500 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className={`relative flex h-64 w-64 md:h-96 md:w-96 items-center justify-center ${isFadingOut ? 'animate-splash-exit' : 'animate-splash-pop'}`}>
        <Image
          src="/logo.png"
          alt="MargDarshak Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
}
