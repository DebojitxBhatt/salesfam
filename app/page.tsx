import { Suspense } from "react"

import ReferralComp from "@/components/ReferralComp"
import Clients from "@/components/landing/Clients"
import Help from "@/components/landing/Help"
import Hero from "@/components/landing/Hero"
import Pricing from "@/components/landing/Pricing"
import ProfileSlider from "@/components/landing/ProfileSlider"
import Software from "@/components/landing/Software"
import Success from "@/components/landing/Success"
import Footer from "@/components/landing/common/Footer"
import Header from "@/components/landing/common/Header"

export default function IndexPage() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ReferralComp />
      </Suspense>
        <Header />
      <Hero />
      <Clients />
      <Help />
      <Software />
      <Success />
      <Pricing />
      <ProfileSlider />
      <Footer />
    </>
  )
}
