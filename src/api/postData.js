import axios from 'axios';

export async function getSoloRankMatchInfoListForStat(info) {
    return axios.post(`http://localhost:3001/summonermatch/solorank/stat`, {info}).then(response => response.data);
}

export async function getTeamRankMatchInfoListForStat(info) {
    return axios.post(`http://localhost:3001/summonermatch/teamrank/stat`, {info}).then(response => response.data)
}

export async function getSummonerSelectedTypeRecentMatch(info) {
    return axios.post(`http://localhost:3001/summonermatch/selectedType`, {info}).then(response => response.data)
}

// export async function getSummonerRecentTeamRankMatch(type, puuid) {
//     return axios.post(`http://localhost:3001/summonermatch/teamRank`, {type, puuid}).then(response => response.data)
// }

// export async function getSummonerRecentQuickMatch(type, puuid) {
//     return axios.post(`http://localhost:3001/summonermatch/quick`, {type, puuid}).then(response => response.data)
// }

// export async function getSummonerRecentARAMMatch(type, puuid) {
//     return axios.post(`http://localhost:3001/summonermatch/ARAM`, {type, puuid}).then(response => response.data)
// }

export async function participantsInfo(Ids) {
    return await axios.post(`http://localhost:3001/match/participants`, {Ids}).then(response => response.data)
}

export async function summonerNameCheck(name) {
    return await axios.post(`http://localhost:3001/board/summonerCheck`, {name}).then(response => response.data)
}

export async function articleRegister(info) {
    return await axios.post(`http://localhost:3001/board/write`, {info}).then(response => response.data)
}
export async function loginAccount(info) {
    return await axios.post(`http://localhost:3001/login`, {info}, {withCredentials : true})
}

export async function logutAccount() {
    return await axios.get(`http://localhost:3001/logout`, {withCredentials : true})
}

export async function reigsterAccount(info) {
    return await axios.post(`http://localhost:3001/register`, {info}).then(response => response.data)
}

export async function updateUserProfile(info) {
    return await axios.put(`http://localhost:3001/profile`, {info}, {withCredentials : true})
}

export async function findUserPasswordforEmail(email) {
    return await axios.post(`http://localhost:3001/findPassword`, {email})
}

export async function updateUserPassword(info) {
    return await axios.put(`http://localhost:3001/newPassword`, {info}, {withCredentials : true})
}

export async function resetUserPassword(info) {
    return await axios.put(`http://localhost:3001/resetPassword`, {info}, {withCredentials : true})
}

export async function uploadProfileImage(profileImg) {
    return await axios.post(`http://localhost:3001/profile/upload`, {profileImg}, {headers : { 'Content-Type': 'multipart/form-data'}, withCredentials : true})
}

export async function deleteProfileImage() {
    return await axios.get(`http://localhost:3001/profile/delete`, {withCredentials : true})
}

export async function createComment(info) {
    return await axios.post(`http://localhost:3001/comment/create`, {info}, {withCredentials : true})
}

export async function modifyComment(info) {
    return await axios.put(`http://localhost:3001/comment/modify`, {info}, {withCredentials : true})
}

export async function createReplyComment(info) {
    return await axios.post(`http://localhost:3001/comment/reply/create`, {info}, {withCredentials : true});
}

export async function deleteComment(info) {
    return await axios.post(`http://localhost:3001/comment/delete`, {info}, {withCredentials : true});
}

export async function deleteReplyComment(info) {
    return await axios.post(`http://localhost:3001/comment/delete`, {info}, {withCredentials : true});
}