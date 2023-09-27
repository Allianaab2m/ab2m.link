// SSRしてるページ

import { AnimatePresenceWrapper, PopupMotionWrapperLi } from "@/components/motionWrapper"
import { MisskeyNote } from "@/types/notes/misskeyApi"
import NoteCard from "@/components/notes/card"

async function fetchNoteData(host: string, uid: string) {
  const res = await fetch(`https://${host}/api/users/notes`, {
    method: "POST", body: JSON.stringify({
      userId: uid,
      includeReplies: false,
      limit: 10
    }),
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    }
  })

  const notes: MisskeyNote[] = await res.json()
  const filteredNote = notes
    .filter(n => n.cw === null)
    .filter(n => n.text !== null)
    .filter(n => n.localOnly === false)
    .filter(n => n.visibility === "public")
    .flatMap((n) => {
      return { id: n.id, text: `${n.text}`, createdAt: Date.parse(n.createdAt), host, username: n.user.username }
    })
  return filteredNote
}

export default async function Notes() {
  //const micolorNotes = await fetchNoteData("micolor.link", "9gy2bv66cy")
  const bskNotes = await fetchNoteData("misskey.backspace.fm", "9i1wds7o8e")
  const notes = [ ...bskNotes].sort((a, b) => {
    if (a.createdAt > b.createdAt) return -1
    if (a.createdAt < b.createdAt) return 1
    return 0
  })

  return (
    <AnimatePresenceWrapper>
      <div className="mx-auto px-4 mt-4 container">
        <h2 className="text-lg">深夜テンションのノリ<a href="https://misskey.backspace.fm/notes/9iuh2mjty3" className="link">(元凶)</a>で出来たページです．</h2>
        <h2 className="text-lg"><a href="https://misskey.backspace.fm" className="link">Backspacekey</a>で行っている私のパブリック投稿のうち最新のものを取得しています．</h2>
        <div className="divider mb-2" />
        {notes.map(n =>
          <PopupMotionWrapperLi key={n.id}>
            <NoteCard {...n} />
          </PopupMotionWrapperLi>
        )}
      </div>
    </AnimatePresenceWrapper>
  )
}
