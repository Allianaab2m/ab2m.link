'use client'
import { AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1
    }
  }
}

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 }
}

export default function MotionWrapper({
  children,
}: { children: React.ReactNode }) {
  const pathName = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathName}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function AnimatePresenceWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} variants={container}>
        <motion.ol variants={container} initial="hidden" animate="show">
          {children}
        </motion.ol>
      </motion.div>
    </AnimatePresence >
  )
}

export function PopupMotionWrapperLi({
  children
}: { children: React.ReactNode }) {
  return (
    <motion.li
      variants={item}
    >
      {children}
    </motion.li>
  )
}

