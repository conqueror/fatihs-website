<script>
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  export let items = [];
  export let allowMultiple = false;
  
  // Initialize all items as closed
  let openItems = items.map(() => false);
  
  function toggleItem(index) {
    if (allowMultiple) {
      // Toggle the current item
      openItems[index] = !openItems[index];
      openItems = [...openItems]; // Trigger reactivity
    } else {
      // Close all items and open only the clicked one
      const newOpenItems = items.map(() => false);
      newOpenItems[index] = !openItems[index];
      openItems = newOpenItems;
    }
  }
</script>

<div class="space-y-4">
  {#each items as item, i}
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <button 
        class="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        on:click={() => toggleItem(i)}
        aria-expanded={openItems[i]}
      >
        <span class="text-lg font-medium">{item.title}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-5 w-5 transform transition-transform duration-300 {openItems[i] ? 'rotate-180' : ''}" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {#if openItems[i]}
        <div 
          class="px-4 pb-4 pt-0 bg-white" 
          transition:slide={{ duration: 300, easing: quintOut }}
        >
          <div class="prose max-w-none">
            {#if typeof item.content === 'string'}
              <p>{item.content}</p>
            {:else}
              <svelte:component this={item.content} />
            {/if}
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div> 