// เสียงแจ้งเตือนสั้น ๆ ด้วย Web Audio API (มากับ browser ไม่ต้องใช้ไฟล์เสียง) + สั่นบนมือถือที่รองรับ
// browser บางตัวจะเล่นเสียงได้หลังผู้ใช้แตะหน้าจอแล้วอย่างน้อย 1 ครั้ง — ถ้าเล่นไม่ได้ก็ข้ามไปเฉย ๆ
let audioContext = null

/** @param {'error' | 'info'} type error = เสียงต่ำยาว (ยกเลิก), info = เสียงสูงสั้น */
export function playAlertSound(type = 'info') {
  try {
    audioContext ??= new AudioContext()
    const now = audioContext.currentTime
    const duration = type === 'error' ? 0.5 : 0.25

    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    oscillator.frequency.value = type === 'error' ? 330 : 880
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)
    oscillator.connect(gain).connect(audioContext.destination)
    oscillator.start(now)
    oscillator.stop(now + duration)

    navigator.vibrate?.(type === 'error' ? [200, 100, 200] : 150)
  } catch {
    // ไม่มีเสียงก็ยังเห็น popup ได้ตามปกติ
  }
}
