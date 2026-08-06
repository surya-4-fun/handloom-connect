import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react'
import { Link } from 'react-router-dom'

interface BaseProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'cyan' | 'gold'
  className?: string
  style?: CSSProperties
}

export function ButtonLink({ to, children, variant = 'primary', className = '', style }: BaseProps & { to: string }) {
  return <Link to={to} className={`button button--${variant} ${className}`} style={style}>{children}</Link>
}

export function Button({ children, variant = 'primary', className = '', style, ...props }: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`button button--${variant} ${className}`} style={style} {...props}>{children}</button>
}
