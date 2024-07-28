import knex from 'knex';
import { checkJwt } from '$lib/token.js';
import { generateId } from '$lib/snowfake.js';
import { redirect } from '@sveltejs/kit';
import { takePassphrase } from '../+page.server.js';
import { paramsToObject } from '$lib/SPObject.js';
import { getUser } from '$lib/dba.js';

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

export async function load({ cookies, url }) {
	let token = cookies.get('authToken');
	let d = {
		authToken: token,
		user: await getUser(await checkJwt(token))
	};
	if (paramsToObject(url.searchParams).onboard) {
		d.passphrase = takePassphrase(paramsToObject(url.searchParams).onboard);
	}
	return d;
}
export const actions = {
	createCommunity: async (event) => {
		let b = paramsToObject(await event.request.text());
		let community = {
			id: generateId(),
			name: b.name
		};
		await db('communities').insert(community);
		throw redirect(303, `/plant/${community.id}`);
	}
};
