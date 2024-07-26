import knex from 'knex';
import { generateId } from '$lib/snowfake.js';
import { checkJwt } from '../../../lib/token';

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

export async function load({ params, cookies }) {
	params.readableId;
	return {
		authToken: cookies.get('authToken'),
		posts: await db('posts')
			.where({
				community: parseInt(params.readableId)
			})
			.select('*')
			.orderBy('id', 'desc'),
		name: await db('communities')
			.where({
				id: parseInt(params.readableId)
			})
			.select('name')[0]
	};
}
export const actions = {
	post: async (event) => {
		let b = Object.fromEntries(new URLSearchParams(await event.request.text()));
		let id = await checkJwt(b.authToken);
		if (id === false) {
			return { success: false, error: "You don't see to be logged in :(" };
		}
		let post = {
			id: generateId(),
			content: b.content,
			author: id,
			community: parseInt(event.params.readableId)
		};
		await db('posts').insert(post);
	}
};
