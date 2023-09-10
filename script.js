$(document).ready(function() {
    const chatBox = $('#chat-box');
    const userInput = $('#user-input');
    const sendButton = $('#send-button');
    let conversation = []; // Array to save the full conversation

    sendButton.click(function() {
        sendMessage();
    });

    userInput.keydown(function(event) {
        if (event.keyCode === 13) {
            sendMessage();
            event.preventDefault(); // Prevent the default Enter key behavior (form submission)
        }
    });

    function sendMessage() {
        const userMessage = userInput.val().trim();
        if (userMessage !== '') {
            conversation.push({ sender: 'user', content: userMessage }); // Adds the Usermessage to the conversation
            displayUserMessage(userMessage);
            sendUserMessage(conversation); // Sends full conversation to the API
            userInput.val('');
        }
    }

    function displayUserMessage(message) {
        const timestamp = getCurrentTimestamp();
        chatBox.append(`<div class="user-message">
                             <div class="message-container">${message}</div>
                            <div class="timestamp">${timestamp}</div>
                        </div>`);
        chatBox.scrollTop(chatBox[0].scrollHeight);
    }

    function displayAssistantMessage(message) {
        const timestamp = getCurrentTimestamp();
        chatBox.append(`<div class="assistant-message">
                            <div class="message-container">${message}</div>
                            <div class="timestamp">${timestamp}</div>
                        </div>`);
        chatBox.scrollTop(chatBox[0].scrollHeight);
    }

    function getCurrentTimestamp() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function sendUserMessage(conversation) {
        const apiUrl = 'https://api.chatfai.com/v1/chat';
        const bearerToken = '[YOUR-API-TOKEN]'; // Replace with your actual bearer token

        const payload = {
            name: 'TEST',
            bio: 'I am a Test biography',
            conversation: conversation // Sends full conversation to the API
        };

        $.ajax({
            type: 'POST',
            url: apiUrl,
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload),
            timeout: 50000,
            success: function(response) {
                const assistantResponse = response.content;
                conversation.push({ sender: 'assistant', content: assistantResponse }); // Adds the answere to the conversation JSON
                displayAssistantMessage(assistantResponse);
                // Saves the conversation to the JSON
                saveConversationAsJson(conversation);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                displayAssistantMessage('Error making API call: ' + textStatus);
            }
        });
    }

    // Function to save the conversation to JSON
    function saveConversationAsJson(conversation) {
        const conversationJson = JSON.stringify(conversation, null, 2); 
        console.log('Gespeicherte Konversation als JSON:', conversationJson);
    }
});
