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
    $sku = $("#form-input--sku");
    $tags = $("#form-input--tags");

    try{
        //get the values
        INPUTVAL_item = $item.val();
        INPUTVAL_size = $size.val();
        INPUTVAL_purchasecost = parseInt($purchasecost.val());
        INPUTVAL_stockx_link = $stockx_link.val();
        INPUTVAL_sku = $sku.val();
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
            <td data-label="Link StockX">` + INPUTVAL_stockx_link +  `</td>
            <td data-label="SKU">` + INPUTVAL_sku  + `</td>
            <td data-label="tags">` + INPUTVAL_tags  + `</td>
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
    $sku.val("");
    $tags.val("");

    save();
})

//persist the table to local storage
function save(){
    localStorage.setItem("items", JSON.stringify($tablebody.html()) );
}

//retrieve the table from local storage
function retrieve(){
    table_data = JSON.parse(localStorage.getItem("items")).trim();
    $tablebody.append(table_data);
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
    $stockx_link = $(caller).parent().parent().children("td:nth-child(6)");
    $sku = $(caller).parent().parent().children("td:nth-child(7)");
    $tags = $(caller).parent().parent().children("td:nth-child(8)");

    //get references where to insert values
    $moditem = $("#modform-input--item");
    $modsize = $("#modform-input--size");
    $modpurchasecost = $("#modform-input--purchasecost");
    $modstockx = $("#modform-input--stockx");
    $modsku = $("#modform-input--sku");
    $modtags = $("#modform-input--tags");

    //values are finally inserted in the new form
    $moditem.val($item.text());
    $modsize.val($size.text());
    $modpurchasecost.val($purchasecost.text());
    $modstockx.val($stockx_link.text());
    $modsku.val($sku.text());
    $modtags.val($tags.text());

    $("#apply-changes-button").click( 
        //changes are applied to the table
        function(){
            $item.text($moditem.val());
            $size.text($modsize.val());
            $purchasecost.text($modpurchasecost.val());
            $stockx_link.text($modstockx.val());
            $sku.text($modsku.val());
            $tags.text($modtags.val());

            save();
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
        <td data-label="Vendita indicativa">` + INPUTVAL_stockx_link + `</td>
        <td data-label="SKU">` + INPUTVAL_sku  + `</td>
        <td data-label="tags">` + INPUTVAL_tags  + `</td>
        <td>
            <button class="btn btn-warning" style="max-width: 100%;" onclick="modify_item(this)">🖊</button>
            <hr>
            <button class="btn btn-danger" style="max-width: 100%;" onclick="delete_item(this)">✘</button>
        </td>
    </tr>
*/


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                  AUTOMATICALLY INVOKED
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//last session is stored
retrieve();