import knex from 'knex';
import { generateId } from '$lib/snowfake.js';
import crypto from 'crypto';
import { redirect } from '@sveltejs/kit';
import { checkJwt, issueJwt } from '../lib/token';
import wordlist from '$lib/wordlist.json';
import { paramsToObject } from '$lib/SPObject.js';

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
export { _takePassphrase };
export const actions = {
	login: async (event) => {
		let b = paramsToObject(await event.request.text());
		console.log(b);
		let user = (
			await db('users')
				.where({ username: b.username, password: await sha256(b.password) })
				.select('*')
		)[0];
		if (user === undefined) {
			return {
				success: false,
				error: 'The username and/or passphrase you entered where incorrect'
			};
		}
		event.cookies.set('authToken', await issueJwt(user), { path: '/' });
		redirect(303, '/garden'); // integrate system (url parameter?) so actions that require login won't need extra navigation
	},
	signup: async (event) => {
		// password == passphrase
		let b = paramsToObject(await event.request.text());
		let username = b.username.toLowerCase();
		let password = generatePassphrase();
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
			password: await sha256(password), // this is only acceptable because all passphrases have >64 bits of security
			communities: {}
		};
		await db('users').insert(user);
		event.cookies.set('authToken', await issueJwt(user), { path: '/' });
		redirect(303, '/garden?onboard=' + givePassphrase(password));
	}
};
async function sha256(input) {
	return crypto.createHash('sha256').update(input).digest('base64url');
}
let passphraseMove = {}; // don't love this "solution"
function givePassphrase(passphrase) {
	let secretId = crypto.randomBytes(32).toString('base64url');
	passphraseMove[secretId] = passphrase;
	return secretId;
}
function _takePassphrase(id) {
	let passphrase = passphraseMove[id];
	passphraseMove[id] = 'Hope you saved it!';
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
