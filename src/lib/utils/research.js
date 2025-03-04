// Import the generated research areas list
import { browser } from '$app/environment';
import researchAreas from '$lib/generated/research-areas.json';

// Fallback data in case the JSON import fails
const FALLBACK_RESEARCH_AREAS = [
  {
    slug: 'ai-developer-productivity',
    title: 'AI for Developer Productivity',
    icon: 'lightbulb',
    order: 1,
    timeframe: '2021 - Present',
    collaborators: 'Research Team at Anthropic',
    paperUrl: 'https://arxiv.org/abs/example-paper-1',
    codeUrl: 'https://github.com/fatihnayebi/ai-dev-tools',
    content: '<h1>AI for Developer Productivity</h1><p>Investigating how AI can enhance software development workflows and improve developer productivity through intelligent code assistance.</p>'
  },
  {
    slug: 'nlp-for-code',
    title: 'Natural Language Processing for Code',
    icon: 'code',
    order: 2,
    timeframe: '2020 - 2022',
    collaborators: 'GitHub Next Research Team',
    paperUrl: 'https://arxiv.org/abs/example-paper-2',
    codeUrl: 'https://github.com/fatihnayebi/nlp-code-analysis',
    content: '<h1>Natural Language Processing for Code</h1><p>Exploring how large language models can understand and generate code, with applications in automated code review and documentation.</p>'
  },
  {
    slug: 'neural-networks-time-series',
    title: 'Neural Networks for Time Series Prediction',
    icon: 'chart',
    order: 3,
    timeframe: '2019 - 2021',
    collaborators: 'Quantitative Research Group at JPMorgan',
    paperUrl: 'https://arxiv.org/abs/example-paper-3',
    codeUrl: 'https://github.com/fatihnayebi/time-series-nn',
    content: '<h1>Neural Networks for Time Series Prediction</h1><p>Developed novel neural network architectures optimized for predicting complex time series data in financial markets.</p>'
  }
];

/**
 * Process research areas to ensure collaborators is always properly formatted
 * @param {Array} areas - Array of research area objects
 * @returns {Array} Processed research areas
 */
function processResearchAreas(areas) {
  return areas.map(area => {
    const processedArea = { ...area };
    
    // Process collaborators field
    if (processedArea.collaborators) {
      if (typeof processedArea.collaborators === 'string') {
        // Check if it's a string that looks like an array
        if (processedArea.collaborators.startsWith('[') && processedArea.collaborators.endsWith(']')) {
          try {
            // Try to parse it as JSON
            processedArea.collaborators = JSON.parse(processedArea.collaborators);
          } catch (error) {
            // If parsing fails, treat it as a comma-separated string
            processedArea.collaborators = processedArea.collaborators
              .replace(/[\[\]"']/g, '') // Remove brackets and quotes
              .split(',')
              .map(item => item.trim())
              .filter(Boolean);
          }
        } else {
          // Regular string - assume it's a single collaborator or comma-separated list
          processedArea.collaborators = processedArea.collaborators
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
        }
      }
      
      // Ensure it's always a string for display (join with commas if it's an array)
      if (Array.isArray(processedArea.collaborators)) {
        processedArea.collaboratorsDisplay = processedArea.collaborators.join(', ');
      } else {
        processedArea.collaboratorsDisplay = String(processedArea.collaborators);
        processedArea.collaborators = [processedArea.collaboratorsDisplay];
      }
    } else {
      // Default value if missing
      processedArea.collaborators = ['Fatih Nayebi'];
      processedArea.collaboratorsDisplay = 'Fatih Nayebi';
    }
    
    return processedArea;
  });
}

/**
 * Get all research areas
 * @returns {Object[]} Array of research areas
 */
export function getAllResearchAreas() {
  try {
    return processResearchAreas(researchAreas);
  } catch (error) {
    console.warn('Falling back to hardcoded research areas data');
    return processResearchAreas(FALLBACK_RESEARCH_AREAS);
  }
}

/**
 * Get a research area by its slug
 * @param {string} slug - The slug of the research area
 * @returns {Object|null} The research area or null if not found
 */
export function getResearchAreaBySlug(slug) {
  try {
    const area = researchAreas.find(area => area.slug === slug);
    return area ? processResearchAreas([area])[0] : null;
  } catch (error) {
    console.warn('Falling back to hardcoded research areas data');
    const area = FALLBACK_RESEARCH_AREAS.find(area => area.slug === slug);
    return area ? processResearchAreas([area])[0] : null;
  }
}

/**
 * Get ordered research areas
 * @returns {Object[]} Array of research areas sorted by order
 */
export function getOrderedResearchAreas() {
  try {
    return processResearchAreas([...researchAreas]).sort((a, b) => a.order - b.order);
  } catch (error) {
    console.warn('Falling back to hardcoded research areas data');
    return processResearchAreas([...FALLBACK_RESEARCH_AREAS]).sort((a, b) => a.order - b.order);
  }
} 