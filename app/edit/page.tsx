"use client"

import React, { useEffect, useState } from "react"

export default function ProjectDetails({ params }) {
  const slug = params.slug
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/project/?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const project = data.project
        setData(project)
        setLoading(false)
      })
    // eslint-disable-next-line
  }, [])

  if (isLoading) {
    return (
      <div className="container min-w-11/12">
        <h1 className="mt-10 text-2xl text-center">loading...</h1>
      </div>
    )
  }

  if (!data) return <p>No project data</p>
  return (
    <>
      <div className="container">
        <h1>{data.projectName}</h1>
        <h1>{data.projectDetails}</h1>
        <h1>{data.budget}</h1>
        <h1>{data.commisson_rate}</h1>
        <h1>{data.dateSigned}</h1>
        <h1>{data.status}</h1>
        <h1>{data.clientName}</h1>
        <h1>{data.email}</h1>
        <h1>{data.phone}</h1>
        <h1>{data.address}</h1>
      </div>
    </>
  )
}
