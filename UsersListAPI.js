class UsersListAPI {
    static API = 'https://642768d646fd35eb7c3f6d3b.mockapi.io/api/userlist/'

    static request(url = '', method = 'GET', body){
        return fetch(UsersListAPI.API + url, {
            method: method,
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                'Content-type': 'application/json'
            }
        }).
        then((res) => {
            if(res.ok) {
                return res.json()
            }
            throw new Error('Can not execute server request.')
        })
    }

    static getList() {
        return UsersListAPI.request().catch(() => {
                throw new Error('Can not retrieve contact list from server.')
            })
    }

    static createUser(contact) {
        return UsersListAPI.request('', 'POST', contact).catch(() => {
            throw new Error('Can not add contact to list.')
        })
    }

    static deleteUser(id) {
        return UsersListAPI.request(id, 'DELETE').catch(() => {
            throw new Error('Can not delete this contact.')
        })
    }

    static updateUser(id, changes) {
        return UsersListAPI.request(id, 'PUT', changes).catch(() => {
            throw new Error('Can not update data about this contact.')
        })
    }
}