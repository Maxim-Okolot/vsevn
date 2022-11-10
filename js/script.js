(function () {
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

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
    let depositFormButton = document.querySelector('.payment__btn');

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
  }

  if (document.getElementsByName('radio-grp')) {
    let inputs = document.getElementsByName('radio-grp');

    for (let element of inputs) {
      element.addEventListener('change', checkInputDeposit);
    }

  }


  let popup = function () {
    document.querySelector('#popup').classList.toggle('hide');
    document.body.classList.toggle('fix');
  }


  document.querySelector('.close-popup').onclick = popup;
  document.querySelector('#cookie-link').onclick = popup;

  if (document.querySelector('.create__btn')) {
    document.querySelector('.create__btn').addEventListener('click', popup)
  }


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
    let radio = document.getElementsByClassName('custom-radio');
    let packagePayment = document.querySelector('.package__payment');

    if (inputs[0].checked) {
      packagePaymentStart.classList.remove('hide');
      infoCards.classList.add('hide');
      packagePayment.classList.add('hide');
    } else {
      packagePaymentStart.classList.add('hide');
      infoCards.classList.remove('hide');
    }

    for (let input of radio) {
      input.checked = false;

      let boxDisabled = input.closest('.payment__form').nextElementSibling.querySelector('.dissabled');
      boxDisabled.style.display = 'block';
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
    let price = this.parentElement.querySelector('.new_price').innerText;
    let cardDesc = this.parentElement.querySelector('.info__card-desc').innerText;

    let contactsQuantity = document.querySelector('.contacts_quantity');
    let paymentTitle = document.querySelector('.package__payment .package__payment-title');
    let resumeCost = document.querySelector('.resume__cost');


    aboutTitle.innerHTML = titleText;
    contactsQuantity.innerHTML = cardDesc + ' резюме в течении 30 дней';


    switch (Number(cardDesc.split(' ')[0])) {
      case 10:
        paymentTitle.innerHTML = 'Оплата «Десять контактов соискателя из резюме»';
        break;
      case 50:
        paymentTitle.innerHTML = 'Оплата «Пятьдесят контактов соискателя из резюме»';
        break;
      case 100:
        paymentTitle.innerHTML = 'Оплата «Сто контактов соискателя из резюме»';
        break;
      case 150:
        paymentTitle.innerHTML = 'Оплата «Сто пятьдесят контактов соискателя из резюме»';
    }

    resumeCost.innerHTML = price;

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


  if (document.querySelector('.custom-radio')) {
    let radio = document.getElementsByClassName('custom-radio');

    for (let input of radio) {
      input.onchange = function () {
        if (input.checked) {
          let boxDisabled = this.closest('.payment__form').nextElementSibling.querySelector('.dissabled');
          boxDisabled.style.display = 'none';
        }
      }
    }
  }



  let checkServices = function () {
    let tableServices = document.querySelector('.table-services');
    let paymentRadio = document.querySelectorAll('.payment__radio');
    let inputBonus = document.querySelector('.write-down-bonus');
    let servicesSum = document.querySelector('.services-sum');
    let sumPrice = document.querySelector('.sum-price');
    let totalSum = document.querySelector('.total-sum');
    let currentBonus = document.querySelector('.current-bonus');
    let titleOutput = document.querySelector('.title-output');
    let advertisementRadio = document.querySelectorAll('.advertisement__radio');
    let advertisementPreview = document.querySelector('.advertisement-preview-wrap');

    let titleMark = document.querySelector('.advertisement-title-mark');
    let moreInfo = document.querySelector('.advertisement-more-info');
    let titleWrap = document.querySelector('.advertisement-preview-title-wrap');
    let company = document.querySelector('.advertisement-title-company');
    let advertisementContacts = document.querySelector('.advertisement-contacts');
    let rating = document.querySelector('.advertisement-rating');

    let noneRadio = document.querySelector('.none-radio');
    let vipRadio = document.querySelector('.vip-radio');
    let topRadio = document.querySelector('.top-radio');
    let xxlService = document.querySelector('.xxl-radio');
    let colorService = document.querySelector('.color-radio');




    let advertisementWrap = document.querySelector('.advertisement-preview');


    // при нажатии "добавить объявление" подставляем в заголовок название
    for (let inputs of advertisementRadio) {
      if (inputs.checked) {
        let nameAdvertisement = inputs.closest('.advertisement__item').querySelector('.advertisement__desc');
        let idAdvertisement = inputs.closest('.advertisement__item').querySelector('.advertisement__id');

        let str = nameAdvertisement.innerHTML.split(' ');
        str[0] = `${str[0]}a`;
        titleOutput.innerHTML = `<span>${str.join(" ").toLocaleLowerCase()}</span>` + ` <mark>(${idAdvertisement.innerHTML})</mark>`;
      }
    }

    // активируем область выбора услуг
    tableServices.setAttribute('aria-disabled', false);


    // Показываем превью объявления
    advertisementPreview.classList.remove('hide');

    // Активируем услугу без оформления
    noneRadio.checked;

    for (let i = 0; i < paymentRadio.length; i++ ) {
      // Присваиваем каждой услуге класс в виде id
      if (!paymentRadio[i].classList.contains('id-services')) {
        paymentRadio[i].classList.add(`id-services-${i}`);
      }

      // Делаем доступным для выбора кнопки выбора услуг
      paymentRadio[i].removeAttribute('disabled');


      // Делаем доступным поле с вводом бонусов
      inputBonus.removeAttribute('disabled');


      paymentRadio[i].onchange = function () {

        // Без оформления
        if (noneRadio.checked) {
          advertisementWrap.classList.remove('vip', 'top-current', 'vip-mark', 'red-mark');
        }

        // vip объявление
        if (vipRadio.checked) {

        }

        // ТОП оформление
        if (topRadio.checked) {

        }

        if (!noneRadio.checked) {

          // Услуга Выделить XXL
          if (xxlService.checked) {
            advertisementWrap.classList.add('xxl-bg');
          } else {
            advertisementWrap.classList.remove('xxl-bg');
          }

          // Услуга Выделить название вакансии цветом
          if (colorService.checked) {
            advertisementWrap.classList.add('color-bg');
          } else {
            advertisementWrap.classList.remove('color-bg');
          }
        }


        let div = document.createElement('div');

        if (paymentRadio[i].checked) {
          div.classList.add(`id-services-${i}`, 'service-cost');

          div.innerHTML = `<div>${paymentRadio[i].value}. скидка ${paymentRadio[i].dataset.sale}%</div>
          <div class="sale-price">${paymentRadio[i].dataset.salePrice} ₽</div>`;
          servicesSum.prepend(div);

          for (let elementInput of paymentRadio) {
            if (!elementInput.checked) {
              let arrClass = elementInput.classList;

              if (document.querySelector(`div.${arrClass[arrClass.length - 1]}`)) {
                document.querySelector(`div.${arrClass[arrClass.length - 1]}`).remove();
              }
            }
          }

        } else {

          function delPrice() {
            let arrClass = paymentRadio[i].classList;
            document.querySelector(`div.${arrClass[arrClass.length - 1]}`).remove();

            for (let x = 0; x < paymentRadio.length; x++) {
              if (paymentRadio[x].checked) {
                break;
              } else {
                if (x === paymentRadio.length - 1) {
                  advertisementPreview.classList.add('hide');
                }
              }
            }
          }

          delPrice();

        }


        let serviceCost = document.querySelectorAll('.service-cost .sale-price');
        let sum = 0;

        for (let el of serviceCost) {
          let num = el.innerHTML.split(' ').shift();
          sum = sum + Number(num);
        }

        sumPrice.innerHTML = sum + ' ₽';

        let sumBonus = 0;

        if (sum <= 1000) {
          sumBonus = sum;
        } else {
          sumBonus = 1000;
        }

        currentBonus.innerHTML = sumBonus + ' ₽';
        inputBonus.value = '-' + sumBonus + ' ₽';
        totalSum.innerHTML = sum - sumBonus;
      }

    }

    popup();

  }

  if (document.querySelector('.table-services')) {
    let btnChoose = document.querySelector('.advertisement-confirm__choose');
    let btnCancel = document.querySelector('.advertisement-confirm__cancel');
    let advertisementInput = document.querySelectorAll('.advertisement__radio');

    for (let input of advertisementInput) {
      input.onchange = function () {
        btnChoose.removeAttribute('disabled');
      }
    }

    btnChoose.addEventListener('click', checkServices);

    btnCancel.addEventListener('click', popup);

  }

  if (document.querySelector('.write-down-bonus')) {
    let inputBonus = document.querySelector('.write-down-bonus');

    inputBonus.onkeypress = validate;

    inputBonus.onfocus = function () {
      let arr = inputBonus.value.split('');
      arr.shift();
      arr.length = arr.length - 2;
      inputBonus.value = arr.join('');
    };

    inputBonus.onblur = function () {
      if (inputBonus.value === '' || inputBonus.value === ' ') {
        inputBonus.value = 0;
      }

      let currentBonus = document.querySelector('.current-bonus').innerHTML;


      if (inputBonus.value > 1000 || inputBonus.value > currentBonus) {
        let arr = currentBonus.split('');
        arr.length = arr.length - 2;
        inputBonus.value = Number(arr.join(''));
      }

      inputBonus.value = '-' + inputBonus.value + ' ₽';
    };
  }

  function validate(evt) {
    let theEvent = evt || window.event;
    let key = theEvent.keyCode || theEvent.which;

    key = String.fromCharCode( key );

    var regex = /[0-9]|\./;

    if ( !regex.test(key) ) {
      theEvent.returnValue = false;

      if (theEvent.preventDefault) {
        theEvent.preventDefault();
      }
    }
  }


  if (document.querySelector('.legal-operation')) {
    let checks = document.querySelectorAll('.input-sort');


    for (let check of checks) {

      let sortLegal = function () {
        let tableOperation = check.parentElement.nextElementSibling;


        let rows = tableOperation.children;

        if (check.checked) {

          for (let i = 1; i < rows.length; i++) {
            let statusOperation = rows[i].querySelector('[data-status]').getAttribute('data-status');
            (statusOperation === 'false') ? rows[i].classList.add('hidden') : rows[i].classList.remove('hidden');
          }

        } else {

          for (let i = 1; i < rows.length; i++) {
            rows[i].classList.remove('hidden');
          }

        }
      }

      check.onchange = sortLegal;
    }
  }


  let sortOperation = function (el, option) {
    let rows = el.closest('.table-history').querySelectorAll('.table-operation > div');
    let activeOperationInput = el.closest('.table-history').querySelector('.input-sort');

    activeOperationInput.checked = false;


    switch (option) {
      case 'all':
        for (let i = 1; i < rows.length; i++) {
          rows[i].classList.remove('hidden');
        }
        break;
      case 'add':
        for (let i = 1; i < rows.length; i++) {
          let status = rows[i].querySelector('div[data-type]');
          if (status.getAttribute('data-type') !== 'add') {
            rows[i].classList.add('hidden');
          } else {
            rows[i].classList.remove('hidden');
          }
        }
        break;
      case 'refund':
        for (let i = 1; i < rows.length; i++) {
          let status = rows[i].querySelector('div[data-type]');

          if (status.getAttribute('data-type') !== 'refund') {
            rows[i].classList.add('hidden');
          } else {
            rows[i].classList.remove('hidden');
          }
        }
        break;
      case 'not':
        for (let i = 1; i < rows.length; i++) {
          let status = rows[i].querySelector('div[data-type]');

          if (status.getAttribute('data-type') !== 'not') {
            rows[i].classList.add('hidden');
          } else {
            rows[i].classList.remove('hidden');
          }
        }
    }
  }

  if (document.getElementsByName('sort-legal')) {
    let inputs = document.querySelectorAll('.radio-sort');

    for (let input of inputs) {
      input.onchange = function () {
        sortOperation(input, input.value);
      }
    }
  }
})();