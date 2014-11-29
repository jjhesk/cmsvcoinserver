<table id="stock_count_admin" class="display" cellspacing="0" width="100%">
    <thead>
    <tr>
        <th>Select</th>
        <th>ID</th>
        <th>Features</th>
        <th>Count</th>
        <th>Location Name</th>
    </tr>
    </thead>

    <tfoot>
    <tr>
        <th>Select</th>
        <th>ID</th>
        <th>Features</th>
        <th>Count</th>
        <th>Location Name</th>
    </tr>
    </tfoot>
</table>

<script id="add_stock_count_template" type="text/x-handlebars-template">
    <div class="tablenav top">
        <div class="alignleft actions add_stock_count">
            {{{selection}}}
            <input type="number" id="new_count" placeholder="Enter the new count input">
            <input class="button" type="button" id="add_stock_count" value="add stock count">
        </div>
    </div>
</script>
<script id="extension_tag_template" type="text/x-handlebars-template">
    <div class="tag"><span>#</span>{{extension_string}}</div>
</script>
<script id="tool_bar_stock_operation" type="text/x-handlebars-template">
    <input type="checkbox" class="vendor_checkbox" name="loc_assign[{{i}}][{{loc_id}}]" value="{{loc_id}}"
           id="location{{i}}">
</script>
<script id="stock_configuration_stock_location_template" type="text/x-handlebars-template">
    <div class="display_location_group">
        <label for="location{{i}}">
            <table>
                <tr>
                    <td><input type="checkbox" class="vendor_checkbox" name="loc_assign[{{i}}][{{loc_id}}]"
                               value="{{loc_id}}" id="location{{i}}"></td>
                    <td id="loc_text_{{loc_id}}">{{display_text}}</td>
                </tr>
            </table>
        </label>
        </br>
    </div>
</script>
<script id="extensionbox_tp1" type="text/x-handlebars-template">
    <th>
        <span class="label-primary">{{label_new_name}}</span>
        <input type="button" value="X" class="rwmb-button button-primary remove_attribute tag"/>
        <!-- <div class="tabs-panel">
             <input class="rwmb-text tag" id="new_tag_name" class="{{cid}}" type="text"/>
             <input type="button" value="+" id="add_tag" class="rwmb-button button-primary add-clone tag"/></div>-->
        <!--  <span class="description">To add more tags please enter from here</span>-->
    </th>
    <td>
        <div class="btn-grou" data-tags-input-name="{{id}}" id="tag-{{id}}"></div>
    </td>
</script>
<script id="extensionbox_tp2" type="text/x-handlebars-template">
    {{tag}}
    <div>x</div>
</script>

<script id="extensionbox_tp3" type="text/x-handlebars-template">
    <div id="extensionbox">
        <p>
            Add your Extension in here.
        </p>
        <table class="form-table">
            <tbody class="container">
            <tr id="add_attribute">
                <th>New Attribute Name <br><span
                    class="description">Please enter attributes such as Type, Size,Feature</span></th>
                <td><input class="rwmb-text attribute" id="new_attr_name" type="text"/>
                    <input type="button" value="+"
                           id="add_btn_attribute" class="rwmb-button button-primary add-clone attribute"/></td>
            </tr>
            </tbody>
        </table>

        <div class="form-control"><input class="button generate-final confirm button-primary" type="button"
                                         value="generate extension schema"/></div>
    </div>
</script>