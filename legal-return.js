const backLink = document.querySelector('[data-calculator-back]');
const cameFromConsumer = new URLSearchParams(window.location.search).get('from') === 'consumer';

if (backLink && cameFromConsumer) {
  backLink.href = 'consumer/index.html';
  backLink.lastChild.textContent = ' חזרה למחשבון';
}
