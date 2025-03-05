<script>
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { spring } from 'svelte/motion';
	import AnimateInView from '$lib/AnimateInView.svelte';
	import AnimatedButton from '$lib/AnimatedButton.svelte';
	import Image from '$lib/components/Image.svelte';
	
	export let data;
	const { featuredPosts, featuredPublications, redirectedBlogPost } = data;
	
	// Animated count for a small stats section
	let count = spring(0, {
		stiffness: 0.1,
		damping: 0.6
	});
	
	// Set the count to 15 after a delay
	setTimeout(() => {
		count.set(15);
	}, 1000);

	// Controls initial loading animation
	let visible = false;
	
	onMount(() => {
		visible = true;
	});
</script>

<style>
	/* Responsive image styling */
	.profile-image-container {
		aspect-ratio: 1/1;
		width: 600px;
		max-width: 600px;
		height: 600px;
		margin: 0 auto;
		position: relative;
		border-radius: 1rem;
		overflow: hidden;
	}
	
	/* Text overlay styling */
	.text-shadow {
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}
	
	/* Mobile-specific adjustments */
	@media (max-width: 768px) {
		.profile-image-container {
			width: 100%;
			max-width: 100%;
			height: auto;
			aspect-ratio: 1/1;
		}
	}
</style>

{#if visible}
<!-- Hero Section -->
<section in:fade={{ duration: 800 }} class="relative py-16 md:py-24 overflow-hidden">
	<div class="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 z-0"></div>
	
	<!-- Decorative elements -->
	<div class="absolute top-20 right-10 w-72 h-72 bg-primary/10 dark:bg-blue-500/10 rounded-full blur-3xl z-0"></div>
	<div class="absolute bottom-40 left-10 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl z-0"></div>
	
	<div class="container mx-auto px-4 relative z-10">
		<div class="flex flex-col md:flex-row items-center justify-between">
			<div class="md:w-1/2 mb-12 md:mb-0">
				<h1 class="text-4xl md:text-6xl font-bold leading-tight mb-6 text-gray-800 dark:text-gray-100" in:fly={{ y: -30, duration: 800, delay: 300 }}>
					Data & AI Leader, <span class="text-primary dark:text-blue-400">Innovator</span>, and Educator
				</h1>
				<p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8" in:fly={{ y: 30, duration: 800, delay: 500 }}>
					Transforming business through data-driven technology and artificial intelligence
				</p>
				<div class="flex flex-wrap gap-4" in:fly={{ y: 30, duration: 800, delay: 700 }}>
					<a href="/contact" class="px-8 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition duration-300 transform hover:scale-105">
						Get in Touch
					</a>
					<a href="/about" class="px-8 py-3 bg-white dark:bg-gray-800 text-primary dark:text-blue-400 border border-primary dark:border-blue-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 transform hover:scale-105">
						About Me
					</a>
				</div>
			</div>
			<div class="md:w-1/2" in:scale={{ duration: 800, delay: 400, start: 0.8 }}>
				<div class="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500">
					<div class="profile-image-container">
						<Image 
							src="/images/profile.avif" 
							alt="Fatih Nayebi"
							className="profile-image"
							width={600}
							height={600}
							square={true}
						/>
						
						<!-- Text placed directly on image with text shadow for readability -->
						<div class="absolute bottom-5 left-5 text-left text-white z-10">
							<h2 class="text-xl md:text-2xl font-bold leading-none mb-1 text-shadow">Fatih Nayebi, Ph.D.</h2>
							<p class="text-sm md:text-base leading-tight text-shadow">VP, Data & AI at ALDO Group</p>
							<p class="text-xs md:text-sm leading-tight text-shadow">Faculty Lecturer, McGill University</p>
						</div>
					</div>
				</div>
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
					<div class="text-4xl font-bold text-primary mb-2">7+</div>
					<p class="text-gray-600">Publications & Books</p>
				</div>
				<div class="p-4">
					<div class="text-4xl font-bold text-primary mb-2">21+</div>
					<p class="text-gray-600">AI Products Released</p>
				</div>
				<div class="p-4">
					<div class="text-4xl font-bold text-primary mb-2">72+</div>
					<p class="text-gray-600">Apps Developed</p>
				</div>
			</div>
		</div>
	</section>
</AnimateInView>

<!-- My Work Section -->
<section class="py-16 bg-gray-50 dark:bg-gray-900">
	<div class="container mx-auto px-4">
		<h2 class="text-3xl md:text-4xl font-bold mb-12 text-center text-primary dark:text-blue-400">My Work</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- Enterprise AI -->
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
				<div class="p-3 bg-primary/10 dark:bg-blue-900/30 w-16 h-16 rounded-lg mb-4 flex items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-primary dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
					</svg>
				</div>
				<h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Enterprise AI</h3>
				<p class="text-gray-600 dark:text-gray-300 mb-4">
					Leading data-driven transformation at ALDO Group. Building advanced analytics capabilities and AI-powered solutions that drive business value.
				</p>
				<a href="/research" class="text-primary dark:text-blue-400 font-medium flex items-center transition duration-300 transform hover:scale-105">
					Explore Enterprise AI Research
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
					</svg>
				</a>
			</div>
			
			<!-- Academic Research -->
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
				<div class="p-3 bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-lg mb-4 flex items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path d="M12 14l9-5-9-5-9 5 9 5z" />
						<path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
					</svg>
				</div>
				<h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Academic Research</h3>
				<p class="text-gray-600 dark:text-gray-300 mb-4">
					Conducting research in data science, AI ethics, machine learning applications, and software engineering. Published in top journals and conferences.
				</p>
				<a href="/publications" class="text-indigo-600 dark:text-indigo-400 font-medium flex items-center transition duration-300 transform hover:scale-105">
					View publications
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
					</svg>
				</a>
			</div>
			
			<!-- Education -->
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
				<div class="p-3 bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-lg mb-4 flex items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
				</div>
				<h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Education</h3>
				<p class="text-gray-600 dark:text-gray-300 mb-4">
					Teaching the next generation of data scientists at McGill University. Courses on enterprise data science, machine learning, AI engineering, and more.
				</p>
				<a href="/about" class="text-purple-600 dark:text-purple-400 font-medium flex items-center transition duration-300 transform hover:scale-105">
					My background
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
					</svg>
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Featured Content -->
<AnimateInView type="fade">
	<section class="py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 md:px-8 mb-12">
		<div class="container mx-auto">
			<h2 class="text-3xl font-bold text-center mb-12 dark:text-gray-100">Featured Content</h2>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<!-- Featured Blog Posts -->
				<AnimateInView type="fly" x={-20} y={0}>
					<div class="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
						<div class="flex items-center mb-6">
							<div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2h-2" />
								</svg>
							</div>
							<h2 class="text-2xl font-bold dark:text-gray-100">Featured Blog Posts</h2>
						</div>
						<div class="space-y-8">
							{#if redirectedBlogPost}
								<div class="border-b border-gray-200 dark:border-gray-700 pb-6 group" in:fly={{ x: -20, duration: 500 }}>
									<div class="text-sm text-gray-500 dark:text-gray-400 mb-2">{new Date(redirectedBlogPost.date).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}</div>
									<h3 class="text-lg font-semibold mb-2 group-hover:text-primary dark:text-gray-200 dark:group-hover:text-primary transition-colors">{redirectedBlogPost.title}</h3>
									<p class="text-gray-600 dark:text-gray-300 mb-3">{redirectedBlogPost.excerpt}</p>
									<a href={`/blog/${redirectedBlogPost.slug}`} class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-4 py-2 text-sm bg-transparent text-primary dark:text-blue-400 border border-primary dark:border-blue-400 hover:bg-primary/10 hover:text-primary dark:hover:bg-blue-900/30 dark:hover:text-white transform hover:scale-105">
										Read post
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
										</svg>
									</a>
								</div>
							{:else}
								{#if featuredPosts && featuredPosts.length > 0}
									{#each featuredPosts as post, i}
										<div class="border-b border-gray-200 dark:border-gray-700 pb-6 group" in:fly={{ x: -20, delay: i * 150, duration: 500 }}>
											<div class="text-sm text-gray-500 dark:text-gray-400 mb-2">{new Date(post.date).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})}</div>
											<h3 class="text-lg font-semibold mb-2 group-hover:text-primary dark:text-gray-200 dark:group-hover:text-primary transition-colors">{post.title}</h3>
											<p class="text-gray-600 dark:text-gray-300 mb-3">{post.excerpt}</p>
											<a href={`/blog/${post.slug}`} class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-4 py-2 text-sm bg-transparent text-primary dark:text-blue-400 border border-primary dark:border-blue-400 hover:bg-primary/10 hover:text-primary dark:hover:bg-blue-900/30 dark:hover:text-white transform hover:scale-105">
												Read post
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
												</svg>
											</a>
										</div>
									{/each}
								{:else}
									<div class="border-b border-gray-200 dark:border-gray-700 pb-6 group" in:fly={{ x: -20, duration: 500 }}>
										<div class="text-sm text-gray-500 dark:text-gray-400 mb-2">June 15, 2023</div>
										<h3 class="text-lg font-semibold mb-2 group-hover:text-primary dark:text-gray-200 dark:group-hover:text-primary transition-colors">AI in Healthcare: Current Applications and Future Possibilities</h3>
										<p class="text-gray-600 dark:text-gray-300 mb-3">Exploring how artificial intelligence is transforming healthcare diagnosis, treatment, and patient care.</p>
										<a href="/blog" class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-4 py-2 text-sm bg-transparent text-primary dark:text-blue-400 border border-primary dark:border-blue-400 hover:bg-primary/10 hover:text-primary dark:hover:bg-blue-900/30 dark:hover:text-white transform hover:scale-105">
											Read post
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
											</svg>
										</a>
									</div>
								{/if}
							{/if}
						</div>
						<div class="mt-8 text-center">
							<a href="/blog" class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-6 py-3 text-base bg-primary text-white hover:bg-primary-hover transform hover:scale-105">
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
					<div class="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
						<div class="flex items-center mb-6">
							<div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
							</div>
							<h2 class="text-2xl font-bold dark:text-gray-100">Featured Publications</h2>
						</div>
						<div class="space-y-8">
							{#if featuredPublications && featuredPublications.length > 0}
								{#each featuredPublications as publication, i}
									<div class="border-b border-gray-200 dark:border-gray-700 pb-6 group" in:fly={{ x: 20, delay: i * 150, duration: 500 }}>
										<div class="text-sm text-gray-500 dark:text-white mb-2">{new Date(publication.date).getFullYear()}</div>
										<h3 class="text-lg font-semibold mb-2 group-hover:text-primary dark:text-white dark:group-hover:text-primary transition-colors">{publication.title}</h3>
										<p class="text-sm text-gray-600 dark:text-white italic mb-3">{publication.journal || 'Journal of AI Research'}</p>
										<a href={`/publications/${publication.slug}`} class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-4 py-2 text-sm bg-transparent text-primary dark:text-blue-400 border border-primary dark:border-blue-400 hover:bg-primary/10 hover:text-primary dark:hover:bg-blue-900/30 dark:hover:text-white transform hover:scale-105">
											View details
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
											</svg>
										</a>
									</div>
								{/each}
							{:else}
								<div class="border-b border-gray-200 dark:border-gray-700 pb-6 group" in:fly={{ x: 20, duration: 500 }}>
									<div class="text-sm text-gray-500 dark:text-white mb-2">2023</div>
									<h3 class="text-lg font-semibold mb-2 group-hover:text-primary dark:text-white dark:group-hover:text-primary transition-colors">Neural Network Architectures for Computer Vision</h3>
									<p class="text-sm text-gray-600 dark:text-white italic mb-3">Journal of AI Research</p>
									<a href="/publications" class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-4 py-2 text-sm bg-transparent text-primary dark:text-blue-400 border border-primary dark:border-blue-400 hover:bg-primary/10 hover:text-primary dark:hover:bg-blue-900/30 dark:hover:text-white transform hover:scale-105">
										View details
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
										</svg>
									</a>
								</div>
							{/if}
						</div>
						<div class="mt-8 text-center">
							<a href="/publications" class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-6 py-3 text-base bg-primary text-white hover:bg-primary-hover transform hover:scale-105">
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

<!-- Call to Action -->
<AnimateInView type="fade" delay={400}>
	<section class="py-16 bg-gradient-to-r from-primary/10 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl mb-12 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
		<div class="container mx-auto px-4 text-center">
			<h2 class="text-3xl font-bold mb-6 text-primary dark:text-blue-400">Let's Connect</h2>
			<p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
				Whether you're interested in collaboration, speaking engagements, or discussing data and AI trends, I'd love to hear from you.
			</p>
			<a href="/contact" class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg px-8 py-4 text-lg bg-primary text-white hover:bg-primary-hover transform hover:scale-105">
				Get in Touch
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
				</svg>
			</a>
		</div>
	</section>
</AnimateInView>
{/if}
