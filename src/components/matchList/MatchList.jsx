import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import MatchCard from './MatchCard.jsx';
import MatchDetails from './MatchDetails.jsx';
import {v4 as uuidv4} from 'uuid'
export default function MatchList({ match : {info : {gameMode, gameDuration, gameEndTimestamp, participants, teams, queueId}}}) {

  const {id} = useParams();
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <li className='match-list list-none mb-2'>
        {participants && participants.map((participant) => participant.riotIdGameName && participant.riotIdGameName.toUpperCase() === id.toUpperCase().split('-')[0] && (
          <MatchCard key={uuidv4()} participant={participant}  gameMode={gameMode} participants={participants} gameDuration={gameDuration} queueId={queueId} teams={teams} gameEndTimestamp={gameEndTimestamp} toggle={toggle} setToggle={setToggle}/>
        ))}
        {toggle &&  (
          <div className='toggle-details mt-2'>
            {participants && participants.map((participant) => participant.riotIdGameName && participant.riotIdGameName.toUpperCase() === id.toUpperCase().split('-')[0] && (
              <MatchDetails key={uuidv4()} participant={participant} participants={participants} teams={teams} gameDuration={gameDuration}/>
            ))}
          </div>
        )}
      </li>
    </>
  )
}
