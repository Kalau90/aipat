class Cockpit{
    constructor(elm_id){
        this.elm = document.getElementById(elm_id)
        this.topEndpoint = "";
        this.leftEndpoint = "";
        this.rightEndpoint = "";
    }

    configure(params){
        const { left_endpoint, right_endpoint, top_endpoint, main_endpoint } = params;

        this.leftEndpoint = left_endpoint;
        this.topEndpoint = top_endpoint;
        this.rightEndpoint = right_endpoint;
        this.mainEndpoint = main_endpoint;
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

    selectButton(target, wrap_classname){
        console.log(wrap_classname)
        const wrap = document.getElementsByClassName(wrap_classname)[0]
        for(let button of wrap.children){
            button.classList.remove("sel")
        }
        //console.log(this); //.classList.add("sel")
        target.classList.add("sel")
    }

    makeButtons(items, wrap_classname){
        const wrap = document.createElement("div")
        wrap.classList.add(wrap_classname)
        for(let item of items){
            const button = document.createElement("button")
            button.innerText = item.title;
            button.dataset.wrapclassname = wrap_classname;
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