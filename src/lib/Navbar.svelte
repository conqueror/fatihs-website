<script>
	let isMenuOpen = false;
	
	function toggleMobileMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<nav>
	<a href="/" class="logo-link">
		<span class="logo-text">Fatih Nayebi</span>
	</a>
	<div class="nav-links" class:open={isMenuOpen}>
		<a href="/">Home</a>
		<a href="/about">About</a>
		<a href="/research">Research</a>
		<a href="/publications">Publications</a>
		<a href="/blog">Blog</a>
		<a href="/news">News</a>
		<a href="/consulting">Consulting</a>
		<a href="/contact">Contact</a>
		<a href="/search" class="mobile-search-link">Search</a>
	</div>
	<div class="search-container">
		<a href="/search" class="search-link" aria-label="Search">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
				<circle cx="11" cy="11" r="8"></circle>
				<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
			</svg>
		</a>
	</div>
	<button class="mobile-menu-toggle" on:click={toggleMobileMenu} aria-label="Toggle menu">
		<span class="bar"></span>
		<span class="bar"></span>
		<span class="bar"></span>
	</button>
</nav>

<style>
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 0;
		position: relative;
	}

	.logo-link {
		text-decoration: none;
		display: flex;
		align-items: center;
	}

	.logo-text {
		font-size: 1.5rem;
		font-weight: 700;
		color: #333;
	}

	.nav-links {
		display: flex;
		gap: 1.5rem;
	}

	.nav-links a {
		color: #333;
		text-decoration: none;
		font-size: 1rem;
		font-weight: 500;
		padding: 0.5rem 0;
		position: relative;
	}

	.nav-links a:after {
		content: '';
		position: absolute;
		width: 0;
		height: 2px;
		background-color: #5333ed;
		bottom: 0;
		left: 0;
		transition: width 0.3s ease;
	}

	.nav-links a:hover:after {
		width: 100%;
	}

	.mobile-search-link {
		display: none;
	}

	.search-container {
		margin-left: 1rem;
		display: flex;
		align-items: center;
	}

	.search-link {
		color: #333;
		display: flex;
		align-items: center;
		padding: 0.5rem;
		border-radius: 50%;
		transition: background-color 0.3s ease;
	}

	.search-link:hover {
		background-color: rgba(83, 51, 237, 0.1);
	}

	.search-icon {
		stroke: #333;
		transition: stroke 0.3s ease;
	}

	.search-link:hover .search-icon {
		stroke: #5333ed;
	}

	.mobile-menu-toggle {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		flex-direction: column;
		justify-content: space-between;
		width: 2rem;
		height: 1.5rem;
	}

	.bar {
		display: block;
		width: 100%;
		height: 3px;
		background-color: #333;
		border-radius: 2px;
		transition: transform 0.3s ease;
	}

	@media (max-width: 768px) {
		.nav-links {
			display: none;
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			flex-direction: column;
			background-color: white;
			padding: 1rem;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
			z-index: 10;
			gap: 1rem;
		}

		.nav-links.open {
			display: flex;
		}

		.mobile-search-link {
			display: block;
		}

		.mobile-menu-toggle {
			display: flex;
		}

		.open ~ .mobile-menu-toggle .bar:nth-child(1) {
			transform: translateY(10px) rotate(45deg);
		}

		.open ~ .mobile-menu-toggle .bar:nth-child(2) {
			opacity: 0;
		}

		.open ~ .mobile-menu-toggle .bar:nth-child(3) {
			transform: translateY(-10px) rotate(-45deg);
		}

		.search-container {
			margin-left: auto;
			margin-right: 1rem;
		}
	}
</style>
