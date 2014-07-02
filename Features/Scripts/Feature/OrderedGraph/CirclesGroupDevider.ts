module Feature.OrderedGraph {
    declare var _;
    declare var console;
    export class CirclesGroupDevider {

        constructor(private viewportWidth: number, private viewportHeight: number) {}

        group(nodes, links,criterion: string) {
            nodes.transition().attr('cx', (d)=> {
                return 0;
            });

            links.transition().attr('x1', (d) => {
                return 0;
            });
            this.calculateRadiuses(nodes, criterion);
        }

        calculateRadiuses(nodes, criterion) {
            var nodesCount = {};
            for (var nodeIndex in nodes[0]) {
                var node = nodes[0][nodeIndex].__data__;
                if (node) {
                    var nodeCriterion = node[criterion];
                    if (_.isUndefined(nodesCount[nodeCriterion])) {
                        nodesCount[nodeCriterion] = 1;
                    } else {
                        nodesCount[nodeCriterion]++;
                    }
                }
            }
        }

        disableGrouping() {
        }
    }
}