module Feature.OrderedGraph {
    declare var _;
    declare var d3;
    declare var console;

    export class CirclesGroupDevider {

        private bordersSeparator = 10;
        private separationSectionWidth = 80;

        constructor(private viewportWidth: number, private viewportHeight: number) {}

        group(nodes, links,criterion: string) {
            var _this = this;
            var maxRadius = _.min([this.viewportWidth, this.viewportHeight]) / 2 - this.bordersSeparator;
            var circlesRadiuses = this.calculateRadiuses(nodes, maxRadius, criterion);
            console.log(circlesRadiuses);
            nodes.each(function (node) {
                var coordinates = _this.generateCoordinates(circlesRadiuses, node[criterion]);
                d3.select(this)
                    .transition()
                    .attr('cx', (d)=> coordinates.x + maxRadius)
                    .attr('cy', (d)=> coordinates.y + maxRadius);
            });

            /*links.transition().attr('x1', (d) => {
                return 0;
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