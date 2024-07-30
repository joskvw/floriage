import knex from 'knex';
import { generateId } from '$lib/snowfake.js';
import { checkJwt } from '../../../lib/token';
import { getUser, getCommunity } from '$lib/dba';
import { paramsToObject } from '$lib/SPObject.js';
import dayjs from 'dayjs';
import { error, redirect } from '@sveltejs/kit';

const db = knex({
	client: 'better-sqlite3',
	connection: {
		filename: './db.sqlite'
	}
});
db.schema.hasTable('posts').then(async function (exists) {
	if (!exists) {
		return await db.schema.createTable('posts', (t) => {
			t.bigint('id'); // snowfake id
			t.text('content'); // textual content of the post
			t.bigint('author'); // the authors id
			t.bigint('community'); // the community id
		});
	}
});
db.schema.hasTable('invites').then(async function (exists) {
	if (!exists) {
		return await db.schema.createTable('invites', (t) => {
			t.bigint('id'); // snowfake id
			t.bigint('creator'); // link creator's id
			t.bigint('community'); // the community id
		});
	}
});

export async function load({ params, cookies, url }) {
	let communityId = parseInt(params.cId);
	let token = cookies.get('authToken');
	let user = await getUser(await checkJwt(token));
	if (!user) {
		redirect(302, '/');
	}
	user.communities = JSON.parse(user.communities);
	let c = user.communities[communityId];
	let cd = await getCommunity(communityId);
	c ??= {
		expiry: 0
	};
	if (c.expiry > Date.now()) {
		let posts = await db('posts')
			.where({
				community: communityId
			})
			.select('*')
			.orderBy('id', 'desc');
		let userTable = {};
		for (let i in posts) {
			let a = posts[i].author;
			if (!userTable[a]) {
				userTable[a] = (await getUser(a)).username; // temporary solution
			}
			posts[i].author = userTable[a];
		}
		if (cd) {
			return {
				authToken: token,
				posts: posts,
				pc: c,
				name: cd.name
			};
		} else {
			throw error(404, 'This community never existed... or did it?');
		}
	} else {
		if (cd) {
			return {
				authToken: token,
				pc: c,
				invite: paramsToObject(url.searchParams).invite,
				name: cd.name
			};
		} else {
			throw error(404, 'This community never existed... or did it?');
		}
	}
}
export const actions = {
	vacation: async (event) => {
		let b = paramsToObject(await event.request.text());
		let user = await getUser(await checkJwt(b.authToken));
	},
	uproot: async (event) => {
		let b = paramsToObject(await event.request.text());
		let user = await getUser(await checkJwt(b.authToken));
		user.communities = JSON.parse(user.communities);
		if (user && user.communities[event.params.cId].expiry > Date.now()) {
			console.log(await db('communities').where({ id: event.params.cId }).delete());
		}
	},
	join: async (event) => {
		let b = paramsToObject(await event.request.text());
		let user = await getUser(await checkJwt(b.authToken));
		if (user) {
			user.communities = JSON.parse(user.communities);
			let invite = (await db('invites').where({ id: b.invite }).select('community'))[0];
			console.log(await db('invites').where({ id: b.invite }).select('community'));
			//invite ??= { community: event.params.cId }; // !!TESTING ONLY!!
			if (!invite || event.params.cId != invite.community) {
				error(403, "Something mischievous may be afoot... we're going blocking this request");
			}
			if (invite) {
				user.communities[invite.community] = { expiry: dayjs().add(7, 'day').valueOf() };
				await db('users')
					.where({ id: user.id })
					.update({ communities: JSON.stringify(user.communities) });
			}
		}
	},
	invite: async (event) => {
		let b = paramsToObject(await event.request.text());
		let user = await getUser(await checkJwt(b.authToken));
		user.communities = JSON.parse(user.communities);
		let communityId = event.params.cId;
		let c = user.communities[communityId];
		c ??= {
			expiry: 0
		};
		if (c.expiry > Date.now()) {
			let invite = {
				id: generateId(),
				community: communityId,
				creator: user.id
			};
			await db('invites').insert(invite);
			return { success: true, inviteId: invite.id };
		}
	},
	post: async (event) => {
		let b = paramsToObject(await event.request.text());
		let user = await getUser(await checkJwt(b.authToken));
		if (user & (JSON.parse(user.communities)[event.params.cId].expiry > Date.now())) {
			return {
				success: false,
				error: "You either aren't logged in or aren't a member of this community :("
			};
		}
		if (b.content.length === 0) {
			return {
				success: false,
				error: "Your post doesn't have any content??"
			};
		}
		let post = {
			id: generateId(),
			content: b.content,
			author: user.id,
			community: event.params.cId
		};
		await db('posts').insert(post);
	}
};
