<script>
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { spring } from 'svelte/motion';
	import AnimateInView from '$lib/components/ui/AnimateInView.svelte';
	import ProfileImage from '$lib/components/ui/ProfileImage.svelte';

	let visible = false;
	
	// Create a spring for the profile image scale effect
	const profileScale = spring(1, {
		stiffness: 0.1,
		damping: 0.6
	});
	
	// For skills animation
	let hoveredSkill = null;

	onMount(() => {
		visible = true;
		setTimeout(() => {
			profileScale.set(1.05);
			setTimeout(() => {
				profileScale.set(1);
			}, 500);
		}, 1500);
	});
</script>

<svelte:head>
	<title>About Me | Dr. Fatih Nayebi</title>
	<meta name="description" content="Learn about Dr. Fatih Nayebi, VP of Data & AI at ALDO Group and Faculty Lecturer at McGill University.">
</svelte:head>

{#if visible}
<div in:fade={{ duration: 800 }} class="pt-24 md:pt-32 pb-12 container mx-auto px-4 sm:px-6 lg:px-8 relative z-0 overflow-x-hidden about-page">
	
	<h1 class="text-5xl font-bold mb-8 text-center text-primary" in:fly={{ y: -30, duration: 800, delay: 300 }}>About Me</h1>

	<!-- Profile image and title section for mobile only -->
	<div class="md:hidden mb-10">
		<AnimateInView type="scale" delay={300}>
			<div class="relative w-full">
				<div class="rounded-xl shadow-lg overflow-hidden relative z-0">
					<ProfileImage 
						src="/images/profile.avif" 
						alt="Dr. Fatih Nayebi" 
						className="w-full transition-all duration-700 hover:scale-105"
						style="transform: scale({$profileScale})"
						width={600}
						height={600}
						square={true}
						sizes="(max-width: 768px) 100vw, 600px"
						mobileObjectPosition="center 30%" 
						desktopObjectPosition="center center"
						disableLargestSizes={true}
					/>
				</div>
			</div>
	
			<div class="text-center mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative z-0 transform transition-all duration-500 hover:shadow-md hover:-translate-y-1">
				<h2 class="text-2xl font-bold mb-1 text-gray-800 dark:text-gray-100">Fatih Nayebi, Ph.D.</h2>
				<p class="text-lg font-medium text-primary dark:text-blue-400 mb-1">VP, Data & AI at ALDO Group</p>
				<p class="text-lg text-gray-700 dark:text-gray-300 mb-6">Faculty Lecturer, McGill University</p>
				
				<h4 class="font-semibold mb-3 text-gray-700 dark:text-gray-300">Languages</h4>
				<div class="flex flex-wrap justify-center gap-2">
					{#each [{name: 'English', level: 'Native'}, {name: 'French', level: 'Professional'}, {name: 'Turkish', level: 'Native'}, {name: 'Azerbaijani', level: 'Limited'}] as lang, i}
						<div class="group relative">
							<div class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm dark:text-gray-300 transform transition-all duration-300 group-hover:bg-primary group-hover:text-white" style="transition-delay: {i * 50}ms">
								{lang.name}
							</div>
							<div class="absolute -top-8 left-1/2 transform -translate-x-1/2 w-max bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
								{lang.level}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</AnimateInView>
	</div>

	<div class="flex flex-col md:flex-row gap-8 mb-16 relative z-0">
		<!-- Left column: Bio, Professional Experience, Certifications, Publications -->
		<div class="md:w-3/5 relative z-0">
			<AnimateInView type="fade" delay={200}>
				<div class="p-6 bg-white dark:bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-md hover:-translate-y-1">
					<p class="text-lg mb-5 leading-relaxed dark:text-gray-300">
						I'm Fatih Nayebi, Ph.D., a Data & AI Leader who bridges academic excellence and enterprise innovation to transform data into strategic business value. With a robust foundation in advanced research and a proven track record in delivering real-world AI solutions, I empower organizations to harness the full potential of data-driven technology.
					</p>
					<p class="text-lg mb-5 leading-relaxed dark:text-gray-300">
						Currently, I serve as the Vice President of Data & AI at the ALDO Group, where I spearhead our ambitious Data, Analytics, and AI strategy. I lead four pivotal teams: Data Governance, Data & Analytics Platform, Data & Analytics Products, and Artificial Intelligence.
					</p>
					<p class="text-lg mb-5 leading-relaxed dark:text-gray-300">
						I'm also a Faculty Lecturer at McGill University's Desautels Faculty of Management, teaching in the Master of Management Analytics program. My courses cover enterprise data science, machine learning in production, deep learning, and AI engineering.
					</p>
				</div>
			</AnimateInView>

			<AnimateInView type="fly" x={-20} delay={400}>
				<div class="mt-8 mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-md hover:-translate-y-1">
					<h3 class="text-2xl font-semibold mb-4 flex items-center dark:text-gray-100">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
						Professional Experience & Impact
					</h3>
					<div class="space-y-4 pl-4 border-l-2 border-primary dark:border-blue-600 border-opacity-30">
						<div class="relative pl-6">
							<div class="absolute left-[-1.55rem] top-1.5 w-4 h-4 rounded-full bg-primary dark:bg-blue-500"></div>
							<p class="font-medium dark:text-gray-200">Enterprise Innovation</p>
							<p class="text-gray-600 dark:text-gray-300">Directed 19 programs/projects and established 5 centers of excellence</p>
						</div>
						<div class="relative pl-6">
							<div class="absolute left-[-1.55rem] top-1.5 w-4 h-4 rounded-full bg-primary dark:bg-blue-500"></div>
							<p class="font-medium dark:text-gray-200">Technical Leadership</p>
							<p class="text-gray-600 dark:text-gray-300">Architected 14 scalable data-intensive systems and deployed 19 AI products</p>
						</div>
						<div class="relative pl-6">
							<div class="absolute left-[-1.55rem] top-1.5 w-4 h-4 rounded-full bg-primary dark:bg-blue-500"></div>
							<p class="font-medium dark:text-gray-200">Product Development</p>
							<p class="text-gray-600 dark:text-gray-300">Developed 72 mobile apps and 24 web/API solutions across 17 programming languages</p>
						</div>
					</div>
				</div>
			</AnimateInView>

			<AnimateInView type="fly" x={-20} delay={800}>
				<div class="mt-8 mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-md hover:-translate-y-1">
					<h3 class="text-2xl font-semibold mb-4 flex items-center dark:text-gray-100">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
						Certifications
					</h3>
					<ul class="space-y-2">
						{#each ['Project Management Professional (PMP)', 'Excelling in the New World of Retail', 'Certified Secure Software Lifecycle Professional (CSSLP)', 'SEI Certified Personal Software Process Developer (SEI-PSP)', 'ITIL V3 Foundation Certificate'] as cert, i}
							<li class="flex items-start p-2 transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transform transition-all duration-300 hover:-translate-x-1" style="transition-delay: {i * 100}ms">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<span>{cert}</span>
							</li>
						{/each}
					</ul>
				</div>
			</AnimateInView>

			<AnimateInView type="fly" x={-20} delay={1000}>
				<div class="mt-8 mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-md hover:-translate-y-1">
					<h3 class="text-2xl font-semibold mb-4 flex items-center dark:text-gray-100">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2 2v-6a2 2 0 00-2-2h-6" />
						</svg>
						Publications
					</h3>
					<div class="space-y-3">
						{#each ['Swift Functional Programming - Second Edition', 'The State of the Art of Mobile Application Usability Evaluation', 'Automated Selection of a Software Effort Estimation Model based on Accuracy and Uncertainty', 'Swift 3 Functional Programming', 'An Expert-based Framework for Evaluating iOS Application Usability'] as pub, i}
							<div class="p-3 border-l-4 border-purple-400 dark:border-purple-500 rounded-r-lg bg-purple-50 dark:bg-purple-900/20 transform transition-all duration-500 hover:translate-x-2 hover:bg-purple-100 dark:hover:bg-purple-900/30" style="transition-delay: {i * 100}ms">
								<p class="text-gray-800 dark:text-gray-200">{pub}</p>
							</div>
						{/each}
					</div>
				</div>
			</AnimateInView>
		</div>

		<!-- Right column: Profile image, Skills & Expertise, Connect with me -->
		<div class="hidden md:flex md:w-2/5 flex-col z-0">
			<AnimateInView type="scale" delay={300}>
				<div class="sticky top-24">
					<div class="rounded-xl shadow-lg overflow-hidden relative z-0">
						<ProfileImage 
							src="/images/profile.avif" 
							alt="Dr. Fatih Nayebi" 
							className="w-full transition-all duration-700 hover:scale-105"
							style="transform: scale({$profileScale})"
							width={600}
							height={600}
							square={true}
							sizes="(max-width: 768px) 100vw, 600px"
							mobileObjectPosition="center 30%" 
							desktopObjectPosition="center center"
							disableLargestSizes={true}
						/>
					</div>
				
					<div class="text-center mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative z-0 transform transition-all duration-500 hover:shadow-md hover:-translate-y-1">
						<h2 class="text-2xl font-bold mb-1 text-gray-800 dark:text-gray-100">Fatih Nayebi, Ph.D.</h2>
						<p class="text-lg font-medium text-primary dark:text-blue-400 mb-1">VP, Data & AI at ALDO Group</p>
						<p class="text-lg text-gray-700 dark:text-gray-300 mb-6">Faculty Lecturer, McGill University</p>
						
						<h4 class="font-semibold mb-3 text-gray-700 dark:text-gray-300">Languages</h4>
						<div class="flex flex-wrap justify-center gap-2">
							{#each [{name: 'English', level: 'Native'}, {name: 'French', level: 'Professional'}, {name: 'Turkish', level: 'Native'}, {name: 'Azerbaijani', level: 'Limited'}] as lang, i}
								<div class="group relative">
									<div class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm dark:text-gray-300 transform transition-all duration-300 group-hover:bg-primary group-hover:text-white" style="transition-delay: {i * 50}ms">
										{lang.name}
									</div>
									<div class="absolute -top-8 left-1/2 transform -translate-x-1/2 w-max bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
										{lang.level}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</AnimateInView>
			
			<!-- Skills & Expertise moved to right column -->
			<AnimateInView type="fly" x={20} delay={600}>
				<div class="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-md hover:-translate-y-1">
					<h3 class="text-2xl font-semibold mb-4 flex items-center dark:text-gray-100">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
						</svg>
						Skills & Expertise
					</h3>
					<div class="flex flex-wrap gap-3">
						{#each ['Supply Chain Optimization', 'Demand Forecasting', 'Retail Analytics', 'Omni-Channel Marketing', 'Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Data Science', 'Agentic AI','Causal Inference', 'Time Series Forecasting', 'Conformal Prediction', 'Optimization', 'Operations Research', 'Data Governance'] as skill, i}
							<div 
								role="button"
								tabindex="0"
								class="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-primary hover:text-white"
								style="transition-delay: {i * 50}ms"
								on:mouseenter={() => hoveredSkill = skill}
								on:mouseleave={() => hoveredSkill = null}
								on:keydown={(e) => e.key === 'Enter' && (hoveredSkill = hoveredSkill === skill ? null : skill)}
							>
								{skill}
							</div>
						{/each}
					</div>
					{#if hoveredSkill}
						<div class="mt-4 text-gray-600 text-sm italic animate-pulse">
							{hoveredSkill}: Expert level proficiency with practical implementation experience
						</div>
					{/if}
				</div>
			</AnimateInView>
			
			<!-- Connect with me moved to right column -->
			<AnimateInView type="fade" delay={700}>
				<div class="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-md hover:-translate-y-1">
					<h3 class="text-2xl font-semibold mb-4 flex items-center dark:text-gray-100">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
						Connect with me
					</h3>
					<ul class="flex flex-wrap gap-4 mt-4">
						<li class="transform transition-all duration-300 hover:scale-110">
							<a href="https://linkedin.com/in/thefatih" class="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-100 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
								</svg>
								LinkedIn
							</a>
						</li>
						<li class="transform transition-all duration-300 hover:scale-110">
							<a href="https://github.com/conqueror" class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
								</svg>
								GitHub
							</a>
						</li>
						<li class="transform transition-all duration-300 hover:scale-110">
							<a href="https://scholar.google.com/citations?user=s6lWpdEAAAAJ" class="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-100 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
									<path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
								</svg>
								Google Scholar
							</a>
						</li>
						<li class="transform transition-all duration-300 hover:scale-110">
							<a href="mailto:f.nayebi@gmail.com" class="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-100 rounded-lg hover:bg-red-200 dark:hover:bg-red-800">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
								</svg>
								Email
							</a>
						</li>
						<li class="transform transition-all duration-300 hover:scale-110">
							<a href="https://gradientdivergence.com/" class="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-100 rounded-lg hover:bg-green-200 dark:hover:bg-green-800">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
								</svg>
								Company
							</a>
						</li>
						<li class="transform transition-all duration-300 hover:scale-110">
							<a href="https://gradientdivergence.com/fatih-nayebi/" class="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-100 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								Personal Site
							</a>
						</li>
					</ul>
				</div>
			</AnimateInView>
		</div>
	</div>

	<AnimateInView type="fade" delay={1400}>
		<div class="mt-10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 relative transform transition-all duration-500 hover:shadow-md">
			
			<h2 class="text-3xl font-bold mb-8 text-primary dark:text-blue-400 flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path d="M12 14l9-5-9-5-9 5 9 5z" />
					<path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
				</svg>
				Education
			</h2>
			<div class="space-y-6">
				{#each [
					{degree: 'Ph.D., Software Engineering', school: 'École de technologie supérieure', years: '2012 - 2015'},
					{degree: 'Ph.D., Computer Engineering', school: 'Boğaziçi Üniversitesi', years: '2009 - 2012'},
					{degree: 'Master of Science (M.Sc.), Software Engineering', school: 'Boğaziçi Üniversitesi', years: '2007 - 2009'},
					{degree: 'Bachelor of Science (B.Sc.), Computer Engineering', school: 'Lahijan University', years: '1998 - 2002'}
				] as edu, i}
					<div class="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1" style="transition-delay: {i * 150}ms">
						<div class="flex items-start md:items-center">
							<div class="bg-primary/10 dark:bg-blue-900/30 p-2 rounded-full mr-4 hidden md:block">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
								</svg>
							</div>
							<div>
								<h3 class="font-semibold text-lg dark:text-gray-100">{edu.degree}</h3>
								<p class="text-gray-700 dark:text-gray-300">{edu.school}</p>
							</div>
						</div>
						<div class="md:text-right mt-2 md:mt-0">
							<p class="text-primary dark:text-blue-400 font-medium inline-block bg-primary/5 dark:bg-blue-900/20 px-3 py-1 rounded-full">{edu.years}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</AnimateInView>

	<!-- Skills and Connect sections for mobile - showing after Education section -->
	<div class="md:hidden">
		<AnimateInView type="fly" x={20} delay={600}>
			<div class="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-md hover:-translate-y-1">
				<h3 class="text-2xl font-semibold mb-4 flex items-center dark:text-gray-100">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
					</svg>
					Skills & Expertise
				</h3>
				<div class="flex flex-wrap gap-3">
					{#each ['Supply Chain Optimization', 'Demand Forecasting', 'Retail Analytics', 'Omni-Channel Marketing', 'Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Data Science', 'Agentic AI','Causal Inference', 'Time Series Forecasting', 'Conformal Prediction', 'Optimization', 'Operations Research', 'Data Governance'] as skill, i}
						<div 
							role="button"
							tabindex="0"
							class="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-primary hover:text-white"
							style="transition-delay: {i * 50}ms"
							on:mouseenter={() => hoveredSkill = skill}
							on:mouseleave={() => hoveredSkill = null}
							on:keydown={(e) => e.key === 'Enter' && (hoveredSkill = hoveredSkill === skill ? null : skill)}
						>
							{skill}
						</div>
					{/each}
				</div>
				{#if hoveredSkill}
					<div class="mt-4 text-gray-600 text-sm italic animate-pulse">
						{hoveredSkill}: Expert level proficiency with practical implementation experience
					</div>
				{/if}
			</div>
		</AnimateInView>
		
		<AnimateInView type="fade" delay={700}>
			<div class="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-md hover:-translate-y-1">
				<h3 class="text-2xl font-semibold mb-4 flex items-center dark:text-gray-100">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
					Connect with me
				</h3>
				<ul class="flex flex-wrap gap-4 mt-4">
					<li class="transform transition-all duration-300 hover:scale-110">
						<a href="https://linkedin.com/in/thefatih" class="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-100 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
							</svg>
							LinkedIn
						</a>
					</li>
					<li class="transform transition-all duration-300 hover:scale-110">
						<a href="https://github.com/conqueror" class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
							</svg>
							GitHub
						</a>
					</li>
					<li class="transform transition-all duration-300 hover:scale-110">
						<a href="https://scholar.google.com/citations?user=s6lWpdEAAAAJ" class="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-100 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
								<path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
							</svg>
							Google Scholar
						</a>
					</li>
					<li class="transform transition-all duration-300 hover:scale-110">
						<a href="mailto:f.nayebi@gmail.com" class="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-100 rounded-lg hover:bg-red-200 dark:hover:bg-red-800">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
							Email
						</a>
					</li>
					<li class="transform transition-all duration-300 hover:scale-110">
						<a href="https://gradientdivergence.com/" class="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-100 rounded-lg hover:bg-green-200 dark:hover:bg-green-800">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
							Company
						</a>
					</li>
					<li class="transform transition-all duration-300 hover:scale-110">
						<a href="https://gradientdivergence.com/fatih-nayebi/" class="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-100 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							Personal Site
						</a>
					</li>
				</ul>
			</div>
		</AnimateInView>
	</div>
</div>
{/if}

<style>
/* Add responsive styles for mobile */
@media (max-width: 768px) {
  :global(.about-page .sticky) {
    position: static !important;
  }
  
  /* Improve touch targets for mobile */
  :global(.transform.hover\:scale-110) {
    transition: transform 0.3s ease;
  }
  
  :global(.transform.hover\:scale-110:active) {
    transform: scale(1.05);
  }
}
</style>
