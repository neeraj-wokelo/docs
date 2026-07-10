"use client"

import { useState } from "react"

export const ContactForm =({ onThankYouStatusChange }) => {
    const industryList = [
  "Academia",
  "Accelerator / Incubator",
  "Asset Manager",
  "Corporate Strategy",
  "Corporate Venture Capital",
  "Family Office",
  "Fund of Funds",
  "Hedge Funds",
  "Investment Banking",
  "Management Consulting",
  "Private Equity",
  "Startup",
  "Venture Capital (pre-seed / seed)",
  "Venture Capital (series A+)",
  "Venture Debt",
  "Others",
]

const inputStyle = (error) => ({
  width: "100%",
  height: "48px",
  marginBottom: "12px",
  padding: "12px",
  borderRadius: "8px",
  background: "#21262D",
  color: "white",
  border: error ? "2px solid #ef4444" : "none",
  outline: "none",
})

const Error = ({ text }) => (
  <div style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>
    {text}
  </div>
)

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    company: "",
    industry: "",
    useCase: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const err = {}

    if (!formData.email) err.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      err.email = "Invalid email"

    if (!formData.name) err.name = "Name is required"
    if (!formData.company) err.company = "Company is required"

    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)

    const payload = {
      username: formData.email,
      firstname: formData.name.split(" ")[0],
      lastname: formData.name.split(" ").slice(1).join(" "),
      organisation: formData.company,
      industry: formData.industry,
      usecase: formData.useCase,
      source: "akta-pro-docs",
      country_code: "",
      phone_number: "",
    }

    try {
      const res = await fetch(
        "https://request-access.azurewebsites.net/api/create-or-update-deal/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) throw new Error()

      setSubmitted(true)
      onThankYouStatusChange?.(true)

      setFormData({
        email: "",
        name: "",
        company: "",
        industry: "",
        useCase: "",
      })
    } catch {
      setErrors({ submit: "Something went wrong. Try again." })
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center" style={{ textAlign: "center", padding: "60px 20px" }}>
        <h3 className="text-gray-900 dark:text-white">Thank you!</h3>
        <p className="text-gray-600 dark:text-gray-300">
          We'll reach out shortly.
        </p>
      </div>
    )
  }

  return (
    <div className="md:px-10 md:py-11 md:bg-gray-100 md:dark:bg-[#181B20] md:border-[0.5px] md:border-gray-200 dark:md:border-[#494F56] rounded-[12px]">
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="mb-3 md:mb-5">
          <input
            name="email"
            type="email"
            placeholder="Business email address *"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className={`bg-white dark:bg-[#21262D] h-12 w-full rounded-lg px-3 py-4 text-base md:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-muted-foreground shadow-sm dark:shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${errors.email ? 'ring-2 ring-red-500' : ''}`}
          />
          {errors.email && (
            <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
              {errors.email}
            </div>
          )}
        </div>

        {/* Name */}
        <div className="mb-3 md:mb-5">
          <input
            name="name"
            placeholder="Name *"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            className={`bg-white dark:bg-[#21262D] h-12 w-full rounded-lg px-3 py-4 text-base md:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-muted-foreground shadow-sm dark:shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${errors.name ? 'ring-2 ring-red-500' : ''}`}
          />
          {errors.name && (
            <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
              {errors.name}
            </div>
          )}
        </div>

        {/* Company */}
        <div className="mb-3 md:mb-5">
          <input
            name="company"
            placeholder="Company name *"
            value={formData.company}
            onChange={handleChange}
            required
            disabled={isLoading}
            className={`bg-white dark:bg-[#21262D] h-12 w-full rounded-lg px-3 py-4 text-base md:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-muted-foreground shadow-sm dark:shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${errors.company ? 'ring-2 ring-red-500' : ''}`}
          />
          {errors.company && (
            <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
              {errors.company}
            </div>
          )}
        </div>

        {/* Industry */}
        <div className="mb-3 md:mb-5 relative">
          <select
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            disabled={isLoading}
            className={`bg-white dark:bg-[#21262D] h-12 w-full rounded-lg pl-3 pr-10 py-3 text-base md:text-sm shadow-sm dark:shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer ${!formData.industry ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}
          >
            <option value="" disabled selected hidden>Industry</option>
            {industryList.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <svg className="cheveron-svg absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        {/* Use case */}
        <div className="mb-4 md:mb-8">
          <input
            name="useCase"
            placeholder="Describe use case"
            value={formData.useCase}
            onChange={handleChange}
            disabled={isLoading}
            className="bg-white dark:bg-[#21262D] h-12 w-full rounded-lg px-3 py-4 text-base md:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-muted-foreground shadow-sm dark:shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {errors.submit && (
          <div style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="wk-footer-links inline-flex items-center justify-center gap-2 whitespace-nowrap rounded transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-black text-white dark:bg-white dark:text-black py-2 font-semibold text-[16px] cursor-pointer hover:bg-neutral-800 dark:hover:bg-gray-100 focus-within:bg-neutral-800 dark:focus-within:bg-gray-100 active:bg-neutral-700 dark:dark:active:bg-gray-200 h-10 px-6 has-[>svg]:px-4 w-full mb-4"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </>
          ) : (
            "Request API Demo"
          )}
        </button>

         <span className="text-gray-500 dark:text-white/70 max-md:text-xs">
          By clicking "Request API access, you agree to akta.pro's{" "}
          <a className="underline" href="https://akta.pro/legal?tab=privacy">
            Privacy Policy
          </a>{" "} and
           <a className="underline" href="https://akta.pro/legal?tab=terms">
            Terms And Conditions 
          </a
          and consent to receive product updates and insights.
        </span>
      </form>
    </div>
  )
}
