import { browser } from '$app/environment';

// Pre-loaded blog posts data for client-side and static builds
const BLOG_POSTS = [
  {
    slug: 'ai-healthcare',
    title: 'AI in Healthcare: Current Applications and Future Possibilities',
    date: '2023-06-15',
    excerpt: 'Exploring how artificial intelligence is transforming healthcare diagnosis, treatment, and patient care.',
    tags: ['AI', 'Healthcare', 'Machine Learning'],
    author: 'Fatih Nayebi',
    featured: true,
    content: '<h1>AI in Healthcare: Current Applications and Future Possibilities</h1><p>Artificial intelligence is revolutionizing healthcare in numerous ways, from improving diagnostic accuracy to personalizing treatment plans. This article explores current applications and future possibilities.</p><h2>Current Applications</h2><p>AI is already being used to analyze medical images, predict patient outcomes, and assist in drug discovery. Machine learning algorithms can detect patterns in data that humans might miss, leading to earlier and more accurate diagnoses.</p><h2>Future Possibilities</h2><p>The future of AI in healthcare looks promising, with potential applications in robotic surgery, personalized medicine, and predictive healthcare. As technology advances, we can expect AI to play an increasingly important role in improving patient care and outcomes.</p>',
    rawContent: 'AI in Healthcare: Current Applications and Future Possibilities\n\nArtificial intelligence is revolutionizing healthcare in numerous ways, from improving diagnostic accuracy to personalizing treatment plans. This article explores current applications and future possibilities.\n\nCurrent Applications\n\nAI is already being used to analyze medical images, predict patient outcomes, and assist in drug discovery. Machine learning algorithms can detect patterns in data that humans might miss, leading to earlier and more accurate diagnoses.\n\nFuture Possibilities\n\nThe future of AI in healthcare looks promising, with potential applications in robotic surgery, personalized medicine, and predictive healthcare. As technology advances, we can expect AI to play an increasingly important role in improving patient care and outcomes.'
  },
  {
    slug: 'ethical-ai',
    title: 'Ethical Considerations in AI Development',
    date: '2023-05-10',
    excerpt: 'Discussing the ethical challenges and responsibilities in developing artificial intelligence systems.',
    tags: ['AI', 'Ethics', 'Technology'],
    author: 'Fatih Nayebi',
    featured: false,
    content: '<h1>Ethical Considerations in AI Development</h1><p>As artificial intelligence becomes more advanced and integrated into our daily lives, it\'s crucial to address the ethical implications of these technologies. This article discusses key ethical considerations in AI development.</p><h2>Transparency and Explainability</h2><p>AI systems should be transparent and their decisions should be explainable to users. This is especially important in high-stakes applications like healthcare and criminal justice.</p><h2>Fairness and Bias</h2><p>AI systems can inherit and amplify biases present in their training data. Developers have a responsibility to identify and mitigate biases to ensure fair treatment across demographic groups.</p><h2>Privacy and Data Protection</h2><p>AI often relies on vast amounts of data, raising concerns about privacy and data protection. Developers must implement robust safeguards to protect user information.</p>',
    rawContent: 'Ethical Considerations in AI Development\n\nAs artificial intelligence becomes more advanced and integrated into our daily lives, it\'s crucial to address the ethical implications of these technologies. This article discusses key ethical considerations in AI development.\n\nTransparency and Explainability\n\nAI systems should be transparent and their decisions should be explainable to users. This is especially important in high-stakes applications like healthcare and criminal justice.\n\nFairness and Bias\n\nAI systems can inherit and amplify biases present in their training data. Developers have a responsibility to identify and mitigate biases to ensure fair treatment across demographic groups.\n\nPrivacy and Data Protection\n\nAI often relies on vast amounts of data, raising concerns about privacy and data protection. Developers must implement robust safeguards to protect user information.'
  },
  {
    slug: 'exploring-large-language-models',
    title: 'Exploring Large Language Models: From GPT to Beyond',
    date: '2023-07-22',
    excerpt: 'An in-depth look at the evolution of large language models and their impact on natural language processing.',
    tags: ['NLP', 'AI', 'Machine Learning'],
    author: 'Fatih Nayebi',
    featured: true,
    content: '<h1>Exploring Large Language Models: From GPT to Beyond</h1><p>Large language models have revolutionized natural language processing, enabling machines to understand and generate human-like text with unprecedented accuracy. This article explores the evolution and implications of these powerful AI systems.</p><h2>The Evolution of Language Models</h2><p>From early statistical models to neural network-based approaches, language modeling has come a long way. The introduction of transformer architectures marked a significant breakthrough, leading to models like GPT (Generative Pre-trained Transformer) and BERT (Bidirectional Encoder Representations from Transformers).</p><h2>Current Capabilities</h2><p>Today\'s large language models can write essays, summarize texts, translate languages, and even generate code. They exhibit a remarkable understanding of context and can produce coherent, contextually relevant responses to complex prompts.</p><h2>Limitations and Challenges</h2><p>Despite their impressive capabilities, large language models face challenges such as hallucinations (generating false information), bias, and the environmental impact of training large models. Addressing these issues is crucial for the responsible advancement of the field.</p>',
    rawContent: 'Exploring Large Language Models: From GPT to Beyond\n\nLarge language models have revolutionized natural language processing, enabling machines to understand and generate human-like text with unprecedented accuracy. This article explores the evolution and implications of these powerful AI systems.\n\nThe Evolution of Language Models\n\nFrom early statistical models to neural network-based approaches, language modeling has come a long way. The introduction of transformer architectures marked a significant breakthrough, leading to models like GPT (Generative Pre-trained Transformer) and BERT (Bidirectional Encoder Representations from Transformers).\n\nCurrent Capabilities\n\nToday\'s large language models can write essays, summarize texts, translate languages, and even generate code. They exhibit a remarkable understanding of context and can produce coherent, contextually relevant responses to complex prompts.\n\nLimitations and Challenges\n\nDespite their impressive capabilities, large language models face challenges such as hallucinations (generating false information), bias, and the environmental impact of training large models. Addressing these issues is crucial for the responsible advancement of the field.'
  }
];

