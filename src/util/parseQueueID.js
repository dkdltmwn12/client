export function parseQueueID(queueId) {
    switch(queueId) {
        case 420:
            return '솔로랭크'
        case 490:
            return '빠른 대전'
        case 440:
            return '자유랭크'
        case 450:
            return '무작위 총력전'            
        default:
            return null;
    } 
}