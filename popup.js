// When the "Read Current Tab Content" link is clicked
document.getElementById('readContent').addEventListener('click', function() {
    // Query the currently active tab in the current window
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // Execute a script in the context of that tab
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: function() {
                // This function will be serialized and executed in the tab's context
                // It reads and returns the text content of the body
                return document.body.innerText;
            }
        }, (result) => {
            // This callback is called with the results after the script has been executed
            // If there was an error, log it
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            } else {
                // Otherwise, display the result in the content area of the popup
                document.getElementById('content').innerText = result[0].result;
            }
        });
    });
});

// Similar structure for "Write New Element to DOM", "Insert Text at Cursor Position",
// "Send Message to Background Script", and "Change Background Color"

document.getElementById('writeContent').addEventListener('click', function() {
    // The function executed in the tab's context creates a new h1 element,
    // sets its text content and color, and appends it to the body
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: function() {
                const newElement = document.createElement('h1');
                newElement.innerText = 'Hello from My Chrome Extension!';
                newElement.style.color = 'red';
                document.body.appendChild(newElement);
            }
        });
    });
});

document.getElementById('insertText').addEventListener('click', function() {
    // The function executed in the tab's context inserts the specified text at the cursor position
    // It handles different types of elements differently
    // For INPUT and TEXTAREA elements, it directly manipulates their value and selection
    // For contentEditable elements, it creates a text node and uses the Selection API to insert it
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: function() {
                const activeElement = document.activeElement;
                const textToInsert = 'Hello from My Chrome Extension!';
                
                // Handle input and textarea
                if (['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
                    const start = activeElement.selectionStart;
                    const end = activeElement.selectionEnd;
                    const value = activeElement.value;
                    
                    activeElement.value = value.slice(0, start) + textToInsert + value.slice(end);
                    
                    // Set cursor position after inserted text
                    activeElement.selectionStart = activeElement.selectionEnd = start + textToInsert.length;
                }

                // Handle contentEditable element
                else if (activeElement.contentEditable === 'true') {
                    const range = window.getSelection().getRangeAt(0);
                    const textNode = document.createTextNode(textToInsert);

                    // Insert the new text node at the cursor position
                    range.insertNode(textNode);

                    // Move the cursor after the inserted text
                    range.setStartAfter(textNode);
                    range.setEndAfter(textNode);
                }
            }
        });
    });
});

document.getElementById('sendMessage').addEventListener('click', function() {
    // This sends a message to the background script and logs the response
    chrome.runtime.sendMessage({ greeting: 'Hello from popup!' }, function(response) {
        document.getElementById('content').innerText = response.reply;
    });
});

document.getElementById('changeBgColor').addEventListener('click', function() {
    // This changes the background color of the body of the current tab to pink
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: function() {
                document.body.style.backgroundColor = 'pink';
            }
        });
    });
});

// When the "Go to Page 2" link is clicked, it changes the popup's location to page2.html
document.getElementById('goToPage2').addEventListener('click', function() {
    window.location.href = 'page2.html';
});
