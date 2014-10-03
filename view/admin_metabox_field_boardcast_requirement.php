<div class="rwmb-field adminsupport-wrapper cpstatus">
    <div class="rwmb-label">
        <strong><?php _e('CP response status', HKM_LANGUAGE_PACK); ?></strong>
    </div>
    <div class="rwmb-input cpboxx">
        {{html_content_cp_list}}
    </div>
</div>
<div class="grid adminsupport-wrapper cpstatus">
    <table id="cpmarketstatusgrid" class="display" cellspacing="0" width="100%">
        <thead>
        <tr>
            <th></th>
            <th>CP ID</th>
            <th>CP Name</th>
            <th>status</th>
        </tr>
        </thead>

        <tfoot>
        <tr>
            <th></th>
            <th>CP ID</th>
            <th>CP Name</th>
            <th>status</th>
        </tr>
        </tfoot>
    </table>
    <script id="action_bar_buttons" type="text/x-handlebars-template">
        <input id="action_approve-{{cp_id}}" type="button" class="button" value="Approve"
               onclick="approve({{cp_id}});"/>
        <input id="action_ignore-{{cp_id}}" type="button" class="button" value="Deny" onclick="reject({{cp_id}});"/>
        <input id="action_view_doc-{{cp_id}}" type="button" class="button" value="View BR Doc"
               onclick="reject({{cp_id}});"/>
    </script>
</div>
<div class="rwmb-field rwmb-rating-box-wrapper rating">
    <div class="rwmb-label">
        <label><?php _e('CP rating requirement', HKM_LANGUAGE_PACK); ?></label></div>
    <div class="rwmb-input">
        <select name="rating_req" id="rating_req">
            <option value="no_req"><?php _e('No requirement', HKM_LANGUAGE_PACK); ?></option>
            <option value="1"><?php _e('1 Star', HKM_LANGUAGE_PACK); ?></option>
            <option value="2"><?php _e('2 Star', HKM_LANGUAGE_PACK); ?></option>
            <option value="3"><?php _e('3 Star', HKM_LANGUAGE_PACK); ?></option>
            <option value="4"><?php _e('4 Star', HKM_LANGUAGE_PACK); ?></option>
            <option value="5"><?php _e('5 Star', HKM_LANGUAGE_PACK); ?></option>
        </select>
    </div>
</div>
<div class="rwmb-field rwmb-boardcast-box actionreports">
    <div id="misc-publishing-actions">
        <div class="boardcast_status misc-pub-section curtime misc-pub-curtime">
            <span id="nsent"><div
                    class="dashicons dashicons-megaphone"></div>Notification frequency: <b>{{nsent}}</b></span><br/>
            <span id="rsvp"><div class="dashicons dashicons-flag"></div>Responses: <b>{{response}}</b></span><br/>
            <span id="cpsent"><div class="dashicons dashicons-groups"></div>CP Notified sent: <b>{{sent_cps}}</b></span><br/>
        </div>
        <div class="clear"></div>
    </div>
</div>
<div id="cp-market-actions" class="actionbar">
    <!--<input type="hidden" name="offerjbcpid" value="{{offerjbcpid}}"/>-->
    <div id="publishing-action">
        <span class="spinner"></span>
        <input type="button"
               class="button button-primary button-large hidden"
               id="cp_offer_btn"
               value="<?php _e('Offer', HKM_LANGUAGE_PACK); ?>"/>
        <input type="button"
               class="button button-primary button-large hidden"
               id="cp_appoint_btn"
               value="<?php _e('Appoint', HKM_LANGUAGE_PACK); ?>"/>
        <input type="button"
               class="button button-primary button-large"
               id="cp_boardcast_btn"
               value="<?php _e('Boardcast', HKM_LANGUAGE_PACK); ?>"/>

    </div>
    <div class="clear"></div>
</div>
