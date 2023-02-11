export { createListMarkupCountries, createMarkupCountry };

function createListMarkupCountries({ flags, name }) {
  return `
  <li class="countries-item">
    <img src=${flags.svg} class="countries-img" width="30"/>
    <h2 class="countries-title">${name.common}</h2>
  </li>`;
}

function createMarkupCountry({ flags, capital, population, name, languages }) {
  return `
    <div class="country-box">
    <img src=${flags.svg} class="countries-img" width="30"/>
    <h2 class="country-title">${name.common}</h2>
    </div>
    <p class="description"><span class="country-description">Capital: </span>${capital}</p>
    <p class="description"><span class="country-description">Population: </span>${population}</p>
    <p class="description"><span class="country-description">Languages: </span>${Object.values(
      languages
    )}</p>

  `;
}
