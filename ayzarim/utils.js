/**
//B"H
 * @file utils.js
 * Awtsmoos utilities
 */
const awtsmoosWords = [
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

    static generateId(name) {
        if(typeof(name)!="string") name="Awtsmoos";
        // Select a random word from the collection
  const randomWord = awtsmoosWords[Math.floor(Math.random() * awtsmoosWords.length)];

  return "BH_" + Date.now() + "_" + randomWord + "_" + name.split(' ')
    .map((word, index) => {
      const firstChar = word.charAt(0);
      const restOfWord = word.slice(1).toLowerCase();
      return index === 0 ? firstChar.toLowerCase() + restOfWord : firstChar.toUpperCase() + restOfWord;
    })
    .join('');
}
  

     /**
 * Verifies the existence and sanctity of the celestial characters.
 * @returns {boolean} - Whether the characters resonate with the sacred harmony.
 */
 static verify(vals, max=50) {
  // Regular expression pattern to match allowed characters: azAZ0-9_$ and Hebrew characters
  const pattern = new RegExp(`^[a-zA-Z0-9_$\\u0590-\\u05FF\\s]{1,${max}}$`);


  // Iterate through the arguments, ensuring they resonate with the sacred harmony
  for (let i = 0; i < vals.length; i++) {
    const value = vals[i];
    if (typeof value !== 'string' || !pattern.test(value)) {
      return false; // Return false if any character does not resonate with the sacred harmony
    }
  }

  return true; // Return true if all characters resonate with the sacred harmony
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
}

module.exports = Utils;
