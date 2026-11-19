export default function SearchBar({ value, onChange, placeholder = 'ค้นหาเมนู...' }) {
  return (
    <div className="relative">
      <label htmlFor="menu-search" className="sr-only">
        ค้นหาเมนู
      </label>
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">🔍</span>
      <input
        id="menu-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  )
}
