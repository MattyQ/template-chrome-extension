// Listen for messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Check if the received message has the right format
    if (request.greeting === 'Hello from popup!') {
        // If it does, send a response back.
        // This response will be received as the second argument to the 'sendMessage' callback in popup.js
        sendResponse({ reply: 'Hello back from background script!' });
    }
});
