"use client"

import React from "react"
import Link from "next/link"

export default function toolkitMenu() {
  return (
    <div className="relative">
      <div className="absolute w-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
        <svg
          viewBox="0 0 439 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H104.531C106.327 0.5 108.063 1.14428 109.424 2.31575L124.674 15.4422C126.216 16.7698 128.184 17.5 130.219 17.5H431C435.142 17.5 438.5 20.8579 438.5 25V60C438.5 64.1421 435.142 67.5 431 67.5H8C3.85786 67.5 0.5 64.1421 0.5 60V8Z"
            fill="#fff"
            stroke="#E8E7EA"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="relative mb-1 ml-3 text-xs text-left text-black">
          Sales Toolkit
        </span>
        <ul className="relative mx-2 flex items-center [&>li]:mx-1 [&>li]:rounded-md [&>li]:bg-[#F2F2F2] [&>li]:px-2 [&>li]:py-1 [&>li]:text-[12px] [&>li]:transition hover:[&>li]:bg-[#dfdfdf]">
          <li>
            <Link className="flex items-center" href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  color="#878790"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              <span className="pl-1 text-black">Email Signature</span>
            </Link>
          </li>
          <li>
            <Link className="flex items-center" href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  color="#878790"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <span className="pl-1 text-black">Email Setup</span>
            </Link>
          </li>
          <li>
            <Link className="flex items-center" href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  color="#878790"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="pl-1 text-black">Pricing</span>
            </Link>
          </li>
          <li>
            <Link className="flex items-center" href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  color="#878790"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
              <span className="pl-1 text-black">Website</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
