// 'use client'

// import { useState, useRef, useEffect } from 'react'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog'
// import { Dialog, DialogTrigger } from '@/components/ui/dialog'
// import Image from 'next/image'
// import { useMutation } from 'convex/react'
// import { api } from '@/convex/_generated/api'
// import { Id } from '@/convex/_generated/dataModel'
// import { useRouter } from 'next/navigation'
// import { toast } from 'sonner'
// import EditEpisodeModal from './EditEpisodeModal'
// import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog'

// type EpisodeActionsMenuProps = {
//   episodeId: Id<'episodes'>
//   podcastId: Id<'podcasts'>
//   initialTitle: string
//   initialDescription: string
//   audioStorageId: Id<'_storage'> | null
// }

// const EpisodeActionsMenu = ({
//   episodeId,
//   podcastId,
//   initialTitle,
//   initialDescription,
//   audioStorageId,
// }: EpisodeActionsMenuProps) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
//   const [showDeleteAlert, setShowDeleteAlert] = useState(false)
//   const [isDeleting, setIsDeleting] = useState(false)

//   const router = useRouter()
//   const deleteEpisode = useMutation(api.episodes.deleteEpisode)
//   const menuRef = useRef<HTMLDivElement>(null)
//   const alertDialogRef = useRef<HTMLDivElement>(null)

//   const handleDelete = async () => {
//     setIsDeleting(true)
//     try {
//       if (!audioStorageId) {
//         throw new Error('Missing audio storage ID, cannot delete episode.')
//       }
//       await deleteEpisode({ episodeId, audioStorageId })
//       toast.success('Episode deleted successfully')
//       router.push(`/podcasts/${podcastId}`)
//     } catch (error) {
//       console.error(error)
//       toast.error('Failed to delete episode.')
//     } finally {
//       setIsDeleting(false)
//       setShowDeleteAlert(false)
//     }
//   }

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const isClickInsideMenu = menuRef.current?.contains(event.target as Node)
//       const isClickInsideAlertDialog = alertDialogRef.current?.contains(
//         event.target as Node
//       )
//       if (menuRef.current && !isClickInsideMenu && !isClickInsideAlertDialog) {
//         setIsMenuOpen(false)
//       }
//     }
//     if (isMenuOpen) {
//       document.addEventListener('mousedown', handleClickOutside)
//     }
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [isMenuOpen])

//   return (
//     <>
//       <div className="relative mt-2" ref={menuRef}>
//         <Image
//           src="/icons/three-dots.svg"
//           width={20}
//           height={30}
//           alt="Three dots icon"
//           className="cursor-pointer"
//           onClick={() => setIsMenuOpen((prev) => !prev)}
//         />
//         {isMenuOpen && (
//           <div className="absolute -left-36 -top-2 z-10 flex w-32 flex-col rounded-md bg-black-6 py-1.5">
//             <Dialog>
//               <DialogTrigger asChild>
//                 <div
//                   className="flex cursor-pointer justify-start gap-2 py-1.5 hover:bg-black-2 pl-6"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     setIsEditModalOpen(true)
//                     setIsMenuOpen(false)
//                   }}
//                 >
//                   <Image
//                     src="/icons/edit.svg"
//                     width={16}
//                     height={16}
//                     alt="Edit icon"
//                   />
//                   <h2 className="text-16 font-normal text-white-1">Edit</h2>
//                 </div>
//               </DialogTrigger>
//             </Dialog>
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <div
//                   className="flex cursor-pointer justify-start gap-2 py-1.5 hover:bg-black-2 pl-6"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     setShowDeleteAlert(true)
//                     setIsMenuOpen(false)
//                   }}
//                 >
//                   <Image
//                     src="/icons/delete.svg"
//                     width={16}
//                     height={16}
//                     alt="Delete icon"
//                   />
//                   <h2 className="text-16 font-normal text-white-1">Delete</h2>
//                 </div>
//               </AlertDialogTrigger>
//               <AlertDialogContent
//                 ref={alertDialogRef}
//                 className="bg-black-1 text-white-1 border-none"
//               >
//                 <AlertDialogHeader>
//                   <AlertDialogTitle className="text-white-1">
//                     Are you absolutely sure?
//                   </AlertDialogTitle>
//                   <AlertDialogDescription className="text-white-2">
//                     This action cannot be undone. This will permanently delete
//                     your podcast and remove its data from our servers.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <div className="flex justify-between">
//                   <AlertDialogCancel className="text-16 font-normal bg-black-3 text-white-2 border-none">
//                     Cancel
//                   </AlertDialogCancel>
//                   <AlertDialogAction
//                     onClick={handleDelete}
//                     className="text-16 font-normal bg-orange-1 text-white-1 border-none"
//                   >
//                     Delete
//                   </AlertDialogAction>
//                 </div>
//               </AlertDialogContent>
//             </AlertDialog>
//           </div>
//         )}
//       </div>

//       <EditEpisodeModal
//         isOpen={isEditModalOpen}
//         onClose={() => setIsEditModalOpen(false)}
//         episodeId={episodeId}
//         initialTitle={initialTitle}
//         initialDescription={initialDescription}
//       />
//     </>
//   )
// }

// export default EpisodeActionsMenu
