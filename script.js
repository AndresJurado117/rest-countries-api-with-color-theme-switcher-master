document.addEventListener('DOMContentLoaded', () => {
    const countriesDiv = document.getElementById('countries');
    let countrySearch = document.getElementById('country-search');
    const regionSelected = document.getElementById('region');
    const backButton = document.getElementById('btn-back');

    calculateSettingAsThemeString;
    loadCountries();

    function countries(country) {
        let container = document.createElement('div');
        container.classList.add('container');
        container.setAttribute('country', country.name)
        container.classList.add('drop-shadow');

        let countryImageContainer = document.createElement('div');

        let countryImage = document.createElement('img');
        countryImage.src = country.flag;
        countryImage.setAttribute('alt', `${country.name}'s flag`)

        countryImageContainer.appendChild(countryImage);
        countryImageContainer.classList.add('image-container');
        container.appendChild(countryImageContainer);

        let countryDescription = document.createElement('div');
        countryDescription.classList.add('country-description');

        let countryName = document.createElement('h2');
        countryName.innerText = country.name;
        countryDescription.appendChild(countryName);

        let countryPopulation = document.createElement('p');
        countryPopulation.innerText = `Population: `;

        let countryPopulationValue = document.createElement('span');
        countryPopulationValue.innerText = country.population.toLocaleString();
        countryPopulation.append(countryPopulationValue);
        countryDescription.appendChild(countryPopulation);

        let countryRegion = document.createElement('p');
        countryRegion.innerText = `Region: `;

        let countryRegionValue = document.createElement('span');
        countryRegionValue.innerText = country.region;
        countryRegion.append(countryRegionValue);
        countryDescription.appendChild(countryRegion);

        let countryCapital = document.createElement('p');
        countryCapital.innerText = `Capital: `;

        let countryCapitalValue = document.createElement('span');

        if (country.capital) {
            countryCapitalValue.innerText = country.capital;
        }
        else {
            countryCapitalValue.innerText = "None";
        }

        countryCapital.append(countryCapitalValue);

        countryDescription.appendChild(countryCapital);

        container.append(countryDescription);
        container.addEventListener('click', () => {
            countryDetails(country.name);
        })

        countriesDiv.append(container);
    }

    function loadCountries() {
        filterRegion();
    }

    function filterRegion() {
        countriesDiv.innerText = '';
        let region = regionSelected[regionSelected.selectedIndex].value;
        
        if (region == 'WW' && countrySearch.value.length == 0) {
            fetch('./data.json')
            .then((response) => response.json())
            .then((data) => data.forEach(country => {
                countries(country);
            }));
        }
        else if (region == 'WW' && countrySearch.value.length > 0) {
            fetch('./data.json')
            .then((response) => response.json())
            .then(data => {
                const filteredCountries = data.filter(country =>
                    country.name.toLowerCase().includes(countrySearch.value.toLowerCase())
                )
                filteredCountries.forEach(country => {
                    countries(country);
                })
            })
        }
        else {
            fetch('./data.json')
            .then((response) => response.json())
            .then(data => {
                const filteredCountries = data.filter(country =>
                    country.region == region && country.name.toLowerCase().includes(countrySearch.value.toLowerCase())
                )
                filteredCountries.forEach(country => {
                    countries(country);
                })
            });
        }
    }

    regionSelected.onchange = function() {
        filterRegion(this.value);
    }

    countrySearch.addEventListener('input', () => {
        countriesDiv.innerText = '';
        let region = regionSelected[regionSelected.selectedIndex].value;
        fetch('./data.json')
        .then((response) => response.json())
        .then(data => {
            if (region == "WW") {
                const filteredCountries = data.filter(country =>
                    country.name.toLowerCase().includes(countrySearch.value.toLowerCase())
                )
                filteredCountries.forEach(country => {
                    countries(country);
                })
            }
            else {
                const filteredCountries = data.filter(country =>
                    country.region == region && country.name.toLowerCase().includes(countrySearch.value.toLowerCase())
                )
                filteredCountries.forEach(country => {
                    countries(country);
                })
            }
        })
    });

    backButton.addEventListener('click', () => {
        document.getElementById("country-list").style.display = "flex";
        document.getElementById("search-filter-bar").style.display = "flex";
        document.getElementById("country-single").style.display = "none";
    })

    function countryDetails(countryName) {
        fetch('./data.json')
        .then((response) => response.json()).
        then((data) => {
            let countryData = data.find(country => country.name === countryName);

            if (countryData) {
                document.getElementById("country-flag").src = countryData.flag;
                document.getElementById("country-flag").setAttribute('alt', `${countryData.name}'s flag`);
                document.getElementById("country-name").innerText = countryData.name;
                document.getElementById("country-native-name").innerText = countryData.nativeName;
                document.getElementById("country-population").innerText = countryData.population.toLocaleString();
                document.getElementById("country-region").innerText = countryData.region;
                document.getElementById("country-sub-region").innerText = countryData.subregion;

                let countryCapital = document.getElementById("country-capital");

                if (countryData.capital) {
                    countryCapital.innerText = countryData.capital;
                }
                else {
                    countryCapital.innerText = "This country doesn't have a capital.";
                }

                document.getElementById("country-top-level-domain").innerText = countryData.topLevelDomain;
                
                let countryCurrencies = document.getElementById("country-currencies");
                
                if (countryData.currencies) {
                    countryCurrencies.innerText = "";
                    countryData.currencies.forEach(currency => {
                        countryCurrencies.innerText += currency.name;
                    })
                }
                else {
                    let noneText = document.createElement('span');
                    noneText.innerText = "This country doesn't have a curency, weird?";
                    countryCurrencies.append(noneText);
                }
                
                let countryLanguages = document.getElementById("country-languages");
                countryLanguages.innerText = "";

                countryData.languages.forEach(language => {
                    countryLanguages.innerText += `${language.name}, `;
                })
                countryLanguages.innerText = countryLanguages.innerText.slice(0, -2);
                
                let countryBorders = document.getElementById("country-borders");
                
                if (countryData.borders) {
                    countryBorders.innerText = '';
                    countryData.borders.forEach(border => {
                        let countryBorderButton = document.createElement('button');
                        countryBorderButton.classList.add('drop-shadow');
                        let borderData = data.find(country => country.alpha3Code === border);
                        countryBorderButton.innerText = borderData.name;
                        countryBorders.append(countryBorderButton);

                        countryBorderButton.addEventListener('click', () => {
                            countryDetails(borderData.name);
                        })
                    })
                }
                else {
                    countryBorders.innerHTML = '';
                    let noneP = document.createElement('p');
                    let noneSpan = document.createElement('span');
                    noneSpan.innerText = "This country doesn't have bordering countries.";
                    noneP.append(noneSpan)
                    countryBorders.append(noneP);
                }
                
                document.getElementById("country-list").style.display = "none";
                document.getElementById("search-filter-bar").style.display = "none";
                document.getElementById("country-single").style.display = "flex";
            }
            else {
                console.log(`Country ${countryName} not found`);
            }
            
            window.scrollTo({ top: 0 });
        })
        .catch( error => {
            console.error('The was a problem fetching the data.', error)
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

      // Load theme based on localStorage value
      document.querySelector("html").setAttribute("data-theme", currentThemeSetting);

      const button = document.querySelector("[data-theme-toggle]");

      button.querySelector('div').innerText = currentThemeSetting === "dark" ? "Dark Mode" : "Light Mode";

      button.addEventListener("click", () => {
        const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
      
        // update the button text
        const newCta = newTheme === "dark" ? "Dark Mode" : "Light Mode";
        button.querySelector('div').innerText = newCta;  
      
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