//reference to table body section, in order to append childrens
//also, its childrens (the items) are saved in local storage and
//can be retrieved 
$tablebody = $("#table-body");
//form used to insert a new item
$form = $(".add-item-form");

//add-item form visibility toggling
$("#show-button, #unshow-button").click(function(){
    $form.toggleClass("add-item-form--active");
})

//example of item insertion
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
        `<tr>
            <td data-label="Prodotto">` + INPUTVAL_item +  `</td>
            <td data-label="Taglia">` + INPUTVAL_size +  `</td>
            <td data-label="Prezzo acquisto">` + String(INPUTVAL_purchasecost) +  `</td>
            <td data-label="Prezzo stock attuale">` + "TODO" + `</td>
            <td data-label="Vendita indicativa">` + "TODO"  + `</td>
            <td data-label="SKU">` + INPUTVAL_sku  + `</td>
            <td data-label="tags">` + INPUTVAL_tags  + `</td>
            <td>
                <button class="button-edit">Modifica</button>
                <button class="button-delete" onclick="delete_item(this)">Elimina</button>
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

//to do
//load-file menu toggling

//load from filename


//---------------------
//automatically invoked section
//---------------------

//last session is stored
retrieve();