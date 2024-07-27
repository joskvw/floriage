import knex from 'knex';
import { checkJwt } from '$lib/token.js';
import { generateId } from '$lib/snowfake.js';
import { redirect } from '@sveltejs/kit';

const db = knex({
	client: 'better-sqlite3',
	connection: {
		filename: './db.sqlite'
	}
});
db.schema.hasTable('communities').then(async function (exists) {
	if (!exists) {
		return await db.schema.createTable('communities', (t) => {
			t.bigint('id'); // snowfake id
			t.text('name'); // community name
		});
	}
});

export async function load({ cookies }) {
	return { authToken: cookies.get('authToken') };
}
export const actions = {
	createCommunity: async (event) => {
		let b = Object.fromEntries(new URLSearchParams(await event.request.text()));
		let community = {
			id: generateId(),
			name: b.name
		};
		await db('communities').insert(community);
		throw redirect(303, `/plant/${community.id}`);
	}
};
