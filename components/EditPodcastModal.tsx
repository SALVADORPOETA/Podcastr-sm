'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import GenerateThumbnail from './GenerateThumbnail'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VoiceType } from '@/types'
import GeneratePodcast from './GeneratePodcast'

const voiceCategories = [
  'alloy',
  'shimmer',
  'nova',
  'echo',
  'fable',
  'onyx',
] as const

// Define el esquema de validación para el formulario de edición
const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(2),
  aiPrompt: z.string().min(2),
  voiceType: z.enum(voiceCategories),
})

interface EditPodcastModalProps {
  podcastId: Id<'podcasts'>
  initialTitle: string
  initialDescription: string
  initialImageUrl: string
  initialAiPrompt: string
  initialVoiceType: VoiceType
  isOpen: boolean
  onClose: () => void
}

const EditPodcastModal = ({
  podcastId,
  initialTitle,
  initialDescription,
  initialImageUrl,
  isOpen,
  onClose,
  initialAiPrompt,
  initialVoiceType,
}: EditPodcastModalProps) => {
  const router = useRouter()
  const updatePodcast = useMutation(api.podcasts.updatePodcast)
  const [voiceType, setVoiceType] = useState<VoiceType | null>(initialVoiceType)

  const audioRef = useRef<HTMLAudioElement>(null)

  const [imageUrl, setImageUrl] = useState(initialImageUrl)
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageStorageId, setImageStorageId] = useState<Id<'_storage'> | null>(
    null
  )

  const [audioUrl, setAudioUrl] = useState('')
  const [audioStorageId, setAudioStorageId] = useState<Id<'_storage'> | null>(
    null
  )
  const [audioDuration, setAudioDuration] = useState(0)
  const [audio, setAudio] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: initialTitle,
      podcastDescription: initialDescription,
      aiPrompt: initialAiPrompt,
      voiceType: initialVoiceType,
    },
  })

  useEffect(() => {
    // Solo si en el modal hay un voiceType seleccionado
    if (voiceType && audioRef.current) {
      // Cargamos el audio y luego lo reproducimos. Esto asegura que el
      // navegador haya precargado el nuevo archivo de audio.
      audioRef.current.load()
      audioRef.current.play()
    }
  }, [voiceType]) // El efecto se dispara cuando cambia `voiceType` o el modal se abre

  const handleVoiceChange = (value: string) => {
    // Puedes definir voiceCategories si lo necesitas
    const voiceCategories = [
      'alloy',
      'shimmer',
      'nova',
      'echo',
      'fable',
      'onyx',
    ]
    if (voiceCategories.includes(value as VoiceType)) {
      setVoiceType(value as VoiceType)
      if (audioRef.current) {
        audioRef.current.play()
      }
    }
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      setAudio('')
      setAudioUrl('')
      setAudioStorageId(null)

      const updateData: {
        podcastId: Id<'podcasts'>
        updatedTitle: string
        updatedDescription: string
        updatedImageUrl: string
        updatedVoicePrompt: string
        updatedVoiceType: string
        updatedImagePrompt: string
        updatedImageStorageId?: Id<'_storage'>
        updatedAudioUrl?: string
        updatedAudioStorageId?: Id<'_storage'>
        updatedAudioDuration?: number
      } = {
        podcastId,
        updatedTitle: data.podcastTitle,
        updatedDescription: data.podcastDescription,
        updatedVoicePrompt: data.aiPrompt,
        updatedVoiceType: data.voiceType,
        updatedImageUrl: imageUrl,
        updatedImagePrompt: imagePrompt,
      }

      if (imageStorageId !== null) {
        updateData.updatedImageStorageId = imageStorageId
      }

      if (audioUrl) {
        updateData.updatedAudioUrl = audioUrl
        updateData.updatedAudioStorageId = audioStorageId!
        updateData.updatedAudioDuration = audioDuration
      }

      await updatePodcast(updateData)
      toast.success('Podcast updated successfully')
      onClose()
      router.refresh()
    } catch (error) {
      console.error('Error updating podcast', error)
      toast.error('Error updating podcast')
    } finally {
      setIsSubmitting(false)
    }
  }
  const handleClose = () => {
    setAudioUrl('')
    setVoiceType(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="flex flex-col border-none bg-black-1 text-white-1 overflow-y-auto max-h-full">
        <DialogHeader>
          <DialogTitle>Edit Podcast</DialogTitle>
          <DialogDescription>Make changes to your podcast.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      className="modal-input-class focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="modal-input-class focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="voiceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voice Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      handleVoiceChange(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full focus-visible:ring-0">
                        <SelectValue
                          placeholder="Select a voice"
                          className="placeholder:text-gray-1"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus-visible:ring-0 focus:ring-orange-1">
                      {voiceCategories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                          className="cursor-pointer focus:bg-orange-1"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    {voiceType && (
                      <audio
                        ref={audioRef}
                        src={`/${voiceType}.mp3`}
                        className="hidden"
                      />
                    )}
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aiPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Prompt to generate Podcast</FormLabel>
                  <FormControl>
                    <Textarea
                      className="modal-input-class focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <GeneratePodcast
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioUrl}
              voiceType={form.getValues('voiceType')}
              voicePrompt={form.watch('aiPrompt')}
              setAudioDuration={setAudioDuration}
              audio={audio}
              setVoicePrompt={(value) => {
                if (typeof value === 'function') {
                  form.setValue('aiPrompt', value(form.getValues('aiPrompt')))
                } else {
                  form.setValue('aiPrompt', value)
                }
              }}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              showPrompt={false}
            />
            {audioUrl && (
              <audio controls src={audioUrl} autoPlay className="mt-5 w-full" />
            )}
            <div className="flex flex-col gap-2">
              <FormLabel>Current Thumbnail</FormLabel>
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="podcast-thumbnail"
                  width={150}
                  height={150}
                  className="rounded-lg"
                />
              )}
            </div>
            <GenerateThumbnail
              setImage={setImageUrl}
              setImageStorageId={setImageStorageId}
              image={imageUrl}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
              className="modal-input-class border border-gray-700"
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="bg-black-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-black-6"
              >
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditPodcastModal
