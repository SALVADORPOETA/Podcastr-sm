import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  podcasts: defineTable({
    user: v.id('users'),
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioUrl: v.optional(v.string()),
    audioStorageId: v.optional(v.id('_storage')),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id('_storage')),
    author: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    audioDuration: v.number(),
    views: v.number(),
  })
    .searchIndex('search_author', { searchField: 'author' })
    .searchIndex('search_title', { searchField: 'podcastTitle' })
    .searchIndex('search_body', { searchField: 'podcastDescription' }),
  users: defineTable({
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    clerkId: v.string(),
    name: v.optional(v.string()),
  }),
  episodes: defineTable({
    podcastId: v.id('podcasts'),
    episodeTitle: v.string(),
    episodeDescription: v.string(),
    audioUrl: v.string(),
    audioStorageId: v.id('_storage'),
    audioDuration: v.number(),
    voiceType: v.string(),
    voicePrompt: v.string(),
    authorId: v.string(),
    createdAt: v.number(),
  }),
})
