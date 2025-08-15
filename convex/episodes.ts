import { ConvexError, v } from 'convex/values'
import { mutation, action, query } from './_generated/server'

// Mutación para generar una URL para subir archivos.
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})

// Mutación para crear un nuevo episodio.
export const createEpisode = mutation({
  args: {
    podcastId: v.id('podcasts'),
    episodeTitle: v.string(),
    episodeDescription: v.string(),
    audioUrl: v.string(),
    audioStorageId: v.id('_storage'),
    audioDuration: v.number(),
    voiceType: v.string(),
    voicePrompt: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }

    const parentPodcast = await ctx.db.get(args.podcastId)
    if (!parentPodcast) {
      throw new Error('Podcast not found')
    }

    if (parentPodcast.authorId !== identity.subject) {
      throw new Error('Unauthorized')
    }

    const episode = await ctx.db.insert('episodes', {
      ...args,
      authorId: identity.subject,
      createdAt: Date.now(),
      views: 0,
    })
    const newEpisode = await ctx.db.get(episode)

    return newEpisode
  },
})

export const getUrl = action({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId)
  },
})

export const getEpisodesByPodcastId = query({
  args: { podcastId: v.id('podcasts') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('episodes')
      .filter((q) => q.eq(q.field('podcastId'), args.podcastId))
      .collect()
  },
})

export const getEpisodeById = query({
  args: {
    episodeId: v.id('episodes'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.episodeId)
  },
})

export const deleteEpisode = mutation({
  args: {
    episodeId: v.id('episodes'),
    audioStorageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new ConvexError('User not authenticated')
    }

    const episode = await ctx.db.get(args.episodeId)

    if (!episode) {
      throw new ConvexError('Episode not found')
    }

    if (episode.authorId !== identity.subject) {
      throw new ConvexError('Only the author can delete the episode')
    }

    await ctx.db.delete(args.episodeId)
    await ctx.storage.delete(args.audioStorageId)
  },
})

export const updateEpisode = mutation({
  args: {
    episodeId: v.id('episodes'),
    updatedTitle: v.optional(v.string()),
    updatedDescription: v.optional(v.string()),
    updatedVoicePrompt: v.optional(v.string()),
    updatedVoiceType: v.optional(v.string()),
    updatedAudioUrl: v.optional(v.string()),
    updatedAudioStorageId: v.optional(v.id('_storage')),
    updatedAudioDuration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new ConvexError('User not authenticated')
    }

    const episode = await ctx.db.get(args.episodeId)

    if (!episode) {
      throw new ConvexError('Episode not found')
    }

    if (episode.authorId !== identity.subject) {
      throw new ConvexError('Only the author can update the episode')
    }

    const updateData: Record<string, any> = {}
    if (args.updatedTitle !== undefined)
      updateData.episodeTitle = args.updatedTitle
    if (args.updatedDescription !== undefined)
      updateData.episodeDescription = args.updatedDescription
    if (args.updatedVoicePrompt !== undefined)
      updateData.voicePrompt = args.updatedVoicePrompt
    if (args.updatedVoiceType !== undefined)
      updateData.voiceType = args.updatedVoiceType
    if (args.updatedAudioUrl !== undefined)
      updateData.audioUrl = args.updatedAudioUrl
    if (args.updatedAudioStorageId !== undefined)
      updateData.audioStorageId = args.updatedAudioStorageId
    if (args.updatedAudioDuration !== undefined)
      updateData.audioDuration = args.updatedAudioDuration

    return await ctx.db.patch(args.episodeId, updateData)
  },
})

export const updateEpisodeViews = mutation({
  args: {
    episodeId: v.id('episodes'),
  },
  handler: async (ctx, args) => {
    // 1. Busca el episodio por su ID
    const episode = await ctx.db.get(args.episodeId)

    // Si el episodio no existe, lanza un error
    if (!episode) {
      throw new Error('Episode not found')
    }

    // 2. Actualiza el campo 'views' del episodio.
    await ctx.db.patch(args.episodeId, {
      views: (episode.views || 0) + 1, // `episode.views || 0` es para manejar si el campo no existe aún.
    })
  },
})
