let standard_page;
let sections = 1;
let function_list = [draw1];
let aside_text = ['Welcome!'];
let fresh_load = true;

let pulley_left, pulley_right;
let fork_lift, fork_lift2;
let wire;
let hackin_img, shack_img, walls_img, roof_img;
let hackin_img_, shack_img_, walls_img_, roof_img_;
let e_switch;

let box_size = 450; // this should be scaled to sketch size, as below in draw1 function
fresh_load = true;

function preload() {
    hackin_img_ = loadImage('/docs/images/hackin.png');
    shack_img_ = loadImage('/docs/images/shack.png');
    roof_img_ = loadImage('/docs/images/roof.png');
    walls_img_ = loadImage('/docs/images/walls.png');
}

function setup() {
    standard_page = new Standard_Page(sections, function_list);
    standard_page.add_asides_text(aside_text);

    // add background canvas if desired:
    var body = document.body;
    var canv_height = max(body.clientHeight, windowHeight);
    var canv = createCanvas(windowWidth, canv_height);
    canv.position(0, 0);
    canv.style('opacity', 0.8);
    canv.style('z-index', '-1');
}

function draw() {
}

function windowResized() {
    standard_page.resize();

    // to refit background sketch:
    var body = document.body;
    var canv_height = max(body.clientHeight, windowHeight);
    resizeCanvas(windowWidth, canv_height);

    fresh_load = true;
}


// add the draw functions associated with each article: 

function draw1() {
    var p = standard_page.sketch[0];
    if (fresh_load) {

        // box_size = p.width;
        box_size = min(p.width,p.height);

        p.angleMode(DEGREES);
        p.imageMode(CENTER);
        p.rectMode(CENTER);

        angleMode(DEGREES);
        imageMode(CENTER);
        rectMode(CENTER);

        create_images();
        create_pulleys();
        create_forklifts();
        create_wire();

        p.tint(255, 100);
        fresh_load = false;
        // setAlpha(50);
    }

    p.background(0);
    let a = random(0.5, 3.0);
    let b = random(0.5, 5.0);

    if (pulley_left.has_arrived && pulley_right.has_arrived) {
        roof_img.has_arrived = true;
        pulley_left.fade(3);
        pulley_right.fade(3);
    }

    pulley_left.turn_handle(a);
    pulley_right.turn_handle(-b);

    pulley_left.show(p);
    pulley_right.show(p);

    let dx_fork2 = -2;
    if (fork_lift2.has_arrived) {
        dx_fork2 = -dx_fork2;
        shack_img.has_arrived = true;
        fork_lift2.fade(2);
    }
    let fx2 = fork_lift2.move(dx_fork2);
    let fy2 = fork_lift2.move_fork(0);

    let dx_fork = 2;
    let dx_lift = 0;
    if (fork_lift.has_arrived) {
        dx_fork = 0;
        dx_lift = 2.0;
    }

    if (fork_lift.has_arrived && fork_lift.full_extension) {
        dx_fork = -2;
        dx_lift = -dx_lift;
        hackin_img.has_arrived = true;
        fork_lift.fade(2);

        wire.advance(frameCount);
        wire.show(p);
        e_switch.show(p);
        if (wire.is_complete) {
            e_switch.close();

        }
        if (e_switch.state == 1) {
            wire.fade(2);
            e_switch.fade(2);
            p.tint(255, 255);
        }
    }

    let fx = fork_lift.move(dx_fork);
    let fy = fork_lift.move_fork(dx_lift);

    fork_lift.show(p);
    fork_lift2.show(p);

    let re1 = pulley_left.get_rope_end();
    let re2 = pulley_right.get_rope_end();
    let offset = 0.14*box_size;

    let dist_pulleys = pulley_right.x - pulley_left.x
    roof_img.position(box_size / 2, offset + (re1.y + re2.y) / 2);
    roof_img.set_theta(atan((re2.y - re1.y) / dist_pulleys));

    hackin_img.position(fx + 0.26*box_size,fy - 0.08*box_size);
    shack_img.position(fx2 - 0.23*box_size,fy2 - 0.07*box_size);

    hackin_img.show(p);
    shack_img.show(p);

    roof_img.show(p);
    walls_img.show(p);
}

function create_images() {
    hackin_img = new MyImage(box_size, hackin_img_, 0.37, 0.8);
    shack_img = new MyImage(box_size, shack_img_, 0.67, 0.8);
    roof_img = new MyImage(box_size, roof_img_, 0.5, 0.4);
    walls_img = new MyImage(box_size, walls_img_, 0.5, 0.59);

    hackin_img.resize(0.32 * box_size, 0);
    shack_img.resize(0.27 * box_size, 0);
    roof_img.resize(1.2 * box_size, 0);
    walls_img.resize(1.2 * box_size, 0);
}

function create_pulleys() {
    pulley_left = new Pulley(box_size, 0.1, 0.25, 0.1, 0, 1);
    pulley_right = new Pulley(box_size, 0.1, 0.75, 0.1, 0, -1);

    pulley_left.set_rope_angle(0);
    pulley_left.set_handle_angle(-120);
    pulley_left.set_rope_length(0.15);
    pulley_left.set_rope_total(0.35);

    pulley_right.set_rope_angle(180);
    pulley_right.set_handle_angle(100);
    pulley_right.set_rope_length(0.15);
    pulley_right.set_rope_total(0.35);
}

function create_forklifts() {
    fork_lift = new Fork_Lift(box_size, 0.3, -0.2, 0.97, 1);
    fork_lift.set_x_max(0.12);
    fork_lift.set_fork_limit(0.88);

    fork_lift2 = new Fork_Lift(box_size, 0.3, 1.2, 0.77, -1);
    fork_lift2.set_x_min(0.9);
    // fork_lift2.set_fork_limit(0.9);
}

function create_wire() {
    wire = new Animated_Rope(box_size);
    wire.delta_count = 1;
    let instruct = [];
    instruct[0] = {
        type: 'segment',
        p1: new p5.Vector(.9, .7),
        p2: new p5.Vector(.2, .7),
        nsteps: 20,
        direction: 1,
        points: []
    };
    instruct[1] = {
        type: 'segment',
        p1: new p5.Vector(.2, .7),
        p2: new p5.Vector(.2, .6),
        nsteps: 5,
        direction: 1,
        points: []
    };
    instruct[2] = {
        type: 'segment',
        p1: new p5.Vector(.2, .6),
        p2: new p5.Vector(.5, .6),
        nsteps: 20,
        direction: 1,
        points: []
    };
    instruct[3] = {
        type: 'segment',
        p1: new p5.Vector(.5, .6),
        p2: new p5.Vector(.5, .3),
        nsteps: 20,
        direction: 1,
        points: []
    };
    instruct[4] = {
        type: 'segment',
        p1: new p5.Vector(.5, .3),
        p2: new p5.Vector(.6, .3),
        nsteps: 10,
        direction: 1,
        points: []
    };
    instruct[5] = {
        type: 'segment',
        p1: new p5.Vector(.6, .3),
        p2: new p5.Vector(.6, .6),
        nsteps: 20,
        direction: 1,
        points: []
    };
    instruct[6] = {
        type: 'segment',
        p1: new p5.Vector(.6, .6),
        p2: new p5.Vector(.9, .6),
        nsteps: 20,
        direction: 1,
        points: []
    };

    for (let i = 0; i < instruct.length; i++) wire.add_instruction(instruct[i]);

    let p1 = createVector(0.9, 0.7);
    let p2 = createVector(0.9, 0.6);
    e_switch = new Electrical_Switch(box_size, p1, p2, 30);
}
