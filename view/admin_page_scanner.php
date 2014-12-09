<div class="log_menu tablenav top">
    <button class="x1 button" data-sort="unscanned">Recent unscanned items</button>
    <button class="x2 button" data-sort="all">All</button>
</div>

<table id="page_admin_scanner" class="display" cellspacing="0" width="100%">
    <thead>
    <tr>
        <th>Details</th>
        <th>ID</th>
        <th>Trans</th>
        <th>VStatus</th>
        <th>Dist</th>
        <th>Action</th>
        <th>User</th>
        <th>Stock ID</th>
    </tr>
    </thead>

    <tfoot>
    <tr>
        <th>Details</th>
        <th>ID</th>
        <th>Trans</th>
        <th>VStatus</th>
        <th>Dist</th>
        <th>Action</th>
        <th>User</th>
        <th>Stock ID</th>
    </tr>
    </tfoot>
</table>
<table id="admin_scan_details_table" class="form-table">
</table>
<script id="scan_details_template" type="text/x-handlebars-template">
    <tr>
        <th>Extension</th>
        <td>{{extension}}</td>
    </tr>
    <tr>
        <th>Phone QR</th>
        <td class="qr_row">
            <button class="button toggle_qr hide">Show QR Code</button>
            <img class="hidden" style="margin-left: 50px;"
                 src='https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl={{phone_qr}}&choe=UTF-8'/></td>
    </tr>
    <tr>
        <th>Email QR</th>
        <td class="qr_row">
            <button class="button toggle_qr hide">Show QR Code</button>
            <img class="hidden" style="margin-left: 50px;"
                 src='https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl={{email_qr}}&choe=UTF-8'/></td>
    </tr>
    <tr>
        <th>Vendor Provide QR</th>
        <td class="qr_row">
            <button id="toggle_vendor_qr " class="button toggle_qr hide">Show QR Code</button>
            <span style="margin-left: 50px;" id="vendor_qr"></span></td>
    </tr>
    <tr>
        <th>Obtain</th>
        <td><input class="hidden_field_switcher" type="hidden" name="obtain_status" id="obtain_store_val" value=""/>

            <div class="container">
                <label class="switch">
                    <input type="checkbox" id="obtain_status" class="switch-input">
                    <span class="switch-label" data-on="1" data-off="0" id="obtain_loader"></span>
                    <span class="switch-handle"></span>
                </label>
            </div>
        </td>
    </tr>
    <tr>
        <th>Action Taken By</th>
        <td>
            <div id="action_taken_by">{{action}}</div>
        </td>
    </tr>
    <tr>
        <th>Product Name</th>
        <td>
            <div id="product_name">{{product_name}}</div>
        </td>
    </tr>
    <tr>
        <th>Ext.</th>
        <td>
            <div id="ext_name">{{ext_name}}</div>
        </td>
    </tr>
    <tr>
        <th>Mac</th>
        <td>
            <div id="mac_address">{{mac}}</div>
        </td>
    </tr>
    <tr>
        <th>User ID</th>
        <td>
            <div id="user_id">{{user_id}}</div>
        </td>
    </tr>
    <tr>
        <th>Image</th>
        <td>
            <div id="thumb"><img src="{{thumb}}"/></div>
        </td>
    </tr>
    <tr>
        <th></th>
        <td>
            <button id="back" class="button">Back</button>
        </td>
    </tr>
</script>

<script id="show_details_template" type="text/x-handlebars-template">
    <button class="button view_details" data-id="{{ID}}">Show Details</button>
</script>

<script id="vendor_qr_template" type="text/x-handlebars-template">
    <img class="hidden" src='https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl={{vendor_qr}}&choe=UTF-8'/>
</script>