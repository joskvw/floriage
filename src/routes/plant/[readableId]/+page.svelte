<script>
	export let data;
	console.log(data);
</script>

<div>
	<div class="horizontalButtonGroup">
		<button class="bigButton sMargin" id="vacationButton">vacation</button>
		<button class="bigButton sMargin" id="uprootButton">uproot</button>
		<button class="bigButton sMargin" id="activeDisplay">2 days</button>
	</div>
	<div class="editor">
		<form method="post">
			<textarea placeholder="u should say something" name="content" />
			<br />
			<input type="text" name="auth" hidden value={'test'} />
			<input type="submit" value="submit" class="bigButton" />
		</form>
	</div>
	<div>
		<div class="post">
			<div class="author">j</div>
			<div class="content">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Porro provident beatae temporibus
				laboriosam, ad consequatur ratione unde! Doloribus nobis totam nesciunt iste cupiditate
				dolore dolorum officiis repellendus voluptatum, esse exercitationem!
			</div>
		</div>
	</div>
</div>

<style>
	@font-face {
		font-family: 'Silkscreen';
		font-style: normal;
		font-weight: 400;
		font-display: block;
		src: url(/fonts/silkscreen.woff2) format('woff2');
		unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304,
			U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF,
			U+FFFD;
	}
	.post {
		font-size: 1.25rem;
		margin: 0.2rem 0.4rem;
		padding: 0.2rem 0.4rem;
		width: 100%;
		background-color: hsl(0, 0%, 100%, 0.3);
	}
	.post .author {
		font-family: silkscreen, 'Courier New', Courier, monospace;
	}
	.horizontalButtonGroup {
		display: flex;
	}
	.horizontalButtonGroup * {
		flex: auto;
	}
	.bigButton {
		font-size: 1.75rem;
		border: none;
		color: hsl(0, 0%, 5%);
		padding: 0.2rem 0.4rem;
		font-family: silkscreen, 'Courier New', Courier, monospace;
		text-align: center;
	}
	.sMargin {
		margin: 0.2rem 0.4rem;
	}
	.editor {
		padding: 0.2rem 0.4rem;
	}
	textarea {
		border: none;
		box-sizing: border-box;
		padding: 0.2rem 0.4rem;
		font-size: 1.25rem;
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
