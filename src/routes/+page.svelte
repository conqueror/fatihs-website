<div class="home-container">
	<div class="hero-section">
		<div class="hero-content">
			<h1>Fatih Nayebi</h1>
			<h2>AI Researcher & Consultant</h2>
			<p>Exploring the frontiers of Artificial Intelligence and Machine Learning</p>
			<div class="hero-buttons">
				<a href="/about" class="btn primary-btn">About Me</a>
				<a href="/contact" class="btn secondary-btn">Get in Touch</a>
			</div>
		</div>
		<div class="hero-image">
			<img src="/profile-image.jpg" alt="Fatih Nayebi" />
		</div>
	</div>

	<div class="highlights-section">
		<h2>My Work</h2>
		<div class="highlight-cards">
			<a href="/research" class="highlight-card">
				<h3>Research</h3>
				<p>Exploring cutting-edge AI technologies and their applications in healthcare and natural language processing.</p>
				<span class="card-link">View Research →</span>
			</a>
			<a href="/publications" class="highlight-card">
				<h3>Publications</h3>
				<p>Peer-reviewed articles, conference papers, and book chapters on machine learning and AI.</p>
				<span class="card-link">View Publications →</span>
			</a>
			<a href="/consulting" class="highlight-card">
				<h3>Consulting</h3>
				<p>Expert advice and technical solutions for organizations looking to leverage AI technology.</p>
				<span class="card-link">Learn More →</span>
			</a>
		</div>
	</div>

	<div class="latest-section">
		<div class="latest-news">
			<h2>Latest News</h2>
			<div class="news-item">
				<span class="date">March 2, 2023</span>
				<h3>Website Launch</h3>
				<p>I'm excited to announce the launch of my new personal website built with SvelteKit.</p>
				<a href="/news" class="text-link">Read more →</a>
			</div>
		</div>
		<div class="latest-blog">
			<h2>Latest from the Blog</h2>
			<div class="blog-item">
				<h3>The Future of AI in Healthcare</h3>
				<p>How machine learning models are revolutionizing diagnosis and treatment planning.</p>
				<a href="/blog" class="text-link">Read post →</a>
			</div>
		</div>
	</div>
</div>

<style>
	.home-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.hero-section {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4rem;
		padding: 4rem 0;
	}

	.hero-content {
		flex: 1;
	}

	.hero-content h1 {
		font-size: 3.5rem;
		margin-bottom: 0.5rem;
		color: #333;
	}

	.hero-content h2 {
		font-size: 1.75rem;
		margin-bottom: 1.5rem;
		color: #555;
		font-weight: 500;
	}

	.hero-content p {
		font-size: 1.25rem;
		margin-bottom: 2rem;
		color: #666;
		line-height: 1.6;
	}

	.hero-buttons {
		display: flex;
		gap: 1rem;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border-radius: 5px;
		font-size: 1rem;
		font-weight: 500;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.primary-btn {
		background-color: #5333ed;
		color: white;
	}

	.primary-btn:hover {
		background-color: #4526c3;
	}

	.secondary-btn {
		background-color: transparent;
		color: #5333ed;
		border: 2px solid #5333ed;
	}

	.secondary-btn:hover {
		background-color: #f0eeff;
	}

	.hero-image {
		flex: 1;
		max-width: 400px;
	}

	.hero-image img {
		width: 100%;
		border-radius: 10px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
	}

	.highlights-section {
		padding: 4rem 0;
	}

	.highlights-section h2 {
		text-align: center;
		font-size: 2.25rem;
		margin-bottom: 2rem;
	}

	.highlight-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.highlight-card {
		background-color: #f9f9f9;
		padding: 2rem;
		border-radius: 10px;
		text-decoration: none;
		color: inherit;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.highlight-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
	}

	.highlight-card h3 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: #333;
	}

	.highlight-card p {
		margin-bottom: 1.5rem;
		color: #666;
		line-height: 1.5;
	}

	.card-link {
		color: #5333ed;
		font-weight: 500;
	}

	.latest-section {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 3rem;
		padding: 4rem 0;
	}

	.latest-section h2 {
		font-size: 1.75rem;
		margin-bottom: 1.5rem;
	}

	.news-item, .blog-item {
		margin-bottom: 2rem;
	}

	.date {
		display: block;
		color: #666;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
	}

	.news-item h3, .blog-item h3 {
		font-size: 1.25rem;
		margin-bottom: 0.75rem;
		color: #333;
	}

	.news-item p, .blog-item p {
		margin-bottom: 1rem;
		color: #666;
		line-height: 1.5;
	}

	.text-link {
		color: #5333ed;
		text-decoration: none;
		font-weight: 500;
	}

	.text-link:hover {
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.hero-section {
			flex-direction: column-reverse;
			gap: 2rem;
			text-align: center;
		}
		
		.hero-buttons {
			justify-content: center;
		}
		
		.hero-image {
			max-width: 300px;
		}
		
		.hero-content h1 {
			font-size: 2.5rem;
		}
		
		.highlights-section {
			padding: 2rem 0;
		}
		
		.latest-section {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}
</style>
