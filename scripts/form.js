//reference to table body section, in order to append childrens
//also, its childrens (the items) are saved in local storage and
//can be retrieved 
$tablebody = $("#table-body");
//form section, used to insert a new item
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

/*
  <!-- Add item form -->
    <form class="add-item-form" style="text-align: center;">

        <!-- deleteItemButton style is used to mean unshow-form button in this case -->
        <div class="form-group">
            <button class="genericButton deleteItemButton" id="unshow-button" type="button"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg> </button>
        </div>

        <div class="form-group">
            <label for="form-input--item">Prodotto</label>
            <input type="text" class="form-control" id="form-input--item" placeholder="Prodotto">
        </div>
        <div class="form-group">
            <label for="form-input--size">Taglia</label>
            <input type="text" class="form-control" id="form-input--size" placeholder="Taglia">
        </div>
        <div class="form-group">
            <label for="form-input--purchasecost">Prezzo acquisto</label>
            <input type="text" class="form-control" id="form-input--purchasecost" placeholder="Prezzo d'acquisto">
        </div>
        <div class="form-group">
            <label for="form-input--stockx">Link StockX</label>
            <input type="text" class="form-control" id="form-input--stockx" placeholder="www.stockx.com">
        </div>
        <div class="form-group">
            <label for="form-input--sku">SKU</label>
            <input type="text" class="form-control" id="form-input--sku" placeholder="SKU">
        </div>
        <div class="form-group">
            <label for="form-input--tags">Tags</label>
            <input type="text" class="form-control" id="form-input--tags" placeholder="Tag associati">
        </div>
    
        <div class="form-group">
           <button class="genericButton confirmationButton" id="add-button" type="button"> <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24"><path style="fill: #4CAF50;" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/></svg> </button>
        </div>
      </form>
   
*/