---
title: "Building and Hosting Static Svelte Applications on Kinsta's Static Site Hosting"
date: "2025-03-03"
excerpt: "A step-by-step tutorial on setting up and deploying a static Svelte site with TailwindCSS on Kinsta"
tags: ["Web Development", "CSS", "Responsive Design", "Frontend", "Kinsta", "Svelte", "TailWindCSS"]
author: "Fatih Nayebi"
featured: false
---

# Building and Hosting Static Svelte Applications on Kinsta's Static Site Hosting

**Kinsta’s Static Site Hosting** provides an easy way to deploy fast, static websites globally. This comprehensive guide covers everything from setting up a SvelteKit project with Tailwind CSS, to optimizing it for performance, deploying on Kinsta, and understanding the technical details. The guide is divided into three sections (Tutorial, Best Practices & Troubleshooting, Technical Reference) followed by a fully documented example project.

## Step-by-Step Tutorial

### 1. Set Up a New SvelteKit Project (with Tailwind CSS)

1. **Initialize the SvelteKit project:** Use the official template to scaffold a new app. In your terminal, run:  
   ```bash
   npm create svelte@latest my-static-app
   ```  
   Choose the **“Skeleton Project”** when prompted (you can opt in to TypeScript if you prefer). This creates a `my-static-app` folder with the basic SvelteKit structure ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=1,by%20executing)). Next, install the dependencies and start the dev server:  
   ```bash
   cd my-static-app  
   npm install  
   npm run dev -- --open
   ```  
   This will launch the app at `http://localhost:5173`, showing SvelteKit’s default welcome page ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=cd%20my)) (see image below).

    ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/)) *Default SvelteKit skeleton site (dev server on localhost).*

