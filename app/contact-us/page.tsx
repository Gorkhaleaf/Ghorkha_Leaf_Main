// app/contact-us/page.tsx
"use client"

import { Header } from "@/components/Header"
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }
    
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setSubmitStatus('error')
        console.error('Error:', result.error)
      }
    } catch (error) {
      setSubmitStatus('error')
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      
      {/* Hero Section with Background - Moved down by 32px */}
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100" style={{ marginTop: '32px' }}>
        {/* Background Images */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/80"></div>
          <img 
            src="https://images.unsplash.com/photo-1563822249366-4c4d5acf6fb1?q=80&w=2070&auto=format&fit=crop"
            alt="Tea plantation background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        {/* Floating Tea Leaves Animation */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="floating-leaf leaf-1 text-[#2d7247]">🍃</div>
          <div className="floating-leaf leaf-2 text-[#2d7247]">🍃</div>
          <div className="floating-leaf leaf-3 text-[#2d7247]">🍃</div>
          <div className="floating-leaf leaf-4 text-[#2d7247]">🍃</div>
          <div className="floating-leaf leaf-5 text-[#2d7247]">🍃</div>
        </div>

        {/* Content */}
        <div className="relative z-20 pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            
            {/* Header Section - Main title stays black */}
            <div className="text-center mb-16">
              <h1 className="text-6xl md:text-7xl font-bold text-black mb-6 tracking-tight">
                Get In 
                <span className="text-[#2d7247]">
                  {" "}Touch
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-[#2d7247] max-w-3xl mx-auto leading-relaxed">
                Connect with the heart of Darjeeling's finest tea gardens. 
                We're here to brew the perfect conversation with you.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              
              {/* Left Side - Tea Info Cards */}
              <div className="space-y-6">
                
                {/* Tea Experience Card */}
                <div className="glass-card p-8 rounded-3xl backdrop-blur-xl bg-white/40 border border-gray-200 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2d7247] to-[#1f5f3f] flex items-center justify-center text-2xl">
                      🍵
                    </div>
                    <div className="ml-6">
                      <h3 className="text-2xl font-bold text-black">Premium Tea Experience</h3>
                      <p className="text-[#2d7247] font-medium">Direct from Darjeeling gardens</p>
                    </div>
                  </div>
                  <p className="text-[#2d7247] leading-relaxed">
                    Experience the authentic taste of Darjeeling tea, carefully crafted by generations 
                    of tea masters in the misty hills of the Himalayas.
                  </p>
                </div>

                {/* Contact Info Card */}
                <div className="glass-card p-8 rounded-3xl backdrop-blur-xl bg-white/40 border border-gray-200 shadow-2xl">
                  <h3 className="text-2xl font-bold text-black mb-6">Reach Out to Us</h3>
                  <div className="space-y-4">
                    <div className="flex items-center text-[#2d7247]">
                      <span className="text-2xl mr-4">📧</span>
                      <span className="text-lg">gorkhaleaf@gmail.com</span>
                    </div>
                    <div className="flex items-center text-[#2d7247]">
                      <span className="text-2xl mr-4">🌍</span>
                      <span className="text-lg">Darjeeling, West Bengal, India</span>
                    </div>
                    <div className="flex items-center text-[#2d7247]">
                      <span className="text-2xl mr-4">⏰</span>
                      <span className="text-lg">Response within 24-48 hours</span>
                    </div>
                  </div>
                </div>

                {/* Tea Image */}
                <div className="glass-card rounded-3xl backdrop-blur-xl bg-white/40 border border-gray-200 shadow-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=2067&auto=format&fit=crop"
                    alt="Premium tea cups"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="glass-card p-10 rounded-3xl backdrop-blur-xl bg-white/60 border border-gray-200 shadow-2xl">
                
                {submitStatus === 'success' && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-[#2d7247]/10 to-[#2d7247]/15 border border-[#2d7247]/30 text-[#2d7247] rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">✨</span>
                      <div>
                        <h4 className="font-semibold text-lg text-black">Message Sent Successfully!</h4>
                        <p className="text-sm text-[#2d7247]">We'll get back to you soon. Check your email for confirmation.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-400/30 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">⚠️</span>
                      <div>
                        <h4 className="font-semibold text-lg text-black">Oops! Something went wrong</h4>
                        <p className="text-sm text-red-600">Please try again later or contact us directly.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-lg font-semibold text-black">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full py-4 px-6 rounded-2xl backdrop-blur-sm bg-white/50 border-2 ${
                        errors.name ? 'border-red-400' : 'border-gray-200'
                      } text-[#2d7247] placeholder-[#2d7247]/60 focus:outline-none focus:border-[#2d7247] focus:ring-4 focus:ring-[#2d7247]/20 transition-all duration-300`}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm flex items-center">
                        <span className="mr-2">⚠️</span>{errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-lg font-semibold text-black">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className={`w-full py-4 px-6 rounded-2xl backdrop-blur-sm bg-white/50 border-2 ${
                        errors.email ? 'border-red-400' : 'border-gray-200'
                      } text-[#2d7247] placeholder-[#2d7247]/60 focus:outline-none focus:border-[#2d7247] focus:ring-4 focus:ring-[#2d7247]/20 transition-all duration-300`}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm flex items-center">
                        <span className="mr-2">⚠️</span>{errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-lg font-semibold text-black">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your tea preferences, questions, or how we can help you..."
                      className={`w-full py-4 px-6 rounded-2xl backdrop-blur-sm bg-white/50 border-2 ${
                        errors.message ? 'border-red-400' : 'border-gray-200'
                      } text-[#2d7247] placeholder-[#2d7247]/60 focus:outline-none focus:border-[#2d7247] focus:ring-4 focus:ring-[#2d7247]/20 transition-all duration-300 resize-none`}
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-600 text-sm flex items-center">
                        <span className="mr-2">⚠️</span>{errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 ${
                      isSubmitting 
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-[#2d7247] to-[#1f5f3f] hover:from-[#1f5f3f] hover:to-[#1a4d35] text-white shadow-lg hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]'
                    } backdrop-blur-sm border border-gray-200`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Brewing your message...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Send Message
                        <span className="ml-3 text-xl">🚀</span>
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Custom Styles */}
      <style jsx>{`
        .glass-card {
          transition: all 0.3s ease;
        }
        
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }

        .floating-leaf {
          position: absolute;
          font-size: 2rem;
          opacity: 0.4;
          animation: float 6s ease-in-out infinite;
        }

        .leaf-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .leaf-2 {
          top: 20%;
          right: 15%;
          animation-delay: 1s;
        }

        .leaf-3 {
          top: 60%;
          left: 20%;
          animation-delay: 2s;
        }

        .leaf-4 {
          top: 70%;
          right: 25%;
          animation-delay: 3s;
        }

        .leaf-5 {
          top: 40%;
          left: 50%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #2d7247;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #1f5f3f;
        }
      `}</style>
    </>
  )
}
