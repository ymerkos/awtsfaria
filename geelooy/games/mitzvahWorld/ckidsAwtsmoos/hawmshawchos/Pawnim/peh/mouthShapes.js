/*
    B"H
*/
export default {
    "X": {
        // Neutral position, no offset applied
        upperLip: [
            [0, 0], [0, 0], [0, 0], [0, 0]
        ],
        lowerLip: [
            [0, 0], [0, 0], [0, 0], [0, 0]
        ],
    },
    "A": {
        // Closed mouth for the “P”, “B”, and “M” sounds, slight pressure between the lips
        upperLip: [
            [0, 0.1], [0, 0.1], [0, 0.1], [0, 0.1]
        ],
        lowerLip: [
            [0, -0.2], [0, -0.2], [0, -0.2], [0, -0.2]
        ],
    },
    "B": {
        // Slightly open mouth with clenched teeth for consonants and “EE” in "bee"
        upperLip: [
            [0.1, 0.15], [-0.1, 0.15], [0.1, 0.15], [-0.1, 0.15]
        ],
        lowerLip: [
            [-0.1, -0.3], [0.1, -0.35], [-0.1, -0.35], [0.1, -0.3]
        ],
    },
    "C": {
        // Open mouth for “EH” in "men" and “AE” in "bat", and in-between in animations to "D"
        upperLip: [
            [0.2, 0.2], [-0.1, 0.2], [0.1, 0.2], [-0.2, 0.2]
        ],
        lowerLip: [
            [-0.2, -0.6], [0.1, -0.7], [-0.1, -0.7], [0.2, -0.6]
        ],
    },
    "D": {
        // Wide open mouth for “AA” in "father"
        upperLip: [
            [0.3, 0.3], [-0.2, 0.3], [0.2, 0.3], [-0.3, 0.3]
        ],
        lowerLip: [
            [-0.3, -0.9], [0.2, -1], [-0.2, -1], [0.3, -0.9]
        ],
    },
    "E": {
        // Slightly rounded mouth for “AO” in "off" and “ER” in "bird", and in-between in animations to "F"
        upperLip: [
            [0.1, 0.2], [-0.1, 0.25], [0.1, 0.25], [-0.1, 0.2]
        ],
        lowerLip: [
            [-0.1, -0.4], [0.1, -0.5], [-0.1, -0.5], [0.1, -0.4]
        ],
    },
    "F": {
        // Puckered lips for “UW” in "you", “OW” in "show", and “W” in "way"
        upperLip: [
            [0.3, 0.1], [-0.3, 0.15], [0.3, 0.15], [-0.3, 0.1]
        ],
        lowerLip: [
            [-0.3, -0.2], [0.3, -0.25], [-0.3, -0.25], [0.3, -0.2]
        ],
    },
    "G": {
        // Upper teeth touching the lower lip for “F” in "for" and “V” in "very"
        upperLip: [
            [0.1, 0.3], [-0.1, 0.35], [0.1, 0.35], [-0.1, 0.3]
        ],
        lowerLip: [
            [-0.1, -0.7], [0.1, -0.75], [-0.1, -0.75], [0.1, -0.7]
        ],
    },
    "H": {
        // For long “L” sounds, tongue raised behind the upper teeth, mouth open as in "C" but not as much as in "D"
        upperLip: [
            [0.1, 0.5], [-0.2, 0.6], [0.2, 0.6], [-0.1, 0.5]
        ],
        lowerLip: [
            [-0.1, -0.7], [0.2, -0.8], [-0.2, -0.8], [0.1, -0.7]
        ],
    }
};