//B"H
const http = require('http');
const https = require('https');

function fetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        // Determine the protocol from the URL
        const protocol = url.startsWith('https://') ? https : http;

        // Set up the request options
        const requestOptions = {
            method: options.method || 'GET',
            headers: options.headers || {},
        };

        // Handle the request body if present
        if (options.body) {
            requestOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
        }

        // Create the request
        const req = protocol.request(url, requestOptions, (res) => {
            // Response object to mimic the Fetch API
            const response = {
                ok: res.statusCode >= 200 && res.statusCode < 300,
                status: res.statusCode,
                statusText: res.statusMessage,
                headers: res.headers,
                body: {
                    getReader: () => {
                        const reader = {
                            read: () => new Promise((resolve, reject) => {
                                res.once('data', (chunk) => {
                                    resolve({ done: false, value: chunk });
                                });
                                res.once('end', () => {
                                    resolve({ done: true, value: null });
                                });
                            }),
                        };
                        return reader;
                    },
                },
                text: () => {
                    return new Promise((resolve, reject) => {
                        let data = '';
                        res.on('data', (chunk) => data += chunk);
                        res.on('end', () => resolve(data));
                    });
                },
                json: () => {
                    return new Promise((resolve, reject) => {
                        let data = '';
                        res.on('data', (chunk) => data += chunk);
                        res.on('end', () => resolve(JSON.parse(data)));
                    });
                },
            };
            resolve(response);
        });

        req.on('error', (e) => {
            reject(e);
        });

        // Write the request body if present
        if (options.body) {
            if(typeof(options.body) == "object") {
                try {
                    options.body = new URLSearchParams(options.body);
                    options.body+="";
                } catch(e) {
                    options.body="";
                }
            }
            req.write(options.body);
        }

        req.end();
    });
}

class URLSearchParams {
    constructor(init = '') {
        this.params = new Map();

        if (typeof init === 'string') {
            init.split('&').forEach(pair => {
                const [key, value] = pair.split('=').map(decodeURIComponent);
                this.append(key, value);
            });
        } else if (init instanceof URLSearchParams) {
            init.forEach((value, key) => {
                this.append(key, value);
            });
        } else if (typeof init === 'object') {
            Object.entries(init).forEach(([key, value]) => {
                this.append(key, value);
            });
        }
    }

    append(key, value) {
        if (this.params.has(key)) {
            this.params.get(key).push(value);
        } else {
            this.params.set(key, [value]);
        }
    }

    delete(key) {
        this.params.delete(key);
    }

    get(key) {
        const values = this.params.get(key);
        return values ? values[0] : null;
    }

    getAll(key) {
        return this.params.get(key) || [];
    }

    has(key) {
        return this.params.has(key);
    }

    set(key, value) {
        this.params.set(key, [value]);
    }

    toString() {
        const array = [];
        this.params.forEach((values, key) => {
            values.forEach(value => {
                array.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            });
        });
        return array.join('&');
    }

    forEach(callback, thisArg) {
        this.params.forEach((values, key) => {
            values.forEach(value => {
                callback.call(thisArg, value, key, this);
            });
        });
    }

    // Additional methods such as keys(), values(), and entries() can also be implemented.
}


// Custom Text Decoder (Simple version)
class TextEncoder {
    constructor(encoding) {
        this.encoding = encoding;
    }

    decode(buffer, options) {
        return buffer.toString(this.encoding);
    }
}

// Usage example

async function main() {
    const URL = 'https://example.com';
    const jsonOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };

    try {
        var response = await customFetch(URL, jsonOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        var reader = response.body.getReader();
        let buffer = '';

        while (true) {
            var { done, value } = await reader.read();
            if (done) {
                break;
            }
            var decoder = new customTextEncoder("utf-8");
            buffer += decoder.decode(value, {stream: true});
        }

        console.log(buffer);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error.message);
    }
}

module.exports = {fetch, TextEncoder, URLSearchParams};