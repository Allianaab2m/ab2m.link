import type { ReactNode } from "react"
import Link from "next/link"

export interface NextLinkProps {
  children: ReactNode
  href?: string
  id?: string
}

const NextLink: React.FC<NextLinkProps> = (props) => {
  const { children, href, id } = props
  if (href === undefined) {
    return <a>{children}</a>
  } else {
    return href.startsWith("/") || href === "" ? (
      <Link href={href}>{children}</Link>
    ) : href.startsWith("#user-content") ? (
      <a
        href={href}
        id={id}
        data-footnote-ref
        aria-describedby="footnote-label"> {children} </a>
    ) : href.startsWith("#") ? (
      <a href={href} id={id}>
        {children}
      </a>
    ) : (
      <a href={href}>{children}</a>
    )
  }
}

export default NextLink
