var Tiles = [],
    Chunks = [],
    tileTextures = [],
    tileImgBaseUrl = 'imgs/tiles/',
    tileImgW = 64,
    tileImgH = 64;

tileTextures[0] = PIXI.Texture.fromImage(tileImgBaseUrl+'apple_trees_block.png', true);
tileTextures[1] = PIXI.Texture.fromImage(tileImgBaseUrl+'everfree_forest_block.png', true);
tileTextures[2] = PIXI.Texture.fromImage(tileImgBaseUrl+'mountain_block.png', true);
tileTextures[3] = PIXI.Texture.fromImage(tileImgBaseUrl+'poison_joke_block.png', true);
tileTextures[4] = PIXI.Texture.fromImage(tileImgBaseUrl+'snow_mountain_block.png', true);
tileTextures[5] = PIXI.Texture.fromImage(tileImgBaseUrl+'volcano_block.png', true);
tileTextures[6] = PIXI.Texture.fromImage(tileImgBaseUrl+'zap_apple_tree_block.png', true);
tileTextures[7] = PIXI.Texture.fromImage(tileImgBaseUrl+"apple_trees.png", true);
tileTextures[8] = PIXI.Texture.fromImage(tileImgBaseUrl+'bushes.png', true);
tileTextures[9] = PIXI.Texture.fromImage(tileImgBaseUrl+'everfree_forest.png', true);
tileTextures[10] = PIXI.Texture.fromImage(tileImgBaseUrl+'mountain.png', true);
tileTextures[11] = PIXI.Texture.fromImage(tileImgBaseUrl+'poison_joke.png', true);
tileTextures[12] = PIXI.Texture.fromImage(tileImgBaseUrl+'snow_mountain.png', true);
tileTextures[13] = PIXI.Texture.fromImage(tileImgBaseUrl+'volcano.png', true);
tileTextures[14] = PIXI.Texture.fromImage(tileImgBaseUrl+'zap_apple_tree.png', true);

tileTextures.splice(0, 0, PIXI.Texture.fromImage(tileImgBaseUrl+'bushes_block.png', true));

function TileToGraphicPoint(point){
    
    var gx = point.x * (tileImgW/2);
    var gy = point.y * (tileImgH/2);
    var Ret = new PIXI.Point(gx - gy, (gx + gy)/2);
    
    return Ret;
}
function GraphicToTilePoint(point){
    
    var a2 = point.y * 2;
    
    var nextStepX = a2 + point.x;
    var tx2 = nextStepX/(tileImgW/2);
    var tx = tx2/2;
    
    var nextStepY = a2 - point.x;
    var ty2 = nextStepY/(tileImgH/2);
    var ty = ty2/2;
    
    return new PIXI.Point(tx, ty);
}
/*
74 41 isoTile.js:18
2368 1312 isoTile.js:22
Object {x: 1056, y: 1840} */
function Tile(point, z, stage) {
    'use strict';
    var graphPos = TileToGraphicPoint(point);
    var self = this
        , imageUrl = null
        , xOffset = tileImgW/2
        , yOffset = tileImgH/4
        , pos = point
        , posZ = z;
    
    var randText = Math.floor(Math.random()*6);
    this.Texture = tileTextures[randText];
    

    
    this.Sprite = new PIXI.Sprite(this.Texture);
    
    this.__defineGetter__('imageUrl', function(){
       return imageUrl;
    });
    this.__defineSetter__('imageUrl', function(value){
        if(imageUrl === value)return;
        imageUrl = value;
        self.Texture = PIXI.Texture.fromImage(imageUrl, true);
        self.Sprite.setTexture(self.Texture);
    });
    
    this.__defineGetter__('pos', function(){
       return pos; 
    });
    this.__defineGetter__('x', function(){
        return pos.x;  
    });
    this.__defineGetter__('y', function(){
        return pos.y;
    });
    this.__defineGetter__('z', function(){
        return posZ; 
    });
    
    this.__defineSetter__('x', function(value){
        pos.x = value;
        self.Sprite.position.x = TileToGraphicPoint(pos).x;
    });
    this.__defineSetter__('y', function(value){
        pos.y = value;
        self.Sprite.position.y = TileToGraphicPoint(pos).y;
    });
    this.__defineSetter__('z', function(value){
        posZ = value;
        self.Sprite.z = value;
    });
    
    self.gScore = null;
    self.fScore = null;
    
    self.Sprite.position.x = graphPos.x;
    self.Sprite.position.y = graphPos.y;
    self.Sprite.z = posZ;
    
    this.childThing = new PIXI.Sprite(tileTextures[randText+8]); 
    this.childThing.position.y -= 32;
    
    this.Sprite.addChild(this.childThing);
    //self.Sprite.setInteractive(true);
    //self.Sprite.mousedown = function(interData){
    //  console.log(interData);  
    //};
    //stage.addChild(self.Sprite);
    
    //SortInOnStage(self.Sprite, stage);
    WC.addTile(this);
    //Tiles.push(this);
    return;
}

