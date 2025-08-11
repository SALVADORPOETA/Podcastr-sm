'use client'
import { useMutation } from 'convex/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { api } from '@/convex/_generated/api'
import { useAudio } from '@/providers/AudioProvider'
import { PodcastDetailPlayerProps } from '@/types'
import { Button } from './ui/button'
import { toast } from 'sonner'
import EditPodcastModal from './EditPodcastModal'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Dialog, DialogTrigger } from './ui/dialog'

const PodcastDetailPlayer = ({
  audioUrl,
  podcastTitle,
  author,
  imageUrl,
  podcastId,
  imageStorageId,
  audioStorageId,
  isOwner,
  authorImageUrl,
  authorId,
  podcastDescription,
  voicePrompt,
  voiceType,
}: PodcastDetailPlayerProps) => {
  const router = useRouter()
  const updateViews = useMutation(api.podcasts.updatePodcastViews)
  const { setAudio } = useAudio()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const deletePodcast = useMutation(api.podcasts.deletePodcast)
  const menuRef = useRef<HTMLDivElement>(null)
  const alertDialogRef = useRef<HTMLDivElement>(null)

  const handlePlay = () => {
    if (!audioUrl || !imageUrl) {
      return null
    }

    setAudio({
      title: podcastTitle,
      audioUrl,
      imageUrl,
      author,
      podcastId,
    })
    updateViews({ podcastId })
  }

  const handleDelete = async () => {
    if (!podcastId || !imageStorageId || !audioStorageId) {
      toast.error('Missing storage ids, cannot delete podcast')
      return
    }
    try {
      await deletePodcast({ podcastId, imageStorageId, audioStorageId })
      toast.success('Podcast deleted')
      router.push('/')
    } catch (error) {
      console.error('Error deleting podcast', error)
      toast.error('Error deleting podcast')
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickInsideMenu = menuRef.current?.contains(event.target as Node)
      const isClickInsideAlertDialog = alertDialogRef.current?.contains(
        event.target as Node
      )
      if (menuRef.current && !isClickInsideMenu && !isClickInsideAlertDialog) {
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

  if (!imageUrl || !authorImageUrl) return null

  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
      <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
        <Image
          src={imageUrl}
          width={250}
          height={250}
          alt="Podcast image"
          className="aspect-square rounded-lg"
        />
        <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-9">
          <article className="flex flex-col gap-2 max-md:items-center">
            <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
              {podcastTitle}
            </h1>
            <figure
              className="flex cursor-pointer items-center gap-2"
              onClick={() => {
                router.push(`/profile/${authorId}`)
              }}
            >
              <Image
                src={authorImageUrl}
                width={30}
                height={30}
                alt="Caster icon"
                className="size-[30px] rounded-full object-cover"
              />
              <h2 className="text-16 font-normal text-white-3">{author}</h2>
            </figure>
          </article>

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
            &nbsp; Play podcast
          </Button>
        </div>
      </div>
      {isOwner && (
        <div className="relative mt-2" ref={menuRef}>
          <Image
            src="/icons/three-dots.svg"
            width={20}
            height={30}
            alt="Three dots icon"
            className="cursor-pointer"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          />
          {isMenuOpen && (
            <div className="absolute -left-36 -top-2 z-10 flex w-32 flex-col rounded-md bg-black-6 py-1.5">
              <Dialog>
                <DialogTrigger asChild>
                  <div
                    className="flex cursor-pointer justify-start gap-2 py-1.5 hover:bg-black-2 pl-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEditModalOpen(true)
                      setIsMenuOpen(false)
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
                </DialogTrigger>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div
                    className="flex cursor-pointer justify-start gap-2 py-1.5 hover:bg-black-2 pl-6"
                    onClick={(e) => e.stopPropagation()} // ¡Importante!
                  >
                    <Image
                      src="/icons/delete.svg"
                      width={16}
                      height={16}
                      alt="Delete icon"
                    />
                    <h2 className="text-16 font-normal text-white-1">Delete</h2>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent
                  ref={alertDialogRef}
                  className="bg-black-1 text-white-1 border-none"
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white-1">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-white-2">
                      This action cannot be undone. This will permanently delete
                      your podcast and remove its data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex justify-between">
                    <AlertDialogCancel className="text-16 font-normal bg-black-3 text-white-2 border-none">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="text-16 font-normal bg-orange-1 text-white-1 border-none"
                    >
                      Delete
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      )}
      <EditPodcastModal
        podcastId={podcastId}
        initialTitle={podcastTitle}
        initialDescription={podcastDescription}
        initialImageUrl={imageUrl}
        initialAiPrompt={voicePrompt}
        initialVoiceType={voiceType}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  )
}

export default PodcastDetailPlayer
