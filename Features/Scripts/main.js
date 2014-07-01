var Feature;
(function (Feature) {
    (function (OrderedGraph) {
        var OrderedGraphWidget = (function () {
            function OrderedGraphWidget() {
                this._width = 600;
                this._height = 600;
            }
            OrderedGraphWidget.prototype.init = function () {
                this._svg = this.initSvg();
                this._nodes = this.generateRandomNodes();
                this._links = this.generateRandomLinks(this._nodes);

                var force = this.createForce(this._nodes, this._links);
                var nodesAndLinks = this.drawElements(this._svg);
                this.bindForceTick(force, nodesAndLinks);
            };

            OrderedGraphWidget.prototype.generateRandomNodes = function () {
                return _.range(100).map(function (i) {
                    return { name: 'Test' + i, test: 'Name' + i };
                });
            };

            OrderedGraphWidget.prototype.generateRandomLinks = function (nodes) {
                var indexes = _.range(nodes.length);
                return _.range(nodes.length / 1.5).map(function () {
                    return { source: _.sample(indexes), target: _.sample(indexes) };
                });
            };

            OrderedGraphWidget.prototype.drawElements = function (svg) {
                var colors = d3.scale.category10();

                var links = svg.selectAll("line").data(this._links).enter().append("line").style("stroke", "#ccc").style("stroke-width", 1);

                var nodes = svg.selectAll("circle").data(this._nodes).enter().append("circle").attr("r", 10).style("fill", function (d, i) {
                    return colors(i);
                });

                return { links: links, nodes: nodes };
            };

            OrderedGraphWidget.prototype.bindForceTick = function (force, nodesAndLinks) {
                var _this = this;
                force.on("tick", function () {
                    return _this.tick(nodesAndLinks.links, nodesAndLinks.nodes);
                });
            };

            OrderedGraphWidget.prototype.initSvg = function () {
                var rectDemo = d3.select('#feature-container').append("svg:svg").attr("width", this._width).attr("height", this._height);
                return rectDemo;
            };

            OrderedGraphWidget.prototype.createForce = function (nodes, links) {
                var force = d3.layout.force().nodes(d3.values(nodes)).links(links).size([this._width, this._height]).linkDistance(60).charge(-70).start();

                return force;
            };

            OrderedGraphWidget.prototype.tick = function (links, nodes) {
                links.attr("x1", function (d) {
                    return d.source.x;
                }).attr("y1", function (d) {
                    return d.source.y;
                }).attr("x2", function (d) {
                    return d.target.x;
                }).attr("y2", function (d) {
                    return d.target.y;
                });

                nodes.attr("cx", function (d) {
                    return d.x;
                }).attr("cy", function (d) {
                    return d.y;
                });
            };

            OrderedGraphWidget.prototype.getWidth = function () {
                return this._width;
            };
            OrderedGraphWidget.prototype.setWidth = function (width) {
                this._width = width;
                return this;
            };

            OrderedGraphWidget.prototype.setHeight = function (height) {
                this._height = height;
                return this;
            };
            OrderedGraphWidget.prototype.getHeight = function () {
                return this._width;
            };
            return OrderedGraphWidget;
        })();
        OrderedGraph.OrderedGraphWidget = OrderedGraphWidget;
    })(Feature.OrderedGraph || (Feature.OrderedGraph = {}));
    var OrderedGraph = Feature.OrderedGraph;
})(Feature || (Feature = {}));
/// <reference path="Feature\OrderedGraph\OrderedGraphWidget.ts" />
var graphWidget = new Feature.OrderedGraph.OrderedGraphWidget();
graphWidget.setWidth(800).setHeight(600).init();
