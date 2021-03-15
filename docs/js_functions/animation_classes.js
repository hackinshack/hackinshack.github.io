class MyImage {
    constructor(box_size_,image_,px_,py_) {
        this.box_size = box_size_;
        this.img = image_;
        this.x = box_size_*px_;
        this.y = box_size_*py_;
        this.theta = 0;
        this.has_arrived = false;
    }

    move(dx,dy) {
        if (this.has_arrived) return;
        this.x += dx;
        this.y += dy;
    }

    position(x,y) {
        if (this.has_arrived) return;
        this.x=x;
        this.y=y;
    }

    rel_position(x,y) {
        this.x=x*this.box_size;
        this.y=y*this.box_size;
    }

    rotate(dt) {
        if (this.has_arrived) return;
        this.theta += dt;
    }

    set_theta(t) {
        if (this.has_arrived) return;
        this.theta = t;
    }

    rel_resize(px,py) {
        this.img.resize(px*this.box_size,py*this.box_size);
    }

    resize(px,py) {
        this.img.resize(px,py);
    }

    show(sketch) {
        sketch.push();
        sketch.translate(this.x,this.y);
        sketch.rotate(this.theta);
        sketch.image(this.img,0,0);
        sketch.pop();
    }
}

class Pulley {

    constructor(box_size_, diameter_, x_, y_, theta_, winding_) {
        // winding: +1 = turn CCW to roll up; -1 = turn CW to roll up
        this.box_size = box_size_;
        this.diameter = this.box_size * diameter_;
        this.x = this.box_size * x_;
        this.y = this.box_size * y_;
        this.theta = theta_;
        this.winding = winding_;

        this.rope_thickness=this.diameter/10;
        this.rope_length=this.diameter;
        this.rope_origin=this.diameter*0.4;
        this.rope_angle=0;
        this.rope_total_length=this.diameter*5;

        this.handle_thickness=this.diameter/10;
        this.handle_diameter=this.diameter/4;
        this.handle_length=this.diameter*0.75;

        this.winding_ratio = 1.0;

        this.color_base=Globals.get_blue();
        this.color_handle=Globals.get_green();
        this.color_rope=Globals.get_orange();

        this.set_alpha(150);

        this.outline_thickness=2;
        this.show_outlines = false;
        this.has_arrived = false;
        this.fade_on=false;
        this.delta_fade=0;
        this.alpha=255;
    }

    turn_handle(delta_theta) {

        let delta_length = this.rope_origin*radians(delta_theta)*this.winding_ratio*this.winding;
        this.rope_length += delta_length;

        if (this.rope_length < 0) {
            this.rope_length=0;
            this.has_arrived = true;
            return 0;
        }

        if (this.rope_length > this.rope_total_length) {
            this.rope_length=this.rope_total_length;
            this.has_arrived = true;
            return 0;
        }

        this.theta += delta_theta;

        return delta_length;
    }

    hypotenuse(l1, l2) {
        return sqrt(l1*l1 + l2*l2);
    }

    get_rope_end() {
        let r = this.hypotenuse(this.rope_length,this.rope_origin);
        let angle1 = atan(this.rope_length/this.rope_origin);
        let angle2 = angle1 + this.winding*this.rope_angle;
        let x = this.x + r * cos(angle2);
        let y = this.y + this.winding*(r * sin(angle2));
        return new p5.Vector(x,y);
    }

    set_rope_angle(theta) {
        this.rope_angle = theta;
    }

    set_handle_angle(theta) {
        this.theta = theta;
    }

    set_rope_length(le) {
        this.rope_length = le*this.box_size;
    }

    set_rope_total(total_length) {
        this.rope_total_length = total_length * this.box_size;
    }

    set_alpha(a) {
        this.color_base.setAlpha(a);
        this.color_handle.setAlpha(a);
        this.color_rope.setAlpha(a);
    }

    show(sketch) {

        if (this.fade_on) this.reduce_opacity();

        this.draw_rope(sketch);

        sketch.fill(this.color_base);
        sketch.noStroke();
        if (this.show_outlines) sketch.stroke(255);
        sketch.strokeWeight(this.outline_thickness);
        sketch.circle(this.x,this.y,this.diameter);

        this.draw_handle(sketch);
    }

