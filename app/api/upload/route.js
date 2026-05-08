import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 })
  }

  if (!process.env.IMGBB_HOSTING_KEY) {
    return NextResponse.json(
      { message: "IMGBB_HOSTING_KEY is not configured." },
      { status: 500 }
    )
  }

  try {
    const formData = await req.formData()
    const image = formData.get("image")

    if (!image) {
      return NextResponse.json(
        { message: "Image file is required." },
        { status: 400 }
      )
    }

    const uploadData = new FormData()
    uploadData.append("image", image)

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_HOSTING_KEY}`,
      {
        method: "POST",
        body: uploadData,
      }
    )

    const data = await response.json().catch(() => null)

    if (!response.ok || !data?.success) {
      return NextResponse.json(
        {
          message:
            data?.error?.message ||
            data?.message ||
            "Image hosting upload failed.",
        },
        { status: response.status || 500 }
      )
    }

    return NextResponse.json({
      url: data.data.display_url || data.data.url,
    })
  } catch (error) {
    console.log("Image upload error:", error)
    return NextResponse.json(
      { message: error.message || "Image upload failed." },
      { status: 500 }
    )
  }
}
