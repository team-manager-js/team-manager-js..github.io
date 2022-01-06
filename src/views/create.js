import { approveRequest, create, memberRequest } from '../api/data.js';
import {html} from '../lib.js'
import { getUserData } from '../util.js';


const createTemplate = (onSubmit, message) => html`
 <section id="create">
    <article class="narrow">
        <header class="pad-med">
            <h1>New Team</h1>
        </header>
        <form @submit=${onSubmit} id="create-form" class="main-form pad-large">
            ${message ? html `<div class="error">${message}</div>` : null}
            <label>Team name: <input type="text" name="name"></label>
            <label>Logo URL: <input type="text" name="logoUrl"></label>
            <label>Description: <textarea name="description"></textarea></label>
            <input class="action cta" type="submit" value="Create Team">
        </form>
    </article>
</section>
`

export function createPage(ctx) {
    let message = undefined
    ctx.render(createTemplate(onSubmit, message));

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
            ctx.render(createTemplate(onSubmit, message))
            message = undefined
            return
        }

        
        const userData = getUserData()
        const userId = userData.id

        // create team
        const team = await create({
            name,
            logoUrl,
            description
        }, userId)

        const teamId = team.objectId
        
        
        // send membership request(creator must be a member)
        const memberInfo = await memberRequest(
            teamId, userId, userData.username
        )

        // approve request and make creator a member of the team
        await approveRequest(memberInfo.objectId)


        ev.target.reset()
        ctx.page.redirect(`/details/${team._id}`)
    }
}