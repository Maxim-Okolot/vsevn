const monthDefault = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
];
const monthsGenitive = [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря',
];

const START_YEAR = 2003;

const row = document.createElement('div');
row.classList.add('row');

const calendarWrapper = document.createElement('div');
calendarWrapper.classList.add('calendar-wrapper');
calendarWrapper.appendChild(row);

let submitBtn;

function recreateSubmitBtn() {
    submitBtn?.remove();

    const newBtn = document.createElement('a');
    newBtn.textContent = 'Применить';
    newBtn.setAttribute('href', '');
    newBtn.classList.add('calendar__submit-btn');
    calendarWrapper.appendChild(newBtn);

    newBtn.addEventListener('click', e => e.preventDefault());

    return newBtn;
}

const availableDates = [
    [new Date('1/1/2003'), new Date('8/31/2022')],
    [new Date('10/1/2022'), new Date('12/31/2022')]
]

function formatDate(date) {
    return `${date.getDate()} ${monthsGenitive[date.getMonth()]} ${date.getFullYear()}`;
}

let calendarTemplate;
fetch('calendar.html')
    .then(resp => resp.text())
    .then(data => calendarTemplate = new DOMParser().parseFromString(data, 'text/html').querySelector('.calendar'));

function getDayDifference(date1, date2) {
    return (date2 - date1) / 1000 / 60 / 60 / 24;
}

function showSingleCalendar(container, selectCallback, submitCallback) {
    cover.classList.remove('hidden');

    const calendar = renderCalendar(selectCallback, true);

    row.innerHTML = '';
    row.appendChild(calendar.element);

    submitBtn = recreateSubmitBtn();
    submitBtn.addEventListener('click', () => {
        let date, err;
        try {
            date = getDateFromCalendar(calendar.element);
        } catch (e) {
            err = e;
        }
        submitCallback(date, err);
    });
    container.appendChild(calendarWrapper);

    return {
        ...calendar,
        close() {
            calendarWrapper.remove();
            cover.classList.add('hidden');
        }
    }
}

function showDoubleCalendar(container, selectCallback1, selectCallback2, submitCallback) {
    cover.classList.remove('hidden');

    const calendar1 = renderCalendar(selectCallback1);
    const calendar2 = renderCalendar(selectCallback2);

    row.innerHTML = '';
    row.appendChild(calendar1.element);
    row.appendChild(calendar2.element);

    submitBtn = recreateSubmitBtn();
    submitBtn.addEventListener('click', () => {
        let date1, date2, err;
        try {
            date1 = getDateFromCalendar(calendar1.element);
        } catch (e) {
            err = e;
        }
        try {
            date2 = getDateFromCalendar(calendar2.element);
        } catch (e) {
            err = e;
        }
        submitCallback(date1, date2, err);
    });

    container.appendChild(calendarWrapper);

    return {
        first: calendar1,
        second: calendar2,
        close() {
            calendarWrapper.remove();
            cover.classList.add('hidden');
        }
    }
}

function getDateFromCalendar(calendar) {

    const yearSelect = calendar.querySelector('.calendar__year select');
    const year = +yearSelect.options[yearSelect.selectedIndex].text;

    const monthSelect = calendar.querySelector('.calendar__month select');
    const month = +monthSelect.options[monthSelect.selectedIndex].value;

    const day = calendar.querySelector('.calendar__days .selected');

    if (day) {
        return new Date(year, month, +day.querySelector('.value').textContent);
    }

    throw new Error('cannot get date from calendar: no day selected');
}

function checkDateAvailable(date) {
    let available = false;
    for ([startDate, finishDate] of availableDates) {
        if (startDate <= date && date <= finishDate) {
            available = true;
            break
        }
    }
    return available;
}

