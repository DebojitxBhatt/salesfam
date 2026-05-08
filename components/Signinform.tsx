"use client"

// import * as React from "react"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export function Signinform() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanName || !cleanEmail || !password) {
      toast({
        variant: "destructive",
        title: "All fields are required.",
      })
      setLoading(false)
      return
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password must be at least 6 characters.",
      })
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
        }),
      })

      if (res.ok) {
        const loginResult = await signIn("credentials", {
          email: cleanEmail,
          password,
          redirect: false,
        })

        if (loginResult?.error) {
          toast({
            title: "Account created successfully.",
            description: "Please login with your new account.",
          })
          router.push("/login")
          return
        }

        router.replace("/dashboard")
        router.refresh()
      } else {
        const errorData = await res.json().catch(() => null)
        toast({
          variant: "destructive",
          title: errorData?.message || "User registration failed.",
        })
        setLoading(false)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error during registration.",
        description:
          error instanceof Error ? error.message : "Please try again.",
      })
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Full Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              type="text"
              autoCapitalize="none"
              autoComplete="name"
              autoCorrect="off"
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Signup
          </Button>
        </div>
      </form>
    </div>
  )
}
