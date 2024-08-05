<script>
	import { sfTimestamp } from '$lib/snowfake.js';
	import dayjs from 'dayjs';
	import DJSRelativeTime from 'dayjs/plugin/relativeTime.js';
	dayjs.extend(DJSRelativeTime);
	const expandLength = 297;
	export let id;
	export let post;
	let expanded = false;
	function toggleExpand() {
		expanded = !expanded;
	}
</script>

<div class="post">
	<div class="author">
		{post.author} - {dayjs(sfTimestamp(post.id)).fromNow()}
	</div>
	{#if expanded}
		<div class="post">
			<div class="content">{post.content}</div>
			<button class="smallButton" on:click={toggleExpand}>show less</button>
		</div>
	{:else if post.content.length > expandLength + 100}
		<div class="content">
			<div id="post">{post.content.substring(0, expandLength)}...</div>
			<button class="smallButton" on:click={toggleExpand}>read more</button>
		</div>
	{:else}
		<div class="content">
			{post.content}
		</div>
	{/if}
	<div><a href="/replant/{post.id}">replant</a> - <a href="/chat/{post.id}">chat</a></div>
</div>

<style>
	.post {
		font-size: 1.25rem;
		padding: 0.2rem 0.4rem;
		margin-top: 0.4rem;
		width: 100%;
		box-sizing: border-box;
		background-color: hsl(0, 0%, 100%, 0.3);
	}
	.post .author {
		font-family: silkscreen, 'Courier New', Courier, monospace;
	}
	.post .content {
		white-space: pre-wrap;
		font-family: tiny5, 'Courier New', Courier, monospace;
		word-break: break-all;
	}
</style>
