class Cockpit{
    constructor(elm_id){
        this.elm = document.getElementById(elm_id)
        this.topEndpoint = "";
        this.leftEndpoint = "";
        this.rightEndpoint = "";
        this.itemEndpoint = "";

        this.left_id = null;
        this.right_id = null;
        this.top_id = null;

        this.left_queryparam = null;
        this.right_queryparam = null;
        this.top_queryparam = null;

        this.top_items = null;
        this.left_items = null;
        this.right_items = null;
    }

    configure(params){
        const { left_endpoint, right_endpoint, top_endpoint, main_endpoint, left_queryparam, right_queryparam, top_queryparam, item_endpoint } = params;

        this.leftEndpoint = left_endpoint;
        this.topEndpoint = top_endpoint;
        this.rightEndpoint = right_endpoint;
        this.mainEndpoint = main_endpoint;
        this.itemEndpoint = item_endpoint;

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

    async openPopup(id){
        //console.log("HER?", id, _paq)
        const item = await this.callAPI(this.itemEndpoint+id)

        _paq.push(['trackEvent', 'example', 'Open', item.title]);

        const popup = document.getElementById("popup");
        const popup_background = document.getElementById("popup--background")

        popup.innerHTML = "";

        const header = document.createElement("div")
        header.style.display = "flex"
        header.style.flexDirection = "row"
        header.style.width = "100%"

        // heading to 'header'
        const case_heading = document.createElement("span")
        case_heading.classList.add("case--heading")
        case_heading.innerText = item.title;
        case_heading.style.width = "80%"
        case_heading.style.marginRight = "2%"
        header.appendChild(case_heading)

        const case_buttons = document.createElement("div")
        case_buttons.style.display = "flex";
        case_buttons.style.flexDirection = "column"
        case_buttons.style.width = "18%"
        //case_buttons.style.justifyContent = "center"

        // download button to 'header'
        const printing = document.createElement("button")
        printing.innerText = "Download";
        printing.style.width = "100%"
        printing.style.height = "20px"
        printing.addEventListener("click", () => {
            _paq.push(['trackEvent', 'example', 'Download', item.title]);
            window.open(
                item.attachment,
                '_blank' // <- This is what makes it open in a new window.
            );
        })
        case_buttons.appendChild(printing)

        // close button to 'header'
        const close = document.createElement("button")
        close.innerText = "Close";
        close.style.width = "100%";
        close.style.height = "20px"
        close.addEventListener("click", () => {
            _paq.push(['trackEvent', 'example', 'Close', item.title]);
            popup.classList.add("popup--hidden")
            popup_background.classList.add("popup--hidden")
        })
        case_buttons.appendChild(close)

        header.appendChild(case_buttons)

        // append header to popup
        popup.appendChild(header);

        const case_description = document.createElement("div")
        case_description.classList.add("description")
        case_description.innerHTML = item.description;
        popup.appendChild(case_description)

        popup.classList.remove("popup--hidden")
        popup_background.classList.remove("popup--hidden")
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

            const caseno = document.createElement("div")
            caseno.classList.add("caseno")
            caseno.innerText = item.name;
            box.appendChild(caseno)

            const heading = document.createElement("div")
            heading.classList.add("heading")
            heading.innerText = item.title;
            box.appendChild(heading)
            
            const manchet = document.createElement("div")
            manchet.classList.add("manchet")
            manchet.innerHTML = item.description;
            box.appendChild(manchet)
            
            const readmore = document.createElement("div")
            readmore.classList.add("readmore")

            const readmore_button = document.createElement("button")
            readmore_button.addEventListener("click", () => {
                this.openPopup(item.recid);
            })
            readmore.appendChild(readmore_button)
            
            readmore_button.innerText = "Read more";
            box.appendChild(readmore);

            box.classList.add("box")
            wrap.appendChild(box)
        }

        
        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.classList.add("popup--hidden");
        popup.id="popup"

        wrap.appendChild(popup)

        // popup background
        const popup_background = document.createElement("div");
        popup_background.classList.add("popup--background");
        popup_background.classList.add("popup--hidden");
        popup_background.id="popup--background"

        wrap.appendChild(popup_background)
    }

