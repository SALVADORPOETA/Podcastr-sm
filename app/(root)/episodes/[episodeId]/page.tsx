import EpisodeDetailsClient from './EpisodeDetailsClient'

// Este componente de servidor es el punto de entrada de la página del episodio.
const EpisodeDetailsPage = async ({
  params,
}: {
  params: { episodeId: string }
}) => {
  return <EpisodeDetailsClient episodeId={params.episodeId as any} />
}

export default EpisodeDetailsPage

// import EpisodeDetailsClient from './EpisodeDetailsClient'

// // Este componente de servidor es el punto de entrada de la página del episodio.
// const EpisodeDetailsPage = ({ params }: { params: { episodeId: string } }) => {
//   return <EpisodeDetailsClient episodeId={params.episodeId as any} />
// }

// export default EpisodeDetailsPage
