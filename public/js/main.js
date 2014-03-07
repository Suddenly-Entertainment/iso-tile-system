var renderer = null;
if(confirm("Use Canvas Renderer?")){
    renderer = new PIXI.CanvasRenderer(1600, 900);
}else{
    renderer = new PIXI.WebGLRenderer(1600, 900);
}

document.body.appendChild(renderer.view);
var stage = new PIXI.Stage(0xFFFFFF, true),
    chunkSize = new PIXI.Point(5, 5),
    //chunkAmount = new PIXI.Point(
    WC = new WorldContainer(stage, chunkSize);

WC.init();
    /*tileX = 100,
    tileY = 100,
    half = [-tileX/2, tileX/2];*/

/*var xOffset = tileImgW/2,
    yOffset = tileImgH/2;

var imgXPos = 0;
var imgYPos = 0;

var totalX = tileX * xOffset;
var totalY = tileY * yOffset;
var halfX = totalX/2;
var halfY = totalY/2;

//stage.position.x = 2;
//stage.position.y = 2;

/*function xCreate(cur, finish){
    if(cur < finish){
        _.defer(yCreate, cur, half[0], finish);
        _.defer(xCreate, cur+1, finish);
    }else{
        WC.Resort(true);   
    }
}

function yCreate(x, y, finish){
    if(y < finish){
        var point = new PIXI.Point(x, y);
        new Tile(point, y, stage);
        _.defer(yCreate, x, y+1, finish);
    }
}

xCreate(half[0], half[1]);*/
/*for(var x = half[1]; x > half[0]; x--){
    
    
    for(var y = half[1]; y > half[0]; y--){
        var point = new PIXI.Point(x, y);
        new Tile(point, y, stage);         
    }
    
}

WC.Resort(true);*/

//PIXI.Texture.fromImage("imgs/tiles/apple_trees_block.png", true);
//var tile = new PIXI.Sprite(tileTexture);

/*tile.position.x = 400;
tile.position.y = 300;

tile.scale.x = 2;
tile.scale.y = 2;

stage.addChild(tile);*/
var DeltaMove = new PIXI.Point(0, 0);
$(document).keydown(function(e) {
    e.preventDefault();
    var key = e.keyCode;
    switch(key){
        case 37: //Key left
            DeltaMove.x = 10;
            break;
        case 38: //Key Up
            DeltaMove.y = 10;
            break;
        case 39: //Key right
            DeltaMove.x = -10;
            break;
        case 40: //Key down
            DeltaMove.y = -10;
            break;
    }
    
});
$(document).keyup(function(e) {
    e.preventDefault();
    var key = e.keyCode;
    switch(key){
        case 37: //Key left
            DeltaMove.x = 0;
            break;
        case 38: //Key Up
            DeltaMove.y = 0;
            break;
        case 39: //Key right
            DeltaMove.x = 0;
            break;
        case 40: //Key down
            DeltaMove.y = 0;
            break;
    }
    
});
requestAnimationFrame(animate);
//var ti = new TileIterator();
//var nextTile;
//var nextTile2;
//var nextTile3;
//var nextTile4;
//var nextTile5;
var frameCount = 0;
setInterval(function(){
    console.info(frameCount);
    frameCount = 0;
}, 1000);
function animate() {
    //tile.rotation += 0.01;
    /*console.time('hello');
    nextTile = ti.next();
    nextTile2 = ti.next();
    nextTile3 = ti.next();
    nextTile4 = ti.next();
    nextTile5 = ti.next();
    if(typeof nextTile != 'undefined'){
            nextTile.Sprite.rotation += 0.01;
            nextTile2.Sprite.rotation += 0.01;
            nextTile3.Sprite.rotation += 0.01;
            nextTile4.Sprite.rotation += 0.01;

            nextTile5.Sprite.rotation += 0.01;

    }*/
    //console.log(nextTile);
    
    WC.position.x += DeltaMove.x;
    WC.position.y += DeltaMove.y;
    renderer.render(stage);
    frameCount++;
    requestAnimationFrame(animate);
    //console.timeEnd('hello');
}