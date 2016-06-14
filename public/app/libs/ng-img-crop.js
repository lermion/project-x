/*! ngImgCropExtended v0.5.4 License: MIT */
!function() {
    var e = angular.module("ngImgCrop", []);
    e.factory("cropAreaCircle", ["cropArea", function(e) {
        var t = function() {
            e.apply(this, arguments),
            this._boxResizeBaseSize = 30,
            this._boxResizeNormalRatio = .9,
            this._boxResizeHoverRatio = 1.2,
            this._iconMoveNormalRatio = .9,
            this._iconMoveHoverRatio = 1.2,
            this._boxResizeNormalSize = this._boxResizeBaseSize * this._boxResizeNormalRatio,
            this._boxResizeHoverSize = this._boxResizeBaseSize * this._boxResizeHoverRatio,
            this._posDragStartX = 0,
            this._posDragStartY = 0,
            this._posResizeStartX = 0,
            this._posResizeStartY = 0,
            this._posResizeStartSize = 0,
            this._boxResizeIsHover = !1,
            this._areaIsHover = !1,
            this._boxResizeIsDragging = !1,
            this._areaIsDragging = !1
        }
        ;
        return t.prototype = new e,
        t.prototype.getType = function() {
            return "circle"
        }
        ,
        t.prototype._calcCirclePerimeterCoords = function(e) {
            var t = this._size.w / 2
              , r = e * (Math.PI / 180)
              , i = this.getCenterPoint().x + t * Math.cos(r)
              , n = this.getCenterPoint().y + t * Math.sin(r);
            return [i, n]
        }
        ,
        t.prototype._calcResizeIconCenterCoords = function() {
            return this._calcCirclePerimeterCoords(-45)
        }
        ,
        t.prototype._isCoordWithinArea = function(e) {
            return Math.sqrt((e[0] - this.getCenterPoint().x) * (e[0] - this.getCenterPoint().x) + (e[1] - this.getCenterPoint().y) * (e[1] - this.getCenterPoint().y)) < this._size.w / 2
        }
        ,
        t.prototype._isCoordWithinBoxResize = function(e) {
            var t = this._calcResizeIconCenterCoords()
              , r = this._boxResizeHoverSize / 2;
            return e[0] > t[0] - r && e[0] < t[0] + r && e[1] > t[1] - r && e[1] < t[1] + r
        }
        ,
        t.prototype._drawArea = function(e, t, r) {
            e.arc(t.x, t.y, r.w / 2, 0, 2 * Math.PI)
        }
        ,
        t.prototype.draw = function() {
            e.prototype.draw.apply(this, arguments);
            var t = this.getCenterPoint();
            this._cropCanvas.drawIconMove([t.x, t.y], this._areaIsHover ? this._iconMoveHoverRatio : this._iconMoveNormalRatio),
            this._cropCanvas.drawIconResizeBoxNESW(this._calcResizeIconCenterCoords(), this._boxResizeBaseSize, this._boxResizeIsHover ? this._boxResizeHoverRatio : this._boxResizeNormalRatio)
        }
        ,
        t.prototype.processMouseMove = function(e, t) {
            var r = "default"
              , i = !1;
            if (this._boxResizeIsHover = !1,
            this._areaIsHover = !1,
            this._areaIsDragging)
                this.setCenterPointOnMove({
                    x: e - this._posDragStartX,
                    y: t - this._posDragStartY
                }),
                this._areaIsHover = !0,
                r = "move",
                i = !0,
                this._events.trigger("area-move");
            else if (this._boxResizeIsDragging) {
                r = "nesw-resize";
                var n, o, a;
                o = e - this._posResizeStartX,
                a = this._posResizeStartY - t,
                n = o > a ? this._posResizeStartSize.w + 2 * a : this._posResizeStartSize.w + 2 * o;
                var s = (this.getCenterPoint(),
                {})
                  , h = {};
                s.x = this.getCenterPoint().x - .5 * n,
                h.x = this.getCenterPoint().x + .5 * n,
                s.y = this.getCenterPoint().y - .5 * n,
                h.y = this.getCenterPoint().y + .5 * n,
                this.CircleOnMove(s, h),
                this._boxResizeIsHover = !0,
                i = !0,
                this._events.trigger("area-resize")
            } else
                this._isCoordWithinBoxResize([e, t]) ? (r = "nesw-resize",
                this._areaIsHover = !1,
                this._boxResizeIsHover = !0,
                i = !0) : this._isCoordWithinArea([e, t]) && (r = "move",
                this._areaIsHover = !0,
                i = !0);
            return angular.element(this._ctx.canvas).css({
                cursor: r
            }),
            i
        }
        ,
        t.prototype.processMouseDown = function(e, t) {
            if (this._isCoordWithinBoxResize([e, t]))
                this._areaIsDragging = !1,
                this._areaIsHover = !1,
                this._boxResizeIsDragging = !0,
                this._boxResizeIsHover = !0,
                this._posResizeStartX = e,
                this._posResizeStartY = t,
                this._posResizeStartSize = this._size,
                this._events.trigger("area-resize-start");
            else if (this._isCoordWithinArea([e, t])) {
                this._areaIsDragging = !0,
                this._areaIsHover = !0,
                this._boxResizeIsDragging = !1,
                this._boxResizeIsHover = !1;
                var r = this.getCenterPoint();
                this._posDragStartX = e - r.x,
                this._posDragStartY = t - r.y,
                this._events.trigger("area-move-start")
            }
        }
        ,
        t.prototype.processMouseUp = function() {
            this._areaIsDragging && (this._areaIsDragging = !1,
            this._events.trigger("area-move-end")),
            this._boxResizeIsDragging && (this._boxResizeIsDragging = !1,
            this._events.trigger("area-resize-end")),
            this._areaIsHover = !1,
            this._boxResizeIsHover = !1,
            this._posDragStartX = 0,
            this._posDragStartY = 0
        }
        ,
        t
    }
    ]),
    e.factory("cropAreaRectangle", ["cropArea", function(e) {
        var t = function() {
            e.apply(this, arguments),
            this._resizeCtrlBaseRadius = 15,
            this._resizeCtrlNormalRatio = .75,
            this._resizeCtrlHoverRatio = 1,
            this._iconMoveNormalRatio = .9,
            this._iconMoveHoverRatio = 1.2,
            this._resizeCtrlNormalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlNormalRatio,
            this._resizeCtrlHoverRadius = this._resizeCtrlBaseRadius * this._resizeCtrlHoverRatio,
            this._posDragStartX = 0,
            this._posDragStartY = 0,
            this._posResizeStartX = 0,
            this._posResizeStartY = 0,
            this._posResizeStartSize = {
                w: 0,
                h: 0
            },
            this._resizeCtrlIsHover = -1,
            this._areaIsHover = !1,
            this._resizeCtrlIsDragging = -1,
            this._areaIsDragging = !1
        }
        ;
        return t.prototype = new e,
        t.prototype.getType = function() {
            return "rectangle"
        }
        ,
        t.prototype._calcRectangleCorners = function() {
            var e = this.getSize()
              , t = this.getSouthEastBound();
            return [[e.x, e.y], [t.x, e.y], [e.x, t.y], [t.x, t.y]]
        }
        ,
        t.prototype._calcRectangleDimensions = function() {
            var e = this.getSize()
              , t = this.getSouthEastBound();
            return {
                left: e.x,
                top: e.y,
                right: t.x,
                bottom: t.y
            }
        }
        ,
        t.prototype._isCoordWithinArea = function(e) {
            var t = this._calcRectangleDimensions();
            return e[0] >= t.left && e[0] <= t.right && e[1] >= t.top && e[1] <= t.bottom
        }
        ,
        t.prototype._isCoordWithinResizeCtrl = function(e) {
            for (var t = this._calcRectangleCorners(), r = -1, i = 0, n = t.length; n > i; i++) {
                var o = t[i];
                if (e[0] > o[0] - this._resizeCtrlHoverRadius && e[0] < o[0] + this._resizeCtrlHoverRadius && e[1] > o[1] - this._resizeCtrlHoverRadius && e[1] < o[1] + this._resizeCtrlHoverRadius) {
                    r = i;
                    break
                }
            }
            return r
        }
        ,
        t.prototype._drawArea = function(e, t, r) {
            e.rect(r.x, r.y, r.w, r.h)
        }
        ,
        t.prototype.draw = function() {
            e.prototype.draw.apply(this, arguments);
            var t = this.getCenterPoint();
            this._cropCanvas.drawIconMove([t.x, t.y], this._areaIsHover ? this._iconMoveHoverRatio : this._iconMoveNormalRatio);
            for (var r = this._calcRectangleCorners(), i = 0, n = r.length; n > i; i++) {
                var o = r[i];
                this._cropCanvas.drawIconResizeCircle(o, this._resizeCtrlBaseRadius, this._resizeCtrlIsHover === i ? this._resizeCtrlHoverRatio : this._resizeCtrlNormalRatio)
            }
        }
        ,
        t.prototype.processMouseMove = function(e, t) {
            var r = "default"
              , i = !1;
            if (this._resizeCtrlIsHover = -1,
            this._areaIsHover = !1,
            this._areaIsDragging)
                this.setCenterPointOnMove({
                    x: e - this._posDragStartX,
                    y: t - this._posDragStartY
                }),
                this._areaIsHover = !0,
                r = "move",
                i = !0,
                this._events.trigger("area-move");
            else if (this._resizeCtrlIsDragging > -1) {
                var n = this.getSize()
                  , o = this.getSouthEastBound()
                  , a = e;
                switch (this._resizeCtrlIsDragging) {
                case 0:
                    this._aspect && (a = o.x - (o.y - t) * this._aspect),
                    this.setSizeByCorners({
                        x: a,
                        y: t
                    }, {
                        x: o.x,
                        y: o.y
                    }),
                    r = "nwse-resize";
                    break;
                case 1:
                    this._aspect && (a = n.x + (o.y - t) * this._aspect),
                    this.setSizeByCorners({
                        x: n.x,
                        y: t
                    }, {
                        x: a,
                        y: o.y
                    }),
                    r = "nesw-resize";
                    break;
                case 2:
                    this._aspect && (a = o.x - (t - n.y) * this._aspect),
                    this.setSizeByCorners({
                        x: a,
                        y: n.y
                    }, {
                        x: o.x,
                        y: t
                    }),
                    r = "nesw-resize";
                    break;
                case 3:
                    this._aspect && (a = n.x + (t - n.y) * this._aspect),
                    this.setSizeByCorners({
                        x: n.x,
                        y: n.y
                    }, {
                        x: a,
                        y: t
                    }),
                    r = "nwse-resize"
                }
                this._resizeCtrlIsHover = this._resizeCtrlIsDragging,
                i = !0,
                this._events.trigger("area-resize")
            } else {
                var s = this._isCoordWithinResizeCtrl([e, t]);
                if (s > -1) {
                    switch (s) {
                    case 0:
                        r = "nwse-resize";
                        break;
                    case 1:
                        r = "nesw-resize";
                        break;
                    case 2:
                        r = "nesw-resize";
                        break;
                    case 3:
                        r = "nwse-resize"
                    }
                    this._areaIsHover = !1,
                    this._resizeCtrlIsHover = s,
                    i = !0
                } else
                    this._isCoordWithinArea([e, t]) && (r = "move",
                    this._areaIsHover = !0,
                    i = !0)
            }
            return angular.element(this._ctx.canvas).css({
                cursor: r
            }),
            i
        }
        ,
        t.prototype.processMouseDown = function(e, t) {
            var r = this._isCoordWithinResizeCtrl([e, t]);
            if (r > -1)
                this._areaIsDragging = !1,
                this._areaIsHover = !1,
                this._resizeCtrlIsDragging = r,
                this._resizeCtrlIsHover = r,
                this._posResizeStartX = e,
                this._posResizeStartY = t,
                this._posResizeStartSize = this._size,
                this._events.trigger("area-resize-start");
            else if (this._isCoordWithinArea([e, t])) {
                this._areaIsDragging = !0,
                this._areaIsHover = !0,
                this._resizeCtrlIsDragging = -1,
                this._resizeCtrlIsHover = -1;
                var i = this.getCenterPoint();
                this._posDragStartX = e - i.x,
                this._posDragStartY = t - i.y,
                this._events.trigger("area-move-start")
            }
        }
        ,
        t.prototype.processMouseUp = function() {
            this._areaIsDragging && (this._areaIsDragging = !1,
            this._events.trigger("area-move-end")),
            this._resizeCtrlIsDragging > -1 && (this._resizeCtrlIsDragging = -1,
            this._events.trigger("area-resize-end")),
            this._areaIsHover = !1,
            this._resizeCtrlIsHover = -1,
            this._posDragStartX = 0,
            this._posDragStartY = 0
        }
        ,
        t
    }
    ]),
    e.factory("cropAreaSquare", ["cropArea", function(e) {
        var t = function() {
            e.apply(this, arguments),
            this._resizeCtrlBaseRadius = 15,
            this._resizeCtrlNormalRatio = .75,
            this._resizeCtrlHoverRatio = 1,
            this._iconMoveNormalRatio = .9,
            this._iconMoveHoverRatio = 1.2,
            this._resizeCtrlNormalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlNormalRatio,
            this._resizeCtrlHoverRadius = this._resizeCtrlBaseRadius * this._resizeCtrlHoverRatio,
            this._posDragStartX = 0,
            this._posDragStartY = 0,
            this._posResizeStartX = 0,
            this._posResizeStartY = 0,
            this._posResizeStartSize = 0,
            this._resizeCtrlIsHover = -1,
            this._areaIsHover = !1,
            this._resizeCtrlIsDragging = -1,
            this._areaIsDragging = !1
        }
        ;
        return t.prototype = new e,
        t.prototype.getType = function() {
            return "square"
        }
        ,
        t.prototype._calcSquareCorners = function() {
            var e = this.getSize()
              , t = this.getSouthEastBound();
            return [[e.x, e.y], [t.x, e.y], [e.x, t.y], [t.x, t.y]]
        }
        ,
        t.prototype._calcSquareDimensions = function() {
            var e = this.getSize()
              , t = this.getSouthEastBound();
            return {
                left: e.x,
                top: e.y,
                right: t.x,
                bottom: t.y
            }
        }
        ,
        t.prototype._isCoordWithinArea = function(e) {
            var t = this._calcSquareDimensions();
            return e[0] >= t.left && e[0] <= t.right && e[1] >= t.top && e[1] <= t.bottom
        }
        ,
        t.prototype._isCoordWithinResizeCtrl = function(e) {
            for (var t = this._calcSquareCorners(), r = -1, i = 0, n = t.length; n > i; i++) {
                var o = t[i];
                if (e[0] > o[0] - this._resizeCtrlHoverRadius && e[0] < o[0] + this._resizeCtrlHoverRadius && e[1] > o[1] - this._resizeCtrlHoverRadius && e[1] < o[1] + this._resizeCtrlHoverRadius) {
                    r = i;
                    break
                }
            }
            return r
        }
        ,
        t.prototype._drawArea = function(e, t, r) {
            e.rect(r.x, r.y, r.w, r.h)
        }
        ,
        t.prototype.draw = function() {
            e.prototype.draw.apply(this, arguments);
            var t = this.getCenterPoint();
            this._cropCanvas.drawIconMove([t.x, t.y], this._areaIsHover ? this._iconMoveHoverRatio : this._iconMoveNormalRatio);
            for (var r = this._calcSquareCorners(), i = 0, n = r.length; n > i; i++) {
                var o = r[i];
                this._cropCanvas.drawIconResizeCircle(o, this._resizeCtrlBaseRadius, this._resizeCtrlIsHover === i ? this._resizeCtrlHoverRatio : this._resizeCtrlNormalRatio)
            }
        }
        ,
        t.prototype.processMouseMove = function(e, t) {
            var r = "default"
              , i = !1;
            if (this._resizeCtrlIsHover = -1,
            this._areaIsHover = !1,
            this._areaIsDragging)
                this.setCenterPointOnMove({
                    x: e - this._posDragStartX,
                    y: t - this._posDragStartY
                }),
                this._areaIsHover = !0,
                r = "move",
                i = !0,
                this._events.trigger("area-move");
            else if (this._resizeCtrlIsDragging > -1) {
                var n, o;
                switch (this._resizeCtrlIsDragging) {
                case 0:
                    n = -1,
                    o = -1,
                    r = "nwse-resize";
                    break;
                case 1:
                    n = 1,
                    o = -1,
                    r = "nesw-resize";
                    break;
                case 2:
                    n = -1,
                    o = 1,
                    r = "nesw-resize";
                    break;
                case 3:
                    n = 1,
                    o = 1,
                    r = "nwse-resize"
                }
                var a, s = (e - this._posResizeStartX) * n, h = (t - this._posResizeStartY) * o;
                a = s > h ? this._posResizeStartSize.w + h : this._posResizeStartSize.w + s;
                var c = Math.max(this._minSize.w, a)
                  , u = {}
                  , l = {}
                  , g = {}
                  , f = {}
                  , p = this.getSize()
                  , d = this.getSouthEastBound();
                switch (this._resizeCtrlIsDragging) {
                case 0:
                    u.x = d.x - c,
                    u.y = d.y - c,
                    u.y > 0 && this.setSizeByCorners(u, {
                        x: d.x,
                        y: d.y
                    }),
                    r = "nwse-resize";
                    break;
                case 1:
                    s >= 0 && h >= 0 ? (f.x = p.x + c,
                    f.y = d.y - c) : (0 > s || 0 > h) && (f.x = p.x + c,
                    f.y = d.y - c),
                    f.y > 0 && this.setSizeByCorners({
                        x: p.x,
                        y: f.y
                    }, {
                        x: f.x,
                        y: d.y
                    }),
                    r = "nesw-resize";
                    break;
                case 2:
                    s >= 0 && h >= 0 ? (g.x = d.x - c,
                    g.y = p.y + c) : (0 >= s || 0 >= h) && (g.x = d.x - c,
                    g.y = p.y + c),
                    g.y < this._ctx.canvas.height && this.setSizeByCorners({
                        x: g.x,
                        y: p.y
                    }, {
                        x: d.x,
                        y: g.y
                    }),
                    r = "nesw-resize";
                    break;
                case 3:
                    l.x = p.x + c,
                    l.y = p.y + c,
                    l.y < this._ctx.canvas.height && this.setSizeByCorners({
                        x: p.x,
                        y: p.y
                    }, l),
                    r = "nwse-resize"
                }
                this._resizeCtrlIsHover = this._resizeCtrlIsDragging,
                i = !0,
                this._events.trigger("area-resize")
            } else {
                var v = this._isCoordWithinResizeCtrl([e, t]);
                if (v > -1) {
                    switch (v) {
                    case 0:
                        r = "nwse-resize";
                        break;
                    case 1:
                        r = "nesw-resize";
                        break;
                    case 2:
                        r = "nesw-resize";
                        break;
                    case 3:
                        r = "nwse-resize"
                    }
                    this._areaIsHover = !1,
                    this._resizeCtrlIsHover = v,
                    i = !0
                } else
                    this._isCoordWithinArea([e, t]) && (r = "move",
                    this._areaIsHover = !0,
                    i = !0)
            }
            return angular.element(this._ctx.canvas).css({
                cursor: r
            }),
            i
        }
        ,
        t.prototype.processMouseDown = function(e, t) {
            var r = this._isCoordWithinResizeCtrl([e, t]);
            if (r > -1)
                this._areaIsDragging = !1,
                this._areaIsHover = !1,
                this._resizeCtrlIsDragging = r,
                this._resizeCtrlIsHover = r,
                this._posResizeStartX = e,
                this._posResizeStartY = t,
                this._posResizeStartSize = this._size,
                this._events.trigger("area-resize-start");
            else if (this._isCoordWithinArea([e, t])) {
                this._areaIsDragging = !0,
                this._areaIsHover = !0,
                this._resizeCtrlIsDragging = -1,
                this._resizeCtrlIsHover = -1;
                var i = this.getCenterPoint();
                this._posDragStartX = e - i.x,
                this._posDragStartY = t - i.y,
                this._events.trigger("area-move-start")
            }
        }
        ,
        t.prototype.processMouseUp = function() {
            this._areaIsDragging && (this._areaIsDragging = !1,
            this._events.trigger("area-move-end")),
            this._resizeCtrlIsDragging > -1 && (this._resizeCtrlIsDragging = -1,
            this._events.trigger("area-resize-end")),
            this._areaIsHover = !1,
            this._resizeCtrlIsHover = -1,
            this._posDragStartX = 0,
            this._posDragStartY = 0
        }
        ,
        t
    }
    ]),
    e.factory("cropArea", ["cropCanvas", function(e) {
        var t = function(t, r) {
            this._ctx = t,
            this._events = r,
            this._minSize = {
                x: 0,
                y: 0,
                w: 80,
                h: 80
            },
            this._initSize = void 0,
            this._allowCropResizeOnCorners = !1,
            this._forceAspectRatio = !1,
            this._aspect = null ,
            this._cropCanvas = new e(t),
            this._image = new Image,
            this._size = {
                x: 0,
                y: 0,
                w: 150,
                h: 150
            }
        }
        ;
        return t.prototype.setAllowCropResizeOnCorners = function(e) {
            this._allowCropResizeOnCorners = e
        }
        ,
        t.prototype.getImage = function() {
            return this._image
        }
        ,
        t.prototype.setImage = function(e) {
            this._image = e
        }
        ,
        t.prototype.setForceAspectRatio = function(e) {
            this._forceAspectRatio = e
        }
        ,
        t.prototype.setAspect = function(e) {
            this._aspect = e
        }
        ,
        t.prototype.getCanvasSize = function() {
            return {
                w: this._ctx.canvas.width,
                h: this._ctx.canvas.height
            }
        }
        ,
        t.prototype.getSize = function() {
            return this._size
        }
        ,
        t.prototype.setSize = function(e) {
            e = this._processSize(e),
            this._size = this._preventBoundaryCollision(e)
        }
        ,
        t.prototype.setSizeOnMove = function(e) {
            e = this._processSize(e),
            this._size = this._allowCropResizeOnCorners ? this._preventBoundaryCollision(e) : this._allowMouseOutsideCanvas(e)
        }
        ,
        t.prototype.CircleOnMove = function(e, t) {
            var r = {
                x: e.x,
                y: e.y,
                w: t.x - e.x,
                h: t.y - e.y
            }
              , i = this._ctx.canvas.height
              , n = this._ctx.canvas.width;
            (r.w > n || r.h > i) && (i > n ? (r.w = n,
            r.h = n) : (r.w = i,
            r.h = i)),
            r.x + r.w > n && (r.x = n - r.w),
            r.y + r.h > i && (r.y = i - r.h),
            r.x < 0 && (r.x = 0),
            r.y < 0 && (r.y = 0),
            this._minSize.w > r.w && (r.w = this._minSize.w,
            r.x = this._size.x),
            this._minSize.h > r.h && (r.h = this._minSize.h,
            r.y = this._size.y),
            this._size = r
        }
        ,
        t.prototype.setSizeByCorners = function(e, t) {
            var r = {
                x: e.x,
                y: e.y,
                w: t.x - e.x,
                h: t.y - e.y
            };
            this.setSize(r)
        }
        ,
        t.prototype.getSouthEastBound = function() {
            return this._southEastBound(this.getSize())
        }
        ,
        t.prototype.setMinSize = function(e) {
            this._minSize = this._processSize(e),
            this.setSize(this._minSize)
        }
        ,
        t.prototype.getMinSize = function() {
            return this._minSize
        }
        ,
        t.prototype.getCenterPoint = function() {
            var e = this.getSize();
            return {
                x: e.x + e.w / 2,
                y: e.y + e.h / 2
            }
        }
        ,
        t.prototype.setCenterPoint = function(e) {
            var t = this.getSize();
            this.setSize({
                x: e.x - t.w / 2,
                y: e.y - t.h / 2,
                w: t.w,
                h: t.h
            })
        }
        ,
        t.prototype.setCenterPointOnMove = function(e) {
            var t = this.getSize();
            this.setSizeOnMove({
                x: e.x - t.w / 2,
                y: e.y - t.h / 2,
                w: t.w,
                h: t.h
            })
        }
        ,
        t.prototype.setInitSize = function(e) {
            this._initSize = this._processSize(e),
            this.setSize(this._initSize)
        }
        ,
        t.prototype.getInitSize = function() {
            return this._initSize
        }
        ,
        t.prototype.getType = function() {
            return "circle"
        }
        ,
        t.prototype._allowMouseOutsideCanvas = function(e) {
            var t = this._ctx.canvas.height
              , r = this._ctx.canvas.width
              , i = {
                w: e.w,
                h: e.h
            };
            return i.x = e.x < 0 ? 0 : e.x + e.w > r ? r - e.w : e.x,
            i.y = e.y < 0 ? 0 : e.y + e.h > t ? t - e.h : e.y,
            i
        }
        ,
        t.prototype._preventBoundaryCollision = function(e) {
            var t = this._ctx.canvas.height
              , r = this._ctx.canvas.width
              , i = {
                x: e.x,
                y: e.y
            }
              , n = this._southEastBound(e);
            i.x < 0 && (i.x = 0),
            i.y < 0 && (i.y = 0),
            n.x > r && (n.x = r),
            n.y > t && (n.y = t);
            var o = this._forceAspectRatio ? e.w : n.x - i.x
              , a = this._forceAspectRatio ? e.h : n.y - i.y;
            this._aspect && (o = a * this._aspect,
            i.x + o > r && (o = r - i.x,
            a = o / this._aspect,
            this._minSize.w > o && (o = this._minSize.w),
            this._minSize.h > a && (a = this._minSize.h),
            i.x = r - o),
            i.y + a > t && (i.y = t - a)),
            this._forceAspectRatio && (o = a,
            i.x + o > r && (o = r - i.x,
            o < this._minSize.w && (o = this._minSize.w),
            a = o));
            var s = {
                x: i.x,
                y: i.y,
                w: o,
                h: a
            };
            return s.w < this._minSize.w && !this._forceAspectRatio && (s.w = this._minSize.w,
            n = this._southEastBound(s),
            n.x > r && (n.x = r,
            i.x = Math.max(n.x - r, n.x - this._minSize.w),
            s = {
                x: i.x,
                y: i.y,
                w: n.x - i.x,
                h: n.y - i.y
            })),
            s.h < this._minSize.h && !this._forceAspectRatio && (s.h = this._minSize.h,
            n = this._southEastBound(s),
            n.y > t && (n.y = t,
            i.y = Math.max(n.y - t, n.y - this._minSize.h),
            s = {
                x: i.x,
                y: i.y,
                w: n.x - i.x,
                h: n.y - i.y
            })),
            this._forceAspectRatio && (n = this._southEastBound(s),
            n.y > t && (s.y = t - s.h),
            n.x > r && (s.x = r - s.w)),
            s
        }
        ,
        t.prototype._dontDragOutside = function() {
            var e = this._ctx.canvas.height
              , t = this._ctx.canvas.width;
            this._width > t && (this._width = t),
            this._height > e && (this._height = e),
            this._x < this._width / 2 && (this._x = this._width / 2),
            this._x > t - this._width / 2 && (this._x = t - this._width / 2),
            this._y < this._height / 2 && (this._y = this._height / 2),
            this._y > e - this._height / 2 && (this._y = e - this._height / 2)
        }
        ,
        t.prototype._drawArea = function() {}
        ,
        t.prototype._processSize = function(e) {
            "number" == typeof e && (e = {
                w: e,
                h: e
            });
            var t = e.w;
            return this._aspect && (t = e.h * this._aspect),
            {
                x: e.x || this.getSize().x,
                y: e.y || this.getSize().y,
                w: t || this._minSize.w,
                h: e.h || this._minSize.h
            }
        }
        ,
        t.prototype._southEastBound = function(e) {
            return {
                x: e.x + e.w,
                y: e.y + e.h
            }
        }
        ,
        t.prototype.draw = function() {
            this._cropCanvas.drawCropArea(this._image, this.getCenterPoint(), this._size, this._drawArea)
        }
        ,
        t.prototype.processMouseMove = function() {}
        ,
        t.prototype.processMouseDown = function() {}
        ,
        t.prototype.processMouseUp = function() {}
        ,
        t
    }
    ]),
    e.factory("cropCanvas", [function() {
        var e = [[-.5, -2], [-3, -4.5], [-.5, -7], [-7, -7], [-7, -.5], [-4.5, -3], [-2, -.5]]
          , t = [[.5, -2], [3, -4.5], [.5, -7], [7, -7], [7, -.5], [4.5, -3], [2, -.5]]
          , r = [[-.5, 2], [-3, 4.5], [-.5, 7], [-7, 7], [-7, .5], [-4.5, 3], [-2, .5]]
          , i = [[.5, 2], [3, 4.5], [.5, 7], [7, 7], [7, .5], [4.5, 3], [2, .5]]
          , n = [[-1.5, -2.5], [-1.5, -6], [-5, -6], [0, -11], [5, -6], [1.5, -6], [1.5, -2.5]]
          , o = [[-2.5, -1.5], [-6, -1.5], [-6, -5], [-11, 0], [-6, 5], [-6, 1.5], [-2.5, 1.5]]
          , a = [[-1.5, 2.5], [-1.5, 6], [-5, 6], [0, 11], [5, 6], [1.5, 6], [1.5, 2.5]]
          , s = [[2.5, -1.5], [6, -1.5], [6, -5], [11, 0], [6, 5], [6, 1.5], [2.5, 1.5]]
          , h = {
            areaOutline: "#fff",
            resizeBoxStroke: "#fff",
            resizeBoxFill: "#444",
            resizeBoxArrowFill: "#fff",
            resizeCircleStroke: "#fff",
            resizeCircleFill: "#444",
            moveIconFill: "#fff"
        };
        return function(c) {
            var u = function(e, t, r) {
                return [r * e[0] + t[0], r * e[1] + t[1]]
            }
              , l = function(e, t, r, i) {
                c.save(),
                c.fillStyle = t,
                c.beginPath();
                var n, o = u(e[0], r, i);
                c.moveTo(o[0], o[1]);
                for (var a in e)
                    a > 0 && (n = u(e[a], r, i),
                    c.lineTo(n[0], n[1]));
                c.lineTo(o[0], o[1]),
                c.fill(),
                c.closePath(),
                c.restore()
            }
            ;
            this.drawIconMove = function(e, t) {
                l(n, h.moveIconFill, e, t),
                l(o, h.moveIconFill, e, t),
                l(a, h.moveIconFill, e, t),
                l(s, h.moveIconFill, e, t)
            }
            ,
            this.drawIconResizeCircle = function(e, t, r) {
                var i = t * r;
                c.save(),
                c.strokeStyle = h.resizeCircleStroke,
                c.lineWidth = 2,
                c.fillStyle = h.resizeCircleFill,
                c.beginPath(),
                c.arc(e[0], e[1], i, 0, 2 * Math.PI),
                c.fill(),
                c.stroke(),
                c.closePath(),
                c.restore()
            }
            ,
            this.drawIconResizeBoxBase = function(e, t, r) {
                var i = t * r;
                c.save(),
                c.strokeStyle = h.resizeBoxStroke,
                c.lineWidth = 2,
                c.fillStyle = h.resizeBoxFill,
                c.fillRect(e[0] - i / 2, e[1] - i / 2, i, i),
                c.strokeRect(e[0] - i / 2, e[1] - i / 2, i, i),
                c.restore()
            }
            ,
            this.drawIconResizeBoxNESW = function(e, i, n) {
                this.drawIconResizeBoxBase(e, i, n),
                l(t, h.resizeBoxArrowFill, e, n),
                l(r, h.resizeBoxArrowFill, e, n)
            }
            ,
            this.drawIconResizeBoxNWSE = function(t, r, n) {
                this.drawIconResizeBoxBase(t, r, n),
                l(e, h.resizeBoxArrowFill, t, n),
                l(i, h.resizeBoxArrowFill, t, n)
            }
            ,
            this.drawCropArea = function(e, t, r, i) {
                var n = Math.abs(e.width / c.canvas.width)
                  , o = Math.abs(e.height / c.canvas.height)
                  , a = Math.abs(t.x - r.w / 2)
                  , s = Math.abs(t.y - r.h / 2);
                c.save(),
                c.strokeStyle = h.areaOutline,
                c.lineWidth = 2,
                c.beginPath(),
                i(c, t, r),
                c.stroke(),
                c.clip(),
                r.w > 0 && c.drawImage(e, a * n, s * o, Math.abs(r.w * n), Math.abs(r.h * o), a, s, Math.abs(r.w), Math.abs(r.h)),
                c.beginPath(),
                i(c, t, r),
                c.stroke(),
                c.clip(),
                c.restore()
            }
        }
    }
    ]),
    e.service("cropEXIF", [function() {
        function e(e) {
            return !!e.exifdata
        }
        function t(e, t) {
            t = t || e.match(/^data\:([^\;]+)\;base64,/im)[1] || "",
            e = e.replace(/^data\:([^\;]+)\;base64,/gim, "");
            for (var r = atob(e), i = r.length, n = new ArrayBuffer(i), o = new Uint8Array(n), a = 0; i > a; a++)
                o[a] = r.charCodeAt(a);
            return n
        }
        function r(e, t) {
            var r = new XMLHttpRequest;
            r.open("GET", e, !0),
            r.responseType = "blob",
            r.onload = function() {
                (200 == this.status || 0 === this.status) && t(this.response)
            }
            ,
            r.send()
        }
        function i(e, i) {
            function a(t) {
                var r = n(t)
                  , a = o(t);
                e.exifdata = r || {},
                e.iptcdata = a || {},
                i && i.call(e)
            }
            if (e.src)
                if (/^data\:/i.test(e.src)) {
                    var s = t(e.src);
                    a(s)
                } else if (/^blob\:/i.test(e.src)) {
                    var h = new FileReader;
                    h.onload = function(e) {
                        a(e.target.result)
                    }
                    ,
                    r(e.src, function(e) {
                        h.readAsArrayBuffer(e)
                    })
                } else {
                    var c = new XMLHttpRequest;
                    c.onload = function() {
                        if (200 != this.status && 0 !== this.status)
                            throw "Could not load image";
                        a(c.response),
                        c = null
                    }
                    ,
                    c.open("GET", e.src, !0),
                    c.responseType = "arraybuffer",
                    c.send(null )
                }
            else if (window.FileReader && (e instanceof window.Blob || e instanceof window.File)) {
                var h = new FileReader;
                h.onload = function(e) {
                    l && console.log("Got file of length " + e.target.result.byteLength),
                    a(e.target.result)
                }
                ,
                h.readAsArrayBuffer(e)
            }
        }
        function n(e) {
            var t = new DataView(e);
            if (l && console.log("Got file of length " + e.byteLength),
            255 != t.getUint8(0) || 216 != t.getUint8(1))
                return l && console.log("Not a valid JPEG"),
                !1;
            for (var r, i = 2, n = e.byteLength; n > i; ) {
                if (255 != t.getUint8(i))
                    return l && console.log("Not a valid marker at offset " + i + ", found: " + t.getUint8(i)),
                    !1;
                if (r = t.getUint8(i + 1),
                l && console.log(r),
                225 == r)
                    return l && console.log("Found 0xFFE1 marker"),
                    u(t, i + 4, t.getUint16(i + 2) - 2);
                i += 2 + t.getUint16(i + 2)
            }
        }
        function o(e) {
            var t = new DataView(e);
            if (l && console.log("Got file of length " + e.byteLength),
            255 != t.getUint8(0) || 216 != t.getUint8(1))
                return l && console.log("Not a valid JPEG"),
                !1;
            for (var r = 2, i = e.byteLength, n = function(e, t) {
                return 56 === e.getUint8(t) && 66 === e.getUint8(t + 1) && 73 === e.getUint8(t + 2) && 77 === e.getUint8(t + 3) && 4 === e.getUint8(t + 4) && 4 === e.getUint8(t + 5)
            }
            ; i > r; ) {
                if (n(t, r)) {
                    var o = t.getUint8(r + 7);
                    o % 2 !== 0 && (o += 1),
                    0 === o && (o = 4);
                    var s = r + 8 + o
                      , h = t.getUint16(r + 6 + o);
                    return a(e, s, h)
                }
                r++
            }
        }
        function a(e, t, r) {
            for (var i, n, o, a, s, h = new DataView(e), u = {}, l = t; t + r > l; )
                28 === h.getUint8(l) && 2 === h.getUint8(l + 1) && (a = h.getUint8(l + 2),
                a in v && (o = h.getInt16(l + 3),
                s = o + 5,
                n = v[a],
                i = c(h, l + 5, o),
                u.hasOwnProperty(n) ? u[n]instanceof Array ? u[n].push(i) : u[n] = [u[n], i] : u[n] = i)),
                l++;
            return u
        }
        function s(e, t, r, i, n) {
            var o, a, s, c = e.getUint16(r, !n), u = {};
            for (s = 0; c > s; s++)
                o = r + 12 * s + 2,
                a = i[e.getUint16(o, !n)],
                !a && l && console.log("Unknown tag: " + e.getUint16(o, !n)),
                u[a] = h(e, o, t, r, n);
            return u
        }
        function h(e, t, r, i, n) {
            var o, a, s, h, u, l, g = e.getUint16(t + 2, !n), f = e.getUint32(t + 4, !n), p = e.getUint32(t + 8, !n) + r;
            switch (g) {
            case 1:
            case 7:
                if (1 == f)
                    return e.getUint8(t + 8, !n);
                for (o = f > 4 ? p : t + 8,
                a = [],
                h = 0; f > h; h++)
                    a[h] = e.getUint8(o + h);
                return a;
            case 2:
                return o = f > 4 ? p : t + 8,
                c(e, o, f - 1);
            case 3:
                if (1 == f)
                    return e.getUint16(t + 8, !n);
                for (o = f > 2 ? p : t + 8,
                a = [],
                h = 0; f > h; h++)
                    a[h] = e.getUint16(o + 2 * h, !n);
                return a;
            case 4:
                if (1 == f)
                    return e.getUint32(t + 8, !n);
                for (a = [],
                h = 0; f > h; h++)
                    a[h] = e.getUint32(p + 4 * h, !n);
                return a;
            case 5:
                if (1 == f)
                    return u = e.getUint32(p, !n),
                    l = e.getUint32(p + 4, !n),
                    s = new Number(u / l),
                    s.numerator = u,
                    s.denominator = l,
                    s;
                for (a = [],
                h = 0; f > h; h++)
                    u = e.getUint32(p + 8 * h, !n),
                    l = e.getUint32(p + 4 + 8 * h, !n),
                    a[h] = new Number(u / l),
                    a[h].numerator = u,
                    a[h].denominator = l;
                return a;
            case 9:
                if (1 == f)
                    return e.getInt32(t + 8, !n);
                for (a = [],
                h = 0; f > h; h++)
                    a[h] = e.getInt32(p + 4 * h, !n);
                return a;
            case 10:
                if (1 == f)
                    return e.getInt32(p, !n) / e.getInt32(p + 4, !n);
                for (a = [],
                h = 0; f > h; h++)
                    a[h] = e.getInt32(p + 8 * h, !n) / e.getInt32(p + 4 + 8 * h, !n);
                return a
            }
        }
        function c(e, t, r) {
            for (var i = "", n = t; t + r > n; n++)
                i += String.fromCharCode(e.getUint8(n));
            return i
        }
        function u(e, t) {
            if ("Exif" != c(e, t, 4))
                return l && console.log("Not valid EXIF data! " + c(e, t, 4)),
                !1;
            var r, i, n, o, a, h = t + 6;
            if (18761 == e.getUint16(h))
                r = !1;
            else {
                if (19789 != e.getUint16(h))
                    return l && console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"),
                    !1;
                r = !0
            }
            if (42 != e.getUint16(h + 2, !r))
                return l && console.log("Not valid TIFF data! (no 0x002A)"),
                !1;
            var u = e.getUint32(h + 4, !r);
            if (8 > u)
                return l && console.log("Not valid TIFF data! (First offset less than 8)", e.getUint32(h + 4, !r)),
                !1;
            if (i = s(e, h, h + u, f, r),
            i.ExifIFDPointer) {
                o = s(e, h, h + i.ExifIFDPointer, g, r);
                for (n in o) {
                    switch (n) {
                    case "LightSource":
                    case "Flash":
                    case "MeteringMode":
                    case "ExposureProgram":
                    case "SensingMethod":
                    case "SceneCaptureType":
                    case "SceneType":
                    case "CustomRendered":
                    case "WhiteBalance":
                    case "GainControl":
                    case "Contrast":
                    case "Saturation":
                    case "Sharpness":
                    case "SubjectDistanceRange":
                    case "FileSource":
                        o[n] = d[n][o[n]];
                        break;
                    case "ExifVersion":
                    case "FlashpixVersion":
                        o[n] = String.fromCharCode(o[n][0], o[n][1], o[n][2], o[n][3]);
                        break;
                    case "ComponentsConfiguration":
                        o[n] = d.Components[o[n][0]] + d.Components[o[n][1]] + d.Components[o[n][2]] + d.Components[o[n][3]]
                    }
                    i[n] = o[n]
                }
            }
            if (i.GPSInfoIFDPointer) {
                a = s(e, h, h + i.GPSInfoIFDPointer, p, r);
                for (n in a) {
                    switch (n) {
                    case "GPSVersionID":
                        a[n] = a[n][0] + "." + a[n][1] + "." + a[n][2] + "." + a[n][3]
                    }
                    i[n] = a[n]
                }
            }
            return i
        }
        var l = !1
          , g = this.Tags = {
            36864: "ExifVersion",
            40960: "FlashpixVersion",
            40961: "ColorSpace",
            40962: "PixelXDimension",
            40963: "PixelYDimension",
            37121: "ComponentsConfiguration",
            37122: "CompressedBitsPerPixel",
            37500: "MakerNote",
            37510: "UserComment",
            40964: "RelatedSoundFile",
            36867: "DateTimeOriginal",
            36868: "DateTimeDigitized",
            37520: "SubsecTime",
            37521: "SubsecTimeOriginal",
            37522: "SubsecTimeDigitized",
            33434: "ExposureTime",
            33437: "FNumber",
            34850: "ExposureProgram",
            34852: "SpectralSensitivity",
            34855: "ISOSpeedRatings",
            34856: "OECF",
            37377: "ShutterSpeedValue",
            37378: "ApertureValue",
            37379: "BrightnessValue",
            37380: "ExposureBias",
            37381: "MaxApertureValue",
            37382: "SubjectDistance",
            37383: "MeteringMode",
            37384: "LightSource",
            37385: "Flash",
            37396: "SubjectArea",
            37386: "FocalLength",
            41483: "FlashEnergy",
            41484: "SpatialFrequencyResponse",
            41486: "FocalPlaneXResolution",
            41487: "FocalPlaneYResolution",
            41488: "FocalPlaneResolutionUnit",
            41492: "SubjectLocation",
            41493: "ExposureIndex",
            41495: "SensingMethod",
            41728: "FileSource",
            41729: "SceneType",
            41730: "CFAPattern",
            41985: "CustomRendered",
            41986: "ExposureMode",
            41987: "WhiteBalance",
            41988: "DigitalZoomRation",
            41989: "FocalLengthIn35mmFilm",
            41990: "SceneCaptureType",
            41991: "GainControl",
            41992: "Contrast",
            41993: "Saturation",
            41994: "Sharpness",
            41995: "DeviceSettingDescription",
            41996: "SubjectDistanceRange",
            40965: "InteroperabilityIFDPointer",
            42016: "ImageUniqueID"
        }
          , f = this.TiffTags = {
            256: "ImageWidth",
            257: "ImageHeight",
            34665: "ExifIFDPointer",
            34853: "GPSInfoIFDPointer",
            40965: "InteroperabilityIFDPointer",
            258: "BitsPerSample",
            259: "Compression",
            262: "PhotometricInterpretation",
            274: "Orientation",
            277: "SamplesPerPixel",
            284: "PlanarConfiguration",
            530: "YCbCrSubSampling",
            531: "YCbCrPositioning",
            282: "XResolution",
            283: "YResolution",
            296: "ResolutionUnit",
            273: "StripOffsets",
            278: "RowsPerStrip",
            279: "StripByteCounts",
            513: "JPEGInterchangeFormat",
            514: "JPEGInterchangeFormatLength",
            301: "TransferFunction",
            318: "WhitePoint",
            319: "PrimaryChromaticities",
            529: "YCbCrCoefficients",
            532: "ReferenceBlackWhite",
            306: "DateTime",
            270: "ImageDescription",
            271: "Make",
            272: "Model",
            305: "Software",
            315: "Artist",
            33432: "Copyright"
        }
          , p = this.GPSTags = {
            0: "GPSVersionID",
            1: "GPSLatitudeRef",
            2: "GPSLatitude",
            3: "GPSLongitudeRef",
            4: "GPSLongitude",
            5: "GPSAltitudeRef",
            6: "GPSAltitude",
            7: "GPSTimeStamp",
            8: "GPSSatellites",
            9: "GPSStatus",
            10: "GPSMeasureMode",
            11: "GPSDOP",
            12: "GPSSpeedRef",
            13: "GPSSpeed",
            14: "GPSTrackRef",
            15: "GPSTrack",
            16: "GPSImgDirectionRef",
            17: "GPSImgDirection",
            18: "GPSMapDatum",
            19: "GPSDestLatitudeRef",
            20: "GPSDestLatitude",
            21: "GPSDestLongitudeRef",
            22: "GPSDestLongitude",
            23: "GPSDestBearingRef",
            24: "GPSDestBearing",
            25: "GPSDestDistanceRef",
            26: "GPSDestDistance",
            27: "GPSProcessingMethod",
            28: "GPSAreaInformation",
            29: "GPSDateStamp",
            30: "GPSDifferential"
        }
          , d = this.StringValues = {
            ExposureProgram: {
                0: "Not defined",
                1: "Manual",
                2: "Normal program",
                3: "Aperture priority",
                4: "Shutter priority",
                5: "Creative program",
                6: "Action program",
                7: "Portrait mode",
                8: "Landscape mode"
            },
            MeteringMode: {
                0: "Unknown",
                1: "Average",
                2: "CenterWeightedAverage",
                3: "Spot",
                4: "MultiSpot",
                5: "Pattern",
                6: "Partial",
                255: "Other"
            },
            LightSource: {
                0: "Unknown",
                1: "Daylight",
                2: "Fluorescent",
                3: "Tungsten (incandescent light)",
                4: "Flash",
                9: "Fine weather",
                10: "Cloudy weather",
                11: "Shade",
                12: "Daylight fluorescent (D 5700 - 7100K)",
                13: "Day white fluorescent (N 4600 - 5400K)",
                14: "Cool white fluorescent (W 3900 - 4500K)",
                15: "White fluorescent (WW 3200 - 3700K)",
                17: "Standard light A",
                18: "Standard light B",
                19: "Standard light C",
                20: "D55",
                21: "D65",
                22: "D75",
                23: "D50",
                24: "ISO studio tungsten",
                255: "Other"
            },
            Flash: {
                0: "Flash did not fire",
                1: "Flash fired",
                5: "Strobe return light not detected",
                7: "Strobe return light detected",
                9: "Flash fired, compulsory flash mode",
                13: "Flash fired, compulsory flash mode, return light not detected",
                15: "Flash fired, compulsory flash mode, return light detected",
                16: "Flash did not fire, compulsory flash mode",
                24: "Flash did not fire, auto mode",
                25: "Flash fired, auto mode",
                29: "Flash fired, auto mode, return light not detected",
                31: "Flash fired, auto mode, return light detected",
                32: "No flash function",
                65: "Flash fired, red-eye reduction mode",
                69: "Flash fired, red-eye reduction mode, return light not detected",
                71: "Flash fired, red-eye reduction mode, return light detected",
                73: "Flash fired, compulsory flash mode, red-eye reduction mode",
                77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
                79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
                89: "Flash fired, auto mode, red-eye reduction mode",
                93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
                95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
            },
            SensingMethod: {
                1: "Not defined",
                2: "One-chip color area sensor",
                3: "Two-chip color area sensor",
                4: "Three-chip color area sensor",
                5: "Color sequential area sensor",
                7: "Trilinear sensor",
                8: "Color sequential linear sensor"
            },
            SceneCaptureType: {
                0: "Standard",
                1: "Landscape",
                2: "Portrait",
                3: "Night scene"
            },
            SceneType: {
                1: "Directly photographed"
            },
            CustomRendered: {
                0: "Normal process",
                1: "Custom process"
            },
            WhiteBalance: {
                0: "Auto white balance",
                1: "Manual white balance"
            },
            GainControl: {
                0: "None",
                1: "Low gain up",
                2: "High gain up",
                3: "Low gain down",
                4: "High gain down"
            },
            Contrast: {
                0: "Normal",
                1: "Soft",
                2: "Hard"
            },
            Saturation: {
                0: "Normal",
                1: "Low saturation",
                2: "High saturation"
            },
            Sharpness: {
                0: "Normal",
                1: "Soft",
                2: "Hard"
            },
            SubjectDistanceRange: {
                0: "Unknown",
                1: "Macro",
                2: "Close view",
                3: "Distant view"
            },
            FileSource: {
                3: "DSC"
            },
            Components: {
                0: "",
                1: "Y",
                2: "Cb",
                3: "Cr",
                4: "R",
                5: "G",
                6: "B"
            }
        }
          , v = {
            120: "caption",
            110: "credit",
            25: "keywords",
            55: "dateCreated",
            80: "byline",
            85: "bylineTitle",
            122: "captionWriter",
            105: "headline",
            116: "copyright",
            15: "category"
        };
        this.getData = function(t, r) {
            return (t instanceof Image || t instanceof HTMLImageElement) && !t.complete ? !1 : (e(t) ? r && r.call(t) : i(t, r),
            !0)
        }
        ,
        this.getTag = function(t, r) {
            return e(t) ? t.exifdata[r] : void 0
        }
        ,
        this.getAllTags = function(t) {
            if (!e(t))
                return {};
            var r, i = t.exifdata, n = {};
            for (r in i)
                i.hasOwnProperty(r) && (n[r] = i[r]);
            return n
        }
        ,
        this.pretty = function(t) {
            if (!e(t))
                return "";
            var r, i = t.exifdata, n = "";
            for (r in i)
                i.hasOwnProperty(r) && (n += "object" == typeof i[r] ? i[r]instanceof Number ? r + " : " + i[r] + " [" + i[r].numerator + "/" + i[r].denominator + "]\r\n" : r + " : [" + i[r].length + " values]\r\n" : r + " : " + i[r] + "\r\n");
            return n
        }
        ,
        this.readFromBinaryFile = function(e) {
            return n(e)
        }
    }
    ]),
    e.factory("cropHost", ["$document", "$q", "cropAreaCircle", "cropAreaSquare", "cropAreaRectangle", "cropEXIF", function(e, t, r, i, n, o) {
        var a = function(e) {
            var t = e.getBoundingClientRect()
              , r = document.body
              , i = document.documentElement
              , n = window.pageYOffset || i.scrollTop || r.scrollTop
              , o = window.pageXOffset || i.scrollLeft || r.scrollLeft
              , a = i.clientTop || r.clientTop || 0
              , s = i.clientLeft || r.clientLeft || 0
              , h = t.top + n - a
              , c = t.left + o - s;
            return {
                top: Math.round(h),
                left: Math.round(c)
            }
        }
        ;
        return function(s, h, c) {
            function u() {
                l.clearRect(0, 0, l.canvas.width, l.canvas.height),
                null !== g && (l.drawImage(g, 0, 0, l.canvas.width, l.canvas.height),
                l.save(),
                l.fillStyle = "rgba(0, 0, 0, 0.65)",
                l.fillRect(0, 0, l.canvas.width, l.canvas.height),
                l.restore(),
                f.draw())
            }
            var l = null
              , g = null
              , f = null
              , p = null
              , d = null
              , v = this
              , m = [100, 100]
              , w = [300, 300]
              , y = []
              , S = {
                w: 200,
                h: 200
            }
              , _ = null
              , z = "image/png"
              , C = null
              , x = !1;
            this.setInitMax = function(e) {
                p = e
            }
            ,
            this.setAllowCropResizeOnCorners = function(e) {
                f.setAllowCropResizeOnCorners(e)
            }
            ;
            var I = function() {
                if (null !== g) {
                    f.setImage(g);
                    var e = [g.width, g.height]
                      , t = g.width / g.height
                      , r = e;
                    r[0] > w[0] ? (r[0] = w[0],
                    r[1] = r[0] / t) : r[0] < m[0] && (r[0] = m[0],
                    r[1] = r[0] / t),
                    r[1] > w[1] ? (r[1] = w[1],
                    r[0] = r[1] * t) : r[1] < m[1] && (r[1] = m[1],
                    r[0] = r[1] * t),
                    s.prop("width", r[0]).prop("height", r[1]).css({
                        "margin-left": -r[0] / 2 + "px",
                        "margin-top": -r[1] / 2 + "px"
                    });
                    var i = l.canvas.width
                      , n = l.canvas.height
                      , o = v.getAreaType();
                    "circle" === o || "square" === o ? i > n ? i = n : n = i : "rectangle" === o && d && (i / n > S.w / S.h ? i = S.w / S.h * n : n = S.w / S.h * i),
                    p ? f.setSize({
                        w: i,
                        h: n
                    }) : void 0 !== f.getInitSize() ? f.setSize({
                        w: Math.min(f.getInitSize().w, i / 2),
                        h: Math.min(f.getInitSize().h, n / 2)
                    }) : f.setSize({
                        w: Math.min(200, i / 2),
                        h: Math.min(200, n / 2)
                    }),
                    f.setCenterPoint({
                        x: l.canvas.width / 2,
                        y: l.canvas.height / 2
                    })
                } else
                    s.prop("width", 0).prop("height", 0).css({
                        "margin-top": 0
                    });
                u()
            }
              , b = function(e) {
                return angular.isDefined(e.changedTouches) ? e.changedTouches : e.originalEvent.changedTouches
            }
              , R = function(e) {
                if (null !== g) {
                    var t, r, i = a(l.canvas);
                    "touchmove" === e.type ? (t = b(e)[0].pageX,
                    r = b(e)[0].pageY) : (t = e.pageX,
                    r = e.pageY),
                    f.processMouseMove(t - i.left, r - i.top),
                    u()
                }
            }
              , D = function(e) {
                if (e.preventDefault(),
                e.stopPropagation(),
                null !== g) {
                    var t, r, i = a(l.canvas);
                    "touchstart" === e.type ? (t = b(e)[0].pageX,
                    r = b(e)[0].pageY) : (t = e.pageX,
                    r = e.pageY),
                    f.processMouseDown(t - i.left, r - i.top),
                    u()
                }
            }
              , P = function(e) {
                if (null !== g) {
                    var t, r, i = a(l.canvas);
                    "touchend" === e.type ? (t = b(e)[0].pageX,
                    r = b(e)[0].pageY) : (t = e.pageX,
                    r = e.pageY),
                    f.processMouseUp(t - i.left, r - i.top),
                    u()
                }
            }
              , M = function(e) {
                var t, r, i = e, n = f.getCenterPoint(), o = {
                    dataURI: null ,
                    imageData: null
                };
                if (r = angular.element("<canvas></canvas>")[0],
                t = r.getContext("2d"),
                r.width = i.w,
                r.height = i.h,
                null !== g) {
                    var a = (n.x - f.getSize().w / 2) * (g.width / l.canvas.width)
                      , s = (n.y - f.getSize().h / 2) * (g.height / l.canvas.height)
                      , h = f.getSize().w * (g.width / l.canvas.width)
                      , c = f.getSize().h * (g.height / l.canvas.height);
                    if (x)
                        t.drawImage(g, a, s, h, c, 0, 0, i.w, i.h);
                    else {
                        var u, p, d = h / c;
                        d > 1 ? (p = i.w,
                        u = p / d) : (u = i.h,
                        p = u * d),
                        t.drawImage(g, a, s, h, c, 0, 0, Math.round(p), Math.round(u))
                    }
                    o.dataURI = null !== C ? r.toDataURL(z, C) : r.toDataURL(z)
                }
                return o
            }
            ;
            this.getResultImage = function() {
                if (0 == y.length)
                    return M(this.getResultImageSize());
                for (var e = [], t = 0; t < y.length; t++)
                    e.push({
                        dataURI: M(y[t]).dataURI,
                        w: y[t].w,
                        h: y[t].h
                    });
                return e
            }
            ,
            this.getResultImageDataBlob = function() {
                var e, r, i = f.getCenterPoint(), n = this.getResultImageSize(), o = t.defer();
                if (r = angular.element("<canvas></canvas>")[0],
                e = r.getContext("2d"),
                r.width = n.w,
                r.height = n.h,
                null !== g) {
                    var a = (i.x - f.getSize().w / 2) * (g.width / l.canvas.width)
                      , s = (i.y - f.getSize().h / 2) * (g.height / l.canvas.height)
                      , h = f.getSize().w * (g.width / l.canvas.width)
                      , c = f.getSize().h * (g.height / l.canvas.height);
                    if (x)
                        e.drawImage(g, a, s, h, c, 0, 0, n.w, n.h);
                    else {
                        var u, p, d = h / c;
                        d > 1 ? (p = n.w,
                        u = p / d) : (u = n.h,
                        p = u * d),
                        e.drawImage(g, a, s, h, c, 0, 0, Math.round(p), Math.round(u))
                    }
                }
                return r.toBlob(function(e) {
                    o.resolve(e)
                }, z),
                o.promise
            }
            ,
            this.getAreaCoords = function() {
                return f.getSize()
            }
            ,
            this.getArea = function() {
                return f
            }
            ,
            this.setNewImageSource = function(e) {
                if (g = null ,
                I(),
                c.trigger("image-updated"),
                e) {
                    var t = new Image;
                    t.onload = function() {
                        c.trigger("load-done"),
                        o.getData(t, function() {
                            var e = o.getTag(t, "Orientation");
                            if ([3, 6, 8].indexOf(e) > -1) {
                                var r = document.createElement("canvas")
                                  , i = r.getContext("2d")
                                  , n = t.width
                                  , a = t.height
                                  , s = 0
                                  , h = 0
                                  , u = 0
                                  , l = 0
                                  , f = 0;
                                switch (l = n,
                                f = a,
                                e) {
                                case 3:
                                    s = -t.width,
                                    h = -t.height,
                                    u = 180;
                                    break;
                                case 6:
                                    n = t.height,
                                    a = t.width,
                                    h = -t.height,
                                    u = 90;
                                    break;
                                case 8:
                                    n = t.height,
                                    a = t.width,
                                    s = -t.width,
                                    u = 270
                                }
                                var p = 1e3;
                                if (n > p || a > p) {
                                    var d = 0;
                                    n > p ? (d = p / n,
                                    n = p,
                                    a = d * a) : a > p && (d = p / a,
                                    a = p,
                                    n = d * n),
                                    h = d * h,
                                    s = d * s,
                                    l = d * l,
                                    f = d * f
                                }
                                r.width = n,
                                r.height = a,
                                i.rotate(u * Math.PI / 180),
                                i.drawImage(t, s, h, l, f),
                                g = new Image,
                                g.src = r.toDataURL(z)
                            } else
                                g = t;
                            I(),
                            c.trigger("image-updated")
                        })
                    }
                    ,
                    t.onerror = function() {
                        c.trigger("load-error")
                    }
                    ,
                    c.trigger("load-start"),
                    e instanceof window.Blob ? t.src = URL.createObjectURL(e) : ("http" === e.substring(0, 4).toLowerCase() && (t.crossOrigin = "anonymous"),
                    t.src = e)
                }
            }
            ,
            this.setMaxDimensions = function(e, t) {
                if (w = [e, t],
                null !== g) {
                    var r = l.canvas.width
                      , i = l.canvas.height
                      , n = [g.width, g.height]
                      , o = g.width / g.height
                      , a = n;
                    a[0] > w[0] ? (a[0] = w[0],
                    a[1] = a[0] / o) : a[0] < m[0] && (a[0] = m[0],
                    a[1] = a[0] / o),
                    a[1] > w[1] ? (a[1] = w[1],
                    a[0] = a[1] * o) : a[1] < m[1] && (a[1] = m[1],
                    a[0] = a[1] * o),
                    s.prop("width", a[0]).prop("height", a[1]).css({
                        "margin-left": -a[0] / 2 + "px",
                        "margin-top": -a[1] / 2 + "px"
                    });
                    var h = l.canvas.width / r
                      , c = l.canvas.height / i
                      , p = Math.min(h, c);
                    f.setSize({
                        w: f.getSize().w * p,
                        h: f.getSize().h * p
                    });
                    var d = f.getCenterPoint();
                    f.setCenterPoint({
                        x: d.x * h,
                        y: d.y * c
                    })
                } else
                    s.prop("width", 0).prop("height", 0).css({
                        "margin-top": 0
                    });
                u()
            }
            ,
            this.setAreaMinSize = function(e) {
                angular.isUndefined(e) || (e = "number" == typeof e || "string" == typeof e ? {
                    w: parseInt(parseInt(e), 10),
                    h: parseInt(parseInt(e), 10)
                } : {
                    w: parseInt(e.w, 10),
                    h: parseInt(e.h, 10)
                },
                isNaN(e.w) || isNaN(e.h) || (d = !0,
                f.setMinSize(e),
                u()))
            }
            ,
            this.setAreaMinRelativeSize = function(e) {
                if (null !== g) {
                    var t = f.getCanvasSize();
                    if (angular.isUndefined(e))
                        return;
                    "number" == typeof e || "string" == typeof e ? (_ = {
                        w: e,
                        h: e
                    },
                    e = {
                        w: t.w / (g.width / parseInt(parseInt(e), 10)),
                        h: t.h / (g.height / parseInt(parseInt(e), 10))
                    }) : (_ = e,
                    e = {
                        w: t.w / (g.width / parseInt(parseInt(e.w), 10)),
                        h: t.h / (g.height / parseInt(parseInt(e.h), 10))
                    }),
                    isNaN(e.w) || isNaN(e.h) || (f.setMinSize(e),
                    u())
                }
            }
            ,
            this.setAreaInitSize = function(e) {
                angular.isUndefined(e) || (e = "number" == typeof e || "string" == typeof e ? {
                    w: parseInt(parseInt(e), 10),
                    h: parseInt(parseInt(e), 10)
                } : {
                    w: parseInt(e.w, 10),
                    h: parseInt(e.h, 10)
                },
                isNaN(e.w) || isNaN(e.h) || (f.setInitSize(e),
                u()))
            }
            ,
            this.getResultImageSize = function() {
                if ("selection" == S)
                    return f.getSize();
                if ("max" == S) {
                    var e = 1;
                    g && l && l.canvas && (e = g.width / l.canvas.width);
                    var t = {
                        w: e * f.getSize().w,
                        h: e * f.getSize().h
                    };
                    return _ && (t.w < _.w && (t.w = _.w),
                    t.h < _.h && (t.h = _.h)),
                    t
                }
                return S
            }
            ,
            this.setResultImageSize = function(e) {
                if (angular.isArray(e))
                    return y = e.slice(),
                    e = {
                        w: parseInt(e[0].w, 10),
                        h: parseInt(e[0].h, 10)
                    },
                    void 0;
                if (!angular.isUndefined(e)) {
                    if (angular.isString(e))
                        return S = e,
                        void 0;
                    angular.isNumber(e) && (e = parseInt(e, 10),
                    e = {
                        w: e,
                        h: e
                    }),
                    e = {
                        w: parseInt(e.w, 10),
                        h: parseInt(e.h, 10)
                    },
                    isNaN(e.w) || isNaN(e.h) || (S = e,
                    u())
                }
            }
            ,
            this.setResultImageFormat = function(e) {
                z = e
            }
            ,
            this.setResultImageQuality = function(e) {
                e = parseFloat(e),
                !isNaN(e) && e >= 0 && 1 >= e && (C = e)
            }
            ,
            this.getAreaType = function() {
                return f.getType()
            }
            ,
            this.setAreaType = function(e) {
                var t = f.getCenterPoint()
                  , o = f.getSize()
                  , a = f.getMinSize()
                  , s = t.x
                  , h = t.y
                  , p = r;
                "square" === e ? p = i : "rectangle" === e && (p = n),
                f = new p(l,c),
                f.setMinSize(a),
                f.setSize(o),
                "square" === e || "circle" === e ? (x = !0,
                f.setForceAspectRatio(!0)) : (x = !1,
                f.setForceAspectRatio(!1)),
                f.setCenterPoint({
                    x: s,
                    y: h
                }),
                null !== g && f.setImage(g),
                u()
            }
            ,
            this.getDominantColor = function(e) {
                var r = new Image
                  , i = new ColorThief
                  , n = null
                  , o = t.defer();
                return r.src = e,
                r.onload = function() {
                    n = i.getColor(r),
                    o.resolve(n)
                }
                ,
                o.promise
            }
            ,
            this.getPalette = function(e) {
                var r = new Image
                  , i = new ColorThief
                  , n = null
                  , o = t.defer();
                return r.src = e,
                r.onload = function() {
                    n = i.getPalette(r, colorPaletteLength),
                    o.resolve(n)
                }
                ,
                o.promise
            }
            ,
            this.setPaletteColorLength = function(e) {
                colorPaletteLength = e
            }
            ,
            this.setAspect = function(e) {
                f.setAspect(e);
                var t = f.getMinSize();
                t.w = t.h * e,
                f.setMinSize(t);
                var r = f.getSize();
                r.w = r.h * e,
                f.setSize(r)
            }
            ,
            l = s[0].getContext("2d"),
            f = new r(l,c),
            e.on("mousemove", R),
            s.on("mousedown", D),
            e.on("mouseup", P),
            e.on("touchmove", R),
            s.on("touchstart", D),
            e.on("touchend", P),
            this.destroy = function() {
                e.off("mousemove", R),
                s.off("mousedown", D),
                e.off("mouseup", R),
                e.off("touchmove", R),
                s.off("touchstart", D),
                e.off("touchend", R),
                s.remove()
            }
        }
    }
    ]),
    e.factory("cropPubSub", [function() {
        return function() {
            var e = {};
            this.on = function(t, r) {
                return t.split(" ").forEach(function(t) {
                    e[t] || (e[t] = []),
                    e[t].push(r)
                }),
                this
            }
            ,
            this.trigger = function(t, r) {
                return angular.forEach(e[t], function(e) {
                    e.call(null , r)
                }),
                this
            }
        }
    }
    ]),
    e.directive("imgCrop", ["$timeout", "cropHost", "cropPubSub", function(e, t, r) {
        return {
            restrict: "E",
            scope: {
                image: "=",
                resultImage: "=",
                resultArrayImage: "=?",
                resultBlob: "=?",
                urlBlob: "=?",
                chargement: "=?",
                cropject: "=?",
                changeOnFly: "=?",
                liveView: "=?",
                initMaxArea: "=?",
                areaCoords: "=?",
                areaType: "@",
                areaMinSize: "=?",
                areaInitSize: "=?",
                areaMinRelativeSize: "=?",
                resultImageSize: "=?",
                resultImageFormat: "=?",
                resultImageQuality: "=?",
                aspectRatio: "=?",
                allowCropResizeOnCorners: "=?",
                dominantColor: "=?",
                paletteColor: "=?",
                paletteColorLength: "=?",
                onChange: "&",
                onLoadBegin: "&",
                onLoadDone: "&",
                onLoadError: "&"
            },
            template: "<canvas></canvas>",
            controller: ["$scope", function(e) {
                e.events = new r
            }
            ],
            link: function(r, i) {
                r.liveView && "boolean" == typeof r.liveView.block ? r.liveView.render = function(e) {
                    s(r, !0, e)
                }
                : r.liveView = {
                    block: !1
                };
                var n, o = r.events, a = new t(i.find("canvas"),{},o), s = function(e, t, r) {
                    if ("" !== e.image && (!e.liveView.block || t)) {
                        var i = a.getResultImage();
                        if (angular.isArray(i))
                            o = i[0].dataURI,
                            e.resultArrayImage = i,
                            console.log(e.resultArrayImage);
                        else
                            var o = i.dataURI;
                        var s = window.URL || window.webkitURL;
                        n !== o && (n = o,
                        e.resultImage = o,
                        e.liveView.callback && e.liveView.callback(o),
                        r && r(o),
                        a.getResultImageDataBlob().then(function(t) {
                            e.resultBlob = t,
                            e.urlBlob = s.createObjectURL(t)
                        }),
                        e.resultImage && (a.getDominantColor(e.resultImage).then(function(t) {
                            e.dominantColor = t
                        }),
                        a.getPalette(e.resultImage).then(function(t) {
                            e.paletteColor = t
                        })),
                        h(e),
                        e.onChange({
                            $dataURI: e.resultImage
                        }))
                    }
                }
                , h = function(e) {
                    var t = a.getAreaCoords();
                    e.areaCoords = t
                }
                , c = function(e) {
                    var t = a.getAreaCoords()
                      , r = {
                        x: a.getArea().getImage().width / a.getArea().getCanvasSize().w,
                        y: a.getArea().getImage().height / a.getArea().getCanvasSize().h
                    };
                    e.cropject = {
                        areaCoords: t,
                        cropWidth: t.w,
                        cropHeight: t.h,
                        cropTop: t.y,
                        cropLeft: t.x,
                        cropImageWidth: Math.round(t.w * r.x),
                        cropImageHeight: Math.round(t.h * r.y),
                        cropImageTop: Math.round(t.y * r.y),
                        cropImageLeft: Math.round(t.x * r.x)
                    }
                }
                , u = function(t) {
                    return function() {
                        e(function() {
                            r.$apply(function(e) {
                                t(e)
                            })
                        })
                    }
                }
                ;
                null == r.chargement && (r.chargement = "Chargement");
                var l = function() {
                    i.append('<div class="loading"><span>' + r.chargement + "...</span></div>")
                }
                ;
                o.on("load-start", u(function(e) {
                    e.onLoadBegin({})
                })).on("load-done", u(function(e) {
                    angular.element(i.children()[i.children().length - 1]).remove(),
                    a.setAreaMinRelativeSize(e.areaMinRelativeSize),
                    e.onLoadDone({})
                })).on("load-error", u(function(e) {
                    e.onLoadError({})
                })).on("area-move area-resize", u(function(e) {
                    e.changeOnFly && s(e),
                    c(e)
                })).on("area-move-end area-resize-end image-updated", u(function(e) {
                    s(e),
                    c(e)
                })),
                r.$watch("image", function(t) {
                    t && l(),
                    e(function() {
                        a.setInitMax(r.initMaxArea),
                        a.setNewImageSource(r.image)
                    }, 100)
                }),
                r.$watch("areaType", function() {
                    a.setAreaType(r.areaType),
                    s(r)
                }),
                r.$watch("areaMinSize", function() {
                    a.setAreaMinSize(r.areaMinSize),
                    s(r)
                }),
                r.$watch("areaMinRelativeSize", function() {
                    "" !== r.image && (a.setAreaMinRelativeSize(r.areaMinRelativeSize),
                    s(r))
                }),
                r.$watch("areaInitSize", function() {
                    a.setAreaInitSize(r.areaInitSize),
                    s(r)
                }),
                r.$watch("resultImageFormat", function() {
                    a.setResultImageFormat(r.resultImageFormat),
                    s(r)
                }),
                r.$watch("resultImageQuality", function() {
                    a.setResultImageQuality(r.resultImageQuality),
                    s(r)
                }),
                r.$watch("resultImageSize", function() {
                    a.setResultImageSize(r.resultImageSize),
                    s(r)
                }),
                r.$watch("paletteColorLength", function() {
                    a.setPaletteColorLength(r.paletteColorLength)
                }),
                r.$watch("aspectRatio", function() {
                    "string" == typeof r.aspectRatio && "" != r.aspectRatio && (r.aspectRatio = parseInt(r.aspectRatio)),
                    r.aspectRatio && a.setAspect(r.aspectRatio)
                }),
                r.$watch("allowCropResizeOnCorners", function() {
                    r.allowCropResizeOnCorners && a.setAllowCropResizeOnCorners(r.allowCropResizeOnCorners)
                }),
                r.$watch(function() {
                    return [i[0].clientWidth, i[0].clientHeight]
                }, function(e) {
                    a.setMaxDimensions(e[0], e[1]),
                    s(r)
                }, !0),
                r.$on("$destroy", function() {
                    a.destroy()
                })
            }
        }
    }
    ]),
    function(e) {
        "use strict";
        var t, r = e.Uint8Array, i = e.HTMLCanvasElement, n = i && i.prototype, o = /\s*;\s*base64\s*(?:;|$)/i, a = "toDataURL", s = function(e) {
            for (var i, n, o, a = e.length, s = new r(a / 4 * 3 | 0), h = 0, c = 0, u = [0, 0], l = 0, g = 0; a--; )
                n = e.charCodeAt(h++),
                i = t[n - 43],
                255 !== i && i !== o && (u[1] = u[0],
                u[0] = n,
                g = g << 6 | i,
                l++,
                4 === l && (s[c++] = g >>> 16,
                61 !== u[1] && (s[c++] = g >>> 8),
                61 !== u[0] && (s[c++] = g),
                l = 0));
            return s
        }
        ;
        r && (t = new r([62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51])),
        i && !n.toBlob && (n.toBlob = function(e, t) {
            if (t || (t = "image/png"),
            this.mozGetAsFile)
                return e(this.mozGetAsFile("canvas", t)),
                void 0;
            if (this.msToBlob && /^\s*image\/png\s*(?:$|;)/i.test(t))
                return e(this.msToBlob()),
                void 0;
            var i, n = Array.prototype.slice.call(arguments, 1), h = this[a].apply(this, n), c = h.indexOf(","), u = h.substring(c + 1), l = o.test(h.substring(0, c));
            Blob.fake ? (i = new Blob,
            i.encoding = l ? "base64" : "URI",
            i.data = u,
            i.size = u.length) : r && (i = l ? new Blob([s(u)],{
                type: t
            }) : new Blob([decodeURIComponent(u)],{
                type: t
            })),
            "undefined" != typeof e && e(i)
        }
        ,
        n.toBlobHD = n.toDataURLHD ? function() {
            a = "toDataURLHD";
            var e = this.toBlob();
            return a = "toDataURL",
            e
        }
        : n.toBlob)
    }("undefined" != typeof self && self || "undefined" != typeof window && window || this.content || this),
    function() {
        var e = function(e) {
            this.canvas = document.createElement("canvas"),
            this.context = this.canvas.getContext("2d"),
            document.body.appendChild(this.canvas),
            this.width = this.canvas.width = e.width,
            this.height = this.canvas.height = e.height,
            this.context.drawImage(e, 0, 0, this.width, this.height)
        }
        ;
        e.prototype.clear = function() {
            this.context.clearRect(0, 0, this.width, this.height)
        }
        ,
        e.prototype.update = function(e) {
            this.context.putImageData(e, 0, 0)
        }
        ,
        e.prototype.getPixelCount = function() {
            return this.width * this.height
        }
        ,
        e.prototype.getImageData = function() {
            return this.context.getImageData(0, 0, this.width, this.height)
        }
        ,
        e.prototype.removeCanvas = function() {
            this.canvas.parentNode.removeChild(this.canvas)
        }
        ;
        var t = function() {}
        ;
        if (t.prototype.getColor = function(e, t) {
            var r = this.getPalette(e, 5, t)
              , i = r[0];
            return i
        }
        ,
        t.prototype.getPalette = function(t, r, n) {
            "undefined" == typeof r && (r = 10),
            ("undefined" == typeof n || 1 > n) && (n = 10);
            for (var o, a, s, h, c, u = new e(t), l = u.getImageData(), g = l.data, f = u.getPixelCount(), p = [], d = 0; f > d; d += n)
                o = 4 * d,
                a = g[o + 0],
                s = g[o + 1],
                h = g[o + 2],
                c = g[o + 3],
                c >= 125 && (a > 250 && s > 250 && h > 250 || p.push([a, s, h]));
            var v = i.quantize(p, r)
              , m = v ? v.palette() : null ;
            return u.removeCanvas(),
            m
        }
        ,
        !r)
            var r = {
                map: function(e, t) {
                    var r = {};
                    return t ? e.map(function(e, i) {
                        return r.index = i,
                        t.call(r, e)
                    }) : e.slice()
                },
                naturalOrder: function(e, t) {
                    return t > e ? -1 : e > t ? 1 : 0
                },
                sum: function(e, t) {
                    var r = {};
                    return e.reduce(t ? function(e, i, n) {
                        return r.index = n,
                        e + t.call(r, i)
                    }
                    : function(e, t) {
                        return e + t
                    }
                    , 0)
                },
                max: function(e, t) {
                    return Math.max.apply(null , t ? r.map(e, t) : e)
                }
            };
        var i = function() {
            function e(e, t, r) {
                return (e << 2 * c) + (t << c) + r
            }
            function t(e) {
                function t() {
                    r.sort(e),
                    i = !0
                }
                var r = []
                  , i = !1;
                return {
                    push: function(e) {
                        r.push(e),
                        i = !1
                    },
                    peek: function(e) {
                        return i || t(),
                        void 0 === e && (e = r.length - 1),
                        r[e]
                    },
                    pop: function() {
                        return i || t(),
                        r.pop()
                    },
                    size: function() {
                        return r.length
                    },
                    map: function(e) {
                        return r.map(e)
                    },
                    debug: function() {
                        return i || t(),
                        r
                    }
                }
            }
            function i(e, t, r, i, n, o, a) {
                var s = this;
                s.r1 = e,
                s.r2 = t,
                s.g1 = r,
                s.g2 = i,
                s.b1 = n,
                s.b2 = o,
                s.histo = a
            }
            function n() {
                this.vboxes = new t(function(e, t) {
                    return r.naturalOrder(e.vbox.count() * e.vbox.volume(), t.vbox.count() * t.vbox.volume())
                }
                )
            }
            function o(t) {
                var r, i, n, o, a = 1 << 3 * c, s = new Array(a);
                return t.forEach(function(t) {
                    i = t[0] >> u,
                    n = t[1] >> u,
                    o = t[2] >> u,
                    r = e(i, n, o),
                    s[r] = (s[r] || 0) + 1
                }),
                s
            }
            function a(e, t) {
                var r, n, o, a = 1e6, s = 0, h = 1e6, c = 0, l = 1e6, g = 0;
                return e.forEach(function(e) {
                    r = e[0] >> u,
                    n = e[1] >> u,
                    o = e[2] >> u,
                    a > r ? a = r : r > s && (s = r),
                    h > n ? h = n : n > c && (c = n),
                    l > o ? l = o : o > g && (g = o)
                }),
                new i(a,s,h,c,l,g,t)
            }
            function s(t, i) {
                function n(e) {
                    var t, r, n, o, a, s = e + "1", h = e + "2", u = 0;
                    for (c = i[s]; c <= i[h]; c++)
                        if (d[c] > p / 2) {
                            for (n = i.copy(),
                            o = i.copy(),
                            t = c - i[s],
                            r = i[h] - c,
                            a = r >= t ? Math.min(i[h] - 1, ~~(c + r / 2)) : Math.max(i[s], ~~(c - 1 - t / 2)); !d[a]; )
                                a++;
                            for (u = v[a]; !u && d[a - 1]; )
                                u = v[--a];
                            return n[h] = a,
                            o[s] = n[h] + 1,
                            [n, o]
                        }
                }
                if (i.count()) {
                    var o = i.r2 - i.r1 + 1
                      , a = i.g2 - i.g1 + 1
                      , s = i.b2 - i.b1 + 1
                      , h = r.max([o, a, s]);
                    if (1 == i.count())
                        return [i.copy()];
                    var c, u, l, g, f, p = 0, d = [], v = [];
                    if (h == o)
                        for (c = i.r1; c <= i.r2; c++) {
                            for (g = 0,
                            u = i.g1; u <= i.g2; u++)
                                for (l = i.b1; l <= i.b2; l++)
                                    f = e(c, u, l),
                                    g += t[f] || 0;
                            p += g,
                            d[c] = p
                        }
                    else if (h == a)
                        for (c = i.g1; c <= i.g2; c++) {
                            for (g = 0,
                            u = i.r1; u <= i.r2; u++)
                                for (l = i.b1; l <= i.b2; l++)
                                    f = e(u, c, l),
                                    g += t[f] || 0;
                            p += g,
                            d[c] = p
                        }
                    else
                        for (c = i.b1; c <= i.b2; c++) {
                            for (g = 0,
                            u = i.r1; u <= i.r2; u++)
                                for (l = i.g1; l <= i.g2; l++)
                                    f = e(u, l, c),
                                    g += t[f] || 0;
                            p += g,
                            d[c] = p
                        }
                    return d.forEach(function(e, t) {
                        v[t] = p - e
                    }),
                    h == o ? n("r") : h == a ? n("g") : n("b")
                }
            }
            function h(e, i) {
                function h(e, t) {
                    for (var r, i = 1, n = 0; l > n; )
                        if (r = e.pop(),
                        r.count()) {
                            var o = s(c, r)
                              , a = o[0]
                              , h = o[1];
                            if (!a)
                                return;
                            if (e.push(a),
                            h && (e.push(h),
                            i++),
                            i >= t)
                                return;
                            if (n++ > l)
                                return
                        } else
                            e.push(r),
                            n++
                }
                if (!e.length || 2 > i || i > 256)
                    return !1;
                var c = o(e)
                  , u = 0;
                c.forEach(function() {
                    u++
                });
                var f = a(e, c)
                  , p = new t(function(e, t) {
                    return r.naturalOrder(e.count(), t.count())
                }
                );
                p.push(f),
                h(p, g * i);
                for (var d = new t(function(e, t) {
                    return r.naturalOrder(e.count() * e.volume(), t.count() * t.volume())
                }
                ); p.size(); )
                    d.push(p.pop());
                h(d, i - d.size());
                for (var v = new n; d.size(); )
                    v.push(d.pop());
                return v
            }
            var c = 5
              , u = 8 - c
              , l = 1e3
              , g = .75;
            return i.prototype = {
                volume: function(e) {
                    var t = this;
                    return (!t._volume || e) && (t._volume = (t.r2 - t.r1 + 1) * (t.g2 - t.g1 + 1) * (t.b2 - t.b1 + 1)),
                    t._volume
                },
                count: function(t) {
                    var r = this
                      , i = r.histo;
                    if (!r._count_set || t) {
                        var n, o, a, s = 0;
                        for (n = r.r1; n <= r.r2; n++)
                            for (o = r.g1; o <= r.g2; o++)
                                for (a = r.b1; a <= r.b2; a++)
                                    index = e(n, o, a),
                                    s += i[index] || 0;
                        r._count = s,
                        r._count_set = !0
                    }
                    return r._count
                },
                copy: function() {
                    var e = this;
                    return new i(e.r1,e.r2,e.g1,e.g2,e.b1,e.b2,e.histo)
                },
                avg: function(t) {
                    var r = this
                      , i = r.histo;
                    if (!r._avg || t) {
                        var n, o, a, s, h, u = 0, l = 1 << 8 - c, g = 0, f = 0, p = 0;
                        for (o = r.r1; o <= r.r2; o++)
                            for (a = r.g1; a <= r.g2; a++)
                                for (s = r.b1; s <= r.b2; s++)
                                    h = e(o, a, s),
                                    n = i[h] || 0,
                                    u += n,
                                    g += n * (o + .5) * l,
                                    f += n * (a + .5) * l,
                                    p += n * (s + .5) * l;
                        r._avg = u ? [~~(g / u), ~~(f / u), ~~(p / u)] : [~~(l * (r.r1 + r.r2 + 1) / 2), ~~(l * (r.g1 + r.g2 + 1) / 2), ~~(l * (r.b1 + r.b2 + 1) / 2)]
                    }
                    return r._avg
                },
                contains: function(e) {
                    var t = this
                      , r = e[0] >> u;
                    return gval = e[1] >> u,
                    bval = e[2] >> u,
                    r >= t.r1 && r <= t.r2 && gval >= t.g1 && gval <= t.g2 && bval >= t.b1 && bval <= t.b2
                }
            },
            n.prototype = {
                push: function(e) {
                    this.vboxes.push({
                        vbox: e,
                        color: e.avg()
                    })
                },
                palette: function() {
                    return this.vboxes.map(function(e) {
                        return e.color
                    })
                },
                size: function() {
                    return this.vboxes.size()
                },
                map: function(e) {
                    for (var t = this.vboxes, r = 0; r < t.size(); r++)
                        if (t.peek(r).vbox.contains(e))
                            return t.peek(r).color;
                    return this.nearest(e)
                },
                nearest: function(e) {
                    for (var t, r, i, n = this.vboxes, o = 0; o < n.size(); o++)
                        r = Math.sqrt(Math.pow(e[0] - n.peek(o).color[0], 2) + Math.pow(e[1] - n.peek(o).color[1], 2) + Math.pow(e[2] - n.peek(o).color[2], 2)),
                        (t > r || void 0 === t) && (t = r,
                        i = n.peek(o).color);
                    return i
                },
                forcebw: function() {
                    var e = this.vboxes;
                    e.sort(function(e, t) {
                        return r.naturalOrder(r.sum(e.color), r.sum(t.color))
                    });
                    var t = e[0].color;
                    t[0] < 5 && t[1] < 5 && t[2] < 5 && (e[0].color = [0, 0, 0]);
                    var i = e.length - 1
                      , n = e[i].color;
                    n[0] > 251 && n[1] > 251 && n[2] > 251 && (e[i].color = [255, 255, 255])
                }
            },
            {
                quantize: h
            }
        }();
        "function" == typeof define && define.amd ? define([], function() {
            return t
        }) : "object" == typeof exports ? module.exports = t : this.ColorThief = t
    }
    .call(this)
}(),
function() {
    function e(e) {
        return !!e.exifdata
    }
    function t(e, t) {
        t = t || e.match(/^data\:([^\;]+)\;base64,/im)[1] || "",
        e = e.replace(/^data\:([^\;]+)\;base64,/gim, "");
        for (var r = atob(e), i = r.length, n = new ArrayBuffer(i), o = new Uint8Array(n), a = 0; i > a; a++)
            o[a] = r.charCodeAt(a);
        return n
    }
    function r(e, t) {
        var r = new XMLHttpRequest;
        r.open("GET", e, !0),
        r.responseType = "blob",
        r.onload = function() {
            (200 == this.status || 0 === this.status) && t(this.response)
        }
        ,
        r.send()
    }
    function i(e, i) {
        function n(t) {
            var r = o(t)
              , n = a(t);
            e.exifdata = r || {},
            e.iptcdata = n || {},
            i && i.call(e)
        }
        if (e.src)
            if (/^data\:/i.test(e.src)) {
                var s = t(e.src);
                n(s)
            } else if (/^blob\:/i.test(e.src)) {
                var h = new FileReader;
                h.onload = function(e) {
                    n(e.target.result)
                }
                ,
                r(e.src, function(e) {
                    h.readAsArrayBuffer(e)
                })
            } else {
                var c = new XMLHttpRequest;
                c.onload = function() {
                    if (200 != this.status && 0 !== this.status)
                        throw "Could not load image";
                    n(c.response),
                    c = null
                }
                ,
                c.open("GET", e.src, !0),
                c.responseType = "arraybuffer",
                c.send(null )
            }
        else if (window.FileReader && (e instanceof window.Blob || e instanceof window.File)) {
            var h = new FileReader;
            h.onload = function(e) {
                g && console.log("Got file of length " + e.target.result.byteLength),
                n(e.target.result)
            }
            ,
            h.readAsArrayBuffer(e)
        }
    }
    function o(e) {
        var t = new DataView(e);
        if (g && console.log("Got file of length " + e.byteLength),
        255 != t.getUint8(0) || 216 != t.getUint8(1))
            return g && console.log("Not a valid JPEG"),
            !1;
        for (var r, i = 2, n = e.byteLength; n > i; ) {
            if (255 != t.getUint8(i))
                return g && console.log("Not a valid marker at offset " + i + ", found: " + t.getUint8(i)),
                !1;
            if (r = t.getUint8(i + 1),
            g && console.log(r),
            225 == r)
                return g && console.log("Found 0xFFE1 marker"),
                l(t, i + 4, t.getUint16(i + 2) - 2);
            i += 2 + t.getUint16(i + 2)
        }
    }
    function a(e) {
        var t = new DataView(e);
        if (g && console.log("Got file of length " + e.byteLength),
        255 != t.getUint8(0) || 216 != t.getUint8(1))
            return g && console.log("Not a valid JPEG"),
            !1;
        for (var r = 2, i = e.byteLength, n = function(e, t) {
            return 56 === e.getUint8(t) && 66 === e.getUint8(t + 1) && 73 === e.getUint8(t + 2) && 77 === e.getUint8(t + 3) && 4 === e.getUint8(t + 4) && 4 === e.getUint8(t + 5)
        }
        ; i > r; ) {
            if (n(t, r)) {
                var o = t.getUint8(r + 7);
                o % 2 !== 0 && (o += 1),
                0 === o && (o = 4);
                var a = r + 8 + o
                  , h = t.getUint16(r + 6 + o);
                return s(e, a, h)
            }
            r++
        }
    }
    function s(e, t, r) {
        for (var i, n, o, a, s, h = new DataView(e), c = {}, l = t; t + r > l; )
            28 === h.getUint8(l) && 2 === h.getUint8(l + 1) && (a = h.getUint8(l + 2),
            a in y && (o = h.getInt16(l + 3),
            s = o + 5,
            n = y[a],
            i = u(h, l + 5, o),
            c.hasOwnProperty(n) ? c[n]instanceof Array ? c[n].push(i) : c[n] = [c[n], i] : c[n] = i)),
            l++;
        return c
    }
    function h(e, t, r, i, n) {
        var o, a, s, h = e.getUint16(r, !n), u = {};
        for (s = 0; h > s; s++)
            o = r + 12 * s + 2,
            a = i[e.getUint16(o, !n)],
            !a && g && console.log("Unknown tag: " + e.getUint16(o, !n)),
            u[a] = c(e, o, t, r, n);
        return u
    }
    function c(e, t, r, i, n) {
        var o, a, s, h, c, l, g = e.getUint16(t + 2, !n), f = e.getUint32(t + 4, !n), p = e.getUint32(t + 8, !n) + r;
        switch (g) {
        case 1:
        case 7:
            if (1 == f)
                return e.getUint8(t + 8, !n);
            for (o = f > 4 ? p : t + 8,
            a = [],
            h = 0; f > h; h++)
                a[h] = e.getUint8(o + h);
            return a;
        case 2:
            return o = f > 4 ? p : t + 8,
            u(e, o, f - 1);
        case 3:
            if (1 == f)
                return e.getUint16(t + 8, !n);
            for (o = f > 2 ? p : t + 8,
            a = [],
            h = 0; f > h; h++)
                a[h] = e.getUint16(o + 2 * h, !n);
            return a;
        case 4:
            if (1 == f)
                return e.getUint32(t + 8, !n);
            for (a = [],
            h = 0; f > h; h++)
                a[h] = e.getUint32(p + 4 * h, !n);
            return a;
        case 5:
            if (1 == f)
                return c = e.getUint32(p, !n),
                l = e.getUint32(p + 4, !n),
                s = new Number(c / l),
                s.numerator = c,
                s.denominator = l,
                s;
            for (a = [],
            h = 0; f > h; h++)
                c = e.getUint32(p + 8 * h, !n),
                l = e.getUint32(p + 4 + 8 * h, !n),
                a[h] = new Number(c / l),
                a[h].numerator = c,
                a[h].denominator = l;
            return a;
        case 9:
            if (1 == f)
                return e.getInt32(t + 8, !n);
            for (a = [],
            h = 0; f > h; h++)
                a[h] = e.getInt32(p + 4 * h, !n);
            return a;
        case 10:
            if (1 == f)
                return e.getInt32(p, !n) / e.getInt32(p + 4, !n);
            for (a = [],
            h = 0; f > h; h++)
                a[h] = e.getInt32(p + 8 * h, !n) / e.getInt32(p + 4 + 8 * h, !n);
            return a
        }
    }
    function u(e, t, r) {
        var i = "";
        for (n = t; t + r > n; n++)
            i += String.fromCharCode(e.getUint8(n));
        return i
    }
    function l(e, t) {
        if ("Exif" != u(e, t, 4))
            return g && console.log("Not valid EXIF data! " + u(e, t, 4)),
            !1;
        var r, i, n, o, a, s = t + 6;
        if (18761 == e.getUint16(s))
            r = !1;
        else {
            if (19789 != e.getUint16(s))
                return g && console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"),
                !1;
            r = !0
        }
        if (42 != e.getUint16(s + 2, !r))
            return g && console.log("Not valid TIFF data! (no 0x002A)"),
            !1;
        var c = e.getUint32(s + 4, !r);
        if (8 > c)
            return g && console.log("Not valid TIFF data! (First offset less than 8)", e.getUint32(s + 4, !r)),
            !1;
        if (i = h(e, s, s + c, v, r),
        i.ExifIFDPointer) {
            o = h(e, s, s + i.ExifIFDPointer, d, r);
            for (n in o) {
                switch (n) {
                case "LightSource":
                case "Flash":
                case "MeteringMode":
                case "ExposureProgram":
                case "SensingMethod":
                case "SceneCaptureType":
                case "SceneType":
                case "CustomRendered":
                case "WhiteBalance":
                case "GainControl":
                case "Contrast":
                case "Saturation":
                case "Sharpness":
                case "SubjectDistanceRange":
                case "FileSource":
                    o[n] = w[n][o[n]];
                    break;
                case "ExifVersion":
                case "FlashpixVersion":
                    o[n] = String.fromCharCode(o[n][0], o[n][1], o[n][2], o[n][3]);
                    break;
                case "ComponentsConfiguration":
                    o[n] = w.Components[o[n][0]] + w.Components[o[n][1]] + w.Components[o[n][2]] + w.Components[o[n][3]]
                }
                i[n] = o[n]
            }
        }
        if (i.GPSInfoIFDPointer) {
            a = h(e, s, s + i.GPSInfoIFDPointer, m, r);
            for (n in a) {
                switch (n) {
                case "GPSVersionID":
                    a[n] = a[n][0] + "." + a[n][1] + "." + a[n][2] + "." + a[n][3]
                }
                i[n] = a[n]
            }
        }
        return i
    }
    var g = !1
      , f = this
      , p = function(e) {
        return e instanceof p ? e : this instanceof p ? (this.EXIFwrapped = e,
        void 0) : new p(e)
    }
    ;
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = p),
    exports.EXIF = p) : f.EXIF = p;
    var d = p.Tags = {
        36864: "ExifVersion",
        40960: "FlashpixVersion",
        40961: "ColorSpace",
        40962: "PixelXDimension",
        40963: "PixelYDimension",
        37121: "ComponentsConfiguration",
        37122: "CompressedBitsPerPixel",
        37500: "MakerNote",
        37510: "UserComment",
        40964: "RelatedSoundFile",
        36867: "DateTimeOriginal",
        36868: "DateTimeDigitized",
        37520: "SubsecTime",
        37521: "SubsecTimeOriginal",
        37522: "SubsecTimeDigitized",
        33434: "ExposureTime",
        33437: "FNumber",
        34850: "ExposureProgram",
        34852: "SpectralSensitivity",
        34855: "ISOSpeedRatings",
        34856: "OECF",
        37377: "ShutterSpeedValue",
        37378: "ApertureValue",
        37379: "BrightnessValue",
        37380: "ExposureBias",
        37381: "MaxApertureValue",
        37382: "SubjectDistance",
        37383: "MeteringMode",
        37384: "LightSource",
        37385: "Flash",
        37396: "SubjectArea",
        37386: "FocalLength",
        41483: "FlashEnergy",
        41484: "SpatialFrequencyResponse",
        41486: "FocalPlaneXResolution",
        41487: "FocalPlaneYResolution",
        41488: "FocalPlaneResolutionUnit",
        41492: "SubjectLocation",
        41493: "ExposureIndex",
        41495: "SensingMethod",
        41728: "FileSource",
        41729: "SceneType",
        41730: "CFAPattern",
        41985: "CustomRendered",
        41986: "ExposureMode",
        41987: "WhiteBalance",
        41988: "DigitalZoomRation",
        41989: "FocalLengthIn35mmFilm",
        41990: "SceneCaptureType",
        41991: "GainControl",
        41992: "Contrast",
        41993: "Saturation",
        41994: "Sharpness",
        41995: "DeviceSettingDescription",
        41996: "SubjectDistanceRange",
        40965: "InteroperabilityIFDPointer",
        42016: "ImageUniqueID"
    }
      , v = p.TiffTags = {
        256: "ImageWidth",
        257: "ImageHeight",
        34665: "ExifIFDPointer",
        34853: "GPSInfoIFDPointer",
        40965: "InteroperabilityIFDPointer",
        258: "BitsPerSample",
        259: "Compression",
        262: "PhotometricInterpretation",
        274: "Orientation",
        277: "SamplesPerPixel",
        284: "PlanarConfiguration",
        530: "YCbCrSubSampling",
        531: "YCbCrPositioning",
        282: "XResolution",
        283: "YResolution",
        296: "ResolutionUnit",
        273: "StripOffsets",
        278: "RowsPerStrip",
        279: "StripByteCounts",
        513: "JPEGInterchangeFormat",
        514: "JPEGInterchangeFormatLength",
        301: "TransferFunction",
        318: "WhitePoint",
        319: "PrimaryChromaticities",
        529: "YCbCrCoefficients",
        532: "ReferenceBlackWhite",
        306: "DateTime",
        270: "ImageDescription",
        271: "Make",
        272: "Model",
        305: "Software",
        315: "Artist",
        33432: "Copyright"
    }
      , m = p.GPSTags = {
        0: "GPSVersionID",
        1: "GPSLatitudeRef",
        2: "GPSLatitude",
        3: "GPSLongitudeRef",
        4: "GPSLongitude",
        5: "GPSAltitudeRef",
        6: "GPSAltitude",
        7: "GPSTimeStamp",
        8: "GPSSatellites",
        9: "GPSStatus",
        10: "GPSMeasureMode",
        11: "GPSDOP",
        12: "GPSSpeedRef",
        13: "GPSSpeed",
        14: "GPSTrackRef",
        15: "GPSTrack",
        16: "GPSImgDirectionRef",
        17: "GPSImgDirection",
        18: "GPSMapDatum",
        19: "GPSDestLatitudeRef",
        20: "GPSDestLatitude",
        21: "GPSDestLongitudeRef",
        22: "GPSDestLongitude",
        23: "GPSDestBearingRef",
        24: "GPSDestBearing",
        25: "GPSDestDistanceRef",
        26: "GPSDestDistance",
        27: "GPSProcessingMethod",
        28: "GPSAreaInformation",
        29: "GPSDateStamp",
        30: "GPSDifferential"
    }
      , w = p.StringValues = {
        ExposureProgram: {
            0: "Not defined",
            1: "Manual",
            2: "Normal program",
            3: "Aperture priority",
            4: "Shutter priority",
            5: "Creative program",
            6: "Action program",
            7: "Portrait mode",
            8: "Landscape mode"
        },
        MeteringMode: {
            0: "Unknown",
            1: "Average",
            2: "CenterWeightedAverage",
            3: "Spot",
            4: "MultiSpot",
            5: "Pattern",
            6: "Partial",
            255: "Other"
        },
        LightSource: {
            0: "Unknown",
            1: "Daylight",
            2: "Fluorescent",
            3: "Tungsten (incandescent light)",
            4: "Flash",
            9: "Fine weather",
            10: "Cloudy weather",
            11: "Shade",
            12: "Daylight fluorescent (D 5700 - 7100K)",
            13: "Day white fluorescent (N 4600 - 5400K)",
            14: "Cool white fluorescent (W 3900 - 4500K)",
            15: "White fluorescent (WW 3200 - 3700K)",
            17: "Standard light A",
            18: "Standard light B",
            19: "Standard light C",
            20: "D55",
            21: "D65",
            22: "D75",
            23: "D50",
            24: "ISO studio tungsten",
            255: "Other"
        },
        Flash: {
            0: "Flash did not fire",
            1: "Flash fired",
            5: "Strobe return light not detected",
            7: "Strobe return light detected",
            9: "Flash fired, compulsory flash mode",
            13: "Flash fired, compulsory flash mode, return light not detected",
            15: "Flash fired, compulsory flash mode, return light detected",
            16: "Flash did not fire, compulsory flash mode",
            24: "Flash did not fire, auto mode",
            25: "Flash fired, auto mode",
            29: "Flash fired, auto mode, return light not detected",
            31: "Flash fired, auto mode, return light detected",
            32: "No flash function",
            65: "Flash fired, red-eye reduction mode",
            69: "Flash fired, red-eye reduction mode, return light not detected",
            71: "Flash fired, red-eye reduction mode, return light detected",
            73: "Flash fired, compulsory flash mode, red-eye reduction mode",
            77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            89: "Flash fired, auto mode, red-eye reduction mode",
            93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod: {
            1: "Not defined",
            2: "One-chip color area sensor",
            3: "Two-chip color area sensor",
            4: "Three-chip color area sensor",
            5: "Color sequential area sensor",
            7: "Trilinear sensor",
            8: "Color sequential linear sensor"
        },
        SceneCaptureType: {
            0: "Standard",
            1: "Landscape",
            2: "Portrait",
            3: "Night scene"
        },
        SceneType: {
            1: "Directly photographed"
        },
        CustomRendered: {
            0: "Normal process",
            1: "Custom process"
        },
        WhiteBalance: {
            0: "Auto white balance",
            1: "Manual white balance"
        },
        GainControl: {
            0: "None",
            1: "Low gain up",
            2: "High gain up",
            3: "Low gain down",
            4: "High gain down"
        },
        Contrast: {
            0: "Normal",
            1: "Soft",
            2: "Hard"
        },
        Saturation: {
            0: "Normal",
            1: "Low saturation",
            2: "High saturation"
        },
        Sharpness: {
            0: "Normal",
            1: "Soft",
            2: "Hard"
        },
        SubjectDistanceRange: {
            0: "Unknown",
            1: "Macro",
            2: "Close view",
            3: "Distant view"
        },
        FileSource: {
            3: "DSC"
        },
        Components: {
            0: "",
            1: "Y",
            2: "Cb",
            3: "Cr",
            4: "R",
            5: "G",
            6: "B"
        }
    }
      , y = {
        120: "caption",
        110: "credit",
        25: "keywords",
        55: "dateCreated",
        80: "byline",
        85: "bylineTitle",
        122: "captionWriter",
        105: "headline",
        116: "copyright",
        15: "category"
    };
    p.getData = function(t, r) {
        return (t instanceof Image || t instanceof HTMLImageElement) && !t.complete ? !1 : (e(t) ? r && r.call(t) : i(t, r),
        !0)
    }
    ,
    p.getTag = function(t, r) {
        return e(t) ? t.exifdata[r] : void 0
    }
    ,
    p.getAllTags = function(t) {
        if (!e(t))
            return {};
        var r, i = t.exifdata, n = {};
        for (r in i)
            i.hasOwnProperty(r) && (n[r] = i[r]);
        return n
    }
    ,
    p.pretty = function(t) {
        if (!e(t))
            return "";
        var r, i = t.exifdata, n = "";
        for (r in i)
            i.hasOwnProperty(r) && (n += "object" == typeof i[r] ? i[r]instanceof Number ? r + " : " + i[r] + " [" + i[r].numerator + "/" + i[r].denominator + "]\r\n" : r + " : [" + i[r].length + " values]\r\n" : r + " : " + i[r] + "\r\n");
        return n
    }
    ,
    p.readFromBinaryFile = function(e) {
        return o(e)
    }
    ,
    "function" == typeof define && define.amd && define("exif-js", [], function() {
        return p
    })
}
.call(this),
function() {
    function e(e) {
        var t = e.naturalWidth
          , r = e.naturalHeight;
        if (t * r > 1048576) {
            var i = document.createElement("canvas");
            i.width = i.height = 1;
            var n = i.getContext("2d");
            return n.drawImage(e, -t + 1, 0),
            0 === n.getImageData(0, 0, 1, 1).data[3]
        }
        return !1
    }
    function t(e, t, r) {
        var i = document.createElement("canvas");
        i.width = 1,
        i.height = r;
        var n = i.getContext("2d");
        n.drawImage(e, 0, 0);
        for (var o = n.getImageData(0, 0, 1, r).data, a = 0, s = r, h = r; h > a; ) {
            var c = o[4 * (h - 1) + 3];
            0 === c ? s = h : a = h,
            h = s + a >> 1
        }
        var u = h / r;
        return 0 === u ? 1 : u
    }
    function r(e, t, r) {
        var n = document.createElement("canvas");
        return i(e, n, t, r),
        n.toDataURL("image/jpeg", t.quality || .8)
    }
    function i(r, i, o, a) {
        var s = r.naturalWidth
          , h = r.naturalHeight;
        if (s + h) {
            var c = o.width
              , u = o.height
              , l = i.getContext("2d");
            l.save(),
            n(i, l, c, u, o.orientation);
            var g = e(r);
            g && (s /= 2,
            h /= 2);
            var f = 1024
              , p = document.createElement("canvas");
            p.width = p.height = f;
            for (var d = p.getContext("2d"), v = a ? t(r, s, h) : 1, m = Math.ceil(f * c / s), w = Math.ceil(f * u / h / v), y = 0, S = 0; h > y; ) {
                for (var _ = 0, z = 0; s > _; )
                    d.clearRect(0, 0, f, f),
                    d.drawImage(r, -_, -y),
                    l.drawImage(p, 0, 0, f, f, z, S, m, w),
                    _ += f,
                    z += m;
                y += f,
                S += w
            }
            l.restore(),
            p = d = null
        }
    }
    function n(e, t, r, i, n) {
        switch (n) {
        case 5:
        case 6:
        case 7:
        case 8:
            e.width = i,
            e.height = r;
            break;
        default:
            e.width = r,
            e.height = i
        }
        switch (n) {
        case 2:
            t.translate(r, 0),
            t.scale(-1, 1);
            break;
        case 3:
            t.translate(r, i),
            t.rotate(Math.PI);
            break;
        case 4:
            t.translate(0, i),
            t.scale(1, -1);
            break;
        case 5:
            t.rotate(.5 * Math.PI),
            t.scale(1, -1);
            break;
        case 6:
            t.rotate(.5 * Math.PI),
            t.translate(0, -i);
            break;
        case 7:
            t.rotate(.5 * Math.PI),
            t.translate(r, -i),
            t.scale(-1, 1);
            break;
        case 8:
            t.rotate(-.5 * Math.PI),
            t.translate(-r, 0)
        }
    }
    function o(e) {
        if (window.Blob && e instanceof Blob) {
            if (!a)
                throw Error("No createObjectURL function found to create blob url");
            var t = new Image;
            t.src = a.createObjectURL(e),
            this.blob = e,
            e = t
        }
        if (!e.naturalWidth && !e.naturalHeight) {
            var r = this;
            e.onload = e.onerror = function() {
                var e = r.imageLoadListeners;
                if (e) {
                    r.imageLoadListeners = null ;
                    for (var t = 0, i = e.length; i > t; t++)
                        e[t]()
                }
            }
            ,
            this.imageLoadListeners = []
        }
        this.srcImage = e
    }
    var a = window.URL && window.URL.createObjectURL ? window.URL : window.webkitURL && window.webkitURL.createObjectURL ? window.webkitURL : null ;
    o.prototype.render = function(e, t, n) {
        if (this.imageLoadListeners) {
            var o = this;
            return this.imageLoadListeners.push(function() {
                o.render(e, t, n)
            }),
            void 0
        }
        t = t || {};
        var s = this.srcImage.naturalWidth
          , h = this.srcImage.naturalHeight
          , c = t.width
          , u = t.height
          , l = t.maxWidth
          , g = t.maxHeight
          , f = !this.blob || "image/jpeg" === this.blob.type;
        c && !u ? u = h * c / s << 0 : u && !c ? c = s * u / h << 0 : (c = s,
        u = h),
        l && c > l && (c = l,
        u = h * c / s << 0),
        g && u > g && (u = g,
        c = s * u / h << 0);
        var p = {
            width: c,
            height: u
        };
        for (var d in t)
            p[d] = t[d];
        var v = e.tagName.toLowerCase();
        "img" === v ? e.src = r(this.srcImage, p, f) : "canvas" === v && i(this.srcImage, e, p, f),
        "function" == typeof this.onrender && this.onrender(e),
        n && n(),
        this.blob && (this.blob = null ,
        a.revokeObjectURL(this.srcImage.src))
    }
    ,
    "function" == typeof define && define.amd ? define([], function() {
        return o
    }) : "object" == typeof exports ? module.exports = o : this.MegaPixImage = o
}(),
function() {
    var e = function(e) {
        this.canvas = document.createElement("canvas"),
        this.context = this.canvas.getContext("2d"),
        document.body.appendChild(this.canvas),
        this.width = this.canvas.width = e.width,
        this.height = this.canvas.height = e.height,
        this.context.drawImage(e, 0, 0, this.width, this.height)
    }
    ;
    e.prototype.clear = function() {
        this.context.clearRect(0, 0, this.width, this.height)
    }
    ,
    e.prototype.update = function(e) {
        this.context.putImageData(e, 0, 0)
    }
    ,
    e.prototype.getPixelCount = function() {
        return this.width * this.height
    }
    ,
    e.prototype.getImageData = function() {
        return this.context.getImageData(0, 0, this.width, this.height)
    }
    ,
    e.prototype.removeCanvas = function() {
        this.canvas.parentNode.removeChild(this.canvas)
    }
    ;
    var t = function() {}
    ;
    if (t.prototype.getColor = function(e, t) {
        var r = this.getPalette(e, 5, t)
          , i = r[0];
        return i
    }
    ,
    t.prototype.getPalette = function(t, r, n) {
        "undefined" == typeof r && (r = 10),
        ("undefined" == typeof n || 1 > n) && (n = 10);
        for (var o, a, s, h, c, u = new e(t), l = u.getImageData(), g = l.data, f = u.getPixelCount(), p = [], d = 0; f > d; d += n)
            o = 4 * d,
            a = g[o + 0],
            s = g[o + 1],
            h = g[o + 2],
            c = g[o + 3],
            c >= 125 && (a > 250 && s > 250 && h > 250 || p.push([a, s, h]));
        var v = i.quantize(p, r)
          , m = v ? v.palette() : null ;
        return u.removeCanvas(),
        m
    }
    ,
    !r)
        var r = {
            map: function(e, t) {
                var r = {};
                return t ? e.map(function(e, i) {
                    return r.index = i,
                    t.call(r, e)
                }) : e.slice()
            },
            naturalOrder: function(e, t) {
                return t > e ? -1 : e > t ? 1 : 0
            },
            sum: function(e, t) {
                var r = {};
                return e.reduce(t ? function(e, i, n) {
                    return r.index = n,
                    e + t.call(r, i)
                }
                : function(e, t) {
                    return e + t
                }
                , 0)
            },
            max: function(e, t) {
                return Math.max.apply(null , t ? r.map(e, t) : e)
            }
        };
    var i = function() {
        function e(e, t, r) {
            return (e << 2 * c) + (t << c) + r
        }
        function t(e) {
            function t() {
                r.sort(e),
                i = !0
            }
            var r = []
              , i = !1;
            return {
                push: function(e) {
                    r.push(e),
                    i = !1
                },
                peek: function(e) {
                    return i || t(),
                    void 0 === e && (e = r.length - 1),
                    r[e]
                },
                pop: function() {
                    return i || t(),
                    r.pop()
                },
                size: function() {
                    return r.length
                },
                map: function(e) {
                    return r.map(e)
                },
                debug: function() {
                    return i || t(),
                    r
                }
            }
        }
        function i(e, t, r, i, n, o, a) {
            var s = this;
            s.r1 = e,
            s.r2 = t,
            s.g1 = r,
            s.g2 = i,
            s.b1 = n,
            s.b2 = o,
            s.histo = a
        }
        function n() {
            this.vboxes = new t(function(e, t) {
                return r.naturalOrder(e.vbox.count() * e.vbox.volume(), t.vbox.count() * t.vbox.volume())
            }
            )
        }
        function o(t) {
            var r, i, n, o, a = 1 << 3 * c, s = new Array(a);
            return t.forEach(function(t) {
                i = t[0] >> u,
                n = t[1] >> u,
                o = t[2] >> u,
                r = e(i, n, o),
                s[r] = (s[r] || 0) + 1
            }),
            s
        }
        function a(e, t) {
            var r, n, o, a = 1e6, s = 0, h = 1e6, c = 0, l = 1e6, g = 0;
            return e.forEach(function(e) {
                r = e[0] >> u,
                n = e[1] >> u,
                o = e[2] >> u,
                a > r ? a = r : r > s && (s = r),
                h > n ? h = n : n > c && (c = n),
                l > o ? l = o : o > g && (g = o)
            }),
            new i(a,s,h,c,l,g,t)
        }
        function s(t, i) {
            function n(e) {
                var t, r, n, o, a, s = e + "1", h = e + "2", u = 0;
                for (c = i[s]; c <= i[h]; c++)
                    if (d[c] > p / 2) {
                        for (n = i.copy(),
                        o = i.copy(),
                        t = c - i[s],
                        r = i[h] - c,
                        a = r >= t ? Math.min(i[h] - 1, ~~(c + r / 2)) : Math.max(i[s], ~~(c - 1 - t / 2)); !d[a]; )
                            a++;
                        for (u = v[a]; !u && d[a - 1]; )
                            u = v[--a];
                        return n[h] = a,
                        o[s] = n[h] + 1,
                        [n, o]
                    }
            }
            if (i.count()) {
                var o = i.r2 - i.r1 + 1
                  , a = i.g2 - i.g1 + 1
                  , s = i.b2 - i.b1 + 1
                  , h = r.max([o, a, s]);
                if (1 == i.count())
                    return [i.copy()];
                var c, u, l, g, f, p = 0, d = [], v = [];
                if (h == o)
                    for (c = i.r1; c <= i.r2; c++) {
                        for (g = 0,
                        u = i.g1; u <= i.g2; u++)
                            for (l = i.b1; l <= i.b2; l++)
                                f = e(c, u, l),
                                g += t[f] || 0;
                        p += g,
                        d[c] = p
                    }
                else if (h == a)
                    for (c = i.g1; c <= i.g2; c++) {
                        for (g = 0,
                        u = i.r1; u <= i.r2; u++)
                            for (l = i.b1; l <= i.b2; l++)
                                f = e(u, c, l),
                                g += t[f] || 0;
                        p += g,
                        d[c] = p
                    }
                else
                    for (c = i.b1; c <= i.b2; c++) {
                        for (g = 0,
                        u = i.r1; u <= i.r2; u++)
                            for (l = i.g1; l <= i.g2; l++)
                                f = e(u, l, c),
                                g += t[f] || 0;
                        p += g,
                        d[c] = p
                    }
                return d.forEach(function(e, t) {
                    v[t] = p - e
                }),
                h == o ? n("r") : h == a ? n("g") : n("b")
            }
        }
        function h(e, i) {
            function h(e, t) {
                for (var r, i = 1, n = 0; l > n; )
                    if (r = e.pop(),
                    r.count()) {
                        var o = s(c, r)
                          , a = o[0]
                          , h = o[1];
                        if (!a)
                            return;
                        if (e.push(a),
                        h && (e.push(h),
                        i++),
                        i >= t)
                            return;
                        if (n++ > l)
                            return
                    } else
                        e.push(r),
                        n++
            }
            if (!e.length || 2 > i || i > 256)
                return !1;
            var c = o(e)
              , u = 0;
            c.forEach(function() {
                u++
            });
            var f = a(e, c)
              , p = new t(function(e, t) {
                return r.naturalOrder(e.count(), t.count())
            }
            );
            p.push(f),
            h(p, g * i);
            for (var d = new t(function(e, t) {
                return r.naturalOrder(e.count() * e.volume(), t.count() * t.volume())
            }
            ); p.size(); )
                d.push(p.pop());
            h(d, i - d.size());
            for (var v = new n; d.size(); )
                v.push(d.pop());
            return v
        }
        var c = 5
          , u = 8 - c
          , l = 1e3
          , g = .75;
        return i.prototype = {
            volume: function(e) {
                var t = this;
                return (!t._volume || e) && (t._volume = (t.r2 - t.r1 + 1) * (t.g2 - t.g1 + 1) * (t.b2 - t.b1 + 1)),
                t._volume
            },
            count: function(t) {
                var r = this
                  , i = r.histo;
                if (!r._count_set || t) {
                    var n, o, a, s = 0;
                    for (n = r.r1; n <= r.r2; n++)
                        for (o = r.g1; o <= r.g2; o++)
                            for (a = r.b1; a <= r.b2; a++)
                                index = e(n, o, a),
                                s += i[index] || 0;
                    r._count = s,
                    r._count_set = !0
                }
                return r._count
            },
            copy: function() {
                var e = this;
                return new i(e.r1,e.r2,e.g1,e.g2,e.b1,e.b2,e.histo)
            },
            avg: function(t) {
                var r = this
                  , i = r.histo;
                if (!r._avg || t) {
                    var n, o, a, s, h, u = 0, l = 1 << 8 - c, g = 0, f = 0, p = 0;
                    for (o = r.r1; o <= r.r2; o++)
                        for (a = r.g1; a <= r.g2; a++)
                            for (s = r.b1; s <= r.b2; s++)
                                h = e(o, a, s),
                                n = i[h] || 0,
                                u += n,
                                g += n * (o + .5) * l,
                                f += n * (a + .5) * l,
                                p += n * (s + .5) * l;
                    r._avg = u ? [~~(g / u), ~~(f / u), ~~(p / u)] : [~~(l * (r.r1 + r.r2 + 1) / 2), ~~(l * (r.g1 + r.g2 + 1) / 2), ~~(l * (r.b1 + r.b2 + 1) / 2)]
                }
                return r._avg
            },
            contains: function(e) {
                var t = this
                  , r = e[0] >> u;
                return gval = e[1] >> u,
                bval = e[2] >> u,
                r >= t.r1 && r <= t.r2 && gval >= t.g1 && gval <= t.g2 && bval >= t.b1 && bval <= t.b2
            }
        },
        n.prototype = {
            push: function(e) {
                this.vboxes.push({
                    vbox: e,
                    color: e.avg()
                })
            },
            palette: function() {
                return this.vboxes.map(function(e) {
                    return e.color
                })
            },
            size: function() {
                return this.vboxes.size()
            },
            map: function(e) {
                for (var t = this.vboxes, r = 0; r < t.size(); r++)
                    if (t.peek(r).vbox.contains(e))
                        return t.peek(r).color;
                return this.nearest(e)
            },
            nearest: function(e) {
                for (var t, r, i, n = this.vboxes, o = 0; o < n.size(); o++)
                    r = Math.sqrt(Math.pow(e[0] - n.peek(o).color[0], 2) + Math.pow(e[1] - n.peek(o).color[1], 2) + Math.pow(e[2] - n.peek(o).color[2], 2)),
                    (t > r || void 0 === t) && (t = r,
                    i = n.peek(o).color);
                return i
            },
            forcebw: function() {
                var e = this.vboxes;
                e.sort(function(e, t) {
                    return r.naturalOrder(r.sum(e.color), r.sum(t.color))
                });
                var t = e[0].color;
                t[0] < 5 && t[1] < 5 && t[2] < 5 && (e[0].color = [0, 0, 0]);
                var i = e.length - 1
                  , n = e[i].color;
                n[0] > 251 && n[1] > 251 && n[2] > 251 && (e[i].color = [255, 255, 255])
            }
        },
        {
            quantize: h
        }
    }();
    "function" == typeof define && define.amd ? define([], function() {
        return t
    }) : "object" == typeof exports ? module.exports = t : this.ColorThief = t
}
.call(this);
