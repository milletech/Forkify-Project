

class searchView{
    _parentEle=document.querySelector(".search");
    _clearInput(){
        this._parentEle.querySelector(".search__field").value="";
    }

    getQuery(){
        let query= this._parentEle.querySelector(".search__field").value;
        this._clearInput();
        return query;
    }


    addHandlerSearch(handler){
        this._parentEle.addEventListener("submit",function(e){
            e.preventDefault();
            handler()
        })
    }

}

export default new searchView();
