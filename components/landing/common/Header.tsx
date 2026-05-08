"use client"

import React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { useSession } from "next-auth/react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Header() {
  const { data: session } = useSession()

  return (
    <div className="w-full bg-[#ebf5ff] opacity-90 sticky top-0 z-50">
      <header className="w-full">
        <div className="container px-5 mx-auto">
          <div className="grid items-center grid-cols-10 gap-4">
            
            {/* Logo */}
            <div className="col-span-2">
              <Link className="inline-block max-sm:w-[110px]" href="/">
                <img
                  className="mt-1 w-[140px]"
                  src="/landing/logo-black.svg"
                  alt="logo"
                />
              </Link>
            </div>

            <div className="flex justify-end col-span-8">

              {/* Desktop Menu */}
              <div className="hidden lg:block">
                <ul className="flex items-center space-x-6">
                  <li><Link href="#about">About</Link></li>
                  <li><Link href="#pricing">Pricing</Link></li>
                  <li><Link href="#solution">Solutions</Link></li>
                  <li><Link href="#">Blog</Link></li>
                  <li><Link href="#contact">Contact</Link></li>

                  {/* Auth Button */}
                  <li>
                    {session?.user ? (
                      <Link
                        className="ml-3 rounded-lg bg-[#141F39] px-5 py-2 text-white"
                        href="/dashboard"
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        className="ml-3 rounded-lg bg-[#141F39] px-5 py-2 text-white"
                        href="/login"
                      >
                        Login
                      </Link>
                    )}
                  </li>
                </ul>
              </div>

              {/* Mobile Menu */}
              <Popover>
                <PopoverTrigger>
                  <div className="inline-flex size-10 items-center justify-center rounded-lg bg-[#267596] p-2 lg:hidden cursor-pointer">
                    <Menu color="#fff" />
                  </div>
                </PopoverTrigger>

                <PopoverContent align="end" className="w-[180px]">
                  <ul className="flex flex-col gap-2">
                    <li><Link href="#about">About</Link></li>
                    <li><Link href="#pricing">Pricing</Link></li>
                    <li><Link href="#solution">Solutions</Link></li>
                    <li><Link href="#">Blog</Link></li>
                    <li><Link href="#contact">Contact</Link></li>

                    {/* Auth Button */}
                    <li>
                      {session?.user ? (
                        <Link
                          className="block text-center rounded-lg bg-[#141F39] px-5 py-2 text-white"
                          href="/dashboard"
                        >
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          className="block text-center rounded-lg bg-[#141F39] px-5 py-2 text-white"
                          href="/login"
                        >
                          Login
                        </Link>
                      )}
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>

            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
