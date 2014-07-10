/// <reference path="EllipsesParametersCalculator.ts" />

module Feature.OrderedGraph {
    declare var _;
    declare var d3;

    export class EllipseWagesGroupDevider {
        private _bordersSeparator = 10;
        private _separationSectionWidth = 80;
        private animationDuration = 1;//seconds

        constructor(private viewportWidth: number, private viewportHeight: number) {}

        group(nodes, links, nodeLinksMap) {
            var _this = this;
            var maxRadius = _.min([this.viewportWidth, this.viewportHeight]) / 2 - this._bordersSeparator;
            var parameters = this.calculateEllipsesParameters(nodes, maxRadius);
            nodes.each(function (node) {
                var coordinates = _this.generateCoordinates(parameters, node);
                d3.select(this)
                    .transition()
                    .attr('cx', d => coordinates.x + _this.viewportWidth / 2)
                    .attr('cy', d => coordinates.y + _this.viewportHeight / 2)
                    .duration(800);
            });
        }

        private generateCoordinates(ellipsesParameters, node) {
            var radiuses = this.calculateEllipsesRadiuses(ellipsesParameters[node.$$ellipse], node.$$angle);
            var radius = _.random(radiuses.inner, radiuses.outer);

            return { x: radius * Math.cos(node.$$angle), y: radius * Math.sin(node.$$angle) };
        }

        private calculateEllipsesRadiuses(ellipsesParameters, angle) {
            var outerEllipse = ellipsesParameters.outer;
            var innerEllipse = ellipsesParameters.inner;

            return {
                inner: this.calculateRadius(innerEllipse, angle),
                outer: this.calculateRadius(outerEllipse, angle)
            };
        }

        private calculateRadius(ellipseParameters, angle) {
            var a = ellipseParameters.a;
            var b = ellipseParameters.b;
            if (a == 0 || b == 0) return 0;
            return (a * b) / Math.sqrt(Math.pow(b * Math.cos(angle), 2) + Math.pow(a * Math.sin(angle), 2));
        }

        private calculateEllipsesParameters(domNodes, maxRadius) {
            var nodes = _(domNodes[0]).filter(node => !_.isUndefined(node.__data__)).map(node => node.__data__);

            var parametersCalculator = this.getEllipsesParametersCalculator(nodes);
            parametersCalculator.setPositionOnEllipseForEachNode();
            
            return parametersCalculator.calculate(maxRadius);
        }

        private _parametersCalculator;
        private getEllipsesParametersCalculator(nodes) {
            if (! this._parametersCalculator) {
                this._parametersCalculator = new EllipsesParametersCalculator(nodes);
            }
            return this._parametersCalculator;
        }

    }
}