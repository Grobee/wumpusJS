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

    /* generating a custom level */
    generate: function () {
        var i, j, m, n;

        /* adds the pits to the map */
        for (i = 0; i < DIM / 2 - 1; i++) {
            m = Math.floor((Math.random() * DIM));
            n = Math.floor((Math.random() * DIM));
            if (this.tiles[m][n].hasPit == false && !(m == DIM - 1 && n == 0 ) && !((m==2 && n==0) ||(m==3 && n==1))) {
                this.tiles[m][n].hasPit = true;
            }
            else
                i--;
        }

        /* add the wumpus to the map */
        while (true) {
            m = Math.floor((Math.random() * DIM));
            n = Math.floor((Math.random() * DIM));
            if (this.tiles[m][n].hasWumpus == false && !this.tiles[m][n].hasPit && !(m == DIM - 1 && n == 0 ) && !((m==2 && n==0) ||(m==3 && n==1))) {
                this.tiles[m][n].hasWumpus = true;
                this.wumpusCoords = {x: m, y: n};
                break;
            }
        }

        /* add glimmer to the map */
        while (true) {
            m = Math.floor((Math.random() * DIM));
            n = Math.floor((Math.random() * DIM));
            if (this.tiles[m][n].hasGlimmer == false && !this.tiles[m][n].hasPit && !this.tiles[m][n].hasWumpus && !(m == DIM - 1 && n == 0 )) {
                this.tiles[m][n].hasGlimmer = true;
                this.tiles[m][n].hasGold= true;
                break;
            }
        }

        /* add breeze around the pit */
        for (i = 0; i < DIM; i++) {
            for (j = 0; j < DIM; j++) {
                if (this.tiles[i][j].hasPit) {
                    if (i > 0 && !this.tiles[i - 1][j].hasPit && !this.tiles[i - 1][j].hasWumpus)
                        this.tiles[i - 1][j].hasBreeze = true;
                    if (j > 0 && !this.tiles[i][j - 1].hasPit && !this.tiles[i][j - 1].hasWumpus)
                        this.tiles[i][j - 1].hasBreeze = true;
                    if (i < DIM - 1 && !this.tiles[i + 1][j].hasPit &&  !this.tiles[i + 1][j].hasWumpus)
                        this.tiles[i + 1][j].hasBreeze = true;
                    if (j < DIM - 1 && !this.tiles[i][j + 1].hasPit && !this.tiles[i][j + 1].hasWumpus)
                        this.tiles[i][j + 1].hasBreeze = true;
                }

            }
        }

        /* add stink around the pit */
        for (i = 0; i < DIM; i++) {
            for (j = 0; j < DIM; j++) {
                if (this.tiles[i][j].hasWumpus) {
                    if (i > 0 && !this.tiles[i - 1][j].hasPit)
                        this.tiles[i - 1][j].hasStink = true;
                    if (j > 0 && !this.tiles[i][j - 1].hasPit)
                        this.tiles[i][j - 1].hasStink = true;
                    if (i < DIM - 1 && !this.tiles[i + 1][j].hasPit)
                        this.tiles[i + 1][j].hasStink = true;
                    if (j < DIM - 1 && !this.tiles[i][j + 1].hasPit)
                        this.tiles[i][j + 1].hasStink = true;
                }

            }
        }


    },

    countHeur: function(){
        /* SO DIFFCIULTY*/
        /* MUCH WORK */
        return Math.random();
    }
};
