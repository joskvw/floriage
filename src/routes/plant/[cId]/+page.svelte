<script>
	import { sfTimestamp } from '$lib/snowfake.js';
	import Post from '$lib/Post.svelte';
	import dayjs from 'dayjs';
	import DJSRelativeTime from 'dayjs/plugin/relativeTime.js';
	dayjs.extend(DJSRelativeTime);
	export let data;
	export let form;
	function vacation() {
		prompt('How many days would you like to go for?');
	}
</script>

<div>
	<a href="/garden"><b>&#60;</b>back to the garden<b>&#62;</b></a>
	{#if data.posts}
		<h2>{data.name}</h2>
		<div class="horizontalButtonGroup">
			<button class="bigButton sMargin" id="vacationButton" on:click={vacation}>vacation</button>
			<form action="?/uproot" method="post">
				<input type="text" name="authToken" hidden value={data.authToken} />
				<button class="bigButton sMargin" id="uprootButton">uproot</button>
			</form>

			<button class="bigButton sMargin" id="activeDisplay">{dayjs(data.pc.expiry).fromNow()}</button
			>
		</div>
		<form action="?/invite" method="post">
			<input type="text" name="authToken" hidden value={data.authToken} />
			<button class="bigButton sMargin">create invite</button>
			{#if form && form.inviteId}
				<div class="sMargin">
					Your invite link: <small
						>https://oops.test/plant/1722295862951?invite={form.inviteId}</small
					>
				</div>
			{/if}
		</form>
		<div class="sMargin">
			<form method="post" action="?/post">
				<textarea placeholder="u should say something" name="content" />
				<br />
				<input type="text" name="authToken" hidden value={data.authToken} />
				{#if form && !form.success}
					<div class="error">{form.error}</div>
				{/if}
				<input type="submit" value="submit" class="bigButton" />
			</form>
		</div>
		<div class="sMargin">
			{#each data.posts as post}
				<Post {post} />
			{/each}
		</div>
	{:else if data.invite}
		<h3>You've received an invite to</h3>
		<h2>{data.name}</h2>
		<div>Would you like to accept it?</div>
		<form action="?/join" method="post">
			<input type="text" name="authToken" hidden value={data.authToken} />
			<input type="text" name="invite" hidden value={data.invite} />
			<button class="bigButton sMargin">Yes!</button>
		</form>
		<div>
			This invite expires next <b
				>{dayjs(sfTimestamp(data.invite)).add(7, 'day').format('dddd @ ha')}</b
			>
		</div>
	{:else}
		<h2>You'll need an invite to access this community</h2>
	{/if}
</div>

<style>
	textarea {
		aspect-ratio: 4/3;
		width: 100%;
		resize: none;
	}
	#vacationButton {
		background-color: hsla(320, 70%, 60%, 0.5);
	}
	#uprootButton {
		background-color: hsla(110, 70%, 60%, 0.5);
	}
	#activeDisplay {
		background-color: hsla(209, 77%, 23%, 0.5);
	}
</style>
