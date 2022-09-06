'use strict'

console.log('[ Script is running ༼ つ ◕_◕ ༽つ ]')

let swiper_arr = [], // здесь храню все свайперы, чтобы потом к ним можно было обратиться
    answers = [], // Это массив, сохраннеых ответов
    temp_answer, // Это массив для временного хранения ответов на лайкер
    questions = document.querySelectorAll('.quiz-question'), // Это node массив вопросов
    current_q = questions.length, // Текущий вопрос // questions.length 
    images = document.querySelectorAll('.quiz-aside-img') // Это node массив картинок для вопросов 

// Обрабатываем текущий вопрос
let currentQHandler = () => {
    document.querySelector('#current-q').innerHTML = current_q + '/' + questions.length;

    // Убираем со всех вопросов и картинок 
    [...questions].map(e => e.classList.remove('current'));
    [...images].map(e => e.classList.remove('current'))

    // Устанавливаем текущую картинку и вопрос
    questions[current_q - 1].classList.add('current')
    images[current_q - 1].classList.add('current')

    // показываем кнопку назад?
    prevBtnHandler()

    // Показываем кнопку далее?
    nextBtnHandler()

    // Инициируем liker 
    if (questions[current_q - 1].querySelector('.quiz-liker')) {
        initLiker(questions[current_q - 1].querySelector('.quiz-liker'))
    }

    // Шкала прогресса
    document.querySelector('#quiz-progress .quiz-progress-value').style.width = (100 / questions.length) * current_q + '%'
}

// Показывать кнопку Далее ? Рендерим вместо нее кнопку Отправить ?
let nextBtnHandler = () => {
    let filled = document.querySelectorAll('.quiz-question')[current_q - 1].querySelectorAll('.filled')

    // На последнем шаге меняем текст кнопки
    if (current_q === questions.length) {
        document.querySelector('#next-q').innerHTML = "Отправить"
    } else {
        document.querySelector('#next-q').innerHTML = "Далее"
    }

    // Валидатор для каждого шага: не / показывать кнопку
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

    if (radios.length > 0 || checkboxes.length > 0) {
        if (qq.querySelector('input:checked')) {
            return true
        }
    }

    // input number
    if (inputs_number.length > 0) {
        let filled = 0
        inputs_number.forEach(el => {
            if (el.value.length > 0) {
                filled++
            }
        })
        if (filled === inputs_number.length) {
            return true
        }
    }

    // liker
    if (qq.querySelector('.quiz-liker')) {
        let liker = questions[current_q - 1].querySelector('.quiz-liker')
        let liker_ind = Array.prototype.indexOf.call(document.querySelectorAll('.quiz-liker'), liker)
        let s = swiper_arr[liker_ind] // текущий свайпер

        if (s.realIndex === s.slides.length - s.slides.length) {
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
        currentQHandler()
        saveForm()
    }
}

// Предыдущий вопрос
let prevQ = () => {
    if (current_q > 1) {
        current_q--
        currentQHandler()
    }
}

// Сохраняем ответ на текущий вопрос
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
        // берем ответ из массива ответов на лайкеры
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

    console.log(answers)
}

// Swiper для Лайкеров
let swiperInit = () => {
    document.querySelectorAll('.quiz-liker').forEach((el, index) => {
        const swiper = new Swiper(el.querySelector('.swiper'), {
            effect: "cards",
            grabCursor: false,
            allowTouchMove: false,
            allowSlidePrev: false,
            autoHeight: true,
            loop: true,
            loopedSlides: 1,
            preventInteractionOnTransition: true,
            on: {
                init: function () {
                    console.log('swiper initialized');
                },
            },
        })

        swiper_arr.push(swiper) // сохраним данный свайпер в массив свайперов
    })
}

// Засчитываем голос в лайкере и свайпаем слайдер с картинками
let likerVote = (ind, liker) => {
    let s = swiper_arr[ind] // текущий свайпер

    s.slideNext(300) // следующий слайд

    if (s.realIndex === s.slides.length - s.slides.length) {
        [...liker.querySelectorAll('.swiper-slide')].map(e => e.classList.add('voted'))
    } else {
        liker.querySelectorAll('.swiper-slide')[s.previousIndex].classList.add('voted')
    }
}

let initLiker = (liker) => {
    // Инициализируем итемы лайкера
    // индекс лайкера === индексу свайпера
    let liker_ind = Array.prototype.indexOf.call(document.querySelectorAll('.quiz-liker'), liker)
    let s = swiper_arr[liker_ind] // текущий свайпер
    let answer = [] // храним здесь ответы на данный лайкер
    let q_name = liker.getAttribute("data-name") // data-name вида q-N

    s.on('slideChangeTransitionEnd', () => {
        // Если после смены слайда, показан слайд с индексом 0, считаем, что все ответы учтены
        if (s.realIndex === s.slides.length - s.slides.length) {
            temp_answer = {
                name: q_name,
                value: answer
            }

            liker.querySelector('.quiz-liker-vote-group').innerHTML = 'Ваши голоса учтены';
            showNextBtn()
            nextQ()
        }
    })

    if (s.realIndex !== s.slides.length - s.slides.length) {
        // Клик на ДА - не учитывается во время переключения слайда
        liker.querySelector('.yes').addEventListener('click', (e) => {
            if (!s.animating) {
                answer.push('Да')
                likerVote(liker_ind, liker)
            }
        })

        // Клик на НЕЙТРАЛЬНО - не учитывается во время переключения слайда
        liker.querySelector('.neutral').addEventListener('click', (e) => {
            if (!s.animating) {
                answer.push('Нейтрально')
                likerVote(liker_ind, liker)
            }
        })

        // Клик на НЕТ - не учитывается во время переключения слайда
        liker.querySelector('.no').addEventListener('click', (e) => {
            if (!s.animating) {
                answer.push('Нет')
                likerVote(liker_ind, liker)
            }
        })
    }
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
            // console.log('aaa')
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

// После загрузки стр вызываем функции
window.onload = function () {
    swiperInit()
    currentQHandler()
}