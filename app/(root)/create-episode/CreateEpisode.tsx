'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import GenerateEpisode from '@/components/GenerateEpisode'
import { Loader } from 'lucide-react'
import { Id } from '@/convex/_generated/dataModel'
import { VoiceType } from '@/types'
import { toast } from 'sonner'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { SetStateAction } from 'react'
import { useUser } from '@clerk/nextjs'

const voiceCategories = ['alloy', 'shimmer', 'nova', 'echo', 'fable', 'onyx']

const formSchema = z.object({
  episodeTitle: z.string().min(2),
  episodeDescription: z.string().min(2),
  voiceType: z.string().min(2, 'Please select an AI voice.'),
  voicePrompt: z
    .string()
    .min(2, 'Please provide a prompt to generate the audio.'),
})

const CreateEpisode = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const podcastId = searchParams.get('podcastId') as Id<'podcasts'>

  const [audioUrl, setAudioUrl] = useState('')
  const [audioStorageId, setAudioStorageId] = useState<Id<'_storage'> | null>(
    null
  )
  const [audioDuration, setAudioDuration] = useState(0)

  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { isLoaded, user } = useUser()
  const createEpisode = useMutation(api.episodes.createEpisode)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      episodeTitle: '',
      episodeDescription: '',
      voiceType: '',
      voicePrompt: '',
    },
  })

  const voiceType = form.watch('voiceType')
  const voicePrompt = form.watch('voicePrompt')

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // --- ESTE ES EL NUEVO CÓDIGO DE DEPURACIÓN ---
    console.log('isLoaded:', isLoaded)
    console.log('user:', user)
    // ----------------------------------------------
    try {
      if (!isLoaded || !user) {
        toast.error('You must be logged in to create an episode.')
        return
      }

      if (!podcastId) {
        throw new Error('No podcast ID provided.')
      }

      setIsSubmitting(true)

      const timeout = 15000

      const waitForAudio = new Promise<void>((resolve, reject) => {
        const start = Date.now()
        const checkInterval = setInterval(() => {
          if (audioUrl && data.voiceType) {
            clearInterval(checkInterval)
            resolve()
          } else if (Date.now() - start >= timeout) {
            clearInterval(checkInterval)
            reject(new Error('Please generate audio'))
          }
        }, 500)
      })
      await waitForAudio

      await createEpisode({
        podcastId: podcastId,
        episodeTitle: data.episodeTitle,
        episodeDescription: data.episodeDescription,
        audioUrl,
        audioStorageId: audioStorageId!,
        audioDuration,
        voiceType: data.voiceType as VoiceType,
        voicePrompt: data.voicePrompt,
      })

      toast.success('Episode created successfully')
      router.push(`/podcasts/${podcastId}`)
    } catch (error) {
      console.log(error)
      toast.error(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create New Episode</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex w-full flex-col"
        >
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="episodeTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Episode Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="input-class focus-visible:ring-0 focus-visible:ring-offset-orange-1"
                      placeholder="Episode 1: The Beginning"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="voiceType"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Select AI Voice
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className={cn(
                          'text-16 w-full border border-gray-700 bg-black-1 text-gray-1 focus-visible:ring-0 focus-visible:ring-offset-orange-1'
                        )}
                      >
                        <SelectValue
                          placeholder="Select AI Voice"
                          className="placeholder:text-gray-1"
                        />
                      </SelectTrigger>
                      <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus-visible:ring-0 focus-visible:ring-offset-orange-1">
                        {voiceCategories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="capitalize focus-visible:ring-0 focus:bg-orange-1"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-white-1" />
                  {voiceType && (
                    <audio
                      src={`/${voiceType}.mp3`}
                      autoPlay
                      className="hidden"
                    />
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="episodeDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Episode Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-class focus-visible:ring-0 focus-visible:ring-offset-orange-1"
                      placeholder="Write a short episode description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="voicePrompt"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    AI Prompt to generate Podcast
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-class font-light focus-visible:ring-offset-orange-1"
                      placeholder="Provide text to generate audio"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col pt-10">
            <GenerateEpisode
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioUrl}
              voiceType={voiceType as VoiceType}
              audio={audioUrl}
              voicePrompt={voicePrompt}
              setVoicePrompt={(action: SetStateAction<string>) => {
                if (typeof action === 'function') {
                  form.setValue(
                    'voicePrompt',
                    action(form.getValues('voicePrompt'))
                  )
                } else {
                  form.setValue('voicePrompt', action)
                }
              }}
              setAudioDuration={setAudioDuration}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
            <div className="mt-10 w-full">
              <Button
                type="submit"
                className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
                disabled={isSubmitting || isGenerating || !isLoaded}
              >
                {isSubmitting ? (
                  <>
                    Submitting
                    <Loader size={20} className="animate-spin ml-2" />
                  </>
                ) : (
                  'Submit & Publish Episode'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default CreateEpisode
