const data_url = "https://raw.githubusercontent.com/tofulionraven/podfics/main/data/clean.json";
const local_data_url = "../data/clean.json"
let table;

// https://stackoverflow.com/a/35045402
function debounce(fn, duration) {
  var timer;
  return function(){
    clearTimeout(timer);
    timer = setTimeout(fn, duration);
  }
}

function searchChange(field){
    const terms = field.target.value.split(" ")
    const searchFields = ["Title", "Author", "Podcaster", "Ship or Main Character"]
    let results = []
    searchFields.forEach(field => {
            terms.forEach(term => results = results.concat(table.searchRows(field, "like", term)))
        }
    )
    updateCards(null, results)
}

function createCard(data) {
    card = document.createElement("div")
    card.classList.add("card")
    mainInfo = document.createElement("div")
    mainInfo.classList.add("card-main-info")
    details = document.createElement("div")
    details.classList.add("card-detail")
    mainInfo.innerHTML = `<h3>${data.Title}</h3>`
    details.innerHTML = `<ul><li>Author: ${data.Author}</li><li>Podcaster: ${data.Podcaster}</ul>`

    card.appendChild(mainInfo)
    card.appendChild(details)
    return card
}
function updateCards(_filters, rows){
    //filters - array of filters currently applied
    //rows - array of row components that pass the filters
    let cards = document.getElementById("cards")
    cards.innerHTML = ""
    rows.forEach(row => cards.appendChild(createCard(row._row.data)))
}

async function load_data() {
    var full_data;
    await fetch(local_data_url)
        .then((response) => response.json())
        .then(json => {full_data = json;})
        .catch(
            _error => fetch(data_url)
            .then(response => response.json())
            .then(json => {full_data = json;})
        )

    table = new Tabulator("#phone-table", {
        data:full_data, //assign data to table
        layout:"fitData", //fit columns to width of table (optional)
        pagination:true,
        paginationSize:30,  // Change number of rows displayed
        columns:[
            {
            
                title:"Stream",
                field:"other",
                formatter:"html",
                headerFilter:null,
                headerFilterFunc:null,
            },
            {
            
                title:"Link",
                field:"ao3",
                formatter:"html",
                headerFilter:null,
                headerFilterFunc:null,
            },
            
            {    
                title:"Title",
                field:"Title",
                headerFilter:"input",
                headerFilterFunc:"like",
                width:"250",
            },
            {
                title:"Author",
                field:"Author",
                width:"200"
            },
            {
                title:"Podficcer",
                field:"Podcaster",
                width:"200"
            },
            {
                title:"Ship/Character",
                field:"Ship or Main Character",
                width:"150"
            },
            {
                title:"Length",
                field:"Time",
                headerFilter: "select",
                headerFilterFunc: "=",
            },
            {
                title: "Status",
                field: "Chapters",
            }
        ],
        columnDefaults:{
            headerFilter:"input",
            headerFilterFunc:"like",
            headerFilterParams:{
                valuesLookup:"active",
                sort:"asc",
                clearable: true,
                // multiselect:true,
                autocomplete:false,
            },
        },
        visible:false,
    })
    table.on("dataFiltered", updateCards)
    document.getElementById("gen").addEventListener("keyup", searchChange, 300)
}
