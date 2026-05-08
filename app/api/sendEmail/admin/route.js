import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import { Resend } from "resend"
import { getServerSession } from "next-auth"
import { EmailPlaceholder } from "../../../../components/email-template/email-placeholder"
import { PasswordResetRequest } from "../../../../components/email-template/ResetTemplate"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  const session = await getServerSession(req)
  if (!session) {
    return NextResponse.json("Unauthorized")
  }else{
    try {
      const { from, to, subject, projectName, salesPerson } = await req.json()
      let data  
      if(from && to &&!projectName){
        data = await resend.emails.send({
          from: from,
          to: to,
          subject: "Reset password request",
          react: PasswordResetRequest({
            salesName: salesPerson,
            mainEmail:from
          }),
        })
      }else{
        data = await resend.emails.send({
          from: from,
          to: to,
          subject: subject,
          react: EmailPlaceholder({
            projectName: projectName,
            salesPerson: salesPerson,
            subject: subject,
          }),
        })
      }
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error:", error)
      return NextResponse.json({ error: "An error occurred" })
    }
  }
 
}
