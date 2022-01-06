import {render, page} from './lib.js'
import { getUserData } from './util.js'
import { browsePage } from './views/browse.js'
import { createPage } from './views/create.js'
import { detailsPage } from './views/details.js'
import { editPage } from './views/edit.js'
import { homePage } from "./views/home.js"
import { loginPage } from './views/login.js'
import { myTeamsPage } from './views/my-teams.js'
import { registerPage } from './views/register.js'
import { logout } from './api/data.js'
import * as api from './api/data.js'

window.api = api




const root = document.querySelector('main')

document.getElementById('logoutBtn').addEventListener('click', logingOut)

page(decorateContext)
page('/', homePage)
page('/details/:id', detailsPage)
page('/edit/:id', editPage)
page('/login', loginPage)
page('/register', registerPage)
page('/create', createPage)
page('/my-teams', myTeamsPage)
page('/browse-teams', browsePage)

page.redirect('/')
updateUserNav()
page.start()



function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, root)
    ctx.updateUserNav = updateUserNav
    next()
}

function updateUserNav() {
    const userData = getUserData()
    if (userData !== null) {
        document.querySelector('.user').style.display = 'inline-block'
        // document.querySelector('.user span').textContent = `Welcome, ${userData.email}`
        document.querySelector('.guest').style.display = 'none'
    } else {
        document.querySelector('.user').style.display = 'none'
        document.querySelector('.guest').style.display = 'inline-block'
    }
}

// pretty much stays the same but double check the redirect
async function logingOut() {
    await logout()
    updateUserNav()
    page.redirect('/')
}