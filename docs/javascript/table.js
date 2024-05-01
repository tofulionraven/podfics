const data_url = "https://raw.githubusercontent.com/tofulionraven/podfics/main/data/clean.json";
const local_data_url = "../data/clean.json"

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

    new Tabulator("#table", {
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
                width: "50",
                resizable: false,
            },
            {
            
                title:"Link",
                field:"ao3",
                formatter:"html",
                headerFilter:null,
                headerFilterFunc:null,
                width: "50",
                resizable: false,
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
                width:"200",
            },
            {
                title:"Podficcer",
                field:"Podcaster",
                width:"200",
            },
            {
                title: "Ship",
                field: "FANDOM NAME",
                headerFilter: "select",
                headerFilterFunc: "=",
            
            },
            {
                title:"Ship/Character",
                field:"Ship or Main Character",
                width:"150",
            },

            {
                title:"Length",
                field:"Time",
                headerFilter: "select",
                headerFilterFunc: "=",
            },
            {
                title: "Status",
                field: "Status",
            },
            {
                title: "Chapters",
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
        }
    });
}
