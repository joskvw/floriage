import knex from 'knex';
import snowfake from '$lib/snowfake.js';

const db = knex({
	client: 'better-sqlite3',
	connection: {
		filename: './db.sqlite'
	}
});
export const actions = {
	login: async (event) => {
		console.log(Object.fromEntries(new URLSearchParams(await event.request.text())));
	},
	signup: async (event) => {
		let b = Object.fromEntries(new URLSearchParams(await event.request.text()));
		let user = {
			username: b.username
		};
	}
};
