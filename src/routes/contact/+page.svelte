<div class="container">
    <h1>Contact Me</h1>
    <p>Feel free to reach out to me with any questions or inquiries.</p>
    
    <div class="contact-info">
        <div class="contact-item">
            <h2>Email</h2>
            <p><a href="mailto:contact@fatihnayebi.com">contact@fatihnayebi.com</a></p>
        </div>
        
        <div class="contact-item">
            <h2>Social Media</h2>
            <p>
                <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a> | 
                <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a> | 
                <a href="#" target="_blank" rel="noopener noreferrer">GitHub</a>
            </p>
        </div>
    </div>
    
    <div class="contact-form">
        <h2>Send Me a Message</h2>
        <form>
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            
            <button type="submit">Send Message</button>
        </form>
    </div>
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 0;
    }
    
    h1 {
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
    }
    
    h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .contact-info {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        margin: 2rem 0;
    }
    
    .contact-item {
        flex: 1;
        min-width: 250px;
    }
    
    .contact-form {
        margin-top: 2rem;
    }
    
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    label {
        display: block;
        margin-bottom: 0.5rem;
    }
    
    input, textarea {
        width: 100%;
        padding: 0.75rem;
        font-family: inherit;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    
    button {
        background-color: #5333ed;
        color: white;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
    }
    
    button:hover {
        background-color: #4526c3;
    }
</style> 