
// Babel configaration, Transpilinf and polyfilling
// To make sure my app is supported by old browsers
import 'regenerator-runtime/runtime';
import "core-js/stable"

import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultView from './views/resultView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import paginationView from "./views/paginationView.js"
import * as model from "./model.js";


// if(module.hot){
//   module.hot.accept();
// }



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

      // // 0) Update the bookmarks view
      // bookmarksView.update(model.state.bookmarks)
    // controlServings()

  } catch (error) {
    recipeView.renderError();
  }
}



const controlSearchResults=async function(){
  try{

    resultView.renderSpinner();
    // 1) Get Search Query
    const query=searchView.getQuery();
    if (!query) return;

    // 2) Load search  result
    await model.loadSearchResult(query);

    // 3) Render the result
  
    // resultView.render(model.state.search.results)
    resultView.render(model.getSearchResultPage())
    // console.log(model.getSearchResultPage())

    // 4) Render the initial pagination
    paginationView.render(model.state.search)



  }catch(err){
    console.log(err);
  }
}

const controllPagination=function(goToPage){
  // 1) Render NEW Result
  resultView.render(model.getSearchResultPage(goToPage))
  // 2) Render the NEW pagination
  paginationView.render(model.state.search)
}

const controlServings=function(newServings){
  // Update the servings (in state)
  model.updateServings(newServings);

  // Update the recipe view

  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

const controlAddBookMark=function(){
  // Add/Remove Bookmark
  if(!model.state.recipe.bookMarked){
    model.addBookMark(model.state.recipe);
  }else{
    model.deleteBookMark(model.state.recipe.id);
  }
  
  // Update the recipe view
  recipeView.update(model.state.recipe)

  // Render the bookmark
  bookmarksView.render(model.state.bookmarks)

}

const controlBookmarks=function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe=async function(newRecipe){

  try{
    // Upload A New Recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe)

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Render bookmarks View

    bookmarksView.render(model.state.bookmarks)

    // Change the ID in the URL

    window.history.pushState(null, "",`#${model.state.recipe.id}`)

    // Close Form Window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    },2500)

  }catch(err){
    console.log(err.message);
    addRecipeView.renderError(err.message)
  }
  

}

const init=function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  recipeView.addHandlerRender(showRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookMark)
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controllPagination);

}


init();


