<script>
	import { onMount } from 'svelte';
	import { fade, fly, scale, crossfade } from 'svelte/transition';
	import { spring } from 'svelte/motion';
	import Card from '$lib/Card.svelte';
	import AnimateInView from '$lib/components/ui/AnimateInView.svelte';
	import AnimatedButton from '$lib/components/ui/AnimatedButton.svelte';
	import ProfileImage from '$lib/components/ui/ProfileImage.svelte';
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	
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
	}, 1500); // Delayed more to match the rest of the animations

	// Controls initial loading animation
	let visible = false;
	
	// Create a spring for the profile image scale effect
	const profileScale = spring(1, {
		stiffness: 0.05,
		damping: 0.7
	});
	
	// State for sequential component loading
	let heroVisible = false;
	let statsVisible = false;
	let workVisible = false;
	let featuredVisible = false;
	let ctaVisible = false;
	
	// Page loading sequence
	onMount(() => {
		// Coordinated loading sequence
		setTimeout(() => visible = true, 100);
		
		// Sequential component visibility
		setTimeout(() => heroVisible = true, 200);
		setTimeout(() => {
			// Profile image animation
			profileScale.set(1.03);
			setTimeout(() => profileScale.set(1), 600);
		}, 800);
		
		setTimeout(() => statsVisible = true, 1000);
		setTimeout(() => workVisible = true, 1300);
		setTimeout(() => featuredVisible = true, 1600);
		setTimeout(() => ctaVisible = true, 1900);
	});
</script>

<style>
	/* Responsive image styling */
	.profile-image-container {
		aspect-ratio: 1/1;
		width: 600px;  /* Increased from 400px to 600px */
		max-width: 100%;  /* Maintain max-width to prevent overflow */
		height: auto;  /* Keep auto height for proper scaling */
		margin: 0 auto;
		position: relative;
		border-radius: 1rem;
		overflow: hidden;
	}
	
	/* Text overlay styling */
	.text-shadow {
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}
	
	/* Optimization for critical content */
	.critical-content {
		content-visibility: auto;
		contain-intrinsic-size: auto;
		text-rendering: optimizeSpeed;
	}
	
	/* Page fade-in wrapper */
	.page-wrapper {
		opacity: 0;
		transform: translateY(10px);
		transition: opacity 0.8s ease-out, transform 0.8s ease-out;
	}
	
	.page-wrapper.visible {
		opacity: 1;
		transform: translateY(0);
	}
	
	/* Component fade-in effect */
	.component-fade-in {
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	
	.component-fade-in.visible {
		opacity: 1;
		transform: translateY(0);
	}
	
	/* Hero section specific styling */
	.hero-text-container {
		z-index: 10; /* Ensure text is above image */
		position: relative; /* Add position relative for z-index to work */
	}
	
	/* Featured content grid */
	.featured-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}
	
	/* Card styling */
	.featured-card {
		background-color: white;
		border-radius: 1rem;
		overflow: hidden;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		border: 1px solid #eaeaea;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	
	.featured-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 20px rgba(0,0,0,0.05);
	}

	/* Publication date styling */
	.publication-date {
		font-size: 0.875rem;
		color: #6b7280;
	}
	
	/* Media queries for responsive image sizing */
	@media (max-width: 1023px) {
		.profile-image-container {
			width: 500px; /* Medium size for tablets */
		}
	}

	@media (max-width: 767px) {
		.profile-image-container {
			width: 400px; /* Smaller size for mobile */
		}
	}
</style>

<svelte:head>
	<title>Dr. Fatih Nayebi | Data & AI Leader, Innovator, and Educator</title>
	<meta name="description" content="Personal website of Dr. Fatih Nayebi, a Data & AI leader in Montreal, Canada. Expertise in machine learning, AI ethics, and data strategy." />
	<meta name="keywords" content="Fatih Nayebi, AI, Machine Learning, Data Science, Montreal" />
</svelte:head>

