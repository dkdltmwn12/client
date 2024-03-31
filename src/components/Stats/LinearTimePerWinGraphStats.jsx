import React from 'react'
import {ResponsiveLine} from '@nivo/line'
import { useParams } from 'react-router-dom';
import { calculationTime } from '../../util/calculationTime';


export default function LinearTimePerWinGraphStats({allMatchList, darkMode}) {
  const {id} = useParams();
  const matchInfo = allMatchList.map(match => (
    {
      playTime : calculationTime(match.info.gameDuration, 'seconds'),
      win: match.info.participants.filter(participant => participant.riotIdGameName && participant.riotIdGameName.toUpperCase() === id.toUpperCase().split('-')[0]).map(target => target.win).pop(),
      teamId: match.info.participants.filter(participant => participant.riotIdGameName && participant.riotIdGameName.toUpperCase() === id.toUpperCase().split('-')[0]).map(target => target.teamId).pop(),
    }
  ));

  const matchTimeUnder20WinRate = Math.floor((matchInfo.filter(info => info.playTime < 20 && info.win === true).length / matchInfo.filter(info => info.playTime < 20).length) * 100);
  const matchTime20to30WinRate = Math.floor((matchInfo.filter(info => info.playTime > 20 && info.playTime < 30 && info.win === true).length / matchInfo.filter(info => info.playTime > 20 && info.playTime < 30).length) * 100);
  const matchTime30to40WinRate = Math.floor((matchInfo.filter(info => info.playTime > 30 && info.playTime < 40 && info.win === true).length / matchInfo.filter(info => info.playTime > 30 && info.playTime < 40).length) * 100)
  const matchTimeOver40WinRate = Math.floor((matchInfo.filter(info => info.playTime > 40 && info.win === true).length / matchInfo.filter(info => info.playTime > 40).length) * 100)
  
  
  const matchTimeUnder20Data = {x : '0-20', y : matchTimeUnder20WinRate};
  const matchTime20to30Data = {x : '20-30', y : matchTime20to30WinRate};
  const matchTime30to40Data = {x : '30-40', y : matchTime30to40WinRate};
  const matchTimeOver40Data = {x : '40+', y : matchTimeOver40WinRate};
  
  const data = [{id: 'playtimePerWin', data: [matchTimeUnder20Data, matchTime20to30Data, matchTime30to40Data, matchTimeOver40Data]}]

return (
  <div className='w-full h-[380px]'>
    <ResponsiveLine
      data={data}
      xScale={{ type: 'point' }}
      yScale={{
        type : 'linear',
        min : 0,
        max : 100,
        stacked: false
      }}
      colors={['#5383E8']}
      margin={{ top: 30, right: 30, bottom: 60, left: 60 }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 12,
        tickRotation: 0,
        // legend: 'Time',
        legendOffset: 36,
        legendPosition: 'middle'
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 12,
        tickRotation: 0,
        // legend: 'winRate',
        legendOffset: -40,
        legendPosition: 'middle',
        format: (value) => `${value}%`,
        tickValues: [0, 25, 50, 75, 100]
      }}
      lineWidth={3}
      pointSize={7}
      pointColor='black'
      pointBorderWidth={2}
      pointBorderColor={{from : 'serieColor'}}
      enableGridX={false}
      gridYValues={5}
      
      enablePointLabel={true}
      pointLabel={e => e.y+'%'}
      theme={
        {
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
            }
          },
          "labels": {
            "text": {
              "fontSize": 20
            }
          },
          "dots": {
            text: {
                fill: darkMode ? '#d1d9e6' : '',
            },
        },
        }
      }
    />
  </div>

)
}
