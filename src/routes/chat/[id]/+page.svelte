<script>
	import { onMount } from 'svelte';
	export let data;
	let latest = 0;
	let chat = [];
	onMount(async () => {
		setInterval(async () => {
			let newMessages = (await (await fetch(`/chat/api?chat=${data.chat}&latest=${latest}`)).json())
				.chat;
			for (let i in newMessages) {
				let msg = newMessages[i];
				let msgEle = document.createElement('div');
				msgEle.class = 'message';
				msgEle.innerHTML = msg.content;
				document.getElementById('chat').prepend(msgEle);
			}
			latest = Object.keys(newMessages)[Object.keys(newMessages).length - 1];
		}, 200);
	});
</script>

<div class="post"></div>
<div class="messageBox">
	<input type="text" placeholder="message" />
	<button>send</button>
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
