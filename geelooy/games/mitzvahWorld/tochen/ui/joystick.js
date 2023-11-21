/**
 * B"H
 */

export default {
    id:"joystick-container",
    children: [
        {
            id: "joystick-base",
            child: {
                id: "joystick-thumb"
            }
        },
        {
            tag: "style",
            innerHTML   :/*css*/`
                    #joystick-container {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        width: 100px;
                        height: 100px;
                    }
            
                    #joystick-base {
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.4); /* Semi-transparent black */
                        border-radius: 50%;
                        position: relative;
                        touch-action: none; /* Prevents the browser's default touch actions */
                    }
            
                    #joystick-thumb {
                        width: 50%;
                        height: 50%;
                        background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent white */
                        border-radius: 50%;
                        position: absolute;
                        top: 25%;
                        left: 25%;
                    }
            
            `
        }
    ]
}