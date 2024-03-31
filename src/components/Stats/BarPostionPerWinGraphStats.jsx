import React from 'react'
import { useParams } from 'react-router-dom';
import { ResponsiveBar } from '@nivo/bar'
export default function BarPostionPerWinGraphStats({allMatchList, darkMode}) {
    const {id} = useParams();
    const matchInfo = allMatchList.map(match => (
      {
        win: match.info.participants.filter(participant => participant.riotIdGameName && participant.riotIdGameName.toUpperCase() === id.toUpperCase().split('-')[0]).map(target => target.win).pop(),
        position: match.info.participants.filter(participant => participant.riotIdGameName && participant.riotIdGameName.toUpperCase() === id.toUpperCase().split('-')[0]).map(target =>  target.teamPosition === 'UTILITY' ? 'SUPPORT' : target.teamPosition).pop(),
      }
    )).filter(info => info.position !== '');

    const positionTopWinRate = Math.floor((matchInfo.filter(info => info.position === 'TOP' && info.win === true).length / matchInfo.filter(info => info.position === 'TOP').length) * 100);
    const positionJungleWinRate = Math.floor((matchInfo.filter(info => info.position === 'JUNGLE' && info.win === true).length / matchInfo.filter(info => info.position === 'JUNGLE').length) * 100);
    const positionMiddleWinRate = Math.floor((matchInfo.filter(info => info.position === 'MIDDLE' && info.win === true).length / matchInfo.filter(info => info.position === 'MIDDLE').length) * 100);
    const positionBottomWinRate = Math.floor((matchInfo.filter(info => info.position === 'BOTTOM' && info.win === true).length / matchInfo.filter(info => info.position === 'BOTTOM').length) * 100);
    const positionSupportWinRate = Math.floor((matchInfo.filter(info => info.position === 'SUPPORT' && info.win === true).length / matchInfo.filter(info => info.position === 'SUPPORT').length) * 100);

    const asuumePositionTopData = {position: 'Top', winRate: isNaN(positionTopWinRate) ? 0 : positionTopWinRate};
    const asuumePositionJungleData = {position: 'JG', winRate: isNaN(positionJungleWinRate) ? 0 : positionJungleWinRate};
    const asuumePositionMidData = {position: 'Mid', winRate: isNaN(positionMiddleWinRate) ? 0 : positionMiddleWinRate};
    const asuumePositionBotData = {position: 'Adc', winRate: isNaN(positionBottomWinRate) ? 0 : positionBottomWinRate};
    const asuumePositionSupData = {position: 'Sup', winRate: isNaN(positionSupportWinRate) ? 0 : positionSupportWinRate};
    
    const data = [asuumePositionTopData, asuumePositionJungleData, asuumePositionMidData, asuumePositionBotData, asuumePositionSupData]


  return (
    <div className='w-full h-[380px]'>
      <ResponsiveBar
        data={data}
        keys={['winRate']}
        indexBy="position"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={["#5383E8"]}
        minValue={0}
        maxValue={100}
        padding={0.4}
        margin={{ top: 30, right: 30, bottom: 60, left: 60 }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 12,
            tickRotation: 0,
            // legend: 'country',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 0,
            tickPadding: 12,
            tickRotation: 0,
            // legend: 'food',
            legendPosition: 'middle',
            legendOffset: -40,
            format: (value) => `${value}%`,
            tickValues: [0, 25, 50, 75, 100]
        }}
        labelTextColor="white"
        label={({ value }) => value === 0 ? '' : `${value}%`}
        gridYValues={5}
        theme={       
            {
                "text": {
                    "fontSize": 25,
                },
                "axis": {
                    "ticks": {
                        "text": {
                            "fontSize": 15,
                            "fill": darkMode ? "#ffffff" : "#000000",
                        },
                        "line": {
                            "stroke": darkMode ? "#ffffff" : "#000000",
                            "strokeWidth": 2
                        }
                    },
                    // "legend": {
                    //       "text": {
                    //         "fontSize": 18, // 라벨 텍스트의 글자 크기를 변경
                    //     },
                    // },
                }
            }
        }
      />
    </div>
  )
}
