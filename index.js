
//utility functions:

const Prism = require("./prism");

// 1. Utility function to get DOM element from String
function getElementFromString(string) {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
}



//Initialize no of parameters
let addedParamsCount = 0;



//Hide the parameters box initially
let parametersbox = document.getElementById('parametersBox')
parametersbox.style.display = 'none'

//if the user clicks on params box, hide the jsonbox
let paramsRadio = document.getElementById('paramsRadio');
paramsRadio.addEventListener('click', () => {
    document.getElementById('requestJsonBox').style.display= 'none';
    document.getElementById('parametersBox').style.display = 'block';

})


//if the user clicks on json box , hide the params box
let jsonRadio = document.getElementById('jsonRadio');
jsonRadio.addEventListener('click' , () => {
    document.getElementById('parametersBox').style.display = 'none';
    document.getElementById('requestJsonBox').style.display = 'block';
})


//if the user clicks on plus button add more parameters
let addParam = document.getElementById('addParam');
addParam.addEventListener('click', ()=> {
    let params = document.getElementById('params');
    let string = `<div class="form-row my-2">
                    <label for="url" class="col-sm-2 col-form-label">Parameter ${addedParamsCount + 2}</label>
                    <div class="col-md-4">
                        <input type="text" class="form-control" id="parameterKey${addedParamsCount + 2}" placeholder="Enter Parameter ${addedParamsCount + 2} Key">
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" id="parameterValue${addedParamsCount + 2}" placeholder="Enter Parameter ${addedParamsCount + 2} Value">
                    </div>
                    <button class="btn btn-primary deleteParam"> - </button>
                    </div>`
    
                    // Convert the element string to dom mode
    let paramElement = getElementFromString(string)
    params.appendChild(paramElement);
    
    //Add an event listener to remove the  parameter on clicking - button
    let deleteParam = document.getElementsByClassName('deleteParam');
    for(item of deleteParam){
        item.addEventListener('click' ,(e)=>{
            e.target.parentElement.remove();
            

        })
    }
   
    addedParamsCount++;
})

//if the user clicks on submit button
let submit = document.getElementById('submit');
submit.addEventListener('click', ()=>{
    //show please wait in the response box to request patience from the user
   document.getElementById('responsePrism').innerHTML = "Please wait.. fetching response...";

    //fetch all the values user has entered
    let url = document.getElementById("url").value;
    let requestType = document.querySelector("input[name='requestType']:checked").value;
    let contentType = document.querySelector("input[name='contentType']:checked").value;

   

//if user has used params option instead of json, collect all the parameters in an object
 if( contentType == 'params'){
     data = {};
     for(i=0;i<addedParamsCount+1; i++){
         if(document.getElementById('parameterKey' + (i+1)) != undefined){
         let key = document.getElementById('parameterKey' + (i+1)).value;
         let value = document.getElementById('parameterValue' + (i+1)).value;
         data[key] = value;
     }
    data = JSON.stringify(data);
    }
 }
 else{
     data = document.getElementById('requestJsonText').value;
 }

 //log all the values in the console for debugging
 console.log("URL is", url)
 console.log("requestTYpe is", requestType)
 console.log("contentType is", contentType)
 console.log('data is ', data)

 //if the request type is post, invoke fetch api to create a post request
 if(requestType == 'GET'){
     fetch(url, {
        method:'GET'

     }).then(response => response.text())
     .then((text)=>{
         document.getElementById('responsePrism').innerHTML =text;
     })
 }
 else {
     fetch(url, {
         method: 'POST',
         body:data,
         headers: {
             "content-type" : "application/json; charset=UTF-8"
         }
     })
     .then(response => response.text())
     .then ((text) => {
         document.getElementById('responsePrism').innerHTML = text;
         Prism.highlightAll();
     })
 }


}) 