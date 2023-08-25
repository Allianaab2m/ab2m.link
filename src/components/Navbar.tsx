import Link from "next/link"

const Navbar = () => {
  return (
    <div className="navbar bg-primary text-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">ab2m.link</Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/articles" className="text-lg">Articles</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
