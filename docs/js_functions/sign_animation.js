// Small self-contained "building the sign" widget for the CurlingOne homepage.
// Global-mode p5 sketch, reusing the animation classes from animation_classes.js.
// Plays once on load, then settles on the finished, fully-lit sign.

let sign_box_size = 320; // overwritten in setup() to match the widget's real display size
let sign_fresh_load = true;

let sign_pulley_left, sign_pulley_right;
let sign_fork_lift, sign_fork_lift2;
let sign_wire, sign_e_switch;
let sign_hackin_img, sign_shack_img, sign_walls_img, sign_roof_img;
let sign_hackin_img_, sign_shack_img_, sign_walls_img_, sign_roof_img_;
let sign_bg_color;
let sign_words_lit = false;

function preload() {
    sign_hackin_img_ = loadImage('/docs/images/hackin.png');
    sign_shack_img_ = loadImage('/docs/images/shack.png');
    sign_roof_img_ = loadImage('/docs/images/roof.png');
    sign_walls_img_ = loadImage('/docs/images/walls.png');
}

function setup() {
    // Render at the widget's actual on-screen size (not a larger size that
    // CSS then shrinks) — downscaling this much fine overlapping translucent
    // line art in the browser blurs/merges strokes together into a smear.
    let container = document.getElementById('sign-widget');
    if (container && container.offsetWidth > 0) sign_box_size = container.offsetWidth;

    let canv = createCanvas(sign_box_size, sign_box_size);
    canv.parent('sign-widget');
    canv.style('display', 'block');

    // Opaque per-frame fill so old frames are fully erased (clear() left
    // transforms from the previous frame showing through and smeared).
    // Black on purpose — makes the sign colors pop.
    sign_bg_color = color(0);
}

function draw() {
    if (sign_fresh_load) {
        angleMode(DEGREES);
        imageMode(CENTER);
        rectMode(CENTER);

        create_sign_images();
        create_sign_pulleys();
        create_sign_forklifts();
        create_sign_wire();

        sign_fresh_load = false;
    }

    background(sign_bg_color);

    let a = random(0.5, 3.0);
    let b = random(0.5, 5.0);

    if (sign_pulley_left.has_arrived && sign_pulley_right.has_arrived) {
        sign_roof_img.has_arrived = true;
        sign_pulley_left.fade(3);
        sign_pulley_right.fade(3);
    }

    sign_pulley_left.turn_handle(a);
    sign_pulley_right.turn_handle(-b);

    sign_pulley_left.show(window);
    sign_pulley_right.show(window);

    let dx_fork2 = -2;
    if (sign_fork_lift2.has_arrived) {
        dx_fork2 = -dx_fork2;
        sign_shack_img.has_arrived = true;
        sign_fork_lift2.fade(2);
    }
    let fx2 = sign_fork_lift2.move(dx_fork2);
    let fy2 = sign_fork_lift2.move_fork(0);

    let dx_fork = 2;
    let dx_lift = 0;
    if (sign_fork_lift.has_arrived) {
        dx_fork = 0;
        dx_lift = 2.0;
    }

    if (sign_fork_lift.has_arrived && sign_fork_lift.full_extension) {
        dx_fork = -2;
        dx_lift = -dx_lift;
        sign_hackin_img.has_arrived = true;
        sign_fork_lift.fade(2);

        sign_wire.advance(frameCount);
        sign_wire.show(window);
        sign_e_switch.show(window);
        if (sign_wire.is_complete) {
            sign_e_switch.close();
        }
        if (sign_e_switch.state == 1) {
            sign_wire.fade(2);
            sign_e_switch.fade(2);
            sign_words_lit = true;
        }
    }

    let fx = sign_fork_lift.move(dx_fork);
    let fy = sign_fork_lift.move_fork(dx_lift);

    sign_fork_lift.show(window);
    sign_fork_lift2.show(window);

    let re1 = sign_pulley_left.get_rope_end();
    let re2 = sign_pulley_right.get_rope_end();
    let offset = 0.14 * sign_box_size;

    let dist_pulleys = sign_pulley_right.x - sign_pulley_left.x;
    sign_roof_img.position(sign_box_size / 2, offset + (re1.y + re2.y) / 2);
    sign_roof_img.set_theta(atan((re2.y - re1.y) / dist_pulleys));

    sign_hackin_img.position(fx + 0.26 * sign_box_size, fy - 0.08 * sign_box_size);
    sign_shack_img.position(fx2 - 0.23 * sign_box_size, fy2 - 0.07 * sign_box_size);

    tint(255, sign_words_lit ? 255 : 100);
    sign_roof_img.show(window);
    sign_walls_img.show(window);
    sign_hackin_img.show(window);
    sign_shack_img.show(window);
}

