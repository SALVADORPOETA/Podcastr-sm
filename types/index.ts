/* eslint-disable no-unused-vars */

import { Dispatch, SetStateAction } from 'react'

import { Id } from '@/convex/_generated/dataModel'

export interface EmptyStateProps {
  title: string
  search?: boolean
  buttonText?: string
  buttonLink?: string
}

export interface TopPodcastersProps {
  _id: Id<'users'>
  _creationTime: number
  email?: string
  imageUrl?: string
  clerkId: string
  name?: string
  podcast: {
    podcastTitle: string
    podcastId: Id<'podcasts'>
  }[]
  totalPodcasts: number
}

export interface PodcastProps {
  _id: Id<'podcasts'>
  _creationTime: number
  audioStorageId?: Id<'_storage'> | null
  user: Id<'users'>
  podcastTitle: string
  podcastDescription: string
  audioUrl?: string | null
  imageUrl?: string | null
  imageStorageId?: Id<'_storage'> | null
  author: string
  authorId: string
  authorImageUrl: string
  voicePrompt: string
  imagePrompt: string | null
  voiceType: string
  audioDuration: number
  views: number
}

export interface ProfilePodcastProps {
  podcasts: PodcastProps[]
  listeners: number
}

export type VoiceType = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'

export interface GeneratePodcastProps {
  voiceType: VoiceType
  setAudio: Dispatch<SetStateAction<string>>
  audio: string
  setAudioStorageId: Dispatch<SetStateAction<Id<'_storage'> | null>>
  voicePrompt: string
  setVoicePrompt: Dispatch<SetStateAction<string>>
  showPrompt?: boolean
  setAudioDuration: Dispatch<SetStateAction<number>>
  isGenerating: boolean
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>
}

export interface GenerateThumbnailProps {
  setImage: Dispatch<SetStateAction<string>>
  setImageStorageId: Dispatch<SetStateAction<Id<'_storage'> | null>>
  image: string
  imagePrompt: string
  setImagePrompt: Dispatch<SetStateAction<string>>
  className: string
}

export interface LatestPodcastCardProps {
  imgUrl: string
  title: string
  duration: string
  index: number
  audioUrl: string
  author: string
  views: number
  podcastId: Id<'podcasts'>
}

export interface PodcastDetailPlayerProps {
  audioUrl?: string | null
  podcastTitle: string
  author: string
  isOwner: boolean
  imageUrl?: string | null
  podcastId: Id<'podcasts'>
  imageStorageId?: Id<'_storage'> | null
  audioStorageId?: Id<'_storage'> | null
  authorImageUrl: string
  authorId: string
  podcastDescription: string
  voicePrompt: string
  voiceType: VoiceType
}

export interface EpisodeDetailPlayerProps {
  podcastId: Id<'podcasts'>
  podcastTitle: string
  podcastDescription: string
  authorId: string
  author: string
  authorImageUrl: string
  isOwner: boolean
  episodeId: Id<'episodes'>
  episodeTitle: string
  episodeDescription: string
  voiceType: VoiceType
  voicePrompt: string
  audioStorageId?: Id<'_storage'> | null
  audioUrl?: string | null
  audioDuration: number
  imageStorageId?: Id<'_storage'> | null
  imageUrl?: string | null
}

export interface AudioProps {
  podcastId: string
  episodeId: string
  title: string
  author: string
  audioUrl: string
  imageUrl: string
}

export interface AudioContextType {
  audio: AudioProps | undefined
  setAudio: React.Dispatch<React.SetStateAction<AudioProps | undefined>>
}

export interface PodcastCardProps {
  imgUrl: string
  title: string
  description: string
  podcastId: Id<'podcasts'>
}

export interface CarouselProps {
  fansLikeDetail: TopPodcastersProps[]
}

export interface ProfileCardProps {
  podcastData: ProfilePodcastProps
  imageUrl: string
  userFirstName: string
}

export type UseDotButtonType = {
  selectedIndex: number
  scrollSnaps: number[]
  onDotButtonClick: (index: number) => void
}
