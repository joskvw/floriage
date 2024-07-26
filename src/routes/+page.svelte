<script>
	/*let username;
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
	}*/
	export let form;
	console.log(form);
</script>

<h1>floriage: login/signup</h1>
<div class="sMargin">
	<form method="post">
		<div class="horizontalButtonGroup">
			<!--TODO: make this work well with password managers & switch fields when "#" is pressed-->
			<input type="text" name="username" placeholder="username" class="sYMargin" />
			<span
				class="sYMargin"
				style="width: fit-content; text-align: right; background-color: white;"
			>
				#</span
			>
			<input
				type="text"
				name="discriminator"
				placeholder="42"
				class="sYMargin"
				style="width: 3ch;"
				maxlength="2"
				pattern="(\d\d)|(\d)"
			/>
		</div>
		<input type="password" name="password" placeholder="password" class="sYMargin" />
		{#if form && !form.success}
			<div class="error">{form.error}</div>
		{/if}
		<div class="horizontalButtonGroup">
			<button formaction="?/login" class="bigButton sMargin">login</button>
			<button formaction="?/signup" class="bigButton sMargin">signup</button>
		</div>
	</form>
</div>

<style>
	.error {
		color: hsl(0, 85%, 45%);
		font-size: 1.25rem;
	}
	.sYMargin {
		margin: 0.2rem 0;
	}
	form * {
		font-family: silkscreen, 'Courier New', Courier, monospace;
		font-size: 1.75rem;
	}
	form input {
		width: 100%;
	}
</style>
