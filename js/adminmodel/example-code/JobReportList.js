/**
 * Created by Hesk on 14年7月17日.
 */
var JobReportList = {},
    DOWNLOAD_FILE_IN_ = {};
jQuery(function ($) {
    DOWNLOAD_FILE_IN_ = function (fileFormat, report_id) {
        if (typeof (fileFormat) === 'string') {
            if (typeof (report_id) === 'number') {
                console.log("http://onecallapp.imusictech.net/api/staffcontrol/get_report_templates_list_cms/  take action...");
            } else console.log("wrong type report_id");
        } else console.log("wrong type fileFormat");
    }

    JobReportList = function (component_name) {
        var h = this;
        h.$component = $("#" + component_name);
        h.$listtable = $("#report_archive", h.$component);
         h.actionsTemplate = Handlebars.compile($("#action_bar_col_format", h.$component).html());
          h.TableInit();
        h.$component.data("JobReportList", h);
    }

    JobReportList.prototype = {
        TableInit: function () {
            var d = this;
            d.$listtable.dataTable({
                processing: true,
                ajax: "http://onecallapp.imusictech.net/api/staffcontrol/get_report_list_for_job_cms/",
                columns: [
                    { data: "r_id" },
                    { data: "report_name"},
                    { data: "status" },
                    {
                        class: "details-control",
                        orderable: false,
                        render: function (data, type, full, meta) {
                            return d.actionsTemplate(full);
                        }
                    }
                ],
                fnRowCallback: function (nRow, full, iDisplayIndex, iDisplayIndexFull) {
                    var $row = $(nRow);
                    /*  if (_.contains(d.template_used_data, new String(full.id))) {
                     console.log("fnRowCallback hide");
                     $("td.details-control input", $row).hide();
                     }*/
                    $row.attr("id", 'report-' + full.id);
                    return nRow;
                },
                fnDrawCallback: function (oSettings) {
                    // alert('DataTables has redrawn the table');
                },
                initComplete: function (settings, json) {
                    //  console.log("initComplete");
                    /*  if (d.template_used_data.length > 0) {
                     d.initializeButtons(d.template_used_data);
                     }*/

                   // myTable.hide();
                },
                iDisplayLength: 5
            });
        },
        initializeButtons: function (dlist) {
            var d = this;
            //  console.log("initializeButtons");
            /* try {
             d.$listtable.$("tr").each(function () {
             var dd = $(this), $input = $(".details-control input", dd);
             var ID = parseInt(new String(dd.attr("id")).replace(/^\D+/g, ''));
             if (_.contains(dlist, ID)) {
             $input.hide();
             }
             });
             } catch (e) {
             console.log(e);
             }*/
        }
    }
});