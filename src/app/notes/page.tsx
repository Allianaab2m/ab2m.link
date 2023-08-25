type MisskeyNote = {
  id: string
  user: {
    username: string
  }
  createdAt: string
  text: string | null
  cw: string | null
  visibility: "public" | "home" | "followers" | "specified"
  localOnly: boolean
}

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

function NoteCard(props: { id: string, text: string, createdAt: number, username: string, host: string, className?: string }) {
  const { id, text, createdAt, host, username, className } = props
  const date = new Date(createdAt + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));

  return (
    <div className={className}>
      <div className="flex flex-col">
        <div className="flex gap-1">
          <a href={`https://${host}/notes/${id}`}>
            <h2>{text}</h2>
          </a>
        </div>
        <div className="text-sm text-neutral flex gap-1">
          <p>{date.toLocaleString("ja-JP").slice(0, -3)}</p>
          <a href={`https://${host}/@${username}`}>
            <p>{`@${username}@${host}`}</p>
          </a>
        </div>
      </div>
      <div className="divider my-2" />
    </div>
  )
}

export default async function Notes() {
  const micolorNotes = await fetchNoteData("micolor.link", "9gy2bv66cy")
  const bskNotes = await fetchNoteData("misskey.backspace.fm", "9i1wds7o8e")
  const notes = [...micolorNotes, ...bskNotes].sort((a, b) => {
    if (a.createdAt > b.createdAt) return -1
    if (a.createdAt < b.createdAt) return 1
    return 0
  })
  return (
    <div className="mx-auto px-4 mt-4 container">
      <h2 className="text-lg">深夜テンションのノリ<a href="https://misskey.backspace.fm/notes/9iuh2mjty3" className="link">(元凶)</a>で出来たページです．</h2>
      <h2 className="text-lg"><a href="https://micolor.link" className="link">MiColor.link</a>と<a href="https://misskey.backspace.fm" className="link">Backspacekey</a>で行っている私のパブリック投稿のうち最新のものを取得しています．</h2>
      <div className="divider mb-2" />
      {notes.map(n =>
        <NoteCard
          id={n.id}
          text={n.text}
          createdAt={n.createdAt}
          host={n.host}
          username={n.username}
          key={n.id}
        />)}
    </div>
  )
}
