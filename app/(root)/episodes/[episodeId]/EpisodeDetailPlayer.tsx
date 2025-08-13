'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useAudio } from '@/providers/AudioProvider'
import { Id } from '@/convex/_generated/dataModel'
import Link from 'next/link'

interface EpisodeDetailPlayerProps {
  episodeTitle: string
  podcastId: Id<'podcasts'>
  podcastTitle: string
  audioUrl: string
  imageUrl: string
  authorImageUrl: string
  audioDuration: number
  author: string
}

const EpisodeDetailPlayer = ({
  episodeTitle,
  podcastId,
  podcastTitle,
  audioUrl,
  imageUrl,
  audioDuration,
}: EpisodeDetailPlayerProps) => {
  // const [isPlaying, setIsPlaying] = useState(false)
  const { setAudio } = useAudio()

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    const pad = (num: number) => num.toString().padStart(2, '0')

    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`
  }

  const handlePlay = () => {
    // setIsPlaying(true)
    setAudio({
      title: episodeTitle,
      author: podcastTitle,
      episodeTitle: episodeTitle,
      podcastId: podcastId,
      imageUrl: imageUrl,
      audioUrl: audioUrl,
    })
  }

  return (
    <div className="mt-6 flex justify-between items-center max-md:flex-col max-md:items-start md:gap-9">
      <Link href={`/podcasts/${podcastId}`}>
        <div className="relative h-52 w-52">
          <Image
            src={imageUrl}
            fill
            alt="podcast image"
            className="aspect-square rounded-lg"
          />
        </div>
      </Link>
      <div className="flex flex-col gap-5 max-md:mt-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-32 font-bold text-white-1">{episodeTitle}</h1>
          <Link href={`/podcasts/${podcastId}`}>
            <p className="text-16 font-normal text-white-2">{podcastTitle}</p>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex-center cursor-pointer gap-1 rounded-full bg-[#1A1A1A] px-4 py-1">
            <Image src="/icons/watch.svg" width={24} height={24} alt="watch" />
            <h2 className="text-16 font-bold text-white-1 px-1">
              {formatDuration(audioDuration)}
            </h2>
          </div>
          <a
            href={audioUrl}
            download
            className="text-16 bg-orange-1 font-bold text-white-1 px-4 py-2 rounded-md"
          >
            Download
          </a>
          <Button
            onClick={handlePlay}
            className="text-16 w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1"
          >
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="random play"
            />
            &nbsp; Play episode
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EpisodeDetailPlayer
