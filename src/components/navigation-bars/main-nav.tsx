import Link from "next/link"
import SearchComp from "@/components/search/search"
import { siteConfig } from "@/config/site"
import { NavItem } from "@/types/nav"

interface MainNavProps {
  items?: NavItem[]
}

const MainNav: React.FC<MainNavProps> = ({ items }) => {
  return (
    <div className="flex w-full items-center gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      <div className="w-full">
        <SearchComp redirect="search" />
      </div>
    </div>
  )
}

export default MainNav