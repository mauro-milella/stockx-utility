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
const refresh_time = 3000;
const timer = ms => new Promise( (res) => setTimeout(res, ms) )


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
    $indicativesell = $("#form-input--indicativesell");
    $stockx_link = $("#form-input--stockx");
    $tags = $("#form-input--tags");

    try{
        //get the values
        INPUTVAL_item = $item.val();
        INPUTVAL_size = $size.val();
        INPUTVAL_purchasecost = parseInt($purchasecost.val());
        INPUTVAL_indicativesell = $indicativesell.val();
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
        <td data-label="Vendita indicativa">` + INPUTVAL_indicativesell  + `</td>
        <td data-label="tags">` + INPUTVAL_tags  + `</td>
        <td data-label="Link StockX">  <a href=` + INPUTVAL_stockx_link + ` target=_blank >url</a> </td>
        <td style="padding: 0;">
            <button class="btn btn-dark operator" onclick="fetch_item(this)">↻</button>
            <button class="btn btn-warning operator" onclick="modify_item(this)">🖊</button>
            <button class="btn btn-danger operator" onclick="delete_item(this)">✘</button>
        </td>
        </tr>`
    );

    //clear the form
    $item.val("");
    $size.val("");
    $purchasecost.val("");
    $indicativesell.val("");
    $stockx_link.val("");
    $tags.val("");

    //save on the local storage
    save();

    //form is closed
    $form.removeClass("add-item-form--active");
})

//removes all occurences of a string set, from a string
function clean_string(target, ...args){
    for(var i = 0; i < args.length; i++){
        target = target.replace(args[i], "");
    }
    return target;
}

//persist the table to local storage
function save(){
    //get the table data and clean it
    let td = $tablebody.html();
    td = clean_string(td, "table-success", "table-danger");
    //setting
    localStorage.setItem("items", td );
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
    $indicativesell = $(caller).parent().parent().children("td:nth-child(6)");
    $stockx_link = $(caller).parent().parent().children("td:nth-child(8)");
    $tags = $(caller).parent().parent().children("td:nth-child(7)");

    //get references where to insert values
    $moditem = $("#modform-input--item");
    $modsize = $("#modform-input--size");
    $modpurchasecost = $("#modform-input--purchasecost");
    $modindicativesell = $("#modform-input--indicativesell");
    $modstockx = $("#modform-input--stockx");
    $modtags = $("#modform-input--tags");

    //values are finally inserted in the new form
    $moditem.val($item.text());
    $modsize.val($size.text());
    $modpurchasecost.val($purchasecost.text());
    $modindicativesell.val($indicativesell.text());
    $modstockx.val($stockx_link.children("a").attr("href"));    //get $stockx_link href attribute
    $modtags.val($tags.text());

    $("#apply-changes-button").click( 
        //changes are applied to the table
        function(){
            $item.text($moditem.val());
            $size.text($modsize.val());
            $purchasecost.text($modpurchasecost.val());
            $indicativesell.text($modindicativesell.val());
            $stockx_link.children("a").attr("href", $modstockx.val());
            $tags.text($modtags.val());

            save();

            //table is closed
            $modify_form.removeClass("modify-item-form--active");
        }
    );
}

//attached to an input "oninput" function
//table is filtered looking for a matching between input content and something in some row.
//matching is done considering everything as a lower case function.
function research(caller){
    //string to search in each row
    const pattern = caller.value.toLowerCase();

    //search in each row
    $("#table-body tr").each(function(){
        //get the row
        var $row = $(this);
        //search in each children
        $row.each(function(){
            var $text = $(this).text().toLowerCase();
            if($text.includes(pattern)) $row.show();
            else                        $row.hide();
            return;
        })
    });
}

//used to show the request status in a specific row
//usage example: row_notification(row_reference, "table-success", 5000)
function row_notification(itemref, classname, timeout){
    $(itemref).addClass(classname);
    //Infinity is used to keep error codes visible
    if(timeout == Infinity) return;
    setTimeout(function(){
        $(itemref).removeClass(classname);
    }, timeout);
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

//fetch_item (to fetch item data) -> stockx_request -> update_item
function fetch_item(caller){
    //row reference
    const row = $(caller).parent().parent();

    //payload
    const size = row.children("td:nth-child(2)").text();
    const url = row.children("td:nth-child(8)").children("a").attr("href");

    //request started
    stockx_request(size, url, row);
}

//request to stockx.com
function stockx_request(size, url, itemref){
    $.ajax({
        url: "/fetch",
        type: 'GET',
        data: {
            "targetsize": String(size),
            "targeturl": String(url)
        },
        success: function(res) {
            const res_tokens = res.split(" ");
            const lastSale = res_tokens[0];
            const highestBid = res_tokens[1];
            
            //stock price is updated
            update_item(itemref, lastSale, highestBid);
        },
        error: function(err) {
            row_notification(itemref, "table-danger", Infinity);
        }
    });
}

//itemref is a table row
//this function is only invoked after a successful request to stockx.com
function update_item(itemref, lastSale, highestBid){
    itemref.children("td:nth-child(4)").text(lastSale);
    let hb = parseFloat(0.88*highestBid - 5).toFixed(2);
    itemref.children("td:nth-child(5)").text(hb);

    save();

    //success notifiation
    row_notification(itemref, "table-success", 5000);
}

function export_table(caller){
    const target = $("#to-export-file-input");
    filename = target.val();
    if(filename === "") return;

    filename = filename + ".data";

    //current table data is saved on local storage
    save()

    //asking to write on a file (server will get the table from local storage)
    const content = localStorage.getItem("items").trim();
    $.ajax({
        url: "/export",
        type: 'POST',
        dataType: 'json',
        contentType : 'application/json',
        data: JSON.stringify({target: String(filename), data: String(content)}),
    });

    //file is downloaded
    try{
        window.open("/download/" + filename);
    }
    catch(err){
        console.log(err)
    }

    target.val("");
}

async function perpetual_update(){
    let current_children = $("#table-body").children().eq(0);

    while(current_children != undefined){
        //an item "size" and "stockx reference" are taken
        const size = current_children.children("td:nth-child(2)").text();
        const url = current_children.children("td:nth-child(8)").children("a").attr("href");

        //request are slowly send to avoid ban
        stockx_request(size, url, current_children);

        await timer(refresh_time);
        current_children = current_children.next();
        console.log(current_children);
    }
    //await timer(refresh_time);
    setTimeout(perpetual_update, refresh_time);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                  AUTOMATICALLY INVOKED
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//last session is stored
load();
//perpetual_update();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                  DEPRECATED
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//wrapper function used to invoke stockx_request every n seconds
function stockx_request_autoupdate(){
    const children_itemset = $("#table-body").children();
    for(var i=0; i<children_itemset.length; i++){
        //an item "size" and "stockx reference" are taken
        const current_children = children_itemset.eq(i);

        const size = current_children.children("td:nth-child(2)").text();
        const url = current_children.children("td:nth-child(8)").children("a").attr("href");

        stockx_request(size, url, current_children);
    }

    setTimeout(stockx_request_autoupdate, 50000);
}