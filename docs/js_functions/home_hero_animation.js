// Hero visual for the Hackin' Shack homepage: opens on a to-scale curling
// house (plain SVG, markup lives in index.html), then crossfades to the
// finished "sign" image, shown statically. The sign itself reuses the same
// object model as the original build-up animation (and sign_animation.js's
// small corner widget) — the pulleys/forklifts/wire all freeze themselves in
// place once "arrived" (see MyImage/Pulley/Fork_Lift in animation_classes.js),
// so fast-forwarding the same update loop many times before ever drawing
// converges on the exact same resting frame the animation used to end on,
// then we draw that one frame and stop — no moving parts, no canvas loop.

const HERO_HOUSE_HOLD_MS = 400; // how long the house stays on screen before it starts fading out
const HERO_LOGO_DELAY_MS = 1500; // gap after the house starts fading before the logo starts fading in
const HERO_LOGO_FADE_MS = 4000; // must match the canvas opacity transition set below

let hero_box_size = 480; // overwritten in setup() to match the widget's real display size

let hero_pulley_left, hero_pulley_right;
let hero_fork_lift, hero_fork_lift2;
let hero_wire, hero_e_switch;
let hero_hackin_img, hero_shack_img, hero_walls_img, hero_roof_img;
let hero_hackin_img_, hero_shack_img_, hero_walls_img_, hero_roof_img_;
let hero_words_lit = false;

const HERO_SETTLE_STEPS = 2000; // far more than enough for every part to reach "arrived"

function preload() {
    hero_hackin_img_ = loadImage('/docs/images/hackin.png');
    hero_shack_img_ = loadImage('/docs/images/shack.png');
    hero_roof_img_ = loadImage('/docs/images/roof.png');
    hero_walls_img_ = loadImage('/docs/images/walls.png');
}

function setup() {
    let container = document.getElementById('hero-animation');
    if (container && container.offsetWidth > 0) hero_box_size = container.offsetWidth;

    let canv = createCanvas(hero_box_size, hero_box_size);
    canv.parent('hero-animation');
    canv.style('display', 'block');
    canv.style('opacity', '0');
    canv.style('transition', 'opacity ' + (HERO_LOGO_FADE_MS / 1000) + 's ease');

    angleMode(DEGREES);
    imageMode(CENTER);
    rectMode(CENTER);

    create_hero_images();
    create_hero_pulleys();
    create_hero_forklifts();
    create_hero_wire();

    for (let i = 0; i < HERO_SETTLE_STEPS; i++) advance_hero_state();

    background(0);
    tint(255, 255);
    hero_roof_img.show(window);
    hero_walls_img.show(window);
    hero_hackin_img.show(window);
    hero_shack_img.show(window);

    noLoop();

    setTimeout(function () {
        let house = document.getElementById('hero-house');
        if (house) house.style.opacity = '0';
    }, HERO_HOUSE_HOLD_MS);

    setTimeout(function () {
        canv.style('opacity', '1');
    }, HERO_HOUSE_HOLD_MS + HERO_LOGO_DELAY_MS);
}

function advance_hero_state() {
    let a = random(0.5, 3.0);
    let b = random(0.5, 5.0);

    if (hero_pulley_left.has_arrived && hero_pulley_right.has_arrived) {
        hero_roof_img.has_arrived = true;
    }

    hero_pulley_left.turn_handle(a);
    hero_pulley_right.turn_handle(-b);

    let dx_fork2 = -2;
    if (hero_fork_lift2.has_arrived) {
        dx_fork2 = -dx_fork2;
        hero_shack_img.has_arrived = true;
    }
    let fx2 = hero_fork_lift2.move(dx_fork2);
    let fy2 = hero_fork_lift2.move_fork(0);

    let dx_fork = 2;
    let dx_lift = 0;
    if (hero_fork_lift.has_arrived) {
        dx_fork = 0;
        dx_lift = 2.0;
    }

    if (hero_fork_lift.has_arrived && hero_fork_lift.full_extension) {
        dx_fork = -2;
        dx_lift = -dx_lift;
        hero_hackin_img.has_arrived = true;

        hero_wire.advance(frameCount);
        if (hero_wire.is_complete) {
            hero_e_switch.close();
        }
        if (hero_e_switch.state == 1) {
            hero_words_lit = true;
        }
    }

    let fx = hero_fork_lift.move(dx_fork);
    let fy = hero_fork_lift.move_fork(dx_lift);

    let re1 = hero_pulley_left.get_rope_end();
    let re2 = hero_pulley_right.get_rope_end();
    let offset = 0.14 * hero_box_size;

    let dist_pulleys = hero_pulley_right.x - hero_pulley_left.x;
    hero_roof_img.position(hero_box_size / 2, offset + (re1.y + re2.y) / 2);
    hero_roof_img.set_theta(atan((re2.y - re1.y) / dist_pulleys));

    hero_hackin_img.position(fx + 0.26 * hero_box_size, fy - 0.08 * hero_box_size);
    hero_shack_img.position(fx2 - 0.23 * hero_box_size, fy2 - 0.07 * hero_box_size);
}

