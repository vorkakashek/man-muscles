'use strict'

console.log('[ Script is running ༼ つ ◕_◕ ༽つ ]')

let swiper_arr = [] // здесь храню все свайперы
let answers = []
let questions = document.querySelectorAll('.quiz-question')
let current_q = questions.length
let images = document.querySelectorAll('.quiz-aside-img')

// Обрабатываем текущий вопрос
let currentQHandler = () => {
    document.querySelector('#current-q').innerHTML = current_q + '/' + questions.length;

    [...questions].map(e => e.classList.remove('current'));
    [...images].map(e => e.classList.remove('current'))

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

let showNextBtn = () => {
    document.querySelector('#next-q').style.display = 'block'
}

let hideNextBtn = () => {
    document.querySelector('#next-q').style.display = 'none'
}

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

let prevBtnHandler = () => {
    if (current_q > 1) {
        document.querySelector('#prev-q').style.display = "flex"
    } else {
        document.querySelector('#prev-q').style.display = "none"
    }
}

let nextQ = () => {
    if (current_q < questions.length) {
        current_q++
        currentQHandler()
    }
}

let prevQ = () => {
    if (current_q > 1) {
        current_q--
        currentQHandler()
    }
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
            on: {
                init: function () {
                    console.log('swiper initialized');
                },
            },
        })

        swiper_arr.push(swiper)
    })
}

// Засчитываем голос в лайкере
let likerVote = (ind, liker, answer) => {
    let s = swiper_arr[ind]

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

    swiper_arr[liker_ind].on('slideChange', () => {
        if (s.realIndex === s.slides.length - s.slides.length) {
            liker.querySelector('.quiz-liker-vote-group').innerHTML = 'Ваши голоса учтены';
            showNextBtn()
            nextQ()
        }
    })

    if (s.realIndex !== s.slides.length - s.slides.length) {
        // Клик на ДА
        liker.querySelector('.yes').addEventListener('click', (e) => {
            likerVote(liker_ind, liker, 'Да')
        })

        // // Клик на НЕЙТРАЛЬНО
        liker.querySelector('.neutral').addEventListener('click', (e) => {
            likerVote(liker_ind, liker, 'Да')
        })

        // // Клик на НЕТ
        liker.querySelector('.no').addEventListener('click', (e) => {
            likerVote(liker_ind, liker, 'Да')
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
            console.log('aaa')
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
swiperInit()
currentQHandler()