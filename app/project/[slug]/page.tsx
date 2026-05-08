"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Project from "@/models/project"
import {
  ArrowUpDown,
  BookOpenCheck,
  Calendar as CalendarIcon,
  ChevronDown,
  ExternalLink,
  FolderEdit,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddInvoice from "@/components/AddInvoice"
import EditProject from "@/components/EditProject"
import Gettotal from "@/components/Gettotal"
import Gettotalcommission from "@/components/Gettotalcommission"
import InvoiceTable from "@/components/InvoiceTable"
import SalesInvoiceTable from "@/components/SalesInvoiceTable"
import Statusbadge from "@/components/statusBadge"

export default function ProjectDetails({ params }) {
  const slug = params.slug
  const { data: session } = useSession()
  const [data, setData] = useState(null)
  const [commission, setCommission] = useState()
  const [upsellerId, setupsellerId] = useState("none")

  const [isLoading, setLoading] = useState(true)
  const [isEdit, setEdit] = useState(false)

  const handleToggleEdit = () => {
    setEdit((prevEdit) => !prevEdit)
  }

  const [invoiceData, setinvoicedata] = useState()

  const findObjectByCompanyName = (array, companyName) => {
    return array.find((obj) => obj.companyName === companyName)
  }

  useEffect(() => {
    fetch(`/api/project/?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.project)
        setLoading(false)

        fetch(`/api/user/?id=${data.project.salesId}`)
          .then((response) => response.json())
          .then((Userdata) => {
            const foundObject = findObjectByCompanyName(
              Userdata.user.contracts,
              data.project.companyName
            )
            setCommission(foundObject.rate)
            setupsellerId(Userdata.user.upSellerId)
          })
          .catch((error) => {
            console.error("Error:", error)
          })
        return fetch(`../api/invoice/?projectId=${data.project._id}`)
      })
      .then((response) => response.json())
      .then((invoices) => {
        setinvoicedata(invoices)
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="container ">
        <div className="flex">
          <div className="w-3/12 pr-14">
            <Skeleton className="mb-2 h-[48px] w-full border bg-[#fff] p-3">
              <Skeleton className="mb-4 h-4 rounded-lg bg-[#f4f4f4]"></Skeleton>
            </Skeleton>
            <Skeleton className="mb-2 h-[48px] w-full border bg-[#fff] p-3">
              <Skeleton className="mb-4 h-4 rounded-lg bg-[#f4f4f4]"></Skeleton>
            </Skeleton>
          </div>
          <div className="w-9/12">
            <Skeleton className="h-[334px] rounded-lg border bg-[#fff] p-5">
              <Skeleton className="mb-4 h-4 rounded-lg bg-[#f4f4f4]"></Skeleton>
              <Skeleton className="mb-4 h-4 rounded-lg bg-[#f4f4f4]"></Skeleton>
              <div className="flex">
                <div className="w-6/12 pr-2">
                  <Skeleton className="mb-4 h-10 rounded-lg bg-[#f4f4f4]"></Skeleton>
                  <Skeleton className="mb-4 h-10 rounded-lg bg-[#f4f4f4]"></Skeleton>
                  <Skeleton className="mb-4 h-10 rounded-lg bg-[#f4f4f4]"></Skeleton>
                  <Skeleton className="mb-4 h-10 rounded-lg bg-[#f4f4f4]"></Skeleton>
                </div>
                <div className="w-6/12 pl-2">
                  <Skeleton className="mb-4 h-10 rounded-lg bg-[#f4f4f4]"></Skeleton>
                  <Skeleton className="mb-4 h-10 rounded-lg bg-[#f4f4f4]"></Skeleton>
                  <Skeleton className="mb-4 h-10 rounded-lg bg-[#f4f4f4]"></Skeleton>
                  <Skeleton className="mb-4 h-10 rounded-lg bg-[#f4f4f4]"></Skeleton>
                </div>
              </div>
            </Skeleton>
          </div>
        </div>
      </div>
    )
  }
  if (!data) return <div className="container min-w-11/12 text-center"><p>No project data</p></div>
  return (
    <>
      <div className="container min-w-11/12">
        <Tabs defaultValue="overview" className="flex items-start w-full">
          <TabsList className="w-3/12 mt-2 pr-14">
            <div className="flex w-full flex-col [&>*]:mb-2">
              <TabsTrigger value="overview">
                <BookOpenCheck className="mr-2  w-[20px]" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="invoices">
                <FolderEdit className="mr-2  w-[20px]" />
                Invoices
              </TabsTrigger>
            </div>
          </TabsList>
          <TabsContent className="w-9/12" value="overview">
            <Card>
              {isEdit ? (
                <>
                  <CardHeader>
                    <div className="flex flex-row justify-between">
                      <div className="flex items-center justify-end w-full">
                        <ul className="flex items-center [&>li]:mx-1 [&>li]:cursor-pointer">
                          <li onClick={handleToggleEdit}>
                            <FolderEdit className="w-[20px] text-green-500" />
                          </li>
                          <li>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Trash2 className="w-[20px] text-red-600" />
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the project and remove
                                    data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-[#ff0909]"
                                    onClick={async () => {
                                      const res = await fetch(
                                        `/api/project?id=${data._id}`,
                                        {
                                          method: "DELETE",
                                        }
                                      )
                                      if (res.ok) {
                                        window.location.href = "/dashboard"
                                      }
                                    }}
                                  >
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <EditProject data={data} />
                  </CardContent>
                </>
              ) : (
                <>
                  <CardHeader>
                    <div className="flex flex-row justify-between">
                      <CardTitle className="pl-4 capitalize border-l-4 border-primary text-primary">
                        {data.projectName}
                      </CardTitle>
                      <div className="flex items-center">
                        {(session?.user?.role == "SuperAdmin" ||
                          session?.user?.role == "Sales1" ||session?.user?.role == "Admin-IA") && (
                          <ul className="flex items-center [&>li]:mx-1 [&>li]:cursor-pointer">
                            <li onClick={handleToggleEdit}>
                              <FolderEdit className="w-[20px] text-green-500" />
                            </li>
                            <li>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Trash2 className="w-[20px] text-red-600" />
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete the project and remove
                                      data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-[#ff0909]"
                                      onClick={async () => {
                                        const res = await fetch(
                                          `/api/project?id=${data._id}`,
                                          {
                                            method: "DELETE",
                                          }
                                        )
                                        if (res.ok) {
                                          window.location.href = "/"
                                        }
                                      }}
                                    >
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="flex">
                        <div className="w-6/12 pr-4 border-r-2">
                          <div className="flex gap-x-5">
                            <div className="[&>h4]:pb-4">
                              <h4>
                                <b className="font-semibold text-primary">
                                  Sales Person:{" "}
                                </b>
                              </h4>
                              <h4>
                                <b className="font-semibold text-primary">
                                  Company Name:{" "}
                                </b>
                              </h4>
                              <h4>
                                <b className="font-semibold text-primary">
                                  Status:{" "}
                                </b>
                              </h4>
                              <h4>
                                <b className="font-semibold text-primary">
                                  Date Signed:{" "}
                                </b>
                              </h4>
                              <h4>
                                <b className="font-semibold text-primary">
                                  Budget:{" "}
                                </b>
                              </h4>
                              <h4>
                                <b className="font-semibold text-primary">
                                  Commission Rate:{" "}
                                </b>
                              </h4>
                              <h4>
                                <b className="font-semibold text-primary">
                                  Commission Paid:{" "}
                                </b>
                              </h4>
                            </div>
                            <div className="[&>h4]:pb-4">
                              <h4>{data.salesPerson}</h4>
                              <h4 className="capitalize">{data.companyName}</h4>
                              <h4>
                                <Statusbadge value={data.status} />
                              </h4>
                              <h4>{data.dateSigned}</h4>
                              <h4>${data.budget}</h4>
                              <h4>{commission && commission}%</h4>
                              <h4>
                                {invoiceData && (
                                  <Gettotalcommission
                                    rate={commission}
                                    data={invoiceData.invoices}
                                  />
                                )}
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div className="w-6/12 pl-4">
                          <div className="">
                            <div className="flex gap-x-5">
                            <div className="[&>h4]:pb-4">
                              <h4>
                                <b className="font-semibold text-primary">
                                  Client Name:{" "}
                                </b>
                              </h4>
                              <h4>
                                <b className="font-semibold text-primary">
                                  Email Address:{" "}
                                </b>
                              </h4>
                              <h4>
                                <b className="font-semibold text-primary">
                                  Phone Number:{" "}
                                </b>
                              </h4>
                              <h4>
                                <b className="font-semibold text-primary">
                                  Client Address:{" "}
                                </b>
                              </h4>
                            </div>
                            <div className="[&>h4]:pb-4">
                              <h4>{data.clientName}</h4>
                              <h4>{data.email}</h4>
                              <h4>{data.phone}</h4>

                              <h4
                                style={{
                                  wordWrap: "break-word",
                                  overflowWrap: "break-word",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: data.address,
                                }}
                              ></h4>
                
                            </div>
                            </div>
                            <div className="w-full">
                            {data?.callClient &&
                            <div className="col-span-2 px-3 py-2 mt-2 border-l-4 bg-red-50 border-l-red-500">
                            <p>Do not call the client directly.</p>
                            </div>}
                            {data?.emailClient &&
                            <div className="col-span-2 px-3 py-2 mt-2 border-l-4 bg-red-50 border-l-red-500">
                            <p>Do not send marketing emails to the client.</p>
                           </div>
                            }
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-1">
                        <h4>
                          <b className="font-semibold text-primary">
                            Project Details:{" "}
                          </b>
                        </h4>

                        <p
                          style={{
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            textAlign:"justify"
                          }}
                          dangerouslySetInnerHTML={{
                            __html: data.projectDetails,
                          }}
                        ></p>
                      </div>
                      
                     
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </TabsContent>
          <TabsContent className="w-9/12" value="invoices">
            <Card>
              <CardHeader>
                <CardTitle className="pl-4 capitalize border-l-4 border-primary text-primary">
                  Invoices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(session?.user?.role == "SuperAdmin" ||session?.user?.role == "Admin-IA") && (
                  <AddInvoice
                    projectId={data._id}
                    rate={commission}
                    user={data.salesId}
                    upsellerId={upsellerId}
                  />
                )}
                <div className="space-y-1">
                  {!invoiceData && <>Loading...</>}
                  {(session?.user?.role == "SuperAdmin" ||session?.user?.role == "Admin-IA") && invoiceData && (
                    <InvoiceTable
                      rate={commission}
                      invoiceData={invoiceData.invoices}
                    />
                  )}
                  {session?.user?.role == "Sales1" && invoiceData && (
                    <InvoiceTable
                      rate={commission}
                      invoiceData={invoiceData.invoices}
                    />
                  )}
                  {session?.user?.role == "Sales2" && invoiceData && (
                    <SalesInvoiceTable
                      rate={commission}
                      invoiceData={invoiceData.invoices}
                    />
                  )}
                </div>
                <div className="flex items-center pt-10">
                  <div className="w-4/12">
                    <div className="flex items-center justify-between p-4 m-2 border rounded-md shadow-md single-card">
                      <h2 className="font-semibold text-red-500">
                        Payment Due:
                      </h2>
                      <span className="font-semibold text-red-500">
                        {invoiceData && (
                          <Gettotal
                            filter={"Unpaid"}
                            data={invoiceData.invoices}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="w-4/12">
                    <div className="flex items-center justify-between p-4 m-2 border rounded-md shadow-md single-card">
                      <h2 className="font-semibold text-green-500">
                        Payment Recived:
                      </h2>
                      <span className="font-semibold text-green-500">
                        {invoiceData && (
                          <Gettotal
                            filter={"Paid"}
                            data={invoiceData.invoices}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="w-4/12">
                    <div className="flex items-center justify-between p-4 m-2 border rounded-md shadow-md single-card">
                      <h2 className="font-semibold text-green-500">
                        Commission Paid:
                      </h2>
                      <span className="font-semibold text-green-500">
                        {invoiceData && (
                          <Gettotalcommission
                            rate={commission}
                            data={invoiceData.invoices}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
