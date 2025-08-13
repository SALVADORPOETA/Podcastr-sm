import { GeneratePodcastProps } from '@/types'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid'
import { useUploadFiles } from '@xixixao/uploadstuff/react'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'

// New hook for generating episodes
const useGenerateEpisode = ({
  setAudio,
  voiceType,
  voicePrompt,
  setAudioStorageId,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const generateUploadUrl = useMutation(api.episodes.generateUploadUrl)
  const { startUpload } = useUploadFiles(generateUploadUrl)

  const getEpisodeAudio = useAction(api.openai.generateAudioAction)
  const getAudioUrl = useAction(api.episodes.getUrl)

  // ✅ CORRECTED: Get user info and isLoaded state from Clerk
  const { user, isLoaded } = useUser()
  const userId = user?.id || null

  const generateEpisode = async () => {
    setIsGenerating(true)
    setAudio('')

    if (!userId) {
      toast.warning('You must be logged in to generate an episode')
      return setIsGenerating(false)
    }

    if (!voicePrompt) {
      toast.warning('Please provide a prompt to generate the audio')
      return setIsGenerating(false)
    }
    if (!voiceType) {
      toast.warning('Please select an AI voice')
      return setIsGenerating(false)
    }

    try {
      const response = await getEpisodeAudio({
        voice: voiceType,
        input: voicePrompt,
      })

      const blob = new Blob([response], { type: 'audio/mpeg' })
      const fileName = `episode-${uuidv4()}.mp3`
      const file = new File([blob], fileName, { type: 'audio/mpeg' })

      const uploaded = await startUpload([file])
      const storageId = (uploaded[0].response as any).storageId

      setAudioStorageId(storageId)

      const audioUrl = await getAudioUrl({ storageId })
      setAudio(audioUrl!)
      setIsGenerating(false)
      toast.success('Audio generated successfully!')
    } catch (error) {
      console.log('Error generating episode audio', error)
      toast.error('Error creating episode')
      setIsGenerating(false)
    }
  }

  return {
    isGenerating,
    generateEpisode,
  }
}

const GenerateEpisode = ({
  showPrompt = false,
  ...props
}: GeneratePodcastProps) => {
  const { isGenerating, generateEpisode } = useGenerateEpisode(props)

  // ✅ CORRECTED: Get isLoaded state and disable button while loading
  const { isLoaded } = useUser()

  return (
    <div>
      {showPrompt && (
        <div className="flex flex-col gap-2.5">
          <Label className="text-16 font-bold text-white-1">
            AI Prompt to generate audio
          </Label>
          <Textarea
            className="input-class font-light focus-visible:ring-offset-orange-1"
            placeholder="Provide text to generate the audio"
            rows={5}
            value={props.voicePrompt}
            onChange={(e) => props.setVoicePrompt(e.target.value)}
          />
        </div>
      )}
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="button"
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
          onClick={generateEpisode}
          disabled={isGenerating || !isLoaded} // ✅ CORRECTED: Disable button if loading or generating
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            'Generate Audio'
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  )
}

export default GenerateEpisode
