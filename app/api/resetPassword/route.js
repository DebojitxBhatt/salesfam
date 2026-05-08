import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import User from "@/models/user"
import bcrypt from "bcryptjs"

import { connectMongoDB } from "@/lib/mongodb"

export async function PUT(req) {
  try {
    const { email, password } = await req.json()
    console.log(email,password)
    const userIdentifier = { email: email }
    const hashedPassword = await bcrypt.hash(password, 10)
    await connectMongoDB()

    // Update user's password
    await User.findOneAndUpdate(userIdentifier, {
      password: hashedPassword,
    })

    return NextResponse.json({ message: "Password Updated!" }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while resetting your password." },
      { status: 500 }
    )
  }
}
