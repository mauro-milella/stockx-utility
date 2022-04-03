//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                REFERENCES AND UTILITIES
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//reference to table body section, in order to append childrens
//also, its childrens (the items) are saved in local storage and
//can be retrieved 
$tablebody = $("#table-body");
//form used to insert a new item
$form = $(".add-item-form");
//form used to modify an item
$modify_form = $(".modify-item-form");

//refresh time used to get a single item update from stockx
const refresh_time = 5000;

//add-item form visibility toggling
$("#show-button, #unshow-button").click(function(){
    $form.toggleClass("add-item-form--active");
})

//modify-item form visibility toggling
//this is needed to close the modify form, 
//which is actually opened by onclick event "modify_item"
$("#modify-unshow-button").click(function(){
    $modify_form.toggleClass("modify-item-form--active");
})

//Item insertion
$("#add-button").click(function(){

    //get references to the form inputs
    $item = $("#form-input--item");
    $size = $("#form-input--size");
    $purchasecost = $("#form-input--purchasecost");
    $stockx_link = $("#form-input--stockx");
    $tags = $("#form-input--tags");

    try{
        //get the values
        INPUTVAL_item = $item.val();
        INPUTVAL_size = $size.val();
        INPUTVAL_purchasecost = parseInt($purchasecost.val());
        INPUTVAL_stockx_link = $stockx_link.val();
        INPUTVAL_tags = $tags.val();

        if( isNaN(INPUTVAL_purchasecost) ){
            throw "prezzo d'acquisto non valido";
        }
    }
    catch (error){
        alert("Errore: " + error)
        return;
    }

    //add child to tablebody
    $("#table-body").append(
        `<tr style="overflow-wrap: break-word;">
            <td data-label="Prodotto">` + INPUTVAL_item +  `</td>
            <td data-label="Taglia">` + INPUTVAL_size +  `</td>
            <td data-label="Prezzo acquisto">` + String(INPUTVAL_purchasecost) +  `</td>
            <td data-label="Prezzo stock attuale">` + "TODO" + `</td>
            <td data-label="Vendita indicativa">` + "TODO"  + `</td>
            <td data-label="Vendita indicativa">` + "TODO"  + `</td>
            <td data-label="tags">` + INPUTVAL_tags  + `</td>
            <td data-label="Link StockX">` + INPUTVAL_stockx_link +  `</td>
            <td>
                <button class="btn btn-warning" style="max-width: 100%;" onclick="modify_item(this)">🖊</button>
                <hr>
                <button class="btn btn-danger" style="max-width: 100%;" onclick="delete_item(this)">✘</button>
            </td>
        </tr>`
    );

    //clear the form
    $item.val("");
    $size.val("");
    $purchasecost.val("");
    $stockx_link.val("");
    $tags.val("");

    //save on the local storage
    save();

    //form is closed
    $form.removeClass("add-item-form--active");
})

//persist the table to local storage
function save(){
    localStorage.setItem("items", $tablebody.html() );
}

//retrieve the table from local storage
function retrieve(){
    return localStorage.getItem("items").trim();
}

//retrieve and appends to table
function load(){
    table_data = retrieve();
    $tablebody.append(table_data);
}

//retrieve the table from specified file.
//this function is invoked when #table-import-input value is changed.
//.data file is expected (see form description)
function retrieve_from_file(caller){
    var file = caller.files[0];
    var reader = new FileReader();

    //read the file
    reader.readAsText(file);

    //when the file is read
    reader.onload = function(){
        //get the data
        var data = reader.result.trim();
        //clear the table
        $tablebody.html("");
        //append the data to the table
        $tablebody.append(data);
        //save the data to local storage
        save();
    };


}

//TO DO
function export_to_file(caller){
    const target = $("#to-export-file-input");
    filename = target.val() + ".data";

    //current table data is saved on local storage
    save()
    //retrieved data is send to server, asking to write on a file
    table_data = retrieve()
    console.log(table_data)

    //TO DO - post request to server

}

