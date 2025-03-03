<script>
	import { fade, fly, scale } from 'svelte/transition';
	import { spring } from 'svelte/motion';
	import AnimateInView from '$lib/AnimateInView.svelte';
	import AnimatedButton from '$lib/AnimatedButton.svelte';
	
	export let data;
	const { featuredPosts, featuredPublications } = data;
	
	// Animated count for a small stats section
	let count = spring(0, {
		stiffness: 0.1,
		damping: 0.6
	});
	
	// Set the count to 15 after a delay
	setTimeout(() => {
		count.set(15);
	}, 1000);
</script>

<!-- Hero Section -->
<section class="py-12 md:py-20 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-3xl mb-12" in:fade={{ duration: 1000 }}>
	<div class="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 px-4 md:px-10">
		<div class="w-full md:w-1/2 space-y-6">
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800" in:fly={{ y: 20, duration: 800, delay: 300 }}>Fatih Nayebi</h1>
			<h2 class="text-xl md:text-2xl text-gray-600 font-medium" in:fly={{ y: 20, duration: 800, delay: 500 }}>VP, Data & AI | Faculty Lecturer</h2>
			<p class="text-lg text-gray-600" in:fly={{ y: 20, duration: 800, delay: 700 }}>Bridging cutting-edge AI research with real-world impact at ALDO Group and McGill University</p>
			<div class="flex flex-wrap gap-4 pt-4" in:fly={{ y: 20, duration: 800, delay: 900 }}>
				<a href="/about" class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-6 py-3 text-base bg-primary text-white hover:bg-primary-hover">About Me</a>
				<a href="/contact" class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-6 py-3 text-base bg-white text-primary border border-primary hover:bg-gray-50">Get in Touch</a>
			</div>
		</div>
		<div class="w-full md:w-1/2 flex justify-center">
			<div class="relative" in:scale={{ start: 0.8, duration: 1000, delay: 300 }}>
				<div class="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full blur opacity-50"></div>
				<img src="/images/profile.jpeg" alt="Fatih Nayebi" class="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-white shadow-xl" />
			</div>
		</div>
	</div>
</section>

<!-- Quick Stats Section -->
<AnimateInView type="fade" delay={200}>
	<section class="py-8 mb-12 bg-white rounded-xl shadow-sm border border-gray-100">
		<div class="container mx-auto">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
				<div class="p-4">
					<div class="text-4xl font-bold text-primary mb-2">{Math.round($count)}+</div>
					<p class="text-gray-600">Publications & Books</p>
				</div>
				<div class="p-4">
					<div class="text-4xl font-bold text-primary mb-2">19+</div>
					<p class="text-gray-600">AI Products Deployed</p>
				</div>
				<div class="p-4">
					<div class="text-4xl font-bold text-primary mb-2">72+</div>
					<p class="text-gray-600">Mobile Apps Developed</p>
				</div>
			</div>
		</div>
	</section>
</AnimateInView>

