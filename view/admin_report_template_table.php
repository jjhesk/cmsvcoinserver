<div class="grid adminsupport-wrapper cpstatus">
    <table id="report_template_list_tb" class="display" cellspacing="0" width="100%">
        <thead>
        <tr>
            <th></th>
            <th>Name</th>
            <th>Cate.</th>
            <th>ID</th>
        </tr>
        </thead>

        <tfoot>
        <tr>
            <th></th>
            <th>Name</th>
            <th>Cate.</th>
            <th>ID</th>
        </tr>
        </tfoot>
    </table>
    <script id="action_bar_buttons" type="text/x-handlebars-template">
        <input id="action_addpage-{{id}}"
               type="button"
               onclick="template_controller.click_function_add_page({{id}});"
               class="button addpagebutton"
               value="Add Page"/>
    </script>
    <script id="button_image" type="text/x-handlebars-template">
        <a id="basemap-{{attachmentid}}"
           class="button" target="_BLANK" href="{{pointer_url}}">{{attachmentid}}</a>
    </script>
</div>
<div class="rwmb-field rwmb-text-wrapper">
    <div class="rwmb-label">
        <label for="drawmap">draw maps</label></div>
    <div class="rwmb-input drawmapbuttons">

    </div>
</div>
<div class="rwmb-field rwmb-text-wrapper">
    <div class="rwmb-label">
        <label for="site-photo">site photos</label></div>
    <div class="rwmb-input sitephotobuttons">

    </div>
</div>