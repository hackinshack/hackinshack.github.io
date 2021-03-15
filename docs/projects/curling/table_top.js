function table_top(fresh_load = true) {
    var p = looper_page.sketch;

    if (fresh_load == true) {
        looper_page.clear_links();
        looper_page.add_link('', 'new table-top link', .10, .90, p);
    }

    p.clear();
    p.background(200, 100, 130, 20);
    p.textAlign(CENTER, CENTER);
    p.fill(255);
    p.textSize(30);
    p.text("table top curling project", p.width / 2, p.height / 2);
}