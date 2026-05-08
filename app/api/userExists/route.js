import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import User from "@/models/user"
import { connectMongoDB } from "@/lib/mongodb"

export async function POST(req) {
  try {
    await connectMongoDB()
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 })
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
      "_id"
    )

    return NextResponse.json({ user })
  } catch (error) {
    console.log("User exists check error:", error)
    return NextResponse.json(
      { message: error.message || "An error occurred while checking the user." },
      { status: 500 }
    )
  }
}

export async function GET(req) {
  try {
    const email = req.nextUrl.searchParams.get("email")

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 })
    }

    await connectMongoDB()
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select()

    return NextResponse.json({ user })
  } catch (error) {
    console.log("User exists check error:", error)
    return NextResponse.json(
      { message: error.message || "An error occurred while checking the user." },
      { status: 500 }
    )
  }
}
