let standard_page;
let sections = 3;
let function_list = [empty_draw,empty_draw,empty_draw];
let aside_text = ['Curling One','Privacy Statement',' '];
let icon_img_, icon_img;
let box_size = 400;


function preload() {
    icon_img_ = loadImage('/docs/images/iconCurlingOne.png');
}

function setup() {
    standard_page = new Standard_Page(sections,function_list);
    standard_page.add_asides_text(aside_text);

    // add background canvas if desired:
    var body = document.body;
    var canv = createCanvas(windowWidth,body.clientHeight);
    canv.position(0, 0);
    canv.style('opacity', 0.8);
    canv.style('z-index', '-1');

    create_images();
    create_section1();
    create_section2();
    create_section3();
}

function draw() {

}

function windowResized() {
    standard_page.resize();

    // to refit background sketch:
    var body = document.body;
    var canv_height = max(body.clientHeight,windowHeight);
    resizeCanvas(windowWidth,canv_height);

}

function create_images() {
    icon_img = new MyImage(box_size, icon_img_, 0.2, 0.15);
    icon_img.resize(1.0 * box_size, 0);
}

// add the draw functions associated with each article: 

function create_section1() {
    standard_page.articles[0].style('background-color',Globals.get_blue());
    standard_page.articles[0].style('min-height: 20px');

    let p1=createP("Curling One is a 3D virtual reality game created\
    for the Oculus Quest and Quest 2.  Experience the sport of curling, from delivery and \
    sweeping, to detailed strategic planning and execution, in a fascinating 3D world.\r\n");
    p1.parent(standard_page.articles[0]);
}

function create_section2() {
    standard_page.articles[1].style('background-color',Globals.get_green());
    standard_page.articles[1].style('min-height: 20px');

    let p1=createP("This app does not collect, use, or share information about users \
    in any way.\r\n");
    p1.parent(standard_page.articles[1]);

}

function create_section3() {
    var p = standard_page.sketch[2];
    icon_img.show(p);
}



function empty_draw() {

}


