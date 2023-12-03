let redirectedRequests = new Set();

function redirect(requestDetails, suffix) {
    if (redirectedRequests.has(requestDetails.requestId)) {
        console.log(`Already redirected request ${requestDetails.requestId}`);
        return {};
    }
    redirectedRequests.add(requestDetails.requestId);
    let url = requestDetails.url + suffix;
    console.log(`Redirecting ${requestDetails.url} to ${url}`);
    return { redirectUrl: url };
}

browser.storage.local.get('patternsAndSuffixes').then(({ patternsAndSuffixes }) => {
    if (!patternsAndSuffixes) {
        return;
    }
    for (let { pattern, suffix } of patternsAndSuffixes) {
        // Avoid "closure within loop" problem
        pattern = pattern;
        suffix = suffix;
        console.log(`Adding listener for ${pattern}`);
        browser.webRequest.onBeforeRequest.addListener(
            (requestDetails) => redirect(requestDetails, suffix),
            { urls: [pattern], types: ["main_frame"] },
            ["blocking"]
        );
    }
});
