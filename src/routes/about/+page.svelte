<div class="about_cont">
	<h2>About Me</h2>
	<div class="about_info">
		<div class="about_text">
			<p>
				Hi, I'm Fatih Nayebi. I'm a researcher and technology enthusiast specializing in Artificial Intelligence, Machine Learning, and their applications across various domains.
			</p>
			<p>
				I received my Ph.D. in Computer Science with a focus on Machine Learning from [Your University]. My research has been centered on developing novel algorithms and approaches for solving complex problems in healthcare, finance, and natural language processing.
			</p>
			<p>
				Currently, I work as a [Your Position] at [Your Organization/Company], where I lead research initiatives in [specific area]. I'm passionate about pushing the boundaries of what's possible with AI and translating cutting-edge research into practical applications that can make a positive impact on society.
			</p>
			<p>
				When I'm not coding or researching, you can find me exploring new hiking trails, reading science fiction novels, or experimenting with cooking recipes from around the world.
			</p>
			<div class="about_links">
				<h3>Connect with me:</h3>
				<ul>
					<li><a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
					<li><a href="#" target="_blank" rel="noopener noreferrer">Twitter</a></li>
					<li><a href="#" target="_blank" rel="noopener noreferrer">GitHub</a></li>
					<li><a href="#" target="_blank" rel="noopener noreferrer">Google Scholar</a></li>
				</ul>
			</div>
		</div>
		<div class="about_image_container">
			<img src="/profile-image.jpg" alt="Fatih Nayebi" class="about_img" />
			<div class="about_credentials">
				<p><strong>Fatih Nayebi, Ph.D.</strong></p>
				<p>AI Researcher & Consultant</p>
			</div>
		</div>
	</div>
</div>

<style>
	.about_cont h2 {
		font-size: 40px;
		margin-bottom: 20px;
	}

	.about_info {
		display: flex;
		width: 100%;
		justify-content: space-between;
		gap: 40px;
	}

	.about_text {
		flex-basis: 60%;
	}

	.about_text p {
		margin-bottom: 20px;
		font-size: 18px;
		line-height: 1.6;
	}

	.about_image_container {
		flex-basis: 40%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.about_img {
		width: 100%;
		max-width: 300px;
		border-radius: 10px;
		margin-bottom: 15px;
	}

	.about_credentials {
		text-align: center;
		font-size: 16px;
		margin-top: 10px;
	}

	.about_credentials p {
		margin: 5px 0;
	}

	.about_links {
		margin-top: 30px;
	}

	.about_links h3 {
		font-size: 20px;
		margin-bottom: 10px;
	}

	.about_links ul {
		list-style-type: none;
		padding: 0;
		display: flex;
		gap: 20px;
	}

	.about_links a {
		color: #5333ed;
		font-weight: 500;
	}

	.about_links a:hover {
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.about_info {
			flex-direction: column-reverse;
		}

		.about_img {
			max-width: 250px;
		}

		.about_links ul {
			flex-direction: column;
			gap: 10px;
		}
	}
</style>
