import NextLink from "@/components/NextLink"

import type { NextLinkProps } from "@/components/NextLink"
import type { MDXComponents } from "mdx/types"

type ProvidedComponents = MDXComponents & {
  a: typeof NextLink
}

const replaceComponents = {
  h1: (props) => <h1 className="text-3xl font-bold">
    {props.children}
    <div className="divider my-0" />
  </h1>,
  h2: (props) => <h2 className="text-2xl font-bold mt-2">
    {props.children}
    <div className="divider my-0" />
  </h2>,
  h3: (props) => <h3 className="text-xl font-bold">
    {props.children}
  </h3>,
  a: (props: NextLinkProps) => <NextLink {...props} />,
} as ProvidedComponents

export default replaceComponents
