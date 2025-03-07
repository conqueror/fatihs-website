<script>
  import { spring } from 'svelte/motion';
  
  export let href = '';
  export let variant = 'primary'; // primary, secondary, outline
  export let size = 'md'; // sm, md, lg
  
  let hovered = false;
  let scale = spring(1, {
    stiffness: 0.1,
    damping: 0.4
  });
  
  function onMouseEnter() {
    hovered = true;
    scale.set(1.05);
  }
  
  function onMouseLeave() {
    hovered = false;
    scale.set(1);
  }
  
  // Size classes
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  // Variant classes
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "bg-white text-primary border border-primary hover:bg-gray-50",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary hover:bg-opacity-10"
  };
  
  $: classes = `inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg ${sizeClasses[size]} ${variantClasses[variant]}`;
</script>

<a 
  {href} 
  class={classes}
  on:mouseenter={onMouseEnter} 
  on:mouseleave={onMouseLeave}
  style="transform: scale({$scale});"
  data-sveltekit-preload-data
  data-sveltekit-prefetch
>
  <slot />
  {#if hovered}
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      class="h-5 w-5 ml-2 transition-all duration-300" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      in:scale={{ start: 0, duration: 300 }}
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  {/if}
</a> 