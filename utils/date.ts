import moment from 'moment-timezone'

export function dateIsPast(time: string): boolean {
  return moment(time).isBefore(moment())
}

export function dateFromNow(time: string): string {
  return moment(time).tz('Asia/Taipei').fromNow()
}

export function dateToISO(time: string): string {
  return moment(time).toISOString(false)
}

export function dateToISOStartOfDay(time: string): string {
  return moment(time).startOf('day').toISOString()
}

export function dateToISOEndOfDay(time: string): string {
  return moment(time).endOf('day').toISOString()
}

export function dateDisplayTimeRemaining(endTime: string): string {
  const isPast = dateIsPast(endTime)
  if (isPast) {
    return dateDisplayYYYYMMDD(endTime)
  }
  return dateDisplayFromNow(endTime)
}

export function dateDisplayYYYYMMDD(time: string): string {
  return moment(time).tz('Asia/Taipei').format('YYYY-MM-DD')
}

export function dateDisplayYYYYMMDDHHMMSS(time: string): string {
  return moment(time).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss')
}

export function dateDisplayFromNow(time: string): string {
  let dateStr = dateFromNow(time).toLowerCase()
  dateStr = dateStr.replace('in', '')
  dateStr = dateStr.concat(' remaining')
  return dateStr
}