// Pre-loaded publications data for client-side and static builds
const PUBLICATIONS = [
  {
    slug: 'neural-networks-paper',
    title: 'Neural Network Architectures for Computer Vision',
    date: '2022-03-18',
    excerpt: 'A comprehensive review of neural network architectures for computer vision tasks.',
    tags: ['Neural Networks', 'Computer Vision', 'Deep Learning'],
    author: 'Fatih Nayebi',
    featured: true,
    content: '<h1>Neural Network Architectures for Computer Vision</h1><p>This paper reviews the evolution and current state of neural network architectures for computer vision tasks. From early convolutional neural networks to modern transformer-based models, we analyze the strengths and weaknesses of each approach.</p><h2>Convolutional Neural Networks</h2><p>CNNs have been the backbone of computer vision for the past decade. We discuss key architectures like AlexNet, VGG, and ResNet, highlighting their contributions to the field.</p><h2>Recent Advances</h2><p>Recent years have seen the emergence of transformer-based models in computer vision, challenging the dominance of CNNs. We explore models like Vision Transformer (ViT) and their performance on various tasks.</p>',
    rawContent: 'Neural Network Architectures for Computer Vision\n\nThis paper reviews the evolution and current state of neural network architectures for computer vision tasks. From early convolutional neural networks to modern transformer-based models, we analyze the strengths and weaknesses of each approach.\n\nConvolutional Neural Networks\n\nCNNs have been the backbone of computer vision for the past decade. We discuss key architectures like AlexNet, VGG, and ResNet, highlighting their contributions to the field.\n\nRecent Advances\n\nRecent years have seen the emergence of transformer-based models in computer vision, challenging the dominance of CNNs. We explore models like Vision Transformer (ViT) and their performance on various tasks.'
  },
  {
    slug: 'ml-interpretability',
    title: 'Advances in Machine Learning Interpretability',
    date: '2023-01-05',
    excerpt: 'Investigating methods to make machine learning models more interpretable and transparent.',
    tags: ['Machine Learning', 'Interpretability', 'XAI'],
    author: 'Fatih Nayebi',
    featured: false,
    content: '<h1>Advances in Machine Learning Interpretability</h1><p>As machine learning models become increasingly complex, understanding their decision-making processes becomes more challenging. This paper explores recent advances in making ML models more interpretable and transparent.</p><h2>Post-hoc Methods</h2><p>We discuss post-hoc interpretability methods like LIME, SHAP, and feature importance analysis that help explain decisions after they\'ve been made.</p><h2>Inherently Interpretable Models</h2><p>We also explore the development of inherently interpretable models that balance performance with transparency, allowing users to understand how predictions are generated.</p><h2>Case Studies</h2><p>Through several case studies in healthcare, finance, and criminal justice, we demonstrate the importance of interpretability in building trust and ensuring fairness in ML applications.</p>',
    rawContent: 'Advances in Machine Learning Interpretability\n\nAs machine learning models become increasingly complex, understanding their decision-making processes becomes more challenging. This paper explores recent advances in making ML models more interpretable and transparent.\n\nPost-hoc Methods\n\nWe discuss post-hoc interpretability methods like LIME, SHAP, and feature importance analysis that help explain decisions after they\'ve been made.\n\nInherently Interpretable Models\n\nWe also explore the development of inherently interpretable models that balance performance with transparency, allowing users to understand how predictions are generated.\n\nCase Studies\n\nThrough several case studies in healthcare, finance, and criminal justice, we demonstrate the importance of interpretability in building trust and ensuring fairness in ML applications.'
  },
  {
    slug: 'transformer-optimization-techniques',
    title: 'Optimization Techniques for Transformer Models',
    date: '2023-04-12',
    excerpt: 'A detailed analysis of techniques to optimize transformer-based models for improved performance and efficiency.',
    tags: ['Transformers', 'Optimization', 'Deep Learning'],
    author: 'Fatih Nayebi',
    featured: true,
    content: '<h1>Optimization Techniques for Transformer Models</h1><p>Transformer models have revolutionized natural language processing, but their computational demands pose challenges for deployment. This paper explores optimization techniques to improve the performance and efficiency of transformer-based models.</p><h2>Architectural Optimizations</h2><p>We investigate architectural modifications like distillation, pruning, and quantization that can reduce model size while maintaining performance.</p><h2>Training Optimizations</h2><p>We explore training optimizations including improved optimization algorithms, learning rate schedules, and data augmentation techniques that can enhance convergence and generalization.</p><h2>Inference Optimizations</h2><p>We discuss inference optimizations such as model compilation, hardware acceleration, and caching strategies that can reduce latency and increase throughput in production environments.</p><h2>Empirical Evaluation</h2><p>Through comprehensive experiments on standard benchmarks, we demonstrate the effectiveness of these optimization techniques and provide guidelines for their application based on specific use cases and constraints.</p>',
    rawContent: 'Optimization Techniques for Transformer Models\n\nTransformer models have revolutionized natural language processing, but their computational demands pose challenges for deployment. This paper explores optimization techniques to improve the performance and efficiency of transformer-based models.\n\nArchitectural Optimizations\n\nWe investigate architectural modifications like distillation, pruning, and quantization that can reduce model size while maintaining performance.\n\nTraining Optimizations\n\nWe explore training optimizations including improved optimization algorithms, learning rate schedules, and data augmentation techniques that can enhance convergence and generalization.\n\nInference Optimizations\n\nWe discuss inference optimizations such as model compilation, hardware acceleration, and caching strategies that can reduce latency and increase throughput in production environments.\n\nEmpirical Evaluation\n\nThrough comprehensive experiments on standard benchmarks, we demonstrate the effectiveness of these optimization techniques and provide guidelines for their application based on specific use cases and constraints.'
  }
];

