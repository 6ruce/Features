module Feature.OrderedGraph {
    declare var _;
    declare var d3;
    declare var console;

    export class CirclesGroupDevider {

        private bordersSeparator = 10;
        private separationSectionWidth = 80;

        constructor(private viewportWidth: number, private viewportHeight: number) {}

        group(nodes, links, nodeLinksMap, criterion: string) {
            var _this = this;
            var maxRadius = _.min([this.viewportWidth, this.viewportHeight]) / 2 - this.bordersSeparator;
            var circlesRadiuses = this.calculateRadiuses(nodes, maxRadius, criterion);
            nodes.each(function (node) {
                var coordinates = _this.generateCoordinates(circlesRadiuses, node[criterion]);
                console.log('node.x: ' + (coordinates.x + _this.viewportWidth / 2));
                d3.select(this)
                    .transition()
                    .attr('cx', (d) => coordinates.x + _this.viewportWidth / 2)
                    .attr('cy', (d) => coordinates.y + _this.viewportHeight / 2);

                /*if (nodeLinksMap[node.index]) {
                    console.log('sources:');
                    if (nodeLinksMap[node.index].source) {
                        for (var index1 in nodeLinksMap[node.index].source) {
                            var id1 = nodeLinksMap[node.index].source[index1];
                            d3.select('#graph-link-' + id1)
                                .transition()
                                .attr('x1', (d) => {
                                    return coordinates.x + (_this.viewportWidth / 2);
                                })
                                .attr('y1', (d) => coordinates.y + (_this.viewportHeight / 2));
                        }
                    }
                    console.log('targets:');
                    if (nodeLinksMap[node.index].target) {
                        for (var index2 in nodeLinksMap[node.index].target) {
                            var id2 = nodeLinksMap[node.index].target[index2];
                            d3.select('#graph-link-' + id2)
                                .transition()
                                .attr('x2', (d) => {
                                    console.log(d); return coordinates.x + _this.viewportWidth / 2; })
                                .attr('y2', (d) => coordinates.y + _this.viewportHeight / 2);
                        }
                    }
                }*/
                
            });

            /*links.each(function (link) {
                console.log(link);
                var coordinates1 = _this.generateCoordinates(circlesRadiuses, link.source[criterion]);
                var coordinates2 = _this.generateCoordinates(circlesRadiuses, link.target[criterion]);
                d3.select(this)
                    .transition()
                    .attr('x1', (d) => coordinates1.x + _this.viewportWidth / 2)
                    .attr('y1', (d) => coordinates1.y + _this.viewportHeight / 2)
                    .attr('x2', (d) => coordinates2.x + _this.viewportWidth / 2)
                    .attr('y2', (d) => coordinates2.y + _this.viewportHeight / 2);

                d3.select('#graph-node-' + link.source.index)
                    .transition()
                    .attr('cx', (d) => coordinates1.x + _this.viewportWidth / 2)
                    .attr('cy', (d) => coordinates1.y + _this.viewportHeight / 2);

                d3.select('#graph-node-' + link.target.index)
                    .transition()
                    .attr('cx', (d) => coordinates2.x + _this.viewportWidth / 2)
                    .attr('cy', (d) => coordinates2.y + _this.viewportHeight / 2);
            });*/
        }

        private generateCoordinates(circlesRadiuses, criterionValue) {
            var angle = _.random(0, 360);
            var criterrionRadiuses = circlesRadiuses[criterionValue];
            var radius = _.random(criterrionRadiuses.inner, criterrionRadiuses.outer);

            return {x : radius * Math.cos(angle), y : radius * Math.sin(angle)};
        }

        private calculateRadiuses(nodes, maxRadius, criterion) {
            
            var criteriaCountMap = this.countCriteria(nodes, criterion);
            var numberOfSeparationSections = _.keys(criteriaCountMap).length - 1;
            var sumCriterionCount = _.reduce(_.values(criteriaCountMap), (memo, num) => memo + num, 0);
            var availableDistance = maxRadius - numberOfSeparationSections * this.separationSectionWidth;
            var sortedCounts = _.sortBy(_.pairs(criteriaCountMap), (criterionCount) => criterionCount[1]);

            var offset = 0;
            var circles = {};
            var outerRadius : number;
            for (var index in sortedCounts) {
            
                var criterionCount = sortedCounts[index][1];
                var criterionName = sortedCounts[index][0];
                outerRadius = offset + (criterionCount / sumCriterionCount * availableDistance);
                circles[criterionName] = {inner : offset, outer : outerRadius};
                offset = outerRadius + this.separationSectionWidth;
            }
            return circles;
        }

        private countCriteria(nodes, criterion) {
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

            return nodesCount;
        }
    }
}