
// Babel configaration, Transpilinf and polyfilling
// To make sure my app is supported by old browsers
import 'regenerator-runtime/runtime';
import "core-js/stable"

import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import * as model from "./model.js";



// Setting the timeout to make the request fail after a certan number of seconds
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


let markup=`<div class="main__display">
<div class="today">
    <div class="today__max">
        <svg class="today__max--icon">
            <use xlink:href="/src/images/sprite.svg#icon-Clear"></use>
        </svg>
        <div class="today__max--main">
            <p class="max-temp">${maxTemp}
                <svg class="max-temp__icon">
                    <use xlink:href="/src/images/sprite.svg#icon-degrees-celcius"></use>
                </svg>
            </p>
            <p class="min-temp">${minTemp}
                <svg class="min-temp__icon">
                    <use xlink:href="/src/images/sprite.svg#icon-degrees-celcius"></use>
                </svg>
            </p>
        </div>
    </div>
    <div class="today__more">
        <p>it is ${condition} today with:</p>

        <div class="extra">
            <div class="extra__text">
                <svg class="extra__icon">
                    <use xlink:href="/src/images/sprite.svg#icon-windmill"></use>
                </svg>

                <p class="extra__text--main">
                    <span>${windSpeed}</span>Km/h
                    <span>${windDirection}</span>
                </p>

            </div>


            <div class="extra__text">
                <svg class="extra__icon">
                    <use xlink:href="/src/images/sprite.svg#icon-rain-drops"></use>
                </svg>

                <p class="extra__text--main">
                    <span>${humidity}</span>%
                </p>

            </div>
        </div>
    </div>
    
</div>
<div class="info">
    <div class="info__name"></div>
    <div class="info__save"></div>
</div>

<div class="bottom">
    <div class="place">
        <p class="place__first"><span class="city">${city}</span>,<span class="province">${province}</span></p>
        <p class="place__second"><span class='country'>${country}</span></p>
    </div>

    <svg class="bottom__icon">
        <use xlink:href="/src/images/sprite.svg#icon-Bookmark-save"></use>
    </svg>
</div>

</div>

<div class="following">

<div class="day">
    <p class="day__date">Tomorrow</p>
    <div class="day__main">
        <svg class="day__main--icon">
            <use xlink:href="/src/images/sprite.svg#icon-Clear"></use>
        </svg>
        <p class="day__main--text">Clear</p>
    </div>
    
    <div class="maxmin">
        <p class="max-temp">24
            <svg class="max-temp__icon">
                <use xlink:href="/src/images/sprite.svg#icon-degrees-celcius"></use>
            </svg>
        </p>
        <p class="min-temp">14
            <svg class="min-temp__icon">
                <use xlink:href="/src/images/sprite.svg#icon-degrees-celcius"></use>
            </svg>
        </p>
    </div>
</div>

<div class="day">
    <p class="day__date">Tue 22 Jun</p>
    <div class="day__main">
        <svg class="day__main--icon">
            <use xlink:href="/src/images/sprite.svg#icon-Clear"></use>
        </svg>
        <p class="day__main--text">Cloudy</p>
    </div>
    
    <div class="maxmin">
        <p class="max-temp">24
            <svg class="max-temp__icon">
                <use xlink:href="/src/images/sprite.svg#icon-degrees-celcius"></use>
            </svg>
        </p>
        <p class="min-temp">14
            <svg class="min-temp__icon">
                <use xlink:href="/src/images/sprite.svg#icon-degrees-celcius"></use>
            </svg>
        </p>
    </div>
</div>
<div class="day">
    <p class="day__date">Wed 23 Jun</p>
    <div class="day__main">
        <svg class="day__main--icon">
            <use xlink:href="/src/images/sprite.svg#icon-Clear"></use>
        </svg>
        <p class="day__main--text">Showers</p>
    </div>
    <div class="maxmin">
        <p class="max-temp">24
            <svg class="max-temp__icon">
                <use xlink:href="/src/images/sprite.svg#icon-degrees-celcius"></use>
            </svg>
        </p>
        <p class="min-temp">14
            <svg class="min-temp__icon">
                <use xlink:href="/src/images/sprite.svg#icon-degrees-celcius"></use>
            </svg>
        </p>
    </div>
</div>
<div class="day">
    <p class="day__date">Thur 24 Jun</p>
    <div class="day__main">
        <svg class="day__main--icon">
            <use xlink:href="/src/images/sprite.svg#icon-Clear"></use>
        </svg>
        <p class="day__main--text">Clear</p>
    </div>
    
    <div class="maxmin">
        <p class="max-temp">24
            <svg class="max-temp__icon">
                <use xlink:href="/src/images/sprite.svg#icon-degrees-celcius"></use>
            </svg>
        </p>
        <p class="min-temp">14
            <svg class="min-temp__icon">
                <use xlink:href="/src/images/sprite.svg#icon-degrees-celcius"></use>
            </svg>
        </p>
    </div>
</div>

</div>`


const showRecipe=async ()=>{
  try {
   
    const id=window.location.hash.slice(1);
    // console.log(id)
    if(!id) return;

    recipeView.renderSpinner()
    // 1) Load Data
    await model.loadRecipe(id)

    // 2) RENDERING RECIPE
    recipeView.render(model.state.recipe)


  } catch (error) {
    recipeView.renderError();
  }
}



const controlSearchResults=async function(){
  try{
    // 1) Get Search Query
    const query=searchView.getQuery();
    if (!query) return;

    // 2) Load search  result
    await model.loadSearchResult(query);

    // 3) Render the result
    console.log(model.state.search);

    // // 4) Clear the input
    // searchView.clearInput()

  }catch(err){
    console.log(err);
  }
}

const init=function(){
  recipeView.addHandlerRender(showRecipe);
  searchView.addHandlerSearch(controlSearchResults)
}


init();




// window.addEventListener("hashchange",showRecipe)
// window.addEventListener("load",showRecipe)

// ["hashchange","load"].forEach(ev=>window.addEventListener(ev,showRecipe))

// class Person{
//   #greeting
//   constructor(name){
//     this.name=name
//   }
// }
