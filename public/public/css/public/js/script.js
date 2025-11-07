async function loadUrl() {
    const urlInput = document.getElementById('urlInput').value;
    let url = urlInput;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    try {
        const response = await fetch(`/fetch?url=${encodeURIComponent(url)}`, {
            credentials: 'omit' // Disable cookies
        });
        if (!response.ok) throw new Error((await response.json()).error);
        const content = await response.text();
        document.getElementById('content').innerHTML = content;
    } catch (error) {
        document.getElementById('content').innerHTML = `<h2>Error loading page: ${error.message}</h2>`;
    }
}

async function setProxy() {
    const proxyUrl = prompt('Enter proxy URL (e.g., proxy-server:port)');
    if (!proxyUrl) return;

    try {
        const response = await fetch('/set-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ proxyUrl })
        });
        const result = await response.json();
        alert(result.message || result.error);
    } catch (error) {
        alert('Failed to set proxy: ' + error.message);
    }
}

async function clearSession() {
    try {
        const response = await fetch('/clear-session', {
            method: 'POST'
        });
        const result = await response.json();
        alert(result.message || result.error);
    } catch (error) {
        alert('Failed to clear session: ' + error.message);
    }
}
