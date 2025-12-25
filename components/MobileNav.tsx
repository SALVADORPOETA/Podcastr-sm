'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'

const MobileNav = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()
  const { user } = useUser()
  const profileRoute = user ? `/profile/${user.id}` : ''
  const isProfileActive =
    pathname === profileRoute || pathname.startsWith(`${profileRoute}/`)
  const navLinkClass = 'flex gap-3 items-center py-4 max-lg:px-4 justify-start'

  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="
            border-none
            bg-black-1
            w-screen
            max-w-full
            md:w-auto
            md:max-w-sm
            overflow-x-hidden
          "
        >
          <SheetHeader>
            <SheetTitle hidden>Menú</SheetTitle>
          </SheetHeader>
          <SheetClose asChild>
            <Link
              href="/"
              className="flex cursor-pointer items-center gap-1 pb-10 pl-4"
            >
              <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
              <h1 className="text-24 font-extrabold text-white-1 ml-2">
                Podcastr
              </h1>
            </Link>
          </SheetClose>
          <div className="flex h-[calc(100vh-72px)] flex-col gap-6 justify-between overflow-y-auto">
            <SignedIn>
              {user && (
                <SheetClose asChild>
                  <Link
                    href={profileRoute}
                    className={cn(navLinkClass, {
                      'bg-nav-focus border-r-4 border-orange-1':
                        isProfileActive,
                    })}
                  >
                    <Image
                      src={user.imageUrl}
                      width={24}
                      height={24}
                      alt="profile"
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="text-16 font-medium text-white-1">
                        My Profile
                      </p>
                    </div>
                  </Link>
                </SheetClose>
              )}
            </SignedIn>
            <nav className="flex h-full flex-col gap-6 text-white-1">
              {sidebarLinks.map(({ route, label, imgURL }) => {
                const isActive =
                  pathname === route || pathname.startsWith(`${route}/`)
                return (
                  <SheetClose asChild key={route}>
                    <Link
                      href={route}
                      className={cn(
                        'flex gap-3 items-center py-4 max-lg:px-4 justify-start',
                        {
                          'bg-nav-focus border-r-4 border-orange-1': isActive,
                        }
                      )}
                    >
                      <Image src={imgURL} alt={label} width={24} height={24} />
                      <p>{label}</p>
                    </Link>
                  </SheetClose>
                )
              })}
              <SignedOut>
                <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
                  <Button
                    asChild
                    className="text-16 w-full bg-orange-1 font-extrabold"
                  >
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
                  <Button
                    className="text-16 w-full bg-orange-1 font-extrabold"
                    onClick={() => signOut(() => router.push('/'))}
                  >
                    Log Out
                  </Button>
                </div>
              </SignedIn>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav
