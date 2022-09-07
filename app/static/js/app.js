'use strict'

console.log('[ Script is running ༼ つ ◕_◕ ༽つ ]')

let answers = [], // Это массив, сохраннеых ответов
    temp_answer = {
        name: '',
        value: []
    }, // Это переменная для временного хранения ответов (юзаю для лайкеров)
    questions = document.querySelectorAll('.quiz-question'), // Это node массив вопросов
    current_q = 1, // Текущий вопрос // questions.length 
    images = document.querySelectorAll('.quiz-aside-img'), // Это node массив картинок для вопросов 
    swiper_global = [] // храним глобальный доступ к свайперу

// Обрабатываем текущий вопрос
let currentQHandler = () => {
    document.querySelector('#current-q').innerHTML = current_q + '/' + questions.length;

    // Убираем со всех вопросов и картинок 
    [...questions].map(e => e.classList.remove('current'));
    [...images].map(e => e.classList.remove('current'))

    // Устанавливаем текущую картинку и вопрос
    questions[current_q - 1].classList.add('current')
    images[current_q - 1].classList.add('current')

    // Обработчик кнопки Далее - не / показываем ?
    nextBtnHandler()

    // показываем кнопку назад?
    prevBtnHandler()

    // На последнем шаге меняем кнопку на Отправить
    finishHandler()

    // Сбрасываем liker 
    if (questions[current_q - 1].querySelector('.quiz-liker')) {
        // initLiker(questions[current_q - 1].querySelector('.quiz-liker'))
        let current_liker = questions[current_q - 1].querySelector('.quiz-liker') // текущий лайкер
        clearLiker(current_liker)
    }

    // Шкала прогресса
    document.querySelector('#quiz-progress .quiz-progress-value').style.width = (100 / questions.length) * current_q + '%'


}

let finishHandler = () => {
    let btn = document.querySelector('#next-q')
    if (current_q === questions.length) {
        btn.innerHTML = "Отправить"
        setTimeout(() => {
            btn.setAttribute('type', 'submit')
        }, 10)
    } else {
        btn.innerHTML = "Далее"
        btn.setAttribute('type', 'button')
    }
}

// Показывать кнопку Далее ? Рендерим вместо нее кнопку Отправить ?
let nextBtnHandler = () => {
    if (validator()) {
        showNextBtn()
    } else {
        hideNextBtn()
    }
}

// Показать кнопку Далее
let showNextBtn = () => {
    document.querySelector('#next-q').style.display = 'block'
}

// Скрыть кнопку Далее
let hideNextBtn = () => {
    document.querySelector('#next-q').style.display = 'none'
}

// Валидатор форм
let validator = () => {
    // radio && checkbox
    let qq = document.querySelectorAll('.quiz-question')[current_q - 1] // текущий вопрос
    let radios = qq.querySelectorAll('input[type="radio"]') // все радио в вопросе
    let checkboxes = qq.querySelectorAll('input[type="checkbox"]') // все чекбоксы в вопросе
    let inputs_number = qq.querySelectorAll('input[type="number"]') // все инпуты number в вопросе
    let email = qq.querySelectorAll('input[type="email"]') // все инпуты email в вопросе


    if (radios.length > 0 || checkboxes.length > 0) {
        if (qq.querySelector('input:checked')) {
            return true
        }
    }

    // input number
    else if (inputs_number.length > 0) {
        let filled = 0
        inputs_number.forEach(el => {
            if (el.value.length > 0) {
                filled++
            }
        })
        if (filled === inputs_number.length) {
            return true
        }
    } else if (email.length > 0) {
        if (emailValidator(email[0].value)) {
            return true
        }
    }

    return false
}

// Показывать кнопку Назад ?
let prevBtnHandler = () => {
    if (current_q > 1) {
        document.querySelector('#prev-q').style.display = "flex"
    } else {
        document.querySelector('#prev-q').style.display = "none"
    }
}

// Следующий вопрос
let nextQ = () => {
    if (current_q < questions.length) {
        current_q++
        saveForm()
        currentQHandler()
    }
}

// Предыдущий вопрос
let prevQ = () => {
    if (current_q > 1) {
        current_q--
        currentQHandler()
    }
}

// Сохраняем ответ на предыдущий вопрос
let saveForm = () => {
    let q = questions[current_q - 2]
    let inputs = q.querySelectorAll('input')

    let answer = {
        name: "",
        value: []
    }

    // radio / checkbox
    if (q.querySelector('input[type="radio"]') || q.querySelector('input[type="checkbox"]')) {
        inputs.forEach(input => {
            if (input.checked) {
                answer.name = input.name
                answer.value.push(input.value)
            }
        })
    }
    // number / text / email
    else if (q.querySelector('input[type="number"]') || q.querySelector('input[type="text"]') || q.querySelector('input[type="email"]')) {
        inputs.forEach(input => {
            answer.name = input.name
            answer.value.push(input.value)
        })
    }
    // liker
    else if (q.querySelector('.quiz-liker')) {
        answer.name = temp_answer.name
        answer.value = temp_answer.value
    }

    // Проверяем существует ли объект с таким именем, если да - перезаписываем, нет - пушим
    if (answers.find(e => e.name === answer.name)) {
        let ind = answers.findIndex(e => e.name === answer.name)

        answers[ind] = answer
    } else {
        answers.push(answer) // записываем ответ в массив ответов
    }
    temp_answer = {
        name: '',
        value: []
    }
}



// Инициализация Свайпера
let initSwiper = (liker) => {
    let swiper = new Swiper(liker.querySelector('.swiper'), {
        effect: "cards",
        grabCursor: false,
        allowTouchMove: false,
        allowSlidePrev: true,
        autoHeight: true,
        loop: true,
        loopedSlides: 1,
        preventInteractionOnTransition: true,
    })

    swiper_global.push(swiper)
}

// Засчитываем голос в лайкере и свайпаем слайдер с картинками
let likerVote = (swiper, liker) => {
    swiper.slideNext(300) // следующий слайд

    if (swiper.realIndex === swiper.slides.length - swiper.slides.length) {
        [...liker.querySelectorAll('.swiper-slide')].map(e => e.classList.add('voted'))
    } else {
        liker.querySelectorAll('.swiper-slide')[swiper.previousIndex].classList.add('voted')
    }
}

let clearLiker = (liker) => {
    let liker_list = document.querySelectorAll('.quiz-liker')
    let liker_ind = Array.prototype.indexOf.call(liker_list, liker)
    let swiper = swiper_global[liker_ind]; // текущий свайпер


    // temp_answer.value.length = 0
    temp_answer.name = liker.getAttribute("data-name"); // data-name вида q-N;

    [...liker.querySelectorAll('.swiper-slide')].map(e => e.classList.remove('voted'))

    setTimeout(() => {
        swiper.slideTo(1)
    }, 100)

    liker.querySelector('.quiz-liker-vote-group').style.display = 'flex'
    liker.querySelector('.quiz-liker-voted-message').style.display = 'none'
}


// Инициализация ВСЕХ Лайкеров на странице
let initLiker = () => {

    let likers = document.querySelectorAll('.quiz-liker')

    likers.forEach((liker, index) => {
        let last_answer

        liker.querySelector('.quiz-liker-voted-message').style.display = 'none';
        liker.querySelector('.quiz-liker-vote-group').style.display = 'flex';


        // Инициализация свайпера
        initSwiper(liker)

        swiper_global[index].on('slideChangeTransitionEnd', () => {
            if (last_answer !== null) {
                temp_answer.value.push(last_answer)
                last_answer = null
            }

            if (swiper_global[index].activeIndex === swiper_global[index].slides.length - 1) {
                liker.querySelector('.quiz-liker-vote-group').style.display = 'none';
                liker.querySelector('.quiz-liker-voted-message').style.display = 'block';
                showNextBtn()
                nextQ()
            }
        })

        // Клик на ДА - не учитывается во время переключения слайда
        liker.querySelector('.yes').addEventListener('click', (e) => {
            if (!swiper_global[index].animating) {
                last_answer = 'Да'
                likerVote(swiper_global[index], liker)
            }
        })

        // Клик на НЕЙТРАЛЬНО - не учитывается во время переключения слайда
        liker.querySelector('.neutral').addEventListener('click', (e) => {
            if (!swiper_global[index].animating) {
                last_answer = 'Нейтрально'
                likerVote(swiper_global[index], liker)
            }
        })

        // Клик на НЕТ - не учитывается во время переключения слайда
        liker.querySelector('.no').addEventListener('click', (e) => {
            if (!swiper_global[index].animating) {
                last_answer = 'Нет'
                likerVote(swiper_global[index], liker)
            }
        })
    })
}

// Отслеживаю ивент клика
document.addEventListener('click', (e) => {
    const target = e.target

    if (target.matches('#prev-q')) {
        prevQ()
    }

    if (target.matches('#next-q')) {
        nextQ()
    }
})

// Отслеживаем радио 
if (document.querySelector('input[type="radio"]')) {
    document.querySelectorAll('input[type="radio"]').forEach((elem) => {
        elem.addEventListener("change", function (e) {
            let target = e.target;
            let parent = target.closest('.quiz-answer-frame');

            [...parent.querySelectorAll('.input-radio')].map(e => e.classList.remove('selected'))
            target.closest('.input-radio').classList.add('selected')

            if (target.hasAttribute('autonext')) {
                nextQ()
            }

            nextBtnHandler()
        });
    });
}

// Отслеживаем чекбоксы
if (document.querySelector('input[type="checkbox"]')) {
    document.querySelectorAll('input[type="checkbox"]').forEach((elem) => {
        elem.addEventListener("change", function (e) {
            let target = e.target;
            let parent = target.closest('.quiz-answer-frame');

            target.closest('.input-checkbox').classList.toggle('selected')
            nextBtnHandler()
        });
    });
}

// Отслеживаем числовые инпуты
if (document.querySelector('input[type="number"]')) {
    document.querySelectorAll('input[type="number"]').forEach((elem) => {
        elem.addEventListener("input", function (e) {
            let target = e.target;
            let parent = target.closest('.quiz-answer-frame');

            if (target.value.length > 0) {
                target.closest('.input-text').classList.add('filled')
            } else {
                target.closest('.input-text').classList.remove('filled')
            }

            nextBtnHandler()
        });
    });
}

let emailValidator = (email) => {
    let pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    if (!(pattern.test(String(email).toLowerCase()))) {
        return false
    } else {
        return true
    }
}

// Отслеживаем email инпуты
if (document.querySelector('input[type="email"]')) {
    document.querySelectorAll('input[type="email"]').forEach((elem) => {
        elem.addEventListener("input", function (e) {
            let target = e.target;
            let parent = target.closest('.quiz-answer-frame');

            if (emailValidator(target.value)) {
                target.closest('.input-text').classList.add('filled')
            } else {
                target.closest('.input-text').classList.remove('filled')
            }

            nextBtnHandler()
        });
    });
}

// После загрузки стр вызываем функции
window.onload = function () {
    initLiker()
    currentQHandler()
}