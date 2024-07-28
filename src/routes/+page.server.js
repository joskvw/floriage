import knex from 'knex';
import { generateId } from '$lib/snowfake.js';
import crypto from 'crypto';
import { redirect } from '@sveltejs/kit';
import { checkJwt, issueJwt } from '../lib/token';
import wordlist from '$lib/wordlist.json';

const db = knex({
	client: 'better-sqlite3',
	connection: {
		filename: './db.sqlite'
	}
});
db.schema.hasTable('users').then(async function (exists) {
	if (!exists) {
		return await db.schema.createTable('users', (t) => {
			t.bigint('id'); // snowfake id: unix timestamp, then a 6 random digits
			t.text('username'); // username: can be non-unique
			t.text('password'); // hashed password
			t.json('communities'); // weird-ish way to do things, format displayed below
			/*
			{
				<community ID>:{
					activeExpire: <unix timestamp: when the user will be kicked from the community>,
					vacationExpire: <unix timestamp: when the user's vacation will end and they will be allowed to post again community>
				}
			}
			*/
		});
	}
});
export const actions = {
	login: async (event) => {
		console.log(Object.fromEntries(new URLSearchParams(await event.request.text())));
	},
	signup: async (event) => {
		let b = Object.fromEntries(new URLSearchParams(await event.request.text()));
		let username = b.username.toLowerCase();
		let password = generatePassphrase();
		console.log(password);
		if (username === '') {
			return {
				success: false,
				error: "Just enter a username to signup; we'll give you a passphrase"
			};
		}
		if (username.length > 16 || username.match(/[^a-z]/) !== null) {
			return {
				success: false,
				error: 'Your username can only contain english letters and is limited to 16 characters'
			};
		}
		let user = {
			id: generateId(),
			username: username,
			password: await crypto.scryptSync(password, crypto.randomBytes(16), 64).toString('hex') // switch away from sync at some point
		};
		await db('users').insert(user);
		event.cookies.set('authToken', await issueJwt(user), { path: '/' });
		throw redirect(303, '/garden?onboard=' + givePassphrase(passphrase));
	}
};
passphraseMove = {}; // don't love this "solution"
function givePassphrase(passphrase) {
	let secretId = crypto.randomInt(Number.MAX_SAFE_INTEGER);
	passphraseMove[secretId] = passphrase;
	return secretId;
}
export { _takePassphrase };
function _takePassphrase(id) {
	let passphrase = passphraseMove[parseInt(id)];
	passphraseMove[parseInt(id)] = 'INVALID';
	return passphrase;
}
function generatePassphrase(length) {
	length ??= 5;
	let passphrase = '';
	for (let i = 0; i < length; i++) {
		passphrase += wordlist[crypto.randomInt(wordlist.length)] + ' ';
	}
	return passphrase.substring(0, passphrase.length - 1);
}
