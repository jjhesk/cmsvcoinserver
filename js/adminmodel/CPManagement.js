/**
 * Created by Hesk on 14年7月17日.
 */
var CPManagement = {};
jQuery(function ($) {
    "use strict";
    (function (d, status, interaction) {
        CPManagement = function (component_name, denpendency_container) {
            var d = this,
                metabox_el = $("#" + component_name);
            d.$denpendency_container = $("#" + denpendency_container);
            d.$container = metabox_el;
            d.stage_1_action_bar = Handlebars.compile($("#action_stage_one", d.$container).html());
            d.stage_2_action_bar = Handlebars.compile($("#action_stage_two", d.$container).html());
            d.$spinner = $("#publishing-action .spinner", metabox_el);
            d.$offerbtn = $("#cp_offer_btn", metabox_el);
            d.offered_cpid = $("#offerjbcpid");
            d.job_status_box = $("#odk_jobstatus");
            d.$boardcast = $("#cp_boardcast_btn", metabox_el)
            d.$boxx = $(".cpboxx", metabox_el);
            d.$radios = $("input[type=radio]", metabox_el);
            d.$marketaction = $("#cp-market-actions", metabox_el);
            // d.$field_offer_cp = $("input[name=offerjbcpid]");
            d.$table = $("#cpmarketstatusgrid", metabox_el);
            d.$ratingbox = $("#rating_req", metabox_el);
            d.interaction = interaction;
            //   this.$offered_cp_val = this.$field_offer_cp.val();
            d.boardcasted_query = "http://onecallapp.imusictech.net/api/staffcontrol/get_ordered_cps/?job_post_id=" + jp_status.post_id;
            d.board_list_all_available_cp = "http://onecallapp.imusictech.net/api/staffcontrol/get_ordered_cps/?showall=1";
            d.$container.data('boardcast', this);
            d.init();
        };
        CPManagement.prototype = {
            init: function () {
                var d = this,
                    jobstatus = $("select option:selected", d.$denpendency_container).val(),
                    isEnable = jobstatus == 'open' || jobstatus == 'close',
                    isHired = $("option:selected", d.job_status_box).val() == 'hired',
                    offered_cp_id = parseInt(d.offered_cpid.val())
                    ;
                MetaBoxSupport.InputControlSingle(d.job_status_box, true);
                console.log("CPManagement init");
                console.log(isHired);
                if (isHired || offered_cp_id > 0) {
                    console.log("CPManagement hired");
                    $(".inside .rwmb-meta-box", d.$container).hide();
                    $(".rwmb-meta-box", d.$container).after("CP is hired. CP ID: " + offered_cp_id);

                    return false;
                } else {
                    if (offered_cp_id > 0) {
                        d.$marketaction.hide();
                    } else {
                        d.$marketaction.show();
                        d.$boardcast
                            .off(d.interaction)
                            .on(d.interaction, {$that: d, enabled: isEnable}, function (e) {
                                d.notify(e);
                            });
                    }
                    console.log("CPManagement dataTable");
                    d.$table.dataTable({
                        processing: true,
                        ajax: offered_cp_id > 0 ? d.boardcasted_query : d.board_list_all_available_cp,
                        fnRowCallback: function (nRow, full, iDisplayIndex, iDisplayIndexFull) {
                            $(nRow).attr("id", 'nm' + full.cp_id);
                            return nRow;
                        },
                        initComplete: function (settings, json) {
                            var ID = parseInt(d.offered_cpid.val());
                            if (ID > 0)
                                d.assign_action_table(ID);
                        },
                        columns: [
                            {
                                class: "details-control",
                                orderable: false,
                                render: function (data, type, full, meta) {
                                    var h = full;
                                    h.url = "http://onecallapp.imusictech.net/wp-admin/user-edit.php?user_id=" + h.cp_id;
                                    h.javascript_action = "javascript:BOARDCAST_METABOX.assign(" + h.cp_id + ")";
                                    var html = d.stage_1_action_bar(h);
                                    return html;
                                }
                            },
                            { data: "cp_id" },
                            { data: "cpname" },
                            /* {
                             class: "display-cpname",
                             orderable: false,
                             render: function (data, type, full, meta) {
                             return full.cpname + '<a class="button" ' +
                             'target="_BLANK"' +
                             'href="http://onecallapp.imusictech.net/wp-admin/user-edit.php?user_id=' + full.cp_id + '">view profile</a>';
                             }
                             },*/
                            {
                                class: "display-status",
                                orderable: true,
                                render: function (data, type, full, meta) {
                                    //  console.log(full);
                                    if (full.status == "RES_NONE")
                                        return "not responsed";
                                    else if (full.status == "RES_YES") {
                                        return "assigned";
                                    }
                                    else {
                                        return full.status;
                                    }
                                }
                            }
                        ]
                    });
                }
                // this.$offerbtn.hide();
                //  d.$radios.on("change", {$that: d}, d.onCheckCP);
                /*    this.$field_offer_cp.on(interaction, {$that: that}, function (e) {
                 console.log(that.$radios.checked());
                 });*/
                // http://onecallapp.imusictech.net/wp-admin/user-edit.php?user_id=50
                // console.log(d.board_list_all_available_cp);
            },
            setInterval: function (time) {
                var d = this;
                setInterval(function () {
                    d.$table.fnReloadAjax();
                }, time);
            },
            onCheckCP: function (e) {
                console.log("selected");
                e.preventDefault();
                var $this = $(this),
                    that = e.data.$that,
                    val = $this.val(),
                    cpid = that.offered_cpid;
                if (cpid.val() == "") {
                    that.$offerbtn.removeClass("hidden").on(interaction, {$that: that}, function (e) {
                        console.log("first offer");
                        cpid.val(val);
                        return false;
                    });
                } else {
                    alert("the previous offer will be remove and it will place the new offer to the new selected CP");
                    that.$offerbtn.removeClass("hidden").on(interaction, {$that: that},function (e) {
                        console.log("renew the offer");
                        cpid.val(val);
                        return false;
                    }).val("Renew Offer");
                }
            },
            jax: function (data, callback) {
                var d = this;
                $.post(ajaxurl, data, function (response) {
                    if (response.result == 'success') {
                        if ($.type(response.obtain) === 'object') {
                            d.$container.trigger(callback, [response.obtain]);
                        } else {
                            d.$container.trigger(callback);
                        }
                    }
                    d.loadui(false);
                });
            },
            notify: function (e) {
                e.preventDefault();
                var d = e.data.$that
                    , requirement = $("select#rating_req option:selected", d.$container).val()
                    , isnoreq = requirement == 'no_req'
                    , isHired = $("option:selected", d.job_status_box).val() == 'hired'
                    ;
                if (isHired) {
                    alert("the CP is hired and assigned.");
                } else if (!isnoreq) {
                    d.loadui(true);
                    d.jax({
                        action: "boardcast_cp",
                        requirement: requirement,
                        job_id: status.post_id
                    }, 'notify_cp_response');
                    d.$container.on('notify_cp_response', function (e, obtain) {
                        d.$boxx.html(new String(obtain.html));
                        $("#nsent b", d.$container).html(obtain.nsent);
                        $("#rsvp b", d.$container).html(obtain.rsvp);
                        d.$radios.on("change", d.onCheckCP);
                        alert("this job post is done and notified the related CPs.");
                    });
                    console.log("action enqueued");
                    d.$table.fnReloadAjax();
                } else {
                    alert("cannot be no requirement on the CP selection range.");
                }
            },
            loadui: function (bool) {
                //  var $spinner = $("#publishing-action .spinner", this.$container);
                if (bool)this.$spinner.fadeIn(); else this.$spinner.fadeOut();
            },
            assign: function (cpid) {
                var d = this, name_row = "#nm" + cpid,
                    t = $(name_row), row = d.$table.dataTable().api().row(t), json = row.data(), before = parseInt(d.offered_cpid.val());
                if (before === cpid) {
                    console.log("part 3 .. no change .. " + before);
                } else if (before === -1) {
                    d.offered_cpid.val(cpid);
                    d.$container.trigger("assign_cp_id", [cpid, json]);
                    d.assign_action_table(cpid);
                    // change the status
                    $("#odk_cp_name").val(json.cpname);
                    d.loadui(true);
                    d.jax({
                        action: "assign_job_to_cp",
                        cp_id: cpid,
                        job_id: status.post_id
                    }, 'response_assign_cp');
                    d.$container.on('response_assign_cp', function (e) {
                        $("#work_status_virtual").val(2);
                        alert("This Job has successfully assigned to CP ID:" + d.offered_cpid.val());
                        MetaBoxSupport.doSelect(d.job_status_box, 'hired');
                        MetaBoxSupport.InputControlEach(d.job_status_box, false);
                    });
                } else {
                    alert("Job has already assigned.")
                }
            },
            assign_action_table: function (cpid) {
                var d = this, name_row = "#nm" + cpid,
                    t = $(name_row), row = d.$table.dataTable().api().row(t),
                    $row = $("#nm" + cpid, d.$table),
                    $item = $("#control-" + cpid + " .assign", d.$table),

                    $drow = d.$table.$('tr.selected'),
                    $input = $(".assign", $drow);
                // var $item_used = d.$listtable.$('tr.selected input');
                $input.removeClass("disabled").prop("disabled", false);
                $drow.removeClass('selected');
                $item.addClass("disabled").prop("disabled", true);
                $row.addClass("selected");
            },
            setDirectHireListener: function (callback) {
                var d = this;
                d.$container.on('assign_cp_id', function (e, cpID, cpdata) {
                    callback(e, cpID, cpdata);
                });
            },
            setPostHireListener: function (callback) {
                var d = this;
                d.$container.on('post_job', function (e, that) {
                    callback(e, that);
                });
            }
        }
    }(document, jp_status, "click tap touch"));
});