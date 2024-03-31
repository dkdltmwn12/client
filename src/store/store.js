import { combineReducers, configureStore } from "@reduxjs/toolkit";
import patchNoteReducer from "../features/patchNote/patchNoteSlice";
import lckRankReducer from "../features/lckRank/lckRankSlice";
import summonerReducer from "../features/summoner/summonerSlice";
import participantsReducer from "../features/participants/participantsSlice";
import matchIdListReducer from "../features/match/addedMatchListSlice";
import boardReducer from "../features/board/boardSlice";
// import matchInfoListReducer from "../features/match/matchInfoListSlice";
import matchListReducer from "../features/match/matchListSlice";
import recentSearchReducer from "../features/recentSearch/recentSearchSlice";
import darkModeReducer from "../features/darkMode/darkModeSlice";
import loginUserReducer from "../features/login/loginUserSlice";
import storage from 'redux-persist/lib/storage';
import {persistReducer} from 'redux-persist';
import commentReducer from "../features/comment/commentSlice";
import session from "redux-persist/lib/storage/session";

const recentSearchPersistConfig = {
    key: 'recentSearch',
    storage,
};

const darkModePersistConfig = {
    key: 'darkMode',
    storage,
};

const loginUserPersistConfig = {
    key: 'loginUser',
    storage : session,
};

const rootReducer = combineReducers({
    patchNote: patchNoteReducer,
    lckRank: lckRankReducer,
    summoner: summonerReducer,
    matchList: matchListReducer,
    addedMatch: matchIdListReducer,
    participants: participantsReducer,
    board: boardReducer,
    comment: commentReducer,
    recentSearch: persistReducer(recentSearchPersistConfig, recentSearchReducer),
    darkMode: persistReducer(darkModePersistConfig, darkModeReducer),
    loginUser: persistReducer(loginUserPersistConfig, loginUserReducer),   
})


export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false,  immutableCheck : false})
})