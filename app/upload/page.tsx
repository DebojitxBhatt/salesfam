"use client"

import { toast } from "@/components/ui/use-toast";
import { useState } from "react"

export default function ImageUpload() {
  const [image, setImage] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
  }

  const handleImageUpload = async () => {
    if (!image) return

    const formData = new FormData()
    formData.append("image", image)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json().catch(() => null)

      if (response.ok) {
        toast({
          title: "Image uploaded successfully",
          description: data?.message,
        })
      } else {
        toast({
          title: "Error uploading image",
          description: data?.message || response.statusText,
        })
      }
    } catch (error) {
      toast({
        title: "Error uploading image",
        description: error.message,
      })
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleImageUpload}>Upload Image</button>
    </div>
  )
}
