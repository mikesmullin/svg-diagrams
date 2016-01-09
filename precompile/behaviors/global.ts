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
  static factory(name: string, chart: Chart): Actor {
    var actor = chart.actorsByName[name];
    if (!actor) {
      chart.actors.push(chart.actorsByName[name] = actor = new Actor(name, chart)); 
    }
     return actor;
  }
  getIndex(): number {
    return chart.actors.indexOf(this);
  }
  getWidth(): number {
    return (chart.width / _.size(chart.actors)) - (chart.padding * 2); 
  }
  getHeight(): number {
    return 40;
  }
  getX(): number {
    return (this.getWidth() + chart.padding) * this.getIndex();
  }
  render(): any {
    return [
      //$.createSvgTag('rect', { x: this.getX(), y: 0, width: this.getWidth(), height: this.getHeight()}),
      $.createSvgTag('text', { x: this.getX() + 25, y: 25 }, this.name),
      $.createSvgTag('rect', { class: 'strip', x: this.getX() + (this.getWidth()/2), y: this.getHeight(), width: 20, height: this.chart.height - this.getHeight() })
    ];2
  } 
}

enum Direction { Left, Right };
class Sequence {
  public label: string;
  chart: Chart;
  actor1: Actor;
  actor2: Actor;
  constructor(label: string, actor1: Actor, actor2: Actor, chart: Chart) {
    this.label = label;
    this.chart = chart;
    this.actor1 = actor1;
    this.actor2 = actor2;
  }
  getIndex(): number {
    return chart.sequences.indexOf(this);
  }  
  getWidth(): number {
    return Math.abs(this.actor1.getX() - this.actor2.getX()); 
  }
  getX(): number {
    return Math.min(this.actor1.getX(), this.actor2.getX());
  }
  getY(): number {
    return this.getHeight() * this.getIndex();
  }
  getHeight(): number {
    return 40; 
  }
  getDirection(): Direction {
    return this.actor1.getX() < this.actor2.getX() ? 
      Direction.Right : 
      Direction.Left;
  } 
  render(): any {
    return [
      $.createSvgTag('line', { x1: this.getX(), y1: this.getY(), x2: this.getX() + this.getWidth(), y2: this.getY() }),
      $.createSvgTag('polygon', { points: "30,30 30,50 50,30" }) // draw on the actor2 side, and detect direction
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

  actorsByName: {[name: string]: Actor} = {};
  actors: Actor[] = [];
  sequences: Sequence[] = [];
  
  newSequence(src: string, dst: string, label: string): void {
    this.sequences.push(new Sequence(label,
      Actor.factory(src, this),
      Actor.factory(dst, this),
      this));
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

