import { getPost, getUser } from '$lib/dba.js';
import { error } from '@sveltejs/kit';
export async function load({ params, cookies, url }) {
	let token = cookies.get('authToken');
	let post = await getPost(params.id);
	if (!post) {
		error(404, 'Post not found...');
	}
	post.author = (await getUser(post.author)).username;
	return { authToken: token, post: post, chat: params.id };
}
