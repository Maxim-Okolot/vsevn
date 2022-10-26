MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

// common elements
const cover = find('.cover');

// functions
function find(selector) {
    return document.querySelector(selector);
}

function findAll(selector) {
    return document.querySelectorAll(selector);
}

function formatDateDots(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}.${month}.${year}`;
}

// set onclick = 'return false' to all links with empty href attribute
// to prevent them from reloading the page
function initLinkPreventReload(target) {
    target.querySelectorAll('a[href=""]').forEach(a => {
        a.addEventListener('click', e => e.preventDefault());
    });
}

// custom select
findAll('.select:not(#adv-filter-region)').forEach(sel => {
    const field = sel.querySelector('.select__body .text');
    const placeholderText = 'Сортировать по';

    sel.querySelector('.cross').addEventListener('click', () => {
        sel.setAttribute('data-empty', true);
        field.innerHTML = placeholderText;
        selectedItem.removeAttribute('data-selected');
    });

    const defaultItem = sel.querySelector('ul li[data-default="true"]');
    let selectedItem;
    if (defaultItem) {
        field.innerHTML = defaultItem.innerHTML;
        selectedItem = defaultItem;
        selectedItem.setAttribute('data-selected', 'true');
        sel.setAttribute('data-empty', false);
    } else {
        field.innerHTML = placeholderText;
    }

    let expanded = false;
    sel.querySelector('.select__body').addEventListener('click', () => {
        expanded = !expanded;
        toggleSelect(sel, expanded);
    });

    sel.querySelectorAll('.select__list li').forEach(li => li.addEventListener('click', e => {
        sel.setAttribute('data-empty', false);
        field.innerHTML = e.target.innerHTML;
        selectedItem?.removeAttribute('data-selected');
        selectedItem = e.target;
        selectedItem.setAttribute('data-selected', 'true');
        expanded = false;
        toggleSelect(sel, expanded);
    }));

    cover.addEventListener('click', () => {
        if (!expanded) {
            return;
        }
        expanded = false;
        toggleSelect(sel, expanded);
    });
});

function toggleSelect(elem, expanded) {
    if (expanded) {
        cover.classList.remove('hidden');
    } else {
        cover.classList.add('hidden');
    }
    elem.setAttribute('aria-expanded', expanded);
}

// handle text overflow
function setFadeEffects(elems) {
    elems.forEach(el => {
        if (el.scrollWidth > el.clientWidth) {
            el.classList.add('ovf-fade');
            el.parentNode.classList.add('hint');
        } else {
            el.classList.remove('ovf-fade');
            el.parentNode.classList.remove('hint');
        }
    });
}

function initFadeEffects(target) {
    const elems = [].concat(...target.querySelectorAll('.adv-item__title span.text'), ...target.querySelectorAll('.adv-item__city-list > li > div'), // ...target.querySelectorAll('.ads__field-names span')
    );

    setFadeEffects(elems);

    window.addEventListener('resize', () => {
        // setFadeEffects(elems);
    });
}

// tab links (most used on filters)
findAll('.tab-links').forEach(parent => {
    const links = Array.from(parent.querySelectorAll('.tab-link'));
    let active = links.find(l => l.classList.contains('active'));
    if (!active) {
        active = links[0];
        active.classList.add('active');
    }

    links.forEach(l => l.addEventListener('click', e => {
        if (e.target === active || !links.includes(e.target)) {
            return;
        }
        active.classList.remove('active');
        active = e.target;
        active.classList.add('active');
    }));
});

// input validation
function initInputValidation() {
    findAll('input[type="number"]').forEach(inp => inp.addEventListener('keydown', e => {
        if ((isNaN(e.key) && e.keyCode !== 8 && e.key.toLowerCase() !== 'backspace') || e.keyCode === 32) {
            e.preventDefault();
        }
    }));
}

// cross clear field
function initClearFieldBtns(target) {
    target.querySelectorAll('.cross').forEach(c => {
        const field = find('#' + c.getAttribute('aria-controls'));
        if (field.tagName.toLowerCase() !== 'input') {
            if (field.classList.contains('date-input-field')) {
                c.addEventListener('click', () => clearDateInputField(field));
            }
            return;
        }
        const parent = c.parentNode;
        parent.setAttribute('data-empty', field.value === '');

        field.addEventListener('input', () => field.value !== '' ? parent.setAttribute('data-empty', 'false') : parent.setAttribute('data-empty', 'true'));
        c.addEventListener('click', () => {
            field.value = '';
            parent.setAttribute('data-empty', 'true');
        });

    });
}



// expanding list with links
function initExpandingLists(target) {
    target.querySelectorAll('.adv-item__links').forEach(list => {

        if (list.querySelectorAll('li').length < 3) {
            return;
        }

        const defaultBtnText = 'Еще';
        const clickedBtnText = 'Свернуть';

        const btn = list.querySelector('.service-item a');
        btn.innerHTML = defaultBtnText;

        toggleExpandingList(list, false);

        btn.addEventListener('click', e => {
            toggleExpandingList(list);
            btn.innerHTML = btn.innerHTML === defaultBtnText ? clickedBtnText : defaultBtnText;
        });
    });
}

function toggleExpandingList(list, expanded = null) {
    if (expanded === null) {
        expanded = !(list.getAttribute('aria-expanded') === 'true');
    }

    if (expanded) {
        list.classList.remove('show-on-adv-item-hover');
    } else {
        list.classList.add('show-on-adv-item-hover');
    }
    list.setAttribute('aria-expanded', expanded);
    const links = list.querySelectorAll('li:not(.service-item)');
    for (let i = 1; i < links.length; i++) {
        if (expanded) {
            links[i].classList.remove('hidden');
        } else {
            links[i].classList.add('hidden');
        }
    }
}

// save scroll position
function updateScrollValue() {
    localStorage.setItem('scrollTop', String(find('html').scrollTop));
}

function getScrollValue() {
    return localStorage.getItem('scrollTop');
}

// copy link to clipboard
// function initCopyLinkBtns(target) {
//     target.querySelectorAll('.copy-link-modal').forEach(m => {
//         m.querySelector('.copy-link-modal__btn').addEventListener('click', () => {
//             const url = m.querySelector('.copy-link-modal__url').textContent;
//             navigator.clipboard.writeText(url).then(() => {
//             }, err => console.error);
//         });
//     });
// }

// date input fields
function initDateInputFields(target) {
    target.querySelectorAll('.date-input-field').forEach(field => {
        field.querySelectorAll('input').forEach(f => f.addEventListener('keydown', e => {
            if ((isNaN(e.key) && !(e.keyCode === 8 || e.key.toLowerCase() === 'backspace') && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 9) || e.keyCode === 32) {
                e.preventDefault();
            }
        }));

        const dayField = field.querySelector('.day');
        const monthField = field.querySelector('.month');
        const yearField = field.querySelector('.year');

        dayField.addEventListener('input', () => {
            const n = +dayField.value;
            if (dayField.value.length === 2 && !(1 <= n && n <= 31)) {
                dayField.value = dayField.value.slice(0, -1);
            }
            if (dayField.value.length === 2) {
                monthField.focus();
            }
        });
        dayField.addEventListener('focusout', () => {
            if (dayField.value.length === 1) {
                dayField.value = String(dayField.value).padStart(2, '0');
            }
        });

        monthField.addEventListener('input', () => {
            const n = +monthField.value;
            if (monthField.value.length === 2 && !(1 <= n && n <= 12)) {
                monthField.value = monthField.value.slice(0, -1);
            }
            if (monthField.value.length === 2) {
                yearField.focus();
            }
        });
        monthField.addEventListener('focusout', () => {
            if (monthField.value.length === 1) {
                monthField.value = String(monthField.value).padStart(2, '0');
            }
        });

        yearField.addEventListener('input', () => {
            if (yearField.value.length > 4) {
                yearField.value = yearField.value.slice(0, -1);
            }
        });
        yearField.addEventListener('focusout', () => {
            if (0 < yearField.value.length && yearField.value.length < 4) {
                yearField.value = String(yearField.value).padStart(4, '0');
            }
        });
    });
}

function clearDateInputField(field) {
    field.querySelectorAll('input').forEach(inp => inp.value = '');
}

function getDateInputFieldValue(field) {
    const day = field.querySelector('.day').value;
    const month = field.querySelector('.month').value;
    const year = field.querySelector('.year').value;
    const dateStr = day + '.' + month + '.' + year;
    if (dateStr.match('[0-9]{2}.[0-9]{2}.[0-9]{4}')) {
        return new Date(`${month}/${day}/${year}`);
    }

    throw new Error('cannot get date from input field: no valid date there');
}

function setDateInputFieldValue(field, date) {
    field.querySelector('.day').value = String(date.getDate()).padStart(2, '0');
    field.querySelector('.month').value = String((+date.getMonth() + 1)).padStart(2, '0');
    field.querySelector('.year').value = String(date.getFullYear()).padStart(4, '0');
}

function checkDateInputFieldEmpty(field) {
    const day = field.querySelector('.day').value;
    const month = field.querySelector('.month').value;
    const year = field.querySelector('.year').value;

    return day === '' && month === '' && year === '';
}


// advertisement rendering system
const DEFAULT_LOGO_URL = 'img/profile-icons/default-logo.svg';
const DEFAULT_PHOTO_URL = 'img/profile-icons/default-photo.svg';
const ARTICLES_URL = 'data.json';
const ARTICLE_TEMPLATE_URL = 'article-template.html';
const SERVICES_URL = 'services.json';

const articlesContainer = find('.ads__items');

let services, articleTemplate, servicesLogos = [], articles, filteredArticles;

const selectors = {
    img: '.adv-item__img',
    title: '.adv-item__title',
    price: '.adv-item__price > span:first-child',
    cityList: '.adv-item__city-list',
    rating: '.adv-item__rating',
    links: '.adv-item__links',
    views: '.adv-item__stats .views',
    favourites: '.adv-item__stats .favourites',
    dialogs: '.adv-item__stats .dialogs',
    newMessages: '.adv-item__stats .new-messages',
    growth: '.adv-item__stats .growth',
    responses: '.adv-item__stats .responses',
    matchingVacancies: '.adv-item__stats .matching-vacancies',
    daysPublished: '.adv-item__stats .days-published',
    servicesCount: '.adv-item__services'
};

async function renderElement(elem, payload = null) {
    switch (elem) {
        case 'title':
            return `
                <span class="hint__text">${payload}</span>
                <span class="text">${payload}</span>
            `;
        case 'cityList':
            return `
                <li class="service-item mobile-show"><a href="">Добавить</a></li>
                <p class="mobile-show">Регион / Населенный пункт: </p>
                ${payload.map((c, i) => `
                    <li ${i > 0 ? 'class="hidden"' : ''}>
                        <span class="hint__text">${c}</span>
                        <div>
                            <span class="icon icon-cross hint">
                                <span class="hint__text hint__text--center">Удалить данный населенный пункт</span>
                            </span>
                            <span class="text">${c}</span>
                        </div>
                    </li>
                `).join('')}
                ${
                    payload.length > 1 
                        ?
                        `<a href="" class="cities-show-btn mobile-show">Ещё ${payload.length - 1}:</a>`
                        : ''    
                }
            `;
        case 'newMessages':
            return `${+payload ? payload : ''}`;
        case 'growth':
            return `+${payload}`;
        case 'rating':
            return `<p>Объявление на ${payload} месте в поиске.</p><p><a href="">Поднять на 1 (первое) место в поиске?</a></p>`;
        case 'servicesCount':
            return `
                <p>Активно: ${payload}</p>
                <a href="">Показать</a>
            `;
        case 'services':
            const skipIdx = '1' in payload.services ? 0 : 1;
            return `
                <h4 class="services-header">Услуги продвижения</h4>
                ${Object.keys(services).map((s, i) => i !== skipIdx && (payload.state === 'active' || services[s].free || i in payload.services) ? `
                        <article class="service">
                            <div class="service__img">${servicesLogos[s]}</div>
                            <div class="service__info">
                                <h4 class="service__title">${services[s].title}</h4>
                                ${!services[s].free ? (i in payload.services ? `
                                        <p>
                                            <span>Период:</span>
                                            <span class="from">${payload.services[s].dateFrom}</span>
                                            <span class="dash">-</span>
                                            <span class="to">${payload.services[s].dateTo}</span>
                                        </p>
                                        <p>
                                            Услуга АКТИВНА до ${payload.services[s].dateTo}
                                        </p>
                                    ` : `
                                        <p>
                                            Услуга не активна, <a href="">активировать</a>?
                                        </p>
                                    `) : ''}
                            </div>
                        </article>
                    ` : '').join('')}   
            `;
        case 'img':
            if (payload.url.endsWith('.html')) {
                const logo = await fetch(payload.url).then(data => data.text());
                return `<div class="${payload.className}">${logo}</div>`;
            }
            return `
                <div class="${payload.className}" style="background-image: url(${payload.url})" alt="logo"></div>
            `;
        case 'links':
            return `
                ${payload.map(l => `
                    <li>
                        <span class="icon icon-link"></span>
                        <a href="">${l.text}</a>
                        
                        <div class="copy-link-modal">
                        <span class="copy-link-modal__url">${l.url}</span>
                        <span class="copy-link-modal__btn">
                            <span class="icon icon-link"></span>
                            <span class="text">Скопировать ссылку</span>
                        </span>
                    </div>
                    </li>
                `).join('')}   
                <li class="service-item"><a href=""></a></li>
            `;
        default:
            return payload;
    }
}

async function renderArticle(data) {
    const article = document.createElement('article');
    article.innerHTML = articleTemplate;
    article.classList.add('adv-item', 'grid', 'underline');
    for (const [key, value] of Object.entries(data)) {
        if (key.startsWith('_')) {
            continue;
        }
        article.querySelector(selectors[key]).innerHTML = await renderElement(key, value);
    }

    return article;
}

async function fetchData() {
    services = await fetch(SERVICES_URL).then(data => data.json());
    articleTemplate = await fetch(ARTICLE_TEMPLATE_URL).then(data => data.text());

    for (const k of Object.keys(services)) {
        servicesLogos[k] = await fetch(services[k].logoUrl).then(data => data.text());
    }

    const json = await fetch(ARTICLES_URL).then(data => data.json());
    articles = json.map(obj => ({
        el: null, checked: false, data: {
            img: {
                url: obj.logo_url || (obj.type === 'resume' ? DEFAULT_PHOTO_URL : DEFAULT_LOGO_URL),
                className: obj.type === 'resume' ? 'avatar-circle' : 'avatar-square'
            },
            title: obj.title,
            _type: obj.type,
            _state: obj.state,
            _date: obj.date,
            price: obj.price,
            _autoProlong: obj.auto_prolong,
            rating: obj.rating,
            cityList: obj.city_list,
            links: obj.links.map(l => ({
                text: l.text, url: l.url, free: l.free
            })),
            views: obj.views,
            favourites: obj.favourites,
            dialogs: obj.dialogs,
            newMessages: obj.new_messages,
            growth: obj.growth,
            responses: obj.responses,
            matchingVacancies: obj.matching_vacancies,
            daysPublished: obj.days_published,
            servicesCount: obj.services.find(s => s.id === 1) ? obj.services.length : obj.services.length + 1,
            _services: obj.services.reduce((acc, s) => {
                acc[s.id] = {
                    dateFrom: s.date_from, dateTo: s.date_to
                };
                return acc;
            }, {}),
        }
    }));

    return articles;
}

function appendArticle(article) {
    articlesContainer.appendChild(article);
}

async function printArticles(articles) {
    articlesContainer.innerHTML = '';
    for (const a of articles) {
        let setupNeeded = false;
        if (a.el === null) {
            a.el = await renderArticle(a.data);
            setupNeeded = true;
        }

        appendArticle(a.el);

        if (setupNeeded) {
            setupArticle(a);
        }
    }
}



function updateArticle(article, options = {}) {
    article.data = {...article.data, ...options};
    article.el = null;
}

async function performFiltering() {
    filteredArticles = filterArticles(articles);
    for (let i = 0; i < filteredArticles.length; i++) {
        filteredArticles[i].id = i;
    }
    await printArticles(filteredArticles).then(updateActionBar);
}

async function initArticles(data) {
    articles = data;
    await performFiltering();
}

// setup article functions
function initProlongCheckbox(article) {
    const checkboxEnable = article.el.querySelector('.adv-item__auto-prolong .enable .fancy-radiobutton');
    const labelEnable = checkboxEnable.nextElementSibling;

    const checkboxDisable = article.el.querySelector('.adv-item__auto-prolong .disable .fancy-radiobutton');
    const labelDisable = checkboxDisable.nextElementSibling;

    const id = Date.now();
    checkboxEnable.setAttribute('id', 'auto-prolong-enable-' + id);
    labelEnable.setAttribute('for', 'auto-prolong-enable-' + id);

    checkboxDisable.setAttribute('id', 'auto-prolong-disable' + id);
    labelDisable.setAttribute('for', 'auto-prolong-disable' + id);

    checkboxEnable.setAttribute('name', 'auto-prolong-' + id);
    checkboxDisable.setAttribute('name', 'auto-prolong-' + id);

    if (article.data._autoProlong) {
        checkboxEnable.setAttribute('checked', 'checked');
    } else {
        checkboxDisable.setAttribute('checked', 'checked');
    }
}



function initArticleStateBackground(article) {
    article.el.setAttribute('data-state', article.data._state);
}

function initDeleteCityBtns(article) {
    article.el.querySelectorAll('.adv-item__city-list > li:not(.service-item)').forEach(li => {
        const city = li.querySelector('span.text').textContent;
        li.querySelector('span.icon').addEventListener('click', () => {
            updateArticle(article, {cityList: article.data.cityList.filter(c => c !== city)});
            performFiltering();
        });
    });
}

function initShowCitiesBtn(article) {
    article.el.querySelector('.adv-item__city-list a.cities-show-btn')?.addEventListener('click', () => {
        showModal(`
            <ul>
                ${article.data.cityList.map(c => `<li>${c}</li>`).join('')}
            </ul>
        `);
    });
}

function initCopyLinkModals(article) {
    article.el.querySelectorAll('.adv-item__links > li:not(.service-item)').forEach(li => {
        const defaultText = 'Скопировать ссылку';
        const clickedText = 'Ссылка скопирована';

        const url = li.querySelector('.copy-link-modal__url');
        const btn = li.querySelector('.copy-link-modal__btn');

        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(url.textContent).then(() => {
                btn.querySelector('span.text').textContent = clickedText;
            }, console.error);
        });
        btn.parentNode.addEventListener('mouseleave', () => {
            btn.querySelector('span.text').textContent = defaultText;
        });

        let string = null;
        li.addEventListener('mouseenter', () => {
            if (string || url.scrollWidth <= url.clientWidth) {
                return;
            }

            string = url.textContent;
            while (url.scrollWidth > url.clientWidth) {
                string = string.slice(0, -1);
                url.textContent = string;
            }
            string = string.slice(0, -2);
            url.textContent = string;
            url.classList.add('ovf');
        });
    });
}





function switchActionsBtns(enabled = null) {
    if (enabled === null) {

    }
    if (enabled) {
        actionBtnsContainer.querySelectorAll('a:not(.action-btn--red)').forEach(b => {
            b.classList.remove('disabled');
        });
    } else {
        actionBtnsContainer.querySelectorAll('a:not(.action-btn--red)').forEach(b => {
            b.classList.add('disabled');
        });
    }
}

function initDefaultActionBtns() {
    defaultActionBtns.forEach(b => {
        const btn = document.createElement('a');
        btn.setAttribute('href', '');
        btn.classList.add('action-btn', 'action-btn--red');
        btn.textContent = b.text;
        btn.addEventListener('click', e => {
            e.preventDefault();
            b.action();
        });

        b.elem = btn;
    });
}

function clearActionBtns() {
    actionBtnsContainer.querySelectorAll('.action-btn').forEach(b => b.remove());
    checkSensitiveBtns = [];
}

function initActionBar(state) {
    clearActionBtns();
    switchMainCheckBoxVisibility(true);

    switch (state) {
        case 'active':
            addActionBtn(actionBtns.unpublish);
            break;
        case 'closed':
            addActionBtn(actionBtns.activate);
            addActionBtn(actionBtns.delete);
            break;
        case 'blocked':
        case 'rejected':
        case 'pending':
            switchMainCheckBoxVisibility(false);
            break;
        case 'draft':
            addActionBtn(actionBtns.delete);
            break;
        case 'deleted':
            addActionBtn(actionBtns.emptyTrash);
            break;
    }

    defaultActionBtns.forEach(b => {
        actionBtnsContainer.appendChild(b.elem);
    });
}

function addActionBtn({text, action, beforeAction = null}) {
    const btn = document.createElement('a');
    btn.setAttribute('href', '');
    btn.textContent = text;
    btn.classList.add('action-btn', 'disabled');
    btn.addEventListener('click', e => {
        e.preventDefault();
        if (beforeAction && typeof beforeAction === 'function') {
            beforeAction()
                .then(() => performAction(action))
                .catch(() => {});
            return;
        }
        performAction(action);
    });
    actionBtnsContainer.appendChild(btn);
}

function performAction(action) {
    articles.forEach(a => {
        if (a.checked) {
            action(a);
        }
    });
    updateActionBar();
    performFiltering();
    updateStateFiltersNumbers();
}

// advertisement filters
const stateFiltersBtns = Array.from(findAll('.adv-filter-state .tab-link'));

function initStateFiltersBtns() {
    stateFiltersBtns.forEach(b => {
        const state = b.getAttribute('id').split('-').pop();
        if (b.classList.contains('active')) {
            initActionBar(state);
        }
        b.addEventListener('click', () => initActionBar(state));
    });
}

function updateStateFiltersNumbers() {
    stateFiltersBtns.forEach(b => {
        b.querySelector('span:last-child').textContent = 0;
    });
    articles.forEach(a => {
        const filterNumber = find(`#adv-filter-state-${a.data._state} span:last-child`);
        filterNumber.textContent = ++filterNumber.textContent;
    });
}

