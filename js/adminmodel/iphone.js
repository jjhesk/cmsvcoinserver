window.$P = function () {
};
(function (d, e, c, b, f) {
    b.CrossFader = c.Control.extend({defaults: {elementToShow: c.compute(0), elements: null, shownCallback: c.noop, hiddenCallback: c.noop, delay: c.compute(0)}}, {canTransition: !!e.AsSupport.transitionEndName, computes: null, elements: null, init: function (i, h) {
        this.computes = [];
        this.elements = [];
        if (!this.canTransition) {
            this.options.delay = c.compute(0)
        }
        if (typeof this.options.elements === "string") {
            this.elements = c.makeArray(this.element.find(this.options.elements))
        } else {
            this.elements = c.makeArray(this.options.elements)
        }
        var g = this;
        c.each(this.elements, function (k, j) {
            g.computes[j] = c.compute(false);
            new b.Materializer(k, {materialize: g.computes[j], shownCallback: g.options.shownCallback[j] ? g.options.shownCallback[j] : g.options.shownCallback, hiddenCallback: g.options.hiddenCallback[j] ? g.options.hiddenCallback[j] : g.options.hiddenCallback})
        });
        this.computes[this.options.elementToShow()](true)
    }, "{elementToShow} change": "swapImages", swapImages: function (k, l, j, h) {
        this.clearTimeout(this.timer);
        var g = e(this.elements[j]);
        var i = e(this.elements[h]);
        i.css("z-index", 1);
        g.css("z-index", 0);
        this.computes[j](true);
        this.timer = this.setTimeout(this.proxy(function () {
            this.computes[h](false)
        }), this.options.delay())
    }})
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.PropertyBinding = c.Control.extend({defaults: {updateEvent: "change", twoWay: false, getValue: function () {
        return this.element.prop(this.options.property)
    }, setValue: function (g) {
        this.element.prop(this.options.property, g)
    }, setCallback: c.noop, valueUpdate: false}}, {init: function () {
        this.valueType = this.getValueType();
        this.set()
    }, "{value} change": "set", "{updateEvent}": "update", keypress: "handleKeyPress", handleKeyPress: function (g, h) {
        if (e.AsSupport.ieVersion === 8 && g.is("input") && g.prop("type") === "text" && h.keyCode === jQuery.AsEvent.Keyboard.Return && this.options.updateEvent === "change") {
            this.update()
        }
    }, set: function () {
        var g;
        switch (this.valueType) {
            case"compute":
                g = this.options.value();
                break;
            case"observelist":
                g = this.options.value.attr();
                break;
            default:
                g = this.options.value
        }
        if (!this.options.valueUpdate) {
            this.setValue(g)
        }
        this.options.setCallback(g)
    }, update: function () {
        if (this.options.twoWay) {
            var g = this.getValue();
            this.options.valueUpdate = true;
            switch (this.valueType) {
                case"compute":
                    this.options.value(g);
                    break;
                case"observelist":
                    this.options.value.replace(g);
                    break;
                default:
                    this.options.value = g
            }
            this.options.valueUpdate = false
        }
    }, getValue: function () {
        return this.options.getValue.call(this)
    }, setValue: function (g) {
        return this.options.setValue.call(this, g)
    }, getValueType: function () {
        var g = "";
        if (c.isFunction(this.options.value)) {
            g = "compute"
        } else {
            if (typeof this.options.value.replace !== "undefined") {
                g = "observelist"
            }
        }
        return g
    }})
})(this, jQuery, can, as);
(function (d, e, c, b, f) {
    b.ImageView = c.Control.extend({defaults: {template: "{{AsImageView}}", imageSelector: "img", isLoaded: function (g) {
        return g.width() > 0
    }, imageLoadTimeout: 300, imageLoadTimeoutOffline: 30, loaded: c.compute(false)}}, {img: null, imgElement: null, setup: function (h, g) {
        if (!g) {
            g = {}
        }
        if (!g.model) {
            g.model = new c.Map({alt: "", src: "", width: "auto", height: "auto", mask: null})
        }
        g.model.control = this;
        this._super(h, g)
    }, init: function () {
        var g = c.view(this.options.template, this.options.model);
        this.element.html(g);
        this.img = this.element.find(this.options.imageSelector);
        this.imgElement = this.img[0];
        this.attachLoadHandler();
        var h = e.AsEnv.isOnline() ? this.options.imageLoadTimeout : this.options.imageLoadTimeoutOffline;
        this.setTimeout(this.proxy(function () {
            if (!this.options.loaded() && this.options.isLoaded(this.img)) {
                this.options.loaded(true)
            }
        }), h)
    }, attachLoadHandler: function () {
        var g = this;
        this.on(this.img, "load", function () {
            g.options.loaded(true)
        })
    }, forceImageLoad: function () {
        if (!this.imgElement) {
            return
        }
        var g = this.imgElement.src;
        this.imgElement.src = "";
        this.imgElement.src = g
    }, "{model} src": function () {
        this.options.loaded(false);
        this.forceImageLoad()
    }});
    c.Mustache.registerHelper("as.ImageView.mask", function (q, p) {
        var n = q();
        var j = "";
        if (n) {
            var h = n.attr("src");
            var l = n.attr("top");
            var k = n.attr("bottom");
            var i = n.attr("left");
            var m = n.attr("right");
            var g = n.attr("repeatX");
            var o = n.attr("repeatY");
            if (h) {
                j = "-webkit-mask-box-image: url(" + h + ")";
                j += l ? " " + l : "";
                j += m ? " " + m : "";
                j += k ? " " + k : "";
                j += i ? " " + i : "";
                j += g ? " " + g : "";
                j += o ? " " + o : "";
                j += ";"
            }
        }
        return j
    })
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.ImageSetView = b.ImageView.extend({defaults: {imgElement: null, imgSetData: null, srcSetKey: "srcSetData"}, calculatePxRatio: function (g) {
        if (!g) {
            if (e.cookie("pxro")) {
                g = e.cookie("pxro")
            } else {
                if (e.AsEnv.devicePixelRatio()) {
                    g = e.AsEnv.devicePixelRatio()
                } else {
                    g = 1
                }
            }
        }
        return parseFloat(g, 10)
    }, parseSourceSetData: function (k, r) {
        var h = k.src, m = true, q = "-webkit-image-set(", n = {}, l, s, j, g;
        for (var p in k) {
            l = p.match(/[\d\.]+$/);
            s = null;
            j = 0;
            g = 0;
            if (!l && p === "src") {
                s = h;
                j = r;
                g = 3
            } else {
                if (p.indexOf("scaleParam") === 0) {
                    s = b.ImageSetView.replaceGetParams(h, k[p]);
                    j = parseFloat(l[0]);
                    g = 2
                } else {
                    if (p.indexOf("scaleUrl") === 0) {
                        s = k[p];
                        j = parseFloat(l[0]);
                        g = 1
                    }
                }
            }
            if (s !== null && (!n["" + j] || g <= n["" + j].pri)) {
                n["" + j] = {pri: g, url: s}
            }
        }
        if (r === 1) {
            var o = {};
            o["1"] = n["1"];
            n = o
        }
        for (var i in n) {
            if (n[i] !== "") {
                q += (m ? "" : ", ") + "url(" + n[i].url + ") " + i + "x";
                m = false
            }
        }
        q += ")";
        return q
    }, pickSrcFromSrcSet: function (h, g) {
        var i = Infinity, j = "", k = /url\(['"]?(.*?)['"]?\)\s*?([\d\.]*?)x/g;
        h.replace(k, function (m, l, n) {
            var o = Math.abs(g - parseFloat(n));
            if (o < i) {
                j = l;
                i = o
            }
            return m
        });
        return j
    }, replaceGetParams: function (j, m) {
        var i = j.indexOf("?"), k, l, h, g;
        if (i >= 0) {
            k = j.substring(0, i);
            l = j.substring(i + 1, j.length);
            h = b.ImageSetView.fromQueryString(l);
            g = b.ImageSetView.fromQueryString(m);
            h = e.extend(h, g);
            return k + "?" + e.param(h)
        } else {
            return j + "?" + m
        }
    }, fromQueryString: function (h) {
        var g = {};
        if (h.charAt(0) === "?") {
            h = h.slice(1)
        }
        h = h.split(/\s*&\s*/);
        e.each(h, function (j, k) {
            b.ImageSetView.fromQueryStringProcessPair(k, g)
        });
        return g
    }, fromQueryStringProcessPair: function (j, g) {
        var h, i;
        j = j.split("=");
        if (j.length === 1) {
            return
        }
        h = decodeURIComponent(j[0]);
        i = decodeURIComponent(j[1]) || null;
        g[h] = i
    }}, {batchNum: null, init: function () {
        var g = this.options.imgSetData.attr(this.options.srcSetKey), j = this.constructor.calculatePxRatio(this.options.imgSetData.attr("pxRatio")), h, i;
        h = this.constructor.parseSourceSetData(g, j);
        i = this.constructor.pickSrcFromSrcSet(h, j);
        this.options.model.attr("src", i);
        this._super();
        this.options.imgElement = this.element.find("img");
        this.options.imgElement.css("content", h)
    }, "{imgSetData} change": "updateStyleAndSrc", updateStyleAndSrc: function (i, o, k, m, h, n) {
        if (o.batchNum && o.batchNum === this.batchNum) {
            return
        }
        this.batchNum = o.batchNum;
        var j = i.attr(this.options.srcSetKey), g = this.constructor.calculatePxRatio(i.attr("pxRatio")), l = this.constructor.parseSourceSetData(j, g), p = this.constructor.pickSrcFromSrcSet(l, g);
        this.options.model.attr("src", p);
        this.options.imgElement.css("content", l)
    }})
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.SocialSharingDisplay = c.Control.extend({defaults: {productNumber: null, fireOmnitureFlag: true}}, {init: function () {
        this.updateSocialSharingURL()
    }, "a[target] click": "linkClicked", linkClicked: function (h, g) {
        if (this.options.fireOmnitureFlag) {
            e.AsMetrics.fireMicroEvent({eVar: "eVar6", part: this.options.productNumber, feature: "Sharing", action: h.attr("class") + " post"})
        }
    }, updateSocialSharingURL: function () {
        var g = this.element.find("a[target]");
        g.each(function (i, j) {
            if (j) {
                var k = e(j).attr("href"), h = k.match(/\?vid2\=|&vid2\=/i);
                if (h === null) {
                    if (k.indexOf("?") > -1) {
                        k = /&$/.test(k) ? k + "vid2=web" : k + "&vid2=web"
                    } else {
                        k = k + "?vid2=web"
                    }
                    e(j).attr("href", k)
                }
            }
        })
    }})
}(this, jQuery, can, as));
(function (i) {
    var k = "ontouchstart" in window, h = k ? "touchstart" : "mousedown", e = k ? "touchend touchcancel" : "mouseup mouseleave", b = k ? "touchmove" : "mousemove", f = "aos", d, n = i.Touchy = {pressDuration: 300, doubleTapInterval: 300, flickDuration: 150, motionThreshold: 5, scrollLockDistance: 15, dragLockDistance: 30};
    if (i.AsSupport.isIe && "ondragstart" in document) {
        document.ondragstart = function () {
            return false
        }
    }
    function l(q, p) {
        return(k ? p.originalEvent.touches[0] : p)["page" + q.toUpperCase()]
    }

    function c(s, q, r, p) {
        q = i.extend({}, q, {preventDefault: function () {
            p.preventDefault()
        }});
        i.each(s, function (u, t) {
            i.event.trigger(i.Event(t, q), null, r)
        })
    }

    function g(q) {
        var s = {}, p = q.timeStamp || +new Date(), r = i.data(this, f);
        if (d === p) {
            return
        }
        d = p;
        s.hasStarted = true;
        s.scrollLocked = false;
        s.move = {x: l("x", q), y: l("y", q)};
        s.start = i.extend({time: p, target: q.target}, s.move);
        s.gesture = q.originalEvent.touches && q.originalEvent.touches.length > 1;
        if (!s.gesture) {
            s.timeout = setTimeout(i.proxy(function () {
                c(["press"], s.move, q.target, q)
            }, this), i.Touchy.pressDuration)
        }
        i.event.add(this, b + "." + f, j, s);
        i.event.add(this, e + "." + f, o, s);
        if (r.preventDefault) {
            q.preventDefault()
        }
    }

    function j(q) {
        var x = this, w = q.data, r = w.start, t = w.move, u = w.gesture, v;
        if (w.hasStarted) {
            var s = l("x", q);
            var p = l("y", q);
            t.idx = s - t.x;
            t.idy = p - t.y;
            t.x = s;
            t.y = p;
            t.dx = t.x - r.x;
            t.dy = t.y - r.y;
            t.adx = Math.abs(t.dx);
            t.ady = Math.abs(t.dy);
            w.motion = t.adx > n.motionThreshold || t.ady > n.motionThreshold;
            if (!w.motion) {
                return
            }
            clearTimeout(w.timeout);
            if (typeof w.isDragging === "undefined") {
                if (t.adx >= t.ady && t.adx > n.dragLockDistance) {
                    w.isDragging = true
                } else {
                    if (t.ady > t.adx && t.ady > n.scrollLockDistance) {
                        w.isDragging = false
                    }
                }
            }
            if (w.scrollLocked) {
                if (w.isDragging) {
                    q.preventDefault()
                } else {
                    return
                }
            }
            if (!t.orientation) {
                t.direction = t.dx > 0 ? "right" : "left"
            }
            if (q.target !== r.target) {
                q.target = r.target;
                o.call(this, i.Event(e + "." + f, q));
                return
            }
            if (!u) {
                v = w.dragStart ? "dragmove" : "dragstart";
                w.dragStart = true;
                t.lockScroll = function () {
                    w.scrollLocked = true
                };
                t.cancel = function () {
                    c(["dragend"], t, q.target, q);
                    w.dragStart = false;
                    i.event.remove(x, b + "." + f, j);
                    i.event.remove(x, e + "." + f, o)
                };
                c([v], t, q.target, q)
            }
        }
    }

    function o(r) {
        var t = r.data, p = r.timeStamp || +new Date(), s = i.data(this, f), q = p - t.start.time, u = [];
        t.hasStarted = false;
        clearTimeout(t.timeout);
        if (r.target !== t.start.target) {
            return
        }
        if (!t.motion) {
            u.push(q < n.pressDuration && !s.prev || s.prev && p - s.prev > n.doubleTapInterval ? "tap" : "doubletap");
            s.prev = p
        } else {
            if (t.gesture) {
                u.push("pinch" + (r.originalEvent.scale < 1) ? "in" : "out")
            } else {
                if (q < n.flickDuration) {
                    u.push("swipe" + t.move.direction)
                }
            }
            if (t.dragStart && t.isDragging) {
                u.push("dragend")
            }
        }
        c(u, t.move, r.target, r);
        i.event.remove(this, b + "." + f, j);
        i.event.remove(this, e + "." + f, o)
    }

    var m = {add: function (p) {
        var r = p.data, q;
        if (!i.data(this, f)) {
            i.event.add(this, h + "." + f, g);
            q = i.data(this, f, {});
            if (n.preventDefault || r && r.preventDefault) {
                q.preventDefault = true
            }
        }
    }, teardown: function () {
        if (i.data(this, f)) {
            i.event.remove(this, h + "." + f, g);
            i.data(this, f, null)
        }
    }};
    i.event.special.tap = m;
    i.event.special.press = m;
    i.event.special.doubletap = m;
    i.event.special.dragstart = m;
    i.event.special.dragmove = m;
    i.event.special.dragend = m;
    i.event.special.swipeleft = m;
    i.event.special.swiperight = m;
    i.event.special.pinchin = m;
    i.event.special.pinchout = m
})(jQuery);
(function (d, e, c, f) {
    var b = function (g, h) {
        if (c.isFunction(h[g])) {
            return function () {
                return h[g].apply(h, arguments)
            }
        } else {
            return d[g]
        }
    };
    c.extend(c, {debounce: function (j, m, l, i) {
        if (typeof m !== "boolean") {
            i = l;
            l = m;
            m = false
        }
        i = i || this;
        var h = b("setTimeout", i), g = b("clearTimeout", i), k;
        return function () {
            i = i || this;
            var p = arguments, o = c.isFunction(l) ? l() : l, n = function () {
                if (!m) {
                    j.apply(i, p)
                }
                k = null
            };
            if (k) {
                g(k)
            } else {
                if (m) {
                    j.apply(i, p)
                }
            }
            k = h(n, o)
        }
    }, throttle: function (j, n, m, i) {
        if (typeof n !== "boolean") {
            i = m;
            m = n;
            n = true
        }
        i = i || this;
        var h = b("setTimeout", i), g = b("clearTimeout", i), k = 0, l;
        return function () {
            var q = arguments, r = +new Date() - k, p = c.isFunction(m) ? m() : m, o = function () {
                k = +new Date();
                j.apply(i, q)
            };
            g(l);
            if (r >= p) {
                o()
            } else {
                if (n) {
                    l = h(o, p - r)
                }
            }
        }
    }})
})(this, jQuery, can);
(function (d, e, c, b, f) {
    b.GalleryThumbnails = c.Control.extend({defaults: {images: new c.List([]), selectedIndex: c.compute(0), selectedObject: c.compute({}), template: "{{GalleryThumbnails}}", listSelector: ".thumbnails li", maxNumberOfThumbnails: 8, thumbnailLinkImageKey: "gallery", thumbnailClass: "", thumbnailSelectedClass: "selected", thumbnailHoverClass: "thumbnails-hover", thumbnailAnchorHoverClass: "thumbnails-anchor-hover", accessibilityText: null}}, {altValues: [], focusedElement: null, nextIndex: 0, prevIndex: 0, init: function () {
        if (this.options.images[0]) {
            this.options.images[0].attr("first", true)
        }
        this.options.selectedObject = c.compute(function () {
            return this.options.images[this.options.selectedIndex()]
        }, this);
        this.on();
        this.updateSelectedImage(this.options.selectedObject, {}, this.options.selectedObject());
        this.render()
    }, resetIndex: function (g) {
        this.options.selectedIndex(null);
        this.options.selectedIndex(g)
    }, "{listSelector} click": "thumbnailClicked", "{images} change": "listChanged", "{selectedObject} change": "updateSelectedImage", "{listSelector} keydown": "handleKeydown", "{listSelector} a focus": "focusThumbnail", "{listSelector} a blur": "blurThumbnail", thumbnailClicked: function (g, h) {
        if (h) {
            h.preventDefault()
        }
        this.options.selectedIndex(g.index());
        e(this.options.listSelector).removeAttr("tabindex");
        e(g).attr("tabindex", 0);
        g.css("outline", "none");
        this.element.find(".active").focus()
    }, listChanged: function (h, l, g, k, j, i) {
        if (k === "add" && c.isArray(j)) {
            this.resetIndex(0)
        }
        e(this.options.listSelector).blur()
    }, updateSelectedImage: function (j, g, i, h) {
        c.batch.start();
        if (h) {
            h.attr("selected", false)
        }
        if (i) {
            i.attr("selected", true)
        }
        c.batch.stop();
        this.focusedElement = null
    }, handleKeydown: function (i, j) {
        var g = this.options.selectedIndex(), h = this.options.images.length;
        switch (j.keyCode) {
            case e.AsEvent.Keyboard.ArrowRight:
                j.preventDefault();
                if (g < (h - 1)) {
                    this.nextIndex = g + 1;
                    this.options.selectedIndex(this.nextIndex);
                    this.thumbnailClicked(i.next(), j)
                } else {
                    this.nextIndex = 0;
                    this.options.selectedIndex(this.nextIndex);
                    this.thumbnailClicked(e("ul.thumbnails .first"), j)
                }
                break;
            case e.AsEvent.Keyboard.ArrowLeft:
                j.preventDefault();
                if (g > 0) {
                    this.prevIndex = g - 1;
                    this.options.selectedIndex(this.prevIndex);
                    this.thumbnailClicked(i.prev(), j)
                } else {
                    this.prevIndex = h - 1;
                    this.options.selectedIndex(this.prevIndex);
                    this.thumbnailClicked((e("ul.thumbnails").children().last()), j)
                }
                break;
            case e.AsEvent.Keyboard.Space:
                j.preventDefault();
                this.options.selectedIndex(i.index());
                break;
            default:
                break
        }
    }, focusThumbnail: function (g, h) {
        if (g.parent().hasClass(this.options.thumbnailSelectedClass)) {
            this.focusedElement = null
        } else {
            this.focusedElement = g.parent();
            this.focusedElement.addClass(this.options.thumbnailHoverClass);
            g.addClass(this.options.thumbnailAnchorHoverClass)
        }
    }, blurThumbnail: function (g, h) {
        g.parent().removeClass(this.options.thumbnailHoverClass);
        g.removeClass(this.options.thumbnailAnchorHoverClass)
    }, render: function () {
        this.getAccessibilityText();
        var g = c.view(this.options.template, {images: this.options.images, setViewOptions: {srcSetKey: "srcSet"}, altValues: this.altValues, maxNumberOfThumbnails: this.options.maxNumberOfThumbnails, linkImageKey: this.options.thumbnailLinkImageKey, thumbnailClass: this.options.thumbnailClass, thumbnailSelectedClass: this.options.thumbnailSelectedClass});
        this.element.html(g);
        if (this.options.thumbnailLinkImageKey === "overlay") {
            this.prepareForFocus()
        }
    }, prepareForFocus: function () {
        var g = this;
        this.setTimeout(function () {
            g.thumbnailClicked(g.element.find(".active"), null)
        }, 1000)
    }, "{isOpen} change": function () {
        if (this.options.isOpen()) {
            this.prepareForFocus()
        }
    }, getAccessibilityText: function () {
        this.altValues = [];
        var g = this;
        if (this.options.accessibilityText) {
            this.options.images.each(function (i, h) {
                g.altValues.push(g.options.accessibilityText + " " + (h + 1))
            })
        } else {
            this.element.find(".a11y").each(function () {
                g.altValues.push(e(this).text())
            })
        }
    }});
    c.Mustache.registerHelper("GalleryThumbnail", function (k, l, g, i, h) {
        var j = this;
        g = g || [];
        return function (q) {
            var o = e(q);
            var n = o.parent().index(), m = g[n] || "", r = j.attr("thumbnail");
            if (n > l - 1) {
                o.parent().addClass("extra")
            }
            o.attr("href", j[i].srcSet.attr("src"));
            var p = new c.Map({alt: "", width: j.attr("thumbnail").dimensions.width + "px", height: j.attr("thumbnail").dimensions.height + "px"});
            var s = c.extend({}, k, {model: p, imgSetData: r});
            new b.ImageSetView(q, s);
            o.append('<span class="a11y">' + m + "</span>")
        }
    })
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.Gallery = c.Control.extend("as.Gallery", {defaults: {images: new c.List([]), hideThumbnail: false, thumbnailSelector: ".controller", thumbnailTemplate: "{{GalleryThumbnails}}", captionSelector: ".caption", caption: null, maxNumberOfThumbnails: 12, gallerySelector: ".gallery", imageTemplate: "{{AsGalleryImageView}}", selectedIndex: c.compute(0), galleryModeSelector: ".product-details .product-info .gallery div", closeButtonSelector: ".toggle", rightButtonSelector: ".right", leftButtonSelector: ".left", locked: c.compute(false), spinnerDelay: 800, swipeDistance: 1100, maxSwipeTime: 0.6, gallerySwipeDistance: 1100, galleryControlTimeout: 3000, minSwipeDistance: 500, minSwipeVelocity: 0.8, animationVelocity: 1.8, activeTabIndex: 0, defaultMode: "inline", thumbnailLinkImageKey: "gallery", thumbnailClass: "thumbnail", thumbnailSelectedClass: "selected", crossFaderDurationForNotZoomed: 400, accessibilityText: null, centeringThreshold: 10, firstImage: {}, secondImage: {}}}, {imageToUpdate: null, imageToShow: null, ignoreImageUpdate: f, beforeDragPosition: {}, crossfaderShownCallback: c.compute(null), crossfaderDelay: c.compute(300), readyToSwap: c.compute(false), mode: "inline", galleryElement: null, overlayElement: null, canTransition: !!e.AsSupport.transitionEndName, isZoomed: false, triggeredActions: [], spinnerTimeout: null, isDragging: null, updateId: 0, shouldRender: true, lockScroll: true, lastCenter: {left: -1, top: -1}, setup: function (h, g) {
        this.trackScroll = c.debounce(this.trackScroll, 100, this);
        this.resize = c.debounce(this.resize, 100, this);
        this.galleryElement = e(h).find(g.gallerySelector || this.constructor.defaults.gallerySelector);
        g.clickEvent = e.AsSupport.touch ? "tap" : "click";
        g.clickOrTouchStartEvent = e.AsSupport.touch ? "touchstart" : "click";
        this._super(h, g)
    }, init: function () {
        var i = this.options.selectedIndex();
        this.lastCenter = {left: -1, top: -1};
        this.render();
        this.imageCount = Math.min(this.options.images.length, this.options.maxNumberOfThumbnails);
        this.options.firstImage.wrapper = this.galleryElement.find("div:eq(0)");
        this.options.firstImage.index = c.compute(i);
        this.options.firstImage.data = new c.Map({});
        this.options.firstImage.model = new c.Map({alt: "Gallery Item " + (parseInt(i, 10) + 1)});
        this.options.secondImage.wrapper = this.galleryElement.find("div:eq(1)");
        this.options.secondImage.index = c.compute(i);
        this.options.secondImage.data = new c.Map({});
        this.options.secondImage.model = new c.Map({alt: "Gallery Item " + (parseInt(i, 10) + 1)});
        this.currentImageIndex = c.compute(function () {
            var j = this.imageToUpdate();
            return j === 1 ? this.options.firstImage.index() : this.options.secondImage.index()
        }, this);
        this.imageToUpdate = c.compute(1);
        this.imageToShow = c.compute(0);
        this.activeImage = c.compute(function () {
            var j = this.imageToUpdate();
            return j === 0 ? this.options.secondImage.wrapper : this.options.firstImage.wrapper
        }, this);
        this.inactiveImage = c.compute(function () {
            var j = this.imageToUpdate();
            return j === 1 ? this.options.secondImage.wrapper : this.options.firstImage.wrapper
        }, this);
        this.normalizeImageData();
        this.mode = this.options.defaultMode;
        this.crossFaderDurationForNotZoomed = this.canTransition ? this.options.crossFaderDurationForNotZoomed : 0;
        var g = this.element.find(this.options.captionSelector);
        if (g.length && this.options.caption) {
            g.html(this.options.caption)
        }
        this.initiateGalleryThumbnail();
        this.updateImageSrc();
        this.hookup();
        this.options.firstImage.img = this.options.firstImage.wrapper.find("img").css({width: "100%", height: "100%"});
        this.options.secondImage.img = this.options.secondImage.wrapper.css("z-index", -1).find("img").css({width: "100%", height: "100%"});
        if (e.AsSupport.touch) {
            this.options.firstImage.wrapper.addClass("draggable")
        }
        this.galleryElement.attr({"aria-live": "polite", "aria-busy": "false"});
        this.activeImage().attr({tabindex: this.getActiveTabIndex(), "aria-hidden": "false", "aria-expanded": "true"});
        this.inactiveImage().attr({tabindex: "-1", "aria-hidden": "true", "aria-expanded": "false"});
        var h = this.galleryElement.find("img.image");
        h.css({display: "none"});
        this.setGalleryElementHeight();
        this.updateImageDimensions();
        this.calculate()
    }, "{images} change": "listChanged", "{metrics} change": "updateMetrics", "{selectedIndex} change": "updateSelectedImage", "{gallerySelector} img {clickEvent}": "imageClicked", "{gallerySelector} mousedown": "preventFocus", "{document} touchend": "calculateZoom", "{document} touchstart": "enableGalleryButtons", "{document} scroll": "trackScroll", mousemove: "enableGalleryButtons", "{gallerySelector} .draggable dragstart": "startDrag", "{gallerySelector} .draggable dragmove": "dragMove", "{gallerySelector} .draggable dragend": "endDrag", "{window} resize": "resize", "{window} orientationchange": "reorient", "{gallerySelector} keydown": "forceGalleryClick", initiateGalleryThumbnail: function () {
        if (!this.options.hideThumbnail) {
            new b.GalleryThumbnails(this.element.find(this.options.thumbnailSelector), {images: this.options.images, template: this.options.thumbnailTemplate, selectedIndex: this.options.selectedIndex, maxNumberOfThumbnails: this.options.maxNumberOfThumbnails, thumbnailLinkImageKey: this.options.thumbnailLinkImageKey, thumbnailClass: this.options.thumbnailClass, thumbnailSelectedClass: this.options.thumbnailSelectedClass, accessibilityText: this.options.accessibilityText})
        }
    }, listChanged: function (h, l, g, k, j, i) {
        if (k === "add" && c.isArray(j)) {
            this.ignoreImageUpdate = this.imageToShow();
            this.imageCount = Math.min(j.length, this.options.maxNumberOfThumbnails)
        }
    }, updateMetrics: function (h, i, g) {
        this.triggeredActions = []
    }, updateSelectedImage: function (h, i, k, j) {
        if (k === null) {
            return
        }
        this.updateId++;
        var g = this.updateId;
        this.options.locked(true);
        if (this.imageToUpdate() === 0 && this.ignoreImageUpdate !== 0) {
            this.options.firstImage.index(k)
        } else {
            if (this.ignoreImageUpdate !== 1) {
                this.options.secondImage.index(k)
            }
        }
        if (this.sliding) {
            this.updateImageSrc(this.ignoreImageUpdate);
            this.swapImage(this.proxy(function () {
                this.imagesLoaded(this.proxy("finishSlide"))
            }));
            this.ignoreImageUpdate = f
        } else {
            this.updateImageSrc(this.ignoreImageUpdate);
            this.imagesLoaded(this.proxy(function () {
                if (this.updateId === g) {
                    this.swapImage(this.proxy(function () {
                        this.setTimeout(function () {
                            this.options.locked(false)
                        }, this.crossFaderDurationForNotZoomed);
                        this.ignoreImageUpdate = f
                    }))
                }
            }))
        }
    }, imageClicked: function (g, h) {
        this.options.selectedIndex(this.getNextImageIndex())
    }, preventFocus: function (g, h) {
        h.preventDefault()
    }, calculateZoom: function (g, i) {
        var j = this.isZoomed, h = Math.max(document.documentElement.clientWidth / d.innerWidth, 1);
        if (h > 1) {
            this.isZoomed = true;
            this.disableGalleryButtons()
        } else {
            this.isZoomed = false
        }
    }, trackScroll: function (h, i) {
        var j = e(d), g = this.galleryElement;
        this.prevScrollX = j.scrollLeft();
        this.prevScrollY = j.scrollTop();
        this.prevScrollPercX = (this.prevScrollX + d.innerWidth / 2) / g.width();
        this.prevScrollPercY = (this.prevScrollY + d.innerHeight / 2) / g.height()
    }, enableGalleryButtons: function () {
    }, disableGalleryButtons: function () {
    }, getNextImageIndex: function () {
        var g = this.currentImageIndex() + 1;
        if (g < this.imageCount) {
            return g
        } else {
            return 0
        }
    }, startDrag: function (g, h) {
        if (this.options.locked()) {
            h.cancel()
        }
        if (this.lockScroll) {
            h.lockScroll()
        }
        this.isDragging = true;
        this.startDragTime = h.timeStamp;
        this.beforeDragPosition = {left: parseInt(g.css("left"), 10), top: parseInt(g.css("top"), 10), }
    }, moveImageTo: function (i, h, j, g) {
        this.finishAnimation(i, function () {
            i.css({"-webkit-transition-property": "", "-webkit-transition-duration": "", "-webkit-transition-timing-function": ""});
            if (g) {
                g()
            }
        });
        i.css({"-webkit-transition-property": "-webkit-transform", "-webkit-transition-timing-function": "ease-out", "-webkit-transition-duration": j + "s", "-webkit-transform": "translate3d(" + h + "px,0,0)"})
    }, moveImage: function (h, g) {
        var i = false;
        if (typeof g === "boolean") {
            g = {top: "", left: ""};
            i = true
        } else {
            g.left = g.left || 0
        }
        if (e.AsSupport.touch) {
            g.top = g.top || 0;
            h.css("-webkit-transform", (i ? "" : "translate3d(" + g.left + "px," + g.top + "px, 0)"))
        } else {
            h.css(g)
        }
    }, dragMove: function (g, h) {
        if (!this.options.locked() || this.isZoomed) {
            var j = this.getDragPosition(g, h), i = this.activeImage().add(this.inactiveImage());
            this.moveImage(i, j)
        }
    }, getDragPosition: function (h, i) {
        var m = {left: 0, top: 0};
        if (e.AsSupport.touch && !this.isZoomed) {
            if (i.adx > this.options.minSwipeDistance) {
                i.preventDefault()
            }
            var k = i.dx < 0 ? 1 : -1;
            var g = this.validIndex(k);
            var l;
            if (g === false) {
                var j = this.getDragEdge();
                l = Math.min(Math.abs(i.dx), j);
                l = Math.min(0.38 * j * Math.sin(Math.PI * l / (2 * j)), l);
                l = l * -1 * k
            } else {
                l = i.dx
            }
            m.left = l
        }
        return m
    }, getDragEdge: function () {
        return this.options.swipeDistance
    }, validIndex: function (h) {
        var g = this.options.selectedIndex() + h;
        if (g < 0 || g > this.imageCount - 1) {
            return false
        }
        return g
    }, endDrag: function (g, q) {
        if (e.AsSupport.touch && !this.isZoomed) {
            this.isDragging = false;
            var t = this, o = this.activeImage().add(this.inactiveImage()), m = q.timeStamp - this.startDragTime, k = q.dx, j = Math.abs(k / m), v = j > this.getMinSwipeVelocity(), l = Math.abs(k) > this.getMinSwipeDistance(), r = k < 0 ? 1 : -1, s = this.validIndex(r), u = false, p = this.getDragDestination(r), i, n;
            j = this.options.animationVelocity;
            i = this.options.swipeDistance / j;
            if ((v || l) && s !== false) {
                n = function () {
                    t.slideToImage(s)
                };
                this.moveImageTo(o, p, i / 1000, n);
                this.setTimeout(function () {
                    o.trigger(e.AsSupport.transitionEndName)
                }, i)
            } else {
                if (!this.sliding) {
                    var h = s !== false ? 0.5 : 1;
                    this.snapBack(o, h * i / 1000)
                }
            }
            q.stopPropagation()
        }
        q.preventDefault()
    }, getMinSwipeDistance: function () {
        return this.options.minSwipeDistance
    }, getMinSwipeVelocity: function () {
        return this.options.minSwipeVelocity
    }, getDragDestination: function (g) {
        return -1 * g * this.options.swipeDistance
    }, resize: function (g, h) {
        this.calculate()
    }, reorient: function (h, i) {
        var g, j;
        if (this.isZoomed) {
            g = [this.galleryElement.width(), this.galleryElement.height()];
            j = [d.innerWidth, d.innerHeight];
            d.scrollTo((this.prevScrollPercX * g[0]) - j[0] / 2, (this.prevScrollPercY * g[1]) - j[1] / 2)
        }
    }, forceGalleryClick: function (g, h) {
        if (h.keyCode === e.AsEvent.Keyboard.Return) {
            e(h.target).find("img").click()
        }
    }, slideToImage: function (j) {
        if (this.options.locked()) {
            return
        }
        this.options.locked(true);
        this.sliding = true;
        this.calculate();
        this.spinnerTimeout = this.setTimeout(function () {
            this.galleryElement.addClass("image-loading")
        }, this.options.spinnerDelay);
        var i = this.options.selectedIndex(), k = i < j, h = k ? this.farRight : this.farLeft, l = k ? this.farLeft : this.farRight, g = this.activeImage(), m = this.inactiveImage();
        this.moveImage(m, {left: h});
        g.addClass(e.AsSupport.touch ? "swipe" : "slide");
        this.moveImage(g, {left: l});
        this.finishAnimation(g, function () {
            this.options.selectedIndex(j)
        })
    }, finishSlide: function () {
        var g = this.inactiveImage(), j = this.activeImage(), i = j.add(g), h;
        this.clearTimeout(this.spinnerTimeout);
        this.galleryElement.removeClass("image-loading");
        j.addClass(e.AsSupport.touch ? "swipe" : "slide");
        if (e.AsSupport.touch) {
            h = 0
        } else {
            h = this.imgGalleryLeft
        }
        this.moveImage(j, {left: h});
        this.finishAnimation(j, function () {
            if (e.AsSupport.touch) {
                this.moveImage(i, true)
            }
            i.removeClass("swipe slide");
            this.enableGalleryButtons();
            this.options.locked(false);
            this.sliding = false;
            i.css("-webkit-transform", "")
        })
    }, updateImageSrc: function (i) {
        var h, g = this.getImageModeForUpdate();
        if (i !== 0) {
            h = this.options.firstImage.index();
            this.options.firstImage.data.attr(this.options.images[h][g].attr(), true);
            this.options.firstImage.model.attr("alt", "Gallery Item " + (parseInt(h, 10) + 1))
        }
        if (i !== 1) {
            h = this.options.secondImage.index();
            this.options.secondImage.data.attr(this.options.images[h][g].attr(), true);
            this.options.secondImage.model.attr("alt", "Gallery Item " + (parseInt(h, 10) + 1))
        }
    }, getImageModeForUpdate: function () {
        return this.mode
    }, updateImageDimensions: function () {
        var h = this.options.images[this.options.firstImage.index()][this.mode].dimensions, g = this.options.images[this.options.secondImage.index()][this.mode].dimensions;
        this.options.firstImage.wrapper.css({width: h.width, height: h.height});
        this.options.secondImage.wrapper.css({width: h.width, height: h.height});
        this.options.firstImage.wrapper.css({position: "absolute"});
        this.options.secondImage.wrapper.css({position: "absolute"})
    }, setGalleryElementHeight: function () {
        var g = this.options.images[this.options.firstImage.index()][this.mode].dimensions;
        this.galleryElement.css({height: g.height})
    }, swapImage: function (g) {
        this.crossfaderShownCallback(this.proxy(function () {
            this.inactiveImage().css("z-index", -1).removeClass("draggable").attr({tabindex: "-1", "aria-hidden": "true", "aria-expanded": "false"});
            this.activeImage().attr({tabindex: this.getActiveTabIndex(), "aria-hidden": "false", "aria-expanded": "true"});
            if (this.isDraggable()) {
                this.activeImage().addClass("draggable")
            }
            if (g) {
                g()
            }
        }));
        this.imageToUpdate(+!this.imageToUpdate());
        this.imageToShow(+!this.imageToShow())
    }, getActiveTabIndex: function () {
        return this.options.activeTabIndex
    }, isDraggable: function () {
        return e.AsSupport.touch
    }, normalizeImageData: function () {
        var g = [];
        this.options.images.each(function (h, j) {
            if (h) {
                var i = {};
                c.each(h.attr(), function (l, k) {
                    i[k] = {srcSet: l.srcSet, dimensions: l.dimensions ? l.dimensions : {height: l.height, width: l.width}}
                });
                g.push(i)
            }
        });
        this.options.images.replace(g)
    }, _render: function () {
        this.galleryElement.append('<div role="tabpanel"></div><div role="tabpanel"></div>')
    }, render: function () {
        if (this.shouldRender) {
            this._render();
            this.shouldRender = false
        }
    }, hookup: function () {
        this.hookupCrossFade();
        this.hookupImageSetView()
    }, hookupCrossFade: function () {
        this.crossfaderShownCallback = c.compute(null);
        this.crossfaderDelay = c.compute(300);
        this.crossfader = new b.CrossFader(this.galleryElement, {elementToShow: this.imageToShow, elements: "div", shownCallback: this.crossfaderShownCallback, delay: this.crossfaderDelay})
    }, hookupImageSetView: function () {
        var g = {template: this.options.imageTemplate, srcSetKey: "srcSet"};
        this.options.firstImage.imageSetView = new b.ImageSetView(this.options.firstImage.wrapper, c.extend(g, {model: this.options.firstImage.model, imgSetData: this.options.firstImage.data}));
        this.options.secondImage.imageSetView = new b.ImageSetView(this.options.secondImage.wrapper, c.extend(g, {model: this.options.secondImage.model, imgSetData: this.options.secondImage.data}));
        this.options.readyToSwap = c.compute(function () {
            return this.options.firstImage.imageSetView.options.loaded() && this.options.secondImage.imageSetView.options.loaded()
        }, this);
        this.options.readyToSwap.bind("change", function () {
        })
    }, imagesLoaded: function (g) {
        var h = this, i = function (l, k) {
            if (k) {
                j();
                g()
            }
        }, j = function () {
            h.options.readyToSwap.unbind("change", i)
        };
        if (this.options.readyToSwap()) {
            g();
            return
        }
        this.options.readyToSwap.bind("change", i)
    }, getActiveImageDataDimensions: function () {
        return{width: this.activeImage().width(), height: this.activeImage().height()}
    }, snapBack: function (g, h) {
        this.moveImageTo(g, 0, h)
    }, finishAnimation: function (l, k, h) {
        if (this.canTransition) {
            var m = +new Date(), j = e(l), i = h || 25, g = c.debounce(function () {
                j.off(e.AsSupport.transitionEndName + "." + m);
                if (this.timer && this.timer > 0) {
                    clearTimeout(this.timer)
                }
                k.apply(this, arguments)
            }, i, this);
            this.timer = setTimeout(g, 2000);
            j.on(e.AsSupport.transitionEndName + "." + m, g)
        } else {
            this.setTimeout(this.proxy(k))
        }
    }, centerImages: function () {
        var h = this, k = e(d), j = this.activeImage().add(this.inactiveImage()), i = this.options.images[this.options.firstImage.index()][this.mode].dimensions, l, g;
        if (!this.isZoomed) {
            l = [k.width(), k.height()]
        } else {
            l = [document.documentElement.offsetWidth, Math.floor(document.documentElement.offsetWidth * d.innerHeight / d.innerWidth)]
        }
        g = {left: Math.round(l[0] / 2 - i.width / 2), top: Math.round(l[1] / 2 - i.height / 2)};
        if (this.lastCenter) {
            c.each(["left", "top"], function (m) {
                if (Math.abs(g[m] - h.lastCenter[m]) <= h.options.centeringThreshold) {
                    g[m] = h.lastCenter[m]
                }
            })
        }
        this.lastCenter = g;
        j.css(g);
        return g
    }, calculate: function () {
        var g = this.getActiveImageDataDimensions(), h = this.getContainerWidthForCalculation();
        this.imgGalleryLeft = (h / 2 - g.width / 2);
        this.farLeft = -(this.options.gallerySwipeDistance);
        this.farRight = h + this.options.gallerySwipeDistance
    }, getContainerWidthForCalculation: function () {
        return this.element.width()
    }})
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.OverlayGallery = b.WebOverlay.extend("as.OverlayGallery", {defaults: {galleryOptions: {}, overlayTriggerSelector: null, width: c.compute(false), height: c.compute(false), className: "overlay-gallery", widthDelegate: function (g) {
        return e(d).width()
    }, heightDelegate: function (g) {
        return e(d).height()
    }, galleryController: "as.Gallery"}}, {setup: function (h, g) {
        if (g.overlayTriggerSelector) {
            g.overlayTriggerElement = e(g.overlayTriggerSelector)
        }
        this._super(h, g)
    }, "{overlayTriggerElement} click": "openOverlay", openOverlay: function () {
        this.position();
        e("body").addClass("hide");
        this.open()
    }, close: function () {
        e("body").removeClass("hide");
        this._super()
    }, handleContentChange: function (j, g, i, h) {
        this.isGalleryCreated = false;
        this._super(j, g, i, h)
    }, controllerArray: function () {
        var g = {"as.Gallery": b.Gallery, "as.FullBleedGallery": b.FullBleedGallery};
        return g
    }, onOpen: function (h) {
        var i = this.controllerArray();
        if (!this.isGalleryCreated) {
            var g = this.element.find(this.options.contentSelector).children(":eq(0)");
            this.options.galleryOptions.isOpen = this.options.isOpen;
            new i[this.options.galleryController](g, this.options.galleryOptions);
            this.isGalleryCreated = true
        }
        this._super(h)
    }})
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.FullBleedGallery = b.Gallery.extend({defaults: {carouselIndicatorTemplate: "{{GalleryCarouselIndicator}}", hideCarouselIndicator: true, GalleryArrowTemplate: "{{GalleryArrowButtons}}", fullBleed: false, showArrows: false, isCyclic: false, alwaysShowGalleryControls: true, activeTabIndex: -1, imagePadding: null}}, {showLeftGalleryButton: c.compute(false), showRightGalleryButton: c.compute(false), backgroundClassList: [], init: function () {
        this._super();
        if (this.options.showArrows) {
            var g = c.view(this.options.GalleryArrowTemplate, {});
            e(this.element).append(g);
            this.leftGalleryButton = this.element.find(this.options.leftButtonSelector);
            this.rightGalleryButton = this.element.find(this.options.rightButtonSelector);
            this.showLeftGalleryButton = c.compute(this.options.alwaysShowGalleryControls);
            this.showRightGalleryButton = c.compute(this.options.alwaysShowGalleryControls);
            this.buttonTimer = null;
            new b.Materializer(this.leftGalleryButton, {materialize: this.showLeftGalleryButton});
            new b.Materializer(this.rightGalleryButton, {materialize: this.showRightGalleryButton})
        }
        if (this.options.fullBleed) {
            this.populateBackgroundClassList();
            this.updateBackgroundClass()
        }
        if (this.options.imagePadding) {
            this.element.find(this.options.gallerySelector).find("img").css({padding: this.options.imagePadding})
        }
    }, "{gallerySelector} doubletap": "preventDoubleTap", "{document} gesturestart": "startGesture", "{leftButtonSelector} click": "getPreviousImage", "{leftButtonSelector} doubleTap": "preventDoubleTap", "{rightButtonSelector} click": "getNextImage", "{rightButtonSelector} doubleTap": "preventDoubleTap", "{document} keydown": "handleKeydown", initiateGalleryThumbnail: function () {
        if (!this.options.hideThumbnail || !this.options.hideCarouselIndicator) {
            var g = this.options.hideThumbnail ? this.options.carouselIndicatorTemplate : this.options.thumbnailTemplate;
            new b.GalleryThumbnails(this.element.find(this.options.thumbnailSelector), {images: this.options.images, template: g, selectedIndex: this.options.selectedIndex, maxNumberOfThumbnails: this.options.maxNumberOfThumbnails, thumbnailLinkImageKey: this.options.thumbnailLinkImageKey, thumbnailClass: this.options.thumbnailClass, thumbnailSelectedClass: this.options.thumbnailSelectedClass, accessibilityText: this.options.accessibilityText, isOpen: this.options.isOpen})
        }
    }, startGesture: function (g, h) {
        this.isDragging = false;
        this.disableGalleryButtons();
        this.options.firstImage.wrapper.css("-webkit-transform", "");
        this.options.secondImage.wrapper.css("-webkit-transform", "")
    }, enableGalleryButtons: function () {
        this.clearTimeout(this.buttonTimer);
        this.updateGalleryButtons();
        if (!this.options.alwaysShowGalleryControls) {
            this.buttonTimer = this.setTimeout(function () {
                if (this.leftGalleryButton.add(this.rightGalleryButton).filter(document.activeElement).length === 0) {
                    this.disableGalleryButtons()
                }
            }, this.options.galleryControlTimeout)
        }
    }, disableGalleryButtons: function () {
        if (!this.options.alwaysShowGalleryControls) {
            this.showLeftGalleryButton(false);
            this.showRightGalleryButton(false)
        }
    }, updateGalleryButtons: function () {
        var g = this.currentImageIndex(), i = true, h = true;
        if (!this.options.isCyclic) {
            if (g === 0) {
                i = false
            }
            if (g === this.imageCount - 1) {
                h = false
            }
        }
        c.batch.start();
        this.showLeftGalleryButton(i);
        this.showRightGalleryButton(h);
        this.leftGalleryButton.prop("disabled", !i);
        this.rightGalleryButton.prop("disabled", !h);
        c.batch.stop()
    }, getPreviousImage: function () {
        this.clearTimeout(this.buttonTimer);
        var g = this.getPreviousImageIndex();
        if (g > -1) {
            this.options.selectedIndex(g)
        }
    }, getNextImage: function () {
        this.clearTimeout(this.buttonTimer);
        var g = this.getNextImageIndex();
        if (g > -1) {
            this.options.selectedIndex(g)
        }
    }, handleKeydown: function (g, h) {
        if (this.options.locked()) {
            return
        }
        switch (h.keyCode) {
            case e.AsEvent.Keyboard.ArrowLeft:
                this.getPreviousImage();
                break;
            case e.AsEvent.Keyboard.ArrowRight:
                this.getNextImage();
                break;
            case e.AsEvent.Keyboard.Tab:
                this.enableGalleryButtons();
                break;
            default:
                break
        }
    }, getNextImageIndex: function () {
        var g = this.currentImageIndex() + 1;
        if (g < this.imageCount) {
            return g
        } else {
            if (this.options.isCyclic) {
                return 0
            }
        }
    }, getPreviousImageIndex: function () {
        var g = this.currentImageIndex() - 1;
        if (g > -1) {
            return g
        } else {
            if (this.options.isCyclic) {
                return this.imageCount - 1
            }
        }
    }, resize: function (g, h) {
        this.setGalleryElementHeight();
        this._super(g, h)
    }, reorient: function (g, h) {
        if (this.options.fullBleed) {
            this.setGalleryElementHeight()
        }
    }, heightDelegate: function () {
        var g = e.AsEnv.getViewportHeight(), h = e.AsSupport.ieVersion === 8 ? 1 : Math.max(document.documentElement.clientWidth / d.innerWidth, 1);
        return g * h
    }, setGalleryElementHeight: function () {
        var g = this.options.images[this.options.firstImage.index()][this.mode].dimensions;
        this.galleryElement.css({height: this.options.fullBleed ? this.heightDelegate() : g.height})
    }, updateImageDimensions: function () {
        var h = this.options.images[this.options.firstImage.index()][this.mode].dimensions, g = this.options.images[this.options.secondImage.index()][this.mode].dimensions;
        this.options.firstImage.wrapper.css({width: this.options.fullBleed ? "100%" : h.width, height: this.options.fullBleed ? "100%" : h.height});
        this.options.secondImage.wrapper.css({width: this.options.fullBleed ? "100%" : h.width, height: this.options.fullBleed ? "100%" : h.height});
        this.options.firstImage.wrapper.css({position: "absolute"});
        this.options.secondImage.wrapper.css({position: "absolute"})
    }, populateBackgroundClassList: function () {
        var g = this;
        this.options.images.each(function (i) {
            var h = i[g.getImageModeForUpdate()].srcSet.backgroundStyle;
            if (!g.backgroundClassList.length || e.inArray(h, g.backgroundClassList) === -1) {
                g.backgroundClassList.push(h)
            }
        })
    }, updateBackgroundClass: function () {
        if (this.options.fullBleed) {
            var h = this.options.images[this.currentImageIndex()][this.getImageModeForUpdate()].srcSet.backgroundStyle, g = this.backgroundClassList.join(" ");
            this.element.removeClass(g).addClass(h);
            this.element.closest(".container").siblings(".close").removeClass(g).addClass(h)
        }
    }, preventDoubleTap: function (g, h) {
        h.preventDefault();
        h.stopPropagation()
    }, swapImage: function (g) {
        this.crossfaderShownCallback(this.proxy(function () {
            this.inactiveImage().css("z-index", -1).removeClass("draggable").attr({tabindex: "-1", "aria-hidden": "true"});
            this.activeImage().removeAttr("aria-hidden");
            this.activeImage().attr("tabindex", this.getActiveTabIndex());
            if (this.isDraggable()) {
                this.activeImage().addClass("draggable")
            }
            if (g) {
                g();
                this.updateBackgroundClass()
            }
        }));
        this.imageToUpdate(+!this.imageToUpdate());
        this.imageToShow(+!this.imageToShow())
    }})
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.RetailAvailabilitySearchTrigger = c.Control.extend({defaults: {coldStartSelector: ".cold-start", warmStartSelector: ".warm-start", pickupQuoteSelector: ".retail-availability-search-availability-value", searchTriggerSelector: ".retail-availability-search-trigger", disclaimerSelector: ".disclaimer", searchTriggerElement: null, pickupQuoteElement: null, disclaimerElement: null, eVarProp: "prop37", metricsFeatureName: "storeLocator", storeNumberAvailable: false, model: null, productTitle: c.compute(null), partNumber: c.compute(null), pickupQuote: c.compute(null), control: null}}, {init: function () {
        var h = this.element.attr("data-part"), j = this.element.attr("data-title"), g = this.element.attr("data-eligibility"), i = this.element.attr("data-showstoresearchlink");
        this.options.disclaimerElement = this.element.find(this.options.disclaimerSelector);
        this.options.coldStartElement = this.element.find(this.options.coldStartSelector);
        this.options.warmStartElement = this.element.find(this.options.warmStartSelector);
        this.options.productTitle(j);
        if (this.options.storeNumberAvailable) {
            this.options.pickupQuoteElement = this.options.warmStartElement.find(this.options.pickupQuoteSelector)
        } else {
            this.options.pickupQuoteElement = this.options.coldStartElement.find(this.options.pickupQuoteSelector)
        }
        this.options.model = new c.Map({showView: g === "true" ? true : false, showLink: i === "true" ? true : false, isWarmStart: this.options.storeNumberAvailable, partNumber: h});
        this.options.partNumber = this.options.model.compute("partNumber");
        if (this.options.model) {
            this.toggleDisplay(this.options.model)
        }
        this.element.addClass("ready");
        this.on()
    }, "{searchTriggerSelector} click": "buttonClicked", "{model} change": "toggleDisplay", "{pickupQuote} change": function (j, g, i, h) {
        this.options.pickupQuoteElement.html(i)
    }, toggleDisplay: function (l, h, g, m, k, i) {
        var j = this.options;
        if (!!j.partNumber() && l.attr("showView")) {
            if (l.attr("isWarmStart")) {
                j.warmStartElement.show();
                j.coldStartElement.hide();
                j.searchTriggerElement = j.warmStartElement.find(j.searchTriggerSelector);
                j.pickupQuoteElement = j.warmStartElement.find(this.options.pickupQuoteSelector)
            } else {
                j.warmStartElement.hide();
                j.coldStartElement.show();
                j.searchTriggerElement = j.coldStartElement.find(j.searchTriggerSelector);
                j.pickupQuoteElement = j.coldStartElement.find(this.options.pickupQuoteSelector)
            }
            if (l.attr("showLink")) {
                j.searchTriggerElement.show();
                j.disclaimerElement.show()
            } else {
                j.searchTriggerElement.hide();
                j.disclaimerElement.hide()
            }
        } else {
            j.warmStartElement.hide();
            j.coldStartElement.hide()
        }
    }, buttonClicked: function (h, g) {
        var i;
        g.preventDefault();
        if (this.options.model.attr("isWarmStart")) {
            i = {action: "See more stores", events: "event29, event32"}
        } else {
            i = {action: "Check availability", events: "event29, event31"}
        }
        this.fireMetricsEvent(i);
        if (this.options.control) {
            this.options.control.setProduct(this)
        }
    }, fireMetricsEvent: function (g) {
        g = g || {action: "unknown"};
        g.eVar = this.options.eVarProp;
        g.page = d.s.pageName;
        g.feature = this.options.metricsFeatureName;
        e.AsMetrics.fireMicroEvent(g)
    }})
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.FormField = c.Control.extend({defaults: {namespace: "form", postInit: function () {
        return
    }, bubbleSibling: null, showErrorImmediately: false, showErrorEvents: ["focus"], hideErrorEvents: ["blur"], errorState: c.compute(false)}, getSibling: function () {
        var g = this.options.bubbleSibling;
        if (g === null || g.length === 0) {
            return this.element
        } else {
            if (typeof g === "string") {
                return this.element.parents(g)
            } else {
                return e(g)
            }
        }
    }}, {errorMessage: "", errorBubble: null, init: function () {
        var k, g;
        this.options.postInit.call(this, this.element);
        this.createError();
        var j = ["showError"];
        var h = ["hideError"];
        this.options.showErrorEvents = c.makeArray(this.options.showErrorEvents);
        this.options.hideErrorEvents = c.makeArray(this.options.hideErrorEvents);
        for (k = 0, g = this.options.showErrorEvents.length; k < g; k++) {
            if (this.options.showErrorEvents[k] !== "") {
                j.push(this.options.showErrorEvents[k] + "." + this.options.namespace)
            }
        }
        for (k = 0, g = this.options.hideErrorEvents.length; k < g; k++) {
            if (this.options.hideErrorEvents[k] !== "") {
                h.push(this.options.hideErrorEvents[k] + "." + this.options.namespace)
            }
        }
        this.element.on(h.join(" "), this.proxy("hideError"));
        this.element.on(j.join(" "), this.proxy("showError"));
        this.getErrorFromServer()
    }, " updateErrorState": "updateErrorState", updateErrorState: function (h, i, g) {
        var j = c.isArray(g) && g.length > 0;
        this.errorMessage = j ? g[0] : null;
        this.options.errorState(j)
    }, "{errorState} change": function (g, i, h) {
        if (h) {
            this.enterErrorState();
            if (this.options.showErrorImmediately) {
                this.showError()
            }
        } else {
            this.exitErrorState()
        }
    }, enterErrorState: function () {
        this.element.addClass("error");
        this.element.trigger("inputfielderror.placeholder")
    }, exitErrorState: function () {
        this.element.removeClass("error");
        this.hideError()
    }, createError: function () {
        var h = this.proxy(this.constructor.getSibling)();
        var i = e("<div/>").insertBefore(h);
        var g = {target: this.element, width: c.compute("auto"), height: c.compute("auto"), parentElement: i.parent()};
        if (e("html").hasClass("handheld") && b.BubbleHandheld) {
            this.errorBubble = new b.BubbleHandheld(i, g)
        } else {
            this.errorBubble = new b.Bubble(i, g)
        }
    }, showError: function () {
        var g = this.errorBubble.content.options.content() ? this.errorBubble.content.options.content().val : null;
        if (this.options.errorState() && !this.errorBubble.options.isOpen()) {
            if (g !== this.errorMessage) {
                this.errorBubble.options.contentArgs = {type: "text", val: this.errorMessage}
            }
            this.errorBubble.open();
            this.bubbleTimeStamp = new Date().getTime()
        }
    }, hideError: function () {
        this.errorBubble.close()
    }, getErrorFromServer: function () {
        var g = e("#" + this.element.attr("id") + "Error"), h;
        if (g.length > 0) {
            h = g.find("li:eq(0)").text();
            this.updateErrorState(this.element, {}, [h]);
            this.showError()
        }
    }, reset: function () {
        this.element.val("");
        this.errorState = false;
        this.exitErrorState()
    }, destroy: function () {
        this.element.off("." + this.options.namespace);
        this._super()
    }})
})(this, jQuery, can, as);
(function (d, e, c, b, f) {
    b.TextField = b.FormField.extend({defaults: {namespace: "text"}}, {})
})(this, jQuery, can, as);
(function (d, e, c, b, f) {
    b.ValidationManager = b.Manager.extend({defaults: {showFirstError: true, validateEvent: "submit", prefix: "validation", createdEvent: "created.validation", destroyedEvent: "destroyed.validation"}}, {preventPropagation: true, init: function () {
        this._super();
        this.valid = c.compute(function () {
            var g = true;
            c.each(this.elementList, function (h) {
                g = h.valid() && g
            });
            return g
        }, this)
    }, " {validateEvent}": "handleValidate", handleValidate: function (g, h) {
        if (this.preventPropagation) {
            h.preventDefault();
            h.stopPropagation();
            this.validate(g)
        } else {
            this.preventPropagation = true
        }
    }, validate: function (h) {
        var g = this;
        var i = this.getDeferreds();
        if (i.length === 0) {
            return
        }
        c.when.apply(c, this.getDeferreds()).then(function () {
            g.preventPropagation = !g.valid();
            if (!g.preventPropagation) {
                e(h).trigger(g.options.validateEvent)
            } else {
                if (g.options.showFirstError) {
                    g.element.find(".error:eq(0)").trigger("showError")
                }
            }
        })
    }, clear: function () {
        c.each(this.elementList, function (g) {
            c.each(g.controls, function (h) {
                h.clear()
            })
        })
    }, destroyElement: function (g) {
        var h = this.elementList.attr(g);
        h.errorMessage.unbind("change");
        this._super(g)
    }, newElement: function (h) {
        var g = this._super(h);
        g.valid = c.compute(function () {
            var i = true;
            c.each(this.controls, function (j) {
                if (typeof j !== "undefined" && c.isFunction(j.valid)) {
                    i = i && j.valid()
                }
            });
            return i
        }, g);
        g.errorMessage = c.compute(function () {
            var i = [];
            c.each(this.controls, function (j) {
                if (typeof j !== "undefined" && j.options.error() !== null) {
                    i.push(j.options.error())
                }
            });
            return i.length > 0 ? i : null
        }, g);
        g.errorMessage.bind("change", function (j, i) {
            g.element.trigger("updateErrorState", [i])
        });
        return g
    }, getDeferreds: function () {
        var g = [];
        c.each(this.elementList, function (h) {
            c.each(h.controls, function (i) {
                i.validate();
                g.push(i.validationDone)
            })
        });
        return g
    }})
})(this, jQuery, can, as);
(function (d, e, c, b, f) {
    b.Validation = c.Control.extend({defaults: {message: "This is not a valid entry. Please check that the information is correct.", validateOn: ["blur", "change"], clearOn: [], disabled: c.compute(false), error: c.compute(null), getValue: function () {
        return this.element.val()
    }, isInvalid: function (h, g) {
        g.resolve(true)
    }}, generateNamespace: function () {
        return"" + Math.random() * new Date().getTime()
    }, }, {validationDone: new c.Deferred(), namespace: null, setup: function (h, g) {
        g = g || {};
        g.disabled = g.disabled || c.compute(false);
        this._super(h, g);
        this.namespace = this.constructor.generateNamespace()
    }, init: function () {
        this.options.error = c.compute(null);
        this.element.trigger("created.validation", this);
        this.options.validateOn = c.makeArray(this.options.validateOn);
        this.options.clearOn = c.makeArray(this.options.clearOn);
        var g = this.namespace;
        this.options.validateOn = c.map(this.options.validateOn, function (h) {
            return h += "." + g
        });
        this.options.clearOn = c.map(this.options.clearOn, function (h) {
            return h += "." + g
        });
        this.element.on(this.options.validateOn.join(" "), this.proxy("validate"));
        this.element.on(this.options.clearOn.join(" "), this.proxy("clear"));
        this.on()
    }, "{disabled} change": "toggleDisabled", toggleDisabled: function (h, i, g) {
        if (g) {
            this.clear()
        }
    }, setError: function (h) {
        if (!this.options.disabled()) {
            var g = this, i = function (j) {
                if (j) {
                    this.options.error(this.getMessage())
                } else {
                    this.options.error(null)
                }
                this.element.trigger("validated", [j])
            };
            if (c.isDeferred(h)) {
                h.then(function (j) {
                    i.call(g, j)
                })
            } else {
                i.call(g, h)
            }
        }
    }, getMessage: function () {
        if (c.isFunction(this.options.message)) {
            return this.options.message()
        }
        return this.options.message
    }, setMessage: function (g) {
        if (c.isFunction(this.options.message)) {
            this.options.message(g)
        }
        this.options.message = g
    }, getValue: function () {
        return this.options.getValue.call(this)
    }, valid: function () {
        return !this.hasErrors()
    }, validate: function () {
        this.validationDone = new c.Deferred();
        var g = this.getValue();
        this.options.isInvalid.call(this, g, this.validationDone);
        this.setError(this.validationDone)
    }, clear: function () {
        this.options.error(null)
    }, hasErrors: function () {
        return this.options.error() !== null
    }, destroy: function () {
        this.element.trigger("destroyed.error", this);
        this._super()
    }})
})(this, jQuery, can, as);
(function (d, e, c, b, f) {
    b.RequiredValidation = b.Validation.extend({defaults: {message: "Please complete this mandatory field.", isInvalid: function (h, g) {
        g.resolve(!(h += "") || h === "")
    }}}, {})
})(this, jQuery, can, as);
(function (d, e, c, b, f) {
    b.FormatValidation = b.Validation.extend({defaults: {message: "This does not match the required format. Please check that the information is correct.", isInvalid: function (h, g) {
        g.resolve(!this.options.format.test(h))
    }, format: /.*/}}, {})
})(this, jQuery, can, as);
(function (d, e, c, b, f) {
    b.RetailStoreLocator = c.Control.extend({defaults: {storeId: c.compute(null), storeList: new c.List([]), location: c.compute(null), searchError: c.compute(false), textStrings: null, urls: null}}, {init: function () {
        var g = this.options.textStrings;
        this.isSearching = c.compute(false);
        this.ajaxUrl = this.options.urls.locate;
        this.options.overlay = new b.RetailStoreLocatorOverlay("body", {isWaiting: this.isSearching, storeList: this.options.storeList, storeId: this.options.storeId, location: this.options.location, searchError: this.options.searchError, title: g.title, searchPlaceholder: g.searchPlaceholder, searchNoResults: g.searchNoResults, previousButton: g.previous, nextButton: g.next, parentElement: this.element})
    }, "{location} change": "getStoreData", getStoreData: function (h, g, m, k) {
        if (m === "") {
            return
        }
        var l, n = {location: m}, j = this, i = this.ajaxUrl.split("?").length > 1 ? "&" : "?";
        if (this.isSearching()) {
            this.promise.reject()
        }
        l = this.ajaxUrl + i + e.param(n);
        this.isSearching(true);
        this.promise = c.ajax({url: l, dataType: "json jsonrpc", timeout: 5000}).done(function (o) {
            if (o.stores && o.stores.length > 0) {
                j.options.searchError(false);
                j.options.storeList.replace(o.stores)
            } else {
                j.options.storeList.replace([]);
                j.options.searchError(true)
            }
            j.options.overlay.options.searchComplete(true)
        }).fail(function (o) {
            j.options.storeList.replace([]);
            j.options.searchError(true)
        }).always(function () {
            j.isSearching(false)
        })
    }})
})(this, jQuery, can, as);
(function (e, f, d, b, h) {
    var g = {defaults: {storeList: new d.List(), storeListSelector: ".stores", searchErrorSelector: ".error-message", resetSelector: ".store-locator-form-reset", inputElem: null, searchErrorElem: null, resetElem: null, resetVal: null, width: d.compute("auto"), height: d.compute("auto"), searchError: d.compute(false), searchComplete: d.compute(null), isAriaDialog: d.compute(true)}, storesPerPage: 5, maxStoreListLength: 20};
    var c = {setup: function (l, k) {
        var i = this;
        var j = new d.Map({currentPage: NaN, maxPageNumber: NaN});
        var n = "maxPageNumber";
        var m = "currentPage";
        k.storeListPage = new d.List([]);
        k.maxPageNumber = d.compute(function (o) {
            if (arguments.length > 0) {
                j.attr(n, Math.floor(Math.min(o, i.constructor.maxStoreListLength) / i.constructor.storesPerPage))
            }
            return j.attr(n)
        });
        k.currentPage = d.compute(function (o) {
            if (arguments.length > 0) {
                j.attr(m, Math.min(Math.max(o, 0), k.maxPageNumber()))
            }
            return j.attr(m)
        });
        k.hasPreviousPage = d.compute(function () {
            return k.currentPage() > 0
        });
        k.hasNextPage = d.compute(function () {
            return k.currentPage() < k.maxPageNumber() - 1
        });
        k.contentArgs = {type: "template", val: "{{RetailStoreLocatorOverlay}}"};
        k.selectedStore = d.compute(null);
        return this._super(l, k)
    }, init: function (j, i) {
        this._super(j, i)
    }, setContent: function (k, j) {
        if (this.placeholder || this.hasOpened) {
            return
        }
        this._super(k, j);
        var l = f.AsSupport.onInput ? ["input"] : ["text", "keypress", "keydown", "paste", "cut"], i = this;
        this.placeholder = new b.Placeholder(this.element);
        this.options.inputElem = this.element.find(".query");
        this.options.searchErrorElem = this.element.find(this.options.searchErrorSelector);
        this.options.resetElem = this.element.find(this.options.resetSelector);
        this.options.resetVal = d.compute(null);
        this.searchReset = new b.InputReset(this.options.resetElem, {val: this.options.resetVal});
        d.each(l, function (n, m) {
            i.options.inputElem.on(n, function (o) {
                i.options.resetVal(f(o.currentTarget).val())
            })
        });
        this.on();
        this.hasOpened = true
    }, "#store_locator_search submit": "handleSearch", ".stores li click": "handleStoreSelectedWithinList", ".pagination-link.next click": "handleShowNextPage", ".pagination-link.previous click": "handleShowPrevPage", "{storeList} change": "handleStoreListChange", "{currentPage} change": "handleCurrentPageChange", "{selectedStore} change": "handleSelectedStoreChange", "{resetVal} change": function (l, i, k, j) {
        this.options.inputElem.val(k)
    }, "{resetElem} click": function (j, i) {
        this.options.inputElem.prevAll("label").removeClass("hidden")
    }, "{searchComplete} change": function (m, i, k, j) {
        var l = this.overlay.find(this.options.storeListSelector).children().first();
        if (k) {
            this.options.selectedStore(l.data("store"));
            m(false);
            this.options.searchErrorElem.hide()
        }
    }, "{searchError} change": function (m, j, l, k) {
        var i = this.element.find(".stores"), o = this.element.find(".locator-pagination"), n = this.element.find(".details");
        if (l) {
            this.options.searchErrorElem.show();
            i.hide();
            o.hide();
            n.hide()
        } else {
            this.options.searchErrorElem.hide();
            i.css("display", "");
            o.css("display", "");
            n.css("display", "")
        }
    }, handleStoreListChange: function (m, j, i, n, l, k) {
        if (l && n === "add" && i === "0") {
            this.options.maxPageNumber(l.length);
            this.forceCurrentPageReset()
        }
        if (n === "remove") {
            this.options.maxPageNumber(0);
            this.forceCurrentPageReset()
        }
    }, forceCurrentPageReset: function () {
        var i = this.options.currentPage;
        i(Infinity);
        i(0)
    }, handleSelectedStoreChange: function (l, i, k, j) {
        if (k) {
            k.attr("selected", true)
        }
        if (j) {
            j.attr("selected", false)
        }
    }, handleSearch: function (j, i) {
        i.preventDefault();
        this.options.location(this.options.resetVal())
    }, handleShowNextPage: function (k, i) {
        i.preventDefault();
        var j = this.options.currentPage();
        this.options.currentPage(j + 1)
    }, handleShowPrevPage: function (k, i) {
        i.preventDefault();
        var j = this.options.currentPage();
        this.options.currentPage(j - 1)
    }, handleCurrentPageChange: function (l, i, k, j) {
        if (d.isNumeric(k)) {
            var m = this.constructor.storesPerPage;
            var o = k * m;
            var n = o + m;
            this.options.storeListPage.replace(this.options.storeList.slice(o, n))
        }
    }, handleStoreSelectedWithinList: function (j, i) {
        this.options.selectedStore(f(i.currentTarget).data("store"))
    }, onOpen: function (j) {
        if (!j) {
            return
        }
        var i = this;
        this.options.searchError(false)
    }};
    if (!f.AsSupport.isMobileOptimized) {
        b.RetailStoreLocatorOverlay = b.WebOverlay.extend(g, c)
    } else {
        b.RetailStoreLocatorOverlay = b.WebOverlayFullscreenHandheld.extend(g, c)
    }
})(this, jQuery, can, as);
(function (d, e, c, b, f) {
    b.RetailAvailabilityObserve = c.compute({partNumber: null, productTitle: null})
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.RetailAvailabilitySearchOverlay = b.RetailStoreLocatorOverlay.extend({defaults: {partNumber: c.compute(null), productTitle: c.compute(null), storeListSelector: "#retail-availability-search-store-list", searchQueryTextFieldSelector: "#retail-availability-search-query", placeholderTextSelector: "#retail-availability-search-info-placeholder", placeholderTextElem: null, className: "retail-availability-search-overlay", width: c.compute(698), height: c.compute("auto"), validation: null, tracking: null, warmStart: false, warmStartSearch: null, warmStartZip: c.compute(null), placeholderError: c.compute(false), availabilityUnknownError: "Unknown", isIE8: (e.AsSupport.ieVersion === 8)}, UiState: {Available: "available", Ships: "ships-to-store", Unknown: "unknown"}}, {init: function (h, g) {
        this._super(h, g);
        this.location = c.compute(null);
        this.options.contentArgs = {type: "template", val: "{{RetailAvailabilitySearchOverlay}}"}
    }, setContent: function (k, j) {
        if (this.queryField) {
            return
        }
        var g = this.location, i = this.options.validation && this.options.validation.zip, h = this, l = e.AsSupport.onInput ? ["input"] : ["text", "keypress", "keydown", "paste", "cut"];
        this._super(k, j);
        this.placeholder = new b.Placeholder(this.element);
        this.validationManager = new b.ValidationManager("#retail-availability-search-search-form");
        this.queryField = new b.TextField(this.element.find("#retail-availability-search-query"), {showErrorEvents: ["blur"], hideErrorEvents: [""], postInit: function (n) {
            var o = new b.PropertyBinding(n, {twoWay: true, property: "value", value: g, setValue: function (p) {
                if (p !== "null") {
                    this.element.val(p)
                }
            }});
            var m = this;
            if (i) {
                this.format = new b.FormatValidation(n, {format: i.pattern, message: i.invalidFormatError, validateOn: "change", clearOn: l, isInvalid: function (q, p) {
                    p.resolve(!this.options.format.test(q) && q !== "")
                }});
                this.require = new b.RequiredValidation(n, {message: i.requiredError, validateOn: "change", clearOn: l})
            }
        }, bubbleSibling: this.element.find(".container")})
    }, " #retail-availability-search-search-form submit": "handleSearch", " #retail-availability-search-store-list li click": "handleStoreSelectedWithinList", " #retail-availability-search-next-button click": "handleShowNextPage", " #retail-availability-search-previous-button click": "handleShowPrevPage", " #retail-availability-search-select-store-button click": "handleSelectStore", " #retail-availability-search-cancel-button click": "handleClose", " #retail-availability-search-directions-button click": "handleGetDirection", " #retail-availability-search-reservation-button click": "handleGetMoreInformation", " {storeList} change": "handleStoreListChange", " {partNumber} change": "handlePartNumberChange", " {selectedStore} change": "handleSelectedStoreChange", " {currentPage} change": "handleCurrentPageChange", "{searchComplete} change": function (k, g, i, h) {
        var j = this.overlay.find(this.options.storeListSelector).children().first();
        if (i) {
            this.options.selectedStore(j.data("store"));
            k(false);
            this.options.placeholderTextElem.hide()
        }
    }, "{placeholderError} change": function (h, g, j, i) {
        if (j) {
            this.options.placeholderTextElem.hide()
        }
    }, "{searchQueryTextFieldSelector} validated": function (i, g, h) {
        if (h) {
            this.focusForOpen()
        }
    }, handleIsOpenChange: function (j, g, i, h) {
        this._super.apply(this, arguments);
        if (!i) {
            this.clearOverlayData();
            this.clearInputField();
            this.options.placeholderError(null)
        }
    }, handleStoreListChange: function (k, h, g, l, j, i) {
        this._super.apply(this, arguments);
        if (j && l === "add" && g === "0") {
            this.augmentStoreList(j, this.options.partNumber())
        }
    }, handlePartNumberChange: function (j, g, i, h) {
        if (i) {
            this.augmentStoreList(this.options.storeList, i);
            this.forceCurrentPageReset()
        }
    }, augmentStoreList: function (l, k) {
        var h = this;
        var g = "partsAvailability.";
        g += this.options.partNumber();
        var j = g + ".pickupDisplay";
        var i = g + ".pickupSearchQuote";
        c.each(l, function (n, m, o) {
            n.attr("selected", h.options.selectedStore() === n);
            if (n.attr(i)) {
                n.attr("className", n.attr(j) === "available" ? h.constructor.UiState.Available : h.constructor.UiState.Ships);
                n.attr("pickupQuote", n.attr(i))
            } else {
                n.attr("className", h.constructor.UiState.Unknown);
                n.attr("pickupQuote", h.options.availabilityUnknownError)
            }
        })
    }, handleSearch: function (h, g) {
        g.preventDefault();
        if (e.AsSupport.ieVersion >= 9) {
            this.options.location(this.options.resetVal())
        } else {
            this.options.location(this.location())
        }
    }, handleSelectStore: function (h, g) {
        g.preventDefault();
        this.options.storeId(this.options.selectedStore().attr("storeNumber"));
        this.fireEvent({action: "Retail store selected", events: "event37"});
        this.close()
    }, handleShowNextPage: function (g, h) {
        this._super(g, h);
        this.fireEvent({action: "next", slot: "pageIndex" + this.options.currentPage()})
    }, handleShowPrevPage: function (g, h) {
        this._super(g, h);
        this.fireEvent({action: "prev", slot: "pageIndex" + this.options.currentPage()})
    }, handleGetDirection: function () {
        this.fireEvent({action: "Driving Directions"})
    }, handleGetMoreInformation: function () {
        this.fireEvent({action: "Store Workshops"})
    }, clearOverlayData: function () {
        this.options.storeList.replace([]);
        this.options.storeListPage.replace([]);
        this.options.selectedStore(null)
    }, clearInputField: function (g) {
        this.queryField.element.blur();
        this.location("");
        this.options.location(null);
        this.queryField.format.clear();
        this.queryField.require.clear()
    }, onOpen: function (h) {
        if (!h) {
            return
        }
        var i = this.options.warmStartZip();
        var g = this.queryField.element;
        this.options.placeholderTextElem = this.overlay.find(this.options.placeholderTextSelector);
        this.options.placeholderTextElem.show();
        g.trigger("focus");
        if (this.options.warmStart) {
            g.trigger("input");
            if (i !== "") {
                g.prev().addClass(b.UiState.Hidden);
                g.val(i)
            }
            this.options.warmStartSearch(true);
            this.options.warmStartSearch(false)
        }
    }, focusForOpen: function () {
        if (this.options.autoFocus()) {
            this.overlay.find(this.queryField.element).focus()
        }
    }, fireEvent: function (g) {
        var h = g || {action: "unknown"};
        var i = this.options.tracking || {};
        e.AsMetrics.fireMicroEvent(c.extend({}, i, h))
    }})
})(this, jQuery, can, as);
(function (e, f, d, b, g) {
    var c = "json jsonrpc";
    b.RetailAvailabilitySearch = d.Control.extend({defaults: {timeout: 5000, cookie: null, url: null, searchUrl: null, eligibilityUrl: null, queryParams: null, warmStartSearch: d.compute(false), storeId: d.compute(null), storeList: new d.List([]), product: d.compute(null), partNumber: d.compute(null), productTitle: d.compute(null), location: d.compute(null), overlayIsOpen: d.compute(false), errorMessage: d.compute(null), availabilityUnknownError: null, overlayTriggerEvent: "click.retailavailability", triggerSelector: ".retail-availability-search-info", variationObserve: null, failPickupQuote: "Not eligible", placeholderError: d.compute(false)}, OperationMode: {SingleProductMode: 1, MultipleProductMode: 2}, serializeQueryString: function (k, j) {
        var o = f.AsString.parseUrl(k);
        var n = f.AsString.parseQueryString(o.search);
        var p = typeof j.partNumber === "string" ? [j.partNumber] : j.partNumber;
        for (var m = 0, h = p.length; m < h; m++) {
            n["parts." + m] = p[m]
        }
        if (j.location) {
            n.zip = j.location
        }
        if (j.storeId) {
            n.store = j.storeId
        }
        if (j.queryParams) {
            d.extend(n, f.AsString.parseQueryString(j.queryParams))
        }
        o.search = "?" + d.param(n);
        return f.AsString.makeUrl(o)
    }}, {tracking: null, storeIdFromCookie: null, partNumbers: null, triggers: null, ajaxDef: null, isSearching: null, init: function () {
        var h = this;
        this.tracking = {eVar: "prop37", page: e.s.page, feature: "storeLocator"};
        var j = this.element.find(this.options.triggerSelector);
        this.triggers = {};
        this.partNumbers = [];
        if (this.options.cookie && this.options.cookie.name && f.cookie(this.options.cookie.name)) {
            this.options.storeId(this.storeIdFromCookie = f.cookie(this.options.cookie.name));
            this.warmStart = true
        } else {
            this.warmStart = false
        }
        this.isSearching = d.compute(false);
        var i = {isWaiting: this.isSearching, storeList: this.options.storeList, isOpen: this.options.overlayIsOpen, partNumber: this.options.partNumber, productTitle: this.options.productTitle, storeId: this.options.storeId, location: this.options.location, tracking: this.tracking, validation: this.options.validation, warmStart: this.warmStart, warmStartSearch: this.options.warmStartSearch, searchHeader: this.options.searchHeader, searchSubHeader: this.options.searchSubHeader, searchPlaceholder: this.options.searchPlaceholder, searchButton: this.options.searchButton, availabilityFor: this.options.availabilityFor, personalPickup: this.options.personalPickup, previousButton: this.options.previousButton, nextButton: this.options.nextButton, cancelButton: this.options.cancelButton, selectButton: this.options.selectButton, placeholderError: this.options.placeholderError, availabilityUnknownError: this.options.availabilityUnknownError, parentElement: this.element};
        this.options.overlay = (f.AsSupport.isMobileOptimized) ? new b.RetailAvailabilitySearchOverlayHandheld("body", i) : new b.RetailAvailabilitySearchOverlay("body", i);
        j.each(function (m, l) {
            var k = new b.RetailAvailabilitySearchTrigger(l, {storeNumberAvailable: h.warmStart, control: h});
            var n = k.options.partNumber();
            if (!h.triggers[n]) {
                h.triggers[n] = k;
                h.partNumbers.push(n)
            }
        });
        if (this.partNumbers.length >= 2) {
            this.mode = this.constructor.OperationMode.MultipleProductMode
        } else {
            this.mode = this.constructor.OperationMode.SingleProductMode
        }
        this.options.variationObserve = b.RetailAvailabilityObserve;
        this.on()
    }, " {overlayTriggerEvent}": "openOverlay", " {storeId} change": "handleStoreChange", " {location} change": function (k, h, j, i) {
        if (j) {
            this.sendRequest("storeSearch")
        }
    }, " {warmStartSearch} change": function (k, h, j, i) {
        if (j) {
            this.sendRequest("warmStart")
        }
    }, " {variationObserve} change": "handleProductChange", setProduct: function (h) {
        this.options.partNumber(h.options.partNumber());
        this.options.productTitle(h.options.productTitle());
        this.options.overlayIsOpen(true)
    }, handleStoreChange: function (i, h, m, l) {
        var k = this.options.cookie;
        var j = this;
        if (k && this.storeIdFromCookie !== m) {
            f.cookie(k.name, m, {expires: k.expiry > 0 ? k.expiry : "", domain: k.domain, path: "/"});
            this.warmStart = true;
            this.options.overlay.options.warmStart = true
        }
        this.setTimeout(function () {
            if (!this.partNumbers[0]) {
                return
            }
            this.sendRequest("availability")
        }, 0)
    }, sendRequest: function (k) {
        var i, n, j, m, h = this;
        var l = function () {
            h.isSearching(false);
            h.cleanupAjaxDef()
        };
        switch (k) {
            case"storeSearch":
                j = true;
                i = this.buildQueryParams(this.options.searchUrl, j, {location: this.options.location()});
                n = this.findStoresDoneCallback;
                break;
            case"warmStart":
                j = true;
                i = this.buildQueryParams(this.options.searchUrl, j, {storeId: this.options.storeId()});
                n = this.findStoresDoneCallback;
                break;
            case"availability":
                j = false;
                i = this.buildQueryParams(this.options.url, j, {storeId: this.options.storeId()});
                n = this.findAvailabilityDoneCallback;
                break;
            case"eligibility":
                j = false;
                i = this.buildQueryParams(this.options.eligibilityUrl, j);
                n = this.checkEligibilityDoneCallback;
                break;
            default:
                return
        }
        n = this.proxy(n);
        m = this.proxy(this.ajaxDefFail);
        l = this.proxy(l);
        this.prepareAjax();
        if (j) {
            this.isSearching(true)
        }
        this.ajaxDef = f.ajax({url: i, dataType: c, timeout: this.options.timeout}).done(n).fail(m).always(l)
    }, buildQueryParams: function (h, i, l) {
        var j;
        var k = {queryParms: this.options.queryParams};
        if (i) {
            j = this.options.partNumber()
        } else {
            j = this.partNumbers
        }
        k.partNumber = j;
        if (l) {
            d.extend(k, l)
        }
        h = this.constructor.serializeQueryString(h, k);
        return h
    }, prepareAjax: function () {
        if (this.ajaxDef) {
            this.ajaxDef.abort()
        }
    }, cleanupAjaxDef: function () {
        delete this.ajaxDef
    }, ajaxDefFail: function (h) {
    }, findStoresDoneCallback: function (h) {
        if (!h.success && h.errorMessage) {
            this.options.overlay.clearOverlayData();
            this.options.placeholderError(h.errorMessage);
            return
        }
        this.options.placeholderError(null);
        this.options.storeList.replace(h.stores);
        this.options.overlay.options.searchComplete(true);
        this.options.errorMessage(h.errorMessage);
        this.options.overlayIsOpen(true)
    }, findAvailabilityDoneCallback: function (j) {
        var i = this;
        var h = j.stores ? j.stores[0] : null;
        var k = this.options.productTitle();
        d.each(this.partNumbers, function (n, l) {
            var p, o, m;
            if (h) {
                p = h.partsAvailability;
                m = p[n];
                if (m) {
                    o = m.pickupQuote;
                    i.triggers[n].options.model.attr("showView", m.pickupDisplay !== "ineligible");
                    i.triggers[n].options.model.attr("showLink", m.storeSearchEnabled !== false)
                }
                i.options.overlay.options.warmStartZip(h.address.postalCode);
                if (i.mode === i.constructor.OperationMode.SingleProductMode && k) {
                    i.triggers[n].options.partNumber(n);
                    i.triggers[n].options.productTitle(k)
                }
            }
            if (o) {
                i.triggers[n].options.model.attr("isWarmStart", true);
                i.triggers[n].options.pickupQuote(o)
            } else {
                if (!j.success || !o) {
                    i.triggers[n].options.pickupQuote(i.options.failPickupQuote)
                }
            }
        })
    }, checkEligibilityDoneCallback: function (i) {
        var k = this.options.partNumber(), l = this.options.productTitle(), j = i.pickupEligibility[k]["eligible"], h = this;
        d.each(this.partNumbers, function (n, m) {
            h.triggers[n].options.model.attr("showView", true);
            h.triggers[n].options.partNumber(n);
            h.triggers[n].options.productTitle(l)
        })
    }, handleProductChange: function (m, h, j, i) {
        var l = j || {partNumber: null, productTitle: ""};
        var k = l.partNumber, o = l.productTitle, n = i.partNumber;
        if (k && k !== n) {
            this.options.partNumber(k);
            this.options.productTitle(o);
            if (k !== this.partNumbers[0]) {
                this.triggers[k] = this.triggers[this.partNumbers[0]];
                delete this.triggers[this.partNumbers[0]];
                this.partNumbers = [k]
            }
            if (this.warmStart) {
                this.sendRequest("availability")
            } else {
                this.sendRequest("eligibility")
            }
        }
    }})
})(this, jQuery, can, as);
(function (d, e, c, b, f) {
    b.ActionMenu = b.Dialog.extend({defaults: {actionMenuSelector: ".action-menu,.dynamic-menu a", templateId: null, dataUrl: null, isOpen: c.compute(false)}}, {init: function () {
        this._super();
        this.options.contentLoadedDeferred = c.Deferred();
        if (this.isDynamic()) {
            if (!this.options.templateId || !this.options.dataUrl) {
                throw new Error("Expectation failed: there must be both a templateId and a dataUrl for dynamic content")
            }
        }
        this.actionMenu = this.element.find(".action-menu,.dynamic-menu").first();
        if (this.actionMenu.length !== 1) {
            return
        }
        this.actionMenu.attr({role: "menu", "aria-hidden": "true"});
        this.addAriaProperties();
        this.actionMenu.removeClass("dynamic-menu").addClass("action-menu");
        this.options.isOpen(false);
        this.materializer = new b.Materializer(this.actionMenu, {materialize: this.options.isOpen})
    }, isDynamic: function () {
        return this.options.templateId || this.options.dataUrl
    }, _open: function () {
        this.options.isOpen(true);
        this.loadContent();
        this.actionMenu.attr("aria-hidden", "false")
    }, _close: function () {
        this.options.isOpen(false);
        this.actionMenu.attr("aria-hidden", "true");
        if (this.contentLoading) {
            this.contentLoading.abort()
        }
    }, loadContent: function () {
        var g = this;
        if (g.isDynamic() && !g.loadedContent) {
            g.actionMenu.addClass("loading");
            var h = g.createSpinner();
            g.contentLoading = e.ajax({url: this.options.dataUrl});
            g.contentLoading.always(function () {
                delete g.contentLoading;
                g.actionMenu.removeClass("loading")
            });
            g.contentLoading.done(function (i) {
                g.loadedContent = c.view(g.options.templateId, i);
                g.actionMenu.html(g.loadedContent);
                g.options.contentLoadedDeferred.resolve();
                g.addAriaProperties()
            });
            g.contentLoading.fail(function () {
                h.element.remove();
                g.options.contentLoadedDeferred.reject()
            })
        }
    }, loadedContent: null, contentLoading: null, createSpinner: function () {
        var g = this.actionMenu.html("<div></div>").find("div");
        this.spinnerOn = c.compute(true);
        return new b.Spinner(g, {isOn: this.spinnerOn})
    }, addAriaProperties: function () {
        this.element.find(".action-menu,.dynamic-menu a").attr("role", "menuitem");
        this.element.find(".action-menu,.dynamic-menu li").attr("role", "presentation")
    }})
})(this, jQuery, can, as);
(function (d, e, c, b, f) {
    b.CompoundLink = c.Control.extend({defaults: {handleSelector: ".handle a", actionMenuLinkSelector: ".action-menu a, .action-menu button", handleElement: null, actionMenuElement: null, menuIsOpen: c.compute(false)}}, {init: function () {
        this.actionMenu = new b.ActionMenu(this.element);
        this.options.actionMenuElement = this.actionMenu.actionMenu;
        this.options.handleElement = this.element.find(this.options.handleSelector);
        this.options.handleElement.attr({"aria-haspopup": "true", "aria-owns": this.actionMenu.actionMenu.prop("id")});
        this.actionMenuLinks = this.element.find(this.options.actionMenuLinkSelector);
        this.areLinksFiltered = false;
        this.on()
    }, "{handleSelector} click": "toggleMenu", "{actionMenuLinkSelector} click": "closeMenu", " mouseenter": "viewOver", " mouseleave": "viewOut", "{menuIsOpen} change": "handleMenuStateChange", "{handleSelector} keydown": "handleKeydown", "{actionMenuLinkSelector} keydown": "handleActionMenuKeydown", "{document.body} click": "closeOnClick", "{document.body} touchstart": "closeOnClick", handleMenuStateChange: function (j, g, i, h) {
        if (i) {
            this.actionMenu.open()
        } else {
            this.actionMenu.close()
        }
    }, handleKeydown: function (i, g) {
        var h = this;
        if (g.keyCode === e.AsEvent.Keyboard.Return || g.keyCode === e.AsEvent.Keyboard.Space) {
            g.preventDefault();
            this.openMenu();
            this.setTimeout(function () {
                if (!h.areLinksFiltered) {
                    h.filterVisibleLinks()
                }
                h.actionMenuLinks.get(0).focus()
            }, 150)
        }
    }, handleActionMenuKeydown: function (k, h) {
        var i = this, l = h.target;
        var j = function () {
            i.closeMenu();
            this.setTimeout(function () {
                i.options.handleElement.get(0).focus()
            }, 150)
        };
        var g = function () {
            var n = i.actionMenuLinks.length, o = i.actionMenuLinks.index(e(l)), m;
            h.preventDefault();
            if (h.keyCode === e.AsEvent.Keyboard.ArrowDown || h.keyCode === e.AsEvent.Keyboard.ArrowRight) {
                m = o + 1;
                if (m === n) {
                    m = 0
                }
            } else {
                if (h.keyCode === e.AsEvent.Keyboard.ArrowUp || h.keyCode === e.AsEvent.Keyboard.ArrowLeft) {
                    m = o - 1;
                    if (m < 0) {
                        m = n - 1
                    }
                }
            }
            i.actionMenuLinks.get(m).focus()
        };
        switch (h.keyCode) {
            case e.AsEvent.Keyboard.Tab:
                if (l === this.actionMenuLinks.get(0) && h.shiftKey) {
                    this.closeMenu()
                }
                if (l === this.actionMenuLinks.last().get(0) && !h.shiftKey) {
                    this.closeMenu()
                }
                break;
            case e.AsEvent.Keyboard.Esc:
                j();
                break;
            case e.AsEvent.Keyboard.Return:
                j();
                break;
            case e.AsEvent.Keyboard.Space:
                l.click();
                j();
                break;
            case e.AsEvent.Keyboard.ArrowDown:
                g();
                break;
            case e.AsEvent.Keyboard.ArrowRight:
                g();
                break;
            case e.AsEvent.Keyboard.ArrowUp:
                g();
                break;
            case e.AsEvent.Keyboard.ArrowLeft:
                g();
                break;
            default:
                break
        }
    }, filterVisibleLinks: function () {
        this.actionMenuLinks = this.actionMenuLinks.filter(":visible");
        this.areLinksFiltered = true
    }, openMenu: function () {
        this.options.menuIsOpen(true);
        this.element.css("z-index", "2000")
    }, closeMenu: function () {
        this.options.menuIsOpen(false);
        this.element.css("z-index", "auto")
    }, toggleMenu: function (h, g) {
        g.preventDefault();
        if (this.options.menuIsOpen()) {
            this.closeMenu()
        } else {
            this.openMenu()
        }
    }, viewOver: function (h, g) {
        this.clearTimeout(this.timer)
    }, viewOut: function (i, g) {
        var h = this;
        this.timer = this.setTimeout(function () {
            h.closeMenu()
        }, 250)
    }, closeOnClick: function (h, g) {
        var i = this.element.get(0);
        if (!e.contains(i, g.target) && this.options.menuIsOpen()) {
            this.closeMenu()
        }
    }})
})(this, jQuery, can, as);
(function (d, e, c, b, f) {
    b.CompoundButton = b.CompoundLink.extend({defaults: {primaryButtonElement: null, primaryButtonLabelElement: null, labelSelector: ".button .label", handleSelector: ".handle", handleElement: null, arrowSelector: ".arrow", primaryButtonObserve: null, menuEnabled: c.compute(true), handleDown: c.compute(false), actionMenuDataUrl: null, actionMenuTemplateId: null}}, {init: function () {
        var h = this.options, i = this.element.find(h.arrowSelector).children("span"), g = this;
        this._super();
        this.actionMenu = new b.ActionMenu(this.element, {dataUrl: h.actionMenuDataUrl, templateId: h.actionMenuTemplateId});
        h.primaryButtonElement = this.element.find(".button").eq(0);
        h.primaryButtonLabelElement = this.element.find(this.options.labelSelector);
        h.handleElement = this.element.find(this.options.handleSelector);
        this.element.addClass("init");
        h.primaryButtonElement.addClass("init");
        h.handleElement.addClass("init");
        h.handleElement.attr({"aria-haspopup": "true", "aria-owns": this.actionMenu.actionMenu.prop("id")});
        if (i.length > 0) {
            i.addClass("a11y")
        }
        h.primaryButtonObserve = new c.Map({name: h.primaryButtonElement.prop("name"), value: h.primaryButtonElement.prop("value"), labelHTML: h.primaryButtonLabelElement.html()});
        if (this.actionMenu.isDynamic()) {
            this.actionMenu.options.contentLoadedDeferred.then(function () {
                g.actionMenuLinks = g.element.find(g.options.actionMenuLinkSelector);
                g.repositionActionMenu()
            })
        }
        this.repositionActionMenu();
        this.on()
    }, "{handleSelector} click": "toggleMenu", ".button.active.init.account click": "toggleMenu", "{handleSelector} keydown": "handleKeydown", "{menuEnabled} change": "menuEnabledChange", "{handleDown} change": "handleDownChange", "{primaryButtonObserve} value": "buttonValueChange", "{primaryButtonObserve} name": "buttonNameChange", "{primaryButtonObserve} labelHTML": "buttonLabelChange", handleKeydown: function (j, g) {
        var i = this.actionMenu.options.contentLoadedDeferred, h = this;
        if (i.state() === "resolved" || !this.actionMenu.isDynamic()) {
            this._super(j, g)
        } else {
            i.then(e.proxy(this.handleKeydown, this, j, g))
        }
    }, menuEnabledChange: function (j, g, i, h) {
        if (i) {
            this.element.addClass("compound-button")
        } else {
            this.element.removeClass("compound-button");
            this.options.menuIsOpen(false)
        }
        this.element.parent().get(0).className += ""
    }, handleDownChange: function (k, g, i, h) {
        var j = this.options.handleElement;
        if (i) {
            j.addClass("clicked")
        } else {
            j.removeClass("hover").removeClass("clicked")
        }
    }, buttonValueChange: function (j, g, i, h) {
        this.options.primaryButtonElement.prop("value", i)
    }, buttonNameChange: function (j, g, i, h) {
        this.options.primaryButtonElement.prop("name", i)
    }, buttonLabelChange: function (j, g, i, h) {
        this.options.primaryButtonLabelElement.html(i);
        this.repositionActionMenu()
    }, openMenu: function () {
        this.options.handleDown(true);
        this._super()
    }, closeMenu: function () {
        this.options.handleDown(false);
        this._super()
    }, viewOver: function (h, g) {
        if (!this.options.menuEnabled()) {
            return
        }
        if (g.target === this.options.handleElement.get(0)) {
            this.options.handleElement.addClass("hover")
        }
        this._super(h, g)
    }, viewOut: function (h, g) {
        if (!this.options.menuEnabled()) {
            return
        }
        this.options.handleElement.removeClass("hover");
        this._super(h, g)
    }, toggleMenu: function (h, g) {
        if (!this.options.menuEnabled()) {
            return
        }
        this._super(h, g)
    }, repositionActionMenu: function () {
        var m = this.options.actionMenuElement, l = this.options.handleElement, g, k, j, h = l.outerHeight(), i = m.find("button");
        i.css("width", "auto");
        m.css("width", "auto");
        g = this.options.primaryButtonElement.width();
        k = m.width();
        j = k > g ? k : g;
        if (!e(document.body).hasClass("ns")) {
            h += 1
        }
        m.css({width: j, top: h + "px"});
        i.css("width", "")
    }})
})(this, jQuery, can, as);
(function (d, e, c, b, f) {
    b.AddToCartButton = b.CompoundButton.extend({defaults: {buyNowEnabled: c.compute(null), buyNowActionMenuObserve: new c.Map(), buttonModesObserve: null, buyNowCookie: "aosqbe", buyNowButtonSelector: ".BuyNow button", buyNowLiSelector: ".BuyNow", buyNowSignUpSelector: ".BuyNow-SignUp", buyNowSignUpLinkSelector: "li.BuyNow-SignUp a", buyNowActionMenuButton: null, }, buttonModes: {defaultMode: "default", buyNowMode: "buynow"}}, {init: function () {
        this._super();
        this.options.buyNowActionMenuButton = this.element.find(this.options.buyNowButtonSelector);
        this.createModelData();
        if (e.cookie(this.options.buyNowCookie)) {
            this.options.buyNowEnabled(true)
        } else {
            this.options.buyNowEnabled(false)
        }
        this.on()
    }, ".action-menu li button click": "fireMetrics", "{buyNowSignUpLinkSelector} click": "fireMetricsForSignUp", "{buyNowEnabled} change": "toggleButtonState", "{primaryButtonObserve} title": function (j, g, i, h) {
        this.options.primaryButtonElement.prop("title", i)
    }, "{primaryButtonObserve} buttonClass": function (j, g, i, h) {
        this.options.primaryButtonElement.prop("class", i)
    }, "{primaryButtonObserve} handleClass": function (j, g, i, h) {
        this.options.handleElement.prop("class", i)
    }, "{buyNowActionMenuObserve} name": function (j, g, i, h) {
        this.options.buyNowActionMenuButton.prop("name", i)
    }, "{buyNowActionMenuObserve} title": function (j, g, i, h) {
        this.options.buyNowActionMenuButton.prop("title", i)
    }, "{buyNowActionMenuObserve} labelHTML": function (j, g, i, h) {
        this.options.buyNowActionMenuButton.html(i)
    }, toggleButtonState: function (k, i, l, j) {
        var g = this.element.find(this.options.buyNowLiSelector), h = this.element.find(this.options.buyNowSignUpSelector);
        if (l) {
            g.show();
            h.hide()
        } else {
            g.hide();
            h.show()
        }
        this.swapData()
    }, fireMetrics: function (i, g) {
        var h = this.element.closest("form"), j = h.find("input[name='product']").prop("value") || "";
        e.AsMetrics.fireMicroEvent({eVar: "eVar6", part: j, feature: "Sharing", action: i.attr("class") + " post"})
    }, fireMetricsForSignUp: function (i, g) {
        g.preventDefault();
        var h = i.get(0);
        e.AsMetrics.fireMicroEvent({eVar: "eVar19", slot: "Cart Button", feature: "Sign up for Express Checkout", action: "", node: h});
        e.AsEnv.doRedirect(h.href)
    }, createModelData: function () {
        var n = this.options.primaryButtonElement, p = this.options.primaryButtonObserve, q = this.options.buyNowActionMenuButton, h;
        var k = p.attr("name"), j = n.prop("title"), i = p.attr("labelHTML"), g = q.prop("name"), m = q.prop("title"), o = e.trim(q.text());
        var l = {defaultMode: {name: k, title: j, labelHTML: i, buttonClass: n.attr("class") || "", handleClass: this.options.handleElement.attr("class") || ""}, buyNowMode: {name: g, title: m, labelHTML: o, buttonClass: "button transactional", handleClass: "handle transactional"}};
        this.options.buttonModesObserve = new c.Map(l)
    }, swapData: function () {
        var g = this.options.primaryButtonObserve, j = this.options.buyNowActionMenuObserve, h = this.options.buyNowActionMenuButton, i = this.options.buttonModesObserve.attr();
        var k = function (m, l) {
            for (var n in l) {
                m.attr(n, l[n])
            }
        };
        if (this.options.buyNowEnabled() && h.length > 0) {
            k(g, i.buyNowMode);
            k(j, i.defaultMode)
        } else {
            k(g, i.defaultMode);
            k(j, i.buyNowMode)
        }
        this.repositionActionMenu()
    }})
})(this, jQuery, can, as);
(function (d, e, c, b, f) {
    b.ActionTray = c.Control.extend({defaults: {templateMap: new c.Map({}), template: null, moduleContainerId: null, animateView: false, materialize: c.compute(true), installmentLinkSelector: ".installment-overlay a", overrideOnPageLoad: true}}, {init: function () {
        if (this.options.templateMap.purchaseOptions) {
            this.templateMap = this.options.templateMap.purchaseOptions
        } else {
            this.templateMap = this.options.templateMap
        }
        this.titleBoxMap = this.options.templateMap;
        this.summarySection = this.element.find(".summarysection");
        this.productTitleElement = this.summarySection.find(".product-title");
        if (this.options.overrideOnPageLoad) {
            this.renderTemplate();
            this.renderedTemplate = true
        }
        this.fixedTrayEl = this.element.closest(".fixedtray");
        this.fixedTrayEl = this.fixedTrayEl.length > 0 ? this.fixedTrayEl : e(".fixedtray")
    }, "{document} * focus": function (g, h) {
        h.stopPropagation();
        if (this.isBehindFixedTray(g)) {
            this.handleFocusWhileBehindFixedTray()
        }
    }, isBehindFixedTray: function (i) {
        var p = e(d), g = p.height(), r = p.scrollTop(), k = g, m = k - this.fixedTrayEl.outerHeight(), n = i.offset().top - r, l = n + i.outerHeight(), q = l > m && k > n, j = i.closest(this.fixedTrayEl).length > 0, o = i.hasClass("overlay"), h = i.is("body");
        return(!h && !o && !j && q)
    }, handleFocusWhileBehindFixedTray: function () {
        d.scrollTo(0, e(d).scrollTop() + this.fixedTrayEl.outerHeight())
    }, renderTemplate: function () {
        var h = this.options.moduleContainerId, g = this.element;
        this.view = c.view(this.options.template, this.templateMap);
        if (this.view) {
            if (h) {
                g.find(h).html(this.view)
            } else {
                g.html(this.view)
            }
        }
    }, "{templateMap} change": function (i, k, h, g) {
        if (!this.options.overrideOnPageLoad && !this.renderedTemplate) {
            this.renderTemplate();
            this.renderedTemplate = true
        }
        if (this.titleBoxMap.attr("productTitle")) {
            this.productTitleElement.html(this.titleBoxMap.attr("productTitle")).attr("itemprop", "name").show();
            this.summarySection.show();
            if (!this.installmentOverlay) {
                var j = this.element.find(this.options.installmentLinkSelector);
                if (j.length > 0) {
                    j.attr("role", "button");
                    this.installmentOverlay = new b.InstallmentOverlay("#finance-overlay", {})
                }
            }
        } else {
            this.summarySection.hide()
        }
    }})
})(this, jQuery, can, as);
(function (f, g, e, c, i) {
    var b = {accessories: "#configuration-form", config: "#configuration-form", preauth: "#configuration-form", select: "#configuration-form", bts: "#bts-form", engrave: "#engraving_form", acc_engrave: "#engraving_form", giftwrap: "#engraving_form"};
    var d = {product: true, step: true, add: true, remove: true, "msg.0": true, "msg.1": true, "acc_msg.0": true, "acc_msg.1": true, "not-engraved": true, "acc-not-engraved": true, msg: true};
    var h = function (k, j) {
        if (j) {
            return[k]
        }
        return e.isArray(k) ? k : ("" + k).split(".")
    };
    c.BuyFlowStorage = e.Map({setup: function (j, l, m) {
        var o = e.deparam(f.location.search.slice(1)), n, k;
        this.keyTemplate = "{version}--{path}--{step}--{input}";
        this.sessionKeyTemplate = "{version}--{path}";
        this.keyPrefix = m ? m.indexOf(".") === -1 ? m + "." : m : null;
        this.initialising = true;
        this.initialKeys = [];
        this.keyData = {version: e.getObject("apple.buyFlowVersionId", false, f) || "v9", path: e.getObject("apple.buyFlowPath", false, f) || f.location.pathname, step: this.getStep(), input: ""};
        this.storage = new Storage(l);
        n = e.extend({}, j, this.getEntriesForStep(true, true) || {});
        k = this._super(n);
        this.initialising = false;
        this.initialKeys = [];
        return k
    }, attr: function (j, n) {
        var l = typeof j, m = {}, k = e.makeArray(arguments);
        if (l === "string" && k.length === 2 && j.indexOf(".") !== -1) {
            m[j] = n;
            k = [m]
        }
        return e.Map.prototype.attr.apply(this, k)
    }, compute: function (k) {
        if (e.isFunction(this.constructor.prototype[k])) {
            return e.compute(this[k], this)
        } else {
            var j = {args: []};
            return e.compute(function (l) {
                if (arguments.length) {
                    e.compute.read(this, []).value.attr(k, l)
                } else {
                    return e.compute.read(this, [], j).value.attr(k)
                }
            }, this)
        }
    }, __set: function (l, j, k) {
        if (!(this.initialising && e.inArray(l, this.initialKeys) !== -1)) {
            this.saveEntry(this.getStep(), l, j)
        }
        this._super(l, j, k)
    }, removeAttr: function (j) {
        var m = e.List && this instanceof e.List, l = h(j), n = l.shift(), k = m ? this[n] : this._data[n];
        if (!k) {
            n = j
        }
        if (l.length && k) {
            return k.removeAttr(l.join("."))
        } else {
            if (m) {
                this.splice(n, 1)
            } else {
                if (n in this._data) {
                    delete this._data[n];
                    if (!(n in this.constructor.prototype)) {
                        delete this[n]
                    }
                    this.removeEntry(this.getStep(), n);
                    e.batch.trigger(this, "__keys");
                    this._triggerChange(n, "remove", i, k)
                }
            }
            return k
        }
    }, getEntry: function (k, l) {
        var j = this.generateKey({step: !!k ? k : this.getStep(), input: l});
        return this.storage.get(j)
    }, getEntries: function (q, v) {
        var r = this.keyPrefix ? new RegExp(this.keyPrefix) : null, p = new RegExp(q), j = new RegExp(this.keyData.path + "--"), o = j.test(q), t = [], m = {}, l, n, k, u, s;
        for (l = 0, n = this.storage.length(); l < n; l++) {
            u = this.storage.getKey(l);
            if (o) {
                k = p.test(u) ? true : false
            } else {
                k = j.test(u) && p.test(u) ? true : false
            }
            if (k) {
                t.push(u);
                k = false
            }
        }
        for (l = 0, n = t.length; l < n; l++) {
            u = t[l];
            s = v ? u.slice(u.lastIndexOf("--") + 2) : u;
            if ((r && r.test(s)) || !r) {
                if (this.initialising) {
                    this.initialKeys.push(s)
                }
                m[s] = this.storage.get(u)
            }
        }
        return m
    }, getEntriesForSession: function (j) {
        return this.getEntries(e.sub(this.sessionKeyTemplate, this.keyData), j)
    }, getEntriesForStep: function (k, j) {
        if (typeof k === "boolean") {
            j = k;
            k = null
        }
        k = !!k ? k : this.getStep();
        return this.getEntries(k, j)
    }, hasEntries: function (k) {
        var j = this.getEntriesForStep(k, true);
        for (var l in j) {
            if (j.hasOwnProperty(l)) {
                return true
            }
        }
        return false
    }, saveEntry: function (k, m, l) {
        var j = this.generateKey({step: k, input: m});
        this.storage.set(j, l)
    }, setValueForStep: function (j, l, k) {
        j = !!j ? j : this.getStep();
        this.saveEntry(j, l, k)
    }, removeEntry: function (k, l) {
        var j = this.generateKey({step: k, input: l});
        this.storage.remove(j);
        if (this._data[l]) {
            this.removeAttr(l)
        }
    }, removeEntries: function (n) {
        var k = n ? n : this.getStep();
        for (var l in this.getEntries(k, false)) {
            var m = l.split("--"), j = m[m.length - 1];
            this.storage.remove(l);
            this.removeAttr(j)
        }
    }, removeAllForSession: function () {
        this.removeEntries(e.sub(this.sessionKeyTemplate, e.extend({}, this.keyData, {step: ""})))
    }, removeAllForStep: function (j) {
        this.removeEntries(!!j ? j : this.getStep())
    }, removeAllCompleted: function () {
        var p = e.getObject("apple.buyFlowFirstStep", f), q = g('input[name="bfe"]').length > 0, l = this.generateSessionKey(), n = /buyFlow--complete/, j, o, m;
        if (p && !q) {
            j = this.getEntries(l);
            for (o in j) {
                if (n.test(o) && (j[o] || j[o] === null)) {
                    m = o.split("--");
                    m.splice(m.length - 2, 2);
                    this.removeEntries(m.join("--"))
                }
            }
        }
    }, persist: function (k) {
        var m = this.getStep(), l = g(b[m]), j = this[m + "Persist"];
        if (this.storage.inFallback && this.storage.wantHash) {
            this.createHidden(l, "lsd", "true");
            this.createHiddensFromQueryString(l)
        } else {
            if (e.isFunction(j)) {
                j.apply(this, Array.prototype.slice.apply(l))
            }
        }
        this.createHiddens(l, this.getEntriesForSession(true))
    }, selectPersist: function (j) {
        this.saveFormValues(g("#select-product"), function (l) {
            var k = l.attr("name");
            return !!d[k]
        });
        this.saveFormValues(j, function (l) {
            var k = l.attr("name");
            return !!k
        })
    }, engravePersist: function (j) {
        this.saveFormValues(j, function (l) {
            var k = l.attr("name");
            return d[k] && (l.prop("checked") || l.val() !== "")
        })
    }, acc_engravePersist: function (j) {
        this.engravePersist.apply(this, arguments)
    }, giftwrapPersist: function (j) {
        this.engravePersist.apply(this, arguments)
    }, validateSelectionsForPartNumber: function (k) {
        var j = this.getEntry("part", "number");
        if (j && j !== k) {
            this.removeEntries()
        }
    }, saveFormValues: function (p, k) {
        var l = this, j = g(p).find(":input"), o = this.getStep(), n, m;
        j.each(function (q, r) {
            n = g(r);
            m = e.isFunction(k) ? k(n) : true;
            if (m) {
                l.saveEntry(o, n.attr("name"), n.val())
            }
        })
    }, getStep: function () {
        var k = e.deparam(f.location.search.slice(1)) || {}, j = k.step || "select", l = g('input[name="step"]').val();
        return l ? l : j
    }, generateKey: function (j) {
        j = j || {};
        return e.sub(this.keyTemplate, e.extend({}, this.keyData, j))
    }, generateSessionKey: function (j) {
        j = j || {};
        return e.sub(this.sessionKeyTemplate, e.extend({}, this.keyData, j))
    }, createHidden: function (l, j, m) {
        var k, n = g(l).find('[name="' + j + '"]').length > 0;
        if (!n) {
            k = g("<input name='" + j + "' type='hidden'>");
            k.val(m);
            k.appendTo(l)
        }
    }, createHiddensFromQueryString: function (k) {
        var l, j = e.deparam(f.location.search.slice(1));
        for (l in j) {
            if (j[l] === "none" || j[l] === "true") {
                delete j[l]
            }
        }
        this.createHiddens(k, j)
    }, createHiddens: function (l, m) {
        for (var j in m) {
            if (m.hasOwnProperty(j)) {
                if (m[j]) {
                    this.createHidden(l, j, m[j])
                }
            }
        }
    }})
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.ProductSelectionController = c.Control.extend({defaults: {groupTemplate: "#{{DimensionGroup}}", rail: "#rail", socialSharing: ".social-sharing", dimensions: new c.Map({}), heightUpdated: c.compute(false), preSelectedData: new c.Map({}), installmentOverlayLink: ".installment-overlay a", stickyRail: false, selectedDimensionValues: new c.Map({}), requestData: new c.Map({}), isiPhone: false, isLiquid: false, selectedAccessory: null, singleCapacityValue: null}}, {"{window} load": "handleWindowLoad", handleWindowLoad: function () {
        this.loadingDocument = false
    }, init: function () {
        this.loadingDocument = true;
        this.installmentOverlay = null;
        this.locked = c.compute(false);
        this.data = [];
        this.groups = new c.Map({});
        this.groupCount = 1;
        this.sectionIds = [];
        this.dependencies = {};
        this.controllerInstances = [];
        this.urls = {};
        this.actionUrls = {};
        this.selectedProduct = null;
        this.defaultUrl = location.protocol + "//" + location.host + location.pathname;
        this.defaultPageTitle = document.title;
        this.initStorage();
        if (!this.options.isLiquid) {
            this.initRail();
            this.initDrawerMetrics()
        }
        this.initSocialSharing()
    }, hasPreSelectedData: function () {
        return !!this.options.preSelectedData.attr("data")
    }, addData: function (i) {
        if (i.content) {
            i = i.content
        }
        if (!i) {
            return
        }
        var g = this, h = [];
        this.data.push(i);
        this.actionUrls = e.extend(this.actionUrls, i.actionUrl);
        this.createDependancyMap(i.sections);
        var j = "group-" + this.groupCount;
        c.each(i.products, function (l, k) {
            if (e.inArray(l.dimensionCapacity, h) === -1) {
                h.push(l.dimensionCapacity)
            }
        });
        if (g.options.isiPhone && !g.options.singleCapacityValue && h.length === 1) {
            g.options.singleCapacityValue = i.products[0].dimensionCapacity
        }
        this.processDimensionConfig(j, i.sections);
        this.processGroupSections(j, this.groupCount - 1);
        this.applyPreSelections();
        c.each(this.groups[j], function (l, k) {
            l.controller.addProductData(i.products)
        });
        this.groupCount += 1;
        if (this.options.isLiquid) {
            this.initActionTray(i.products, i.displayValues.prices, i.selectButtonText)
        }
    }, applyPreSelections: function () {
        var g = this.options.preSelectedData.attr("data"), h = this;
        c.each(g, function (k, j) {
            if (j !== "defaultPageTitle") {
                var i = h.store.getEntry(null, j);
                if (history.replaceState || !i) {
                    h.store.setValueForStep(null, j, k)
                }
            }
        })
    }, initDrawerMetrics: function () {
        var g = {"#faq .trigger, #secondary .faq-trigger": "FAQ", "#tech-specs .trigger, #secondary .tech-specs-trigger": "Tech Specs"};
        e.each(g, function (h, i) {
            e(h).click(function () {
                e.AsMetrics.fireMicroEvent({eVar: "eVar6", feature: "Step 1", part: i, action: "Selected"}, true)
            })
        })
    }, initStorage: function () {
        if (!this.store) {
            this.store = new b.BuyFlowStorage({}, {session: true, hash: true, expires: d.apple.buyFlowExpiry || 3600000, expiryInMs: true})
        }
        this.store.removeAllCompleted()
    }, initSocialSharing: function () {
        this.socialSharingMarkup = c.compute(null);
        this.baseSocialSharingMarkup = "";
        this.socialSharing = new b.SocialSharingDisplay(this.options.socialSharing, {productNumber: null});
        if (this.socialSharing.element) {
            this.baseSocialSharingMarkup = this.socialSharing.element.html();
            this.socialSharingMarkup(this.baseSocialSharingMarkup);
            new b.HTMLBinding(this.socialSharing.element, {content: this.socialSharingMarkup, animate: false})
        }
    }, initActionTray: function (j, i, g) {
        var h = this.element.find(".title-bar-text").html();
        this.actionTrayData = new c.Map({purchaseOptions: {price: this.getFromPrice(j, i), selectButtonText: g}});
        this.actionTray = new b.ActionTray(this.element, {moduleContainerId: this.options.actionTrayId, template: this.options.actionTrayTemplate, titleBoxTemplate: this.options.titleBoxTemplate, summarySectionTitle: h, templateMap: this.actionTrayData})
    }, initRail: function () {
        this.railProduct = new c.Map({});
        this.rail = new b.RightRail(this.options.rail, {rightRailSelector: ".rail", purchaseInfoSelector: "#purchase-info-primary", purchaseInfoSelectors: {totalPriceSelector: "li.price", freeShippingAlertSelector: "li.shipping", financingNotesSelector: "li.financing", shippingSelector: "li.shippingLead, li.shipping-lead", buttonSelector: "li.add-to-cart", promotionsSelector: "li.promotions"}, selectionData: this.railProduct, isSticky: this.options.stickyRail, pageSelector: "#page", bottomBoundingElementSelector: "#apple-footer"});
        this.titleMarkup = c.compute(null);
        this.baseProductMarkup = "";
        this.fallbackProductMarkup = "";
        if (this.rail.element) {
            var g = this.rail.element.find(".title-image:first"), h = this.rail.element.find(".title-image-fallback:first");
            this.baseProductMarkup = (g.length) ? g.html() : "";
            this.fallbackProductMarkup = (h.length) ? h.html() : "";
            this.titleMarkup(this.baseProductMarkup);
            this.test = new b.HTMLBinding(g, {content: this.titleMarkup})
        }
        this.options.heightUpdated(true)
    }, equalizeRailHeight: function () {
        if (!this.railEqualizer) {
            this.railEqualizer = new b.Equalizer("body", {selector: ".equalize-height"})
        } else {
            this.railEqualizer.resetHeight();
            this.railEqualizer.equalize()
        }
    }, renderGroupTemplate: function (g) {
        var h = c.view(this.options.groupTemplate, g);
        c.append(this.element.find(".product-selection-" + this.groupCount + "-group"), h);
        this.options.heightUpdated(true)
    }, processDimensionConfig: function (k, i) {
        var h = this, j = {}, g = [];
        c.each(i, function (p, m) {
            var l = p.id, o = p.id, n = 1;
            while (e.inArray(o, h.sectionIds) !== -1) {
                o = p.id + "-" + n;
                n += 1
            }
            p.id = j[l] = o;
            h.sectionIds.push(p.id);
            if (j[p.dependsOn]) {
                p.dependsOn = j[p.dependsOn]
            }
            g.push(p)
        });
        this.groups[k] = g;
        this.renderGroupTemplate({name: k, sections: g})
    }, createControllerArray: function () {
        var g = {"as.DimensionSelectionController": b.DimensionSelectionController, "as.CapacitySelectionController": b.CapacitySelectionController, "as.ColorSelectionController": b.ColorSelectionController, "as.CarrierSelectionController": b.CarrierSelectionController, "as.ScreensizeSelectionController": b.ScreenSizeSelectionController};
        return g
    }, processGroupSections: function (j, h) {
        var g = this;
        var i = this.createControllerArray();
        c.each(this.groups[j], function (m, k) {
            if (!g.options.dimensions[m.formFieldName]) {
                g.options.dimensions.attr(m.formFieldName, {set: {value: null, element: null, setter: null, filter: null}, sections: []})
            }
            c.each(m.filter, function (o, n) {
                if (g.data[h].actionUrl[o]) {
                    g.urls[m.id] = g.data[h].actionUrl[o]
                }
            });
            if (!g.urls[m.id] && typeof g.data[h].actionUrl === "string") {
                g.urls[m.id] = g.data[h].actionUrl
            }
            var l = {dimensionvalue: g.options.dimensions[m.formFieldName], id: m.id, prefix: m.id, dimension: c.compute(m.formFieldName), template: m.sectionTemplate, store: g.store, displayValues: g.data[h].displayValues, header: m.header, footer: m.footer, heightUpdated: g.options.heightUpdated, locked: g.locked, filter: m.filter, suppressMicrodata: g.hasPreSelectedData(), formFieldName: m.formFieldName, isiPhone: g.options.isiPhone, isLiquid: g.options.isLiquid, iPhoneCarrierTemplate: g.options.carrierTemplate, shouldEnableScroll: g.shouldEnableScroll, productData: g.data[h].products, isSingleSection: (g.data[h].sections && g.data[h].sections.length === 1) ? true : false, singleCapacityValue: g.options.singleCapacityValue, selectedDimensionValues: (g.options.isiPhone) ? g.options.selectedDimensionValues : null};
            m.controller = new i[m.controller]("#" + m.id + " .selection", l);
            g.options.dimensions[m.formFieldName]["sections"].push(m.controller);
            g.controllerInstances[m.id] = m.controller;
            if (m.dependsOn) {
                m.controller.disable();
                if (!g.dependencies[m.dependsOn]) {
                    g.dependencies[m.dependsOn] = []
                }
                g.dependencies[m.dependsOn].push(m.controller)
            } else {
                m.controller.enable()
            }
        })
    }, setDisplayData: function (j, g, h) {
        b.RetailAvailabilityObserve({partNumber: j, productTitle: g.productTitle});
        if (this.socialSharing && this.socialSharing.element) {
            this.socialSharingMarkup(h);
            this.socialSharing.options.productNumber = j;
            this.socialSharing.updateSocialSharingURL()
        }
        if (this.rail && this.rail.element) {
            var i = "", k = this.baseProductMarkup;
            if (g.productImage) {
                i += g.productImage
            }
            if (g.productTitle) {
                i += '<h3 itemprop="name">' + g.productTitle + "</h3>"
            }
            if (!this.selectedProduct && this.hasPreSelectedData() && this.fallbackProductMarkup) {
                k = this.fallbackProductMarkup
            }
            this.railProduct.attr(g, true);
            i = i || k;
            this.titleMarkup(i)
        }
        if (j && b.LeadQuoteObserver) {
            b.LeadQuoteObserver.correctObjectIds()
        }
        b.mvt.activate()
    }, requestSelectedProduct: function (g, h) {
        var o = this;

        function i(r) {
            o.locked(false);
            var u = "", q = {}, t = o.baseSocialSharingMarkup, s = e(".rail .purchase-info-section");
            s.removeClass("nocontent");
            if (r.content.selected) {
                u = r.content.selected.partNumber;
                q = r.content.selected
            }
            if (o.socialSharing.element && r.content.socialSharingDisplay) {
                t = r.content.socialSharingDisplay
            }
            o.updateProductUri(r.content.pageURL);
            o.updatePageTitle(r.content.pageTitle);
            o.setDisplayData(u, q, t);
            var v = e(o.options.installmentOverlayLink);
            var w = (typeof(r.content.selected.addons) !== "undefined") ? r.content.selected.addons : null;
            if (typeof(o.options.addOnResponse) !== "undefined") {
                o.options.addOnResponse(w)
            }
            e("#finance-overlay").empty();
            if (v.length > 0) {
                o.installmentOverlay = new b.InstallmentOverlay("#finance-overlay", {})
            }
            if (r.content.selected.purchaseOptions && o.actionTrayData) {
                o.actionTrayData.attr(r.content.selected)
            }
        }

        function n(q) {
            o.locked(false);
            o.setDisplayData("", {}, o.baseSocialSharingMarkup);
            console.log("Request failed.")
        }

        if (!this.locked()) {
            if (this.options.isiPhone && h["option.carrierModel"]) {
                var j = h["option.carrierModel"], k = this.data[0].displayValues.carrierPolicyPart, l = k[j]["cppart"], m = k[j]["carrierPolicyType"];
                if (l && !this.options.singleCarrierPolicy) {
                    delete h["option.carrierModel"];
                    h.cppart = l
                }
                if (m) {
                    h.carrierPolicyType = m
                }
                if (this.options.accessories === true) {
                    this.options.activateAccessories(true);
                    var p = this.options.selectedAccessory || this.store.attr("ao.iphone_sim_card");
                    if (p) {
                        h["ao.iphone_sim_card"] = p
                    }
                }
            }
            this.locked(true);
            c.ajax({url: g, data: h, dataType: "json jsonrpc", success: i, error: n})
        }
    }, trackSelectProduct: function (j) {
        var n = d.s.pageName, o = [], k = {page: n, slot: "", feature: "Step 1", eVar: "eVar6", action: "Selected"}, l = j["option.dimensionColor"], g = j["option.dimensionCapacity"], m = j.carrierPolicyType, h = j.cppart || j["option.carrierModel"], i = j["accessory.iphone_sim_card"];
        if (l) {
            o.push(c.capitalize(l))
        }
        if (g) {
            o.push(g.toUpperCase())
        }
        if (!h && m && m.toUpperCase() === "UNLOCKED") {
            o.push(m)
        }
        if (h) {
            o.push(h.toUpperCase())
        }
        if (i) {
            o.push(i)
        }
        k.part = o.join(" > ");
        e.AsMetrics.fireMicroEvent(k, true)
    }, checkForProduct: function () {
        var j = {}, n = {}, i = "", g = this, k = 0, l = this.store.getEntriesForStep("", true), h = e(".rail .purchase-info-section");
        c.each(this.data, function (p, o) {
            k += p.products.filter(function (r) {
                var q = true;
                c.each(g.options.dimensions.attr(), function (t, s) {
                    if (o === 0) {
                        j["option." + s] = t.set.value;
                        if (t.set.value) {
                            n[s] = t.set.value;
                            i = g.urls[t.set.setter]
                        }
                    }
                    if (t.set.value && r[s] && r[s] !== t.set.value) {
                        q = false
                    }
                    if (q && t.set.filter) {
                        c.each(t.set.filter, function (v, u) {
                            if (r[u] && r[u] !== v) {
                                q = false
                            }
                            if (c.isArray(v) && e.inArray(r[u], v) !== -1) {
                                q = true
                            }
                        })
                    }
                });
                return q
            }).length
        });
        var m = this.filterProductList(n);
        if (k === 1 && m.length === 1 && typeof i === "undefined") {
            i = this.actionUrls[m[0]["part"]]
        }
        if (this.options.singleCarrierPolicy) {
            j["option.carrierModel"] = this.options.singleCarrierPolicy
        }
        if (this.options.isiPhone && this.options.singleCapacityValue) {
            j["option.dimensionCapacity"] = this.options.singleCapacityValue
        }
        if (k === 1 && i) {
            this.selectedProduct = j;
            this.requestSelectedProduct(i, j)
        } else {
            this.selectedProduct = null;
            g.setDisplayData("", {}, g.baseSocialSharingMarkup);
            this.resetProductUri();
            this.resetPageTitle();
            h.addClass("nocontent")
        }
        this.trackSelectProduct(j)
    }, resetPageTitle: function (g) {
        document.title = this.defaultPageTitle
    }, resetProductUri: function () {
        if (!this.loadingDocument) {
            this.updateProductUri(null)
        }
    }, updatePageTitle: function (g) {
        if (g && g.length) {
            document.title = g
        }
    }, updateProductUri: function (h) {
        var g = this.defaultUrl + ((h && h.length) ? "/" + h : "");
        if (history.replaceState) {
            history.replaceState(null, null, g + location.search)
        }
    }, "{dimensions} change": function (g, n, m, p, h, q) {
        if (p === "set") {
            this.fireProductDataFiltration(h.setter, true);
            var o = h.value, i = h.setter, k = h.element, j = m.split(".")[0], r = this;
            if (!o || !i) {
                return
            }
            if (this.dependencies[i]) {
                var l = true;
                if (this.dependencies[i].length > 1) {
                    l = false
                }
                c.each(this.dependencies[i], function (t, s) {
                    t.enable(j, o, k, l)
                })
            }
            c.each(g[j]["sections"], function (t, s) {
                if (t.getId() !== i) {
                    t.deselect();
                    if (r.dependencies[t.getId()]) {
                        c.each(r.dependencies[t.getId()], function (v, u) {
                            v.disable()
                        })
                    }
                }
            });
            this.checkForProduct()
        }
    }, "{heightUpdated} change": function (i, j, h, g) {
        if (!h) {
            return
        }
        this.equalizeRailHeight();
        this.options.heightUpdated(false)
    }, "{preSelectedData} change": function (l, k, g, j, i, h) {
        if (g === "data" && !!i) {
            var m = location.pathname.substr(0, location.pathname.lastIndexOf("/"));
            this.defaultUrl = location.protocol + "//" + location.host + m;
            if (i.defaultPageTitle) {
                this.defaultPageTitle = i.defaultPageTitle
            }
            d.apple.buyFlowPath = m;
            this.initStorage()
        }
    }, getFromPrice: function (k, j) {
        var g = this, m, l = [];
        for (var h in j) {
            l[parseInt(h, 10)] = j[h]
        }
        m = Math.min.apply(k, e.map(k, function (i) {
            return parseInt(i.price, 10)
        }));
        return l[m].comparativeDisplayPrice
    }, createDependancyMap: function (h) {
        var g = this;
        this.dependencyChain = [];
        c.each(h, function (k, j) {
            var i = e.map(h, function (l) {
                if (k.id === l.dependsOn || (c.isArray(l.dependsOn) && e.inArray(k.id, l.dependsOn) !== -1)) {
                    return l.id
                }
            });
            g.dependencyChain[k.id] = i
        })
    }, fireProductDataFiltration: function (i, h) {
        var g = this;
        c.each(this.dependencyChain[i], function (l) {
            var k = g.controllerInstances[l], j = g.controllerInstances[i];
            if (h && g.options.isiPhone) {
                k.enable()
            }
            k.setParents(j.parents.concat([j.options.dimension()]));
            k.fireDataFiltration();
            g.fireProductDataFiltration(l, false)
        })
    }, filterProductList: function (h) {
        var g = this, i = h, j;
        if (this.data && i) {
            e.each(this.data, function (k, l) {
                j = l.products;
                e.each(i, function (m, n) {
                    j = j.filter(function (p, o) {
                        if (p[m] === n) {
                            return j[o]
                        }
                    })
                })
            });
            return j
        }
    }})
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.DimensionSelectionController = c.Control.extend({defaults: {prefix: c.compute(""), filter: [], canChangeImage: false}}, {init: function () {
        this.currentSelected = null;
        this.createPriceKeys();
        this.parents = [];
        if (!this.templateData) {
            this.templateData = new c.Map({})
        }
        this.templateData.attr("prefix", this.options.prefix);
        this.templateData.attr("disabled", c.compute(false));
        this.templateData.attr("dimension", this.options.dimension);
        this.templateData.attr("header", this.options.header);
        this.templateData.attr("footer", this.options.footer);
        this.templateData.attr("suppressMicrodata", this.options.suppressMicrodata);
        this.templateData.attr("formFieldName", this.options.formFieldName);
        this.renderTemplate()
    }, getId: function () {
        return this.options.id
    }, addProductData: function (g) {
        if (!this.products) {
            this.products = new c.List([])
        }
        this.productData = g;
        this.products.push(g);
        if (!this.processedData) {
            this.processDataForTemplate(g)
        }
    }, processDataForTemplate: function (g) {
        this.processedData = true;
        if (this.options.heightUpdated) {
            this.options.heightUpdated(true)
        }
    }, skipProduct: function (h) {
        var g = false;
        c.each(this.options.filter, function (j, i) {
            if (h.hasOwnProperty(i) && h[i] !== j) {
                g = true;
                if (c.isArray(j) && e.inArray(h[i], j) !== -1) {
                    g = false
                }
            }
        });
        return g
    }, renderTemplate: function () {
        var h = this.options.template;
        if (this.templateData.carriers && this.options.isiPhone && this.options.iPhoneCarrierTemplate) {
            h = this.options.iPhoneCarrierTemplate
        }
        var g = c.view(h, this.templateData);
        this.element.html(g)
    }, setDimensionValue: function (g) {
        if (!this.enabled) {
            return
        }
        this.options.dimensionvalue.attr("set", {value: g, element: this.selectedElement, setter: this.options.id, filter: this.options.filter})
    }, getDimensionValue: function () {
        return this.options.dimensionvalue.attr("set.value")
    }, clearDimensionValue: function () {
        this.options.dimensionvalue.attr("set", {value: null, setter: null})
    }, enable: function (j, h, g, i) {
        this.enabled = true;
        this.templateData.disabled(false);
        this.element.find("a").removeAttr("tabindex")
    }, disable: function () {
        this.enabled = false;
        this.templateData.disabled(true);
        this.element.find("a").attr("tabindex", "-1");
        if (this.currentSelected) {
            this.options.store.removeAttr(this.options.dimension());
            this.clearDimensionValue()
        }
        this.deselect()
    }, deselect: function () {
        if (this.currentSelected) {
            this.currentSelected(false)
        }
        this.currentSelected = null
    }, createPriceKeys: function () {
        if (this.options.displayValues) {
            var j = this.options.displayValues.prices, h = [];
            for (var g in j) {
                h[parseInt(g, 10)] = j[g]
            }
            this.priceKeys = h
        }
    }, getPrice: function (k, j, l) {
        var g = this, i = {}, h = e.map(k, function (m) {
            if (g.skipProduct(m)) {
                return
            }
            if (l === "carrier") {
                if (m.carrierModel === j) {
                    return parseInt(m.price, 10)
                }
            } else {
                if (l === "capacity") {
                    if (m.dimensionCapacity === j) {
                        return parseInt(m.price, 10)
                    }
                }
            }
        });
        h = e.unique(h);
        i.price = Math.min.apply(k, h);
        i.totalItems = h.length;
        return i
    }, filterData: function (j) {
        var h = this, k = this.options.productData, i = this.options.selectedDimensionValues, g = this.element.find("input[type='radio']").attr("name");
        if (k && i) {
            c.each(i.attr(), function (m, l) {
                if ((j || l !== g) && (l === g || h.parents.indexOf(l) > -1)) {
                    k = k.filter(function (o, n) {
                        if (o[l] === m) {
                            return k[n]
                        }
                    })
                }
            });
            return k
        } else {
            return h.productData
        }
    }, fireDataFiltration: function () {
        return false
    }, setParents: function (g) {
        this.parents = g
    }})
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.CapacitySelectionController = b.DimensionSelectionController.extend({defaults: {}}, {init: function () {
        this.capacities = new c.List([]);
        this.uniqueCapacityKeys = [];
        this.selectedValue = null;
        this.selectedValues = {};
        this.templateData = new c.Map({});
        this.templateData.attr("capacities", this.capacities);
        this._super()
    }, getLowestPrice: function (k) {
        var j = k.price, h = this.options.displayValues.prices[j], g = h.installments || h.installmentsOffer, l = h.educationFinancing && h.educationFinancing.educationFinanceOffer && h.educationFinancing.educationFinanceOffer.educationFinanceAmount, i = h.displayPrice || (h.currentPrice && h.currentPrice.amount);
        j = parseInt(j, 10);
        if (!this.lowestPrices) {
            this.lowestPrices = {}
        }
        if (!this.lowestPrices[k.dimensionCapacity]) {
            this.lowestPrices[k.dimensionCapacity] = {display: c.compute(i), fromdisplay: h.comparativeDisplayPrice, value: j, installments: c.compute(g), educationFinancing: c.compute(l), priceFeeDisclaimer: c.compute(h.priceFeeDisclaimer), previousPrice: h.previousPrice, savings: h.savings, currency: h.priceCurrency, messaging: h.message, promotion: c.compute(k.displayPromotion)}
        } else {
            if (this.lowestPrices[k.dimensionCapacity].value < j) {
                this.lowestPrices[k.dimensionCapacity].display(this.lowestPrices[k.dimensionCapacity].fromdisplay)
            } else {
                if (this.lowestPrices[k.dimensionCapacity].value > j) {
                    this.lowestPrices[k.dimensionCapacity].value = j;
                    this.lowestPrices[k.dimensionCapacity].fromdisplay = h.comparativeDisplayPrice;
                    this.lowestPrices[k.dimensionCapacity].display(this.lowestPrices[k.dimensionCapacity].fromdisplay);
                    this.lowestPrices[k.dimensionCapacity].installments(g);
                    this.lowestPrices[k.dimensionCapacity].educationFinancing(l);
                    this.lowestPrices[k.dimensionCapacity].previousPrice = h.previousPrice;
                    this.lowestPrices[k.dimensionCapacity].savings = h.savings;
                    this.lowestPrices[k.dimensionCapacity].messaging = h.message;
                    this.lowestPrices[k.dimensionCapacity].priceFeeDisclaimer(h.priceFeeDisclaimer)
                }
            }
        }
        if (k.displayPromotion !== this.lowestPrices[k.dimensionCapacity].promotion()) {
            this.lowestPrices[k.dimensionCapacity].promotion(null)
        }
    }, getShippingQuote: function (h) {
        if (!this.shippingDisplay) {
            this.shippingDisplay = {}
        }
        var g = this.options.displayValues.shipping.shipLabel;
        g += "<br />";
        g += h.displayShippingQuote;
        if (!this.shippingDisplay[h.dimensionCapacity]) {
            this.shippingDisplay[h.dimensionCapacity] = c.compute(g)
        } else {
            if (this.shippingDisplay[h.dimensionCapacity]() !== g) {
                this.shippingDisplay[h.dimensionCapacity](this.options.displayValues.shipping.checkAvailabilityMessage)
            }
        }
    }, filtersMatchStoredValues: function (i) {
        var h = true, g = this;
        c.each(this.options.filter, function (k, j) {
            var l = g.options.store.getEntry("", j);
            if (l && i.hasOwnProperty(j) && i[j] !== l) {
                h = false;
                if (typeof l === "object" && !c.isArray(l)) {
                    l = c.makeArray(l)
                }
                if (c.isArray(l) && e.inArray(i[j], l) !== -1) {
                    h = true
                }
            }
        });
        return h
    }, processDataForTemplate: function (l) {
        var k = this.options.store.getEntry("", this.options.dimension()), m = false, h = this;
        this.uniqueCapacityKeys = [];
        this.capacities.replace([]);
        if (this.options.displayValues.dimensionCapacity.hasOwnProperty("variantOrder")) {
            l = this.sortCapacity(l, h.options.displayValues.dimensionCapacity.variantOrder, "dimensionCapacity")
        }
        c.each(l, function (q, n) {
            if (h.skipProduct(q)) {
                return
            }
            var o = false;
            if (h.enabled && k === q.dimensionCapacity && h.filtersMatchStoredValues(q)) {
                o = true;
                h.selectedElement = h.element.find(".item input[value=" + q.dimensionCapacity + "]").parent();
                h.selectedValue = q.dimensionCapacity;
                if (h.options.isiPhone) {
                    h.options.selectedDimensionValues.attr(h.options.dimension(), k)
                }
            }
            if (!h.selectedValues[q.dimensionCapacity]) {
                h.selectedValues[q.dimensionCapacity] = c.compute()
            }
            h.selectedValues[q.dimensionCapacity](o);
            h.getLowestPrice(q);
            h.getShippingQuote(q);
            var p = {prefix: h.options.prefix, capacity: q.dimensionCapacity, capacityDisplay: h.options.displayValues.dimensionCapacity[q.dimensionCapacity].value, price: h.lowestPrices[q.dimensionCapacity].display, displayPromotion: h.lowestPrices[q.dimensionCapacity].promotion, installments: h.lowestPrices[q.dimensionCapacity].installments, educationFinancing: h.lowestPrices[q.dimensionCapacity].educationFinancing, previousPrice: h.lowestPrices[q.dimensionCapacity].previousPrice, savings: h.lowestPrices[q.dimensionCapacity].savings, messaging: h.lowestPrices[q.dimensionCapacity].messaging, currency: h.lowestPrices[q.dimensionCapacity].currency, disclaimer: h.lowestPrices[q.dimensionCapacity].priceFeeDisclaimer, shipping: h.shippingDisplay[q.dimensionCapacity], selected: h.selectedValues[q.dimensionCapacity], group: h.options.dimension()};
            if (h.options.isLiquid) {
                p.displayPromotion = q.displayPromotion;
                var r = h.getPrice(l, q.dimensionCapacity, "capacity");
                if (q.carrierPolicyType && q.carrierPolicyType === "POSTPAID") {
                    p.price = h.priceKeys[r.price].comparativeDisplayPrice
                } else {
                    p.price = r.totalItems === 1 ? h.priceKeys[r.price].currentPrice.amount : h.priceKeys[r.price].comparativeDisplayPrice
                }
            }
            if (e.inArray(q.dimensionCapacity, h.uniqueCapacityKeys) === -1) {
                m = true;
                h.capacities.push(p);
                h.uniqueCapacityKeys.push(q.dimensionCapacity);
                if (o) {
                    h.currentSelected = p.selected
                }
            }
        });
        if (m) {
            this.templateData.attr("count", this.capacities.attr().length);
            if (this.capacities.attr().length === 1) {
                this.templateData.attr("single", true);
                this.element.parent().addClass("single-value");
                if (this.options.displayValues.dimensionCapacity.title) {
                    this.templateData.attr("capacitysectiontitle", this.options.displayValues.dimensionCapacity.title.singleVariantDisplayTitle)
                }
            } else {
                this.templateData.attr("single", false);
                this.element.parent().removeClass("single-value");
                if (this.options.displayValues.dimensionCapacity.title) {
                    this.templateData.attr("capacitysectiontitle", this.options.displayValues.dimensionCapacity.title.multiVariantsDisplayTitle)
                }
            }
        }
        if (this.currentSelected) {
            this.setDimensionValue(this.selectedValue)
        }
        if (h.options.isiPhone && !h.options.isLiquid) {
            var j = h.capacities.length, g = this.element.find(".item"), i = g.find(".details");
            if (j > 1) {
                g.css({width: "calc(98% / " + j + ")"});
                i.css({width: "auto"})
            }
        }
        this.equalizeEverything();
        this._super(l)
    }, sortCapacity: function (j, i, h) {
        var g = [];
        c.each(i, function (l, k) {
            var m = e.map(j, function (o, n) {
                if (o[h] === l) {
                    return o
                }
            });
            e.merge(g, m)
        });
        return g
    }, fireDataFiltration: function () {
        var g = this.filterData() || this.products;
        if (typeof g !== "undefined") {
            this.capacities.length = 0;
            this.lowestPrices = null;
            this.processDataForTemplate(g)
        }
    }, equalizeEverything: function (h) {
        var i = this.capacities.length, g = this.element;
        if (h === 1) {
            g = "body"
        }
        new b.Equalizer(g, {selector: ".equalize-capacity-button-height"});
        new b.Equalizer(g, {selector: ".equalize-capacity-button-height .details"});
        new b.Equalizer(g, {selector: ".equalize-header .selection-title"})
    }, getMoreSpecificValues: function (j, i) {
        function k(l, m) {
            return l + "." + m
        }

        this.options.filter[j] = i;
        if (!this.moreSpecificCapacityValues) {
            this.moreSpecificCapacityValues = {}
        }
        var h = this.moreSpecificCapacityValues[k(j, i)];
        if (h && h.length !== 0) {
            this.capacities.replace(h);
            if (this.currentSelected) {
                this.setDimensionValue(this.selectedValue)
            }
            this.equalizeEverything()
        } else {
            this.shippingDisplay = null;
            this.lowestPrices = null;
            this.uniqueCapacityKeys = [];
            this.capacities.replace([]);
            var g = this;
            if (this.products) {
                this.products.forEach(function (l) {
                    g.processDataForTemplate(l)
                })
            }
            this.moreSpecificCapacityValues[k(j, i)] = this.capacities.attr()
        }
    }, selectValue: function (h) {
        var g = this;
        if (this.currentSelected && this.options.store.attr(this.options.dimension()) === h) {
            return
        }
        this.selectedValue = h;
        this.options.store.attr(this.options.dimension(), h);
        c.each(this.options.filter, function (j, i) {
            if (c.isArray(j)) {
                j = j[0]
            }
            g.options.store.attr(i, j)
        });
        if (this.currentSelected) {
            this.currentSelected(false)
        }
        this.currentSelected = this.capacities[e.inArray(h, this.uniqueCapacityKeys)]["selected"];
        this.currentSelected(true);
        if (this.options.isiPhone) {
            this.options.selectedDimensionValues.attr(this.options.dimension(), h)
        }
        this.setDimensionValue(h)
    }, enable: function (j, h, g, i) {
        this._super(h);
        if (i && this.capacities.attr().length === 1) {
            this.selectValue(this.capacities.attr()[0].capacity)
        }
        if (j && h && !this.options.isLiquid && !this.options.isiPhone) {
            this.getMoreSpecificValues(j, h)
        }
    }, ".enabled input keydown": function (g, h) {
        if (this.options.locked()) {
            h.preventDefault();
            return
        }
    }, ".enabled input click": function (g, h) {
        if (this.options.locked()) {
            return
        }
        this.selectedElement = g.parent();
        this.selectValue(g.val())
    }})
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.ColorSelectionController = b.DimensionSelectionController.extend({defaults: {swapProductColorImageSelector: ".swap-product-color-image"}}, {init: function () {
        this.colors = new c.List([]);
        this.colorImages = {};
        this.uniqueColorKeys = [];
        this.templateData = new c.Map({});
        this.templateData.attr("colors", this.colors);
        this.initProductColorImageSwap();
        this._super()
    }, initProductColorImageSwap: function () {
        e(this.options.swapProductColorImageSelector).addClass("materializer")
    }, swapProductColorImage: function () {
        if (!this.productColorImageMarkup && e(this.options.swapProductColorImageSelector)) {
            e(this.options.swapProductColorImageSelector).removeClass("size");
            this.productColorImageMarkup = c.compute();
            new b.HTMLBinding(e(this.options.swapProductColorImageSelector), {content: this.productColorImageMarkup, animateHeight: false})
        }
        var h;
        if (this.options.isiPhone && this.filteredData.length > 0 && this.filteredData[0].image) {
            h = this.filteredData[0].image
        } else {
            h = this.colorImages[this.getDimensionValue()]
        }
        if (!h) {
            return
        }
        if (typeof(h.srcSet) !== "undefined") {
            var g = new Image();
            e(g).attr({src: h.srcSet.src, width: h.width, height: h.height, alt: h.alt});
            this.productColorImageMarkup(g.outerHTML)
        } else {
            this.productColorImageMarkup(h)
        }
    }, getShippingQuote: function (h) {
        if (!this.shippingDisplay) {
            this.shippingDisplay = {}
        }
        var g = this.options.displayValues.shipping.shipLabel;
        g += "<br />";
        g += h.displayShippingQuote;
        if (!this.shippingDisplay[h.dimensionColor]) {
            this.shippingDisplay[h.dimensionColor] = c.compute(g)
        } else {
            if (this.shippingDisplay[h.dimensionColor]() !== g) {
                this.shippingDisplay[h.dimensionColor](this.options.displayValues.shipping.checkAvailabilityMessage)
            }
        }
    }, getLowestPrice: function (k) {
        var j = k.price, h = this.options.displayValues.prices[j], g = h.installments || h.installmentsOffer, i = h.displayPrice || (h.currentPrice && h.currentPrice.amount);
        j = parseInt(j, 10);
        if (!this.lowestPrices) {
            this.lowestPrices = {}
        }
        if (!this.lowestPrices[k.dimensionColor]) {
            this.lowestPrices[k.dimensionColor] = {display: c.compute(i), fromdisplay: h.comparativeDisplayPrice, value: j, installments: c.compute(g), currency: h.priceCurrency, priceFeeDisclaimer: c.compute(h.priceFeeDisclaimer), isComparitivePriceDisplay: c.compute(false)}
        } else {
            if (this.lowestPrices[k.dimensionColor].value < j) {
                this.lowestPrices[k.dimensionColor].display(this.lowestPrices[k.dimensionColor].fromdisplay);
                this.lowestPrices[k.dimensionColor].isComparitivePriceDisplay(true)
            } else {
                if (this.lowestPrices[k.dimensionColor].value > j) {
                    this.lowestPrices[k.dimensionColor].value = j;
                    this.lowestPrices[k.dimensionColor].installments(g);
                    this.lowestPrices[k.dimensionColor].fromdisplay = h.comparativeDisplayPrice;
                    this.lowestPrices[k.dimensionColor].display(this.lowestPrices[k.dimensionColor].fromdisplay);
                    this.lowestPrices[k.dimensionColor].priceFeeDisclaimer(h.priceFeeDisclaimer);
                    this.lowestPrices[k.dimensionColor].isComparitivePriceDisplay(true)
                }
            }
        }
    }, sortColors: function (k, i) {
        var j = this.options.displayValues.dimensionColor.variantOrder, h = {}, g = [];
        c.each(k, function (m) {
            var l = m.dimensionColor;
            if (h[l]) {
                h[l].push(m)
            } else {
                h[l] = [m]
            }
        });
        c.each(j, function (m) {
            var n = h[m];
            for (var l = 0; l < n.length; l++) {
                g.push(n[l])
            }
        });
        return g
    }, processDataForTemplate: function (i) {
        if (this.options.isiPhone) {
            i = this.sortColors(i, "dimensionColor")
        }
        var h = this.options.store.getEntry("", this.options.dimension()), g = this;
        c.each(i, function (m, k) {
            if (!g.colorImages[m.dimensionColor]) {
                g.colorImages[m.dimensionColor] = m.image
            }
            var l = false;
            if (h === m.dimensionColor) {
                l = true
            }
            g.getLowestPrice(m);
            var j = {prefix: g.options.prefix, color: m.dimensionColor, colordisplay: g.options.displayValues.dimensionColor[m.dimensionColor].value, colorimage: g.options.displayValues.dimensionColor[m.dimensionColor].image, colorlabel: g.options.displayValues.dimensionColor[m.dimensionColor].label, price: g.lowestPrices[m.dimensionColor].display, currency: g.lowestPrices[m.dimensionColor].currency, isComparitivePriceDisplay: g.lowestPrices[m.dimensionColor].isComparitivePriceDisplay, selected: c.compute(l), group: g.options.dimension()};
            if (g.options.isiPhone) {
                if (g.options.isSingleSection) {
                    g.getShippingQuote(m);
                    j.shipping = g.shippingDisplay[m.dimensionColor];
                    j.installments = g.lowestPrices[m.dimensionColor].installments
                }
                if (g.options.singleCapacityValue) {
                    j.capacityValue = g.options.displayValues.dimensionCapacity[m.dimensionCapacity].value
                }
                j.disclaimerNotes = g.lowestPrices[m.dimensionColor].priceFeeDisclaimer
            }
            if (e.inArray(m.dimensionColor, g.uniqueColorKeys) === -1) {
                g.colors.push(j);
                g.uniqueColorKeys.push(m.dimensionColor);
                if (l) {
                    g.selectValue(m.dimensionColor, true)
                }
            }
        });
        if (this.options.isiPhone) {
            this.templateData.attr("colorsectiontitle", this.options.header)
        } else {
            if (this.options.displayValues.dimensionColor.title) {
                if (this.colors.attr().length === 1) {
                    this.templateData.attr("colorsectiontitle", this.options.displayValues.dimensionColor.title.singleVariantDisplayTitle)
                } else {
                    this.templateData.attr("colorsectiontitle", this.options.displayValues.dimensionColor.title.multiVariantsDisplayTitle)
                }
            }
        }
        this._super(i)
    }, selectValue: function (h, g) {
        if (!g && this.options.store.attr(this.options.dimension()) === h) {
            return
        }
        this.options.store.attr(this.options.dimension(), h);
        if (this.currentSelected) {
            this.currentSelected(false)
        }
        this.currentSelected = this.colors[e.inArray(h, this.uniqueColorKeys)]["selected"];
        this.currentSelected(true);
        if (this.options.isiPhone) {
            this.options.selectedDimensionValues.attr(this.options.dimension(), h)
        }
        this.setDimensionValue(h);
        if (this.templateData.disabled()) {
            this.disable()
        } else {
            this.fireDataFiltration()
        }
    }, enable: function (j, h, g, i) {
        this._super(h);
        if (i && this.colors.attr().length === 1) {
            this.selectValue(this.colors.attr()[0].color, false)
        }
    }, ".enabled input keydown": function (g, h) {
        if ((e.AsEvent.Keyboard.ArrowRight === h.keyCode) || (e.AsEvent.Keyboard.ArrowLeft === h.keyCode) || (e.AsEvent.Keyboard.Space === h.keyCode)) {
            if (this.options.locked()) {
                h.preventDefault();
                return
            }
        }
    }, fireDataFiltration: function () {
        this.filteredData = this.filterData(true) || this.products;
        if (this.currentSelected) {
            this.swapProductColorImage()
        }
    }, ".enabled input click": function (g, h) {
        if (this.options.locked()) {
            return
        }
        this.selectValue(g.val());
        if (!this.options.isLiquid) {
            g.focus()
        }
    }})
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.CarrierSelectionController = b.DimensionSelectionController({defaults: {}}, {shouldShowMinimumPrice: true, init: function () {
        this.carriers = new c.List([]);
        this.uniqueCarrierKeys = [];
        this.carrierPolicyPart = [];
        this.templateData = new c.Map({});
        this.templateData.attr("carriers", this.carriers);
        this.expanded = true;
        this._super()
    }, getShippingQuote: function (h) {
        if (!this.shippingDisplay) {
            this.shippingDisplay = {}
        }
        var g = this.options.displayValues.shipping.shipLabel;
        g += "<br />";
        g += h.displayShippingQuote;
        if (!this.shippingDisplay[h.carrierModel]) {
            this.shippingDisplay[h.carrierModel] = c.compute(g)
        } else {
            if (this.shippingDisplay[h.carrierModel]() !== g) {
                this.shippingDisplay[h.carrierModel](this.options.displayValues.shipping.checkAvailabilityMessage)
            }
        }
    }, processFilteredData: function (n) {
        n = this.sortCarriers(n, "carrierModel", true);
        var m = this.options.store.getEntry("", this.options.dimension()), h = this, i = this.options.displayValues.carrierPolicyType, j = this.options.displayValues.prices;
        this.carriersGroup = [];
        this.uniqueCarrierKeys = [];
        c.each(n, function (r, p) {
            if (!r.carrierModel || h.skipProduct(r)) {
                return
            }
            var q = false;
            if (h.enabled && m === r.carrierModel) {
                q = true;
                h.setDimensionValue(r.carrierModel)
            }
            h.getShippingQuote(r);
            var s = {prefix: h.options.prefix, carrier: r.carrierModel, carrierPolicyType: r.carrierPolicyType, carrierPolicyPart: r.carrierPolicyPart, shipping: h.shippingDisplay[r.carrierModel], selected: c.compute(q), group: h.options.dimension()};
            if (h.options.isiPhone) {
                s.carrierdisplay = h.options.displayValues.carrierPolicyPart[r.carrierPolicyPart].value;
                s.carrierID = r.carrierPolicyPart.replace("/", "");
                s.carrierModel = r.carrierPolicyPart;
                s.displayPromotion = r.displayPromotion;
                s.description = r.description;
                var v = i[s.carrierPolicyType].products, u = h.getPrice(n, r.carrierModel, "carrier");
                if (r.carrierPolicyType.toUpperCase() === "UNLOCKED") {
                    if (!h.shouldShowMinimumPrice) {
                        s.price = j[r.price].currentPrice.amount;
                        s.savings = j[r.price].savings ? j[r.price].savings : null;
                        s.currency = j[r.price].priceCurrency ? j[r.price].priceCurrency : null;
                        s.messaging = j[r.price].message ? j[r.price].message : null;
                        s.previousPrice = j[r.price].previousPrice ? j[r.price].previousPrice : null
                    } else {
                        s.price = u.totalItems === 1 ? h.priceKeys[u.price].currentPrice.amount : h.priceKeys[u.price].comparativeDisplayPrice
                    }
                } else {
                    s.price = h.priceKeys[u.price].comparativeDisplayPrice
                }
                s.currency = h.priceKeys[u.price].priceCurrency;
                if (e.inArray(s.carrierPolicyPart, h.uniqueCarrierKeys) === -1) {
                    if (e.inArray(s.carrierPolicyPart, h.carrierPolicyPart) === -1) {
                        h.carriers.push(s);
                        h.carrierPolicyPart.push(s.carrierPolicyPart)
                    }
                    h.uniqueCarrierKeys.push(r.carrierPolicyPart);
                    if (q) {
                        h.options.selectedDimensionValues.attr(h.options.dimension(), m);
                        h.currentSelected = s.selected
                    }
                }
                h.uniqueCarrierKeys = e.unique(h.uniqueCarrierKeys)
            } else {
                s.carrierdisplay = h.options.displayValues.carrierModel[r.carrierModel].value;
                if (e.inArray(r.carrierModel, h.uniqueCarrierKeys) === -1) {
                    var t = false;
                    for (var o = 0; o < h.carriers.length; o++) {
                        if (h.carriers[o].attr("carrier") > s.carrier) {
                            h.carriers.splice(o, 0, s);
                            h.uniqueCarrierKeys.splice(o, 0, r.carrierModel);
                            t = true;
                            break
                        }
                    }
                    if (!t) {
                        h.carriers.push(s);
                        h.uniqueCarrierKeys.push(r.carrierModel)
                    }
                    if (q) {
                        h.currentSelected = s.selected
                    }
                }
            }
        });
        if (this.options.displayValues.carrierModel.title) {
            if (this.carriers.attr().length === 1) {
                this.templateData.attr("carriersectiontitle", this.options.displayValues.carrierModel.title.singleVariantDisplayTitle)
            } else {
                this.templateData.attr("carriersectiontitle", this.options.displayValues.carrierModel.title.multiVariantsDisplayTitle)
            }
        }
        new b.Equalizer("body", {selector: ((this.options.id) ? "#" + this.options.id : "") + " .carrier-buttons .details"});
        if (h.options.isiPhone && !h.options.isLiquid) {
            var l = this.carriers.attr().length, g = this.element.find(".item"), k = g.find(".details");
            if (l > 1) {
                g.css({width: "calc(98% / " + l + ")"});
                k.css({width: "auto"})
            }
        }
    }, processDataForTemplate: function (g) {
        this.processFilteredData(g);
        this._super(g)
    }, fireDataFiltration: function () {
        var g = this.filterData() || this.products;
        if (typeof g !== "undefined") {
            this.carriers.length = 0;
            this.carrierPolicyPart = [];
            this.processFilteredData(g)
        }
    }, sortCarriers: function (h, g, i) {
        h = h.sort(function (k, j) {
            if (i) {
                return(k[g] > j[g]) ? 1 : ((k[g] < j[g]) ? -1 : 0)
            } else {
                return(j[g] > k[g]) ? 1 : ((j[g] < k[g]) ? -1 : 0)
            }
        });
        return h
    }, adjustArrow: function (g) {
        if (g && g.length >= 1) {
            this.arrow = this.element.find("#arrow");
            this.arrow.animate({left: (g.offset().left - e("#page").offset().left + (g.width() / 2)) + "px"})
        }
    }, expand: function () {
        if (e(this.element.children()[0]).hasClass("slide-open") && !this.expanded) {
            this.element.animate({height: "toggle", opacity: 1})
        }
        this.expanded = true
    }, collapse: function () {
        if (e(this.element.children()[0]).hasClass("slide-open") && this.expanded) {
            this.element.animate({height: "toggle", opacity: 0})
        }
        this.expanded = false
    }, selectValue: function (g) {
        if (this.getDimensionValue() === g) {
            return
        }
        this.options.store.attr(this.options.dimension(), g);
        if (this.currentSelected) {
            this.currentSelected(false)
        }
        this.currentSelected = this.carriers[e.inArray(g, this.uniqueCarrierKeys)]["selected"];
        this.currentSelected(true);
        if (this.options.isiPhone) {
            this.options.selectedDimensionValues.attr(this.options.dimension(), g)
        }
        this.setDimensionValue(g)
    }, enable: function (j, h, g, i) {
        this._super(h);
        this.expand();
        if (i && this.carriers.attr().length === 1) {
            this.selectValue(this.carriers.attr()[0].carrier)
        }
        this.adjustArrow(g)
    }, disable: function () {
        this._super();
        this.collapse()
    }, ".enabled input keydown": function (g, h) {
        if (this.options.locked()) {
            h.preventDefault();
            return
        }
    }, ".enabled input click": function (g, h) {
        if (this.options.locked()) {
            return
        }
        if (this.options.isiPhone) {
            this.clearSelectClass(g)
        }
        this.selectValue(g.attr("value"));
        if (!this.options.isLiquid) {
            g.focus()
        }
    }, clearSelectClass: function (j) {
        var h = j.closest(".item"), i = h.find("input[type='radio']").attr("name"), g = e("input[name='" + i + "']");
        g.closest(".item").removeClass("selected");
        h.addClass("selected")
    }})
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.ScreenSizeSelectionController = b.DimensionSelectionController.extend({defaults: {removeProductImageSelector: ".iphone-ambient", swapProductImageSelector: ".swap-product-color-image"}}, {init: function () {
        this.sizes = new c.List([]);
        this.uniqueSizeKeys = [];
        this.templateData = new c.Map({});
        this.templateData.attr("sizes", this.sizes);
        e(this.options.swapProductImageSelector).addClass("size");
        this._super()
    }, swapProductImage: function () {
        if (!this.productImageMarkup && e(this.options.swapProductImageSelector)) {
            this.productImageMarkup = c.compute();
            e(this.options.removeProductImageSelector).addClass("materializer").addClass("gone");
            new b.HTMLBinding(e(this.options.swapProductImageSelector), {content: this.productImageMarkup, animateHeight: false})
        }
        this.productImageMarkup(this.options.displayValues.dimensionScreensize[this.getDimensionValue()].image)
    }, canSwapImage: function () {
        return e(this.options.swapProductImageSelector).hasClass("size")
    }, getLowestPrice: function (k) {
        var j = k.price, h = this.options.displayValues.prices[j], g = h.installments || h.installmentsOffer, i = h.displayPrice || (h.currentPrice && h.currentPrice.amount);
        j = parseInt(j, 10);
        if (!this.lowestPrices) {
            this.lowestPrices = {}
        }
        if (!this.lowestPrices[k.dimensionScreensize]) {
            this.lowestPrices[k.dimensionScreensize] = {display: c.compute(i), fromdisplay: h.comparativeDisplayPrice, value: j, installments: c.compute(g), currency: h.priceCurrency, priceFeeDisclaimer: c.compute(h.priceFeeDisclaimer), isComparitivePriceDisplay: c.compute(false)}
        } else {
            if (this.lowestPrices[k.dimensionScreensize].value < j) {
                this.lowestPrices[k.dimensionScreensize].display(this.lowestPrices[k.dimensionScreensize].fromdisplay);
                this.lowestPrices[k.dimensionScreensize].isComparitivePriceDisplay(true)
            } else {
                if (this.lowestPrices[k.dimensionScreensize].value > j) {
                    this.lowestPrices[k.dimensionScreensize].value = j;
                    this.lowestPrices[k.dimensionScreensize].installments(g);
                    this.lowestPrices[k.dimensionScreensize].fromdisplay = h.comparativeDisplayPrice;
                    this.lowestPrices[k.dimensionScreensize].display(this.lowestPrices[k.dimensionScreensize].fromdisplay);
                    this.lowestPrices[k.dimensionScreensize].priceFeeDisclaimer(h.priceFeeDisclaimer);
                    this.lowestPrices[k.dimensionScreensize].isComparitivePriceDisplay(true)
                }
            }
        }
    }, processDataForTemplate: function (i) {
        var h = this.options.store.getEntry("", this.options.dimension()), g = this;
        c.each(i, function (m, j) {
            var l = false;
            if (h === m.dimensionScreensize) {
                l = true
            }
            g.getLowestPrice(m);
            var k = {prefix: g.options.prefix, size: m.dimensionScreensize, sizedisplay: g.options.displayValues.dimensionScreensize[m.dimensionScreensize].value, price: g.lowestPrices[m.dimensionScreensize].display, currency: g.lowestPrices[m.dimensionScreensize].currency, isComparitivePriceDisplay: g.lowestPrices[m.dimensionScreensize].isComparitivePriceDisplay, selected: c.compute(l), group: g.options.dimension()};
            if (e.inArray(m.dimensionScreensize, g.uniqueSizeKeys) === -1) {
                g.sizes.push(k);
                g.uniqueSizeKeys.push(m.dimensionScreensize);
                if (l) {
                    if (g.options.isiPhone) {
                        g.options.selectedDimensionValues.attr(g.options.dimension(), h)
                    }
                    g.currentSelected = k.selected;
                    g.setDimensionValue(m.dimensionScreensize);
                    g.swapProductImage()
                }
            }
        });
        if (this.options.displayValues.dimensionScreensize.title) {
            if (this.sizes.attr().length === 1) {
                this.templateData.attr("sizesectiontitle", this.options.displayValues.dimensionScreensize.title.singleVariantDisplayTitle)
            } else {
                this.templateData.attr("sizesectiontitle", this.options.displayValues.dimensionScreensize.title.multiVariantsDisplayTitle)
            }
        }
        this._super(i)
    }, selectValue: function (g) {
        if (this.options.store.attr(this.options.dimension()) === g) {
            return
        }
        this.options.store.attr(this.options.dimension(), g);
        if (this.currentSelected) {
            this.currentSelected(false)
        }
        this.currentSelected = this.sizes[e.inArray(g, this.uniqueSizeKeys)]["selected"];
        this.currentSelected(true);
        if (this.options.isiPhone) {
            this.options.selectedDimensionValues.attr(this.options.dimension(), g)
        }
        this.setDimensionValue(g);
        this.fireDataFiltration()
    }, enable: function (j, h, g, i) {
        this._super(h);
        if (i && this.sizes.attr().length === 1) {
            this.selectValue(this.sizes.attr()[0].size)
        }
    }, ".enabled input keydown": function (g, h) {
        if ((e.AsEvent.Keyboard.ArrowRight === h.keyCode) || (e.AsEvent.Keyboard.ArrowLeft === h.keyCode) || (e.AsEvent.Keyboard.Space === h.keyCode)) {
            if (this.options.locked()) {
                h.preventDefault();
                return
            }
        }
    }, fireDataFiltration: function () {
        var g = this.filterData(true) || this.products;
        if (this.currentSelected && this.canSwapImage()) {
            this.swapProductImage()
        }
    }, ".enabled input click": function (g, h) {
        if (this.options.locked()) {
            return
        }
        this.selectValue(g.val());
        if (!this.options.isLiquid) {
            g.focus()
        }
    }})
}(this, jQuery, can, as));
window.apple = window.apple || {};
window.apple.widget = window.apple.widget || {};
window.coherent = window.coherent || {};
window.coherent.KVO = window.coherent.KVO || {};
window.coherent.OverlayUtil = window.coherent.OverlayUtil || {};
Element.query = jQuery;
Element.queryAll = jQuery;
window.coherent.KVO.adaptTree = function (b) {
    return b
};
window.apple.widget.HeroGallery = function (d, e, c) {
    var b, f;
    if (d && d instanceof jQuery === false) {
        d = jQuery(d)
    }
    if (d.length === 1) {
        f = "#" + d.attr("id")
    } else {
        f = "#gallery-1"
    }
    if (c.options.hasOverlay) {
        b = new can.List(c.options.imageSet.images);
        new as.OverlayGallery("body", {galleryOptions: {images: b, gallerySelector: ".main-image", thumbnailSelector: ".thumbnails", defaultMode: "overlay", thumbnailLinkImageKey: "overlay", thumbnailSelectedClass: "active", caption: c.options.caption}, overlayTriggerSelector: ".open-overlay", contentArgs: {type: "sourceId", val: f}, close: c.options.closeText, parentElement: d})
    } else {
        b = new can.List(c.options.imageSet.images);
        return new as.Gallery(f, {images: b, gallerySelector: ".main-image", thumbnailSelector: ".thumbnail-container", thumbnailLinkImageKey: "inline", thumbnailSelectedClass: "active"})
    }
};
window.apple.widget.TabController = function (b) {
    setTimeout(function () {
        jQuery("a[onclick]", ".tab-nav").prop("onclick", "");
        return new as.TabController("#page", {tabs: b.tabs, activeClass: b.activeClass, inactiveClass: b.inactiveClass, baseMetrics: b.baseMetrics, selectedTabId: b.selectedTabId, tabSelector: "#tab-controls li", tabPanelSelector: "#tabs > div", contentContainerSelector: "#tabs", contentId: b.contentId})
    }, 100)
};
window.apple.PromoOverlay = function (c) {
    if (c instanceof jQuery === false) {
        c = jQuery(c)
    }
    var b = c.find("a").filter(function () {
        return(/overlay/g).test(this.href)
    });
    b.each(function () {
        new as.Tooltip("body", {bubbleSelector: ".promo-div", template: "{{PromoTooltip}}", contentArgs: {type: "ajax", val: this.href}, target: jQuery(this).children("img"), trigger: this, className: "PromoTooltip"})
    })
};
window.apple.HoverBar = function (c, b) {
    new as.HoverBar(c, {sectionSelector: b.sections})
};
window.apple.RetailAvailabilitySearchViewController = {};
window.apple.RetailAvailabilitySearchViewController.create = function (c, b) {
    return new as.RetailAvailabilitySearch(c, b)
};
window.apple.QuestionAnswerViewController = function (b, c) {
    return new as.QuestionAnswer(b, c)
};
window.apple.widget.TriggeredToggle = {};
window.apple.widget.TriggeredToggle.init = function (d) {
    var c = can.compute(false), f = function () {
        jQuery(d.triggers.toggle).parents(".drawer").addClass("expanded")
    }, b = function () {
        jQuery(d.target + " button").focus();
        jQuery(d.triggers.toggle).parents(".drawer").removeClass("expanded")
    }, e = function () {
        if (this.scrollPositionBeforeAnimation !== undefined) {
            window.scrollTo(0, this.scrollPositionBeforeAnimation)
        } else {
            this.scrollPositionBeforeAnimation = window.pageYOffset
        }
    };
    new as.SlideToggle(jQuery(d.target + " .content"), {trigger: d.triggers.toggle, open: c, showCallback: f, hideCallback: b, openChangeCallback: e});
    jQuery(d.triggers.noToggle).click(function (g) {
        g.preventDefault();
        c(true)
    })
};
window.coherent.Overlay = function () {
};
window.coherent.OverlayUtil.setup = function () {
};
window.onunload = function () {
};
(function (d, e, c, b, f) {
    b.TabController = c.Control.extend({defaults: {tabSelector: null, tabPanelSelector: null, contentContainerSelector: null, contentId: null, selectedTabId: null, tabs: null, activeClass: "active", inactiveClass: "inactive", transitioningClass: "transitioning", transitionEndName: null, shouldTransition: true, baseMetrics: null, idSuffix: "-link", panelToShow: c.compute(null), hasDynamicData: true, callback: c.noop}, UiStates: {active: {link: {"aria-selected": true, tabindex: 0}, panel: {"aria-hidden": false, "aria-expanded": true}}, inactive: {link: {"aria-selected": false, tabindex: -1}, panel: {"aria-hidden": true, "aria-expanded": false}}}}, {init: function () {
        var h = this, g, k, i, n;
        this.options.transitionEndName = e.AsSupport.transitionEndName;
        this.hasDynamicData = (this.options.tabs && this.options.hasDynamicData) ? true : false;
        this.setupTabLinks();
        this.createTabIdsArray();
        if (this.hasDynamicData) {
            g = this.options.selectedTabId;
            k = this.getTabPanelId(g)
        } else {
            g = this.element.find(this.options.tabSelector).eq(0).prop("id")
        }
        this.contentContainer = this.element.find(this.options.contentContainerSelector);
        if (this.hasDynamicData) {
            n = this.contentContainer.find(k);
            if (n.length === 0) {
                this.createInitialPanel(k)
            }
        }
        this.currentTabId = c.compute(g);
        this.currentTabIndex = c.compute(e.inArray(this.currentTabId(), this.tabIdsArray));
        this.currentPanelId = c.compute(this.getTabPanelId(this.currentTabId()));
        this.currentTabElem = this.element.find("#" + this.currentTabId());
        this.currentPanelElem = this.contentContainer.find("#" + this.currentPanelId());
        if (this.options.shouldTransition) {
            if (this.hasDynamicData) {
                this.setupPanelContainers()
            }
            this.tabPanels = this.element.find(this.options.tabPanelSelector);
            this.options.panelToShow(this.currentTabIndex());
            i = function () {
                h.locked = false
            };
            this.crossFader = new b.CrossFader(this.contentContainer, {elementToShow: this.options.panelToShow, elements: this.tabPanels, hiddenCallback: i, delay: c.compute(20)})
        } else {
            this.tabPanels = this.element.find(this.options.tabPanelSelector);
            this.currentPanelElem.show()
        }
        try {
            var j = this.options.tabs[this.currentTabId()], m = j.callback;
            if (m && !j.alreadyCalled) {
                if (typeof m === "string" && d[m]) {
                    d[m]()
                } else {
                    m()
                }
                j.alreadyCalled = true
            }
        } catch (l) {
        }
        this.addInitialAriaProps();
        this.addActiveAriaProps(this.currentTabElem, this.currentPanelElem);
        this.changeClasses(this.currentTabElem, true);
        this.element.css("-webkit-tap-highlight-color", "transparent")
    }, destroy: function () {
        if (this.crossFader) {
            this.crossFader.destroy()
        }
        this._super()
    }, "{tabSelector} mousedown": function (h, g) {
        g.preventDefault();
        g.stopPropagation()
    }, "{tabPanelSelector} mousedown": function (h, g) {
        g.preventDefault()
    }, "{tabSelector} click": "handleClick", "{tabSelector} keydown": "handleKeydown", "{tabPanelSelector} blur": function (h, g) {
        h.removeAttr("tabindex")
    }, handleClick: function (h, g) {
        g.preventDefault();
        g.stopPropagation();
        this.selectTab(h, g)
    }, handleKeydown: function (k, g) {
        if (this.locked) {
            return
        }
        var m = this.currentTabIndex(), j = this.tabLinks.length, h, i, l;
        if (g.keyCode === e.AsEvent.Keyboard.Return) {
            g.preventDefault();
            l = this.tabPanels.get(m);
            l.setAttribute("tabindex", "0");
            e.AsEnv.focus(l);
            return
        }
        switch (g.keyCode) {
            case e.AsEvent.Keyboard.ArrowUp:
            case e.AsEvent.Keyboard.ArrowRight:
                g.preventDefault();
                h = m + 1;
                if (h === j) {
                    h = 0
                }
                break;
            case e.AsEvent.Keyboard.ArrowDown:
            case e.AsEvent.Keyboard.ArrowLeft:
                g.preventDefault();
                h = m - 1;
                if (h < 0) {
                    h = j - 1
                }
                break;
            default:
                return
        }
        i = this.tabLinks.eq(h);
        e.AsEnv.focus(i.get(0));
        this.selectTab(i, g)
    }, createInitialPanel: function (h) {
        var g = this.contentContainer.children(), i = e("<div></div>");
        i.prop("id", h);
        g = g.detach();
        i.append(g);
        this.contentContainer.append(i)
    }, getTabPanelId: function (g) {
        if (this.hasDynamicData || this.options.tabPrefix) {
            return[this.options.contentId, g].join("_")
        } else {
            return g.replace(this.options.idSuffix, "")
        }
    }, createTabIdsArray: function () {
        var g = this;
        this.tabIdsArray = [];
        this.tabLinks.each(function () {
            g.tabIdsArray.push(e(this).prop("id"))
        })
    }, setupTabLinks: function () {
        var g = this, j, k, i, h;
        this.tabLinks = this.element.find(this.options.tabSelector);
        h = this.tabLinks.closest("ul");
        h.attr({role: "tablist"});
        this.tabLinks = this.tabLinks.map(function () {
            if (this.tagName.toLowerCase() !== "a") {
                j = e(this).find("a").get(0)
            } else {
                j = this
            }
            e(this).closest("li").attr({role: "presentation"});
            return j
        });
        this.tabLinks.each(function () {
            j = e(this);
            k = j.prop("id") || j.attr("href").slice(1) + g.options.idSuffix;
            if (k) {
                i = g.getTabPanelId(k)
            }
            j.attr({id: k, "aria-controls": i, role: "tab"})
        })
    }, addInitialAriaProps: function () {
        var h = this, g, i;
        this.tabPanels.each(function (j) {
            g = e(this);
            i = h.tabIdsArray[j];
            g.attr({"aria-labelledby": i, role: "tabpanel"})
        });
        this.tabLinks.attr("tabindex", -1);
        this.currentTabElem.attr("tabindex", 0)
    }, addActiveAriaProps: function (i, g) {
        var h = this.constructor.UiStates.active;
        this.removeActiveAriaProps();
        g.attr(h.panel);
        i.attr(h.link)
    }, removeActiveAriaProps: function () {
        var g = this.constructor.UiStates.inactive;
        this.tabPanels.attr(g.panel);
        this.tabLinks.attr(g.link)
    }, changeClasses: function (i, g) {
        var j = this.options.activeClass, h = this.options.inactiveClass;
        if (g) {
            i.removeClass(h).addClass(j);
            i.parent().removeClass(h).addClass(j)
        } else {
            i.removeClass(j).addClass(h);
            i.parent().removeClass(j).addClass(h)
        }
    }, setupPanelContainers: function () {
        var h = this, j = this.tabIdsArray.slice(), g = h.getTabPanelId(h.currentTabId()), i = h.contentContainer.find("#" + g);
        j.splice(this.currentTabIndex(), 1);
        c.each(j, function (n, m) {
            var l = document.createDocumentFragment(), k;
            if (m < h.currentTabIndex()) {
                k = document.createElement("div");
                k.id = h.getTabPanelId(n);
                k.setAttribute("aria-hidden", "true");
                k.setAttribute("aria-expanded", "false");
                l.appendChild(k);
                e(l).insertBefore(i)
            } else {
                k = document.createElement("div");
                k.id = h.getTabPanelId(n);
                k.setAttribute("aria-hidden", "true");
                k.setAttribute("aria-expanded", "false");
                l.appendChild(k);
                e(l).insertAfter(i);
                i = e(k)
            }
        })
    }, loadDynamicContent: function (l, n) {
        var i = this, k = this.options.tabs[l], m = this.getTabPanelId(l), h = this.contentContainer.find("#" + m), g, j;
        j = {willSetContent: function (o) {
            return o.body.content
        }, doneCallback: function () {
            i.activateTab(l)
        }, failCallback: function (o) {
            d.console.log(o)
        }};
        g = new b.Content(h, j);
        g.options.content({type: "ajax", val: k})
    }, selectTab: function (j, q) {
        if (j.prop("tagName").toLowerCase() !== "a") {
            j = j.find("a")
        }
        var t = this, l = j.prop("id"), k = this.getTabPanelId(l), s = this.contentContainer.find("#" + k), p = this.currentTabElem, h = this.options.baseMetrics, o = /\$\{(\w+)\}/g, g, n;
        if (this.locked) {
            return
        }
        if (this.currentTabId() === l) {
            return
        }
        if (this.options.tabWithArrows) {
            this.tabLinks.attr("tabindex", -1);
            j.attr("tabindex", 0)
        }
        n = this.hasDynamicData ? this.options.tabs[l].displayName : this.element.find("#" + l).text();
        this.locked = true;
        if (h) {
            g = h.replace(o, n);
            e.AsMetrics.reportCustomLink(null, g)
        }
        this.changeClasses(p, false);
        this.changeClasses(j, true);
        try {
            var i = this.options.tabs[l], r = i.callback;
            if (r && !i.alreadyCalled) {
                if (typeof r === "string" && d[r]) {
                    d[r]()
                } else {
                    r()
                }
                i.alreadyCalled = true
            }
        } catch (m) {
        }
        if (!s.is(":empty")) {
            this.activateTab(l)
        } else {
            this.loadDynamicContent(l)
        }
        this.options.callback(j, q)
    }, activateTab: function (h) {
        var g = this, i = this.element.find("#" + h), n = this.getTabPanelId(h), k = this.contentContainer.find("#" + n), l = this.currentPanelElem, m = this.options.transitioningClass, j = e.inArray(h, this.tabIdsArray);
        this.addActiveAriaProps(i, k);
        if (this.options.shouldTransition) {
            l.one(this.options.transitionEndName, function (o) {
                e(this).removeClass(m)
            });
            k.one(this.options.transitionEndName, function (o) {
                e(this).removeClass(m)
            });
            k.addClass(m);
            l.addClass(m);
            g.options.panelToShow(j)
        } else {
            k.show();
            l.hide();
            this.locked = false
        }
        if (this.hasDynamicData) {
            this.contentContainer.height(k.height())
        }
        this.currentTabId(h);
        this.currentTabIndex(j);
        this.currentPanelId(this.getTabPanelId(this.currentTabId()));
        this.currentTabElem = i;
        this.currentPanelElem = k
    }})
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.MultiContentOverlay = b.WebOverlay.extend("as.MultiContentOverlay", {defaults: {overlayTriggerSelector: null, viewportSelector: 'meta[name="viewport"]', viewportHTML: '<meta name="viewport" />', width: c.compute(false), height: c.compute(false), className: "tab-overlay", widthDelegate: function (g) {
        return e(d).width()
    }, heightDelegate: function (i) {
        var g = e(d).height(), k = e.AsSupport.isIpad && Math.floor(e.AsSupport.iosVersion) === 7, h = d.innerWidth > d.innerHeight, j = Math.max(document.documentElement.clientWidth / d.innerWidth, 1);
        if (k && h) {
            e(d).scrollTop(0);
            g = d.innerHeight * j
        }
        return g
    }, forcePreventDoubleTap: true, tabControllerOptions: {}}}, {setup: function (h, g) {
        if (g.overlayTriggerSelector) {
            g.overlayTriggerElement = e(g.overlayTriggerSelector)
        }
        this._super(h, g)
    }, init: function () {
        if (this.isDoubleTapPrevented()) {
            this.initForcePreventDoubleTap()
        }
        this._super()
    }, isDoubleTapPrevented: function () {
        var g = Math.floor(e.AsSupport.iosVersion) >= 7;
        return this.options.forcePreventDoubleTap && g
    }, "{overlayTriggerElement} click": "openOverlay", "{window} touchend": "handleTouchend", "{window} touchstart": "handleTouchstart", handleTouchstart: function (g, h) {
        if (this.isDoubleTapPrevented() && this.options.isOpen()) {
            if (this.doubleTapTimer) {
                clearTimeout(this.doubleTapTimer)
            }
            this.isMultiTouch = h.originalEvent.touches && h.originalEvent.touches.length > 1;
            this.enableUserScalable()
        }
    }, handleTouchend: function (g, h) {
        if (this.isDoubleTapPrevented() && this.options.isOpen() && !this.isMultiTouch) {
            if (this.doubleTapTimer) {
                clearTimeout(this.doubleTapTimer)
            }
            this.disableUserScalable();
            this.doubleTapTimer = setTimeout(c.proxy(this.enableUserScalable, this), 400)
        }
    }, initForcePreventDoubleTap: function () {
        this.viewportElement = e(this.options.viewportSelector).length > 0 ? e(this.options.viewportSelector) : e(this.options.viewportHTML).appendTo("head");
        this.originalViewportValue = this.viewportElement.attr("content");
        this.zoomDisabledViewportValue = this.originalViewportValue + ",user-scalable=no"
    }, disableUserScalable: function () {
        this.viewportElement.attr("content", this.zoomDisabledViewportValue)
    }, enableUserScalable: function () {
        this.viewportElement.attr("content", this.originalViewportValue)
    }, preventDoubleTap: function (g, h) {
        if (this.options.isOpen()) {
            h.preventDefault()
        }
    }, "{window} resize": function () {
        this.options.width(this.options.widthDelegate());
        this.options.height(this.options.heightDelegate())
    }, openOverlay: function () {
        this.scrollPosition = e(d).scrollTop();
        e("body").addClass("hide");
        setTimeout(c.proxy(function () {
            this.position();
            this.options.isOpen(true)
        }, this), 1)
    }, close: function () {
        this._super();
        this.element.addClass("gone");
        e("body").removeClass("hide");
        e(d).scrollTop(this.scrollPosition)
    }, handleContentChange: function (j, g, i, h) {
        this.isTabControllerCreated = false;
        this._super(j, g, i, h)
    }, onOpen: function (g) {
        if (!this.isTabControllerCreated) {
            this.tabController = new b.TabController(this.element, this.options.tabControllerOptions);
            this.isTabControllerCreated = true
        }
        this._super(g)
    }})
}(this, jQuery, can, as));
(function (h, f, j, e, d) {
    var g = {};
    e.Keyframe = j.Component.extend({tag: "keyframe", scope: {"data-id": "@", "data-animation": "@", "data-animation-ie8-static": "@"}, events: {inserted: function () {
        this.currentFrame = -1;
        this.nextTimer = null;
        this.frames = [];
        var m = function (v, w) {
            var u = r("data-" + v);
            return u ? f.trim(u).split(/[,\s]+/) : [w]
        };
        var s = f(this.element.children("style").get(0));
        var r = f.proxy(this.scope.attr, this.scope);
        var t = r("data-animation-ie8-static");
        if (t && f.AsSupport.isIe && f.AsSupport.ieVersion <= 8) {
            this.element.css(this.cssToObj(t))
        } else {
            if (f.AsSupport.animation) {
                var l = function (u) {
                    var v = f.AsSupport.cssPropertyName(u).replace(/[A-Z].*$/, "");
                    return v === u ? "" : "-" + v + "-"
                };
                var k = s.html();
                k = k.replace(/@keyframes/g, "@" + l("animation") + "keyframes");
                k = k.replace(/transform:/g, l("transform") + "transform:");
                s.html(k);
                this.element.css("animation", r("data-animation"))
            } else {
                var q = this.keyframesToObj(r("data-animation"), s.html());
                var o = this.element;
                var n = f.proxy(this.animateKeyframe, this);
                for (var p = 0; p < q.length; p += 1) {
                    n(q[p], true)
                }
                this.element.css("animation", "")
            }
        }
    }, animateKeyframe: function (m, o) {
        var n = this.element;
        var l = f.proxy(this.cssObjToSupported, this);
        j.each(m.frames, function (q) {
            if (q.percent === 0) {
                n.css(l(q.css))
            } else {
                n.animate(l(q.css), {duration: q.duration, queue: m.name})
            }
        });
        n.dequeue(m.name);
        var p = n.promise(m.name);
        if (o) {
            if (!(m.time in g)) {
                g[m.time] = {promises: [], callbacks: []}
            }
            g[m.time].promises.push(p);
            g[m.time].callbacks.push(f.proxy(this.animateKeyframe, this, m, o));
            var k = g[m.time].callbacks.length;
            f.when.apply(f, g[m.time].promises).then(function () {
                if (k === g[m.time].callbacks.length) {
                    var q = g[m.time].callbacks;
                    delete g[m.time];
                    for (var r = 0; r < k; r += 1) {
                        q[r]()
                    }
                }
            })
        }
        return p
    }, cssObjToSupported: function b(l) {
        var k = {};
        j.each(l, function (o, q) {
            if (q === "transform") {
                var n = o.match(/translateX\(\s*([^\s,\)]*)/);
                var m = o.match(/translateY\(\s*([^\s,\)]*)/);
                var p = o.match(/translate\dD\(\s*([^\s,]*)\s*,\s*([^\s,\)]*)/);
                if (n) {
                    k.left = n[1]
                } else {
                    if (m) {
                        k.top = m[1]
                    } else {
                        if (p) {
                            k.left = p[1];
                            k.top = p[2]
                        }
                    }
                }
            } else {
                k[q] = o
            }
        });
        return k
    }, cssToObj: function c(l) {
        var k = {};
        j.each(f.trim(l).split(/\s*;\s*/), function (m) {
            if (m && m.indexOf(":") !== -1) {
                m = m.split(/:\s*/);
                k[m[0]] = m[1]
            }
        });
        return k
    }, keyframesToObj: function i(m, p) {
        var q = /@keyframes\s*([^\s]*)\s*\{|([\d\.]*)%\s*\{([^\}]*)\}/g;
        var o = f.proxy(this.cssToObj, this);
        var k = [];
        var l = null;
        var n = 0;
        j.each(f.trim(m).split(/,\s*/), function (r) {
            r = r.split(/\s+/);
            k.push({name: r[0], time: parseInt(r[1], 10), timing: r[2], iteration: r[4], frames: []})
        });
        p.replace(q, function (v, r, t, u) {
            if (r) {
                n = 0;
                for (var s = 0; s < k.length; s += 1) {
                    l = k[s].name === r ? k[s] : l
                }
            } else {
                if (l) {
                    t = parseFloat(t, 10) / 100;
                    l.frames.push({duration: t * l.time - n, percent: t, css: o(u)});
                    n = t * l.time
                }
            }
        });
        return k
    }}})
})(this, jQuery, can, as);
(function (d, e, c, b, f) {
    b.InstallmentOverlay = b.WebOverlay.extend({init: function () {
        this.options.contentSelector = ".content";
        this.options.linkSelector = ".installment-overlay a";
        this.options.learnmorelink = ".learn-more-installments a";
        this.currentHref = null;
        this.options.isAriaDialog(true);
        this.on();
        this._super()
    }, "{document} {linkSelector} click": function (h, i) {
        i.preventDefault();
        if (h.attr("href")) {
            var g = h.attr("href");
            this.urlChanged(g)
        }
        e.AsMetrics.fireMicroEvent({action: "Learn More", feature: "", eVar: "eVar6"})
    }, "{document} {learnmorelink} click": function (g, h) {
        this.options.isOpen(false)
    }, "{document}{linkSelector} keydown": function (h, i) {
        if (i.keyCode === 32 && h.attr("href")) {
            i.preventDefault();
            var g = h.attr("href");
            this.urlChanged(g)
        }
    }, urlChanged: function (g) {
        var h = g;
        if (this.currentHref !== g) {
            this.options.contentArgs = {type: "ajax", val: h};
            this.currentHref = g;
            if (!this.options.isOpen()) {
                this.options.isOpen(true)
            }
        } else {
            this.open()
        }
    }, handleContentChange: function (l, o, g, n) {
        var h;
        var j = 9999;
        var i;
        var k;
        var m;
        this.isContentChanged = true;
        if ((this.shouldSizeDynamically.width || this.shouldSizeDynamically.height) && g) {
            h = this.element.clone().css({maxWidth: j, position: "absolute"}).offset({left: -j});
            h.find(".gone").addBack().removeClass("gone");
            k = new b.Content(h, {targetSelector: this.options.contentSelector});
            m = this.content.options.content();
            k.options.content({type: m && m.type === "text" ? "text" : "html", val: g});
            i = h.find(this.options.contentSelector).removeAttr("style");
            h.appendTo(this.element.parent());
            this.setMargins(i);
            if (this.shouldSizeDynamically.width) {
                this.options.width(this.options.widthDelegate(i))
            }
            if (this.shouldSizeDynamically.height) {
                this.options.height(this.options.heightDelegate(i))
            }
            h.remove()
        }
    }, focusForOpen: function () {
        if (this.options.autoFocus()) {
            this.overlay.find(".close").attr("tabindex", 0);
            this.overlay.find(".learn-more-installments a").attr("tabindex", 0);
            this.overlay.attr("tabindex", 0);
            this.overlay.focus()
        }
    }, setMargins: function (h) {
        var j = h.find(".col-2").first();
        var g = h.find(".col-2").length;
        var k = h.find(".col-3").first();
        var i = g * 40;
        j.css("margin-top", -i + "px");
        k.css("margin-top", -i + "px");
        h.find(".columns-3").css("height", i + "px");
        h.css("height", "auto");
        h.css("width", "auto")
    }, onOpen: function (g) {
        if (g) {
            this.setMargins(e(this.options.contentSelector))
        }
    }, })
}(this, jQuery, can, as));
(function (d, e, c, b, f) {
    b.iPhoneSelectionController = c.Control.extend({defaults: {requestData: new c.Map({}), preSelectedData: new c.Map({}), dimensions: new c.Map({}), dimensionSelector: null, carrierTemplate: null, isiPhone: true, disabledLinks: ".disabled a", accessoriesOptions: c.compute(), accessoriesTiles: ".iphone_sim_card label", addOnResponse: c.compute(), addOnContainer: "#product-addons-primary", activateAccessories: c.compute(), carrierList: [], minPriceList: []}}, {init: function () {
        this.ProductSelectionController = new b.ProductSelectionController(this.element, {rail: this.options.rail, stickyRail: this.options.stickyRail, requestData: this.options.requestData, preSelectedData: this.options.preSelectedData, dimensions: this.options.dimensions, isiPhone: this.options.isiPhone, carrierTemplate: this.options.carrierTemplate, accessories: (e("#sim_cards").length !== 0) ? true : false, addOnResponse: this.options.addOnResponse, activateAccessories: this.options.activateAccessories, isLiquid: this.options.isLiquid, actionTrayId: this.options.actionTrayId, actionTrayTemplate: this.options.actionTrayTemplate, titleBoxTemplate: this.options.titleBoxTemplate})
    }, "{dimensions} change": function (m, l, k, n, h, i) {
        if (this.options.dimensionSelector) {
            var g = this.options.dimensionSelector;
            var j = g.replace(/\{.*\}/, "");
            m.each(function (p, o) {
                o = o.replace(/^(dimension)?([^\.]*).*$/, "$2");
                o = o.charAt(0).toLowerCase() + o.substring(1);
                p = p.attr("set.value");
                p = p ? "." + (o + "-" + p).replace(/[\/\.]/g, "") : "";
                g = g.replace("{" + o + "}", p)
            });
            g = g.replace(/\{.*\}/, "");
            e(j).addClass("gone");
            e(g).first().removeClass("gone")
        }
    }, addData: function (g) {
        this.data = g;
        this.getCarriers(g);
        this.ProductSelectionController.addData(g);
        if (e("#more-info-link").css("display") === "none") {
            e("#more-info-link").css("display", "block")
        }
    }, "{preSelectedData} change": function (l, k, g, j, i, h) {
        this.ProductSelectionController.options.preSelectedData.attr(g, i);
        this.isUniqueUrl = true
    }, getCarriers: function (l) {
        var j = [], k = this.data.displayValues.carrierPolicyPart, g = this;
        for (var h in k) {
            g.options.carrierList.push(h)
        }
        c.each(l.products, function (n, m) {
            var i = n.carrierModel ? n.carrierModel : n.carrierPolicyPart;
            j.push(i)
        });
        e.unique(j);
        if (j.length === 1) {
            this.ProductSelectionController.options.singleCarrierPolicy = j[0];
            this.ProductSelectionController.options.singleUrl = this.getSingleUrl(l.actionUrl)
        }
    }, getSingleUrl: function (h) {
        for (var g in h) {
            return h[g]
        }
    }, "{accessoriesOptions} change": function (i, j, h, g) {
        if (h) {
            this.accessories = new b.Equalizer(h.container, {selector: h.items, grouping: true});
            this.accessoriesContainer = e(h.container);
            this.ProductSelectionController.options.selectedAccessory = this.ProductSelectionController.store.attr("ao.iphone_sim_card") ? this.ProductSelectionController.store.attr("ao.iphone_sim_card") : null;
            this.accessoriesContainer.find('input[type="radio"][value="' + this.ProductSelectionController.options.selectedAccessory + '"]').attr("checked", true);
            if (!this.isUniqueUrl && typeof this.ProductSelectionController.store.attr("ao.iphone_sim_card") === "undefined") {
                this.toggleAccessories(this.accessoriesContainer, true)
            }
        }
    }, toggleAccessories: function (g, i, h) {
        g.toggleClass("disabled").toggleClass("enabled");
        g.find('input[type="radio"]').prop("disabled", i)
    }, "{activateAccessories} change": function (i, j, h, g) {
        if (this.accessoriesContainer) {
            this.accessoriesContainer.removeClass("disabled").addClass("enabled");
            this.accessoriesContainer.find('input[type="radio"]').prop("disabled", false)
        }
    }, "#sim_cards-content input change": function (h, j) {
        var i = h.closest(".item"), k = i.find('input[type="radio"]'), g = k.val();
        this.ProductSelectionController.options.selectedAccessory = g;
        this.ProductSelectionController.store.attr(k.attr("name"), g);
        this.ProductSelectionController.checkForProduct()
    }, "{addOnResponse} change": function (j, k, i, h) {
        var g = e(this.options.addOnContainer);
        if (i === null) {
            g.hide()
        } else {
            g.show().find(".box-content").html(i.list)
        }
    }, "a[data-open] click": "openInfoOverlay", "a[data-open] keydown": function (g, h) {
        if (h.keyCode === e.AsEvent.Keyboard.Space) {
            this.openInfoOverlay(g, h)
        }
    }, openInfoOverlay: function (j, k) {
        k.preventDefault();
        k.stopPropagation();
        if (j.closest(".disabled").length) {
            return false
        }
        var g = j.attr("href"), h = this.overlays && this.overlays[g], i = j.attr("data-open");
        if (!h) {
            h = new b.WebOverlay(document, {contentArgs: {type: i === "overlay" ? "ajax" : "html", val: i === "overlay" ? g : e(g)[0].outerHTML}, className: this.options.isLiquid ? "overlay-liquid" : "", isAriaDialog: c.compute(true)})
        }
        h.open()
    }, "{disabledLinks} click": function (g, h) {
        h.preventDefault();
        h.stopPropagation()
    }})
}(this, jQuery, can, as));
require = function a(h, m, l) {
    function k(e, d) {
        if (!m[e]) {
            if (!h[e]) {
                var c = "function" == typeof require && require;
                if (!d && c) {
                    return c(e, !0)
                }
                if (j) {
                    return j(e, !0)
                }
                throw new Error("Cannot find module '" + e + "'")
            }
            var b = m[e] = {exports: {}};
            h[e][0].call(b.exports, function (f) {
                var g = h[e][1][f];
                return k(g ? g : f)
            }, b, b.exports, a, h, m, l)
        }
        return m[e].exports
    }

    for (var j = "function" == typeof require && require, i = 0; i < l.length; i++) {
        k(l[i])
    }
    return k
}({1: [function (d, c) {
    c.exports = {ambient: [
        {platform: "desktop", browser: "safari", type: "h264"},
        {platform: "desktop", browser: "chrome", type: "h264"},
        {platform: "desktop", browser: "firefox", type: "flow"},
        {platform: "desktop", browser: "ie", browser_version: 9, type: "h264"},
        {platform: "tablet", browser: "safari mobile", type: "flow"},
        {platform: "handheld", browser: "safari mobile", type: "flow"}
    ], scrollable: [
        {platform: "desktop", browser: "safari", type: "h264"},
        {platform: "desktop", browser: "chrome", type: "h264"},
        {platform: "desktop", browser: "firefox", type: "flow"},
        {platform: "desktop", browser: "ie", browser_version: 9, type: "h264"},
        {platform: "tablet", browser: "safari mobile", browser_version: 8, type: "flow"},
        {platform: "handheld", browser: "safari mobile", browser_version: 8, type: "flow"}
    ], scrubbable: [
        {platform: "desktop", browser: "safari", type: "h264"},
        {platform: "desktop", browser: "chrome", type: "h264"},
        {platform: "desktop", browser: "firefox", type: "flow"},
        {platform: "desktop", browser: "ie", browser_version: 9, type: "h264"},
        {platform: "tablet", browser: "safari mobile", type: "flow"},
        {platform: "handheld", browser: "safari mobile", type: "flow"}
    ], sizes: [
        {retina: !0, min_viewport_width: 1024, type: "large_2x"},
        {retina: !1, min_viewport_width: 1024, type: "large"},
        {retina: !0, min_viewport_width: 768, type: "medium_2x"},
        {retina: !1, min_viewport_width: 768, type: "medium"},
        {min_viewport_width: 0, type: "xsmall_2x"}
    ]}
}, {}], 2: [function (f, e) {
    var h = f("./ac-ajax/Ajax"), g = f("./ac-ajax/Request");
    e.exports = new h, e.exports.Ajax = h, e.exports.Request = g
}, {"./ac-ajax/Ajax": 3, "./ac-ajax/Request": 4}], 3: [function (f, e) {
    var h = f("./Request"), g = function () {
    };
    g._Request = h, g.prototype = {_defaults: {timeout: 5000}, _extend: function () {
        for (var d = 1; d < arguments.length; d++) {
            for (var c in arguments[d]) {
                arguments[d].hasOwnProperty(c) && (arguments[0][c] = arguments[d][c])
            }
        }
        return arguments[0]
    }, _getOptions: function (d, c) {
        return this._extend({}, this._defaults, c, d)
    }, create: function (b) {
        return new h(b)
    }, get: function (b) {
        return b = this._getOptions({method: "get"}, b), this.create(b).send()
    }, getJSON: function (b) {
        return this.get(b).then(function (c) {
            return JSON.parse(c.responseText)
        })
    }, head: function (b) {
        return b = this._getOptions({method: "head"}, b), this.create(b).send()
    }, post: function (b) {
        return b = this._getOptions({method: "post"}, b), this.create(b).send()
    }}, e.exports = g
}, {"./Request": 4}], 4: [function (e, d) {
    var f = function (b) {
        this._initialize(b)
    };
    f.prototype = {_addReadyStateChangeHandler: function () {
        this.xhr.onreadystatechange = function () {
            4 === this.xhr.readyState && (clearTimeout(this._timeout), this.xhr.status >= 200 && this.xhr.status < 300 ? this.resolve(this.xhr) : this.reject(this.xhr))
        }.bind(this)
    }, _getPromise: function () {
        this.promise = new Promise(function (g, c) {
            this.resolve = g, this.reject = c
        }.bind(this))
    }, _initialize: function (h) {
        var g = this._validateConfiguration(h);
        if (g) {
            throw g
        }
        this._configuration = h;
        var i = this._configuration.method.toUpperCase();
        this.xhr = new XMLHttpRequest, this._getPromise(), this.xhr.open(i, this._configuration.url), this._setRequestHeaders(h.headers), this._addReadyStateChangeHandler()
    }, _sendXHR: function () {
        this.xhr && (this._configuration && this._configuration.data ? this.xhr.send(this._configuration.data) : this.xhr.send())
    }, _setRequestHeaders: function (b) {
        b && b.forEach(function (c) {
            this.xhr.setRequestHeader(c.name, c.value)
        }, this)
    }, _setTimeout: function (b) {
        b || (this._configuration && this._configuration.timeout ? b = this._configuration.timeout : (clearTimeout(this._timeout), this._timeout = null)), null !== this._timeout && clearTimeout(this._timeout), b > 0 && (this._timeout = setTimeout(function () {
            this.xhr.abort(), this.reject()
        }.bind(this), b))
    }, _timeout: null, _validateConfiguration: function (h) {
        if (!h) {
            return"Must provide a configuration object"
        }
        var g = [], i = h.headers;
        if (h.url || g.push("Must provide a url"), h.method || g.push("Must provide a method"), i) {
            if (!Array.isArray(i)) {
                return"Must provide an array of headers"
            }
            this._validateHeaders(i, g)
        }
        return g.join(", ")
    }, _validateHeaders: function (h, g) {
        for (var j = 0, i = h.length; i > j; j++) {
            if (!h[j].hasOwnProperty("name") || !h[j].hasOwnProperty("value")) {
                g.push("Must provide a name and value key for all headers");
                break
            }
        }
    }, promise: null, reject: null, resolve: null, send: function () {
        return this._setTimeout(), this._sendXHR(), this.promise
    }, xhr: null}, d.exports = f
}, {}], 5: [function (V, U, T) {
    function S(f, e) {
        if (0 == f[e].length) {
            return f[e] = {}
        }
        var h = {};
        for (var g in f[e]) {
            F.call(f[e], g) && (h[g] = f[e][g])
        }
        return f[e] = h, h
    }

    function R(e, d, l, k) {
        var j = e.shift();
        if (!F.call(Object.prototype, l)) {
            if (j) {
                var i = d[l] = d[l] || [];
                "]" == j ? D(i) ? "" != k && i.push(k) : "object" == typeof i ? i[C(i).length] = k : i = d[l] = [d[l], k] : ~E(j, "]") ? (j = j.substr(0, j.length - 1), !z.test(j) && D(i) && (i = S(d, l)), R(e, i, j, k)) : (!z.test(j) && D(i) && (i = S(d, l)), R(e, i, j, k))
            } else {
                D(d[l]) ? d[l].push(k) : d[l] = "object" == typeof d[l] ? k : "undefined" == typeof d[l] ? k : [d[l], k]
            }
        }
    }

    function Q(h, e, l) {
        if (~E(e, "]")) {
            var k = e.split("[");
            k.length;
            R(k, h, "base", l)
        } else {
            if (!z.test(e) && D(h.base)) {
                var j = {};
                for (var i in h.base) {
                    j[i] = h.base[i]
                }
                h.base = j
            }
            J(h.base, e, l)
        }
        return h
    }

    function P(f) {
        if ("object" != typeof f) {
            return f
        }
        if (D(f)) {
            var e = [];
            for (var h in f) {
                F.call(f, h) && e.push(f[h])
            }
            return e
        }
        for (var g in f) {
            f[g] = P(f[g])
        }
        return f
    }

    function O(d) {
        var c = {base: {}};
        return B(C(d), function (b) {
            Q(c, b, d[b])
        }), P(c.base)
    }

    function N(d) {
        var c = A(String(d).split("&"),function (h, f) {
            var l = E(f, "="), k = I(f), j = f.substr(0, k || l), i = f.substr(k || l, f.length), i = i.substr(E(i, "=") + 1, i.length);
            return"" == j && (j = f, i = ""), "" == j ? h : Q(h, H(j), H(i))
        }, {base: {}}).base;
        return P(c)
    }

    function M(d, c) {
        if (!c) {
            throw new TypeError("stringify expects an object")
        }
        return c + "=" + encodeURIComponent(d)
    }

    function L(f, e) {
        var h = [];
        if (!e) {
            throw new TypeError("stringify expects an object")
        }
        for (var g = 0; g < f.length; g++) {
            h.push(y(f[g], e + "[" + g + "]"))
        }
        return h.join("&")
    }

    function K(i, h) {
        for (var n, m = [], l = C(i), k = 0, j = l.length; j > k; ++k) {
            n = l[k], "" != n && m.push(null == i[n] ? encodeURIComponent(n) + "=" : y(i[n], h ? h + "[" + encodeURIComponent(n) + "]" : encodeURIComponent(n)))
        }
        return m.join("&")
    }

    function J(f, e, h) {
        var g = f[e];
        F.call(Object.prototype, e) || (void 0 === g ? f[e] = h : D(g) ? g.push(h) : f[e] = [g, h])
    }

    function I(g) {
        for (var f, j, i = g.length, h = 0; i > h; ++h) {
            if (j = g[h], "]" == j && (f = !1), "[" == j && (f = !0), "=" == j && !f) {
                return h
            }
        }
    }

    function H(d) {
        try {
            return decodeURIComponent(d.replace(/\+/g, " "))
        } catch (c) {
            return d
        }
    }

    var G = Object.prototype.toString, F = Object.prototype.hasOwnProperty, E = "function" == typeof Array.prototype.indexOf ? function (d, c) {
        return d.indexOf(c)
    } : function (e, d) {
        for (var f = 0; f < e.length; f++) {
            if (e[f] === d) {
                return f
            }
        }
        return -1
    }, D = Array.isArray || function (b) {
        return"[object Array]" == G.call(b)
    }, C = Object.keys || function (e) {
        var d = [];
        for (var f in e) {
            e.hasOwnProperty(f) && d.push(f)
        }
        return d
    }, B = "function" == typeof Array.prototype.forEach ? function (d, c) {
        return d.forEach(c)
    } : function (e, d) {
        for (var f = 0; f < e.length; f++) {
            d(e[f])
        }
    }, A = function (g, f, j) {
        if ("function" == typeof g.reduce) {
            return g.reduce(f, j)
        }
        for (var i = j, h = 0; h < g.length; h++) {
            i = f(i, g[h])
        }
        return i
    }, z = /^[0-9]+$/;
    T.parse = function (b) {
        return null == b || "" == b ? {} : "object" == typeof b ? O(b) : N(b)
    };
    var y = T.stringify = function (d, c) {
        return D(d) ? L(d, c) : "[object Object]" == G.call(d) ? K(d, c) : "string" == typeof d ? M(d, c) : c + "=" + encodeURIComponent(String(d))
    }
}, {}], 6: [function (h, g) {
    var l = h("./ac-base/globals"), k = l.window.AC = l.window.AC || {}, j = h("./ac-base/Environment"), i = h("./ac-base/Element/onDOMReady");
    j.Browser.IE && (j.Browser.IE.documentMode < 9 && h("./ac-base/shims/html5.js")(), j.Browser.IE.documentMode < 8 && i(h("./ac-base/shims/ie/nonClickableImageBooster"))), "undefined" != typeof define && (k.define = define, k.require = h), k.adler32 = h("./ac-base/adler32"), k.Ajax = h("./ac-base/Ajax"), k.Array = h("./ac-base/Array"), k.bindEventListeners = h("./ac-base/bindEventListeners"), k.Canvas = h("./ac-base/Canvas"), k.Class = h("./ac-base/Class"), k.Date = h("./ac-base/Date"), k.DeferredQueue = h("./ac-base/DeferredQueue"), k.EasingFunctions = h("./ac-base/EasingFunctions"), k.Element = h("./ac-base/Element"), k.Environment = j, k.Event = h("./ac-base/Event"), k.Function = h("./ac-base/Function"), k.History = h("./ac-base/History"), k.log = h("./ac-base/log"), k.namespace = h("./ac-base/namespace"), k.NotificationCenter = h("./ac-base/NotificationCenter"), k.Object = h("./ac-base/Object"), k.onDOMReady = i, k.onWindowLoad = h("./ac-base/Element/onWindowLoad"), k.queryParameters = h("./ac-base/queryParameters"), k.RegExp = h("./ac-base/RegExp"), k.Registry = h("./ac-base/Registry"), k.String = h("./ac-base/String"), k.Synthesize = h("./ac-base/Synthesize"), k.uid = h("./ac-base/uid"), k.Viewport = h("./ac-base/Viewport"), k.windowHasLoaded = !1, k.Element.addEventListener(l.window, "load", function () {
        k.windowHasLoaded = !0
    }), g.exports = k
}, {"./ac-base/Ajax": 7, "./ac-base/Array": 11, "./ac-base/Canvas": 12, "./ac-base/Class": 13, "./ac-base/Date": 14, "./ac-base/DeferredQueue": 15, "./ac-base/EasingFunctions": 16, "./ac-base/Element": 17, "./ac-base/Element/onDOMReady": 20, "./ac-base/Element/onWindowLoad": 21, "./ac-base/Environment": 23, "./ac-base/Event": 29, "./ac-base/Function": 30, "./ac-base/History": 31, "./ac-base/NotificationCenter": 32, "./ac-base/Object": 33, "./ac-base/RegExp": 34, "./ac-base/Registry": 35, "./ac-base/String": 37, "./ac-base/Synthesize": 38, "./ac-base/Viewport": 39, "./ac-base/adler32": 40, "./ac-base/bindEventListeners": 41, "./ac-base/globals": 42, "./ac-base/log": 43, "./ac-base/namespace": 44, "./ac-base/queryParameters": 45, "./ac-base/shims/html5.js": 46, "./ac-base/shims/ie/nonClickableImageBooster": 50, "./ac-base/uid": 51}], 7: [function (e, d) {
    var f = {};
    e("./Ajax/ajax-tracker")(f), e("./Ajax/ajax-response")(f), e("./Ajax/ajax-request")(f), f.getTransport = function () {
        return new XMLHttpRequest
    }, f.checkURL = function (g, c) {
        var i = f.__validateArguments(g, c);
        if (i) {
            throw i
        }
        var h = f.getTransport();
        this.__handleReadyStateChange(h, c), h.open("HEAD", g, !0), h.send(null)
    }, f.__handleReadyStateChange = function (g, c) {
        g.onreadystatechange = function () {
            4 === this.readyState && "function" == typeof c && c(200 === this.status)
        }
    }, f.__validateArguments = function (h, g) {
        var i;
        return h || (i = "Must provide a url"), g || (i = "Must provide a callback"), h || g || (i = "Must provide a url and callback"), i
    }, d.exports = f
}, {"./Ajax/ajax-request": 8, "./Ajax/ajax-response": 9, "./Ajax/ajax-tracker": 10}], 8: [function (f, e) {
    var h = f("../Class"), g = f("../Object");
    e.exports = function (d) {
        var c = h();
        c.prototype = {__defaultOptions: {method: "get"}, initialize: function (i, j) {
            this._transport = d.getTransport(), this._mimeTypeOverride = null, this._options = null, g.synthesize(this), this.setOptions(g.extend(g.clone(this.__defaultOptions), j || {})), d.AjaxTracker.sharedInstance().addResponder(this), this.__configureTransport(i)
        }, __configureTransport: function (b) {
            this.transport().onreadystatechange = this.__handleTransportStateChange.bind(this), this.transport().open(this.options().method, b, !0), this.transport().setRequestHeader("Content-Type", this.options().contentType), this.transport().send(null)
        }, __handleTransportStateChange: function () {
            if (4 === this.transport().readyState) {
                new d.AjaxResponse(this)
            }
        }, overrideMimeType: function (b) {
            this._mimeTypeOverride = b, this.transport().overrideMimeType && this.transport().overrideMimeType(b)
        }, _overrideMimeType: null}, d.AjaxRequest = c
    }
}, {"../Class": 13, "../Object": 33}], 9: [function (e, d) {
    var f = e("../Class");
    d.exports = function (g) {
        var c = f();
        c.prototype = {_request: null, _transport: null, initialize: function (h) {
            this._transport = h.transport(), this._request = h;
            var j = !1, i = 4 === this._transport.readyState;
            i && (this.__triggerCallbacks(), j = !0), j && (this._request.options().onComplete && this._request.options().onComplete(this), g.AjaxTracker.sharedInstance().removeResponder(h))
        }, __triggerCallbacks: function () {
            var i = this._transport.status, h = i >= 200 && 300 > i, k = i >= 400 && 500 > i, j = i >= 500 && 600 > i || 0 === i;
            h && this._request.options().onSuccess && this._request.options().onSuccess(this), k && this._request.options().onFailure && this._request.options().onFailure(this), j && this._request.options().onError && this._request.options().onError(this)
        }, responseText: function () {
            return this._transport.responseText
        }, responseXML: function () {
            return this._transport.responseXML
        }, responseJSON: function () {
            return JSON.parse(this._transport.responseText)
        }}, g.AjaxResponse = c
    }
}, {"../Class": 13}], 10: [function (e, d) {
    var f = e("../Class");
    d.exports = function (g) {
        var c = f();
        c.prototype = {__responders: [], initialize: function () {
        }, addResponder: function (b) {
            return this.__responders.push(b), this.__responders
        }, removeResponder: function (i) {
            var h = this.__responders.length;
            this.__responders = this.__responders.filter(function (k) {
                return k !== i
            });
            var j = this.__responders.length;
            return h > j ? !0 : !1
        }}, g.AjaxTracker = c
    }
}, {"../Class": 13}], 11: [function (f, e) {
    var h = f("./Environment/Browser"), g = {};
    g.toArray = function (b) {
        return Array.prototype.slice.call(b)
    }, g.flatten = function (i) {
        var d = [], j = function (b) {
            Array.isArray(b) ? b.forEach(j) : d.push(b)
        };
        return i.forEach(j), d
    }, g.without = function (j, i) {
        var m, l = j.indexOf(i), k = j.length;
        return l >= 0 ? (l === k - 1 ? m = j.slice(0, k - 1) : 0 === l ? m = j.slice(1) : (m = j.slice(0, l), m = m.concat(j.slice(l + 1))), m) : j
    }, "IE" === h.name && f("./shims/ie/Array")(g, h), e.exports = g
}, {"./Environment/Browser": 24, "./shims/ie/Array": 47}], 12: [function (f, e) {
    var h = f("./Element"), g = {};
    g.imageDataFromFile = function (i, d) {
        if ("function" != typeof d) {
            throw new TypeError("Need callback method to call when imageData is retrieved.")
        }
        if ("string" != typeof i || "" === i) {
            throw new TypeError("Src for imageData must be an Image Node with a src attribute or a string.")
        }
        var j = new Image;
        j.onload = function () {
            d(g.imageDataFromNode(j))
        }, j.src = i
    }, g.imageDataFromNode = function (i) {
        if (!h.isElement(i) || "null" === i.getAttribute("src") || 0 === i.width) {
            throw new TypeError("Source node must be an IMG tag and must have already loaded.")
        }
        var c, k = document.createElement("canvas"), j = k.getContext("2d");
        return k.width = i.width, k.height = i.height, j.drawImage(i, 0, 0), c = j.getImageData(0, 0, i.width, i.height)
    }, e.exports = g
}, {"./Element": 17}], 13: [function (i, h) {
    function n() {
        var d, c = l.toArray(arguments), o = "function" == typeof c[0] ? c.shift() : null, g = c.shift() || {}, e = function () {
            var p, f;
            p = "function" == typeof this.initialize && e.__shouldInitialize !== !1 ? this.initialize.apply(this, arguments) : !1, p === n.Invalidate && (f = function () {
                try {
                    this && this._parentClass && this._parentClass._sharedInstance === this && (this._parentClass._sharedInstance = null)
                } catch (b) {
                    throw b
                }
            }, window.setTimeout(f.bind(this), 200))
        };
        return e.__superclass = o, o ? (d = o.__superclass ? n(o.__superclass, o.prototype) : n(o.prototype), d.__shouldInitialize = !1, e.prototype = new d, m.extend(e.prototype, g), n.__wrapSuperMethods(e)) : e.prototype = g, e.sharedInstance = function () {
            return e._sharedInstance || (e._sharedInstance = new e, e._sharedInstance._parentClass = e), e._sharedInstance
        }, m.synthesize(e.prototype), e.autocreate = g.__instantiateOnDOMReady || !1, delete g.__instantiateOnDOMReady, e.autocreate && j(function () {
            e.autocreate && e.sharedInstance()
        }), e
    }

    var m = i("./Object"), l = i("./Array"), k = i("./Function"), j = i("./Element/onDOMReady");
    n.__wrapSuperMethods = function (f) {
        var e, r = f.prototype, q = f.__superclass.prototype;
        for (e in r) {
            if (r.hasOwnProperty(e) && "function" == typeof r[e]) {
                var p = r[e], o = k.getParamNames(p);
                "$super" === o[0] && (r[e] = function (g, d) {
                    var s = q[g];
                    return function () {
                        var b = l.toArray(arguments);
                        return d.apply(this, [s.bind(this)].concat(b))
                    }
                }(e, p))
            }
        }
        return this
    }, n.Invalidate = function () {
        return !1
    }, h.exports = n
}, {"./Array": 11, "./Element/onDOMReady": 20, "./Function": 30, "./Object": 33}], 14: [function (e, d) {
    var f = {};
    f.isDate = function (b) {
        return !(!b || "function" != typeof b.getTime)
    }, d.exports = f
}, {}], 15: [function (j, i) {
    var p = j("./Array"), o = j("./Class"), n = j("./Object"), m = {autoplay: !1, asynchronous: !1}, l = o({initialize: function (b) {
        "object" != typeof b && (b = {}), this._options = n.extend(n.clone(m), b), this._isPlaying = !1, this._isRunningAction = !1, this._queue = [], this.didFinish = this.__didFinish.bind(this), this.synthesize()
    }, add: function (f, e) {
        var h, g = {};
        e > 0 && (g.delay = e), h = new l.Action(f, g), this.queue().push(h), this.isPlaying() || this._options.autoplay !== !0 || this.start()
    }, remove: function (b) {
        this.setQueue(p.without(this.queue(), b))
    }, start: function () {
        return this.isPlaying() ? !1 : (this.setIsPlaying(!0), void this.__runNextAction())
    }, stop: function () {
        return this.isPlaying() ? void this.setIsPlaying(!1) : !1
    }, clear: function () {
        this.setQueue([]), this.stop()
    }, __didFinish: function () {
        this.setIsRunningAction(!1), this.__runNextAction()
    }, __runNextAction: function () {
        if (!this.isPlaying()) {
            return !1
        }
        if (this.queue().length && !this.isRunningAction()) {
            var b = this.queue().shift();
            if (b.run(), this._options.asynchronous === !0) {
                return void this.setIsRunningAction(!0)
            }
            this.__runNextAction()
        }
    }}), k = {delay: 0};
    l.Action = o({initialize: function (d, c) {
        if ("function" != typeof d) {
            throw new TypeError("Deferred Queue func must be a function.")
        }
        "object" != typeof c && (c = {}), this._options = n.extend(n.clone(k), c), this.__func = d, this.synthesize()
    }, run: function () {
        var b = this.__func;
        "number" == typeof this._options.delay && this._options.delay > 0 ? window.setTimeout(function () {
            b()
        }, 1000 * this._options.delay) : b()
    }}), i.exports = l
}, {"./Array": 11, "./Class": 13, "./Object": 33}], 16: [function (e, d) {
    var f = {linear: function (h, g, j, i) {
        return j * h / i + g
    }, easeInQuad: function (h, g, j, i) {
        return j * (h /= i) * h + g
    }, easeOutQuad: function (h, g, j, i) {
        return -j * (h /= i) * (h - 2) + g
    }, easeInOutQuad: function (h, g, j, i) {
        return(h /= i / 2) < 1 ? j / 2 * h * h + g : -j / 2 * (--h * (h - 2) - 1) + g
    }, easeInCubic: function (h, g, j, i) {
        return j * (h /= i) * h * h + g
    }, easeOutCubic: function (h, g, j, i) {
        return j * ((h = h / i - 1) * h * h + 1) + g
    }, easeInOutCubic: function (h, g, j, i) {
        return(h /= i / 2) < 1 ? j / 2 * h * h * h + g : j / 2 * ((h -= 2) * h * h + 2) + g
    }, easeInQuart: function (h, g, j, i) {
        return j * (h /= i) * h * h * h + g
    }, easeOutQuart: function (h, g, j, i) {
        return -j * ((h = h / i - 1) * h * h * h - 1) + g
    }, easeInOutQuart: function (h, g, j, i) {
        return(h /= i / 2) < 1 ? j / 2 * h * h * h * h + g : -j / 2 * ((h -= 2) * h * h * h - 2) + g
    }, easeInQuint: function (h, g, j, i) {
        return j * (h /= i) * h * h * h * h + g
    }, easeOutQuint: function (h, g, j, i) {
        return j * ((h = h / i - 1) * h * h * h * h + 1) + g
    }, easeInOutQuint: function (h, g, j, i) {
        return(h /= i / 2) < 1 ? j / 2 * h * h * h * h * h + g : j / 2 * ((h -= 2) * h * h * h * h + 2) + g
    }, easeInSine: function (h, g, j, i) {
        return -j * Math.cos(h / i * (Math.PI / 2)) + j + g
    }, easeOutSine: function (h, g, j, i) {
        return j * Math.sin(h / i * (Math.PI / 2)) + g
    }, easeInOutSine: function (h, g, j, i) {
        return -j / 2 * (Math.cos(Math.PI * h / i) - 1) + g
    }, easeInExpo: function (h, g, j, i) {
        return 0 == h ? g : j * Math.pow(2, 10 * (h / i - 1)) + g
    }, easeOutExpo: function (h, g, j, i) {
        return h == i ? g + j : j * (-Math.pow(2, -10 * h / i) + 1) + g
    }, easeInOutExpo: function (h, g, j, i) {
        return 0 == h ? g : h == i ? g + j : (h /= i / 2) < 1 ? j / 2 * Math.pow(2, 10 * (h - 1)) + g : j / 2 * (-Math.pow(2, -10 * --h) + 2) + g
    }, easeInCirc: function (h, g, j, i) {
        return -j * (Math.sqrt(1 - (h /= i) * h) - 1) + g
    }, easeOutCirc: function (h, g, j, i) {
        return j * Math.sqrt(1 - (h = h / i - 1) * h) + g
    }, easeInOutCirc: function (h, g, j, i) {
        return(h /= i / 2) < 1 ? -j / 2 * (Math.sqrt(1 - h * h) - 1) + g : j / 2 * (Math.sqrt(1 - (h -= 2) * h) + 1) + g
    }, easeInElastic: function (i, h, n, m) {
        var l = 1.70158, k = 0, j = n;
        return 0 == i ? h : 1 == (i /= m) ? h + n : (k || (k = 0.3 * m), j < Math.abs(n) ? (j = n, l = k / 4) : l = k / (2 * Math.PI) * Math.asin(n / j), -(j * Math.pow(2, 10 * (i -= 1)) * Math.sin(2 * (i * m - l) * Math.PI / k)) + h)
    }, easeOutElastic: function (i, h, n, m) {
        var l = 1.70158, k = 0, j = n;
        return 0 == i ? h : 1 == (i /= m) ? h + n : (k || (k = 0.3 * m), j < Math.abs(n) ? (j = n, l = k / 4) : l = k / (2 * Math.PI) * Math.asin(n / j), j * Math.pow(2, -10 * i) * Math.sin(2 * (i * m - l) * Math.PI / k) + n + h)
    }, easeInOutElastic: function (i, h, n, m) {
        var l = 1.70158, k = 0, j = n;
        return 0 == i ? h : 2 == (i /= m / 2) ? h + n : (k || (k = 0.3 * m * 1.5), j < Math.abs(n) ? (j = n, l = k / 4) : l = k / (2 * Math.PI) * Math.asin(n / j), 1 > i ? -0.5 * j * Math.pow(2, 10 * (i -= 1)) * Math.sin(2 * (i * m - l) * Math.PI / k) + h : j * Math.pow(2, -10 * (i -= 1)) * Math.sin(2 * (i * m - l) * Math.PI / k) * 0.5 + n + h)
    }, easeInBack: function (h, g, k, j, i) {
        return void 0 == i && (i = 1.70158), k * (h /= j) * h * ((i + 1) * h - i) + g
    }, easeOutBack: function (h, g, k, j, i) {
        return void 0 == i && (i = 1.70158), k * ((h = h / j - 1) * h * ((i + 1) * h + i) + 1) + g
    }, easeInOutBack: function (h, g, k, j, i) {
        return void 0 == i && (i = 1.70158), (h /= j / 2) < 1 ? k / 2 * h * h * (((i *= 1.525) + 1) * h - i) + g : k / 2 * ((h -= 2) * h * (((i *= 1.525) + 1) * h + i) + 2) + g
    }, easeInBounce: function (g, c, i, h) {
        return i - f.easeOutBounce(h - g, 0, i, h) + c
    }, easeOutBounce: function (h, g, j, i) {
        return(h /= i) < 1 / 2.75 ? 7.5625 * j * h * h + g : 2 / 2.75 > h ? j * (7.5625 * (h -= 1.5 / 2.75) * h + 0.75) + g : 2.5 / 2.75 > h ? j * (7.5625 * (h -= 2.25 / 2.75) * h + 0.9375) + g : j * (7.5625 * (h -= 2.625 / 2.75) * h + 0.984375) + g
    }, easeInOutBounce: function (g, c, i, h) {
        return h / 2 > g ? 0.5 * f.easeInBounce(2 * g, 0, i, h) + c : 0.5 * f.easeOutBounce(2 * g - h, 0, i, h) + 0.5 * i + c
    }};
    f.ease = function (g, c) {
        if ("ease" === c) {
            c = "easeInOutSine"
        } else {
            if ("ease-in" === c) {
                c = "easeInCubic"
            } else {
                if ("ease-out" === c) {
                    c = "easeOutCubic"
                } else {
                    if ("ease-in-out" === c) {
                        c = "easeInOutCubic"
                    } else {
                        if ("linear" === c) {
                            c = "linear"
                        } else {
                            if ("step-start" === c) {
                                return 0 === g ? 0 : 1
                            }
                            if ("step-end" === c) {
                                return 1 === g ? 1 : 0
                            }
                            if ("string" == typeof c && /^steps\(\d+\,\s*(start|end)\)$/.test(c)) {
                                var j = parseInt(c.match(/\d+/)[0]), i = c.match(/(start|end)/)[0], h = 1 / j;
                                return Math["start" === i ? "floor" : "ceil"](g / h) * h
                            }
                        }
                    }
                }
            }
        }
        if ("string" == typeof c) {
            if ("function" != typeof f[c] || "ease" === c) {
                throw new TypeError('"' + c + '" is not a valid easing type')
            }
            c = f[c]
        }
        return c(g, 0, 1, 1)
    }, d.exports = f
}, {}], 17: [function (t, s) {
    var r = t("./Viewport"), q = t("./log"), p = t("./Element/events"), o = t("./Element/vendorTransformHelper"), n = t("./Environment/Browser"), m = {addEventListener: p.addEventListener, removeEventListener: p.removeEventListener, addVendorPrefixEventListener: p.addVendorPrefixEventListener, removeVendorPrefixEventListener: p.removeVendorPrefixEventListener, addVendorEventListener: function (f, d, h, g) {
        return q("ac-base.Element.addVendorEventListener is deprecated. Please use ac-base.Element.addVendorPrefixEventListener."), this.addVendorPrefixEventListener(f, d, h, g)
    }, removeVendorEventListener: function (f, d, h, g) {
        return q("ac-base.Element.removeVendorEventListener is deprecated. Please use ac-base.Element.removeVendorPrefixEventListener."), this.removeVendorPrefixEventListener(f, d, h, g)
    }};
    t("./Element/EventDelegate")(m), m.getElementById = function (b) {
        return"string" == typeof b && (b = document.getElementById(b)), m.isElement(b) ? b : null
    }, m.selectAll = function (d, c) {
        if ("undefined" == typeof c) {
            c = document
        } else {
            if (!m.isElement(c) && 9 !== c.nodeType && 11 !== c.nodeType) {
                throw new TypeError("ac-base.Element.selectAll: Invalid context nodeType")
            }
        }
        if ("string" != typeof d) {
            throw new TypeError("ac-base.Element.selectAll: Selector must be a string")
        }
        return Array.prototype.slice.call(c.querySelectorAll(d))
    }, m.select = function (d, c) {
        if ("undefined" == typeof c) {
            c = document
        } else {
            if (!m.isElement(c) && 9 !== c.nodeType && 11 !== c.nodeType) {
                throw new TypeError("ac-base.Element.select: Invalid context nodeType")
            }
        }
        if ("string" != typeof d) {
            throw new TypeError("ac-base.Element.select: Selector must be a string")
        }
        return c.querySelector(d)
    };
    var l = window.Element ? function (b) {
        return b.matches || b.matchesSelector || b.webkitMatchesSelector || b.mozMatchesSelector || b.msMatchesSelector || b.oMatchesSelector
    }(Element.prototype) : null;
    m.matchesSelector = function (d, c) {
        return m.isElement(d) ? l.call(d, c) : !1
    }, m.matches = function (d, c) {
        return q("ac-base.Element.matches is deprecated. Use ac-base.Element.filterBySelector instead."), m.filterBySelector(c, d)
    }, m.filterBySelector = function (g, f) {
        for (var j = [], i = 0, h = g.length; h > i; i++) {
            m.isElement(g[i]) && l.call(g[i], f) && (j[j.length] = g[i])
        }
        return j
    }, m.setOpacity = function (d, c) {
        return q("ac-base.Element.setOpacity is deprecated. Use ac-base.Element.setStyle instead."), m.setStyle(d, {opacity: c})
    }, m.setStyle = function (g, f) {
        if ("string" != typeof f && "object" != typeof f || Array.isArray(f)) {
            throw new TypeError("styles argument must be either an object or a string")
        }
        g = m.getElementById(g);
        var j, i, h;
        j = m.setStyle.__explodeStyleStringToObject(f);
        for (h in j) {
            j.hasOwnProperty(h) && (i = h.replace(/-(\w)/g, m.setStyle.__camelCaseReplace), m.setStyle.__setStyle(g, i, j, j[h]))
        }
        return g
    }, m.setStyle.__explodeStyleStringToObject = function (h) {
        var g, v, u, j, i = "object" == typeof h ? h : {};
        if ("string" == typeof h) {
            for (g = h.split(";"), u = g.length, j = 0; u > j; j += 1) {
                v = g[j].indexOf(":"), v > 0 && (i[g[j].substr(0, v).trim()] = g[j].substr(v + 1).trim())
            }
        }
        return i
    }, m.setStyle.__setStyle = function (f, e, h, g) {
        "undefined" != typeof f.style[e] && (f.style[e] = g)
    }, m.setStyle.__camelCaseReplace = function (f, e, h, g) {
        return 0 === h && "moz" !== g.substr(1, 3) ? e : e.toUpperCase()
    }, m.getStyle = function (f, e, h) {
        var g;
        return e = e.replace(/-(\w)/g, m.setStyle.__camelCaseReplace), f = m.getElementById(f), e = "float" === e ? "cssFloat" : e, h = h || window.getComputedStyle(f, null), g = h ? h[e] : null, "opacity" === e ? g ? parseFloat(g) : 1 : "auto" === g ? null : g
    }, m.cumulativeOffset = function (f) {
        var c = m.getBoundingBox(f), h = r.scrollOffsets(), g = [c.top + h.y, c.left + h.x];
        return g.top = g[0], g.left = g[1], g
    }, m.getBoundingBox = function (f) {
        f = m.getElementById(f);
        var e = f.getBoundingClientRect(), h = e.width || e.right - e.left, g = e.height || e.bottom - e.top;
        return{top: e.top, right: e.right, bottom: e.bottom, left: e.left, width: h, height: g}
    }, m.getInnerDimensions = function (i) {
        var h, x, w = m.getBoundingBox(i), v = w.width, u = w.height, j = window.getComputedStyle ? window.getComputedStyle(i, null) : null;
        return["padding", "border"].forEach(function (b) {
            ["Top", "Right", "Bottom", "Left"].forEach(function (c) {
                h = "border" === b ? b + c + "Width" : b + c, x = parseFloat(m.getStyle(i, h, j)), x = isNaN(x) ? 0 : x, ("Right" === c || "Left" === c) && (v -= x), ("Top" === c || "Bottom" === c) && (u -= x)
            })
        }), {width: v, height: u}
    }, m.getOuterDimensions = function (h) {
        var g, v = m.getBoundingBox(h), u = v.width, j = v.height, i = window.getComputedStyle ? window.getComputedStyle(h, null) : null;
        return["margin"].forEach(function (b) {
            ["Top", "Right", "Bottom", "Left"].forEach(function (c) {
                g = parseFloat(m.getStyle(h, b + c, i)), g = isNaN(g) ? 0 : g, ("Right" === c || "Left" === c) && (u += g), ("Top" === c || "Bottom" === c) && (j += g)
            })
        }), {width: u, height: j}
    }, m.hasClassName = function (e, d) {
        var f = m.getElementById(e);
        return f && "" !== f.className ? new RegExp("(\\s|^)" + d + "(\\s|$)").test(f.className) : !1
    }, m.addClassName = function (e, d) {
        var f = m.getElementById(e);
        f.classList ? f.classList.add(d) : m.hasClassName(f, d) || (f.className += " " + d)
    }, m.removeClassName = function (f, e) {
        var h = m.getElementById(f);
        if (m.hasClassName(h, e)) {
            var g = new RegExp("(\\s|^)" + e + "(\\s|$)");
            h.className = h.className.replace(g, "$1").trim()
        }
    }, m.toggleClassName = function (e, d) {
        var f = m.getElementById(e);
        f.classList ? f.classList.toggle(d) : m.hasClassName(f, d) ? m.removeClassName(f, d) : m.addClassName(f, d)
    }, m.isElement = function (b) {
        return !(!b || 1 !== b.nodeType)
    }, m.setVendorPrefixStyle = function (h, g, v) {
        if ("string" != typeof g) {
            throw new TypeError("ac-base.Element.setVendorPrefixStyle: property must be a string")
        }
        if ("string" != typeof v && "number" != typeof v) {
            throw new TypeError("ac-base.Element.setVendorPrefixStyle: value must be a string or a number")
        }
        v += "", h = m.getElementById(h);
        var u, j, i = ["", "webkit", "Moz", "ms", "O"];
        g = g.replace(/-(webkit|moz|ms|o)-/i, ""), g = g.replace(/^(webkit|Moz|ms|O)/, ""), g = g.charAt(0).toLowerCase() + g.slice(1), g = g.replace(/-(\w)/, function (d, c) {
            return c.toUpperCase()
        }), v = v.replace(/-(webkit|moz|ms|o)-/, "-vendor-"), i.forEach(function (b) {
            u = "" === b ? g : b + g.charAt(0).toUpperCase() + g.slice(1), j = "" === b ? v.replace("-vendor-", "") : v.replace("-vendor-", "-" + b.charAt(0).toLowerCase() + b.slice(1) + "-"), u in h.style && m.setStyle(h, u + ":" + j)
        })
    }, m.getVendorPrefixStyle = function (f, e) {
        if ("string" != typeof e) {
            throw new TypeError("ac-base.Element.getVendorPrefixStyle: property must be a string")
        }
        f = m.getElementById(f);
        var h, g = ["", "webkit", "Moz", "ms", "O"];
        return e = e.replace(/-(webkit|moz|ms|o)-/i, ""), e = e.replace(/^(webkit|Moz|ms|O)/, "").charAt(0).toLowerCase() + e.slice(1), e = e.replace(/-(\w)/, function (d, c) {
            return c.toUpperCase()
        }), g.some(function (c) {
            var b = "" === c ? e : c + e.charAt(0).toUpperCase() + e.slice(1);
            return b in f.style ? (h = m.getStyle(f, b), !0) : void 0
        }), h
    }, m.insert = function (e, d, f) {
        if (!e || 1 !== e.nodeType && 3 !== e.nodeType && 11 !== e.nodeType) {
            throw new TypeError("ac-base.Element.insert: element must be a valid node of type element, text, or document fragment")
        }
        if (!d || 1 !== d.nodeType && 11 !== d.nodeType) {
            throw new TypeError("ac-base.Element.insert: target must be a valid node of type element or document fragment")
        }
        switch (f) {
            case"before":
                if (11 === d.nodeType) {
                    throw new TypeError("ac-base.Element.insert: target cannot be nodeType of documentFragment when using placement ‘before’")
                }
                d.parentNode.insertBefore(e, d);
                break;
            case"after":
                if (11 === d.nodeType) {
                    throw new TypeError("ac-base.Element.insert: target cannot be nodeType of documentFragment when using placement ‘after’")
                }
                d.parentNode.insertBefore(e, d.nextSibling);
                break;
            case"first":
                d.insertBefore(e, d.firstChild);
                break;
            default:
                d.appendChild(e)
        }
    }, m.insertAt = function (h, g, v) {
        var u, j, i;
        if (h = m.getElementById(h), g = m.getElementById(g), !m.isElement(h) || !m.isElement(g)) {
            throw new TypeError("ac-base.Element.insertAt: element must be a valid DOM element")
        }
        if (u = m.children(g), 0 > v && u.length && (v += u.length), g.contains(h) && v > u.indexOf(h) && v++, u && v <= u.length - 1) {
            for (i = 0, j = u.length; j > i; i++) {
                if (i === v) {
                    g.insertBefore(h, u[i]);
                    break
                }
            }
        } else {
            g.appendChild(h)
        }
    }, m.children = function (g) {
        var f, j;
        if (g = m.getElementById(g), !m.isElement(g)) {
            throw new TypeError("ac-base.Element.children: element must be a valid DOM element")
        }
        if (g.children) {
            f = [];
            for (var i = 0, h = g.children.length; h > i; i++) {
                j = g.children[i], j && 1 === j.nodeType && f.push(j)
            }
        }
        return f.length ? f : null
    }, m.remove = function (e, d) {
        if (!m.isElement(e)) {
            throw new TypeError("ac-base.Element.remove: element must be a valid DOM element")
        }
        if (d === !0) {
            var f = e.parentNode.removeChild(e);
            return f
        }
        e.parentNode.removeChild(e)
    }, m.viewportOffset = function (d) {
        var c = m.getBoundingBox(d);
        return{x: c.left, y: c.top}
    }, m.pixelsInViewport = function (g, c) {
        var j;
        if (!m.isElement(g)) {
            throw new TypeError("ac-base.Element.pixelsInViewport : element must be a valid DOM element")
        }
        var i = r.dimensions();
        c = c || m.getBoundingBox(g);
        var h = c.top;
        return h >= 0 ? (j = i.height - h, j > c.height && (j = c.height)) : j = c.height + h, 0 > j && (j = 0), j > i.height && (j = i.height), j
    }, m.percentInViewport = function (e) {
        var d = m.getBoundingBox(e), f = m.pixelsInViewport(e, d);
        return f / d.height
    }, m.isInViewport = function (e, d) {
        ("number" != typeof d || d > 1 || 0 > d) && (d = 0);
        var f = m.percentInViewport(e);
        return f > d || 1 === f
    };
    var k = function (e, d) {
        e = m.getElementById(e);
        for (var f = e.parentNode; f && m.isElement(f) && ("function" != typeof d || d(f) !== !1);) {
            f = f !== document.body ? f.parentNode : null
        }
    };
    m.ancestors = function (e, d) {
        var f = [];
        return k(e, function (b) {
            (void 0 === d || m.matchesSelector(b, d)) && f.push(b)
        }), f
    }, m.ancestor = function (e, d) {
        e = m.getElementById(e);
        var f = null;
        return null !== e && void 0 === d ? e.parentNode : (k(e, function (b) {
            return m.matchesSelector(b, d) ? (f = b, !1) : void 0
        }), f)
    }, m.setVendorPrefixTransform = function (d, c) {
        if ("string" != typeof c && "object" != typeof c || Array.isArray(c) || null === c) {
            throw new TypeError("ac-base.Element.setVendorPrefixTransform: transformFunctions argument must be either an object or a string")
        }
        m.setVendorPrefixStyle(d, "transform", o.convert2dFunctions(c))
    }, "IE" === n.name && t("./shims/ie/Element")(m, n), s.exports = m
}, {"./Element/EventDelegate": 18, "./Element/events": 19, "./Element/vendorTransformHelper": 22, "./Environment/Browser": 24, "./Viewport": 39, "./log": 43, "./shims/ie/Element": 48}], 18: [function (d, c) {
    c.exports = function (f) {
        function e(h, g) {
            this.element = h, this.options = g || {}
        }

        e.prototype = {__findMatchingTarget: function (g) {
            var h = null;
            return h = f.matchesSelector(g, this.options.selector) ? g : f.ancestor(g, this.options.selector)
        }, __generateDelegateMethod: function () {
            var b = this, g = b.options.handler;
            return function (k) {
                var j, i = k.target || k.srcElement, h = b.__findMatchingTarget(i);
                null !== h && (j = new e.Event(k), j.setTarget(h), g(j))
            }
        }, attachEventListener: function () {
            return this.__delegateMethod = this.__generateDelegateMethod(), f.addEventListener(this.element, this.options.eventType, this.__delegateMethod), this.__delegateMethod
        }, unbind: function () {
            f.removeEventListener(this.element, this.options.eventType, this.__delegateMethod), this.__delegateMethod = void 0
        }}, e.instances = [], e.filterInstances = function (b) {
            var g = [];
            return e.instances.forEach(function (h) {
                b(h) === !0 && g.push(h)
            }), g
        }, e.Event = function (b) {
            this.originalEvent = b
        }, e.Event.prototype.setTarget = function (b) {
            this.target = b, this.currentTarget = b
        }, f.addEventDelegate = function (k, j, i, h) {
            var b = new f.__EventDelegate(k, {eventType: j, selector: i, handler: h});
            return e.instances.push(b), b.attachEventListener()
        }, f.removeEventDelegate = function (g, k, j, i) {
            var h = f.__EventDelegate.filterInstances(function (b) {
                var l = b.options;
                return b.element === g && l.selector === j && l.eventType === k && l.handler === i
            });
            h.forEach(function (b) {
                b.unbind()
            })
        }, f.__EventDelegate = e
    }
}, {}], 19: [function (e, d) {
    var f = {};
    f.addEventListener = function (h, g, j, i) {
        return h.addEventListener ? h.addEventListener(g, j, i) : h.attachEvent ? h.attachEvent("on" + g, j) : h["on" + g] = j, h
    }, f.dispatchEvent = function (g, c) {
        return document.createEvent ? g.dispatchEvent(new CustomEvent(c)) : g.fireEvent("on" + c, document.createEventObject()), g
    }, f.removeEventListener = function (h, g, j, i) {
        return h.removeEventListener ? h.removeEventListener(g, j, i) : h.detachEvent("on" + g, j), h
    }, f.addVendorPrefixEventListener = function (g, c, i, h) {
        return c = c.match(/^webkit/i) ? c.replace(/^webkit/i, "") : c.match(/^moz/i) ? c.replace(/^moz/i, "") : c.match(/^ms/i) ? c.replace(/^ms/i, "") : c.match(/^o/i) ? c.replace(/^o/i, "") : c.charAt(0).toUpperCase() + c.slice(1), /WebKit/i.test(window.navigator.userAgent) ? f.addEventListener(g, "webkit" + c, i, h) : /Opera/i.test(window.navigator.userAgent) ? f.addEventListener(g, "O" + c, i, h) : /Gecko/i.test(window.navigator.userAgent) || /Trident/i.test(window.navigator.userAgent) ? f.addEventListener(g, c.toLowerCase(), i, h) : (c = c.charAt(0).toLowerCase() + c.slice(1), f.addEventListener(g, c, i, h))
    }, f.removeVendorPrefixEventListener = function (g, c, i, h) {
        return c = c.match(/^webkit/i) ? c.replace(/^webkit/i, "") : c.match(/^moz/i) ? c.replace(/^moz/i, "") : c.match(/^ms/i) ? c.replace(/^ms/i, "") : c.match(/^o/i) ? c.replace(/^o/i, "") : c.charAt(0).toUpperCase() + c.slice(1), f.removeEventListener(g, "webkit" + c, i, h), f.removeEventListener(g, "O" + c, i, h), f.removeEventListener(g, c.toLowerCase(), i, h), c = c.charAt(0).toLowerCase() + c.slice(1), f.removeEventListener(g, c, i, h)
    }, d.exports = f
}, {}], 20: [function (j, i) {
    function p(e) {
        var c = l.document, g = l.window;
        if ("readystatechange" !== e.type || "complete" === c.readyState) {
            for (var f = m.length; f--;) {
                m.shift().call(g, e.type || e)
            }
            k.removeEventListener(c, "DOMContentLoaded", p, !1), k.removeEventListener(c, "readystatechange", p, !1), k.removeEventListener(g, "load", p, !1), clearTimeout(n)
        }
    }

    function o() {
        try {
            l.document.documentElement.doScroll("left")
        } catch (b) {
            return void (n = setTimeout(o, 50))
        }
        p("poll")
    }

    var n, m, l = j("../globals"), k = j("./events");
    i.exports = function (d) {
        var c = l.document, g = l.window;
        if ("complete" === c.readyState) {
            d.call(g, "lazy")
        } else {
            if ((!m || !m.length) && (m = [], k.addEventListener(c, "DOMContentLoaded", p, !1), k.addEventListener(c, "readystatechange", p, !1), k.addEventListener(g, "load", p, !1), c.createEventObject && c.documentElement.doScroll)) {
                try {
                    g.frameElement || o()
                } catch (f) {
                }
            }
            m.push(d)
        }
    }
}, {"../globals": 42, "./events": 19}], 21: [function (h, g) {
    function l() {
        for (var b = k.length; b--;) {
            k.shift()()
        }
        i.removeEventListener(j.window, "load", l)
    }

    var k, j = h("../globals"), i = h("./events");
    g.exports = function (b) {
        "complete" === j.document.readyState ? b() : (k || (k = [], i.addEventListener(j.window, "load", l)), k.push(b))
    }
}, {"../globals": 42, "./events": 19}], 22: [function (e, d) {
    var f = {__objectifiedFunctions: {}, __paramMaps: {translate: "p1, p2, 0", translateX: "p1, 0, 0", translateY: "0, p1, 0", scale: "p1, p2, 1", scaleX: "p1, 1, 1", scaleY: "1, p1, 1", rotate: "0, 0, 1, p1", matrix: "p1, p2, 0, 0, p3, p4, 0, 0, 0, 0, 1, 0, p5, p6, 0, 1"}, convert2dFunctions: function (h) {
        var g;
        this.__init(h);
        for (var j in this.__objectifiedFunctions) {
            if (this.__objectifiedFunctions.hasOwnProperty(j)) {
                if (g = this.__objectifiedFunctions[j].replace(" ", "").split(","), j in this.__paramMaps) {
                    for (var i in this.__paramMaps) {
                        j === i && this.valuesToSet.push(this.__stripFunctionAxis(j) + "3d(" + this.__map2DTransformParams(g, this.__paramMaps[j]) + ")")
                    }
                } else {
                    this.valuesToSet.push(j + "(" + this.__objectifiedFunctions[j] + ")")
                }
            }
        }
        return this.valuesToSet.join(" ")
    }, __init: function (b) {
        this.valuesToSet = [], this.__objectifiedFunctions = "object" == typeof b ? b : {}, "string" == typeof b && (this.__objectifiedFunctions = this.__objectifyFunctionString(b))
    }, __map2DTransformParams: function (g, c) {
        return g.forEach(function (b, h) {
            c = c.replace("p" + (h + 1), b)
        }), c
    }, __splitFunctionStringToArray: function (b) {
        return b.match(/[\w]+\(.+?\)/g)
    }, __splitFunctionNameAndParams: function (b) {
        return b.match(/(.*)\((.*)\)/)
    }, __stripFunctionAxis: function (b) {
        return b.match(/([a-z]+)(|X|Y)$/)[1]
    }, __objectifyFunctionString: function (h) {
        var g, i = this;
        return this.__splitFunctionStringToArray(h).forEach(function (b) {
            g = i.__splitFunctionNameAndParams(b), i.__objectifiedFunctions[g[1]] = g[2]
        }), this.__objectifiedFunctions
    }};
    d.exports = f
}, {}], 23: [function (e, d) {
    var f = {Browser: e("./Environment/Browser"), Feature: e("./Environment/Feature")};
    d.exports = f
}, {"./Environment/Browser": 24, "./Environment/Feature": 27}], 24: [function (f, e) {
    var h = f("./Browser/BrowserData"), g = h.create();
    g.isWebKit = function (d) {
        var c = d || window.navigator.userAgent;
        return c ? !!c.match(/applewebkit/i) : !1
    }, g.lowerCaseUserAgent = navigator.userAgent.toLowerCase(), "IE" === g.name && f("../shims/ie/Environment/Browser")(g), e.exports = g
}, {"../shims/ie/Environment/Browser": 49, "./Browser/BrowserData": 25}], 25: [function (g, f) {
    function j() {
    }

    var i = g("./data"), h = g("../../RegExp");
    j.prototype = {__getBrowserVersion: function (k, d) {
        if (k && d) {
            var n = i.browser.filter(function (b) {
                return b.identity === d
            })[0], m = n.versionSearch || d, l = k.indexOf(m);
            return l > -1 ? parseFloat(k.substring(l + m.length + 1)) : void 0
        }
    }, __getName: function (b) {
        return this.__getIdentityStringFromArray(b)
    }, __getIdentity: function (b) {
        return b.string ? this.__matchSubString(b) : b.prop ? b.identity : void 0
    }, __getIdentityStringFromArray: function (k) {
        for (var e, m = 0, l = k.length; l > m; m++) {
            if (e = this.__getIdentity(k[m])) {
                return e
            }
        }
    }, __getOS: function (b) {
        return this.__getIdentityStringFromArray(b)
    }, __getOSVersion: function (k, d) {
        if (k && d) {
            var o = i.os.filter(function (b) {
                return b.identity === d
            })[0], n = o.versionSearch || d, m = new RegExp(n + " ([\\d_\\.]+)", "i"), l = k.match(m);
            return null !== l ? l[1].replace(/_/g, ".") : void 0
        }
    }, __matchSubString: function (e) {
        var d, k = e.subString;
        return k && (d = h.isRegExp(k) && !!e.string.match(k), d || e.string.indexOf(k) > -1) ? e.identity : void 0
    }}, j.create = function () {
        var d = new j, c = {};
        return c.name = d.__getName(i.browser), c.version = d.__getBrowserVersion(i.versionString, c.name), c.os = d.__getOS(i.os), c.osVersion = d.__getOSVersion(i.versionString, c.os), c
    }, f.exports = j
}, {"../../RegExp": 34, "./data": 26}], 26: [function (d, c) {
    c.exports = {browser: [
        {string: window.navigator.userAgent, subString: "Chrome", identity: "Chrome"},
        {string: window.navigator.userAgent, subString: /silk/i, identity: "Silk"},
        {string: window.navigator.userAgent, subString: "OmniWeb", versionSearch: "OmniWeb/", identity: "OmniWeb"},
        {string: window.navigator.userAgent, subString: /mobile\/[^\s]*\ssafari\//i, identity: "Safari Mobile", versionSearch: "Version"},
        {string: window.navigator.vendor, subString: "Apple", identity: "Safari", versionSearch: "Version"},
        {prop: window.opera, identity: "Opera", versionSearch: "Version"},
        {string: window.navigator.vendor, subString: "iCab", identity: "iCab"},
        {string: window.navigator.vendor, subString: "KDE", identity: "Konqueror"},
        {string: window.navigator.userAgent, subString: "Firefox", identity: "Firefox"},
        {string: window.navigator.vendor, subString: "Camino", identity: "Camino"},
        {string: window.navigator.userAgent, subString: "Netscape", identity: "Netscape"},
        {string: window.navigator.userAgent, subString: "MSIE", identity: "IE", versionSearch: "MSIE"},
        {string: window.navigator.userAgent, subString: "Trident", identity: "IE", versionSearch: "rv"},
        {string: window.navigator.userAgent, subString: "Gecko", identity: "Mozilla", versionSearch: "rv"},
        {string: window.navigator.userAgent, subString: "Mozilla", identity: "Netscape", versionSearch: "Mozilla"}
    ], os: [
        {string: window.navigator.platform, subString: "Win", identity: "Windows", versionSearch: "Windows NT"},
        {string: window.navigator.platform, subString: "Mac", identity: "OS X"},
        {string: window.navigator.userAgent, subString: "iPhone", identity: "iOS", versionSearch: "iPhone OS"},
        {string: window.navigator.userAgent, subString: "iPad", identity: "iOS", versionSearch: "CPU OS"},
        {string: window.navigator.userAgent, subString: /android/i, identity: "Android"},
        {string: window.navigator.platform, subString: "Linux", identity: "Linux"}
    ], versionString: window.navigator.userAgent || window.navigator.appVersion || void 0}
}, {}], 27: [function (g, f) {
    var j = g("../log"), i = {localStorageAvailable: g("./Feature/localStorageAvailable")}, h = Object.prototype.hasOwnProperty;
    !function () {
        var d = null, c = null, l = null, k = null;
        i.isCSSAvailable = function (b) {
            return j("ac-base.Environment.Feature.isCSSAvailable is deprecated. Please use ac-base.Environment.Feature.cssPropertyAvailable instead."), this.cssPropertyAvailable(b)
        }, i.cssPropertyAvailable = function (t) {
            switch (null === d && (d = document.createElement("browserdetect").style), null === c && (c = ["-webkit-", "-moz-", "-o-", "-ms-", "-khtml-", ""]), null === l && (l = ["Webkit", "Moz", "O", "ms", "Khtml", ""]), null === k && (k = {}), t = t.replace(/([A-Z]+)([A-Z][a-z])/g, "$1\\-$2").replace(/([a-z\d])([A-Z])/g, "$1\\-$2").replace(/^(\-*webkit|\-*moz|\-*o|\-*ms|\-*khtml)\-/, "").toLowerCase()) {
                case"gradient":
                    if (void 0 !== k.gradient) {
                        return k.gradient
                    }
                    t = "background-image:";
                    var s = "gradient(linear,left top,right bottom,from(#9f9),to(white));", r = "linear-gradient(left top,#9f9, white);";
                    return d.cssText = (t + c.join(s + t) + c.join(r + t)).slice(0, -t.length), k.gradient = -1 !== d.backgroundImage.indexOf("gradient"), k.gradient;
                case"inset-box-shadow":
                    if (void 0 !== k["inset-box-shadow"]) {
                        return k["inset-box-shadow"]
                    }
                    t = "box-shadow:";
                    var q = "#fff 0 1px 1px inset;";
                    return d.cssText = c.join(t + q), k["inset-box-shadow"] = -1 !== d.cssText.indexOf("inset"), k["inset-box-shadow"];
                default:
                    var p, o, n, e = t.split("-"), b = e.length;
                    if (e.length > 0) {
                        for (t = e[0], o = 1; b > o; o += 1) {
                            t += e[o].substr(0, 1).toUpperCase() + e[o].substr(1)
                        }
                    }
                    if (p = t.substr(0, 1).toUpperCase() + t.substr(1), void 0 !== k[t]) {
                        return k[t]
                    }
                    for (n = l.length - 1; n >= 0; n -= 1) {
                        if (void 0 !== d[l[n] + t] || void 0 !== d[l[n] + p]) {
                            return k[t] = !0, !0
                        }
                    }
                    return !1
            }
        }
    }(), i.supportsThreeD = function () {
        return j("ac-base.Environment.Feature.supportsThreeD is deprecated. Please use ac-base.Environment.Feature.threeDTransformsAvailable instead."), this.threeDTransformsAvailable()
    }, i.threeDTransformsAvailable = function () {
        if ("undefined" != typeof this._threeDTransformsAvailable) {
            return this._threeDTransformsAvailable
        }
        var e, d;
        try {
            return this._threeDTransformsAvailable = !1, h.call(window, "styleMedia") ? this._threeDTransformsAvailable = window.styleMedia.matchMedium("(-webkit-transform-3d)") : h.call(window, "media") && (this._threeDTransformsAvailable = window.media.matchMedium("(-webkit-transform-3d)")), this._threeDTransformsAvailable || ((d = document.getElementById("supportsThreeDStyle")) || (d = document.createElement("style"), d.id = "supportsThreeDStyle", d.textContent = "@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-ms-transform-3d),(-webkit-transform-3d) { #supportsThreeD { height:3px } }", document.querySelector("head").appendChild(d)), (e = document.querySelector("#supportsThreeD")) || (e = document.createElement("div"), e.id = "supportsThreeD", document.body.appendChild(e)), this._threeDTransformsAvailable = 3 === e.offsetHeight || void 0 !== d.style.MozTransform || void 0 !== d.style.WebkitTransform), this._threeDTransformsAvailable
        } catch (k) {
            return !1
        }
    }, i.supportsCanvas = function () {
        return j("ac-base.Environment.Feature.supportsCanvas is deprecated. Please use ac-base.Environment.Feature.canvasAvailable instead."), this.canvasAvailable()
    }, i.canvasAvailable = function () {
        if ("undefined" != typeof this._canvasAvailable) {
            return this._canvasAvailable
        }
        var b = document.createElement("canvas");
        return this._canvasAvailable = !("function" != typeof b.getContext || !b.getContext("2d")), this._canvasAvailable
    }, i.sessionStorageAvailable = function () {
        if ("undefined" != typeof this._sessionStorageAvailable) {
            return this._sessionStorageAvailable
        }
        try {
            "undefined" != typeof window.sessionStorage && "function" == typeof window.sessionStorage.setItem ? (window.sessionStorage.setItem("ac_browser_detect", "test"), this._sessionStorageAvailable = !0, window.sessionStorage.removeItem("ac_browser_detect", "test")) : this._sessionStorageAvailable = !1
        } catch (b) {
            this._sessionStorageAvailable = !1
        }
        return this._sessionStorageAvailable
    }, i.cookiesAvailable = function () {
        return"undefined" != typeof this._cookiesAvailable ? this._cookiesAvailable : (this._cookiesAvailable = h.call(document, "cookie") && navigator.cookieEnabled ? !0 : !1, this._cookiesAvailable)
    }, i.__normalizedScreenWidth = function () {
        return"undefined" == typeof window.orientation ? window.screen.width : window.screen.width < window.screen.height ? window.screen.width : window.screen.height
    }, i.touchAvailable = function () {
        return !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch)
    }, i.isDesktop = function () {
        return this.touchAvailable() || window.orientation ? !1 : !0
    }, i.isHandheld = function () {
        return !this.isDesktop() && !this.isTablet()
    }, i.isTablet = function () {
        return !this.isDesktop() && this.__normalizedScreenWidth() > 480
    }, i.isRetina = function () {
        var d, c = ["min-device-pixel-ratio:1.5", "-webkit-min-device-pixel-ratio:1.5", "min-resolution:1.5dppx", "min-resolution:144dpi", "min--moz-device-pixel-ratio:1.5"];
        if (void 0 !== window.devicePixelRatio) {
            if (window.devicePixelRatio >= 1.5) {
                return !0
            }
        } else {
            for (d = 0; d < c.length; d += 1) {
                if (window.matchMedia("(" + c[d] + ")").matches === !0) {
                    return !0
                }
            }
        }
        return !1
    }, i.svgAvailable = function () {
        return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")
    }, f.exports = i
}, {"../log": 43, "./Feature/localStorageAvailable": 28}], 28: [function (e, d) {
    var f = null;
    d.exports = function () {
        return null === f && (f = !(!window.localStorage || null === window.localStorage.non_existent)), f
    }
}, {}], 29: [function (e, d) {
    var f = {};
    f.stop = function (b) {
        b || (b = window.event), b.stopPropagation ? b.stopPropagation() : b.cancelBubble = !0, b.preventDefault && b.preventDefault(), b.stopped = !0, b.returnValue = !1
    }, f.target = function (b) {
        return"undefined" != typeof b.target ? b.target : b.srcElement
    }, f.Keys = {UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, ESC: 27, SPACE: 32, BACKSPACE: 8, DELETE: 46, END: 35, HOME: 36, PAGEDOWN: 34, PAGEUP: 33, RETURN: 13, TAB: 9}, d.exports = f
}, {}], 30: [function (f, e) {
    var h = f("./Array"), g = {};
    g.emptyFunction = function () {
    }, g.bindAsEventListener = function (i, c) {
        var j = h.toArray(arguments).slice(2);
        return function (b) {
            return i.apply(c, [b || window.event].concat(j))
        }
    }, g.getParamNames = function (d) {
        var c = d.toString();
        return c.slice(c.indexOf("(") + 1, c.indexOf(")")).match(/([^\s,]+)/g) || []
    }, g.iterateFramesOverAnimationDuration = function (j, i, o) {
        var n, m, l, k = 0;
        i = 1000 * i, m = function (b) {
            l = l || b, k = i ? Math.min(Math.max(0, (b - l) / i), 1) : 1, j(k), 1 > k ? n = window.requestAnimationFrame(m) : (window.cancelAnimationFrame(n), "function" == typeof o && o())
        }, n = window.requestAnimationFrame(m)
    }, e.exports = g
}, {"./Array": 11}], 31: [function (i, h) {
    var n = i("./NotificationCenter"), m = i("./Class"), l = i("./Object"), k = i("./Element"), j = {};
    j.HashChange = m({initialize: function (b) {
        this._boundEventHandler = null, this._notificationString = b || "ac-history-hashchange", this.synthesize()
    }, __eventHandler: function (d) {
        var c = new j.HashChange.Event(d);
        n.publish(this.notificationString(), {data: c}, !1)
    }, __bindWindowEvent: function () {
        this.setBoundEventHandler(this.__eventHandler.bind(this)), k.addEventListener(window, "hashchange", this.boundEventHandler())
    }, __unbindWindowEvent: function () {
        k.removeEventListener(window, "hashchange", this.boundEventHandler()), this.setBoundEventHandler(null)
    }, subscribe: function (b) {
        null === this.boundEventHandler() && this.__bindWindowEvent(), n.subscribe(this.notificationString(), b)
    }, unsubscribe: function (b) {
        n.unsubscribe(this.notificationString(), b), n.hasSubscribers(this.notificationString()) || this.__unbindWindowEvent()
    }}), j.HashChange.Event = m({initialize: function (b) {
        this.event = b, l.extend(this, b), this.hasOwnProperty("oldURL") && this.oldURL.match("#") && (this.oldHash = this.oldURL.split("#")[1]), this.hasOwnProperty("newURL") && this.newURL.match("#") && (this.newHash = this.newURL.split("#")[1])
    }}), h.exports = j
}, {"./Class": 13, "./Element": 17, "./NotificationCenter": 32, "./Object": 33}], 32: [function (e, d) {
    var f = {};
    d.exports = {publish: function (g, c, i) {
        c = c || {};
        var h = function () {
            !f[g] || f[g].length < 1 || f[g].forEach(function (b) {
                "undefined" != typeof b && (b.target && c.target ? b.target === c.target && b.callback(c.data) : b.callback(c.data))
            })
        };
        i === !0 ? window.setTimeout(h, 10) : h()
    }, subscribe: function (g, c, h) {
        f[g] || (f[g] = []), f[g].push({callback: c, target: h})
    }, unsubscribe: function (g, c, i) {
        var h = f[g].slice(0);
        f[g].forEach(function (b, j) {
            "undefined" != typeof b && (i ? c === b.callback && b.target === i && h.splice(j, 1) : c === b.callback && h.splice(j, 1))
        }), f[g] = h
    }, hasSubscribers: function (g, c) {
        if (!f[g] || f[g].length < 1) {
            return !1
        }
        if (!c) {
            return !0
        }
        for (var i, h = f[g].length; h--;) {
            if (i = f[g][h], i.target && c && i.target === c) {
                return !0
            }
        }
        return !1
    }}
}, {}], 33: [function (h, g) {
    var l = h("./Synthesize"), k = h("qs"), j = {}, i = Object.prototype.hasOwnProperty;
    j.extend = function () {
        var d, c;
        return d = arguments.length < 2 ? [
            {},
            arguments[0]
        ] : [].slice.call(arguments), c = d.shift(), d.forEach(function (b) {
            for (var e in b) {
                i.call(b, e) && (c[e] = b[e])
            }
        }), c
    }, j.clone = function (b) {
        return j.extend({}, b)
    }, j.getPrototypeOf = Object.getPrototypeOf ? Object.getPrototypeOf : "object" == typeof this.__proto__ ? function (b) {
        return b.__proto__
    } : function (e) {
        var d, f = e.constructor;
        if (i.call(e, "constructor")) {
            if (d = f, !delete e.constructor) {
                return null
            }
            f = e.constructor, e.constructor = d
        }
        return f ? f.prototype : null
    }, j.toQueryParameters = function (b) {
        if ("object" != typeof b) {
            throw new TypeError("toQueryParameters error: argument is not an object")
        }
        return k.stringify(b)
    }, j.isEmpty = function (d) {
        var c;
        if ("object" != typeof d) {
            throw new TypeError("ac-base.Object.isEmpty : Invalid parameter - expected object")
        }
        for (c in d) {
            if (i.call(d, c)) {
                return !1
            }
        }
        return !0
    }, j.synthesize = function (b) {
        if ("object" == typeof b) {
            return j.extend(b, j.clone(l)), b.synthesize(), b
        }
        throw new TypeError("Argument supplied was not a valid object.")
    }, g.exports = j
}, {"./Synthesize": 38, qs: 5}], 34: [function (e, d) {
    var f = {};
    f.isRegExp = function (b) {
        return window.RegExp ? b instanceof RegExp : !1
    }, d.exports = f
}, {}], 35: [function (h, g) {
    var l = h("./Class"), k = h("./Object"), j = h("./Element"), i = l();
    i.Component = h("./Registry/Component"), i.prototype = {__defaultOptions: {contextInherits: [], matchCatchAll: !1}, initialize: function (d, c) {
        if ("string" != typeof d) {
            throw new Error("Prefix not defined for Component Registry")
        }
        "object" != typeof c && (c = {}), this._options = k.extend(k.clone(this.__defaultOptions), c), this._prefix = d, this._reservedNames = [], this.__model = [], this.__lookup = {}, k.synthesize(this)
    }, addComponent: function (m, f, r, q, p) {
        var o, n = null;
        if (!this.__isReserved(m) && "string" == typeof m) {
            if ("string" == typeof q && (n = this.lookup(q)), n || "_base" === m || (n = this.lookup("_base") || this.addComponent("_base")), this.lookup(m)) {
                throw new Error("Cannot overwrite existing Component: " + m)
            }
            return"object" != typeof p && (p = {}), "undefined" == typeof p.inherits && Array.isArray(this._options.contextInherits) && (p.inherits = this._options.contextInherits), o = this.__lookup[m] = new i.Component(m, f, r, n, p), this.__addToModel(o), o
        }
        return null
    }, match: function (d) {
        var c;
        if (c = this.__matchName(d)) {
            return c
        }
        if (c = this.__matchQualifier(d)) {
            return c
        }
        if (this.options().matchCatchAll === !0) {
            if ("undefined" != typeof this.__model[1]) {
                if ("undefined" != typeof this.__model[1][0]) {
                    return this.__model[1][0]
                }
                throw new Error("Catchall Type not defined")
            }
            throw new Error("No non-_base types defined at index 1.")
        }
        return null
    }, __matchName: function (e) {
        if (!j.isElement(e)) {
            return null
        }
        var d, f;
        for (d = this.__model.length - 1; d >= 0; d--) {
            if (Array.isArray(this.__model[d])) {
                for (f = this.__model[d].length - 1; f >= 0; f--) {
                    if (j.hasClassName(e, this._prefix + this.__model[d][f].name())) {
                        return this.__model[d][f]
                    }
                }
            }
        }
        return null
    }, __matchQualifier: function (e) {
        if (!j.isElement(e)) {
            return null
        }
        var d, f;
        for (d = this.__model.length - 1; d >= 0; d--) {
            if (Array.isArray(this.__model[d])) {
                for (f = this.__model[d].length - 1; f >= 0; f--) {
                    if ("function" == typeof this.__model[d][f].qualifier && this.__model[d][f].qualifier.apply(this.__model[d][f], [e, this._prefix]) === !0) {
                        return this.__model[d][f]
                    }
                }
            }
        }
        return null
    }, __addToModel: function (b) {
        i.Component.isComponent(b) && ("undefined" == typeof this.__model[b.level()] && (this.__model[b.level()] = []), this.__model[b.level()].push(b))
    }, lookup: function (b) {
        return"string" == typeof b && "undefined" != typeof this.__lookup[b] ? this.__lookup[b] : null
    }, hasComponent: function (d) {
        var c;
        return"object" == typeof d && "function" == typeof d.name && (c = this.lookup(d.name())) ? c === d : !1
    }, reserveName: function (b) {
        if ("string" != typeof b) {
            throw new Error("Cannot reserve name: Name must be a string")
        }
        if (null !== this.lookup(b)) {
            throw new Error("Cannot reserve name: Component with name already exists.")
        }
        this.__isReserved(b) || this._reservedNames.push(b)
    }, __isReserved: function (b) {
        if ("string" == typeof b) {
            return -1 !== this._reservedNames.indexOf(b)
        }
        throw new Error("Cannot check if this name is reserved because it is not a String.")
    }}, g.exports = i
}, {"./Class": 13, "./Element": 17, "./Object": 33, "./Registry/Component": 36}], 36: [function (h, g) {
    var l = h("../Class"), k = h("../Function"), j = h("../Object"), i = l();
    i.prototype = {initialize: function (e, d, o, n, m) {
        if ("string" != typeof e) {
            throw new Error("Cannot create Component without a name")
        }
        this._name = e, this._properties = d || {}, this.qualifier = "function" == typeof o ? o : k.emptyFunction, this._parent = n, this._context = m || {}, j.synthesize(this)
    }, properties: function () {
        var b = "undefined" == typeof this._parent || null === this._parent ? {} : this._parent.properties();
        return j.extend(b, this._properties)
    }, context: function (b) {
        return this._context[b] ? this._context[b] : Array.isArray(this._context.inherits) && -1 !== this._context.inherits.indexOf[b] && this.parent() ? this.parent().context(b) : null
    }, level: function () {
        return"undefined" != typeof this._level ? this._level : "_base" === this._name ? 0 : "undefined" == typeof this._parent || "_base" === this._parent.name() ? 1 : this._parent.level() + 1
    }}, i.isComponent = function (b) {
        return b instanceof i
    }, g.exports = i
}, {"../Class": 13, "../Function": 30, "../Object": 33}], 37: [function (f, e) {
    var h = f("qs"), g = {};
    g.isString = function (b) {
        return"string" == typeof b
    }, g.toCamelCase = function (b) {
        if (!g.isString(b)) {
            throw new TypeError("Argument must be of type String.")
        }
        return b.replace(/-+(.)?/g, function (d, c) {
            return c ? c.toUpperCase() : ""
        })
    }, g.queryStringToObject = function (b) {
        if (!g.isString(b)) {
            throw new TypeError("QueryStringToObject error: argument must be a string")
        }
        return h.parse(b)
    }, g.toQueryPair = function (d, c) {
        if (!g.isString(d) || !g.isString(c)) {
            throw new TypeError("toQueryPair error: argument must be a string")
        }
        return encodeURIComponent(d) + "=" + encodeURIComponent(c)
    }, e.exports = g
}, {qs: 5}], 38: [function (g, f) {
    function j(e, d) {
        var k = e.slice(1, e.length);
        "undefined" == typeof d[k] && (d[k] = function () {
            return d[e]
        })
    }

    function i(e, d) {
        var k = e.slice(1, e.length);
        k = "set" + k.slice(0, 1).toUpperCase() + k.slice(1, k.length), "undefined" == typeof d[k] && (d[k] = function (b) {
            d[e] = b
        })
    }

    var h = {};
    h.synthesize = function (d) {
        "object" != typeof d && (d = this);
        var c;
        for (c in d) {
            d.hasOwnProperty(c) && "_" === c.charAt(0) && "_" !== c.charAt(1) && "function" != typeof d[c] && (j(c, d), i(c, d))
        }
    }, f.exports = h
}, {}], 39: [function (e, d) {
    var f = {};
    f.scrollOffsets = function () {
        return{x: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, y: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop}
    }, f.dimensions = function () {
        return{height: window.innerHeight || document.documentElement.clientHeight, width: window.innerWidth || document.documentElement.clientWidth}
    }, d.exports = f
}, {}], 40: [function (d, c) {
    c.exports = function (h) {
        var g, l, k = 65521, j = 1, i = 0;
        for (l = 0; l < h.length; l += 1) {
            g = h.charCodeAt(l), j = (j + g) % k, i = (i + j) % k
        }
        return i << 16 | j
    }
}, {}], 41: [function (f, e) {
    var h = f("./Element"), g = f("./Function");
    e.exports = function (d, c, k) {
        var j;
        if (c = h.getElementById(c), !h.isElement(c)) {
            throw"Invalid or non-existent element passed to bindEventListeners."
        }
        for (j in k) {
            if (k.hasOwnProperty(j)) {
                var i = k[j];
                "function" == typeof i ? h.addEventListener(c, j, g.bindAsEventListener(i, d)) : "string" == typeof i && h.addEventListener(c, j, g.bindAsEventListener(d[i], d))
            }
        }
    }
}, {"./Element": 17, "./Function": 30}], 42: [function (d, c) {
    c.exports = {console: window.console, document: document, window: window}
}, {}], 43: [function (g, f) {
    var j = g("./Environment/Feature/localStorageAvailable"), i = "f7c9180f-5c45-47b4-8de4-428015f096c0", h = j() && !!window.localStorage.getItem(i);
    f.exports = function (b) {
        window.console && "function" == typeof console.log && h && console.log(b)
    }
}, {"./Environment/Feature/localStorageAvailable": 28}], 44: [function (d, c) {
    c.exports = function (f) {
        var e;
        if (!(f && f.match && f.match(/\S/))) {
            throw"Attempt to create namespace with no name."
        }
        var h = f.split(/\./), g = window;
        for (e = 0; e < h.length; e++) {
            g[h[e]] = g[h[e]] || {}, g = g[h[e]]
        }
    }
}, {}], 45: [function (e, d) {
    var f = e("./String");
    d.exports = function () {
        var g = {}, c = window.location.toString().split("?")[1];
        return f.isString(c) && (g = f.queryStringToObject(c)), g
    }
}, {"./String": 37}], 46: [function (d, c) {
    c.exports = function () {
        var b = ["abbr", "article", "aside", "command", "details", "figcaption", "figure", "footer", "header", "hgroup", "mark", "meter", "nav", "output", "picture", "progress", "section", "source", "summary", "time", "video"];
        b.forEach(function (e) {
            document.createElement(e)
        })
    }
}, {}], 47: [function (d, c) {
    c.exports = function (f, e) {
        e.IE.documentMode <= 8 && (f.toArray = function (h) {
            var g, j = [], i = h.length;
            if (i > 0) {
                for (g = 0; i > g; g += 1) {
                    j.push(h[g])
                }
            }
            return j
        })
    }
}, {}], 48: [function (f, e) {
    var h = f("../../Array"), g = f("../../vendor/Sizzle");
    e.exports = function (d, c, j) {
        var i = c.IE.documentMode;
        j = j || g, 8 > i ? d.selectAll = function (k, n) {
            if ("undefined" == typeof n) {
                n = document
            } else {
                if (!d.isElement(n) && 9 !== n.nodeType && 11 !== n.nodeType) {
                    throw new TypeError("ac-base.Element.selectAll: Invalid context nodeType")
                }
            }
            if ("string" != typeof k) {
                throw new TypeError("ac-base.Element.selectAll: Selector must be a string")
            }
            if (11 === n.nodeType) {
                var m, l = [];
                return h.toArray(n.childNodes).forEach(function (b) {
                    j.matchesSelector(b, k) && l.push(b), (m = j(k, b).length > 0) && l.concat(m)
                }), l
            }
            return j(k, n)
        } : 9 > i && (d.selectAll = function (k, l) {
            if ("undefined" == typeof l) {
                l = document
            } else {
                if (!d.isElement(l) && 9 !== l.nodeType && 11 !== l.nodeType) {
                    throw new TypeError("ac-base.Element.selectAll: Invalid context nodeType")
                }
            }
            if ("string" != typeof k) {
                throw new TypeError("ac-base.Element.selectAll: Selector must be a string")
            }
            return h.toArray(l.querySelectorAll(k))
        }), 8 > i && (d.select = function (k, n) {
            if ("undefined" == typeof n) {
                n = document
            } else {
                if (!d.isElement(n) && 9 !== n.nodeType && 11 !== n.nodeType) {
                    throw new TypeError("ac-base.Element.select: Invalid context nodeType")
                }
            }
            if ("string" != typeof k) {
                throw new TypeError("ac-base.Element.select: Selector must be a string")
            }
            if (11 === n.nodeType) {
                var m, l = [];
                return h.toArray(n.childNodes).some(function (b) {
                    return j.matchesSelector(b, k) ? (l = b, !0) : (m = j(k, b).length > 0) ? (l = m[0], !0) : void 0
                }), l
            }
            return j(k, n)[0]
        }), 9 > i && (d.matchesSelector = function (l, k) {
            return j.matchesSelector(l, k)
        }, d.filterBySelector = function (l, k) {
            return j.matches(k, l)
        }), 9 > i && "function" != typeof window.getComputedStyle && (d.getStyle = function (k, o, n) {
            k = d.getElementById(k);
            var m, l;
            return n = n || k.currentStyle, n ? (o = o.replace(/-(\w)/g, d.setStyle.__camelCaseReplace), o = "float" === o ? "styleFloat" : o, "opacity" === o ? (m = k.filters["DXImageTransform.Microsoft.Alpha"] || k.filters.Alpha, m ? parseFloat(m.Opacity / 100) : 1) : (l = n[o] || null, "auto" === l ? null : l)) : void 0
        }), 8 >= i && (d.setStyle.__superSetStyle = d.setStyle.__setStyle, d.setStyle.__setStyle = function (k, n, m, l) {
            "opacity" === n ? d.setStyle.__setOpacity(k, l) : d.setStyle.__superSetStyle(k, n, m, l)
        }, d.setStyle.__setOpacity = function (l, k) {
            k = k > 1 ? 1 : 100 * (0.00001 > k ? 0 : k);
            var m = l.filters["DXImageTransform.Microsoft.Alpha"] || l.filters.Alpha;
            m ? m.Opacity = k : l.style.filter += " progid:DXImageTransform.Microsoft.Alpha(Opacity=" + k + ")"
        }), c.version < 8 && (d.getBoundingBox = function (k) {
            k = d.getElementById(k);
            var o = k.offsetLeft, n = k.offsetTop, m = k.offsetWidth, l = k.offsetHeight;
            return{top: n, right: o + m, bottom: n + l, left: o, width: m, height: l}
        })
    }
}, {"../../Array": 11, "../../vendor/Sizzle": 52}], 49: [function (d, c) {
    c.exports = function (f) {
        function e() {
            var b;
            return document.documentMode ? b = parseInt(document.documentMode, 10) : (b = 5, document.compatMode && "CSS1Compat" === document.compatMode && (b = 7)), b
        }

        f.IE = {documentMode: e()}
    }
}, {}], 50: [function (f, e) {
    function h(j, i) {
        for (var l = !1, k = j.parentNode; k !== i;) {
            if (k) {
                if (k.currentStyle.hasLayout) {
                    l = !0;
                    break
                }
                k = k.parentNode
            }
        }
        return l
    }

    var g = f("../../Element");
    e.exports = function () {
        var r, q, p, o, n, m = [], l = ("https:" === location.protocol ? "https://ssl" : "http://images") + ".apple.com", d = "g", c = "url(" + l + "/global/elements/blank." + d + "if)";
        g.selectAll("a > * img").forEach(function (b) {
            r = b.parentNode, q = g.ancestor(b, "a"), h(b, q) && b.height > 0 && b.width > 0 && (g.select("ieclickbooster", q) || (p = document.createElement("ieclickbooster"), o = g.getStyle(q, "position"), "static" === o && g.setStyle(q, {position: "relative"}), g.selectAll("> *", q).forEach(function (j) {
                var i = parseInt(j.currentStyle.zIndex, 10);
                i > 0 && m.push(i)
            }), m.sort(function (j, i) {
                return i - j
            }), n = m[0] ? m[0].toString() : "1", g.insert(p, q), g.setStyle(p, {display: "block", position: "absolute", top: "0", bottom: "0", left: "0", right: "0", background: c, cursor: "pointer", zIndex: n})))
        })
    }
}, {"../../Element": 17}], 51: [function (e, d) {
    var f = 0;
    d.exports = function () {
        return f++
    }
}, {}], 52: [function (d, c) {
    !function (bd, bc) {
        function ba(h, g, l, k) {
            for (var j = 0, i = g.length; i > j; j++) {
                aL(h, g[j], l, k)
            }
        }

        function a9(k, j, q, p, o, n) {
            var m, l = aG.setFilters[j.toLowerCase()];
            return l || aL.error(j), (k || !(m = o)) && ba(k || "*", p, m = [], o), m.length > 0 ? l(m, q, n) : []
        }

        function a8(L, K, J, I, H) {
            for (var G, F, E, D, C, B, A, z, y = 0, x = H.length, w = aj.POS, v = new RegExp("^" + w.source + "(?!" + aN + ")", "i"), e = function () {
                for (var g = 1, f = arguments.length - 2; f > g; g++) {
                    arguments[g] === bc && (G[g] = bc)
                }
            }; x > y; y++) {
                for (w.exec(""), L = H[y], D = [], E = 0, C = I; G = w.exec(L);) {
                    z = w.lastIndex = G.index + G[0].length, z > E && (A = L.slice(E, G.index), E = z, B = [K], au.test(A) && (C && (B = C), C = I), (F = an.test(A)) && (A = A.slice(0, -5).replace(au, "$&*")), G.length > 1 && G[0].replace(v, e), C = a9(A, G[1], G[2], B, C, F))
                }
                C ? (D = D.concat(C), (A = L.slice(E)) && ")" !== A ? ba(A, D, J, I) : aQ.apply(J, D)) : aL(L, K, J, I)
            }
            return 1 === x ? J : aL.uniqueSort(J)
        }

        function a7(B, A, z) {
            for (var y, x, w, v = [], u = 0, t = ar.exec(B), s = !t.pop() && !t.pop(), r = s && B.match(at) || [""], q = aG.preFilter, p = aG.filter, o = !z && A !== aX; null != (x = r[u]) && s; u++) {
                for (v.push(y = []), o && (x = " " + x); x;) {
                    s = !1, (t = au.exec(x)) && (x = x.slice(t[0].length), s = y.push({part: t.pop().replace(av, " "), captures: t}));
                    for (w in p) {
                        !(t = aj[w].exec(x)) || q[w] && !(t = q[w](t, A, z)) || (x = x.slice(t.shift().length), s = y.push({part: w, captures: t}))
                    }
                    if (!s) {
                        break
                    }
                }
            }
            return s || aL.error(B), v
        }

        function a6(g, f, j) {
            var i = f.dir, h = aS++;
            return g || (g = function (e) {
                return e === j
            }), f.first ? function (e, k) {
                for (; e = e[i];) {
                    if (1 === e.nodeType) {
                        return g(e, k) && e
                    }
                }
            } : function (e, n) {
                for (var m, l = h + "." + a1, k = l + "." + a2; e = e[i];) {
                    if (1 === e.nodeType) {
                        if ((m = e[aP]) === k) {
                            return !1
                        }
                        if ("string" == typeof m && 0 === m.indexOf(l)) {
                            if (e.sizset) {
                                return e
                            }
                        } else {
                            if (e[aP] = k, g(e, n)) {
                                return e.sizset = !0, e
                            }
                            e.sizset = !1
                        }
                    }
                }
            }
        }

        function a5(f, e) {
            return f ? function (i, h) {
                var g = e(i, h);
                return g && f(g === !0 ? i : g, h)
            } : e
        }

        function a4(h, g, l) {
            for (var k, j, i = 0; k = h[i]; i++) {
                aG.relative[k.part] ? j = a6(j, aG.relative[k.part], g) : (k.captures.push(g, l), j = a5(j, aG.filter[k.part].apply(null, k.captures)))
            }
            return j
        }

        function a3(e) {
            return function (f, i) {
                for (var h, g = 0; h = e[g]; g++) {
                    if (h(f, i)) {
                        return !0
                    }
                }
                return !1
            }
        }

        var a2, a1, a0, aZ, aY, aX = bd.document, aW = aX.documentElement, aV = "undefined", aU = !1, aT = !0, aS = 0, aR = [].slice, aQ = [].push, aP = ("sizcache" + Math.random()).replace(".", ""), aN = "[\\x20\\t\\r\\n\\f]", aE = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])", aC = "(?:[\\w#_-]|[^\\x00-\\xa0]|\\\\.)", aB = "([*^$|!~]?=)", aA = "\\[" + aN + "*(" + aE + "+)" + aN + "*(?:" + aB + aN + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + aC + "+)|)|)" + aN + "*\\]", az = ":(" + aE + "+)(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|(.*))\\)|)", ay = ":(nth|eq|gt|lt|first|last|even|odd)(?:\\((\\d*)\\)|)(?=[^-]|$)", ax = aN + "*([\\x20\\t\\r\\n\\f>+~])" + aN + "*", aw = "(?=[^\\x20\\t\\r\\n\\f])(?:\\\\.|" + aA + "|" + az.replace(2, 7) + "|[^\\\\(),])+", av = new RegExp("^" + aN + "+|((?:^|[^\\\\])(?:\\\\.)*)" + aN + "+$", "g"), au = new RegExp("^" + ax), at = new RegExp(aw + "?(?=" + aN + "*,|$)", "g"), ar = new RegExp("^(?:(?!,)(?:(?:^|,)" + aN + "*" + aw + ")*?|" + aN + "*(.*?))(\\)|$)"), aq = new RegExp(aw.slice(19, -6) + "\\x20\\t\\r\\n\\f>+~])+|" + ax, "g"), ap = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/, ao = /[\x20\t\r\n\f]*[+~]/, an = /:not\($/, am = /h\d/i, al = /input|select|textarea|button/i, ak = /\\(?!\\)/g, aj = {ID: new RegExp("^#(" + aE + "+)"), CLASS: new RegExp("^\\.(" + aE + "+)"), NAME: new RegExp("^\\[name=['\"]?(" + aE + "+)['\"]?\\]"), TAG: new RegExp("^(" + aE.replace("[-", "[-\\*") + "+)"), ATTR: new RegExp("^" + aA), PSEUDO: new RegExp("^" + az), CHILD: new RegExp("^:(only|nth|last|first)-child(?:\\(" + aN + "*(even|odd|(([+-]|)(\\d*)n|)" + aN + "*(?:([+-]|)" + aN + "*(\\d+)|))" + aN + "*\\)|)", "i"), POS: new RegExp(ay, "ig"), needsContext: new RegExp("^" + aN + "*[>+~]|" + ay, "i")}, ai = {}, ah = [], ag = {}, af = [], ae = function (e) {
            return e.sizzleFilter = !0, e
        }, ad = function (e) {
            return function (f) {
                return"input" === f.nodeName.toLowerCase() && f.type === e
            }
        }, aJ = function (e) {
            return function (f) {
                var g = f.nodeName.toLowerCase();
                return("input" === g || "button" === g) && f.type === e
            }
        }, bf = function (f) {
            var e = !1, h = aX.createElement("div");
            try {
                e = f(h)
            } catch (g) {
            }
            return h = null, e
        }, aD = bf(function (f) {
            f.innerHTML = "<select></select>";
            var e = typeof f.lastChild.getAttribute("multiple");
            return"boolean" !== e && "string" !== e
        }), be = bf(function (f) {
            f.id = aP + 0, f.innerHTML = "<a name='" + aP + "'></a><div name='" + aP + "'></div>", aW.insertBefore(f, aW.firstChild);
            var e = aX.getElementsByName && aX.getElementsByName(aP).length === 2 + aX.getElementsByName(aP + 0).length;
            return aY = !aX.getElementById(aP), aW.removeChild(f), e
        }), aK = bf(function (e) {
            return e.appendChild(aX.createComment("")), 0 === e.getElementsByTagName("*").length
        }), aF = bf(function (e) {
            return e.innerHTML = "<a href='#'></a>", e.firstChild && typeof e.firstChild.getAttribute !== aV && "#" === e.firstChild.getAttribute("href")
        }), b = bf(function (e) {
            return e.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", e.getElementsByClassName && 0 !== e.getElementsByClassName("e").length ? (e.lastChild.className = "e", 1 !== e.getElementsByClassName("e").length) : !1
        }), aL = function (r, q, p, o) {
            p = p || [], q = q || aX;
            var n, m, l, k, j = q.nodeType;
            if (1 !== j && 9 !== j) {
                return[]
            }
            if (!r || "string" != typeof r) {
                return p
            }
            if (l = aM(q), !l && !o && (n = ap.exec(r))) {
                if (k = n[1]) {
                    if (9 === j) {
                        if (m = q.getElementById(k), !m || !m.parentNode) {
                            return p
                        }
                        if (m.id === k) {
                            return p.push(m), p
                        }
                    } else {
                        if (q.ownerDocument && (m = q.ownerDocument.getElementById(k)) && aH(q, m) && m.id === k) {
                            return p.push(m), p
                        }
                    }
                } else {
                    if (n[2]) {
                        return aQ.apply(p, aR.call(q.getElementsByTagName(r), 0)), p
                    }
                    if ((k = n[3]) && b && q.getElementsByClassName) {
                        return aQ.apply(p, aR.call(q.getElementsByClassName(k), 0)), p
                    }
                }
            }
            return aI(r, q, p, o, l)
        }, aG = aL.selectors = {cacheLength: 50, match: aj, order: ["ID", "TAG"], attrHandle: {}, createPseudo: ae, find: {ID: aY ? function (f, e, h) {
            if (typeof e.getElementById !== aV && !h) {
                var g = e.getElementById(f);
                return g && g.parentNode ? [g] : []
            }
        } : function (g, f, i) {
            if (typeof f.getElementById !== aV && !i) {
                var h = f.getElementById(g);
                return h ? h.id === g || typeof h.getAttributeNode !== aV && h.getAttributeNode("id").value === g ? [h] : bc : []
            }
        }, TAG: aK ? function (f, e) {
            return typeof e.getElementsByTagName !== aV ? e.getElementsByTagName(f) : void 0
        } : function (h, g) {
            var l = g.getElementsByTagName(h);
            if ("*" === h) {
                for (var k, j = [], i = 0; k = l[i]; i++) {
                    1 === k.nodeType && j.push(k)
                }
                return j
            }
            return l
        }}, relative: {">": {dir: "parentNode", first: !0}, " ": {dir: "parentNode"}, "+": {dir: "previousSibling", first: !0}, "~": {dir: "previousSibling"}}, preFilter: {ATTR: function (e) {
            return e[1] = e[1].replace(ak, ""), e[3] = (e[4] || e[5] || "").replace(ak, ""), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
        }, CHILD: function (e) {
            return e[1] = e[1].toLowerCase(), "nth" === e[1] ? (e[2] || aL.error(e[0]), e[3] = +(e[3] ? e[4] + (e[5] || 1) : 2 * ("even" === e[2] || "odd" === e[2])), e[4] = +(e[6] + e[7] || "odd" === e[2])) : e[2] && aL.error(e[0]), e
        }, PSEUDO: function (f) {
            var e, g = f[4];
            return aj.CHILD.test(f[0]) ? null : (g && (e = ar.exec(g)) && e.pop() && (f[0] = f[0].slice(0, e[0].length - g.length - 1), g = e[0].slice(0, -1)), f.splice(2, 3, g || f[3]), f)
        }}, filter: {ID: aY ? function (e) {
            return e = e.replace(ak, ""), function (f) {
                return f.getAttribute("id") === e
            }
        } : function (e) {
            return e = e.replace(ak, ""), function (f) {
                var g = typeof f.getAttributeNode !== aV && f.getAttributeNode("id");
                return g && g.value === e
            }
        }, TAG: function (e) {
            return"*" === e ? function () {
                return !0
            } : (e = e.replace(ak, "").toLowerCase(), function (f) {
                return f.nodeName && f.nodeName.toLowerCase() === e
            })
        }, CLASS: function (f) {
            var e = ai[f];
            return e || (e = ai[f] = new RegExp("(^|" + aN + ")" + f + "(" + aN + "|$)"), ah.push(f), ah.length > aG.cacheLength && delete ai[ah.shift()]), function (g) {
                return e.test(g.className || typeof g.getAttribute !== aV && g.getAttribute("class") || "")
            }
        }, ATTR: function (f, e, g) {
            return e ? function (j) {
                var i = aL.attr(j, f), h = i + "";
                if (null == i) {
                    return"!=" === e
                }
                switch (e) {
                    case"=":
                        return h === g;
                    case"!=":
                        return h !== g;
                    case"^=":
                        return g && 0 === h.indexOf(g);
                    case"*=":
                        return g && h.indexOf(g) > -1;
                    case"$=":
                        return g && h.substr(h.length - g.length) === g;
                    case"~=":
                        return(" " + h + " ").indexOf(g) > -1;
                    case"|=":
                        return h === g || h.substr(0, g.length + 1) === g + "-"
                }
            } : function (h) {
                return null != aL.attr(h, f)
            }
        }, CHILD: function (g, f, j, i) {
            if ("nth" === g) {
                var h = aS++;
                return function (k) {
                    var e, n, m = 0, l = k;
                    if (1 === j && 0 === i) {
                        return !0
                    }
                    if (e = k.parentNode, e && (e[aP] !== h || !k.sizset)) {
                        for (l = e.firstChild; l && (1 !== l.nodeType || (l.sizset = ++m, l !== k)); l = l.nextSibling) {
                        }
                        e[aP] = h
                    }
                    return n = k.sizset - i, 0 === j ? 0 === n : n % j === 0 && n / j >= 0
                }
            }
            return function (e) {
                var k = e;
                switch (g) {
                    case"only":
                    case"first":
                        for (; k = k.previousSibling;) {
                            if (1 === k.nodeType) {
                                return !1
                            }
                        }
                        if ("first" === g) {
                            return !0
                        }
                        k = e;
                    case"last":
                        for (; k = k.nextSibling;) {
                            if (1 === k.nodeType) {
                                return !1
                            }
                        }
                        return !0
                }
            }
        }, PSEUDO: function (g, f, j, i) {
            var h = aG.pseudos[g] || aG.pseudos[g.toLowerCase()];
            return h || aL.error("unsupported pseudo: " + g), h.sizzleFilter ? h(f, j, i) : h
        }}, pseudos: {not: ae(function (f, e, h) {
            var g = aO(f.replace(av, "$1"), e, h);
            return function (i) {
                return !g(i)
            }
        }), enabled: function (e) {
            return e.disabled === !1
        }, disabled: function (e) {
            return e.disabled === !0
        }, checked: function (f) {
            var e = f.nodeName.toLowerCase();
            return"input" === e && !!f.checked || "option" === e && !!f.selected
        }, selected: function (e) {
            return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
        }, parent: function (e) {
            return !!e.firstChild
        }, empty: function (e) {
            return !e.firstChild
        }, contains: ae(function (e) {
            return function (f) {
                return(f.textContent || f.innerText || ac(f)).indexOf(e) > -1
            }
        }), has: ae(function (e) {
            return function (f) {
                return aL(e, f).length > 0
            }
        }), header: function (e) {
            return am.test(e.nodeName)
        }, text: function (f) {
            var e, g;
            return"input" === f.nodeName.toLowerCase() && "text" === (e = f.type) && (null == (g = f.getAttribute("type")) || g.toLowerCase() === e)
        }, radio: ad("radio"), checkbox: ad("checkbox"), file: ad("file"), password: ad("password"), image: ad("image"), submit: aJ("submit"), reset: aJ("reset"), button: function (f) {
            var e = f.nodeName.toLowerCase();
            return"input" === e && "button" === f.type || "button" === e
        }, input: function (e) {
            return al.test(e.nodeName)
        }, focus: function (f) {
            var e = f.ownerDocument;
            return !(f !== e.activeElement || e.hasFocus && !e.hasFocus() || !f.type && !f.href)
        }, active: function (e) {
            return e === e.ownerDocument.activeElement
        }}, setFilters: {first: function (f, e, g) {
            return g ? f.slice(1) : [f[0]]
        }, last: function (f, e, h) {
            var g = f.pop();
            return h ? f : [g]
        }, even: function (h, g, l) {
            for (var k = [], j = l ? 1 : 0, i = h.length; i > j; j += 2) {
                k.push(h[j])
            }
            return k
        }, odd: function (h, g, l) {
            for (var k = [], j = l ? 0 : 1, i = h.length; i > j; j += 2) {
                k.push(h[j])
            }
            return k
        }, lt: function (f, e, g) {
            return g ? f.slice(+e) : f.slice(0, +e)
        }, gt: function (f, e, g) {
            return g ? f.slice(0, +e + 1) : f.slice(+e + 1)
        }, eq: function (f, e, h) {
            var g = f.splice(+e, 1);
            return h ? f : g
        }}};
        aG.setFilters.nth = aG.setFilters.eq, aG.filters = aG.pseudos, aF || (aG.attrHandle = {href: function (e) {
            return e.getAttribute("href", 2)
        }, type: function (e) {
            return e.getAttribute("type")
        }}), be && (aG.order.push("NAME"), aG.find.NAME = function (f, e) {
            return typeof e.getElementsByName !== aV ? e.getElementsByName(f) : void 0
        }), b && (aG.order.splice(1, 0, "CLASS"), aG.find.CLASS = function (f, e, g) {
            return typeof e.getElementsByClassName === aV || g ? void 0 : e.getElementsByClassName(f)
        });
        try {
            aR.call(aW.childNodes, 0)[0].nodeType
        } catch (aa) {
            aR = function (f) {
                for (var e, g = []; e = this[f]; f++) {
                    g.push(e)
                }
                return g
            }
        }
        var aM = aL.isXML = function (f) {
            var e = f && (f.ownerDocument || f).documentElement;
            return e ? "HTML" !== e.nodeName : !1
        }, aH = aL.contains = aW.compareDocumentPosition ? function (f, e) {
            return !!(16 & f.compareDocumentPosition(e))
        } : aW.contains ? function (f, e) {
            var h = 9 === f.nodeType ? f.documentElement : f, g = e.parentNode;
            return f === g || !!(g && 1 === g.nodeType && h.contains && h.contains(g))
        } : function (f, e) {
            for (; e = e.parentNode;) {
                if (e === f) {
                    return !0
                }
            }
            return !1
        }, ac = aL.getText = function (g) {
            var f, j = "", i = 0, h = g.nodeType;
            if (h) {
                if (1 === h || 9 === h || 11 === h) {
                    if ("string" == typeof g.textContent) {
                        return g.textContent
                    }
                    for (g = g.firstChild; g; g = g.nextSibling) {
                        j += ac(g)
                    }
                } else {
                    if (3 === h || 4 === h) {
                        return g.nodeValue
                    }
                }
            } else {
                for (; f = g[i]; i++) {
                    j += ac(f)
                }
            }
            return j
        };
        aL.attr = function (f, e) {
            var h, g = aM(f);
            return g || (e = e.toLowerCase()), aG.attrHandle[e] ? aG.attrHandle[e](f) : aD || g ? f.getAttribute(e) : (h = f.getAttributeNode(e), h ? "boolean" == typeof f[e] ? f[e] ? e : null : h.specified ? h.value : null : null)
        }, aL.error = function (e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }, [0, 0].sort(function () {
            return aT = 0
        }), aW.compareDocumentPosition ? a0 = function (f, e) {
            return f === e ? (aU = !0, 0) : (f.compareDocumentPosition && e.compareDocumentPosition ? 4 & f.compareDocumentPosition(e) : f.compareDocumentPosition) ? -1 : 1
        } : (a0 = function (t, s) {
            if (t === s) {
                return aU = !0, 0
            }
            if (t.sourceIndex && s.sourceIndex) {
                return t.sourceIndex - s.sourceIndex
            }
            var r, q, p = [], o = [], n = t.parentNode, m = s.parentNode, l = n;
            if (n === m) {
                return aZ(t, s)
            }
            if (!n) {
                return -1
            }
            if (!m) {
                return 1
            }
            for (; l;) {
                p.unshift(l), l = l.parentNode
            }
            for (l = m; l;) {
                o.unshift(l), l = l.parentNode
            }
            r = p.length, q = o.length;
            for (var k = 0; r > k && q > k; k++) {
                if (p[k] !== o[k]) {
                    return aZ(p[k], o[k])
                }
            }
            return k === r ? aZ(t, o[k], -1) : aZ(p[k], s, 1)
        }, aZ = function (f, e, h) {
            if (f === e) {
                return h
            }
            for (var g = f.nextSibling; g;) {
                if (g === e) {
                    return -1
                }
                g = g.nextSibling
            }
            return 1
        }), aL.uniqueSort = function (f) {
            var e, g = 1;
            if (a0 && (aU = aT, f.sort(a0), aU)) {
                for (; e = f[g]; g++) {
                    e === f[g - 1] && f.splice(g--, 1)
                }
            }
            return f
        };
        var aO = aL.compile = function (i, g, n) {
            var m, l, k, j = ag[i];
            if (j && j.context === g) {
                return j.dirruns++, j
            }
            for (l = a7(i, g, n), k = 0; m = l[k]; k++) {
                l[k] = a4(m, g, n)
            }
            return j = ag[i] = a3(l), j.context = g, j.runs = j.dirruns = 0, af.push(i), af.length > aG.cacheLength && delete ag[af.shift()], j
        };
        aL.matches = function (f, e) {
            return aL(f, null, null, e)
        }, aL.matchesSelector = function (f, e) {
            return aL(e, null, null, [f]).length > 0
        };
        var aI = function (F, E, D, C, B) {
            F = F.replace(av, "$1");
            var A, z, y, x, w, v, u, m, l, f = F.match(at), H = F.match(aq), G = E.nodeType;
            if (aj.POS.test(F)) {
                return a8(F, E, D, C, f)
            }
            if (C) {
                A = aR.call(C, 0)
            } else {
                if (f && 1 === f.length) {
                    if (H.length > 1 && 9 === G && !B && (f = aj.ID.exec(H[0]))) {
                        if (E = aG.find.ID(f[1], E, B)[0], !E) {
                            return D
                        }
                        F = F.slice(H.shift().length)
                    }
                    for (m = (f = ao.exec(H[0])) && !f.index && E.parentNode || E, l = H.pop(), v = l.split(":not")[0], y = 0, x = aG.order.length; x > y; y++) {
                        if (u = aG.order[y], f = aj[u].exec(v)) {
                            if (A = aG.find[u]((f[1] || "").replace(ak, ""), m, B), null == A) {
                                continue
                            }
                            v === l && (F = F.slice(0, F.length - l.length) + v.replace(aj[u], ""), F || aQ.apply(D, aR.call(A, 0)));
                            break
                        }
                    }
                }
            }
            if (F) {
                for (z = aO(F, E, B), a1 = z.dirruns, null == A && (A = aG.find.TAG("*", ao.test(F) && E.parentNode || E)), y = 0; w = A[y]; y++) {
                    a2 = z.runs++, z(w, E) && D.push(w)
                }
            }
            return D
        };
        aX.querySelectorAll && !function () {
            var i, h = aI, n = /'|\\/g, m = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, l = [], k = [":active"], j = aW.matchesSelector || aW.mozMatchesSelector || aW.webkitMatchesSelector || aW.oMatchesSelector || aW.msMatchesSelector;
            bf(function (e) {
                e.innerHTML = "<select><option selected></option></select>", e.querySelectorAll("[selected]").length || l.push("\\[" + aN + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), e.querySelectorAll(":checked").length || l.push(":checked")
            }), bf(function (e) {
                e.innerHTML = "<p test=''></p>", e.querySelectorAll("[test^='']").length && l.push("[*^$]=" + aN + "*(?:\"\"|'')"), e.innerHTML = "<input type='hidden'>", e.querySelectorAll(":enabled").length || l.push(":enabled", ":disabled")
            }), l = l.length && new RegExp(l.join("|")), aI = function (v, u, t, s, r) {
                if (!(s || r || l && l.test(v))) {
                    if (9 === u.nodeType) {
                        try {
                            return aQ.apply(t, aR.call(u.querySelectorAll(v), 0)), t
                        } catch (q) {
                        }
                    } else {
                        if (1 === u.nodeType && "object" !== u.nodeName.toLowerCase()) {
                            var p = u.getAttribute("id"), o = p || aP, e = ao.test(v) && u.parentNode || u;
                            p ? o = o.replace(n, "\\$&") : u.setAttribute("id", o);
                            try {
                                return aQ.apply(t, aR.call(e.querySelectorAll(v.replace(at, "[id='" + o + "'] $&")), 0)), t
                            } catch (q) {
                            } finally {
                                p || u.removeAttribute("id")
                            }
                        }
                    }
                }
                return h(v, u, t, s, r)
            }, j && (bf(function (e) {
                i = j.call(e, "div");
                try {
                    j.call(e, "[test!='']:sizzle"), k.push(aG.match.PSEUDO)
                } catch (f) {
                }
            }), k = new RegExp(k.join("|")), aL.matchesSelector = function (e, o) {
                if (o = o.replace(m, "='$1']"), !(aM(e) || k.test(o) || l && l.test(o))) {
                    try {
                        var g = j.call(e, o);
                        if (g || i || e.document && 11 !== e.document.nodeType) {
                            return g
                        }
                    } catch (f) {
                    }
                }
                return aL(o, null, null, [e]).length > 0
            })
        }(), "object" == typeof c && c.exports ? c.exports = aL : bd.Sizzle = aL
    }(window)
}, {}], 53: [function (g, f) {
    var j = g("./ac-clock/Clock"), i = g("./ac-clock/ThrottledClock"), h = g("./ac-clock/sharedClockInstance");
    h.Clock = j, h.ThrottledClock = i, f.exports = h
}, {"./ac-clock/Clock": 54, "./ac-clock/ThrottledClock": 55, "./ac-clock/sharedClockInstance": 56}], 54: [function (h, g) {
    function l() {
        j.call(this), this.lastFrameTime = null, this._animationFrame = null, this._active = !1, this._startTime = null, this._boundOnAnimationFrame = this._onAnimationFrame.bind(this)
    }

    var k, j = h("ac-event-emitter").EventEmitter, i = (new Date).getTime();
    k = l.prototype = new j(null), k.start = function () {
        this._active || this._tick()
    }, k.stop = function () {
        this._active && window.cancelAnimationFrame(this._animationFrame), this._animationFrame = null, this.lastFrameTime = null, this._active = !1
    }, k.destroy = function () {
        this.stop(), this.off();
        var b;
        for (b in this) {
            this.hasOwnProperty(b) && (this[b] = null)
        }
    }, k.isRunning = function () {
        return this._active
    }, k._tick = function () {
        this._active || (this._active = !0), this._animationFrame = window.requestAnimationFrame(this._boundOnAnimationFrame)
    }, k._onAnimationFrame = function (f) {
        var e = 0;
        null === this.lastFrameTime ? this.lastFrameTime = (new Date).getTime() - i : e = f - this.lastFrameTime;
        var n, m = 0;
        0 !== e && (m = 1000 / e), n = {time: f, delta: e, fps: m, naturalFps: m}, this.trigger("update", n), this.trigger("draw", n), this._animationFrame = null, this.lastFrameTime = f, this._active !== !1 && this._tick()
    }, g.exports = l
}, {"ac-event-emitter": 62}], 55: [function (h, g) {
    function l(d, c) {
        null !== d && (i.call(this), c = c || {}, this._fps = d || null, this._clock = c.clock || j, this._lastThrottledTime = null, this._clockEvent = null, this._clock.on("update", this._onClockUpdate, this))
    }

    var k, j = h("./sharedClockInstance"), i = h("ac-event-emitter").EventEmitter;
    k = l.prototype = new i(null), k.setFps = function (b) {
        return this._fps = b, this
    }, k.getFps = function () {
        return this._fps
    }, k.start = function () {
        return this._clock.start(), this
    }, k.stop = function () {
        return this._clock.stop(), this
    }, k.isRunning = function () {
        return this._clock.isRunning()
    }, k.destroy = function () {
        this._clock.off("update", this._onClockUpdate, this), this._clock.destroy.call(this)
    }, k._onClockUpdate = function (d) {
        null === this._lastThrottledTime && (this._lastThrottledTime = this._clock.lastFrameTime);
        var c = d.time - this._lastThrottledTime;
        if (!this._fps) {
            throw new TypeError("FPS is not defined.")
        }
        c < 1000 / this._fps || (this._clockEvent = d, this._clockEvent.delta = c, this._clockEvent.fps = 1000 / c, this._lastThrottledTime = this._clockEvent.time, this._clock.once("draw", this._onClockDraw, this), this.trigger("update", this._clockEvent))
    }, k._onClockDraw = function () {
        this.trigger("draw", this._clockEvent)
    }, g.exports = l
}, {"./sharedClockInstance": 56, "ac-event-emitter": 62}], 56: [function (e, d) {
    var f = e("./Clock");
    d.exports = new f
}, {"./Clock": 54}], 57: [function (e, d, f) {
    !function (b, c) {
        "object" == typeof f && f ? d.exports = c : "function" == typeof define && define.amd ? define(c) : b.Deferred = c
    }(this, function () {
        var t, s, r, q, p, o, n, m, l = {};
        t = {0: "pending", 1: "resolved", 2: "rejected"}, s = function (i, h) {
            var x, w, v, u, j;
            if (0 !== this._status) {
                return console && console.warn && console.warn("Trying to fulfill more than once."), !1
            }
            for (this.data = h, w = this.pending, v = w.length, x = 0; v > x; x++) {
                u = w[x], u[i] && (j = u[i](h)), "object" == typeof j && j.hasOwnProperty("then") && j.hasOwnProperty("status") ? j.then(function (b) {
                    u.deferred.resolve(b)
                }, function (b) {
                    u.deferred.reject(b)
                }, function (b) {
                    u.deferred.progress(b)
                }) : u.deferred[i](j || void 0)
            }
            return"progress" !== i && (w = []), !0
        }, o = function (g, c) {
            this.then = g, this.status = c
        }, n = o.prototype, m = function (b) {
            return b
        }, n.success = function (g, c) {
            return this.then(g.bind(c), m, m)
        }, n.fail = function (g, c) {
            return this.then(m, g.bind(c), m)
        }, n.progress = function (g, c) {
            return this.then(m, m, g.bind(c))
        }, q = function (b) {
            return"function" != typeof b ? function () {
            } : b
        }, r = function (h, g, i) {
            this.resolve = q(h), this.reject = q(g), this.progress = q(i), this.deferred = new p
        }, p = function () {
            this.pending = [], this._status = 0, this._promise = new o(this.then.bind(this), this.status.bind(this))
        }, p.prototype = {status: function () {
            return t[this._status]
        }, promise: function () {
            return this._promise
        }, progress: function (b) {
            return s.call(this, "progress", b), this._promise
        }, resolve: function (b) {
            return s.call(this, "resolve", b), 0 === this._status && (this._status = 1), this._promise
        }, reject: function (b) {
            return s.call(this, "reject", b), 0 === this._status && (this._status = 2), this._promise
        }, then: function (g, c, j) {
            var i, h;
            return h = new r(g, c, j), 0 === this._status ? this.pending.push(h) : 1 === this._status && "function" == typeof g ? (i = g(this.data), "object" == typeof i && i.hasOwnProperty("then") && i.hasOwnProperty("status") ? i.then(function (b) {
                h.deferred.resolve(b)
            }, function (b) {
                h.deferred.reject(b)
            }, function (b) {
                h.deferred.progress(b)
            }) : h.deferred.resolve(i)) : 2 === this._status && "function" == typeof c && (i = c(this.data), h.deferred.reject(i)), h.deferred.promise()
        }};
        var k = function () {
            var h, g, u, j, i;
            return h = [].slice.call(arguments), g = new p, u = 0, j = function (c) {
                u--;
                var b = h.indexOf(this);
                h[b] = c, 0 === u && g.resolve(h)
            }, i = function (b) {
                g.reject(b)
            }, h.forEach(function (b) {
                b.then && u++
            }), h.forEach(function (b) {
                b.then && b.then(j.bind(b), i)
            }), g.promise()
        };
        return p.when = k, l.Deferred = p, l
    }())
}, {}], 58: [function (e, d) {
    function f() {
    }

    f.prototype = {resolve: function () {
        return this._defer.resolve.apply(this._defer, Array.prototype.slice.call(arguments)), this.promise()
    }, reject: function () {
        return this._defer.reject.apply(this._defer, Array.prototype.slice.call(arguments)), this.promise()
    }, progress: function () {
        var b = "ac-defer.progress is deprecated since it is not part of the A+ spec. Recommend using ac-event-emitter for progress signaling";
        return console.warn(b), this._defer.progress.apply(this._defer, Array.prototype.slice.call(arguments)), this.promise()
    }, then: function () {
        return this._defer.then.apply(this._defer, Array.prototype.slice.call(arguments)), this.promise()
    }, promise: function () {
        return this._defer.promise.apply(this._defer, Array.prototype.slice.call(arguments))
    }}, d.exports = f
}, {}], 59: [function (g, f) {
    function j() {
        this._defer = new h
    }

    var i = new (g("./ac-deferred/Deferred")), h = g("smartsign-deferred").Deferred;
    j.prototype = i, f.exports.join = function () {
        return h.when.apply(null, [].slice.call(arguments))
    }, f.exports.all = function (b) {
        return h.when.apply(null, b)
    }, f.exports.Deferred = j
}, {"./ac-deferred/Deferred": 58, "smartsign-deferred": 57}], 60: [function (d, c) {
    c.exports.DOMEmitter = d("./ac-dom-emitter/DOMEmitter")
}, {"./ac-dom-emitter/DOMEmitter": 61}], 61: [function (g, f) {
    function j(b) {
        null !== b && (this.el = b, this._bindings = {}, this._eventEmitter = new h)
    }

    var i, h = g("ac-event-emitter").EventEmitter;
    i = j.prototype, i._parseEventNames = function (b) {
        return b ? b.split(" ") : [b]
    }, i._onListenerEvent = function (d, c) {
        this.trigger(d, c, !1)
    }, i._setListener = function (b) {
        this._bindings[b] = this._onListenerEvent.bind(this, b), this._addEventListener(b, this._bindings[b])
    }, i._removeListener = function (b) {
        this._removeEventListener(b, this._bindings[b]), delete this._bindings[b]
    }, i._addEventListener = function (e, d, k) {
        return this.el.addEventListener ? this.el.addEventListener(e, d, k) : this.el.attachEvent ? this.el.attachEvent("on" + e, d) : target["on" + e] = d, this
    }, i._removeEventListener = function (e, d, k) {
        return this.el.removeEventListener ? this.el.removeEventListener(e, d, k) : this.el.detachEvent("on" + e, d), this
    }, i.on = function (e, d, k) {
        return e = this._parseEventNames(e), e.forEach(function (m, l, n) {
            this.has(n) || this._setListener(n), this._eventEmitter.on(n, m, l)
        }.bind(this, d, k)), this
    }, i.off = function (k, e, m) {
        var l = Array.prototype.slice.call(arguments, 0);
        return k = this._parseEventNames(k), k.forEach(function (o, n, r, q) {
            if (0 !== r.length) {
                this._eventEmitter.off(q, o, n), this.has(q) || this._removeListener(q)
            } else {
                this._eventEmitter.off();
                var p;
                for (p in this._bindings) {
                    this._bindings.hasOwnProperty(p) && this._removeListener(p)
                }
            }
        }.bind(this, e, m, l)), this
    }, i.once = function (e, d, k) {
        return e = this._parseEventNames(e), e.forEach(function (m, l, n) {
            this.has(n) || this._setListener(n), this._eventEmitter.once.call(this, n, m, l)
        }.bind(this, d, k)), this
    }, i.has = function (b) {
        return this._eventEmitter && this._eventEmitter.has(b) ? !0 : !1
    }, i.trigger = function (e, d, k) {
        return e = this._parseEventNames(e), e.forEach(function (m, l, n) {
            this._eventEmitter.trigger(n, m, l)
        }.bind(this, d, k)), this
    }, i.destroy = function () {
        this.off(), this.el = this._eventEmitter = this._bindings = null
    }, f.exports = j
}, {"ac-event-emitter": 62}], 62: [function (d, c) {
    c.exports.EventEmitter = d("./ac-event-emitter/EventEmitter")
}, {"./ac-event-emitter/EventEmitter": 63}], 63: [function (r, q) {
    var p = "EventEmitter:propagation", o = function (b) {
        b && (this.context = b)
    }, n = o.prototype, m = function () {
        return this.hasOwnProperty("_events") || "object" == typeof this._events || (this._events = {}), this._events
    }, l = function (h, g) {
        var u = h[0], t = h[1], s = h[2];
        if ("string" != typeof u && "object" != typeof u || null === u || Array.isArray(u)) {
            throw new TypeError("Expecting event name to be a string or object.")
        }
        if ("string" == typeof u && !t) {
            throw new Error("Expecting a callback function to be provided.")
        }
        if (t && "function" != typeof t) {
            if ("object" != typeof u || "object" != typeof t) {
                throw new TypeError("Expecting callback to be a function.")
            }
            s = t
        }
        if ("object" == typeof u) {
            for (var i in u) {
                g.call(this, i, u[i], s)
            }
        }
        "string" == typeof u && (u = u.split(" "), u.forEach(function (b) {
            g.call(this, b, t, s)
        }, this))
    }, k = function (g, f) {
        var s, i, h;
        if (s = m.call(this)[g], s && 0 !== s.length) {
            for (s = s.slice(), i = 0, h = s.length; h > i && !f(s[i], i); i++) {
            }
        }
    }, j = function (f, e, h) {
        var g = -1;
        k.call(this, e, function (d, c) {
            return d.callback === h ? (g = c, !0) : void 0
        }), -1 !== g && f[e].splice(g, 1)
    };
    n.on = function () {
        var b = m.call(this);
        return l.call(this, arguments, function (e, g, f) {
            b[e] = b[e] || (b[e] = []), b[e].push({callback: g, context: f})
        }), this
    }, n.once = function () {
        return l.call(this, arguments, function (f, e, h) {
            var g = function (b) {
                e.call(h || this, b), this.off(f, g)
            };
            this.on(f, g, this)
        }), this
    }, n.off = function (g, f) {
        var s = m.call(this);
        if (0 === arguments.length) {
            this._events = {}
        } else {
            if (!g || "string" != typeof g && "object" != typeof g || Array.isArray(g)) {
                throw new TypeError("Expecting event name to be a string or object.")
            }
        }
        if ("object" == typeof g) {
            for (var i in g) {
                j.call(this, s, i, g[i])
            }
        }
        if ("string" == typeof g) {
            var h = g.split(" ");
            1 === h.length ? f ? j.call(this, s, g, f) : s[g] = [] : h.forEach(function (b) {
                s[b] = []
            })
        }
        return this
    }, n.trigger = function (e, c, f) {
        if (!e) {
            throw new Error("trigger method requires an event name")
        }
        if ("string" != typeof e) {
            throw new TypeError("Expecting event names to be a string.")
        }
        if (f && "boolean" != typeof f) {
            throw new TypeError("Expecting doNotPropagate to be a boolean.")
        }
        return e = e.split(" "), e.forEach(function (b) {
            k.call(this, b, function (d) {
                d.callback.call(d.context || this.context || this, c)
            }.bind(this)), f || k.call(this, p, function (h) {
                var g = b;
                h.prefix && (g = h.prefix + g), h.emitter.trigger(g, c)
            })
        }, this), this
    }, n.propagateTo = function (e, c) {
        var f = m.call(this);
        f[p] || (this._events[p] = []), f[p].push({emitter: e, prefix: c})
    }, n.stopPropagatingTo = function (f) {
        var c = m.call(this);
        if (!f) {
            return void (c[p] = [])
        }
        var s, i = c[p], h = i.length;
        for (s = 0; h > s; s++) {
            if (i[s].emitter === f) {
                i.splice(s, 1);
                break
            }
        }
    }, n.has = function (s, f, y) {
        var x = m.call(this), w = x[s];
        if (0 === arguments.length) {
            return Object.keys(x)
        }
        if (!f) {
            return w && w.length > 0 ? !0 : !1
        }
        for (var v = 0, u = w.length; u > v; v++) {
            var t = w[v];
            if (y && f && t.context === y && t.callback === f) {
                return !0
            }
            if (f && !y && t.callback === f) {
                return !0
            }
        }
        return !1
    }, q.exports = o
}, {}], 64: [function (h, g) {
    var l = h("./ac-browser/BrowserData"), k = /applewebkit/i, j = h("./ac-browser/IE"), i = l.create();
    i.isWebKit = function (d) {
        var c = d || window.navigator.userAgent;
        return c ? !!k.test(c) : !1
    }, i.lowerCaseUserAgent = navigator.userAgent.toLowerCase(), "IE" === i.name && (i.IE = {documentMode: j.getDocumentMode()}), g.exports = i
}, {"./ac-browser/BrowserData": 65, "./ac-browser/IE": 66}], 65: [function (f, e) {
    function h() {
    }

    var g = f("./data");
    h.prototype = {__getBrowserVersion: function (i, d) {
        if (i && d) {
            var l = g.browser.filter(function (b) {
                return b.identity === d
            })[0], k = l.versionSearch || d, j = i.indexOf(k);
            return j > -1 ? parseFloat(i.substring(j + k.length + 1)) : void 0
        }
    }, __getName: function (b) {
        return this.__getIdentityStringFromArray(b)
    }, __getIdentity: function (b) {
        return b.string ? this.__matchSubString(b) : b.prop ? b.identity : void 0
    }, __getIdentityStringFromArray: function (j) {
        for (var i, l = 0, k = j.length; k > l; l++) {
            if (i = this.__getIdentity(j[l])) {
                return i
            }
        }
    }, __getOS: function (b) {
        return this.__getIdentityStringFromArray(b)
    }, __getOSVersion: function (i, d) {
        if (i && d) {
            var m = g.os.filter(function (b) {
                return b.identity === d
            })[0], l = m.versionSearch || d, k = new RegExp(l + " ([\\d_\\.]+)", "i"), j = i.match(k);
            return null !== j ? j[1].replace(/_/g, ".") : void 0
        }
    }, __matchSubString: function (i) {
        var d = i.subString;
        if (d) {
            var j = d.test ? !!d.test(i.string) : i.string.indexOf(d) > -1;
            if (j) {
                return i.identity
            }
        }
    }}, h.create = function () {
        var d = new h, c = {};
        return c.name = d.__getName(g.browser), c.version = d.__getBrowserVersion(g.versionString, c.name), c.os = d.__getOS(g.os), c.osVersion = d.__getOSVersion(g.versionString, c.os), c
    }, e.exports = h
}, {"./data": 67}], 66: [function (d, c) {
    c.exports = {getDocumentMode: function () {
        var b;
        return document.documentMode ? b = parseInt(document.documentMode, 10) : (b = 5, document.compatMode && "CSS1Compat" === document.compatMode && (b = 7)), b
    }}
}, {}], 67: [function (d, c) {
    c.exports = d(26)
}, {}], 68: [function (f, e) {
    var h = {cssPropertyAvailable: f("./ac-feature/cssPropertyAvailable"), localStorageAvailable: f("./ac-feature/localStorageAvailable")}, g = Object.prototype.hasOwnProperty;
    h.threeDTransformsAvailable = function () {
        if ("undefined" != typeof this._threeDTransformsAvailable) {
            return this._threeDTransformsAvailable
        }
        var i, d;
        try {
            return this._threeDTransformsAvailable = !1, g.call(window, "styleMedia") ? this._threeDTransformsAvailable = window.styleMedia.matchMedium("(-webkit-transform-3d)") : g.call(window, "media") && (this._threeDTransformsAvailable = window.media.matchMedium("(-webkit-transform-3d)")), this._threeDTransformsAvailable || ((d = document.getElementById("supportsThreeDStyle")) || (d = document.createElement("style"), d.id = "supportsThreeDStyle", d.textContent = "@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-ms-transform-3d),(-webkit-transform-3d) { #supportsThreeD { height:3px } }", document.querySelector("head").appendChild(d)), (i = document.querySelector("#supportsThreeD")) || (i = document.createElement("div"), i.id = "supportsThreeD", document.body.appendChild(i)), this._threeDTransformsAvailable = 3 === i.offsetHeight || void 0 !== d.style.MozTransform || void 0 !== d.style.WebkitTransform), this._threeDTransformsAvailable
        } catch (j) {
            return !1
        }
    }, h.canvasAvailable = function () {
        if ("undefined" != typeof this._canvasAvailable) {
            return this._canvasAvailable
        }
        var b = document.createElement("canvas");
        return this._canvasAvailable = !("function" != typeof b.getContext || !b.getContext("2d")), this._canvasAvailable
    }, h.sessionStorageAvailable = function () {
        if ("undefined" != typeof this._sessionStorageAvailable) {
            return this._sessionStorageAvailable
        }
        try {
            "undefined" != typeof window.sessionStorage && "function" == typeof window.sessionStorage.setItem ? (window.sessionStorage.setItem("ac_browser_detect", "test"), this._sessionStorageAvailable = !0, window.sessionStorage.removeItem("ac_browser_detect", "test")) : this._sessionStorageAvailable = !1
        } catch (b) {
            this._sessionStorageAvailable = !1
        }
        return this._sessionStorageAvailable
    }, h.cookiesAvailable = function () {
        return"undefined" != typeof this._cookiesAvailable ? this._cookiesAvailable : (this._cookiesAvailable = g.call(document, "cookie") && navigator.cookieEnabled ? !0 : !1, this._cookiesAvailable)
    }, h.__normalizedScreenWidth = function () {
        return"undefined" == typeof window.orientation ? window.screen.width : window.screen.width < window.screen.height ? window.screen.width : window.screen.height
    }, h.touchAvailable = function () {
        return !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch)
    }, h.isDesktop = function () {
        return this.touchAvailable() || window.orientation ? !1 : !0
    }, h.isHandheld = function () {
        return !this.isDesktop() && !this.isTablet()
    }, h.isTablet = function () {
        return !this.isDesktop() && this.__normalizedScreenWidth() > 480
    }, h.isRetina = function () {
        var d, c = ["min-device-pixel-ratio:1.5", "-webkit-min-device-pixel-ratio:1.5", "min-resolution:1.5dppx", "min-resolution:144dpi", "min--moz-device-pixel-ratio:1.5"];
        if (void 0 !== window.devicePixelRatio) {
            if (window.devicePixelRatio >= 1.5) {
                return !0
            }
        } else {
            for (d = 0; d < c.length; d += 1) {
                if (window.matchMedia("(" + c[d] + ")").matches === !0) {
                    return !0
                }
            }
        }
        return !1
    }, h.svgAvailable = function () {
        return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")
    }, e.exports = h
}, {"./ac-feature/cssPropertyAvailable": 69, "./ac-feature/localStorageAvailable": 70}], 69: [function (h, g) {
    var l = null, k = null, j = null, i = null;
    g.exports = function (r) {
        switch (null === l && (l = document.createElement("browserdetect").style), null === k && (k = ["-webkit-", "-moz-", "-o-", "-ms-", "-khtml-", ""]), null === j && (j = ["Webkit", "Moz", "O", "ms", "Khtml", ""]), null === i && (i = {}), r = r.replace(/([A-Z]+)([A-Z][a-z])/g, "$1\\-$2").replace(/([a-z\d])([A-Z])/g, "$1\\-$2").replace(/^(\-*webkit|\-*moz|\-*o|\-*ms|\-*khtml)\-/, "").toLowerCase()) {
            case"gradient":
                if (void 0 !== i.gradient) {
                    return i.gradient
                }
                r = "background-image:";
                var q = "gradient(linear,left top,right bottom,from(#9f9),to(white));", p = "linear-gradient(left top,#9f9, white);";
                return l.cssText = (r + k.join(q + r) + k.join(p + r)).slice(0, -r.length), i.gradient = -1 !== l.backgroundImage.indexOf("gradient"), i.gradient;
            case"inset-box-shadow":
                if (void 0 !== i["inset-box-shadow"]) {
                    return i["inset-box-shadow"]
                }
                r = "box-shadow:";
                var o = "#fff 0 1px 1px inset;";
                return l.cssText = k.join(r + o), i["inset-box-shadow"] = -1 !== l.cssText.indexOf("inset"), i["inset-box-shadow"];
            default:
                var n, f, e, d = r.split("-"), c = d.length;
                if (d.length > 0) {
                    for (r = d[0], f = 1; c > f; f += 1) {
                        r += d[f].substr(0, 1).toUpperCase() + d[f].substr(1)
                    }
                }
                if (n = r.substr(0, 1).toUpperCase() + r.substr(1), void 0 !== i[r]) {
                    return i[r]
                }
                for (e = j.length - 1; e >= 0; e -= 1) {
                    if (void 0 !== l[j[e] + r] || void 0 !== l[j[e] + n]) {
                        return i[r] = !0, !0
                    }
                }
                return !1
        }
    }
}, {}], 70: [function (e, d) {
    var f = null;
    d.exports = function () {
        return null === f && (f = !(!window.localStorage || null === window.localStorage.non_existent)), f
    }
}, {}], 71: [function (e, d) {
    var f = e("./ac-experience-reporter/ExperienceReporter");
    d.exports = new f, d.exports.ExperienceReporter = f
}, {"./ac-experience-reporter/ExperienceReporter": 73}], 72: [function (f, e) {
    var h = function (d, c) {
        return this._data = d, this._environment = c, this.experienceObject = this._matchExperienceToEnvironment() || {}, this.experience = this.experienceObject.type || "static", this
    }, g = h.prototype;
    g._matchExperienceToEnvironment = function () {
        var d = !1, c = this._filterByEnvironment();
        return c.length > 0 && (d = 1 === c.length ? c[0] : this._filterBySpecificity(c)), d
    }, g._filterByEnvironment = function () {
        var b = this._data.filter(function (i) {
            var d = !1;
            for (var j in i) {
                if ("type" !== j && i.hasOwnProperty(j) && (d = "min_viewport_width" === j || "min_viewport_height" === j ? this._environment[j] >= i[j] : i[j] === this._environment[j], !d)) {
                    break
                }
            }
            return d
        }, this);
        return b
    }, g._filterBySpecificity = function (j) {
        var i = j, l = 0, k = [];
        return i.forEach(function (d) {
            var c = Object.keys(d).length;
            l = c > l ? c : l
        }), i.forEach(function (d) {
            var c = Object.keys(d).length;
            c === l && k.push(d)
        }), k[0]
    }, e.exports = h
}, {}], 73: [function (i, h) {
    function n() {
        this._environment = this._setEnvironment()
    }

    var m = i("./ExperienceObject"), l = i("ac-feature"), k = i("ac-browser"), j = n.prototype;
    j.newExperience = function (b) {
        return new m(b, this._environment)
    }, j.getEnvironment = function () {
        return this._environment
    }, j._setEnvironment = function () {
        var b = {platform: this._setPlatform(), os: k.os.toLowerCase(), os_version: parseInt(k.osVersion, 10).toString(), browser: k.name.toLowerCase(), browser_version: parseInt(k.version, 10).toString(), retina: l.isRetina(), min_viewport_width: document.documentElement.clientWidth, min_viewport_height: document.documentElement.clientHeight};
        return b
    }, j._setPlatform = function () {
        var b = "desktop";
        return l.isTablet() ? b = "tablet" : l.isHandheld() && (b = "handheld"), b
    }, h.exports = n
}, {"./ExperienceObject": 72, "ac-browser": 64, "ac-feature": 68}], 74: [function (d, c) {
    c.exports = d(68)
}, {"./ac-feature/cssPropertyAvailable": 75, "./ac-feature/localStorageAvailable": 76}], 75: [function (d, c) {
    c.exports = d(69)
}, {}], 76: [function (d, c) {
    c.exports = d(70)
}, {}], 77: [function (d, c) {
    d("ac-polyfills"), c.exports.Asset = d("./ac-asset-loader/AssetLoader/Asset"), c.exports.Asset.Ajax = d("./ac-asset-loader/AssetLoader/Asset/Ajax"), c.exports.Asset.Ajax.JSON = d("./ac-asset-loader/AssetLoader/Asset/Ajax/JSON"), c.exports.Asset.Img = d("./ac-asset-loader/AssetLoader/Asset/Img"), c.exports.Asset.Video = d("./ac-asset-loader/AssetLoader/Asset/Video"), c.exports.Asset.Video.Element = d("./ac-asset-loader/AssetLoader/Asset/Video/Element"), c.exports.Asset.Binary = d("./ac-asset-loader/AssetLoader/Asset/Binary"), c.exports.Asset.Binary.Chunk = d("./ac-asset-loader/AssetLoader/Asset/Binary/Chunk"), c.exports.AssetLoader = d("./ac-asset-loader/AssetLoader"), c.exports.AssetLoader.Queue = d("./ac-asset-loader/AssetLoader/Queue")
}, {"./ac-asset-loader/AssetLoader": 78, "./ac-asset-loader/AssetLoader/Asset": 79, "./ac-asset-loader/AssetLoader/Asset/Ajax": 80, "./ac-asset-loader/AssetLoader/Asset/Ajax/JSON": 81, "./ac-asset-loader/AssetLoader/Asset/Binary": 82, "./ac-asset-loader/AssetLoader/Asset/Binary/Chunk": 83, "./ac-asset-loader/AssetLoader/Asset/Img": 84, "./ac-asset-loader/AssetLoader/Asset/Video": 85, "./ac-asset-loader/AssetLoader/Asset/Video/Element": 86, "./ac-asset-loader/AssetLoader/Queue": 87, "ac-polyfills": 156}], 78: [function (x, w) {
    function v(e, d) {
        this.options = t.defaults(m, d || {});
        var f = this._generateAssets(e);
        this._queue = new n(f, this.options), this._timeoutDuration = this.options.timeout, this._timeout = null, this._proxyListeners()
    }

    var u, t = x("ac-object"), s = x("ac-event-emitter").EventEmitter, r = x("./AssetLoader/Asset/Ajax"), q = x("./AssetLoader/Asset/Ajax/JSON"), p = x("./AssetLoader/Asset/Img"), o = (x("./AssetLoader/Asset/Video"), x("../utils/destroy")), n = x("./AssetLoader/Queue"), m = {};
    u = v.prototype = new s, u.load = function () {
        return this._timeoutDuration && (this._timeout = window.setTimeout(this._onTimeout.bind(this), this._timeoutDuration)), this._queue.start()
    }, u._clearTimeout = function () {
        window.clearTimeout(this._timeout), this._timeout = null
    }, u.pause = function () {
        return this._clearTimeout(), this._queue.pause()
    }, u.destroy = function () {
        o(this, !0)
    }, u._onTimeout = function () {
        this._queue.abort(), this._queue.destroy(), this.trigger("timeout")
    }, u._generateAssets = function (d) {
        void 0 === this._boundGenerateAsset && (this._boundGenerateAsset = this._generateAsset.bind(this)), d = [].concat(d);
        var c = d.map(this._boundGenerateAsset);
        return c
    }, u._generateAsset = function (d, c) {
        return v.isValidAsset(d) ? (d.index = c, d) : "string" != typeof d || "" === d ? null : d.match(/\.json$/) ? new q(d, c) : d.match(/\.(xml|txt)$/) ? new r(d, c) : new p(d, c)
    }, u._proxyListeners = function () {
        this._boundOnResolved = this._onResolved.bind(this), this._boundOnRejected = this._onRejected.bind(this), this._boundOnProgress = this._onProgress.bind(this), this._queue.on("resolved", this._boundOnResolved), this._queue.on("rejected", this._boundOnRejected), this._queue.on("progress", this._boundOnProgress)
    }, u._onResolved = function (b) {
        this._clearTimeout(), this.trigger("loaded", b)
    }, u._onRejected = function (b) {
        this.trigger("error", b)
    }, u._onProgress = function (b) {
        this.trigger("progress", b)
    }, v.isValidAsset = function (b) {
        return !(!b || "function" != typeof b.load || "function" != typeof b.destroy)
    }, v.isValidAssetLoader = function (b) {
        return !(!b || "function" != typeof b.load || "function" != typeof b.pause || "function" != typeof b.destroy)
    }, w.exports = v
}, {"../utils/destroy": 88, "./AssetLoader/Asset/Ajax": 80, "./AssetLoader/Asset/Ajax/JSON": 81, "./AssetLoader/Asset/Img": 84, "./AssetLoader/Asset/Video": 85, "./AssetLoader/Queue": 87, "ac-event-emitter": 62, "ac-object": 124}], 79: [function (h, g) {
    function l(d, c) {
        this.src = d, this.index = c, this.data = null, this._boundOnLoad = this._onLoad.bind(this), this._boundOnError = this._onError.bind(this)
    }

    var k, j = (h("ac-deferred").Deferred, h("ac-event-emitter").EventEmitter), i = h("../../utils/destroy");
    k = l.prototype = new j, k.load = function () {
        this._load()
    }, k.destroy = function () {
        i(this)
    }, k._load = function () {
        this.data = {src: this.src}, window.setTimeout(this._onLoad.bind(this), 20)
    }, k._onLoad = function () {
        this.trigger("loaded", this)
    }, k._onError = function () {
        this.trigger("error", this.data)
    }, g.exports = l
}, {"../../utils/destroy": 88, "ac-deferred": 59, "ac-event-emitter": 62}], 80: [function (i, h) {
    function n() {
        j.apply(this, arguments)
    }

    var m, l = i("ac-ajax"), k = i("ac-object"), j = i("../Asset");
    m = n.prototype = k.create(j.prototype), m._load = function () {
        l.get({url: this.src}).then(this._boundOnLoad, this._boundOnError)
    }, m._onLoad = function (b) {
        this.data = b.response, j.prototype._onLoad.call(this)
    }, h.exports = n
}, {"../Asset": 79, "ac-ajax": 2, "ac-object": 124}], 81: [function (h, g) {
    function l() {
        i.apply(this, arguments)
    }

    var k, j = h("ac-object"), i = h("../Ajax");
    k = l.prototype = j.create(i.prototype), k._onLoad = function (d) {
        try {
            i.prototype._onLoad.call(this, {response: JSON.parse(d.response)})
        } catch (c) {
            this._onError(c)
        }
    }, g.exports = l
}, {"../Ajax": 80, "ac-object": 124}], 82: [function (r, q) {
    function p(d, c) {
        l.apply(this, arguments), this.options = n.defaults(k, c || {}), this._totalSize = null, this._rangeObjects = {}, this._contentType = null, this._request = null, this._numLoaded = 0, this._numRanges = 0
    }

    var o = r("ac-ajax"), n = r("ac-object"), m = r("./Binary/Chunk"), l = r("./../Asset"), k = {chunkSize: 1048576}, j = p.prototype = n.create(l.prototype);
    j.pause = function () {
        var b;
        null !== this._request && this._request.xhr.abort();
        for (b in this._rangeObjects) {
            this._rangeObjects[b].isLoaded() === !1 && this._rangeObjects[b].pause()
        }
    }, j._load = function () {
        void 0 === this._boundQueueRangeRequests && (this._boundQueueRangeRequests = this._queueRangeRequests.bind(this)), null === this._totalSize ? this._getMetaData().then(this._boundQueueRangeRequests) : this._queueRangeRequests()
    }, j._getOrCreateRangeObject = function (f) {
        var e, h, g = this._rangeObjects[f.toString()];
        return void 0 === g && (e = this.options.chunkSize - 1, h = f + e, h > this._totalSize && (e = null), g = this._rangeObjects[f.toString()] = new m(this.src, {start: f, length: e}), this._numRanges += 1), g
    }, j._onRangeLoad = function () {
        this._numLoaded += 1, this._numLoaded === this._numRanges && this._afterAllChunksLoaded()
    }, j._queueRangeRequests = function () {
        for (var d, c = 0; c < this._totalSize; c += this.options.chunkSize) {
            d = this._getOrCreateRangeObject(c), d.on("loaded", this._onRangeLoad, this), d.load()
        }
    }, j._afterAllChunksLoaded = function () {
        var e, d = [];
        for (var f in this._rangeObjects) {
            d.push(this._rangeObjects[f].data)
        }
        e = new Blob(d, {type: this._contentType}), this.trigger("loaded", e)
    }, j._afterHeadRequest = function (b) {
        this._totalSize = parseInt(b.getResponseHeader(["Content-Length"])), this._contentType = b.getResponseHeader(["Content-Type"]), this._request = null
    }, j._getMetaData = function () {
        return this._boundAfterHeadRequest || (this._boundAfterHeadRequest = this._afterHeadRequest.bind(this)), this._request = o.create({method: "HEAD", url: this.src, timeout: 2000}), this._request.send().then(this._boundAfterHeadRequest, this._boundOnError)
    }, q.exports = p
}, {"./../Asset": 79, "./Binary/Chunk": 83, "ac-ajax": 2, "ac-object": 124}], 83: [function (j, i) {
    function p(d, c) {
        l.apply(this, arguments), this.options = m.defaults(k, c || {}), this._request = null, this.data = null
    }

    var o, n = j("ac-ajax"), m = j("ac-object"), l = j("../../Asset"), k = {start: 0, length: null};
    o = p.prototype = m.create(l.prototype), o.pause = function () {
        null !== this._request && (this._request.xhr.abort(), this._request = null)
    }, o.isLoaded = function () {
        return null !== this.data
    }, o._load = function () {
        this._request = n.create({url: this.src + "?" + this._buildQueryString(), method: "get", timeout: 30000, headers: [
            {name: "Range", value: this._buildRangeString()}
        ]}), this._request.xhr.responseType = "arraybuffer", this._request.send().then(this._boundOnLoad)
    }, o._onLoad = function (b) {
        this.data = b.response, this._request = null, l.prototype._onLoad.call(this, this.data)
    }, o._buildRangeString = function () {
        var b = "bytes=" + this.options.start + "-";
        return null !== this.options.length && (b += this.options.start + this.options.length), b
    }, o._buildQueryString = function () {
        var b = this.options.start.toString();
        return void 0 !== this.options.length && (b += this.options.start + this.options.length), b
    }, i.exports = p
}, {"../../Asset": 79, "ac-ajax": 2, "ac-object": 124}], 84: [function (h, g) {
    function l() {
        i.apply(this, arguments)
    }

    var k, j = h("ac-object"), i = h("../Asset");
    k = l.prototype = j.create(i.prototype), k._load = function () {
        var b = new Image;
        this.data = b, this._boundOnLoad = this._onLoad.bind(this), b.onload = this._boundOnLoad, b.onerror = this._boundOnError, b.src = this.src
    }, g.exports = l
}, {"../Asset": 79, "ac-object": 124}], 85: [function (t, s) {
    function r(d, c) {
        m.apply(this, arguments), this.options = o.defaults(k, c || {}), this._binary = this.options.binary || this._createAssetType()
    }

    var q, p = t("ac-feature"), o = t("ac-object"), n = t("./Binary"), m = t("../Asset"), l = t("./Video/Element"), k = {chunkSize: 1048576, forceElementLoading: !1};
    q = r.prototype = o.create(m.prototype), q._canUseBlob = function () {
        return void 0 !== window.Blob && void 0 !== window.URL && "function" == typeof window.URL.createObjectURL && p.isDesktop() === !0
    }, q._createAssetType = function () {
        return this._canUseBlob() && this.options.forceElementLoading !== !0 ? new n(this.src, this.options) : new l(this.src, this.options)
    }, q._load = function () {
        this._binary.on("loaded", this._boundOnLoad), this._binary.on("error", this._boundOnError), this._binary.load()
    }, q._onLoad = function (d) {
        var c = d;
        d instanceof window.Blob && (c = this.options.element, c || (c = document.createElement("video")), c.getAttribute("type") !== d.type && c.setAttribute("type", d.type), c.src = window.URL.createObjectURL(d)), m.prototype._onLoad.call(this, c)
    }, q.pause = function () {
        this._binary.pause()
    }, q.destroy = function () {
        this._binary.destroy(), m.prototype.destroy.call(this)
    }, s.exports = r
}, {"../Asset": 79, "./Binary": 82, "./Video/Element": 86, "ac-feature": 74, "ac-object": 124}], 86: [function (r, q) {
    function p(d, c) {
        l.apply(this, arguments), this.options = n.defaults(k, c || {}), this._boundOnVideoProgress = null, this._boundOnTimeUpdate = null, this._boundOnCanPlayThrough = null
    }

    var o = r("ac-feature"), n = r("ac-object"), m = r("./../../../../utils/round"), l = r("./../../Asset"), k = {}, j = p.prototype = n.create(l.prototype);
    j._onVideoProgress = function () {
        this.data && this.data.buffered.length > 0 && m(this.data.buffered.end(0), 4) === m(this.data.duration, 4) && (this._unbindEvent("canplaythrough", this._boundOnCanPlayThrough), this._unbindEvent("timeupdate", this._boundOnTimeUpdate), this._unbindEvent("progress", this._boundOnVideoProgress), this._boundOnVideoProgress = null, this.data.muted = !1, this._onLoad())
    }, j._onTimeUpdate = function () {
        this.data.pause(), this.data.currentTime = 0, this.data.removeEventListener("timeupdate", this._boundOnTimeUpdate), this._boundOnTimeUpdate = null
    }, j._onCanPlayThrough = function () {
        null === this._boundOnTimeUpdate && (this._boundOnTimeUpdate = this._onTimeUpdate.bind(this)), o.isDesktop() && (this.data.addEventListener("timeupdate", this._boundOnTimeUpdate), this.data.play()), this._unbindEvent("canplaythrough", this._boundOnCanPlayThrough), this._boundOnCanPlayThrough = null
    }, j._load = function () {
        this.data = this.options.element, this.data || (this.data = document.createElement("video")), this.data.muted = !0, this.options.type && this.data.setAttribute("type", this.options.type), null === this._boundOnVideoProgress && (this._boundOnVideoProgress = this._onVideoProgress.bind(this), this._boundOnCanPlayThrough = this._onCanPlayThrough.bind(this), this.data.addEventListener("progress", this._boundOnVideoProgress), this.data.addEventListener("canplaythrough", this._boundOnCanPlayThrough)), this.data.setAttribute("preload", "auto"), this.data.src = this.src, this.data.load()
    }, j._unbindEvent = function (d, c) {
        "function" == typeof c && this.data.removeEventListener(d, c)
    }, j.pause = function () {
        this._unbindEvent("canplaythrough", this._boundOnCanPlayThrough), this._unbindEvent("timeupdate", this._boundOnTimeUpdate), this._unbindEvent("progress", this._boundOnVideoProgress), this._boundOnVideoProgress = null, this._boundOnCanPlayThrough = null, this._boundOnTimeUpdate = null, this.data.removeAttribute("src"), this.data = void 0, this.trigger("pause")
    }, q.exports = p
}, {"./../../../../utils/round": 89, "./../../Asset": 79, "ac-feature": 74, "ac-object": 124}], 87: [function (r, q) {
    function p(d, c) {
        this.options = n.defaults(j, c || {}), this._queue = d, this._active = [], this._allowedThreads = this.options.threads, this._availableThreads = this._allowedThreads, this._deferred = new m, this._data = [], this.paused = !0, this.loaded = !1, this.promise = this._deferred.promise()
    }

    var o, n = r("ac-object"), m = r("ac-deferred").Deferred, l = r("ac-event-emitter").EventEmitter, k = r("../../utils/destroy"), j = {threads: 4};
    o = p.prototype = new l, o.start = function () {
        var d, c = this._availableThreads;
        for (this.paused = !1, c > this._queue.length && (c = this._queue.length), d = 1; c >= d; d++) {
            this._startNewThread()
        }
        return this.promise
    }, o.pause = function () {
        this.paused = !0;
        var b = [];
        this._active.forEach(function (d, e) {
            "function" == typeof d.pause && (this._queue.unshift(d), this._releaseThread(), d.off("loaded"), d.off("error"), d.pause(), b.push(e))
        }, this), b.forEach(function (c) {
            this._active.splice(c, 1)
        }, this)
    }, o.destroy = function () {
        this.pause(), k(this)
    }, o._startNewThread = function () {
        var e = this._queue.shift();
        if (this._occupyThread(), e && "function" == typeof e.load) {
            var d = function (c) {
                this._onProgress(c), this._active.splice(this._active.indexOf(e), 1), e.off("error", f)
            }, f = function () {
                this._onError(), e.off("loaded", d)
            };
            e.once("loaded", d, this), e.once("error", f, this), e.load()
        } else {
            this._onError()
        }
        this._active.push(e)
    }, o._onResolved = function () {
        return this._errored ? !1 : (this._deferred.resolve(this._data), void this.trigger("resolved", this._data))
    }, o._onError = function (b) {
        return this._errored ? !1 : (this._errored = !0, this._deferred.reject(b), void this.trigger("rejected", b))
    }, o.abort = function () {
        this._deferred.reject()
    }, o._onProgress = function (b) {
        return this._errored ? !1 : (this._releaseThread(), this._data[b.index] = b.data, this.trigger("progress", b.data), void (this._queue.length <= 0 ? this._availableThreads >= this._allowedThreads && this._onResolved() : this.paused || this._errored || this._startNewThread()))
    }, o._occupyThread = function () {
        if (this._availableThreads--, this._availableThreads < 0) {
            throw"AssetLoader.Queue: Available thread count cannot be negative."
        }
    }, o._releaseThread = function () {
        if (this._availableThreads++, this._availableThreads > this._allowedThreads) {
            throw"AssetLoader.Queue: Available thread count cannot be more than allowed thread amount."
        }
    }, q.exports = p
}, {"../../utils/destroy": 88, "ac-deferred": 59, "ac-event-emitter": 62, "ac-object": 124}], 88: [function (d, c) {
    c.exports = function (f, e) {
        "function" == typeof f.off && f.off(), window.setTimeout(function () {
            var b;
            for (b in f) {
                f.hasOwnProperty(b) && (e && f[b] && "function" == typeof f[b].destroy && f[b].destroy(), f[b] = null)
            }
        })
    }
}, {}], 89: [function (d, c) {
    c.exports = function (f, e) {
        return Math.round(f * Math.pow(10, e)) / Math.pow(10, e)
    }
}, {}], 90: [function (e, d) {
    var f = e("./ac-ajax/Ajax");
    d.exports = new f, d.exports.Ajax = f
}, {"./ac-ajax/Ajax": 91}], 91: [function (f, e) {
    var h = f("ac-deferred").Deferred, g = function () {
    };
    g.prototype = {_Deferred: h, _defaults: {timeout: 5000}, _addReadyStateChangeHandler: function (b) {
        b.xhr.onreadystatechange = function () {
            4 === b.xhr.readyState && (clearTimeout(b.timeout), b.xhr.status >= 200 && b.xhr.status < 300 ? b.deferred.resolve(b.xhr) : b.deferred.reject(b.xhr))
        }
    }, _addTimeout: function (d, c) {
        c && (d.timeout = setTimeout(function () {
            d.xhr.abort(), d.deferred.reject()
        }, c))
    }, _extend: function () {
        for (var d = 1; d < arguments.length; d++) {
            for (var c in arguments[d]) {
                arguments[d].hasOwnProperty(c) && (arguments[0][c] = arguments[d][c])
            }
        }
        return arguments[0]
    }, _getOptions: function (d, c) {
        return this._extend({}, this._defaults, c, d)
    }, _sendRequest: function (i) {
        var c = this._validateConfiguration(i);
        if (c) {
            throw c
        }
        var j = {xhr: new XMLHttpRequest};
        return j.deferred = new h, j.xhr.open(i.method, i.url), this._setRequestHeaders(j, i.headers), this._addTimeout(j, i.timeout), this._addReadyStateChangeHandler(j), j.xhr.send(i.data), j.deferred.promise()
    }, _setRequestHeaders: function (d, c) {
        c && c.forEach(function (i) {
            d.xhr.setRequestHeader(i.name, i.value)
        })
    }, _validateConfiguration: function (i) {
        if (!i) {
            return"Must provide a configuration object"
        }
        var d = [], j = i.headers;
        if (i.url || d.push("Must provide a url"), j) {
            if (!Array.isArray(j)) {
                return"Must provide an array of headers"
            }
            this._validateHeaders(j, d)
        }
        return d.join(", ")
    }, _validateHeaders: function (j, i) {
        for (var l = 0, k = j.length; k > l; l++) {
            if (!j[l].hasOwnProperty("name") || !j[l].hasOwnProperty("value")) {
                i.push("Must provide a name and value key for all headers");
                break
            }
        }
    }, checkURL: function (b) {
        return b = this._getOptions({method: "head"}, b), this._sendRequest(b)
    }, get: function (b) {
        return b = this._getOptions({method: "get"}, b), this._sendRequest(b)
    }, post: function (b) {
        return b = this._getOptions({method: "post"}, b), this._sendRequest(b)
    }}, e.exports = g
}, {"ac-deferred": 59}], 92: [function (d, c) {
    c.exports.playerFactory = d("./ac-flow-x/flow/playerFactory"), c.exports.Flow = d("./ac-flow-x/flow/FlowController"), c.exports.SyncPlayer = d("./ac-flow-x/flow/SyncPlayer"), c.exports.MaskedFlow = d("./ac-flow-x/flow/MaskedFlow")
}, {"./ac-flow-x/flow/FlowController": 94, "./ac-flow-x/flow/MaskedFlow": 96, "./ac-flow-x/flow/SyncPlayer": 98, "./ac-flow-x/flow/playerFactory": 121}], 93: [function (z, y) {
    function x(d, c) {
        s.call(this), this._compositor = d, this.options = c || {}, this.gotoFrame
    }

    var w, v = !1, u = z("ac-deferred").Deferred, t = z("ac-deferred").all, s = z("ac-event-emitter").EventEmitter, r = z("./compositor/decorator/Keyframe"), q = z("./compositor/decorator/Superframe"), p = z("./compositor/decorator/SuperKeyframe"), o = z("./compositor/decorator/Cache"), n = z("./compositor/decorator/Benchmark");
    return w = x.prototype = new s(null), w._gotoImageFrame = function (b) {
        return this._rendering ? (new u).resolve() : this._currentFrame === b ? (new u).resolve() : (this._rendering = !0, v && console.groupCollapsed("gotoFrame:" + b + " currentFrame:" + this._currentFrame), this._compositor.compositeFrames(this._currentFrame, b).then(function () {
            this._rendering = !1, this._currentFrame = b, v && console.groupEnd()
        }.bind(this)))
    }, w._gotoBinaryFrame = function (b) {
        return this._currentFrame === b ? (new u).resolve() : this._compositor.compositeFrames(this._currentFrame, b).then(function (c) {
            c && this._compositor.applyBinaryFrame(c), this._currentFrame = b, this.trigger("composite")
        }.bind(this))
    }, w.init = function (d) {
        var c;
        return"CANVAS" === d.nodeName ? c = d : (c = document.createElement("canvas"), d.appendChild(c)), "binary" === this.options.renderType ? this.gotoFrame = this._gotoBinaryFrame : "default" === this.options.renderType && (this.gotoFrame = this._gotoImageFrame), this._compositor.init(c).then(function (b) {
            return t([this._compositor.createDiffRender(b).then(this._decorateCompositor.bind(this))])
        }.bind(this))
    }, w._decorateCompositor = function () {
        var e = this._compositor, d = this._compositor._diffRender.flowData, f = this._compositor.canvas;
        return"binary" === this.options.renderType || (d.superframeFrequency && (e = new q(e, d.superframeFrequency)), 3 === d.version && (e = new r(e)), 3 === d.version && d.superframeFrequency && (e = new p(e)), this.options.keyframeCache && (e = new o(e, this.options.keyframeCache)), this.options.benchmark && (e = new n(e))), e === this._compositor ? (new u).resolve() : (this._compositor = e, this._compositor.init(f))
    }, "function" != typeof Object.defineProperties ? function () {
    } : (Object.defineProperties(w, {_currentFrame: {value: 0, enumerable: !1, writable: !0}, frameCount: {get: function () {
        return this._compositor.frameCount
    }, enumerable: !0}}), void (y.exports = x))
}, {"./compositor/decorator/Benchmark": 101, "./compositor/decorator/Cache": 102, "./compositor/decorator/Keyframe": 103, "./compositor/decorator/SuperKeyframe": 104, "./compositor/decorator/Superframe": 105, "ac-deferred": 59, "ac-event-emitter": 62}], 94: [function (v, u) {
    var t, s = v("./Flow"), r = v("./Player"), q = v("./LoadController"), p = v("./compositor/BinaryCompositor"), o = v("./compositor/Sequence"), n = {fileFormat: "jpg", baseName: "flow", imageUrlPattern: "###", startframeFileFormat: null, endframeFileFormat: null, basePath: null, manifestPath: null, manifestFileFormat: "json", diffPath: null, framePath: null}, m = {superframes: !1, reversable: !1, keyframeCache: 8, benchmark: !1, preload: !0, multithread: !1, preventDraw: !1, renderType: "default"}, l = function (d, c) {
        d = d || {}, c = c || {}, this._flow = null, this._compositor = null, this._oader = null, this.options = this._setDefaults(d, m), this._dataOptions = this._setDefaults(c, n), this.options.element || (this.options.element = document.createElement("canvas")), this._flow = this._createFlow(this._compositor, this.options, this._dataOptions), r.call(this, this.options.element, this._flow), this.options.preload && this.load()
    };
    t = l.prototype = new r(null), t.destroy = function () {
        this.pause(), this.off(), this._flow.off(), this._flow = this._nullProperties(this._flow), this._nullProperties(this)
    }, t._nullProperties = function (d) {
        var c;
        for (c in d) {
            d.hasOwnProperty(c) && (d[c] = null)
        }
        return d
    }, t._createFlow = function (f, d, j) {
        var h = this._assembleAssetPaths(j), g = [h.startframe, h.endframe];
        return this.loader = new q(this, h.manifest, g, h.imageUrlPattern), this._compositor = "binary" === d.renderType ? new p(g, h.imageUrlPattern, this.loader, d.multithread, d.preventDraw) : new o(g, h.imageUrlPattern, this.loader), new s(this._compositor, d)
    }, t._assembleAssetPaths = function (i) {
        var h = i.basePath ? this._forceTrailingSlash(i.basePath) : null, y = i.framePath ? this._forceTrailingSlash(i.framePath) : null, x = i.diffPath ? this._forceTrailingSlash(i.diffPath) : null, w = i.manifestPath ? this._forceTrailingSlash(i.manifestPath) : null, k = i.baseName + "_", j = {};
        return j.startframe = (y || h) + k + "startframe." + (i.startframeFileFormat || i.fileFormat), j.endframe = (y || h) + k + "endframe." + (i.endframeFileFormat || i.fileFormat), j.imageUrlPattern = (x || h) + k + i.imageUrlPattern + "." + i.fileFormat, j.manifest = (w || h) + k + "manifest." + i.manifestFileFormat, j
    }, t._forceTrailingSlash = function (b) {
        return b.lastIndexOf("/") !== b.length - 1 && (b += "/"), b
    }, t._setDefaults = function (e, d) {
        var f;
        for (f in d) {
            d.hasOwnProperty(f) && "undefined" == typeof e[f] && (e[f] = d[f])
        }
        return e
    }, u.exports = l
}, {"./Flow": 93, "./LoadController": 95, "./Player": 97, "./compositor/BinaryCompositor": 99, "./compositor/Sequence": 100}], 95: [function (r, q) {
    var p, o = r("ac-asset-loader").AssetLoader, n = r("ac-event-emitter").EventEmitter, m = r("./data/provider/Async"), l = r("ac-deferred").Deferred, k = (r("ac-deferred").all, {start: "start", pause: "pause", error: "error", complete: "loaded", destroy: "destroy"}), j = function (f, e, h, g) {
        this._flow = f, this._manifestUrl = e, this._keyframeUrls = h, this._imageUrlPattern = g, this.state = {manifestLoaded: !1, keyframesLoaded: !1, diffsLoaded: !1, diffCountLoaded: 0, totalDiffs: null}, this.assets = {keyframes: null, manifest: null, diffs: null}, this._promises = {}, this._loaders = {}, this._activeLoaders = [], this._resumeQueue = [], this._paused = !0, this._shouldPause = !1, this._boundOnManifestLoaded = this._onManifestLoaded.bind(this), this._boundOnKeyframesLoaded = this._onKeyframesLoaded.bind(this), this._boundOnDiffsLoaded = this._onDiffsLoaded.bind(this), this._boundOnManifestAndKeyframesLoaded = this._onManifestAndKeyframesLoaded.bind(this), this._boundOnComplete = this._onComplete.bind(this)
    };
    p = j.prototype = new n(null), p.setManifestUrl = function (b) {
        return this._manifestUrl = b, this
    }, p.setKeyframeUrls = function (b) {
        return this._keyframeUrls = b, this
    }, p.setImageUrlPattern = function (b) {
        return this._imageUrlPattern = b, this
    }, p.load = function () {
        return this._paused && (this._activeLoaders.length > 0 || this._resumeQueue.length > 0) ? void this._resume() : void this._flow.load().then(this._boundOnComplete)
    }, p.pause = function () {
        this._shouldPause = !0;
        var d, c = this._activeLoaders.length;
        for (d = 0; c > d; d++) {
            this._activeLoaders[d].pause()
        }
        this._paused = !0
    }, p.destroy = function () {
        var e, d, f;
        this.trigger(k.destroy), this.off();
        for (e in this._loaders) {
            this._loaders.hasOwnProperty(e)
        }
        for (d in this._promises) {
            this._promises.hasOwnProperty(d) && this._promises[d].reject()
        }
        for (f in this) {
            this.hasOwnProperty(f) && (this[f] = null)
        }
    }, p._resume = function () {
        this._shouldPause = !1;
        var f, e = this._activeLoaders.length;
        for (f = 0; e > f; f++) {
            this._activeLoaders[f].load()
        }
        var h, g = this._resumeQueue.length;
        for (h = 0; g > h; h++) {
            this._resumeQueue[h].call(this)
        }
        this._resumeQueue = [], this._paused = !1
    }, p.loadManifest = function () {
        this._promises.manifest = this._promises.manifest || new l;
        var b = this._promises.manifest.promise();
        return this._shouldPause ? (this._resumeQueue.push(this.loadManifest), b) : this.assets.manifest ? this._promises.manifest.resolve(this.assets.manifest) : (this._paused = !1, this._loaders.manifest = new m({url: this._getManifestAssetsData()}), this._activeLoaders.push(this._loaders.manifest), this._loaders.manifest.load().then(this._boundOnManifestLoaded), b)
    }, p.loadKeyframes = function () {
        this._promises.keyframes = this._promises.keyframes || new l;
        var b = this._promises.keyframes.promise();
        return this._shouldPause ? (this._resumeQueue.push(this.loadKeyframes), b) : this.assets.keyframes ? this._promises.keyframes.resolve(this.assets.keyframes) : (this._paused = !1, this._loaders.keyframes = new o(this._getKeyframesAssetsData()), this._activeLoaders.push(this._loaders.keyframes), this._loaders.keyframes.load().then(this._boundOnKeyframesLoaded), b)
    }, p.loadDiffs = function () {
        this._promises.diffs = this._promises.diffs || new l;
        var b = this._promises.diffs.promise();
        return this._shouldPause ? (this._resumeQueue.push(this.loadDiffs), b) : this.assets.diffs ? this._promises.diffs.resolve(this.assets.diffs) : (this._paused = !1, this._activeLoader = this._loaders.diffs = new o(this._getDiffsAssetsData()), this._activeLoaders.push(this._loaders.diffs), this._loaders.diffs.load().then(this._boundOnDiffsLoaded), b)
    }, p._getManifestAssetsData = function () {
        return this._manifestUrl
    }, p._getKeyframesAssetsData = function () {
        return this._keyframeUrls
    }, p._getDiffsAssetsData = function () {
        var g, f, s = this.assets.manifest.imagesRequired, i = [], h = this._imageUrlPattern.match(/#/g).length;
        for (g = 1; s >= g; g++) {
            f = "0000" + g, f = f.substring(f.length - h), i.push(this._imageUrlPattern.replace(/#{2,}/g, f))
        }
        return i
    }, p._onManifestLoaded = function (b) {
        this.assets.manifest = b, this.state.manifestLoaded = !0, this._paused = !0, this._removeFromActiveLoaders(this._loaders.manifest), this._promises.manifest.resolve(this.assets.manifest)
    }, p._onKeyframesLoaded = function (b) {
        this.assets.keyframes = b, this.state.keyframeLoaded = !0, this._paused = !0, this._removeFromActiveLoaders(this._loaders.keyframes), this._promises.keyframes.resolve(this.assets.keyframes)
    }, p._onDiffsLoaded = function (b) {
        this.assets.diffs = b, this.state.diffsLoaded = !0, this._paused = !0, this._removeFromActiveLoaders(this._loaders.diffs), this._promises.diffs.resolve(this.assets.diffs)
    }, p._onManifestAndKeyframesLoaded = function () {
        return this.state.diffsLoaded || this.loadDiffs(), this._promises.diffs
    }, p._removeFromActiveLoaders = function (e) {
        var d, f = this._activeLoaders.length;
        for (d = 0; f > d; d++) {
            if (this._activeLoaders[d] === e) {
                return void this._activeLoaders.splice(d, 1)
            }
        }
    }, p._onComplete = function () {
        this.trigger(k.complete)
    }, q.exports = j
}, {"./data/provider/Async": 113, "ac-asset-loader": 77, "ac-deferred": 59, "ac-event-emitter": 62}], 96: [function (r, q) {
    function p(f, e, u, t, s, i) {
        u = this._setDefaultOptions(u), t = this._setDefaultOptions(t), this.flow = new n(f, u, s), this.mask = new n(e, t, i), m.apply(this, [this.flow, this.mask]), this._flowDefer = null, this._maskDefer = null, this._boundOnSyncRender = this._onSyncRender.bind(this), this._boundOnFlowTimeUpdate = this._onFlowTimeUpdate.bind(this), this._boundOnMaskTimeUpdate = this._onMaskTimeUpdate.bind(this), this.flow._flow.on("composite", this._boundOnFlowTimeUpdate), this.mask._flow.on("composite", this._boundOnMaskTimeUpdate), this._bindSyncRender()
    }

    var o, n = r("./FlowController"), m = r("./SyncPlayer"), l = r("ac-deferred").Deferred, k = r("ac-deferred").all, j = {preventDraw: !0, renderType: "binary"};
    o = p.prototype = new m(null), o._setDefaultOptions = function (d) {
        d = d || {};
        var c;
        for (c in j) {
            j.hasOwnProperty(c) && "undefined" == typeof d[c] && (d[c] = j[c])
        }
        return d
    }, o._bindSyncRender = function () {
        this._flowDefer = new l, this._maskDefer = new l, k([this._flowDefer, this._maskDefer]).then(this._boundOnSyncRender)
    }, o._onFlowTimeUpdate = function () {
        this._flowDefer && this._flowDefer.resolve()
    }, o._onMaskTimeUpdate = function () {
        this._maskDefer && this._maskDefer.resolve()
    }, o._onSyncRender = function () {
        this._flowDefer = this._maskDefer = null, this._applyMask(), this._bindSyncRender()
    }, o._applyMask = function () {
        if (this.flow._compositor.imageData) {
            var f, e = this.flow._compositor.imageData.data, h = this.mask._compositor.imageData.data, g = e.length;
            for (f = 0; g > f; f += 4) {
                e[f + 3] = h[f]
            }
            this.flow._compositor.applyBinaryFrame({buf8: e}, !0)
        }
    }, q.exports = p
}, {"./FlowController": 94, "./SyncPlayer": 98, "ac-deferred": 59}], 97: [function (i, h) {
    function n(d, c) {
        this._flow = c, this._domEmitter = new j(d), this._frameRate = 30, this.element = d, this.paused = !0, this.loop = !1, this._boundAdvanceTimeToGlobal = this._advanceToTimeGlobal.bind(this), this._onBoundGlobalTimeUpdate = this._onGlobalTimeUpdate.bind(this), this._onBoundLocalTimeUpdate = this._onLocalTimeUpdate.bind(this)
    }

    var m, l = !1, k = i("ac-deferred").Deferred, j = i("ac-dom-emitter").DOMEmitter;
    return m = n.prototype, m._timeToFrame = function (d) {
        var c;
        return c = Math.round(d / this.duration * this._flow.frameCount), c %= this._flow.frameCount + 1, 0 > c ? this._flow.frameCount + c : c
    }, m._advanceToTimeGlobal = function (d) {
        this._prevTime = this._prevTime || d, this._currentTime += (d - this._prevTime) / 1000 * this.playbackRate, this._prevTime = d, this._pauseAfterRender = !1;
        var c = this._timeToFrame(this._currentTime);
        return this.loop ? this._currentTime = (this.duration + this._currentTime) % this.duration : this.playbackRate > 0 && this._currentTime > this.duration ? (c = this._flow.frameCount, this._currentTime = this.duration, this._pauseAfterRender = !0) : this.playbackRate < 0 && this._currentTime < 0 && (c = 0, this._currentTime = 0, this._pauseAfterRender = !0), this.paused || this.seeking ? (new k).reject() : this._flow.gotoFrame(c).then(this._onBoundGlobalTimeUpdate)
    }, m._onGlobalTimeUpdate = function () {
        this.trigger("timeupdate"), this._pauseAfterRender ? (this.paused = !0, this.trigger("ended")) : this._requestAnimationFrame = window.requestAnimationFrame(this._boundAdvanceTimeToGlobal)
    }, m._onLocalTimeUpdate = function () {
        this.seeking = !1, this.trigger("timeupdate"), this.trigger("seeked"), this._requestAnimationFrame = window.requestAnimationFrame(this._boundAdvanceTimeToGlobal)
    }, m._advanceToTimeLocal = function (b) {
        this.seeking || (this.seeking = !0, this.trigger("seeking"), this._currentTime = 1 * b, this._prevTime = null, window.cancelAnimationFrame(this._requestAnimationFrame), this._flow.gotoFrame(this._timeToFrame(b)).then(this._onBoundLocalTimeUpdate)), l && console.log("advance to time " + b + " from " + this._currentTime)
    }, m.load = function () {
        return this.trigger("loadstart"), this._flow.init(this.element).then(this.trigger.bind(this, "canplaythrough"))
    }, m.play = function () {
        return this.paused && (this.paused = !1, this.trigger("play"), this._prevTime = null, this._requestAnimationFrame = window.requestAnimationFrame(this._boundAdvanceTimeToGlobal)), this
    }, m.pause = function () {
        return this.paused || (this.paused = !0, window.cancelAnimationFrame(this._requestAnimationFrame), this.trigger("pause")), this
    }, m.on = function () {
        this._domEmitter.on.apply(this._domEmitter, arguments)
    }, m.once = function () {
        this._domEmitter.once.apply(this._domEmitter, arguments)
    }, m.trigger = function () {
        this._domEmitter.trigger.apply(this._domEmitter, arguments)
    }, m.off = function () {
        this._domEmitter.off.apply(this._domEmitter, arguments)
    }, m.setRenderOperation = function (b) {
        return this._flow && this._flow._compositor && this._flow._compositor._diffRender && (this._flow._compositor._diffRender.renderOperation = b), this
    }, m.setBeforeRenderOperation = function (b) {
        this._flow && this._flow._compositor && this._flow._compositor._diffRender && (this._flow._compositor._diffRender.beforeRenderOperation = b)
    }, m.setBeforeDrawOperation = function (b) {
        this._flow && this._flow._compositor && (this._flow._compositor.beforeDrawOperation = b)
    }, m.setAfterDrawOperation = function (b) {
        this._flow && this._flow._compositor && (this._flow._compositor.afterDrawOperation = b)
    }, "function" != typeof Object.defineProperties ? function () {
    } : (Object.defineProperties(m, {_currentTime: {value: 0, enumerable: !1, writable: !0}, _playbackRate: {value: 1, enumerable: !1, writable: !0}, currentTime: {get: function () {
        return 1 * this._currentTime
    }, set: m._advanceToTimeLocal, enumerable: !0}, frameRate: {get: function () {
        return this._frameRate
    }, set: function (b) {
        isFinite(b) && (this._frameRate = b, this.trigger("durationchange"))
    }, enumerable: !0}, playbackRate: {get: function () {
        return 1 * this._playbackRate
    }, set: function (b) {
        isFinite(b) && (this._playbackRate = 1 * b, this.trigger("ratechange"))
    }, enumerable: !0}, duration: {get: function () {
        return this._flow.frameCount / this.frameRate
    }, enumerable: !0}}), void (h.exports = n))
}, {"ac-deferred": 59, "ac-dom-emitter": 60}], 98: [function (h, g) {
    function l() {
        this.flows = Array.prototype.slice.call(arguments, 0)
    }

    var k, j = h("ac-deferred").Deferred, i = h("ac-deferred").all;
    k = l.prototype, k.on = function () {
        return this._each("on", arguments)
    }, k.off = function () {
        return this._each("off", arguments)
    }, k.load = function () {
        var f, e, o = new j, n = [], m = this.flows.length;
        for (f = 0; m > f; f++) {
            e = this.flows[f], n.push(e.load())
        }
        return i(n).then(o.resolve.bind(o)), o.promise()
    }, k.play = function () {
        return this._each("play", arguments)
    }, k.pause = function () {
        return this._each("pause", arguments)
    }, k.destroy = function () {
        this._each("destroy", arguments);
        var b;
        for (b in this) {
            this.hasOwnProperty(b) && (this[b] instanceof j && this[b].reject(), this[b] = null)
        }
    }, k.setRenderOperation = function () {
        return this._each("setRenderOperation", arguments)
    }, k.setBeforeRenderOperation = function () {
        return this._each("setBeforeRenderOperation", arguments)
    }, k.setBeforeDrawOperation = function () {
        return this._each("setBeforeDrawOperation", arguments)
    }, k.setAfterDrawOperation = function () {
        return this._each("setAfterDrawOperation", arguments)
    }, k._dispatchEvent = function () {
        return this._each("_dispatchEvent", arguments)
    }, k._advanceToTimeGlobal = function () {
        return this._each("_advanceToTimeGlobal", arguments)
    }, k._advanceToTimeLocal = function () {
        return this._each("_advanceToTimeLocal", arguments)
    }, k._each = function (m, f) {
        f = Array.prototype.slice.call(f, 0);
        var p, o, n = this.flows.length;
        for (p = 0; n > p; p++) {
            o = this.flows[p], o[m].apply(o, f)
        }
        return this
    }, Object.defineProperties(k, {_currentTime: {value: 0, enumerable: !1, writable: !0}, _playbackRate: {value: 1, enumerable: !1, writable: !0}, _loop: {value: !1, enumerable: !1, writable: !0}, currentTime: {get: function () {
        return 1 * this._currentTime
    }, set: k._advanceToTimeLocal, enumerable: !0}, frameRate: {get: function () {
        return this._frameRate
    }, set: function (b) {
        isFinite(b) && (this._frameRate = b, this._dispatchEvent("durationchange"))
    }, enumerable: !0}, playbackRate: {get: function () {
        return 1 * this._playbackRate
    }, set: function (b) {
        isFinite(b) && (this._playbackRate = 1 * b, this.flows.forEach(function (d, c) {
            c.playbackRate = d
        }.bind(this, this._playbackRate)))
    }, enumerable: !0}, duration: {get: function () {
        return this._flow[0].frameCount / this.frameRate
    }, enumerable: !0}, loop: {get: function () {
        return this._loop
    }, set: function (b) {
        "boolean" == typeof b && (this._loop = b, this.flows.forEach(function (d, c) {
            c.loop = d
        }.bind(this, this._loop)))
    }, enumerable: !0}}), g.exports = l
}, {"ac-deferred": 59}], 99: [function (j, i) {
    var p, o = !1, n = j("../diff/BinaryRender"), m = j("../diff/BinaryMultithreadRender"), l = j("ac-deferred").Deferred, k = function (g, f, r, q, h) {
        this._keyframes = g, this._imageUrlPattern = f, this._loadController = r, this._useMultithreading = q, this._preventDraw = h
    };
    return p = k.prototype, p._getURLObject = function () {
        return window.URL || window.webkitURL || null
    }, p._supportsMultithread = function () {
        return this._getURLObject() && window.Worker && window.Blob ? !0 : !1
    }, p._initDiffRender = function (b) {
        this._images = b, this.canvas.height = b[0].height, this.canvas.width = b[0].width, this.applyFrame(b[0])
    }, p.init = function (b) {
        return this.canvas = b || document.createElement("canvas"), this.context = b.getContext("2d"), this._loadController.loadKeyframes().then(this._initDiffRender.bind(this)).then(this._loadController.loadManifest.bind(this._loadController))
    }, p.createDiffRender = function (b) {
        return this._diffRender = this._useMultithreading && this._supportsMultithread() ? new m(b, this._imageUrlPattern) : new n(b, this._imageUrlPattern, this._loadController), this._diffRender.init()
    }, p.applyFrame = function (e) {
        var d, f = this.context;
        f.drawImage(e, 0, 0), this._diffRender && (this._diffRender.forceBinaryComposite(), d = this._diffRender.forceKeyframeRender(this.canvas, this.context), this.imageData || (this.imageData = this.context.createImageData(d.width, d.height)), this.imageData.data.set(d.buf8))
    }, p.applyBinaryFrame = function (d, c) {
        this.imageData || (this.imageData = this.context.createImageData(d.width, d.height)), this._beforeDrawOperation && (d = this._beforeDrawOperation(d)), this.imageData.data.set(d.buf8), (!this._preventDraw || c) && this.context.putImageData(this.imageData, 0, 0), this._afterDrawOperation && (d = this._afterDrawOperation(d))
    }, p.calculateRenderCount = function (e, d) {
        var f = 0;
        return Math.abs(d - e) >= d ? (e = 1, f = 1) : Math.abs(d - e) >= this.frameCount - d && this._images[1] && (e = this.frameCount - 2, f = 1), d > 0 && d < this.frameCount - 1 ? Math.abs(e - d) + f : f
    }, p.compositeFrames = function (g, d) {
        var r = new l;
        d = this.frameCount < d ? this.frameCount - 1 : 0 > d ? 0 : d, g = this.frameCount - 2 < g ? this.frameCount - 2 : 0 > g ? 0 : g;
        var q, h;
        if (Math.abs(d - g) >= d) {
            return g = 1, o && console.log("applying start keyframe"), this.applyFrame(this._images[0]), r.resolve()
        }
        if (Math.abs(d - g) >= this.frameCount - d && this._images[1]) {
            return g = this.frameCount - 2, o && console.log("applying end keyframe"), this.applyFrame(this._images[1]), r.resolve()
        }
        if (q = g > d ? -1 : d > g ? 1 : 0, d > 0 && d < this.frameCount - 1) {
            for (; g !== d;) {
                h = this._diffRender.renderDiff(this.canvas, g, this.context), g += q
            }
        }
        return h ? h.then(r.resolve.bind(r)) : r.resolve(), r.promise()
    }, "function" != typeof Object.defineProperties ? function () {
    } : (Object.defineProperties(p, {frameCount: {get: function () {
        return this._diffRender.frames.length + 2
    }, enumerable: !0}, canvas: {get: function () {
        return this._canvas
    }, set: function (b) {
        return this._canvas = b
    }, enumerable: !0}, mainCompositor: {get: function () {
        for (var b = this; b._compositor;) {
            b = b._compositor
        }
        return b
    }, enumerable: !0}, _beforeDrawOperation: {value: void 0, enumerable: !1, writable: !0}, _afterDrawOperation: {value: void 0, enumerable: !1, writable: !0}, beforeDrawOperation: {get: function () {
        return this._beforeDrawOperation
    }, set: function (b) {
        return"function" == typeof b ? void (this._beforeDrawOperation = b) : void (this._beforeDrawOperation = void 0)
    }, enumerable: !0}, afterDrawOperation: {get: function () {
        return this._afterDrawOperation
    }, set: function (b) {
        return"function" == typeof b ? void (this._afterDrawOperation = b) : void (this._afterDrawOperation = void 0)
    }, enumerable: !0}}), void (i.exports = k))
}, {"../diff/BinaryMultithreadRender": 115, "../diff/BinaryRender": 116, "ac-deferred": 59}], 100: [function (i, h) {
    function n(f, e, o, g) {
        this._keyframes = f, this._imageUrlPattern = e, this._loadController = o, this._renderType = g || "default"
    }

    var m, l = !1, k = i("../diff/Render"), j = i("ac-deferred").Deferred;
    return m = n.prototype, m._initDiffRender = function (b) {
        return this._images = b, this.canvas.height = b[0].height, this.canvas.width = b[0].width, this.applyFrame(b[0]), (new j).resolve()
    }, m.init = function (b) {
        return this.canvas = b || document.createElement("canvas"), this.context = b.getContext("2d"), this._loadController.loadKeyframes().then(this._initDiffRender.bind(this)).then(this._loadController.loadManifest.bind(this._loadController))
    }, m.createDiffRender = function (b) {
        return this._diffRender = new k(b, this._imageUrlPattern, this._loadController), this._diffRender.init()
    }, m.applyFrame = function (d) {
        var c = this.context;
        c.drawImage(d, 0, 0)
    }, m.calculateRenderCount = function (e, d) {
        var f = 0;
        return Math.abs(d - e) >= d ? (e = 1, f = 1) : Math.abs(d - e) >= this.frameCount - d && this._images[1] && (e = this.frameCount - 2, f = 1), d > 0 && d < this.frameCount - 1 ? Math.abs(e - d) + f : f
    }, m.compositeFrames = function (f, e) {
        var o = new j;
        e = this.frameCount < e ? this.frameCount - 1 : 0 > e ? 0 : e, f = this.frameCount - 2 < f ? this.frameCount - 2 : 0 > f ? 0 : f;
        var g;
        if (l && console.groupCollapsed("Rendering diff frames: " + f + "..." + e), Math.abs(e - f) >= e ? (f = 1, l && console.log("applying start keyframe"), this.applyFrame(this._images[0])) : Math.abs(e - f) >= this.frameCount - e && this._images[1] && (f = this.frameCount - 2, l && console.log("applying end keyframe"), this.applyFrame(this._images[1])), g = f > e ? -1 : e > f ? 1 : 0, e > 0 && e < this.frameCount - 1) {
            for (; f !== e;) {
                this._diffRender.renderDiff(this.canvas, f), f += g
            }
        }
        return l && console.groupEnd(), o.resolve(f), o.promise()
    }, "function" != typeof Object.defineProperties ? function () {
    } : (Object.defineProperties(m, {frameCount: {get: function () {
        return this._diffRender.frames.length + 2
    }, enumerable: !0}, canvas: {get: function () {
        return this._canvas
    }, set: function (b) {
        return this._canvas = b
    }, enumerable: !0}, mainCompositor: {get: function () {
        for (var b = this; b._compositor;) {
            b = b._compositor
        }
        return b
    }, enumerable: !0}}), void (h.exports = n))
}, {"../diff/Render": 118, "ac-deferred": 59}], 101: [function (g, f) {
    function j(b) {
        this._compositor = b
    }

    var i, h = g("../../../stats/Benchmark");
    return i = j.prototype, i.init = function () {
        var b = new h("init");
        return b.start(), this._compositor.init.apply(this._compositor, arguments).then(b.end.bind(b))
    }, i.applyFrame = function () {
        var b = new h("applyFrame");
        b.start(), this._compositor.applyFrame.apply(this._compositor, arguments), b.end.bind(b)
    }, i.calculateRenderCount = function () {
        return this._compositor.calculateRenderCount.apply(this._compositor, arguments)
    }, i.compositeFrames = function () {
        var b = new h("renderFrames");
        return b.start(), this._compositor.compositeFrames.apply(this._compositor, arguments).then(b.end.bind(b))
    }, "function" != typeof Object.defineProperties ? function () {
    } : (Object.defineProperties(i, {frameCount: {get: function () {
        return this._compositor.frameCount
    }, enumerable: !0}, canvas: {get: function () {
        return this._compositor.canvas
    }, set: function (b) {
        return this._compositor.canvas = b
    }, enumerable: !0}}), j.prototype = i, void (f.exports = j))
}, {"../../../stats/Benchmark": 122}], 102: [function (g, f) {
    function j(d, c) {
        this._compositor = d, this._keyframeInterval = c || 8, this._keyframes = []
    }

    var i, h = !1;
    return i = j.prototype, i._getClosestKeyframe = function (e) {
        var d = e % this._keyframeInterval, k = Math.floor(e / this._keyframeInterval) + (d > this._keyframeInterval / 2 ? 1 : 0);
        return k
    }, i._getFrameFromKeyframe = function (b) {
        return b * this._keyframeInterval
    }, i._saveKeyframe = function (e) {
        var d, k = Math.floor(e / this._keyframeInterval);
        e % this._keyframeInterval !== 0 || this._keyframes[k] || (h && console.log("saving keyframe " + e), d = document.createElement("canvas"), d.width = this._compositor.canvas.width, d.height = this._compositor.canvas.height, d.getContext("2d").drawImage(this._compositor.canvas, 0, 0), this._keyframes[k] = d)
    }, i.init = function () {
        return this._compositor.init.apply(this._compositor, arguments)
    }, i.applyFrame = function () {
        this._compositor.applyFrame.apply(this._compositor, arguments)
    }, i.calculateRenderCount = function (d, c) {
        return d = this._getFrameFromKeyframe(this._getClosestKeyframe(c)), this._compositor.calculateRenderCount(d, c) + 1
    }, i.compositeFrames = function (e, d) {
        var k = this._getClosestKeyframe(d);
        return h && console.groupCollapsed("Rendering frames: " + e + "..." + d), this._keyframes[k] && this._compositor.calculateRenderCount(e, d) > this.calculateRenderCount(e, d) ? (e = this._getFrameFromKeyframe(k), h && console.log("applying prerendered keyframe: " + e), this.applyFrame(this._keyframes[k]), this._compositor.compositeFrames(e, d).then(function () {
            h && console.groupEnd()
        })) : this._compositor.compositeFrames(e, d).then(function () {
            h && console.groupEnd()
        }, null, this._saveKeyframe.bind(this))
    }, "function" != typeof Object.defineProperties ? function () {
    } : (Object.defineProperties(i, {frameCount: {get: function () {
        return this._compositor.frameCount
    }, enumerable: !0}, canvas: {get: function () {
        return this._compositor.canvas
    }, set: function (b) {
        return this._compositor.canvas = b
    }, enumerable: !0}}), void (f.exports = j))
}, {}], 103: [function (i, h) {
    function n(b) {
        this._compositor = b, this._flowDataProvider = this.mainCompositor._loadController._loaders.manifest
    }

    var m, l = !1, k = i("../../keyframe/Render"), j = i("ac-deferred").Deferred;
    return m = n.prototype, m.init = function () {
        return this._keyframeDiffRender = new k(this._flowDataProvider._data, this.mainCompositor._imageUrlPattern), this._keyframeDiffRender.init()
    }, m.applyFrame = function () {
        return this._compositor.applyFrame.apply(this._compositor, arguments)
    }, m.applyKeyframe = function (d, c) {
        this._keyframeDiffRender.renderKeyframe(this.canvas, d, c)
    }, m.compositeFrames = function (e, d) {
        if (!this._isKeyframeDiff(d - 1)) {
            return this._compositor.compositeFrames.apply(this._compositor, arguments)
        }
        var f = new j;
        return l && console.groupCollapsed("Rendering keyframe diff image: " + (e - 1)), this.applyKeyframe(d - 1), l && console.groupEnd(), f.resolve(e - 1), f.promise()
    }, m._isKeyframeDiff = function (b) {
        return b in this._keyframeDiffRender._loader._keyframes
    }, m.calculateRenderCount = function () {
        return this._compositor.calculateRenderCount.apply(this._compositor, arguments)
    }, "function" != typeof Object.defineProperties ? function () {
    } : (Object.defineProperties(m, {frameCount: {get: function () {
        return this._compositor.frameCount
    }, enumerable: !0}, canvas: {get: function () {
        return this._compositor.canvas
    }, set: function (b) {
        return this._compositor.canvas = b
    }, enumerable: !0}, mainCompositor: {get: function () {
        return this._compositor.mainCompositor
    }, enumerable: !0}}), void (h.exports = n))
}, {"../../keyframe/Render": 120, "ac-deferred": 59}], 104: [function (h, g) {
    function l(b) {
        this._compositor = b, this._frames = this.mainCompositor._loadController._loaders.manifest._data.frames, this._superframeInterval = this.mainCompositor._diffRender.flowData.superframeFrequency
    }

    var k, j = !1, i = h("ac-deferred").Deferred;
    return k = l.prototype, k.init = function () {
        return this._compositor.init.apply(this._compositor, arguments)
    }, k.applyFrame = function () {
        return this._compositor.applyFrame.apply(this._compositor, arguments)
    }, k.applyKeyframe = function () {
        this._compositor.applyKeyframe.apply(this._compositor, arguments)
    }, k.compositeFrames = function (f, e) {
        var o, n, m = new i;
        return 1 > e || e > this.frameCount - 2 ? this._compositor.compositeFrames.apply(this._compositor, arguments) : this._isKeyframeDiff(e - 1) ? (o = 1 === Math.abs(f - e) ? !0 : !1, j && console.groupCollapsed("Drawing superKeyframe image: " + (e - 1)), this.applyKeyframe(e - 1, o), j && console.groupEnd(), m.resolve(f - 1), m.promise()) : Math.abs(e - f) > this._superframeInterval && (n = this._getShortestRender(f, e), this._isKeyframeDiff(n - 1) || 0 >= n || n >= this.frameCount - 2) ? this._compositeFromSuperKeyframe(n, e) : (j && console.log("SuperKeyframe compositor handing off to slave compositor: fromFrame:" + f + " toFrame:" + e), this._compositor.compositeFrames.apply(this._compositor, [f, e]))
    }, k._getShortestRender = function (n, m) {
        var r = this._compositor.calculateRenderCount, q = this._getClosestSuperKeyframe(m - 1), p = r.apply(this._compositor, [q, m]) + 1, o = r.apply(this._compositor, [n, m]);
        return o >= p ? q : n
    }, k._compositeFromSuperKeyframe = function (f, e) {
        var n = this.canvas.getContext("2d"), m = 0 >= f ? this.mainCompositor._images[0] : f >= this.frameCount - 2 ? this.mainCompositor._images[1] : this._frames[f - 1].image;
        return j && console.log("Drawing superKeyframe for composite base: superKeyframe " + (f - 1)), n.drawImage(m, 0, 0), this._compositor.compositeFrames.call(this._compositor, f, e)
    }, k._getClosestSuperFrame = function (b) {
        return Math.round(b / this._superframeInterval) * this._superframeInterval
    }, k._getClosestSuperKeyframe = function (n) {
        var m, r, q, p, o = this._frames.length;
        if (o + 1 > n && n > 0) {
            for (p = n - 1; p >= 0;) {
                if ("keyframe" === this._frames[p].type) {
                    m = p + 1;
                    break
                }
                p -= 1
            }
            for (p = n + 1; o - 1 >= p;) {
                if ("keyframe" === this._frames[p].type) {
                    r = p + 1;
                    break
                }
                p += 1
            }
        }
        return m = m ? m : 0, r = r ? r : this.frameCount, q = r - n > n - m ? m : r
    }, k._isKeyframeDiff = function () {
        return this._compositor._isKeyframeDiff.apply(this._compositor, arguments)
    }, "function" != typeof Object.defineProperties ? function () {
    } : (Object.defineProperties(k, {frameCount: {get: function () {
        return this._compositor.frameCount
    }, enumerable: !0}, canvas: {get: function () {
        return this._compositor.canvas
    }, set: function (b) {
        return this._compositor.canvas = b
    }, enumerable: !0}, mainCompositor: {get: function () {
        return this._compositor.mainCompositor
    }, enumerable: !0}}), void (g.exports = l))
}, {"ac-deferred": 59}], 105: [function (g, f) {
    function j(d, c) {
        this._compositor = d, this._superframeInterval = c || 4
    }

    var i, h = !1;
    return i = j.prototype, i._getClosestSuperframe = function (b) {
        return Math.round(b / this._superframeInterval) * this._superframeInterval
    }, i.init = function (b) {
        this._screenCanvas = b
    }, i.applyFrame = function () {
        this._compositor.applyFrame.apply(this._compositor, arguments)
    }, i.calculateRenderCount = function (e, d) {
        var k = this._getClosestSuperframe(e);
        return Math.abs(k - d) > this._superframeInterval / 2 ? (e = k + (e > d ? -1 : 1) * this._superframeInterval, this.calculateRenderCount(e, d) + 1) : Math.abs(k - d) + 1
    }, i.compositeFrames = function (k, e) {
        var m, l;
        return(0 >= e || e >= this.frameCount - 2) && this._compositor.compositeFrames(k, e), k > this.frameCount - 2 ? k = this.frameCount - 2 : 0 >= k && (k = 1), l = this._getClosestSuperframe(k), h && console.groupCollapsed("Rendering : " + k + "..." + e), this._compositor.calculateRenderCount(k, e) > this.calculateRenderCount(k, e) ? (h && console.groupCollapsed("Rendering (superframe) : " + l), m = this._compositor.compositeFrames(l, l).then(function () {
            h && console.groupEnd();
            var b = l + (k > e ? -1 : 1) * this._superframeInterval;
            this._compositor.compositeFrames(l, b).then(function () {
                return this.compositeFrames(b, e)
            }.bind(this))
        }.bind(this))) : (h && console.groupCollapsed("Rendering (final frames) : " + k + "..." + e), m = this._compositor.compositeFrames(k, e).then(function () {
            h && console.groupEnd()
        }.bind(this))), m.then(function () {
            h && console.groupEnd()
        }.bind(this)), m
    }, "function" != typeof Object.defineProperties ? function () {
    } : (Object.defineProperties(i, {frameCount: {get: function () {
        return this._compositor.frameCount
    }, enumerable: !0}, canvas: {get: function () {
        return this._compositor.canvas
    }, set: function (b) {
        return this._compositor.canvas = b
    }, enumerable: !0}, mainCompositor: {get: function () {
        return this._compositor.mainCompositor
    }, enumerable: !0}}), void (f.exports = j))
}, {}], 106: [function (i, h) {
    var n, m = i("ac-event-emitter").EventEmitter, l = i("./MultithreadProcess"), k = i("./MultithreadProcessInterface"), j = function (b) {
        m.call(this), this._function = b
    };
    n = j.prototype = new m(null), n.exec = function (e, d) {
        d = d || {}, this._processURL || (this._processURL = this._createThreadProcessURL(this._function)), this._process && this.terminateProcess(), this._process || (this._process = new window.Worker(this._processURL), this._process.onmessage = this._onMessage.bind(this));
        var f;
        return d.transfer && (f = [e]), this._process.postMessage(e, f), this
    }, n.run = function (g, f, q) {
        q = q || {};
        var p, o = {name: g, data: f || {}};
        q.transfer && (p = [o]), this._process.postMessage(o, p), this.trigger(g, f)
    }, n.destroy = function () {
        return this.terminateProcess(), this._function = null, this._processURL = null, this
    }, n.terminateProcess = function () {
        return this._process && (this._process.terminate(), this._process = null), this
    }, n._createThreadProcessURL = function (e) {
        var d = this._compileProcess(e), f = new window.Blob([d], {type: "text/javascript"});
        return this._getURLObject().createObjectURL(f)
    }, n._getURLObject = function () {
        return window.URL || window.webkitURL || null
    }, n._compileProcess = function (f) {
        var e = l.toString(), r = /(['|"]){{INTERFACE}}\1/, q = /(['|"]){{PROCESS}}\1/;
        e = e.replace(r, "(" + k.toString() + ")();"), e = e.replace(q, f.toString());
        var p = "(", o = ")();";
        return p + e + o
    }, n._handleTrigger = function (d, c) {
        this.trigger(d, c)
    }, n._onMessage = function (e) {
        if (e.data) {
            var d = e.data.evt, f = e.data.data;
            return"__trigger__" === d && this._handleTrigger(f.trigger, f.data), this
        }
    }, h.exports = j
}, {"./MultithreadProcess": 107, "./MultithreadProcessInterface": 108, "ac-event-emitter": 62}], 107: [function (e, d) {
    var f = function () {
        var g = "{{PROCESS}}", c = "{{INTERFACE}}";
        this.processInstance, this.onmessage = function (i, h, j) {
            j = j || {}, h.processInstance ? h.processInstance._onMessage(j.data.name, j.data.data) : h.processInstance = new i(this)
        }.bind(c, g, this)
    };
    d.exports = f
}, {}], 108: [function (e, d) {
    var f = function () {
        return{trigger: function (h, g, j) {
            var i = {trigger: h, data: g};
            this._post("__trigger__", i, j)
        }, _post: function (h, g, k) {
            k = k || {};
            var j, i = {evt: h, data: g};
            k.transfer && (j = [g]), postMessage(i, j)
        }}
    };
    d.exports = f
}, {}], 109: [function (e, d) {
    var f = function (b) {
        this._interface = b, this.trigger = function (h, g, i) {
            return this._interface.trigger(h, g, i), this
        }, this.renderFrameDiffs = function (i) {
            var h, n = i.binaryFrame, m = i.compositingData, l = i.frameData, k = i.sourceImagesData, j = l.length;
            for (h = 0; j > h; h++) {
                n = this._applyBlocksToBinaryFrame(n, l[h], k, m)
            }
            this.trigger("frameReady", n)
        }, this._applyBlocksToBinaryFrame = function (T, S, R, Q) {
            for (var P, O, N, M, L, K, J, I = S.block, H = Math.floor(I / Q.blocksPerFullDiff), G = Q.imageWidth, F = S.length, E = Q.columnsInCanvas, D = Q.canvasWidth, C = I % Q.blocksPerFullDiff, B = G / Q.blockSize, A = C % B * Q.blockSize, z = Math.floor(C / (B || 1)) * Q.blockSize, y = S.location % E * Q.blockSize, x = Math.floor(S.location / E) * Q.blockSize; F > 0;) {
                for (K = Math.min(F * Q.blockSize, D - y, G - A), J = K / Q.blockSize, N = R[H], O = 0; O < Q.blockSize; O++) {
                    for (P = 0; K > P; P++) {
                        M = (z + O) * G + (A + P), L = (x + O) * D + (y + P), T.buf32[L] = N[M]
                    }
                }
                F -= J, F > 0 && ((A += K) >= G && (A = 0, z += Q.blockSize), (C += J) >= Q.blocksPerFullDiff && (C = 0, A = 0, z = 0, H += 1, H === Q.imagesRequired - 1 && (G = Q.imageWidth)), (y += K) >= D && (y = 0, x += Q.blockSize), I += J)
            }
            return T
        }, this._onMessage = function (g, c) {
            "function" == typeof this[g] && this[g](c)
        }
    };
    d.exports = f
}, {}], 110: [function (e, d) {
    function f(g, c) {
        this.location = g, this.length = c
    }

    d.exports = f
}, {}], 111: [function (e, d) {
    function f() {
    }

    d.exports = f
}, {}], 112: [function (h, g) {
    var l, k = h("./Manifest"), j = h("./Block"), i = {parseData: function (d) {
        l = 0;
        var c = d.frames.map(this._parseFrame, this);
        return Object.create(k.prototype, {version: {value: d.version}, framecount: {value: d.frameCount}, blockSize: {value: d.blockSize}, imagesRequired: {value: d.imagesRequired}, reversible: {value: d.reversible}, superframeFrequency: {value: d.superframeFrequency}, frames: {value: c}})
    }, _valueForCharAt: function (e, d) {
        var f = e.charCodeAt(d);
        if (f > 64 && 91 > f) {
            return f - 65
        }
        if (f > 96 && 123 > f) {
            return f - 71
        }
        if (f > 47 && 58 > f) {
            return f + 4
        }
        if (43 === f) {
            return 62
        }
        if (47 === f) {
            return 63
        }
        throw"Invalid Bas64 character: " + e.charAt(d)
    }, _createNumberFromBase64Range: function (m, f, p) {
        for (var o, n = 0; p--;) {
            o = this._valueForCharAt(m, f++), n += o << 6 * p
        }
        return n
    }, _parseFrame: function (e) {
        var c, o, n, m = [], e = e.value || e;
        for (c = 0; c < e.length; c += 5) {
            n = this._createNumberFromBase64Range(e, c, 3), o = this._createNumberFromBase64Range(e, c + 3, 2), m.push(Object.create(j.prototype, {location: {value: n, enumerable: !0}, length: {value: o, enumerable: !0}, block: {value: (l += o) - o, enumerable: !0}}))
        }
        return m
    }};
    g.exports = i
}, {"./Block": 110, "./Manifest": 111}], 113: [function (h, g) {
    function l(d, c) {
        this._url = d, this._ajaxAdaptor = c || new j
    }

    var k, j = h("ac-ajax").Ajax, i = h("../processor");
    k = l.prototype, k.load = function () {
        return this._ajaxAdaptor.get(this._url).then(function (e) {
            try {
                var d = e.response || e.responseText;
                return JSON.parse(d)
            } catch (f) {
                DEBUG && console.log("Failed to parse manifest data")
            }
        }).then(function (b) {
            return this._data = b, i.parseData(b)
        }.bind(this))
    }, g.exports = l
}, {"../processor": 112, "ac-ajax": 90}], 114: [function (g, f) {
    var j, i = g("ac-deferred").Deferred, h = function (b) {
        "string" == typeof b && (b = [b]), this.srcArr = b
    };
    j = h.prototype, j._request = function (e) {
        var d = new i, k = new XMLHttpRequest;
        return k.addEventListener("load", function () {
            var b = k.response;
            d.resolve(b)
        }), k.responseType = "arrayBuffer", k.open("get", e, !0), k.send(), d.promise()
    }, j.load = function () {
        this._deferred = new i;
        var k, d = [], m = this.srcArr, l = m.length;
        for (k = 0; l > k; k++) {
            d.push(this._request(m[k]))
        }
        return i.all(d).then(function (b) {
            this._deferred.resolve(b)
        }.bind(this)), this._deferred.promise()
    }, f.exports = h
}, {"ac-deferred": 59}], 115: [function (r, q) {
    function p(d, c) {
        this.flowData = d, this.flowData.imageUrlPattern = c, this.ArrayBufferCompositor = document.createElement("canvas"), this.ArrayBufferCompositorContext = this.ArrayBufferCompositor.getContext("2d"), this.sourceImagesData = {}, this._processor = new k(j), this._processor.exec(), window.processor = this._processor
    }

    var o, n = !1, m = r("./Loader"), l = r("ac-deferred").Deferred, k = r("../compositor/multithread/MultithreadController"), j = r("../compositor/multithread/MultithreadRenderer");
    return o = p.prototype, o._storeImages = function (b) {
        return n && console.log("loaded images"), this.images = b, this._blocksPerFullDiff = b[0].width / this.flowData.blockSize * (b[0].height / this.flowData.blockSize), (new l).resolve()
    }, o._getImageDataAsArrayBuffer = function (f, e, h) {
        h = h || e, this.ArrayBufferCompositor.width = e, this.ArrayBufferCompositor.height = h, this.ArrayBufferCompositorContext.drawImage(f, 0, 0);
        var g = new Uint32Array(this.ArrayBufferCompositorContext.getImageData(0, 0, e, h).data.buffer);
        return g
    }, o._processDataConstants = function () {
        this._compositingConstants = {images: []};
        var d, c = this.images.length;
        for (d = 0; c > d; d++) {
            this._compositingConstants.images[d] = {}, this._compositingConstants.images[d].width = this.images[d].width
        }
        return(new l).resolve()
    }, o._setFrameRequirements = function (i) {
        var h, w = i[0], v = i[i.length - 1], u = this._getImageIndexOfBlock(w.block), t = this._getImageIndexOfBlock(v.block + v.length), s = {};
        for (h = u; t + 1 > h; h++) {
            s[h] = this.sourceImagesData[h] ? this.sourceImagesData[h] : this._getImageDataAsArrayBuffer(this.images[h], this.images[h].width)
        }
        return this.sourceImagesData = s, s
    }, o._getImageIndexOfBlock = function (b) {
        return Math.floor(b / this._blocksPerFullDiff)
    }, o._setCompositingData = function (e, d) {
        this._compositingData = {imageWidth: this._compositingConstants.images[0].width, canvasWidth: d.canvas.width, canvasHeight: d.canvas.height, blocksPerFullDiff: this._blocksPerFullDiff, blockSize: this.flowData.blockSize, imagesRequired: this.flowData.imagesRequired};
        var f = d.getImageData(0, 0, this._compositingData.canvasWidth, this._compositingData.canvasHeight).data;
        this._compositingData.columnsInCanvas = this._compositingData.canvasWidth / this.flowData.blockSize, this._compositingData.imageData = new Uint8ClampedArray(f)
    }, o._createBinaryFrame = function (e, d, f) {
        return{buf8: e, buf32: new Uint32Array(e.buffer), width: d, height: f}
    }, o._getBinaryImageArrayLength = function (b) {
        return b.canvasWidth
    }, o._compositeBinaryFrame = function (g, f) {
        var s, i = (g.length, new l), h = this._setFrameRequirements(g);
        return s = this._lastBinaryFrame ? this._lastBinaryFrame : this._createBinaryFrame(f.imageData, f.canvasWidth, f.canvasHeight), this._processor.run("renderFrameDiffs", {binaryFrame: s, frameData: g, compositingData: f, sourceImagesData: h}), this._processor.once("frameReady", i.resolve.bind(i)), i.promise()
    }, o._getSourceImageAs32Bit = function (b) {
        return new Uint32Array(this.sourceImagesData[b].data.buffer)
    }, o._applyBlocksToBinaryFrame = function (R, Q, P) {
        for (var O, N, M, L, K, J, I, H = Q.block, G = Math.floor(H / this._blocksPerFullDiff), F = this._compositingConstants.images[G].width, E = Q.length, D = P.columnsInCanvas, C = P.canvasWidth, B = H % this._blocksPerFullDiff, A = F / this.flowData.blockSize, z = B % A * this.flowData.blockSize, y = Math.floor(B / (A || 1)) * this.flowData.blockSize, x = Q.location % D * this.flowData.blockSize, w = Math.floor(Q.location / D) * this.flowData.blockSize; E > 0;) {
            for (J = Math.min(E * this.flowData.blockSize, C - x, F - z), I = J / this.flowData.blockSize, M = this.sourceImagesData[G], N = 0; N < this.flowData.blockSize; N++) {
                for (O = 0; J > O; O++) {
                    L = (y + N) * F + (z + O), K = (w + N) * C + (x + O), R.buf32[K] = M[L]
                }
            }
            E -= I, E > 0 && ((z += J) >= F && (z = 0, y += this.flowData.blockSize), (B += I) >= this._blocksPerFullDiff && (B = 0, z = 0, y = 0, G += 1, G === this.flowData.imagesRequired - 1 && (F = this._compositingConstants.images[G].width)), (x += J) >= C && (x = 0, w += this.flowData.blockSize), H += I)
        }
        return R
    }, o.init = function () {
        return console.log("LOADED BINARY"), n && console.log("load images"), new m(this.flowData.imageUrlPattern, this.flowData.imagesRequired).load({binary: !0}).then(this._storeImages.bind(this)).then(this._processDataConstants.bind(this))
    }, o.renderDiff = function (g, e) {
        var s = g.getContext("2d"), i = new l;
        this._compositingData || this._setCompositingData(g, s), e -= 1, n && (this._frameToRender = e);
        var h = this._compositeBinaryFrame(this.frames[e], this._compositingData);
        return h.then(function (d, c) {
            this._lastBinaryFrame = c, d.resolve(c)
        }.bind(this, i)), i.promise()
    }, o.getBinaryDataFromFlowDataBlock = function () {
    }, "function" != typeof Object.defineProperties ? function () {
    } : (Object.defineProperties(o, {frames: {get: function () {
        return this.flowData.frames
    }, set: function (b) {
        this.flowData.frames = b
    }, enumerable: !0}}), void (q.exports = p))
}, {"../compositor/multithread/MultithreadController": 106, "../compositor/multithread/MultithreadRenderer": 109, "./Loader": 117, "ac-deferred": 59}], 116: [function (h, g) {
    function l(e, d, f) {
        this.flowData = e, this.flowData.imageUrlPattern = d, this._loadController = f, this.ArrayBufferCompositor = document.createElement("canvas"), this.ArrayBufferCompositorContext = this.ArrayBufferCompositor.getContext("2d"), this.sourceImagesData = {}, this._forceBinaryComposite = !0
    }

    var k, j = !1, i = h("ac-deferred").Deferred;
    return k = l.prototype, k._storeImages = function (b) {
        return j && console.log("loaded images"), this.images = b, this._blocksPerFullDiff = b[0].width / this.flowData.blockSize * (b[0].height / this.flowData.blockSize), (new i).resolve()
    }, k._getImageDataAsArrayBuffer = function (f, e, n) {
        n = n || e, this.ArrayBufferCompositor.width !== e && (this.ArrayBufferCompositor.width = e), this.ArrayBufferCompositor.height !== n && (this.ArrayBufferCompositor.height = n), this.ArrayBufferCompositorContext.drawImage(f, 0, 0);
        var m = {buf8: this.ArrayBufferCompositorContext.getImageData(0, 0, e, n).data};
        return m.buf32 = new Uint32Array(m.buf8.buffer), m
    }, k._processDataConstants = function () {
        this._compositingConstants = {images: []};
        var d, c = this.images.length;
        for (d = 0; c > d; d++) {
            this._compositingConstants.images[d] = {}, this._compositingConstants.images[d].width = this.images[d].width
        }
        return(new i).resolve()
    }, k._setFrameRequirements = function (n) {
        var m, t = n[0], s = n[n.length - 1], r = this._getImageIndexOfBlock(t.block), q = this._getImageIndexOfBlock(s.block + s.length), p = q + 1, o = {};
        for (m = r; p > m; m++) {
            o[m] = this.sourceImagesData[m] ? this.sourceImagesData[m] : this._getImageDataAsArrayBuffer(this.images[m], this.images[m].width)
        }
        this.sourceImagesData = o
    }, k._getImageIndexOfBlock = function (b) {
        return Math.floor(b / this._blocksPerFullDiff)
    }, k._setCompositingData = function (e, d) {
        this._compositingData = {imageWidth: this._compositingConstants.images[0].width, canvasWidth: d.canvas.width, canvasHeight: d.canvas.height};
        var f = d.getImageData(0, 0, this._compositingData.canvasWidth, this._compositingData.canvasHeight).data;
        this._compositingData.columnsInCanvas = this._compositingData.canvasWidth / this.flowData.blockSize, this._compositingData.imageData = new Uint8ClampedArray(f)
    }, k._createBinaryFrame = function (e, d, f) {
        return{buf8: e, buf32: new Uint32Array(e.buffer), width: d, height: f}
    }, k._getBinaryImageArrayLength = function (b) {
        return b.canvasWidth
    }, k._compositeBinaryFrame = function (m, f) {
        var p, o = m.length;
        this._setFrameRequirements(m);
        var n;
        for (this._lastBinaryFrame && !this._forceBinaryComposite ? n = this._lastBinaryFrame : (n = this._createBinaryFrame(f.imageData, f.canvasWidth, f.canvasHeight), this._renderOperation ? (this._cleanBinaryFrame = this._cloneBinaryFrame(n), n = this.forceApplyFilter(n, f)) : this._cleanBinaryFrame && (this._cleanBinaryFrame = null), this._forceBinaryComposite = !1), this._beforeRenderOperation && (n = this._beforeRenderOperation(n)), p = 0; o > p; p++) {
            n = this._applyBlocksToBinaryFrame(n, m[p], f)
        }
        return n
    }, k._applyBlocksToBinaryFrame = function (ad, ac, ab) {
        for (var aa, Z, Y, X, W, V, U, T, S, R = this.flowData.blockSize, Q = this._blocksPerFullDiff, P = this.flowData.imagesRequired, O = ac.block, M = Math.floor(O / Q), K = this._compositingConstants.images[M].width, J = ac.length, I = ab.columnsInCanvas, H = ab.canvasWidth, G = ab.canvasHeight, F = O % Q, E = K / R, D = F % E * R, C = Math.floor(F / (E || 1)) * R, N = ac.location % I * R, L = Math.floor(ac.location / I) * R; J > 0;) {
            for (T = Math.min(J * R, H - N, K - D), S = T / R, W = this.sourceImagesData[M], Z = 0; R > Z; Z++) {
                for (aa = 0; T > aa; aa++) {
                    Y = N + aa, X = L + Z, V = (C + Z) * K + (D + aa), U = X * H + Y, this._renderOperation && (this._cleanBinaryFrame.buf32[U] = W.buf32[V], W = this._renderOperation(W, 4 * V, Y, X, H, G)), ad.buf32[U] = W.buf32[V]
                }
            }
            J -= S, J > 0 && ((D += T) >= K && (D = 0, C += R), (F += S) >= Q && (F = 0, D = 0, C = 0, M += 1, M === P - 1 && (K = this._compositingConstants.images[M].width)), (N += T) >= H && (N = 0, L += R), O += S)
        }
        return ad
    }, k._cloneBinaryFrame = function (d) {
        var c = d.buf8.buffer.slice(0);
        return{buf8: new Uint8ClampedArray(c), buf32: new Uint32Array(c), width: d.width, height: d.height}
    }, k.init = function () {
        return j && console.log("load images"), this._loadController.loadDiffs().then(this._storeImages.bind(this)).then(this._processDataConstants.bind(this))
    }, k.renderDiff = function (f, e, n) {
        var n = n || f.getContext("2d");
        (!this._compositingData || this._forceBinaryComposite) && this._setCompositingData(f, n), e -= 1, j && (this._frameToRender = e);
        var m = this._compositeBinaryFrame(this.frames[e], this._compositingData);
        return this._lastBinaryFrame = m, (new i).resolve(m)
    }, k.forceBinaryComposite = function () {
        return this._forceBinaryComposite = !0, this
    }, k.forceApplyFilter = function (n, m) {
        if (this._renderOperation) {
            var t, s, r, q = m.canvasWidth, p = m.canvasHeight, o = n.buf32.length;
            for (t = 0; o > t; t++) {
                s = t % q, r = t > 0 ? Math.floor(t / q) : 0, n = this._renderOperation(n, 4 * t, s, r, q, p)
            }
        }
        return n
    }, k.forceKeyframeRender = function (f, e) {
        this._setCompositingData(f, e);
        var n = this._compositingData, m = this._createBinaryFrame(n.imageData, n.canvasWidth, n.canvasHeight);
        return this._renderOperation && (this._cleanBinaryFrame = this._cloneBinaryFrame(m), m = this.forceApplyFilter(m, n)), m
    }, "function" != typeof Object.defineProperties ? function () {
    } : (Object.defineProperties(k, {frames: {get: function () {
        return this.flowData.frames
    }, set: function (b) {
        this.flowData.frames = b
    }, enumerable: !0}, _beforeRenderOperation: {value: void 0, enumerable: !1, writable: !0}, _renderOperation: {value: void 0, enumerable: !1, writable: !0}, beforeRenderOperation: {get: function () {
        return this._beforeRenderOperation
    }, set: function (b) {
        return"function" == typeof b ? void (this._beforeRenderOperation = b) : void (this._beforeRenderOperation = void 0)
    }, enumerable: !0}, renderOperation: {get: function () {
        return this._renderOperation
    }, set: function (b) {
        return"function" == typeof b ? (this.forceBinaryComposite(), void (this._renderOperation = b)) : (this._renderOperation = void 0, void this.forceBinaryComposite())
    }, enumerable: !0}}), void (g.exports = l))
}, {"ac-deferred": 59}], 117: [function (g, f) {
    function j(l, k) {
        var o, n, m = l.match(/#/g).length;
        if (this.imagesUrls = [], !k) {
            throw new Error("0 images provided")
        }
        for (o = 1; k >= o; o++) {
            n = "0000" + o, n = n.substring(n.length - m), this.imagesUrls.push(l.replace(/#{2,}/g, n))
        }
    }

    var i, h = g("ac-asset-loader").AssetLoader;
    g("./BinaryLoader");
    i = j.prototype, i.load = function (b) {
        return b = b || {}, new h(this.imagesUrls).load()
    }, f.exports = j
}, {"./BinaryLoader": 114, "ac-asset-loader": 77}], 118: [function (h, g) {
    function l(e, d, f) {
        this.flowData = e, this.flowData.imageUrlPattern = d, this._loadController = f
    }

    var k, j = !1, i = h("ac-deferred").Deferred;
    return k = l.prototype, k._storeImages = function (b) {
        return j && console.log("loaded images"), this.images = b, this._blocksPerFullDiff = b[0].width / this.flowData.blockSize * (b[0].height / this.flowData.blockSize), (new i).resolve()
    }, k._applyDiffRange = function (D, C) {
        for (var B, A, z = C.block, y = C.length, x = D.canvas.width / this.flowData.blockSize, w = Math.floor(z / this._blocksPerFullDiff), v = this.images[w].width, u = z % this._blocksPerFullDiff, t = v / this.flowData.blockSize, s = u % t * this.flowData.blockSize, r = Math.floor(u / (t || 1)) * this.flowData.blockSize, q = C.location % x * this.flowData.blockSize, e = Math.floor(C.location / x) * this.flowData.blockSize; y;) {
            B = Math.min(y * this.flowData.blockSize, D.canvas.width - q, v - s), A = B / this.flowData.blockSize, j && "undefined" != typeof this.renderDebugger && this._frameToRender > 0 && this.renderDebugger.registerComparison(this._frameToRender, {image: w, block: z, x: s, y: r}), D.drawImage(this.images[w], s, r, B, this.flowData.blockSize, q, e, B, this.flowData.blockSize), y -= A, y && ((s += B) >= v && (s = 0, r += this.flowData.blockSize), (u += A) >= this._blocksPerFullDiff && (u = 0, s = 0, r = 0, w += 1, w === this.flowData.imagesRequired - 1 && (v = this.images[w].width)), (q += B) >= D.canvas.width && (q = 0, e += this.flowData.blockSize), z += A)
        }
    }, k.init = function () {
        return j && console.log("load images"), this._loadController.loadDiffs().then(this._storeImages.bind(this))
    }, k.renderDiff = function (e, d) {
        var f = e.getContext("2d");
        d -= 1, j && (this._frameToRender = d, console.log("applying diff frame : " + (d + 1))), this.frames[d].forEach(function (b) {
            this._applyDiffRange(f, b)
        }.bind(this))
    }, "function" != typeof Object.defineProperties ? function () {
    } : (Object.defineProperties(k, {frames: {get: function () {
        return this.flowData.frames
    }, set: function (b) {
        this.flowData.frames = b
    }, enumerable: !0}}), void (g.exports = l))
}, {"ac-deferred": 59}], 119: [function (h, g) {
    function l(f, e) {
        var n, m = f.match(/#/g).length;
        this._keyframes = {}, f = f.replace(/([^#]+)(#+)(\..*)/, "$1key_$2$3"), this._imageUrls = [], e.frames && e.frames.forEach(function (c, d) {
            "keyframe" === c.type && (n = "0000" + d, n = n.substring(n.length - m), this._imageUrls.push(f.replace(/#+/g, n)), this._keyframes[d] = c)
        }.bind(this))
    }

    var k, j = h("ac-asset-loader").AssetLoader, i = h("ac-deferred").Deferred;
    return k = l.prototype, k.load = function () {
        return this._imageUrls.length > 0 ? new j(this._imageUrls).load() : (new i).resolve()
    }, "function" != typeof Object.defineProperties ? function () {
    } : (Object.defineProperties(k, {keyframes: {get: function () {
        return this._keyframes
    }, enumerable: !0}}), void (g.exports = l))
}, {"ac-asset-loader": 77, "ac-deferred": 59}], 120: [function (h, g) {
    function l(d, c) {
        this.flowData = d, this.flowData.imageUrlPattern = c
    }

    var k, j = !1, i = h("./Loader");
    k = l.prototype, k._storeImages = function (f) {
        var e, n = 0;
        if (f && f.length > 0) {
            j && console.log("loaded keyframe diff images");
            for (var m in this._loader._keyframes) {
                this._loader._keyframes.hasOwnProperty(m) && (e = f[n], this._loader._keyframes[m].image = e, n += 1)
            }
        }
        j && (f && 0 !== f.length || console.log("no keyframe diff images to load"))
    }, k.init = function () {
        return j && console.log("loading keyframe diff images"), this._loader = new i(this.flowData.imageUrlPattern, this.flowData), this._loader.load().then(this._storeImages.bind(this))
    }, k.renderKeyframe = function (u, t, s) {
        var r = u.getContext("2d"), q = this._loader.keyframes[t], p = q.image, o = q.x, n = q.y, m = q.width, e = q.height;
        j && (console.log("applying keyframe diff image: " + t), console.log("x:" + o + " y:" + n + " w:" + m + " h:" + e)), s === !0 ? (j && console.log("drawing superKeyframe sub-rectangle"), r.drawImage(p, o, n, m, e, o, n, m, e)) : this.flowData.reversible ? (j && console.log("drawing superKeyframe full image"), r.drawImage(p, 0, 0)) : (j && console.log("drawing keyframe full image"), r.drawImage(p, o, n, m, e))
    }, g.exports = l
}, {"./Loader": 119}], 121: [function (e, d) {
    function f(j, i, p, o, n) {
        var m, l, k;
        return n = n || {}, n = {keyframeCache: "undefined" == typeof n.keyframeCache ? 8 : n.keyframeCache, benchmark: "undefined" == typeof n.benchmark ? !1 : n.benchmark, preload: "undefined" == typeof n.preload ? !0 : n.preload, renderType: n.renderType || "default", multithread: n.multithread || !1}, i = i || [j.getAttribute("data-start-frame")], j.getAttribute("data-end-frame") && i.push(j.getAttribute("data-end-frame")), p = p || j.getAttribute("data-image-url-pattern"), k = "string" == typeof o ? new FlowDataProviderAsync(o) : new FlowDataProviderSync(o), "binary" === n.renderType ? m = new AC_BinaryCompositor(i, p, k, n.multithread) : "default" === n.renderType && (m = new AC_FlowCompositorSequence(i, p, k)), l = new AC_FlowPlayer(j, new AC_Flow(m, n)), n.preload && l.load(), l
    }

    d.exports = f
}, {}], 122: [function (f, e) {
    function h(b) {
        this.name = b
    }

    var g;
    g = h.prototype, g.start = function () {
        DEBUG && (console.log("▼▼▼ start " + this.name + " benchmark"), this.startTime = (new Date).getTime(), console.time(this.name))
    }, g.end = function () {
        DEBUG && (this.endTime = (new Date).getTime(), console.log("▲▲▲ end " + this.name + " benchmark " + (this.endTime - this.startTime) / 1000 + " sec"), console.time(this.timeEnd))
    }, e.exports = h
}, {}], 123: [function (d, c) {
    c.exports = d(5)
}, {}], 124: [function (d, c) {
    c.exports = {clone: d("./ac-object/clone"), create: d("./ac-object/create"), defaults: d("./ac-object/defaults"), extend: d("./ac-object/extend"), getPrototypeOf: d("./ac-object/getPrototypeOf"), isDate: d("./ac-object/isDate"), isEmpty: d("./ac-object/isEmpty"), isRegExp: d("./ac-object/isRegExp"), toQueryParameters: d("./ac-object/toQueryParameters")}
}, {"./ac-object/clone": 125, "./ac-object/create": 126, "./ac-object/defaults": 127, "./ac-object/extend": 128, "./ac-object/getPrototypeOf": 129, "./ac-object/isDate": 130, "./ac-object/isEmpty": 131, "./ac-object/isRegExp": 132, "./ac-object/toQueryParameters": 133}], 125: [function (e, d) {
    var f = e("./extend");
    d.exports = function (b) {
        return f({}, b)
    }
}, {"./extend": 128}], 126: [function (e, d) {
    var f = function () {
    };
    d.exports = function (b) {
        if (arguments.length > 1) {
            throw new Error("Second argument not supported")
        }
        if (null === b || "object" != typeof b) {
            throw new TypeError("Object prototype may only be an Object.")
        }
        return"function" == typeof Object.create ? Object.create(b) : (f.prototype = b, new f)
    }
}, {}], 127: [function (e, d) {
    var f = e("./extend");
    d.exports = function (g, c) {
        if ("object" != typeof g) {
            throw new TypeError("defaults: must provide a defaults object")
        }
        if (c = c || {}, "object" != typeof c) {
            throw new TypeError("defaults: options must be a typeof object")
        }
        return f({}, g, c)
    }
}, {"./extend": 128}], 128: [function (e, d) {
    var f = Object.prototype.hasOwnProperty;
    d.exports = function () {
        var g, c;
        return g = arguments.length < 2 ? [
            {},
            arguments[0]
        ] : [].slice.call(arguments), c = g.shift(), g.forEach(function (b) {
            if (null != b) {
                for (var h in b) {
                    f.call(b, h) && (c[h] = b[h])
                }
            }
        }), c
    }
}, {}], 129: [function (e, d) {
    var f = Object.prototype.hasOwnProperty;
    d.exports = function (g) {
        if (Object.getPrototypeOf) {
            return Object.getPrototypeOf(g)
        }
        if ("object" != typeof g) {
            throw new Error("Requested prototype of a value that is not an object.")
        }
        if ("object" == typeof this.__proto__) {
            return g.__proto__
        }
        var c, h = g.constructor;
        if (f.call(g, "constructor")) {
            if (c = h, !delete g.constructor) {
                return null
            }
            h = g.constructor, g.constructor = c
        }
        return h ? h.prototype : null
    }
}, {}], 130: [function (d, c) {
    c.exports = function (b) {
        return"[object Date]" === Object.prototype.toString.call(b)
    }
}, {}], 131: [function (e, d) {
    var f = Object.prototype.hasOwnProperty;
    d.exports = function (g) {
        var c;
        if ("object" != typeof g) {
            throw new TypeError("ac-base.Object.isEmpty : Invalid parameter - expected object")
        }
        for (c in g) {
            if (f.call(g, c)) {
                return !1
            }
        }
        return !0
    }
}, {}], 132: [function (d, c) {
    c.exports = function (b) {
        return window.RegExp ? b instanceof RegExp : !1
    }
}, {}], 133: [function (e, d) {
    var f = e("qs");
    d.exports = function (b) {
        if ("object" != typeof b) {
            throw new TypeError("toQueryParameters error: argument is not an object")
        }
        return f.stringify(b)
    }
}, {qs: 123}], 134: [function (f, e) {
    var h = f("./ac-media-object/create"), g = f("./ac-media-object/cname");
    e.exports = {create: h, cname: g}
}, {"./ac-media-object/cname": 144, "./ac-media-object/create": 145}], 135: [function (j, i) {
    function p() {
        this._items = [], this._loadingItem = null, this._active = !1
    }

    var o = j("ac-event-emitter").EventEmitter, n = j("../eventNames"), m = 2, l = p.prototype = new o;
    l.load = function () {
        return this._active = !0, this._loadNext()
    }, l._loadNext = function () {
        0 !== this._items.length && (this._loadingItem = this._items.shift(), this._loadItem(this._loadingItem))
    }, l._loadItem = function (d) {
        var c;
        return this._loadingItem = d, d.asset.on(n.loaded, this._itemLoaded.bind(this, d)), d.asset.load(), c
    }, l._itemLoaded = function (d, c) {
        this.trigger(n.progress, {asset: d.asset, binaries: c}), this._active === !0 && this._loadNext()
    }, l.pause = function () {
        this._loadingItem && (this._loadingItem.asset.pause(), this._items.unshift(this._loadingItem), this._loadingItem = null), this._active = !1
    }, l.getItems = function () {
        return this._items
    }, l.remove = function (g) {
        var f, r, q = this._active, h = null;
        for (this._loadingItem && this._loadingItem.asset === g && (r = this._loadingItem, this.pause()), f = 0; f < this._items.length; f += 1) {
            if (this._items[f].asset === g) {
                r = this._items[f], h = f;
                break
            }
        }
        r.asset.destroy(), null !== h && this._items.splice(h, 1), q && this._active === !1 && this.load()
    }, l.add = function (f, e) {
        var h = this._active, g = !0;
        e = "number" == typeof e ? e : m, this._loadingItem && this._loadingItem.priority <= e && (g = !1), g === !0 && this.pause(), this._items.push({asset: f, priority: e}), this._sort(), h && this._active === !1 && this.load()
    }, l._sort = function () {
        this._items.sort(function (d, c) {
            return d.priority < c.priority ? -1 : 1
        })
    };
    var k = new p;
    k.load(), k.LoadingQueue = p, i.exports = k
}, {"../eventNames": 146, "ac-event-emitter": 62}], 136: [function (D, C) {
    var B, A = D("ac-base").Element, z = D("ac-object"), y = D("ac-ajax"), x = D("../utils/destroy"), w = D("ac-event-emitter").EventEmitter, v = D("../eventNames"), u = D("./MediaObject/Loader"), t = D("./MediaObject/Loader/QueuedLoader"), s = D("./MediaObject/View"), r = {preload: !1, autoplay: !1, fadeToEndframe: !1, transitionDuration: 0.4, frameRate: 24, queueLoading: !1, loadPriority: null}, q = {posterframeSrc: ".posterframe", endstateSrc: ".endstate"}, p = function (e, d, f) {
        if (this.container = A.getElementById(e), !this.container) {
            throw"MediaObject: requires valid DOM Node for ‘container’"
        }
        this.options = z.defaults(r, f || {}), this.mediaSrc = z.defaults(q, d || {}), this.mediaSrc.basePath && (this.mediaSrc.basePath = this._forceTrailingSlash(this.mediaSrc.basePath)), this._media = null, this._mediaElement = null, this._mediaEmitter = null, this._loadObject = null, this._totalFrames = null, this.duration = null, this.ended = !1, this.loader = null, this.dataOptionsAttribute = "mediaObject", this.dataAssetOptionsAttribute = "mediaObject-asset", this.ready = !1, this._updateOptionsFromDataAttribute(), this._mediaExistsSrc = this._constructMediaExistsSrc(), this.view = new s(this), (this.options.preload === !0 || this.options.autoplay === !0) && this.load()
    };
    B = p.prototype = new w, B.enhance = function () {
        this.view.enhanced || (this._generate(), this.view.enhance().then(function () {
            this.trigger(v.enhance, this)
        }.bind(this)))
    }, B.degrade = function () {
        this.view.degrade(), this.trigger(v.degrade, this)
    }, B._generate = function () {
        null === this.loader && (this.options.queueLoading ? (this.loader = new t(this._loadObject, this.options.loadPriority), this.prioritize = this.loader.prioritize.bind(this.loader)) : this.loader = new u(this._loadObject), this._addEventListeners())
    }, B._forceTrailingSlash = function (b) {
        return b && b.lastIndexOf("/") !== b.length - 1 && (b += "/"), b
    }, B._updateOptionsFromDataAttribute = function () {
        var d = this._parseDataAttributeOptions(this.container, this.dataOptionsAttribute), c = this._parseDataAttributeOptions(this.container, this.dataAssetOptionsAttribute);
        z.defaults(this.options, d || {}), z.defaults(this.mediaSrc, c || {})
    }, B._parseDataAttributeOptions = function (h, d) {
        h = A.getElementById(h);
        var l, k, j = h.getAttribute("data-" + d), i = {};
        return j && j.length > 0 && (l = j.split(","), l && l.length > 0 && l.forEach(function (b) {
            k = b.split(":"), i[k[0]] = k[1]
        })), i
    }, B._constructMediaExistsSrc = function () {
        var d = "", c = this.mediaSrc.basePath ? this._forceTrailingSlash(this.mediaSrc.basePath) : "";
        return d = c + this.mediaSrc.filename + "." + this.mediaSrc.fileFormat
    }, B.load = function () {
        return null === this.loader || this.loader.loaded !== !0 ? (this._generate(), this.trigger(v.loadstart, this), this._load(), this.loader.load()) : void 0
    }, B._load = function () {
        this.once(v.loaded, this._onReady, this)
    }, B.play = function (b) {
        return this.ready ? this._media.paused ? (this._play(b), void this.trigger(v.play, this)) : !1 : (this.load(), void (this.options.autoplay = !0))
    }, B._play = function (b) {
        this.ready && null !== this._media && ("number" == typeof b && this.setPlaybackRate(b), this._media.play())
    }, B.pause = function () {
        return this._media.paused ? !1 : (this._pause(), void this.trigger(v.pause, this))
    }, B._pause = function () {
        this._media.pause()
    }, B.reset = function () {
        this._reset()
    }, B._reset = function () {
        this.ready && this.setTime(0)
    }, B.stop = function () {
        this.options.autoplay = !1, this._stop(), this.trigger(v.stop, this)
    }, B._stop = function () {
        this._pause(), this.reset()
    }, B.setTime = function (b) {
        return 0 > b && (b = 0), b > this.duration && (b = this.duration), this._media.currentTime = b
    }, B.goToFrame = function (d) {
        var c = d / this.options.frameRate;
        return this.setTime(c)
    }, B.goToDurationPercent = function (d) {
        var c = d * this.duration;
        return this.setTime(c)
    }, B.currentFrame = function () {
        return Math.floor(this.currentTime() * this.options.frameRate)
    }, B.currentTime = function () {
        return this._media.currentTime
    }, B.getCurrentTime = function () {
        return this._media.currentTime
    }, B.getPlaybackRate = function () {
        return this._media.playbackRate
    }, B.setPlaybackRate = function (b) {
        return this._media.playbackRate = b
    }, B._addEventListeners = function () {
        this._mediaEmitter.on(v.ended, this._onEnded, this), this.loader.once(v.loaded, this._onLoad, this), this.loader.once(v.errored, this._onError, this)
    }, B.destroy = function () {
        this.trigger(v.destroy, this), this._mediaEmitter.off(), x(this, !0)
    }, B._getTotalFrames = function () {
        return this.duration * this.options.frameRate
    }, B.mediaExists = function () {
        return this._request = y.create({method: "HEAD", url: this._mediaExistsSrc, timeout: 2000}), this._request.send()
    }, B._onReady = function () {
        this.ready = !0, this.duration = this._media.duration, this._totalFrames = this._getTotalFrames(), this._mediaEmitter.on("durationchange", function () {
            this.duration = this._media.duration, this._totalFrames = this._getTotalFrames()
        }, this), this.trigger(v.ready, this), this.options.autoplay === !0 && (this.options.autoplay = !1, this.view.enhanced === !1 && this.enhance(), this.play())
    }, B._onEnded = function () {
        this.ended = !0, this.trigger(v.ended, this)
    }, B._onLoad = function () {
        this.loaded = !0, this.trigger(v.loaded, this)
    }, B._onError = function () {
        this.degrade()
    }, C.exports = p
}, {"../eventNames": 146, "../utils/destroy": 147, "./MediaObject/Loader": 138, "./MediaObject/Loader/QueuedLoader": 139, "./MediaObject/View": 141, "ac-ajax": 2, "ac-base": 6, "ac-event-emitter": 62, "ac-object": 124}], 137: [function (t, s) {
    try {
        var r = t("ac-flow-x").Flow
    } catch (q) {
    }
    var p, o = t("ac-object"), n = (t("../../eventNames"), t("../MediaObject")), m = {}, l = {}, k = function (e, d, f) {
        d = o.defaults(l, d || {}), f = o.defaults(m, f || {}), this.canvas = null, n.apply(this, arguments)
    };
    p = k.prototype = o.create(n.prototype), p._generate = function () {
        if (null === this._media && void 0 !== r) {
            var f, c = document.createElement("canvas"), h = {element: c, preload: !1, superFrames: this.options.superFrames || !1, reversable: this.options.reversable || !1, keyframeCache: this.options.keyframeCache || 8, benchmark: this.options.benchmark || !1, multithread: this.options.multithread || !1, preventDraw: this.options.preventDraw || !1, renderType: this.options.renderType || "default"}, g = {basePath: this.mediaSrc.basePath || null, baseName: this.mediaSrc.filename || "flow", imageUrlPattern: this.mediaSrc.imageUrlPattern || "###", fileFormat: this.mediaSrc.fileFormat || "jpg", startframeFileFormat: this.mediaSrc.startframeFileFormat || null, endframeFileFormat: this.mediaSrc.endframeFileFormat || null, manifestPath: this.mediaSrc.manifestPath || null, manifestFileFormat: this.mediaSrc.manifestFileFormat || "json", diffPath: this.mediaSrc.diffPath || null, framePath: this.mediaSrc.framePath || null};
            return f = new r(h, g), f.frameRate = this.options.frameRate, this._media = f, this._mediaElement = f.element, this._mediaEmitter = f, this._loadObject = f.loader, n.prototype._generate.call(this), this.mediaObject
        }
    }, p._constructMediaExistsSrc = function () {
        var f = "", e = this.mediaSrc.basePath ? this._forceTrailingSlash(this.mediaSrc.basePath) : null, h = this.mediaSrc.filename ? this.mediaSrc.filename + "_" : "_", g = this.mediaSrc.manifestPath ? this._forceTrailingSlash(this.mediaSrc.manifestPath) : null;
        return f = (g || e) + h + "manifest." + (this.mediaSrc.manifestFileFormat || "json")
    }, p._load = function () {
        this._mediaEmitter.once("canplaythrough", this._onReady, this)
    }, s.exports = k
}, {"../../eventNames": 146, "../MediaObject": 136, "ac-flow-x": 92, "ac-object": 124}], 138: [function (i, h) {
    var n, m = i("../../utils/destroy"), l = i("ac-event-emitter").EventEmitter, k = i("../../eventNames"), j = function (b) {
        this.loadObject = b, this.loaded = !1, this.loadObject.once(k.loaded, this._onLoad, this), this.loadObject.once(k.errored, this._onError, this)
    };
    n = j.prototype = new l, n.load = function () {
        return this.loaded ? void 0 : this._load()
    }, n.pause = function () {
        this.loaded || this.loadObject.pause()
    }, n._load = function () {
        return this.loadObject.load()
    }, n._onLoad = function () {
        this.loaded = !0, this.trigger(k.loaded)
    }, n._onError = function () {
        this.trigger(k.errored)
    }, n.destroy = function () {
        this.pause(), m(this, !0)
    }, h.exports = j
}, {"../../eventNames": 146, "../../utils/destroy": 147, "ac-event-emitter": 62}], 139: [function (j, i) {
    var p, o = j("ac-object"), n = j("../../../eventNames"), m = j("../../LoadingQueue"), l = j("../Loader"), k = function (d, c) {
        this.priority = c, l.apply(this, [d])
    };
    p = k.prototype = o.create(l.prototype), p.prioritize = function (b) {
        this.priority = b, this.loadObject.pause(), m.remove(this.loadObject), this.load()
    }, p._load = function () {
        return this.promise ? m.add(this.loadObject, this.priority) : this.promise = new Promise(function (d, c) {
            this.loadObject.once(n.loaded, d), this.loadObject.once(n.errored, c), m.add(this.loadObject, this.priority)
        }.bind(this)), this.promise
    }, i.exports = k
}, {"../../../eventNames": 146, "../../LoadingQueue": 135, "../Loader": 138, "ac-object": 124}], 140: [function (D, C) {
    var B, A = D("ac-base").Environment, z = D("ac-object"), y = D("ac-asset-loader").AssetLoader, x = D("ac-deferred").Deferred, w = D("ac-deferred").all, v = D("ac-dom-emitter").DOMEmitter, u = D("../../eventNames"), t = D("../MediaObject"), s = D("ac-asset-loader").Asset.Video, r = {loop: !1}, q = {filename: "h264", fileFormat: "mp4"}, p = function (e, d, f) {
        d = z.defaults(q, d || {}), f = z.defaults(r, f || {}), t.call(this, e, d, f)
    };
    B = p.prototype = z.create(t.prototype), B._generate = function () {
        if (null === this._media) {
            var f = document.createElement("video"), e = this._mediaExistsSrc, h = new s(e, {element: f, forceElementLoading: this.options.forceElementLoading}), g = new y(h);
            this.options.loop === !0 && f.setAttribute("loop", "true"), this._media = f, this._mediaElement = f, this._mediaEmitter = new v(f), this._loadObject = g, t.prototype._generate.call(this)
        }
    }, B._triggerEndedWhilePlayingInReverse = function () {
        0 === this._media.currentTime && (this._media.pause(), this.trigger(u.ended, this), this._mediaEmitter.off("timeupdate", this._triggerEndedWhilePlayingInReverse))
    }, B._hidePosterOnTimeupdate = function () {
        this._media.currentTime > 0 && (this.view.hideCoverElement(this.view.posterframe), this._mediaEmitter.off("timeupdate", this._hidePosterOnTimeupdate))
    }, B._load = function () {
        var e, d = new x, f = new x;
        return"function" != typeof this._boundOnReady && (this._boundOnReady = this._onReady.bind(this)), this._mediaEmitter.once("loadedmetadata", function () {
            e && window.clearInterval(e), d.resolve()
        }, this), this.once(u.loaded, function () {
            f.resolve(), "Safari" === A.Browser.name && this._media.src.match(/^blob/) && "pending" === d.promise().status() && (e = window.setInterval(function () {
                return this._media && this._media.duration ? isNaN(this._media.duration) : !0
            }.bind(this), 20), window.setTimeout(function () {
                window.clearInterval(e)
            }, 7000))
        }, this), w([d.promise(), f.promise()]).then(this._boundOnReady)
    }, B._play = function () {
        this._mediaEmitter.on("timeupdate", this._hidePosterOnTimeupdate, this), t.prototype._play.apply(this, arguments), this.getPlaybackRate() < 0 && this._mediaEmitter.on("timeupdate", this._triggerEndedWhilePlayingInReverse, this)
    }, B._stop = function () {
        this._mediaEmitter.off("timeupdate", this._hidePosterOnTimeupdate), this._mediaEmitter.off("timeupdate", this._triggerEndedWhilePlayingInReverse), t.prototype._stop.call(this)
    }, B._onReady = function () {
        t.prototype._onReady.call(this), this._boundOnReady = null
    }, C.exports = p
}, {"../../eventNames": 146, "../MediaObject": 136, "ac-asset-loader": 77, "ac-base": 6, "ac-deferred": 59, "ac-dom-emitter": 60, "ac-object": 124}], 141: [function (v, u) {
    function t(b) {
        this.container = b.container, this.mediaObject = b, this.enhanced = !1, this.posterframe = null, this.endstate = null, this.mediaObject.on(r.play, this._onPlay, this), this.mediaObject.on(r.pause, this._onPause, this), this.mediaObject.on(r.ended, this._onEnded, this)
    }

    var s = v("ac-base").Element, r = v("../../eventNames"), q = v("ac-asset-loader").AssetLoader, p = v("ac-deferred").Deferred, o = v("ac-deferred").all, n = /\w+\.(?:jpg|png)$/, m = {posterframe: "mediaObject-posterframe", endstate: "mediaObject-endstate"}, l = t.prototype;
    l.enhance = function () {
        var g, d, w = new p, k = function (b) {
            this.posterframe = b || null
        }.bind(this), j = function (b) {
            this.endstate = b || null
        }.bind(this), h = function () {
            s.addClassName(this.container, "mediaObject-enhanced"), s.addClassName(this.mediaObject._mediaElement, "mediaObject-element"), this.enhanced = !0, window.requestAnimationFrame(function () {
                this.hideCoverElement(this.endstate), this._inject(), s.setStyle(this.mediaObject._mediaElement, {visibility: "hidden"}), window.requestAnimationFrame(function () {
                    s.getBoundingBox(this.mediaObject._mediaElement), s.setStyle(this.mediaObject._mediaElement, {visibility: "visible"}), w.resolve()
                }.bind(this))
            }.bind(this))
        }.bind(this);
        return this.enhanced ? w.reject() : (d = this._createCoverElement(this.mediaObject.mediaSrc.posterframeSrc, m.posterframe), g = this._createCoverElement(this.mediaObject.mediaSrc.endstateSrc, m.endstate), d.then(k), g.then(j), o([d, g]).then(h)), w
    }, l.degrade = function () {
        this.showCoverElement(this.endstate, !1), window.requestAnimationFrame(function () {
            this._remove(), this.posterframe = null, this.endstate = null, this.enhanced = !1, s.addClassName(this.container, "mediaObject-degraded"), this.mediaObject.destroy()
        }.bind(this))
    }, l._createCoverElement = function (f, d) {
        var h, g;
        return n.test(f) ? g = this._loadImage(f, d) : (h = s.select(f, this.container), g = (new p).resolve(h)), g
    }, l._loadImage = function (f, e) {
        function h(b) {
            var d = b[0];
            return d.width = d.width, d.height = d.height, d.alt = "", d.className = e, d
        }

        var g = new q([f]);
        return g.load().then(h)
    }, l._inject = function () {
        s.insert(this.mediaObject._mediaElement, this.container), [this.posterframe, this.endstate].forEach(function (b) {
            b && !this.container.contains(b) && s.insert(b, this.container)
        }, this)
    }, l._remove = function () {
        var b = [this.mediaObject._mediaElement];
        n.test(this.mediaObject.posterframeSrc) || b.push(this.posterframe), b.forEach(function (c) {
            s.isElement(c) && this.container.contains(c) && this.container.removeChild(c)
        }, this)
    }, l.hideCoverElements = function () {
        this.hideCoverElement(this.posterframe), this.hideCoverElement(this.endstate)
    }, l.hideCoverElement = function (d, c) {
        d && (c ? this._addOpacityTransition(d) : this._removeTransition(d), window.requestAnimationFrame(function () {
            s.setStyle(d, {opacity: 0, zIndex: 1})
        }.bind(this)))
    }, l.showCoverElement = function (e, d) {
        var f = function () {
            this._removeTransition.bind(this, e), s.removeVendorPrefixEventListener(e, "transitionEnd", f)
        }.bind(this);
        e && (d ? (this._addOpacityTransition(e), s.addVendorPrefixEventListener(e, "transitionEnd", f)) : this._removeTransition(e), window.requestAnimationFrame(function () {
            s.setStyle(e, {opacity: 1, zIndex: 1001})
        }.bind(this)))
    }, l._removeTransition = function (b) {
        s.setVendorPrefixStyle(b, "transition", "none")
    }, l._addOpacityTransition = function (b) {
        s.setVendorPrefixStyle(b, "transition", "opacity " + this.mediaObject.options.transitionDuration + "s ease-out")
    }, l._onPlay = function () {
        s.removeClassName(this.container, "mediaObject-ended"), s.addClassName(this.container, "mediaObject-playing"), this.hideCoverElements()
    }, l._onPause = function () {
        s.removeClassName(this.container, "mediaObject-playing")
    }, l._onEnded = function () {
        s.removeClassName(this.container, "mediaObject-playing"), s.addClassName(this.container, "mediaObject-ended"), this.endstateElement && this.showCoverElement(this.endstate, !1)
    }, u.exports = t
}, {"../../eventNames": 146, "ac-asset-loader": 77, "ac-base": 6, "ac-deferred": 59}], 142: [function (j, i) {
    var p, o = j("./KeyframeOnPause/ImageOverlayController"), n = j("ac-object"), m = j("ac-clock"), l = {overlayLoadDelay: 250, overlayClassName: "image-overlay", overlayDirPath: "./overlay", overlayPrefix: "image_", overlayPattern: "####", overlayFileType: "png", clock: m}, k = function () {
    };
    p = k.prototype, p.decorate = function (e, d) {
        var f = n.defaults(l, d);
        return e.keyframeOnPauseController = new o(e, f), e.container.appendChild(e.keyframeOnPauseController.el), e
    }, i.exports = new k
}, {"./KeyframeOnPause/ImageOverlayController": 143, "ac-clock": 53, "ac-object": 124}], 143: [function (f, e) {
    var h, g = (f("ac-event-emitter").EventEmitter, f("ac-dom-emitter").DOMEmitter, function (d, c) {
        this.mediaObject = d, this.options = c, this.active = !1, this.el = this._createOverlay(), this._overlaySetTime = null, this._setEventTarget(), this._bindEvents()
    });
    h = g.prototype, h.applyOverlay = function (i) {
        i = i || this.mediaObject.currentFrame();
        var d = this._getImagePath(i), j = this._getContainerDimensions(this.mediaObject.container);
        this.el.style.backgroundImage = "url(" + d + ")", this.el.style.backgroundSize = j.width + "px " + j.height + "px", this.active = !0, this.mediaObject.trigger("overlay-applied")
    }, h.removeOverlay = function () {
        this.el.style.backgroundImage = "inherit", this.active = !1, this.mediaObject.trigger("overlay-removed")
    }, h._createOverlay = function () {
        var b = document.createElement("div");
        return b.className = this.options.overlayClassName, b
    }, h._onMetadataLoaded = function () {
        var d = this.mediaObject.width, c = this.mediaObject.height;
        this.el.style.width = d, this.el.style.height = c
    }, h._getContainerDimensions = function (i) {
        i = i || this.mediaObject.container;
        var d, j = {width: i.offsetWidth, height: i.offsetHeight};
        return j.width && j.height || (d = i.getBoundingClientRect(), j.width = d.width, j.height = d.height), j
    }, h._getImagePath = function (j) {
        for (var i = this.options.overlayDirPath, p = this.options.overlayFileType, o = this.options.overlayPrefix, n = this.options.overlayPattern, m = n.length, l = j + "", k = l.length; m > k;) {
            l = "0" + l, k++
        }
        return i + "/" + o + l + "." + p
    }, h._bindEvents = function () {
        this._eventsTarget.on("timeupdate pause", this._onMediaObjectScrub, this), this._eventsTarget.on("play", this._onMediaObjectPlay, this), this.options.clock.on("draw", this._clockApplyImageOverlay, this)
    }, h._setEventTarget = function () {
        this._eventsTarget = this.mediaObject._mediaEmitter
    }, h._onMediaObjectPlay = function () {
        this.removeOverlay()
    }, h._onMediaObjectScrub = function () {
        this._debounceImageOverlay()
    }, h._debounceImageOverlay = function () {
        this._overlaySetTime = Date.now() + this.options.overlayLoadDelay
    }, h._clockApplyImageOverlay = function () {
        !this.mediaObject._media.paused || !this._overlaySetTime || this._overlaySetTime > Date.now() || (this._overlaySetTime = null, this.applyOverlay())
    }, e.exports = g
}, {"ac-dom-emitter": 60, "ac-event-emitter": 62}], 144: [function (e, d) {
    var f = function () {
        var b = "/global/elements/blank.gif";
        return b.replace(/global\/.*/, "")
    }();
    d.exports = function (b) {
        return b.match(/(^http(s?))/) ? b : (b.match(/^\/(?!\/)/) && (b = f + b.replace(/^\//, ""), b = b.replace(/(^.+)(\/105\/)/, "$1/")), b)
    }
}, {}], 145: [function (g, f) {
    var j = g("./MediaObject/Flow"), i = g("./MediaObject/Video"), h = g("./MediaObject/decorators/KeyframeOnPause");
    f.exports = function (d, c, k) {
        k = k || {};
        var e = null;
        return"h264" === k.type && (e = new i(d, c, k)), "flow" === k.type && (e = new j(d, c, k)), k.keyframeOverlay && (e = h.decorate(e, k.keyframeOverlay)), e
    }
}, {"./MediaObject/Flow": 137, "./MediaObject/Video": 140, "./MediaObject/decorators/KeyframeOnPause": 142}], 146: [function (d, c) {
    c.exports = {degrade: "degrade", destroy: "destroy", ended: "ended", enhance: "enhance", errored: "error", loaded: "loaded", loadstart: "loadstart", pause: "pause", play: "play", progress: "progress", ready: "ready", stop: "stop"}
}, {}], 147: [function (d, c) {
    c.exports = d(88)
}, {}], 148: [function (d, c) {
    c.exports = d(5)
}, {}], 149: [function (d, c) {
    c.exports = {clone: d("./ac-object/clone"), defaults: d("./ac-object/defaults"), extend: d("./ac-object/extend"), getPrototypeOf: d("./ac-object/getPrototypeOf"), isEmpty: d("./ac-object/isEmpty"), toQueryParameters: d("./ac-object/toQueryParameters")}
}, {"./ac-object/clone": 150, "./ac-object/defaults": 151, "./ac-object/extend": 152, "./ac-object/getPrototypeOf": 153, "./ac-object/isEmpty": 154, "./ac-object/toQueryParameters": 155}], 150: [function (d, c) {
    c.exports = d(125)
}, {"./extend": 152}], 151: [function (e, d) {
    var f = e("./extend");
    d.exports = function (g, c) {
        if ("object" != typeof g || "object" != typeof c) {
            throw new TypeError("defaults: must provide a defaults and options object")
        }
        return f({}, g, c)
    }
}, {"./extend": 152}], 152: [function (d, c) {
    c.exports = d(128)
}, {}], 153: [function (d, c) {
    c.exports = d(129)
}, {}], 154: [function (d, c) {
    c.exports = d(131)
}, {}], 155: [function (d, c) {
    c.exports = d(133)
}, {qs: 148}], 156: [function (require, module, exports) {
    (function (process, global) {
        if (function () {
            var a = Array.prototype.slice;
            try {
                a.call(document.documentElement)
            } catch (b) {
                Array.prototype.slice = function (b, c) {
                    if (c = "undefined" != typeof c ? c : this.length, "[object Array]" === Object.prototype.toString.call(this)) {
                        return a.call(this, b, c)
                    }
                    var d, e, f = [], g = this.length, h = b || 0;
                    h = h >= 0 ? h : g + h;
                    var i = c ? c : g;
                    if (0 > c && (i = g + c), e = i - h, e > 0) {
                        if (f = new Array(e), this.charAt) {
                            for (d = 0; e > d; d++) {
                                f[d] = this.charAt(h + d)
                            }
                        } else {
                            for (d = 0; e > d; d++) {
                                f[d] = this[h + d]
                            }
                        }
                    }
                    return f
                }
            }
        }(), "undefined" == typeof document || "classList" in document.createElement("a") || !function (a) {
            if ("HTMLElement" in a || "Element" in a) {
                var b = "classList", c = "prototype", d = (a.HTMLElement || a.Element)[c], e = Object, f = String[c].trim || function () {
                    return this.replace(/^\s+|\s+$/g, "")
                }, g = Array[c].indexOf || function (a) {
                    for (var b = 0, c = this.length; c > b; b++) {
                        if (b in this && this[b] === a) {
                            return b
                        }
                    }
                    return -1
                }, h = function (a, b) {
                    this.name = a, this.code = DOMException[a], this.message = b
                }, i = function (a, b) {
                    if ("" === b) {
                        throw new h("SYNTAX_ERR", "An invalid or illegal string was specified")
                    }
                    if (/\s/.test(b)) {
                        throw new h("INVALID_CHARACTER_ERR", "String contains an invalid character")
                    }
                    return g.call(a, b)
                }, j = function (a) {
                    for (var b = f.call(a.className), c = b ? b.split(/\s+/) : [], d = 0, e = c.length; e > d; d++) {
                        this.push(c[d])
                    }
                    this._updateClassName = function () {
                        a.className = this.toString()
                    }
                }, k = j[c] = [], l = function () {
                    return new j(this)
                };
                if (h[c] = Error[c], k.item = function (a) {
                    return this[a] || null
                }, k.contains = function (a) {
                    return a += "", -1 !== i(this, a)
                }, k.add = function () {
                    var a, b = arguments, c = 0, d = b.length, e = !1;
                    do {
                        a = b[c] + "", -1 === i(this, a) && (this.push(a), e = !0)
                    } while (++c < d);
                    e && this._updateClassName()
                }, k.remove = function () {
                    var a, b = arguments, c = 0, d = b.length, e = !1;
                    do {
                        a = b[c] + "";
                        var f = i(this, a);
                        -1 !== f && (this.splice(f, 1), e = !0)
                    } while (++c < d);
                    e && this._updateClassName()
                }, k.toggle = function (a, b) {
                    a += "";
                    var c = this.contains(a), d = c ? b !== !0 && "remove" : b !== !1 && "add";
                    return d && this[d](a), !c
                }, k.toString = function () {
                    return this.join(" ")
                }, e.defineProperty) {
                    var m = {get: l, enumerable: !0, configurable: !0};
                    try {
                        e.defineProperty(d, b, m)
                    } catch (n) {
                        -2146823252 === n.number && (m.enumerable = !1, e.defineProperty(d, b, m))
                    }
                } else {
                    e[c].__defineGetter__ && d.__defineGetter__(b, l)
                }
            }
        }(self), document.createEvent) {
            try {
                new window.CustomEvent("click")
            } catch (err) {
                window.CustomEvent = function () {
                    function a(a, b) {
                        b = b || {bubbles: !1, cancelable: !1, detail: void 0};
                        var c = document.createEvent("CustomEvent");
                        return c.initCustomEvent(a, b.bubbles, b.cancelable, b.detail), c
                    }

                    return a.prototype = window.Event.prototype, a
                }()
            }
        }
        Function.prototype.bind || (Function.prototype.bind = function (a) {
            if ("function" != typeof this) {
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")
            }
            var b = Array.prototype.slice.call(arguments, 1), c = this, d = function () {
            }, e = function () {
                return c.apply(this instanceof d && a ? this : a, b.concat(Array.prototype.slice.call(arguments)))
            };
            return d.prototype = this.prototype, e.prototype = new d, e
        }), Array.isArray || (Array.isArray = function (a) {
            return a && "object" == typeof a && "splice" in a && "join" in a
        }), Array.prototype.every || (Array.prototype.every = function (a, b) {
            var c, d = Object(this), e = d.length >>> 0;
            if ("function" != typeof a) {
                throw new TypeError(a + " is not a function")
            }
            for (c = 0; e > c; c += 1) {
                if (c in d && !a.call(b, d[c], c, d)) {
                    return !1
                }
            }
            return !0
        }), Array.prototype.filter || (Array.prototype.filter = function (a, b) {
            var c, d = Object(this), e = d.length >>> 0, f = [];
            if ("function" != typeof a) {
                throw new TypeError(a + " is not a function")
            }
            for (c = 0; e > c; c += 1) {
                c in d && a.call(b, d[c], c, d) && f.push(d[c])
            }
            return f
        }), Array.prototype.forEach || (Array.prototype.forEach = function (a, b) {
            var c, d, e = Object(this);
            if ("function" != typeof a) {
                throw new TypeError("No function object passed to forEach.")
            }
            for (c = 0; c < this.length; c += 1) {
                d = e[c], a.call(b, d, c, e)
            }
        }), Array.prototype.indexOf || (Array.prototype.indexOf = function (a, b) {
            var c = b || 0, d = 0;
            if (0 > c && (c = this.length + b - 1, 0 > c)) {
                throw"Wrapped past beginning of array while looking up a negative start index."
            }
            for (d = 0; d < this.length; d++) {
                if (this[d] === a) {
                    return d
                }
            }
            return -1
        }), Array.prototype.lastIndexOf || (Array.prototype.lastIndexOf = function (a, b) {
            var c, d = Object(this), e = d.length >>> 0;
            if (b = parseInt(b, 10), 0 >= e) {
                return -1
            }
            for (c = "number" == typeof b ? Math.min(e - 1, b) : e - 1, c = c >= 0 ? c : e - Math.abs(c); c >= 0; c -= 1) {
                if (c in d && a === d[c]) {
                    return c
                }
            }
            return -1
        }), Array.prototype.map || (Array.prototype.map = function (a, b) {
            var c, d = Object(this), e = d.length >>> 0, f = new Array(e);
            if ("function" != typeof a) {
                throw new TypeError(a + " is not a function")
            }
            for (c = 0; e > c; c += 1) {
                c in d && (f[c] = a.call(b, d[c], c, d))
            }
            return f
        }), Array.prototype.reduce || (Array.prototype.reduce = function (a, b) {
            var c, d = Object(this), e = d.length >>> 0, f = 0;
            if ("function" != typeof a) {
                throw new TypeError(a + " is not a function")
            }
            if ("undefined" == typeof b) {
                if (!e) {
                    throw new TypeError("Reduce of empty array with no initial value")
                }
                c = d[0], f = 1
            } else {
                c = b
            }
            for (; e > f;) {
                f in d && (c = a.call(void 0, c, d[f], f, d), f += 1)
            }
            return c
        }), Array.prototype.reduceRight || (Array.prototype.reduceRight = function (a, b) {
            var c, d = Object(this), e = d.length >>> 0, f = e - 1;
            if ("function" != typeof a) {
                throw new TypeError(a + " is not a function")
            }
            if (void 0 === b) {
                if (!e) {
                    throw new TypeError("Reduce of empty array with no initial value")
                }
                c = d[e - 1], f = e - 2
            } else {
                c = b
            }
            for (; f >= 0;) {
                f in d && (c = a.call(void 0, c, d[f], f, d), f -= 1)
            }
            return c
        }), Array.prototype.some || (Array.prototype.some = function (a, b) {
            var c, d = Object(this), e = d.length >>> 0;
            if ("function" != typeof a) {
                throw new TypeError(a + " is not a function")
            }
            for (c = 0; e > c; c += 1) {
                if (c in d && a.call(b, d[c], c, d) === !0) {
                    return !0
                }
            }
            return !1
        }), Date.now || (Date.now = function () {
            return(new Date).getTime()
        }), Date.prototype.toISOString || (Date.prototype.toISOString = function () {
            if (!isFinite(this)) {
                throw new RangeError("Date.prototype.toISOString called on non-finite value.")
            }
            var a, b, c = {year: this.getUTCFullYear(), month: this.getUTCMonth() + 1, day: this.getUTCDate(), hours: this.getUTCHours(), minutes: this.getUTCMinutes(), seconds: this.getUTCSeconds(), mseconds: (this.getUTCMilliseconds() / 1000).toFixed(3).substr(2, 3)};
            for (a in c) {
                c.hasOwnProperty(a) && "year" !== a && "mseconds" !== a && (c[a] = 1 === String(c[a]).length ? "0" + String(c[a]) : String(c[a]))
            }
            return(c.year < 0 || c.year > 9999) && (b = c.year < 0 ? "-" : "+", c.year = b + String(Math.abs(c.year / 1000000)).substr(2, 6)), c.year + "-" + c.month + "-" + c.day + "T" + c.hours + ":" + c.minutes + ":" + c.seconds + "." + c.mseconds + "Z"
        }), Date.prototype.toJSON || (Date.prototype.toJSON = function () {
            var a, b = Object(this), c = function (a) {
                var b = typeof a, c = [null, "undefined", "boolean", "string", "number"].some(function (a) {
                    return a === b
                });
                return c ? !0 : !1
            }, d = function (a) {
                var b;
                if (c(a)) {
                    return a
                }
                if (b = "function" == typeof a.valueOf ? a.valueOf() : "function" == typeof a.toString ? a.toString() : null, b && c(b)) {
                    return b
                }
                throw new TypeError(a + " cannot be converted to a primitive")
            };
            if (a = d(b), "number" == typeof a && !isFinite(a)) {
                return null
            }
            if ("function" != typeof b.toISOString) {
                throw new TypeError("toISOString is not callable")
            }
            return b.toISOString.call(b)
        }), String.prototype.trim || (String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, "")
        }), Object.keys || (Object.keys = function (a) {
            var b, c = [];
            if (!a || "function" != typeof a.hasOwnProperty) {
                throw"Object.keys called on non-object."
            }
            for (b in a) {
                a.hasOwnProperty(b) && c.push(b)
            }
            return c
        }), "undefined" != typeof JSON && "stringify" in JSON && "parse" in JSON || (this.JSON || (this.JSON = {}), function () {
            function f(a) {
                return 10 > a ? "0" + a : a
            }

            function quote(a) {
                return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, function (a) {
                    var b = meta[a];
                    return"string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                }) + '"' : '"' + a + '"'
            }

            function str(a, b) {
                var c, d, e, f, g, h = gap, i = b[a];
                switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(a)), "function" == typeof rep && (i = rep.call(b, a, i)), typeof i) {
                    case"string":
                        return quote(i);
                    case"number":
                        return isFinite(i) ? String(i) : "null";
                    case"boolean":
                    case"null":
                        return String(i);
                    case"object":
                        if (!i) {
                            return"null"
                        }
                        if (gap += indent, g = [], "[object Array]" === Object.prototype.toString.apply(i)) {
                            for (f = i.length, c = 0; f > c; c += 1) {
                                g[c] = str(c, i) || "null"
                            }
                            return e = 0 === g.length ? "[]" : gap ? "[\n" + gap + g.join(",\n" + gap) + "\n" + h + "]" : "[" + g.join(",") + "]", gap = h, e
                        }
                        if (rep && "object" == typeof rep) {
                            for (f = rep.length, c = 0; f > c; c += 1) {
                                d = rep[c], "string" == typeof d && (e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e))
                            }
                        } else {
                            for (d in i) {
                                Object.hasOwnProperty.call(i, d) && (e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e))
                            }
                        }
                        return e = 0 === g.length ? "{}" : gap ? "{\n" + gap + g.join(",\n" + gap) + "\n" + h + "}" : "{" + g.join(",") + "}", gap = h, e
                }
            }

            "function" != typeof String.prototype.toJSON && (String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
                return this.valueOf()
            });
            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {"\b": "\\b", "	": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\"}, rep;
            "function" != typeof JSON.stringify && (JSON.stringify = function (a, b, c) {
                var d;
                if (gap = "", indent = "", "number" == typeof c) {
                    for (d = 0; c > d; d += 1) {
                        indent += " "
                    }
                } else {
                    "string" == typeof c && (indent = c)
                }
                if (rep = b, b && "function" != typeof b && ("object" != typeof b || "number" != typeof b.length)) {
                    throw new Error("JSON.stringify")
                }
                return str("", {"": a})
            }), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) {
                function walk(a, b) {
                    var c, d, e = a[b];
                    if (e && "object" == typeof e) {
                        for (c in e) {
                            Object.hasOwnProperty.call(e, c) && (d = walk(e, c), void 0 !== d ? e[c] = d : delete e[c])
                        }
                    }
                    return reviver.call(a, b, e)
                }

                var j;
                if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function (a) {
                    return"\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                    return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({"": j}, "") : j
                }
                throw new SyntaxError("JSON.parse")
            })
        }()), window.matchMedia = window.matchMedia || function (a) {
            var b, c = a.documentElement, d = c.firstElementChild || c.firstChild, e = a.createElement("body"), f = a.createElement("div");
            return f.id = "mq-test-1", f.style.cssText = "position:absolute;top:-100em", e.style.background = "none", e.appendChild(f), function (a) {
                return f.innerHTML = '&shy;<style media="' + a + '"> #mq-test-1 { width:42px; }</style>', c.insertBefore(e, d), b = 42 === f.offsetWidth, c.removeChild(e), {matches: b, media: a}
            }
        }(document), function () {
            for (var a = 0, b = ["ms", "moz", "webkit", "o"], c = 0; c < b.length && !window.requestAnimationFrame; ++c) {
                window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"]
            }
            window.requestAnimationFrame || (window.requestAnimationFrame = function (b) {
                var c = Date.now(), d = Math.max(0, 16 - (c - a)), e = window.setTimeout(function () {
                    b(c + d)
                }, d);
                return a = c + d, e
            }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function (a) {
                clearTimeout(a)
            })
        }(), window.XMLHttpRequest = window.XMLHttpRequest || function () {
            var a;
            try {
                a = new ActiveXObject("Msxml2.XMLHTTP")
            } catch (b) {
                try {
                    a = new ActiveXObject("Microsoft.XMLHTTP")
                } catch (b) {
                    a = !1
                }
            }
            return a
        }, !function () {
            var a, b, c, d;
            !function () {
                var e = {}, f = {};
                a = function (a, b, c) {
                    e[a] = {deps: b, callback: c}
                }, d = c = b = function (a) {
                    function c(b) {
                        if ("." !== b.charAt(0)) {
                            return b
                        }
                        for (var c = b.split("/"), d = a.split("/").slice(0, -1), e = 0, f = c.length; f > e; e++) {
                            var g = c[e];
                            if (".." === g) {
                                d.pop()
                            } else {
                                if ("." === g) {
                                    continue
                                }
                                d.push(g)
                            }
                        }
                        return d.join("/")
                    }

                    if (d._eak_seen = e, f[a]) {
                        return f[a]
                    }
                    if (f[a] = {}, !e[a]) {
                        throw new Error("Could not find module " + a)
                    }
                    for (var g, h = e[a], i = h.deps, j = h.callback, k = [], l = 0, m = i.length; m > l; l++) {
                        k.push("exports" === i[l] ? g = {} : b(c(i[l])))
                    }
                    var n = j.apply(this, k);
                    return f[a] = g || n
                }
            }(), a("promise/all", ["./utils", "exports"], function (a, b) {
                function c(a) {
                    var b = this;
                    if (!d(a)) {
                        throw new TypeError("You must pass an array to all.")
                    }
                    return new b(function (b, c) {
                        function d(a) {
                            return function (b) {
                                f(a, b)
                            }
                        }

                        function f(a, c) {
                            h[a] = c, 0 === --i && b(h)
                        }

                        var g, h = [], i = a.length;
                        0 === i && b([]);
                        for (var j = 0; j < a.length; j++) {
                            g = a[j], g && e(g.then) ? g.then(d(j), c) : f(j, g)
                        }
                    })
                }

                var d = a.isArray, e = a.isFunction;
                b.all = c
            }), a("promise/asap", ["exports"], function (a) {
                function b() {
                    return function () {
                        process.nextTick(e)
                    }
                }

                function c() {
                    var a = 0, b = new i(e), c = document.createTextNode("");
                    return b.observe(c, {characterData: !0}), function () {
                        c.data = a = ++a % 2
                    }
                }

                function d() {
                    return function () {
                        j.setTimeout(e, 1)
                    }
                }

                function e() {
                    for (var a = 0; a < k.length; a++) {
                        var b = k[a], c = b[0], d = b[1];
                        c(d)
                    }
                    k = []
                }

                function f(a, b) {
                    var c = k.push([a, b]);
                    1 === c && g()
                }

                var g, h = "undefined" != typeof window ? window : {}, i = h.MutationObserver || h.WebKitMutationObserver, j = "undefined" != typeof global ? global : void 0 === this ? window : this, k = [];
                g = "undefined" != typeof process && "[object process]" === {}.toString.call(process) ? b() : i ? c() : d(), a.asap = f
            }), a("promise/config", ["exports"], function (a) {
                function b(a, b) {
                    return 2 !== arguments.length ? c[a] : void (c[a] = b)
                }

                var c = {instrument: !1};
                a.config = c, a.configure = b
            }), a("promise/polyfill", ["./promise", "./utils", "exports"], function (a, b, c) {
                function d() {
                    var a;
                    a = "undefined" != typeof global ? global : "undefined" != typeof window && window.document ? window : self;
                    var b = "Promise" in a && "resolve" in a.Promise && "reject" in a.Promise && "all" in a.Promise && "race" in a.Promise && function () {
                        var b;
                        return new a.Promise(function (a) {
                            b = a
                        }), f(b)
                    }();
                    b || (a.Promise = e)
                }

                var e = a.Promise, f = b.isFunction;
                c.polyfill = d
            }), a("promise/promise", ["./config", "./utils", "./all", "./race", "./resolve", "./reject", "./asap", "exports"], function (a, b, c, d, e, f, g, h) {
                function i(a) {
                    if (!v(a)) {
                        throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
                    }
                    if (!(this instanceof i)) {
                        throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
                    }
                    this._subscribers = [], j(a, this)
                }

                function j(a, b) {
                    function c(a) {
                        o(b, a)
                    }

                    function d(a) {
                        q(b, a)
                    }

                    try {
                        a(c, d)
                    } catch (e) {
                        d(e)
                    }
                }

                function k(a, b, c, d) {
                    var e, f, g, h, i = v(c);
                    if (i) {
                        try {
                            e = c(d), g = !0
                        } catch (j) {
                            h = !0, f = j
                        }
                    } else {
                        e = d, g = !0
                    }
                    n(b, e) || (i && g ? o(b, e) : h ? q(b, f) : a === D ? o(b, e) : a === E && q(b, e))
                }

                function l(a, b, c, d) {
                    var e = a._subscribers, f = e.length;
                    e[f] = b, e[f + D] = c, e[f + E] = d
                }

                function m(a, b) {
                    for (var c, d, e = a._subscribers, f = a._detail, g = 0; g < e.length; g += 3) {
                        c = e[g], d = e[g + b], k(b, c, d, f)
                    }
                    a._subscribers = null
                }

                function n(a, b) {
                    var c, d = null;
                    try {
                        if (a === b) {
                            throw new TypeError("A promises callback cannot return that same promise.")
                        }
                        if (u(b) && (d = b.then, v(d))) {
                            return d.call(b, function (d) {
                                return c ? !0 : (c = !0, void (b !== d ? o(a, d) : p(a, d)))
                            }, function (b) {
                                return c ? !0 : (c = !0, void q(a, b))
                            }), !0
                        }
                    } catch (e) {
                        return c ? !0 : (q(a, e), !0)
                    }
                    return !1
                }

                function o(a, b) {
                    a === b ? p(a, b) : n(a, b) || p(a, b)
                }

                function p(a, b) {
                    a._state === B && (a._state = C, a._detail = b, t.async(r, a))
                }

                function q(a, b) {
                    a._state === B && (a._state = C, a._detail = b, t.async(s, a))
                }

                function r(a) {
                    m(a, a._state = D)
                }

                function s(a) {
                    m(a, a._state = E)
                }

                var t = a.config, u = (a.configure, b.objectOrFunction), v = b.isFunction, w = (b.now, c.all), x = d.race, y = e.resolve, z = f.reject, A = g.asap;
                t.async = A;
                var B = void 0, C = 0, D = 1, E = 2;
                i.prototype = {constructor: i, _state: void 0, _detail: void 0, _subscribers: void 0, then: function (a, b) {
                    var c = this, d = new this.constructor(function () {
                    });
                    if (this._state) {
                        var e = arguments;
                        t.async(function () {
                            k(c._state, d, e[c._state - 1], c._detail)
                        })
                    } else {
                        l(this, d, a, b)
                    }
                    return d
                }, "catch": function (a) {
                    return this.then(null, a)
                }}, i.all = w, i.race = x, i.resolve = y, i.reject = z, h.Promise = i
            }), a("promise/race", ["./utils", "exports"], function (a, b) {
                function c(a) {
                    var b = this;
                    if (!d(a)) {
                        throw new TypeError("You must pass an array to race.")
                    }
                    return new b(function (b, c) {
                        for (var d, e = 0; e < a.length; e++) {
                            d = a[e], d && "function" == typeof d.then ? d.then(b, c) : b(d)
                        }
                    })
                }

                var d = a.isArray;
                b.race = c
            }), a("promise/reject", ["exports"], function (a) {
                function b(a) {
                    var b = this;
                    return new b(function (b, c) {
                        c(a)
                    })
                }

                a.reject = b
            }), a("promise/resolve", ["exports"], function (a) {
                function b(a) {
                    if (a && "object" == typeof a && a.constructor === this) {
                        return a
                    }
                    var b = this;
                    return new b(function (b) {
                        b(a)
                    })
                }

                a.resolve = b
            }), a("promise/utils", ["exports"], function (a) {
                function b(a) {
                    return c(a) || "object" == typeof a && null !== a
                }

                function c(a) {
                    return"function" == typeof a
                }

                function d(a) {
                    return"[object Array]" === Object.prototype.toString.call(a)
                }

                var e = Date.now || function () {
                    return(new Date).getTime()
                };
                a.objectOrFunction = b, a.isFunction = c, a.isArray = d, a.now = e
            }), b("promise/polyfill").polyfill()
        }()
    }).call(this, require("JkpR2F"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
}, {JkpR2F: 227}], 157: [function (d, c) {
    c.exports = {DeferredQueue: d("./ac-deferredqueue/DeferredQueue"), Action: d("./ac-deferredqueue/Action")}
}, {"./ac-deferredqueue/Action": 158, "./ac-deferredqueue/DeferredQueue": 159}], 158: [function (f, e) {
    function h(d, c) {
        if ("function" != typeof d) {
            throw new TypeError("Deferred Queue func must be a function.")
        }
        this._options = c || {}, this._options.delay = this._options.delay || 0, this.__func = d
    }

    var g = h.prototype;
    g.run = function () {
        var b = this.__func;
        "number" == typeof this._options.delay && this._options.delay > 0 ? window.setTimeout(function () {
            b()
        }, 1000 * this._options.delay) : b()
    }, e.exports = h
}, {}], 159: [function (g, f) {
    function j(b) {
        this._options = b || {}, this._options.autoplay = this._options.autoplay || !1, this._options.asynchronous = this._options.asynchronous || !1, this._isPlaying = !1, this._isRunningAction = !1, this._queue = [], this.didFinish = this.__didFinish.bind(this)
    }

    var i = g("./Action"), h = j.prototype;
    h.add = function (k, d) {
        var m, l = {};
        d > 0 && (l.delay = d), m = new i(k, l), this._queue.push(m), this._isPlaying || this._options.autoplay !== !0 ? this._isPlaying && this.__runNextAction() : this.start()
    }, h.remove = function (b) {
        this._queue = this._queue.filter(function (c) {
            return c !== b
        })
    }, h.start = function () {
        return this._isPlaying ? !1 : (this._isPlaying = !0, void this.__runNextAction())
    }, h.stop = function () {
        return this._isPlaying ? void (this._isPlaying = !1) : !1
    }, h.clear = function () {
        this._queue = [], this.stop()
    }, h.__didFinish = function () {
        this._isRunningAction = !1, this.__runNextAction()
    }, h.__runNextAction = function () {
        if (!this._isPlaying) {
            return !1
        }
        if (this._queue.length && !this._isRunningAction) {
            var b = this._queue.shift();
            if (b.run(), this._options.asynchronous === !0) {
                return void (this._isRunningAction = !0)
            }
            this.__runNextAction()
        }
    }, f.exports = j
}, {"./Action": 158}], 160: [function (e, d) {
    var f = e("./ac-element-tracker/ElementTracker");
    d.exports = new f, d.exports.ElementTracker = f
}, {"./ac-element-tracker/ElementTracker": 161}], 161: [function (x, w) {
    function v(d, c) {
        this.options = t.clone(n), this.options = "object" == typeof c ? t.extend(this.options, c) : this.options, this.windowDelegate = q, this.tracking = !1, this.elements = [], d && (Array.isArray(d) || this._isNodeList(d) || s.isElement(d)) && this.addElements(d), this.options.autoStart && this.start()
    }

    var u, t = x("ac-object"), s = x("ac-base").Element, r = x("ac-base").Array, q = x("window-delegate").WindowDelegate, p = x("./TrackedElement"), o = x("ac-event-emitter").EventEmitter, n = {autoStart: !1};
    u = v.prototype = new o;
    var m = /^\[object (HTMLCollection|NodeList|Object)\]$/;
    u._isNodeList = function (b) {
        return b ? "number" != typeof b.length ? !1 : "object" != typeof b[0] || b[0] && b[0].nodeType ? m.test(Object.prototype.toString.call(b)) : !1 : !1
    }, u._registerElements = function (b) {
        b = [].concat(b), b.forEach(function (d) {
            if (this._elementInDOM(d)) {
                var c = new p(d);
                c.offsetTop = c.element.offsetTop, this.elements.push(c)
            }
        }, this)
    }, u._registerTrackedElements = function (d) {
        var c = [].concat(d);
        c.forEach(function (b) {
            this._elementInDOM(b.element) && (b.offsetTop = b.element.offsetTop, this.elements.push(b))
        }, this)
    }, u._elementInDOM = function (e) {
        var d = !1, f = document.getElementsByTagName("body")[0];
        return s.isElement(e) && f.contains(e) && (d = !0), d
    }, u._onVPChange = function () {
        this.elements.forEach(function (b) {
            this.refreshElementState(b)
        }, this)
    }, u._elementPercentInView = function (b) {
        return b.pixelsInView / b.height
    }, u._elementPixelsInView = function (g) {
        var f = 0, j = g.top, i = g.bottom, h = this.windowDelegate.innerHeight;
        return 0 >= j && i >= h ? f = h : j >= 0 && h > j && i > h ? f = h - j : 0 > j && h > i && i >= 0 ? f = g.bottom : j >= 0 && h >= i && (f = g.height), f
    }, u._ifInView = function (d, c) {
        c || d.trigger("enterview", d)
    }, u._ifAlreadyInView = function (b) {
        b.inView || b.trigger("exitview", b)
    }, u.addElements = function (b) {
        b = this._isNodeList(b) ? r.toArray(b) : [].concat(b), b.forEach(function (c) {
            this.addElement(c)
        }, this)
    }, u.addElement = function (d) {
        var c;
        return s.isElement(d) && (c = new p(d), this._registerTrackedElements(c)), c
    }, u.removeElement = function (e) {
        var d, f = [];
        this.elements.forEach(function (c, g) {
            (c === e || c.element === e) && f.push(g)
        }), d = this.elements.filter(function (g, c) {
            return f.indexOf(c) < 0 ? !0 : !1
        }), this.elements = d
    }, u.stop = function () {
        this.tracking === !0 && (this.tracking = !1, this.windowDelegate.off("scroll resize orientationchange", this._onVPChange))
    }, u.start = function () {
        this.tracking === !1 && (this.tracking = !0, this.windowDelegate.on("scroll resize orientationchange", this._onVPChange, this), this.refreshAllElementStates())
    }, u.refreshAllElementStates = function () {
        this.elements.forEach(function (b) {
            this.refreshElementState(b)
        }, this)
    }, u.refreshElementState = function (e) {
        var d = s.getBoundingBox(e.element), f = e.inView;
        return e = t.extend(e, d), e.pixelsInView = this._elementPixelsInView(e), e.percentInView = this._elementPercentInView(e), e.inView = e.pixelsInView > 0, e.inView && this._ifInView(e, f), f && this._ifAlreadyInView(e), e
    }, w.exports = v
}, {"./TrackedElement": 162, "ac-base": 6, "ac-event-emitter": 62, "ac-object": 166, "window-delegate": 199}], 162: [function (g, f) {
    function j(b) {
        if (!(b.nodeType && b.nodeType > 0)) {
            throw new TypeError("TrackedElement: " + b + " is not a valid DOM element")
        }
        this.element = b, this.inView = !1, this.percentInView = 0, this.pixelsInView = 0, this.offsetTop = 0, this.top = 0, this.right = 0, this.bottom = 0, this.left = 0, this.width = 0, this.height = 0, h.call(this, b)
    }

    var i, h = g("ac-dom-emitter").DOMEmitter;
    i = j.prototype = new h(null), f.exports = j
}, {"ac-dom-emitter": 60}], 163: [function (e, d) {
    var f = e("./ac-element-engagement/ElementEngagement");
    d.exports = new f, d.exports.ElementEngagement = f
}, {"./ac-element-engagement/ElementEngagement": 164}], 164: [function (j, i) {
    var p, o = j("ac-object"), n = (j("ac-base").Element, j("ac-element-tracker").ElementTracker), m = {timeToEngage: 500, inViewThreshold: 0.75, stopOnEngaged: !0}, l = {thresholdEnterTime: 0, thresholdExitTime: 0, inThreshold: !1, engaged: !1, tracking: !0}, k = function () {
        n.call(this)
    };
    p = k.prototype = new n, p._decorateTrackedElement = function (e, d) {
        var f;
        f = o.defaults(m, d || {}), o.extend(e, f), o.extend(e, l)
    }, p._attachElementListeners = function (b) {
        b.on("thresholdenter", this._thresholdEnter, this), b.on("thresholdexit", this._thresholdExit, this), b.on("enterview", this._enterView, this), b.on("exitview", this._exitView, this)
    }, p._removeElementListeners = function (b) {
        b.off("thresholdenter", this._thresholdEnter), b.off("thresholdexit", this._thresholdExit), b.off("enterview", this._enterView), b.off("exitview", this._exitView)
    }, p._attachAllElementListeners = function () {
        this.elements.forEach(function (b) {
            b.stopOnEngaged ? b.engaged || this._attachElementListeners(b) : this._attachElementListeners(b)
        }, this)
    }, p._removeAllElementListeners = function () {
        this.elements.forEach(function (b) {
            this._removeElementListeners(b)
        }, this)
    }, p._elementInViewPastThreshold = function (e) {
        var d = this.windowDelegate.innerHeight, f = !1;
        return f = e.pixelsInView === d ? !0 : e.percentInView > e.inViewThreshold
    }, p._ifInView = function (d) {
        var c = d.inThreshold;
        n.prototype._ifInView.apply(this, arguments), !c && this._elementInViewPastThreshold(d) && (d.inThreshold = !0, d.trigger("thresholdenter", d), "number" == typeof d.timeToEngage && d.timeToEngage >= 0 && (d.engagedTimeout = window.setTimeout(this._engaged.bind(this, d), d.timeToEngage)))
    }, p._ifAlreadyInView = function (d) {
        var c = d.inThreshold;
        n.prototype._ifAlreadyInView.apply(this, arguments), c && !this._elementInViewPastThreshold(d) && (d.inThreshold = !1, d.trigger("thresholdexit", d), d.engagedTimeout && (window.clearTimeout(d.engagedTimeout), d.engagedTimeout = null))
    }, p._engaged = function (b) {
        b.engagedTimeout = null, this._elementEngaged(b), b.trigger("engaged", b), this.trigger("engaged", b)
    }, p._thresholdEnter = function (b) {
        b.thresholdEnterTime = Date.now(), b.thresholdExitTime = 0, this.trigger("thresholdenter", b)
    }, p._thresholdExit = function (b) {
        b.thresholdExitTime = Date.now(), this.trigger("thresholdexit", b)
    }, p._enterView = function (b) {
        this.trigger("enterview", b)
    }, p._exitView = function (b) {
        this.trigger("exitview", b)
    }, p._elementEngaged = function (b) {
        b.engaged = !0, b.stopOnEngaged && this.stop(b)
    }, p.stop = function (b) {
        this.tracking && !b && (this._removeAllElementListeners(), n.prototype.stop.call(this)), b && b.tracking && (b.tracking = !1, this._removeElementListeners(b))
    }, p.start = function (b) {
        b || (this._attachAllElementListeners(), n.prototype.start.call(this)), b && !b.tracking && (b.stopOnEngaged ? b.engaged || (b.tracking = !0, this._attachElementListeners(b)) : (b.tracking = !0, this._attachElementListeners(b)))
    }, p.addElement = function (e, d) {
        var f = n.prototype.addElement.call(this, e);
        return this._decorateTrackedElement(f, d), f
    }, p.addElements = function (d, c) {
        [].forEach.call(d, function (b) {
            this.addElement(b, c)
        }, this)
    }, i.exports = k
}, {"ac-base": 6, "ac-element-tracker": 160, "ac-object": 166}], 165: [function (d, c) {
    c.exports = d(5)
}, {}], 166: [function (d, c) {
    c.exports = d(124)
}, {"./ac-object/clone": 167, "./ac-object/create": 168, "./ac-object/defaults": 169, "./ac-object/extend": 170, "./ac-object/getPrototypeOf": 171, "./ac-object/isDate": 172, "./ac-object/isEmpty": 173, "./ac-object/isRegExp": 174, "./ac-object/toQueryParameters": 175}], 167: [function (d, c) {
    c.exports = d(125)
}, {"./extend": 170}], 168: [function (d, c) {
    c.exports = d(126)
}, {}], 169: [function (d, c) {
    c.exports = d(127)
}, {"./extend": 170}], 170: [function (d, c) {
    c.exports = d(128)
}, {}], 171: [function (d, c) {
    c.exports = d(129)
}, {}], 172: [function (d, c) {
    c.exports = d(130)
}, {}], 173: [function (d, c) {
    c.exports = d(131)
}, {}], 174: [function (d, c) {
    c.exports = d(132)
}, {}], 175: [function (d, c) {
    c.exports = d(133)
}, {qs: 165}], 176: [function (e, d, f) {
    f.ScrollView = e("./ac-scrollview/ScrollView")
}, {"./ac-scrollview/ScrollView": 183}], 177: [function (e, d) {
    function f() {
    }

    f.prototype = {on: function () {
        return this._parent.on.apply(this._parent, arguments)
    }, off: function () {
        return this._parent.off.apply(this._parent, arguments)
    }, trigger: function () {
        return this._parent.trigger.apply(this._parent, arguments)
    }, once: function () {
        return this._parent.once.apply(this._parent, arguments)
    }, setEnabled: function () {
        this._parent.setEnabled.apply(this._parent, arguments)
    }, isEnabled: function () {
        return this._parent.isEnabled.apply(this._parent, arguments)
    }}, d.exports = f
}, {}], 178: [function (h, g) {
    var l = function (d, c) {
        return Math.max(0, Math.min(d, c))
    }, k = function (e, d) {
        var f = {x: 0, y: 0};
        return e.x < 0 ? f.x = -e.x : e.x > d.x && (f.x = d.x - e.x), e.y < 0 ? f.y = -e.y : e.y > d.y && (f.y = d.y - e.y), f
    }, j = function (d, c) {
        return d.x = l(d.x, c.x), d.y = l(d.y, c.y), d
    }, i = function (f, d, n) {
        var m = k(d, n);
        return 0 !== m.x && (d.x = f.x + 0.5 * (d.x - f.x)), 0 !== m.y && (d.y = f.y + 0.5 * (d.y - f.y)), d
    };
    g.exports = {calculateOverscrollAmount: k, constrainValue: l, constrainToScrollBounds: j, halfInputIfOutsideOfScrollBounds: i}
}, {}], 179: [function (h, g) {
    function l(b) {
        this._parent = b, this._currentAxis = void 0
    }

    var k = h("./BaseInputDecorator"), j = 4, i = l.prototype = new k;
    i.inputStart = function (d, c) {
        this._currentAxis = !1, this._firstTouch = {x: d, y: c}, this._parent.inputStart.apply(this._parent, arguments)
    }, i.inputMove = function (d, c) {
        this._currentAxis || (Math.abs(d - this._firstTouch.x) > j ? this._currentAxis = "x" : Math.abs(c - this._firstTouch.y) > j && (this._currentAxis = "y")), "x" === this._currentAxis ? c = this._firstTouch.y : "y" === this._currentAxis && (d = this._firstTouch.x), this._parent.inputMove.apply(this._parent, arguments)
    }, i.inputEnd = function () {
        this._parent.inputEnd.apply(this._parent, arguments)
    }, g.exports = l
}, {"./BaseInputDecorator": 177}], 180: [function (r, q) {
    function p(e) {
        if (this.options = o({}, k, e || {}), e && e.friction) {
            var d = e.friction;
            if (!("object" == typeof d && "x" in d && "y" in d)) {
                throw new TypeError("InertiaCalculator expects custom friction to be an object with numeric x/y properties.")
            }
        }
        if (e && e.outOfBounds) {
            var f = e.outOfBounds;
            if (!("object" == typeof f && "acceleration" in f && "deceleration" in f)) {
                throw new TypeError("InertiaCalculator expects custom outOfBounds coefficients to be an object with numeric acceleration/deceleration properties.")
            }
        }
    }

    var o = r("./utilities").assign, n = r("./Constraints"), m = r("./utilities").fastFivePointPrecision, l = 1000 / 60, k = {friction: {x: 0.95, y: 0.95}, outOfBounds: {deceleration: 0.05, acceleration: 0.1}}, j = p.prototype;
    j.calculateInertiaPositions = function (f, e, w, v, u) {
        var t = [];
        for (u || (u = this.options.friction), e = {x: e.x * l, y: e.y * l}, 0 === w.x && (e.x = 0), 0 === w.y && (e.y = 0); Math.abs(e.x) > 0.01 || Math.abs(e.y) > 0.01;) {
            if (t.length > 5000) {
                return console.warn("potential loop detected."), t
            }
            f.x = f.x + e.x, f.y = f.y + e.y, e.x = e.x * u.x, e.y = e.y * u.y, f.x = m(f.x), f.y = m(f.y);
            var s = n.calculateOverscrollAmount(f, w);
            0 !== s.x && (s.x * e.x <= 0 ? e.x += s.x * this.options.outOfBounds.deceleration : e.x = s.x * this.options.outOfBounds.acceleration), 0 !== s.y && (s.y * e.y <= 0 ? e.y += s.y * this.options.outOfBounds.deceleration : e.y = s.y * this.options.outOfBounds.acceleration), v && n.constrainToScrollBounds(f, w), t.push({x: f.x, y: f.y, velocity: {x: m(e.x / l), y: m(e.y / l)}})
        }
        if (t.length > 1) {
            var g = t[t.length - 1];
            g.x = Math.round(g.x), g.y = Math.round(g.y), n.constrainToScrollBounds(g, w)
        }
        return t
    }, j.calculateInitialVelocity = function (g, f) {
        var w = {}, v = 1 - this.options.friction.x, u = 1 - this.options.friction.y, t = f.x - g.x;
        w.x = m(v * t / l);
        var s = f.y - g.y;
        return w.y = m(u * s / l), w
    }, j.calculateFrictionToStopAtPoint = function (g, f, u) {
        var t = {}, s = Math.abs(u.x - g.x);
        t.x = m(1 - Math.abs(f.x) * l / s);
        var i = Math.abs(u.y - g.y);
        return t.y = m(1 - Math.abs(f.y) * l / i), t.y = Math.min(1, t.y), t.x = Math.min(1, Math.max(0, t.x)), t.y = Math.min(1, Math.max(0, t.y)), isNaN(t.x) && (t.x = 0), isNaN(t.y) && (t.y = 0), t
    }, q.exports = p
}, {"./Constraints": 178, "./utilities": 190}], 181: [function (h, g) {
    function l(b) {
        this._clock = new j, this._isPlaying = !1, this._scroll = b, this._currentFrameCnt = 0, this._accumulatedTime = 0, this._currentAnimationDuration = 0, this._clock.on("draw", this._draw, this)
    }

    var k = h("ac-event-emitter").EventEmitter, j = h("ac-clock").Clock, i = l.prototype = new k;
    i.stop = function () {
        this._isPlaying && (this._clock.stop(), this._isPlaying = !1, this.trigger("end")), this._frames = []
    }, i.isPlaying = function () {
        return this._isPlaying
    }, i.getCurrentFrame = function () {
        return this._currentFrame
    }, i.getNextFrame = function (d) {
        this._accumulatedTime += d.delta;
        var c = Math.round(this._accumulatedTime / (1000 / 60));
        return this._currentFrame = this._frames[c], this._currentFrame
    }, i._draw = function (d) {
        var c = this.getNextFrame(d);
        return !this._isPlaying || this._accumulatedTime > this._currentAnimationDuration ? (this._isPlaying = !1, this.trigger("end"), void this._clock.stop()) : void this._scroll.setPosition(c)
    }, i.play = function (b) {
        this._isPlaying || (this._frames = b, this._isPlaying = !0, this._accumulatedTime = 0, this._currentFrameCnt = this._frames.length - 1, this._currentFrame = this._frames[0], this._currentAnimationDuration = this._currentFrameCnt / 60 * 1000, this._clock.start())
    }, g.exports = l
}, {"ac-clock": 53, "ac-event-emitter": 62}], 182: [function (i, h) {
    function n(d, c) {
        this._parent = d, this._axis = c, this._inputs = [], this._startTouchMove = null, this._shouldPreventDefault = null
    }

    var m = i("./BaseInputDecorator"), l = 45, k = -l, j = n.prototype = new m;
    j._calculateTouchAngles = function () {
        var p = {x: 0, y: 0}, o = this._inputs[this._inputs.length - 1], v = this._inputs[0], u = o.x - v.x, t = o.y - v.y, s = Math.sqrt(u * u + t * t);
        if (0 === s) {
            return !1
        }
        var r = Math.asin(t / s), q = Math.acos(u / s);
        return p.x = r * (180 / Math.PI), p.y = q * (180 / Math.PI), p.y -= 90, p
    }, j.inputStart = function (f, e, o, g) {
        this._inputs = [
            {x: f, y: e}
        ], this._startTouchMove = {x: f, y: e, timeStamp: o, e: g}, this._checkToPreventDefault = !0, this._parent.inputStart.apply(this._parent, arguments)
    }, j._angleTest = function (b) {
        return l >= b && b >= k ? !0 : !1
    }, j._preventDefault = function (f, e, o, g) {
        g.preventDefault(), this._shouldPreventDefault = !0, this._parent.inputMove.apply(this._parent, arguments)
    }, j.inputMove = function (e, d) {
        this._inputs[1] = {x: e, y: d};
        var f = this._calculateTouchAngles();
        "y" === this._axis && this._angleTest(f.y) || "x" === this._axis && this._angleTest(f.x) || this._axis === !0 && (this._angleTest(f.x) || this._angleTest(f.y)) ? this._shouldPreventDefault !== !1 && this._preventDefault.apply(this, arguments) : this._shouldPreventDefault === !0 ? this._preventDefault.apply(this, arguments) : this._shouldPreventDefault = !1
    }, j.inputEnd = function () {
        this._shouldPreventDefault = !0, this._parent.inputEnd.apply(this._parent, arguments)
    }, h.exports = n
}, {"./BaseInputDecorator": 177}], 183: [function (J, I) {
    function H(d, c) {
        if (!d || !d instanceof Element) {
            throw new Error("Element required as first argument for constructor.")
        }
        if (!(c && null !== c && c.width && c.height && c.contentSize)) {
            throw new Error("Scroll View requires a second argument, an object, specifying width, height, and contentSize.")
        }
        this.options = G({}, t, c), G(this, {_element: d, _width: this.options.width, _height: this.options.height, _contentSize: this.options.contentSize, _isDecelerating: !1}), this._scroll = new x, this._inputNormalize = new A(this._scroll), this._inputNormalize.setEnabled(this.options.scrollingEnabled), this.options.preventDefault && (this._inputNormalize = new z(this._inputNormalize, this.options.preventDefault)), this.options.directionalLockEnabled && (this._inputNormalize = new y(this._inputNormalize)), this._inputNormalize.on("input_start", this.inputStart, this), this._inputNormalize.on("input_move", this.inputMove, this), this._inputNormalize.on("input_end", this.inputEnd, this), this.options.touch === !0 && (this._touch = new B(this._inputNormalize, d)), this.options.mouseWheel === !0 && (this._mouseWheel = new D(this._inputNormalize, d)), this.options.mouseDrag === !0 && (this._mouseDrag = new C(this._inputNormalize, d)), this._inertiaCalculator = new E(this.options), this._inertiaPlayer = new u(this._scroll), this._inertiaPlayer.on("end", function () {
            this._isDecelerating = !1, this.trigger("didEndDecelerating")
        }, this), this._scroll.propagateTo(this)
    }

    var G = J("./utilities").assign, F = J("ac-event-emitter").EventEmitter, E = J("./InertiaCalculator"), D = J("./input/MouseWheel"), C = J("./input/MouseDrag"), B = J("./input/Touch"), A = J("./input/Input"), z = J("./InputPreventDefault"), y = J("./DirectionalLock"), x = J("./model/Scroll"), w = J("./Transition"), v = J("./Constraints"), u = J("./InertiaPlayer"), t = {alwaysBounceHorizontal: !1, alwaysBounceVertical: !1, bounces: !0, directionalLockEnabled: !1, mouseDrag: !0, mouseWheel: !0, preventDefault: !0, scrollingEnabled: !0, touch: !0}, s = H.prototype = new F;
    s.isDecelerating = function () {
        return this._isDecelerating
    }, s._animateToPosition = function (e) {
        var d = this, f = this.getPosition();
        this._transition = new w({draw: function (b) {
            d.setPosition({y: f.y + (e.y - f.y) * b, x: f.x + (e.x - f.x) * b})
        }}), this._transition.play()
    }, s._handleConstraints = function (g) {
        var f = this.getContentSize(), j = this.getHeight(), i = this.getWidth(), h = this.getScrollDistance();
        return g = v.halfInputIfOutsideOfScrollBounds(this.getPosition(), g, h), !this.options.alwaysBounceHorizontal && f.height > j && f.width <= i && (g.x = 0), !this.options.alwaysBounceVertical && f.width > i && f.height <= j && (g.y = 0), this.options.bounces === !1 ? v.constrainToScrollBounds(g, h) : g
    }, s.setScrollingEnabled = function (b) {
        this._inputNormalize.setEnabled(b)
    }, s.isScrollingEnabled = function () {
        return this._inputNormalize.isEnabled()
    }, s.getPosition = function () {
        return this._scroll.getPosition()
    }, s.setPosition = function (g, f) {
        if (void 0 === f) {
            if (this._scroll.setPosition(g), this._inertiaPlayer.isPlaying()) {
                var j = this.getPosition(), i = this._inertiaPlayer.getCurrentFrame(), h = this._inertiaCalculator.calculateInertiaPositions(j, i.velocity, this.getScrollDistance(), !this.options.bounces);
                this._inertiaPlayer.stop(), this._inertiaPlayer.play(h)
            }
        } else {
            f === !1 ? (this._inertiaPlayer.stop(), this._scroll.setPosition(g)) : (this._inertiaPlayer.stop(), this._animateToPosition(g))
        }
    }, s.inertialScrollTo = function (h, g) {
        this._inertiaPlayer.isPlaying() && this._inertiaPlayer.stop();
        var l = this.getPosition(), k = v.calculateOverscrollAmount(l, this.getScrollDistance());
        0 !== k.x && (g.x = 0.1), 0 !== k.y && (g.y = 0.1);
        var j = this._inertiaCalculator.calculateFrictionToStopAtPoint(this.getPosition(), g, h), i = this._inertiaCalculator.calculateInertiaPositions(l, g, this.getScrollDistance(), !this.options.bounces, j);
        this._inertiaPlayer.play(i)
    }, s.setHeight = function (b) {
        this._height = b
    }, s.setWidth = function (b) {
        this._width = b
    }, s.getHeight = function () {
        return this._height
    }, s.getWidth = function () {
        return this._width
    }, s.setContentSize = function (b) {
        return this._contentSize.height = b.height, this._contentSize.width = b.width, this
    }, s.getContentSize = function () {
        return this._contentSize
    }, s.getScrollYDistance = function () {
        var b = this._contentSize.height - this._height;
        return 0 > b && (b = 0), b
    }, s.getScrollXDistance = function () {
        var b = this._contentSize.width - this._width;
        return 0 > b && (b = 0), b
    }, s.getScrollDistance = function () {
        return{x: this.getScrollXDistance(), y: this.getScrollYDistance()}
    }, s.inputStart = function (b) {
        this._tracking = !1, this._isDecelerating = !1, this._inertiaPlayer.stop(), this.trigger("inputStart", b)
    }, s.inputMove = function (b) {
        this._tracking || (this._tracking = !0, this.trigger("willBeginTracking")), b && b.originalEvent && "mousewheel" === b.originalEvent.type && (b = v.constrainToScrollBounds(b, this.getScrollDistance())), b = this._handleConstraints(b), this._scroll.setPosition({x: b.x, y: b.y, timeStamp: b.timeStamp, originalEvent: b.originalEvent})
    }, s.inputEnd = function (j) {
        var i = j.velocity, p = this.getPosition(), o = this.getScrollDistance(), n = v.calculateOverscrollAmount(p, o), m = this._inertiaCalculator.calculateInitialVelocity(n, {x: 0, y: 0});
        if (this._contentSize.width !== this._width || this.options.alwaysBounceHorizontal ? this._contentSize.height !== this._height || this.options.alwaysBounceVertical || (i.y = 0) : i.x = 0, 0 === i.x && 0 !== n.x && (i.x = m.x), 0 === i.y && 0 !== n.y && (i.y = m.y), 0 === i.x && 0 === i.y) {
            this.trigger("didEndTracking", !1), this.trigger("willEndTracking", {velocity: i, targetPosition: p, originalEvent: j.originalEvent})
        } else {
            var l = this._inertiaCalculator.calculateInertiaPositions(p, i, this.getScrollDistance(), !this.options.bounces), k = l[l.length - 1];
            this.trigger("willEndTracking", {velocity: i, targetPosition: k, originalEvent: j.originalEvent}), this.trigger("didEndTracking", !0), this._isDecelerating = !0, this.trigger("willBeginDecelerating"), this._inertiaPlayer.play(l)
        }
    }, I.exports = H
}, {"./Constraints": 178, "./DirectionalLock": 179, "./InertiaCalculator": 180, "./InertiaPlayer": 181, "./InputPreventDefault": 182, "./Transition": 184, "./input/Input": 185, "./input/MouseDrag": 186, "./input/MouseWheel": 187, "./input/Touch": 188, "./model/Scroll": 189, "./utilities": 190, "ac-event-emitter": 62}], 184: [function (i, h) {
    function n(b) {
        if (m(this, l, b), !b.draw) {
            throw new Error("no draw function specified")
        }
    }

    var m = i("./utilities").assign, l = {duration: 350}, k = function (f, e, o, g) {
        return f /= g / 2, 1 > f ? o / 2 * f * f + e : (f--, -o / 2 * (f * (f - 2) - 1) + e)
    }, j = n.prototype;
    j.update = function (e) {
        this.startTime || (this.startTime = e);
        var d = (e - this.startTime) / this.duration, f = k(d, 0, 1, 1);
        1 > d ? (this.draw(f), this._raf = window.requestAnimationFrame(this.update.bind(this))) : this.draw(1)
    }, j.play = function () {
        window.requestAnimationFrame(this.update.bind(this))
    }, j.stop = function () {
        window.cancelAnimationFrame(this._raf)
    }, h.exports = n
}, {"./utilities": 190}], 185: [function (h, g) {
    function l(b) {
        this._startingInputPosition = null, this._lastInputPosition = null, this._inputPositions = [], this._scroll = b, this._enabled = !0
    }

    var k = h("ac-event-emitter").EventEmitter, j = h("../utilities").fastFivePointPrecision, i = l.prototype = new k;
    i._addPosition = function (d) {
        this._inputPositions.push(d);
        var c = Date.now();
        this._inputPositions.length >= 3 && c - this._inputPositions[0].timeStamp > 100 && this._inputPositions.shift()
    }, i._pruneOldPositions = function () {
        var b = Date.now();
        this._inputPositions = this._inputPositions.filter(function (c) {
            return b - c.timeStamp < 100 ? c : void 0
        })
    }, i._calculateVelocity = function () {
        var f = {x: 0, y: 0};
        if (this._pruneOldPositions(), this._inputPositions.length < 2) {
            return f
        }
        var e = this._inputPositions[0], n = this._inputPositions[this._inputPositions.length - 1], m = n.timeStamp - e.timeStamp;
        return f.x = -(n.x - e.x) / m, f.y = -(n.y - e.y) / m, f.x = j(f.x), f.y = j(f.y), f
    }, i.setEnabled = function (b) {
        this._enabled = b
    }, i.isEnabled = function () {
        return this._enabled
    }, i.inputStart = function (m, f, p, o) {
        if (this._enabled) {
            var n = {x: m, y: f, timeStamp: p};
            this._addPosition(n), this._startingInputPosition = n, this.trigger("input_start", {timeStamp: p, originalEvent: o})
        }
    }, i.inputMove = function (n, m, r, q) {
        if (this._enabled) {
            var p = {x: n, y: m, timeStamp: r};
            this._addPosition(p), this._lastInputPosition = p;
            var o = this.getScrollValues();
            this.trigger("input_move", {x: o.x, y: o.y, timeStamp: r, originalEvent: q})
        }
    }, i.inputEnd = function (d, c) {
        this._enabled && (this.trigger("input_end", {lastInputPosition: this._lastInputPosition, timeStamp: d, originalEvent: c, velocity: this._calculateVelocity()}), this._positions = [], this._lastInputPosition = null, this._startingInputPosition = null)
    }, i.getScrollValues = function () {
        var d = this._inputPositions[this._inputPositions.length - 2], c = this._scroll.getPosition();
        return{x: d.x - this._lastInputPosition.x + c.x, y: d.y - this._lastInputPosition.y + c.y}
    }, g.exports = l
}, {"../utilities": 190, "ac-event-emitter": 62}], 186: [function (f, e) {
    function h(d, c) {
        this._input = d, this._element = c, this._domEmitter = new g(c), c.style.webkitUserSelect = "none", this.bindDOMEvents()
    }

    var g = f("ac-dom-emitter").DOMEmitter;
    h.prototype = {bindDOMEvents: function () {
        var j = this._input, i = this._element, m = this, l = function (c) {
            j.inputMove(c.pageX, c.pageY, c.timeStamp, c)
        }, k = function (b) {
            "mouseout" === b.type && i.contains(b.relatedTarget) || (m._domEmitter.off("mousemove", l), m._domEmitter.off("mouseup", k), m._domEmitter.off("mouseout", k), j.inputEnd(b.timeStamp, b))
        };
        m._domEmitter.on("mousedown", function (c) {
            c.target.tagName.match(/input|textarea|select/i) || (j.inputStart(c.pageX, c.pageY, c.timeStamp, c), m._domEmitter.on("mousemove", l), m._domEmitter.on("mouseup", k), m._domEmitter.on("mouseout", k))
        })
    }}, e.exports = h
}, {"ac-dom-emitter": 60}], 187: [function (g, f) {
    function j(d, c) {
        this._inputController = d, this._element = c, this._domEmitter = new i(c), this._scrollTop = 0, this._scrollLeft = 0, this._timeout = null, this._hasStarted = !1, this._boundMouseWheelComplete = this.mouseWheelComplete.bind(this), this._lastEvent = null, this._velocities = [], this.bindDOMEvents()
    }

    var i = g("ac-dom-emitter").DOMEmitter, h = g("../utilities").assign;
    j.prototype = {mouseWheelComplete: function () {
        this._scrollTop = 0, this._scrollLeft = 0, this._hasStarted = !1, this._inputController.inputEnd((new Date).getTime(), this._lastEvent), this._lastEvent = null
    }, onMouseWheel: function (e) {
        var d, k;
        this._hasStarted === !1 && (this._inputController.inputStart(this._scrollLeft, this._scrollTop, e.timeStamp, e), this._hasStarted = !0), d = this._scrollTop + e.wheelDeltaY, k = this._scrollLeft + e.wheelDeltaX, this._lastEvent = h({}, e), this._scrollTop = d, this._scrollLeft = k, this._inputController.inputMove(this._scrollLeft, this._scrollTop, e.timeStamp, e), window.clearTimeout(this._timeout), this._timeout = window.setTimeout(this._boundMouseWheelComplete, 100)
    }, bindDOMEvents: function () {
        this._domEmitter.on("mousewheel", this.onMouseWheel.bind(this))
    }}, f.exports = j
}, {"../utilities": 190, "ac-dom-emitter": 60}], 188: [function (f, e) {
    function h(d, c) {
        this._input = d, this._element = c, this._domEmitter = new g(c), this.bindDOMEvents()
    }

    var g = f("ac-dom-emitter").DOMEmitter;
    h.prototype = {bindDOMEvents: function () {
        var b = this._input;
        this._element;
        this._domEmitter.on("touchstart", function (c) {
            c.touches && c.touches[0] && c.touches[0].target && c.touches[0].target.tagName.match(/input|textarea|select/i) || b.inputStart(c.pageX, c.pageY, c.timeStamp, c)
        }), this._domEmitter.on("touchmove", function (c) {
            b.inputMove(c.pageX, c.pageY, c.timeStamp, c)
        }), this._domEmitter.on("touchend touchcancel", function (c) {
            b.inputEnd(c.timeStamp, c)
        })
    }}, e.exports = h
}, {"ac-dom-emitter": 60}], 189: [function (g, f) {
    function j() {
        this.x = 0, this.y = 0
    }

    var i = g("ac-event-emitter").EventEmitter, h = j.prototype = new i;
    h.setPosition = function (b) {
        (b.x !== this.x || b.y !== this.y) && (this.x = b.x, this.y = b.y, this.trigger("scroll", {x: this.x, y: this.y, originalEvent: b.originalEvent}))
    }, h.getPosition = function () {
        return{x: this.x, y: this.y}
    }, f.exports = j
}, {"ac-event-emitter": 62}], 190: [function (g, f) {
    var j = function (e, d) {
        var k = Math.pow(10, d);
        return ~~(e * k) / k
    }, i = function (b) {
        return j(b, 5)
    }, h = function (l) {
        var k = function (b) {
            if ("object" != typeof b || null === b || void 0 === b) {
                throw new TypeError("assign: target and sources must be objects")
            }
            return b
        }, p = function (c) {
            l[c] = o[c]
        };
        l = k(l);
        for (var o, n = 1, m = arguments.length; m > n; n++) {
            o = k(arguments[n]), Object.keys(o).forEach(p)
        }
        return l
    };
    f.exports = {assign: h, fastFivePointPrecision: i, fastPrecision: j}
}, {}], 191: [function (d, c) {
    c.exports.Smoother = d("./smoother/Smoother")
}, {"./smoother/Smoother": 192}], 192: [function (e, d) {
    function f(b) {
        b = b || this.sampling, this.pool = new Array(b), this.raw = 0, this.value = 0
    }

    d.exports = f, f.prototype.sampling = 3, f.prototype.smooth = function (h, g) {
        var k = 0, j = this.pool.length;
        if ("undefined" != typeof this.pool[j - this.sampling]) {
            for (var i = this.sampling; i > 0; i--) {
                k += this.pool[j - i]
            }
            k += h, k /= this.sampling + 1
        } else {
            k = h
        }
        return g || (this.raw = h, this._track(k, !0)), k
    }, f.prototype._track = function (g, c) {
        c ? this.value = g : this.raw = this.value = g, this.pool.push(g), this.pool.shift()
    }
}, {}], 193: [function (d, c) {
    c.exports.WindowDelegate = d("./window-delegate/WindowDelegate"), c.exports.windowEmitter = d("./window-delegate/windowEmitter")
}, {"./window-delegate/WindowDelegate": 194, "./window-delegate/windowEmitter": 195}], 194: [function (g, f) {
    function j() {
        this._emitter = h, this._setWindowDimensionValues();
        try {
            this._setScrollValues()
        } catch (b) {
        }
        this.on("resize", this._setWindowDimensionValues.bind(this)), this.on("scroll", this._setScrollValues.bind(this)), this.on("touchstart", this._touchScrollStart.bind(this)), this.on("touchend", this._setZoomValues.bind(this))
    }

    var i, h = g("./windowEmitter");
    i = j.prototype, i.on = function () {
        return this._emitter.on.apply(this._emitter, arguments), this
    }, i.once = function () {
        return this._emitter.once.apply(this._emitter, arguments), this
    }, i.off = function () {
        return this._emitter.off.apply(this._emitter, arguments), this
    }, i.has = function () {
        return this._emitter.has.apply(this._emitter, arguments)
    }, i.trigger = function () {
        return this._emitter.trigger.apply(this._emitter, arguments), this
    }, i.propagateTo = function () {
        return this._emitter.propagateTo.apply(this._emitter, arguments), this
    }, i.stopPropagatingTo = function () {
        return this._emitter.stopPropagatingTo.apply(this._emitter, arguments), this
    }, i.isZoomed = function () {
        return this.clientWidth > this.innerWidth
    }, i._setWindowDimensionValues = function () {
        this.clientWidth = document.documentElement.clientWidth, this.clientHeight = document.documentElement.clientHeight, this.innerWidth = window.innerWidth || this.clientWidth, this.innerHeight = window.innerHeight || this.clientHeight
    }, i._setZoomValues = function () {
        var b = this.innerWidth;
        this.innerWidth = window.innerWidth, b !== this.innerWidth ? (this.innerHeight = window.innerHeight, this.trigger("zoom"), this.trigger(b < this.innerWidth ? "zoomIn" : "zoomOut")) : setTimeout(this._setZoomValues.bind(this), 500)
    }, i._updateScrollX = function () {
        return this.scrollX = void 0 !== window.pageXOffset ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft, this.maxScrollX = document.body.scrollWidth - this.innerWidth, this.scrollX
    }, i._updateScrollY = function () {
        return this.scrollY = void 0 !== window.pageYOffset ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop, this.maxScrollY = document.body.scrollHeight - this.innerHeight, this.scrollY
    }, i._setScrollValues = function () {
        var d = this.scrollX, c = this.scrollY;
        this._updateScrollX(), this._updateScrollY(), this.scrollX !== d && this.trigger("scrollX"), this.scrollY !== c && this.trigger("scrollY"), this._scrollStop()
    }, i._scrollStop = function () {
        "undefined" == typeof window.ontouchstart && (this._scrollStopTimer && clearTimeout(this._scrollStopTimer), this._scrollStopTimer = setTimeout(function () {
            clearTimeout(this._scrollStopTimer), this.trigger("scrollStop")
        }.bind(this), 300))
    }, i._touchScrollStart = function () {
        this._updateScrollX(), this._updateScrollY(), this.once("touchend", this._touchScrollStop.bind(this, this.scrollX, this.scrollY))
    }, i._touchScrollStop = function (e, d, k) {
        this._updateScrollX(), this._updateScrollY(), e !== this.scrollX || d !== this.scrollY ? setTimeout(this._touchScrollStop.bind(this, this.scrollX, this.scrollY, !0), 300) : k && this.trigger("scrollStop")
    }, f.exports = new j
}, {"./windowEmitter": 195}], 195: [function (e, d) {
    var f = e("ac-dom-emitter").DOMEmitter;
    d.exports = new f(window)
}, {"ac-dom-emitter": 60}], 196: [function (d, c) {
    c.exports.ScrollTimeUpdate = d("./scroll-time-update/ScrollTimeUpdate"), c.exports.ElementScrollTimeUpdate = d("./scroll-time-update/ElementScrollTimeUpdate")
}, {"./scroll-time-update/ElementScrollTimeUpdate": 197, "./scroll-time-update/ScrollTimeUpdate": 198}], 197: [function (h, g) {
    var l, k = h("./ScrollTimeUpdate"), j = h("window-delegate").WindowDelegate, i = function (d, c) {
        c = c || {}, this.el = d, this._updateOnResize = !1, k.call(this, 0, 0, c), this.setOffsets(), this._clock.on("update", this._onResizeClockUpdate, this), this._clock.on("draw", this._onResizeClockDraw, this), j.on("resize orientationchange", this._onResize, this)
    };
    l = i.prototype = new k(null), l.setOffsets = function () {
        var f = this.el.getBoundingClientRect(), e = j.scrollY, n = f.top + e, m = f.bottom + e;
        return this.options.startInView && (n -= j.innerHeight), "function" == typeof this.options.offsetTop ? n += this.options.offsetTop() : "number" == typeof this.options.offsetTop && (n += this.options.offsetTop), "function" == typeof this.options.offsetBottom ? m -= this.options.offsetBottom() : "number" == typeof this.options.offsetBottom && (m -= this.options.offsetBottom), this.min = n, this.max = m, this._distance = this.max - this.min, this
    }, l._onResize = function () {
        this._updateOnResize = !0
    }, l._onResizeClockUpdate = function () {
        this._updateOnResize && this.setOffsets()
    }, l._onResizeClockDraw = function () {
        this._updateOnResize && (this.setCurrentTime(), this._updateOnResize = !1)
    }, g.exports = i
}, {"./ScrollTimeUpdate": 198, "window-delegate": 193}], 198: [function (r, q) {
    var p, o = r("ac-event-emitter").EventEmitter, n = r("ac-clock"), m = r("window-delegate").WindowDelegate, l = r("smoother").Smoother, k = r("ac-dom-emitter").DOMEmitter, j = function (e, d, f) {
        null !== e && (o.call(this), this.options = f || {}, this.min = e, this.max = d, this._distance = d - e, this._clock = this.options.clock || n, this._emitter = m, this._lastTime = null, this._timeObj = null, this.options.el && (this._target = this.options.el, this._emitter = new k(this.options.el)), this._shouldUpdate = !1, this._shouldDraw = !1, this._didInitializeSmoothing = !1, this._emitter.on("scroll", this._debounceTimeUpdate, this), this._clock.on("update", this._onClockUpdate, this), this._clock.on("draw", this._onClockDraw, this), this.options.smooth && this._enableSmoothing(!0))
    };
    p = j.prototype = new o(null), p.setCurrentTime = function (d, c) {
        d = d || this._getCalculatedCurrentTime(), d !== this._lastTime && (this._timeObj = {time: d, lastTime: this._lastTime}, this._triggerUpdate(), c ? this._triggerDraw() : this._shouldDraw = !0, this._lastTime = d)
    }, p.start = function () {
        this._clock.start()
    }, p.stop = function () {
        this._clock.stop()
    }, p.setSmoothing = function (b) {
        return"boolean" == typeof b ? b ? void this._enableSmoothing() : void this._disableSmoothing() : void 0
    }, p._getCalculatedCurrentTime = function () {
        var f = m.scrollY, e = this.min, h = this.max, g = this._distance;
        return this._target && (f = this._target.scrollTop), e > f && (f = e), f > h && (f = h), (f - e) / g
    }, p._debounceTimeUpdate = function () {
        this._shouldUpdate = !0
    }, p._triggerUpdate = function () {
        this.trigger("_update", this._timeObj), this.options.smooth || this.trigger("update", this._timeObj)
    }, p._triggerDraw = function () {
        this.trigger("_draw", this._timeObj), this.options.smooth || this.trigger("draw", this._timeObj)
    }, p._onClockUpdate = function () {
        this._shouldUpdate && (this.setCurrentTime(), this._shouldUpdate = !1)
    }, p._onClockDraw = function () {
        this._shouldDraw && (this._triggerDraw(), this._shouldDraw = !1)
    }, p._initializeSmoothing = function () {
        this.options.smoothingPrecision = this.options.smoothingPrecision || 4, this.options.smoothingPoolSize = this.options.smoothingPoolSize || l.prototype.sampling, this._smoother = new l(this.options.smoothingPoolSize), this._smoothedValues = this._lastSmoothedValues = this._lastUpdateEvent = {time: null, lastTime: null}, this._didUpdateSmootherTrack = !1, this._shouldUpdateAndDraw = !1, this._didInitializeSmoothing = !0
    }, p._enableSmoothing = function (b) {
        this._didInitializeSmoothing || this._initializeSmoothing(), (!this.options.smooth || b) && (this.on("_update", this._updateSmoothing, this), this._clock.on("update", this._smoothOnUpdate, this), this._clock.on("draw", this._smoothOnDraw, this), this.options.smooth = !0)
    }, p._disableSmoothing = function () {
        this.off("_update", this._updateSmoothing, this), this._clock.off("update", this._smoothOnUpdate, this), this._clock.off("draw", this._smoothOnDraw, this), this.options.smooth = !1
    }, p._updateSmoothing = function (b) {
        b.lastTime = b.lastTime || 0, this._lastUpdateEvent = b, this._didUpdateSmootherTrack = !0
    }, p._smoothOnUpdate = function () {
        var e = this._didUpdateSmootherTrack || this._lastSmoothedValues.time !== this._smoothedValues.time || this._lastSmoothedValues.lastTime !== this._smoothedValues.lastTime;
        if (!e) {
            return void (this._shouldUpdateAndDraw = !1)
        }
        this._didUpdateSmootherTrack = !1;
        var d = this._lastUpdateEvent.lastTime, f = {};
        f.lastTime = this._smoothedValues.time, f.time = this._smoother.smooth(this._lastUpdateEvent.time), null === f.lastTime && (f.lastTime = parseFloat(d.toFixed(this.options.smoothingPrecision))), f.time = parseFloat(f.time.toFixed(this.options.smoothingPrecision)), f.lastTime = f.lastTime, this._lastSmoothedValues = this._smoothedValues, this._smoothedValues = f, this._shouldUpdateAndDraw = !0, this.trigger("update", this._smoothedValues)
    }, p._smoothOnDraw = function () {
        this._shouldUpdateAndDraw && (this.trigger("draw", this._smoothedValues), this._shouldUpdateAndDraw = !1)
    }, q.exports = j
}, {"ac-clock": 53, "ac-dom-emitter": 60, "ac-event-emitter": 62, smoother: 191, "window-delegate": 193}], 199: [function (d, c) {
    c.exports = d(193)
}, {"./window-delegate/WindowDelegate": 200, "./window-delegate/windowEmitter": 201}], 200: [function (d, c) {
    c.exports = d(194)
}, {"./windowEmitter": 201}], 201: [function (d, c) {
    c.exports = d(195)
}, {"ac-dom-emitter": 60}], 202: [function (d, c) {
    c.exports.createAmbient = d("./factories/createAmbient"), c.exports.createBasicPlayer = d("./factories/createBasicPlayer"), c.exports.createClickToPlay = d("./factories/createClickToPlay"), c.exports.createGrabber = d("./factories/createGrabber"), c.exports.createScrubOnScroll = d("./factories/createScrubOnScroll")
}, {"./factories/createAmbient": 220, "./factories/createBasicPlayer": 221, "./factories/createClickToPlay": 222, "./factories/createGrabber": 223, "./factories/createScrubOnScroll": 224}], 203: [function (i, h) {
    function n(e, d, f) {
        this.options = l.defaults(j, f || {}), this.mediaObject = e, d && this.View && (this.view = new this.View(d, this.options)), this._setupMediaObjectListeners()
    }

    var m, l = i("ac-object"), k = i("../utils/destroy"), j = {};
    m = n.prototype = {}, m.View = i("./Controller/View"), m.destroy = function () {
        k(this, !1)
    }, m._setupMediaObjectListeners = function () {
        this.mediaObject.on("play", this._onPlay, this), this.mediaObject.on("ended", this._onEnded, this), this.mediaObject.on("pause", this._onPause, this), this.mediaObject.on("stop", this._onStop, this), this.mediaObject.on("timeupdate", this._onTimeupdate, this), this.mediaObject.once("loadstart", this._onLoadstart, this), this.mediaObject.once("loaded", this._onLoad, this), this.mediaObject.once("ready", this._onReady, this)
    }, m._onPlay = function () {
    }, m._onEnded = function () {
    }, m._onPause = function () {
    }, m._onStop = function () {
    }, m._onTimeupdate = function () {
    }, m._onLoadstart = function () {
    }, m._onLoad = function () {
    }, m._onReady = function () {
    }, h.exports = n
}, {"../utils/destroy": 225, "./Controller/View": 208, "ac-object": 166}], 204: [function (i, h) {
    function n(e, d, f) {
        k.call(this, e, d, l.defaults(j, f || {})), this.view.on("click", this._onTriggerClicked, this), ("stop" === this.options.behavior || "pause" === this.options.behavior) && this.view.disable()
    }

    var m, l = i("ac-object"), k = i("../Controller"), j = {behavior: "play", stopableWhilePlaying: !0, disableWhilePlaying: !1};
    m = n.prototype = l.create(k.prototype), m.View = i("./View/Trigger"), m._onTriggerClicked = function () {
        "play" === this.options.behavior ? this.view.active && this.options.stopableWhilePlaying ? this.mediaObject.stop() : this.mediaObject.play() : "stop" === this.options.behavior ? this.mediaObject.stop() : "pause" === this.options.behavior && this.mediaObject.pause()
    }, m._reset = function () {
        this.view.deactivate(), this.view.enable()
    }, m._setupMediaObjectListeners = function () {
        this.mediaObject.on("play", this._onPlay, this), this.mediaObject.on("pause", this._onPause, this), this.mediaObject.on("ended", this._onEnded, this), this.mediaObject.on("stop", this._onStop, this)
    }, m._onPlay = function () {
        "play" === this.options.behavior ? this.view.activate() : "pause" === this.options.behavior && this.view.deactivate(), this.options.disableWhilePlaying ? this.view.disable() : ("stop" === this.options.behavior || "pause" === this.options.behavior) && this.view.enable()
    }, m._onPause = function () {
        "play" === this.options.behavior ? (this.view.removeReplayState(), this.view.deactivate(), this.view.enable()) : "pause" === this.options.behavior && this.view.activate()
    }, m._onStop = function () {
        this._onEnded()
    }, m._onEnded = function () {
        "play" === this.options.behavior ? (this.view.addReplayState(), this.view.enable()) : "stop" === this.options.behavior || "pause" === this.options.behavior ? this.view.disable() : this.view.enable(), this.view.deactivate()
    }, h.exports = n
}, {"../Controller": 203, "./View/Trigger": 210, "ac-object": 166}], 205: [function (t, s) {
    function r(e, d, f) {
        m.call(this, e, d, p.defaults(k, f || {})), this._value = null, this._setupScrollView(), this._trackScrollView(), this._setupClock()
    }

    var q, p = t("ac-object"), o = t("ac-base").Element, n = t("ac-scrollview").ScrollView, m = t("../Controller"), l = t("ac-clock"), k = {continuous: !0, speed: 0.25, direction: 1, mouseWheel: !1, mouseDrag: !0, friction: 0.88, bounces: !1, clock: l};
    q = r.prototype = p.create(m.prototype), q.View = t("./View/Grabbable"), q._setupMediaObjectListeners = function () {
    }, q._setupScrollView = function () {
        var b = o.getBoundingBox(this.view.element);
        this._totalDistance = b.width * (1 / this.options.speed), this._scrollview = new n(this.view.element, {contentSize: {width: 2 * this._totalDistance, height: b.height}, friction: {x: this.options.friction, y: 0.95}, width: this._totalDistance, height: this._totalDistance, mouseWheel: this.options.mouseWheel, mouseDrag: this.options.mouseDrag, preventDefault: !0, bounces: !this.options.continuous && this.options.bounces}), this._scrollview.setPosition({x: this._totalDistance, y: 0})
    }, q._trackScrollView = function () {
        this._scrollview.on("willBeginTracking", function () {
            this.view.setGrabbing(!0)
        }, this), this._scrollview.on("didEndTracking", function () {
            this.view.setGrabbing(!1)
        }, this), this._scrollview.on("scroll", this._onScroll, this)
    }, q._setupClock = function () {
        this.options.clock.isRunning() || this.options.clock.start(), this.options.clock.on("draw", this._draw, this)
    }, q._onScroll = function (b) {
        (b.x >= this._totalDistance || b.x <= 0) && this.options.continuous && this._scrollview.setPosition({x: this._totalDistance / 2, y: 0}), this._value = b.x % (this._totalDistance / 2) / (this._totalDistance / 2), this._value = this.options.direction < 0 ? 1 - this._value : this._value
    }, q._draw = function () {
        null !== this._value && this.mediaObject.goToDurationPercent(this._value), this._value = null
    }, s.exports = r
}, {"../Controller": 203, "./View/Grabbable": 209, "ac-base": 6, "ac-clock": 53, "ac-object": 166, "ac-scrollview": 176}], 206: [function (t, s) {
    function r(d, c) {
        this.tracker = null, m.call(this, d, null, o.defaults(k, c || {}))
    }

    var q, p = t("ac-base").Element, o = t("ac-object"), n = t("scroll-time-update").ElementScrollTimeUpdate, m = t("../Controller"), l = t("window-delegate").WindowDelegate, k = {reversed: !1, smooth: !0, startInView: !1, offsetTop: !1, offsetBottom: !1};
    q = r.prototype = o.create(m.prototype), q.View = null, q.start = function () {
        this.tracker.on("draw", this._draw, this), this.tracker.start()
    }, q.stop = function () {
        this.tracker.off("draw", this._draw), this.tracker.stop()
    }, q.setSmoothing = function (b) {
        this.options.smooth = !!b, this.tracker && this.tracker.setSmoothing(this.options.smooth)
    }, q.setOffsets = function (d, c) {
        this.tracker && (d = this._parseOffset(d), c = this._parseOffset(c), d && (this.tracker.options.offsetTop = d), c && (this.tracker.options.offsetBottom = c), this.tracker.setOffsets(), this.tracker.setCurrentTime(null, !0))
    }, q._parseOffset = function (e) {
        var d, f;
        if ("number" == typeof e || "function" == typeof e) {
            return e
        }
        if ("string" == typeof e) {
            if (/\%$/.test(e)) {
                return e = parseFloat(e, 10) / 100, f = function () {
                    return d = p.getBoundingBox(this).height
                }.bind(this.mediaObject.view.container), l.on("resize orientationchange", f), f(), function () {
                    return e * d
                }
            }
            if (/vh$/.test(e)) {
                return e = parseFloat(e, 10) / 100, function () {
                    return e * l.innerHeight
                }
            }
        }
        return !1
    }, q._setupMediaObjectListeners = function () {
        this.mediaObject.ready ? this._onReady() : this.mediaObject.once("ready", this._onReady, this)
    }, q._onReady = function () {
        var b = o.clone(this.options);
        b.startInView = !b.startInView, b.offsetTop = this._parseOffset(b.offsetTop), b.offsetBottom = this._parseOffset(b.offsetBottom), this.tracker = new n(this.mediaObject.container, b), this.start()
    }, q._draw = function (b) {
        this.mediaObject.goToDurationPercent(this.options.reversed ? 1 - b.time : b.time)
    }, s.exports = r
}, {"../Controller": 203, "ac-base": 6, "ac-object": 166, "scroll-time-update": 196, "window-delegate": 199}], 207: [function (j, i) {
    function p(d, c) {
        l.call(this, d, null, n.defaults(k, c || {}))
    }

    var o, n = j("ac-object"), m = j("ac-element-engagement"), l = j("../Controller"), k = {reversed: !1, timeToEngage: 500};
    o = p.prototype = {}, o.destroy = function () {
        this.tracker.off(), l.prototype.destroy.call(this)
    }, o._setupMediaObjectListeners = function () {
        this.mediaObject.ready ? this._onReady() : this.mediaObject.once("ready", this._onReady, this)
    }, o._onReady = function () {
        this.tracker = m.addElement(this.mediaObject.container), m.tracking || m.start(), this.tracker.once("engaged", this._onEngaged, this)
    }, o._onEngaged = function () {
        this.options.reversed && (this.mediaObject.setTime(this.mediaObject.duration), this.mediaObject.setPlaybackRate(-1)), this.mediaObject.play(), this.tracker.once("exitview", this._onExitView, this)
    }, o._onExitView = function () {
        this.mediaObject.stop()
    }, i.exports = p
}, {"../Controller": 203, "ac-element-engagement": 163, "ac-object": 166}], 208: [function (r, q) {
    function p(d, c) {
        if (this.options = m.defaults(j, c || {}), this.element = n.getElementById(d), null === this.element) {
            throw"RenderPlayer.Controller.View: Incorrect view element reference."
        }
    }

    var o, n = r("ac-base").Element, m = r("ac-object"), l = r("../../utils/destroy"), k = r("ac-event-emitter").EventEmitter, j = {stateNameActive: "renderplayer-active", stateNameDisabled: "renderplayer-disabled", stateNameReplay: "renderplayer-replay"};
    o = p.prototype = new k, o.addReplayState = function () {
        n.addClassName(this.element, this.options.stateNameReplay)
    }, o.removeReplayState = function () {
        n.removeClassName(this.element, this.options.stateNameReplay)
    }, o.activate = function () {
        this.active = !0, n.addClassName(this.element, this.options.stateNameActive)
    }, o.deactivate = function () {
        this.active = !1, n.removeClassName(this.element, this.options.stateNameActive)
    }, o.disable = function () {
        this.disabled = !0, n.addClassName(this.element, this.options.stateNameDisabled)
    }, o.enable = function () {
        this.disabled = !1, n.removeClassName(this.element, this.options.stateNameDisabled)
    }, o.destroy = function () {
        l(this)
    }, q.exports = p
}, {"../../utils/destroy": 225, "ac-base": 6, "ac-event-emitter": 62, "ac-object": 166}], 209: [function (j, i) {
    function p(d, c) {
        m.call(this, d, n.defaults(l, c || {})), o.addClassName(this.element, "renderplayer-grabbable")
    }

    var o = j("ac-base").Element, n = j("ac-object"), m = j("../View"), l = {}, k = p.prototype = n.create(m.prototype);
    k.setGrabbing = function (b) {
        b ? o.addClassName(document.body, "renderplayer-grabbing") : o.removeClassName(document.body, "renderplayer-grabbing")
    }, i.exports = p
}, {"../View": 208, "ac-base": 6, "ac-object": 166}], 210: [function (t, s) {
    function r(d, c) {
        m.call(this, d, n.defaults(l, c || {})), this._boundOnClick = p.bindAsEventListener(this._onClick, this), q.addEventListener(this.element, "click", this._boundOnClick)
    }

    var q = t("ac-base").Element, p = t("ac-base").Function, o = t("ac-base").Event, n = t("ac-object"), m = t("../View"), l = {}, k = r.prototype = n.create(m.prototype);
    k._onClick = function (b) {
        o.stop(b), this._disabled || this.trigger("click", b)
    }, s.exports = r
}, {"../View": 208, "ac-base": 6, "ac-object": 166}], 211: [function (g, f) {
    function j(e, d, k) {
        this.mediaObject = e, this.enhanceFunc = d, this.options = k || {}, this.mediaObject.once("enhance", this._onEnhance, this), this._loadedCheck()
    }

    var i, h = g("../utils/destroy");
    i = j.prototype = {}, i._enhance = function () {
        this.options.autoEnhance !== !1 && (this.mediaObject.view.enhanced || this.mediaObject.enhance())
    }, i.destroy = function () {
        h(this, !1)
    }, i._loadedCheck = function () {
        this.mediaObject.ready ? this._onReady() : (this.mediaObject.load(), this.mediaObject.once("ready", this._onReady, this))
    }, i._onEnhance = function () {
        this.mediaObject.off("ready", this._onReady, this), this.enhanceFunc(), this.destroy()
    }, i._onReady = function () {
        this._enhance()
    }, f.exports = j
}, {"../utils/destroy": 225}], 212: [function (i, h) {
    function n() {
        j.apply(this, arguments)
    }

    var m, l = i("ac-object"), k = (i("../../utils/destroy"), i("ac-element-engagement")), j = i("../Enhancer");
    m = n.prototype = l.create(j.prototype), m._inViewCheck = function () {
        this.mediaObject && !this.mediaObject.view.enhanced && (this.tracker = k.addElement(this.mediaObject.container), k.tracking || k.start(), k.refreshElementState(this.tracker), this.tracker.inView ? this.tracker.once("exitview", this._enhance, this) : this._enhance())
    }, m._onReady = function () {
        this._inViewCheck()
    }, h.exports = n
}, {"../../utils/destroy": 225, "../Enhancer": 211, "ac-element-engagement": 163, "ac-object": 166}], 213: [function (g, f) {
    function j() {
        this._active = null
    }

    var i;
    i = j.prototype, i.add = function (b) {
        b._originalPlayMethod = b.play, b.play = this.play.bind(this, b)
    }, i.play = function (b) {
        b && this._play(b)
    }, i._play = function (b) {
        this._active !== b && this.stop(), this._active = b, this._active._originalPlayMethod || this.add(this._active), this._active._originalPlayMethod.call(this._active), this._active.once("pause", this.stop, this), this._active.once("stop", this.stop, this), this._active.once("ended", this.stop, this)
    }, i.stop = function (b) {
        this._active && (this._active.off("pause", this.stop), this._active.off("stop", this.stop), this._active.off("ended", this.stop), void 0 === b && this._active.stop()), this._active = null
    };
    var h = new j;
    h.PlayController = j, f.exports = h
}, {}], 214: [function (j, i) {
    function p() {
        l.call(this), this.deferredQueue = new m({autoplay: !0, asynchronous: !0})
    }

    var o, n = j("ac-object"), m = j("ac-deferredqueue").DeferredQueue, l = j("../PlayController").PlayController;
    o = p.prototype = n.create(l.prototype), o._play = function (b) {
        b.once("play", this._onPlay, this), this.deferredQueue.add(b._originalPlayMethod.bind(b))
    }, o._onPlay = function (b) {
        this._active = b, this._active.once("pause", this.stop, this), this._active.once("stop", this.stop, this), this._active.once("ended", this.stop, this)
    }, o.stop = function (b) {
        l.prototype.stop.call(this, b), this.deferredQueue.didFinish()
    };
    var k = new p;
    k.QueuedPlayController = p, i.exports = k
}, {"../PlayController": 213, "ac-deferredqueue": 157, "ac-object": 166}], 215: [function (d, c) {
    c.exports = function (b) {
        return null !== b ? (b.container.classList.add("renderplayer-canplay"), !0) : !1
    }
}, {}], 216: [function (e, d) {
    var f = e("ac-clock").ThrottledClock;
    d.exports = new f(30)
}, {"ac-clock": 53}], 217: [function (d, c) {
    c.exports = function (f, e) {
        var g = document.createElement("a");
        return f && (g.innerHTML = f), g.setAttribute("href", "#"), e && e.parentNode && (e.parentNode.replaceChild(g, e), g.appendChild(e)), g
    }
}, {}], 218: [function (f, e) {
    var h = f("ac-object"), g = {pause: !0, stop: !0, ended: !0};
    e.exports = function (d, c, k) {
        k = h.defaults(g, k || {});
        var j = function () {
            c(), c = function () {
            }
        };
        for (var i in k) {
            k[i] && d.once(i, j)
        }
    }
}, {"ac-object": 166}], 219: [function (d, c) {
    c.exports = function (b) {
        b.once("loadstart", function () {
            b.container.classList.add("loading")
        }), b.once("loaded", function () {
            b.container.classList.remove("loading")
        })
    }
}, {}], 220: [function (x, w) {
    var v = x("ac-base").Element, u = x("ac-object"), t = x("./behaviors/canPlay"), s = x("./../ac-renderplayer/Controller/UserEngaged"), r = x("./createScrubOnScroll"), q = x("./behaviors/doAfterPlay"), p = x("../ac-renderplayer/Enhancer"), o = x("../ac-renderplayer/Enhancer/OutOfViewEnhancer"), n = x("../ac-renderplayer/PlayController/QueuedPlayController"), m = {reversed: !1, startInView: !1, tiedToScrollAfterPlayed: !1, degradeAfterPlayed: !0};
    w.exports = function (e, d, c) {
        var g, f = {};
        return d = u.defaults(m, d || {}), t(e) ? (n.add(e), d.startInView ? new p(e, function () {
            g = new s(e, {reversed: d.reversed})
        }, c) : new o(e, function () {
            g = new s(e, {reversed: d.reversed})
        }, c), f.controllers = [g], d.tiedToScrollAfterPlayed ? q(e, function () {
            var i, h = v.cumulativeOffset(e.container), b = {};
            d.startInView && (b.startInView = !0, b.reversed = !d.reversed, b.offsetTop = -1 * h.top), i = r(e, b), f.controllers.push(i)
        }, {ended: d.startInView}) : d.degradeAfterPlayed && q(e, e.degrade.bind(e)), f) : null
    }
}, {"../ac-renderplayer/Enhancer": 211, "../ac-renderplayer/Enhancer/OutOfViewEnhancer": 212, "../ac-renderplayer/PlayController/QueuedPlayController": 214, "./../ac-renderplayer/Controller/UserEngaged": 207, "./behaviors/canPlay": 215, "./behaviors/doAfterPlay": 218, "./createScrubOnScroll": 224, "ac-base": 6, "ac-object": 166}], 221: [function (g, f) {
    var j = (g("ac-base").Element, g("./behaviors/canPlay")), i = g("../ac-renderplayer/Controller"), h = g("../ac-renderplayer/Enhancer");
    f.exports = function (d, c) {
        c = c || {};
        var k = {};
        if (!j(d)) {
            return null
        }
        var e = function () {
            var l = new i(d);
            k.controllers = [l]
        };
        return new h(d, e, c), k
    }
}, {"../ac-renderplayer/Controller": 203, "../ac-renderplayer/Enhancer": 211, "./behaviors/canPlay": 215, "ac-base": 6}], 222: [function (x, w) {
    var v = x("ac-base").Element, u = x("ac-object"), t = x("./behaviors/canPlay"), s = x("../ac-renderplayer/Controller/ClickToPlay"), r = x("./behaviors/createTrigger"), q = x("../ac-renderplayer/PlayController"), p = x("./behaviors/spinner"), o = {trigger: null}, n = function (f, c) {
        var j = {}, i = v.isElement(f) ? f : r("", c.container), g = i.href.replace(/.*#/, "");
        return"play" === g || "stop" === g || "pause" === g ? j.behavior = g : "replay" === g && (j.behavior = "play", j.stopableWhilePlaying = !1, j.disableWhilePlaying = !0), new s(c, i, j)
    }, m = function (e, c) {
        "string" == typeof e && (e = v.selectAll(e)), e = [].concat(e);
        var f = e.map(function (b) {
            return n(b, c)
        });
        return f
    };
    w.exports = function (e, d) {
        var f = {};
        return d = u.defaults(o, d || {}), t(e) ? (q.add(e), p(e), f.controllers = m(d.trigger, e), e.enhance(), f) : null
    }
}, {"../ac-renderplayer/Controller/ClickToPlay": 204, "../ac-renderplayer/PlayController": 213, "./behaviors/canPlay": 215, "./behaviors/createTrigger": 217, "./behaviors/spinner": 219, "ac-base": 6, "ac-object": 166}], 223: [function (r, q) {
    var p = r("ac-object"), o = r("./behaviors/canPlay"), n = r("./behaviors/clock30fps"), m = r("../ac-renderplayer/Controller/Grabber"), l = r("../ac-renderplayer/Enhancer"), k = r("./behaviors/spinner"), j = {clock: n};
    q.exports = function (d, c) {
        var f = {};
        return c = p.defaults(j, c || {}), o(d) ? (k(d), new l(d, function () {
            var b = new m(d, d.container, c);
            f.controllers = [b]
        }), f) : null
    }
}, {"../ac-renderplayer/Controller/Grabber": 205, "../ac-renderplayer/Enhancer": 211, "./behaviors/canPlay": 215, "./behaviors/clock30fps": 216, "./behaviors/spinner": 219, "ac-object": 166}], 224: [function (t, s) {
    var r = t("ac-object"), q = t("./behaviors/canPlay"), p = t("./behaviors/clock30fps"), o = t("./../ac-renderplayer/Controller/ScrubOnScroll"), n = t("../ac-renderplayer/Enhancer"), m = t("../utils/getAttribute"), l = t("../ac-renderplayer/Enhancer/OutOfViewEnhancer"), k = {clock: p, enhanceInView: !1};
    s.exports = function (f, c, h) {
        var g = {};
        if (c = r.defaults(k, c || {}), c.offsetTop = c.offsetTop || m(f.container, "data-offsetTop", !0), c.offsetBottom = c.offsetBottom || m(f.container, "data-offsetBottom", !0), !q(f)) {
            return null
        }
        var d = function () {
            var b = new o(f, c);
            g.setOffsets = function (i, e) {
                b.setOffsets(i, e)
            }, g.setSmoothing = function (e) {
                b.setSmoothing(e)
            }, g.controllers = [b]
        };
        return c.startInView || c.enhanceInView ? new n(f, d, h) : new l(f, d, h), g
    }
}, {"../ac-renderplayer/Enhancer": 211, "../ac-renderplayer/Enhancer/OutOfViewEnhancer": 212, "../utils/getAttribute": 226, "./../ac-renderplayer/Controller/ScrubOnScroll": 206, "./behaviors/canPlay": 215, "./behaviors/clock30fps": 216, "ac-object": 166}], 225: [function (d, c) {
    c.exports = d(88)
}, {}], 226: [function (d, c) {
    c.exports = function (f, e, h) {
        var g = f.getAttribute(e) || null;
        return g && ("true" === g ? g = !0 : "false" === g ? g = !1 : h && (g = parseFloat(g, 10))), g
    }
}, {}], 227: [function (f, e) {
    function h() {
    }

    var g = e.exports = {};
    g.nextTick = function () {
        var i = "undefined" != typeof window && window.setImmediate, d = "undefined" != typeof window && window.postMessage && window.addEventListener;
        if (i) {
            return function (b) {
                return window.setImmediate(b)
            }
        }
        if (d) {
            var j = [];
            return window.addEventListener("message", function (k) {
                var c = k.source;
                if ((c === window || null === c) && "process-tick" === k.data && (k.stopPropagation(), j.length > 0)) {
                    var l = j.shift();
                    l()
                }
            }, !0), function (b) {
                j.push(b), window.postMessage("process-tick", "*")
            }
        }
        return function (b) {
            setTimeout(b, 0)
        }
    }(), g.title = "browser", g.browser = !0, g.env = {}, g.argv = [], g.on = h, g.addListener = h, g.once = h, g.off = h, g.removeListener = h, g.removeAllListeners = h, g.emit = h, g.binding = function () {
        throw new Error("process.binding is not supported")
    }, g.cwd = function () {
        return"/"
    }, g.chdir = function () {
        throw new Error("process.chdir is not supported")
    }
}, {}], "rotation-player": [function (d, c) {
    c.exports = d("zRL4oH")
}, {}], zRL4oH: [function (d, c) {
    c.exports.RotationPlayer = d("./rotation-player/RotationPlayer")
}, {"./rotation-player/RotationPlayer": 231}], 230: [function (e, d) {
    var f = function () {
        var b = {h264: "mp4"};
        return{getEnhancementFileFormats: function () {
            return b
        }}
    }();
    d.exports = f
}, {}], 231: [function (L, K) {
    function J(g, f, j, i) {
        f = D.defaults(w, f || {}), j = D.defaults(t, j || {}), i = D.defaults(u, i || {}), j.clock = new A(j.fps), f = this._mixinExperienceReportOptions(f), i = this._mixinExperienceReportTypeOptions(i), f.basePath = f.basePath + j.locale + "/", this.el = g, this.options = f, this.playerOptions = j, this.typeOptions = i, this._shouldUseRetina() && (this.options.filename = this.options.filename + v), this.playerOptions.sliderSelector && this.on("ready", this.createSlider.bind(this));
        var h = this._onHeadRequestComplete.bind(this);
        this._testAssetAvailability().then(h, h)
    }

    var I, H, G, F, E, D, C, B, A, z, y;
    try {
        H = L("ac-ajax"), G = L("ac-base").Element, F = L("ac-event-emitter").EventEmitter, E = L("./experienceReport"), D = L("ac-object"), C = L("./Environment"), B = L("ac-media-object"), A = L("ac-clock").ThrottledClock, z = L("./Slider"), y = L("ac-renderplayer")
    } catch (x) {
        return
    }
    var w = {basePath: "/105/media/us/iphone-6/2014/aos/", loadPriority: 2, filename: "asset"}, v = "_2x", u = {preload: !1, autoplay: !1}, t = {continuous: !0, speed: 0.15, direction: 1, mouseWheel: !1, mouseDrag: !0, friction: 0.88, fps: 30, locale: "en", retina: !1, sliderSelector: null};
    I = J.prototype = new F(null), I.createSlider = function () {
        var f = this._mediaObject, e = f.setTime, h = G.select(this.playerOptions.sliderSelector), g = new z(G.children(h)[0]);
        g.on("change", function (c) {
            g.changing = !0, f.goToDurationPercent(c.percent), g.changing = !1
        }), f.setTime = function (d) {
            if (e.apply(this, arguments), !g.changing) {
                var b = d / f.duration;
                g.setPercent(b)
            }
        }
    }, I._mixinExperienceReportOptions = function (b) {
        return b.fileFormat || (b.fileFormat = C.getEnhancementFileFormats()[E.scrubbable.experience]), b
    }, I._mixinExperienceReportTypeOptions = function (b) {
        return b.type || (b.type = E.scrubbable.experience), b
    }, I._handleAssetReady = function () {
        "video" === this._mediaObject._mediaElement.tagName.toLowerCase() && this._mediaObject._mediaElement.setAttribute("loop", !0), this.trigger("ready")
    }, I._testAssetAvailability = function () {
        var d = this.options.basePath + this.options.filename + ".mp4", c = {url: d, method: "head"};
        return H.create(c).send()
    }, I._createMediaObject = function () {
        this._mediaObject = B.create(this.el, this.options, this.typeOptions), this._mediaObject.once("ready", this._handleAssetReady, this), this._renderPlayer = y.createGrabber(this._mediaObject, this.playerOptions)
    }, I._onHeadRequestComplete = function (b) {
        b.status > 400 && this._onAssetUnavailable(), this._createMediaObject()
    }, I._onAssetUnavailable = function () {
        this.options.filename = w.filename, this.options.basePath = w.basePath + t.locale + "/", this._shouldUseRetina() && (this.options.filename = this.options.filename + v)
    }, I._shouldUseRetina = function () {
        return"h264" === E.scrubbable.experience && E.sizes.experienceObject.retina && this.playerOptions.retina ? !0 : !1
    }, K.exports = J
}, {"./Environment": 230, "./Slider": 232, "./experienceReport": 233, "ac-ajax": 2, "ac-base": 6, "ac-clock": 53, "ac-event-emitter": 62, "ac-media-object": 134, "ac-object": 149, "ac-renderplayer": 202}], 232: [function (z, y) {
    function x(b) {
        return this instanceof x ? ("string" == typeof b && (b = s.select(b)), q.call(this, null), this.isFallback = !/input/i.test(b.tagName), this.el = b, this.isFallback && (this.thumb = s.select(".slider-thumb", this.el), this.refresh()), this.events = new p(this.el), this.docEvents = new p(document), this._value = this.el.value || 0, this._max = 1 * this.el.getAttribute("max") || 1, this._min = 1 * this.el.getAttribute("min") || 0, this._step = 1 * this.el.getAttribute("step") || 0.001, this.onstart = this.onstart.bind(this), this.onmove = this.onmove.bind(this), this.onend = this.onend.bind(this), void this.bind()) : new x(b)
    }

    function w(e, d, f) {
        return Math.min(Math.max(e, d), f)
    }

    function v(g, f, j, i, h) {
        return i + (h - i) * ((g - f) / (j - f))
    }

    var u = z("ac-base"), t = u.Event, s = u.Element, r = u.Environment, q = z("ac-event-emitter").EventEmitter, p = z("ac-dom-emitter").DOMEmitter, o = "ontouchstart" in window, n = /Firefox/.test(r.Browser.name) || r.Feature.threeDTransformsAvailable();
    y.exports = x, x.prototype = new q(null), x.prototype.bind = function () {
        this.events.on(o ? "touchstart" : "mousedown", this.onstart)
    }, x.prototype.onstart = function (b) {
        this.isFallback && this._updateUI(b), this.docEvents.on(o ? "touchmove" : "mousemove", this.onmove), this.docEvents.on(o ? "touchend" : "mouseup", this.onend)
    }, x.prototype.onmove = function (b) {
        this.isFallback && (t.stop(b), this._updateUI(b)), this._emit()
    }, x.prototype.onend = function (b) {
        this.isFallback && this._updateUI(b), this._emit(), this.docEvents.off(o ? "touchmove" : "mousemove", this.onmove), this.docEvents.off(o ? "touchend" : "mouseup", this.onend)
    }, x.prototype._emit = function () {
        this.el.value && (this._value = this.el.value);
        var b = this._value;
        this.trigger("change", {value: b, percent: (b + this.min()) / (this.max() - this.min())})
    }, x.prototype.max = function (b) {
        return arguments.length ? (this._max = 1 * b, this.isFallback || (this.el.max = this._max), this) : this._max
    }, x.prototype.min = function (b) {
        return arguments.length ? (this._min = 1 * b, this.isFallback || (this.el.min = this._min), this) : this._min
    }, x.prototype.step = function (b) {
        return arguments.length ? (this._step = 1 * b, this) : this._step
    }, x.prototype._updateUI = function (e) {
        var d = o ? e.changedTouches[0] : e, l = this.thumbBox, k = d.clientX - l.left, j = this.thumbOffset, h = this.sliderWidth - this.thumbOffset;
        k = w(k, j, h), n ? s.setVendorPrefixStyle(this.thumb, "transform", "translate3d(" + (k - this.thumbOffset) + "px, 0, 0)") : this.thumb.style.left = k - this.thumbOffset + "px", this._value = v(k, j, h, this.min(), this.max())
    }, x.prototype._updateUIFromValue = function (g) {
        var e = (this.thumbBox, this.thumbOffset), j = this.sliderWidth - this.thumbOffset, i = v(g, this.min(), this.max(), 0, 1), h = v(i, 0, 1, e, j);
        n ? s.setVendorPrefixStyle(this.thumb, "transform", "translate3d(" + (h - this.thumbOffset) + "px, 0, 0)") : this.thumb.style.left = h - this.thumbOffset + "px"
    }, x.prototype._createElement = function () {
        this.isFallback = !0;
        var e = document.createElement("div"), d = document.createElement("div"), f = document.createElement("div");
        return e.className = "slider-fallback", d.className = "slider-line", f.className = "slider-thumb", e.appendChild(d), e.appendChild(f), e
    }, x.prototype.appendTo = function (b) {
        b.appendChild(this.el), this.refresh()
    }, x.prototype.refresh = function () {
        this.sliderWidth = s.getBoundingBox(this.el).width, this.isFallback && (this.thumbBox = s.getBoundingBox(this.thumb), this.thumbOffset = this.thumbBox.width / 2)
    }, x.prototype.setPercent = function (b) {
        this._value = v(b, 0, 1, this.min(), this.max()), this.isFallback && this._updateUIFromValue(this._value)
    }
}, {"ac-base": 6, "ac-dom-emitter": 60, "ac-event-emitter": 62}], 233: [function (g, f) {
    function j() {
        var b = {};
        return Object.keys(h).forEach(function (c) {
            b[c] = i.newExperience(h[c])
        }), b
    }

    var i = g("ac-experience-reporter"), h = g("../../build/asset-type-matrix.json");
    f.exports = j()
}, {"../../build/asset-type-matrix.json": 1, "ac-experience-reporter": 71}]}, {}, ["zRL4oH"]);