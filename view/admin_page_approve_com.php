<table id="table_incoming_companoes" class="display" cellspacing="0" width="100%">
    <thead>
    <tr>
        <th></th>
        <th>BR No.</th>
        <th>Company Name</th>
        <th>Contact Name</th>
        <th>Contact Email</th>
        <th>Reps</th>
        <th>Remark</th>
    </tr>
    </thead>

    <tfoot>
    <tr>
        <th></th>
        <th>BR No.</th>
        <th>Company Name</th>
        <th>Contact Name</th>
        <th>Contact Email</th>
        <th>Reps</th>
        <th>Remark</th>
    </tr>
    </tfoot>
</table>
<script id="action_bar_buttons" type="text/x-handlebars-template">
    <input id="action_approve-{{lid}}" type="button" class="button" value="Approve" onclick="approve({{lid}});"/>
    <input id="action_ignore-{{lid}}" type="button" class="button" value="Deny" onclick="reject({{lid}});"/>
    <input id="action_view_doc-{{lid}}" type="button" class="button" value="View BR Doc" onclick="viewdoc({{lid}});"/>
</script>
<script id="view_pdf_company_br" type="text/x-handlebars-template">
    <span>{{brno}}</span>
<!--    <a id="action_view_pdf-{{lid}}"
           class="button"
           value="pdf BR Doc"
           href="{{copy_br}}">view Doc</a>-->
</script>