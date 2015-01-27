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
        var num = 0;

        /* pop previous position */
        var lastPos = SearchTree.openList.pop();
        /* put the safe and not visited positions to the beginning of the list */
        while(i < SearchTree.openList.length){
           currentNode = SearchTree.openList.pop();

           if(KnowledgeBase.db[currentNode.x][currentNode.y].isSafe() && !KnowledgeBase.db[currentNode.x][currentNode.y].visited){
               SearchTree.openList.unshift(currentNode);
               num++;
           }
           else {
                tempArray.push(currentNode);
           }

           i++;
        }

        /* resort the positions */
        if(num > 1) this.resortPosArray();

        for(i = 0; i < tempArray.length; i++){
            SearchTree.openList.push(tempArray.shift());
        }

        SearchTree.openList.push(lastPos);
    },

    resortPosArray: function(){
        var rand;

        if(SearchTree.openList.length == 0) return 0;

        rand = Math.floor(Math.random() * SearchTree.openList.length);

        if(rand == SearchTree.openList.length) rand--;
        var tempNode = SearchTree.openList.slice(rand, rand + 1);
        SearchTree.openList.unshift(tempNode[0]);
    },

    countHeur: function(){
        /* SO DIFFCIULTY*/
        /* MUCH WORK */
        return Math.random();
    }
};
