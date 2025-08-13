// app/(root)/podcasts/[podcastId]/page.tsx
import { Id } from '@/convex/_generated/dataModel'
import PodcastDetailsClient from './PodcastDetailsClient'

export default async function PodcastDetailsPage({
  params,
}: {
  params: { podcastId: string }
}) {
  const podcastId = params.podcastId as Id<'podcasts'>

  return <PodcastDetailsClient podcastId={podcastId} />
}
