const moneyFormat = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 2,
})

const timeFormat = new Intl.DateTimeFormat('th-TH', {
  timeZone: 'Asia/Bangkok',
  hour: '2-digit',
  minute: '2-digit',
})

const dateTimeFormat = new Intl.DateTimeFormat('th-TH', {
  timeZone: 'Asia/Bangkok',
  dateStyle: 'medium',
  timeStyle: 'short',
})

export const formatMoney = (value) => moneyFormat.format(value)
export const formatTime = (iso) => timeFormat.format(new Date(iso))
export const formatDateTime = (iso) => dateTimeFormat.format(new Date(iso))