    draw_rope(sketch) {

        let x = this.rope_origin;
        let y1 = 0;
        let y2 = this.winding*this.rope_length;
        
        sketch.push();
        sketch.translate(this.x,this.y);
        sketch.rotate(this.rope_angle);
        sketch.strokeWeight(this.rope_thickness);
        sketch.stroke(this.color_rope);
        sketch.line(x,y1,x,y2);
        sketch.pop();

    }

    draw_handle(sketch) {

        let length=this.handle_length;
        let diameter=this.handle_diameter;
        let rod_radius=this.handle_thickness;

        sketch.push();

        sketch.translate(this.x,this.y);
        sketch.rotate(this.theta);
        sketch.fill(this.color_handle);

        sketch.strokeWeight(this.outline_thickness);
        sketch.noStroke();
        if (this.show_outlines) sketch.stroke(255);
    
        sketch.rect(length/2,0,length,rod_radius);
        sketch.circle(0,0,diameter);
        sketch.circle(length,0,diameter);

        sketch.pop();
    }

    fade(delta_fade_) {
        this.fade_on = true;
        this.delta_fade = delta_fade_;
        this.alpha = alpha(this.color_base);
    }

    reduce_opacity() {
        this.alpha -= this.delta_fade;
        this.color_base.setAlpha(this.alpha);
        this.color_handle.setAlpha(this.alpha);
        this.color_rope.setAlpha(this.alpha);
    }

}

class Lever {
    constructor(box_size_, length_, x_, y_, angle_) {
        this.box_size = box_size_;
        this.arm_length=box_size_*length_;
        this.x=box_size_*x_;
        this.y=box_size_*y_;
        this.theta = angle_;
        this.theta_min = -1000;
        this.theta_max = 1000;

        this.arm_width=0.05*this.arm_length;
        this.fulcrum_size=0.15*this.arm_length;
        this.fulcrum_position=0.5;

        this.color_fulcrum=color(0,255,0);
        this.color_arm=color(0,0,255);

        this.outline_thickness=2;
        this.show_outlines = false;
    }

    rotate(delta_theta) {
        if (this.theta > this.theta_min && this.theta < this.theta_max) this.theta += delta_theta;
        else return 0;
        let delta_end = tan(delta_theta)*this.arm_length/2;
        return delta_end;
    }

    set_theta(theta_) {
        this.theta = theta_;
    }

    get_end_points() {

        return {left: new p5.Vector(0,0), right: new p5.Vector(0,0)};
    }

    show(sketch) {
        this.draw_fulcrum(sketch);

        sketch.fill(this.color_arm);
        sketch.noStroke();
        if (this.show_outlines) sketch.stroke(255);
        sketch.strokeWeight(this.outline_thickness);
        sketch.push();
        sketch.translate(this.x,this.y - this.fulcrum_size);
        sketch.rotate(this.theta);
        sketch.rect(0,0,this.arm_length,this.arm_width);
        sketch.pop();
    }

    draw_fulcrum(sketch) {
        sketch.fill(this.color_fulcrum);
        sketch.noStroke();
        if (this.show_outlines) sketch.stroke(255);
        sketch.strokeWeight(this.outline_thickness);
        sketch.push();
        sketch.translate(this.x,this.y);
        let half_size = this.fulcrum_size/2;
        sketch.triangle(-half_size,0,half_size,0,0,-this.fulcrum_size);
        sketch.pop();
    }
}

class Fork_Lift {

    constructor(box_size_,size_,x_,y_,direction_) {
        this.box_size=box_size_;
        this.size=size_*box_size_;
        this.x=x_*box_size_;
        this.y=y_*box_size_;
        this.direction=direction_;

        this.wheel_diameter=this.size*0.2;
        this.base_width=this.size*0.5;
        this.base_height=this.size*0.2;
        this.fork_thickness =this.size*0.07;
        this.fork_height=this.size*0.8;
        this.fork_width=this.size*0.8;
        this.fork_level=0;

        // this.color_base=color(0,0,255,200);
        // this.color_wheels=color(0,255,0,200);
        // this.color_fork=color(255,200,100,200);

        this.color_base=Globals.get_blue();
        this.color_wheels=Globals.get_green();
        this.color_fork=Globals.get_orange();

        this.set_alpha(150);

        this.x_min=-10000;
        this.x_max=10000;

        // (coordinate system flipped for y)
        this.fork_y_max = this.y-this.fork_thickness/2;
        this.fork_y_min = this.y-this.fork_height+this.fork_thickness/2;
        this.set_fork(0.0);
        this.has_arrived = false;
        this.full_extension =false;
        this.fade_on=false;
        this.delta_fade=0;
        this.alpha=255;
    }