function renderCalendar(selectCallback, limitDays = false) {
    const date = new Date();
    const calendar = calendarTemplate.cloneNode(true);

    const yearSelect = calendar.querySelector('.calendar__year select');
    for (let i = (new Date()).getFullYear(); i >= START_YEAR; i--) {
        yearSelect.innerHTML += `<option value="${i}">${i}</option>`;
    }
    yearSelect.selectedIndex = (new Date()).getFullYear() - date.getFullYear();
    yearSelect.addEventListener('change', () => {
        const year = +yearSelect.options[yearSelect.selectedIndex].text;
        date.setFullYear(year);
        renderDays(date, daysContainer, selectCallback, limitDays);
    });
    yearSelect.nextElementSibling.addEventListener('click', () => {
        yearSelect.selectedIndex--;
        if (yearSelect.selectedIndex < 0) {
            yearSelect.selectedIndex = (new Date()).getFullYear() - START_YEAR;
        }
        date.setFullYear(+yearSelect.options[yearSelect.selectedIndex].text);
        renderDays(date, daysContainer, selectCallback, limitDays);
    });
    yearSelect.previousElementSibling.addEventListener('click', () => {
        yearSelect.selectedIndex++;
        if (yearSelect.selectedIndex < 0) {
            yearSelect.selectedIndex = 0;
        }
        date.setFullYear(+yearSelect.options[yearSelect.selectedIndex].text);
        renderDays(date, daysContainer, selectCallback, limitDays);
    });

    const monthSelect = calendar.querySelector('.calendar__month select');
    for (let i = 0; i < 12; i++) {
        monthSelect.innerHTML += `<option value="${i}">${monthDefault[i]}</option>`;
    }
    monthSelect.selectedIndex = date.getMonth();
    monthSelect.addEventListener('change', () => {
        const month = +monthSelect.options[monthSelect.selectedIndex].value;
        date.setMonth(month);
        renderDays(date, daysContainer, selectCallback, limitDays);
    });
    monthSelect.nextElementSibling.addEventListener('click', () => {
        monthSelect.selectedIndex++;
        if (monthSelect.selectedIndex < 0) {
            if (+yearSelect.options[yearSelect.selectedIndex].text === (new Date()).getFullYear()) {
                monthSelect.selectedIndex = 11;
                return;
            }
            yearSelect.selectedIndex--;
            date.setFullYear(+yearSelect.options[yearSelect.selectedIndex].text);
            monthSelect.selectedIndex = 0;
        }
        date.setMonth(+monthSelect.selectedIndex);
        renderDays(date, daysContainer, selectCallback, limitDays);
    });
    monthSelect.previousElementSibling.addEventListener('click', () => {
        monthSelect.selectedIndex--;
        if (monthSelect.selectedIndex < 0) {
            if (+yearSelect.options[yearSelect.selectedIndex].text === START_YEAR) {
                monthSelect.selectedIndex = 0;
                return;
            }
            yearSelect.selectedIndex++;
            date.setFullYear(+yearSelect.options[yearSelect.selectedIndex].text);
            monthSelect.selectedIndex = 11;
        }
        date.setMonth(+monthSelect.selectedIndex);
        renderDays(date, daysContainer, selectCallback, limitDays);
    });

    const daysContainer = calendar.querySelector('.calendar__days');
    renderDays(date, daysContainer, selectCallback, limitDays, false);

    return {
        setDate(date) {
            if (limitDays && !checkDateAvailable(date)) {
                throw new Error("Unavailable date selected");
            }

            date.setFullYear(date.getFullYear());
            yearSelect.selectedIndex = (new Date()).getFullYear() - date.getFullYear();

            date.setMonth(date.getMonth());
            monthSelect.selectedIndex = date.getMonth();

            renderDays(date, daysContainer, selectCallback, limitDays, true);
        },
        clear() {
            clearSelection(calendar);
        },
        element: calendar
    };
}

