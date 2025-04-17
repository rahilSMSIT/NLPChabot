let mediaRecorder;
let audioChunks = [];

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                document.getElementById('audioPlayer').src = audioUrl;

                // Send audio to backend
                const formData = new FormData();
                formData.append('audioFile', audioBlob, 'audio.wav');

                fetch('http://localhost:3000/upload', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById('response').textContent = `You said: ${data.transcribed}`;
                    document.getElementById('videoSuggestion').innerHTML = `<iframe src="https://www.youtube.com/embed/${data.videoId}" frameborder="0" allowfullscreen></iframe>`;
                });
            };

            mediaRecorder.start();
        });
}

function stopRecording() {
    mediaRecorder.stop();
}
