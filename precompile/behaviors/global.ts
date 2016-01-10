declare var $: any, _: any;
//interface Vanilla {
//  createHtml(tag:string, attrs?:{[key: string]: string}, content?:string): HTMLElement;  
//}

'use strict';

var Chart = (function() {

interface ChartObject { 
  getIndex(): number;
  getX(): number;
  getY(): number;
  getWidth(): number;
  getHeight(): number;
  render(): HTMLElement[]
}

class Actor implements ChartObject {
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
    return this.chart.actors.indexOf(this);
  }
  getWidth(): number {
    return (this.chart.width - 
      (this.chart.padding * (_.size(chart.actors) + 1))) / _.size(chart.actors); 
  }
  getHeight(): number {
    return 40;
  }
  getX(): number {
    return ((this.getWidth() + this.chart.padding) * this.getIndex()) + this.chart.padding;
  }
  getY(): number {
    return this.chart.padding;
  }
  textHeight = 12;
  stripWidth = 20;
  render(): HTMLElement[] {
    return [
      $.createSvgTag('rect', { class: 'strip', 
        x: this.getX() + (this.getWidth()/2) - (this.stripWidth / 2), 
        y: this.getY() + this.getHeight(), 
        width: this.stripWidth, 
        height: this.chart.height - this.getHeight() - this.getY() }),
      $.createSvgTag('rect', { x: this.getX(), y: this.getY(), width: this.getWidth(), height: this.getHeight()}),
      $.createSvgTag('text', { x: this.getX() + (this.getWidth() / 2), y: this.getY() + (this.getHeight() / 2) + (this.textHeight / 2) }, this.name)
    ];
  } 
}

enum Direction { Left, Right };
class Sequence implements ChartObject {
  label: string;
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
    return Math.min(this.actor1.getX(), this.actor2.getX()) + 
      (this.actor1.getWidth() / 2);
  }
  getY(): number {
    return this.actor1.getY() + this.actor1.getHeight() + 
      this.chart.padding +
      (this.getHeight() * this.getIndex());
  }
  getHeight(): number {
    return 50; 
  }
  getDirection(): Direction {
    return this.actor1.getX() < this.actor2.getX() ? 
      Direction.Right : 
      Direction.Left;
  }
  getArrowX(): number {
    return this.getX() + 
      (this.getDirection() == Direction.Left ? 0 : this.getWidth()); 
  }
  getArrowAngle(): number {
    return this.getDirection() == Direction.Left ? -45 : 135
  }
  arrowWidth = 15;
  labelHeight = 15; 
  render(): HTMLElement[] {
    return [
      $.createSvgTag('text', { 
        x: this.getX() + (this.getWidth() / 2), 
        y: this.getY() + (this.getHeight() / 2) - (this.labelHeight / 2) }, this.label),
      $.createSvgTag('line', { 
          x1: this.getX() + 
            (this.getDirection() == Direction.Left ? this.arrowWidth / 2 : 0), 
          y1: this.getY() + (this.getHeight() / 2), 
          x2: this.getX() + this.getWidth() -
            (this.getDirection() == Direction.Right ? this.arrowWidth / 2 : 0), 
          y2: this.getY() + (this.getHeight() / 2) }),
      $.createSvgTag('polygon', { points: "0,0 0,"+ this.arrowWidth +" "+ this.arrowWidth +",0", 
        transform: "translate("+ this.getArrowX() +", "+ 
        (this.getY() + (this.getHeight() / 2)) +") rotate("+ this.getArrowAngle() +")" }) // draw on the actor2 side, and detect direction
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
    this.svg = $.createSvgTag('svg', { viewBox: "0 0 "+ width + " "+ height, preserveAspectRatio: "xMidYmin meet" }, '').appendTo(el);
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
    _.each([ this.actors, this.sequences ], function(collection: ChartObject[]) {
      _.each(collection, function(o: ChartObject) {
        _.each(o.render(), function(el: HTMLElement) {
          chart.svg.append(el);
        });
      })
    });
  }
}

return Chart
})();

// Example

const chart = new Chart(800, 400, 'body');
chart.newSequence('UnityDeveloper', 'PackageServer', '*http* tcp/80 plain-text');
chart.newSequence('PackageServer', 'FABRIKA', '*https* tcp/443 encrypted');
chart.newSequence('FABRIKA', 'PackageServer', '*https* tcp/443 encrypted');
chart.newSequence('PackageServer', 'UnityDeveloper', '*http* tcp/80 plain-text');
chart.newSequence('PackageServer', 'NewThing', 'send datas');
chart.render()

