import {aStar} from 'ngraph.path';
import createGraph from 'ngraph.graph';

export function foo(): void {
  const graph = createGraph();

  graph.addLink('a', 'b', { weight: 10 });
  graph.addLink('a', 'c', { weight: 10 });
  graph.addLink('c', 'd', { weight: 5 });
  graph.addLink('b', 'd', { weight: 10 });

  const pathFinder = aStar(graph, {
    // We tell our pathfinder what should it use as a distance function:
    distance(fromNode, toNode, link) {
      // We don't really care about from/to nodes in this case,
      // as link.data has all needed information:
      return link.data.weight;
    }
  });
  const path = pathFinder.find('a', 'd');
  console.log(path);
}