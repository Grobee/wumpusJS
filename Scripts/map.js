var Map = {
    tiles: [],
    dim: 0,
    wumpusCoords: { x: -1, y: -1 },
    heursticFunc: true,

    init: function (dim){
        this.dim = dim;

        /* generate an empty map */
        for(var i = 0; i < this.dim; i++){
            this.tiles[i] = [];

            for(var j = 0; j < this.dim; j++){
                this.tiles[i][j] = new Cell(i, j);
            }
        }
    },

    countSafeNumberAndOptimize: function(){
        var i = 0;
        var currentNode;
        var tempArray = [];

        /* pop previous position */
        var lastPos = SearchTree.openList.pop();
        /* put the safe and not visited positions to the beginning of the list */
        while(i < SearchTree.openList.length){
           currentNode = SearchTree.openList.pop();

           if(KnowledgeBase.db[currentNode.x][currentNode.y].isSafe() && !KnowledgeBase.db[currentNode.x][currentNode.y].visited){
               SearchTree.openList.unshift(currentNode);
           }
           else {
                tempArray.push(currentNode);
           }

           i++;
        }

        for(i = 0; i < tempArray.length; i++){
            SearchTree.openList.push(tempArray.shift());
        }

        SearchTree.openList.push(lastPos);
    },

    countHeur: function(){
        /* SO DIFFCIULTY*/
        /* MUCH WORK */
        var heur = Math.random();
        return Math.random();
        var variable = 5 + this.dim - 5;
    }
};
