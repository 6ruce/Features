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

        private orbitAngleDevider = [];
        private nodesOnOrbitArea = [];
        private nodesOnOrbit = [];
        private wageDevider;

        constructor(private nodes) {
            var maxWage = _.max(this.nodes, node => node[this.wagesFieldName])[this.wagesFieldName];
            this.wageDevider = maxWage / 3;
            this.calculateDataForEachEllipseOrbit();
            _.each([this.centralEllipseIndex, this.middleEllipseIndex, this.outerEllipseIndex], index => {
                this.orbitAngleDevider[index] = (2 * Math.PI) / this.nodesOnOrbit[index];
            });
        }

        public calculate(maxRadius) {
            var parameters = [];
            
            parameters[this.centralEllipseIndex] = this.calculateCentralEllipseParams();
            parameters[this.middleEllipseIndex] = this.calculateMiddleEllipseParams(maxRadius);
            parameters[this.outerEllipseIndex] = this.calculateOuterEllipseParams(maxRadius);

            return parameters;
        }

        private calculateDataForEachEllipseOrbit() {
            this.nodesOnOrbitArea[this.centralEllipseIndex] = this.nodesOnOrbit[this.centralEllipseIndex] = 0;
            this.nodesOnOrbitArea[this.middleEllipseIndex] = this.nodesOnOrbit[this.middleEllipseIndex] = 0;
            this.nodesOnOrbitArea[this.outerEllipseIndex] = this.nodesOnOrbit[this.outerEllipseIndex] = 0;
            _.each(this.nodes, node => {
                var orbit = this.determineEllipseOrbit(node);
                this.nodesOnOrbit[orbit]++;
                this.nodesOnOrbitArea[orbit] += this.circleArea(node.r);
            });
        }

        private calculateCentralEllipseParams() {
            var totalNodesOnOrbitArea = this.nodesOnOrbitArea[this.centralEllipseIndex];
            var a = Math.sqrt(totalNodesOnOrbitArea * this.nodesFillmentKoef / (Math.PI * this.flattenedKoef));
            return {
                inner: { a: 0, b: 0 },
                outer: this.createParamsFromA(a)
            };
        }

        private calculateMiddleEllipseParams(maxRadius) {
            var outerRadius = maxRadius - this.middleEllipseSeparator;
            var outerEllipseArea = Math.PI * Math.pow(outerRadius, 2) * this.flattenedKoef;
            var totalNodesOnOrbitArea = this.nodesOnOrbitArea[this.middleEllipseIndex];
            var a = Math.sqrt((outerEllipseArea - totalNodesOnOrbitArea * this.nodesFillmentKoef) / (Math.PI * this.flattenedKoef));
            return {
                inner: this.createParamsFromA(a),
                outer: this.createParamsFromA(outerRadius)
            };
        }

        private calculateOuterEllipseParams(maxRadius) {
            var outerEllipseArea = Math.PI * Math.pow(maxRadius, 2) * this.flattenedKoef;
            var totalNodesOnOrbitArea = this.nodesOnOrbitArea[this.outerEllipseIndex];
            var a = Math.sqrt((outerEllipseArea - totalNodesOnOrbitArea * this.nodesFillmentKoef) / (Math.PI * this.flattenedKoef));
            return {
                inner: this.createParamsFromA(a),
                outer: this.createParamsFromA(maxRadius)
            };
        }

        private createParamsFromA(a) {
            return { a: a, b: a * this.flattenedKoef };
        }

        private circleArea(radius) {
            return Math.PI * Math.pow(radius, 2);
        }

        public setPositionOnEllipseForEachNode() {
            var nodeOnOrbit = [];
            nodeOnOrbit[this.centralEllipseIndex] = nodeOnOrbit[this.middleEllipseIndex] = nodeOnOrbit[this.outerEllipseIndex] = -1;
            _.each(this.nodes, node => {
                node.$$ellipse = this.determineEllipseOrbit(node);
                node.$$angle = this.orbitAngleDevider[node.$$ellipse] * ++nodeOnOrbit[node.$$ellipse];
            });
        }

        private determineEllipseOrbit(node) {
            var wageDevider = this.wageDevider;
            var nodeWage = node[this.wagesFieldName];
            if (nodeWage <= wageDevider * 0.3) return this.centralEllipseIndex;
            if (nodeWage > wageDevider * 0.3 && nodeWage <= 2.7 * wageDevider) return this.middleEllipseIndex;
            return this.outerEllipseIndex;
        }
    }
}