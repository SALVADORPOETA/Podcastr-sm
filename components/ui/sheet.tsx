// components/ui/sheet.tsx
'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type SheetContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  side?: 'top' | 'bottom' | 'left' | 'right' // <-- agrega esta línea
}

const Sheet = DialogPrimitive.Root

const SheetTrigger = DialogPrimitive.Trigger

const SheetClose = DialogPrimitive.Close

const SheetPortal = (props: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal {...props} />
)
SheetPortal.displayName = DialogPrimitive.Portal.displayName

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    {...props}
  />
))
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName

// const SheetContent = React.forwardRef<
//   React.ElementRef<typeof DialogPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
// >(({ className, children, ...props }, ref) => (
//   <SheetPortal>
//     <SheetOverlay />
//     <DialogPrimitive.Content
//       ref={ref}
//       className={cn(
//         'fixed inset-y-0 right-0 z-50 w-[400px] bg-white p-6 shadow-lg transition-transform sm:rounded-l-lg',
//         className
//       )}
//       {...props}
//     >
//       {children}
//       <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
//         <X className="h-4 w-4" />
//         <span className="sr-only">Close</span>
//       </DialogPrimitive.Close>
//     </DialogPrimitive.Content>
//   </SheetPortal>
// ))
// SheetContent.displayName = DialogPrimitive.Content.displayName

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  SheetContentProps // Usamos el tipo con side incluido
>(({ className, children, side = 'right', ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 w-[400px] bg-white p-6 shadow-lg transition-transform sm:rounded-l-lg',
        side === 'top' && 'inset-x-0 top-0 rounded-b-lg',
        side === 'bottom' && 'inset-x-0 bottom-0 rounded-t-lg',
        side === 'left' && 'inset-y-0 left-0 rounded-r-lg',
        side === 'right' && 'inset-y-0 right-0 rounded-l-lg',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-8 w-8 text-white-1" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = DialogPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4 flex flex-col space-y-1.5', className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

// const SheetTitle = React.forwardRef<
//   HTMLHeadingElement,
//   React.HTMLAttributes<HTMLHeadingElement>
// >(({ className, ...props }, ref) => (
//   <h2
//     ref={ref}
//     className={cn(
//       'text-lg font-semibold leading-none tracking-tight',
//       className
//     )}
//     {...props}
//   />
// ))
// SheetTitle.displayName = 'SheetTitle'

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
SheetTitle.displayName = DialogPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
SheetDescription.displayName = 'SheetDescription'

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
}
