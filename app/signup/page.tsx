"use client"

import { Suspense, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import ReferralComp from "@/components/ReferralComp"
import { Signinform } from "@/components/Signinform"

export default function SignupPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.replace("/dashboard")
    }
  }, [router, session, status])

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ReferralComp />
      </Suspense>
      <div className="container relative flex flex-col items-center justify-center  h-screen md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          className=
            "absolute left-4 top-4"
        
          href="/"
        >
          <img className="mt-1 w-[140px]" src="./landing/logo-black.svg" />
        </Link>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "absolute right-4 top-4 hover:bg-primary hover:text-white md:right-8 md:top-8"
          )}
        >
          Login
        </Link>
        <div className="relative flex-col hidden h-full p-10 text-white bg-muted dark:border-r lg:flex">
          <div className="absolute inset-0 bg-white" />
          <div className="absolute top-10 left-10 right-0 z-20 mt-auto">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width="150" height="102" />
            </Link>
          </div>

          <div className="absolute top-[30%] left-40 right-0 z-20 mt-auto">
            <Image src="/login.jpg" alt="Logo" width="450" height="502" />
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an Account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your details below to create your account
              </p>
            </div>
            <Signinform />
          </div>
        </div>
      </div>
    </>
  )
}
