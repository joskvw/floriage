<script>
	import { page } from '$app/stores';
</script>

<h1>{$page.status}</h1>
<p><img src="/img/plants/404plantl.gif" class="bigPlant" /><br />{$page.error.message}</p>
<a href="/garden"><b>&#60;</b>back to the garden<b>&#62;</b></a>

<style>
	.bigPlant {
		width: 10ch;
		image-rendering: crisp-edges;
	}
	p {
		line-height: 1rem;
	}
</style>
