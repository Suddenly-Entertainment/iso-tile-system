var renderer = new PIXI.WebGLRenderer(1280, 480);
var quality = 1;

if(!confirm("Use Normal Quality Textures?")){
    if(confirm("Use High Quality Textures?  If no, then low quality.")){
        quality = 2;
    }else{
        quality = 0;   
    }
}

document.body.appendChild(renderer.view);

var stage = new PIXI.Stage(0xFFFFFF, true),
    chunkSize = new PIXI.Point(5, 5),
    //chunkAmount = new PIXI.Point(
    WC;// = new WorldContainer(stage, chunkSize);

var DeltaMove = new PIXI.Point(0, 0);
var frameCount = 0;
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

art.init(quality, function(){
    WC = new WorldContainer(stage, chunkSize);
    WC.init();
    
    
    requestAnimationFrame(animate);


    setInterval(function(){
        console.info(frameCount);
        frameCount = 0;
    }, 1000);

    function animate() {
        //console.time('hello');

        WC.position.x += DeltaMove.x;
        WC.position.y += DeltaMove.y;
        renderer.render(stage);
        requestAnimationFrame(animate);
        ++frameCount;

        //console.timeEnd('hello');
    }
});