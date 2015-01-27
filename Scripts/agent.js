function Agent(x, y){
    this.currPos = {x: x, y: y};
    this.prevPos = {x: x, y: y};
    this.hasGold = false;
    this.ammo = 1;

    this.move = function(){
        /* variables */
        var nextStep;
        /* see if it can kill the wumpus */
        this.killWumpus();
        /* build the tree */
        //Map.seeIfMoreThanOne(this);

        SearchTree.openList = [];

        SearchTree.openList.unshift({ x: this.prevPos.x, y: this.prevPos.y });
        if(Map.heursticFunc){
            if(Map.countHeur() < 0.5){
                if(this.currPos.y + 1 < DIM && this.currPos.y + 1 != this.prevPos.y) {
                    SearchTree.openList.unshift({ x: this.currPos.x, y: this.currPos.y + 1 });
                }
                if(this.currPos.y - 1 >= 0 && this.currPos.y - 1 != this.prevPos.y) {
                    SearchTree.openList.unshift({ x: this.currPos.x, y: this.currPos.y - 1 });
                }
                if(this.currPos.x + 1 < DIM && this.currPos.x + 1 != this.prevPos.x) {
                    SearchTree.openList.unshift({ x: this.currPos.x + 1, y: this.currPos.y });
                }
                if(this.currPos.x - 1 >= 0 && this.currPos.x - 1 != this.prevPos.x) {
                    SearchTree.openList.unshift({ x: this.currPos.x - 1, y: this.currPos.y });
                }
            }
            else {
                if(this.currPos.x + 1 < DIM && this.currPos.x + 1 != this.prevPos.x) {
                    SearchTree.openList.unshift({ x: this.currPos.x + 1, y: this.currPos.y });
                }
                if(this.currPos.x - 1 >= 0 && this.currPos.x - 1 != this.prevPos.x) {
                    SearchTree.openList.unshift({ x: this.currPos.x - 1, y: this.currPos.y });
                }

                if(this.currPos.y + 1 < DIM && this.currPos.y + 1 != this.prevPos.y) {
                    SearchTree.openList.unshift({ x: this.currPos.x, y: this.currPos.y + 1 });
                }
                if(this.currPos.y - 1 >= 0 && this.currPos.y - 1 != this.prevPos.y) {
                    SearchTree.openList.unshift({ x: this.currPos.x, y: this.currPos.y - 1 });
                }
            }
            Map.heursticFunc = false;
        }
        else {
            if(this.currPos.y + 1 < DIM && this.currPos.y + 1 != this.prevPos.y) {
                SearchTree.openList.unshift({ x: this.currPos.x, y: this.currPos.y + 1 });
            }
            if(this.currPos.y - 1 >= 0 && this.currPos.y - 1 != this.prevPos.y) {
                SearchTree.openList.unshift({ x: this.currPos.x, y: this.currPos.y - 1 });
            }
            if(this.currPos.x + 1 < DIM && this.currPos.x + 1 != this.prevPos.x) {
                SearchTree.openList.unshift({ x: this.currPos.x + 1, y: this.currPos.y });
            }
            if(this.currPos.x - 1 >= 0 && this.currPos.x - 1 != this.prevPos.x) {
                SearchTree.openList.unshift({ x: this.currPos.x - 1, y: this.currPos.y });
            }
        }

        SearchTree.closedList.push({ x: this.currPos.x, y: this.currPos.y });
        Map.countSafeNumberAndOptimize();

        console.log(SearchTree.openList);

        do {
            nextStep = SearchTree.openList.shift();
        } while(!KnowledgeBase.db[nextStep.x][nextStep.y].isSafe());

        /* set this positions */
        this.prevPos = { x: this.currPos.x, y: this.currPos.y };
        this.currPos = { x: nextStep.x, y: nextStep.y };

        console.log(" I am currently on x: " + this.currPos.x + " y: " + this.currPos.y);

        if(Map.tiles[this.currPos.x][this.currPos.y].hasBreeze){
            console.log("It is really breezy around here! ");
            KnowledgeBase.db[this.currPos.x][this.currPos.y].hasBreeze = true;
        }
        if(Map.tiles[this.currPos.x][this.currPos.y].hasStink){
            console.log("This place reeks!");
            KnowledgeBase.db[this.currPos.x][this.currPos.y].hasStink = true;
        }
        if(Map.tiles[this.currPos.x][this.currPos.y].hasGlimmer){
            console.log("--------------------------------------");
            console.log("Something is glimmering in the dark!");
            this.pickUp();
        }

        /* let us make a statement that we've visited the given tile */
        KnowledgeBase.db[this.currPos.x][this.currPos.y].visited = true;
        this.gatherAdjacentInfo();
    };

    /* gather information from the current cell
     * and add new knowledge base entries based upon the
     * observations */
    this.gatherAdjacentInfo = function(){
        if(Map.tiles[this.currPos.x][this.currPos.y].hasBreeze){
            /* if the position is not out of bounds
             * if not, create an entry */
            if(this.currPos.y + 1 < DIM && this.currPos.y + 1 != this.prevPos.y) {
                this.setAdjacentCell(new Cell(this.currPos.x, this.currPos.y + 1), Type.PIT);
            }
            /* second */
            if(this.currPos.y - 1 >= 0 && this.currPos.y - 1 != this.prevPos.y) {
                this.setAdjacentCell(new Cell(this.currPos.x, this.currPos.y - 1), Type.PIT);
            }
            /* third */
            if(this.currPos.x + 1 < DIM && this.currPos.x + 1 != this.prevPos.x) {
                this.setAdjacentCell(new Cell(this.currPos.x + 1, this.currPos.y ), Type.PIT);
            }
            /* fourth */
            if(this.currPos.x - 1 >= 0 && this.currPos.x - 1 != this.prevPos.x) {
                this.setAdjacentCell(new Cell(this.currPos.x - 1, this.currPos.y ), Type.PIT);
            }
        }

        if(Map.tiles[this.currPos.x][this.currPos.y].hasStink){
            /* if the position is not out of bounds
             * if not, create an entry */
            if(this.currPos.y + 1 < DIM && this.currPos.y + 1 != this.prevPos.y) {
                this.setAdjacentCell(new Cell(this.currPos.x, this.currPos.y + 1), Type.WUMPUS);
            }
            /* second */
            if(this.currPos.y - 1 >= 0 && this.currPos.y - 1 != this.prevPos.y) {
                this.setAdjacentCell(new Cell(this.currPos.x, this.currPos.y - 1), Type.WUMPUS);
            }
            /* third */
            if(this.currPos.x + 1 < DIM && this.currPos.x + 1 != this.prevPos.x) {
                this.setAdjacentCell(new Cell(this.currPos.x + 1, this.currPos.y ), Type.WUMPUS);
            }
            /* fourth */
            if(this.currPos.x - 1 >= 0 && this.currPos.x - 1 != this.prevPos.x) {
                this.setAdjacentCell(new Cell(this.currPos.x - 1, this.currPos.y ), Type.WUMPUS);
            }
        }

        KnowledgeBase.reload();
    };

    /* set pit */
    this.setAdjacentCell = function(cell, type){

        switch(type){
            case Type.WUMPUS:
                cell.hasWumpus = true;
                break;
            case Type.PIT:
                cell.hasPit = true;
                break;
        }

        KnowledgeBase.add(cell);
    };

    this.killWumpus = function(){
        if(this.ammo < 0){
            console.log("--------------------------------------");
            console.log("Oh noes!! I am out of ammo!");
            console.log("--------------------------------------");
            return;
        }

        if(KnowledgeBase.wumpusCoords.x != -1 && KnowledgeBase.wumpusCoords.y != -1){
            if(this.currPos.x == KnowledgeBase.wumpusCoords.x || this.currPos.y == KnowledgeBase.wumpusCoords.y){
                console.log("--------------------------------------");
                console.log("Well this one's ought to hurt! BUMM");
                /* if the this is able to shoot down the wumpus
                 * meaning his coordinates are correct */
                 if(this.currPos.x == Map.wumpusCoords.x || this.currPos.y == Map.wumpusCoords.y){
                     new Audio('Sound/scream.mp3').play();
                    /* do some cleanup */
                    Map.tiles[KnowledgeBase.wumpusCoords.x][KnowledgeBase.wumpusCoords.y].hasWumpus = false;

                    for(var i = 0; i < DIM; i++){
                        for(var j = 0; j < DIM; j++){
                            if(KnowledgeBase.db[i][j].hasWumpus) KnowledgeBase.db[i][j].hasWumpus = false;
                        }
                    }

                    Draw.drawX(document.getElementById("Canvas1"), KnowledgeBase.wumpusCoords.x, KnowledgeBase.wumpusCoords.y);

                    KnowledgeBase.wumpusCoords.x = -1;
                    KnowledgeBase.wumpusCoords.y = -1;
                    Map.wumpusCoords.x = -1;
                    Map.wumpusCoords.y = -1;
                    KnowledgeBase.wumpusIsAlive = false;

                    console.log("A loud scream can be heard! The Wumpus is dead!!");
                }
                else{ /* the this was at the wrong position */
                     console.log("Oh noes! I was wrong about this...");
                 }
            }
            console.log("--------------------------------------");
            this.ammo--;
        }
    };

    this.goBack = function(){
        if(SearchTree.closedList.length == 0){
            return -1;
        }

        var nextStep = SearchTree.closedList.pop();
        this.prevPos = { x: this.currPos.x, y: this.currPos.y };
        this.currPos = { x: nextStep.x, y: nextStep.y };

        console.log("I am currently at x: " + this.currPos.x + " y: " + this.currPos.y);
        return 0;
    };

    this.pickUp = function(){
        if(!Map.tiles[this.currPos.x][this.currPos.y].hasGold) {
            console.log("No gold could be found on the current cell.");
        }
        else {
            console.log("Picked up the gold. My precious!");
            console.log("--------------------------------------");
            this.hasGold = true;
            Map.tiles[this.currPos.x][this.currPos.y].hasGold = false;
            Map.tiles[this.currPos.x][this.currPos.y].hasGlimmer = false;
        }
    };
}
