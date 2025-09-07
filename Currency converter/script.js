
const BASE_URL_EXCH = "https://latest.currency-api.pages.dev/v1/currencies/" // url= BASE_URL + curency + .json
const URL_CURR = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"

async function fetchDataFromUrl(url) {

    const loader = document.getElementById("loader");
    loader.style.display = "inline-block"; // show spinner
    try {
        const response  = await fetch(url);

        if(!response.ok) {
            throw new Error (`list of currencies couldn't be fetched. HTTP error ${response.status}`);
        }

        const data = await response.json();
        // console.log(data);
        return data;
    }
    catch (error) {
        console.error("error occured in fecthing list of currencies from API", error);
    } finally {
    loader.style.display = "none"; // hide spinner after fetch
  }
}

async function populateCurrencies () {

    //const url = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"
    const data =  await fetchDataFromUrl(URL_CURR);
    const selects = document.querySelectorAll(".card-body .form-select");

    

    for (let select of selects) {
        select.innerHTML = "";
        Object.entries(data).forEach(([code, name], index) => {
            //console.log(index, code, name);
            let newOption = document.createElement("option");
            let newOptText = code.toUpperCase() + " - " + name

            newOption.innerText = newOptText;
            newOption.value = code.toUpperCase();

            if (select.name === "from" && code.toUpperCase() === "USD") {
                newOption.selected = 'selected'
            } else if (select.name === "to" && code.toUpperCase() === "INR") {
                newOption.selected = 'selected'
            }
            select.append(newOption);
        });
    }

    // console.log(data);
}

document.querySelectorAll(".card img").forEach(img => {
        img.onerror = function() {
        img.style.display = "none"; // hide broken image
        const msg = document.createElement("span");
        msg.className = "flag-error"; // mark for future cleanup
        msg.style.color = "red";
        msg.innerText = "Flag not available";
        img.parentElement.insertBefore(msg, img.nextSibling); 
      };
    });

populateCurrencies();

const currencyLables = document.querySelectorAll(".card-body span");
const selects = document.querySelectorAll(".card-body .form-select");

selects.forEach((select) => {
    select.addEventListener("change",()=>{
        select.previousElementSibling.children[0].innerText = select.value;

        // Reset if previous error message exists
        const oldMsg = select.parentElement.parentElement.querySelector(".flag-error");
        if (oldMsg) {
            // console.log(oldMsg);
            oldMsg.remove();
        } 
        // else {
        //     console.log("No old msg");
        // }
        const img = select.parentElement.previousElementSibling;
        img.style.display = "inline"; 

        // Set new image source
        //console.log(countryList[select.value]);
        img.src = `https://flagsapi.com/${countryList[select.value]}/shiny/64.png`;
        // if (countryList[select.value]) {
        //     img.src = `https://flagsapi.com/${countryList[select.value]}/shiny/64.png`;
        // }
        // else {
        //     img.style.display = "none";
        // }
        
        // select.parentElement.previousElementSibling.src = `https://flagsapi.com/${countryList[select.value]}/shiny/64.png`
        //console.log(select.previousElementSibling.children)
    });
    //select.addEventListener("blur")
    select.addEventListener("blur", () => select.size = 0);
    select.addEventListener("change", () => select.size = 0);
})

const arrow = document.querySelector(".row i");

arrow.addEventListener("click",()=>{
    arrow.classList.toggle("bi-arrow-right");
    arrow.classList.toggle("bi-arrow-left");
})

const inputs = document.querySelectorAll(".card-body input");

inputs.forEach((input,index,inputs)=>{
    input.addEventListener("change", async ()=>{
        if (input.value <= 0) {
            input.value = 0;
        } else {

            const fromCurrency = input.parentElement.querySelector("select").value.toLowerCase();
            const toCurrency = inputs[1 - index].parentElement.querySelector("select").value.toLowerCase();  

            //let url = `https://latest.currency-api.pages.dev/v1/currencies/${fromCurrency}.json`;
            const url = BASE_URL_EXCH + `${fromCurrency}` + ".json";
            const data = await fetchDataFromUrl(url);
            //console.log(data);
            const exchangeRate = data[fromCurrency][toCurrency];

            //console.log("exchange rate",data[fromCurrency][toCurrency]);
            document.getElementById("exchange-rate").innerText = `1 ${fromCurrency.toUpperCase()} = ${exchangeRate.toFixed(3)} ${toCurrency.toUpperCase()} as on ${data.date}`
            inputs[1 - index].value = (input.value * exchangeRate).toFixed(3);
            //console.log(input.id, arrow.classList.contains("bi-arrow-left"))
            
            if ((input.id === "from-input" && arrow.classList.contains("bi-arrow-left")) ||  (input.id === "to-input" && arrow.classList.contains("bi-arrow-right"))) {
                arrow.click();
            }
        }
    })
})


const converBtn = document.querySelector(".main-container button");

converBtn.addEventListener("click",async ()=>{
    const direction = document.querySelector(".row i").classList.contains("bi-arrow-right");


    let x= direction ? 0 : 1
    fromField = inputs[x];
    toField = inputs[1-x];
    //console.log("x=: ", x, "x-1= ",1-x)
    const fromCurrency = fromField.parentElement.querySelector("select").value.toLowerCase();
    const toCurrency = toField.parentElement.querySelector("select").value.toLowerCase();

    //console.log("from & to currency", fromCurrency,toCurrency)

    const url = BASE_URL_EXCH + `${fromCurrency}` + ".json";
    const data = await fetchDataFromUrl(url);
    //console.log(data);
    const exchangeRate = data[fromCurrency][toCurrency];

    document.getElementById("exchange-rate").innerText = `1 ${fromCurrency.toUpperCase()} = ${exchangeRate.toFixed(3)} ${toCurrency.toUpperCase()} as on ${data.date}`
    toField.value = (fromField.value * exchangeRate).toFixed(3);
})

const imgs = document.querySelectorAll("img");
imgs.forEach((img)=>{
    img.addEventListener("click",()=>{
        //console.log(img.id);
        //console.log(img.parentElement.querySelector("select").name);
        //img.parentElement.querySelector("select").click();
        const select = img.parentElement.querySelector("select");
        select.focus();
        select.size = select.options.length;
        //img.parentElement.querySelector("select")
    })
})