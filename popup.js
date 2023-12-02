function isValidMatchPattern(pattern) {
    try {
        new URL(pattern.replace('*', 'test'));
        return true;
    } catch (e) {
        return false;
    }
}

document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    let pattern = document.getElementById('pattern').value;
    let suffix = document.getElementById('suffix').value;
    if (isValidMatchPattern(pattern)) {
        browser.storage.local.set({ pattern, suffix });
        console.log(`Saved pattern: ${pattern}`);
        window.close();
    } else {
        console.error(`Invalid pattern: ${pattern}`);
        document.getElementById('error').textContent = 'Invalid pattern';
    }
});