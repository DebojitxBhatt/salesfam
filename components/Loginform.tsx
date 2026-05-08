"use client"

import * as React from "react"
import { useState } from "react"
import { FormEvent } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export function Loginform() {
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail || !password) {
      toast({
        variant: "destructive",
        title: "Email and password are required.",
      })
      setLoading(false)
      return
    }

    try {
      const res = await signIn("credentials", {
        email: cleanEmail,
        password,
        redirect: false,
      })
      if (res?.error) {
        toast({
          variant: "destructive",
          title: "Invalid email or password.",
          description: "Please check your information and try again.",
        })
        setLoading(false)
        return
      }
      toast({
        title: "Logged in successfully!",
        description: "Welcome back.",
      })
      router.replace("/dashboard")
      router.refresh()
    } catch (error) {
      setLoading(false)
      toast({
        variant: "destructive",
        title: "Unable to login.",
        description:
          error instanceof Error ? error.message : "Please try again.",
      })
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Login
          </Button>
        </div>
      </form>
    </div>
  )
}
