function isValidMatchPattern(pattern) {
    try {
        new URL(pattern.replace('*', 'test'));
        return true;
    } catch (e) {
        return false;
    }
}

function updateTable() {
    // Get the existing patterns and suffixes
    browser.storage.local.get('patternsAndSuffixes').then(({ patternsAndSuffixes }) => {
        if (!patternsAndSuffixes) {
            patternsAndSuffixes = [];
            return;
        }
        let table = document.getElementById('table');
        let tbody = table.getElementsByTagName('tbody')[0];
        // Clear the table
        tbody.innerHTML = '';
        // Add each pattern and suffix to the table
        for (let i = 0; i < patternsAndSuffixes.length; i++) {
            let item = patternsAndSuffixes[i];
            let row = tbody.insertRow();
            let patternCell = row.insertCell();
            patternCell.textContent = item.pattern;
            let suffixCell = row.insertCell();
            suffixCell.textContent = item.suffix;
            let actionCell = row.insertCell();
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function () {
                // Delete the pattern and suffix and update
                patternsAndSuffixes.splice(i, 1);
                browser.storage.local.set({ patternsAndSuffixes });
                updateTable();
            });
            actionCell.appendChild(deleteButton);
        }
    });
}

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    let pattern = document.getElementById('pattern').value;
    let suffix = document.getElementById('suffix').value;
    if (!isValidMatchPattern(pattern)) {
        console.error(`Invalid pattern: ${pattern}`);
        document.getElementById('error').textContent = 'Invalid pattern';
        return;
    }
    // Add to existing patterns and suffixes
    browser.storage.local.get('patternsAndSuffixes').then(({ patternsAndSuffixes }) => {
        if (!patternsAndSuffixes) {
            patternsAndSuffixes = [];
        }
        let patterns = patternsAndSuffixes.map(item => item.pattern);
        if (patterns.includes(pattern)) {
            console.error(`Pattern already exists: ${pattern}`);
            document.getElementById('error').textContent = 'Pattern already exists';
            return;
        }
        patternsAndSuffixes.push({ pattern, suffix });
        browser.storage.local.set({ patternsAndSuffixes });
        updateTable();
    });
});

// Update the list when the popup is opened
updateTable();