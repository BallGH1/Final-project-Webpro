import { Link } from 'react-router-dom'

const VARIANTS = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-stone-600 hover:bg-stone-100',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base',
}

/** ปุ่มกลางของระบบ — ใส่ `to` เพื่อให้กลายเป็นลิงก์ของ React Router */
export default function Button({ variant = 'primary', size = 'md', to, className = '', ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors ${VARIANTS[variant]} ${SIZES[size]} ${className}`
  if (to) return <Link to={to} className={classes} {...props} />
  return <button type="button" className={classes} {...props} />
}
