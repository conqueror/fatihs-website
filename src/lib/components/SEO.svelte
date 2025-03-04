<!-- 
  SEO.svelte - A reusable component for managing metadata and structured data.
  Usage:
  ```
  <SEO 
    title="Page Title"
    description="Page description"
    canonical="/current-path"
    type="article"
  />
  ```
-->
<script>
  import { page } from '$app/stores';
  import { jsonLdToString } from '$lib/utils/structured-data';

  // Basic SEO properties
  export let title = 'Fatih Nayebi | AI Researcher and Developer';
  export let description = 'Personal website of Fatih Nayebi, featuring research, publications, blog posts, and more on AI, machine learning, and software development.';
  export let keywords = 'AI, machine learning, research, publications, deep learning, natural language processing';
  export let canonical = '';
  export let type = 'website'; // website, article, etc.
  export let noindex = false;
  export let nofollow = false;
  
  // Open Graph properties
  export let openGraph = {};
  const defaultOG = {
    title: title,
    description: description,
    type: type,
    url: canonical || $page?.url?.href,
    image: '/images/og-image.jpg',
    siteName: 'Fatih Nayebi',
  };
  const og = { ...defaultOG, ...openGraph };
  
  // Twitter properties
  export let twitter = {};
  const defaultTwitter = {
    card: 'summary_large_image',
    site: '@FatihNayebi',
    title: title,
    description: description,
    image: '/images/twitter-image.jpg',
  };
  const tw = { ...defaultTwitter, ...twitter };
  
  // Article properties (if type is article)
  export let article = {};
  const defaultArticle = {
    publishedTime: '',
    modifiedTime: '',
    author: 'Fatih Nayebi',
    section: '',
    tags: [],
  };
  const articleData = { ...defaultArticle, ...article };
  
  // Build canonical URL if not provided
  let canonicalUrl = canonical;
  if (!canonicalUrl && $page) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://fatihnayebi.com';
    canonicalUrl = new URL($page.url.pathname, origin).href;
  }
  
  // JSON-LD structured data
  export let structuredData = null;
  
  // Function to sanitize and safely parse JSON-LD
  function parseStructuredData() {
    if (!structuredData) return '';
    if (typeof structuredData === 'string') {
      try {
        return structuredData;
      } catch (e) {
        console.error('Invalid structured data string:', e);
        return '';
      }
    } else if (typeof structuredData === 'object') {
      return jsonLdToString(structuredData);
    }
    return '';
  }
</script>

<svelte:head>
  <!-- Basic SEO metadata -->
  <title>{title}</title>
  <meta name="description" content="{description}" />
  {#if keywords}
    <meta name="keywords" content="{keywords}" />
  {/if}
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  
  <!-- Canonical URL -->
  {#if canonicalUrl}
    <link rel="canonical" href="{canonicalUrl}" />
  {/if}
  
  <!-- Robots directives -->
  {#if noindex || nofollow}
    <meta name="robots" content="{noindex ? 'noindex' : 'index'},{nofollow ? 'nofollow' : 'follow'}" />
  {/if}
  
  <!-- Open Graph metadata -->
  <meta property="og:title" content="{og.title}" />
  <meta property="og:description" content="{og.description}" />
  <meta property="og:type" content="{og.type}" />
  <meta property="og:url" content="{og.url}" />
  {#if og.image}
    <meta property="og:image" content="{og.image}" />
  {/if}
  {#if og.siteName}
    <meta property="og:site_name" content="{og.siteName}" />
  {/if}
  
  <!-- Twitter metadata -->
  <meta name="twitter:card" content="{tw.card}" />
  {#if tw.site}
    <meta name="twitter:site" content="{tw.site}" />
  {/if}
  <meta name="twitter:title" content="{tw.title}" />
  <meta name="twitter:description" content="{tw.description}" />
  {#if tw.image}
    <meta name="twitter:image" content="{tw.image}" />
  {/if}
  
  <!-- Article metadata if applicable -->
  {#if type === 'article'}
    {#if articleData.publishedTime}
      <meta property="article:published_time" content="{articleData.publishedTime}" />
    {/if}
    {#if articleData.modifiedTime}
      <meta property="article:modified_time" content="{articleData.modifiedTime}" />
    {/if}
    {#if articleData.author}
      <meta property="article:author" content="{articleData.author}" />
    {/if}
    {#if articleData.section}
      <meta property="article:section" content="{articleData.section}" />
    {/if}
    {#if articleData.tags && articleData.tags.length > 0}
      {#each articleData.tags as tag}
        <meta property="article:tag" content="{tag}" />
      {/each}
    {/if}
  {/if}
  
  <!-- Structured Data (JSON-LD) -->
  {@html parseStructuredData()}
</svelte:head> 