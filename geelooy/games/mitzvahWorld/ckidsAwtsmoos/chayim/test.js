//B"H
if (this.currentAction !== shaym) {
        if (this.clipActions[this.currentAction] && this.clipActions[this.currentAction].isRunning()) {
            // Perform crossfade
            this.clipActions[this.currentAction].crossFadeTo(this.clipActions[shaym], duration, true);
        }

        this.clipActions[shaym]
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(duration)
        .play();

        // Update the current action
        this.currentAction = shaym;
    }

    
    if(action) {
        action
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(duration)
        .play();
        this.currentAnimationPlaying = true;
    }










    playChaweeyoos/*playAnimation*/(shaym, duration = 0.36) {
        if (!this.animations) return;
        if (!this.currentAction) {
            this.currentAction = shaym;
        }


        
        var clip = THREE.AnimationClip
            .findByName(
                this.animations,
                shaym
            );
        if(!clip) {
            return;
        }
        var action = this.clipActions[shaym];
        if(!action) {
            action = 
            this.animationMixer
            .clipAction(clip);
            this.clipActions[shaym] = action;
        }
        
       
        
        
        var k = Object.keys(this.clipActions)
        
        if(this.clipActions[shaym]) {
            if(this.clipActions[shaym].isRunning()) {
                /*check if others are there*/
                if(k.length) {
                    k.forEach(q=> {
                        if(
                            q != shaym 
                           // && this.clipActions[q].isRunning()
                        ) {
                            //this.clipActions[q].fadeOut(duration)
                            this.clipActions[q].stop();
                            
                            // Crossfade to the new action
                            //this.clipActions[q]
                            //.crossFadeTo(this.clipActions[shaym], duration, false);
                            
                        }
                    })
                    
                }
                return;
            } else {
                
                
                
                this.clipActions[shaym]
                .reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(1)
                .fadeIn(duration)
                .play();
               
            }
        }

        if(action) {
            action
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(duration)
            .play();
            this.currentAnimationPlaying = true;
        }
        
        
    }

    function finished(e) {
        if (e.action === action) {
            keys.forEach(key => {
                const otherAction = this.clipActions[key];
                if (otherAction && otherAction !== action && otherAction.isRunning()) {
                  //  otherAction.stop();

                }
            });
        }
        this.animationMixer.removeEventListener("finished", finished)
    }
    this.animationMixer.addEventListener("finished", finished)