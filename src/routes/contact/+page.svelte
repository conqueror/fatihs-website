<script>
    import { fade } from 'svelte/transition';
</script>

<div in:fade={{ duration: 800 }} class="max-w-3xl mx-auto py-12 px-4">
    <h1 class="text-4xl font-bold mb-4 text-center text-primary">Contact Me</h1>
    <p class="text-lg text-center mb-10">Feel free to reach out to me with any questions or inquiries.</p>
    
    <div class="grid md:grid-cols-2 gap-8 mb-12">
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold mb-4">Email</h2>
            <p><a href="mailto:contact@fatihnayebi.com" class="text-primary hover:underline">contact@fatihnayebi.com</a></p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold mb-4">Social Media</h2>
            <div class="flex flex-col space-y-2">
                <a href="https://linkedin.com/in/fatihnayebi" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">LinkedIn</a>
                <a href="https://twitter.com/fatihnayebi" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Twitter</a>
                <a href="https://github.com/fatihnayebi" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">GitHub</a>
            </div>
        </div>
    </div>
    
    <div class="bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-6 text-center">Send Me a Message</h2>
        <form class="space-y-6">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" id="name" name="name" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary">
            </div>
            
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" name="email" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary">
            </div>
            
            <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="message" name="message" rows="5" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
            </div>
            
            <button type="submit" 
                class="w-full bg-[#1E3A8A] text-white font-medium py-2 px-4 rounded-md hover:bg-[#1E40AF] transition-colors">
                Send Message
            </button>
        </form>
    </div>
</div> 