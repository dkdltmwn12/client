import axios from "axios";

export async function fetchingPatchNote() {
    return axios.get(`http://localhost:3001/patchNote/fetch`).then(response => response.data);
}

export async function getPatchNote() {
    return axios.get(`http://localhost:3001/patchNote`).then(response => response.data);
}

export async function getRanking() {
    return axios.get(`http://localhost:3001/lckRank`).then(res => res.data);
}

export async function getSummoner(search) {
    return axios.get(`http://localhost:3001/summoner/${search}`).then(response => response.data)
}

export async function getSummonerRecentAllMatch(puuid) {
    return axios.get(`http://localhost:3001/summonermatch/${puuid}`).then(response => response.data)
}

export async function getMatchIdList(id, puuid, page, type) {
    return axios.get(`http://localhost:3001/summoner/${puuid}/addedmatch?page=${page.toString()}&type=${type}&id=${id}`).then(response => response.data);
}

export async function getMatchInfoList(list) {
    return axios.get(`http://localhost:3001/${list}/info`).then(response => response.data);
}

export async function getArticleList() {
    return axios.get(`http://localhost:3001/board`).then(response => response.data);
}

export async function getAuth() {
    return axios.get(`http://localhost:3001/auth`, {withCredentials : true})
}

export async function getRefresh() {
    return axios.get(`http://localhost:3001/refresh`, {withCredentials : true})
}

export async function getCommentList() {
    return axios.get(`http://localhost:3001/comment`).then(response => response.data);
}
