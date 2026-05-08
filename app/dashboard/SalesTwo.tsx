"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import { fetchCompanies } from "@/lib/company/company"
import { fetchInvoices,InvoiceByUserId } from "@/lib/fetchInvoices"
import { fetchProjects } from "@/lib/fetchProjects"
import { getUser } from "@/lib/getUser"
import StatCard from "@/components/StatCard"
import AlertBox from "@/components/common-ui/AlertBox"
import DatatableSales from "@/components/datatableSales"
import CardSkeleton from "@/components/skeleton/CardSkeleton"

import TableRowSkeleton from "./TableRowSkeleton"

export default function SalesTwo() {
  const { data: session } = useSession()
  const [data, setData] = useState(null)
  const [clientName, setclientName] = useState()
  const [salesPerson, setSalesPerson] = useState()
  const [pendingProject, setpendingProject] = useState()
  const [completedproject, setcompletedproject] = useState()
  const [isLoading, setLoading] = useState(true)

  const [totalEarn, settotalEarn] = useState(0)
  const role = session?.user?.role
  const username = session?.user?.name

  const [AllCompanies, setAllcompanies] = useState()
  const [allinvoice, setallInvoice] = useState()

  useEffect(() => {
    fetchProjects()
      .then((apiData) => {
        if (apiData) {
          const pendingProjects = apiData.filter(
            (item) => item.status == "Pending" && item.salesPerson == username
          )
          const filteredData = apiData.filter(
            (item) => item.status !== "Pending" && item.salesPerson == username
          )

          const completedproject = apiData.filter(
            (item) => item.status == "Complete" && item.salesPerson == username
          )

          const uniqueClientNames = []

          filteredData.forEach((item) => {
            if (!uniqueClientNames.includes(item.clientName)) {
              uniqueClientNames.push(item.clientName)
            }
          })

          setcompletedproject(completedproject)
          setclientName(uniqueClientNames)
          setpendingProject(pendingProjects)
          setData(filteredData)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error("Error in component:", error)
      })

    InvoiceByUserId(session?.user?.id).then((res)=>{
      settotalEarn(res)
    })
    if (session) {
      const id = session?.user?.id
      getUser(id).then((user) => {
        console.log(user)
        setAllcompanies(user.contracts)
      })
    }
  }, [session, role, username])

  return (
    <>
      {pendingProject && pendingProject.length > 0 && (
        <AlertBox projects={pendingProject} />
      )}

      <div className="grid grid-cols-4 gap-4 min-w-11/12">
        {!totalEarn && totalEarn != 0 && <CardSkeleton />}
        {(totalEarn || totalEarn == 0) && (
          <StatCard title={"Earnings"} value={totalEarn} prefix="$" />
        )}

        {!data && <CardSkeleton />}
        {data && (
          <StatCard
            title={"Projects"}
            value={String(data.length).padStart(2, "0")}
          />
        )}

        {!clientName && <CardSkeleton />}
        {clientName && (
          <StatCard
            title={"Clients"}
            value={String(clientName.length).padStart(2, "0")}
          />
        )}
      </div>

      {!data && <TableRowSkeleton />}

      {data && AllCompanies && (
        <DatatableSales
          projects={data}
          AllCompanies={AllCompanies}
          allinvoice={allinvoice}
        />
      )}
    </>
  )
}
