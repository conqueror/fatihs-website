<script>
  import { fade, fly, scale } from 'svelte/transition';
  import { spring } from 'svelte/motion';
  import AnimateInView from '$lib/AnimateInView.svelte';
  import AnimatedButton from '$lib/AnimatedButton.svelte';
  import Accordion from '$lib/Accordion.svelte';
  import Modal from '$lib/Modal.svelte';
  
  // Button showcase
  const buttonVariants = ['primary', 'secondary', 'outline'];
  const buttonSizes = ['sm', 'md', 'lg'];
  
  // Accordion items
  const accordionItems = [
    {
      title: 'What is Svelte?', 
      content: 'Svelte is a revolutionary framework that shifts much of the work to compile time rather than runtime. It builds apps with much smaller bundle sizes and better performance by generating highly optimized vanilla JavaScript.'
    },
    {
      title: 'How do animations work in Svelte?', 
      content: 'Svelte has built-in transition and animation functions like fade, fly, scale, slide, etc. They can be applied using transition directives (in, out, transition) and are highly configurable with options like duration, delay, and easing.'
    },
    {
      title: 'Can I use Svelte with Tailwind CSS?', 
      content: 'Absolutely! Svelte works wonderfully with Tailwind CSS. You simply need to set up PostCSS and Tailwind in your project, and you can use all Tailwind utilities directly in your Svelte components.'
    },
    {
      title: 'What are Spring animations?',
      content: 'Spring animations in Svelte use physics-based motion that feels more natural than linear timing. They\'re ideal for values that change frequently or for smooth interactive animations.'
    }
  ];
  
  // Modal demo
  let showModal = false;
  
  // Animated count demo
  let count = spring(0, {
    stiffness: 0.1,
    damping: 0.6
  });
  
  function animateCount() {
    count.set(0);
    setTimeout(() => {
      count.set(100);
    }, 100);
  }
  
  // Hover effect demo
  let hovered = false;
</script>

<svelte:head>
  <title>Component Showcase | Fatih Nayebi</title>
</svelte:head>

<div in:fade={{ duration: 500 }}>
  <h1 class="text-4xl font-bold mb-8">Interactive Components</h1>
  <p class="text-lg text-gray-600 mb-12">Explore the various interactive and animated components used throughout this website.</p>
  
  <!-- Transition Demos -->
  <section class="mb-16">
    <h2 class="text-2xl font-bold mb-6">Svelte Transitions</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-semibold mb-4">Fade</h3>
        {#key hovered}
          <div class="bg-blue-50 p-4 rounded-lg h-40 flex items-center justify-center" 
               in:fade={{ duration: 500 }}
               on:mouseenter={() => hovered = !hovered}
               on:mouseleave={() => hovered = !hovered}>
            <p class="text-center text-gray-700">Hover me to see fade transition</p>
          </div>
        {/key}
      </div>
      
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-semibold mb-4">Fly</h3>
        {#key hovered}
          <div class="bg-indigo-50 p-4 rounded-lg h-40 flex items-center justify-center" 
               in:fly={{ y: 20, duration: 500 }}
               on:mouseenter={() => hovered = !hovered}
               on:mouseleave={() => hovered = !hovered}>
            <p class="text-center text-gray-700">Hover me to see fly transition</p>
          </div>
        {/key}
      </div>
      
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-semibold mb-4">Scale</h3>
        {#key hovered}
          <div class="bg-purple-50 p-4 rounded-lg h-40 flex items-center justify-center" 
               in:scale={{ start: 0.8, duration: 500 }}
               on:mouseenter={() => hovered = !hovered}
               on:mouseleave={() => hovered = !hovered}>
            <p class="text-center text-gray-700">Hover me to see scale transition</p>
          </div>
        {/key}
      </div>
    </div>
  </section>
  
  <!-- Animated Buttons -->
  <section class="mb-16">
    <h2 class="text-2xl font-bold mb-6">Animated Buttons</h2>
    <div class="space-y-8">
      {#each buttonVariants as variant}
        <div>
          <h3 class="text-xl font-semibold mb-4 capitalize">{variant} Buttons</h3>
          <div class="flex flex-wrap gap-4">
            {#each buttonSizes as size}
              <AnimatedButton {variant} {size} href="#">
                {size.toUpperCase()} Button
              </AnimatedButton>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </section>
  
  <!-- Spring Animation -->
  <section class="mb-16">
    <h2 class="text-2xl font-bold mb-6">Spring Animation</h2>
    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div class="text-center mb-6">
        <div class="text-6xl font-bold text-primary mb-4">{Math.round($count)}%</div>
        <div class="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div class="bg-primary h-4 rounded-full" style="width: {$count}%"></div>
        </div>
        <AnimatedButton variant="primary" on:click={animateCount}>
          Animate Counter
        </AnimatedButton>
      </div>
    </div>
  </section>
  
  <!-- Intersection Observer Animation -->
  <section class="mb-16">
    <h2 class="text-2xl font-bold mb-6">Scroll Animations</h2>
    <div class="space-y-12">
      <AnimateInView type="fade">
        <div class="bg-blue-50 p-8 rounded-xl text-center">
          <h3 class="text-xl font-semibold mb-2">Fade In on Scroll</h3>
          <p>This element fades in when it enters the viewport</p>
        </div>
      </AnimateInView>
      
      <AnimateInView type="fly" y={40}>
        <div class="bg-indigo-50 p-8 rounded-xl text-center">
          <h3 class="text-xl font-semibold mb-2">Fly In on Scroll</h3>
          <p>This element flies in from below when it enters the viewport</p>
        </div>
      </AnimateInView>
      
      <AnimateInView type="scale">
        <div class="bg-purple-50 p-8 rounded-xl text-center">
          <h3 class="text-xl font-semibold mb-2">Scale In on Scroll</h3>
          <p>This element scales in when it enters the viewport</p>
        </div>
      </AnimateInView>
    </div>
  </section>
  
  <!-- Accordion -->
  <section class="mb-16">
    <h2 class="text-2xl font-bold mb-6">Interactive Accordion</h2>
    <Accordion items={accordionItems} />
  </section>
  
  <!-- Modal -->
  <section class="mb-16">
    <h2 class="text-2xl font-bold mb-6">Modal</h2>
    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
      <AnimatedButton variant="primary" on:click={() => showModal = true}>
        Open Modal
      </AnimatedButton>
      
      <Modal bind:showModal>
        <h2 class="text-2xl font-bold mb-4">Modal Title</h2>
        <p class="mb-6">This is a reusable modal component with animations. It can be closed by clicking outside, pressing ESC, or using the close button.</p>
        <div class="flex justify-end">
          <AnimatedButton variant="primary" size="sm" on:click={() => showModal = false}>
            Close Modal
          </AnimatedButton>
        </div>
      </Modal>
    </div>
  </section>
</div> 