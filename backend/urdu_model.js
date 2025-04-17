const whisper = require('whisper');

// Function to convert audio to text (Urdu language)
module.exports.convertAudioToText = async (audioPath) => {
  try {
    const result = await whisper.transcribe(audioPath, { language: 'ur' });
    return result.text;
  } catch (error) {
    console.error("Error in speech-to-text conversion", error);
    throw error;
  }
};
