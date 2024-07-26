import * as jose from 'jose';
import { env } from '$env/dynamic/private';

export { checkJwt, issueJwt };

/**
 * @param {object} user the user object (including username and ID)
 * @returns the signed JWT
 */
async function issueJwt(user) {
	const secret = new TextEncoder().encode(env.JWT_PRIVATE_KEY);
	return await new jose.SignJWT({ user: user.id })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setAudience(user.username)
		.setExpirationTime('2w')
		.sign(secret);
}
/**
 * @param {sting} token the JWT
 * @returns the user ID contained by the now verified JWT
 */
async function checkJwt(token) {
	try {
		const secret = new TextEncoder().encode(env.JWT_PRIVATE_KEY);
		const { payload } = await jose.jwtVerify(token, secret);
		return payload.user;
	} catch {
		return false;
	}
}
