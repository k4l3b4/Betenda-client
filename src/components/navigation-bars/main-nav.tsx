import Link from "next/link"
import SearchComp from "@/components/search/search"
import { siteConfig } from "@/config/site"
import { NavItem } from "@/types/nav"
import { Button } from "@/components/ui/button"

interface MainNavProps {
  items?: NavItem[]
}

const MainNav: React.FC<MainNavProps> = ({ items }) => {
  return (
    <div className="flex w-full items-center gap-6 md:gap-10">
      <Button onClick={() => window.location.href = "/"} className="bg-black rounded-md p-2 h-8 w-8 text-white dark:bg-white dark:text-black text-xl font-extrabold skew-x-12">
        <p className="-skew-x-12">B</p>
      </Button>
      <div className="w-full">
        <SearchComp redirect="search" />
      </div>
    </div>
  )
}

export default MainNav