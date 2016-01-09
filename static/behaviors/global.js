'use strict';
var Chart = (function () {
    var svg;
    var width;
    var height;
    var chart;
    function Chart(width, height, e) {
        this.width = width;
        this.height = height;
        this.svg = $.createHtml('<svg>').appendTo(e);
        this.chart = this;
    }
    var Actor = (function () {
        function Actor(name) {
            this.name = name;
        }
        return Actor;
    })();
    var Sequence = (function () {
        function Sequence(label) {
            this.label = label;
        }
        Sequence.prototype.getWidth = function () {
            return chart.width / chart.actors.length;
        };
        return Sequence;
    })();
    var actors = {};
    var sequences = [];
    function newSequence(src, dst, label) {
        if (this.actors[src] === undefined) {
            this.actors[src] = new Actor(src);
        }
        if (this.actors[dst] === undefined) {
            this.actors[dst] = new Actor(dst);
        }
        this.sequences.push(new Sequence(label));
    }
    return Chart;
})();
// Example
var chart = new Chart(400, 200, 'body');
chart.newSequence('UnityDeveloper', 'PackageServer', '*http* tcp/80 plain-text');
