/**B"H
 * 
 * custom alert boxes
 */

export class AwtsmoosPrompt {
    id = "awtsmoosificationalisticarianism"
    constructor(opts) {
        if(opts.id) {
            this.id=opts.id;
        }
      this.createStyles();
    }
  
    createStyles() {
      if (!document.getElementById(
        this.id+'-prompt-styles'
      )) {
        const style = document.createElement('style');
        style.id = this.id+'-prompt-styles';
        style.textContent = /*css*/`
          .${this.id} .custom-prompt-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
          }
  
          .${this.id} .custom-prompt-box {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
            max-width: 400px;
            width: 80%;
          }
  
          .${this.id} .custom-prompt-header {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
  
          .${this.id} .custom-prompt-content {
            margin-bottom: 20px;
          }
  
          .${this.id} .custom-prompt-content input {
            width: calc(100% - 20px);
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
          }
  
          .${this.id} .custom-prompt-buttons {
            text-align: right;
          }
  
          .${this.id} .custom-prompt-buttons button {
            padding: 8px 16px;
            margin-left: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
  
          .${this.id} .custom-prompt-buttons button:first-child {
            background-color: #ccc;
          }
  
          .${this.id} .custom-prompt-buttons button:last-child {
            background-color: #007bff;
            color: white;
          }

          .${this.id} {
            
            position: relative;

          }
        `;
        document.head.appendChild(style);
      }
    }

    static async go(opts) {
        var n = new AwtsmoosPrompt(opts);
        var p = await n.createPrompt(opts);
        return p;
    }
    
    async createPrompt({
        headerTxt,
        placeholderTxt,
        okTxt,
        cancelTxt,
        isAlert=false
    }) {
        return new Promise((resolve, reject) => {
            var par = document.createElement("div");
            par.className = this.id
            const background = document.createElement('div');
            background.classList.add('custom-prompt-background');
    
            const promptBox = document.createElement('div');
            promptBox.classList.add('custom-prompt-box');
    
            const header = document.createElement('div');
            header.classList.add('custom-prompt-header');
            header.innerHTML = headerTxt || 'Awtsmoos!';
    
            var input = {value:"Awtsmoos"};


            promptBox.appendChild(header);
            const buttons = document.createElement('div');
            buttons.classList.add('custom-prompt-buttons');
            if(!isAlert) {
                const content = document.createElement('div');
                content.classList.add('custom-prompt-content');
        
                input = document.createElement('input');
                input.setAttribute('type', 'text');
                input.setAttribute('placeholder', placeholderTxt || 'Enter your input...');
        
                content.appendChild(input);

                promptBox.appendChild(content);

                const cancelButton = document.createElement('button');
                cancelButton.textContent = cancelTxt || 'Cancel';
                buttons.appendChild(cancelButton);


                cancelButton.addEventListener('click', () => {
                    document.body.removeChild(par);
                    resolve(null); // Resolving with null when canceled
                });
            }

    
            

            const okButton = document.createElement('button');
            okButton.textContent = okTxt || 'OK';
    
            
            buttons.appendChild(okButton);
    
            
            promptBox.appendChild(buttons);
    
            background.appendChild(promptBox);
            par.appendChild(background);
            document.body.appendChild(par);
    
            
    
            okButton.addEventListener('click', () => {
                const value = input.value;
                document.body.removeChild(par);
                resolve(value); // Resolving with input value when OK is clicked
            });
    
            background.addEventListener('click', (event) => {
                if (event.target === background) {
                    document.body.removeChild(par);
                    resolve(null); // Resolving with null when clicking outside the prompt
                }
            });
        });
    }
    
  }
