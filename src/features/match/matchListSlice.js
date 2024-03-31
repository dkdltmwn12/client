import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSummonerRecentAllMatch, } from "../../api/getData";
import {getSummonerSelectedTypeRecentMatch} from '../../api/postData'
import { recentMostChamp } from "../../util/recentMostChamp";

export const fetchingRecentALLMatchList = createAsyncThunk(
    'matchList/all/get',
    async (puuid) => await getSummonerRecentAllMatch(puuid)
)

export const fetchingSelectedTypeRecentMatchList = createAsyncThunk(
    'matchList/soloRank/post',
    async (info) => await getSummonerSelectedTypeRecentMatch(info)

)
export const matchListSlice = createSlice({
    name : 'matchList',
    initialState: {
        loading: false,
        getMatch: {
            searchedTargetPuuid: '',
            matchList: [],
            soloRankMatchList: [],
            teamRankMatchList: [],
            quickMatchList: [],
            ARAMMatchList: [],
            filteredMatchList: [],
            recentPlayed3Champion: [],
        }
    },
    reducers: {
        filteredQueueMatchList: (state, action) => {
            const type = action.payload;
            if(type === 420) { // 솔랭
                state.getMatch.filteredMatchList = state.getMatch.soloRankMatchList.filter((match) => match.info.queueId === action.payload)
                state.getMatch.recentPlayed3Champion = recentMostChamp(
                    state.getMatch.soloRankMatchList.filter((match) => match.info.queueId === action.payload)
                    .map(match => match.info.participants.filter(participant => participant.puuid === state.getMatch.searchedTargetPuuid))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda}))
                )
            }
            else if(type === 440) { // 자랭
                state.getMatch.filteredMatchList = state.getMatch.teamRankMatchList && state.getMatch.teamRankMatchList.filter((match) => match.info.queueId === action.payload)
                state.getMatch.recentPlayed3Champion = recentMostChamp(
                    state.getMatch.teamRankMatchList.filter((match) => match.info.queueId === action.payload)
                    .map(match => match.info.participants.filter(participant => participant.puuid === state.getMatch.searchedTargetPuuid))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda}))
                )
            }
            else if(type === 490) { // 빠대
                state.getMatch.filteredMatchList = state.getMatch.quickMatchList && state.getMatch.quickMatchList.filter((match) => match.info.queueId === action.payload)
                state.getMatch.recentPlayed3Champion = recentMostChamp(
                    state.getMatch.quickMatchList.filter((match) => match.info.queueId === action.payload)
                    .map(match => match.info.participants.filter(participant => participant.puuid === state.getMatch.searchedTargetPuuid))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda}))
                )
            }
            else if(type === 450) { // 칼바람
                state.getMatch.filteredMatchList = state.getMatch.ARAMMatchList && state.getMatch.ARAMMatchList.filter((match) => match.info.queueId === action.payload)
                state.getMatch.recentPlayed3Champion = recentMostChamp(
                    state.getMatch.ARAMMatchList.filter((match) => match.info.queueId === action.payload)
                    .map(match => match.info.participants.filter(participant => participant.puuid === state.getMatch.searchedTargetPuuid))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda}))
                )
            }
            else if(type === 'ALL') { // 전체
                state.getMatch.filteredMatchList = state.getMatch.matchList && state.getMatch.matchList.filter((match) => match.info.queueId === action.payload)
                state.getMatch.recentPlayed3Champion = recentMostChamp(
                    state.getMatch.matchList.filter((match) => match.info.queueId === action.payload)
                    .map(match => match.info.participants.filter(participant => participant.puuid === state.getMatch.searchedTargetPuuid))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda}))
                )
            }
           
        },
        allQueueMatchList: (state) => {
            state.getMatch.filteredMatchList = state.getMatch.matchList
            state.getMatch.recentPlayed3Champion = recentMostChamp(
                state.getMatch.matchList.map(match => match.info.participants
                .filter(participant => participant.puuid === state.getMatch.searchedTargetPuuid))
                .flatMap(arr => arr)
                .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda}))
            )
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchingRecentALLMatchList.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchingRecentALLMatchList.fulfilled, (state, action) => {
            const {matchList, searchedTargetPuuid} = action.payload;
            state.loading = false;
            state.getMatch.searchedTargetPuuid = searchedTargetPuuid;
            state.getMatch.matchList = matchList;
            state.getMatch.filteredMatchList = matchList;
            state.getMatch.recentPlayed3Champion = searchedTargetPuuid && matchList && recentMostChamp(
                matchList.map(match => match.info.participants.filter(participant => participant.puuid === searchedTargetPuuid))
                .flatMap(arr => arr)
                .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})))
        })
        .addCase(fetchingSelectedTypeRecentMatchList.fulfilled, (state, action) => {
            const {matchList, searchedTargetPuuid} = action.payload;
            const {type} = action.payload;
            if(type === 420) {
                state.getMatch.searchedTargetPuuid = searchedTargetPuuid;
                state.getMatch.soloRankMatchList = matchList;
                state.getMatch.filteredMatchList = matchList;
                state.getMatch.recentPlayed3Champion = searchedTargetPuuid && matchList && recentMostChamp(
                    matchList.map(match => match.info.participants.filter(participant => participant.puuid === searchedTargetPuuid))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})))
            }
            else if(type === 440) {
                state.getMatch.searchedTargetPuuid = searchedTargetPuuid;
                state.getMatch.teamRankMatchList = matchList;
                state.getMatch.filteredMatchList = matchList;
                state.getMatch.recentPlayed3Champion = searchedTargetPuuid && matchList && recentMostChamp(
                    matchList.map(match => match.info.participants.filter(participant => participant.puuid === searchedTargetPuuid))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})))
            }
            else if(type === 490) {
                state.getMatch.searchedTargetPuuid = searchedTargetPuuid;
                state.getMatch.quickMatchList = matchList;
                state.getMatch.filteredMatchList = matchList;
                state.getMatch.recentPlayed3Champion = searchedTargetPuuid && matchList && recentMostChamp(
                    matchList.map(match => match.info.participants.filter(participant => participant.puuid === searchedTargetPuuid))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})))
            }
            else if(type === 450) {
                state.getMatch.searchedTargetPuuid = searchedTargetPuuid;
                state.getMatch.ARAMMatchList = matchList;
                state.getMatch.filteredMatchList = matchList;
                state.getMatch.recentPlayed3Champion = searchedTargetPuuid && matchList && recentMostChamp(
                    matchList.map(match => match.info.participants.filter(participant => participant.puuid === searchedTargetPuuid))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})))
            }
        })
    }
})
export const {filteredQueueMatchList, allQueueMatchList} = matchListSlice.actions;
export default matchListSlice.reducer