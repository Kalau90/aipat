class Cockpit{
    constructor(elm_id){
        this.elm = document.getElementById(elm_id)
        this.topEndpoint = "";
        this.leftEndpoint = "";
        this.rightEndpoint = "";

        this.left_id = null;
        this.right_id = null;
        this.top_id = null;

        this.left_queryparam = null;
        this.right_queryparam = null;
        this.top_queryparam = null;
    }

    configure(params){
        const { left_endpoint, right_endpoint, top_endpoint, main_endpoint, left_queryparam, right_queryparam, top_queryparam } = params;

        this.leftEndpoint = left_endpoint;
        this.topEndpoint = top_endpoint;
        this.rightEndpoint = right_endpoint;
        this.mainEndpoint = main_endpoint;

        this.left_queryparam = left_queryparam;
        this.right_queryparam = right_queryparam;
        this.top_queryparam = top_queryparam;
    }

    async callAPI(endpoint){
        return await fetch(endpoint, {
            // any options could go here
        }).then((response) => {
            if(response.status!=200){
                throw "Some error"
            }
            return response.json();
        }).then((data) => {
            return data;
        })
    }

    openPopup(){
        alert("HEJ")
    }

    makeItems(items){
        const wrap = document.getElementById("items")
        wrap.innerHTML = "";
        let n = 0;
        for(let item of items){
            n++;
            if(n>6){
                break;
            }
            const box = document.createElement("div");
            box.innerHTML += "<div class='caseno'>"+item.name+"</div>";
            box.innerHTML += "<span class='heading'>"+item.title+"</span>";
            box.innerHTML += "<div class='manchet'>"+item.description+"</div>";
            box.innerHTML += "<button onClick='console.log(\"hej\");'>Læs mere</button>"
            box.classList.add("box")
            wrap.appendChild(box)
        }
    }

    async showItems(){
        //console.log(this.left_id, this.top_id, this.right_id)
        if(this.left_id && this.top_id && this.right_id){
            var query_params = "?";
            query_params += this.left_queryparam+"="+this.left_id+"&"
            query_params += this.top_queryparam+"="+this.top_id+"&"
            query_params += this.right_queryparam+"="+this.right_id

            const items = await this.callAPI("/filterItems/examples"+query_params)

            //console.log(items)
            this.makeItems(items);
        }else{
            //document.getElementById("main").innerHTML = "nej..."
            console.log("NEJ...")
        }
    }

    selectButton(target, wrap_classname){
        const wrap = document.getElementsByClassName(wrap_classname)[0]
        for(let button of wrap.children){
            button.classList.remove("sel")
        }
        //console.log(this); //.classList.add("sel")
        target.classList.add("sel")

        this[wrap_classname+"_id"] = target.dataset.recid;
        this.showItems();
    }

    makeButtons(items, wrap_classname){
        const wrap = document.createElement("div")
        wrap.classList.add(wrap_classname)
        for(let item of items){
            const button = document.createElement("button")
            button.innerText = item.title;
            button.dataset.wrapclassname = wrap_classname;
            button.dataset.recid = item.recid;
            button.addEventListener("click", (e) => {
                const wrap = e.target.dataset.wrapclassname;
                this.selectButton(e.target, wrap);
            })
            wrap.appendChild(button)
        }
        return wrap;
    }

    async render(){
        const top_items = await this.callAPI(this.topEndpoint)
        const top_wrap = this.makeButtons(top_items, "top")

        const right_items = await this.callAPI(this.rightEndpoint)
        const right_wrap = this.makeButtons(right_items, "right")

        const left_items = await this.callAPI(this.leftEndpoint)
        const left_wrap = this.makeButtons(left_items, "left")

        /* LOADING MAIN... */
        const main_wrap = document.createElement("div")
        main_wrap.classList.add("items")
        main_wrap.id = "items";

        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.innerHTML = "<h1>Dette er en popup</h1>"

        main_wrap.appendChild(popup)

        /* FIT INTO HEAD AND MAIN */
        const header = document.createElement("div")
        const body = document.createElement("div")
        body.classList.add("main")

        header.appendChild(top_wrap);
        body.appendChild(left_wrap);
        body.appendChild(main_wrap);
        body.appendChild(right_wrap);

        this.elm.appendChild(header)
        this.elm.appendChild(body)
    }
}