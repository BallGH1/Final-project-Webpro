import { Link } from 'react-router-dom'

// ใช้ class ปุ่มของ DaisyUI (Lab 11)
const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-outline border-base-300 bg-base-100 hover:bg-base-200',
  danger: 'btn-error',
  ghost: 'btn-ghost',
}

// มือถือ: ปุ่มเล็กยังสูงอย่างน้อย 44px ให้นิ้วกดง่าย (จอใหญ่ใช้เมาส์ จึงเล็กได้)
const SIZES = {
  sm: 'btn-sm max-sm:min-h-11',
  md: '',
  lg: 'btn-lg',
}

/** ปุ่มกลางของระบบ — ใส่ `to` เพื่อให้กลายเป็นลิงก์ของ React Router */
export default function Button({ variant = 'primary', size = 'md', to, className = '', ...props }) {
  const classes = `btn ${VARIANTS[variant]} ${SIZES[size]} ${className}`
  if (to) return <Link to={to} className={classes} {...props} />
  return <button type="button" className={classes} {...props} />
}
