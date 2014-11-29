/**
 * Created by Hesk on 14年11月12日.
 */
var json_vendor_list = new Object();
jQuery(function ($) {
    (function (d, M, duration) {

        var admin_scanner = function () {
this.domain_api = window.location.origin + "/api/";
        };
        admin_scanner.prototype = {
            TableInit: function () {
                var d = this;
                d.$listtable.dataTable({
                    processing: true,
                    ajax: domain_api + "http://onecallapp.imusictech.net/api/staffcontrol/get_submission_list_cms/?jobid=" + d.original_job_id,
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
            }
        }

        new admin_scanner;
    }(document, MetaBoxSupport, 1000));
});