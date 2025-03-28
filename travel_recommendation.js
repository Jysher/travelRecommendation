const searchForm = document.querySelector('.search-form');
const clearBtn = document.querySelector('.clearBtn');
const recContainer = document.querySelector('.container-recommendations');
const resultsToDisplay = 2;

const getQuery = function () {
  const searchInput = searchForm.querySelector('#search');
  const query = searchInput.value.trim().toLowerCase();

  searchInput.value = '';
  return query;
};

const findRecommendation = async function () {
  try {
    const query = getQuery();
    if (!query) return;
    const response = await fetch('travel_recommendation_api.json');
    const data = await response.json();
    const recommendations = [];
    data.countries.forEach(country => {
      country.cities.forEach(city => {
        if (
          city.name.toLowerCase().includes(query) ||
          city.description.toLowerCase().includes(query)
        ) {
          recommendations.push(city);
        }
      });
    });

    data.beaches.forEach(beach => {
      if (
        beach.name.toLowerCase().includes(query) ||
        beach.description.toLowerCase().includes(query)
      ) {
        recommendations.push(beach);
      }
    });

    data.temples.forEach(temple => {
      if (
        temple.name.toLowerCase().includes(query) ||
        temple.description.toLowerCase().includes(query)
      ) {
        recommendations.push(temple);
      }
    });
    recommendations.splice(2);
    return recommendations;
  } catch (error) {
    alert(error);
  }
};

const clearRecommendations = function () {
  recContainer.innerHTML = '';
};

const displayRecommendation = function (recommendations) {
  if (recommendations.length === 0) {
    alert('No recommendations to display.');
    return;
  }
  clearRecommendations();

  for (let i = 0; i < recommendations.length; i++) {
    const html = `
			<div class="recommendation">
				<img class="rec-img" src="./images/${recommendations[i].imageUrl}" />
				<div class="rec-info">
					<h1>${recommendations[i].name}</h1>
				<p>
					${recommendations[i].description}
				</p>
					<button>Visit</button>
				</div>
			</div>
		`;
    recContainer.insertAdjacentHTML('afterbegin', html);
  }
};

const recommendPlace = async function () {
  try {
    const recommendations = await findRecommendation();
    displayRecommendation(recommendations);
  } catch (error) {
    alert(error);
  }
};

searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  recommendPlace();
});

clearBtn.addEventListener('click', clearRecommendations);
