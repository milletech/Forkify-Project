import {API_URL,RES_PER_PAGE,KEY} from "./config";
import { getJSON ,sendJSON} from "./helpers";



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

const createRecipeObject=function(data){
    // const recipe=data.data.recipe;
    return{
        id:data.id,
        title:data.title,
        publisher:data.publisher,
        ingredients:data.ingredients,
        image:data.image_url,
        sourceUrl:data.source_url,
        servings:data.servings,
        cookingTime:data.cooking_time,
        ...(data.key && {key:data.key})
    };
};

export const loadRecipe= async function(id){

    try{
        const data=await getJSON(`${API_URL}${id}?key=${KEY}`)
        const recipe=data.data.recipe;
        // console.log(recipe)
        state.recipe=createRecipeObject(recipe)
        // state.recipe={
        //     id:recipe.id,
        //     title:recipe.title,
        //     publisher:recipe.publisher,
        //     ingredients:recipe.ingredients,
        //     image:recipe.image_url,
        //     sourceUrl:recipe.source_url,
        //     servings:recipe.servings,
        //     cookingTime:recipe.cooking_time
        // };

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
        const data=await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
        state.search.query=query;
        state.search.results=data.data.recipes.map(rec=>{
            return{
                id:rec.id,
                title:rec.title,
                publisher:rec.publisher,
                image:rec.image_url,
                ...(rec.key && {key:rec.key})
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

const persistBookmarks=function(){
    localStorage.setItem("bookmarks",JSON.stringify(state.bookmarks));
}


export const addBookMark=function(recipe){
    // Add BookMark
    state.bookmarks.push(recipe)

    // Mark Current BookMark As BookMarked
    if(recipe.id === state.recipe.id) state.recipe.bookMarked=true;

    // Store the recipe into local store

    persistBookmarks()
}

export const deleteBookMark=function(id){
    // Find the index of the recipe in the bookmarked array
    const index=state.bookmarks.findIndex(el=>el.id === id);
    state.bookmarks.splice(index,1);

    // Mark the current recipe as not bookmarked
    if(id ===state.recipe.id) state.recipe.bookMarked=false;

    // Remove the recipe from local storage

    persistBookmarks()
}

export const uploadRecipe=async function(newRecipe){

    try{
        const ingredients=Object.entries(newRecipe).filter(entry=>entry[0].startsWith("ingredient") && entry[1] !== '')
        .map(ing=>{
    
            const ingArr=ing[1].split(",").map(el=>el.trim());
            // const ingArr=ing[1].replaceAll(' ','').split(",");
    
            if(ingArr.length !== 3) throw new Error("Wrong Ingredient Format")
            const [quantity, unit,description]=ingArr;
    
            return {quantity:quantity?+quantity:null, unit, description}
        });
        
        const recipe={
            title:newRecipe.title,
            publisher:newRecipe.publisher,
            image_url:newRecipe.image,
            source_url:newRecipe.sourceUrl,
            servings:+newRecipe.servings,
            cooking_time:+newRecipe.cookingTime,
            ingredients,
        };
        const data=await sendJSON(`${API_URL}?key=${KEY}`, recipe);
        state.recipe=createRecipeObject(data.data.recipe)

        addBookMark(state.recipe)
        console.log(data)
        
    }catch(err){
        throw err
    }
}

const init=function(){
    const storage=localStorage.getItem("bookmarks");

    if(storage) state.bookmarks=JSON.parse(storage);
};

init();

