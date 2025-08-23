"use client"
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon?: string
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home' },
  { id: 'my-story', label: 'My Story' },
  { id: 'mission-vision', label: 'Mission & Vision' },
  { id: 'values', label: 'Core Values' },
  { id: 'gorkha-leaf-name', label: 'Why Gorkha Leaf' },
  { id: 'impact', label: 'Our Impact' },
  { id: 'newsletter', label: 'Stay Connected' }
]

export function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id))
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 100
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Menu Button */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-brand-green text-white p-3 rounded-full shadow-lg hover:bg-brand-green/90 transition-all duration-300 hover:scale-110"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Navigation Menu */}
      <div className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-30 transition-all duration-300 ${
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-16 opacity-0 pointer-events-none'
      }`}>
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-2 mr-16">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-brand-green text-white shadow-md'
                    : 'text-gray-700 hover:bg-brand-green/10 hover:text-brand-green'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}