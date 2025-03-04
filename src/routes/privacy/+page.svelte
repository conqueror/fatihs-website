<script>
  import SEO from '$lib/components/SEO.svelte';
</script>

<SEO
  title="Privacy Policy | Fatih Nayebi"
  description="Privacy policy for Fatih Nayebi's personal website. Learn how we handle your data and respect your privacy."
  canonical="/privacy"
/>

<div class="container mx-auto px-4 py-8">
  <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
    <h1 class="text-3xl font-bold mb-6 dark:text-white">Privacy Policy</h1>
    
    <p class="mb-6 dark:text-gray-200">
      Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </p>
    
    <div class="space-y-8">
      <section>
        <h2 class="text-2xl font-semibold mb-3 dark:text-white">Overview</h2>
        <p class="mb-3 dark:text-gray-200">
          This Privacy Policy explains how Fatih Nayebi ("we", "us", or "our") collects, uses, and shares your information 
          when you visit fatihnayebi.com ("the Site"). This Privacy Policy applies to information we collect when you use our website, 
          or when you otherwise interact with us.
        </p>
        <p class="mb-3 dark:text-gray-200">
          We respect your privacy and are committed to protecting your personal data. Please read this Privacy Policy carefully to 
          understand our practices regarding your personal data.
        </p>
      </section>
      
      <section>
        <h2 class="text-2xl font-semibold mb-3 dark:text-white">Information We Collect</h2>
        <p class="mb-3 dark:text-gray-200">
          We collect several types of information from and about users of our website, including:
        </p>
        
        <ul class="list-disc ml-6 mb-3 dark:text-gray-200">
          <li class="mb-2">
            <strong>Usage Data:</strong> When you visit our site, we may automatically collect certain information about 
            your device and your browsing actions. This information may include your IP address, browser type, operating system, 
            referring URLs, and information about how you use our website.
          </li>
          <li class="mb-2">
            <strong>Analytics Data:</strong> We use Google Analytics to help us understand how visitors engage with our site. 
            Google Analytics uses cookies and similar technologies to collect and analyze information about the use of the website and 
            report on activities and trends.
          </li>
          <li>
            <strong>Cookies:</strong> We use cookies to enhance your experience on our site. Cookies are small text files stored 
            on your device that help make websites work.
          </li>
        </ul>
      </section>
      
      <section>
        <h2 class="text-2xl font-semibold mb-3 dark:text-white">How We Use Your Information</h2>
        <p class="mb-3 dark:text-gray-200">
          We use the information we collect about you for various purposes, including:
        </p>
        
        <ul class="list-disc ml-6 mb-3 dark:text-gray-200">
          <li class="mb-2">
            To improve and optimize our website
          </li>
          <li class="mb-2">
            To understand how users interact with our website
          </li>
          <li class="mb-2">
            To analyze usage patterns and trends
          </li>
          <li>
            To protect our website and enhance security
          </li>
        </ul>
      </section>
      
      <section>
        <h2 class="text-2xl font-semibold mb-3 dark:text-white">Cookie Policy</h2>
        <p class="mb-3 dark:text-gray-200">
          Our website uses the following types of cookies:
        </p>
        
        <ul class="list-disc ml-6 mb-3 dark:text-gray-200">
          <li class="mb-2">
            <strong>Necessary Cookies:</strong> These cookies are essential for the website to function properly and cannot be disabled.
          </li>
          <li class="mb-2">
            <strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting
            and reporting information anonymously. These cookies can be disabled through your cookie consent preferences.
          </li>
          <li>
            <strong>Preference Cookies:</strong> These cookies enable the website to remember choices you make (such as dark mode preference)
            to provide a more personalized experience.
          </li>
        </ul>
        
        <p class="mb-3 dark:text-gray-200">
          You can manage your cookie preferences at any time by clicking the "Manage Cookie Preferences" button below.
        </p>
        
        <button 
          class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
          on:click={() => {
            // This function would trigger the cookie consent banner
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('open-cookie-preferences'));
            }
          }}
        >
          Manage Cookie Preferences
        </button>
      </section>
      
      <section>
        <h2 class="text-2xl font-semibold mb-3 dark:text-white">Third-Party Services</h2>
        <p class="mb-3 dark:text-gray-200">
          We use the following third-party services that may collect information about you:
        </p>
        
        <ul class="list-disc ml-6 mb-3 dark:text-gray-200">
          <li class="mb-2">
            <strong>Google Analytics:</strong> We use Google Analytics to understand how users interact with our site. 
            Google Analytics uses cookies to collect information. You can learn more about how Google uses your data at 
            <a href="https://policies.google.com/privacy" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.
          </li>
        </ul>
      </section>
      
      <section>
        <h2 class="text-2xl font-semibold mb-3 dark:text-white">Data Retention</h2>
        <p class="mb-3 dark:text-gray-200">
          We retain analytics data for 90 days. After this period, data is aggregated and anonymized.
        </p>
      </section>
      
      <section>
        <h2 class="text-2xl font-semibold mb-3 dark:text-white">Your Rights</h2>
        <p class="mb-3 dark:text-gray-200">
          Depending on your location, you may have certain rights regarding your personal information, including:
        </p>
        
        <ul class="list-disc ml-6 mb-3 dark:text-gray-200">
          <li class="mb-2">The right to access the personal information we hold about you</li>
          <li class="mb-2">The right to request correction of your personal information</li>
          <li class="mb-2">The right to request deletion of your personal information</li>
          <li class="mb-2">The right to object to processing of your personal information</li>
          <li class="mb-2">The right to request restriction of processing of your personal information</li>
          <li>The right to data portability</li>
        </ul>
        
        <p class="mb-3 dark:text-gray-200">
          To exercise any of these rights, please contact us at privacy@fatihnayebi.com.
        </p>
      </section>
      
      <section>
        <h2 class="text-2xl font-semibold mb-3 dark:text-white">Changes to This Privacy Policy</h2>
        <p class="mb-3 dark:text-gray-200">
          We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
        </p>
      </section>
      
      <section>
        <h2 class="text-2xl font-semibold mb-3 dark:text-white">Contact Us</h2>
        <p class="dark:text-gray-200">
          If you have any questions about this Privacy Policy, please contact us at privacy@fatihnayebi.com.
        </p>
      </section>
    </div>
  </div>
</div> 