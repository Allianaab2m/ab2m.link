import { IcBaselineDiscord } from "@/components/logos/discord"
import { Fa6BrandsGithub } from "./logos/github"
import { Fa6BrandsXTwitter } from "./logos/twitter"
import { SimpleIconsMisskey } from "./logos/misskey"

export default function Footer() {
  return (
    <footer className="footer items-center p-4 bg-neutral text-neutral-content">
      <div className="item-center grid-flow-col">
        <p>Copyright © 2023 Alliana - All right reserved.</p>
      </div>
      <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a href="https://micolor.link/@alliana"><SimpleIconsMisskey className="h-6 w-6" /></a>
        <a href="https://discord.com/users/271922478182301696"><IcBaselineDiscord className="h-6 w-6" /></a>
        <a href="https://github.com/Allianaab2m"><Fa6BrandsGithub className="h-6 w-6" /></a>
        <a href="https://twitter.com/ab2m_Alliana"><Fa6BrandsXTwitter className="h-6 w-6" /></a>
      </div>
    </footer>
  )
}
