import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import Invoice from "@/models/invoice"
import { getServerSession } from "next-auth"
import { connectMongoDB } from "@/lib/mongodb"

export async function GET(req) {
  const session = await getServerSession(req)
  if (!session) {
    return NextResponse.json("Unauthorized")
  }else{
    const projectId = req.nextUrl.searchParams.get("id")

    try {
      await connectMongoDB() // Make sure this function is properly defined
      const invoices = await Invoice.find({
        projectId,
        status: { $ne: "Unpaid" },
      }).select()
  
      var totalEarnings = 0
      invoices.forEach(function (invoice) {
        totalEarnings += invoice.amount
      })
  
      return NextResponse.json({ totalEarnings })
    } catch (error) {
      console.error(error) // Log errors with console.error for better visibility
      return NextResponse.json({ error: "An error occurred" }, { status: 500 })
    }
  }
  
}
