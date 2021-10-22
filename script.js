var uid = new ShortUniqueId();
let text_input= document.querySelector("#text-input");
let ticket_container = document.querySelector(".ticket-container");
let color_picker = document.querySelector(".color-picker");
let colors = ["pink", "blue", "green", "black"];
let defaultColor="black"
let currColor = "";
let lockContainer = document.querySelector(".lock-unlock-container>.lock");
let unlockContainer = document.querySelector(".lock-unlock-container>.unlock");
let deleteContainer = document.querySelector(".add-cross-container>.cross");
let deleteMode = false;
let addNote = document.querySelector(".add-cross-container>.add");
let modal = document.querySelector(".modal-container");
let modal_input = document.querySelector(".input-container-text");
let color_selector = document.querySelector(".color-container");
let allColorsInColorSelector = document.querySelectorAll(".colBox");

(function(){
    //ye function aate hee chl jaega
    //local storage check and updating the ui on that basis
        let locStorItemsArr = JSON.parse(localStorage.getItem("tickets")) || [];
        for(let i=0; i<locStorItemsArr.length; i++){
            let {id, text, color} = locStorItemsArr[i];
            createTicket(id, text, false, color);
        }
})();


//implement local storage
//while editing the ticket manage overflow
//media query

//"flag" in create ticket is to know if the tickets needs to be added to the local storage or not
//"color" in create ticket is used when the function that runs when the window reloads that creates all the tickets in ui which are present in the local storage
let modalMode = false;
let flag = false;

addNote.addEventListener("click", function(){
    modalMode = !modalMode;
    if(modalMode){
        modal.classList.remove("hidden");
        addNote.classList.add("active");
    }else{
        modal.classList.add("hidden");
        addNote.classList.remove("active");
    }
})

modal_input.addEventListener("keypress", function(e){
    let key = e.code;
    if(key=="Enter" && modal_input.value){
        //generate id and input text
        let id = uid();
        let text = modal_input.value;

        //make modal invisible
        modal.classList.add("hidden");
        addNote.classList.remove("active");
        //make ticket
            //make a fucntion and send input value and id to it
        createTicket(id, text, true);    
        //empty the input area 
        modal_input.value = "" ;
    }
})

color_selector.addEventListener("click", function(e){
    let element = e.target;
    if(element!=color_selector){
        let colorPicked = element.classList[1];
        //setting the default color to current select
        defaultColor = colorPicked;

        for(let i=0; i<allColorsInColorSelector.length; i++){
            allColorsInColorSelector[i].classList.remove("selected");
        }
        element.classList.add("selected");
    }
})




deleteContainer.addEventListener("click", function(){
    deleteMode=!deleteMode;
    if(deleteMode){
        deleteContainer.classList.add("active");
    }else{
        deleteContainer.classList.remove("active");
    }
})

lockContainer.addEventListener("click", function(){
    //use queryselectorall not just queryselector
    let content_div=document.querySelectorAll(".ticket-body>.ticket-text");
    for(let i=0; i<content_div.length; i++){
        content_div[i].contentEditable = false;
    }
    lockContainer.classList.add("active");
    unlockContainer.classList.remove("active");
})

unlockContainer.addEventListener("click", function(){
    let content_div=document.querySelectorAll(".ticket-body>.ticket-text");
    for(let i=0; i<content_div.length; i++){
        content_div[i].contentEditable = true;
    }
    lockContainer.classList.remove("active");
    unlockContainer.classList.add("active");
})



color_picker.addEventListener("click", function(e){
    console.log("color picker clicked");
    let element = e.target;
    if(element!=color_picker){
        let colorPicked = element.classList[1];
        filterOnColorBasis(colorPicked);
    }
})


function filterOnColorBasis(colorPicked){
    let allTickets=ticket_container.querySelectorAll(".ticket");
    if(colorPicked!=currColor){
        //not double clicked
        for(let i=0; i<allTickets.length; i++){
            let ticketHead = allTickets[i].querySelector(".ticket-head");
            let ticketColor = ticketHead.classList[1];
            if(ticketColor==colorPicked){
                //show the ticket
                allTickets[i].style.display="block";
            }else{
                //do not show the ticket
                allTickets[i].style.display="none";
            }
        }
        currColor=colorPicked;
    }else{
        //double clicked
        currColor="";
        for(let i=0; i<allTickets.length; i++){
            allTickets[i].style.display="block";
        }
    }
    
}


