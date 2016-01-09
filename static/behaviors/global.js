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
        Actor.prototype.getWidth = function () {
            return (chart.width / _.size(chart.actors)) - (chart.padding * 2);
        };
        Actor.prototype.render = function () {
            return [
                $.createSvgTag('rect', { x: 0, y: 0, width: this.getWidth(), height: 40 }),
                $.createSvgTag('text', { x: 20, y: 20 }, this.name)
            ];
        };
        return Actor;
    })();
    var Sequence = (function () {
        function Sequence(label, chart) {
            this.label = label;
            this.chart = chart;
        }
        Sequence.prototype.getWidth = function () {
            return 100;
        };
        Sequence.prototype.render = function () {
            return [];
        };
        return Sequence;
    })();
    var Chart = (function () {
        function Chart(width, height, el) {
            this.padding = 20;
            this.actors = {};
            this.sequences = [];
            this.width = width;
            this.height = height;
            this.svg = $.createSvgTag('svg', { width: width, height: height }, '').appendTo(el);
        }
        Chart.prototype.newSequence = function (src, dst, label) {
            if (this.actors[src] === undefined) {
                this.actors[src] = new Actor(src, chart);
            }
            if (this.actors[dst] === undefined) {
                this.actors[dst] = new Actor(dst, chart);
            }
            this.sequences.push(new Sequence(label, chart));
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
