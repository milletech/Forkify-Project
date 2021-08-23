import {API_URL,RES_PER_PAGE} from "./config";
import { getJSON } from "./helpers";



export const state={
    recipe:{},
    search:{
        query:"",
        results:[],
        page:1,
        resultsPerPage:RES_PER_PAGE
    },
    bookmarks:[]
};

export const loadRecipe= async function(id){

    try{
        const data=await getJSON(`${API_URL}${id}`)
        const recipe=data.data.recipe;
        console.log(recipe)
        state.recipe={
            id:recipe.id,
            title:recipe.title,
            publisher:recipe.publisher,
            ingredients:recipe.ingredients,
            image:recipe.image_url,
            sourceUrl:recipe.source_url,
            servings:recipe.servings,
            cookingTime:recipe.cooking_time
        };

        if(state.bookmarks.some(bookmark=>bookmark.id===id)){
            state.recipe.bookMarked=true;
        }else{
            state.recipe.bookMarked=false;
        }
    }catch(err){
        // recipeView.renderError();
        console.log(err)
        throw err;
    }


}

export const loadSearchResult=async function(query){
    try{
        const data=await getJSON(`${API_URL}?search=${query}`);
        state.search.query=query;
        state.search.results=data.data.recipes.map(rec=>{
            return{
                id:rec.id,
                title:rec.title,
                publisher:rec.publisher,
                image:rec.image_url
            }
        })
        state.search.page=1;

    }catch(err){
        console.error(err);
        throw err;
    }
}


export const getSearchResultPage=function(page=state.search.page){

    state.search.page=page;

    const start=(page-1)*state.search.resultsPerPage;
    const end=page*state.search.resultsPerPage

    return state.search.results.slice(start,end)
}

export const updateServings=function(newServings){
    state.recipe.ingredients.forEach(ing => {
        ing.quantity=(ing.quantity*newServings)/state.recipe.servings
    });

    state.recipe.servings=newServings;
}


export const addBookMark=function(recipe){
    // Add BookMark

    state.bookmarks.push(recipe)


    // Mark Current BookMark As BookMarked

    if(recipe.id === state.recipe.id) state.recipe.bookMarked=true;
}

export const deleteBookMark=function(id){
    // Find the index of the recipe in the bookmarked array

    const index=state.bookmarks.findIndex(el=>el.id === id);
    state.bookmarks.splice(index,1);

    // Mark the current recipe as not bookmarked

    if(id ===state.recipe.id) state.recipe.bookMarked=false;
}
