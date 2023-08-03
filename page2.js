// Add a 'click' event listener to the element with id 'back'
document.getElementById('back').addEventListener('click', function() {
    // Change the current window location to 'popup.html' when 'back' is clicked
    // This effectively navigates the extension's popup back to the main page
    window.location.href = 'popup.html';
});
