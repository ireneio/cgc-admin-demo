import moment from 'moment'

export function dateIsPast(time: string): boolean {
  return moment(time).isBefore(moment())
}

export function dateFromNow(time: string): string {
  return moment(time).local().fromNow()
}

export function dateDisplayTimeRemaining(endTime: string): string {
  const isPast = dateIsPast(endTime)
  if (isPast) {
    return dateDisplayYYYYMMDD(endTime)
  }
  return dateDisplayFromNow(endTime)
}

export function dateDisplayYYYYMMDD(time: string): string {
  return moment(time).local().format('YYYY-MM-DD')
}

export function dateDisplayYYYYMMDDHHMMSS(time: string): string {
  return moment(time).local().format('YYYY-MM-DD HH:mm:ss')
}

export function dateDisplayFromNow(time: string): string {
  let dateStr = dateFromNow(time).toLowerCase()
  dateStr = dateStr.replace('in', '')
  dateStr = dateStr.concat(' remaining')
  return dateStr
}
