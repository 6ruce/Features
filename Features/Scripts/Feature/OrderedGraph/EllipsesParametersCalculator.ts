module Feature.OrderedGraph {
    declare var _;

    export class EllipsesParametersCalculator {
        private centralEllipseIndex = 0;
        private middleEllipseIndex = 1;
        private outerEllipseIndex = 2;

        private wagesFieldName = 'criterion';
        private middleEllipseSeparator = 190;

        private flattenedKoef = 0.4;
        private nodesFillmentKoef = 0.6;

        private nodeCircleRadius = 5;
        private nodeCircleSquare = Math.PI * Math.pow(this.nodeCircleRadius, 2);

        public calculate(nodes, maxRadius) {
            var parameters = [];
            var maxWage = _.max(nodes, node => node[this.wagesFieldName])[this.wagesFieldName];
            var wageDevider = maxWage / 3;
            var nodesOnOrbits = this.countNodesOnEachEllipseOrbit(nodes, wageDevider);

            parameters[this.centralEllipseIndex] = this.calculateCentralEllipseParams(nodesOnOrbits);
            parameters[this.middleEllipseIndex] = this.calculateMiddleEllipseParams(nodesOnOrbits, maxRadius);
            parameters[this.outerEllipseIndex] = this.calculateOuterEllipseParams(nodesOnOrbits, maxRadius);

            return parameters;
        }

        private calculateCentralEllipseParams(nodesOnOrbits) {
            var totalNodesOnOrbitArea = nodesOnOrbits[this.centralEllipseIndex] * this.nodeCircleSquare;
            var a = Math.sqrt(totalNodesOnOrbitArea * this.nodesFillmentKoef / (Math.PI * this.flattenedKoef));
            return {
                inner: { a: 0, b: 0 },
                outer: this.createParamsFromA(a)
            };
        }

        private calculateMiddleEllipseParams(nodesOnOrbits, maxRadius) {
            var outerRadius = maxRadius - this.middleEllipseSeparator;
            var outerEllipseArea = Math.PI * Math.pow(outerRadius, 2) * this.flattenedKoef;
            var totalNodesOnOrbitArea = nodesOnOrbits[this.middleEllipseIndex] * this.nodeCircleSquare;
            var a = Math.sqrt((outerEllipseArea - totalNodesOnOrbitArea * this.nodesFillmentKoef) / (Math.PI * this.flattenedKoef));
            return {
                inner: this.createParamsFromA(a),
                outer: this.createParamsFromA(outerRadius)
            };
        }

        private calculateOuterEllipseParams(nodesOnOrbits, maxRadius) {
            var outerEllipseArea = Math.PI * Math.pow(maxRadius, 2) * this.flattenedKoef;
            var totalNodesOnOrbitArea = nodesOnOrbits[this.outerEllipseIndex] * this.nodeCircleSquare;
            var a = Math.sqrt((outerEllipseArea - totalNodesOnOrbitArea * this.nodesFillmentKoef) / (Math.PI * this.flattenedKoef));
            return {
                inner: this.createParamsFromA(a),
                outer: this.createParamsFromA(maxRadius)
            };
        }

        private createParamsFromA(a) {
            return { a: a, b: a * this.flattenedKoef };
        }

        private countNodesOnEachEllipseOrbit(nodes, wageDevider) {
            return _.countBy(nodes, node => this.determineEllipseOrbit(node, wageDevider));
        }

        public setEllipseOrbitForEachNode(nodes) {
            //TODO: Manage something with `wageDevider` code duplication
            var maxWage = _.max(nodes, node => node[this.wagesFieldName])[this.wagesFieldName];
            var wageDevider = maxWage / 3;
            _.each(nodes, node => node.$$ellipse = this.determineEllipseOrbit(node, wageDevider));
        }

        private determineEllipseOrbit(node, wageDevider) {
            var nodeWage = node[this.wagesFieldName];
            if (nodeWage <= wageDevider * 0.3) return this.centralEllipseIndex;
            if (nodeWage > wageDevider * 0.3 && nodeWage <= 2.7 * wageDevider) return this.middleEllipseIndex;
            return this.outerEllipseIndex;
        }
    }
}