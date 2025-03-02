<footer class="footer">
	<div class="footer-content">
		<div class="footer-info">
			<h3>Fatih Nayebi</h3>
			<p>AI Researcher & Consultant</p>
		</div>
		
		<div class="footer-links">
			<div class="footer-section">
				<h4>Navigation</h4>
				<ul>
					<li><a href="/">Home</a></li>
					<li><a href="/about">About</a></li>
					<li><a href="/research">Research</a></li>
					<li><a href="/publications">Publications</a></li>
				</ul>
			</div>
			
			<div class="footer-section">
				<h4>Resources</h4>
				<ul>
					<li><a href="/blog">Blog</a></li>
					<li><a href="/news">News</a></li>
					<li><a href="/consulting">Consulting</a></li>
					<li><a href="/contact">Contact</a></li>
				</ul>
			</div>
			
			<div class="footer-section">
				<h4>Connect</h4>
				<div class="social-links">
					<a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a>
					<a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">Twitter</a>
					<a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub">GitHub</a>
				</div>
			</div>
		</div>
	</div>
	
	<div class="footer-bottom">
		<p>&copy; {new Date().getFullYear()} Fatih Nayebi. All rights reserved.</p>
	</div>
</footer>

<style>
	.footer {
		padding: 3rem 0 1rem;
		background-color: #f9f9f9;
		margin-top: 4rem;
	}
	
	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 1rem;
	}
	
	.footer-info {
		flex-basis: 300px;
		margin-bottom: 2rem;
	}
	
	.footer-info h3 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		color: #333;
	}
	
	.footer-info p {
		color: #666;
	}
	
	.footer-links {
		display: flex;
		flex-wrap: wrap;
		gap: 3rem;
	}
	
	.footer-section {
		margin-bottom: 2rem;
	}
	
	.footer-section h4 {
		font-size: 1.1rem;
		margin-bottom: 1rem;
		color: #333;
	}
	
	.footer-section ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}
	
	.footer-section ul li {
		margin-bottom: 0.5rem;
	}
	
	.footer-section a, .social-links a {
		color: #666;
		text-decoration: none;
		transition: color 0.3s ease;
	}
	
	.footer-section a:hover, .social-links a:hover {
		color: #5333ed;
	}
	
	.social-links {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}
	
	.footer-bottom {
		text-align: center;
		border-top: 1px solid #eee;
		padding-top: 1.5rem;
		margin-top: 1rem;
		font-size: 0.9rem;
		color: #666;
	}
	
	@media (max-width: 768px) {
		.footer-content {
			flex-direction: column;
		}
		
		.footer-links {
			justify-content: space-between;
			width: 100%;
		}
	}
</style>
