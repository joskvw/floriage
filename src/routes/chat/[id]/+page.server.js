import { getPost } from '$lib/dba.js';
let chats = {
	0: [
		{
			authorName: '!system!',
			content:
				'Anyone can access this chat, including communities that only got a replant of the original post'
		},
		{
			authorName: 'j',
			content: 'crazy how that all works'
		}
	]
};
export async function load({ params, cookies, url }) {
	let token = cookies.get('authToken');

	return { authToken: token, post: await getPost() };
}
