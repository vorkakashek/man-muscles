'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

console.log('[ Script is running ༼ つ ◕_◕ ༽つ ]');
var answers = [];
var questions = document.querySelectorAll('.quiz-question');
var current_q = questions.length;
var images = document.querySelectorAll('.quiz-aside-img'); // let likers = document.querySelectorAll('.quiz-liker')
// Обрабатываем текущий вопрос

var currentQHandler = function currentQHandler() {
  document.querySelector('#current-q').innerHTML = current_q + '/' + questions.length;

  _toConsumableArray(questions).map(function (e) {
    return e.classList.remove('current');
  });

  _toConsumableArray(images).map(function (e) {
    return e.classList.remove('current');
  });

  questions[current_q - 1].classList.add('current');
  images[current_q - 1].classList.add('current'); // показываем кнопку назад?

  prevBtnHandler(); // Показываем кнопку далее?

  nextBtnHandler(); // Инициируем liker 

  if (questions[current_q - 1].querySelector('.quiz-liker')) {
    initLiker(questions[current_q - 1].querySelector('.quiz-liker'));
  } // Шкала прогресса


  document.querySelector('#quiz-progress .quiz-progress-value').style.width = 100 / questions.length * current_q + '%';
};

var nextBtnHandler = function nextBtnHandler() {
  var filled = document.querySelectorAll('.quiz-question')[current_q - 1].querySelectorAll('.filled'); // На последнем шаге меняем текст кнопки

  if (current_q === questions.length) {
    document.querySelector('#next-q').innerHTML = "Отправить";
  } else {
    document.querySelector('#next-q').innerHTML = "Далее";
  } // Валидатор для каждого шага: не / показывать кнопку


  if (validator()) {
    document.querySelector('#next-q').style.display = 'block';
  } else {
    document.querySelector('#next-q').style.display = 'none';
  }
};

var validator = function validator() {
  // radio && checkbox
  var qq = document.querySelectorAll('.quiz-question')[current_q - 1]; // текущий вопрос

  var radios = qq.querySelectorAll('input[type="radio"]'); // все радио в вопросе

  var checkboxes = qq.querySelectorAll('input[type="checkbox"]'); // все чекбоксы в вопросе

  var inputs_number = qq.querySelectorAll('input[type="number"]'); // все инпуты number в вопросе

  if (radios.length > 0 || checkboxes.length > 0) {
    if (qq.querySelector('input:checked')) {
      return true;
    }
  } // input number


  if (inputs_number.length > 0) {
    var filled = 0;
    inputs_number.forEach(function (el) {
      if (el.value.length > 0) {
        filled++;
      }
    });

    if (filled === inputs_number.length) {
      return true;
    }
  }

  return false;
};

var prevBtnHandler = function prevBtnHandler() {
  if (current_q > 1) {
    document.querySelector('#prev-q').style.display = "flex";
  } else {
    document.querySelector('#prev-q').style.display = "none";
  }
};

var nextQ = function nextQ() {
  if (current_q < questions.length) {
    current_q++;
    currentQHandler();
  }
};

var prevQ = function prevQ() {
  if (current_q > 1) {
    current_q--;
    currentQHandler();
  }
};

var initLiker = function initLiker(liker) {
  console.log('В этом вопросе есть Лайкер: ');
  console.log(liker); // Инициализируем итемы лайкера

  var items = liker.querySelectorAll('.quiz-liker-item');

  if (items.length > 0) {
    initLikerItems(items);
  }

  var current = 0;
  items[current].classList.add('current'); // let nextItem = (current) => {
  //     current++
  // }
  // Клик на ДА

  liker.querySelector('.yes').addEventListener('click', function (e) {
    var target = e.target;
    console.log('ДА!');
  }); // Клик на НЕЙТРАЛЬНО

  liker.querySelector('.neutral').addEventListener('click', function (e) {
    var target = e.target;
    console.log('НЕЙТРАЛЬНО');
  }); // Клик на НЕТ

  liker.querySelector('.no').addEventListener('click', function (e) {
    var target = e.target;
    console.log('НЕТ!');
  });
};

var initLikerItems = function initLikerItems(items) {
  console.log(items);

  for (var i = 0; i < items.length; i++) {
    items[i].style.transform = 'translateX(' + i * 30 + '%)';
    items[i].style.zIndex = items.length - i;
  }
};

document.addEventListener('click', function (e) {
  var target = e.target;

  if (target.matches('#prev-q')) {
    prevQ();
  }

  if (target.matches('#next-q')) {
    nextQ();
  }
}); // Отслеживаем радио 

if (document.querySelector('input[type="radio"]')) {
  document.querySelectorAll('input[type="radio"]').forEach(function (elem) {
    elem.addEventListener("change", function (e) {
      var target = e.target;
      var parent = target.closest('.quiz-answer-frame');

      _toConsumableArray(parent.querySelectorAll('.input-radio')).map(function (e) {
        return e.classList.remove('selected');
      });

      target.closest('.input-radio').classList.add('selected');

      if (target.hasAttribute('autonext')) {
        nextQ();
      }

      nextBtnHandler();
    });
  });
} // Отслеживаем чекбоксы


if (document.querySelector('input[type="checkbox"]')) {
  document.querySelectorAll('input[type="checkbox"]').forEach(function (elem) {
    elem.addEventListener("change", function (e) {
      var target = e.target;
      var parent = target.closest('.quiz-answer-frame');
      target.closest('.input-checkbox').classList.toggle('selected');
      console.log('aaa');
      nextBtnHandler();
    });
  });
} // Отслеживаем числовые инпуты


if (document.querySelector('input[type="number"]')) {
  document.querySelectorAll('input[type="number"]').forEach(function (elem) {
    elem.addEventListener("input", function (e) {
      var target = e.target;
      var parent = target.closest('.quiz-answer-frame');

      if (target.value.length > 0) {
        target.closest('.input-text').classList.add('filled');
      } else {
        target.closest('.input-text').classList.remove('filled');
      }

      nextBtnHandler();
    });
  });
} // После загрузки стр вызываем функции


currentQHandler();
//# sourceMappingURL=app.js.map
