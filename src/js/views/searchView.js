

class searchView{
    #parentEle=document.querySelector(".search");
    #clearInput(){
        this.#parentEle.querySelector(".search__field").value="";
    }

    getQuery(){
        let query= this.#parentEle.querySelector(".search__field").value;
        this.#clearInput();
        return query;
    }


    addHandlerSearch(handler){
        this.#parentEle.addEventListener("submit",function(e){
            e.preventDefault();
            handler()
        })
    }

}

export default new searchView();
