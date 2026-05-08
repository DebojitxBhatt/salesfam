"use client"

import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import SetPassword from "@/components/SetPassword"

import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function InvitationPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect("/dashboard")

  return (
    <>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "absolute right-4 top-4 hover:bg-primary hover:text-white md:right-8 md:top-8"
          )}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-white" />
          <div className="relative z-20 mt-auto">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width="150" height="102" />
            </Link>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-1 text-center">
              <h1 className="text-2xl font-semibold tracking-tight mb-1">
                Welcome to SalesFam
              </h1>
              <h2 className="text-xl mt-1">Set your password</h2>
            </div>
            <SetPassword />
          </div>
        </div>
      </div>
    </>
  )
}
