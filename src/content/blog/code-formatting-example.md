---
title: "Code Formatting in Technical Documentation"
date: "2024-03-04"
excerpt: "Best practices for formatting code in technical documentation with examples in multiple languages"
tags: ["Programming", "Documentation", "Best Practices", "Code Snippets"]
author: "Fatih Nayebi"
featured: false
---

# Code Formatting in Technical Documentation

When writing technical documentation, properly formatted code snippets are essential for readability and comprehension. This post explores best practices for presenting code examples and demonstrates formatting in various languages.

## Why Good Code Formatting Matters

Clear, consistent code formatting in documentation:
- Makes examples easier to read and understand
- Facilitates copy-paste operations for readers
- Maintains professional appearance
- Improves accessibility for all users

## JavaScript Examples

Simple function with comments:

```javascript
/**
 * Calculates the factorial of a number recursively
 * @param {number} n - The input number
 * @return {number} The factorial of n
 */
function factorial(n) {
  // Base case
  if (n <= 1) {
    return 1;
  }
  
  // Recursive case
  return n * factorial(n - 1);
}

// Example usage
console.log(factorial(5)); // Output: 120
```

ES6 features:

```javascript
// Arrow functions and template literals
const greet = (name) => {
  return `Hello, ${name}!`;
};

// Destructuring and default parameters
const getConfig = ({ apiKey = 'default-key', timeout = 3000 } = {}) => {
  return { apiKey, timeout };
};

// Async/await example
async function fetchUserData(userId) {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}
```

## Python Examples

Function with type hints:

```python
from typing import List, Dict, Optional

def process_data(items: List[Dict[str, any]], 
                 max_items: Optional[int] = None) -> List[str]:
    """
    Process a list of data items and return filtered results.
    
    Args:
        items: List of dictionaries containing data
        max_items: Maximum number of items to process
        
    Returns:
        List of processed item names
    """
    if max_items is not None:
        items = items[:max_items]
    
    # Filter and process items
    results = [item['name'] for item in items if item.get('active', False)]
    return results

# Example usage
data = [
    {'name': 'Item 1', 'active': True},
    {'name': 'Item 2', 'active': False},
    {'name': 'Item 3', 'active': True}
]

print(process_data(data))  # Output: ['Item 1', 'Item 3']
```

Class example:

```python
class DataProcessor:
    def __init__(self, source_path: str, config: dict = None):
        self.source_path = source_path
        self.config = config or {}
        self.processed_count = 0
    
    def process_file(self) -> bool:
        try:
            # Simulate file processing
            print(f"Processing {self.source_path} with config: {self.config}")
            self.processed_count += 1
            return True
        except Exception as e:
            print(f"Error processing file: {e}")
            return False
```

## HTML and CSS Examples

HTML structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Formatting Example</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Code Example Page</h1>
        <nav>
            <ul>
                <li><a href="#html">HTML</a></li>
                <li><a href="#css">CSS</a></li>
                <li><a href="#js">JavaScript</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="code-demo">
            <pre><code class="language-javascript">
                // Your code here
            </code></pre>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 Code Examples</p>
    </footer>
</body>
</html>
```

CSS styling:

```css
/* Variables and reset */
:root {
    --primary-color: #3273dc;
    --secondary-color: #363636;
    --background-color: #f5f5f5;
    --code-bg-color: #272822;
    --code-text-color: #f8f8f2;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Typography and layout */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: var(--secondary-color);
    background-color: var(--background-color);
    padding: 2rem;
}

/* Code block styling */
pre {
    background-color: var(--code-bg-color);
    color: var(--code-text-color);
    border-radius: 5px;
    padding: 1.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
}

code {
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 0.9rem;
}

/* Responsive design */
@media (max-width: 768px) {
    body {
        padding: 1rem;
    }
    
    pre {
        padding: 1rem;
    }
}
```

## SQL Examples

Database queries:

```sql
-- Create a table
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- Insert data
INSERT INTO users (username, email) 
VALUES 
    ('johndoe', 'john@example.com'),
    ('janedoe', 'jane@example.com');

-- Query with join and filtering
SELECT 
    u.username,
    p.title,
    p.created_at
FROM 
    users u
JOIN 
    posts p ON u.user_id = p.author_id
WHERE 
    u.active = TRUE
    AND p.created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY 
    p.created_at DESC
LIMIT 10;
```

## Bash Script Examples

```bash
#!/bin/bash
# Script to backup and compress directories

# Configuration
BACKUP_DIR="/var/backups"
LOG_FILE="/var/log/backup.log"
DIRS_TO_BACKUP=("/home/user/documents" "/var/www" "/etc")

# Create timestamp
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_PATH="${BACKUP_DIR}/backup-${TIMESTAMP}.tar.gz"

# Log function
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo "$1"
}

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    log_message "Created backup directory: $BACKUP_DIR"
fi

# Create the backup
log_message "Starting backup to $BACKUP_PATH"

tar -czf "$BACKUP_PATH" "${DIRS_TO_BACKUP[@]}" 2>> "$LOG_FILE"

if [ $? -eq 0 ]; then
    log_message "Backup completed successfully"
    log_message "Backup size: $(du -h "$BACKUP_PATH" | cut -f1)"
else
    log_message "Backup failed with error code $?"
fi
```

## Conclusion

Good code formatting in documentation enhances readability and ensures that your technical content is accessible to a wide audience. By following consistent formatting practices and using syntax highlighting, you can create documentation that's both instructive and professional.

Remember these key points:
- Use proper indentation and spacing
- Include meaningful comments
- Highlight important parts of the code
- Use consistent naming conventions
- Provide context for complex examples

These practices will make your documentation more effective and user-friendly. 