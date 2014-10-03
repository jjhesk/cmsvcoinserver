/**
 * Created by hesk on 7/12/14.
 */
var ListSubmission = {};
jQuery(function ($) {
    ListSubmission = function (component_name, original_job_id, loaded_submission_id) {
        this.$container = $("#" + component_name);
        this.actionsTemplate = Handlebars.compile($("#action_bar_return_submission").html());
        // original_job_id = 761
        // this.original_job_id = 761;

        console.log("original_job_id:" + original_job_id);
        this.original_job_id = parseInt(original_job_id) > 0 ? parseInt(original_job_id) : -1;
        this.submission_id = parseInt(loaded_submission_id) > 0 ? parseInt(loaded_submission_id) : -1;
        this.$listtable = $("#return_submission_list");
        if (original_job_id > 1) {
            this.TableInit();
        } else {
            console.log("job id is not binded");
        }
        this.$container.data("ListSubmission", this);
    };
    ListSubmission.prototype = {
        TableInit: function () {
            var d = this;
            d.$listtable.dataTable({
                processing: true,
                ajax: "http://onecallapp.imusictech.net/api/staffcontrol/get_submission_list_cms/?jobid=" + d.original_job_id,
                columns: [
                    {
                        class: "details-control",
                        orderable: false,
                        render: function (data, type, full, meta) {
                            var template = d.actionsTemplate(full);
                            return template;
                        }
                    },
                    { data: "ID" },
                    { data: "upload_stamp" }
                ],
                fnRowCallback: function (nRow, full, iDisplayIndex, iDisplayIndexFull) {
                    $(nRow).attr("id", 'nm' + full.ID);
                    return nRow;
                },
                fnDrawCallback: function (oSettings) {
                    // alert('DataTables has redrawn the table');
                },
                initComplete: function (settings, json) {
                    if (d.submission_id > 0) {
                        d.pickData(d.submission_id);
                    }
                },
                iDisplayLength: 6
            });
        },
        pickData: function (submission_ID) {
            var d = this, name_row = "#nm" + submission_ID, t = $(name_row), row = d.$listtable.dataTable().api().row(t), json = row.data()
            var $item = $("#ActionSubmit-" + submission_ID, d.$listtable), $row = $("#nm" + submission_ID, d.$listtable);
            if (d.submission_id > 0) {
                // var $item_used = $("#ActionSubmit-" + d.submission_id, d.$listtable);
                var $drow = d.$listtable.$('tr.selected'),
                    $input = $("input", $drow);
                // var $item_used = d.$listtable.$('tr.selected input');
                $input.removeClass("disabled").prop("disabled", false);
                $drow.removeClass('selected');
            }
            d.submission_id = submission_ID;
            console.log("select item ID" + submission_ID);
            $item.addClass("disabled").prop("disabled", true);
            $row.addClass("selected");
            d.$container.trigger("set_submission_id", [submission_ID, json]);
        },
        refresh: function () {
        },
        //get the event object for binding post
        ev: function () {
            return this.$container;
        }
    }
});