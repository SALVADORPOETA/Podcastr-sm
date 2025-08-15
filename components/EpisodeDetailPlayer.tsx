'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useAudio } from '@/providers/AudioProvider'
import Link from 'next/link'
import { useState } from 'react'
import { EpisodeDetailPlayerProps } from '@/types'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import EditEpisodeModal from './EditEpisodeModal'
import { useUser } from '@clerk/nextjs'

const EpisodeDetailPlayer = ({
  podcastId,
  podcastTitle,
  episodeId,
  episodeTitle,
  author,
  authorImageUrl,
  voiceType,
  voicePrompt,
  episodeDescription,
  imageUrl,
  audioUrl,
  // audioDuration,
}: EpisodeDetailPlayerProps) => {
  // const formatDuration = (seconds: number) => {
  //   const hours = Math.floor(seconds / 3600)
  //   const minutes = Math.floor((seconds % 3600) / 60)
  //   const remainingSeconds = Math.floor(seconds % 60)
  //   const pad = (num: number) => num.toString().padStart(2, '0')
  //   return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`
  // }
  const { user } = useUser()
  const updateViews = useMutation(api.episodes.updateEpisodeViews)
  const { setAudio } = useAudio()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handlePlay = () => {
    if (!audioUrl || !imageUrl) {
      return null
    }
    setAudio({
      title: episodeTitle,
      author: podcastTitle,
      episodeTitle: episodeTitle,
      podcastId: podcastId,
      imageUrl: imageUrl,
      audioUrl: audioUrl,
    })
    updateViews({ episodeId })
  }

  if (!imageUrl || !authorImageUrl) return null

  return (
    <div className="mt-6 flex justify-between items-center max-md:flex-col max-md:items-start md:gap-9">
      <Link href={`/podcasts/${podcastId}`}>
        <div className="relative h-52 w-52">
          <Image
            src={imageUrl}
            fill
            alt="podcast image"
            className="aspect-square rounded-lg"
          />
        </div>
      </Link>
      <div className="flex flex-col gap-5 max-md:mt-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-32 font-bold text-white-1">{episodeTitle}</h1> 
          <Link href={`/podcasts/${podcastId}`}>
            <p className="text-16 font-normal text-white-2">{podcastTitle}</p>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href={`/profile/${user?.id}`}
            className="flex-center cursor-pointer gap-1 px-4 py-1"
          >
            <Image
              src={authorImageUrl}
              width={24}
              height={24}
              alt="author"
              className="rounded-full"
            />
            <h2 className="text-16 font-normal text-white-2 px-1">{author}</h2>
            {/* <Image src="/icons/watch.svg" width={24} height={24} alt="watch" />
            <h2 className="text-16 font-bold text-white-1 px-1">
              {formatDuration(audioDuration)}
            </h2> */}
          </Link>
          {audioUrl && (
            <a
              href={audioUrl}
              download
              className="text-16 bg-orange-1 font-bold text-white-1 px-4 py-2 rounded-md"
            >
              Download
            </a>
          )}
          <Button
            onClick={handlePlay}
            className="text-16 w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1"
          >
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="random play"
            />
            &nbsp; Play episode
          </Button>
        </div>
      </div>
      <EditEpisodeModal
        episodeId={episodeId}
        initialTitle={episodeTitle}
        initialDescription={episodeDescription}
        initialAiPrompt={voicePrompt}
        initialVoiceType={voiceType}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  )
}

export default EpisodeDetailPlayer
