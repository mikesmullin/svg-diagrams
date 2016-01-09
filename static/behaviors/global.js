//interface Vanilla {
//  createHtml(tag:string, attrs?:{[key: string]: string}, content?:string): HTMLElement;  
//}
'use strict';
var Chart = (function () {
    var Actor = (function () {
        function Actor(name, chart) {
            this.name = name;
            this.chart = chart;
        }
        Actor.factory = function (name, chart) {
            var actor = chart.actorsByName[name];
            if (!actor) {
                chart.actors.push(chart.actorsByName[name] = actor = new Actor(name, chart));
            }
            return actor;
        };
        Actor.prototype.getIndex = function () {
            return chart.actors.indexOf(this);
        };
        Actor.prototype.getWidth = function () {
            return (chart.width / _.size(chart.actors)) - (chart.padding * 2);
        };
        Actor.prototype.getHeight = function () {
            return 40;
        };
        Actor.prototype.getX = function () {
            return (this.getWidth() + chart.padding) * this.getIndex();
        };
        Actor.prototype.render = function () {
            return [
                //$.createSvgTag('rect', { x: this.getX(), y: 0, width: this.getWidth(), height: this.getHeight()}),
                $.createSvgTag('text', { x: this.getX() + 25, y: 25 }, this.name),
                $.createSvgTag('rect', { class: 'strip', x: this.getX() + (this.getWidth() / 2), y: this.getHeight(), width: 20, height: this.chart.height - this.getHeight() })
            ];
            2;
        };
        return Actor;
    })();
    var Direction;
    (function (Direction) {
        Direction[Direction["Left"] = 0] = "Left";
        Direction[Direction["Right"] = 1] = "Right";
    })(Direction || (Direction = {}));
    ;
    var Sequence = (function () {
        function Sequence(label, actor1, actor2, chart) {
            this.label = label;
            this.chart = chart;
            this.actor1 = actor1;
            this.actor2 = actor2;
        }
        Sequence.prototype.getIndex = function () {
            return chart.sequences.indexOf(this);
        };
        Sequence.prototype.getWidth = function () {
            return Math.abs(this.actor1.getX() - this.actor2.getX());
        };
        Sequence.prototype.getX = function () {
            return Math.min(this.actor1.getX(), this.actor2.getX());
        };
        Sequence.prototype.getY = function () {
            return this.getHeight() * this.getIndex();
        };
        Sequence.prototype.getHeight = function () {
            return 40;
        };
        Sequence.prototype.getDirection = function () {
            return this.actor1.getX() < this.actor2.getX() ?
                Direction.Right :
                Direction.Left;
        };
        Sequence.prototype.render = function () {
            return [
                $.createSvgTag('line', { x1: this.getX(), y1: this.getY(), x2: this.getX() + this.getWidth(), y2: this.getY() }),
                $.createSvgTag('polygon', { points: "30,30 30,50 50,30" }) // draw on the actor2 side, and detect direction
            ];
        };
        return Sequence;
    })();
    var Chart = (function () {
        function Chart(width, height, el) {
            this.padding = 20;
            this.actorsByName = {};
            this.actors = [];
            this.sequences = [];
            this.width = width;
            this.height = height;
            this.svg = $.createSvgTag('svg', { width: width, height: height }, '').appendTo(el);
        }
        Chart.prototype.newSequence = function (src, dst, label) {
            this.sequences.push(new Sequence(label, Actor.factory(src, this), Actor.factory(dst, this), this));
        };
        Chart.prototype.render = function () {
            // clear
            this.svg.innerHTML = '';
            // draw
            var chart = this;
            _.each(this.actors, function (actor) {
                _.each(actor.render(), function (el) {
                    chart.svg.append(el);
                });
            });
        };
        return Chart;
    })();
    return Chart;
})();
// Example
var chart = new Chart(400, 200, 'body');
chart.newSequence('UnityDeveloper', 'PackageServer', '*http* tcp/80 plain-text');
chart.render();
// minimal vector math lib
var Vector3 = (function () {
    function Vector3(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vector3.dotProduct = function (a, b) {
        return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
    };
    Vector3.crossProduct = function (a, b) {
        return new Vector3((a.y * b.z) - (a.z * b.y), (a.z * b.x) - (a.x * b.z), (a.x & b.y) - (a.y * b.x));
    };
    Vector3.scale = function (a, t) {
        return new Vector3(a.x * t, a.y * t, a.z * t);
    };
    Vector3.add = function (a, b) {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    };
    Vector3.add3 = function (a, b, c) {
        return new Vector3(a.x + b.x + c.x, a.y + b.y + c.y, a.z + b.z + c.z);
    };
    Vector3.subtract = function (a, b) {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    };
    Vector3.len = function (a) {
        return Math.sqrt(Vector3.dotProduct(a, a));
    };
    Vector3.unitVector = function (a) {
        return Vector3.scale(a, 1 / Vector3.len(a));
    };
    Vector3.reflectThrough = function (a, normal) {
        var d = Vector3.scale(normal, Vector3.dotProduct(a, normal));
        return Vector3.subtract(Vector3.scale(d, 2), a);
    };
    Vector3.UP = new Vector3(0, 1, 0);
    Vector3.ZERO = new Vector3(0, 0, 0);
    Vector3.GRAY = new Vector3(20, 20, 20);
    return Vector3;
})();
