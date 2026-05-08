"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

import Toolkitmenu from "./toolkitMenu"
import UserNav from "./userNav"

export default function Header() {
  const { data: session } = useSession()
  const role = session?.user?.role 

  const pathname = usePathname()
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!isScrolling && window.scrollY > 0) {
        setIsScrolling(true)
      } else if (window.scrollY === 0) {
        setIsScrolling(false)
      } else if (window.scrollY < 250) {
        setIsScrolling(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])
  // z-[99999999] border-b sticky pb-0 pt-1   transition-all duration-500 ease-in-out top-0bg-white bg-opacity-90 backdrop-blur-sm ${isScrolling?" ":""}
  return (
    <header className={` min-w-11/12 py-6`}>
      <div className="container flex items-center">
        <div className="w-4/12">
          <Link href="/" className="inline-block pt-1">
            <Image src="/logo.png" alt="Logo" width="120" height="102" />
          </Link>
        </div>
        <div className="flex items-center justify-end w-8/12">
          {(role != "Sales1" || role != "Sales2") && (
            <ul className="flex [&>li]:mr-4">
              <li>
                <Link
                  className={`flex items-center justify-center p-2 ${
                    pathname == "/dashboard" ? "font-bold" : ""
                  }`}
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className={`flex items-center justify-center p-2 ${
                    pathname == "/contracts" ? "font-bold" : ""
                  }`}
                  href="/contracts"
                >
                  Contracts
                </Link>
              </li>
              <li>
                <Link
                  className={`flex items-center justify-center p-2 ${
                    pathname == "/training" ? "font-bold" : ""
                  }`}
                  href="/training"
                >
                  Training
                </Link>
              </li>
              <li>
                <Link
                  className={`flex items-center justify-center p-2 ${
                    pathname == "/sales-meeting" ? "font-bold" : ""
                  }`}
                  href="/sales-meeting"
                >
                  Sales Meeting
                </Link>
              </li>
            </ul>
          )}

          {role == "SalesTwo" && <Toolkitmenu />}
          <UserNav />
        </div>
      </div>
    </header>
  )
}
