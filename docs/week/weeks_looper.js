let looper_page;

var aside_text = "This Week ...";
var function_list = ["opening","w1_21_02"];
var link_labels = ["list of weekly projects","Feb Week 1 2021"];

function setup() {
    looper_page = new Looper_Page(function_list,link_labels);
    looper_page.add_aside_text(aside_text);

    // add background canvas if desired:
    var body = document.body;
    var canv_height = max(body.clientHeight,windowHeight);
    var canv = createCanvas(windowWidth,canv_height);
    canv.position(0, 0);
    canv.style('opacity', 0.8);
    canv.style('z-index', '-1');
}

function draw() {

    clear();
    background(0);
    fill(255,200,200,150);
    ellipse(mouseX, mouseY, 200, 200);

    looper_page.update();
}

function windowResized() {
    looper_page.resize();

    // to refit background sketch:
    var body = document.body;
    var canv_height = max(body.clientHeight,windowHeight);
    resizeCanvas(windowWidth,canv_height);
}

function mousePressed() {
    looper_page.mseClicked();
}

function opening(fresh_load=true) {
    var p = looper_page.sketch;

    if (fresh_load==true) {
        looper_page.clear_links();
    }

    p.clear();
    p.background(100,240,130,200);
    looper_page.show_links_list();
}