class AuroraIA {
    constructor() {
        this.chaveApi = 'rbDb7L2jYKNgkLYib1buoLUz5rgUku';
        this.urlApi = 'api-gemini.php';
        this.isLoading = false;
        this.isOpen = false;
        
        this.initializeElements();
        this.attachEvents();
        this.setupClickOutside();
    }
    
    initializeElements() {
        this.chatBall = document.getElementById('chatBall');
        this.chatContainer = document.getElementById('chatContainer');
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.mainContent = document.querySelector('main');
    }
    
    attachEvents() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        

        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.shiftKey) {
              
                return;
            }
        });
    }
    
    setupClickOutside() {

        if (this.mainContent) {
            this.mainContent.addEventListener('click', () => {
                if (this.isOpen) {
                    this.closeChat();
                }
            });
        }
        
     
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.chatContainer.contains(e.target) && 
                !this.chatBall.contains(e.target) &&
                e.target !== this.userInput) {
                this.closeChat();
            }
        });
    }
    
    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message || this.isLoading) return;
        
        this.addMessage(message, 'user');
        this.userInput.value = '';
        this.showTypingIndicator();
        this.setLoading(true);
        
        try {
            const resultado = await this.consultarGemini(message);
            this.removeTypingIndicator();
            
            if (resultado.status === 'success') {
                this.addMessage(resultado.resposta, 'bot');
            } else {
                this.addMessage('Desculpe, ocorreu um erro. Tente novamente.', 'bot');
            }
            
        } catch (erro) {
            this.removeTypingIndicator();
            this.addMessage('Erro de conexão. Verifique sua internet.', 'bot');
        }
        
        this.setLoading(false);
        this.userInput.focus();
    }
    
    async consultarGemini(mensagem) {
        const resposta = await fetch(this.urlApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.chaveApi
            },
            body: JSON.stringify({ pergunta: mensagem })
        });
        
        if (!resposta.ok) {
            throw new Error(`HTTP ${resposta.status}`);
        }
        
        return await resposta.json();
    }
    
    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        if (type === 'bot') {
           
            messageDiv.innerHTML = this.processMarkdown(text);
        } else {
           
            const textNode = document.createTextNode(text);
            messageDiv.appendChild(textNode);
        }
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
      
        if (type === 'user' && !this.isOpen) {
            this.chatBall.classList.add('pulse');
        }
    }
    
    processMarkdown(text) {
        let html = text;
        
       
        html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
       
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
        
        
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.*?)_/g, '<em>$1</em>');
        
        
        html = html.replace(/`(.*?)`/g, '<code>$1</code>');
        
        
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
     
        html = html.replace(/^\s*[-*]\s+(.*)$/gim, '<li>$1</li>');
        
        
        html = html.replace(/^\s*\d\.\s+(.*)$/gim, '<li>$1</li>');
        
      
        html = html.replace(/^\s*---\s*$/gim, '<hr>');
        html = html.replace(/^\s*\*\*\*\s*$/gim, '<hr>');
        
    
        html = html.replace(/^>\s*(.*)$/gim, '<blockquote>$1</blockquote>');
        
     
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
   
        html = html.replace(/\n/g, '');
        

        html = this.wrapLists(html);
        
        return html;
    }
    
    wrapLists(html) {

        html = html.replace(/(<li>.*?<\/li>)(?![^<>]*<\/?(ul|ol)>)/gs, (match) => {
            return `<ul>${match}</ul>`;
        });
        

        html = html.replace(/<ul>(<li>(\d+\..*?)<\/li>)*<\/ul>/gs, (match) => {
            return match.replace('<ul>', '<ol>').replace('</ul>', '</ol>');
        });
        
        return html;
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.textContent = 'Digitando...';
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    setLoading(loading) {
        this.isLoading = loading;
        this.sendButton.disabled = loading;
        this.sendButton.style.opacity = loading ? '0.6' : '1';
    }
    
    openChat() {
        this.chatContainer.classList.add('open');
        this.chatBall.classList.remove('pulse');
        this.isOpen = true;
        localStorage.removeItem('aurora_unread');

        setTimeout(() => {
            this.userInput.focus();
        }, 300);
    }
    
    closeChat() {
        this.chatContainer.classList.remove('open');
        this.isOpen = false;
    }
}

function toggleChat() {
    if (window.auroraAI) {
        if (window.auroraAI.isOpen) {
            window.auroraAI.closeChat();
        } else {
            window.auroraAI.openChat();
        }
    }
}

function openChat() {
    if (window.auroraAI) {
        window.auroraAI.openChat();
    }
}

function closeChat() {
    if (window.auroraAI) {
        window.auroraAI.closeChat();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.auroraAI = new AuroraIA();
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && window.auroraAI && window.auroraAI.isOpen) {
        window.auroraAI.closeChat();
    }
});



