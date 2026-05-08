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
import { FileEdit, Plus, Trash2 ,Search,User} from "lucide-react"

import { fetchAllUsers } from "@/lib/fetchUsers"
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
import EditUser from "@/components/superAdmin/EditUser"

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center font-semibold capitalize cursor-pointer text-primary">
        <span className="flex items-center justify-center w-5 h-5 mr-1 rounded-full">
          <User className="size-5"/>
        </span>
        <Link href={`/sales/${row.getValue("name")}`}>{row.getValue("name")}</Link>
        
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="pr-2 text-left">Role</span>
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
  // {
  //   accessorKey: "commission_rate",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         className="p-0"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         <span className="pr-2 text-left">Commission Rate</span>
  //         <svg
  //           width="6"
  //           height="9"
  //           viewBox="0 0 6 9"
  //           fill="none"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path
  //             d="M1.08711 4L4.91289 4C5.34007 4 5.57052 3.49894 5.29252 3.1746L3.37963 0.942899C3.18008 0.710094 2.81992 0.710094 2.62037 0.942899L0.707482 3.1746C0.429479 3.49894 0.659934 4 1.08711 4Z"
  //             fill="#6E28D4"
  //           />
  //           <path
  //             d="M4.91289 5H1.08711C0.659934 5 0.429479 5.50106 0.707482 5.8254L2.62037 8.0571C2.81992 8.28991 3.18008 8.28991 3.37963 8.0571L5.29252 5.8254C5.57052 5.50106 5.34007 5 4.91289 5Z"
  //             fill="#A5A6F6"
  //           />
  //         </svg>
  //       </Button>
  //     )
  //   },
  // },
  {
    accessorKey: "upSeller",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="pr-2 text-left">UpSeller</span>
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
          <EditUser id={row.original._id} />
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
                      `/api/user?id=${row.original._id}`,
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

export default function ManageUser() {
  const [data, setData] = useState(null)

  const [isLoading, setisLoading] = useState(true)
  useEffect(() => {
    fetchAllUsers("SuperAdmin")
      .then((apiData) => {
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
      <h1 className="text-2xl">Manage Users</h1>
      <div className="flex items-center py-4">
        <div className="flex items-center justify-start w-10/12 px-3 bg-white border rounded-md">
          <Search className="text-primary size-5"/>
          <Input
            placeholder="Search..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="w-full border-0 rounded-none"
          />
        </div>
        <div className="flex items-center justify-end w-2/12">
          <div className="w-full pr-2 mx-2 overflow-hidden text-center bg-white border rounded-md">
            <select
              className="flex justify-between w-full px-4 py-2 text-center focus-visible:outline-none"
              value={
                (table.getColumn("role")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("role")?.setFilterValue(event.target.value)
              }
            >
              <option value="">Role</option>
              <option value="Sales1">Sales1</option>
              <option value="Sales2">Sales2</option>
              <option value="Admin-IA">Admin-IA</option>
            </select>
          </div>
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
          <TableBody className="rounded-0">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <>
                  <TableRow
                    className="border-color-[#E9EFF4] mb-10 overflow-hidden  rounded-md border shadow-md"
                    key={row.id}
                    data-state={row.getIsSelected()}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-1 ">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
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
