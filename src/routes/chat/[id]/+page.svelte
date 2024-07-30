<script>
	export let data;
	console.log(data);
	let chat = [];
</script>

{#each chat as m}
	<div class="message"><b>{m.authorName}</b>: {m.content}</div>
	<hr />
{/each}
