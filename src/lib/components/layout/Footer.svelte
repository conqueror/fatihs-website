<script>
	import FooterIcon from '$lib/components/ui/FooterIcon.svelte';
	const year = new Date().getFullYear();
	
	// Map icons to links for easy reference
	const navIcons = {
		'Home': 'home',
		'About': 'about',
		'Research': 'research',
		'Publications': 'publications'
	};
	
	const resourceIcons = {
		'Blog': 'blog',
		'Events': 'events',
		'Contact': 'contact',
		'Search': 'search',
		'Privacy Policy': 'privacy'
	};
	
	const connectIcons = {
		'LinkedIn': 'linkedin',
		'Google Scholar': 'scholar',
		'GitHub': 'github'
	};
</script>

<footer class="bg-gray-100 dark:bg-gray-900 dark:border-t dark:border-gray-800 pt-16 pb-6 mt-20">
	<div class="container mx-auto px-4">
		<div class="flex flex-col md:flex-row justify-between mb-12">
			<div class="mb-8 md:mb-0 md:w-1/3 pr-4">
				<h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Dr. Fatih Nayebi</h3>
				<p class="text-gray-600 dark:text-gray-300 mb-4">
					Research Scientist focused on machine learning, AI, and human-computer interaction.
				</p>
			</div>
			
			<div class="flex flex-wrap md:w-2/3">
				<div class="w-1/2 md:w-1/3 mb-8">
					<h4 class="text-gray-800 dark:text-gray-100 font-semibold mb-4">Navigation</h4>
					<ul class="space-y-2">
						{#each Object.entries(navIcons) as [name, icon]}
							<li>
								<a href="/{name.toLowerCase() === 'home' ? '' : name.toLowerCase()}" 
									class="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors group">
									<FooterIcon name={icon} size={16} />
									<span class="ml-2">{name}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
				
				<div class="w-1/2 md:w-1/3 mb-8">
					<h4 class="text-gray-800 dark:text-gray-100 font-semibold mb-4">Resources</h4>
					<ul class="space-y-2">
						{#each Object.entries(resourceIcons) as [name, icon]}
							<li>
								<a href={name === 'Privacy Policy' ? '/privacy' : '/' + name.toLowerCase().replace(' ', '-')} 
									class="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors group">
									<FooterIcon name={icon} size={16} />
									<span class="ml-2">{name}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
				
				<div class="w-full md:w-1/3 mb-8">
					<h4 class="text-gray-800 dark:text-gray-100 font-semibold mb-4">Connect</h4>
					<ul class="space-y-2">
						{#each Object.entries(connectIcons) as [name, icon]}
							<li>
								<a href={name === 'LinkedIn' ? 'https://linkedin.com/in/thefatih' : 
										name === 'Google Scholar' ? 'https://scholar.google.com/citations?user=s6lWpdEAAAAJ' : 
										'https://github.com/conqueror'} 
									target="_blank" 
									rel="noopener noreferrer"
									class="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors group">
									<FooterIcon name={icon} size={16} />
									<span class="ml-2">{name}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
		
		<div class="border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
			<p>© {year} Dr. Fatih Nayebi. All rights reserved. | Built with SvelteKit and Tailwind CSS</p>
		</div>
	</div>
</footer>
