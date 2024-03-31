import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchingLckRank } from '../../features/lckRank/lckRankSlice';
import Table from 'react-bootstrap/Table'
import RankingCard from './RankingCard';

export default function Ranking() {
    const dispatch = useDispatch();
    const lckRankList = useSelector(state => state.lckRank.getLckRanking)

    useEffect(() => {
        dispatch(fetchingLckRank())
    }, [dispatch])
  return (
    <div>
        <span className='p-2 text-2xl font-bold text-white'>LCK 순위</span>
        <Table className='w-[520px]' striped bordered hover>
            <thead>
                <tr>
                    <th>순위</th>
                    <th>팀명</th>
                    <th>승</th>
                    <th>패</th>
                    <th>승률</th>
                    <th>득실</th>
                </tr>
            </thead>
            <tbody>
                {lckRankList && lckRankList.map((list, index) => <RankingCard key={index} list={list}/>)}
            </tbody>
        </Table>
    </div>
  )
}
