<script>
  import { fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  export let showModal = false;
  export let closeOnClickOutside = true;
  export let closeOnEsc = true;
  
  let dialog;
  let modalContent;
  
  function close() {
    showModal = false;
  }
  
  function handleKeydown(e) {
    if (closeOnEsc && e.key === 'Escape') {
      close();
    }
  }
  
  function handleClick(e) {
    if (closeOnClickOutside && modalContent && !modalContent.contains(e.target)) {
      close();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showModal}
  <button 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 w-full h-full border-0 cursor-default"
    transition:fade={{ duration: 200 }}
    on:click={handleClick}
    on:keydown={handleKeydown}
    aria-label="Close modal overlay"
  >
    <div 
      class="relative w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh]"
      bind:this={modalContent}
      transition:scale={{ duration: 300, easing: quintOut, start: 0.95 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        class="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
        on:click={close}
        aria-label="Close modal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div class="overflow-auto p-6 max-h-[90vh]">
        <div id="modal-title">
          <slot />
        </div>
      </div>
    </div>
  </button>
{/if} 