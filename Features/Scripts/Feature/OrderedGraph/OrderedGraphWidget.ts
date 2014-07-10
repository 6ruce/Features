/// <reference path="EllipseWagesGroupDevider.ts" />

module Feature.OrderedGraph {
    declare var d3;
    declare var _;

    //TODO: Make uniq ids for links
    export class OrderedGraphWidget {
        private _svg;
        private _nodes;
        private _links;
        private _nodeLinksMap;
        private _force;

        init() {
            this._svg = this.initSvg();
            this._nodes = this.generateRandomNodes();
            this._links = this.generateRandomLinks(this._nodes);
            this._nodeLinksMap = this.makeNodeLinksMap(this._nodes, this._links);

            this._force = this.createForce(this._nodes, this._links);
            var nodesAndLinks = this.drawElements(this._svg);
            this.bindForceTick(this._force, nodesAndLinks);
        }

        private generateRandomNodes() {
            var criteria = _.range(10);
            return _.range(this._numberOfNodes).map((i) => {
                return {
                    name: 'Test' + i, test: 'Name' + i, criterion: _.sample(criteria), r : _.random(3, 9)
                };
            });
        }

        private generateRandomLinks(nodes) {
            var indexes = _.range(nodes.length);
            return _.range(nodes.length / 1.5).map((i) => {
                return { source: _.sample(indexes), target: _.sample(indexes), id : i };
            });
        }

        private makeNodeLinksMap(nodes, links) {
            var map = [];
            for (var index in links) {
                var link = links[index];
                map[link.source] = map[link.source] || {};
                if (! map[link.source]['source']) {
                    map[link.source]['source'] = [link.id];
                } else {
                    map[link.source]['source'].push(link.id);
                }

                map[link.target] = map[link.target] || {};
                if (!map[link.target]['target']) {
                    map[link.target]['target'] = [link.id];
                } else {
                    map[link.target]['target'].push(link.id);
                }
            }
            return map;
        }

        private drawElements(svg) {
            var colors = d3.scale.category10();

            var links = svg.selectAll("line")
                .data(this._links)
                .enter()
                .append("line")
                .attr("id", (d, i) => "graph-link-" + d.id)
                .style("stroke", "#ccc")
                .style("stroke-width", 1);

            var nodes = svg.selectAll("circle")
                .data(this._nodes)
                .enter()
                .append("circle")
                .attr("r", d => d.r)
                .style("fill", (d, i) => colors(i));

            return {links : links, nodes : nodes};
        }

        private bindForceTick(force, nodesAndLinks) {
            var links = nodesAndLinks.links;
            var nodes = nodesAndLinks.nodes;
            force.on("tick", () => this.tick(links, nodes));
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
            links.attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);

            nodes.attr("cx", (d) => d.x)
                .attr("cy", (d) => d.y);
        }

        group() {
            this._force.stop();
            var nodes = this._svg.selectAll("circle");
            var links = this._svg.selectAll("line");
            this.groupDevider().group(nodes, links, this._nodeLinksMap);
        }

        private _devider;
        private groupDevider() {
            if (!this._devider) {
                this._devider = new EllipseWagesGroupDevider(this._width, this._height);
            }
            return this._devider;
        }
        setGroupDevider(devider) {
            if (this._devider) {
                throw '`devider` already set'; 
            }
            this._devider = devider;
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

        private _numberOfNodes: number = 100;
        setNodesCount(count : number) {
            this._numberOfNodes = count;
            return this;
        }
        getNodesCount() : number {
            return this._numberOfNodes;
        }
    }
}