/**
 * Get all blog posts
 * @param {boolean} featured - Filter by featured status
 * @returns {Object[]} Array of blog posts
 */
export function getAllBlogPosts(featured = false) {
  // Always use pre-loaded data for static builds and browser
  const posts = [...BLOG_POSTS];
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (featured) {
    return posts.filter(post => post.featured);
  }
  
  return posts;
}

/**
 * Get a blog post by its slug
 * @param {string} slug - The slug of the blog post
 * @returns {Object|null} The blog post or null if not found
 */
export function getBlogPostBySlug(slug) {
  // Always use pre-loaded data for static builds and browser
  return BLOG_POSTS.find(post => post.slug === slug) || null;
}

/**
 * Get all publications
 * @param {boolean} featured - Filter by featured status
 * @returns {Object[]} Array of publications
 */
export function getAllPublications(featured = false) {
  // Always use pre-loaded data for static builds and browser
  const publications = [...PUBLICATIONS];
  publications.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (featured) {
    return publications.filter(pub => pub.featured);
  }
  
  return publications;
}

/**
 * Get a publication by its slug
 * @param {string} slug - The slug of the publication
 * @returns {Object|null} The publication or null if not found
 */
export function getPublicationBySlug(slug) {
  // Always use pre-loaded data for static builds and browser
  return PUBLICATIONS.find(pub => pub.slug === slug) || null;
}

/**
 * Search for content in blog posts and publications
 * @param {string} query - The search query
 * @param {Object} options - Search options
 * @returns {Object} Search results
 */
export function searchContent(query, options = {}) {
  if (!query) {
    return {
      blogPosts: [],
      publications: [],
      allResults: []
    };
  }
  
  // Normalize query for case-insensitive search
  const normalizedQuery = query.toLowerCase();
  
  // Search fields to check in each item
  const searchFields = ['title', 'excerpt', 'rawContent', 'tags', 'author'];
  
  // Helper function to check if an item matches the query
  const itemMatchesQuery = (item) => {
    return searchFields.some(field => {
      const value = item[field];
      
      if (Array.isArray(value)) {
        // For arrays (like tags), check if any element includes the query
        return value.some(val => val.toLowerCase().includes(normalizedQuery));
      } else if (typeof value === 'string') {
        // For strings, check if they include the query
        return value.toLowerCase().includes(normalizedQuery);
      }
      
      return false;
    });
  };
  
  // Get all blog posts and publications
  const allBlogPosts = getAllBlogPosts();
  const allPublications = getAllPublications();
  
  // Filter based on search options
  const searchBlog = options.searchBlog !== false;
  const searchPublications = options.searchPublications !== false;
  
  // Filter items that match the query
  const blogPosts = searchBlog ? allBlogPosts.filter(itemMatchesQuery) : [];
  const publications = searchPublications ? allPublications.filter(itemMatchesQuery) : [];
  
  // Combine results with source information
  const blogResults = blogPosts.map(post => ({
    ...post,
    type: 'blog'
  }));
  
  const publicationResults = publications.map(pub => ({
    ...pub,
    type: 'publication'
  }));
  
  // Combine all results and sort by date
  const allResults = [...blogResults, ...publicationResults];
  allResults.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return {
    blogPosts: blogResults,
    publications: publicationResults,
    allResults
  };
} 