function desktop(fresh_load = true) {

    var p = looper_page.sketch;

    if (fresh_load == true) {
        looper_page.clear_links();
        looper_page.add_link('https://p5js.org/reference/#/p5/createA', 'new table-top link', .2, .2, p);
    }

    p.clear();
    p.background(200, 100, 130, 20);
    p.textAlign(CENTER, CENTER);
    p.fill(255);
    p.textSize(30);
    p.text("desktop curling project", p.width / 2, p.height / 2);

}