import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './js/fetchCountries';
import {
  createListMarkupCountries,
  createMarkupCountry,
} from './js/markup-country';

const refs = {
  inputEl: document.getElementById('search-box'),
  listCountries: document.querySelector('.country-list'),
  countyEl: document.querySelector('.country-info'),
};

let valuePromise = {};
const DEBOUNCE_DELAY = 300;

refs.inputEl.addEventListener('input', debounce(onCreate, DEBOUNCE_DELAY));

function onCreate() {
  const value = refs.inputEl.value.trim();
  valuePromise = fetchCountries(value);
  valuePromise
    .then(countries => {
      if (countries.length === 1) {
        return countries.map(country => createMarkupCountry(country));
      }
      if (countries.length <= 10) {
        return countries.reduce(
          (markup, country) => createListMarkupCountries(country) + markup,
          ''
        );
      }
      throw Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
    })
    .then(onMarkupCountry)
    .catch(onError);
  refs.inputEl.style.outlineColor = 'green';
}

function onMarkupCountry(markup) {
  valuePromise
    .then(countries => {
      if (countries.length === 1) {
        refs.countyEl.innerHTML = markup;
        refs.listCountries.innerHTML = '';
      }
      refs.listCountries.innerHTML = markup;
      refs.countyEl.innerHTML = '';
    })
    .catch(onError);
}

function onError() {
  console.error('countries not found');
  Notify.failure('Oops, there is no country with that name');
  onMarkupCountry('<p class="country-error">countries not found</p>');
  refs.inputEl.style.outlineColor = 'red';
}
