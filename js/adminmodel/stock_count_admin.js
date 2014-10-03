/**
 * Created by ryo on 14年8月13日.
 */
/**
 * Created by hesk on 7/12/14.
 */
var StockCountAdmin = {};
jQuery(function ($) {
    StockCountAdmin = function (component_name, stock_id, loaded_submission_id) {
        this.$container = $("#" + component_name);
        this.$listtable = $("#stock_count_admin");
        this.stock_id = stock_id;
        this.domain = "http://devcms.vcoinapp.com/api/";
        this.TableInit();
        /*this.actionsTemplate = Handlebars.compile($("#action_bar_return_submission").html());
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
         this.$container.data("StockCountAdmin", this);*/
    };
    StockCountAdmin.prototype = {
        TableInit: function () {
            var d = this;
            d.$listtable.dataTable({
                processing: false,
                ajax: d.domain + "stock/list_stock_count/?id=" + d.stock_id,
                columns: [
                    /*{
                     class: "details-control",
                     orderable: false,
                     render: function (data, type, full, meta) {
                     var template = d.actionsTemplate(full);
                     return template;
                     }
                     },*/
                    { data: "ID" },
                    { data: "stock_id" },
                    { data: "extension" },
                    { data: "distribution" },
                    { data: "count" },
                    { data: "location_id" }
                ],
                "dom": '<"add_stock_count">lfrtip'
                /*,
                 fnRowCallback: function (nRow, full, iDisplayIndex, iDisplayIndexFull) {
                 $(nRow).attr("id", 'nm' + full.ID);
                 return nRow;
                 },
                 fnDrawCallback: function (oSettings) {
                 // alert('DataTables has redrawn the table');
                 },

                 iDisplayLength: 6*/
            });
            d.$listtable.css({
                'text-align': 'center',
                'font-size': '14px'
            });

            d.ui_injection();
        },
        ui_injection: function () {
            var d = this;

            JAXAPIsupport(d.domain + "stock/get_stock_count_id_ui/", {
                id: d.stock_id
            }, d, function (that, json) {
                var html = new String(json);

                var count_input = "<input type='number' id='new_count' placeholder='Enter the new count input'/>" +
                    "<input type='button' id='add_stock_count' value='add stock count'/>";

                $("div.add_stock_count").html(
                    html + count_input
                );

                $("#add_stock_count", d.$container).on("click", {that: d}, d.stock_count_id_selected);
                $("#stock_count_id", d.$container).on("change", {that: d}, d.display_selected_stock_count_id);
            });
        },
        display_selected_stock_count_id: function (e) {
            var d = e.data.that;
            var stock_count_id = parseInt($("option:selected", "#stock_count_id").html());
            var $search = $("#stock_count_admin_filter input");

            if (stock_count_id > 0) {
                $search.val(stock_count_id);
                $search.trigger("keyup");
            }
            else {
                $search.val("");
                $search.trigger("keyup");
            }
        },
        stock_count_id_selected: function (e) {
            var d = e.data.that;
            var new_count = parseInt($("#new_count", d.$container).val());
            var check_count = Math.abs(new_count) > 0;
            var stock_count_id = parseInt($("option:selected", "#stock_count_id").html());
            var check_if_id = stock_count_id > 0;

            if (check_count && check_if_id) {
                JAXAPIsupport(d.domain + "stock/change_stock_count/", {
                    stock_count_id: stock_count_id, new_count: new_count
                }, d, function (that, json) {
                    d.$listtable.fnReloadAjax(d.domain + "stock/list_stock_count/?id=" + d.stock_id);
                });
            }
            else alert("Improper input!!");
        },
        refresh: function () {
        },
        //get the event object for binding post
        ev: function () {
            return this.$container;
        }
    }
});