const BTN_CHANGE = 'buttonChange'
const BTN_DELETE = 'buttonDelete'
const DATA_USER = '.user'

const contactList = document.querySelector('#contactList')
const form = document.querySelector('#userForm')
let initialList = []

form.addEventListener('submit', onFormSubmit)
contactList.addEventListener('click', onUserFieldClick)

UsersListAPI
    .getList()
    .then((list) => {
        renderServerList(list)
        initialList = list
        console.log(initialList)
    })
    .catch(e => showError(e))

function onFormSubmit(e) {
    e.preventDefault()

    const contact = getPersonData()

    if(!isPersonDataValid(contact)) {
        showError(new Error('Введите корректные данные!'))
        return
    }

    if(contact.id){
        UsersListAPI
            .updateUser(contact.id, contact)
            .then((newContact) => {
                replaceContact(contact.id, newContact)
                clearForm()
                initialList.map(contactItem => contactItem.id === contact.id ? newContact : contactItem)
            })
            .catch(e => showError(e))
    } else {
        UsersListAPI
            .createUser(contact)
            .then((newContact) => {
                renderUsersList(newContact)
                clearForm()
                initialList.push(newContact)
            })
            .catch(e => showError(e))
    }
}

function onUserFieldClick(e) {
    const target = e.target
    const currentContact = findClickElement(target)
    const indexOfSelectedElem = currentContact.dataset.id
    const contact = findUserById(indexOfSelectedElem)

    if(isButtonDelete(target)) {
        UsersListAPI
            .deleteUser(indexOfSelectedElem)
            .catch(e => showError(e))
            currentContact.remove()
            initialList.filter(contactItem => contactItem.id !== indexOfSelectedElem)
    } else {
        if(isButtonEdit(target)) {
            fillForm(contact)
        }
    }
}

function findClickElement(area) {
    return area.closest(DATA_USER)
}

function isButtonDelete(area) {
    return area.classList.contains(BTN_DELETE)
}

function isButtonEdit(area) {
    return area.classList.contains(BTN_CHANGE)
}

function findUserById(id) {
    return initialList.find(contact => contact.id === id)
}

function replaceContact(id, contact) {
    const initContact = document.querySelector(`[data-id="${id}"]`)
    const newContactItem = htmlUser(contact)

    initContact.outerHTML = newContactItem
}

function fillForm(contact) {
    form.id.value = contact.id
    form.inputName.value = contact.name
    form.inputSurname.value = contact.surname
    form.inputPhone.value = contact.phone
}


function getPersonData() {
    const id = form.id.value
    const contact = findUserById(id) || {}

    return {
        ...contact,
        name : form.inputName.value,
        surname : form.inputSurname.value,
        phone : form.inputPhone.value
    }
}

function isPersonDataValid(person) {
    return (person.name !== '') && (person.surname !== '') && (person.phone !== '') && (isNaN(person.phone) === false)
}

function renderUsersList(contact) {
    const html = htmlUser(contact)

    contactList.insertAdjacentHTML('beforeend', html)
}

function renderServerList(list) {
    const htmlServerEL = list.map(htmlUser).join('')

    contactList.innerHTML = htmlServerEL
}

function htmlUser(contact) {
    return `
    <tr class="user" data-id="${contact.id}">
        <td class="user__name">${contact.name}</td>
        <td class="user__surname">${contact.surname}</td>
        <td class="user__phone">${contact.phone}</td>
        <td>
            <button class="buttonChange">Edit</button>
            <button class="buttonDelete">Delete</button>
        </td>
    </tr>
    `
}

function clearForm() {
    form.reset()
}

function showError(e) {
    alert(e.message)
}

