"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8 mt-4">Menu</h2>
          <nav className="space-y-4">
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </>
  )
}
