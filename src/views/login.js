import {login} from '../api/data.js'
import {html} from '../lib.js'
// import { notify } from '../notification.js'

const loginTemplate = (onSubmit, message) => html `
 <section id="login">
    <article class="narrow">
        <header class="pad-med">
            <h1>Login</h1>
        </header>
        <form @submit=${onSubmit} id="login-form" class="main-form pad-large">
            ${message ? html `<div class="error">${message}</div>` : null}
            <label>E-mail: <input type="text" name="email"></label>
            <label>Password: <input type="password" name="password"></label>
            <input class="action cta" type="submit" value="Sign In">
        </form>
        <footer class="pad-small">Don't have an account? <a href="/register" class="invert">Sign up here</a>
        </footer>
    </article>
</section>
`

export function loginPage(ctx) {
    let message = undefined
    ctx.render(loginTemplate(onSubmit, message))

    async function onSubmit(ev) {
        ev.preventDefault()

        // double check login and register!
        const formData = new FormData(ev.target)
        const email = formData.get('email').trim()
        const password = formData.get('password').trim()

        if (email === '' || password === '') {
            message = 'All fields are required!'
        } 
        if (message != undefined) {
            ctx.render(loginTemplate(onSubmit, message))
            message = undefined
            return
        }
        
        try {
            await login(email, password)
            ctx.updateUserNav()
            ev.target.reset()
            ctx.page.redirect('/')

        } catch (err) {
            ctx.render(loginTemplate(onSubmit, err.message))
        }
            
    }
}