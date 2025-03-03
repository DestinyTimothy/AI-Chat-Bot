

const messageBar = document.querySelector(".bar-wrapper input");
const sendBtn = document.querySelector(".bar-wrapper button");
const messageBox = document.querySelector(".message-box");

let API_URL = "https://api.mistral.ai/v1/chat/completions";
let API_KEY = "zLjr12fmjeC6ZIV2sUEJnSxVpEQD1vF8";

sendBtn.onclick = function () {
    if (messageBar.value.length > 0) {
        const UserTypedMessage = messageBar.value;
        messageBar.value = "";

        let message = `
        <div class="chat message">
            <img src="images/Anon-pic.png">
            <span>${UserTypedMessage}</span>
        </div>`;

        let response = `
        <div class="chat response">
            <img src="images/ai-profile-pic.png">
            <span class="new">thinking...</span>
        </div>`;

        messageBox.insertAdjacentHTML("beforeend", message);
        setTimeout(() => {
            messageBox.insertAdjacentHTML("beforeend", response);

            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    "model": "mistral-medium",  // Use "mistral-small" or "mistral-medium" for better responses
                    "messages": [
                        { "role": "system", "content": "You are a helpful assistant." },
                        { "role": "user", "content": UserTypedMessage }
                    ]
                })
            };

            fetch(API_URL, requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log("Mistral API Response:", data); // Debugging
                    let ChatBotResponse = document.querySelectorAll(".response .new");
                    let lastResponse = ChatBotResponse[ChatBotResponse.length - 1];

                    if (data.choices && data.choices.length > 0) {
                        lastResponse.innerHTML = data.choices[0].message.content;
                    } else if (data.error) {
                        lastResponse.innerHTML = `Error: ${data.error.message}`;
                    } else {
                        lastResponse.innerHTML = "Error: No valid response received.";
                    }
                    lastResponse.classList.remove("new");
                })
                .catch((error) => {
                    console.error("Fetch error:", error);
                    let ChatBotResponse = document.querySelectorAll(".response .new");
                    let lastResponse = ChatBotResponse[ChatBotResponse.length - 1];
                    lastResponse.innerHTML = "Oops! An error occurred. Please try again.";
                });
        }, 100);
    }
};





