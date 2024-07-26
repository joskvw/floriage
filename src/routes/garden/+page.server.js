import { checkJwt } from '$lib/token.js';
export async function load({ cookies }) {
	console.log(cookies.get('authToken'));
	console.log(await checkJwt(cookies.get('authToken')));
}
