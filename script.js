document.addEventListener('DOMContentLoaded', () => {
    calculateSettingAsThemeString;
    const countriesDiv = document.getElementById('countries');
    const countrySearch = document.getElementById('country_search');
    const regionSelected = document.getElementById('region');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const backButton = document.getElementById('btn-back');

    function countries(country) {
        var container = document.createElement('div');
        container.classList.add('container');
        container.setAttribute('country', country.name)
        var countryImageContainer = document.createElement('div');
        var countryImage = document.createElement('img');
        countryImage.src = country.flag;
        countryImageContainer.appendChild(countryImage);
        countryImageContainer.classList.add('image-container');
        container.appendChild(countryImageContainer);
        var countryDescription = document.createElement('div');
        countryDescription.classList.add('country-description');
        var countryName = document.createElement('h2');
        countryName.innerText = country.name;
        countryDescription.appendChild(countryName);
        var countryPopulation = document.createElement('p');
        countryPopulation.innerText = `Population: `;
        var countryPopulationValue = document.createElement('span');
        countryPopulationValue.innerHTML = country.population.toLocaleString();
        countryPopulation.append(countryPopulationValue);
        countryDescription.appendChild(countryPopulation);
        var countryRegion = document.createElement('p');
        countryRegion.innerText = `Region: `;
        var countryRegionValue = document.createElement('span');
        countryRegionValue.innerHTML = country.region;
        countryRegion.append(countryRegionValue);
        countryDescription.appendChild(countryRegion);
        var countryCapital = document.createElement('p');
        countryCapital.innerText = `Capital: `;
        var countryCapitalValue = document.createElement('span');
        countryCapitalValue.innerHTML = country.capital;
        countryCapital.append(countryCapitalValue);
        countryDescription.appendChild(countryCapital);
        container.append(countryDescription);
        container.addEventListener('click', () => {
            countryDetails(country.name);
        })
        countriesDiv.append(container);
    }

    function filterRegion(region='') {
        countriesDiv.innerHTML = '';
        if (region == '') {
            fetch('./data.json')
            .then((response) => response.json())
            .then((data) => data.forEach(country => {
                countries(country);
            }));
        }
        else {
            fetch('./data.json')
            .then((response) => response.json())
            .then((data) => data.forEach(country => {
                if(country.region == region) {
                    countries(country);
                }
            }));
        }
    }

    filterRegion();

    regionSelected.onchange = function() {
        filterRegion(this.value);
    }

    countrySearch.addEventListener('input', () => {
        countriesDiv.innerHTML = '';
        fetch('./data.json')
        .then((response) => response.json())
        .then((data) => data.forEach(country => {
            if(country.name.toLowerCase().includes(countrySearch.value.toLowerCase())) {
                console.log(country);
                countries(country);
            }
        }));
    });

    backButton.addEventListener('click', () => {
        document.getElementById("country-list").style.display = "flex";
        document.getElementById("country-single").style.display = "none";
    })

    function countryDetails(countryName) {
        fetch('./data.json')
        .then((response) => response.json()).
        then((data) => {
            var countryData = data.find(country => country.name === countryName);
            if (countryData) {
                document.getElementById("country-flag").src = countryData.flag;
                document.getElementById("country-name").innerText = countryData.name;
                document.getElementById("country-native-name").innerText = countryData.nativeName;
                document.getElementById("country-population").innerText = countryData.population.toLocaleString();
                document.getElementById("country-region").innerText = countryData.region;
                document.getElementById("country-sub-region").innerText = countryData.subregion;
                document.getElementById("country-capital").innerText = countryData.capital;
                document.getElementById("country-top-level-domain").innerText = countryData.topLevelDomain;
                document.getElementById("country-currencies").innerText = countryData.currencies;
                document.getElementById("country-languages").innerText = countryData.languages;
                document.getElementById("country-borders").innerText = countryData.borders;
                document.getElementById("country-list").style.display = "none";
                document.getElementById("country-single").style.display = "grid";
            }
            else {
                console.log(`Country ${countryName} not found`);
            }
        })
        .catch( error => {
            console.error('The was a problem fetching the data, error code:', error)
        })
    }

    /* Theme toggle from: https://dev.to/whitep4nth3r/the-best-lightdark-mode-theme-toggle-in-javascript-368f */

    function calculateSettingAsThemeString({localStorageTheme, systemSettingDark}) {
        if (localStorageTheme !== null) {
          return localStorageTheme;
        }
      
        if (systemSettingDark.matches) {
          return "dark";
        }
      
        return "light";
      }
      
      const localStorageTheme = localStorage.getItem("theme");
      const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
      
      let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

      const button = document.querySelector("[data-theme-toggle]");

      button.addEventListener("click", () => {
        const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
      
        // update the button text
        const newCta = newTheme === "dark" ? "Dark mode" : "Light mode";
        button.innerText = newCta;  
      
        // use an aria-label if you are omitting text on the button
        // and using sun/moon icons, for example
        button.setAttribute("aria-label", newCta);
      
        // update theme attribute on HTML to switch theme in CSS
        document.querySelector("html").setAttribute("data-theme", newTheme);
      
        // update in local storage
        localStorage.setItem("theme", newTheme);
      
        // update the currentThemeSetting in memory
        currentThemeSetting = newTheme;
      });
      
})