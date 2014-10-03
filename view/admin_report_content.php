<div class="editorbar">
    <input onclick="remove_current_template()" type="button" value="remove" class="button"/>
    <input onclick="edit_current_template()" type="button" value="edit" class="button"/></div>
<div class="book">
    <div id="information_tag"><span>XX/XX</span></div>
    <div id="displayContentEditor" class="royalSlider rsDefault">
    </div>
</div>
<script id="content_report_action_var" type="text/x-handlebars-template">
    <input id="action_remove_page-{{id}}" type="button"
           class="button"
           value="Remove"
           onclick="removepage({{id}});"/>
</script>
<script id="_normal_page" type="text/x-handlebars-template">
    <div class="page use-page-template-{{id}}">
        <div class="subpage">
            {{header}}
            <section class="printable">
                {{process_body}}
            </section>
            {{footer}}
        </div>
    </div>
</script>
<script id="_cover_page" type="text/x-handlebars-template">
    <div class="page use-page-template-{{id}}">
        <div class="subpage">
            <section class="printable">
                {{process_body}}
            </section>
        </div>
    </div>
</script>
<script id="_cable_drawing_page" type="text/x-handlebars-template">
    <div class="page use-page-template-{{id}}">
        <div class="subpage">
            {{header}}
            {{footer}}
        </div>
    </div>
</script>
<!-- section helpers -->
<script id="_footer" type="text/x-handlebars-template">
    <footer>
        <span class="left">UtilityINFO (1Call) Limited</span>
        <span class="central">{{current_page}}</span>
        <span class="right">{{month_year}}</span>
    </footer>
</script>
<!-- section helpers -->
<script id="_header" type="text/x-handlebars-template">
    <header>
        <span class="controls-row">{{report_title}}</span>

        <div class="controls-row">
            <span class="alignleft">Cable detection at Victoria Park Road, Causeway Bay</span>
            <span class="alignright">{{project_no}}</span>
        </div>
    </header>
</script>