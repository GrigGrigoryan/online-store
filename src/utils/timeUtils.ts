import moment from 'moment';

export function secondsToMinutes(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return minutes + secs / 60;
}

export function toUTC(date: Date | null = null) {
  return moment.utc(date || new Date());
}

// export function localToUTC(date: Date | null = null) {
//   date.setMinutes(date.getMinutes() + moment(date).utcOffset());
//   return date;
// }

export function getReportDateFormat() {
  return moment().format('YYYY.M.D');
}
