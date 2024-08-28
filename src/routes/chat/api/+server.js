import { json, error } from '@sveltejs/kit';
import { generateId } from '$lib/snowfake';
import { getPost, getUser } from '$lib/dba';
import { paramsToObject } from '$lib/SPObject.js';
import { checkJwt } from '$lib/token.js';

console.log(await getPost(0));

let chats = {
	1722375364264472: {
		400: {
			authorName: '!system!',
			content:
				'Anyone can access this chat, including communities that only got a replant of the original post'
		},
		600: {
			authorName: 'j',
			content: 'crazy how that all works'
		}
	}
};
export async function POST({ request }) {
	let b = await request.json();
	let up = paramsToObject(new URL(request.url).searchParams);
	let user = await getUser(await checkJwt(b.authToken));
	if (!user) {
		return json({ success: false });
	}
	if (!chats[up.chat]) {
		chats[up.chat] = {};
	}
	chats[up.chat][generateId()] = { authorName: user.username, content: b.content };
	return json({ success: true });
}
export async function GET({ request }) {
	let up = paramsToObject(new URL(request.url).searchParams);
	let newMessages = {};
	for (let i in chats[up.chat]) {
		if (i > parseInt(up.latest)) {
			newMessages[i] = chats[parseInt(up.chat)][i];
		}
	}
	return json({ new: newMessages });
}
