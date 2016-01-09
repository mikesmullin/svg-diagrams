declare var $;

'use strict';

var Chart = (function() {
  var svg;
  var width: number;
  var height: number;
  var chart;
  function Chart(width: number, height: number, e): void {
    this.width = width;
    this.height = height;
    this.svg = $.createHtml('<svg>').appendTo(e);
    this.chart = this;
  }

  class Actor {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
  }

  class Sequence {
    label: string;
    constructor(label: string) {
      this.label = label;
    }
    getWidth(): number {
      return chart.width / chart.actors.length;
    }    
  }

  const actors: { [name: string]: Actor } = {}
  const sequences: Sequence[] = [];
  
  function newSequence(src: string, dst: string, label: string): void {
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

const chart = new Chart(400, 200, 'body');
chart.newSequence('UnityDeveloper', 'PackageServer', '*http* tcp/80 plain-text');


