'use client'

import EpisodeDetailPlayer from '@/components/EpisodeDetailPlayer'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery, useMutation } from 'convex/react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { VoiceType } from '@/types'
import { useEffect, useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import EditEpisodeModal from '@/components/EditEpisodeModal'
import { Button } from '@/components/ui/button'

const EpisodeDetailsClient = ({ episodeId }: { episodeId: Id<'episodes'> }) => {
  const router = useRouter()
  const { user } = useUser()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false) // Estado para el AlertDialog

  const episode = useQuery(api.episodes.getEpisodeById, { episodeId })
  const podcast = useQuery(
    api.podcasts.getPodcastById,
    episode?.podcastId ? { podcastId: episode.podcastId } : 'skip'
  )
  const deleteEpisode = useMutation(api.episodes.deleteEpisode)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  if (!episode || !podcast || !user) {
    return null
  }
  const isOwner = user?.id === podcast?.authorId

  const handleDelete = async () => {
    if (!episodeId || !episode.audioStorageId || !podcast?._id) {
      toast.error('Missing data, cannot delete episode')
      return
    }

    try {
      await deleteEpisode({
        episodeId,
        audioStorageId: episode.audioStorageId,
      })

      toast.success('Episode deleted')
      router.push(`/podcasts/${podcast._id}`)
    } catch (error) {
      console.error('Error deleting episode', error)
      toast.error('Error deleting episode')
    }
  }

  return (
    <section className="flex w-full max-w-full flex-col overflow-x-hidden">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Currently Playing</h1>
        <figure className="flex gap-3 items-center relative">
          <div className="flex gap-3">
            <Image
              src="/icons/headphone.svg"
              width={24}
              height={24}
              alt="headphone"
            />
            <h2 className="text-16 font-bold text-white-1">{episode?.views}</h2>
          </div>
          {isOwner && (
            <div className="relative cursor-pointer max-w-full">
              <Image
                src="/icons/three-dots.svg"
                width={20}
                height={30}
                alt="Three dots icon"
                className="cursor-pointer"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              />

              {isMenuOpen && (
                <div
                  className="
                    absolute top-8 right-0 z-10
                    flex w-32 max-w-[calc(100vw-16px)]
                    flex-col rounded-md bg-black-6 py-1.5
                    overflow-hidden
                  "
                  ref={menuRef}
                >
                  <div
                    className="flex cursor-pointer justify-start gap-2 py-1.5 hover:bg-black-2 pl-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsMenuOpen(false)
                      setIsEditModalOpen(true)
                    }}
                  >
                    <Image
                      src="/icons/edit.svg"
                      width={16}
                      height={16}
                      alt="Edit icon"
                    />
                    <h2 className="text-16 font-normal text-white-1">Edit</h2>
                  </div>

                  <div
                    className="flex cursor-pointer justify-start gap-2 py-1.5 hover:bg-black-2 pl-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsMenuOpen(false)
                      setIsAlertOpen(true) // Simplemente cambia el estado para abrir el Alert
                    }}
                  >
                    <Image
                      src="/icons/delete.svg"
                      width={16}
                      height={16}
                      alt="Delete icon"
                    />
                    <h2 className="text-16 font-normal text-white-1">Delete</h2>
                  </div>
                </div>
              )}
            </div>
          )}
        </figure>
      </header>

      {/* Mueve el AlertDialog fuera del menú */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-black-1 text-white-1 border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white-1">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white-2">
              This action cannot be undone. This will permanently delete your
              episode and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex justify-between">
            <AlertDialogCancel className="text-16 font-normal bg-black-3 text-white-2 border-none">
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDelete}
              className="text-16 font-normal bg-orange-1 text-white-1 border-none"
            >
              Delete
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mueve el Dialog de edición también fuera del menú */}
      <div className="w-full max-w-full overflow-x-hidden">
        <EditEpisodeModal
          episodeId={episode._id}
          initialTitle={episode.episodeTitle}
          initialDescription={episode.episodeDescription}
          initialAiPrompt={episode.voicePrompt}
          initialVoiceType={episode.voiceType as VoiceType}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
        <EpisodeDetailPlayer
          podcastId={podcast._id}
          podcastTitle={podcast.podcastTitle}
          authorId={podcast.authorId}
          author={podcast.author}
          authorImageUrl={podcast.authorImageUrl || ''}
          podcastDescription={podcast.podcastDescription}
          imageUrl={podcast.imageUrl || ''}
          episodeId={episode._id}
          episodeTitle={episode.episodeTitle}
          episodeDescription={episode.episodeDescription}
          voicePrompt={episode.voicePrompt}
          audioUrl={episode.audioUrl}
          audioDuration={episode.audioDuration}
          isOwner={isOwner}
          voiceType={episode.voiceType as VoiceType}
          imageStorageId={podcast.imageStorageId}
          audioStorageId={episode.audioStorageId}
        />
        <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">
          {episode?.episodeDescription}
        </p>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-18 font-bold text-white-1">Transcription</h1>
            <p className="text-16 font-medium text-white-2">
              {episode?.voicePrompt}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EpisodeDetailsClient
