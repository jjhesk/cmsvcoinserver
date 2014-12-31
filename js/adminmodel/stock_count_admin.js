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
        this.domain = window.location.origin + "/api/";
        this.$extension_obj = $("#ext_v2").val();
        this.TableInit();
        this.$search = $("#stock_count_admin_filter input");
    };
    StockCountAdmin.prototype = {
        check_box_init:function(row_data){
            return '<input type="checkbox" class="select_stock" value="'+row_data.ID+'">';
        },
        TableInit: function () {
            var d = this;
            d.$listtable.dataTable({
                processing: true,
                order: [ 1, 'desc' ],
                ajax: d.domain + "stock/list_stock_count/?id=" + d.stock_id,
                columns: [
                    {
                        class: "select_stock",
                        orderable: false,
                        render: function (data, type, full, meta) {
                            return d.check_box_init(full);
                        }
                    },
                    { data: "ID" },
                    { data: "label" },
                    { data: "count" },
                    { data: "location_id" }
                ],
                dom: 'lfrt<"F"<"select">ip>',
                fnDrawCallback: function () {
                    var $check_all = $(".check_all");
                    $check_all.prop('checked', false);
                },
                initComplete: function () {
                    d.$listtable.DataTable().column(0).visible(false);
                }
            });
            d.$listtable.css({
                'text-align': 'center',
                'font-size': '14px'
            });
            d.ui_injection();
        },
        filter_features: function (e) {
            var d = e.data.that;
            var td = $(this).closest("td"), closest_features = $("div", td);
            var search_words = "";

            $('#stock_count_id').prop('selectedIndex', 0);

            if ($(this).hasClass("selected")) {
                $(this).removeClass("selected");
                $("span", $(this)).removeClass("selected");
            }
            else {
                $.each(closest_features, function (key, single_feature) {
                    $(single_feature).removeClass("selected");
                    $("span", $(single_feature)).removeClass("selected");
                });

                $(this).addClass("selected");
                $("span", $(this)).addClass("selected");

            }
            var tbody = $(this).closest("tbody"), tr = $("tr", tbody), all_features = $("div.features", tr);
            $.each(all_features, function (key, single_feature) {
                if ($(single_feature).hasClass("selected"))
                    search_words += $("input", $(single_feature)).val() + " ";
            });

            d.$search.val(search_words);
            d.$search.trigger("keyup");
        },
        ui_injection: function () {
            var d = this;
            var $table = $("#stock_count_admin_wrapper");
            var loader = new AJAXLoader($("#stock_count_admin_length"), "normal", "app_reg");
            var enter = new JAXAPIsupport(d.domain + "stock/get_stock_count_id_ui/", {
                id: d.stock_id
            }, d, function (that, json) {
                var add_count_template = Handlebars.compile($("#add_stock_count_template").html());
                var selection_ui = add_count_template({selection: String(json)});

                var $stock_operation = $(selection_ui);
                $table.before($stock_operation);

                $("#add_stock_count", d.$container).on("click", {that: d}, d.stock_count_id_selected);
                $("#stock_count_id", d.$container).on("change", {that: d}, d.display_selected_stock_count_id);

                if (d.$extension_obj != "na"){
                new StockTagging($table, d.$extension_obj, true);
                var feature_group = $(".features", d.container);
                $.each(feature_group, function (key, feature) {
                    $(feature).on("click", {that: d}, d.filter_features).hover(function () {
                        $(this).css('cursor', 'pointer');
                    });
                });
            }
            });
            enter.add_loader(loader);
            enter.init();

            var $select = $(".select");
            $select.html('<input type="checkbox" class="check_all">Check All');
            var $check_all = $(".check_all");
            $check_all.on("click", function (e) {
                var tb = $("tbody"), checkbox = tb.find("[type=checkbox]");
                checkbox.each(function (index) {
                    if ($check_all.is(':checked'))
                        $(this).prop('checked', true);
                    else $(this).prop('checked', false);
                });
            });

            $select.addClass("hidden");
        },
        display_selected_stock_count_id: function (e) {
            e.preventDefault();
            var d = e.data.that;
            var selection_box = $("option:selected", "#stock_count_id");
            var stock_count_id = parseInt(selection_box.html());
            var choice = selection_box.val();
            var $select = $(".select"), $check_all = $(".check_all");

            if (choice != -2) {
                var tbody = $("tbody", d.$listtable), checkbox = tbody.find("[type=checkbox]");
                checkbox.each(function (index) {
                    $(this).prop('checked', false);
                });
                $check_all.prop('checked', false);
                d.$listtable.DataTable().column(0).visible(false);
                $select.addClass("hidden");
            }
            else {
                d.$listtable.DataTable().column(0).visible(true);
                $select.removeClass("hidden");
            }

            if (stock_count_id > 0) {
                var tbody = $(".features_table tbody"), tr = $("tr", tbody), all_features = $("div.features", tr);
                $.each(all_features, function (key, single_feature) {
                    $(single_feature).removeClass("selected");
                    $("span", $(single_feature)).removeClass("selected");
                });

                d.$search.val(stock_count_id);
                d.$search.trigger("keyup");
            }
            else {
                d.$search.val("");
                d.$search.trigger("keyup");
            }
        },
        operate_stock_count: function (that, data) {
            var loader = new AJAXLoader($("#add_stock_count"), "normal", "app_reg");
            var enter = new JAXAPIsupport(that.domain + "stock/change_stock_count/", data, that, function (that, json) {
                that.$listtable.fnReloadAjax(that.domain + "stock/list_stock_count/?id=" + that.stock_id);
            });
            enter.add_loader(loader);
            enter.init();
        },
        stock_count_id_selected: function (e) {
            var d = e.data.that;
            var new_count = parseInt($("#new_count", d.$container).val());
            var check_count = Math.abs(new_count) > 0;
            var stock_count_id = parseInt($("option:selected", "#stock_count_id").html());
            var check_if_id = stock_count_id > 0, data = {},
                unselected = ($("option:selected", "#stock_count_id").val() == -1),
                add_stock_from_id = check_count && check_if_id,
                add_stock_from_checkbox = check_count;

            if (unselected)
                alert("Please select stock from id or checkbox.");
            else {
                if (add_stock_from_id) {
                    data = {
                        stock_count_id: stock_count_id, new_count: new_count
                    };
                    d.operate_stock_count(d, data);
                } else if (add_stock_from_checkbox) {
                    var tbody = $("tbody", d.$listtable), checkbox = tbody.find("[type=checkbox]"), stock_ids = "";
                    checkbox.each(function (index) {
                        var d = $(this);
                        if (d.is(':checked'))
                            stock_ids += d.val() + ",";
                    });
                    stock_ids = stock_ids.substring(0, stock_ids.length - 1);
                    //var loader = new AJAXLoader(this, "normal", "app_reg");

                    if (stock_ids == "")
                        alert("No stock is selected.");
                    else {
                        data = {
                            stock_ids: stock_ids, new_count: new_count
                        };
                        d.operate_stock_count(d, data);
                    }
                } else {
                    alert("Improper stock count input. Please assign again.");
                }
            }
        },
        refresh: function () {
        },
        //get the event object for binding post
        ev: function () {
            return this.$container;
        }
    }
});