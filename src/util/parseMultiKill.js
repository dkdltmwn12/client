export function parseMultiKill(largest) {
    switch(largest) {
        case 0:
            return null;
        case 1:
            return null;
        case 2:
            return '더블킬';
        case 3:
            return '트리플킬';
        case 4:
            return '쿼드라킬';
        case 5:
            return '펜타킬';
        default:
            return null;
    }
}