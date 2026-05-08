import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import { Resend } from "resend"
import { getServerSession } from "next-auth"
import { RaycastMagicLinkEmail } from "../../../../components/email-template/email-send"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  const session = await getServerSession(req)
  if (!session) {
    return NextResponse.json("Unauthorized")
  }else{
    try {
      const { from, to, subject, salesPerson, companyName, rate } =
        await req.json()
  
      let data
  
      data = await resend.emails.send({
        from: from,
        to: to,
        subject: subject,
        react: RaycastMagicLinkEmail({
          salesPerson: salesPerson,
          companyName: companyName,
          rate: rate,
          subject: subject,
        }),
      })
  
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error:", error)
      return NextResponse.json({ error: "An error occurred" })
    }
  }
 
}
