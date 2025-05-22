document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    const voiceSelect = document.getElementById('voice-select');
    const generateBtn = document.getElementById('generate-btn');
    const audioPlayer = document.getElementById('audio-player');
    const downloadBtn = document.getElementById('download-btn');
    const outputSection = document.querySelector('.output-section');
    const spinner = document.querySelector('.spinner');
    const btnText = document.querySelector('.btn-text');
    
    let audioBlob = null;
    
    generateBtn.addEventListener('click', async function() {
        const text = textInput.value.trim();
        const voice = voiceSelect.value;
        
        if (!text) {
            alert('Please enter some text to convert to speech.');
            return;
        }
        
        // Show loading state
        generateBtn.disabled = true;
        btnText.textContent = 'Generating...';
        spinner.classList.remove('hidden');
        
        try {
            // Call the TTS API
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    voice: voice
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate speech');
            }
            
            audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            audioPlayer.src = audioUrl;
            
            // Show the output section
            outputSection.classList.remove('hidden');
            
            // Play the audio automatically
            audioPlayer.play();
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while generating speech. Please try again.');
        } finally {
            // Reset button state
            generateBtn.disabled = false;
            btnText.textContent = 'Generate Speech';
            spinner.classList.add('hidden');
        }
    });
    
    downloadBtn.addEventListener('click', function() {
        if (!audioBlob) return;
        
        const a = document.createElement('a');
        a.href = URL.createObjectURL(audioBlob);
        a.download = `tts-${new Date().toISOString().slice(0,10)}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});