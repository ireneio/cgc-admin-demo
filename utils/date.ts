export class DateFactory {
  constructor(date: Date) {
    this.date = date
  }

  private date: Date

  private static constructDate(year: string, month: string, date: string): string {
    if(month.length === 1) {
      month = '0'.concat(month)
    }
    if(date.length === 1) {
      date = '0'.concat(date)
    }
    return `${year}-${month}-${date}`
  }

  private static constructTime(dateObj: Date, isSeconds?: boolean): string {
    let t
    if(isSeconds) {
      t = dateObj.toLocaleDateString('en-us', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }).split(',')[1]
    } else {
      t = dateObj.toLocaleDateString('en-us', {
        hour: 'numeric',
        minute: 'numeric'
      }).split(',')[1]
    }
    return t
  }

  public yymmdd(): string {
    const dArr = this.date.toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).split('/')

    return DateFactory.constructDate(dArr[2], dArr[0], dArr[1])
  }

  private withTimeHelper(isSeconds: boolean): string {
    const dArr = this.date.toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).split('/')
    const d = DateFactory.constructDate(dArr[2], dArr[0], dArr[1])
    const t = DateFactory.constructTime(this.date, isSeconds)
    return `${d},${t}`
  }

  public yymmddhhmmss(): string {
    return this.withTimeHelper(true)
  }

  public yymmddhhmm(): string {
    return this.withTimeHelper(false)
  }
}
