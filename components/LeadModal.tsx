"use client";

import React, { useState, useEffect, useRef } from "react";

const LOCAL_STORAGE_KEY = "orchid_lead_submitted";
const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export default function LeadModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    
    // Toast notification state
    const [toast, setToast] = useState<{ show: boolean; message: string }>({
        show: false,
        message: "",
    });

    const [formData, setFormData] = useState({
        eventDate: "",
        service: "wedding photoshoot",
        requirements: "",
        name: "",
        email: "",
        mobile: "",
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Helper to start recurring 5-minute timer
    const startRecurringTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            const alreadySubmitted = localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
            if (!alreadySubmitted) {
                setIsOpen(true);
            } else {
                if (timerRef.current) clearInterval(timerRef.current);
            }
        }, INTERVAL_MS);
    };

    useEffect(() => {
        const alreadySubmitted = localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
        if (alreadySubmitted) {
            setIsSubmitted(true);
            return;
        }

        // Initial popup on page load
        const initialTimer = setTimeout(() => {
            const currentCheck = localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
            if (!currentCheck) {
                setIsOpen(true);
            }
        }, 1200);

        startRecurringTimer();

        return () => {
            clearTimeout(initialTimer);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        if (!isSubmitted) {
            startRecurringTimer();
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (errorMsg) setErrorMsg("");
    };

    // Step 1 Submission -> Go to Step 2
    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.eventDate) {
            setErrorMsg("Please select your event date.");
            return;
        }
        if (!formData.service) {
            setErrorMsg("Please select a service.");
            return;
        }
        setErrorMsg("");
        setStep(2);
    };

    // Final Step 2 Submission -> Store LocalStorage & Trigger Toast
    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim()) {
            setErrorMsg("Please provide your name, email, and mobile number.");
            return;
        }

        setIsSubmitting(true);
        setErrorMsg("");

        setTimeout(() => {
            // Store flag in localStorage to prevent modal for this browser
            localStorage.setItem(LOCAL_STORAGE_KEY, "true");
            setIsSubmitted(true);
            setIsSubmitting(false);
            setIsOpen(false);

            if (timerRef.current) clearInterval(timerRef.current);

            // Show success Toast notification
            setToast({
                show: true,
                message: `Thank you, ${formData.name.trim()}! Your inquiry for ${formData.service} has been submitted successfully.`,
            });

            // Auto-hide toast after 5 seconds
            setTimeout(() => {
                setToast({ show: false, message: "" });
            }, 5500);
        }, 500);
    };

    return (
        <>
            {/* Modal Overlay */}
            {isOpen && !isSubmitted && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md transition-all duration-300 animate-fadeIn"
                    aria-modal="true"
                    role="dialog"
                >
                    {/* Multi-step Modal Card */}
                    <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100/80 grid grid-cols-1 md:grid-cols-12 transform transition-all">
                        
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            type="button"
                            className="absolute top-3.5 right-3.5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20 focus:outline-none"
                            aria-label="Close modal"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* LEFT COLUMN: Cover Image with 0 Padding */}
                        <div className="hidden md:block md:col-span-5 relative bg-slate-900 min-h-[460px]">
                            <img
                                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop"
                                alt="Orchid Photography Wedding"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Dark Gradient Overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-6 text-white">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/70 backdrop-blur-md text-[11px] font-semibold text-purple-100 tracking-wider uppercase mb-2.5 w-max border border-purple-400/30">
                                    ✨ Premium Photography
                                </div>
                                <h3 className="font-serif text-xl font-bold leading-tight">
                                    Capture Every Precious Ritual
                                </h3>
                                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                                    Get personalized wedding quotes and exclusive packages tailored to your special date.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Form Content */}
                        <div className="col-span-12 md:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative bg-white">
                            <div>
                                {/* Step Indicator Banner */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                                        Step {step} of 2: {step === 1 ? "Event Details" : "Contact Info"}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? "w-6 bg-purple-600" : "w-2 bg-purple-200"}`} />
                                        <div className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? "w-6 bg-purple-600" : "w-2 bg-purple-200"}`} />
                                    </div>
                                </div>

                                <h2 className="font-serif text-2xl font-bold text-slate-800 tracking-tight">
                                    {step === 1 ? "Book Your Event Session" : "Where Should We Send Your Quote?"}
                                </h2>
                                <p className="text-slate-500 text-xs mt-1 mb-5">
                                    {step === 1 
                                        ? "Select your date and preferred service to get started." 
                                        : "Provide your details so our photography team can get in touch."}
                                </p>

                                {/* Error Alert */}
                                {errorMsg && (
                                    <div className="mb-4 p-3 rounded-xl text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2">
                                        <svg className="w-4 h-4 shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{errorMsg}</span>
                                    </div>
                                )}

                                {/* STEP 1 FORM */}
                                {step === 1 && (
                                    <form onSubmit={handleNextStep} className="space-y-4">
                                        {/* Event Date Selector */}
                                        <div>
                                            <label htmlFor="event-date" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Event Date <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

                                        {/* Services Dropdown Select */}
                                        <div>
                                            <label htmlFor="service-select" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Services <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    </svg>
                                                </div>
                                                <select
                                                    id="service-select"
                                                    name="service"
                                                    required
                                                    value={formData.service}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-8 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="pre-wedding photoshoot">Pre-Wedding Photoshoot</option>
                                                    <option value="wedding photoshoot">Wedding Photoshoot</option>
                                                    <option value="others">Others</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Requirements Field */}
                                        <div>
                                            <label htmlFor="requirements" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Requirements / Notes
                                            </label>
                                            <input
                                                id="requirements"
                                                name="requirements"
                                                type="text"
                                                value={formData.requirements}
                                                onChange={handleChange}
                                                placeholder="e.g. Destination venue, candid cinematic film..."
                                                className="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all placeholder:text-slate-400"
                                            />
                                        </div>

                                        {/* Step 1 Submit Button */}
                                        <button
                                            type="submit"
                                            className="w-full mt-3 py-3 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-2"
                                        >
                                            <span>Next Step: Contact Info</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </form>
                                )}

                                {/* STEP 2 FORM */}
                                {step === 2 && (
                                    <form onSubmit={handleFinalSubmit} className="space-y-3.5">
                                        {/* Name Field */}
                                        <div>
                                            <label htmlFor="lead-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
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
                                            <label htmlFor="lead-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
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
                                            <label htmlFor="lead-mobile" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
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

                                        {/* Form Action Buttons */}
                                        <div className="flex items-center gap-2.5 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="py-3 px-4 rounded-xl font-semibold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                            >
                                                Back
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="grow py-3 px-5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? (
                                                    <span>Submitting...</span>
                                                ) : (
                                                    <span>Submit Request</span>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Toast Notification Banner */}
            {toast.show && (
                <div className="fixed bottom-6 right-6 z-[100] max-w-md w-full bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-purple-500/30 flex items-start gap-3.5 animate-bounce-short">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="grow pr-2">
                        <h4 className="text-sm font-semibold text-purple-200">Inquiry Received!</h4>
                        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                            {toast.message}
                        </p>
                    </div>
                    <button
                        onClick={() => setToast({ show: false, message: "" })}
                        className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                        aria-label="Close notification"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
}
