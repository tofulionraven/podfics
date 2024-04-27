// TODO: Wait until multiple characters are entered before searching
// TODO: Ignore spaces/empty elements in the search  DONE
// TODO: Layout is inconsisent (search bar not on top/too low; cards too wide, bottom stuff should be a footer)
// TODO: Add links and other elements
// TODO: When scrolling move up until the top of the screen is hit, then start collapsing. DONE
// TODO: Show the number of hits

const data_url = "https://raw.githubusercontent.com/tofulionraven/podfics/main/data/clean.json";
const local_data_url = "../data/clean.json"
let table;

// https://stackoverflow.com/a/35045402
// https://www.syncfusion.com/blogs/post/javascript-debounce-vs-throttle
function debounce(fn, duration = 1000) {
  var timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {fn(...args)}, duration);
  }
}

const searchChange = debounce((field) => {
        const terms = field.target.value.split(" ")
        const cleanTerms = terms.filter(term => term.length > 2)
        const searchFields = ["Title", "Author", "Podcaster", "Ship or Main Character"]
        let results = []
        if (cleanTerms.length !== 0){
            searchFields.forEach(field => {
                    cleanTerms.forEach(term => results = results.concat(table.searchRows(field, "like", term)))
                }
            )
        }
        else{
            results = table.getRows()
        }
        updateCards(null, results)
    },
    300
)

function toggleCard(_event){
    if (_event.target.className !== "card"){
        toggleCard({target: _event.target.parentElement})
        return
    }
    let internal = _event.target.querySelector(".card-expanded")
    if (internal.style.display === "none"){
        internal.style.display = "block"
    }
    else{
        internal.style.display = "none"
    }
}

function createCard(data) {
    card = document.createElement("div")
    card.classList.add("card")
    mainInfo = document.createElement("div")
    mainInfo.classList.add("card-main-info")
    details = document.createElement("div")
    details.classList.add("card-detail")
    mainInfo.innerHTML = `<h3>${data.Title}</h3>`
    // https://fontawesome.com/search?
    details.innerHTML = `<ul class="no-bullets">
    <li><i class="fa-solid fa-feather-pointed"></i> ${data.Author}</li>
    <li><i class="fa-solid fa-microphone-lines"></i> ${data.Podcaster}
    </ul>`
    expanded = document.createElement("div")
    expanded.classList.add("card-expanded")
    expanded.innerHTML = "Expanded content..."
    expanded.style.display = "none"

    card.appendChild(mainInfo)
    card.appendChild(details)
    card.appendChild(expanded)
    card.addEventListener("click", toggleCard)
    return card
}
function updateCards(_filters, rows){
    //filters - array of filters currently applied
    //rows - array of row components that pass the filters
    console.log("hi")
    let numResults = document.getElementById("num-results")
    numResults.innerHTML = `Results: ${rows.length}`
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
    document.getElementById("gen").addEventListener("keyup", searchChange)
    document.getElementById("top-form").addEventListener("submit", event => event.preventDefault())
}
