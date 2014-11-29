/**
 * Created by Hesk on 14年10月17日.
 */
var StockExtensionBox = {};
var TB_callback = TB_callback || {};
jQuery(function ($) {
    (function (doc, meta, __, bar, duration, interaction) {
        var Label_Attribute = Backbone.Model.extend({
            defaults: function () {
                return {
                    order: 0,
                    id: "#CC",
                    /*
                     en: "color",
                     cn: "顏色分類",
                     ja: "カラー",
                     */
                    label_new_name: "color",
                    tags: {}
                }
            },
            toggle: function () {
                console.log("event triggered toggle");
                //this.save({done: !this.get("done")});
            },
            setTags: function (array_list) {
                this.attributes.tags = array_list;
            },
            /*   parse: function (response) {
             *//*if (_.has(response, "tags")) {
             //  this.tags =
             new Label_Tag(response.tags, {
             parse: true
             });
             delete response.tags;
             }*//*
             return response;
             },*/
            toJSON: function () {
                var json = _.clone(this.attributes);
                //  json.tags = this.tags.toJSON();
                return json;
            },

            urlRoot: ""
        });


        var LabelList = Backbone.Collection.extend({
            model: Label_Attribute,
            // localStorage: new Backbone.LocalStorage("temp_label"),
            done: function () {
                return this.where({done: true});
            },
            remaining: function () {
                return this.where({done: false});
            },
            getLastRow: function () {
                if (this.length > 0)
                    return this.last().toJSON();
            },
            nextOrder: function () {
                if (!this.length) return 1;
                return this.last().get('order') + 1;
            },

            /*if (_.has(response, "tags")) {
             //  this.tags =
             new Label_Tag(response.tags, {
             parse: true
             });
             delete response.tags;
             }*/

            /*parseJson: function () {

             },*/
            storage: new Store("story_handle"), // Unique name within your app.
            comparator: 'order'
        });

        var List = new LabelList();

        var extension_dialog, init_appview = false;
        StockExtensionBox = function (model_struc) {
            this.struc = model_struc;
            this.init();
        }
        StockExtensionBox.prototype = {
            init: function () {
                var d = this;
                var metaboxButton = new metabox_modal_button("Manage Extension", "ext_v2");
                d.bu = metaboxButton.init_next();
                //$(doc).on("onShown", {that: d}, d.init_thick_box);
                //$(doc).on("tb_remove", {that: d}, d.remove_box);
                extension_dialog = $('[data-remodal-id=modal]').remodal();
                $(doc).on('open', '.remodal', {that: d}, d.init_thick_box);
            },
            init_thick_box: function (e, a, b, c) {
                var d = e.data.that;
                //   if (typeof  d.app != "object") {
                // if (typeof d.app != "object") {
                if (!init_appview) {
                    d.app = new AppExtView({el: $("#extensionbox")});
                    init_appview = true;
                }
                //}
                d.app.setStoreField(d.bu.getStoreField());
                d.app.setchecker(d.struc.checker);
                d.app.delegateEvents();
                //  console.log(typeof d.app);
            },
            remove_box: function (e) {
                var d = e.data.that;
                //  d.app.close();
                //  delete d.app;
            }
        }
        var metabox_modal_button = function (button_label, previous_el_id) {
            this.button_label = button_label;
            this.prev = previous_el_id;
            this.h = 600;
            this.w = 550;
            this.el_id = '_modal_btn_' + previous_el_id;
            this.store_field = $("#" + this.prev);
        }
        metabox_modal_button.prototype = {
            init_above: function () {
                var d = this;
                d.el = '<div class="rwmb-field rwmb-text-wrapper"><div class="rwmb-label"></div><div class="rwmb-input">';
                d.el += d.buttondiv();
                d.el += '</div></div>';
                // this._cb = init_cb;
                var $previous_el = d.store_field.closest(".rwmb-field.rwmb-text-wrapper");
                $previous_el.before(d.el);
                d.$button = $("#" + d.el_id);
                return d;
            },
            init_next: function () {
                var d = this;
                var g = MetaBoxSupport.InsertHTMLFieldSelectNextTo(d.store_field, d.buttondiv());
                d.$button = $("#" + d.el_id);
                //  console.log(g);
                return d;
            },
            buttondiv: function () {
                var d = this;
                var html = '<a class="button button-primary button-large remodal-bg" href="#modal">Manage Extension</a>';
                html += '<div class="remodal" id="holder" data-remodal-id="modal">' + $("#extensionbox_tp3").html() + '</div>';
                return html;
            },
            getInstance: function () {
                return this.$button;
            },
            getStoreField: function () {
                return this.store_field;
            }
        }

        Backbone.View.prototype.close = function () {
            // this.$el.empty();
            this.unbindEvents();
        };

        var LabelView = Backbone.View.extend({
            tagName: "tr",
            //      class: this.model.id + "-class",
            template: bar.compile($("#extensionbox_tp1").html()),
            events: {
                "click input.remove_attribute": "clear",
                "dblclick .view": "edit",
                "blur .edit": "close"

            },
            initialize: function () {
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'destroy', this.remove);
            },
            render: function () {
                // Backbone LocalStorage is adding `id` attribute instantly after
                // creating a model.  This causes our TodoView to render twice. Once
                // after creating a model and once on `id` change.  We want to
                // filter out the second redundant render, which is caused by this
                // `id` change.  It's known Backbone LocalStorage bug, therefore
                // we've to create a workaround.
                // https://github.com/tastejs/todomvc/issues/469
                var d = this, first_object = d.model.toJSON();
                //first_object = d.model.getLastRow();

//                first_object = d.model.toJSON();
                //              console.log(d.model.toJSON());
                this.$el.html(d.template(first_object));
                this.$el.toggleClass('done', d.model.get('done'));
                this.input = d.$('input.rwmb-text.tag');
                this.removebtn = d.$('input.remove_attribute');
                this.tagbox = d.$('#tag-' + first_object.id + '.btn-grou');
                this.tagbox.tagging();
                return this;
            },
            get_array_tags: function () {
                return this.tagbox.tagging("getTags");
            },
            edit: function () {
                console.log("edit");
                this.$el.addClass("editing");
                this.input.focus();
            },

            close: function () {
                console.log("close");
                var value = this.input.val();
                if (!value) {
                    this.clear();
                } else {
                    //  this.model.save({title: value});
                    this.$el.removeClass("editing");
                }
            },

            clear: function () {
                console.log("clear");
                console.log(this.model);
                this.model.destroy();
                // Remove the item, destroy the model.
            }
        });


        var AppExtView = Backbone.View.extend({
            //  statsTemplateAttribute: bar.compile($("#extensionbox_tp1").html()),
            events: {
                "keypress #new_attr_name": "createOnEnter",
                "click #add_btn_attribute": "createOnBtn",
                "click .generate-final": "generate"
            },
            initialize: function () {
                this.childViews = [];
                this.input = this.$("#new_attr_name");
                this.prepend_area = this.$(".container");
                this.listenTo(List, "add", this.addOne);
                this.listenTo(List, "remove", this.removeOne);
                this.listenTo(List, "reset", this.addAll);
                this.listenTo(List, "all", this.render);
                // List.fetch();
                // List.fetch({reset: true});

                console.log("check init");
            },
            removeOne: function () {

            },
            addAll: function () {
            },
            render: function () {
                var done = List.done().length;
                var remaining = List.remaining().length;
            },
            createOnBtn: function () {
                this.create_new_view();
            },
            createOnEnter: function (e) {
                if (e.keyCode != 13) return;
                this.create_new_view();
            },
            create_new_view: function () {
                var d = this, val = new String(d.input.val()).trim();
                if (val.length == 0) return;
                this.input.val("").blur();
                // List.create({label_new_name: val});
                List.add({label_new_name: val, id: val.replace(/\s+/g, '-').toLowerCase(), order: d.childViews.length});
            },
            addOne: function (attribute_model) {
                console.log(attribute_model);
                var view = new LabelView({model: attribute_model});
                this.prepend_area.prepend(view.render().el);
                this.childViews.push(view);
            },
            setStoreField: function ($el) {
                this.store_field = $el;
            },
            setchecker: function ($el) {
                this.checker = $el;
            },
            generate: function () {
                try {
                    _.each(this.childViews, function (child) {
                        var arr = child.get_array_tags();
                        if (arr.length === 0) throw "empty tags";
                        child.model.setTags(arr);
                    });
                    this.store_field.val(JSON.stringify(List.toJSON()));
                    extension_dialog.close();
                    this.checker.check_extension();
                } catch (e) {
                    alert(e);
                }
            }
        });
    }(document, MetaBoxSupport, _, Handlebars, 1000, "click"));
})
;
