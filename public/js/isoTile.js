var testR = {toppers: 0,
    notToppers: 0,
    totalTopperChances: 0};


/*tileTextures[0] = PIXI.Texture.fromImage(tileImgBaseUrl+'apple_trees_block.png', true);
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

tileTextures.splice(0, 0, PIXI.Texture.fromImage(tileImgBaseUrl+'bushes_block.png', true));*/

function TileToGraphicPoint(point){
    var ts = art.tiles.tileSize;
    var gx = point.x * (ts.x/2);
    var gy = point.y * (ts.y/2);
    var Ret = new PIXI.Point(gx - gy, (gx + gy)/2);
    
    return Ret;
}
function GraphicToTilePoint(point){
    
    var ts = art.tiles.tileSize;
    
    var a2 = point.y * 2;
    
    var nextStepX = a2 + point.x;
    var tx2 = nextStepX/(ts.x/2);
    var tx = tx2/2;
    
    var nextStepY = a2 - point.x;
    var ty2 = nextStepY/(ts.y/2);
    var ty = ty2/2;
    
    return new PIXI.Point(tx, ty);
}
/*
74 41 isoTile.js:18
2368 1312 isoTile.js:22
Object {x: 1056, y: 1840} */
function Tile(point, z, stage, inChunk) {
    'use strict';
    var graphPos = TileToGraphicPoint(point);
    var self = this
        , imageUrl = null
        , pos = point
        , posZ = z;
    
    this.textName = art.tiles.getRandomTexture();
    this.Texture = art.tiles.textures[this.textName];
    //console.log(this.Texture);
    this.Sprite = new PIXI.Sprite(this.Texture);
    
    this.Sprite.parent =null;
    //var scale = new PIXI.Point(0.5, 0.5);
    
    this.Sprite.scale = art.tiles.scale;
    var chance = [true, false];
    if(chance[Math.floor(Math.random()*chance.length)]){
        ++testR.toppers;
        this.Topper = new PIXI.Sprite(art.toppers.textures[this.textName]);
        this.Topper.position.y -= art.tiles.otherSize.y/2;
        //this.Topper.position.x += 20;
        //this.Topper.scale = scale;
        this.Sprite.addChild(this.Topper);
    }else{
        ++testR.notToppers;   
    }
    ++testR.totalTopperChances;
    
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
    
    //self.Sprite.setStageReference(stage);
    //this.childThing = new PIXI.Sprite(tileTextures[randText+8]); 
    //this.childThing.position.y -= 32;
    
    //this.Sprite.addChild(this.childThing);
    //self.Sprite.setInteractive(true);
    //self.Sprite.mousedown = function(interData){
    //  console.log(interData);  
    //};
    //stage.addChild(self.Sprite);
    
    //SortInOnStage(self.Sprite, stage);
    if(!inChunk){
        WC.addTile(this);
    }
    //Tiles.push(this);
    return;
}
 

function Chunk(position, size, stage){
    PIXI.DisplayObjectContainer.call( this );
        this.chunkSize = size;
    var self = this;
    var pos = position,
        posZ = 0;
        //chunkSize = size,
        //chunkTiles = [],
    
    
        /*xOffset = tileImgW/2,
        yOffset = tileImgH/2,
        totalXOffset = pos.x * xOffset,
        totalYOffset = pos.y * yOffset,
    
        upperX = (xOffset/2 + totalXOffset)*this.chunkSize.x,
        lowerX = -upperX,
    
        upperY = (yOffset/2 + totalYOffset)*this.chunkSize.y,
        lowerY = -upperY;*/
    this.posA = new PIXI.Point(position.x, position.y);
    this.pos = position;
    this.position = TileToGraphicPoint(this.posA);
    this.xRange = new PIXI.Point(-(size.x-1)/2, (size.x-1)/2);
    this.yRange = new PIXI.Point(-(size.y-1)/2, (size.y-1)/2);
    this.setStageReference(stage);
    
    this.__defineGetter__('z', function(){
        return posZ; 
    });
    this.__defineSetter__('z', function(value){
        posZ = value;
        //self. = value;
    });    
    
    for(var i = this.xRange.x; i < this.xRange.y; ++i){
        for(var j = this.yRange.x; j < this.yRange.y; ++j){
            var isoPos = new PIXI.Point(i, j),
                tile = new Tile(isoPos, isoPos.y, stage, true);
            
            //tile.Sprite.parent = this;
            var p = (i * this.chunkSize.y)+j;
            //this.children.splice(p, 0, tile.Sprite);
            this.addChild(tile.Sprite);
        }
    }
    WC.addChunk(this);
}
// constructor
Chunk.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
Chunk.prototype.constructor = Chunk;


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

WorldContainer = function(stage, chunkSize)
{
    PIXI.DisplayObjectContainer.call( this );
 
    var self = this;
    
    //this.stage = stage;
    this.ZArr = [];
    this.Tiles = [];
    this.Chunks = [];
    this.chunkSize = chunkSize;
    stage.addChild(this);
    this.setStageReference(stage);
    
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

WorldContainer.prototype.init = function(){
    var xOffset = 1,
        yOffset = 1;
    for(var x = 0; x < (this.chunkSize.y - xOffset)*10; x+=this.chunkSize.x-xOffset){
        for(var hello = 0; hello < (this.chunkSize.y - yOffset)*10; hello+=this.chunkSize.y - yOffset){
            var pos = new PIXI.Point(x, hello);
            new Chunk(pos, this.chunkSize, this.stage);
        }
    }
    this.Resort(false);
}
WorldContainer.prototype.addChunk = function(Chunk){
    if(!this.Chunks[Chunk.pos.y]){
        this.Chunks[Chunk.pos.y] = [];   
    }
    
    //Tile.Sprite.parent = this.stage;
    //Tile.Sprite.setStageReference(stage);
    
    this.Chunks[Chunk.pos.y].push(Chunk);
};
WorldContainer.prototype.Resort = function(isTile){
    var self = this;
    console.time("Resort");
    this.ZArr[0] = [];
    if(isTile){
        /*async.concat(this.Tiles, function(tileRow, cb){
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
            
        });*/
        
        self.ZArr[0] = _.flatten(self.Tiles);
        
        self.ZArr[0] = _.sortBy(self.ZArr[0], 'y');
        console.timeEnd("Resort");
        self.SetChildren();
    }else{
        /*async.concat(self.Chunks, function(tileRow, cb){
            cb(null, tileRow);
        }, function(err, theResults){
            var sortedTiles = [];
            async.sortBy(theResults, function(tile, callback){
                var blah = tile.pos.y;
                callback(null, blah);
            },
            function(err, results){
                console.log(results);
                self.ZArr[0] = results;
                self.SetChildren();
                console.timeEnd("Resort");
            });
        });*/
        
        self.ZArr[0] = _.flatten(self.Chunks);
        
        self.ZArr[0] = _.sortBy(self.ZArr[0], 'y');
        console.timeEnd("Resort");
        self.SetChildren();

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
            /*if(item.parent)
            {
                item.parent.removeChild(item);
            }

            item.parent = self;
            item.setStageReference(self.stage);*/
            self.addChild(item);
            //console.log(item);
            callback(null);
        },
        function(error){
            //self.children = res;
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
        
