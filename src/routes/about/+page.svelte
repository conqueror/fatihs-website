<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

{#if visible}
<div in:fade={{ duration: 800 }} class="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
	<h1 class="text-4xl font-bold mb-8 text-center text-primary">About Me</h1>

	<div class="flex flex-col-reverse md:flex-row gap-8 mb-10">
		<div class="md:w-3/5">
			<p class="text-lg mb-5 leading-relaxed">
				I'm Fatih Nayebi, Ph.D., a Data & AI Leader who bridges academic excellence and enterprise innovation to transform data into strategic business value. With a robust foundation in advanced research and a proven track record in delivering real-world AI solutions, I empower organizations to harness the full potential of data-driven technology.
			</p>
			<p class="text-lg mb-5 leading-relaxed">
				Currently, I serve as the Vice President of Data & AI at the ALDO Group, where I spearhead our ambitious Data, Analytics, and AI strategy. I lead four pivotal teams: Data Governance, Data & Analytics Platform, Data & Analytics Products, and Artificial Intelligence.
			</p>
			<p class="text-lg mb-5 leading-relaxed">
				I'm also a Faculty Lecturer at McGill University's Desautels Faculty of Management, teaching in the Master of Management Analytics program. My courses cover enterprise data science, machine learning in production, deep learning, and AI engineering.
			</p>

			<div class="mt-8 mb-10">
				<h3 class="text-2xl font-semibold mb-4">Professional Experience & Impact</h3>
				<ul class="list-disc pl-5 space-y-2">
					<li>Enterprise Innovation: Directed 19 programs/projects and established 5 centers of excellence</li>
					<li>Technical Leadership: Architected 14 scalable data-intensive systems and deployed 19 AI products</li>
					<li>Product Development: Developed 72 mobile apps and 24 web/API solutions across 17 programming languages</li>
				</ul>
			</div>

			<div class="mt-8 mb-10">
				<h3 class="text-2xl font-semibold mb-4">Skills & Expertise</h3>
				<div class="flex flex-wrap gap-2">
					<span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Supply Chain Optimization</span>
					<span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Supply Chain Management</span>
					<span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Omni-Channel Marketing</span>
					<span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Artificial Intelligence</span>
					<span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Machine Learning</span>
					<span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Deep Learning</span>
					<span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Data Science</span>
				</div>
			</div>

			<div class="mt-8 mb-10">
				<h3 class="text-2xl font-semibold mb-4">Certifications</h3>
				<ul class="list-disc pl-5 space-y-1">
					<li>Project Management Professional (PMP)</li>
					<li>Excelling in the New World of Retail</li>
					<li>Certified Secure Software Lifecycle Professional (CSSLP)</li>
					<li>SEI Certified Personal Software Process Developer (SEI-PSP)</li>
					<li>ITIL V3 Foundation Certificate</li>
				</ul>
			</div>

			<div class="mt-8 mb-10">
				<h3 class="text-2xl font-semibold mb-4">Publications</h3>
				<ul class="list-disc pl-5 space-y-1">
					<li>Swift Functional Programming - Second Edition</li>
					<li>The State of the Art of Mobile Application Usability Evaluation</li>
					<li>Automated Selection of a Software Effort Estimation Model based on Accuracy and Uncertainty</li>
					<li>Swift 3 Functional Programming</li>
					<li>An Expert-based Framework for Evaluating iOS Application Usability</li>
				</ul>
			</div>

			<div class="mt-8">
				<h3 class="text-2xl font-semibold mb-4">Connect with me</h3>
				<ul class="flex flex-wrap gap-3 md:gap-5">
					<li><a href="https://linkedin.com/in/thefatih" class="text-primary hover:underline font-medium">LinkedIn</a></li>
					<li><a href="mailto:f.nayebi@gmail.com" class="text-primary hover:underline font-medium">Email</a></li>
					<li><a href="https://gradientdivergence.com/" class="text-primary hover:underline font-medium">Company</a></li>
					<li><a href="https://gradientdivergence.com/fatih-nayebi/" class="text-primary hover:underline font-medium">Personal Site</a></li>
				</ul>
			</div>
		</div>

		<div class="md:w-2/5 flex flex-col items-center">
			<img src="/images/profile.jpeg" alt="Fatih Nayebi" class="w-full max-w-xs rounded-lg shadow-md mb-4">
			<div class="text-center">
				<p class="text-xl font-bold mb-1">Fatih Nayebi, Ph.D.</p>
				<p class="text-lg text-gray-700">VP, Data & AI at ALDO Group</p>
				<p class="text-lg text-gray-700">Faculty Lecturer, McGill University</p>
			</div>
			
			<div class="mt-6 text-center">
				<h4 class="font-semibold mb-2">Languages</h4>
				<div class="flex flex-wrap justify-center gap-2">
					<span class="bg-gray-100 px-3 py-1 rounded-full text-sm">English</span>
					<span class="bg-gray-100 px-3 py-1 rounded-full text-sm">French</span>
					<span class="bg-gray-100 px-3 py-1 rounded-full text-sm">Turkish</span>
					<span class="bg-gray-100 px-3 py-1 rounded-full text-sm">Persian</span>
					<span class="bg-gray-100 px-3 py-1 rounded-full text-sm">Azerbaijani</span>
				</div>
			</div>
		</div>
	</div>
	
	<div class="mt-10 bg-gray-50 p-6 rounded-lg">
		<h2 class="text-3xl font-bold mb-4 text-primary">Education</h2>
		<ul class="space-y-4">
			<li class="flex flex-col md:flex-row md:items-center justify-between">
				<div>
					<h3 class="font-semibold">Ph.D., Software Engineering</h3>
					<p class="text-gray-700">École de technologie supérieure</p>
				</div>
				<p class="text-gray-600">2012 - 2015</p>
			</li>
			<li class="flex flex-col md:flex-row md:items-center justify-between">
				<div>
					<h3 class="font-semibold">Ph.D., Computer Engineering</h3>
					<p class="text-gray-700">Boğaziçi Üniversitesi</p>
				</div>
				<p class="text-gray-600">2009 - 2012</p>
			</li>
			<li class="flex flex-col md:flex-row md:items-center justify-between">
				<div>
					<h3 class="font-semibold">Master of Science (M.Sc.), Software Engineering</h3>
					<p class="text-gray-700">Boğaziçi Üniversitesi</p>
				</div>
				<p class="text-gray-600">2007 - 2009</p>
			</li>
			<li class="flex flex-col md:flex-row md:items-center justify-between">
				<div>
					<h3 class="font-semibold">Bachelor of Science (B.Sc.), Computer Engineering</h3>
					<p class="text-gray-700">Lahijan University</p>
				</div>
				<p class="text-gray-600">1998 - 2002</p>
			</li>
		</ul>
	</div>
</div>
{/if}
