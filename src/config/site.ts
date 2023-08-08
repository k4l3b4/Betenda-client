export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Betenda",
  description:
    "Betenda is an invite only platform for the gurage speaking community of Ethiopia",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
  link_options: {
    formatHref: {
      mention: (href: string) => "http://localhost:3000/" + href,
      hashtag: (href: string) => "http://localhost:3000/tag/" + href.substr(1),
    },
  }
}