    move(dx) {

        this.x += dx;
        if (this.x < this.x_min) {
            this.x = this.x_min;
            this.has_arrived = true;
            return this.x;
        }
        if (this.x > this.x_max) {
            this.x = this.x_max;
            this.has_arrived = true;
            return this.x;
        }

        return this.x;        
    }

    move_fork(dy) {

        this.fork_y -= dy;

        if (this.fork_y < this.fork_y_min) {
            this.fork_y = this.fork_y_min;
            this.full_extension = true;
            return this.fork_y;
        }

        if (this.fork_y > this.fork_y_max) {
            this.fork_y = this.fork_y_max;
            this.full_extension = true;
            return this.fork_y;
        }


        return this.fork_y;
    }

    set_fork(py) {
        this.fork_y = this.fork_y_max - py*(this.fork_y_max-this.fork_y_min);
        return this.fork_y;
    }

    set_fork_limit(py) {
        this.fork_y_min = this.y - py*this.fork_height+this.fork_thickness/2;
    }

    set_x_max(px) {
        this.x_max = px*this.box_size;
    }

    set_x_min(px) {
        this.x_min = px*this.box_size;
    }

    set_alpha(a) {
        this.color_base.setAlpha(a);
        this.color_wheels.setAlpha(a);
        this.color_fork.setAlpha(a);
    }

    show(sketch) {

        if (this.fade_on) this.reduce_opacity();
        sketch.noStroke();
        
        // base:
        sketch.fill(this.color_base);
        let x_base = this.x;
        let y_base = this.y-this.wheel_diameter-this.base_height/2;
        sketch.rect(x_base,y_base,this.base_width,this.base_height);

        // wheels:
        sketch.fill(this.color_wheels);
        let x_wheel1 = x_base - this.base_width/4;
        let x_wheel2 = x_base + this.base_width/4;
        let y_wheel = this.y - this.wheel_diameter/2;
        sketch.circle(x_wheel1,y_wheel,this.wheel_diameter);
        sketch.circle(x_wheel2,y_wheel,this.wheel_diameter);

        // fork:
        sketch.fill(this.color_fork);
        let x_fork_vert = x_base + this.direction*(this.base_width/2 + this.fork_thickness/2);
        let x_fork_horiz = x_base + this.direction*(this.base_width/2 + this.fork_width/2);
        let y_fork_vert = this.y - this.fork_height/2;
        let y_fork_horiz = this.fork_y - this.fork_thickness/2;
        sketch.rect(x_fork_vert,y_fork_vert,this.fork_thickness,this.fork_height);
        sketch.rect(x_fork_horiz,y_fork_horiz,this.fork_width,this.fork_thickness);
    }

    fade(delta_fade_) {
        this.fade_on = true;
        this.delta_fade = delta_fade_;
        this.alpha = alpha(this.color_base);
    }

    reduce_opacity() {
        this.alpha -= this.delta_fade;
        this.color_base.setAlpha(this.alpha);
        this.color_wheels.setAlpha(this.alpha);
        this.color_fork.setAlpha(this.alpha);

    }
}

class Animated_Rope {
    constructor(box_size_) {
        this.box_size = box_size_;
        this.instruction_set = [{type:'null',p1:null,p2:null,nsteps:1,direction:1, points:[]}];
        this.index=0;
        this.nstep=0;
        this.delta_count=1;
        this.is_complete=false;
        this.line_thickness=3;
        this.color_line = color(100,100,100,255);
        this.points_list=[];
        this.fade_on=false;
        this.delta_fade=0;
        this.alpha = 255;
    }

