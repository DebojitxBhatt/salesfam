import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import bcrypt from "bcryptjs"

import { connectMongoDB } from "@/lib/mongodb"
import User from "@/models/user"

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()
    const nameTrim = name?.trim()
    const emailTrim = email?.trim().toLowerCase()

    if (!nameTrim || !emailTrim || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters." },
        { status: 400 }
      )
    }

    await connectMongoDB()

    const existingUser = await User.findOne({ email: emailTrim }).select("_id")

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await User.create({
      name: nameTrim,
      email: emailTrim,
      password: hashedPassword,
    })

    return NextResponse.json({ message: "User registered." }, { status: 201 })
  } catch (error) {
    console.log("Signup error:", error)
    return NextResponse.json(
      { message: error.message || "An error occurred while registering the user." },
      { status: 500 }
    )
  }
}
