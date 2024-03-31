export function recentMostChamp(data) {
    const championCounts = {};
    const championTotalKDA = {};
    const championWin = {};
    const championLose = {}
  
    data.forEach(item => {
      const { championName, win, kda } = item;

      if (!championCounts[championName]) {
        championCounts[championName] = 0;
        championTotalKDA[championName] = 0;
        championWin[championName] = 0;
        championLose[championName] = 0;

      }

      if(win) {
        championWin[championName]++;
      }
      else {
        championLose[championName]++;
      }
  
      championCounts[championName]++;
      championTotalKDA[championName] += kda;
    });

    const mostCommonChampion = Object.keys(championCounts).reduce((a, b) => championCounts[a] > championCounts[b] ? a : b , championCounts[0]);
    let secondMostCommonChampion = null;
    let thirdMostCommonChampion = null;
    Object.keys(championCounts).forEach(championName => {
      if (championName !== mostCommonChampion && (secondMostCommonChampion === null || championCounts[championName] > championCounts[secondMostCommonChampion])) {
        secondMostCommonChampion = championName;
      }
    });
    
    Object.keys(championCounts).forEach(championName => {
      if (championName !== mostCommonChampion && championName !== secondMostCommonChampion && (thirdMostCommonChampion === null || championTotalKDA[championName] > championTotalKDA[thirdMostCommonChampion])) {
        thirdMostCommonChampion = championName;
      }
    });
    
    return [
      {
        championName: mostCommonChampion,
        totalKDA: championTotalKDA[mostCommonChampion],
        win: championWin[mostCommonChampion],
        lose: championLose[mostCommonChampion]
      },
      {
        championName: secondMostCommonChampion,
        totalKDA: championTotalKDA[secondMostCommonChampion],
        win: championWin[secondMostCommonChampion],
        lose: championLose[secondMostCommonChampion]
      },
      {
        championName: thirdMostCommonChampion,
        totalKDA: championTotalKDA[thirdMostCommonChampion],
        win: championWin[thirdMostCommonChampion],
        lose: championLose[thirdMostCommonChampion]
      },
    ].filter(element => element.championName !== null);
  }

export function best3ChampList(data) {
  const championDataMap = {};
  data.forEach(item => {
    const { championName, totalKDA, win, lose } = item;
    if (!championDataMap[championName]) {
      championDataMap[championName] = {
        championName,
        totalKDA: 0,
        win: 0,
        lose: 0
      };
    }
    championDataMap[championName].totalKDA += totalKDA;
    championDataMap[championName].win += win;
    championDataMap[championName].lose += lose;
  });
  const combinedData = Object.values(championDataMap);
  combinedData.sort((a, b) => {
    // 승패의 합이 많은 순서로 정렬, 같을 경우 totalKDA 값 비교
    const result = (b.win + b.lose) - (a.win + a.lose);
    if (result === 0) {
        return b.totalKDA - a.totalKDA;
    }
    return result;
  });
  const firstElement = combinedData[0];
  const secondElement = combinedData.find(item => item.championName !== firstElement.championName);
  const thridElement = combinedData.filter(item => item.championName !== firstElement.championName && item.championName !== secondElement.championName);
  
  return [firstElement, secondElement, ...thridElement.slice(0,1)].filter(element => element !== undefined)

}