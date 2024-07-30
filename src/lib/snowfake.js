import crypto from 'crypto';
export { generateId, sfTimestamp };
function generateId() {
	return parseInt(`${parseInt(Date.now() / 1000)}${crypto.randomInt(100000, 999999)}`);
}
function sfTimestamp(id) {
	return id / 1000;
}
