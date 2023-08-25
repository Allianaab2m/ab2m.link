import Navbar from "./Navbar"
import IconActivitypub from "~icons/custom-icons/activitypub"
import IconGithub from "~icons/fa6-brands/github"
import IconDiscord from "~icons/fa6-brands/discord"
import IconTwitter from "~icons/fa6-brands/twitter"

const App = () => {
  return (
    <div>
      <Navbar />
      <div class="container mx-auto mt-4 px-4">
        <h2 class="text-3xl font-bold">About</h2>
        <div class="divider mt-0 mb-0" />
        <p>ありあなのホームページです．</p>
        <p>SolidJSとTailwind CSSの勉強も兼ねて作ったはずが，どういうわけかdaisyUIに助けられています．</p>
      </div>

      <div class="container mx-auto mt-4 px-4">
        <h2 class="text-3xl font-bold">Contact</h2>
        <div class="divider mt-0 mb-0" />
        <div class="space-y-4">
          <div>
            <div class="text-xl flex space-x-2">
              <IconActivitypub />
              <span>ActivityPub</span>
            </div>
            <div class="space-y-4">
              <div>
                <h2 class="text-xl"><a href="https://micolor.link/@alliana" class="link">@alliana@micolor.link</a></h2>
                <p>鯖缶やってます．だいたいここにいます．</p>
              </div>
              <div>
                <h2 class="text-xl"><a href="https://misskey.backspace.fm/@alliana" class="link">@alliana@misskey.backspace.fm</a></h2>
                <p>フレンドがいるので作った．ニッチな技術系トークはここでよくやってます．</p>
              </div>
              <div>
                <h2 class="text-xl"><a href="https://misskey.io/@Alliana_ab2m" class="link">@Alliana_ab2m@misskey.io</a></h2>
                <p>MiColorが落ちてるときなど，時々出没します．</p>
              </div>
            </div>
          </div>

          <div class="text-xl flex space-x-2">
            <IconGithub />
            <span>GitHub</span>
            <a href="https://github.com/Allianaab2m" class="link">
              Allianaab2m
            </a>
          </div>

          <div class="text-xl flex space-x-2">
            <IconDiscord />
            <span>Discord</span>
            <a href="https://discord.com/users/271922478182301696" class="link">
              allianaab2m
            </a>
          </div>

          <div class="text-xl flex space-x-2">
            <IconTwitter />
            <span>Twitter(𝕏)</span>
            <a href="https://twitter.com/ab2m_Alliana" class="link">
              @ab2m_Alliana
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
