"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { FileEdit, Plus, Trash2,User,Search } from "lucide-react"

import { fetchClients } from "@/lib/fetchClients"
import  MangeUser  from "@/components/skeleton/MangeUser"
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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import EditClient from "@/components/superAdmin/EditClient"
import ViewClient from "@/components/superAdmin/ViewClient"

const columns = [

  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="pr-2 text-left ">ClientName</span>
          <svg
            width="6"
            height="9"
            viewBox="0 0 6 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.08711 4L4.91289 4C5.34007 4 5.57052 3.49894 5.29252 3.1746L3.37963 0.942899C3.18008 0.710094 2.81992 0.710094 2.62037 0.942899L0.707482 3.1746C0.429479 3.49894 0.659934 4 1.08711 4Z"
              fill="#6E28D4"
            />
            <path
              d="M4.91289 5H1.08711C0.659934 5 0.429479 5.50106 0.707482 5.8254L2.62037 8.0571C2.81992 8.28991 3.18008 8.28991 3.37963 8.0571L5.29252 5.8254C5.57052 5.50106 5.34007 5 4.91289 5Z"
              fill="#A5A6F6"
            />
          </svg>
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="pr-2 text-left">Phone</span>
          <svg
            width="6"
            height="9"
            viewBox="0 0 6 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.08711 4L4.91289 4C5.34007 4 5.57052 3.49894 5.29252 3.1746L3.37963 0.942899C3.18008 0.710094 2.81992 0.710094 2.62037 0.942899L0.707482 3.1746C0.429479 3.49894 0.659934 4 1.08711 4Z"
              fill="#6E28D4"
            />
            <path
              d="M4.91289 5H1.08711C0.659934 5 0.429479 5.50106 0.707482 5.8254L2.62037 8.0571C2.81992 8.28991 3.18008 8.28991 3.37963 8.0571L5.29252 5.8254C5.57052 5.50106 5.34007 5 4.91289 5Z"
              fill="#A5A6F6"
            />
          </svg>
        </Button>
      )
    },
  },
  
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <div className="px-1 cursor-pointer">
          <ViewClient id={row.original._id} />
        </div>
        <div className="px-1 cursor-pointer">
          <EditClient id={row.original._id} />
        </div>
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="px-1 cursor-pointer">
                <Trash2 className="w-[20px] text-red-600" />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  project and remove data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-[#ff0909]"
                  onClick={async () => {
                    const res = await fetch(
                      `/api/client?id=${row.original._id}`,
                      {
                        method: "DELETE",
                      }
                    )
                    if (res.ok) {
                      window.location.reload()
                    }
                  }}
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    ),
  },
]

export default function ManageClient() {
  const [data, setData] = useState(null)
  const [isLoading, setisLoading] = useState(true)

  useEffect(() => {
    fetchClients("SuperAdmin")
      .then((apiData) => {
        console.log(apiData)
        setData(apiData)
        setisLoading(false)
      })
      .catch((error) => {
        console.error("Error in component:", error)
      })
  }, [])

  const [role, setRole] = useState()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (isLoading) {
    return (
      <div className="container">
        <MangeUser/>
      </div>
    )
  }

  return (
    <div className="container min-w-11/12">
      <h1 className="text-2xl">Manage Clients</h1>
      <div className="flex items-center w-full py-4">
        <div className="flex items-center justify-start w-full px-3 bg-white border rounded-md ">
 
        <Search className="text-primary size-5"/>
          <Input
            placeholder="Search client..."
            value={(table.getColumn("clientName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("clientName")?.setFilterValue(event.target.value)
            }
            className="w-full border-0 rounded-none"
          />
        </div>
     
      </div>
      <div>
        <Table className="w-full border-separate dataTable userTable caption-bottom border-spacing-y-2">
          <TableHeader className="bg-transparent">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <>
                  <TableRow
                    className="border-color-[#E9EFF4] mb-10 overflow-hidden rounded-md border shadow-md"
                    key={row.id}
                    data-state={row.getIsSelected()}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <>
                      
                      <TableCell key={cell.id} className={`p-2 px-4 ${cell.column.id=="clientName"?"font-semibold h-full capitalize cursor-pointer text-primary flex items-center gap-x-[5px] pt-3 pb-3":"h-full"} `}>
                      {cell.column.id=="clientName"?<div className="w-[20px] h-full"> <User className="w-[20px]  h-[20px] rounded-full" /></div>:""}
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                      </>
                    ))}
                  </TableRow>
                </>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end py-4 space-x-2">
        <div className="flex-1 text-sm text-muted-foreground"></div>
        <div className="space-x-2">
          <Button
            className="w-[100px]"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            className="w-[100px]"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
