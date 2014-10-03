<table id="stock_count_admin" class="display" cellspacing="0" width="100%">
    <thead>
    <tr>
        <th>ID</th>
        <th>Stock ID</th>
        <th>Extension</th>
        <th>Distribution</th>
        <th>Count</th>
        <th>Location ID</th>
    </tr>
    </thead>

    <tfoot>
    <tr>
        <th>ID</th>
        <th>Stock ID</th>
        <th>Extension</th>
        <th>Distribution</th>
        <th>Count</th>
        <th>Location ID</th>
    </tr>
    </tfoot>
</table>
<script id="stock_configuration_stock_location_template" type="text/x-handlebars-template">
    <div class = "display_location_group">
    <label for="location{{i}}">
        <table><tr>
        <td><input type="checkbox"  class = "vendor_checkbox" name="loc_assign[{{i}}][{{loc_id}}]" value="{{loc_id}}" id="location{{i}}"></td>
        <td id="loc_text_{{loc_id}}">{{display_text}}</td>
            </tr></table>
    </label>
    </br>
        </div>
</script>