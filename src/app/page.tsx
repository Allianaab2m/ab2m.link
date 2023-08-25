import { SkillIconsActivitypubDark } from "@/components/logos/activitypub"
import { IcBaselineDiscord } from "@/components/logos/discord"
import { Fa6BrandsGithub } from "@/components/logos/github"
import { Fa6BrandsXTwitter } from "@/components/logos/twitter"

export default function Home() {
  return (
    <div>
      <div className="container mx-auto mt-4 px-4">
        <h2 className="text-3xl font-bold">About</h2>
        <div className="divider mt-0 mb-0" />
        <p>ありあなのホームページです．</p>
        <p>SolidJSを使って作っていたのですが，いつの間にかNext.jsになっていました．</p>
        <p>Tailwind CSSの勉強も兼ねて作ったはずが，あろうことかdaisyUIに助けられています．</p>
        <p>とりあえず更新を放棄しない程度に続けていけたらと思ってます．</p>
      </div>

      <div className="container mx-auto mt-4 px-4">
        <h2 className="text-3xl font-bold">Contact</h2>
        <div className="divider mt-0 mb-0" />
        <div className="space-y-4">
          <div>
            <div className="text-xl flex space-x-2">
              <SkillIconsActivitypubDark className="h-7 w-7 -mt-0.5 -mr-1" />
              <span>ActivityPub</span>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl"><a href="https://micolor.link/@alliana" className="link">@alliana@micolor.link</a></h2>
                <p>鯖缶やってます．だいたいここにいます．</p>
              </div>
              <div>
                <h2 className="text-xl"><a href="https://misskey.backspace.fm/@alliana" className="link">@alliana@misskey.backspace.fm</a></h2>
                <p>フレンドがいるので作った．ニッチな技術系トークはここでよくやってます．</p>
              </div>
              <div>
                <h2 className="text-xl"><a href="https://misskey.io/@Alliana_ab2m" className="link">@Alliana_ab2m@misskey.io</a></h2>
                <p>MiColorが落ちてるときなど，時々出没します．</p>
              </div>
            </div>
          </div>

          <div className="text-xl flex space-x-2">
            <Fa6BrandsGithub className="h-6 w-6" />
            <span>GitHub</span>
            <a href="https://github.com/Allianaab2m" className="link">
              Allianaab2m
            </a>
          </div>

          <div className="text-xl flex space-x-2">
            <IcBaselineDiscord className="h-6 w-6" />
            <span>Discord</span>
            <a href="https://discord.com/users/271922478182301696" className="link">
              allianaab2m
            </a>
          </div>

          <div className="text-xl flex space-x-2">
            <Fa6BrandsXTwitter className="h-6 w-6" />
            <span>Twitter</span>
            <a href="https://twitter.com/ab2m_Alliana" className="link">
              @ab2m_Alliana
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
