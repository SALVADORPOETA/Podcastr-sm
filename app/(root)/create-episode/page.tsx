// app/(root)/create-episode/page.tsx
import { Suspense } from 'react'
import CreateEpisode from './CreateEpisode'
import LoaderSpinner from '@/components/LoaderSpinner'

export default function CreateEpisodePage() {
  return (
    <Suspense fallback={<LoaderSpinner />}>
      <CreateEpisode />
    </Suspense>
  )
}
