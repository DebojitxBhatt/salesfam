import NextServerModule from "next/server"

const NextResponse = NextServerModule.NextResponse ?? NextServerModule

export async function GET(req) {
  return NextResponse.json("hello")
}
