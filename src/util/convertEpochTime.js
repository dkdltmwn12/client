export function convertEpochTime(endTime) {
    const currentTime = new Date().getTime()
    const diff = currentTime - endTime
    const seconds = Math.round(diff/ 1000);
    const minutes = Math.round(seconds / 60);
    const hours = minutes / 60;
    const days = hours / 24;

    if (0 < days && days < 1) {
      if(0 < hours && hours < 1) {
        return `${minutes}분 전`
      }
      if(hours < 24) {
        return `${Math.floor(hours)}시간 전`
      }
    }
    if(days > 1) {
      return `${Math.round(days)}일 전`
    } 
}