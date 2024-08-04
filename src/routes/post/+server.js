import { json } from '@sveltejs/kit';
import { getPost } from '$lib/dba.js';
import { paramsToObject } from '$lib/SPObject.js';
export async function GET({ request }) {
	let up = paramsToObject(new URL(request.url).searchParams);
	return json(await getPost(up.id));
}
