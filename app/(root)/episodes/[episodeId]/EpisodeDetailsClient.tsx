'use client'

import EmptyState from '@/components/EmptyState'
import PodcastCard from '@/components/PodcastCard'
import EpisodeDetailPlayer from './EpisodeDetailPlayer'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import Image from 'next/image'

const EpisodeDetailsClient = ({ episodeId }: { episodeId: Id<'episodes'> }) => {
  // En el componente EpisodeDetailsClient.tsx
  const episode = useQuery(api.episodes.getEpisodeById, { episodeId })

  const podcast = useQuery(
    api.podcasts.getPodcastById,
    episode?.podcastId ? { podcastId: episode.podcastId } : 'skip'
  )

  const similarPodcasts = useQuery(
    api.podcasts.getPodcastByVoiceType,
    episode?.podcastId ? { podcastId: episode.podcastId } : 'skip'
  )

  if (!episode || !podcast || !similarPodcasts) {
    return null
  }

  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Currently Playing</h1>
        <figure className="flex gap-3">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphone"
          />
          <h2 className="text-16 font-bold text-white-1">{podcast?.views}</h2>
        </figure>
      </header>

      <EpisodeDetailPlayer
        episodeTitle={episode.episodeTitle}
        podcastId={podcast._id}
        podcastTitle={podcast.podcastTitle}
        // ✅ CORRECCIÓN: Pasamos el autor real del podcast
        author={podcast.author}
        audioUrl={episode.audioUrl}
        imageUrl={podcast.imageUrl || ''}
        authorImageUrl={podcast.authorImageUrl || ''}
        audioDuration={episode.audioDuration}
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
        {podcast?.imagePrompt && (
          <div className="flex flex-col gap-4">
            <h1 className="text-18 font-bold text-white-1">Thumbnail Prompt</h1>
            <p className="text-16 font-medium text-white-2">
              {podcast?.imagePrompt}
            </p>
          </div>
        )}
      </div>

      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar Podcasts</h1>
        {similarPodcasts.length > 0 ? (
          <div className="podcast_grid">
            {similarPodcasts.map(
              ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                <PodcastCard
                  key={_id}
                  imgUrl={imageUrl!}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                />
              )
            )}
          </div>
        ) : (
          <EmptyState
            title="No similar podcasts found"
            buttonLink="/discover"
            buttonText="Discover more podcasts"
          />
        )}
      </section>
    </section>
  )
}

export default EpisodeDetailsClient
