import crypto from 'crypto';
export { generateId };
function generateId() {
	return parseInt(`${Date.now()}${crypto.randomInt(100000, 999999)}`);
}
