import { knex } from 'knex';
const db = knex({
	client: 'better-sqlite3',
	connection: {
		filename: '../../../../db.sqlite'
	}
});
async () => {
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
	});
};

export function load({ params, cookies }) {
	params.readableId;
	return {
		posts: {}
	};
}
export const actions = {
	default: async (event) => {
		console.log(Object.fromEntries(new URLSearchParams(await event.request.text())));
	}
};
