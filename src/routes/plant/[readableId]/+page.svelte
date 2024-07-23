<div>
	<div class="horizontalButtonGroup">
		<button class="bigButton" id="vacationButton">vacation</button>
		<button class="bigButton" id="uprootButton">uproot</button>
		<span class="bigButton" id="activeDisplay">you have 2 days</span>
	</div>
	<div>
		<form method="post">
			<textarea placeholder="u should say something" /><br /><input
				type="submit"
				value="submit"
				class="bigButton"
			/>
		</form>
	</div>
	<div>
		<div class="post">
			<b>j</b><br />Lorem ipsum dolor sit amet consectetur, adipisicing elit. Porro provident beatae
			temporibus laboriosam, ad consequatur ratione unde! Doloribus nobis totam nesciunt iste
			cupiditate dolore dolorum officiis repellendus voluptatum, esse exercitationem!
		</div>
	</div>
</div>

<style>
	@font-face {
		font-family: silkscreen;
		src: url('/fonts/silkscreen.woff2');
	}
	@font-face {
		font-family: 'Silkscreen';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/s/silkscreen/v4/m8JXjfVPf62XiF7kO-i9YL1la1OD.woff2)
			format('woff2');
		unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020,
			U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
	}
	.post {
		font-size: 1.25rem;
		border: none;
		padding: 0.2rem 0.4rem;
		margin: 0.2rem 0.4rem;
		width: 100%;
		background-color: hsl(0, 0%, 100%, 0.3);
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
		margin: 0.2rem 0.4rem;
		font-family: Silkscreen, 'Courier New', Courier, monospace;
	}
	textarea {
		margin: 0.2rem 0.4rem;
		font-size: 1.25rem;
		aspect-ratio: 4/3;
		width: 100%;
		resize: none;
	}
	input {
		margin: 0.2rem 0.4rem;
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
