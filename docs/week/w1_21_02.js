function w1_21_02(fresh_load=true) {

    var p = looper_page.sketch;

    if (fresh_load==true) {
        looper_page.clear_links();
    }
    
    p.clear();
    p.background(200,100,130,20);
    p.ellipse(p.mouseX,p.mouseY,50,50);
    p.textAlign(CENTER,CENTER);
    p.fill(255);
    p.textSize(30);
    p.text("our first week project",p.width/2,p.height/2);

}