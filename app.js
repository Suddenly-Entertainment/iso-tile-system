var fs = require('fs'),
    express  = require('express'),
    minify = require('minify'),
    http = require('http'),
    app = express(),
    defFROpts = {'encoding': 'utf8'},
    indexhtml = fs.readFileSync(__dirname.concat('/main/index.html'), defFROpts),
    pixijs = fs.readFileSync(__dirname.concat('/main/pixi.js'), defFROpts),
    pixidevjs = fs.readFileSync(__dirname.concat('/main/pixi.dev.js'), defFROpts),
    jquery = fs.readFileSync(__dirname.concat('/main/jquery.js'), defFROpts),
    asyncjs = fs.readFileSync(__dirname.concat('/main/async.js'), defFROpts),
    underscorejs = fs.readFileSync(__dirname.concat('/main/underscore.js'), defFROpts),
    alljs = "".concat(asyncjs, underscorejs, pixidevjs, jquery),
    
    imgBasePath = __dirname.concat('/public/imgs'),
    tilePath = imgBasePath.concat('/tiles'),
    topperPath = imgBasePath.concat('/tileToppers'),
    toppers = fs.readdirSync(topperPath),
    tiles = fs.readdirSync(tilePath);

var tIndex = tiles.indexOf('.DS_Store'),
    tpIndex = toppers.indexOf('.DS_Store');

    if( tIndex !== -1){
        tiles.splice(tIndex, 1);
    }
if(tpIndex !== -1){
    toppers.splice(tpIndex, 1);
}


global.APP_DIR = __dirname;

app.set('port', process.env.PORT || 8021);
app.set('title', 'Isometric Tile System');

app.use(express.compress());

app.use(express.static(__dirname + '/public'));
app.use(express.favicon());

app.use(express.logger('dev'));

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

 
// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    
    app.get('/', function(req, res){
        res.send(indexhtml);
    });
    app.get('/js/pixi.dev.js', function(req, res){
        res.set('Content-Type', 'application/javascript');
        res.send(pixidevjs); 
    });
    app.get('/js/pixi.js', function(req, res){
        res.set('Content-Type', 'application/javascript');
        res.send(pixijs); 
    });
    app.get('/js/jquery.js', function(req, res){
        res.set('Content-Type', 'application/javascript');
        res.send(jquery); 
    });
    app.get('/js/underscore.js', function(req, res){
        res.set('Content-Type', 'application/javascript');
        res.send(underscorejs); 
    });
    app.get('/js/async.js', function(req, res){
        res.set('Content-Type', 'application/javascript');
        res.send(asyncjs); 
    });
    app.get('/js/all.js', function(req, res){
        res.set('Content-Type', 'application/javascript');
        //var FinalJS = "";
        //FinalJS.concat(asyncjs, underscorejs, pixidevjs);
        res.send(alljs);
    });
    app.get('/whatsalljs', function(req, res){
        var obj = {};
        obj.all = alljs;
        res.json(obj);
        
    });
    
    app.get('/tileNames', function(req, res){
        var obj = {};
        obj.basePath = '/imgs/tiles/';
        obj.files = tiles;
        res.json(obj);
    });
    app.get('/topperNames', function(req, res){
        var obj = {};
        obj.basePath = '/imgs/tiletoppers/';
        obj.files = toppers;
        res.json(obj);
    });
})
