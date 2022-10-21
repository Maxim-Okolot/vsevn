(function () {
  /*cookies*/
  let closeCookies = function () {
    let cookie = document.querySelector('.cookie');
    cookie.style.display = 'none';
  };

  if (document.querySelector('.cookie')) {
    let cookieBtn = document.querySelector('.cookie__button');
    cookieBtn.addEventListener('click', closeCookies);
  }


  let checkInputDeposit =  function () {
    let walletRadioBottom = document.querySelector('.wallet-radio-bottom');
    let enterLinkWrap = document.querySelector('.enter-link-wrap');
    let depositFormButton = document.querySelector('.deposit-form__button');

    switch (this.value) {
      case 'физ лицо':
        walletRadioBottom.classList.remove('hide');
        enterLinkWrap.classList.add('hide');
        depositFormButton.innerHTML = "Продолжить";
        depositFormButton.setAttribute('disabled', 'disabled');
        break;
      case 'юр лицо':
        walletRadioBottom.classList.add('hide');
        enterLinkWrap.classList.remove('hide');
        depositFormButton.innerHTML = "Выписать счет";
        depositFormButton.removeAttribute('disabled');
    }

    document.querySelector('.deposit-form__button').classList.remove('hide');
  }

  if (document.getElementsByName('radio-grp')) {
    let inputs = document.getElementsByName('radio-grp');

    for (let element of inputs) {
      element.addEventListener('change', checkInputDeposit);
    }
  }

  let closePopup = function () {
    document.querySelector('#popup').classList.toggle('hide');
    document.body.classList.toggle('fix');
  }

  document.querySelector('.close-popup').onclick = closePopup;
  document.querySelector('#cookie-link').onclick = closePopup;

})();