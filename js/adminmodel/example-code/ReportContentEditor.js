/**
 * Created by hesk on 7/12/14.
 */
var ReportContentEditor = ReportContentEditor || {};
jQuery(function ($) {
    ReportContentEditor = function ($container, templateController) {
        if (templateController instanceof ListTemplateControl) {
            if ($container instanceof $) {
                this.control_template = templateController;
                this.$container = $("#displayContentEditor", $container);
                this.sliderCon = {};
                this.tag = $(".book #information_tag span", $container);
                this.mapping_list = {};
                this.init();
            } else console.error("wrong instance from $container");
        } else {
            console.error("wrong instance from templateController");
        }
    }
    ReportContentEditor.prototype = {
        init: function () {
            var d = this;
            d.control_template.addReportContentEditorListener(d);
            d.$container.royalSlider({
                // options go here
                // as an example, enable keyboard arrows nav
                keyboardNavEnabled: true,
                navigateByClick: false,
                height: 800,
                autoScaleSliderHeight: 800
            });
            d.sliderCon = d.$container.data('royalSlider');
            d.sliderCon.ev.on("rsAfterSlideChange", function (event) {
                d.pageChanged(event);
            });
            // console.log(d.sliderCon);
        },
        pageChanged: function (event) {
            var d = this, pageNu = d.sliderCon.currSlideId, t = d.sliderCon.numSlides;
            console.log(event);
            console.log(pageNu);
            d.tag.html(pageNu + "/" + t);
        },
        add_template_id_list: function () {

        },
        addTemplate: function (template_id, HTML) {
            var d = this;
            if (HTML instanceof jQuery) {
                $wrapped = HTML.clone().wrap("<div class='rsContent editorpage'></div>");
            } else {
                $wrapped = $.parseHTML("<div class='rsContent editorpage'>" + HTML + "</div>");
            }
            // console.log(d.sliderCon);
            d.sliderCon.appendSlide($wrapped);
            //     console.log(return_id);
            /*
             if (d.sliderCon.currSlideId == undefined) {
             d.sliderCon.appendSlide($wrapped);
             } else {
             var n = d.sliderCon.currSlideId;
             console.log(n);
             d.sliderCon.appendSlide($wrapped, n > 0 ? n + 1 : 0);
             }

             // All public methods can be called jQuery-way - $(".royalSlider").royalSlider('startAutoPlay');
             // Another example: $(".royalSlider").royalSlider('goTo', 3);

             // But it's recommended to get instance once if you have many calls:

             // You can get slider instance from royalSlider data:
             var slider = $(".royalSlider").data('royalSlider');

             slider.goTo(3); // go to slide with id
             slider.next();  // next slide
             slider.prev();  // prev slide

             slider.destroy(); // removes all events and clears all slider data
             // use on ajax sites to avoid memory leaks

             // Dynamic slides adding/removing
             // More info in Javascript API section of support desk - http://dimsemenov.com/private/forum.php
             slider.appendSlide( HTML_jQuery_object, index(optional) );
             slider.removeSlide( index(optional) );

             slider.updateSliderSize(); // updates size of slider. Use after you resize slider with js.
             slider.updateSliderSize(true); // Function has "forceResize" Boolean paramater.

             // Thumbnails public methods
             slider.setThumbsOrientation('vertical'); // changes orientation of thumbnails
             slider.updateThumbsSize(); // updates size of thumbnails

             // Fullscreen public methods
             slider.enterFullscreen();
             slider.exitFullscreen();

             // Autoplay public methods
             slider.startAutoPlay();
             slider.stopAutoPlay();
             slider.toggleAutoPlay();

             // Video public methods
             slider.toggleVideo();
             slider.playVideo();
             slider.stopVideo();



             slider.currSlideId // current slide index
             slider.currSlide // current slide object

             slider.numSlides // total number of slides

             slider.isFullscreen // indicates if slider is in fullscreen mode
             slider.nativeFS		// indicates if browser supports native fullscreen

             slider.width // width of slider
             slider.height // height of slider

             slider.dragSuccess // Boolean, changes on mouseup, indicates if slide was dragged. Used to check if event is drag or click.

             slider.slides // array, contains all data about each slide
             slider.slidesJQ // array, contains list of HTML slides that are added to slider

             slider.st // object with slider settings
             slider.ev // jQuery object with slider events


             // In each listener event.target is slider instance

             slider.ev.on('rsAfterSlideChange', function(event) {
             // triggers after slide change
             });
             slider.ev.on('rsBeforeAnimStart', function(event) {
             // before animation between slides start
             });
             slider.ev.on('rsBeforeMove', function(event, type, userAction ) {
             // before any transition start (including after drag release)
             // "type" - can be "next", "prev", or ID of slide to move
             // userAction (Boolean) - defines if action is triggered by user (e.g. will be false if movement is triggered by autoPlay)
             });
             slider.ev.on('rsBeforeSizeSet', function(event) {
             // before size of slider is changed
             });
             slider.ev.on('rsDragStart', function(event) {
             // mouse/touch drag start
             });
             slider.ev.on('rsDragRelease', function() {
             // mouse/touch drag end
             });
             slider.ev.on('rsBeforeDestroy', function() {
             // triggers before slider in destroyed
             });
             slider.ev.on('rsOnCreateVideoElement', function(e, url) {
             // triggers before video element is created, after click on play button.
             // Read more in Tips&Tricks section
             });
             slider.ev.on('rsSlideClick', function(event, originalEvent) {
             // originalEvent - the original jQuery click event. Parameter available since RoyalSlider v9.5.1
             // triggers when user clicks on slide
             // doesn't trigger after click and drag
             });
             slider.ev.on('rsEnterFullscreen', function() {
             // enter fullscreen mode
             });
             slider.ev.on('rsExitFullscreen', function() {
             // exit fullscreen mode
             });

             slider.ev.on('rsVideoPlay', function() {
             // video start
             });
             slider.ev.on('rsVideoStop', function() {
             // video stop
             });

             slider.slides[2].holder.on('rsAfterContentSet', function() {
             // fires when third slide content is loaded and added to DOM
             });
             // or globally
             slider.ev.on('rsAfterContentSet', function(e, slideObject) {
             // fires when every time when slide content is loaded and added to DOM
             });



             // Next events TRIGGER DIRECTLY ON SLIDER INITIALIZATION
             // if you bind them after slider init they'll not fire
             // used for module development
             slider.ev.on('rsAfterInit', function() {
             // after slider is initialized,
             });
             slider.ev.on('rsBeforeParseNode', function(e, content, obj) {
             // before slide node is parsed
             // content - HTML object of slide that is parsed
             // obj - RoyalSlider data object (stores image URLs)
             });
             */
            d.sliderCon.updateSliderSize(true);
            var datalist = d.sliderCon.slides , l = datalist.length, last_id = datalist[l - 1].id;
            d.mapping_list[last_id] = template_id;
            //    .slider.slides
            //console.log(template_id);
            // console.log($obj);
        },
        getCurrentReportHTML: function () {
            var d = this,
                b = $(".rsContent.editorpage", d.$container),
                bank = "";
            b.each(function (i, val) {
                bank += $(val).html();
                //  console.log(val);
            });
            console.log(bank);
            return bank;
        },
        loadReports: function (html) {
            if (html != '') {

                var d = this, t = new String(html).replace(/^\s+|\s+$/gm, ''), template_html = $.parseHTML(t);
                $.each(template_html, function (i, node) {
                    var a = $(node), t = new String(a.html()).replace(/^\s+|\s+$/gm, ''), empty = t == '';
                    if (!empty) d.addTemplate(i, a);
                });
            }
        },
        edit_current_template: function () {
            var d = this,
                slide_id = d.sliderCon.currSlideId;
        },
        removeTemplatecurrent: function () {
            var d = this,
                slide_id = d.sliderCon.currSlideId;
            d.removeTemplate(slide_id);
        },
        removeTemplate: function (template_id) {
            var d = this;
            $.each(d.mapping_list, function (k, v) {
                if (v == template_id) {
                    d.sliderCon.removeSlide(k);
                    delete d.mapping_list[k];
                }
            });
        }
    }
});