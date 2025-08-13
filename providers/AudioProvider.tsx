'use client'

import { createContext, useContext, useState } from 'react'
import { Id } from '@/convex/_generated/dataModel'

interface AudioProps {
  title: string
  episodeTitle?: string // ✅ Propiedad opcional para el título del episodio.
  podcastId?: Id<'podcasts'>
  author: string
  imageUrl: string
  audioUrl: string
}

const AudioContext = createContext<{
  audio: AudioProps | undefined
  setAudio: React.Dispatch<React.SetStateAction<AudioProps | undefined>>
}>({
  audio: undefined,
  setAudio: () => {},
})

const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [audio, setAudio] = useState<AudioProps | undefined>()

  return (
    <AudioContext.Provider value={{ audio, setAudio }}>
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}

export default AudioProvider

// 'use client'

// import { AudioContextType, AudioProps } from '@/types'
// import { usePathname } from 'next/navigation'
// import React, { createContext, useContext, useEffect, useState } from 'react'

// const AudioContext = createContext<AudioContextType | undefined>(undefined)

// const AudioProvider = ({ children }: { children: React.ReactNode }) => {
//   const [audio, setAudio] = useState<AudioProps | undefined>()
//   const pathname = usePathname()

//   // useEffect(() => {
//   //   if (pathname === '/create-podcast') setAudio(undefined)
//   // }, [pathname])

//   return (
//     <AudioContext.Provider value={{ audio, setAudio }}>
//       {children}
//     </AudioContext.Provider>
//   )
// }

// export const useAudio = () => {
//   const context = useContext(AudioContext)
//   if (!context) throw new Error('useAudio must be used within an AudioProvider')
//   return context
// }

// export default AudioProvider
