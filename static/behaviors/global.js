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
        Actor.prototype.getY = function () {
            return 0;
        };
        Actor.prototype.render = function () {
            return [
                //$.createSvgTag('rect', { x: this.getX(), y: 0, width: this.getWidth(), height: this.getHeight()}),
                $.createSvgTag('text', { x: this.getX() + 25, y: this.getY() + 25 }, this.name),
                $.createSvgTag('rect', { class: 'strip', x: this.getX() + (this.getWidth() / 2), y: this.getHeight(), width: 20, height: this.chart.height - this.getHeight() })
            ];
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
            return Math.abs(this.actor1.getX() - this.actor2.getX()) -
                Sequence.arrowWidth;
        };
        Sequence.prototype.getX = function () {
            return Math.min(this.actor1.getX(), this.actor2.getX()) +
                (this.actor1.getWidth() / 2) +
                (this.getDirection() == Direction.Left ? 0 : Sequence.arrowWidth);
        };
        Sequence.prototype.getY = function () {
            return (this.actor1.getHeight() * 2) + (this.getHeight() * this.getIndex());
        };
        Sequence.prototype.getHeight = function () {
            return 40;
        };
        Sequence.prototype.getDirection = function () {
            return this.actor1.getX() < this.actor2.getX() ?
                Direction.Right :
                Direction.Left;
        };
        Sequence.prototype.getArrowX = function () {
            return this.getX() +
                (this.getDirection() == Direction.Left ? 0 : this.getWidth());
        };
        Sequence.prototype.getArrowAngle = function () {
            return this.getDirection() == Direction.Left ? -45 : 135;
        };
        Sequence.prototype.render = function () {
            return [
                $.createSvgTag('text', { x: this.getX(), y: this.getY() - Sequence.labelHeight }, this.label),
                $.createSvgTag('line', { x1: this.getX(), y1: this.getY(), x2: this.getX() + this.getWidth(), y2: this.getY() }),
                $.createSvgTag('polygon', { points: "0,0 0," + Sequence.arrowWidth + " " + Sequence.arrowWidth + ",0",
                    transform: "translate(" + this.getArrowX() + ", " + this.getY() + ") rotate(" + this.getArrowAngle() + ")" }) // draw on the actor2 side, and detect direction
            ];
        };
        Sequence.arrowWidth = 15;
        Sequence.labelHeight = 10;
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
            _.each([this.actors, this.sequences], function (collection) {
                _.each(collection, function (o) {
                    _.each(o.render(), function (el) {
                        chart.svg.append(el);
                    });
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
chart.newSequence('PackageServer', 'FABRIKA', '*https* tcp/443 encrypted');
chart.newSequence('FABRIKA', 'PackageServer', '*https* tcp/443 encrypted');
chart.newSequence('PackageServer', 'UnityDeveloper', '*http* tcp/80 plain-text');
chart.render();
