"use client"
import { useState } from "react"
import { Check, X } from "lucide-react"
import { useSession } from "next-auth/react"
import {
  Dialog
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import CropImage from "@/components/CropImage"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

function dataUrlToFile(dataUrl, fileName) {
  const [metadata, base64] = dataUrl.split(",")

  if (!metadata?.startsWith("data:") || !base64) {
    throw new Error("Invalid image data.")
  }

  const mime = metadata.match(/data:(.*);base64/)?.[1] || "image/png"
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return new File([bytes], fileName, { type: mime })
}

async function imageSourceToFile(source) {
  if (source instanceof File) {
    return source
  }

  if (typeof source !== "string") {
    throw new Error("Please select an image first.")
  }

  if (source.startsWith("data:")) {
    return dataUrlToFile(source, "profile.png")
  }

  if (source.startsWith("blob:")) {
    const response = await fetch(source)
    const blob = await response.blob()
    return new File([blob], "profile.png", {
      type: blob.type || "image/png",
    })
  }

  throw new Error("Unsupported image format.")
}

export default function ProfileUpload({ setAvatar }) {
  const { toast } = useToast()
  const [isLoading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [src, setSrc] = useState(null)
  const [result, setResult] = useState(null)
  const { data: session } = useSession()
  const id = session?.user?.id
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImage(file)
    setSrc(URL.createObjectURL(file))
    setResult(URL.createObjectURL(file))
  }

  async function updateAvatar(url) {
    try {
      const res = await fetch(`/api/user/avatar/?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatar: url,
        }),
      })

      if (res.ok) {
        toast({
          variant: "default",
          title: "User Updated!",
        })
        setLoading(false)
        window.location.reload()
      } else {
        console.log("submission failed!")
        toast({
          title: "submission failed!",
        })
      }
    } catch (error) {
      console.log("Error during  submit:", error)
      toast({
        variant: "destructive",
        title: `Error during submit:", ${error}`,
      })
    }
  }

  const handleImageUpload = async () => {
    if (!image) return

    setLoading(true)
    const formData = new FormData()

    const uploadImage = await imageSourceToFile(image)

    formData.append("image", uploadImage)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json().catch(() => null)

      if (response.ok) {
        updateAvatar(data.url)
      } else {
        toast({
          variant: "destructive",
          title: "Image upload failed.",
          description: data?.message || response.statusText,
        })
        setLoading(false)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        variant: "destructive",
        title: "Image upload failed.",
        description: error instanceof Error ? error.message : "Please try again.",
      })
      setLoading(false)
    }
  }

  return (
    <div className="z-0 flex items-center ml-4 ">
      {src && (
        <div className="absolute z-50 flex items-center justify-center min-h-[100vh] bg-opacity-20 bg-black min-w-[100vw] left-0 top-0">
          <div className="p-3 bg-white border rounded-lg shadow-lg">
            <div className="flex justify-between ">
              <button
                onClick={() => {
                  setSrc(null)
                }}
              >
                <X className="text-red-500" />
              </button>
              <button
                onClick={() => {
                  const selectedImage =
                    typeof result === "string" && result.startsWith("data:")
                      ? result
                      : image

                  setSrc(null)
                  setImage(selectedImage)
                  setAvatar(result || src)
                }}
              >
                <Check className="text-green-500" />
              </button>
            </div>
          <CropImage file={src} setResult={setResult} />
        </div>
        </div>
      )}
      <div className="flex flex-col ml-4 cursor-pointer">
        <Input
          id="picture"
          className="mb-2 cursor-pointer"
          type="file"
          onClick={(e)=>{e.target.value=null}}
          onChange={handleImageChange}
        />
        <Button disabled={!image &&true} onClick={handleImageUpload}>
          {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
          Upload Image
        </Button>
      </div>
    </div>
  )
}
