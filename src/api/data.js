import * as api from './api.js'

export const login = api.login
export const register = api.register
export const logout = api.logout


export async function browseTeams() {
    return api.get('/classes/team')
}

export async function getMembers() {
    return api.get(`/classes/member`)
}

export async function memberRequest(teamId, userId, username) {
    return api.post(`/classes/member`, {
        teamId: { __type: "Pointer", className: "team", objectId: teamId},
        userId: { __type: "Pointer", className: "_User", objectId: userId },
        username: username
    })
}

export async function approveRequest(id) {
    return api.put(`/classes/member/` + id, {
        status: "member"
    })
}


export async function getTeamById(id) {
    return api.get('/classes/team/' + id)
}


export async function create(data, ownerId) {
    data["ownerId"] = { __type: "Pointer", className: "_User", objectId: ownerId }
    return api.post('/classes/team', data)
}

export async function editById(id, data) {
    return api.put('/classes/team/' + id, data)
}

export async function deleteById(id) {
    return api.del('/classes/member/' + id)
}