function renderDays(date, daysContainer, selectCallback, limitDays = false, daySelected = false) {
    daysContainer.innerHTML = '';
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let prevDay = (new Date(date.getFullYear(), date.getMonth(), 1)).getDay() - 1;
    if (prevDay < 0) {
        prevDay = 6;
    }

    for (let i = 0; i < prevDay; i++) {
        daysContainer.innerHTML += `<div></div>`;
    }

    let selectedDay;

    for (let i = 1; i <= lastDay.getDate(); i++) {
        const day = document.createElement('div');
        if (daySelected && i === date.getDate()) {
            selectedDay = day;
            selectedDay.classList.add('selected');
        }
        day.innerHTML = `<span class="value">${i}</span><span class="hint__text hint__text--center">Эту дату нельзя выбрать</span>`;

        const available = !limitDays || checkDateAvailable(new Date(date.getFullYear(), date.getMonth(), i));
        day.classList.add(available ? 'available' : 'hint');
        day.addEventListener('click', () => {
            if (!day.classList.contains('available')) {
                return;
            }
            selectedDay?.classList.remove('selected');
            selectedDay = day;
            selectedDay.classList.add('selected');
            date.setDate(+selectedDay.querySelector('.value').textContent);

            selectCallback(date);
        });
        daysContainer.appendChild(day);
    }

    let k = (lastDay.getDay() - 1);
    if (k < 0) {
        k = 6;
    }
    for (let i = 0; i < 6 - k; i++) {
        daysContainer.appendChild(document.createElement('div'));
    }
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

// init filter calendar
function initFilterCalendar(target) {
    target.querySelectorAll('.adv-filter-date.calendar-container').forEach(container => {

        const dateFromTextElem = container.querySelector('#adv-filter-date-from');
        const dateToTextElem = container.querySelector('#adv-filter-date-to');

        const dateFromInputField = container.querySelector('.date-input-field.date-from');
        const dateToInputField = container.querySelector('.date-input-field.date-to');

        const wrapperFrom = dateFromInputField.parentNode.parentNode;
        const wrapperTo = dateToInputField.parentNode.parentNode;

        wrapperFrom.setAttribute('data-empty', 'true');
        wrapperTo.setAttribute('data-empty', 'true');

        const btns = container.querySelectorAll('.calendar-open-btn--double');
        btns.forEach(btn => btn.addEventListener('click', () => {
            if (container.querySelector('.calendar') !== null) {
                return;
            }

            const strDateFrom = dateFromTextElem.getAttribute('data-date');
            const strDateTo = dateToTextElem.getAttribute('data-date');
            if (strDateFrom) {
                setDateInputFieldValue(dateFromInputField, new Date(strDateFrom.trim()));
                wrapperFrom.setAttribute('data-empty', 'false');
            } else {
                clearDateInputField(dateFromInputField);
            }
            if (strDateTo) {
                setDateInputFieldValue(dateToInputField, new Date(strDateTo.trim()));
                wrapperTo.setAttribute('data-empty', 'false');
            } else {
                clearDateInputField(dateToInputField);
            }

            container.classList.add('calendar-expanded');

            const calendar = showDoubleCalendar(container, dateFrom => {
                setDateInputFieldValue(dateFromInputField, dateFrom);
                dateFromTextElem.setAttribute('data-date', dateFrom.toLocaleDateString());
                wrapperFrom.setAttribute('data-empty', false);
            }, dateTo => {
                setDateInputFieldValue(dateToInputField, dateTo);
                dateToTextElem.setAttribute('data-date', dateTo.toLocaleDateString());
                wrapperTo.setAttribute('data-empty', false);

            }, (dateFrom, dateTo, err) => {
                if (err) {
                    // console.log(err);
                }

                try {
                    dateFromTextElem.textContent = formatDate(getDateInputFieldValue(dateFromInputField));
                } catch (e) {
                    wrapperFrom.setAttribute('data-empty', 'true');
                    dateFromTextElem.textContent = '';
                }

                try {
                    dateToTextElem.textContent = formatDate(getDateInputFieldValue(dateToInputField));
                } catch (e) {
                    wrapperTo.setAttribute('data-empty', 'true');
                    dateToTextElem.textContent = '';
                }

                performFiltering();

                container.classList.toggle('calendar-expanded');
                calendar.close();
            });

            dateFromInputField.querySelectorAll('input').forEach(inp => inp.addEventListener('input', () => {
                wrapperFrom.setAttribute('data-empty', checkDateInputFieldEmpty(dateFromInputField));
                try {
                    const date = getDateInputFieldValue(dateFromInputField);
                    calendar.first.setDate(date);
                } catch (e) {}
            }));
            dateToInputField.querySelectorAll('input').forEach(inp => inp.addEventListener('input', () => {
                wrapperTo.setAttribute('data-empty', checkDateInputFieldEmpty(dateToInputField));
                try {
                    const date = getDateInputFieldValue(dateToInputField);
                    calendar.second.setDate(date);
                } catch (e) {}
            }));

            cover.addEventListener('click', () => {
                try {
                    dateFromTextElem.textContent = formatDate(getDateInputFieldValue(dateFromInputField));
                } catch (e) {
                    wrapperFrom.setAttribute('data-empty', 'true');
                    dateFromTextElem.textContent = '';
                }

                try {
                    dateToTextElem.textContent = formatDate(getDateInputFieldValue(dateToInputField));
                } catch (e) {
                    wrapperTo.setAttribute('data-empty', 'true');
                    dateToTextElem.textContent = '';
                }

                container.classList.remove('calendar-expanded');
                calendar.close();

                performFiltering();
            });

            const [cross1, cross2] = container.querySelectorAll('.cross');
            cross1.addEventListener('click', () => {
                clearDateInputField(dateFromInputField);
                wrapperFrom.setAttribute('data-empty', 'true');
                dateFromTextElem.removeAttribute('data-date');
                calendar.first.clear();
                dateFromTextElem.textContent = '';
                if (!container.querySelector('.calendar')) {
                    performFiltering();
                }
            });
            cross2.addEventListener('click', () => {
                clearDateInputField(dateToInputField);
                wrapperTo.setAttribute('data-empty', 'true');
                dateToTextElem.removeAttribute('data-date');
                calendar.second.clear();
                dateToTextElem.textContent = '';
                if (!container.querySelector('.calendar')) {
                    performFiltering();
                }
            });
        }));
    });
}

function clearSelection(calendar) {
    calendar.querySelector('.selected')?.classList.remove('selected');
}

function initArticleCalendar(article) {
    const container = article.el.querySelector('.calendar-container');
    const btn = container.querySelector('.calendar-open-btn');
    btn.addEventListener('click', () => {
        if (article.el.querySelector('.calendar') !== null) {
            return;
        }
        container.setAttribute('data-state', 'focused');

        const dateTextElem = container.querySelector('.date-value');

        const dateInputField = container.querySelector('.date-input-field');
        const dateInputFieldDay = dateInputField.querySelector('.day');

        const errorHintText = container.querySelector('.hint__text');

        // clearDateInputField(dateInputField);
        setDateInputFieldValue(dateInputField, new Date(dateTextElem.getAttribute('data-date').trim()));
        dateInputFieldDay.focus();

        const calendar = showSingleCalendar(container, date => {
            setDateInputFieldValue(dateInputField, date);
            container.setAttribute('data-state', 'focused');
        }, (date, err) => {
            if (err) {
                try {
                    const date = getDateInputFieldValue(dateInputField);
                    dateTextElem.textContent = formatDate(date);
                    article.data._date.deactivation = date;
                    initArticleDates(article);
                    container.removeAttribute('data-state');
                    calendar.close();
                } catch (e) {
                    container.setAttribute('data-state', 'error');
                }
                return;
            }
            dateTextElem.textContent = formatDate(date);
            article.data._date.deactivation = date;
            initArticleDates(article);
            container.removeAttribute('data-state');
            calendar.close();
        });

        cover.addEventListener('click', () => {
            try {
                const date = getDateInputFieldValue(dateInputField);
                dateTextElem.textContent = formatDate(date);
                article.data._date.deactivation = date;
                initArticleDates(article);
                container.removeAttribute('data-state');
                calendar.close();
            } catch (e) {
                container.setAttribute('data-state', 'error');
            }
        });

        dateInputField.querySelectorAll('input').forEach(inp => inp.addEventListener('input', () => {
            container.setAttribute('data-state', 'focused');
            try {
                const date = getDateInputFieldValue(dateInputField);
                try {
                    calendar.setDate(date);
                } catch (e) {
                    calendar.clear();
                    dateInputFieldDay.focus();
                    clearDateInputField(dateInputField);
                    errorHintText.style.display = 'block';
                    setTimeout(() => {
                        errorHintText.style.display = 'none';
                    }, 2000);
                }
            } catch (e) {
            }
        }));
    });
}

function initArticleDates(article) {
    const deactivationValueElem = article.el.querySelector('.adv-item__state .calendar-container .date-value');
    deactivationValueElem.setAttribute('data-date', article.data._date.deactivation);
    deactivationValueElem.textContent = formatDate(new Date(article.data._date.deactivation));

    article.el.querySelector('.expires .value').textContent = getDayDifference(new Date(article.data._date.activation), new Date(article.data._date.deactivation));

    const updateDateBtn = article.el.querySelector('.adv-item__dates .update-time-btn');
    updateDateBtn.addEventListener('click', () => {
        const date = new Date();
        article.el.querySelector('.adv-item__dates .updated .date-value').textContent = formatDateDots(date);
        article.el.querySelector('.adv-item__dates .updated .time-value').textContent = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        updateDateBtn.classList.add('hidden');
    });
}

const listeners = [{
    selector: ['.adv-filter-date .cross'], event: 'click', checker: function (e) {
        return !find('.adv-filter-date .calendar');
    }
}];



function setupArticle(article) {
    initLinkPreventReload(article.el);
    initExpandingLists(article.el);
    initFadeEffects(article.el);
    initDateInputFields(article.el);
    initArticleCalendar(article);
    initCopyLinkModals(article);
    initDeleteCityBtns(article);
    initShowCitiesBtn(article);
    initArticleDates(article);
    initArticleStateBackground(article);
    initProlongCheckbox(article);

    article.el.querySelector('.checkbox').addEventListener('click', () => {
        if (article.checked) {
            setArticleCheckState(article, false);
        } else {
            setArticleCheckState(article, true);
        }
    });

    article.el.querySelector('.adv-item__services a').addEventListener('click', async () => {
        showModal(await renderElement('services', { services: article.data._services, state: article.data._state }));
    });

    article.el.querySelector('.adv-item__city-list .service-item').addEventListener('click', () => showChooseRegionPopup(() => {}));
}

initFilterCalendar(document.body);

