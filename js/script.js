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
    let inputsBottom = document.getElementsByName('radio-bottom');


    for (let element of inputs) {
      element.addEventListener('change', checkInputDeposit);
    }

    for (let element of inputsBottom) {
      element.addEventListener('change', function () {
        document.querySelector('.deposit-form__button').removeAttribute('disabled');
      });
    }
  }


  let closePopup = function () {
    document.querySelector('#popup').classList.toggle('hide');
    document.body.classList.toggle('fix');
  }


  document.querySelector('.close-popup').onclick = closePopup;
  document.querySelector('#cookie-link').onclick = closePopup;


  let validation = function (event) {
    event.preventDefault();
    let message = document.querySelector('.code-word-form__valid');
    let input = document.querySelector('.code-word-form__input');
    let form = document.querySelector('.code-word-form');

    switch (input.value) {
      case '':
        form.classList.add('no-valid');
        form.classList.remove('valid');
        message.innerHTML = 'Укажите кодовое слово или сертификат';
        break;
      case 'date':
        form.classList.add('no-valid');
        form.classList.remove('valid');
        message.innerHTML = 'Извините, но срок по этой акции истек (до 01.5.2019)';
        break;
      case 'action':
        form.classList.add('no-valid');
        form.classList.remove('valid');
        message.innerHTML = 'К сожалению, Вы не можете активировать это кодовое слово, так как не являетесь участником ' +
          'акции';
        break;
      case 'use':
        form.classList.add('no-valid');
        form.classList.remove('valid');
        message.innerHTML = 'Вы уже вводили это кодовое слово ранее. Акция для Вас активирована, наслаждайтесь ' +
          'выгодными покупками';
        break;
      default:
        form.classList.remove('no-valid');
        form.classList.add('valid');
        message.innerHTML = 'Кодовое слово принято!';
    }

  }

  if (document.querySelector('.code-word-form')) {
    document.querySelector('.code-word-form').addEventListener('submit', validation);
  }


  let checkDisabled = function () {
    let inputs = document.querySelectorAll('.price-select__input');
    let selectWrap = document.querySelectorAll('.price-select-wrap');

    if (document.querySelector('.check-approval__input').checked) {
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].removeAttribute('disabled');
        selectWrap[i].setAttribute('aria-disabled', false);
      }
    } else {
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].setAttribute('disabled', 'disabled');
        selectWrap[i].setAttribute('aria-disabled', true);
        inputs[i].checked = false;
      }
    }
  }

  let visiblePaymen = function () {
    let inputs = document.querySelectorAll('.price-select__input');
    let packagePaymentStart = document.querySelector('.package__payment-start');
    let infoCards = document.querySelector('.main__info-cards');

    if (inputs[0].checked) {
      packagePaymentStart.classList.remove('hide');
      infoCards.classList.add('hide');
    } else {
      packagePaymentStart.classList.add('hide');
      infoCards.classList.remove('hide');
    }
  }

  let openPackagePayment = function () {
    let packagePayment = document.querySelector('.package__payment');
    let aboutTitle = document.querySelector('.resume__about-title');

    packagePayment.classList.remove('hide');

    let iconSpan = document.querySelector(".resume_icon");
    let currentIcon;
    let icons = this.parentElement.querySelector('.iconType').classList;

    for (let icon of icons) {
      if (icon !== 'iconType') {
        currentIcon = icon;
      }
    }

    let currentIconSpan = iconSpan.classList;

    for (let icon of currentIconSpan) {
      if (icon !== 'resume_icon') {
        iconSpan.classList.remove(icon);
      }
    }

    iconSpan.classList.add(currentIcon);

    let titleText = this.parentElement.querySelector('.info__card-title').innerText;

    aboutTitle.innerHTML = titleText;

  }


  if (document.querySelector('.check-approval__input')) {
    document.querySelector('.check-approval__input').onchange = checkDisabled;

    let inputs = document.querySelectorAll('.price-select__input');

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].onchange = visiblePaymen;
    }

    let btnBuy = document.querySelectorAll('.button-buy');

    for (let i = 0; i < btnBuy.length; i++) {
      btnBuy[i].addEventListener('click', openPackagePayment);
    }

  }


  if (document.querySelector('.my__wallet')) {
    let radio = document.getElementsByName('group1');

    for (let input of radio) {
      input.onchange = function () {
        if (input.checked) {
          document.querySelector('.payment-block .dissable').style.display = 'none';
        }
      }
    }
  }




})();