function create_hero_images() {
    hero_hackin_img = new MyImage(hero_box_size, hero_hackin_img_, 0.37, 0.8);
    hero_shack_img = new MyImage(hero_box_size, hero_shack_img_, 0.67, 0.8);
    hero_roof_img = new MyImage(hero_box_size, hero_roof_img_, 0.5, 0.4);
    hero_walls_img = new MyImage(hero_box_size, hero_walls_img_, 0.5, 0.59);

    hero_hackin_img.resize(0.32 * hero_box_size, 0);
    hero_shack_img.resize(0.27 * hero_box_size, 0);
    hero_roof_img.resize(1.2 * hero_box_size, 0);
    hero_walls_img.resize(1.2 * hero_box_size, 0);
}

function create_hero_pulleys() {
    hero_pulley_left = new Pulley(hero_box_size, 0.1, 0.25, 0.1, 0, 1);
    hero_pulley_right = new Pulley(hero_box_size, 0.1, 0.75, 0.1, 0, -1);

    hero_pulley_left.set_rope_angle(0);
    hero_pulley_left.set_handle_angle(-120);
    hero_pulley_left.set_rope_length(0.15);
    hero_pulley_left.set_rope_total(0.35);

    hero_pulley_right.set_rope_angle(180);
    hero_pulley_right.set_handle_angle(100);
    hero_pulley_right.set_rope_length(0.15);
    hero_pulley_right.set_rope_total(0.35);
}

function create_hero_forklifts() {
    hero_fork_lift = new Fork_Lift(hero_box_size, 0.3, -0.2, 0.97, 1);
    hero_fork_lift.set_x_max(0.12);
    hero_fork_lift.set_fork_limit(0.88);

    hero_fork_lift2 = new Fork_Lift(hero_box_size, 0.3, 1.2, 0.77, -1);
    hero_fork_lift2.set_x_min(0.9);
}

function create_hero_wire() {
    hero_wire = new Animated_Rope(hero_box_size);
    hero_wire.delta_count = 1;
    let instruct = [];
    instruct[0] = { type: 'segment', p1: new p5.Vector(.9, .7), p2: new p5.Vector(.2, .7), nsteps: 20, direction: 1, points: [] };
    instruct[1] = { type: 'segment', p1: new p5.Vector(.2, .7), p2: new p5.Vector(.2, .6), nsteps: 5, direction: 1, points: [] };
    instruct[2] = { type: 'segment', p1: new p5.Vector(.2, .6), p2: new p5.Vector(.5, .6), nsteps: 20, direction: 1, points: [] };
    instruct[3] = { type: 'segment', p1: new p5.Vector(.5, .6), p2: new p5.Vector(.5, .3), nsteps: 20, direction: 1, points: [] };
    instruct[4] = { type: 'segment', p1: new p5.Vector(.5, .3), p2: new p5.Vector(.6, .3), nsteps: 10, direction: 1, points: [] };
    instruct[5] = { type: 'segment', p1: new p5.Vector(.6, .3), p2: new p5.Vector(.6, .6), nsteps: 20, direction: 1, points: [] };
    instruct[6] = { type: 'segment', p1: new p5.Vector(.6, .6), p2: new p5.Vector(.9, .6), nsteps: 20, direction: 1, points: [] };

    for (let i = 0; i < instruct.length; i++) hero_wire.add_instruction(instruct[i]);

    let p1 = createVector(0.9, 0.7);
    let p2 = createVector(0.9, 0.6);
    hero_e_switch = new Electrical_Switch(hero_box_size, p1, p2, 30);
}