<!-- Featured Work Section -->
<section class="py-16 bg-gradient-to-b from-gray-50 to-white rounded-2xl mb-16">
	<div class="container mx-auto px-4">
		<AnimateInView type="fade">
			<h2 class="text-3xl font-bold text-center mb-3">My Work</h2>
			<p class="text-gray-600 text-center max-w-2xl mx-auto mb-12">Exploring the boundaries of artificial intelligence through enterprise innovation, data strategy, and real-world applications.</p>
		</AnimateInView>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
			<!-- Research Work Card -->
			<AnimateInView type="fly" y={30} delay={100}>
				<a href="/research" class="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-1 block">
					<div class="h-36 bg-gradient-to-r from-blue-500 to-indigo-600 relative overflow-hidden">
						<div class="absolute inset-0 bg-blue-600 opacity-20 group-hover:opacity-0 transition-opacity duration-500"></div>
						<div class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-white opacity-20 absolute -bottom-6 -right-6 transform group-hover:scale-125 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
						</svg>
					</div>
					<div class="p-6 flex flex-col flex-grow">
						<div class="flex items-center mb-4">
							<div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
								</svg>
							</div>
							<h3 class="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">Research</h3>
						</div>
						
						<div class="space-y-3 mb-6 flex-grow">
							<div class="flex items-start">
								<span class="text-green-500 mr-2">•</span>
								<p class="text-gray-600">Machine Learning & Human-Computer Interaction</p>
							</div>
							<div class="flex items-start">
								<span class="text-green-500 mr-2">•</span>
								<p class="text-gray-600">Supply Chain Optimization</p>
							</div>
							<div class="flex items-start">
								<span class="text-green-500 mr-2">•</span>
								<p class="text-gray-600">Data & AI Strategy</p>
							</div>
						</div>
						
						<div class="mt-auto">
							<span class="inline-flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-500">
								Explore Research
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
							</span>
						</div>
					</div>
				</a>
			</AnimateInView>
			
			<!-- Publications Work Card -->
			<AnimateInView type="fly" y={30} delay={300}>
				<a href="/publications" class="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-1 block">
					<div class="h-36 bg-gradient-to-r from-purple-500 to-pink-600 relative overflow-hidden">
						<div class="absolute inset-0 bg-purple-600 opacity-20 group-hover:opacity-0 transition-opacity duration-500"></div>
						<div class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-white opacity-20 absolute -bottom-6 -right-6 transform group-hover:scale-125 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
						</svg>
					</div>
					<div class="p-6 flex flex-col flex-grow">
						<div class="flex items-center mb-4">
							<div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
							</div>
							<h3 class="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">Publications</h3>
						</div>
						
						<div class="space-y-3 mb-6 flex-grow">
							<div class="flex items-start">
								<span class="text-purple-500 mr-2">•</span>
								<p class="text-gray-600">Swift Functional Programming books</p>
							</div>
							<div class="flex items-start">
								<span class="text-purple-500 mr-2">•</span>
								<p class="text-gray-600">Research papers on machine learning</p>
							</div>
							<div class="flex items-start">
								<span class="text-purple-500 mr-2">•</span>
								<p class="text-gray-600">Mobile application usability evaluation</p>
							</div>
						</div>
						
						<div class="mt-auto">
							<span class="inline-flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-500">
								Browse Publications
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
							</span>
						</div>
					</div>
				</a>
			</AnimateInView>
			
			<!-- Consulting Work Card -->
			<AnimateInView type="fly" y={30} delay={500}>
				<a href="/consulting" class="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-1 block">
					<div class="h-36 bg-gradient-to-r from-green-500 to-teal-600 relative overflow-hidden">
						<div class="absolute inset-0 bg-green-600 opacity-20 group-hover:opacity-0 transition-opacity duration-500"></div>
						<div class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-white opacity-20 absolute -bottom-6 -right-6 transform group-hover:scale-125 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					</div>
					<div class="p-6 flex flex-col flex-grow">
						<div class="flex items-center mb-4">
							<div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
							</div>
							<h3 class="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">Consulting</h3>
						</div>
						
						<div class="space-y-3 mb-6 flex-grow">
							<div class="flex items-start">
								<span class="text-green-500 mr-2">•</span>
								<p class="text-gray-600">Data & AI strategy development</p>
							</div>
							<div class="flex items-start">
								<span class="text-green-500 mr-2">•</span>
								<p class="text-gray-600">Supply chain optimization</p>
							</div>
							<div class="flex items-start">
								<span class="text-green-500 mr-2">•</span>
								<p class="text-gray-600">Enterprise digital transformation</p>
							</div>
						</div>
						
						<div class="mt-auto">
							<span class="inline-flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-500">
								Learn More
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
							</span>
						</div>
					</div>
				</a>
			</AnimateInView>
		</div>
		
		<div class="flex justify-center mt-12">
			<a href="/about" class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-6 py-3 text-base bg-primary text-white hover:bg-primary-hover">
				Learn more about my work
			</a>
		</div>
	</div>
</section>

