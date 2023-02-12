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

const DEBOUNCE_DELAY = 300;

refs.inputEl.addEventListener('input', debounce(onCreate, DEBOUNCE_DELAY));

function onCreate() {
  let value = refs.inputEl.value.trim();
  if (!value) {
    onClear();
    return;
  }
  fetchCountries(value)
    .then(countries => {
      if (countries.status === 404) {
        throw new Error(countries.status);
      }
      if (countries.length === 1) {
        let countryEl = countries.map(country => createMarkupCountry(country));
        return (refs.countyEl.innerHTML = countryEl);
      }
      if (countries.length <= 10) {
        let allCountries = countries.reduce(
          (markup, country) => createListMarkupCountries(country) + markup,
          ''
        );
        return (refs.listCountries.innerHTML = allCountries);
      }
      Notify.info('Too many matches found. Please enter a more specific name.');
      onClear();
    })
    .catch(onError);
  refs.inputEl.style.outlineColor = 'green';
}

function onClear() {
  refs.countyEl.innerHTML = '';
  refs.listCountries.innerHTML = '';
}

function onError() {
  console.error('countries not found');
  Notify.failure('Oops, there is no country with that name');
  onClear();
  refs.inputEl.style.outlineColor = 'red';
}
