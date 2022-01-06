const host = 'https://parseapi.back4app.com'
import {setUserData, clearUserData, getUserData} from '../util.js'


async function request(url, options) {
    try {
        const response = await fetch(host + url, options)
        // host + url = full address


        if (response.ok !== true) {
            if (response.status === 400) {
                clearUserData()
            //    wrong token
            }
            const error = await response.json()
            throw new Error(error.error)
        }

        try {
            return await response.json()
        } catch (err) {
            return response
        }


    } catch (error) {
        throw error
    }
}

function createOptions(method = 'get', data) {

    const options = {
        method,
        headers: {'X-Parse-Application-Id': '5sKzXvbp5NmhDpznzohEvpOQqgAZX3VwPEFTDi3N',
                  'X-Parse-REST-API-Key': 'W2nzzwVsAC1QfMqljPGdN84l4tVJMNXTI5fAcoBc'
    }
    }

    const userData = getUserData()
    if (userData) {
        options.headers['X-Parse-Session-Token'] = userData.token
    }

    if (data !== undefined) {
        options.headers['Content-Type'] = 'application/json'
        options.body = JSON.stringify(data)
    }

    return options
}

export async function get(url) {
    return request(url, createOptions())
}

export async function post(url, data) {
    return request(url, createOptions('post', data))
}

export async function put(url, data) {
    return request(url, createOptions('put', data))
}

export async function del(url) {
    return request(url, createOptions('delete'))
}

export async function login(email, password) {
    const result = await post('/login', {email, password})

    const userData = {
        email:result.email,
        username:result.username,
        id: result.objectId,
        token: result.sessionToken
    };
    setUserData(userData)

    return result
}


export async function register(username, email, password) {
    const result = await post('/users', {username, email, password})

    const userData = {
        email:email,
        username:username,
        id: result.objectId,
        token: result.sessionToken
    };
    setUserData(userData)

    return result
}

export async function logout() {
    await post('/logout');
    clearUserData()
}


