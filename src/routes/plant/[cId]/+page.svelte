<script>
	import dayjs from 'dayjs';
	import DJSRelativeTime from 'dayjs/plugin/relativeTime.js';
	dayjs.extend(DJSRelativeTime);
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
	function vacation() {
		prompt('How many days would you like to go for?');
	}
</script>

<div>
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
	{:else}<!-- if data.invite-->
		<h3>You've received an invite to</h3>
		<h2>{data.name}</h2>
		<div>Would you like to accept it?</div>
		<form action="?/join" method="post">
			<input type="text" name="authToken" hidden value={data.authToken} />
			<input type="text" name="invite" hidden value={data.invite} />
			<button class="bigButton sMargin">Yes!</button>
		</form>
		<div>
			This invite expires next <b>{dayjs(data.invite).add(7, 'day').format('dddd @ ha')}</b>
		</div>
	{/if}
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