function Chunk(position, size, stage){
    var pos = position,
        chunkSize = size,
        chunkTiles = [],
    
        xOffset = tileImgW/2,
        yOffset = tileImgH/2,
        totalXOffset = pos.x * xOffset,
        totalYOffset = pos.y * yOffset,
    
        upperX = (xOffset/2 + totalXOffset)*chunkSize.x,
        lowerX = -upperX,
    
        upperY = (yOffset/2 + totalYOffset)*chunkSize.y,
        lowerY = -upperY;
    
    
    for(var i = lowerX; i < upperX; i += xOffset){
        for(var j = lowerY; j < upperY; j += yOffset){
            var isoPos = new PIXI.Point(i-j, (i+j)/2),
                tile = new Tile(isoPos, isoPos.y, stage);
            
            chunkTiles.push(tile);
        }
    }
    Chunks.push(this);
}

function TileIterator(){
    this.current = 0;
    
}

TileIterator.prototype.next = function(){
    if(Tiles.length == 0)return;
    if(this.current == 0){
        console.log("It equals 0 BEFORE");   
    }
    if(this.current < Tiles.length){
        var tile = Tiles[this.current++];
        return tile;   
    }else{
        this.current = 0;
        var tile = Tiles[0];
        return tile;
    }
    if(this.current == 0){
        console.log("It equals 0 AFTER");   
    }
};
var log = {};

WorldContainer = function(stage)
{
    PIXI.DisplayObjectContainer.call( this );
 
    var self = this;
    
    //this.stage = stage;
    this.ZArr = [];
    this.Tiles = [];
    stage.addChild(this);
};
 
// constructor
WorldContainer.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
WorldContainer.prototype.constructor = WorldContainer;

WorldContainer.prototype.addTile = function(Tile){
    
    if(!this.Tiles[Tile.y]){
        this.Tiles[Tile.y] = [];   
    }
    
    //Tile.Sprite.parent = this.stage;
    //Tile.Sprite.setStageReference(stage);
    
    this.Tiles[Tile.y].splice(Tile.x, 0, Tile.Sprite);
    
};

WorldContainer.prototype.Resort = function(isTile){
    var self = this;
    console.time("Resort");
    if(isTile){
        this.ZArr[0] = [];
        /*for(var i = 0; i < this.Tiles.length; ++i){
            this.ZArr[0] = this.ZArr[0].concat(this.Tiles[i]);
        }*/
        async.concat(this.Tiles, function(tileRow, cb){
            cb(null, tileRow);
        }, function(err, theResults){
            var sortedTiles = [];
            async.sortBy(theResults, function(tile, callback){
                var blah = tile.y;
                callback(null, blah);
            },
            function(err, results){
                self.ZArr[0] = results;
                self.SetChildren();
                console.timeEnd("Resort");
            });
        });

    }else{
        
    }
    
    
};

WorldContainer.prototype.SetChildren = function(){
    /*for(var i = 0; i < this.ZArr.length; ++i){
        for(var j = 0; j < this.ZArr[i].length; ++j){
            this.addChild(this.ZArr[i][j]);   
        }
        if(child.parent)
        {
            child.parent.removeChild(child);
        }
 
        child.parent = this;
        child.setStageReference(this.stage);
    }*/
    var self = this;
    console.time("SetChildren");
    async.concat(this.ZArr, function(item, callback){
        callback(null, item);
    },
    function(err, res){
        async.each(res, function(item, callback){
            if(item.parent)
            {
                item.parent.removeChild(item);
            }

            item.parent = self;
            item.setStageReference(self.stage);
            callback(null);
        },
        function(error){
            self.children = res;
            console.timeEnd("SetChildren");
        });
    });

};

function AStar(start, goal){
    var closed = [],
        open = [start],
        cameFrom = [],
        gScore = [],
        fScore = [];
    
    
    gScore[start] = 0;
    
}

function heuristicCostEstimate(){
    
}
        
