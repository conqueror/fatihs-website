<script>
  import Image from '$lib/components/ui/Image.svelte';
  
  export let title = '';
  export let description = '';
  export let link = '#';
  export let date = '';
  export let tags = [];
  export let image = '';
  export let imageAlt = '';
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl dark:shadow-gray-900/30 overflow-hidden hover:shadow-xl transition-shadow duration-300">
  {#if image}
    <div class="relative overflow-hidden h-48">
      <Image 
        src={image} 
        alt={imageAlt || title} 
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        style="height: 100%;"
      />
    </div>
  {/if}
  
  <div class="p-6">
    {#if date}
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    {/if}
    
    <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{title}</h3>
    
    <p class="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
    
    {#if tags && tags.length > 0}
      <div class="flex flex-wrap gap-2 mb-4">
        {#each tags as tag}
          <span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">{tag}</span>
        {/each}
      </div>
    {/if}
    
    <a href={link} class="inline-block text-primary dark:text-blue-400 font-medium hover:underline dark:hover:text-blue-300">Read More</a>
  </div>
</div> 