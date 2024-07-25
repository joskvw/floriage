import knex from 'knex';
import snowfake from '$lib/snowfake.js';

const db = knex({
	client: 'better-sqlite3',
	connection: {
		filename: './db.sqlite'
	}
});

async function createTables() {
	await db.schema.createTable('users', (t) => {
		t.bigint('id'); // snowfake id: unix timestamp, then a 6 random digits
		t.text('username'); // username: can overlap in global db but not within a community (irc rules)
	});
	await db.schema.createTable('communities', (t) => {
		t.bigint('id'); // snowfake id
	});
	await db.schema.createTable('posts', (t) => {
		t.bigint('id'); // snowfake id
		t.text('content'); // textual content of the post
		t.bigint('author'); // the authors id
		t.bigint('community'); // the community id
	});
}

export async function load({ params, cookies }) {
	params.readableId;
	return {
		posts: await db('posts')
			.where({
				community: params.readableId
			})
			.select('*')
			.orderBy('id', 'desc')
	};
}
export const actions = {
	post: async (event) => {
		let b = Object.fromEntries(new URLSearchParams(await event.request.text()));
		let post = {
			id: snowfake.generateId(),
			content: b.content,
			author: 42,
			community: parseInt(event.params.readableId)
		};
		await db('posts').insert(post);
	}
};
