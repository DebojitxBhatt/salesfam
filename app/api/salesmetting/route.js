import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import { getServerSession } from "next-auth"

import { connectMongoDB } from "@/lib/mongodb"

import salesMeeting from "../../../models/salesMetting"

export async function POST(req) {
  const session = await getServerSession(req)

  if (!session) {
    return NextResponse.json("Unauthorized")
  } else {
    try {
      const { videoId,videoTitle } = await req.json()
      await connectMongoDB()
      const videoTitleTrim =videoTitle?.trim()
      await salesMeeting.create({ videoId ,videoTitle:videoTitleTrim})

      return NextResponse.json({ message: "Meeting added." }, { status: 201 })
    } catch (error) {
      return NextResponse.json(
        { message: "An error occurred while addiing meeting." },
        { status: 500 }
      )
    }
  }
}

export async function GET(req) {
  const session = await getServerSession(req)
  if (!session) {
    return NextResponse.json("Unauthorized")
  } else {
    try {
      await connectMongoDB()
      const meetings = await salesMeeting.find().select()
      return NextResponse.json({ meetings })
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { message: "An error occurred while fetching meetings." },
        { status: 500 }
      )
    }
  }
}

export async function DELETE(request) {
  const session = await getServerSession(request)
  if (!session) {
    return NextResponse.json("Unauthorized")
  } else {
    const id = request.nextUrl.searchParams.get("id")
    await connectMongoDB()
    await salesMeeting.findByIdAndDelete(id)
    return NextResponse.json({ message: "Meeting deleted" }, { status: 200 })
  }
}
