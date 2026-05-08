import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import Client from "@/models/client"
import Project from "@/models/project"
import User from "@/models/user"
import Invoice from "@/models/invoice"
import { getServerSession } from "next-auth"

import { connectMongoDB } from "@/lib/mongodb"

export async function POST(req) {
  try {
    const session = await getServerSession(req)
    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const {
      projectName,
      projectDetails,
      budget,
      companyName,
      salesPerson,
      upSellerId,
      salesId,
      dateSigned,
      clientName,
      email,
      phone,
      address,
      clientId,
      callClient,
      emailClient,
    } = await req.json()

    await connectMongoDB()

    const SalesCommission = await User.findById(salesId)
    if (!SalesCommission) {
      return new Response("Salesperson not found", { status: 404 })
    }

    const commissionRate = SalesCommission.contracts.find(
      (item) => item.companyName === companyName
    )
    if (!commissionRate) {
      return new Response("Commission rate not found", { status: 404 })
    }

    let clientExist

    if (clientId) {
      clientExist = await Client.findById(clientId)
    }

    if (email && clientName) {
      const findByEmail = await Client.findOne({ email })
      const findByName = await Client.findOne({ clientName })

      if (findByEmail) {
        return new Response("Email already exists", { status: 409 })
      } else if (findByName) {
        return new Response("Name already exists", { status: 409 })
      }
    }
    const projectNameTrim =projectName?.trim()
    const createdProject = await Project.create({
      projectName:projectNameTrim,
      projectDetails,
      budget,
      companyName,
      commission_rate: commissionRate.rate,
      salesPerson,
      upSellerId,
      salesId,
      dateSigned,
      clientName: clientExist ? clientExist.clientName : clientName,
      email: clientExist ? clientExist.email : email,
      phone: clientExist ? clientExist.phone : phone,
      address: clientExist ? clientExist.address : address,
      callClient,
      emailClient,
    })

    if (createdProject && clientName && email && phone && address && salesId) {
      await Client.create({
        clientName,
        email,
        phone,
        address,
        sellerId: salesId,
        callClient,
        emailClient,
      })
    }

    return new Response("Project Submitted", { status: 201 })
  } catch (error) {
    console.error("Error:", error)
    return new Response("An error occurred while Project Submitted.", {
      status: 500,
    })
  }
}

export async function PUT(req) {
  const session = await getServerSession(req)
  if (!session) {
    return NextResponse.json("Unauthorized")
  } else {
    try {
      const id = req.nextUrl.searchParams.get("id")

      const {
        projectName,
        projectDetails,
        budget,
        companyName,
        status,
        salesPerson,
        commisson_rate,
        dateSigned,
        clientName,
        email,
        phone,
        address,
      } = await req.json()
      await connectMongoDB()
      if (email) {
        const updateClient = await Client.findOne({ email })
        if (updateClient) {
          await Client.findByIdAndUpdate(updateClient._id, {
            clientName,
            email,
            phone,
            address,
          })
        }
      }
      const projectNameTrim =projectName?.trim()
      await Project.findByIdAndUpdate(id, {
        projectName:projectNameTrim,
        projectDetails,
        budget,
        companyName,
        status,
        salesPerson,
        commisson_rate,
        dateSigned,
        clientName,
        email,
        phone,
        address,
      })

      return NextResponse.json({ message: "Project Updated!" }, { status: 201 })
    } catch (error) {
      return NextResponse.json(
        { message: "An error occurred while Project Submited." },
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
    const projectId = req.nextUrl.searchParams.get("id")
    const projectName = req.nextUrl.searchParams.get("slug")
    if (projectId && !salesPerson && !projectName) {
      try {
        await connectMongoDB()
        const project = await Project.findOne({ _id: projectId })
        return NextResponse.json({ project })
      } catch (error) {
        console.log(error)
      }
    }

    if (!projectId && salesPerson && !projectName) {
      try {
        await connectMongoDB()
        const project = await Project.find({
          salesPerson,
          status: { $ne: "Pending" },
        }).select()
        return NextResponse.json({ project })
      } catch (error) {
        console.log(error)
      }
    }
    if (!projectId && !salesPerson && projectName) {
      try {
        await connectMongoDB()
        if (projectName != null) {
          const project = await Project.findOne({ projectName }).select()
          return NextResponse.json({ project })
        } else {
          const projects = await Project.find()
          return NextResponse.json({ projects })
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (!projectId && !salesPerson && !projectName) {
      try {
        await connectMongoDB()
        if (projectName != null) {
          const project = await Project.find().select()
          return NextResponse.json({ project })
        } else {
          const projects = await Project.find()
          return NextResponse.json({ projects })
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
    const deleteProject=  await Project.findByIdAndDelete(id)
    if(deleteProject){
      await Invoice.deleteMany({projectId:deleteProject?._id})

    }
    return NextResponse.json({ message: "Project deleted" }, { status: 200 })
  }
}
