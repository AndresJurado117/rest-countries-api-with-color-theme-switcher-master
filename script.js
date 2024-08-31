document.addEventListener('DOMContentLoaded', () => {
    const countriesDiv = document.getElementById('countries');

    function countries(region='') {
        countriesDiv.innerHTML = '';
        if (region == '') {
            fetch('./data.json')
            .then((response) => response.json())
            .then((data) => data.forEach(country => {
                var container = document.createElement('div');
                container.textContent = country.name;
                var countryImage = document.createElement('img');
                countryImage.src = country.flags.png;
                container.appendChild(countryImage);
                var countryPopulation = document.createElement('p');
                countryPopulation.innerText = `Population: ${country.population}`;
                container.appendChild(countryPopulation);
                var countryRegion = document.createElement('p');
                countryRegion.innerText = `Region: ${country.region}`;
                container.appendChild(countryRegion);
                var countryCapital = document.createElement('p');
                countryCapital.innerText = `Capital: ${country.capital}`;
                container.appendChild(countryCapital);
                countriesDiv.append(container);
            }));
        }
        else {
            fetch('./data.json')
            .then((response) => response.json())
            .then((data) => data.forEach(country => {
                if(country.region == region) {
                    console.log(country.name);
                    var container = document.createElement('div');
                    container.textContent = country.name;
                    var countryImage = document.createElement('img');
                    countryImage.src = country.flags.png;
                    container.appendChild(countryImage);
                    var countryPopulation = document.createElement('p');
                    countryPopulation.innerText = `Population: ${country.population}`;
                    container.appendChild(countryPopulation);
                    var countryRegion = document.createElement('p');
                    countryRegion.innerText = `Region: ${country.region}`;
                    container.appendChild(countryRegion);
                    var countryCapital = document.createElement('p');
                    countryCapital.innerText = `Capital: ${country.capital}`;
                    container.appendChild(countryCapital);
                    countriesDiv.append(container);
                }
            }));
        }
    }

    countries();

    const regionSelected = document.getElementById('region');

    regionSelected.onchange = function() {
        countries(this.value);
    }
})