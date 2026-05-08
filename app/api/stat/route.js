import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import Invoice from "@/models/invoice"
import Project from "@/models/project"
import User from "@/models/user"
import { getServerSession } from "next-auth"
import { connectMongoDB } from "@/lib/mongodb"

export async function GET(req) {
  const session = await getServerSession(req)
  if (!session) {
    return NextResponse.json("Unauthorized")
  }else{
    try {
      const salesId = req.nextUrl.searchParams.get("id")
      await connectMongoDB()
      const AllProject = await Project.find({ salesId })
      const projects = AllProject.length
      let clientNamesSet = new Set()
      AllProject.forEach(function (project) {
        clientNamesSet.add(project.clientName)
      })
  
  
      let uniqueClientNames = Array.from(clientNamesSet)
      let clients = uniqueClientNames.length
      const userId = salesId
      const invoices = await Invoice.find({
        userId,
        commission_paid: { $ne: "No" },
      }).select()
  
      let totalAmount = 0
      let commission =0
  
      invoices.forEach( (invoice)=> {
        const existProject = AllProject?.find((p) => p._id == invoice.projectId);
          if (existProject) {
            totalAmount+=invoice.amount
            const commissionRate = existProject.commisson_rate;
            commission += (invoice.amount * invoice.rate) / 100;
          }
        
      })
  
      return NextResponse.json({ projects, clients, totalAmount, commission })
    } catch (error) {
      console.error(error) // Log errors with console.error for better visibility
      return NextResponse.json({ error: "An error occurred" }, { status: 500 })
    }
  }
}
