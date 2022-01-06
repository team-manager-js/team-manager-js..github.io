import { editById, getTeamById } from '../api/data.js'
import {html} from '../lib.js'

const editTemplate = (team, onSubmit, message) => html `
<section id="edit">
    <article class="narrow">
        <header class="pad-med">
            <h1>Edit Team</h1>
        </header>
        <form @submit=${onSubmit} id="edit-form" class="main-form pad-large">
        ${message ? html `<div class="error">${message}</div>` : null}
            <label>Team name: <input type="text" name="name"  value=${team.name}></label>
            <label>Logo URL: <input type="text" name="logoUrl" value=${team.logoUrl}></label>
            <label>Description: <textarea name="description">${team.description}</textarea></label>
            <input class="action cta" type="submit" value="Save Changes">
        </form>
    </article>
</section>
`

export async function editPage(ctx) {
    let message = undefined
    const team = await getTeamById(ctx.params.id)
    console.log(team)
    ctx.render(editTemplate(team, onSubmit, message))


    async function onSubmit(ev) {

        ev.preventDefault()

        const formData = new FormData(ev.target)

        const name = formData.get('name').trim()
        const logoUrl = formData.get('logoUrl').trim()
        const description = formData.get('description').trim()


        if(name.length < 4) {
            message =  'The name must be at least 4 characters long'
        }

        if(description.length < 10) {
            message =  'The description must be at least 10 characters long'
        }

        if (name === '' || description === '' || logoUrl === '') {
            message = 'All fields are required'
        }

        if (message !== undefined) {
            ctx.render(editTemplate(team, onSubmit, message))
            message = undefined
            return
        }

        await editById(team.objectId, {
            name,
            logoUrl,
            description
        })
        ev.target.reset()
        ctx.page.redirect(`/browse-teams`)

    }
}