<!-- Main page wrapper with animation -->
<div class="page-wrapper" class:visible={visible}>
	<!-- Hero Section with updated styling -->
	<div class="relative overflow-hidden pt-24 md:pt-28 pb-8 md:pb-12">
		<div class="container mx-auto px-2 md:px-3">
			<section class="bg-gradient-to-br from-primary/5 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-sm backdrop-blur-[2px] mb-10 py-6 md:py-8 px-1 md:px-2">
				<PageContainer heroSection={true} noPadding={true}>
					<div class="component-fade-in" class:visible={heroVisible}>
						<div class="grid grid-cols-1 md:grid-cols-12 items-center md:gap-0">
							<!-- Text content with enhanced leftward positioning -->
							<div class="hero-text-container order-2 md:order-1 mt-6 md:mt-0 md:col-span-7 -ml-1 md:-ml-3 lg:-ml-4 pr-3 md:pr-4">
								<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-gray-100 critical-content" in:fly={{ y: -30, duration: 800, delay: 300 }}>
									Data & AI Leader, <span class="text-primary dark:text-blue-400">Innovator</span>, and Educator
								</h1>
								<p class="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-3 md:mb-4" in:fly={{ y: 30, duration: 800, delay: 500 }}>
									Transforming business through data-driven technology and artificial intelligence
								</p>
								<p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8 max-w-2xl" in:fly={{ y: 30, duration: 800, delay: 700 }}>
									VP of Data & AI at the ALDO Group, Faculty Lecturer at McGill University, and AI Ethics advocate. Passionate about building AI systems that are ethical, explainable, and deliver business value.
								</p>
								<div class="flex flex-wrap gap-4" in:fly={{ y: 30, duration: 800, delay: 900 }}>
									<a href="/contact" class="px-8 py-3 text-lg bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition duration-300 transform hover:scale-105">
										Get in Touch
									</a>
									<a href="/about" class="px-8 py-3 text-lg bg-white dark:bg-gray-800 text-primary dark:text-blue-400 border border-primary dark:border-blue-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 transform hover:scale-105">
										About Me
									</a>
								</div>
							</div>

							<!-- Profile image with enhanced rightward positioning -->
							<div class="text-center order-1 md:order-2 md:col-span-5 md:-mr-2 lg:-mr-4" in:scale={{ duration: 1000, delay: 600, start: 0.8 }}>
								<div class="profile-image-container ml-auto md:mr-0 relative rounded-2xl overflow-hidden shadow-2xl transform hover:rotate-0 transition-all duration-500">
									<ProfileImage 
										src="/images/profile.avif" 
										alt="Dr. Fatih Nayebi" 
										className="w-full h-full transition-all duration-700"
										style="transform: scale({$profileScale})"
										width={600}
										height={600}
										sizes="(max-width: 767px) 400px, (max-width: 1023px) 500px, 600px"
										mobileObjectPosition="center top" 
										desktopObjectPosition="center center"
										fetchpriority="high"
									/>
									
									<!-- Text overlay on image -->
									<div class="absolute bottom-6 left-6 text-left text-white z-10">
										<h2 class="text-xl md:text-2xl font-bold leading-none mb-1 text-shadow">Fatih Nayebi, Ph.D.</h2>
										<p class="text-sm md:text-base leading-tight text-shadow">VP, Data & AI at ALDO Group</p>
										<p class="text-xs md:text-sm leading-tight text-shadow">Faculty Lecturer, McGill University</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</PageContainer>
			</section>
		</div>
	</div>

	<!-- Stats Section -->
	<div class="component-fade-in" class:visible={statsVisible}>
		<div class="container mx-auto px-4">
			<section class="py-8 mb-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
				<div class="flex flex-wrap justify-center text-center">
					<div class="w-full md:w-1/4 p-6">
						<div class="text-4xl font-bold text-primary mb-2">{Math.round($count)}+</div>
						<p class="text-gray-600 dark:text-gray-300">Publications</p>
					</div>
					<div class="w-full md:w-1/4 p-6">
						<div class="text-4xl font-bold text-primary mb-2">21+</div>
						<p class="text-gray-600 dark:text-gray-300">AI Products Released</p>
					</div>
					<div class="w-full md:w-1/4 p-6">
						<div class="text-4xl font-bold text-primary mb-2">23+</div>
						<p class="text-gray-600 dark:text-gray-300">Speaking Events</p>
					</div>
					<div class="w-full md:w-1/4 p-6">
						<div class="text-4xl font-bold text-primary mb-2">72+</div>
						<p class="text-gray-600 dark:text-gray-300">Apps Developed</p>
					</div>
				</div>
			</section>
		</div>
	</div>

	<!-- My Work Section with proper container padding -->
	<div class="component-fade-in" class:visible={workVisible}>
		<section class="py-16 bg-gray-50 dark:bg-gray-900">
			<div class="container mx-auto px-4">
				<h2 class="text-3xl md:text-4xl font-bold mb-12 text-center text-primary dark:text-blue-400">My Work</h2>
				
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
					<!-- Enterprise AI Card -->
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
					
					<!-- Academic Research Card -->
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
					
					<!-- Education Card -->
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
	</div>
	
	<!-- Featured Content Section -->
	<div class="component-fade-in" class:visible={featuredVisible}>
		<div class="container mx-auto px-4">
			<section class="py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 md:px-8 mb-12">
				<h2 class="text-3xl font-bold text-center mb-12 dark:text-gray-100">Featured Content</h2>
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
					<!-- Featured Blog Posts -->
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
										<h3 class="text-lg font-semibold mb-2 group-hover:text-primary dark:text-gray-200 dark:group-hover:text-primary transition-colors">Assortment Planning and Optimization with Reinforcement Learning</h3>
										<p class="text-gray-600 dark:text-gray-300 mb-3">Exploring how artificial intelligence is transforming Assortment Planning and Optimization by deciding which products to carry, in what quantities, and at which locations</p>
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

					<!-- Featured Publications -->
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
									<h3 class="text-lg font-semibold mb-2 group-hover:text-primary dark:text-white dark:group-hover:text-primary transition-colors">Foundations of Agentic AI for Retail</h3>
									<p class="text-sm text-gray-600 dark:text-white italic mb-3">Book published by Gradient Divergence</p>
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
				</div>
			</section>
		</div>
	</div>

	<!-- Call to Action Section -->
	<div class="component-fade-in" class:visible={ctaVisible}>
		<div class="container mx-auto px-4">
			<section class="py-16 bg-gradient-to-r from-primary/10 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl mb-12 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
				<div class="text-center">
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
		</div>
	</div>
</div>
