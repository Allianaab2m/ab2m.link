export type NoteCardProps = {
  id: string
  text: string
  createdAt: number
  username: string
  host: string
  className?: string
}

export default function NoteCard(props: NoteCardProps) {
  const { id, text, createdAt, host, username, className } = props;
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
  );
}

