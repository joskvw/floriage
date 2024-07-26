import crypto from 'crypto';
export { generateId };
function generateId() {
	return parseInt(`${parseInt(Date.now() / 1000)}${crypto.randomInt(100, 999)}`);
}
