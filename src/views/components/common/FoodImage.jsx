import { useState } from 'react'
import FoodIcon from './FoodIcon'
import { menuPhotoUrl } from './menuPhotos'

/**
 * รูปอาหาร — ถ้าเมนูมีรูปจริงจะแสดงรูป ถ้าไม่มี (เช่น เมนูที่พนักงานเพิ่มใหม่) หรือโหลดรูปไม่ได้ จะแสดงไอคอนแทน
 * `className` กำหนดขนาด/มุมโค้งของกล่อง, `iconSize` คือขนาดไอคอนตอนไม่มีรูป
 */
export default function FoodImage({ name, emoji, categoryId, className = '', iconSize = 24 }) {
  const src = menuPhotoUrl(name)
  const [failedSrc, setFailedSrc] = useState(null)

  if (!src || failedSrc === src) {
    return <FoodIcon emoji={emoji} categoryId={categoryId} size={iconSize} className={className} />
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={`shrink-0 bg-base-200 object-cover ${className}`}
    />
  )
}
