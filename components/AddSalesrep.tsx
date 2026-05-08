"use client"

import React, { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { sendInvitation } from "@/lib/notification/sendInvitation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export default function AddSalesrep(props) {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setLoading] = useState(false)

  const upSeller = props.upSeller
  const upSellerId = props.upSellerId

  const [yourPercentage, setyourPercentage] = useState(8)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    setLoading(true)
    if (!name || !email) {
      console.log("all filled required")
      toast({
        variant: "destructive",
        title: "all filled required!",
      })
      setLoading(false)
      return
    }

    try {
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!resUserExists.ok) {
        const errorData = await resUserExists.json().catch(() => null)
        throw new Error(errorData?.message || "Unable to check existing user.")
      }

      const { user } = await resUserExists.json()

      if (user) {
        toast({
          variant: "destructive",
          title: "User already Exist!",
        })
        console.log("User already Exist!")
        setLoading(false)
        return
      }

      const res = await fetch("api/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          upSeller,
          upSellerId,
          upsellerPercentage: yourPercentage,
        }),
      })

      if (res.ok) {
        sendInvitation(name, email, upSeller)
        toast({
          title: "Invitation Send",
        })
        setLoading(false)
        window.location.reload()
      } else {
        console.log("user reg failed!")
        toast({
          variant: "destructive",
          title: "user reg failed!",
        })
        setLoading(false)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error during reg:" + error,
      })
      console.log("Error during reg:", error)
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm">
          <div className="flex items-center justify-end">
            <span className="mr-2">Add Sales Rep</span>
            <Plus className="size-4" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <h2 className="text-2xl">Add new sales rep under you</h2>
          </DialogTitle>
          <DialogDescription>
            <form className="mt-2" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-1 mb-4">
                  <Label className="sr-only" htmlFor="email">
                    Full Name
                  </Label>
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    placeholder="name"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="off"
                  />
                </div>
                <div className="grid gap-1 mb-2">
                  <Label className="sr-only" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                  />
                </div>
                <div className="my-4">
                  <Slider
                    defaultValue={[9]}
                    max={100}
                    step={1}
                    onValueChange={(v) => setyourPercentage(v[0])}
                  />
                  <h4 className="mt-2 text-lg text-black">
                    Your Percentage: {yourPercentage}%
                  </h4>
                </div>
                <Button disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 size-4 animate-spin" />
                  )}
                  Send Invitation
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
