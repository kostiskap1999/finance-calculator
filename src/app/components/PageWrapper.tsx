"use client"

import React, { ReactNode } from 'react'

interface PageWrapperProps {
  loading: boolean
  error?: string | boolean | null
  children: ReactNode
  className?: string
}

export default function PageWrapper({ loading, error, children, className = '' }: PageWrapperProps) {
  const baseClass = `min-h-screen bg-[var(--background)] text-[var(--foreground)] ${className}`.trim()

  if (loading) {
    return (
      <div className={`${baseClass} flex items-center justify-center`}>
        <div className="text-(--muted)">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${baseClass} flex items-center justify-center`}>
        <div className="text-(--accent-glow)">{error}</div>
      </div>
    )
  }

  return <div className={baseClass}>{children}</div>
}
