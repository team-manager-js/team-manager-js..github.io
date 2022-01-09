import { browseTeams, getMembers} from '../api/data.js'
import {html, until} from '../lib.js'
import { getUserData } from '../util.js'


const catalogTemplate = (teams, userData) => html`
  <section id="browse">

<article class="pad-med">
    <h1>Team Browser</h1>
</article>

${userData ? html `<article class="layout narrow">
                        <div class="pad-small"><a href="/create" class="action cta">Create Team</a></div>
                    </article>` 
            : null}


</article>

</article>
    ${teams.map(teamCard)}
</section>

`

const teamCard = (team) => html `
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

export async function browsePage(ctx) {
    const teams = await browseTeams()
    const userData = getUserData()
    ctx.render(catalogTemplate(teams.results, userData))
}

export async function getMembersCount(teamId) {
    let members =  await getMembers()
    members = members.results
    const teamMembers = members.filter(member => member.teamId.objectId == teamId && member.status == 'member')
    return teamMembers.length
}



