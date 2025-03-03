<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

{#if visible}
<div in:fade={{ duration: 800 }} class="py-12">
	<h1 class="text-4xl font-bold mb-8 text-center text-primary">About Me</h1>

	<div class="flex flex-col-reverse md:flex-row gap-8 mb-10">
		<div class="md:w-3/5">
			<p class="text-lg mb-5 leading-relaxed">
				I'm Fatih Nayebi, a researcher focused on the intersection of machine learning, human-computer interaction, and software engineering. I'm particularly interested in how AI can enhance developer productivity and software quality.
			</p>
			<p class="text-lg mb-5 leading-relaxed">
				Currently, I'm a Research Scientist at Anthropic, where I work on developing AI systems that are helpful, harmless, and honest. Previously, I was a Research Scientist at GitHub Next, where I worked on AI-powered developer tools.
			</p>
			<p class="text-lg mb-5 leading-relaxed">
				When I'm not researching or coding, I enjoy hiking, photography, and exploring new coffee shops.
			</p>

			<div class="mt-8">
				<h3 class="text-xl font-semibold mb-3">Connect with me</h3>
				<ul class="flex flex-col md:flex-row gap-3 md:gap-5">
					<li><a href="https://linkedin.com/in/fatihnayebi" class="text-primary hover:underline font-medium">LinkedIn</a></li>
					<li><a href="https://twitter.com/fatihnayebi" class="text-primary hover:underline font-medium">Twitter</a></li>
					<li><a href="https://github.com/fatihnayebi" class="text-primary hover:underline font-medium">GitHub</a></li>
					<li><a href="https://scholar.google.com/citations?user=fatihnayebi" class="text-primary hover:underline font-medium">Google Scholar</a></li>
				</ul>
			</div>
		</div>

		<div class="md:w-2/5 flex flex-col items-center">
			<img src="/images/profile.jpeg" alt="Fatih Nayebi" class="w-full max-w-xs rounded-lg shadow-md mb-4">
			<div class="text-center">
				<p class="mb-1">Fatih Nayebi, Ph.D.</p>
				<p class="text-gray-600">Research Scientist @ Anthropic</p>
			</div>
		</div>
	</div>
</div>
{/if}
