window.onload = function() {
    /* init */
    KnowledgeBase.init(DIM);
    Map.init(DIM);
    /* variables */
    var steps = 0;
    var agent = new Agent(DIM - 1, 0);

    /* initialize map */
    Map.tiles[0][0].hasStink = true;
    Map.tiles[1][0].hasWumpus = true;
    Map.wumpusCoords = { x: 1, y: 0};
    Map.tiles[2][0].hasStink = true;
    Map.tiles[1][1].hasBreeze = true;
    Map.tiles[1][1].hasStink = true;
    Map.tiles[1][1].hasGold = true;
    Map.tiles[1][1].hasGlimmer = true;
    Map.tiles[1][3].hasBreeze = true;
    Map.tiles[2][2].hasBreeze = true;
    Map.tiles[0][2].hasBreeze = true;
    Map.tiles[1][2].hasPit = true;
    Map.tiles[3][1].hasBreeze = true;
    Map.tiles[3][3].hasBreeze = true;
    Map.tiles[3][2].hasPit = true;

    /* draw the map on canvas */
    Draw.init();
    Draw.canvasdraw(document.getElementById("Canvas1"));

    /* draws the player on start location */
    Draw.drawmove(document.getElementById("Canvas1"),"forward",agent.currPos.x,agent.currPos.y)

    var game = setInterval(gameLoop, 1000);

    function gameLoop(){
        if(steps > MAX_STEPS) {
            console.log("--------------------------------------");
            console.log("I couldn't find the gold :(");
            console.log("--------------------------------------");
            clearInterval(game);
        }

        /* move */
        agent.move();
        Map.gatherAdjacentInfo(agent);
        Draw.drawmove(document.getElementById("Canvas1"),"forward",agent.currPos.x,agent.currPos.y);

        /* see if the agent is still alive */
        if(Map.tiles[agent.currPos.x][agent.currPos.y].hasPit) {
            new Audio('Sound/fall.mp3').play();
            console.log("--------------------------------------");
            console.log("Aaaahhhh!");
            console.log("--------------------------------------");
            clearInterval(game);
        }

        if(Map.tiles[agent.currPos.x][agent.currPos.y].hasWumpus) {
            new Audio('Sound/roar.mp3').play()
            console.log("--------------------------------");
            console.log("Noo! The agent has been eaten by the Wumpus!");
            console.log("--------------------------------------");
            clearInterval(game);
        }
        /*-----------------------------------*/

        steps++;

        /* going back to the start */
        if(agent.hasGold) {
            new Audio('Sound/tada.wav').play();

            clearInterval(game);
            seeIfHasGold();
        }
    }

    var back;

    function seeIfHasGold(){
        if(agent.hasGold){
            console.log("--------------------------------------");
            console.log("Going back to the start...");
            console.log("--------------------------------------");
            back = setInterval(goBack, 1000);
        }
    }

    function goBack(){
        if(agent.goBack() == -1) {
            clearInterval(back);
            new Audio("Sound/ovation.mp3").play();
            console.log("--------------------------------------");
            console.log("Woohoo!! I am rich!!");
            console.log("--------------------------------------");
        }
        else if(agent.currPos.x == 3 && agent.currPos.y == 0) {
            clearInterval(back);
            new Audio("Sound/ovation.mp3").play();
            console.log("--------------------------------------");
            console.log("Woohoo!! I am rich!!");
            console.log("--------------------------------------");
        }

        Draw.drawmove(document.getElementById("Canvas1"),"backward",agent.currPos.x,agent.currPos.y);
    }
};
