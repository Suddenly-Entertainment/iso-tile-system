/*global PIXI:false, SEI:true, WC:true, _:false, $:false, async:false,
    console:false, confirm:false, document:false, requestAnimationFrame:false, setInterval:false
*/
var viewportSize = new PIXI.Point(1280, 480),
    renderer = new PIXI.WebGLRenderer(viewportSize.x, viewportSize.y),
    frameCounter = $("#frameRate"),
    quality = 1,
    stage = new PIXI.Stage(0xFFFFFF, true),
    chunkSize = new PIXI.Point(4, 4),
    WC,
    DeltaMove = new PIXI.Point(0, 0),
    frameCount = 0;

if (!confirm("Use Normal Quality Textures?")) {
    if (confirm("Use High Quality Textures?  If no, then low quality.")) {
        quality = 2;
    } else {
        quality = 0;
    }
}

document.body.appendChild(renderer.view);

$(document).keydown(function (e) {
    'use strict';
    e.preventDefault();
    var key = e.keyCode;
    
    switch (key) {
    case 65:
    case 37: //Key left
        DeltaMove.x = 10;
        break;
    case 87:
    case 38: //Key Up
        DeltaMove.y = 10;
        break;
    case 68:
    case 39: //Key right
        DeltaMove.x = -10;
        break;
    case 83:
    case 40: //Key down
        DeltaMove.y = -10;
        break;
    }
    
});
$(document).keyup(function (e) {
    'use strict';
    e.preventDefault();
    var key = e.keyCode;
    
    switch (key) {
    case 65:
    case 37: //Key left
        DeltaMove.x = 0;
        break;
    case 87:
    case 38: //Key Up
        DeltaMove.y = 0;
        break;
    case 68:
    case 39: //Key right
        DeltaMove.x = 0;
        break;
    case 83:
    case 40: //Key down
        DeltaMove.y = 0;
        break;
    }
});

SEI.Art.init(quality, function () {
    'use strict';
    WC = new SEI.WorldContainer(stage, chunkSize);
    WC.init();

    function animate() {
        WC.position.x += DeltaMove.x;
        WC.position.y += DeltaMove.y;
        renderer.render(stage);
        requestAnimationFrame(animate);
        ++frameCount;
    }
    requestAnimationFrame(animate);
    
    setInterval(function () {
        frameCounter.text(frameCount);
        frameCount = 0;
    }, 1000);
});