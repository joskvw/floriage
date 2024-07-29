import knex from 'knex';
import { generateId } from '$lib/snowfake.js';
import { checkJwt } from '../../../lib/token';
import { getUser, getCommunity } from '$lib/dba';
import { paramsToObject } from '$lib/SPObject.js';
import dayjs from 'dayjs';

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
	user.communities = JSON.parse(user.communities);
	let c = user.communities[communityId];
	c ??= {
		expiry: 0
	};
	if (c.expiry > Date.now()) {
		return {
			authToken: token,
			posts: await db('posts')
				.where({
					community: communityId
				})
				.select('*')
				.orderBy('id', 'desc'),
			pc: c,
			name: (await getCommunity(communityId)).name
		};
	} else {
		return {
			authToken: token,
			pc: c,
			invite: paramsToObject(url.searchParams).invite,
			name: (await getCommunity(communityId)).name
		};
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
			let invite = (await db('invites').where({ id: event.url.p }).select('community'))[0];
			invite ??= { community: event.params.cId }; // !!TESTING ONLY!!
			user.communities[invite.community] = { expiry: dayjs().add(7, 'day').valueOf() };
			await db('users')
				.where({ id: user.id })
				.update({ communities: JSON.stringify(user.communities) })
				.select('*');
		}
	},
	invite: async (event) => {
		let b = paramsToObject(await event.request.text());
		let user = await getUser(await checkJwt(b.authToken));
		user.communities = JSON.parse(user.communities);
		let c = user.communities[b.community];
		c ??= {
			expiry: 0
		};
		if (c.expiry > Date.now()) {
			let invite = {
				id: generateId(),
				community: b.community,
				creator: user.id
			};
			db('invites').insert(invite);
		}
	},
	post: async (event) => {
		let b = paramsToObject(await event.request.text());
		let id = await checkJwt(b.authToken);
		if (id === false) {
			return { success: false, error: "You don't see to be logged in :(" };
		}
		let post = {
			id: generateId(),
			content: b.content,
			author: id,
			community: parseInt(event.params.cId)
		};
		await db('posts').insert(post);
	}
};
