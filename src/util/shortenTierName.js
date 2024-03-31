export function shortenTierName(tier) {
    switch(tier) {
        case 'CHALLENGER':
            return 'C'
        case 'GRANDMASTER':
            return 'GM'
        case 'MASTER':
            return 'M'
        case 'DIAMOND':
            return 'D'
        case 'EMERALD':
            return 'E'
        case 'PLATINUM':
            return 'P'
        case 'GOLD':
            return 'G'
        case 'SILVER':
            return 'S'
        case 'BRONZE':
            return 'B'
        case 'IRON':
            return 'I'
        default:
            return null;
    }
}