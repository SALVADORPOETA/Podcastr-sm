import { Id } from '@/convex/_generated/dataModel'
import PodcastDetailsClient from './PodcastDetailsClient'

export default function PodcastDetailsPage({
  params,
}: {
  params: { podcastId: string }
}) {
  // Aquí haces cast si es necesario, o defines podcastId como string si te funciona así
  const podcastId = params.podcastId as Id<'podcasts'>

  return <PodcastDetailsClient podcastId={podcastId} />
}
