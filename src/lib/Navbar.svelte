<nav>
	<a href="/" class="logo-link">
		<span class="logo-text">Fatih Nayebi</span>
	</a>
	<div class="nav-links">
		<a href="/">Home</a>
		<a href="/about">About</a>
		<a href="/research">Research</a>
		<a href="/publications">Publications</a>
		<a href="/blog">Blog</a>
		<a href="/news">News</a>
		<a href="/consulting">Consulting</a>
		<a href="/contact">Contact</a>
	</div>
	<button class="mobile-menu-toggle">
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
	}

	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}

		.mobile-menu-toggle {
			display: flex;
		}
	}
</style>
