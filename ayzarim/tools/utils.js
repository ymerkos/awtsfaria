/**
//B"H
 * @file utils.js
 * Awtsmoos utilities
 */
var awtsmoosWords = [
  'Transcendence', 'Enlightenment', 'Emanation', 'Illumination',
  'Metaphysical', 'Omnipresence', 'Ineffable', 'Seraphic',
  'Luminosity', 'Resonance', 'Harmonious', 'Celestial',
  'Ethereal', 'Infinite', 'Divinity', 'Sacrosanct',
  'Mystical', 'Esoteric', 'Profound', 'Sublime',
  'Cherubic', 'Cosmic', 'Eternal', 'Majestic',
  'Revelation', 'Epiphany', 'Awakening', 'Unification',
  'Existence', 'Creation', 'Omniscience', 'Radiance',
  'Symphony', 'Convergence', 'Equilibrium', 'Synchronicity',
    'SacredGeometry', 'UniversalLaw', 'MysticalTruths', 'DivineDance',
  'InfiniteTapestry', 'CosmicConsciousness', 'SpiritualAlchemy', 'QuantumHarmony',
  'EternalWisdom', 'MajesticExistence', 'CelestialOrder', 'ProfoundInsight',
  'AwakeningSoul', 'SacredSymphony', 'MysticJourney', 'CherubicHarmony',
  'SeraphicSong', 'EnigmaticRevelation', 'CosmicUnity', 'EtherealVision',
  'MetaphysicalOneness', 'TranscendentLove', 'SublimeEmbrace', 'IneffableBeauty',
  'DivineResonance', 'CelestialRadiance', 'OmniscientPresence', 'SacrosanctLife',
  'MysticalOmnipresence', 'LuminousEternity', 'ResonantSymphony', 'HarmoniousEmanation',
  'CherubicWhispers', 'SeraphicEchoes', 'CosmicReflection', 'EternalDance',
  'RevelatoryEpiphany', 'AwakeningExistence', 'UnificationSpirit', 'CreationEssence',
  'OmniscientRadiance', 'TimelessSymphony', 'ConvergenceEquilibrium', 'SynchronicityLife',
    'HigherWill', 'LowerWill', 'BoundlessEnergy', 'EternalDance',
  'CosmicResonance', 'CelestialObedience', 'DivineManifestation', 'IneffableMystery',
  'MysticalOneness', 'UnfathomableDesire', 'SublimeCreation', 'RadiantInfinity',
  'TimelessWisdom', 'SacredHarmony', 'UniversalResonance', 'CelestialRhythm',
  'OmnipotentPresence', 'SeraphicGrace', 'TranscendentUnderstanding', 'ProfoundSynchronicity',
  'IlluminatedInsight', 'OmniscientRevelation', 'LuminousIntuition', 'EssenceOfBeing',
  'CherubicSymphony', 'MajesticUnity', 'HarmoniousConfluence', 'QuantumVibration',
  'ImmutableTruth', 'MysticalVoyage', 'SacrosanctWhispers', 'EtherealOmnipresence',
  'AwtsmoosAwakening', 'DivineEmanation', 'UnfathomableDepth', 'SacredGeometryOfSoul',
  'AwakeningOfHigherSelf', 'ResonantFrequencyOfCreation', 'InfiniteDanceOfLove', 'SeraphicJourneyIntoAwtsmoos'

  
];

// Regular expression pattern to match allowed characters: azAZ0-9_$, Hebrew characters, and space
var patternWithSpace = /^[a-zA-Z0-9_$\u0590-\u05FF\s]+$/;///^[a-zA-Z0-9_$\u0590-\u05FF\s!@#$%^&*()_+{}\][:";'>?.,<~]+$/;


// Regular expression pattern to match allowed characters: azAZ0-9_$, Hebrew characters, andnospace
var patternNoSpace =/^[a-zA-Z0-9_$\u0590-\u05FF]+$/;// /^[a-zA-Z0-9_$\u0590-\u05FF\s!@#$%^&*()_+{}\][:";'>?.,<~]+$/;
class Utils {
    static parseCookies(cookieStr) {
        var ob = cookieStr.split("; ")
            .reduce((last, now) => {
                var split = now.split("=");
                last[split[0]] = split[1];
                return last;
            }, {});
        return ob
    }

