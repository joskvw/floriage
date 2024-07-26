<script>
	import dayjs from 'dayjs';
	export let data;
	export let form;
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
		{#each data.posts as post}
			<div class="post">
				<div class="author">
					{post.author} - {dayjs(post.id / 1000000).format('DD/MM/YYYY hh:mm')}
				</div>
				<div class="content">
					{post.content}
				</div>
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
		white-space: pre;
		font-family: 'Courier New', Courier, monospace;
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
