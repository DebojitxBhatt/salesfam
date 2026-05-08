import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule
import { Resend } from "resend"

import { RaycastMagicLinkEmail } from "../../../../components/email-template/email-send"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  try {
    const { from, to, subject, projectName, salesPerson, EmailTemplate } =
      await req.json()

    let data

    data = await resend.emails.send({
      from: from,
      to: to,
      subject: subject,
      react: RaycastMagicLinkEmail({
        projectName: projectName,
        salesPerson: salesPerson,
        subject: subject,
      }),
    })

    return NextResponse.json(data) // Return the data on success
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred" })
  }
}
