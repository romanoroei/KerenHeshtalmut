const cookieNotice = document.getElementById('cookieNotice');

const hideCookieNotice = () => {
  if (cookieNotice) cookieNotice.classList.remove('is-visible');
  try {
    localStorage.setItem('cookieNoticeAccepted', '1');
  } catch (error) {
    // The notice can still be dismissed when browser storage is unavailable.
  }
};

if (cookieNotice) {
  try {
    if (localStorage.getItem('cookieNoticeAccepted') !== '1') {
      cookieNotice.classList.add('is-visible');
    }
  } catch (error) {
    cookieNotice.classList.add('is-visible');
  }

  document.getElementById('acceptCookies')?.addEventListener('click', hideCookieNotice);
  document.getElementById('closeCookies')?.addEventListener('click', hideCookieNotice);
}
