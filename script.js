// This code is a sample code for an easy API Chat with ChatFAI. andreas.pohl22@gmail.com


$(document).ready(function() {
    const chatBox = $('#chat-box');
    const userInput = $('#user-input');
    const sendButton = $('#send-button');
	
	
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
            displayUserMessage(userMessage);
            sendUserMessage(userMessage);
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

    function sendUserMessage(message) {
        const apiUrl = 'https://api.chatfai.com/v1/chat';
        const bearerToken = '[YOUR-API-TOKEN]'; // Replace with your actual bearer token

        const payload = {
         // character_id: 'upR8b0Sfq3TZuUSS0d80', 		// Replace with your actual character ID if you use an existing Char of ChatFAI OR
			name: 'TEST', 									// Replace with AI name AND
			bio: 'I am a Test biogrpahy',					// Replace with AI biography
			
            conversation: [
                {
                    sender: 'user', // do not change this!
                    content: message
                }
            ]
        };

        $.ajax({
            type: 'POST',
            url: apiUrl,
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload),
			timeout: 50000, // Timeout in Millisekunden (hier: 5 Sekunden)
            success: function(response) {
                const assistantResponse = response.content;
                const assistantMessage = {
                    sender: 'assistant', // do not change this!
                    content: assistantResponse
                };
                payload.conversation.push(assistantMessage);
                displayAssistantMessage(assistantResponse);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                displayAssistantMessage('Error making API call: ' + textStatus);
            }
        });
    }
});
