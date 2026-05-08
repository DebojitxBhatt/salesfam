import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import User from "@/models/user"
import { getServerSession } from "next-auth"

import { connectMongoDB } from "@/lib/mongodb"

export async function GET(req) {
  const session = await getServerSession(req)
  if (!session) {
    return NextResponse.json("Unauthorized")
  } else {
    await connectMongoDB()
    const _id = req.nextUrl.searchParams.get("id")
    const role = req.nextUrl.searchParams.get("role")
    const name = req.nextUrl.searchParams.get("name")
    const upSellerId = req.nextUrl.searchParams.get("upSellerId")
    const admin = req.nextUrl.searchParams.get("admin")

    if (_id && !name && !role && !upSellerId && !admin) {
      try {
        await connectMongoDB()
        const user = await User.findOne({ _id: _id })
        return NextResponse.json({ user })
      } catch (error) {
        console.log(error)
      }
    }

    if (!_id && name && !role && !upSellerId && !admin) {
      try {
        await connectMongoDB()
        const users = await User.findOne({ name })
        return NextResponse.json({ users })
      } catch (error) {
        console.log(error)
      }
    }

    if (!_id && !name && role && !upSellerId && !admin) {
      try {
        await connectMongoDB()
        const users = await User.find({ role })
        return NextResponse.json({ users })
      } catch (error) {
        console.log(error)
      }
    }

    if (!_id && !name && !role && upSellerId && !admin) {
      try {
        await connectMongoDB()
        const users = await User.find({ upSellerId })
        return NextResponse.json({ users })
      } catch (error) {
        console.log(error)
      }
    }
    if (!_id && !name && !role && !upSellerId && !admin) {
      try {
        await connectMongoDB()
        const users = await User.find({ role: { $in: ["Sales1", "Sales2"] } })
        return NextResponse.json({ users })
      } catch (error) {
        console.log(error)
      }
    }
    if (!_id && !name && !role && !upSellerId && admin) {
      if (admin == "SuperAdmin") {
        try {
          await connectMongoDB()
          const users = await User.find({ role: { $ne: admin } })
          return NextResponse.json({ users })
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          await connectMongoDB()
          const users = await User.find({
            role: { $ne: ["SuperAdmin", admin] },
          })
          return NextResponse.json({ users })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}

export async function PUT(req) {
  const session = await getServerSession(req)
  if (!session) {
    return NextResponse.json("Unauthorized")
  } else {
    try {
      const id = req.nextUrl.searchParams.get("id")
      const { name, role, commission_rate, upSeller, upSellerId, contracts } =
        await req.json()
      await connectMongoDB()
      const nameTrim = name?.trim()
      const roleTrim = role?.trim()
      await User.findByIdAndUpdate(id, {
        name:nameTrim,
        role:roleTrim,
        upsellerPercentage: commission_rate,
        upSeller,
        upSellerId,
        contracts,
      })

      return NextResponse.json({ message: "User Updated!" }, { status: 201 })
    } catch (error) {
      return NextResponse.json(
        { message: "An error occurred while registering the user." },
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
    await User.findByIdAndDelete(id)
    return NextResponse.json({ message: "User deleted" }, { status: 200 })
  }
}
