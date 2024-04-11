 const data_url = "https://raw.githubusercontent.com/tofulionraven/podfics/main/data/clean.json";
//const data_url = "../data/clean.json"
async function load_data() {
    var full_data;
    await fetch(data_url)
        .then((response) => response.json())
        .then(json => {full_data = json;})

    new Tabulator("#table", {
        data:full_data, //assign data to table
        layout:"fitData", //fit columns to width of table (optional)
        pagination:true,
        paginationSize:30,  // Change number of rows displayed
        columns:[
            {
            
                title:"Link",
                field:"Link",
                formatter:"html",
                headerFilter:null,
                headerFilterFunc:null,
            },{    
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
                title:"Podcaster",
                field:"Podcaster",
                width:"200"
            },
            {
                title:"Ship or Main Character",
                field:"Ship or Main Character",
                width:"150"
            },
            {
                title:"Time",
                field:"Time",

            },
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
