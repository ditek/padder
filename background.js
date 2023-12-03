function isValidMatchPattern(pattern) {
    try {
        new URL(pattern.replace('*', 'test'));
        return true;
    } catch (e) {
        return false;
    }
}

function redirect(requestDetails, suffix) {
    let url = requestDetails.url;
    if (!url.endsWith(suffix)) {
        url += suffix;
        console.log(`Redirecting ${requestDetails.url} to ${url}`);
        return { redirectUrl: url };
    } else {
        console.log(`Not redirecting`);
        return {};
    }
}

browser.storage.local.get('patternsAndSuffixes').then(({ patternsAndSuffixes }) => {
    if (!patternsAndSuffixes) {
        return;
    }
    for (let { pattern, suffix } of patternsAndSuffixes) {
        pattern = pattern;
        suffix = suffix;
        console.log(`Adding listener for ${pattern}`);
        if (isValidMatchPattern(pattern)) {
            browser.webRequest.onBeforeRequest.addListener(
                (requestDetails) => redirect(requestDetails, suffix),
                { urls: [pattern], types: ["main_frame"] },
                ["blocking"]
            );
        } else {
            console.log(`Invalid pattern: ${pattern}`);
        }
    }
});
