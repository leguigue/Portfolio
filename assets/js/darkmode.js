document.addEventListener('DOMContentLoaded', () => {
  const darkModeButton = document.getElementById('darkmode');
  const body = document.body;
  function toggleDarkMode() {
      body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
  }
  if (localStorage.getItem('darkMode') === 'enabled') {
      body.classList.add('dark-mode');
  }
  darkModeButton.addEventListener('click', toggleDarkMode);
});