document.addEventListener('DOMContentLoaded', () => {
    const keys = document.querySelectorAll('.key');
    const startTestButton = document.getElementById('startTestButton');
  
    window.addEventListener('keydown', (event) => {
      keys.forEach(key => {
        if (key.dataset.key === event.code) {
          key.classList.add('active');
        }
      });
    });
  
    const resetKeys = () => {
      keys.forEach(key => {
        key.classList.remove('active');
      });
    };
  
    const runTests = async () => {
      // Reset keys
      resetKeys();
  
      // Speaker Test
      const speakerTestResult = document.getElementById('speakerTestResult');
      const audio = new Audio('audio_test.mp3');
      audio.play();
      audio.onended = async () => {
        speakerTestResult.textContent = 'Speaker Test: Completed';
  
        // Introduce a delay of 1 seconds before starting the other tests
        await new Promise(resolve => setTimeout(resolve, 1000));
  
        // Camera Test
        const video = document.getElementById('cameraTest');
        try {
          const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = cameraStream;
        } catch (error) {
          console.error('Camera access error:', error);
          speakerTestResult.textContent = 'Camera Test: Failed';
        }
  
        // Microphone Test
        const microphoneTestResult = document.getElementById('microphoneTestResult');
        const audioPlayback = document.getElementById('audioPlayback');
        let mediaRecorder;
        let audioChunks = [];
  
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(micStream);
  
          mediaRecorder.onstart = () => {
            audioChunks = [];
            microphoneTestResult.textContent = 'Microphone Test: Recording...';
          };
  
          mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };
  
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioPlayback.src = audioUrl;
            audioPlayback.play();
            microphoneTestResult.textContent = 'Microphone Test: Recording Stopped, Playing Back...';
            audioPlayback.onended = () => {
              microphoneTestResult.textContent = 'Microphone Test: Playback Completed';
            };
          };
  
          mediaRecorder.start();
          setTimeout(() => {
            mediaRecorder.stop();
          }, 5000); // Stops recording after 5 seconds
  
        } catch (error) {
          console.error('Microphone access error:', error);
          microphoneTestResult.textContent = 'Microphone Test: Failed';
        }
      };
    };
  
    startTestButton.addEventListener('click', () => {
      runTests();
    });
  });
  