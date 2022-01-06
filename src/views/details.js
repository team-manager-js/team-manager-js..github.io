import { approveRequest, deleteById, getMembers, getTeamById, memberRequest } from '../api/data.js'
import {html, until} from '../lib.js'
import { getUserData } from '../util.js'
import { getMembersCount } from './browse.js'

const detailsTemplate = (team, user, allMembers, allPending, sendRequest, removeMembershipUser, actionDelegation) => html`

<section id="team-home">
<article class="layout">
    <img src=${team.logoUrl} class="team-logo left-col">
    <div class="tm-preview">
        <h2>${team.name}t</h2>
        <p>${team.description}</p>
        <span class="details">${until(getMembersCount(team.objectId))}</span>
        <div>
            ${user == 'owner' ? html `<a href="/edit/${team.objectId}" class="action">Edit team</a>` : null}
            ${user == 'notInvolved' ? html `<a @click=${sendRequest} href="javascript:void(0)" class="action">Join team</a>` : null}
            ${user == 'member' ? html `<a @click=${removeMembershipUser} href="javascript:void(0)" class="action invert">Leave team</a>`: null}
            ${user == 'pending' ? html `Membership pending. <a @click=${removeMembershipUser} href="javascript:void(0)">Cancel request</a>` : null} 
                   
        </div>
    </div>
    <div class="pad-large">
        <h3>Members</h3>
        <ul class="tm-members">
            ${allMembers.map(m => membersTemplate(m, user, team.ownerId.objectId, actionDelegation))}
        </ul>
    </div>

    ${user == 'owner' ? html `<div class="pad-large">
        <h3>Membership Requests</h3>
        <ul class="tm-members">
            ${allPending.map(p => pendingTemplate(p, actionDelegation))}
        </ul>
    </div>` : null}

    ${user == 'guest' ? html `<p>You need to be registered user in order to participate in teams</p>`: null}
</article>

</section>
`
// owner can not remove himself from his group but can remove other members
const membersTemplate = (member, user, teamOwner, actionDelegation) => html `
<li>${member.username}${user == 'owner' && member.userId.objectId != teamOwner ? html `<a @click=${actionDelegation} href="javascript:void(0)" class="tm-control action">Remove from team</a>`: null}</li>
`
// owner can approve and delcline pending requests
const pendingTemplate = (person, actionDelegation) => html `
<li>${person.username}<a @click=${actionDelegation} href="javascript:void(0)" class="tm-control action">Approve</a>
                            <a @click=${actionDelegation} href="javascript:void(0)" class="tm-control action">Decline</a></li>
`

export async function detailsPage(ctx) {

    const team = await getTeamById(ctx.params.id)
    const teamId = team.objectId
    let allPeople = await getMembers()
    allPeople = allPeople.results

    const allMembers = allPeople.filter(member => member.teamId.objectId == teamId && member.status == 'member')
    const allPending = allPeople.filter(member => member.teamId.objectId == teamId && member.status == 'pending')
 
    const idsOfMembers = allMembers.map(member => member.userId.objectId)
    const idsOfPending = allPending.map(member => member.userId.objectId)

    const userData = getUserData()
    let userId = undefined
    let username = undefined
    let user = undefined
    let ownerId = undefined
    
    // define user type and give it to the template
    if(!userData) {
        user = 'guest'
    } else {
        userId = userData.id
        username = userData.username
        ownerId = userData.id
        if (ownerId == team.ownerId.objectId) {
            user = 'owner'
        } else {
            if (idsOfMembers.includes(ownerId)) {
                user = 'member'
            } else {
                if (idsOfPending.includes(ownerId)) {
                    user = 'pending'
                } else {
                    user = 'notInvolved'
                }
            }
        }
    }

    // rendering
    ctx.render(detailsTemplate(team, user, allMembers, allPending, sendRequest, removeMembershipUser, actionDelegation))

    async function sendRequest(ev) {
        ev.preventDefault()
        const teamId = team.objectId
        await memberRequest(
            teamId, userId, username
        )
        ctx.page.redirect(`/details/${team.objectId}`)
    }

    // cancels pending requests/member leaves group
    async function removeMembershipUser(ev) {
        ev.preventDefault()
        let membershipId = undefined
        if(ev.target.textContent == 'Leave team') {
            membershipId = allMembers.filter(p => p.userId.objectId == ownerId)
        } else {
            membershipId = allPending.filter(p => p.userId.objectId == ownerId)
        }
        
        await deleteById(membershipId[0].objectId)
        ctx.page.redirect(`/details/${team.objectId}`)
    }
    // different action depeding on the button clicked
    async function actionDelegation(ev) {
        ev.preventDefault()
        let searchedMember = undefined
        const username = ev.target.parentElement.childNodes[1].textContent

        if(ev.target.textContent == 'Remove from team') {
            searchedMember = allMembers.filter(e => e.username == username)
            await deleteById(searchedMember[0].objectId)
            ctx.page.redirect(`/details/${team.objectId}`)

        } else if (ev.target.textContent == 'Decline'){
            searchedMember = allPending.filter(e => e.username == username)
            await deleteById(searchedMember[0].objectId)
            ctx.page.redirect(`/details/${team.objectId}`)

        } else {
            searchedMember = allPending.filter(e => e.username == username)
            await approveRequest(searchedMember[0].objectId)
            ctx.page.redirect(`/details/${team.objectId}`)
        } 

    }

}