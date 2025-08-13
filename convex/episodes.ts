import { v } from 'convex/values'
import { mutation, action, query } from './_generated/server'
import { Id } from './_generated/dataModel'

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
    // ✅ CORRECCIÓN: Usamos 'identity' en lugar de 'user' para mayor claridad.
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }

    const parentPodcast = await ctx.db.get(args.podcastId)
    if (!parentPodcast) {
      throw new Error('Podcast not found')
    }

    // ✅ CORRECCIÓN: Comparamos con 'identity.subject', no 'user.id'.
    console.log('Current User ID:', identity.subject)
    console.log('Podcast Author ID:', parentPodcast.authorId)

    if (parentPodcast.authorId !== identity.subject) {
      throw new Error('Unauthorized')
    }

    const episode = await ctx.db.insert('episodes', {
      ...args,
      // ✅ CORRECCIÓN: Usamos 'identity.subject' como authorId.
      authorId: identity.subject,
      podcastId: args.podcastId,
      createdAt: Date.now(),
    })
    return episode
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
