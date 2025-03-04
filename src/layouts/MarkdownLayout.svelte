<script>
  // Removed custom components mapping to avoid Node loading .svelte files during build
  export let components = {};
</script>

<main>
  <slot />
</main>

<style>
  /* Global styling for markdown pages */
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
</style> 