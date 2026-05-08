import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import Invoice from "@/models/invoice"
import User from "@/models/user"
import Project from "@/models/project"
import { getServerSession } from "next-auth"

import { connectMongoDB } from "@/lib/mongodb"

export async function GET(req) {
  const session = await getServerSession(req)
  if (!session) {
    return NextResponse.json("Unauthorized")
  }else{
    const projectId = req.nextUrl.searchParams.get("id")
    const upsellerId = req.nextUrl.searchParams.get("upsale")
    const sellerId = req.nextUrl.searchParams.get("sellerId")
  
    if (projectId && !upsellerId && !sellerId) {
      try {
        await connectMongoDB()
        const invoices = await Invoice.find({
          projectId,
          commission_paid: { $ne: "No" },
        }).select()
  
        if (invoices.length > 0) {
          const userId = invoices[0].userId
          const user = await User.findOne({ _id: userId })
          if(user){
            const rate = user.commission_rate
  
          var totalEarnings = 0
          invoices.forEach(function (invoice) {
            totalEarnings += invoice.amount
          })
  
          const commission = (totalEarnings * rate) / 100
  
          return NextResponse.json({ commission })
          }
        } else {
          return NextResponse.json({ commission: 0 })
        }
      } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "An error occurred" }, { status: 500 })
      }
    }
  
    if (!projectId && upsellerId && !sellerId) {
      try {
        await connectMongoDB()
        const invoices = await Invoice.find({
          commission_paid: { $ne: "No" },
        }).select()
        let commission=0
        let totalEarnings = 0
        const filterInvoice = invoices.filter((item)=>item.userId===upsellerId)
        const filterUpSellerInvoice = invoices.filter((item)=>item.upsellerId===upsellerId)
        if (filterInvoice.length > 0) {
         for(const invoice of filterInvoice) {
            const findProject= await Project.findById(invoice.projectId)
            const commission_Rate = findProject.commisson_rate
            totalEarnings +=invoice.amount*commission_Rate/100
          }
  
        }
  
        if(filterUpSellerInvoice.length>0){
          for(const invoice of filterUpSellerInvoice){
            const upsellerUser =  await User.findById(invoice.userId)
          if(upsellerUser){
            const upSellerPercentage = upsellerUser?.upsellerPercentage
            commission+=invoice.amount*upSellerPercentage/100
          }
          }
        }
        return NextResponse.json({ commission,totalEarnings })
      } catch (error) {
        console.error(error)
        return NextResponse.json({ commission: 0,totalEarnings:0 })
      }
    }
  
    if (upsellerId && sellerId &&!projectId ) {
      try {
        await connectMongoDB()
        const invoices = await Invoice.find({
          upsellerId,
          userId: sellerId,
          commission_paid: { $ne: "No" },
        }).select()
        if (invoices.length > 0) {
          const userIds = invoices[0].userId
         if(userIds){
          const user = await User.findOne({ _id: userIds })
          let rate = user.upsellerPercentage
          let totalEarnings = 0
          invoices.forEach(function (invoice) {
            totalEarnings += invoice.amount
          })
          const commission = (totalEarnings *Number(rate)) / 100 ||0
          return NextResponse.json({ commission})
         }
        } else {
          return NextResponse.json({ commission: 0 })
        }
      } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "An error occurred" }, { status: 500 })
      }
    }
  }
 
}