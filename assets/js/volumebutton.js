document.getElementById('mute').addEventListener('click', () => { // bouton mute
    isMuted = !isMuted;
    sonResult.muted = isMuted;
  });
  document.getElementById('volume-slider').addEventListener('input', (event) => { // bouton slider son
    const volume = event.target.value;
    sonResult.volume = volume / 100; 
   
  });