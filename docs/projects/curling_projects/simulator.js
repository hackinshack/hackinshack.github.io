function simulator(fresh_load = true) {

    var p = looper_page.sketch;

    if (fresh_load == true) {
        looper_page.clear_links();
        looper_page.add_link('https://p5js.org/reference/#/p5/createA', 'new table-top link', 0.5, 0.9, p);
    }

    p.clear();
    p.background(200, 100, 130, 20);
    p.ellipse(p.mouseX, p.mouseY, 50, 50);
    p.textAlign(CENTER, CENTER);
    p.fill(255);
    p.textSize(30);
    p.text("simulator project", p.width / 2, p.height / 2);

}