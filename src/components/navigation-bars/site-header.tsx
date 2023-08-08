'use client'
import MainNav from '@/components/navigation-bars/main-nav'
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { siteConfig } from "@/config/site"
import { useUserContext } from "@/context/user-context"
import useMediaQuery from '@mui/material/useMediaQuery'
import { Bell, Plus } from "lucide-react"
import Link from "next/link"
import Notifications from "../notifications/notifications"

const ngClass = "w-full no-underline hover:text-primary font-medium flex justify-start"

export function SiteHeader() {
  const isMobile = useMediaQuery('(max-width:550px)');
  const { User, LoadingUser } = useUserContext()
  return (
    <header className="sticky top-0 z-40 w-full border-t-0 border-b bg-foreground">
      {isMobile ?
        <div className="px-2 flex h-16 items-center justify-between space-x-4 sm:space-x-0">
          <Button onClick={() => window.location.href = "/"} className="bg-black rounded-md p-2 h-8 w-8 text-white dark:bg-white dark:text-black text-xl font-extrabold skew-x-12">
            <p className="-skew-x-12">B</p>
          </Button>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex select-none items-center space-x-2 justify-evenly">
              {
                LoadingUser ?
                  <div className="w-9 h-9 rounded-md bg-background animate-pulse border border-gray-600" />
                  :
                  User ?
                    <Avatar className="w-9 h-9">
                      <AvatarImage className="w-full h-full object-cover" src={User?.profile_avatar} alt={`@${User?.user_name}`} />
                      <AvatarFallback>{`${User?.first_name?.substr(0, 1)}${User?.last_name?.substr(0, 1)}`}</AvatarFallback>
                    </Avatar>
                    :
                    <div className="w-9 h-9 rounded-full font-medium bg-background flex items-center justify-center border border-gray-600">
                      <span>ክላ</span>
                    </div>
              }
            </nav>
          </div>
        </div>
        :
        <div className="px-2 flex h-16 items-center justify-between space-x-4 sm:space-x-0">
          <MainNav items={siteConfig.mainNav} />
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex select-none items-center space-x-2 justify-evenly">
              <Link href="/contributions" className={buttonVariants({ variant: "ghost", className: "px-[10px]" })}>
                <Plus className="h-5 w-5" />
              </Link>
              <ThemeToggle />
              <Notifications>
                <div className={buttonVariants({ variant: "ghost", size: "icon", className: "w-fit px-[10px]" })}>
                  <Bell className="h-5 w-5" />
                </div>
              </Notifications>
              {
                LoadingUser ?
                  <div className="w-9 h-9 rounded-full bg-background animate-pulse border border-gray-600" />
                  :
                  User ?
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-fit" asChild>
                        <Button className="w-9 h-9 rounded-md" size="icon" variant="ghost">
                          <Avatar className="w-9 h-9">
                            <AvatarImage className="w-full h-full object-cover" src={User?.profile_avatar} alt={`@${User?.user_name}`} />
                            <AvatarFallback>{`${User?.first_name?.substr(0, 1)}${User?.last_name?.substr(0, 1)}`}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="p-2 mr-5 w-72 flex flex-col items-start">
                        <DropdownMenuLabel>
                          <p>{`${User?.first_name} ${User?.last_name}` ?? ""}</p>
                          <p className="text-muted-foreground text-xs">@{User?.user_name}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link className={buttonVariants({ variant: "ghost", className: ngClass })} href="/profile"><p className="w-full text-start">Profile</p></Link>
                        <Link className={buttonVariants({ variant: "ghost", className: ngClass })} href="/settings"><p className="w-full text-start">Settings</p></Link>
                        <DropdownMenuSeparator />
                        <Link target="_blank" className={buttonVariants({ variant: "ghost", className: ngClass })} href="/profile/settings"><p className="w-full text-start">GitHub</p></Link>
                        <Link className={buttonVariants({ variant: "ghost", className: ngClass })} href="/donate"><p className="w-full text-start">Donate</p></Link>
                        <Link className={buttonVariants({ variant: "ghost", className: ngClass })} href="/roadmap"><p className="w-full text-start">RoadMap</p></Link>
                        <Link className={buttonVariants({ variant: "ghost", className: ngClass })} href="/profile/settings"><p className="w-full text-start">Support</p></Link>
                        <DropdownMenuSeparator />
                        <Button variant="ghost" className={`${ngClass} hover:bg-red-600 hover:text-white`}>Log out</Button>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    :
                    <div className="w-9 h-9 rounded-full font-medium bg-background flex items-center justify-center border border-gray-600">
                      <span>ክላ</span>
                    </div>
              }
            </nav>
          </div>
        </div>

      }

    </header>
  )
}