//when enter is pressed in the input div
text_input.addEventListener("keypress", function(e){
    let key = e.code;
    if(key=="Enter" && text_input.value){
        //generate id and input text
        let id = uid();
        let text = text_input.value;
        //make ticket
            //make a fucntion and send input value and id to it
        createTicket(id, text);    
        //empty the input area 
        text_input.value = "" ;
    }

})
function createTicket(id, text, flag, color){
    let ticket_div = document.createElement("div");
    ticket_div.setAttribute("class", "ticket");
    ticket_container.appendChild(ticket_div);
    ticket_div.innerHTML= `
        <div class ="ticket-head ${color ? color : defaultColor}">
        </div>
        <div class="ticket-body">
            <h1 class="ticket-id">#${id}</h1>
            <div class="ticket-text" contentEditable="true">${text}</div>
        </div>
    `;

    //changing color by clicking over ticket-header
    //remember to select header from ticket_div and not ticket_container
    let ticket_header = ticket_div.querySelector(".ticket-head");
    let ticket_content = ticket_div.querySelector(".ticket-body>div");
    let idForLocStorImple;


    //updating the content of the ticket on local storage
    ticket_content.addEventListener("focusout", function(){
        console.log("ticket content changed");
        let ncontent = ticket_content.textContent;

        idForLocStorImple = ticket_content.parentNode.children[0];
        idForLocStorImple = idForLocStorImple.textContent;
        let FinalidForLocStor = idForLocStorImple.split("#")[1];

        locStorItemsArr = JSON.parse(localStorage.getItem("tickets"));
        for(let i=0; i<locStorItemsArr.length; i++){
            if(locStorItemsArr[i].id == FinalidForLocStor){
                locStorItemsArr[i].text = ncontent;
                break;
            }
        }
        localStorage.setItem("tickets", JSON.stringify(locStorItemsArr));
    })

    ticket_header.addEventListener("click", function(){
        //picking the next color from colors array
        //get all the classes on a div using classList
        let ccolor = ticket_header.classList[1];
        let ccolorIdx = colors.indexOf(ccolor);
        
        let ncolorIdx =  (ccolorIdx + 1 ) % 4;
        
        let ncolor = colors[ncolorIdx];
        

        ticket_header.classList.remove(ccolor);
        ticket_header.classList.add(ncolor);

        //updating color in local storage for the clicked ticket
        idForLocStorImple = ticket_header.parentNode.children[1].children[0].textContent;
        // idForLocStorImple = idForLocStorImple.textContent;
        let FinalidForLocStor = idForLocStorImple.split("#")[1];

        let locStorItemsArr = JSON.parse(localStorage.getItem("tickets"));
        for(let i=0; i<locStorItemsArr.length; i++){
            if(locStorItemsArr[i].id == FinalidForLocStor){
                locStorItemsArr[i].color = ncolor;
                break;
            }
        }
        localStorage.setItem("tickets", JSON.stringify(locStorItemsArr));

    })


    //implement delete ticket
    ticket_div.addEventListener("click", function(){
        if(deleteMode){
            //ticket removed from ui
            ticket_div.remove();

            //removing ticket from local storage
            idForLocStorImple = ticket_div.children[1].children[0].textContent.split("#")[1];
            // idForLocStorImple = idForLocStorImple.split("#")[1]; //removing hash from the id

            
            let locStorItemsArr = JSON.parse(localStorage.getItem("tickets"));
            for(let i=0; i<locStorItemsArr.length; i++){
                if(locStorItemsArr[i].id == idForLocStorImple){
                    locStorItemsArr.splice(i, 1);
                }
            }
            localStorage.setItem("tickets",JSON.stringify(locStorItemsArr));

        }
    })

    //adding ticket to local storage whenever the ticket is created
    if(flag){
        let locStorItems = localStorage.getItem("tickets");
        let locStorItemsArr = JSON.parse(locStorItems) || [];
        let ticketObj = {
            id: id,
            text: text,
            color: defaultColor // only default color is in the scene when ticket is created and color is in the scene only when tickets are created using local storage
        }
        
        locStorItemsArr.push(ticketObj);
        localStorage.setItem("tickets", JSON.stringify(locStorItemsArr));
    }
}




// *********************************end*************************************
//local storage functions

// localStorage.setItem("todo", "Hello again todo");
// localStorage.setItem("todo tomorrow", "Hello again");
// localStorage.setItem("todo yesterday", "Hello again");
// let length = localStorage.length;
// console.log("length", length);
// localStorage.removeItem("todo");
// localStorage.clear();
// let item = localStorage.getItem("todo");
// console.log("item", item);
// lock/unlock features