import React from 'react'
import { useParams } from 'react-router-dom';
import { ResponsiveBar } from '@nivo/bar'

export default function BarGraphStats({allMatchList, darkMode}) {
    const {id} = useParams();
    const matchInfo = allMatchList.map(match => (
      {
        win: match.info.participants.filter(participant => participant.riotIdGameName && participant.riotIdGameName === id.toUpperCase().split('-')[0]).map(target => target.win).pop(),
        teamId: match.info.participants.filter(participant => participant.riotIdGameName && participant.riotIdGameName === id.toUpperCase().split('-')[0]).map(target => target.teamId).pop(),
      }
    ));

    const seperateTeamRed = Math.floor((matchInfo.filter(info => info.teamId !== 200 && info.win === true).length / matchInfo.filter(info => info.teamId !== 200).length) * 100);
    const seperateTeamBlue = Math.floor((matchInfo.filter(info => info.teamId === 200 && info.win === true).length / matchInfo.filter(info => info.teamId === 200).length) * 100);

    const teamRedData = {team: 'Red', winRate: isNaN(seperateTeamRed) ? 0 : seperateTeamRed};
    const teamBlueData = {team: 'Blue', winRate: isNaN(seperateTeamBlue) ? 0 : seperateTeamBlue};
    const data = [teamRedData, teamBlueData];
  return (
    <div className='w-full h-[380px]'>
      <ResponsiveBar
        data={data}
        keys={['winRate']}
        indexBy="team"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={['#E84057', "#5383E8"]}
        colorBy="indexValue"
        minValue={0}
        maxValue={100}
        padding={0.3}
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
