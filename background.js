let pattern = "*://*.example.com/*";
let suffix = "xxx";

function isValidMatchPattern(pattern) {
    try {
        new URL(pattern.replace('*', 'test'));
        return true;
    } catch (e) {
        return false;
    }
}

let redirect = details => {
    let url = details.url;
    if (!url.endsWith(suffix)) {
        url += suffix;
        console.log(`Redirecting ${details.url} to ${url}`);
        return { redirectUrl: url };
    } else 
        console.log(`Not redirecting`);
        return {};
};

if (isValidMatchPattern(pattern)) {
    browser.webRequest.onBeforeRequest.addListener(
        redirect,
        { urls: [pattern], types: ["main_frame"] },
        ["blocking"]
    );
} else {
    console.log(`Invalid pattern: ${pattern}`);
}