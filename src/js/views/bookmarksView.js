import icons from "../../img/icons.svg";
import View from "./View.js";


class BookmarksView extends View{
    _parentElement=document.querySelector(".bookmarks__list");
    _errorMesssage="No BookMarked Recipe Found"


    addHandlerRender(handler){
        window.addEventListener("load",handler)
    }

    _generateMarkUp(){
        return this._data.map(this._generateMarkUpPreview).join("")
    }

    _generateMarkUpPreview(result){
        return `
        <li class="preview">
            <a class="preview__link" href="#${result.id}">
                <figure class="preview__fig">
                    <img src="${result.image}" alt="${result.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${result.title}</h4>
                    <p class="preview__publisher">${result.publisher}</p>
                    <div class="recipe__user-generated ${result.key ?'':'hidden'}">
                    <svg>
                        <use href="${icons}#icon-user"></use>
                    </svg>
                </div>
                </div>
            </a>
        </li>
        `
    }
}


export default new BookmarksView();