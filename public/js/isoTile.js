/*global PIXI:false, SEI:true, WC:true, _:false, $:false, async:false, console:false*/
(function () {
    'use strict';
    
    //Utility Functions
    
    /**
     * Converts normal tile to tile points that represent positions on the screen.
     *
     * @author Spencer Alan Watson
     * @since 1.0.0
     * @public
     * @param {PIXI.point} point The point to be converted.
     * @returns {PIXI.point} A point with coordinates representing screen positions.
     * @see {SEI.GraphicToTilePoint} Reverses this process.
     */
    SEI.TileToGraphicPoint = function (point) {
        var ts = SEI.Art.tiles.tileSize,
            gx = point.x * (ts.x / 2),
            gy = point.y * (ts.y / 2),
            Ret = new PIXI.Point(gx - gy, (gx + gy) / 2);

        return Ret;
    };
    
    /**
     * Converts screen coordinates to tile coordinates that represent the position of a tile/chunk.
     *
     * @author Spencer Alan Watson
     * @since 1.0.0
     * @public
     * @param {PIXI.point} point The point to be converted.
     * @returns {PIXI.point} A point with coordinates representing tile positions.
     * @see {SEI.TileToGraphicPoint} Reverses this process.
     */
    SEI.GraphicToTilePoint = function (point) {
        var ts = SEI.Art.tiles.tileSize,

            a2 = point.y * 2,

            nextStepX = a2 + point.x,
            tx2 = nextStepX / (ts.x / 2),
            tx = tx2 / 2,

            nextStepY = a2 - point.x,
            ty2 = nextStepY / (ts.y / 2),
            ty = ty2 / 2;

        return new PIXI.Point(tx, ty);
    };
    
    /**
     * Constructs an isometric tile.
     *
     * @author Spencer Alan Watson
     * @constructor
     * @this {SEI.Tile}
     * @since 0.0.1
     * @public
     * @memberof {SEI}
     * @augments {PIXI.Sprite}
     *
     * @param {PIXI.Point} point The position of the tile relative to it's parent.
     * @param {number} z The z index, which currently isn't used, but will later!
     * @param {PIXI.Point} absolutePosition The absolute position of the tile relative to the world.
     * @param {PIXI.Stage} stage The stage this tile is on.  (Not sure if we use this)
     * @see {SEI.Chunk} The common parent and creator of these.
     */
    SEI.Tile = function (point, z, absolutePosition, stage) {


        // I use self for scope.
        var self = this,
            imageUrl = null,
            tilePosition = point,
            zPosition = z,                       //Z isn't really used right now.
            graphicsPosition = SEI.TileToGraphicPoint(point),
            chance = [true, false];

        //This is just a place holder before we get a better map generator.
        this.textureName = SEI.Art.tiles.getRandomTexture();

        //This makes a Tile an extention of Sprite.
        PIXI.Sprite.call(this, SEI.Art.tiles.textures[this.textureName]);

        this.scale = SEI.Art.tiles.scale;
        //The absolute tile position, this will be used for things like pathfinding.
        this.absolutePosition = absolutePosition;
        
        //This adds things like mountains or trees to the tile
        //This way we can easely change the probability of a tile having a Topper.
        if (chance[Math.floor(Math.random() * chance.length)]) {

            this.Topper = new PIXI.Sprite(SEI.Art.toppers.textures[this.textureName]);
            //This is to align the topper properly above the tile.
            this.Topper.position.y -= SEI.Art.tiles.otherSize.y / 2;
            this.addChild(this.Topper);
        }

        //I don't know if this is a good way to define getters...
        this.__defineGetter__('tilePosition', function () {
            return tilePosition;
        });
        this.__defineGetter__('z', function () {
            return zPosition;
        });

        this.__defineSetter__('z', function (value) {
            zPosition = value;
        });

        //This sets the sprite position.
        self.position = graphicsPosition.clone();

    };
    // constructor
    SEI.Tile.prototype = Object.create(PIXI.Sprite.prototype);
    SEI.Tile.prototype.constructor = SEI.Tile;

    /**
     * Constructs a chunk.
     *
     * @author Spencer Alan Watson
     * @constructor
     * @public
     * @this {SEI.Chunk}
     * @since 1.0.0
     * @memberof {SEI}
     * @augments {PIXI.DisplayObjectContainer}
     *
     * @param {PIXI.Point} position The tile position of the chunk relative to the world.
     * @param {PIXI.Point} chunkSize How many tiles wide(x), and long(y) the chunk is.
     * @param {PIXI.Stage} stage The stage this tile is on.  (Not sure if we use this)
     * @see {SEI.WorldContainer} The common parent and creator of these.
     */
    SEI.Chunk = function (position, chunkSize, stage) {


        //We do this so we can properly extend DisplayObjectCOntainer.
        PIXI.DisplayObjectContainer.call(this);

        this.chunkSize = chunkSize;

        this.chunkPosition = position;
        this.position = SEI.TileToGraphicPoint(this.chunkPosition);

        this.xRange = new PIXI.Point(-(chunkSize.x) / 2, (chunkSize.x) / 2);
        this.yRange = new PIXI.Point(-(chunkSize.y) / 2, (chunkSize.y) / 2);

        this.setStageReference(stage);

        //I use self for scope.
        var self = this,
            zPosition = 0,
            i,
            j,
            tileInChunkPosition,
            absolutePosition,
            newTile;
        
        for (i = this.xRange.x; i < this.xRange.y; ++i) {
            for (j = this.yRange.x; j < this.yRange.y; ++j) {
                tileInChunkPosition = new PIXI.Point(i, j);
                absolutePosition = new PIXI.Point(this.chunkPosition.x + i, this.chunkPosition.y + j);
                newTile = new SEI.Tile(tileInChunkPosition, tileInChunkPosition.y, absolutePosition, stage);

                this.addChild(newTile);
            }
        }

        this.__defineGetter__('z', function () {
            return zPosition;
        });

        this.__defineSetter__('z', function (value) {
            zPosition = value;
        });

        WC.addChunk(this);
    };
    // constructor
    SEI.Chunk.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    SEI.Chunk.prototype.constructor = SEI.Chunk;

    /**
     * Constructs a world container, which contains everything in the game world.
     *
     * @author Spencer Alan Watson
     * @constructor
     * @public
     * @this {SEI.WorldContainer}
     * @since 1.0.0
     * @memberof {SEI}
     * @augments {PIXI.DisplayObjectContainer}
     *
     * @param {PIXI.Stage} stage The stage this tile is on.  (Not sure if we use this)
     * @param {PIXI.Point} chunkSize How many tiles wide(x), and long(y) the chunks are.
     */
    SEI.WorldContainer = function (stage, chunkSize) {
        //We do this so we can extend DisplayObjectContainer, which allows us to contain things.
        PIXI.DisplayObjectContainer.call(this);

        //I use self for scope.
        var self = this;

        //This contains everything sorted by Z so there can be proper overlap on render.
        this.ZArr = [];
        this.Chunks = [];

        this.chunkSize = chunkSize;

        stage.addChild(this);
    };

    // constructor for World Container
    SEI.WorldContainer.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    SEI.WorldContainer.prototype.constructor = SEI.WorldContainer;
    
    /**
     * Adds a chunk to a world container.
     *
     * @author Spencer Alan Watson
     * @function
     * @public
     *
     * @this {SEI.WorldContainer}
     * @memberof {SEI.WorldContainer}
     * @since 1.0.0
     *
     * @param {SEI.Chunk} Chunk The chunk you are adding
     */
    SEI.WorldContainer.prototype.addChunk = function (Chunk) {

        if (!this.Chunks[Chunk.chunkPosition.y]) {
            this.Chunks[Chunk.chunkPosition.y] = [];
        }

        this.Chunks[Chunk.chunkPosition.y].push(Chunk);
    };

        
    /**
     * Does initilization of the world, which currently means it loops through and creates chunks, sorts them, and sets the children.
     *
     * @author Spencer Alan Watson
     * @function
     * @public
     *
     * @this {SEI.WorldContainer}
     * @memberof {SEI.WorldContainer}
     * @since 1.0.0
     *
     */
    SEI.WorldContainer.prototype.init = function () {


        //The offsets allow us to add space between chunks for debugging purposes.
        var xOffset = 0,
            yOffset = 0,
            x = 0,
            y = 0,
            chunkPosition,
            upperLimitRows = (this.chunkSize.x - xOffset) * 10,
            upperLimitColumns = (this.chunkSize.y - yOffset) * 10,
            perX = this.chunkSize.x - xOffset,
            perY = this.chunkSize.y - yOffset;

        for (x = 0; x < upperLimitRows; x += perX) {
            for (y = 0; y < upperLimitColumns; y += perY) {
                chunkPosition = new PIXI.Point(x, y);
                //We don't (currently) have reason to store this in a variable here.
                new SEI.Chunk(chunkPosition, this.chunkSize, this.stage);
            }
        }

        //Sorts the chunks to make sure that they are rendered propperly.
        this.SortChunks();
    };

    /**
     * Sorts chunks to make sure there is proper overlap when they are rendered.
     *
     * @author Spencer Alan Watson
     * @function
     * @public
     *
     * @this {SEI.WorldContainer}
     * @memberof {SEI.WorldContainer}
     * @since 1.0.0
     *
     */
    SEI.WorldContainer.prototype.SortChunks = function () {

        //I use self for scope.
        var self = this;
        console.time("Resort");

        this.ZArr[0] = [];
        self.ZArr[0] = _.flatten(self.Chunks);
        self.ZArr[0] = _.sortBy(self.ZArr[0], 'y');

        console.timeEnd("Resort");

        self.SetChildren();
    };

    /**
     * Goes through the Z Array, flattens it, and adds all the objects as children of the world container, so they will be rendered.
     *
     * @author Spencer Alan Watson
     * @function
     * @public
     *
     * @this {SEI.WorldContainer}
     * @memberof {SEI.WorldContainer}
     * @since 1.0.0
     *
     */
    SEI.WorldContainer.prototype.SetChildren = function () {
        //I use self for scope.
        var self = this,
            aStorageArray;

        console.time("SetChildren");

        aStorageArray = _.flatten(this.ZArr);

        async.each(aStorageArray, function (item, callback) {
            self.addChild(item);
            callback(null);
        },
            function (error) {
                console.timeEnd("SetChildren");
            });

    };
}());