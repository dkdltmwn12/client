export function calculationTime(time, type) {
    switch(type) {
        case 'minutes':
            return Math.floor(((time*1000) / 1000 / 60) % 60);
        case 'seconds':
            return Math.floor(((time*1000) / 1000) % 60);
        default:
            return null;
    }
}