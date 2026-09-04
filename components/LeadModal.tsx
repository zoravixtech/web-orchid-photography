'use client'

import React, { useState, useEffect, useRef } from 'react'

const LOCAL_STORAGE_KEY = 'orchid_lead_submitted'
const INTERVAL_MS = 10 * 1000 // 10 seconds

export default function LeadModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    // Toast notification state
    const [toast, setToast] = useState<{ show: boolean; message: string }>({
        show: false,
        message: '',
    })

    const [formData, setFormData] = useState({
        eventDate: '',
        name: '',
        email: '',
        mobile: '',
    })

    const [errorMsg, setErrorMsg] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Helper to start recurring 10-second timer
    const startRecurringTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            const alreadySubmitted = localStorage.getItem(LOCAL_STORAGE_KEY) === 'true'
            if (!alreadySubmitted) {
                setIsOpen(true)
            } else {
                if (timerRef.current) clearInterval(timerRef.current)
            }
        }, INTERVAL_MS)
    }

    useEffect(() => {
        const alreadySubmitted = localStorage.getItem(LOCAL_STORAGE_KEY) === 'true'
        if (alreadySubmitted) {
            setIsSubmitted(true)
            return
        }

        // Initial popup on page load after 10 seconds
        const initialTimer = setTimeout(() => {
            const currentCheck = localStorage.getItem(LOCAL_STORAGE_KEY) === 'true'
            if (!currentCheck) {
                setIsOpen(true)
            }
        }, 10000)

        startRecurringTimer()

        return () => {
            clearTimeout(initialTimer)
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [])

    const handleClose = () => {
        setIsOpen(false)
        if (!isSubmitted) {
            startRecurringTimer()
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
        if (errorMsg) setErrorMsg('')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.eventDate) {
            setErrorMsg('Please select your event date.')
            return
        }
        if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim()) {
            setErrorMsg('Please provide your name, email, and mobile number.')
            return
        }

        setIsSubmitting(true)
        setErrorMsg('')

        setTimeout(() => {
            // Store flag in localStorage to prevent modal for this browser
            localStorage.setItem(LOCAL_STORAGE_KEY, 'true')
            setIsSubmitted(true)
            setIsSubmitting(false)
            setIsOpen(false)

            if (timerRef.current) clearInterval(timerRef.current)

            // Show success Toast notification
            setToast({
                show: true,
                message: `Thank you, ${formData.name.trim()}! Your inquiry has been submitted successfully.`,
            })

            // Auto-hide toast after 5.5 seconds
            setTimeout(() => {
                setToast({ show: false, message: '' })
            }, 5500)
        }, 500)
    }

    return (
        <>
            {/* Modal Overlay */}
            {isOpen && !isSubmitted && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md transition-all duration-300 animate-fadeIn"
                    aria-modal="true"
                    role="dialog"
                >
                    {/* Single-step Modal Card */}
                    <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100/80 grid grid-cols-1 md:grid-cols-12 transform transition-all">
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            type="button"
                            className="absolute top-3.5 right-3.5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20 focus:outline-none"
                            aria-label="Close modal"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        {/* LEFT COLUMN: Cover Image with 0 Padding */}
                        <div className="hidden md:block md:col-span-5 relative bg-slate-900 min-h-115">
                            <img
                                src="/login_cover.jpg"
                                alt="The Orchid Photography Cover"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        {/* RIGHT COLUMN: Form Content */}
                        <div className="col-span-12 md:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative bg-white">
                            <div>
                                <h2 className="font-serif text-2xl font-bold text-slate-800 tracking-tight">
                                    Book Your Event Session
                                </h2>
                                <p className="text-slate-500 text-xs mt-1 mb-5">
                                    Provide your details and event date to get in touch with our team.
                                </p>

                                {/* Error Alert */}
                                {errorMsg && (
                                    <div className="mb-4 p-3 rounded-xl text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2">
                                        <svg
                                            className="w-4 h-4 shrink-0 text-rose-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>{errorMsg}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-3.5">
                                    {/* Event Date Selector */}
                                    <div>
                                        <label
                                            htmlFor="event-date"
                                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                                        >
                                            Event Date <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                            <input
                                                id="event-date"
                                                name="eventDate"
                                                type="date"
                                                required
                                                value={formData.eventDate}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Name Field */}
                                    <div>
                                        <label
                                            htmlFor="lead-name"
                                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                                        >
                                            Full Name <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            id="lead-name"
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g. Rahul Sharma"
                                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all placeholder:text-slate-400"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label
                                            htmlFor="lead-email"
                                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                                        >
                                            Email Address <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            id="lead-email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="e.g. rahul@example.com"
                                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all placeholder:text-slate-400"
                                        />
                                    </div>

                                    {/* Mobile Field */}
                                    <div>
                                        <label
                                            htmlFor="lead-mobile"
                                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                                        >
                                            Mobile Number <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            id="lead-mobile"
                                            name="mobile"
                                            type="tel"
                                            required
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            placeholder="e.g. +91 98765 43210"
                                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all placeholder:text-slate-400"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full mt-2 py-3 px-6 rounded-xl font-semibold text-sm text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isSubmitting ? <span>Submitting...</span> : <span>Submit Request</span>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification Banner */}
            {toast.show && (
                <div className="fixed bottom-6 right-6 z-100 max-w-md w-full bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-purple-500/30 flex items-start gap-3.5 animate-bounce-short">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 shrink-0 mt-0.5">
                        <svg
                            className="w-5 h-5 text-emerald-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <div className="grow pr-2">
                        <h4 className="text-sm font-semibold text-purple-200">Inquiry Received!</h4>
                        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
                    </div>
                    <button
                        onClick={() => setToast({ show: false, message: '' })}
                        className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                        aria-label="Close notification"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            )}
        </>
    )
}