    async showItems(){
        //console.log(this.left_id, this.top_id, this.right_id)
        if(this.left_id && this.top_id && this.right_id){
            // Track the click
            if(Array.isArray(this.top_items) && Array.isArray(this.left_items) && Array.isArray(this.right_items)){
                const top_value = this.top_items.find((v) => {
                    return v.recid == this.top_id
                })

                const left_value = this.left_items.find((v) => {
                    return v.recid == this.left_id;
                })

                const right_value = this.right_items.find((v) => {
                    return v.recid == this.right_id
                })

                let q_str = this.top_queryparam+"="+top_value.title;
                q_str += ", " + this.left_queryparam + "=" + left_value.title;
                q_str += ", " + this.right_queryparam + "=" + right_value.title;
                console.log(q_str)
                _paq.push(['trackEvent', 'browse', 'Change', q_str]);
            }

            // Make query parameters for item request
            var query_params = "?";
            query_params += this.left_queryparam+"="+this.left_id+"&"
            query_params += this.top_queryparam+"="+this.top_id+"&"
            query_params += this.right_queryparam+"="+this.right_id

            // Call the API
            const items = await this.callAPI("/filterItems/examples"+query_params)

            // Render the items
            this.makeItems(items);
        }
    }

    selectButton(target, wrap_classname){
        const wrap = document.getElementsByClassName(wrap_classname)[0]
        for(let button of wrap.children){
            button.classList.remove("sel")
        }

        //console.log(this); //.classList.add("sel")
        target.classList.add("sel")

        const wrapper = wrap_classname.split("--")[0]
        this[wrapper+"_id"] = target.dataset.recid;
        if(document.getElementById(wrapper + "--status")){
            document.getElementById(wrapper + "--status").style.color="#0a0";
        }
        
        this.showItems();
    }

    makeButtons(items, wrap_classname, labeltext){
        const wrap = document.createElement("div")
        wrap.classList.add(wrap_classname)

        const label_wrap = document.createElement("div")
        label_wrap.classList.add("label--wrap")

        const label = document.createElement("div")
        label.classList.add("label")
        label.innerText = labeltext;

        label_wrap.appendChild(label)
        wrap.appendChild(label_wrap)

        const buttons = document.createElement("div")
        buttons.classList.add(wrap_classname+"--buttons")

        for(let item of items){
            const button = document.createElement("button")
            button.innerText = item.title;
            button.dataset.wrapclassname = wrap_classname;
            button.dataset.recid = item.recid;
            button.addEventListener("click", (e) => {
                const wrap = e.target.dataset.wrapclassname;
                this.selectButton(e.target, wrap_classname+"--buttons");
            })
            buttons.appendChild(button)
        }
        wrap.appendChild(buttons)

        return wrap;
    }

    async render(){
        this.top_items = await this.callAPI(this.topEndpoint)
        const top_wrap = this.makeButtons(this.top_items, "top", "Situational")

        this.right_items = await this.callAPI(this.rightEndpoint)
        const right_wrap = this.makeButtons(this.right_items, "right", "Complexity")

        this.left_items = await this.callAPI(this.leftEndpoint)
        const left_wrap = this.makeButtons(this.left_items, "left", "Faculty")

        /* LOADING MAIN... */
        const main_wrap = document.createElement("div")
        main_wrap.classList.add("items")
        main_wrap.id = "items";

        main_wrap.innerHTML = `<div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center;"><div class="textnormal" style="text-align: center; font-size: 20px;"><span style="color: #0b0b0b; font-size: 20pt; font-weight: bold;">Welcome to the AI-PAT system</span></div>
        <div class="textnormal" style="text-align: center;"><span style="color: #0b0b0b;">The project is under development and will grow in cases and features.</span></div>
        <div class="textnormal" style="text-align: center;"><span style="color: #0b0b0b;">Feedback and suggestions are useful</span></div>
        <div class="textnormal" style="text-align: center;"><span style="color: #0b0b0b;"><br></span></div>
        <div class="textnormal" style="text-align: center;"><span style="color: #0b0b0b;"><br></span></div>
        <div class="textnormal" style="text-align: center;">
            <span style="color: #0b0b0b; font-size: 18pt; font-weight: bold;">
                SELECT<br>
                <span id="left--status">1. FACULTY</span><br>
                <span id="top--status">2. SITUATIONAL</span><br>
                <span id="right--status">3. COMPLEXITY</span>
            </span>
        </div>
        <div class="textnormal" style="text-align: center;"><span style="color: #0b0b0b;"><br></span></div>
        <div class="textnormal" style="text-align: center;"><span style="color: #0b0b0b;"><br></span></div>
        <div class="textnormal" style="text-align: center;"><span style="color: #0b0b0b;">Best regards</span></div>
        <div class="textnormal" style="text-align: center;"><span style="color: #0b0b0b;">/Mads</span></div></div>`

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