//delete an item from the table
function delete_item(caller){
     /*
        the hierarchy tr->td->button is considered
        where "button" is the caller.
        (see #main-table last column)

        A confirmation is asked, 
        if the user is not sure then the deletion is aborted.
    */
    if (!confirm("Sicuro?"))    return;
    caller.parentNode.parentNode.remove();
    
    save();
}

//modify an item from the table
function modify_item(caller){
    $modify_form.toggleClass("modify-item-form--active");

    //get the item values
    $item = $(caller).parent().parent().children("td:nth-child(1)");
    $size = $(caller).parent().parent().children("td:nth-child(2)");
    $purchasecost = $(caller).parent().parent().children("td:nth-child(3)");
    $stockx_link = $(caller).parent().parent().children("td:nth-child(8)");
    $tags = $(caller).parent().parent().children("td:nth-child(7)");

    //get references where to insert values
    $moditem = $("#modform-input--item");
    $modsize = $("#modform-input--size");
    $modpurchasecost = $("#modform-input--purchasecost");
    $modstockx = $("#modform-input--stockx");
    $modtags = $("#modform-input--tags");

    //values are finally inserted in the new form
    $moditem.val($item.text());
    $modsize.val($size.text());
    $modpurchasecost.val($purchasecost.text());
    $modstockx.val($stockx_link.text());
    $modtags.val($tags.text());

    $("#apply-changes-button").click( 
        //changes are applied to the table
        function(){
            $item.text($moditem.val());
            $size.text($modsize.val());
            $purchasecost.text($modpurchasecost.val());
            $stockx_link.text($modstockx.val());
            $tags.text($modtags.val());

            save();

            //table is closed
            $modify_form.removeClass("modify-item-form--active");
        }
    );
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                      ITEM STRUCTURE
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/*
    <tr style="overflow-wrap: break-word;">
        <td data-label="Prodotto">` + INPUTVAL_item +  `</td>
        <td data-label="Taglia">` + INPUTVAL_size +  `</td>
        <td data-label="Prezzo acquisto">` + String(INPUTVAL_purchasecost) +  `</td>
        <td data-label="Prezzo stock attuale">` + "TODO" + `</td>
        <td data-label="Vendita indicativa">` + "TODO"  + `</td>
        <td data-label="Vendita indicativa">` + "TODO"  + `</td>
        <td data-label="tags">` + INPUTVAL_tags  + `</td>
        <td data-label="Link StockX">` + INPUTVAL_stockx_link +  `</td>
        <td>
            <button class="btn btn-warning" style="max-width: 100%;" onclick="modify_item(this)">🖊</button>
            <hr>
            <button class="btn btn-danger" style="max-width: 100%;" onclick="delete_item(this)">✘</button>
        </td>
    </tr>
*/


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                  AJAX REQUESTS
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//wrapper function used to invoke stockx_request every n seconds
function stockx_request_autoupdate(){
    const children_itemset = $("#table-body").children();
    for(var i=0; i<children_itemset.length; i++){
        //an item "size" and "stockx reference" are taken
        const current_children = children_itemset.eq(i);

        const size = current_children.children("td:nth-child(2)").text();
        const url = current_children.children("td:nth-child(8)").text();

        stockx_request(size, url, current_children);
    }

    setTimeout(stockx_request_autoupdate, 50000);
}

//request to stockx.com
function stockx_request(size, url, itemref){

    $.ajax({
        url: "/fetch",
        data: {
            "targetsize": String(size),
            "targeturl": String(url)
        },
        type: 'GET',
        success: function(res) {
            //stock price is updated
            itemref.children("td:nth-child(4)").text(res);
        }
    });

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                  AUTOMATICALLY INVOKED
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//last session is stored
load();

//perpetual itemset iteration
stockx_request_autoupdate(refresh_time);