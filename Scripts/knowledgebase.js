var KnowledgeBase = {
    sentences: [],
    db: [],
    wumpusCoords: { x: -1, y: -1 },
    wumpusIsAlive: true,

    /* initialize an empty db */
    init: function(dim){
        for(var i = 0; i < dim; i++){
            this.db[i] = [];

            for(var j = 0; j < dim; j++){
                this.db[i][j] = new Cell(i, j);
            }
        }
    },

    /* index { x: value, y: value }
     * cell is a Cell type object */
    add: function(cell){
        this.sentences.push(cell);
    },

    /* relouad our knowledge database */
    reload: function(){
        var i;
        var wumpusTiles = 0;
        var tempWumpusCoords = { x: 0, y: 0 };

        for(i = 0; i < this.sentences.length; i++){
            if(this.wumpusIsAlive) this.cellMod(this.sentences[i].pos.x, this.sentences[i].pos.y, i, Type.WUMPUS);
            this.cellMod(this.sentences[i].pos.x, this.sentences[i].pos.y, i, Type.PIT);

            /* wumpus */
            if(this.wumpusIsAlive && this.sentences[i].hasWumpus){
                this.db[this.sentences[i].pos.x][this.sentences[i].pos.y].wumpusCount++;
            }

            if(this.sentences[i].hasPit){
                this.db[this.sentences[i].pos.x][this.sentences[i].pos.y].pitCount++;
            }
        }

        /* try to find the wumpus */
        for(i = 0; i < DIM; i++){
            for(var j = 0; j < DIM; j++){
                /* wumpus */
                if(this.wumpusIsAlive && this.db[i][j].wumpusCount >= 2) this.wumpusCoords = { x: i, y: j };
                this.db[i][j].wumpusCount = 0;
            }
        }

        /* find the coordinates*/
        for(i = 0; i < DIM; i++){
            for(j = 0; j < DIM; j++){
                if(this.db[i][j].hasWumpus) {
                    wumpusTiles++;
                    tempWumpusCoords = { x: i, y: j };
                }
            }
        }

        if(wumpusTiles == 1){
            this.wumpusCoords = { x: tempWumpusCoords.x, y: tempWumpusCoords.y };
        }

        /* something about the pits */
        /*for(i = 0; i < DIM; i++){
            for(j = 0; j < DIM; j++){
                if(this.db[i][j].pitCount >= 2){
                    this.db[i][j].firstPitGuess = false;
                    this.db[i][j].hasPit = true;
                    this.erasePits(i, j);
                }
            }
        }*/
    },

    /* modify the cell
     * i j Map tile
     * k KB */
    cellMod: function(i, j, k, type){
        switch(type){
            case Type.WUMPUS:
                if(this.db[i][j].firstWumpusGuess){
                    this.db[i][j].hasWumpus = this.sentences[k].hasWumpus;
                    this.db[i][j].firstWumpusGuess = false;
                }
                else this.db[i][j].hasWumpus = this.db[i][j].hasWumpus && this.sentences[k].hasWumpus;
                break;

            case Type.PIT:
                if(this.db[i][j].firstPitGuess){
                    this.db[i][j].hasPit = this.sentences[k].hasPit;
                    this.db[i][j].firstPitGuess = false;
                }
                this.db[i][j].hasPit = this.db[i][j].hasPit && this.sentences[k].hasPit;
                break;
        }
    },

    /* if a pit is guaranteed to be on the position that is
    * defined by (x,y), then erase further guesses */
    erasePits: function(x, y){
        /* first go bot */
        if(x + 1 < DIM){
            this.eraseOnePit(x + 1, y);
        }
        /* then to the right */
        if(y + 1 < DIM){
            this.eraseOnePit(x, y + 1);
        }
        /* then to left */
        if(y - 1 >= 0){
            this.eraseOnePit(x, y - 1);
        }
        /* then to the top */
        if(x - 1 >= 0){
            this.eraseOnePit(x - 1, y);
        }
    },

    eraseOnePit: function(x, y){
        if(x + 1 < DIM){
            this.db[x][y].firstPitGuess = false;
            this.db[x][y].hasPit = false;
        }
        /* then to the right */
        if(y + 1 < DIM){
            this.db[x][y].firstPitGuess = false;
            this.db[x][y].hasPit = false;
        }
        /* then to left */
        if(y - 1 >= 0){
            this.db[x][y].firstPitGuess = false;
            this.db[x][y].hasPit = false;
        }
        /* then to the top */
        if(x - 1 >= 0){
            this.db[x][y].firstPitGuess = false;
            this.db[x][y].hasPit = false;
        }
    }
};
