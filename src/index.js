import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './js/fetchCountries';
import {
  createListMarkupCountries,
  createMarkupCountry,
} from './js/markup-country';

let valuePromise = {};
const DEBOUNCE_DELAY = 300;

const inputEl = document.getElementById('search-box');
const listCountries = document.querySelector('.country-list');
const countyEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onCreate, DEBOUNCE_DELAY));

function onCreate() {
  const value = inputEl.value.trim();
  valuePromise = fetchCountries(value);
  if (value.length <= 1) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  valuePromise
    .then(countries => {
      if (countries.length === 1) {
        return countries.map(country => createMarkupCountry(country));
      }
      return countries.reduce(
        (markup, country) => createListMarkupCountries(country) + markup,
        ''
      );
    })
    .then(markupCountry)
    .catch(onError);
  inputEl.style.outlineColor = 'green';
}

function markupCountry(markup) {
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

function onError() {
  console.error('countries not found');
  Notify.failure('Oops, there is no country with that name');
  markupCountry('<p class="country-error">countries not found</p>');
  inputEl.style.outlineColor = 'red';
}