const filters = [function (a) {
    const strings = find('#adv-filter-title').value.trim().split(' ');
    let match = false;
    for (let i = 0; i < strings.length; i++) {
        if ((a.data.title.toLowerCase().includes(strings[i]) && strings[i].length > 2) || strings[i] === '') {
            match = true;
            break;
        }
    }
    return match;
}, function (a) {
    const type = find('.adv-filter-type .tab-link.active').getAttribute('id').toLowerCase();
    if (type.endsWith('all')) {
        return true;
    }
    if (type.endsWith('resume')) {
        return a.data._type.toLowerCase() === 'resume';
    }
    if (type.endsWith('vacancy')) {
        return a.data._type.toLowerCase() === 'vacancy';
    }
}, function (a) {
    const priceFrom = +find('#adv-filter-price-from').value;
    const priceTo = +find('#adv-filter-price-to').value || Number.POSITIVE_INFINITY;
    const price = +a.data.price;
    return price >= priceFrom && price <= priceTo;
}, function (a) {
    const field = find('.adv-filter-region .select span');
    if (field.getAttribute('data-empty') === 'true') {
        return true;
    }
    const city = field.textContent.toLowerCase();
    let match = false;
    for (let i = 0; i < a.data.cityList.length; i++) {
        if (a.data.cityList[i].toLowerCase() === city) {
            match = true;
            break;
        }
    }
    return match;
}, function (a) {
    const state = find('.adv-filter-state .tab-link.active').getAttribute('id').split('-').pop();
    return a.data._state === state;
}, function (a) {
    const comparingDate = a.data._state === 'draft' ? new Date(a.data._date.created) : new Date(a.data._date.activation);
    const dateStartStr = find('#adv-filter-date-from').getAttribute('data-date');
    const dateEndStr = find('#adv-filter-date-to').getAttribute('data-date');
    if (dateStartStr && comparingDate < new Date(dateStartStr)) {
        return false;
    }
    if (dateEndStr && comparingDate > new Date(dateEndStr)) {
        return false;
    }
    return true;
}];



