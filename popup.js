function isValidMatchPattern(pattern) {
    try {
        new URL(pattern.replace('*', 'test'));
        return true;
    } catch (e) {
        return false;
    }
}
let form = document.getElementById('form');
let table = document.getElementById('table');
let tbody = table.getElementsByTagName('tbody')[0];
console.log(tbody);

function updateTable() {
    // Get the existing patterns and suffixes
    browser.storage.local.get('patternsAndSuffixes').then(({ patternsAndSuffixes }) => {
        // if patternsAndSuffixes is empty when opening the extention for the first time then hide the table
        if (!patternsAndSuffixes) {
            table.style.display = 'none';
            return;
        }
        // Clear the table
        tbody.innerHTML = '';
        // Add each pattern and suffix to the table in reverse order
        for (let i = patternsAndSuffixes.length - 1; i >= 0; i--) {
            let item = patternsAndSuffixes[i];
            let row = tbody.insertRow();
            let patternCell = row.insertCell();
            patternCell.textContent = item.pattern;
            let suffixCell = row.insertCell();
            suffixCell.textContent = item.suffix;
            let actionCell = row.insertCell();
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            // // Add the animate class to the new row
            // tbody.rows[patternsAndSuffixes.length - 1 - i].classList.add('animate')
            deleteButton.addEventListener('click', function () {
                // Delete the pattern and suffix and update
                patternsAndSuffixes.splice(i, 1);
                browser.storage.local.set({ patternsAndSuffixes });
                updateTable();
            });
            actionCell.appendChild(deleteButton);
        }
        // Check if tbody is empty and hide the table if it is(because table head stays when deleting all rows manually)
        if (!tbody.hasChildNodes()) {
            table.style.display = 'none';
        } else {
            table.style.display = '';
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
    else{
        document.getElementById('error').textContent = ''
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
    form.reset();
});

// Update the list when the popup is opened
updateTable();