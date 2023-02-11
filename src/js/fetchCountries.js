const BASE_URL = 'https://restcountries.com/v3.1/name';

export default function fetchCountries(name) {
  return fetch(
    `${BASE_URL}/${name}?fields=name,flags,capital,population,languages`
  ).then(response => response.json());
  // .then(date => {
  //   const { flags, capital, population, name, languages } = date;
  //   console.log(date);
  //   console.log(name.official);
  //   console.log(flags.svg);
  //   console.log(capital[0]);
  //   console.log(population);
  //   console.log(Object.values(languages)[0]);
  // })
  // .catch(console.log(',kf,kf,kf'));
}
