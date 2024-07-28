import knex from 'knex';
const db = knex({
	client: 'better-sqlite3',
	connection: {
		filename: './db.sqlite'
	}
});
async function getUser(id) {
	return (await db('users').where({ id: id }).select('id', 'username', 'communities'))[0];
}
async function getCommunity(id) {
	return (
		await db('communities')
			.where({
				id: id
			})
			.select('*')
	)[0];
}
export { getUser, getCommunity };
