<script id="action_stage_one" type="text/x-handlebars-template">
    <div id="control-{{cp_id}}">
        <a class="button view"
           target="_BLANK"
           href="{{url}}">view profile</a>
        <a class="button assign" data-click="{{cp_id}}" onclick="{{javascript_action}}">Appoint</a>
    </div>
</script>
<script id="action_stage_two" type="text/x-handlebars-template">
    <div id="control-{{cp_id}}">
        {{cp_name}}
    </div>
</script>