function initFilters() {
    listeners.forEach(l => {
        Array.from(findAll(l.selector)).forEach(el => {
            el.addEventListener(l.event, e => {
                if (l.checker === undefined || l.checker(e)) {
                    performFiltering();
                }
            });
        });
    });
}

let globalTestData;

initLinkPreventReload(document.body);
initClearFieldBtns(document.body);

initDateInputFields(document.body);
initInputValidation();

fetchData().then(data => {
    initDefaultActionBtns();
    initStateFiltersBtns();
    updateStateFiltersNumbers();

    initFilters(data);
    initArticles(data).then(() => {
        const scroll = getScrollValue();
        if (scroll) {
            window.scrollTo(0, +scroll);
        }
        window.addEventListener('beforeunload', () => {
            updateScrollValue();
        });
    });

    globalTestData = data;
});


// TEST
const testInputs = findAll('.test-form input');
find('.test-form .add').addEventListener('click', () => {
    const type = find('input[name="type"]:checked').value;
    globalTestData = [...globalTestData, {
        el: null, data: {
            title: testInputs[0].value,
            price: testInputs[1].value,
            _type: type,
            img: {
                url: testInputs[3].value || DEFAULT_LOGO_URL,
                className: type === 'resume' ? 'avatar-circle' : 'avatar-square'
            },
            cityList: testInputs[2].value.split(' '),
            views: testInputs[4].value,
            favourites: testInputs[5].value,
            dialogs: testInputs[6].value,
            responses: testInputs[7].value,
            matchingVacancies: testInputs[8].value,
            daysPublished: testInputs[9].value,
            services: Array(+testInputs[10].value).fill().map((el, i) => ({
                id: i, dateFrom: '10.05.2022', dateTo: '10.06.2022'
            }))
        }
    }];
    initArticles(globalTestData);
    initFilters(globalTestData);
});
find('.test-form .delete').addEventListener('click', () => {
    articlesContainer.innerHTML = '';
});