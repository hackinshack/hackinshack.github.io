class Standard_Page extends Proto_Page {

    constructor(n_sections, draw_functions) {
        super(n_sections, draw_functions);

        this.main_menu = new Main_Menu();
        this.header_image = this.add_header_image('/docs/images/logo_side_4.png');
        this.add_footer_text('Let&#39s make something.');

        this.sketch = [];
        for (var i=0; i<n_sections; i++) this.sketch[i]=this.psketch[i].sketch;
    }

}