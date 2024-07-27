<script>
	export let data;
	export let form;
	let onboarding = true; // change to url thing at some point
</script>

<h1>the garden</h1>
<h2>plant a seed!</h2>
<form action="?/createCommunity" method="post">
	<div class="horizontalButtonGroup">
		<input type="text" name="name" placeholder="community name" class="sMargin" />
		<button formaction="?/createCommunity" class="bigButton sMargin">create!</button>
		<input type="text" name="authToken" hidden value={data.authToken} />
	</div>
	{#if form && !form.success}
		<div class="error">{form.error}</div>
	{/if}
</form>
<h2>current plants:</h2>
<button class="bigButton">(community name here)</button>