function create_sign_images() {
    sign_hackin_img = new MyImage(sign_box_size, sign_hackin_img_, 0.37, 0.8);
    sign_shack_img = new MyImage(sign_box_size, sign_shack_img_, 0.67, 0.8);
    sign_roof_img = new MyImage(sign_box_size, sign_roof_img_, 0.5, 0.4);
    sign_walls_img = new MyImage(sign_box_size, sign_walls_img_, 0.5, 0.59);

    sign_hackin_img.resize(0.32 * sign_box_size, 0);
    sign_shack_img.resize(0.27 * sign_box_size, 0);
    sign_roof_img.resize(1.2 * sign_box_size, 0);
    sign_walls_img.resize(1.2 * sign_box_size, 0);
}

function create_sign_pulleys() {
    sign_pulley_left = new Pulley(sign_box_size, 0.1, 0.25, 0.1, 0, 1);
    sign_pulley_right = new Pulley(sign_box_size, 0.1, 0.75, 0.1, 0, -1);

    sign_pulley_left.set_rope_angle(0);
    sign_pulley_left.set_handle_angle(-120);
    sign_pulley_left.set_rope_length(0.15);
    sign_pulley_left.set_rope_total(0.35);

    sign_pulley_right.set_rope_angle(180);
    sign_pulley_right.set_handle_angle(100);
    sign_pulley_right.set_rope_length(0.15);
    sign_pulley_right.set_rope_total(0.35);

    // Pulley's constructor defaults to alpha 150 — full opacity while visible.
    sign_pulley_left.set_alpha(255);
    sign_pulley_right.set_alpha(255);
}

function create_sign_forklifts() {
    sign_fork_lift = new Fork_Lift(sign_box_size, 0.3, -0.2, 0.97, 1);
    sign_fork_lift.set_x_max(0.12);
    sign_fork_lift.set_fork_limit(0.88);

    sign_fork_lift2 = new Fork_Lift(sign_box_size, 0.3, 1.2, 0.77, -1);
    sign_fork_lift2.set_x_min(0.9);

    // Fork_Lift's constructor defaults to alpha 150 — full opacity while visible.
    sign_fork_lift.set_alpha(255);
    sign_fork_lift2.set_alpha(255);
}

function create_sign_wire() {
    sign_wire = new Animated_Rope(sign_box_size);
    sign_wire.delta_count = 1;
    let instruct = [];
    instruct[0] = { type: 'segment', p1: new p5.Vector(.9, .7), p2: new p5.Vector(.2, .7), nsteps: 20, direction: 1, points: [] };
    instruct[1] = { type: 'segment', p1: new p5.Vector(.2, .7), p2: new p5.Vector(.2, .6), nsteps: 5, direction: 1, points: [] };
    instruct[2] = { type: 'segment', p1: new p5.Vector(.2, .6), p2: new p5.Vector(.5, .6), nsteps: 20, direction: 1, points: [] };
    instruct[3] = { type: 'segment', p1: new p5.Vector(.5, .6), p2: new p5.Vector(.5, .3), nsteps: 20, direction: 1, points: [] };
    instruct[4] = { type: 'segment', p1: new p5.Vector(.5, .3), p2: new p5.Vector(.6, .3), nsteps: 10, direction: 1, points: [] };
    instruct[5] = { type: 'segment', p1: new p5.Vector(.6, .3), p2: new p5.Vector(.6, .6), nsteps: 20, direction: 1, points: [] };
    instruct[6] = { type: 'segment', p1: new p5.Vector(.6, .6), p2: new p5.Vector(.9, .6), nsteps: 20, direction: 1, points: [] };

    for (let i = 0; i < instruct.length; i++) sign_wire.add_instruction(instruct[i]);

    let p1 = createVector(0.9, 0.7);
    let p2 = createVector(0.9, 0.6);
    sign_e_switch = new Electrical_Switch(sign_box_size, p1, p2, 30);
}
