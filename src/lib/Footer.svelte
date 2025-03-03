<script>
	const year = new Date().getFullYear();
</script>

<footer class="bg-gray-100 pt-16 pb-6 mt-20">
	<div class="container mx-auto px-4">
		<div class="flex flex-col md:flex-row justify-between mb-12">
			<div class="mb-8 md:mb-0 md:w-1/3 pr-4">
				<h3 class="text-xl font-bold text-gray-800 mb-4">Fatih Nayebi</h3>
				<p class="text-gray-600 mb-4">
					Research Scientist focused on machine learning, AI, and human-computer interaction.
				</p>
			</div>
			
			<div class="flex flex-wrap md:w-2/3">
				<div class="w-1/2 md:w-1/3 mb-8">
					<h4 class="text-gray-800 font-semibold mb-4">Navigation</h4>
					<ul class="space-y-2">
						<li><a href="/" class="text-gray-600 hover:text-primary transition-colors">Home</a></li>
						<li><a href="/about" class="text-gray-600 hover:text-primary transition-colors">About</a></li>
						<li><a href="/research" class="text-gray-600 hover:text-primary transition-colors">Research</a></li>
						<li><a href="/publications" class="text-gray-600 hover:text-primary transition-colors">Publications</a></li>
					</ul>
				</div>
				
				<div class="w-1/2 md:w-1/3 mb-8">
					<h4 class="text-gray-800 font-semibold mb-4">Resources</h4>
					<ul class="space-y-2">
						<li><a href="/blog" class="text-gray-600 hover:text-primary transition-colors">Blog</a></li>
						<li><a href="/contact" class="text-gray-600 hover:text-primary transition-colors">Contact</a></li>
					</ul>
				</div>
				
				<div class="w-full md:w-1/3 mb-8">
					<h4 class="text-gray-800 font-semibold mb-4">Connect</h4>
					<div class="flex space-x-4">
						<a href="https://linkedin.com/in/thefatih" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" 
							class="text-gray-600 hover:text-primary transition-colors">LinkedIn</a>
						<a href="https://scholar.google.com/citations?user=s6lWpdEAAAAJ" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar" 
							class="text-gray-600 hover:text-primary transition-colors">Google Scholar</a>
						<a href="https://github.com/conqueror" target="_blank" rel="noopener noreferrer" aria-label="GitHub" 
							class="text-gray-600 hover:text-primary transition-colors">GitHub</a>
					</div>
				</div>
			</div>
		</div>
		
		<div class="border-t border-gray-200 pt-6 text-center text-gray-500 text-sm">
			<p>© {year} Fatih Nayebi. All rights reserved. | Built with SvelteKit and Tailwind CSS</p>
		</div>
	</div>
</footer>
