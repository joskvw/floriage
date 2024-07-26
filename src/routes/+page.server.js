import knex from 'knex';
import { generateId } from '$lib/snowfake.js';
import crypto from 'crypto';
import { json } from '@sveltejs/kit';

const db = knex({
	client: 'better-sqlite3',
	connection: {
		filename: './db.sqlite'
	}
});

async function createTable() {
	await db.schema.createTable('users', (t) => {
		t.bigint('id'); // snowfake id: unix timestamp, then a 6 random digits
		t.text('username'); // username: can overlap in global db but not within a community (irc/discord-eque)
		t.text('password');
	});
}

export const actions = {
	login: async (event) => {
		console.log(Object.fromEntries(new URLSearchParams(await event.request.text())));
	},
	signup: async (event) => {
		let b = Object.fromEntries(new URLSearchParams(await event.request.text()));
		let username = b.username.toLowerCase();
		if (username.length > 16 || username.match(/^[a-z]/) === null || username === '') {
			return {
				success: false,
				error: 'Your username can only contain english letters and is limited to 16 characters'
			};
		}
		if (b.password.length < 8) {
			return {
				success: false,
				error: 'Your password must contain 8 or more characters'
			};
		}
		let user = {
			id: generateId(),
			username: username + '#' + crypto.randomInt(0, 99),
			password: await crypto.scryptSync(b.password, crypto.randomBytes(16), 64).toString('hex') // switch away from sync at some point
		};
		await db('users').insert(user);
		return await db('users')
			.where({
				id: user.id
			})
			.select('*');
	}
};
