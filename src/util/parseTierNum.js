export function parseTierNum(rank) {
    switch(rank) {
        case 'I':
            return 1
        case 'II':
            return 2
        case 'III':
            return 3
        case 'IV':
            return 4
        default:
            return null;
    }
}