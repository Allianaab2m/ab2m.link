import Link from "next/link"

const Navbar = () => {
  return (
    <div className="navbar h-10 bg-primary text-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">ab2m.link</Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/articles" className="text-lg">Articles</Link></li>
          <li><Link href="/notes" className="text-lg">Notes</Link></li>
          <li><Link href="/blogs" className="text-lg">Blogs</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
