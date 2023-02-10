import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
require('flatpickr/dist/themes/light.css');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

const inputEl = document.querySelector('#datetime-picker');
const spanValue = document.querySelectorAll('.value');
const startBtn = document.querySelector('button[data-start]');
startBtn.disabled = true;
let selectedDate = null;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );
  return { days, hours, minutes, seconds };
}

function updateTime({ days, hours, minutes, seconds }) {
  spanValue[0].textContent = `${days}`;
  spanValue[1].textContent = `${hours}`;
  spanValue[2].textContent = `${minutes}`;
  spanValue[3].textContent = `${seconds}`;
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    startBtn.disabled = false;
    startBtn.style.background = '#5eacff';
    selectedDate = selectedDates[0];

    const defaultDate = options.defaultDate;

    if (defaultDate > selectedDate) {
      startBtn.disabled = true;
      startBtn.style.background = 'grey';

      Report.failure('Please choose a date in the future');
    } else {
      Notify.success('date is correct');
    }
  },
};
flatpickr(inputEl, options);

function startCountdown() {
  inputEl.disabled = true;
  startBtn.disabled = true;
  startBtn.style.background = 'grey';
  inputEl.style.background = 'grey';

  let intervalId = null;
  intervalId = setInterval(() => {
    const currentDate = new Date();
    const deltaDate = selectedDate - currentDate;

    if (deltaDate < 1000) {
      clearInterval(intervalId);
      Report.success('Sales start🚀');
      inputEl.disabled = false;
      inputEl.style.background = '#5eacff';
    }
    let time = convertMs(deltaDate);
    updateTime(time);
  }, 1000);
}

startBtn.addEventListener('click', () => {
  startCountdown();
});
