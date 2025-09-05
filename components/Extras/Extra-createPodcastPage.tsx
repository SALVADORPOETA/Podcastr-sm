// C:\Users\DELL\OneDrive\Escritorio\Trabajo\Programación\Frontend\Projects\podcastr-sm\app\(root)\create-podcast\page.tsx

// async function onSubmit(data: z.infer<typeof formSchema>) {
//   try {
//     setIsSubmitting(true)
//     if (!audioUrl || !imageUrl || !voiceType) {
//       toast.error('Please generate audio and image')
//       setIsSubmitting(false)
//       throw new Error('Please generate audio and image')
//     }
//     await createPodcast({
//       podcastTitle: data.podcastTitle,
//       podcastDescription: data.podcastDescription,
//       audioUrl,
//       imageUrl,
//       voiceType,
//       imagePrompt,
//       voicePrompt,
//       views: 0,
//       audioDuration,
//       audioStorageId: audioStorageId!,
//       imageStorageId: imageStorageId!,
//     })
//     toast.success('Podcast created')
//     setIsSubmitting(false)
//     router.push('/')
//   } catch (error) {
//     console.log(error)
//     toast.error('Error')
//     setIsSubmitting(false)
//   }
// }