    static camelCasify(str) {
      var patternNoSpace = /[^\w$א-ת]+/g;
      return str.replace(patternNoSpace, ' ')  // Replace non-matching characters with space
          .split(' ')
          .map((word, index) => {
              var firstChar = word.charAt(0);
              var restOfWord = word.slice(1).toLowerCase();
              return index === 0 ? firstChar.toLowerCase() + restOfWord : firstChar.toUpperCase() + restOfWord;
          })
          .join('');
  }
    
    static generateId(name, fancy = false, iteration = 0) {
      if (typeof(name) !== "string") return null;
  
      if (iteration > 0) {
          name += iteration;
      }

      // Check if the name starts with a number
      if (/^\d/.test(name)) {
          name = "$" + name;
      }
  
      var c = this.camelCasify(name);
      if (!fancy) return this.sanitizeForFilename(c);
  
      var randomWord = awtsmoosWords[Math.floor(Math.random() * awtsmoosWords.length)];
      var randomCompact = randomWord.substring(
          0, Math.floor(Math.random() * 4)
      ) + randomWord.substring(
          Math.floor(randomWord.length - Math.random() * 3)
      );
  
      return this.sanitizeForFilename("BH_" + Date.now() + "_" + randomCompact + "_" + c);
  }
  
  static sanitizeForFilename(str) {
      // Regular expression to remove illegal file characters
      var illegalRe = /[<>:"/\\|?*]/g;
      return str.replace(illegalRe, '');
  }
  
  



    
    static sanitizePath(path) {
        // The essence of purity, the path untangled and unbroken
        while (path.includes('..')) {
          // Replacing the twisted trails with the righteous root
          path = path.replace('..', '');
        }
        path = path.split("/").filter(r=>r).join("/");
          if(!path) path="/"
        return path  // Returning the sanctified path, a path of light
      }

    static generateUniqueId(existingIds) {
        // Function to generate a random ID
        function generateRandomId() {
            // For this example, it generates a random number between 1 and 10000
            var id = "BH_"+Math.floor(Math.random() * 10000) + 1;
            
            // Randomly choose the number of words to include (1 to 2)
            var numberOfWords = Math.floor(Math.random() * 2) + 1;

            // Randomly select words
            let words = [];
            for (let i = 0; i < numberOfWords; i++) {
                var randomIndex = Math.floor(Math.random() * awtsmoosWords.length);
                words.push(awtsmoosWords[randomIndex]);
            }

            // Combine the words and the random number
            return id +"_"+ words.join('_')
        }
    
        let uniqueId = generateRandomId();
        
        if(Array.isArray(existingIds)) {
          // Keep generating a new ID until it's unique
          while (existingIds.includes(uniqueId)) {
              uniqueId = generateRandomId();
          }
        }
    
        return uniqueId;
    }

    static verifyStrict({
      inputString,
      withSpace=false,
      length=50
    }) {
      var ch = inputString
      if(typeof(ch) != "string") return false;
      if(ch.length > length) return false
      return withSpace ? patternWithSpace.test(ch) : 
        patternNoSpace.test(ch)
    }
        /**
 * Verifies the existence and sanctity of the celestial characters.
 * @param {Array} args - An array containing alternating keys and their corresponding maximum lengths.
 * @returns {boolean} - Whether the characters resonate with the sacred harmony.
 */
static verify(...args) {
  

  

  // Iterate through the arguments, ensuring they resonate with the sacred harmony
  for (let i = 0; i < args.length; i += 2) {
    var key = args[i];
    var maxLength = args[i + 1] || 50; // If no max length is provided, default to 50

    // Check if the key or value is not a string, or if the value exceeds the maximum length, or if the value does not match the pattern
    if (
      typeof key !== 'string' || 
      key.length > maxLength ||!patternWithSpace.test(key)
    ) {
      return false; // Return false if any character does not resonate with the sacred harmony
    }
  }

  return true; // Return true if all characters resonate with the sacred harmony
}

}

module.exports = Utils;
