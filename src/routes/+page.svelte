<script>
	let username;
	let publicPhrase = '';
	function randomSecretPhrase() {}
	async function digestMessage() {
		//https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
		const hashArray = Array.from(
			new Uint8Array(
				await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(username))
			)
		);
		const i = parseInt(hashArray[0] / 32);
		let phrases = [
			'When the last leaf turns',
			'At the precipice of a new season',
			"At earth's end",
			'As winter brings down branches',
			'As the stream rushes',
			'The flowers are in twilight',
			'Now the last stalk is felled',
			'A lone tree in the gales'
		];
		publicPhrase = phrases[i];
	}
</script>

<h1>floriage</h1>
<div class="sMargin">
	<h2 class="sMargin">login/signup</h2>
	<input
		type="text"
		name="name"
		placeholder="what's your username?"
		class="sMargin"
		bind:value={username}
	/>
	<br />
	<button class="bigButton sMargin" on:click={digestMessage}>Next</button>
	<br />
	{#if publicPhrase !== ''}
		<div>{publicPhrase}</div>
		<form method="post">
			<input type="text" name="name" placeholder="enter your passphrase" class="sMargin" />
			<br />
			<input type="submit" class="bigButton sMargin" value="login" />
		</form>
	{/if}
	<br />
</div>

<style>
</style>
