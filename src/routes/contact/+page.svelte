<script>
    import { onMount } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import AnimateInView from '$lib/components/ui/AnimateInView.svelte';
    import { browser } from '$app/environment';
    import PageContainer from '$lib/components/layout/PageContainer.svelte';
    
    let visible = false;
    let name = '';
    let email = '';
    let message = '';
    let isSubmitting = false;
    let isSubmitted = false;
    let storageError = false;
    
    onMount(() => {
        visible = true;
        
        // Check if we can access storage safely
        if (browser) {
            try {
                // Try to access localStorage to test if it's available
                const testKey = 'storage-test';
                localStorage.setItem(testKey, 'test');
                localStorage.removeItem(testKey);
            } catch (err) {
                // If localStorage access fails, set the storage error flag
                console.warn('Storage access is restricted:', err);
                storageError = true;
            }
        }
    });
    
    function handleSubmit() {
        // Set the submitting state
        isSubmitting = true;
        
        // If we have storage access and browser environment, try to save the email
        if (browser && !storageError && email) {
            try {
                sessionStorage.setItem('contact_email', email);
            } catch (err) {
                console.warn('Could not save email to sessionStorage:', err);
            }
        }
        
        // Create form data to submit
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('message', message);
        
        // Send the data to Formspree
        fetch('https://formspree.io/f/xanqrakb', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok');
        })
        .then(data => {
            // Handle success
            isSubmitting = false;
            isSubmitted = true;
            name = '';
            email = '';
            message = '';
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            isSubmitting = false;
            alert('Sorry, there was a problem sending your message. Please try again or contact me directly at fatih@gradientdivergence.com');
        });
    }
    
    // Try to load saved email from sessionStorage if available
    if (browser && !storageError) {
        try {
            const savedEmail = sessionStorage.getItem('contact_email');
            if (savedEmail) {
                email = savedEmail;
            }
        } catch (err) {
            console.warn('Could not retrieve email from sessionStorage:', err);
        }
    }
</script>

<svelte:head>
    <title>Contact | Dr. Fatih Nayebi</title>
    <meta name="description" content="Get in touch with Dr. Fatih Nayebi for collaborations, speaking engagements, or inquiries.">
</svelte:head>

{#if visible}
<PageContainer heroSection={true}>
    <!-- Background decorative elements -->
    <div class="absolute top-20 right-10 opacity-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
    <div class="absolute bottom-40 left-10 opacity-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
    
    <h1 class="text-5xl font-bold mb-4 text-center text-primary dark:text-blue-400" in:fly={{ y: -30, duration: 800, delay: 300 }}>Contact Me</h1>
    <p class="text-lg text-center mb-12 max-w-3xl mx-auto dark:text-gray-300" in:fly={{ y: 30, duration: 800, delay: 500 }}>
        Feel free to reach out to me with any questions or inquiries.
    </p>
    
    <div class="grid md:grid-cols-2 gap-8 mb-12">
        <AnimateInView type="fade" delay={300}>
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full transform transition-all duration-500 hover:shadow-md">
                <h2 class="text-2xl font-semibold mb-6 text-primary dark:text-blue-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                </h2>
                <a href="mailto:fatih@gradientdivergence.com" 
                   class="text-primary dark:text-blue-400 hover:underline flex items-center group mb-8 text-lg">
                    <span class="group-hover:translate-x-1 transition-transform">fatih@gradientdivergence.com</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
                
                <h2 class="text-2xl font-semibold mb-6 text-primary dark:text-blue-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Connect
                </h2>
                <div class="flex flex-col space-y-4">
                    <a href="https://linkedin.com/in/thefatih" target="_blank" rel="noopener noreferrer" 
                       class="flex items-center bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-white p-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors group">
                        <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <span class="group-hover:translate-x-1 transition-transform">LinkedIn</span>
                    </a>
                    
                    <a href="https://scholar.google.com/citations?user=s6lWpdEAAAAJ" target="_blank" rel="noopener noreferrer" 
                       class="flex items-center bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-white p-3 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
                        </svg>
                        <span class="group-hover:translate-x-1 transition-transform">Google Scholar</span>
                    </a>
                    
                    <a href="https://github.com/conqueror" target="_blank" rel="noopener noreferrer" 
                       class="flex items-center bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-white p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group">
                        <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                        </svg>
                        <span class="group-hover:translate-x-1 transition-transform">GitHub</span>
                    </a>
                </div>
            </div>
        </AnimateInView>
        
        <AnimateInView type="fly" x={20} delay={500}>
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-md">
                <h2 class="text-2xl font-semibold mb-6 text-primary dark:text-blue-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Send Me a Message
                </h2>
                
                {#if isSubmitted}
                    <div in:scale class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-green-500 dark:text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 class="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Message Sent!</h3>
                        <p class="text-green-700 dark:text-green-400">Thank you for your message. I'll get back to you as soon as possible.</p>
                        <button 
                            on:click={() => isSubmitted = false}
                            class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            Send another message
                        </button>
                    </div>
                {:else}
                    <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                            <input type="text" id="name" name="name" bind:value={name} required
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                        </div>
                        
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input type="email" id="email" name="email" bind:value={email} required
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                        </div>
                        
                        <div>
                            <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                            <textarea id="message" name="message" rows="5" bind:value={message} required
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"></textarea>
                        </div>
                        
                        <button type="submit" 
                            class="w-full bg-primary dark:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isSubmitting}>
                            {#if isSubmitting}
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            {:else}
                                Send Message
                            {/if}
                        </button>
                    </form>
                {/if}
            </div>
        </AnimateInView>
    </div>
</PageContainer>
{/if} 