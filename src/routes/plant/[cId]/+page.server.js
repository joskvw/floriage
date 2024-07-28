import knex from 'knex';
import { generateId } from '$lib/snowfake.js';
import { checkJwt } from '../../../lib/token';
import { getUser, getCommunity } from '$lib/dba';
import { paramsToObject } from '$lib/SPObject.js';

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
		member: false,
		invite: paramsToObject(url.searchParams).invite
	};
	if (c.member) {
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
			name: (await getCommunity(communityId)).name
		};
	}
}
export const actions = {
	join: async (event) => {},
	invite: async (event) => {
		let b = paramsToObject(await event.request.text());
		let user = await getUser(await checkJwt(event.cookies.get('authToken')));
		user.communities = JSON.parse(user.communities);
		let c = user.communities[b.community];
		c ??= {
			member: false
		};
		if (c.member) {
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
