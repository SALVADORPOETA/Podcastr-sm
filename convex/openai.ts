import { action } from './_generated/server'
import { v } from 'convex/values'

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
})

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, { voice, input }) => {
    const mp3 = await openai.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice,
      input,
    })

    const buffer = await mp3.arrayBuffer()
    return buffer
  },
})

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    })

    if (!response.data || response.data.length === 0) {
      console.error('OpenAI API did not return any image data.')
      throw new Error('Error generating Thumbnail')
    }

    const url = response.data[0].url

    if (!url) {
      throw new Error('Error generating thumbnail')
    }

    const imageResponse = await fetch(url)
    const buffer = await imageResponse.arrayBuffer()
    return buffer
  },
})
