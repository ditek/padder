function isValidMatchPattern(pattern) {
    try {
        new URL(pattern.replace('*', 'test'));
        return true;
    } catch (e) {
        return false;
    }
}

function redirect(details) {
    let url = details.url;
    browser.storage.sync.get(['pattern', 'suffix']).then(({ pattern, suffix }) => {
        if (!url.endsWith(suffix)) {
            url += suffix;
            console.log(`Redirecting ${details.url} to ${url}`);
            return { redirectUrl: url };
        } else {
            console.log(`Not redirecting`);
            return {};
        }
    });
}

browser.storage.local.get(['pattern']).then(({ pattern }) => {
    if (isValidMatchPattern(pattern)) {
        browser.webRequest.onBeforeRequest.addListener(
            redirect,
            { urls: [pattern], types: ["main_frame"] },
            ["blocking"]
        );
    } else {
        console.log(`Invalid pattern: ${pattern}`);
    }
});
