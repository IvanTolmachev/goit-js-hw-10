import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const inputEl = document.getElementById('search-box');
const listCountries = document.querySelector('.country-list');
const countyEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onCreate, DEBOUNCE_DELAY));

// let valuePromise = fetchCountries(value).then(date => date);
// console.log(valuePromise);

function onCreate() {
  let value = inputEl.value.trim();
  if (value.length === 1) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  fetchCountries(value)
    .then(countries => {
      if (countries.length === 1) {
        return countries.reduce(
          (markup, country) => createMarkupCountry(country) + markup,
          ''
        );
      } else {
        return countries.reduce(
          (markup, country) => createMarkupListCountries(country) + markup,
          ''
        );
      }
    })
    .then(updateNewsList)

    .catch(onError);
  // .then(updateNewCountry);
}

function updateNewsList(markup) {
  // if (countries.length > 1 && countries.length <= 10) {
  listCountries.innerHTML = markup;
  // }
}

function updateNewCountry(markup) {
  countyEl.innerHTML = markup;
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

function onError(err) {
  console.error(err);
  updateNewsList('<p>countries not found</p>');
}
