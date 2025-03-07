<script>
  import { onMount } from 'svelte';
  import { initTheme } from '$lib/services/theme';

  onMount(() => {
    initTheme();
  });
</script>

<slot />

<svelte:head>
  <!-- Inline script for immediate theme application -->
  {@html `
    <script>
      (function() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', theme === 'dark');
      })();
    </script>
  `}
</svelte:head> 