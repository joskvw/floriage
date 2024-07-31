import { getPost } from '$lib/dba.js';
export async function load({ params, cookies, url }) {
	let token = cookies.get('authToken');
	return { authToken: token, post: await getPost(params.id), chat: params.id };
}
