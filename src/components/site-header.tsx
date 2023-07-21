import Link from "next/link"
import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Plus } from "lucide-react"
import { useUserContext } from "@/context/user-context"

const ngClass = "no-underline hover:text-primary"

export function SiteHeader() {
  const { User } = useUserContext()
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-foreground">
      <div className="container flex h-16 items-center justify-between space-x-4 sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex select-none items-center space-x-1">
            <Link href="/contributions" className={buttonVariants({ variant: "ghost" })}>
              <Plus className="h-5 w-5" />
            </Link>
            <ThemeToggle />
            <Button size="icon" variant={null}>
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-fit" asChild>
                <Button className="w-fit rounded-full" size="icon" variant={null}>
                  <Avatar>
                    <AvatarImage src={User?.profile_avatar} alt={`@${User?.user_name}`} />
                    <AvatarFallback>{`${User?.first_name?.substr(0, 1)}${User?.last_name?.substr(0, 1)}`}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-5 w-56">
                <DropdownMenuLabel>
                  <p>{`${User?.first_name} ${User?.last_name}` ?? ""}</p>
                  <p className="text-muted-foreground text-sm">@{User?.first_name}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <Link className={ngClass} href="/profile">Profile</Link>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer">
                    <Link className={ngClass} href="/profile/settings">
                      Settings
                    </Link>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Link className={ngClass} href="/profile/settings">
                    GitHub
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link className={ngClass} href="/profile/settings">
                    Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  )
}
