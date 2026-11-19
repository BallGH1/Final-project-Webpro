import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'ค้นหาเมนู...' }) {
  return (
    <label className="input w-full bg-base-100">
      <span className="sr-only">ค้นหาเมนู</span>
      <Search size={18} className="opacity-50" aria-hidden="true" />
      <input
        id="menu-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="grow"
      />
    </label>
  )
}
