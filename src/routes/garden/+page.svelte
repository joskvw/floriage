<script>
	import dayjs from 'dayjs';
	import DJSRelativeTime from 'dayjs/plugin/relativeTime.js';
	dayjs.extend(DJSRelativeTime);
	export let data;
	export let form;
</script>

<div>Hey {data.user.username.toUpperCase()}!</div>
<h1>the garden</h1>
{#if data.passphrase}
	<div class="error">
		Please save your passphrase:
		<div><b><i>{data.passphrase}</i></b></div>
		You won't be able to login without it!
	</div>
{/if}
<h2>plant a seed!</h2>
<form action="?/createCommunity" method="post">
	<div class="horizontalButtonGroup">
		<input type="text" name="name" placeholder="community name" class="sMargin" />
		<input type="text" name="authToken" hidden value={data.authToken} />
		<button formaction="?/createCommunity" class="bigButton sMargin">create!</button>
	</div>
	{#if form && !form.success}
		<div class="error">{form.error}</div>
	{/if}
</form>
<h2>current plants:</h2>
<div>
	{#each Object.keys(data.user.communities) as cId}
		{#if data.user.communities[cId].name}
			<a href={'/plant/' + cId}>
				<h2>
					{data.user.communities[cId].name};
					<small>{dayjs(data.user.communities[cId].expiry).fromNow()}</small>
				</h2>
			</a>
		{/if}
	{/each}
</div>
