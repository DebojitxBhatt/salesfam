"use client"
import { useSession } from "next-auth/react"

import AdminIA from "./AdminIA"
import SalesOne from "./SalesOne"
import SalesTwo from "./SalesTwo"
import SuperAdmin from "./SuperAdmin"

export default function DashboardPage() {
  const { data: session } = useSession()
  const role = session?.user?.role

  return (
    <>
      <div className="container mt-5 min-w-11/12">
        {role == "SuperAdmin" && <SuperAdmin />}
        {role == "Admin-IA" && <AdminIA />}
        {role == "Sales1" && <SalesOne />}
        {role == "Sales2" && <SalesTwo />}
      </div>
    </>
  )
}
