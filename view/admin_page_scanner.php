<div class="log_menu tablenav top">
    <button class="x1 button">Recent unscanned items</button>
    <button class="x2 button">Look Up</button>
    <button class="x3 button">Find By Vendor Issued</button>
    <button class="x4 button">Most Popular Items</button>
    <button class="x5 button">QR Search</button>
    <button class="x6 button">Search</button>
</div>
<table id="page_admin_scanner" class="display" cellspacing="0" width="100%">
    <thead>
    <tr>
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

<script id="_normal_page" type="text/x-handlebars-template">
    <span>Product name and extension:</span><p>name {{name}}... extension {{extension_label}}... </p>
    <span>phone QR: {{qr_b}}</span><br>
    <img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl={{qr_b}}&choe=UTF-8"/>
    <span>email QR: {{qr_a}}</span><br>
    <img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl={{qr_a}}&choe=UTF-8"/>
    <span>vendor provide QR: {{qr_c}}</span><br>
    <img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl={{qr_c}}&choe=UTF-8"/>

    <span>checkbox?  User Obtained This Item: yes / no     </span>

    <button>Obtain to No/Yes</button>
    <!-- <select>
         <option>ADMIN</option>
         <option>ID</option>
         <option>QR</option>
         <option>NA</option>
     </select>-->
    <!-- action_taken_by -- >



    <!-- action_taken_by -- >
    <button>change action to</button>

</script>