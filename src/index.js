import debounce from 'lodash.debounce';
import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

Notiflix.Notify.init({ position: 'center-top' });

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function handleInput() {
    resetMarkup();
    if (inputEl.value === "") {
        return;
    }
    const countryName = inputEl.value.trim();
    console.log(fetchCountries(countryName))
    fetchCountries(countryName)
      .then((countryData) => {
        if (countryData.length === 1) {
            renderCountryCard(countryData);
        } else if (countryData.length > 1 && countryData.length <= 10) {
            renderCountryList(countryData);
        } else {
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        }
      })
      .catch((error) => Notiflix.Notify.failure("Oops, there is no country with that name"));
}

inputEl.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function renderCountryCard(countryData) {
    const markup = countryData
    .map((country) => {
      return `
          <h2 class = "header">
            <img width="35px" src="${country.flags.svg}"></img>
            <p class = "header-text">${country.name.official}</p>
          </h2>
          <p class = "card__text"><b>Capital</b>: ${country.capital}</p>
          <p class = "card__text"><b>Population</b>: ${country.population}</p>
          <p class = "card__text"><b>Languages</b>: ${Object.values(country.languages).join(", ")}</p>
      `;
    })
    .join("");
  countryInfo.innerHTML = markup;
}

function renderCountryList(countryData) {
    const markup = countryData
    .map((country) => {
      return `
          <li class = "country__item">
            <img width="35px" src="${country.flags.svg}"></img>
            <p>${country.name.official}</p>
          </li>
      `;
    })
    .join("");
  countryList.innerHTML = markup;
}

function resetMarkup() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}