    advance(count) {
        if (this.is_complete) return;
        if (this.instruction_set[this.index].type=='null') {
            this.index++;
            return;
        }

        if (count % this.delta_count == 0) {
            this.points_list.push(this.instruction_set[this.index].points[this.nstep].copy());
            
            this.nstep++;
            if (this.nstep >= this.instruction_set[this.index].points.length) {
                this.index++;
                this.nstep=0;
                if (this.index >= this.instruction_set.length) {
                    this.is_complete = true;
                    return;
                }
            }
            
        }
    }

    show(sketch) {
        if (this.fade_on) this.reduce_opacity();
        sketch.stroke(this.color_line);
        sketch.strokeWeight(this.line_thickness);
        for (let i=0; i<this.points_list.length-1; i++) {
            let p1=this.points_list[i];
            let p2=this.points_list[i+1];
            sketch.line(p1.x,p1.y,p2.x,p2.y);
        }
    }

    add_instruction(instruct) {
        if (instruct.type=='segment') this.make_segment(instruct);
        else if (instruct.type=='turn') this.make_turn(instruct);
        else console.log('bad instruction');
    }

    make_segment(instruct) {
        let instruction = instruct;
        let p1 = instruct.p1.mult(this.box_size);
        let p2 = instruct.p2.mult(this.box_size);

        let delta = 1/(instruction.nsteps+1);
        for (let i=0; i<=instruction.nsteps; i++) {
            let x = lerp(p1.x,p2.x,i*delta);
            let y = lerp(p1.y,p2.y,i*delta);
            instruction.points.push(new p5.Vector(x,y));
        }
        this.instruction_set.push(instruction);
    }

    fade(delta_fade_) {
        this.fade_on = true;
        this.delta_fade = delta_fade_;
    }

    reduce_opacity() {
        this.alpha -= this.delta_fade;
        this.color_line.setAlpha(this.alpha);
    }
}

class Electrical_Switch {
    constructor(box_size_,p1_,p2_,angle_) {
        this.box_size = box_size_;
        this.p1 = p1_.copy().mult(box_size_);
        this.p2 = p2_.copy().mult(box_size_);
        this.open_angle = angle_;
        this.angle = angle_;
        this.state = 0;
        this.delta_angle=0.5;
        // this.color_terminals=color(0,0,255,255);
        this.color_terminals=Globals.get_blue();
        this.color_line = color(100,100,100,255);
        this.terminal_size = 10;
        this.line_thickness=3;
        this.fade_on=false;
        this.delta_fade=0;
        this.alpha = 255;
    }

    close() {
        if (this.state == 1) return true;

        let da = this.delta_angle;
        if (this.angle > 0) da = -da;

        if (this.boundary_cross(0,this.angle,da)) {
            this.angle = 0;
            this.state = 1;
            return true;
        }
        return false;
    }

    open() {
        if (this.state == 0) return true;

        let da = this.delta_angle;
        if (this.open_angle < 0) da = -da;

        if (this.boundary_cross(this.open_angle,this.angle,da)) {
            this.angle = this.open_angle;
            this.state = 0;
            return true;
        }
        return false;
    }

    boundary_cross(boundary,value,step) {
        this.angle = value + step;
        if (this.angle >= boundary && value < boundary) return true;
        if (this.angle <= boundary && value > boundary) return true;
        return false;
    }

    show(sketch) {
        if (this.fade_on) this.reduce_opacity();

        let a1 = this.p1.copy();
        let a2 = this.p2.copy();
        let p3 = a2.sub(a1);
        p3.rotate(this.angle);
        p3.add(this.p1);
        sketch.stroke(this.color_line);
        sketch.strokeWeight(this.line_thickness);
        sketch.line(this.p1.x,this.p1.y,p3.x,p3.y);
        sketch.fill(this.color_terminals);
        sketch.circle(this.p1.x,this.p1.y,this.terminal_size);
        sketch.circle(this.p2.x,this.p2.y,this.terminal_size);
        // sketch.circle(p3.x,p3.y,this.terminal_size);
    }

    fade(delta_fade_) {
        this.fade_on = true;
        this.delta_fade = delta_fade_;
    }

    reduce_opacity() {
        this.alpha -= this.delta_fade;
        this.color_terminals.setAlpha(this.alpha);
        this.color_line.setAlpha(this.alpha);
    }
}