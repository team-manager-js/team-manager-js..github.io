import { browseTeams, getMembers} from '../api/data.js'
import {html, until} from '../lib.js'
import { getUserData } from '../util.js'
import { getMembersCount } from './browse.js'


const myTeamsTemplate = (teams) => html `
<section id="my-teams">

<article class="pad-med">
    <h1>My Teams</h1>
</article>

${teams.length == 0 ? html `<article class="layout narrow">
    <div class="pad-med">
        <p>You are not a member of any team yet.</p>
        <p><a href="/browse-teams">Browse all teams</a> to join one, or use the button bellow to create your own
            team.</p>
    </div>
    <div class=""><a href="#" class="action cta">Create Team</a></div>
</article>` : null}
${teams.map(teamCard)}
</section>
`

const teamCard =(team) => html`
<article class="layout">
    <img src=${team.logoUrl} class="team-logo left-col">
    <div class="tm-preview">
        <h2>${team.name}</h2>
        <p>${team.description}</p>
        <span class="details">${until(getMembersCount(team.objectId))}</span>
        <div><a href="/details/${team.objectId}" class="action">See details</a></div>
    </div>
</article>
`

export async function myTeamsPage(ctx) {
    const userData = getUserData()
    const userId = userData.id

    let allTeams = await browseTeams()
    allTeams = allTeams.results

    let allMembers = await getMembers()
    allMembers = allMembers.results

    const myTeamsIds = allMembers.filter(m=> m.userId.objectId == userId && m.status == 'member').map(item => item.teamId.objectId)
    const myTeams = allTeams.filter(team => myTeamsIds.includes(team.objectId))
    ctx.render(myTeamsTemplate(myTeams))
}