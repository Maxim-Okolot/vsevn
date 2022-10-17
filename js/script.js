/*cookies*/
let closeCookies = function () {
  let cookie = document.querySelector('.cookie');
  cookie.style.display = 'none';
}

if (document.querySelector('.cookie')) {
  let cookieBtn = document.querySelector('.cookie__button');
  cookieBtn.addEventListener('click', closeCookies);
}