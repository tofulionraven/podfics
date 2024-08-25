const data_url = "https://raw.githubusercontent.com/tofulionraven/podfics/main/data/clean.json";
const local_data_url = "../data/clean.json"

function ficLinkFilter(headerValue, rowValue, rowData, filterParams){
    // <a href...>Title</a>, want to search only "Title" and not the href.
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

    let temp = document.createElement("div")
    temp.innerHTML = rowValue  
    return temp.firstChild.textContent.toLowerCase().includes(headerValue.toLowerCase())
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

    new Tabulator("#table", {
        data:full_data, //assign data to table
        layout:"fitData", //fit columns to width of table (optional)
        pagination:true,
        paginationSize:50,  // Change number of rows displayed
        
        columns:[
            {
            
                title:"Stream",
                field:"other",
                formatter:"html",
                headerFilter:null,
                headerFilterFunc:null,
                width: "45",
                resizable: false,
            },
            {
            
                title:"Link",
                field:"ao3",
                formatter:"html",
                headerFilter:null,
                headerFilterFunc:null,
                width: "45",
                resizable: false,
            },
            {    
                title:"Title",
                field:"linked_title",
                formatter: "html",
                headerFilter:"input",
                headerFilterFunc:ficLinkFilter,
                width:"250",
            },
            {
                title:"Author",
                field:"Author",
                width:"200",
            },
            {
                title:"Podfic Date",
                field:"Date Podfic Published/Updated",
                formatter:"datetime",
                formatterParams:{
                    inputFormat:"yyyy-mm-dd",
                    outputFormat:"yyyy-mm-dd",
                    invalidPlaceholder:"unknown",
                },
                width:"100",
                resizable: false,
            },
            {
                title:"Fic Date",
                field:"Date Fic Published",
                formatter:"datetime",
                formatterParams:{
                    inputFormat:"yyyy-mm-dd",
                    outputFormat:"yyyy-mm-dd",
                    invalidPlaceholder:"unknown",
                },
                width:"100",
                resizable: false,
            },
            {
                title:"Podficcer",
                field:"Podcaster",
                width:"200",
            },
            {
                title: "Ship",
                field: "Pairing name",
                headerFilter: "select",
                headerFilterFunc: "=",
                width: "120",
                resizable: false,
            },
            {
                title:"Characters",
                field:"Ship or Main Character",
                width:"200",
            },

            {
                title:"Length",
                field:"Time",
                headerFilter: "select",
                headerFilterFunc: "=",
                resizable: false,
            },
            {
                title: "Status",
                field: "Status",
                resizable: false,
            },
            {
                title: "Chapters",
                field: "Total",
                resizable: false,
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
