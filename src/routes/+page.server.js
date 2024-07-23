export const actions = {
	default: async (event) => {
		console.log(Object.fromEntries(new URLSearchParams(await event.request.text())));
	}
};
