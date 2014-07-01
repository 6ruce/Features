module Feature.OrderedGraph {
    declare var d3;
    declare var _;
    export class OrderedGraphWidget {
        private _svg;
        private _nodes;
        private _links;

        init() {
            this._svg = this.initSvg();
            this._nodes = this.generateRandomNodes();
            this._links = this.generateRandomLinks(this._nodes);

            var force = this.createForce(this._nodes, this._links);
            var nodesAndLinks = this.drawElements(this._svg);
            this.bindForceTick(force, nodesAndLinks);
        }

        private generateRandomNodes() {
            return _.range(100).map((i) => {return {name : 'Test' + i, test : 'Name' + i}});
        }

        private generateRandomLinks(nodes) {
            var indexes = _.range(nodes.length);
            return _.range(nodes.length / 1.5).map(() => {
                return {source : _.sample(indexes), target : _.sample(indexes)}
            });
        }

        private drawElements(svg) {
            var colors = d3.scale.category10();

            var links = svg.selectAll("line")
                .data(this._links)
                .enter()
                .append("line")
                .style("stroke", "#ccc")
                .style("stroke-width", 1);

            var nodes = svg.selectAll("circle")
                .data(this._nodes)
                .enter()
                .append("circle")
                .attr("r", 10)
                .style("fill", (d, i) => colors(i));

            return {links : links, nodes : nodes};
        }

        private bindForceTick(force, nodesAndLinks) {
            force.on("tick", () => this.tick(nodesAndLinks.links, nodesAndLinks.nodes));
        }

        private initSvg() {
            var rectDemo = d3.select('#feature-container')
                .append("svg:svg")
                .attr("width", this._width)
                .attr("height", this._height);
            return rectDemo;
        }

        private createForce(nodes, links) {
            var force = d3.layout.force()
                .nodes(d3.values(nodes))
                .links(links)
                .size([this._width, this._height])
                .linkDistance(60)
                .charge(-70)
                .start();

            return force;
        }

        private tick(links, nodes) {
            links.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            nodes.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }

        private _width : number = 600;
        getWidth() : number {
            return this._width;
        }
        setWidth(width : number) {
            this._width = width;
            return this;
        }

        private _height : number = 600;
        setHeight(height : number) {
            this._height = height;
            return this;
        }
        getHeight() : number {
            return this._width;
        }
    }
}
