import { Id } from '@/convex/_generated/dataModel'
import PodcastDetailsClient from './PodcastDetailsClient'

export default function PodcastDetailsPage({
  params,
}: {
  params: { podcastId: string }
}) {
  const podcastId = params.podcastId as Id<'podcasts'>

  return <PodcastDetailsClient podcastId={podcastId} />
}
