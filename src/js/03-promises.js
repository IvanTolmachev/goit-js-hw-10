import { Notify } from 'notiflix/build/notiflix-notify-aio';
const inputDelay = document.querySelector('input[name="delay"]');
const inputStep = document.querySelector('input[name="step"]');
const inputAmount = document.querySelector('input[name="amount"]');
const btnCreate = document.querySelector('button');

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      }
      reject({ position, delay });
    }, delay);
  });
}

const onResolve = ({ position, delay }) => {
  Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
};

const onRejected = ({ position, delay }) => {
  Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
};

function makePromise(e) {
  e.preventDefault();
  let delay = Number(inputDelay.value);
  let step = Number(inputStep.value);
  let amount = Number(inputAmount.value);

  if (!amount) {
    amount = 1;
  }
  for (let i = 0; i < amount; i++) {
    createPromise(i + 1, delay + step * i)
      .then(onResolve)
      .catch(onRejected);
  }
}
btnCreate.addEventListener('click', makePromise);
