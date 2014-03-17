/*global PIXI:false, SEI:true, WC:true, _:false, $:false, async:false, console:false*/
/**
 * @author Spencer Alan Watson
 * @file Contains and does all the loading of assets, like fonts, images, sounds, etcetera.
 * @version 1.0.0
 * @since 1.0.0
 */


/**
 * The namespace for the system
 * 
 * @author Spencer Alan Watson
 * @version 1.0.0
 * @since 1.0.0
 * @namespace
 * @global
 */
var SEI = {};

(function () {
    'use strict';
    /**
     * Contains everything related to the art assets for the system.
     * 
     * @author Spencer Alan Watson
     * @memeberof {SEI}
     * @constructor Art
     * @classdesc Contains everything related to the art assets for the system.
     * @since 1.0.0
     */
    SEI.Art = {
        crossorigin: true,
        tiles: {
            baseUrl: '',
            fileNames: [],
            fileUrls: [],
            names: [],
            textures: [],
            tileSize: new PIXI.Point(64, 64),
            otherSize: new PIXI.Point(64, 64),
            scale: new PIXI.Point(1, 1),

            loaded: false,

            getTiles: function(quality, cb){
                var self = this;
                var url = '/spritesheets/terrainNorm.json';
                switch(quality){
                    case 2:
                        self.otherSize.x = 128;
                        self.otherSize.y = 128;
                        self.scale.x = 0.5;
                        self.scale.y = 0.5;
                        url = '/spritesheets/terrain.json';
                        break;
                    case 0:
                        self.otherSize.x = 32;
                        self.otherSize.y = 32;
                        self.scale.x = 2;
                        self.scale.y = 2;
                        url = '/spritesheets/terrainLow.json';
                        break;
                }

                var thing = new PIXI.SpriteSheetLoader(url, true);
                thing.addEventListener('loaded', function(data){
                    console.log(data);
                    var fileNames = _.pluck(data.content.json.frames, 'filename');
                    fileNames = _.groupBy(fileNames, function(name){
                        var index = name.indexOf('/');
                        if(index != -1){
                            return name.substr(0, index); 
                        }
                    });
                    self.names = SEI.Art.GetBetterNames(fileNames['tiles']);
                    SEI.Art.toppers.names = SEI.Art.GetBetterNames(fileNames['tiletoppers']);
                    console.log(fileNames);
                    var length = fileNames['tiles'].length;
                    var scale = 0.5;

                    for(var i = 0; i < length; ++i){
                        var text = PIXI.Texture.fromFrame(i, true);
                        text.scale = new PIXI.Point(scale, scale);
                        self.textures[self.names[i]] = text;
                    }
                    var x;
                    for(var j = 0; i < length*2; x = (++i) + (++j)){
                        SEI.Art.toppers.textures[SEI.Art.toppers.names[j]] = PIXI.Texture.fromFrame(i, true);
                    }
                    self.loaded = true;
                    SEI.Art.toppers.loaded = true;

                    cb();
                    //console.log(new PIXI.Texture.fromFrame
                });
                thing.load();
            },
            //Just a utility function.
            getRandomTexture: function(){
                var self = this;
                var randVal = Math.floor(Math.random()*(self.names.length-1));
                var name = self.names[randVal];

                return name;
            }
        },
        toppers: {
            baseUrl: '',
            fileNames: [],
            fileUrls: [],
            names: [],
            textures: {},
            loaded: false,
            getToppers: function(cb){
                var self = this;
                $.getJSON('/topperNames', function(data){
                    self.baseUrl = data.basePath;
                    self.fileNames = data.files;

                    async.map(data.files,
                        function(name, callback){
                            var res = self.baseUrl.concat(name);
                            callback(null, res);
                        },
                        function(err, results){
                            self.fileUrls = results;
                            self.names = SEI.Art.GetBetterNames(results);

                            SEI.Art.loadAssets(results, function(){
                                var length = results.length;

                                for(var i = 0; i < length; ++i){
                                    var texture = new PIXI.Texture.fromImage(results[i], SEI.Art.crossorigin);
                                    self.textures[self.names[i]] = texture;
                                }
                                self.loaded = true;
                                cb();
                            });
                        }
                    );
                });
            }
        },

        loadAssets: function(fileUrls, cb){
            var AL = new PIXI.AssetLoader(fileUrls, SEI.Art.crossorigin);
            AL.addEventListener('onComplete', cb);
            AL.load();
        },
        GetBetterNames: function(badNames){
            var res = [];
            console.log(badNames);
            _.each(badNames, function(badName, index, list){
                var goodName = badName;

                var li = goodName.lastIndexOf('/');
                if(li !== -1){
                    goodName = goodName.substr(li);
                }

                goodName = goodName.replace('.png', '');
                goodName = goodName.replace('_block', '');
                res.push(goodName);
            });
            console.log(res);
            return res;
        },
        init: function(quality, callback){
            SEI.Art.tiles.getTiles(quality, function(){
                //if(SEI.Art.toppers.loaded){
                    callback();   
                //}
            });
            //SEI.Art.toppers.getToppers(function(){
            //    if(SEI.Art.tiles.loaded){
            //        callback();
            //    }
            //});

        },
    };
}());
