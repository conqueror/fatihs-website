import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the events data file
const eventsDataPath = path.join(__dirname, '../src/lib/generated/events.json');

// Generate prerender entries for events
async function generatePrerenderEntries() {
  try {
    // Read the events data
    const eventsData = JSON.parse(fs.readFileSync(eventsDataPath, 'utf8'));
    
    // Get unique event types
    const eventTypes = [...new Set(eventsData.map(event => event.type))];
    
    // Generate entries for each type
    const typeEntries = eventTypes.map(type => `/events/${type}`);
    
    // Generate entries for each event
    const eventEntries = eventsData.map(event => `/events/${event.type}/${event.slug}`);
    
    // Define base routes that should always be prerendered
    const baseRoutes = [
      '/',
      '/about',
      '/blog',
      '/publications',
      '/research',
      '/events',
      '/conferences',
      '/consulting',
      '/contact',
      '/search', // Add search route explicitly
      '/privacy'
    ];
    
    // Combine all entries
    const allEntries = [
      '*',
      '/sitemap.xml',
      '/robots.txt',
      ...baseRoutes,
      ...typeEntries,
      ...eventEntries
    ];
    
    // Output the entries
    console.log('Generated prerender entries:');
    console.log(JSON.stringify(allEntries, null, 2));
    
    // Update the svelte.config.js file
    const configPath = path.join(__dirname, '../svelte.config.js');
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Replace the entries array
    const entriesRegex = /entries:\s*\[([\s\S]*?)\]/;
    const entriesString = `entries: ${JSON.stringify(allEntries, null, 2)}`;
    
    configContent = configContent.replace(entriesRegex, entriesString);
    
    // Write the updated config
    fs.writeFileSync(configPath, configContent);
    
    console.log('Updated svelte.config.js with prerender entries');
  } catch (error) {
    console.error('Error generating prerender entries:', error);
  }
}

// Run the function
generatePrerenderEntries(); 