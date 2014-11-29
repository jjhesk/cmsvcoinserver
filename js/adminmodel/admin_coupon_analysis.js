/**
 * Created by ryo on 14年9月10日.
 */
var coupons_holder = {};
var CouponAnalysis = {};
jQuery(function ($) {
    coupons_holder = function () {
    }
    coupons_holder.prototype = {
        data_segment: {},
        getcoupons: function () {
            return this.data_segment;
        },
        setcoupons: function (object) {
            this.data_segment = object;
        }
    };
    CouponAnalysis = function (component_name, action_id, occurrence, cycle) {
        this.$container = $("#" + component_name);
        this.action_id = action_id;
        this.occurrence = occurrence;
        this.cycle = cycle;
        this.chart_canvas = $("#coupon_analysis");
        this.ctx = this.chart_canvas.get(0).getContext("2d");
        this.couponAnalysisPie = {};
        this.chart_draw_status = 0;
        this.api_domain = window.location.origin + "/api/";
        this.coupon_id = -1;
        this.unused_coupons = new coupons_holder();
        this.claimed_coupons = new coupons_holder();
        this.init();
    };
    CouponAnalysis.prototype = {
        init: function () {
            var d = this;
            d.coupon_id = URL_Helper.getParamVal("post");

            if (d.chart_canvas.is(":visible"))
                d.ChartInit();
            else {
                $(".hndle", d.$container).on("click", {that: d}, d.metabox_display_status);
            }
        },
        metabox_display_status: function (e) {
            var d = e.data.that;

            if (d.chart_canvas.is(":visible") && !d.chart_draw_status) {
                d.ChartInit();
                d.chart_draw_status = 1;
            }
        },
        ChartInit: function () {
            var d = this;

            var loader = new AJAXLoader($("#coupon_analysis"), "big", "app_reg");
            var enter = new JAXAPIsupport(d.api_domain + "cms/get_coupon_analysis_chart_data/", {
                claimed: 0, id: d.coupon_id
            }, d, function (that, json) {
                that.unused_coupons.setcoupons(
                    {
                        value: Number(json),
                        color: "#F7464A",
                        highlight: "#FF5A5E",
                        label: "In Stock Coupons"
                    }
                );
                var loader2 = new AJAXLoader($("#coupon_analysis"), "big", "app_reg");
                var enter2 = new JAXAPIsupport(d.api_domain + "cms/get_coupon_analysis_chart_data/", {
                    claimed: 1, id: d.coupon_id
                }, d, function (that, json) {
                    that.claimed_coupons.setcoupons(
                        {
                            value: Number(json),
                            color: "#46BFBD",
                            highlight: "#5AD3D1",
                            label: "Issued Coupons"
                        }
                    );

                    var data = [that.unused_coupons.getcoupons(), that.claimed_coupons.getcoupons()];
                    var options = {
                        forMetabox: true,
                        responsive: true,
                        maintainAspectRatio: false,
                        showTooltips: true,
                        tooltipFontSize: 20,
                        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\">" +
                            "<% for (var i=0; i<segments.length; i++)" +
                            "{%><li><table>" +
                            "<tr><td><div style=\"width:15px;height:15px;background-color:<%=segments[i].fillColor%>\"></div></td>" +
                            "<td><%if(segments[i].label){%><%=segments[i].label + \": \"+ segments[i].value %><%}%></td></tr></table>" +
                            "</li><%}%></ul>"
                    };
                    d.couponAnalysisPie = new Chart(d.ctx).Pie(data, options);

                    var helpers = Chart.helpers;
                    var legendHolder = document.createElement('div');
                    legendHolder.innerHTML = d.couponAnalysisPie.generateLegend();

                    helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {
                        helpers.addEvent(legendNode, 'mouseover', function () {
                            var activeSegment = d.couponAnalysisPie.segments[index];
                            activeSegment.save();
                            activeSegment.fillColor = activeSegment.highlightColor;
                            d.couponAnalysisPie.showTooltip([activeSegment]);
                            activeSegment.restore();
                        });
                    });

                    helpers.addEvent(legendHolder.firstChild.childNodes, 'mouseout', function () {
                        d.couponAnalysisPie.draw();
                    });

                    d.couponAnalysisPie.chart.canvas.parentNode.appendChild(legendHolder.firstChild);

                    d.couponAnalysisPie.generateLegend();
                    legendHolder.innerHTML = d.couponAnalysisPie.generateLegend();

                    var $null_element = $("<div style='height:7px'></div>");
                    $null_element.on("mouseover", {that: d}, d.clear_chart_tooltip);
                    $(".pie-legend").append($null_element);
                });
                enter2.add_loader(loader2);
                enter2.init();
            });

            enter.add_loader(loader);
            enter.init();

        },
        /**
         * to clear the tooltip for last element of the legend template
         * @param e
         */
        clear_chart_tooltip: function (e) {
            var d = e.data.that;
            d.couponAnalysisPie.draw();
        }
    }
});