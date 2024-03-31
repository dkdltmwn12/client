import  runesData from './runesReforged.json'

export function getRune(runeId) {
    const modifiedRunes = {};
    for(const main of runesData) {
        modifiedRunes[main.id] = {'name': main.name, 'icon': main.icon};
    
        for(const details of main.slots[0].runes) {
            modifiedRunes[details.id] = {'name': details.name, 'description': details.longDesc, 'icon': details.icon};
        }
    }
    return modifiedRunes[runeId]
}

