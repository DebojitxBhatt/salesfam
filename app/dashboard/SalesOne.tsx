"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import { fetchCompanies } from "@/lib/company/company"
import { fetchProjects } from "@/lib/fetchProjects"
import { fetchUsers } from "@/lib/fetchUsers"
import { InvoiceByUserId,upSellerPercentage } from "@/lib/fetchInvoices"
import { getUser } from "@/lib/getUser"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SalesTable from "@/components/SalesTable"
import SingleCard from "@/components/SingleCard"
import StatCard from "@/components/StatCard"
import AlertBox from "@/components/common-ui/AlertBox"
import DatatableSeller1 from "@/components/datatableSeller1"
import CardSkeleton from "@/components/skeleton/CardSkeleton"

import TableRowSkeleton from "./TableRowSkeleton"

export default function SalesOne() {
  const { data: session } = useSession()
  const [data, setData] = useState(null)
  const [clientName, setclientName] = useState()
  const [pendingProject, setpendingProject] = useState()

  const role = session?.user?.role
  const username = session?.user?.name
  const [userData, setuserData] = useState()

  const [salesGuy, setsalesGuy] = useState()
  const [earning, setEarning] = useState(0)
  const [commission, setcommission] = useState(0)

  const [Allcompanies, setAllcompanies] = useState()

  const [userId, setuserId] = useState()
  const [userName, setuserName] = useState()

  const [Downstream, setDownstream] = useState()

  useEffect(() => {
    if (session) {
      const id = session?.user?.id

      fetch(`/api/user?upSellerId=${id}`)
        .then((res) => res.json())
        .then((data) => {
          setsalesGuy(data.users.length)
        })
        .catch((error) => {
          console.error("Error:", error)
        })

        InvoiceByUserId(session.user.id).then((res)=>{
          setEarning(res)
      })
      upSellerPercentage(session.user.id).then((res)=>{
        setcommission(res)
      })

      fetchUsers("Sales2")
        .then((userData) => {
          const Downstream = userData.filter((item) => item.upSellerId == id)
          setDownstream(Downstream)
        })
        .catch((error) => {
          console.error("Error in component:", error)
        })

      fetchProjects()
        .then((apiData) => {
          if (apiData) {
            const allProjects = apiData.filter((item) => item.salesId == id)
            const uniqueClientNames = []

            allProjects.forEach((item) => {
              if (!uniqueClientNames.includes(item.clientName)) {
                uniqueClientNames.push(item.clientName)
              }
            })

            setclientName(uniqueClientNames.length)

            setData(allProjects)

            const pendingProjects = allProjects.filter(
              (item) => item.status == "Pending"
            )
            setpendingProject(pendingProjects)
          }
        })
        .catch((error) => {
          console.error("Error in component:", error)
        })

      setuserId(session?.user?.id)
      setuserName(session?.user?.name)

      if (session) {
        const id = session?.user?.id
        getUser(id).then((user) => {
          setAllcompanies(user.contracts)
        })
      }
    }
  }, [session])

  return (
    <>
      {pendingProject && pendingProject.length > 0 && (
        <AlertBox projects={pendingProject} />
      )}
      <div className="grid grid-cols-4 gap-4 min-w-11/12">
        {!session && <CardSkeleton />}
        {session && <StatCard title="Sales Rep" value={salesGuy} />}

        {!clientName && clientName != 0 && <CardSkeleton />}
        <StatCard title="Clients" value={clientName} />

        {!session && <CardSkeleton />}
        {(earning || earning == 0) && (
          <>
            <StatCard title="Earnings" value={earning} prefix="$" />
          </>
        )}
        {(commission || commission == 0) && (
          <>
            <StatCard title="Commission Earnings" value={commission} prefix="$" />
          </>
        )}
      </div>
      <div className="mt-5">
        <Tabs
          defaultValue="projects"
          className="items-center justify-between w-full"
        >
          <div className="flex items-center justify-between w-full">
            <TabsList className="bg-white p-1.5 shadow-md">
              <TabsTrigger value="projects" className="p-1.5">
                <span className="w-[120px] font-semibold">Projects</span>
              </TabsTrigger>
              <TabsTrigger value="salesRep" className="p-1.5">
                <span className="w-[160px] font-semibold">Downstream Reps</span>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="projects">
            {!data && <TableRowSkeleton />}

            {userId && userName && data && Allcompanies && (
              <DatatableSeller1
                projects={data}
                Allcompanies={Allcompanies}
                id={userId}
                userName={userName}
              />
            )}
          </TabsContent>
          <TabsContent value="salesRep">
            {Downstream && <SalesTable sales={Downstream} />}
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
