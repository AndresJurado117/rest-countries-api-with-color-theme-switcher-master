document.addEventListener('DOMContentLoaded', () => {
    const countriesDiv = document.getElementById('countries');
    const countrySearch = document.getElementById('country-search');
    const regionSelected = document.getElementById('region');
    const backButton = document.getElementById('btn-back');

    calculateSettingAsThemeString;

    function countries(country) {
        var container = document.createElement('div');
        container.classList.add('container');
        container.setAttribute('country', country.name)
        container.classList.add('drop-shadow');

        var countryImageContainer = document.createElement('div');

        var countryImage = document.createElement('img');
        countryImage.src = country.flag;
        countryImage.setAttribute('alt', `${country.name}'s flag`)

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
        countryPopulationValue.innerText = country.population.toLocaleString();
        countryPopulation.append(countryPopulationValue);
        countryDescription.appendChild(countryPopulation);

        var countryRegion = document.createElement('p');
        countryRegion.innerText = `Region: `;

        var countryRegionValue = document.createElement('span');
        countryRegionValue.innerText = country.region;
        countryRegion.append(countryRegionValue);
        countryDescription.appendChild(countryRegion);

        var countryCapital = document.createElement('p');
        countryCapital.innerText = `Capital: `;

        var countryCapitalValue = document.createElement('span');

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

    function filterRegion(region='') {
        countriesDiv.innerText = '';
        
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
        countriesDiv.innerText = '';
        fetch('./data.json')
        .then((response) => response.json())
        .then((data) => data.forEach(country => {
            if(country.name.toLowerCase().includes(countrySearch.value.toLowerCase())) {
                countries(country);
            }
        }));
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
            var countryData = data.find(country => country.name === countryName);

            if (countryData) {
                document.getElementById("country-flag").src = countryData.flag;
                document.getElementById("country-flag").setAttribute('alt', `${countryData.name}'s flag`);
                document.getElementById("country-name").innerText = countryData.name;
                document.getElementById("country-native-name").innerText = countryData.nativeName;
                document.getElementById("country-population").innerText = countryData.population.toLocaleString();
                document.getElementById("country-region").innerText = countryData.region;
                document.getElementById("country-sub-region").innerText = countryData.subregion;

                var countryCapital = document.getElementById("country-capital");

                if (countryData.capital) {
                    countryCapital.innerText = countryData.capital;
                }
                else {
                    countryCapital.innerText = "This country doesn't have a capital.";
                }

                document.getElementById("country-top-level-domain").innerText = countryData.topLevelDomain;
                
                var countryCurrencies = document.getElementById("country-currencies");
                
                if (countryData.currencies) {
                    countryCurrencies.innerText = "";
                    countryData.currencies.forEach(currency => {
                        countryCurrencies.innerText += currency.name;
                    })
                }
                else {
                    var noneText = document.createElement('span');
                    noneText.innerText = "This country doesn't have a curency, weird?";
                    countryCurrencies.append(noneText);
                }
                
                var countryLanguages = document.getElementById("country-languages");
                countryLanguages.innerText = "";

                countryData.languages.forEach(language => {
                    countryLanguages.innerText += `${language.name}, `;
                })
                countryLanguages.innerText = countryLanguages.innerText.slice(0, -2);
                
                var countryBorders = document.getElementById("country-borders");
                
                if (countryData.borders) {
                    countryBorders.innerText = '';
                    countryData.borders.forEach(border => {
                        var countryBorderButton = document.createElement('button');
                        countryBorderButton.classList.add('drop-shadow');
                        var borderData = data.find(country => country.alpha3Code === border);
                        countryBorderButton.innerText = borderData.name;
                        countryBorders.append(countryBorderButton);

                        countryBorderButton.addEventListener('click', () => {
                            countryDetails(borderData.name);
                        })
                    })
                }
                else {
                    countryBorders.innerHTML = '';
                    var noneP = document.createElement('p');
                    var noneSpan = document.createElement('span');
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