<script>
  export let title = '';
  export let description = '';
  export let link = '#';
  export let date = '';
  export let tags = [];
  export let image = '';
  export let imageAlt = '';
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
  {#if image}
    <div class="relative overflow-hidden h-48">
      <img src={image} alt={imageAlt || title} class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
    </div>
  {/if}
  
  <div class="p-6">
    {#if date}
      <p class="text-sm text-gray-500 mb-2">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    {/if}
    
    <h3 class="text-xl font-bold mb-2 text-gray-800">{title}</h3>
    
    <p class="text-gray-600 mb-4">{description}</p>
    
    {#if tags && tags.length > 0}
      <div class="flex flex-wrap gap-2 mb-4">
        {#each tags as tag}
          <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{tag}</span>
        {/each}
      </div>
    {/if}
    
    <a href={link} class="inline-block text-primary font-medium hover:underline">Read More</a>
  </div>
</div> 