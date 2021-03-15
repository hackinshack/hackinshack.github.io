let standard_page;
let sections = 4;
let function_list = [empty_draw,empty_draw,empty_draw,empty_draw];
let aside_text = ['About','Mission','Board','Contact'];
let gear_img_, gear_img;
let box_size = 450;

function setup() {
    standard_page = new Standard_Page(sections,function_list);
    standard_page.add_asides_text(aside_text);

    // add background canvas if desired:
    var body = document.body;
    var canv = createCanvas(windowWidth,body.clientHeight);
    canv.position(0, 0);
    canv.style('opacity', 0.8);
    canv.style('z-index', '-1');

    gear_img = new MyImage(box_size, gear_img_, 0.2, 0.2);
    gear_img.resize(0.8 * box_size, 0);

    create_section1();
    create_section2();
    create_section3();
    create_section4();
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

// add the draw functions associated with each article: 

function create_section1() {
    standard_page.articles[0].style('background-color',Globals.get_green());
    standard_page.articles[0].style('min-height: 20px');

    let p1=createP("Hackin' Shack is a nonprofit 501(c)(3) organization, dedicated to creative expression \
    through science and technology.\r\n");
    p1.parent(standard_page.articles[0]);

    p2=createP("We're into coding, robotics, 3D printing, microcomputers, electronics, and a whole bunch \
    of other things.  We like to make stuff.\r\n");
    p2.parent(standard_page.articles[0]);

    p3=createP("Our goal is to encourage people of all ages and backgrounds to innovate and create \
    using science and technology-based equipment and techniques.");
    p3.parent(standard_page.articles[0]);
}

function create_section2() {
    standard_page.articles[1].style('background-color',Globals.get_blue());
    standard_page.articles[1].style('min-height: 20px');

    let p1=createP("The mission of Hackin' Shack is to promote, encourage, and support educational opportunities in \
    science and technology.\r\n");
    p1.parent(standard_page.articles[1]);

}

function create_section3() {
    standard_page.articles[2].style('background-color',Globals.get_orange());
    standard_page.articles[2].style('min-height: 20px');

    let p1=createP("Christopher Begley, President\r\n");
    p1.parent(standard_page.articles[2]);

    let p2=createP("Sean McLaughlin, Treasurer\r\n");
    p2.parent(standard_page.articles[2])

    let p3=createP("Charles Daniels, Clerk\r\n");
    p3.parent(standard_page.articles[2])
}

function create_section4() {
    standard_page.articles[3].style('background-color',Globals.get_purple());
    standard_page.articles[3].style('min-height: 20px');

    let p1=createP("chris@hackinshack.org\r\n");
    p1.parent(standard_page.articles[3]);
}

function empty_draw() {

}


