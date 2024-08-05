<script>
	import { onMount } from 'svelte';
	import Post from '$lib/Post.svelte';
	export let data;
	let latest = 0;
	let chat = [];
	let message = '';
	let messageBoxError = '';
	onMount(async () => {
		document.getElementById('chat').innerHTML = '';
		setInterval(async () => {
			let newMessages = (await (await fetch(`/chat/api?chat=${data.chat}&latest=${latest}`)).json())
				.new;
			for (let i in newMessages) {
				let msg = newMessages[i];
				let msgEle = document.createElement('div');
				msgEle.class = 'message';
				msgEle.innerHTML = msg.content;
				document.getElementById('chat').prepend(msgEle);
			}
			console.log(Date.now() + Object.keys(newMessages)[Object.keys(newMessages).length - 1]);
			if (Object.keys(newMessages).length !== 0) {
				latest = Object.keys(newMessages)[Object.keys(newMessages).length - 1];
			}
		}, 200);
	});
	async function sendMessage() {
		if (
			(
				await (
					await fetch(`/chat/api?chat=${data.chat}`, {
						method: 'POST',
						body: JSON.stringify({ content: message, authToken: data.authToken })
					})
				).json()
			).success
		) {
			message = '';
		}
	}
</script>

<div><Post post={data.post} /></div>
<br />
<div class="messageBox">
	<input type="text" placeholder="message" bind:value={message} />
	<button on:click={sendMessage}>send</button>
</div>
<div id="chat" class="sMargin"></div>

<style>
	.messageBox * {
		font-family: tiny5, monospace;
		margin: none;
		font-size: 1.25rem;
	}
	button {
		border: none;
		padding: 0.2rem 0.4rem;
	}
</style>
