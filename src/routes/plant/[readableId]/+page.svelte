<script>
	import dayjs from 'dayjs';
	export let data;
	export let form;
	const expandLength = 297;
	const dotdotdot = '...';
	function togglePost(i, content) {
		if (document.getElementById('post-' + i).innerText.length === expandLength + dotdotdot.length) {
			document.getElementById('post-' + i).innerText = content;
			document.getElementById('expand-' + i).innerText = 'show less';
		} else {
			document.getElementById('expand-' + i).innerText = 'read more';
			document.getElementById('post-' + i).innerText =
				content.substring(0, expandLength) + dotdotdot;
		}
	}
</script>

<div>
	<h2>{data.name}</h2>
	<div class="horizontalButtonGroup">
		<button class="bigButton sMargin" id="vacationButton">vacation</button>
		<button class="bigButton sMargin" id="uprootButton">uproot</button>
		<button class="bigButton sMargin" id="activeDisplay">2 days</button>
	</div>
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
		{#each data.posts as post, i}
			<div class="post">
				<div class="author">
					{post.author} - {dayjs(post.id).format('DD/MM/YYYY hh:mm')}
				</div>
				{#if post.content.length > expandLength + 100}
					<div class="content">
						<div id="post-{i}">{post.content.substring(0, expandLength)}{dotdotdot}</div>
						<button
							class="smallButton"
							id="expand-{i}"
							on:click={() => {
								togglePost(i, post.content);
							}}>read more</button
						>
					</div>
				{:else}
					<div class="content">
						{post.content}
					</div>
				{/if}
			</div>
		{/each}
	</div>
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
