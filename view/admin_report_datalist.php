<script id="action_bar_return_submission" type="text/x-handlebars-template">
    <input id="ActionSubmit-{{ID}}"
           type="button"
           onclick="data_submit_list_controller.pickData({{ID}});"
           class="button addpagebutton"
           value="Use"/>
</script>
<div class="grid adminsupport-wrapper">
    <table id="return_submission_list" class="display" cellspacing="0" width="100%">
        <thead>
        <tr>
            <th></th>
            <th>Revision Number</th>
            <th>Submission Time</th>
        </tr>
        </thead>
        <tfoot>
        <tr>
            <th></th>
            <th>Revision Number</th>
            <th>Submission Time</th>
        </tr>
        </tfoot>
    </table>
</div>