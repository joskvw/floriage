import knex from 'knex';
import { checkJwt } from '$lib/token.js';
import { generateId } from '$lib/snowfake.js';
import { redirect } from '@sveltejs/kit';
import { _takePassphrase } from '../+page.server.js';
import { paramsToObject } from '$lib/SPObject.js';
import { getUser, getCommunity } from '$lib/dba.js';
import dayjs from 'dayjs';

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
	d.user.communities = JSON.parse(d.user.communities);
	for (let id in d.user.communities) {
		let expiry = d.user.communities[id].expiry;
		d.user.communities[id] = await getCommunity(id);
		if (d.user.communities[id]) {
			d.user.communities[id].expiry = expiry;
		} else {
			delete d.user.communities[id];
		}
	}
	if (paramsToObject(url.searchParams).onboard) {
		d.passphrase = _takePassphrase(paramsToObject(url.searchParams).onboard);
	}
	return d;
}
export const actions = {
	createCommunity: async (event) => {
		let b = paramsToObject(await event.request.text());
		let user = await getUser(await checkJwt(b.authToken));
		if (!user) {
			error(403, "You aren't logged in...");
		}
		user.communities = JSON.parse(user.communities);
		let community = {
			id: generateId(),
			name: b.name
		};
		user.communities[community.id] = { expiry: dayjs().add(7, 'day').valueOf() };
		await db('users')
			.where({ id: user.id })
			.update({ communities: JSON.stringify(user.communities) });
		await db('communities').insert(community);
		redirect(303, `/plant/${community.id}`);
	}
};