<!-- Featured Content -->
<AnimateInView type="fade">
	<section class="py-12 bg-gray-50 rounded-2xl px-4 md:px-8 mb-12">
		<div class="container mx-auto">
			<h2 class="text-3xl font-bold text-center mb-12">Featured Content</h2>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<!-- Featured Blog Posts -->
				<AnimateInView type="fly" x={-20} y={0}>
					<div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div class="flex items-center mb-6">
							<div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2h-2" />
								</svg>
							</div>
							<h2 class="text-2xl font-bold">Featured Blog Posts</h2>
						</div>
						<div class="space-y-8">
							{#if featuredPosts && featuredPosts.length > 0}
								{#each featuredPosts as post, i}
									<div class="border-b border-gray-200 pb-6 group" in:fly={{ x: -20, delay: i * 150, duration: 500 }}>
										<div class="text-sm text-gray-500 mb-2">{new Date(post.date).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})}</div>
										<h3 class="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
										<p class="text-gray-600 mb-3">{post.excerpt}</p>
										<a href={`/blog/${post.slug}`} class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-4 py-2 text-sm bg-transparent text-primary border border-primary hover:bg-primary hover:bg-opacity-10">
											Read post
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
											</svg>
										</a>
									</div>
								{/each}
							{:else}
								<div class="border-b border-gray-200 pb-6 group" in:fly={{ x: -20, duration: 500 }}>
									<div class="text-sm text-gray-500 mb-2">June 15, 2023</div>
									<h3 class="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">AI in Healthcare: Current Applications and Future Possibilities</h3>
									<p class="text-gray-600 mb-3">Exploring how artificial intelligence is transforming healthcare diagnosis, treatment, and patient care.</p>
									<a href="/blog" class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-4 py-2 text-sm bg-transparent text-primary border border-primary hover:bg-primary hover:bg-opacity-10">
										Read post
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
										</svg>
									</a>
								</div>
							{/if}
						</div>
						<div class="mt-8 text-center">
							<a href="/blog" class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-6 py-3 text-base bg-primary text-white hover:bg-primary-hover">
								View all blog posts
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
							</a>
						</div>
					</div>
				</AnimateInView>

				<!-- Featured Publications -->
				<AnimateInView type="fly" x={20} y={0}>
					<div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<div class="flex items-center mb-6">
							<div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
							</div>
							<h2 class="text-2xl font-bold">Featured Publications</h2>
						</div>
						<div class="space-y-8">
							{#if featuredPublications && featuredPublications.length > 0}
								{#each featuredPublications as publication, i}
									<div class="border-b border-gray-200 pb-6 group" in:fly={{ x: 20, delay: i * 150, duration: 500 }}>
										<div class="text-sm text-gray-500 mb-2">{new Date(publication.date).getFullYear()}</div>
										<h3 class="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{publication.title}</h3>
										<p class="text-sm text-gray-600 italic mb-3">{publication.journal || 'Journal of AI Research'}</p>
										<a href={`/publications/${publication.slug}`} class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-4 py-2 text-sm bg-transparent text-primary border border-primary hover:bg-primary hover:bg-opacity-10">
											View details
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
											</svg>
										</a>
									</div>
								{/each}
							{:else}
								<div class="border-b border-gray-200 pb-6 group" in:fly={{ x: 20, duration: 500 }}>
									<div class="text-sm text-gray-500 mb-2">2023</div>
									<h3 class="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Neural Network Architectures for Computer Vision</h3>
									<p class="text-sm text-gray-600 italic mb-3">Journal of AI Research</p>
									<a href="/publications" class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-4 py-2 text-sm bg-transparent text-primary border border-primary hover:bg-primary hover:bg-opacity-10">
										View details
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
										</svg>
									</a>
								</div>
							{/if}
						</div>
						<div class="mt-8 text-center">
							<a href="/publications" class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-6 py-3 text-base bg-primary text-white hover:bg-primary-hover">
								View all publications
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
							</a>
						</div>
					</div>
				</AnimateInView>
			</div>
		</div>
	</section>
</AnimateInView>
