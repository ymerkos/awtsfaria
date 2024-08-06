
/**
 * @class AwtsmoosAPI
 * @description A class for interacting with the OpenAI API to manage threads, add messages, and handle streaming responses.
 * @example
 * const api = new AwtsmoosAPI({
 *     apiKey: "your_api_key",
 *     orgId: "your_org_id"
 * });
 *
 * api.createThread().then(() => {
 *     return api.addMessage("Hello, OpenAI!");
 * }).then(() => {
 *     return api.runThread({
 *         onstream: (data, accumulatedText, isFinal) => {
 *             console.log("Streaming data:", data);
 *             console.log("Accumulated text:", accumulatedText);
 *             if (isFinal) {
 *                 console.log("Final text:", accumulatedText);
 *             }
 *         }
 *     });
 * }).catch(error => {
 *     console.error("Error:", error);
 * });
 */
 class AwtsmoosAPI {
    /**
     * @constructor
     * @param {Object} options - The options for initializing the API client.
     * @param {string} options.apiKey - Your OpenAI API key.
     * @param {string} options.orgId - Your OpenAI organization ID.
     * @param {string} [options.threadId=null] - The ID of the thread (optional).
     * @param {string} [options.assistantId=null] - The ID of the assistant (optional).
     */
    constructor({ apiKey, orgId, threadId = null, assistantId = null }) {
        this.apiKey = apiKey;
        this.orgId = orgId;
        this.threadId = threadId;
        this.assistantId = assistantId;
        this.headers = {
            "Authorization": `Bearer ${apiKey}`,
            "OpenAI-Organization": orgId,
            "OpenAI-Beta":"assistants=v2",
            "Content-Type": "application/json"
        };
    }

    /**
     * @method setApiKey
     * @param {string} apiKey - New API key to set.
     * @description Updates the API key used for authentication and updates request headers.
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        this.headers["Authorization"] = `Bearer ${apiKey}`;
    }

    /**
     * @method setOrgId
     * @param {string} orgId - New organization ID to set.
     * @description Updates the organization ID and updates request headers.
     */
    setOrgId(orgId) {
        this.orgId = orgId;
        this.headers["OpenAI-Organization"] = orgId;
    }

    /**
     * @method setThreadId
     * @param {string} threadId - New thread ID to set.
     * @description Updates the thread ID for subsequent API requests.
     */
    setThreadId(threadId) {
        this.threadId = threadId;

    }

    /**
     * @method setAssistantId
     * @param {string} assistantId - New assistant ID to set.
     * @description Updates the assistant ID for subsequent API requests.
     */
    setAssistantId(assistantId) {
        this.assistantId = assistantId;
    }

    /**
     * @method createThread
     * @param {string} [assistantId=this.assistantId] - Assistant ID for the new thread (optional).
     * @returns {Promise<Object>} The response object containing the new thread ID.
     * @description Creates a new thread and optionally sets the assistant ID for the new thread. Returns the response containing the thread ID.
     * @example
     * api.createThread().then(response => {
     *     console.log("New thread created with ID:", response.threadId);
     * }).catch(error => {
     *     console.error("Error creating thread:", error);
     * });
     */
    createThread(assistantId = this.assistantId) {
        const body = { assistantId };
        return fetch('https://api.openai.com/v1/threads', {
            method: 'POST',
            headers: this.headers,
          //  body: JSON.stringify(body)
        }).then(response => response.json());
    }

    /**
     * @method addMessage
     * @param {string} messageContent - The content of the message to add.
     * @returns {Promise<Object>} The response object confirming the addition of the message.
     * @throws {Error} Throws an error if the thread ID is not set.
     * @description Adds a message to the current thread.
     * @example
     * api.addMessage("Hello, OpenAI!").then(response => {
     *     console.log("Message added:", response);
     * }).catch(error => {
     *     console.error("Error adding message:", error);
     * });
     */
    addMessage(messageContent) {
        if (!this.threadId) {
            throw new Error("Thread ID is not set.");
        }
        return fetch('https://api.openai.com/v1/threads/'+this.threadId+'/messages', {
            body:JSON.stringify({
                role:"user",
                content:messageContent
            }),
            method: "POST",
            headers: this.headers
        }).then(response => response.json());
    }

    /**@method getMessagesOfThread*/
    getMessagesOfThread() {
        if (!this.threadId) {
            throw new Error("Thread ID is not set.");
        }
        return fetch('https://api.openai.com/v1/threads/'+this.threadId+'/messages', {
            
            headers: this.headers
        }).then(response => response.json());
    }

    /**
    @method go
    makes new thread if not set and sets to current thread and adds new message
    **/
    async go({
        onstream=(json,txt)=>console.log(json, txt),
        message
    }) {
        try {
            if(!this.threadId) {
                var th = await this.createThread()
                if(th.id) {
                    this.threadId = th.id
                } else {
                    throw "no thread id"
                }
            }

            var msg = await this.addMessage(message);
            var run = await this.runThread({onstream})
            return run;
        } catch(e) {
            console.log(e)
        }
    }

   /**
     * @method streamAdditionalResponse
     * @param {Response} response - The response object from the API call.
     * @param {Object} [options={}] - Options for streaming.
     * @param {Function} [options.onstream] - Callback function to handle streaming data. Receives parameters `(data, accumulatedText, isFinal)`.
     * @returns {Promise<string>} The final accumulated text after processing the stream.
     * @description Processes streaming responses from the API. Accumulates text data and handles end-of-stream detection. Calls the `onstream` callback with streaming data and the accumulated text. Returns the accumulated text when streaming completes.
     * @example
     * api.streamAdditionalResponse(response, {
     *     onstream: (data, accumulatedText, isFinal) => {
     *         console.log("Streaming data:", data);
     *         console.log("Accumulated text:", accumulatedText);
     *         if (isFinal) {
     *             console.log("Final text:", accumulatedText);
     *         }
     *     }
     * }).then(finalText => {
     *     console.log("Final accumulated text:", finalText);
     * }).catch(error => {
     *     console.error("Error streaming response:", error);
     * });
     */
    streamAdditionalResponse(response, { onstream } = {}) {
        return new Promise((resolve, reject) => {
            var result = null;
            let accumulatedText = '';
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            reader.read().then(function processText({ done, value }) {
                if (done) {
                    if (onstream) {
                        onstream(null, accumulatedText, true);
                    }
                    return resolve(accumulatedText);
                }

                let text = decoder.decode(value, { stream: true });

                // Split on occurrences of `event:` and process each block
                let parts = text.split(/(?=event:)/g); // Split on 'event:' including it in the next part
                let remainingText = parts.pop(); // Remaining text after the last event block

                let isFinal = false;

                parts.forEach(part => {
                    // Check for end of stream
                    if (part.startsWith('event: done\n')) {
                        const dataInd = part.indexOf("data: [DONE]");
                        if (dataInd > -1) {
                            isFinal = true;
                            if (onstream) {
                                onstream(null, accumulatedText, true);
                            }
                            return resolve(result);
                        }
                    }

                    // Process `data:` blocks
                    const dataInd = part.indexOf("data:");
                    if (dataInd > -1) {
                        const jsonStr = part.substring(dataInd + "data:".length).trim();
                        try {
                            const json = JSON.parse(jsonStr);
                            if(json.object == "thread.message" && json.status=="completed")                             {
                                result = json;
                                

                            }
                            if (json.delta && json.delta.content && json.delta.content[0] && json.delta.content[0].text) {
                                const textValue = json.delta.content[0].text.value || '';
                                accumulatedText += textValue + '\n'; // Append text value with newline
                                if (onstream) {
                                    onstream(json, textValue, accumulatedText, false);
                                }
                            } else {
                                // Add non-JSON content directly
                                const nonJsonContent = part.replace(/^(event: .*\n)?data: /, '').trim();
                                if (nonJsonContent) {
                                  //  accumulatedText += nonJsonContent + '\n'; // Append non-JSON content with newline
                                }
                                if (onstream) {
                                    onstream(json, nonJsonContent, accumulatedText, false);
                                }
                            }
                        } catch (e) {
                            console.error("Couldn't parse JSON:", e, jsonStr);
                        }
                    }
                });


                if (!isFinal) {
                    reader.read().then(processText).catch(reject);
                }
            }).catch(reject);
        });
    }


    /**
     * @method runThread
     * @param {Object} [options={}] - Options for running the thread.
     * @param {string} [options.threadId=this.threadId] - The thread ID to run (optional).
     * @param {Function} [options.onstream] - Callback function to handle streaming data. Receives parameters `(data, accumulatedText, isFinal)`.
     * @returns {Promise<string>} The final accumulated text after processing the stream.
     * @throws {Error} Throws an error if the thread ID or assistant ID is not set.
     * @description Runs the specified thread and streams the response. Calls the `onstream` callback with streaming data and the accumulated text. Returns the accumulated text when streaming completes.
     * @example
     * api.runThread({
     *     threadId: "your_thread_id",
     *     onstream: (data, accumulatedText, isFinal) => {
     *         console.log("Streaming data:", data);
     *         console.log("Accumulated text:", accumulatedText);
     *         if (isFinal) {
     *             console.log("Final text:", accumulatedText);
     *         }
     *     }
     * }).then(finalText => {
     *     console.log("Final accumulated text:", finalText);
     * }).catch(error => {
     *     console.error("Error running thread:", error);
     * });
     */
    runThread({ threadId = this.threadId, assistantId=this.assistantId,onstream } = {}) {
        if (!threadId || !this.assistantId) {
            throw new Error("Thread ID and assistant ID must be set.");
        }
        if (!assistantId || !this.assistantId) {
            throw new Error("Thread ID and assistant ID must be set.");
        }
        return fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
            method: 'POST',
            body:JSON.stringify({
                stream:true,
                assistant_id:assistantId
            }),
            headers: this.headers
        }).then(response => this.streamAdditionalResponse(response, { onstream }));
    }



    /**@method getMessage*/
    getMessage({threadId=this.threadId,messageId}) {
        if(!threadId) {
            throw new Error("need to set thread id!")
        }
        return fetch("https://api.openai.com/v1/threads/"
            +threadId
            +"/messages/"
            +messageId, {
                headers: this.headers
            }
        )
    }
    /**
     * @method getAllThreads
     * @returns {Promise<Object>} The response object containing all threads associated with the assistant.
     * @throws {Error} Throws an error if the assistant ID is not set.
     * @description Retrieves all threads for the current assistant.
     * @example
     * api.getAllThreads().then(response => {
     *     console.log("All threads:", response);
     * }).catch(error => {
     *     console.error("Error retrieving threads:", error);
     * });
     */
    getAllThreads() {
        if (!this.assistantId) {
            throw new Error("Assistant ID is not set.");
        }
        return fetch(`https://api.openai.com/v2/assistants/${this.assistantId}/threads`, {
            method: 'GET',
            headers: this.headers
        }).then(response => response.json());
    }
}
