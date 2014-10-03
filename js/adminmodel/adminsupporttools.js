/**
 * Created by Hesk on 14年5月27日.
 */
var WPScreenOptionSupport = {};
var MetaBoxSupport = {};
var JAXSupport = {};
var JAXAPIsupport = {};
var PostBoxWatch = {};
var PublishingSupport = {};
var MapFix = {};
var URL_Helper = {};
jQuery(function ($) {
    "use strict";
    (function (c, interaction) {
        PublishingSupport = function () {
            var d = this;
            d.$post_content_container = $("#post-body-content");
            d.$submiting_container = $("#submitdiv");
            d.$publishbutton = $("#publish", d.$submiting_container);
            d.titlebar = $("h3.hndle", d.$submiting_container);
            d.preview_button = $("#post-preview", d.$submiting_container);
            d.post_title_field = $("#title", d.$post_content_container);
            this.init();
        }
        PublishingSupport.prototype = {
            init: function () {
                var d = this;
                d.$publishbutton.bind("click", {that: d}, d.publish_click);
            },
            setTriggerOnSubmit: function (callback) {
                var d = this;
                d.$post_content_container.on('php_submit', function (e, that) {
                    callback(e, that);
                });
            },
            publish_click: function (e) {
                var d = e.data.that;
                $("select").prop("disabled", false).removeClass("disabled");
                console.log(d);
                d.$post_content_container.trigger("php_submit", [d]);
            },
            setTitle: function (l) {
                var d = this;
                if (typeof (l) === 'string') {
                    d.titlebar.html(l);
                }
                return d;
            },
            PubLabel: function (l) {
                var d = this;
                if (typeof (l) === 'string') {
                    d.$publishbutton.val(new String(l).toUpperCase());
                }
                return d;
            },
            publishEnable: function (boool) {
                var d = this;
                if (typeof (boool) === 'boolean') {
                    if (boool)
                        d.$publishbutton.prop("disabled", false).removeClass("disabled");
                    else
                        d.$publishbutton.prop("disabled", true).addClass("disabled");
                }
                return d;
            },
            previewVisable: function (boool) {
                var d = this;
                if (typeof (boool) === 'boolean') {
                    if (boool)
                        d.preview_button.show();
                    else
                        d.preview_button.hide();
                }
                return d;
            },
            setPostTitle: function (l) {
                var d = this;
                d.post_title_field.val(l);
                return d;
            }
        }
        WPScreenOptionSupport = function () {
            this.init();
        }
        WPScreenOptionSupport.prototype = {
            init: function () {
                var d = this;
                d.$container = $("#screen-options-wrap .metabox-prefs");
                d.control_list = {};
                if (d.$container.size() > 0) {
                    $.each($("label", d.$container), function (i, $el) {
                        var $input = $("input", $el),
                            id = $input.prop("id"),
                            highlight = /-hide$/g,
                            pattern = /([\s\S]*?)-hide$/m,
                            isOnRightFormat = new String(id).match(pattern);
                        if (isOnRightFormat) {
                            d.control_list[id.replace(highlight, "")] = $input.prop("checked");
                        }
                    });
                }
            },
            getComponentStatus: function (keyParam) {
                var d = this;
                if (d.control_list.hasOwnProperty(keyParam)) {
                    return d.control_list[keyParam];
                } else {
                    console.log("there is no such configuration with " + keyParam);
                }
            },
            Toggle: function (keyParam, bool) {
                var d = this;
                if (d.control_list.hasOwnProperty(keyParam)) {
                    if (!d.control_list[keyParam]) {
                        console.log("postbox " + keyParam + " is not activated");
                    } else {
                        if (bool) {
                            $('.hndle', "#" + keyParam + ".postbox.closed").trigger("click.postboxes");
                        } else {
                            if (!$("#" + keyParam + ".postbox").hasClass("closed"))
                                $('.hndle', "#" + keyParam + ".postbox").trigger("click.postboxes");
                        }
                    }
                } else {
                    console.log("there is no such configuration with " + keyParam);
                }
            },
            getData: function () {
                return this.control_list;
            }, ON: function (keyParam) {
                var d = this;
                if (typeof (keyParam) === 'string') {
                    $.each(d.control_list, function (key, value) {
                        if (key == keyParam) {
                            if (!value) {
                                $("input#" + keyParam + "-hide", d.$container).trigger("click.postboxes");
                                d.control_list[keyParam] = true;
                            }
                        }
                    });
                } else {
                    console.log("method ON allow string only");
                }
            }, OFF: function (keyParam) {
                var d = this;
                if (typeof (keyParam) === 'string') {
                    $.each(d.control_list, function (key, value) {
                        if (key == keyParam) {
                            if (value) {
                                $("input#" + keyParam + "-hide", d.$container).trigger("click.postboxes");
                                d.control_list[keyParam] = false;
                            }
                        }
                    });
                } else {
                    console.log("method OFF allow string only");
                }
            }, ALL: function (boool) {
                var d = this;
                if (typeof (boool) === 'boolean') {
                    $.each(d.control_list, function (key, value) {
                        if (value != boool) {
                            $("input#" + key + "-hide", d.$container).trigger("click.postboxes");
                            d.control_list[key] = boool;
                        }
                    });
                } else {
                    console.log("method OFF allow boolean only");
                }
            },
            batch: function (controls, boool) {
                var d = this;
                console.log(controls);
                try {
                    if (typeof (boool) === 'boolean') {
                        if (controls instanceof $) {
                            if (controls.size() > 1) throw "cannot set object hidden more than one";
                            var name = controls.attr('id');
                            if (boool)d.ON(name);
                            else d.OFF(name);
                        } else if (typeof controls === 'object') {
                            if (controls.length == 0) throw "cannot set object hidden with nothing on input";
                            $.each(controls, function (i, val) {
                                if (boool)d.ON(val);
                                else d.OFF(val);
                            });
                            d.init();
                        } else if (typeof controls === 'string') {
                            if (boool)d.ON(controls);
                            else d.OFF(controls);
                        }
                    } else throw "boool is not boolean";
                } catch (e) {
                    console.error(e);
                }
            }
        }

        /* ScreenOptionControl = {
         on: function (controls) {
         try {
         if (controls instanceof $) {
         if (controls.size() > 1) throw "cannot set object hidden more than one";
         var name = controls.attr('id'), hol = "input#" + name + "-hide";
         $(hol, $screenOptionContainer).trigger("click.postboxes");
         } else if (typeof controls === 'object') {
         if (controls.length <= 0) throw "cannot set object hidden with nothing on input";
         $.each(controls, function (i, val) {
         $("input#" + val + "-hide", $screenOptionContainer).trigger("click.postboxes");
         //.prop("disabled", true);
         console.log(val);
         });
         } else if (typeof controls === 'string') {
         $("input#" + controls + "-hide", $screenOptionContainer).trigger("click.postboxes");
         }
         } catch (e) {
         console.error(e);
         }
         return this;
         },
         off: function (controls) {
         if (typeof controls === 'object')
         $.each(controls, function (i, val) {
         $("input#" + val + "-hide:checked", $screenOptionContainer).trigger("click.postboxes").prop("disabled", true);
         });
         return this;
         },
         offAll: function () {
         $("input:checked", $screenOptionContainer).trigger("click.postboxes");
         //.prop("disabled", true);
         console.log('offALL');
         return this;
         }
         }*/

        MetaBoxSupport = {
            InsertHTMLFieldSelectAfter: function (_after_el_id, html) {
                var field = $('.rwmb-field:has(' + _after_el_id + ')');
                field.after(html);
                var $input = $(".rwmb-input select", field.next());
                // console.log("inserted." + html);
                return $input;
            },
            InsertHTMLFieldSelectNextTo: function (_after_el_id, html) {
                var field = null;
                if (typeof _after_el_id == "string")
                    field = $(_after_el_id);
                else if (_after_el_id instanceof jQuery) {
                    field = _after_el_id;
                }
                if (field == null)
                    return false;

                field.after(html);
                // console.log("inserted." + html);
                return field.next();
            },
            InputControlEach: function (els, boolOFF) {
                els.each(function (i) {
                    MetaBoxSupport.InputControlSingle($(this), boolOFF);
                });
            },
            doSelect: function (idSelector, value) {
                if (typeof (idSelector) === 'string') {
                    $('option[value=' + value + ']', idSelector).prop('selected', true);
                }
                if (idSelector instanceof jQuery) {
                    $('option[value=' + value + ']', idSelector).prop('selected', true);
                }
            },
            InputControlSingle: function (input, boolOFF) {
                var type = input.prop("type"),
                    ele = input.prop("tagName");

                // console.log("tag config"+ele);
                if (ele == "INPUT") {
                    switch (type) {
                        case "checkbox":
                            input.prop("disabled", boolOFF);
                            break;
                        case "text":
                            input.prop("readonly", boolOFF);
                            break;
                        case "button":
                            input.prop("disabled", boolOFF);
                            if (input.hasClass('button')) {
                                if (boolOFF)input.addClass('disabled'); else input.removeClass('disabled');
                            }
                            break;
                        case "submit":
                            input.prop("disabled", boolOFF);
                            break;
                        default :
                            break;
                    }
                } else {
                    switch (ele) {
                        case "SELECT":
                            //    console.log("selection config");
                            if (boolOFF) input.prop("disabled", true); else input.removeAttr("disabled");
                            break;
                        case "TEXTAREA":
                            input.prop("readonly", boolOFF);
                            if (!boolOFF) {
                                input.removeAttr("disabled");
                            }
                            break;
                        case "A":
                            if (input.hasClass('button')) {
                                if (boolOFF)input.addClass('disabled'); else input.removeClass('disabled');
                            } else {
                                if (boolOFF) input.hide(); else input.show();
                            }
                            break;
                        case "BUTTON":
                            if (input.hasClass('button')) {
                                if (boolOFF)input.addClass('disabled'); else input.removeClass('disabled');
                            } else {
                                if (boolOFF) input.hide(); else input.show();
                            }
                            break;
                        default :
                            break;
                    }
                }
            }
        }
        //example JAXAPIsupport("http.../api/controller/method/", {id:25}, {that:d}, function(e, ){})
        JAXAPIsupport = function (api, data, cbobject, callback) {
            // console.log("ajax starts here");
            //console.log(data);
            $.post(api, data, function (response) {
                // pac.loading(false);
                console.log(response);
                if (response.result == 'success') {
                    if ($.type(response.obtain) === 'object') {
                        if ($.type(callback) === "function")
                            callback(cbobject, response.obtain);
                    }
                    else if ($.type(response.obtain) === 'string') {
                        if ($.type(callback) === "function")
                            callback(cbobject, response.obtain);
                    }
                } else {
                    // alert("not found");
                    console.log("No data found");
                }
            });
        }

        JAXSupport = function (data, cbobject, callback) {
            console.log("ajax starts here");
            console.log(data);
            $.post(ajaxurl, data, function (response) {
                // pac.loading(false);
                console.log(response);
                if (response.result == 'success') {
                    if ($.type(response.obtain) === 'object') {
                        if ($.type(callback) === "function")
                            callback(cbobject, response.obtain);
                    }
                } else {
                    // alert("not found");
                    console.log("No data found to set the location of the map");
                }
            });
        }
        PostBoxWatch = function () {
            var all_handlers = jQuery('.postbox .hndle, .postbox .handlediv');
            this.allHandlers = all_handlers;
            this.init();
        }
        PostBoxWatch.prototype = {
            init: function () {
                var d = this;
                d.allHandlers.each(function (index) {
                    var $this = $(this),
                        $postbox = $this.closest(".postbox");
                    $this.on('click.postboxes', {that: $postbox}, function (e) {
                        var $that = e.data.that, $mapWrap = $that.find(".rwmb-map-wrapper"), closedTap = $that.hasClass("closed");
                        if ($mapWrap.size() > 0 && !closedTap) {
                            var mapController = $(".rwmb-map-field", $mapWrap).data("mapController");
                            var map = mapController.map;
                            google.maps.event.trigger(map, 'resize');
                            google.maps.event.trigger(map, 'idle');
                            google.maps.event.trigger(map, 'center_changed');
                        }
                        $postbox.trigger("tap_bar", [closedTap]);
                    });
                });
            }
        }


        URL_Helper = {
            getParamVal: function (paramName) {
                var sURL = window.document.URL.toString();
                if (sURL.indexOf("?") > 0) {
                    var arrParams = sURL.split("?");
                    var arrURLParams = arrParams[1].split("&");
                    var arrParamNames = new Array(arrURLParams.length);
                    var arrParamValues = new Array(arrURLParams.length);
                    var i = 0;
                    for (i = 0; i < arrURLParams.length; i++) {
                        var sParam = arrURLParams[i].split("=");
                        arrParamNames[i] = sParam[0];
                        if (sParam[1] != "")
                            arrParamValues[i] = unescape(sParam[1]);
                        else
                            arrParamValues[i] = "No Value";
                    }
                    for (i = 0; i < arrURLParams.length; i++) {
                        if (arrParamNames[i] == paramName) {
                            //alert("Param:"+arrParamValues[i]);
                            return arrParamValues[i];
                        }
                    }
                    return "No Parameters Found";
                }
            }
        }
    }(document, "click tap touch"));
});


