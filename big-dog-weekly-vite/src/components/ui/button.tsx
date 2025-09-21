import * as React from 'react'
import { cn } from './utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary'
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-400',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-300',
  }
  return <button className={cn(base, variants[variant], className)} {...props} />
}
