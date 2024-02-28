import {Injectable} from '@angular/core';

enum Month {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12
}

@Injectable({
  providedIn: 'root'
})
export class DatesService {

  constructor() {
  }

  monthToString(month: number): string {
    return Month[month];
  }

  formatTime(time: string[], stringFormat: string = "fileName"): string {
    const [year, month, day, hours, minutes, seconds] = time;
    if (stringFormat === "humanReadable") {
      const monthString = this.monthToString(Number(month));
      return `${day} of ${monthString}, ${year}; ${hours}:${minutes}:${seconds}`
    }
    return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
  }

  getCurrentTime(): string[] {
    const date = new Date();
    // Format the date components separately
    const year = date.getFullYear().toString();
    const monthNumber = (date.getMonth() + 1)
    const month = monthNumber.toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return [year, month, day, hours, minutes, seconds];
  }

  // dateToTimestamp(strDate: string): number {
  //   const datum = Date.parse(strDate);
  //   return datum / 1000;
  // }
  dateToTimestamp(strDateOrArray: string | string[]) {
    if (typeof strDateOrArray === 'string') {
      const datum = Date.parse(strDateOrArray);
      return datum / 1000;
    } else if (Array.isArray(strDateOrArray) && strDateOrArray.length === 6) {
      const [year, month, day, hours, minutes, seconds] = strDateOrArray;
      const datum = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds)).getTime();
      return datum / 1000;
    } else {
      throw new Error('Invalid input format. Please provide either a string or an array [year, month, day, hours, minutes, seconds].');
    }
  }

  timestampToDate(timestamp: number): [string, string, string, string, string, string] {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear().toString();
    const month = ('0' + (date.getMonth() + 1)).slice(-2).toString();
    const day = ('0' + date.getDate()).slice(-2).toString();
    const hours = ('0' + date.getHours()).slice(-2).toString();
    const minutes = ('0' + date.getMinutes()).slice(-2).toString();
    const seconds = ('0' + date.getSeconds()).slice(-2).toString();
    return [year, month, day , hours, minutes, seconds];
  }
}
