import React, { Suspense } from 'react'
import DiscoverClient from './DiscoverClient'
import LoaderSpinner from '@/components/LoaderSpinner'

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <div>
          <LoaderSpinner />
        </div>
      }
    >
      <DiscoverClient />
    </Suspense>
  )
}
