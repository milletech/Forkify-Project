import icons from "../../img/icons.svg";
import View from "./View.js";


class resultView extends View{
    _parentElement=document.querySelector(".results");
    _errorMesssage="No recipes found!"

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


export default new resultView();