/**
 * B"H
 * @static @class Awts
 * methods to replace
 * prompt,
 * confirm and alert
 * 
 * 
 * @method prompt repalces window.prompt
 * @method confirm replaces window.confirm
 * @method alert replaces window.alert
 * 
 */

import UI from "./ui.js";
export default class Awts {
    static stylesAdded = false;

    static addStyles() {
        if (this.stylesAdded) return;

        var ui = new UI();

        // Add enhanced styles
        ui.$h({
            tag: 'style',
            innerHTML: `
                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .dialog {
                    background: #fff;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0px 4px 30px rgba(0,0,0,0.2);
                    max-width: 400px;
                    max-height:100%;
                    width: 100%;
                    text-align: center;
                }
                .label, .input, .button {
                    display: block;
                    margin-bottom: 20px;
                }
                .input {
                    height:500px;
                }
                .input, .button {
                    
                    padding: 10px;
                    width: 100%;
                    box-sizing: border-box;
                }

                .button {
                    background-color: #007BFF;
                    color: white;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .button:hover {
                    background-color: #0056b3;
                }

                .button + .button {
                    margin-left: 10px;
                }
                .buttons {
                    display: flex;
                    justify-content: space-around;
                }
            `
        });

        this.stylesAdded = true;
    }

    static async prompt(message, defaultInput = "") {
        return new Promise((resolve) => {
            this.addStyles();

            var ui = new UI();
            
            // Create a prompt dialog with overlay
            ui.html({
                tag: 'div',
                shaym: 'overlay',
                parent: document.body,
                classList: ['overlay'],
                children: [
                    {
                        tag: 'div',
                        shaym: 'promptDialog',
                        classList: ['dialog'],
                        children: [
                            { tag: 'label', classList: ['label'], textContent: message },
                            {
                                tag: 'textarea', 
                                shaym: 'promptInput', 
                                classList: ['input'], 
                                value: defaultInput
                            },
                            {
                                tag: 'div',
                                classList: ['buttons'],
                                children: [
                                    {
                                        tag: 'button',
                                        classList: ['button'],
                                        textContent: 'OK',
                                        events: {
                                            click: () => {
                                                var inputValue = ui.$g('promptInput').value;
                                                ui.$g('overlay').remove();
                                                resolve(inputValue);
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
        });
    }

    static async alert(message) {
        return new Promise((resolve) => {
            this.addStyles();

            var ui = new UI();
            
            // Create an alert dialog with overlay
            ui.html({
                tag: 'div',
                shaym: 'overlay',
                parent: document.body,
                classList: ['overlay'],
                children: [
                    {
                        tag: 'div',
                        shaym: 'alertDialog',
                        classList: ['dialog'],
                        children: [
                            { tag: 'span', classList: ['label'], textContent: message },
                            {
                                tag: 'div',
                                classList: ['buttons'],
                                children: [
                                    {
                                        tag: 'button',
                                        classList: ['button'],
                                        textContent: 'OK',
                                        events: {
                                            click: () => {
                                                ui.$g('overlay').remove();
                                                resolve();
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
        });
    }

    static async confirm(message) {
        return new Promise((resolve) => {
            this.addStyles();

            var ui = new UI();
            
            // Create a confirm dialog with overlay
            ui.html({
                tag: 'div',
                shaym: 'overlay',
                parent: document.body,
                classList: ['overlay'],
                children: [
                    {
                        tag: 'div',
                        shaym: 'confirmDialog',
                        classList: ['dialog'],
                        children: [
                            { tag: 'span', classList: ['label'], textContent: message },
                            {
                                tag: 'div',
                                classList: ['buttons'],
                                children: [
                                    {
                                        tag: 'button',
                                        classList: ['button'],
                                        textContent: 'Yes',
                                        events: {
                                            click: () => {
                                                ui.$g('overlay').remove();
                                                resolve(true);
                                            }
                                        }
                                    },
                                    {
                                        tag: 'button',
                                        classList: ['button'],
                                        textContent: 'No',
                                        events: {
                                            click: () => {
                                                ui.$g('overlay').remove();
                                                resolve(false);
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
        });
    }
}