import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';

let valuePromise = {};
const DEBOUNCE_DELAY = 300;

const inputEl = document.getElementById('search-box');
const listCountries = document.querySelector('.country-list');
const countyEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onCreate, DEBOUNCE_DELAY));

function onCreate() {
  const value = inputEl.value.trim();
  valuePromise = fetchCountries(value);
  if (value.length === 1) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  valuePromise
    .then(countries => {
      if (countries.length === 1) {
        return countries.reduce(
          (markup, country) => createMarkupCountry(country) + markup,
          ''
        );
      }
      return countries.map(country => createMarkupListCountries(country));
    })
    .then(updateCountry)
    .catch(onError);
}

function updateCountry(markup) {
  valuePromise
    .then(countries => {
      if (countries.length > 1 && countries.length <= 10) {
        listCountries.innerHTML = markup;
        countyEl.innerHTML = '';
      } else {
        countyEl.innerHTML = markup;
        listCountries.innerHTML = '';
      }
    })
    .catch(onError);
}

function createMarkupListCountries({ flags, name }) {
  return `
  <li>
    <img src=${flags.svg} class="country-img" width="30"/>
    <h2 class="country-title">${name.common}</h2>
  </li>
  `;
}

function createMarkupCountry({ flags, capital, population, name, languages }) {
  return `
    <img src=${flags.svg} class="country-img" width="30"/>
    <h2 class="country-title">${name.common}</h2>
    <p><span>Capital: <span>${capital}</p>
    <p><span>Population: <span>${population}</p>
    <p><span>Languages: <span>${Object.values(languages)}</p>

  `;
}

function onError() {
  console.error('countries not found');
  updateCountry('<p>countries not found</p>');
}
