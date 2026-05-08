import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import Client from "@/models/client"
import { getServerSession } from "next-auth"

import { connectMongoDB } from "@/lib/mongodb"

export async function POST(req) {
  const session = await getServerSession(req)
  if (!session) {
    return NextResponse.json("Unauthorized")
  } else {
    try {
      const { salesPerson, clientName, email, phone, address } =
        await req.json()

      await connectMongoDB()
      const clientNameTrim =clientName?.trim()
      await Client.create({
        sellerId: salesPerson,
        clientName:clientNameTrim,
        email,
        phone,
        address,
      })

      return NextResponse.json({ message: "Client Submited" }, { status: 201 })
    } catch (error) {
      return NextResponse.json(
        { message: "An error occurred while Client Submited." },
        { status: 500 }
      )
    }
  }
}
export async function PUT(req) {
  const session = await getServerSession(req)
  if (!session) {
    return NextResponse.json("Unauthorized")
  } else {
    const clientId = req.nextUrl.searchParams.get("id")
    try {
      await connectMongoDB()
      const { clientName, email, phone, address, callClient, emailClient } =
        await req.json()

      await Client.findByIdAndUpdate(
        { _id: clientId },
        {
          clientName,
          email,
          phone,
          address,
          callClient,
          emailClient,
        }
      )

      return NextResponse.json({ message: "Client updated" }, { status: 201 })
    } catch (error) {
      return NextResponse.json(
        { message: "An error occurred while Client updated." },
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
    const salesPerson = req.nextUrl.searchParams.get("salesperson")
    const ClientId = req.nextUrl.searchParams.get("id")
    const ClientName = req.nextUrl.searchParams.get("slug")

    if (!ClientId && salesPerson && !ClientName) {
      try {
        await connectMongoDB()
        const client = await Client.find()
        return NextResponse.json({ client })
      } catch (error) {
        console.log(error)
      }
    }
    if (ClientId && !salesPerson && !ClientName) {
      try {
        await connectMongoDB()
        const client = await Client.findOne({ _id: ClientId })
        return NextResponse.json({ client })
      } catch (error) {
        console.log(error)
      }
    }
    if (ClientId && !salesPerson && !ClientName) {
      try {
        await connectMongoDB()
        const client = await Client.findOne({ _id: ClientId })
        return NextResponse.json({ client })
      } catch (error) {
        console.log(error)
      }
    }
    if (!ClientId && !salesPerson && ClientName) {
      try {
        await connectMongoDB()
        if (ClientName != null) {
          const client = await Client.findOne({ ClientName }).select()
          return NextResponse.json({ client })
        }
      } catch (error) {
        console.log(error)
      }
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
    await Client.findByIdAndDelete(id)
    return NextResponse.json({ message: "Client deleted" }, { status: 200 })
  }
}
