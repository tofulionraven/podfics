const data_url = "https://raw.githubusercontent.com/tofulionraven/oh-sheet/main/data/clean.json";

async function load_data() {
    var full_data;
    await fetch(data_url)
        .then((response) => response.json())
        .then(json => {full_data = json;})

    new Tabulator("#table", {
        data:full_data, //assign data to table
        layout:"fitData", //fit columns to width of table (optional)
        pagination:true,
        paginationSize:10,
        columns:[
            {
                title:"Title",
                field:"Title",
                headerFilter:"input",
                headerFilterFunc:"like",
                width:"250",
            },
            {
                title:"Podficcer",
                field:"Podficcer",
            },
            {
                title:"Author",
                field:"Author",
            },
            {
                title:"Ship",
                field:"Ship",
            },
            {
                title:"Link",
                field:"Link",
                formatter:"html",
                headerFilter:null,
                headerFilterFunc:null,
            },
        ],
        columnDefaults:{
            headerFilter:"list",
            headerFilterFunc:"in",
            headerFilterParams:{
                valuesLookup:"active",
                sort:"asc",
                clearable: true,
                multiselect:true,
            },
        }
    });
}
