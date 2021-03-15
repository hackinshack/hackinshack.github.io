let standard_page;
let sections = 1;
let function_list = [draw1];
let aside_text = ['Projects'];

function setup() {
    standard_page = new Standard_Page(sections,function_list);
    standard_page.add_asides_text(aside_text);

    // add background canvas if desired:
    var body = document.body;
    var canv_height = max(body.clientHeight,windowHeight);
    var canv = createCanvas(windowWidth,canv_height);
    canv.position(0, 0);
    canv.style('opacity', 0.8);
    canv.style('z-index', '-1');

    create_section1();
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

function create_section1() {
    standard_page.articles[0].style('background-color',Globals.get_purple());
    standard_page.articles[0].style('min-height: 400px');
    standard_page.articles[0].style('align-content: center');

    let p1=createP("<h1>Coming Soon:");
    p1.parent(standard_page.articles[0]);

    let p2=createP("A virtual avalanche of new projects.\r\n");
    p2.parent(standard_page.articles[0]);
    p2.style('color: white');
    p2.style('font-size: 20px');

}

function draw1(sketch) {

}

