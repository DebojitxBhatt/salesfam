import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import User from "@/models/user"
import { getServerSession } from "next-auth"
import { connectMongoDB } from "@/lib/mongodb"
import { authOptions } from "@/lib/auth"

export async function PUT(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 })
  }else{
    try {
      const id = req.nextUrl.searchParams.get("id") || session.user?.id
      const { avatar } = await req.json()
      if (!id || !avatar) {
        return NextResponse.json(
          { message: "User id and avatar are required." },
          { status: 400 }
        )
      }

      await connectMongoDB()
      await User.findByIdAndUpdate(id, {
        avatar,
      })
  
      return NextResponse.json({ message: "Avatar Updated!" }, { status: 201 })
    } catch (error) {
      return NextResponse.json(
        { message: error.message || "An error occurred while updating avatar." },
        { status: 500 }
      )
    }
  }
  
}
