import { register } from '../api/data.js'
import {html} from '../lib.js'


const registerTemplate =(onSubmit, message) => html `
<section id="register">
    <article class="narrow">
        <header class="pad-med">
            <h1>Register</h1>
        </header>
        <form @submit = ${onSubmit} id="register-form" class="main-form pad-large">
        ${message ? html `<div class="error">${message}</div>` : null}
            <label>E-mail: <input type="text" name="email"></label>
            <label>Username: <input type="text" name="username"></label>
            <label>Password: <input type="password" name="password"></label>
            <label>Repeat: <input type="password" name="repass"></label>
            <input class="action cta" type="submit" value="Create Account">
        </form>
        <footer class="pad-small">Already have an account? <a href="/login" class="invert">Sign in here</a>
        </footer>
    </article>
</section>
`

export function registerPage(ctx) {
    let message = undefined
    ctx.render(registerTemplate(onSubmit, message))

    async function onSubmit(ev) {
        ev.preventDefault()

        const formData = new FormData(ev.target)

        const username = formData.get('username').trim()
        const email = formData.get('email').trim()
        const password = formData.get('password').trim()
        const repeatPass = formData.get('repass').trim()


        const re = /\S+@\S+\.\S+/;
        if (re.test(email) == false) {
            message = 'Please put a valid email'
        }

        if (email === '' || password === '' || username === '') {
            message = 'All fields are required!'
        }

        if (password !== repeatPass) {
            message = 'Passwords must match!'
        }

        if (username.length < 3 || password.length < 3) {
            message =  'Username and password must be at least 3 characters'
        }

        if (message !== undefined) {
            ctx.render(registerTemplate(onSubmit, message))
            message = undefined
            return
        }

        try {
            await register(username, email, password)
            ctx.updateUserNav()
            ev.target.reset()
            ctx.page.redirect('/')
        } catch (err) {
            ctx.render(registerTemplate(onSubmit, err.message))
        }
        
        
    }
}