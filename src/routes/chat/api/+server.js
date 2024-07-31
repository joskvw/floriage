import { json } from '@sveltejs/kit';
import { generateId } from '$lib/snowfake';
import { getPost, getUser } from '$lib/dba';
import { paramsToObject } from '$lib/SPObject.js';

console.log(await getPost(0));

let chats = {
	0: {
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
	let user = await getUser(await checkJwt(b.authToken));
	chats[b.chat][generateId()] = { authorName: user.username, content: b.content };
	return json({ success: true });
}
export async function GET({ request }) {
	let up = paramsToObject(new URL(request.url).searchParams);
	let chat = up.chat;
	let latest = up.latest;
	return json({ chat: chats[chat] });
}
