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
<div id="chat"></div>
