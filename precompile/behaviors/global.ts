declare var $: any, _: any;
//interface Vanilla {
//  createHtml(tag:string, attrs?:{[key: string]: string}, content?:string): HTMLElement;  
//}

'use strict';

var Chart = (function() {

class Actor {
  public name: string;
  chart: Chart;
  constructor(name: string, chart: Chart) {
    this.name = name;
    this.chart = chart;
  }
  getWidth(): number {
    return (chart.width / _.size(chart.actors)) - (chart.padding * 2) 
  }
  render(): any {
    return [
      $.createSvgTag('rect', { x: 0, y: 0, width: this.getWidth(), height: 40}),
      $.createSvgTag('text', { x: 20, y: 20 }, this.name)
    ];
  } 
}

class Sequence {
  public label: string;
  chart: Chart;
  constructor(label: string, chart: Chart) {
    this.label = label;
    this.chart = chart;
  }
  getWidth(): number {
    return 100; 
  }
  render(): any {
    return [
    ];
  } 
}

class Chart {
  svg: any;
  width: number;
  height: number;
  padding = 20;
  constructor(width: number, height: number, el: string) {
    this.width = width;
    this.height = height;
    this.svg = $.createSvgTag('svg', { width: width, height: height }, '').appendTo(el);
  }

  actors: { [name: string]: Actor } = {}
  sequences: Sequence[] = [];
  
  newSequence(src: string, dst: string, label: string): void {
    if (this.actors[src] === undefined) {
      this.actors[src] = new Actor(src, chart);
    }
    if (this.actors[dst] === undefined) {   
      this.actors[dst] = new Actor(dst, chart);
    }
    
    this.sequences.push(new Sequence(label, chart));
  }
 
  render(): void {
    // clear
    this.svg.innerHTML = '';
    
    // draw
    var chart = this;
    _.each(this.actors, function(actor: Actor) {
      _.each(actor.render(), (el: HTMLElement) => {
        chart.svg.append(el);
      });
    });
  }
}

return Chart
})();

// Example

const chart = new Chart(400, 200, 'body');
chart.newSequence('UnityDeveloper', 'PackageServer', '*http* tcp/80 plain-text');
chart.render()

