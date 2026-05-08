import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import Invoice from "@/models/invoice"
import Project from "@/models/project"
import User from "@/models/user"
import { getServerSession } from "next-auth"

import { connectMongoDB } from "@/lib/mongodb"

export async function POST(req) {
  const session = await getServerSession(req)
  if (!session) {
    return NextResponse.json("Unauthorized")
  } else {
    try {
      const { projectId, userId, upsellerId, invoiceDate, amount, rate } =
        await req.json()
      await connectMongoDB()
      await Invoice.create({
        projectId,
        userId,
        upsellerId: upsellerId || "none",
        invoiceDate,
        amount,
        rate,
      })

      return NextResponse.json({ message: "Invoice Added" }, { status: 201 })
    } catch (error) {
      return NextResponse.json(
        { message: "An error occurred while Invoice Submited." },
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
    const projectId = req.nextUrl.searchParams.get("projectId")
    const invoiceid = req.nextUrl.searchParams.get("invoiceid")
    const userId = req.nextUrl.searchParams.get("userId")
    const upsellerId = req.nextUrl.searchParams.get("upsellerId")
    const companyName = req.nextUrl.searchParams.get("companyName")
    if (!invoiceid && projectId && !userId && !upsellerId && !companyName) {
      try {
        // Establish the MongoDB connection before querying
        await connectMongoDB() // Make sure this function is properly defined

        // Fetch all invoices with the same projectName
        const invoices = await Invoice.find({ projectId })

        return NextResponse.json({ invoices })
      } catch (error) {
        console.error(error) // Log errors with console.error for better visibility
        return NextResponse.json(
          { error: "An error occurred" },
          { status: 500 }
        )
      }
    }
    if (invoiceid && !projectId && !userId && !upsellerId && !companyName) {
      try {
        await connectMongoDB() // Make sure this function is properly defined

        // Fetch all invoices with the same projectName
        const invoices = await Invoice.findOne({ _id: invoiceid })

        return NextResponse.json({ invoices })
      } catch (error) {
        console.error(error) // Log errors with console.error for better visibility
        return NextResponse.json(
          { error: "An error occurred" },
          { status: 500 }
        )
      }
    }
    if (!invoiceid && !projectId && userId && !upsellerId && !companyName) {
      try {
        await connectMongoDB() // Make sure this function is properly defined

        // Fetch all invoices for the specified user
        const invoices = await Invoice.find({
          userId,
          commission_paid: { $ne: "No" },
        }).select()

        let total = 0
        // Calculate total amount based on invoices
        for (const invoice of invoices) {
          total += invoice.amount * (invoice.rate / 100)
        }
        return NextResponse.json({ total })
      } catch (error) {
        console.error(error) // Log errors with console.error for better visibility
        return NextResponse.json(
          { error: "An error occurred" },
          { status: 500 }
        )
      }
    }
    if (!invoiceid && !projectId && !userId && upsellerId && !companyName) {
      try {
        await connectMongoDB() // Make sure this function is properly defined
        let commission =0;
        // Fetch all invoices with the same projectName
        const invoices = await Invoice.find({
          upsellerId,
          commission_paid: { $ne: "No" },
        }).select()
        if(invoices.length>0){
          for(const invoice of invoices){
            const findUser = await User.findById({_id:invoice.userId})
            if(findUser){
              const upSellerPercentage = findUser.upsellerPercentage||0
              commission+=invoice.amount*upSellerPercentage/100
            }
          }
        }
        return NextResponse.json({ commission })
      } catch (error) {
        console.error(error) // Log errors with console.error for better visibility
        return NextResponse.json(
          { error: "An error occurred" },
          { status: 500 }
        )
      }
    }

    if (!invoiceid && !projectId && !userId && !upsellerId && companyName) {
      await connectMongoDB()
      const invoices = await Invoice.find({ commission_paid: { $ne: "No" } })

      if (invoices.length > 0) {
        let totalEarning = 0
        for (const invoice of invoices) {
          const invoiceProject = await Project.findOne({
            _id: invoice.projectId,
            companyName: companyName,
          })

          if (
            invoiceProject &&
            invoice.projectId &&
            invoiceProject._id &&
            invoice.projectId.toString() === invoiceProject._id.toString()
          ) {
            const commissionRate = invoiceProject?.commisson_rate || 0
            totalEarning +=
              invoice.amount - (invoice.amount * commissionRate) / 100
            if (invoiceProject?.upSellerId !== "none") {
              const projectUser = await User.findById({
                _id: invoiceProject.salesId,
              })

              const upsellerPercentage =
                Number(projectUser.upsellerPercentage) || 0
              totalEarning -= (invoice.amount * upsellerPercentage) / 100
            }
          }
        }
        return NextResponse.json({ totalEarning })
      }

      return NextResponse.json({ totalEarning: 0 })
    }
    if (!invoiceid && !projectId && !userId && !upsellerId && !companyName) {
      await connectMongoDB()
      const invoices = await Invoice.find({ commission_paid: { $ne: "No" } })
      if (invoices.length > 0) {
        let totalEarning = 0
        for (const invoice of invoices) {
          const invoiceProject = await Project.findById({
            _id: invoice.projectId,
          })
          if (
            invoiceProject &&
            invoice.projectId &&
            invoiceProject._id &&
            invoice.projectId.toString() === invoiceProject._id.toString()
          ) {
            const commissionRate = invoiceProject?.commisson_rate || 0
            totalEarning +=
              invoice.amount - (invoice.amount * commissionRate) / 100
            if (
              invoiceProject?.upSellerId !== "none" &&
              invoiceProject.salesId
            ) {
              const projectUser = await User.findById({
                _id: invoiceProject.salesId,
              })
              if (projectUser) {
                const upsellerPercentage =
                  Number(projectUser.upsellerPercentage) || 0
                totalEarning -= (invoice.amount * upsellerPercentage) / 100
              }
            }
          }
        }
        return NextResponse.json({ totalEarning })
      }

      return NextResponse.json({ totalEarning: 0 })
    }
  }
}

export async function PUT(req) {
  const session = await getServerSession(req)
  if (!session) {
    return NextResponse.json("Unauthorized")
  } else {
    try {
      const id = req.nextUrl.searchParams.get("invoiceid")
      const {
        invoiceDate,
        userId,
        upsellerId,
        amount,
        status,
        commission_paid,
      } = await req.json()
      await connectMongoDB()

      await Invoice.findByIdAndUpdate(id, {
        invoiceDate,
        userId,
        upsellerId,
        amount,
        status,
        commission_paid,
      })

      return NextResponse.json({ message: "Invoice Updated!" }, { status: 201 })
    } catch (error) {
      return NextResponse.json(
        { message: "An error occurred while Invoice Submited." },
        { status: 500 }
      )
    }
  }
}

export async function DELETE(req) {
  const session = await getServerSession(req)
  if (!session) {
    return NextResponse.json("Unauthorized")
  } else {
    const id = req.nextUrl.searchParams.get("invoiceid")
    const projectId = req.nextUrl.searchParams.get("projectid")

    if (id) {
      await connectMongoDB()
      await Invoice.findByIdAndDelete(id)
      return NextResponse.json({ message: "Invoice Deleted" }, { status: 200 })
    }

    if (projectId) {
      await connectMongoDB()

      // Use deleteMany to delete all documents with the same projectId
      const deleteResult = await Invoice.deleteMany({ projectId })

      if (deleteResult.deletedCount > 0) {
        return NextResponse.json(
          { message: `${deleteResult.deletedCount} Invoices Deleted` },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          { message: "No Invoices found for deletion" },
          { status: 200 }
        )
      }
    }
  }
}