2. **Install Tailwind CSS:** SvelteKit supports Tailwind via PostCSS. Install Tailwind and its peer deps, and auto-generate config files:  
   ```bash
   npm install -D tailwindcss postcss autoprefixer  
   npx tailwindcss init -p
   ```  
   This creates a `tailwind.config.js` and `postcss.config.js` ([Install Tailwind CSS with SvelteKit - Tailwind CSS](https://v3.tailwindcss.com/docs/guides/sveltekit#:~:text=Install%20,files)). In `tailwind.config.js`, set the `content` paths to include all Svelte files:  
   ```js
   // tailwind.config.js
   export default {
     content: ['./src/**/*.{html,js,svelte,ts}'],
     theme: { extend: {} },
     plugins: []
   };
   ```  
   This ensures Tailwind scans your Svelte components for class names ([Install Tailwind CSS with SvelteKit - Tailwind CSS](https://v3.tailwindcss.com/docs/guides/sveltekit#:~:text=tailwind)) and purges unused CSS in production. Next, add Tailwind’s base styles to your app.

3. **Integrate Tailwind with SvelteKit:** Create a global stylesheet (e.g. `src/app.css`) with Tailwind directives:  
   ```css
   /* src/app.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```  
   These lines include Tailwind’s base reset, component styles, and utilities ([Install Tailwind CSS with SvelteKit - Tailwind CSS](https://v3.tailwindcss.com/docs/guides/sveltekit#:~:text=Create%20a%20,for%20each%20of%20Tailwind%E2%80%99s%20layers)). Now import this CSS in your root layout so it applies site-wide. In SvelteKit, the root layout file is `src/routes/+layout.svelte`. Add the following:  
   ```svelte
   <!-- src/routes/+layout.svelte -->
   <script>
     import "../app.css";
   </script>

   <slot />  <!-- renders the page content -->
   ```  
   Importing `app.css` here ensures Tailwind styles are loaded for all pages ([Install Tailwind CSS with SvelteKit - Tailwind CSS](https://v3.tailwindcss.com/docs/guides/sveltekit#:~:text=6.%20,file)). You can now use Tailwind utility classes in any component. For example, in the homepage component (`src/routes/+page.svelte`), try adding:  
   ```svelte
   <h1 class="text-3xl font-bold underline">Hello Svelte + Tailwind!</h1>
   ```  
   Save and verify that the styled text appears. Tailwind CSS is now fully integrated into your SvelteKit project.

### 2. Create Pages and Verify Static Behavior

With SvelteKit’s filesystem routing, each page is a `.svelte` file under `src/routes`. The template already provided a `+page.svelte` for the home route. Let’s create another page to test multi-page routing:

- **Add an About page:** Create a folder `src/routes/about/` and inside it add a `+page.svelte`. Put some content, for example:  
  ```svelte
  <h2 class="text-2xl font-semibold">About Us</h2>
  <p>Welcome to the About page.</p>
  ```  
  In development, you can navigate to `http://localhost:5173/about` and see this page. SvelteKit’s dev server supports client-side routing by default, so clicking links between pages is smooth. Ensure that you can navigate between the home page and `/about` page. You might add a simple navigation menu in the layout or each page for convenience (e.g., a link to Home and About).

- **Test prerendering locally:** Stop the dev server and run a production build to simulate static generation:  
  ```bash
  npm run build
  ```  
  SvelteKit will compile your site. By default, SvelteKit’s build output goes into a `build/` directory. However, to truly output static HTML files for each page, we need to configure SvelteKit for static site generation in the next step. 

### 3. Configure SvelteKit for Static Site Generation (SSG)

To deploy on Kinsta’s Static Site Hosting, we need to generate a static site (pure HTML/CSS/JS, no server needed). SvelteKit can prerender pages as static files using the **adapter-static**:

1. **Install the static adapter:**  
   ```bash
   npm i -D @sveltejs/adapter-static
   ```  
   This official adapter will convert the SvelteKit app into static files at build time ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=1.%20Install%20the%20%40sveltejs%2Fadapter,the%20following%20command)).

2. **Update `svelte.config.js`:** In this config file, replace the default adapter with the static adapter. For example:  
   ```js
   import adapter from '@sveltejs/adapter-static';
   const config = {
     kit: {
       adapter: adapter({ fallback: 'index.html' })
     },
     preprocess: vitePreprocess()
   };
   export default config;
   ```  
   Here we specify a fallback page (`index.html`). This is important for routing – if a user navigates to a route that isn’t a pre-rendered HTML file, the static host will serve `index.html` which loads your Svelte app and handles the route on the client-side ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=2,index.html)). In practice, if all your pages are prerendered, users will get the specific HTML. The fallback is just a safety net (also useful for client-side only routes or a 404 page).

3. **Prerender your pages:** By default, adapter-static will prerender all *reachable* pages. Ensure that every page you want included in the static build is linked or otherwise known to SvelteKit. Alternatively, you can add `export const prerender = true;` in your root `+layout.js` or in individual page files to explicitly mark them for prerendering ([Static site generation • Docs • Svelte](https://kit.svelte.dev/docs/adapter-static#:~:text=,to%20your%20root%20layout)). In our simple example, the home and about pages will be prerendered automatically. After updating the config, run `npm run build` again – you should see that the `build/` directory now contains `index.html` and `about/index.html` (along with assets).

### 4. Prepare for Deployment on Kinsta

With a static build ready, you can deploy to Kinsta. Kinsta’s Static Site Hosting works by connecting to your Git repository and publishing the built static files. Here’s how to prepare:

- **Commit your code to a Git repository:** Initialize a git repo (if not already) and push your project to GitHub, GitLab, or Bitbucket. Kinsta will pull from one of these providers. Ensure that the latest build output is *not* in source control (you don’t need to commit the `build/` folder; Kinsta will run the build for you). Instead, commit the source code (including `svelte.config.js`, package.json, etc.).

- **Double-check build settings:** In your project’s package.json, the `build` script should be properly defined (SvelteKit’s template uses `vite build`). Make sure it’s there, as Kinsta will run `npm run build` by default ([GitHub - kinsta/static-sveltekit-demo](https://github.com/kinsta/static-sveltekit-demo#:~:text=Setting%20the%20Build%20Command%2C%20Node,version%2C%20and%20Publish%20directory)). Also, verify your `package.json` specifies a Node version compatible with Kinsta’s environment if needed. Kinsta currently supports Node 18.x (and newer), which is compatible with SvelteKit ([GitHub - kinsta/static-sveltekit-demo](https://github.com/kinsta/static-sveltekit-demo#:~:text=Configuration%20option%20Value%20Build%20command,build)).

- **Optional – Environment variables:** If your build or site needs any environment variables (for example, API keys for fetching content at build time), set them in Kinsta’s interface during deployment. You can also add them later in the site settings. Kinsta allows adding env vars which will be applied during the build process ([Static Site Hosting - Environment Variables - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/static-site-environment-variables/#:~:text=Adding%20environment%20variables)). (We’ll cover this in the Technical Reference section as well.)

### 5. Deploying the Static Site to Kinsta

Now deploy via Kinsta’s dashboard:

1. **Log in to MyKinsta:** Go to **MyKinsta** and log in (create an account if you haven’t – static site hosting is free). In the dashboard, click **“Static Sites”** in the left sidebar, then **“Add Site”** ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=MyKinsta%C2%A0dashboard,Publish%20directory%3A%C2%A0%60build)).

2. **Connect your Git repository:** Choose your Git provider (GitHub, GitLab, or Bitbucket) and authorize Kinsta to access it. Select the repository and branch containing your SvelteKit project ([Quick Start Templates - SvelteKit - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/static-site-quick-start/sveltekit-static-site-example/#:~:text=1,Node%20version%3A%2018)).

3. **Configure build settings:** Kinsta may auto-detect your build settings from common frameworks. If not pre-filled, enter the following:  
   - **Build command:** `npm run build`  
   - **Node version:** 18 (at the time of writing, Node 18 LTS is used by Kinsta) ([Quick Start Templates - SvelteKit - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/static-site-quick-start/sveltekit-static-site-example/#:~:text=3,Publish%20directory%3A%20build))  
   - **Publish directory:** `build` (this is the folder SvelteKit’s adapter-static outputs to by default) ([GitHub - kinsta/static-sveltekit-demo](https://github.com/kinsta/static-sveltekit-demo#:~:text=Configuration%20option%20Value%20Build%20command,build)).  

   You can expand an “Environment variables” section to add any needed variables (leave blank if none). Then click **“Create site”** to start the deployment.

4. **Wait for deployment:** Kinsta will spin up a container to install dependencies and run the build. Within seconds, it will deploy the static files. On success, you’ll see a confirmation and a generated public URL for your site (usually something like `https://<your-site-name>.kinsta.app`). Kinsta automatically distributes your site across their CDN network, which has over 260 locations ([Static Site Hosting - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/#:~:text=contain%20the%20pre,to%20generate%20your%20static%20site)), so your content is served quickly worldwide.

5. **Add custom domain (optional):** If you own a domain and want to use it, you can add a custom domain in the site’s settings. Kinsta provides instructions for pointing DNS and can manage an SSL certificate for you ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=7)). This step can be done anytime after the initial deploy.

### 6. Verify the Deployment

After deployment, visit the provided URL (or your custom domain if set) to verify everything is working:

- Check that your homepage loads and displays the content and styling (Tailwind styles should be applied, and navigation between pages should work). Because the site is static, each route should load near-instantly from the CDN. You can test the About page by navigating to `your-site.kinsta.app/about` – it should load the prerendered page (or use the fallback to load via SvelteKit’s client routing if not prerendered).

- Confirm that assets like images or fonts (if you added any to `static/` folder) are accessible. For example, if you placed an image in `static/logo.png`, it should be reachable at `https://your-site.kinsta.app/logo.png`. Kinsta serves files from the `static` folder (and any other static build output) directly.

- Verify SEO tags if any: view page source to ensure `<title>` and `<meta>` tags are present as expected for each page (we’ll discuss SEO best practices later).

Kinsta provides logs and build details in the MyKinsta dashboard. If something went wrong, you can inspect the **Deployments** tab for error messages and refer to the Troubleshooting section below.

## Best Practices, Performance Optimization, and Troubleshooting

Building a static Svelte application is just the beginning. To ensure your site is **fast, well-structured, and SEO-friendly**, and to avoid common pitfalls, consider the following best practices and tips:

### Performance Optimization Tips for Svelte Static Sites

- **Optimize images and assets:** Large images can slow down your site. Use modern formats like WebP/AVIF and generate multiple sizes for responsiveness ([Images • Docs • Svelte](https://svelte.dev/docs/kit/images#:~:text=Images%20can%20have%20a%20big,them%20by%20doing%20the%20following)). In SvelteKit, any images imported in code or referenced in the `static/` folder can be optimized beforehand. Tailwind CSS includes utility classes for responsive images (e.g., `w-full` for fluid width). Also, add the `loading="lazy"` attribute to `<img>` tags to defer offscreen images loading.

- **Minify and compress outputs:** SvelteKit’s production build (via Vite) automatically minifies JS and CSS. Ensure you run `npm run build` for production – this will produce optimized, minified assets. Kinsta’s CDN also adds gzip/Brotli compression when serving files, and appends cache-busting hashes to filenames for long-term caching ([Images • Docs • Svelte](https://svelte.dev/docs/kit/images#:~:text=Vite%20will%20automatically%20process%20imported,useful%20for%20video%2C%20audio%2C%20etc)) (courtesy of Vite). This means browsers can cache your static assets aggressively for better load times.

- **Leverage Svelte’s performance features:** Svelte is very efficient by design – it compiles your components to minimal JS. Still, use the developer tools to audit performance. For example, use Chrome Lighthouse or WebPageTest to get a performance report ([Performance • Docs • Svelte](https://svelte.dev/docs/kit/performance#:~:text=Google%E2%80%99s%20PageSpeed%20Insights%20and%20,already%20deployed%20to%20the%20internet)). Check for opportunities like eliminating unused CSS (Tailwind’s purge should handle this) or reducing third-party script usage. Because our site is static, there is no server processing on each request, which already gives a huge speed boost.

- **Prefetch and code-split if needed:** SvelteKit can prefetch pages during link hover and splits your code by route. These defaults usually suffice. If your site has lots of pages or heavy client-side code, ensure that unused parts aren’t loaded until necessary. You can use the `rel="prefetch"` on links or SvelteKit’s built-in link prefetching for smoother navigation ([Performance • Docs • Svelte](https://svelte.dev/docs/kit/performance#:~:text=,side%20navigation%20are%20eagerly%20anticipated)).

- **Use CDN and caching effectively:** With Kinsta, your static files are served from a global CDN automatically ([Static Site Hosting - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/#:~:text=contain%20the%20pre,to%20generate%20your%20static%20site)). Take advantage by setting proper cache headers if needed (Kinsta sets sensible defaults for static sites). For example, you might configure a longer cache for images or CSS since they have hashed filenames. Also be mindful that to update content, you’ll redeploy (which invalidates the CDN cache for updated files). In MyKinsta, the “Static Site analytics” can show cache hit rates and bandwidth usage ([Get Started - Features - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/static-site-getting-started/static-site-features/#:~:text=match%20at%20L408%20The%20total,analytics%20on%20your%20Dashboard%C2%A0in%20MyKinsta)).

### Best Practices for Structuring a Svelte Project for Static Hosting

- **Organize components and routes logically:** Use SvelteKit’s conventions to your advantage. Create a `src/lib/` folder for reusable components (e.g., a Navbar or Footer) and use the `$lib` alias to import them easily ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=For%20global%20components%20like%20,import%20alias)). Keep page-specific components inside the route folder (e.g., a component used only on the About page can live in `src/routes/about/`). This makes the project maintainable.

- **Utilize layouts:** For elements common to all pages (header, navigation, footer), use a root layout (`+layout.svelte`) so you don’t repeat code on every page ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=,script)). You can also have nested layouts for grouping related routes. This ensures consistent structure and simplifies changes.

- **Static assets in the `static/` directory:** Any files placed in `static/` will be directly copied to the build output without processing ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=,side)). Use this for images, favicon, or other resources. Refer to them by root-relative paths (e.g., `<img src="/my-image.png">`). This avoids bundling assets into JS and lets the CDN handle them. Example: The Kinsta logo added to `static/kinsta-logo.png` can be referenced in your Svelte components and will be available after deployment ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=%3C%21,Posts%3C%2Fa%3E%20%3C%2Fdiv)).

- **Avoid runtime server calls:** Since we’re hosting a static site, there is no server to run dynamic code on each request. If your SvelteKit app fetches data (e.g., from an API) in load functions, ensure those calls can run at build time (prerender) or happen on the client side after the page loads. For example, in a blog, you might prerender pages with content from markdown files or an API. SvelteKit’s `load` functions can run at build time during prerendering to embed data into the static pages ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=To%20load%20data%20from%20the,function)) ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=export%20const%20load%20%3D%20async,posts)). If a page cannot be prerendered (e.g., requires user-specific data), it may not belong on a purely static site.

- **Configure routing for static output:** Decide on trailing slash behavior. By default, SvelteKit might generate routes without trailing slashes. Kinsta’s static hosting will serve `about/index.html` when the user visits `/about/` (with slash) by default. It’s usually good to ensure consistency: you can set `kit.trailingSlash` in `svelte.config.js` to `'always'` or `'never'` to avoid duplicate URL issues ([SEO • Docs • Svelte](https://svelte.dev/docs/kit/seo#:~:text=Normalized%20URLs)). The SSG adapter will produce either `about/index.html` or `about.html` based on this. For SEO (and sanity), one style should redirect to the other ([SEO • Docs • Svelte](https://svelte.dev/docs/kit/seo#:~:text=SvelteKit%20redirects%20pathnames%20with%20trailing,URLs%20are%20bad%20for%20SEO)) (SvelteKit does this normalization automatically, which prevents duplicate content).

- **Include a 404 page:** Many static hosts (likely including Kinsta) will serve a default 404 if a page is not found. SvelteKit allows creating a special `src/routes/+error.svelte` or a static `404.html`. With adapter-static, if you provide a `404.html` in your output (or configure `fallback`), it can serve as the custom 404. It’s a good practice to have a user-friendly 404 page in a static site.

### Common Deployment Issues and How to Resolve Them

Even with the best setup, you might encounter some hiccups. Here are common issues and their solutions:

- **Build fails on Kinsta:** If the deployment logs show an error during `npm install` or `npm run build`, verify your dependencies and Node version. Kinsta uses Node 18.x by default ([GitHub - kinsta/static-sveltekit-demo](https://github.com/kinsta/static-sveltekit-demo#:~:text=Configuration%20option%20Value%20Build%20command,build)) – ensure your project isn’t requiring a newer Node features unless you change the Node version in settings. Also check for any build-time only dependencies (sometimes SvelteKit adapters or plugins need to be devDependencies).

- **Adapter not configured:** If you forgot to install or configure `@sveltejs/adapter-static`, your build might succeed *locally* but no static files are generated. On Kinsta, you would then deploy an empty site or a site missing pages. Solution: double-check `svelte.config.js` has the static adapter setup ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=2,index.html)) and re-run the build. If pages are not prerendering, ensure `prerender` is enabled (as discussed earlier).

- **Routes returning 404 on direct access:** If navigating to a subpage (like `/about`) on the deployed site yields a 404, it usually means the static host isn’t finding the file. This can happen if you didn’t prerender the page and also didn’t set a fallback. The fix is to prerender that route (preferred) or ensure the adapter’s `fallback: 'index.html'` is set so that the SvelteKit client can load it ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=import%20adapter%20from%20%27%40sveltejs%2Fadapter)). After adjusting, redeploy. With our configuration, a direct access should work because either the `about/index.html` is served or the fallback catches it.

- **Tailwind styles not appearing in production:** If your site looks unstyled on Kinsta, a couple things to check: 
  - The global CSS file (with Tailwind directives) must be imported in the layout *before* any content. We did this in `+layout.svelte`. If omitted, the CSS might not load. 
  - Ensure the build is picking up all classes: the `content` paths in `tailwind.config.js` must include all directories where classes are used (we used `./src/**/*.{html,js,svelte,ts}` which is usually fine). 
  - Also, if you used any dynamic class names (concatenated strings, etc.), Tailwind might not catch them and purge them. Use full class names in your components or safelist them in the config.
  - If you see a flash of unstyled content, make sure your `<style>` tags in components have `lang="postcss"` when using Tailwind classes inside Svelte `<style>` blocks ([Install Tailwind CSS with SvelteKit - Tailwind CSS](https://v3.tailwindcss.com/docs/guides/sveltekit#:~:text=8.%20,in%20your%20project)) – this will allow Tailwind to process those blocks too.

- **Environment-specific issues:** Sometimes code works locally but not in Kinsta’s build. This could be due to environment variables not set in Kinsta, differences in case sensitivity (Linux file system is case-sensitive, so ensure your import paths’ casing matches exactly), or missing dev dependencies. If you use any private npm registries or need build secrets, configure those in Kinsta (e.g., via environment variables or Kinsta’s secret manager). Check Kinsta’s **Build** tab logs to diagnose such issues.

- **Caching issues:** After deployment, if you update the site and redeploy, you should get the new version at the URL. If you don’t see changes, it might be cached. Kinsta’s CDN should invalidate changed files on each deployment. However, your browser might still cache aggressively. Do a hard refresh or clear cache. If using a custom domain with Cloudflare or another proxy in front, ensure it’s not caching the old content. On the Kinsta side, the static site itself doesn’t have a server cache to clear (files are static), but the CDN caching is automatically managed.

If issues persist, Kinsta’s community forums and support docs are a good resource ([Static Site Hosting - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/#:~:text=from%20the%20closest%2C%20fastest%2C%20and,access%20CDN%20location)), as well as the SvelteKit Discord/Stack Overflow for debugging build problems.

### SEO Best Practices for Static Svelte Sites

One advantage of static sites is that they are inherently SEO-friendly: all content is present in the HTML sent to the user (and search engine crawler). To maximize your site’s search visibility, follow these practices:

- **Unique Titles & Meta Descriptions:** Each page should define a `<title>` and a `<meta name="description">` appropriate for its content. In SvelteKit, you do this by adding a `<svelte:head>` block in your component. For example, in `+page.svelte` for the About page:  
  ```svelte
  <svelte:head>
    <title>About Us - MySite</title>
    <meta name="description" content="Learn more about MySite and what we do." />
  </svelte:head>
  ```  
  This ensures search engines see relevant titles/descriptions. Avoid duplicate titles or leaving the default from the template. SvelteKit doesn’t automatically set any, so it’s up to you. Google recommends descriptive, concise titles and meta descriptions – you can refer to their guidelines (exposed via Lighthouse SEO audits) ([SEO • Docs • Svelte](https://svelte.dev/docs/kit/seo#:~:text=)).

- **Semantic HTML structure:** Use proper headings (`<h1>…<h2>…`) to structure your content. The SvelteKit template’s default content is minimal; as you build out your site, ensure the homepage has an `<h1>` that describes your site or business. Use accessible, semantic tags (e.g., `<nav>` for navigation, `<footer>` for footer content, etc.). This not only helps SEO but also accessibility.

- **Performance and Core Web Vitals:** Search rankings take performance into account (Google’s Core Web Vitals). A static Svelte site deployed on Kinsta is well-positioned for good scores: it’s fast and has no blocking third-party scripts by default. Continue to monitor things like Largest Contentful Paint (LCP), Total Blocking Time, etc., via tools like PageSpeed Insights ([SEO • Docs • Svelte](https://svelte.dev/docs/kit/seo#:~:text=Performance)). Our earlier Performance tips (image optimization, lazy loading, etc.) directly contribute to better SEO by improving user experience metrics.

- **Canonical URLs:** If your site can be accessed via multiple URLs (for instance, with and without `www`, or both your Kinsta default domain and your custom domain), consider adding a `<link rel="canonical" href="...">` in the `<svelte:head>` to indicate the preferred URL for each page. This prevents duplicate content issues. In a static site on a single domain, this is less of a concern, but it can be useful if you ever change domain or have multiple entry points.

- **Sitemap and Robots.txt:** For a larger site, you might want to generate a `sitemap.xml` and a `robots.txt` and include them in the static output. Since our site is small, it’s optional. But note you can manually create these files and put them in `static/` – search engines will find them. There are SvelteKit plugins or simple scripts you can use to generate a sitemap from your routes at build time if needed.

- **Social and meta previews:** Although not directly related to search ranking, include Open Graph tags for social media and favicon/manifest for better sharing and appearance. For example, in `<svelte:head>` add `<meta property="og:title" content="...">`, etc., so that when your site is shared, it has a nice preview. Being a static site doesn’t limit this – you just hard-code or generate those meta tags in the HTML.

By adhering to these practices, your static Svelte site will be well-optimized for search engines. SvelteKit’s SSR (or prerendered static HTML) ensures crawlers can read your content easily, and the rest is about providing quality content and metadata. Remember, **high-quality content** and credible backlinks are the most significant SEO factors ([SEO • Docs • Svelte](https://svelte.dev/docs/kit/seo#:~:text=The%20most%20important%20aspect%20of,building%20sites%20that%20rank%20well)) – the technical setup we’ve done ensures that nothing on the technical side will hold you back.

## Technical Reference Document

This section provides a deeper technical reference on how Kinsta’s Static Site Hosting interacts with your SvelteKit project, including build configuration, environment variables, caching, and file structure considerations.

### How Kinsta Static Site Hosting Works with SvelteKit

Kinsta’s static site hosting is a **Git-driven deployment service** for static files. When you connect your SvelteKit repository and trigger a deployment, here’s what happens under the hood:

- **Build Process:** Kinsta pulls your code from the specified Git repo and branch. It then installs dependencies (running `npm install` automatically) and executes the build command you provided (e.g., `npm run build`) ([GitHub - kinsta/static-sveltekit-demo](https://github.com/kinsta/static-sveltekit-demo#:~:text=Dependency%20Management)) ([GitHub - kinsta/static-sveltekit-demo](https://github.com/kinsta/static-sveltekit-demo#:~:text=Configuration%20option%20Value%20Build%20command,build)). In our case, this runs the SvelteKit static adapter to output the site into the `build/` folder.

- **Deployment of static files:** Once the build succeeds, Kinsta takes all files in the **Publish directory** (we set this to `build`) and pushes them to their static file server and CDN. There is no Node.js server running your code afterward – it’s just serving the generated HTML, JS, CSS, and other assets. This makes the hosting very fast and secure (no server-side processing) ([Static Site Hosting - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/#:~:text=Features)).

- **Global CDN and Edge Distribution:** Kinsta automatically distributes your static site files to **260+ edge locations** around the world ([Static Site Hosting - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/#:~:text=contain%20the%20pre,to%20generate%20your%20static%20site)). This means when a user in Europe or Asia visits your site, they get the files from a nearby server, reducing latency. You don’t need to configure anything extra for this; it’s built-in. Essentially, Kinsta’s platform acts similarly to Netlify or Vercel for static sites, leveraging a content delivery network for speed.

- **Free static hosting limits:** As of now, Kinsta’s free static hosting includes up to 100 sites, 100 GB bandwidth per month, and 600 build minutes per month ([Static Site Hosting - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/#:~:text=Static%20Site%20Hosting%20at%20Kinsta,includes%20the%20following%20for%20free)). Our SvelteKit site is small, so these limits are generous. If your site grows (in traffic or number of builds), monitor the usage in the MyKinsta dashboard (there’s an Analytics section showing bandwidth and build time) ([Get Started - Features - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/static-site-getting-started/static-site-features/#:~:text=match%20at%20L408%20The%20total,analytics%20on%20your%20Dashboard%C2%A0in%20MyKinsta)).

- **Re-deploys on commit:** Kinsta watches the connected branch for new commits. If you push changes to your repository, Kinsta can automatically trigger a rebuild and deploy the updated site (depending on your settings). This CI/CD workflow means updating your site is as simple as a `git push`. You can also manually trigger deployments from the dashboard.

Importantly, because the site is static, features like forms or any backend logic need external services (e.g., using a third-party form handler or API). Kinsta static hosting doesn’t run server-side code for you – it’s purely static, as if you hosted on GitHub Pages or an S3 bucket. For any dynamic functionality, you’d either incorporate it at build time or use client-side JavaScript to call external APIs (for example, a contact form might use a service like Formspree, or you could use Kinsta’s Application Hosting if you need server code).

### Build Process Configuration Options on Kinsta

When deploying a SvelteKit static site on Kinsta, you have a few key configuration options to be aware of:

- **Build command:** This is the command Kinsta runs to produce the static files. We used `npm run build`. In SvelteKit’s package.json, that typically invokes `vite build` (which in turn runs SvelteKit build). You could customize it if needed (for example, some projects might require setting an environment variable or running multiple steps). In the Kinsta UI, you can edit this command if your build process changes. Kinsta also detects common frameworks; using the SvelteKit template, it recognized the build command automatically for us ([GitHub - kinsta/static-sveltekit-demo](https://github.com/kinsta/static-sveltekit-demo#:~:text=Setting%20the%20Build%20Command%2C%20Node,version%2C%20and%20Publish%20directory)).

- **Node version:** Kinsta allows specifying a Node.js version for the build environment. This is important because SvelteKit may require a certain Node version. At the time of writing, Node 18.x is used by default (which works for SvelteKit). If your project needed Node 20, for example, you would set that in the config. We cited that Kinsta auto-set Node 18.16.0 for our build ([GitHub - kinsta/static-sveltekit-demo](https://github.com/kinsta/static-sveltekit-demo#:~:text=Configuration%20option%20Value%20Build%20command,build)). You can typically leave this unless you have specific needs.

- **Publish directory:** This tells Kinsta which folder contains the final static site to deploy. We set it to `build` (the default output for adapter-static). If you ever change the adapter output (some advanced use-cases might use a custom dir) or if you have a different build setup, update this accordingly. Kinsta will deploy whatever files are in this directory.

- **Environment variables during build:** In the **Build settings** step (or later in site settings), you can define environment variables that will be present when the build command runs ([Static Site Hosting - Environment Variables - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/static-site-environment-variables/#:~:text=Adding%20environment%20variables)) ([Static Site Hosting - Environment Variables - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/static-site-environment-variables/#:~:text=To%20add%20environment%20variables%20when,value%20pairs)). For instance, `API_TOKEN=...` can be set so that if your SvelteKit `load` functions or endpoints use `process.env.API_TOKEN` at build time, they have the value. This is crucial for any build-time data fetching or configuration. Note: In a static site, environment variables won’t be available at runtime (there is no server process to read them), so only build-time usage is relevant – e.g., toggling a feature flag for the build or embedding an API key into the generated files.

- **Build cache:** Kinsta caches `node_modules` between builds to speed them up when possible. On a static site, build times are usually short anyway (especially for our simple project), but if you have lots of dependencies, this cache helps. If you need a clean rebuild (to clear cache), Kinsta allows that via redeploy options.

- **Deployment lifecycle:** Each time a deployment runs, Kinsta will do a fresh install and build unless it’s using cached layers. After building, the old version of the site is atomically replaced with the new one. If a build fails, the previous deployment remains active (so your site won’t go down). This means you can fix issues and redeploy without outage.

In summary, the build configuration on Kinsta is straightforward for SvelteKit. Usually, the defaults (“npm run build”, Node 18, publish `build/`) are correct ([Quick Start Templates - SvelteKit - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/static-site-quick-start/sveltekit-static-site-example/#:~:text=select%C2%A0GitHub%2C%C2%A0click%C2%A0Connect%20git%20provider%C2%A0,Click%20Create%20site)), especially if you used the official template or Kinsta’s example repo. You have flexibility to adjust these if your project is not standard.

### Environment Variables and Caching Considerations

**Environment Variables:**

Even static sites sometimes require secrets or config at build time. Kinsta provides an interface to manage these:

- You can add env vars either when adding the site (there’s a section to add key-value pairs) or after deployment in the site’s **Settings** tab ([Static Site Hosting - Environment Variables - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/static-site-environment-variables/#:~:text=To%20add%20environment%20variables%20when,value%20pairs)) ([Static Site Hosting - Environment Variables - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/static-site-environment-variables/#:~:text=To%20add%20environment%20variables%20after,up%20window)). After adding or changing an env var, you’ll need to redeploy to apply it (Kinsta will remind you of this) ([Static Site Hosting - Environment Variables - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/static-site-environment-variables/#:~:text=Important)).

- Env var names can include letters, numbers, and underscores. The values are literal strings – be cautious with special characters. (Kinsta’s docs note that certain characters like parentheses, commas, quotes need escaping or can cause issues ([Static Site Hosting - Environment Variables - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/static-site-environment-variables/#:~:text=Special%20characters%20in%20environment%20variables)) ([Static Site Hosting - Environment Variables - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/static-site-environment-variables/#:~:text=Commas)).) In most cases, simple alphanumeric values work without fuss.

- In a SvelteKit static build, you might use these env vars inside `+page.server.js` or `+layout.server.js` (which run at build time during prerender) or directly in `svelte.config.js` or other config files. For example, you could use an env var to switch APIs (prod vs. dev) or include/exclude certain pages.

- One thing to note: SvelteKit distinguishes between public and private env vars. Public env vars (prefixed with `PUBLIC_`) can be exposed to client-side code. But since there’s no running server, any env var you use will effectively become part of the static build. If you have secrets (like an API key), consider if you want them baked into the static files (perhaps not). You might use a build-time secret to fetch content and not include the secret itself in the output. Once prerendered, the secret doesn’t ship to the client, just the fetched data does.

**Caching:**

Kinsta’s static site hosting handles caching at the CDN level:

- Once deployed, your files are cached on edge servers. When users request a file, the CDN serves it. The first request to a particular edge might be a cache miss (then the edge node will fetch from origin), but subsequent requests are extremely fast. The good news is this is seamless – you don’t have to manage it. Kinsta ensures each deployment invalidates the previous cache where needed (often by using unique filenames/hashes for assets or by purging caches).

- **Cache-Control headers:** Kinsta sets default caching headers for static sites, which likely include long max-age for assets. For HTML pages, they might be set to no-cache or a short life to ensure you can update content. It’s worth checking your site’s response headers (open devtools Network tab) to see the `cache-control` header. If you need custom behavior, you might not have a straightforward way to change it on static hosting (unlike an Application Hosting where you can control headers in code). In static hosting, the headers are generally managed by Kinsta’s platform. However, since assets have unique hashes, it’s fine for them to be cached long (until you redeploy new ones).

- **Edge caching for HTML:** Static HTML pages can be cached at edge too. Kinsta likely caches them by default because there’s no user-specific content. This means even your HTML is served from the nearest location. If you publish an update, users might still get an old HTML from some edge for a brief time until it refreshes. Typically, Kinsta will purge HTML on deploy, so this window is small. If you ever run into issues where you see an old version of a page after deploy, it could be an edge cache not yet updated – you might resolve it by a “redeploy” or contacting support to purge caches. But again, Kinsta’s static deployment should handle this automatically.

- **No server-side caching to worry about:** In WordPress hosting you often deal with object cache, page cache, etc. None of that exists here – the site is static. So you won’t, for example, log into MyKinsta to “clear cache” (that section is for WordPress sites). The only caches are the CDN edges and the user’s browser. Both will update when new files are deployed (thanks to cache-busting) or when you manually bust them (by changing file names or doing a full purge).

In short, environment variables give you flexibility at build time, and Kinsta’s caching ensures your site is speedy globally without manual intervention. Use env vars wisely (don’t expose secrets in the client), and rely on Kinsta’s CDN for efficient delivery.

### File Structure and Hosting Requirements on Kinsta

To ensure your SvelteKit project works smoothly on Kinsta, keep in mind the expected file structure and naming:

- **Repository structure:** Your git repo should include the SvelteKit project files (src, svelte.config.js, package.json, etc.). It should *not* include the `node_modules` folder or the `.svelte-kit` build cache – those are rebuilt on Kinsta. It also typically wouldn’t include the output `build` directory; Kinsta will generate that on each deploy. A clean repository with just the source is ideal. Kinsta automatically runs `npm install` so your package.json and lockfile must be present and correct ([GitHub - kinsta/static-sveltekit-demo](https://github.com/kinsta/static-sveltekit-demo#:~:text=Dependency%20Management)).

- **Output folder (`build/`):** After a successful build, this directory contains your static site. Key contents typically are:
  - `index.html` (the homepage HTML)
  - An `about/index.html` for the About page (and similarly for any other routes)
  - A `404.html` if you generated one (optional)
  - `assets/` folder or other hashed asset folders containing your JS bundles, CSS, and images processed by Vite.
  - Anything from `static/` gets copied here at the root (e.g., `favicon.png` in static goes to `build/favicon.png`).
  
  Kinsta will deploy everything inside `build` as-is. So if something is missing in `build`, it won’t be on your site. Always test `npm run build` locally and inspect the `build` folder to ensure all expected files are there.

- **Entry file and fallback:** Kinsta’s web server will serve `index.html` for the root path. Because we set a fallback in adapter-static, if a user requests `/some-nonexistent-page`, Kinsta will not find a specific file and likely serve nothing (404) *unless* we have a fallback. The adapter-static’s `fallback: 'index.html'` setting means it will place a copy of `index.html` in the build that can be used as a fallback. In practice, adapter-static will generate an `index.html` and also use it as the catch-all (with a special script to handle client-side routing). Thus, our SPA navigation will work. 
  - If you prefer, you could have a custom 404 page instead (e.g., `404.html`). Kinsta checks for a `404.html` for unknown paths (common static hosting behavior). If present, it will serve that for 404s.
  - Summary: Always have either a fallback or prerender every route. Our config gave us a fallback index, which is fine. Alternatively, setting `prerender = true` for everything including dynamic routes ensures each has an HTML file.

- **Case sensitivity and OS specifics:** The deployment environment is Linux-based, so file names are case-sensitive. Ensure your imports and file names match exactly (e.g., importing `Navbar.svelte` vs `navbar.svelte` – one will fail on Linux if the case doesn’t match, even if it worked on Windows/macOS).

- **No special server configuration files needed:** On some static hosts, you might need a config file (like `netlify.toml` or `vercel.json`). Kinsta’s static hosting doesn’t require any additional config file in your repo. All configuration is done via the interface (or their API if you use it). So your repo remains clean of provider-specific config.

- **Using Kinsta’s “Quick Start” template:** Kinsta provides an example SvelteKit static repo (which we referenced) ([Quick Start Templates - SvelteKit - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/static-site-quick-start/sveltekit-static-site-example/#:~:text=1,Node%20version%3A%2018)). If you used that as a template, your structure will naturally be aligned. That template, for instance, includes the necessary adapter and settings. Our guide mirrored those steps. Always ensure your `svelte.config.js` matches your deployment type (static adapter for static hosting) – this is the most important configuration file for SvelteKit’s output.

Finally, note that if you ever need more advanced hosting (like adding a server function or using a different runtime), Kinsta offers an **Application Hosting** service where you could run a SvelteKit SSR app or an API. You could migrate to that if static hosting becomes too limiting. But for most use-cases (blogs, docs, marketing sites, portfolios), static hosting with SvelteKit is perfect: you get the benefits of Svelte’s speed and Kinsta’s global hosting, without worrying about servers.

## Example Project: SvelteKit Static Site with TailwindCSS (Fully Documented)

To solidify the concepts, here is a fully documented example of a static SvelteKit project using Tailwind CSS. This example project has a simple Home page and an About page, a common layout with a navbar, and demonstrates best practices like using the static adapter and organizing code. Each file is annotated with comments to explain its purpose.

### Project Structure

```
my-static-app/
├── src/
│   ├── app.css              # Global Tailwind CSS imports
│   ├── lib/
│   │   └── Navbar.svelte    # Reusable Navbar component
│   └── routes/
│       ├── +layout.svelte   # Root layout (imports CSS and Navbar)
│       ├── +page.svelte     # Home page
│       └── about/
│           └── +page.svelte # About page
├── static/
│   └── kinsta-logo.png      # Example static asset (Kinsta logo for nav)
├── svelte.config.js         # SvelteKit configuration (uses adapter-static)
├── tailwind.config.js       # Tailwind configuration (content paths, theme)
├── postcss.config.js        # PostCSS config for Tailwind
└── package.json             # Project metadata and scripts
```

*(Note: The `static/kinsta-logo.png` is just an example image; you can replace it or remove references to it if not needed.)*

### Configuration Files

**svelte.config.js** – Configures SvelteKit to use the static site adapter for SSG.

```js
import adapter from '@sveltejs/adapter-static';
// import { vitePreprocess } from '@sveltejs/kit/vite'; // (Optional) for PostCSS in Svelte <style> blocks

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // Use static adapter to export site as static files
    adapter: adapter({
      fallback: 'index.html'  // fallback page for SPA routing (optional)
    }),
    // You could add prerender: { default: true } here to prerender all pages by default
  },
  // preprocess: vitePreprocess()  // enable if you plan to use <style lang="postcss"> in components
};

export default config;
```

*Comments:* We import `adapter-static` and configure it with a fallback. This will output `index.html` to handle any routes not individually prerendered. We could also ensure all routes are prerendered by default. The `vitePreprocess` (commented out above) is useful if we use PostCSS in component `<style>` tags – Tailwind’s guide recommends it ([Install Tailwind CSS with SvelteKit - Tailwind CSS](https://v3.tailwindcss.com/docs/guides/sveltekit#:~:text=3.%20,style%3E%20blocks)). In this example, we rely on the global CSS, so it’s not strictly required.

**tailwind.config.js** – Tailwind CSS configuration.

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}'
  ],
  theme: {
    extend: {
      // You can extend the default theme here (colors, fonts, etc.)
    }
  },
  plugins: [
    // Add Tailwind plugins if needed, e.g., require('@tailwindcss/typography')
  ]
};
```

*Comments:* The `content` field tells Tailwind where to find class names in our project. We include all files in `src/` (pages, components, etc.) ([Install Tailwind CSS with SvelteKit - Tailwind CSS](https://v3.tailwindcss.com/docs/guides/sveltekit#:~:text=%2F,plugins%3A%20%5B%5D)). This ensures unused classes are purged in production. We have no custom theme changes or plugins for now, but this is where you’d add them. For example, you might include `@tailwindcss/forms` or typography plugin in the plugins array.

**postcss.config.js** – PostCSS configuration.

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

*Comments:* This was generated by `tailwindcss init -p`. It enables Tailwind CSS and autoprefixer (which adds vendor prefixes for CSS). SvelteKit (via Vite) will use this config when processing CSS. We don’t need to change anything here. Autoprefixer ensures better browser support automatically ([Building your static website with Svelte, SvelteKit and TailwindCSS - DEV Community](https://dev.to/robertobutti/how-to-start-building-your-static-website-with-svelte-and-tailwindcss-hbk#:~:text=The%20file%20)).

### Global Styles

**src/app.css** – Imports Tailwind’s base styles and utilities.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

*Comments:* These directives pull in Tailwind’s CSS. We import this file in our root layout so that these styles apply globally. Tailwind’s base reset will normalize styles, and utility classes (like `text-3xl`) will work once this is loaded. We don’t put any other CSS here, but you could add global styles if needed.

### Svelte Components

**src/lib/Navbar.svelte** – A navigation bar component used on all pages.

```svelte
<script lang="ts">
  // No props needed for now. This is a simple static navbar.
</script>

<nav class="bg-gray-800 text-white p-4 flex justify-between items-center">
  <!-- Logo/Home link -->
  <a href="/" class="flex items-center">
    <img src="/kinsta-logo.png" alt="Kinsta Logo" class="h-8 mr-2" />
    <span class="font-bold">MyStaticSite</span>
  </a>
  <!-- Navigation links -->
  <div>
    <a href="/" class="mr-4 hover:underline">Home</a>
    <a href="/about" class="hover:underline">About</a>
  </div>
</nav>

<style>
  /* Additional styling (optional): you can also use Tailwind classes as done above. */
</style>
```

*Comments:* This Navbar uses Tailwind classes for quick styling – a dark background, horizontal flex layout, some spacing, etc. It includes a logo image (assuming `kinsta-logo.png` is in static assets) and links to Home and About. The links use normal anchor tags (`<a href>`); SvelteKit will intercept these for client-side navigation, but also they work as regular links if JS is disabled. We could have placed this component in `src/routes/Navbar.svelte`, but by putting in `src/lib`, we can import it with `$lib/Navbar.svelte` easily in any file.

**src/routes/+layout.svelte** – The root layout that wraps all pages.

```svelte
<script lang="ts">
  import '$lib/Navbar.svelte';  // Importing from lib (via alias)
  import '../app.css';          // Import global Tailwind CSS
</script>

<Navbar />  <!-- Include the navigation bar on all pages -->

<slot />    <!-- This is where page-specific content will be rendered -->

<!-- Optionally, a footer could be included here as well -->
```

*Comments:* The layout imports the `Navbar` component and the global CSS file. The `<slot />` is essential – it renders the content of child pages. Because this is `src/routes/+layout.svelte` at the root, it applies to every route. We don’t have any specific layout styling or scripts beyond including global needs. The Navbar will appear at the top of every page, and if we wanted a footer, we could place it below the slot. We could also include a `<svelte:head>` here if we had meta tags common to all pages (like a site-wide CSS link or script), but in this case, each page will set its own title.

**src/routes/+page.svelte** – Home page component.

```svelte
<script>
  // This is the home page script. If we needed to fetch data, we'd use a load function in +page.js.
</script>

<svelte:head>
  <title>Home - MyStaticSite</title>
  <meta name="description" content="Welcome to my SvelteKit static site home page." />
</svelte:head>

<section class="p-8 text-center">
  <h1 class="text-4xl font-bold mb-4">Welcome to My Static SvelteKit Site!</h1>
  <p class="text-lg">
    This site is built with SvelteKit and Tailwind CSS, and hosted on Kinsta's Static Site service.
  </p>
  <p class="mt-2 text-gray-700">
    Explore the <a href="/about" class="text-blue-600 hover:underline">About page</a> to learn more.
  </p>
</section>
```

*Comments:* We set a unique `<title>` and `<meta description>` in the head for SEO. The content is wrapped in a section with some Tailwind classes for padding and text styles. It’s a simple welcome message with a link to the About page. Because the Navbar is in the layout, we don’t need to add navigation here; it’s already at the top via layout. Also note, we didn’t need any `<style>` here since we used Tailwind utilities directly for styling. If we had component-specific styles, we could include a `<style>` tag (with `lang="postcss"` if using Tailwind classes inside it, though typically you’d just use classes instead of writing new CSS).

**src/routes/about/+page.svelte** – About page component.

```svelte
<script>
  // No special script needed for static content
</script>

<svelte:head>
  <title>About - MyStaticSite</title>
  <meta name="description" content="About this static SvelteKit site and its purpose." />
</svelte:head>

<section class="p-8">
  <h2 class="text-3xl font-semibold mb-4">About This Site</h2>
  <p>
    This is an example static site built with <a href="https://kit.svelte.dev" class="text-blue-600 hover:underline" target="_blank">SvelteKit</a> and styled with Tailwind CSS.
    It demonstrates how to prerender pages and deploy them on <a href="https://kinsta.com/static-site-hosting/" class="text-blue-600 hover:underline" target="_blank">Kinsta's Static Site Hosting</a>.
  </p>
  <p class="mt-2">
    Because the site is prerendered, this page and all its content are delivered as a simple HTML file, making it very fast and SEO-friendly.
  </p>
</section>
```

*Comments:* Similar structure to the home page: set the head with appropriate meta tags, then content in a section. We have some links in the text (to SvelteKit docs and Kinsta) opening in new tabs (`target="_blank"`). The Tailwind classes here style the headings and text spacing. The Navbar and overall page style (background, etc.) are inherited from what we set globally (if any in Tailwind base or via the layout). If we wanted to adjust the overall background or font, we could do so in a global CSS or in Tailwind config. For example, we might set a global background in `app.css` or as a Tailwind utility on a wrapping div in the layout.

### Running and Deploying the Example

- To run this project locally, you would go to the project directory, run `npm install` to install dependencies (Svelte, SvelteKit, Tailwind, etc.), then `npm run dev` to serve it locally. You can navigate to `/` and `/about` to see the content.

- To build the project for production: `npm run build`. After that, inspect the `build/` directory. You should see `index.html`, `about/index.html`, and static assets including a hashed CSS file (Tailwind output) and JS files (SvelteKit runtime). These are the files that need to be deployed.

- On Kinsta, ensure the **build command** is `npm run build` and **publish directory** is `build`. When deployed, the site should mirror what you saw locally. The Navbar with the logo, the Home and About pages, etc., all functioning with no server.

This example project encapsulates the earlier steps: it uses the static adapter, integrates Tailwind properly, has multiple pages, and follows best practices (component reuse, SEO tags, etc.). You can use this as a starter template for your own static SvelteKit sites. Happy building!

**Sources:**

- Kinsta – *How To Build a Static Site With SvelteKit* ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=1,by%20executing)) ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=1.%20Install%20the%20%40sveltejs%2Fadapter,the%20following%20command)) ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=1,Publish%20directory%3A%C2%A0%60build))  
- Kinsta – Static Site Hosting Quick Start (SvelteKit) ([Quick Start Templates - SvelteKit - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/static-site-quick-start/sveltekit-static-site-example/#:~:text=1,Publish%20directory%3A%20build)) ([Static Site Hosting - Kinsta® Docs](https://kinsta.com/docs/static-site-hosting/#:~:text=contain%20the%20pre,to%20generate%20your%20static%20site))  
- SvelteKit Documentation – Adapter-Static and Prerendering ([How To Build a Static Site With SvelteKit - Kinsta®](https://kinsta.com/blog/static-sveltekit/#:~:text=2,index.html)) ([Static site generation • Docs • Svelte](https://kit.svelte.dev/docs/adapter-static#:~:text=,to%20your%20root%20layout))  
- Tailwind CSS Documentation – SvelteKit Setup ([Install Tailwind CSS with SvelteKit - Tailwind CSS](https://v3.tailwindcss.com/docs/guides/sveltekit#:~:text=Install%20,files)) ([Install Tailwind CSS with SvelteKit - Tailwind CSS](https://v3.tailwindcss.com/docs/guides/sveltekit#:~:text=%40tailwind%20base%3B%20%40tailwind%20components%3B%20%40tailwind,utilities))  
- SvelteKit Docs – SEO and Performance Best Practices ([SEO • Docs • Svelte](https://svelte.dev/docs/kit/seo#:~:text=)) ([Images • Docs • Svelte](https://svelte.dev/docs/kit/images#:~:text=Images%20can%20have%20a%20big,them%20by%20doing%20the%20following))
