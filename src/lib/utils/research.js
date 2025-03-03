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
 * Get all research areas
 * @returns {Object[]} Array of research areas
 */
export function getAllResearchAreas() {
  try {
    return researchAreas;
  } catch (error) {
    console.warn('Falling back to hardcoded research areas data');
    return FALLBACK_RESEARCH_AREAS;
  }
}

/**
 * Get a research area by its slug
 * @param {string} slug - The slug of the research area
 * @returns {Object|null} The research area or null if not found
 */
export function getResearchAreaBySlug(slug) {
  try {
    return researchAreas.find(area => area.slug === slug) || null;
  } catch (error) {
    console.warn('Falling back to hardcoded research areas data');
    return FALLBACK_RESEARCH_AREAS.find(area => area.slug === slug) || null;
  }
}

/**
 * Get ordered research areas
 * @returns {Object[]} Array of research areas sorted by order
 */
export function getOrderedResearchAreas() {
  try {
    return [...researchAreas].sort((a, b) => a.order - b.order);
  } catch (error) {
    console.warn('Falling back to hardcoded research areas data');
    return [...FALLBACK_RESEARCH_AREAS].sort((a, b) => a.order - b.order);
  }
} 