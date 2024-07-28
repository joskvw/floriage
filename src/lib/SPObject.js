function paramsToObject(pText) {
	return Object.fromEntries(new URLSearchParams(pText));
}
export { paramsToObject };
