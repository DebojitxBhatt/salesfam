import Company from "../../../components/company/Company"

export default async function SingleCompany({ params }) {
  const companyName = params?.name.toLowerCase()
  return (
    <div className="min-w-11/12">
      <Company name={companyName} />
    </div>
  )
}
