import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import User from "@/models/user"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth"

import { connectMongoDB } from "@/lib/mongodb"

export async function POST(req) {
  const session = await getServerSession(req)
  if (!session) {
    return NextResponse.json("Unauthorized")
  } else {
    try {
      const {
        name,
        email,
        upSeller,
        upSellerId,
        upsellerPercentage,
        contracts: contractsDataFromPayload,
      } = await req.json()

      const initialContractsData = [
        {
          companyName: "WordSphere",
          rate: 20 - upsellerPercentage, // Now upsellerPercentage is defined
          logo: "/wordsphere.png",
          companyType: "Web Development Agency",
        },
        {
          companyName: "image appeal",
          rate: 20 - upsellerPercentage, // Now upsellerPercentage is defined
          logo: "/ia.png",
          companyType: "Graphics Design Agency",
        },
      ]

      await connectMongoDB()

      await User.create({
        name,
        email,
        upSeller,
        upSellerId,
        upsellerPercentage,
        contracts: contractsDataFromPayload || initialContractsData,
      })

      return NextResponse.json({ message: "User registered." }, { status: 201 })
    } catch (error) {
      console.error("Error during user registration:", error)
      return NextResponse.json(
        { message: "An error occurred while registering the user." },
        { status: 500 }
      )
    }
  }
}
