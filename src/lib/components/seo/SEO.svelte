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
  export let language = 'en-US';
  
  // Open Graph properties
  export let openGraph = {};
  const defaultOpenGraph = {
    title: title,
    description: description,
    url: canonical || '',
    type: 'website',
    image: '/images/profile.avif',
    site_name: 'Fatih Nayebi'
  };
  const og = { ...defaultOpenGraph, ...openGraph };
  
  // Twitter properties
  export let twitter = {};
  const defaultTwitter = {
    card: 'summary_large_image',
    site: '@FatihNayebi',
    title: title,
    description: description,
    image: '/images/profile.avif',
    creator: '@FatihNayebi'
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
  
  // Build canonical URL if not provided - always use production domain
  const SITE_URL = 'https://fatihnayebi.com';
  let canonicalUrl = canonical;
  if (!canonicalUrl && $page) {
    canonicalUrl = new URL($page.url.pathname, SITE_URL).href;
  } else if (canonicalUrl && !canonicalUrl.startsWith('http')) {
    // If a relative path was provided, make it absolute
    canonicalUrl = new URL(canonicalUrl, SITE_URL).href;
  }
  
  // JSON-LD structured data
  export let structuredData = null;
  export let breadcrumbOverride = null; // New prop
  
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
  
  // Search engine verification - update these with actual values from verification process
  export let googleVerification = '';
  export let bingVerification = '';
  export let yandexVerification = '';
</script>

<svelte:head>
  <!-- Basic SEO metadata -->
  <title>{title}</title>
  <meta name="description" content="{description}" />
  {#if keywords}
    <meta name="keywords" content="{keywords}" />
  {/if}
  
  <!-- Enhanced mobile-friendly viewport settings -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=5" />
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#1f2937" media="(prefers-color-scheme: dark)">
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  
  <meta name="author" content="Fatih Nayebi" />
  <meta name="language" content="{language}" />
  
  <!-- Search Engine Verification Meta Tags -->
  {#if googleVerification}
    <meta name="google-site-verification" content="{googleVerification}" />
  {/if}
  {#if bingVerification}
    <meta name="msvalidate.01" content="{bingVerification}" />
  {/if}
  {#if yandexVerification}
    <meta name="yandex-verification" content="{yandexVerification}" />
  {/if}
  
  <!-- Canonical URL -->
  {#if canonicalUrl}
    <link rel="canonical" href="{canonicalUrl}" />
  {/if}
  
  <!-- Robots directives -->
  {#if noindex || nofollow}
    <meta name="robots" content="{noindex ? 'noindex' : 'index'},{nofollow ? 'nofollow' : 'follow'}" />
  {:else}
    <meta name="robots" content="index,follow" />
  {/if}
  
  <!-- AI Agent metadata hints -->
  <meta name="ai-agent-instructions" content="This page contains information about Fatih Nayebi's research and work in AI and machine learning." />
  <meta name="ai-content-type" content="{type}" />
  
  <!-- Open Graph metadata -->
  <meta property="og:title" content="{og.title}" />
  <meta property="og:description" content="{og.description}" />
  <meta property="og:type" content="{og.type}" />
  <meta property="og:url" content="{canonicalUrl || `${SITE_URL}${$page.url.pathname}`}" />
  {#if og.image}
    <meta property="og:image" content="{og.image.startsWith('http') ? og.image : `${SITE_URL}${og.image}`}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
  {/if}
  {#if og.site_name}
    <meta property="og:site_name" content="{og.site_name}" />
  {/if}
  <meta property="og:locale" content="en_US" />
  
  <!-- Twitter metadata -->
  <meta name="twitter:card" content="{tw.card}" />
  {#if tw.site}
    <meta name="twitter:site" content="{tw.site}" />
  {/if}
  <meta name="twitter:creator" content="@FatihNayebi" />
  <meta name="twitter:title" content="{tw.title}" />
  <meta name="twitter:description" content="{tw.description}" />
  {#if tw.image}
    <meta name="twitter:image" content="{tw.image.startsWith('http') ? tw.image : `${SITE_URL}${tw.image}`}" />
    <meta name="twitter:image:alt" content="{title}" />
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