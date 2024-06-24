export class Chat {
    constructor (element, input, client) {
        this.messages = [];

        this.chatbox = element;
        this.chatbox.innerHTML = '';

        this.input = input;
        this.typing = false;

        this.input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                client.sendChat(this.input.value);
                this.input.value = '';
                this.input.blur();
            }
        });

        this.input.addEventListener('blur', () => {
            this.input.value = '';
            this.typing = false;
        });

        this.input.addEventListener('focus', () => {
            this.input.value = '';
            this.typing = true;
        });
    }

    addMessage (message) {
        this.messages.push(message);

        const span = document.createElement('span');
        span.classList.add('chat-message');
        span.innerHTML = message.toString() + '<br>';
        this.chatbox.appendChild(span);
    }

    clear () {
        this.messages = [];
        this.chatbox.innerHTML = '';
    }

    static convertSymbols (string) {
        return string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}

export class ChatMessage {
    constructor (author, message) {
        this.author = author;
        this.message = message;
    }

    toString () {
        return this.author == null ? this.message : Chat.convertSymbols(`<${this.author}> ${this.message}`);
    }

}