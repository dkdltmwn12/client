import React from 'react'

export default function RankingCard({list : {ranking, teamName, teamImg, win, lose, winRate, score}}) {
  return (
    <tr>
        <td>{ranking}</td>
        <td className='flex'><img src={teamImg} alt={teamName} width={30}/>{teamName}</td>
        <td>{win}</td>
        <td>{lose}</td>
        <td>{winRate}</td>
        <td>{score}</td>
    </tr>
  )
}
