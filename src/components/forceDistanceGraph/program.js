import * as d3 from 'd3';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';
import { data } from 'data/';

const width = window.innerWidth;
const height = window.innerHeight;

const program = () => {
  const svg = d3
    .select('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height]);
  const links = d3.selectAll('line.line-link').data(data.links);
  const container = d3.select('g.inner-container');
  const nodes = d3.selectAll('g.layer');

  const zoomed = ({ transform }) => {
    container.attr('transform', transform);
    // container.attr('stroke-width', 1 / transform.k);
  };

  const zoom = d3
    .zoom()
    .scaleExtent([1, 3])
    .translateExtent([
      [-width, -height],
      [width, height],
    ])
    .on('zoom', zoomed);

  const reset = () => {
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(container.node()).invert([width * 0.5, height * 0.5])
      );
  };

  const clicked = (event, { x, y }) => {
    event.stopPropagation();
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity.scale(1.5).translate(-x, -y),
        d3.pointer(event, container.node())
      );
  };

  svg.call(zoom);
  nodes.attr('cursor', 'pointer').on('click', clicked);
  svg.on('click', reset);

  // ------- ticker -------

  const ticked = () => {
    nodes
      .data(data.nodes)
      .attr('transform', ({ x, y }) => `translate(${x}, ${y})`);

    links
      .attr('x1', ({ source }) => source.x)
      .attr('y1', ({ source }) => source.y)
      .attr('x2', ({ target }) => target.x)
      .attr('y2', ({ target }) => target.y)
      .style('stroke', (value) => (value === 0 ? 'red' : 'white'));
  };

  // ------- simulation -------

  const simulation = forceSimulation()
    .nodes(data.nodes)
    .force(
      'link',
      forceLink(data.links)
        .id((d) => d.id)
        .strength(0.1)
    )
    .force('charge', forceManyBody().strength(300))
    .force('collide', forceCollide().radius(200).iterations(1).strength(1))
    .force('center', forceCenter().strength(1))
    .on('tick', ticked);

  return {
    destroy: () => {
      return simulation.stop();
    },
  };
};

export default program;
