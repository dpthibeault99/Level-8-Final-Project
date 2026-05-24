function gameObject(x,y,w,h, color)
{
    // set up x
    if(x==undefined)
    {
        this.x = canvas.width/2;
    } 
    else 
    {
        this.x = x;
    }

    // set up y
    if(y==undefined){

        this.y = canvas.height/2;
    }
    else
    {
        this.y=y;
    }

    // set up player dimensions

    // set up width
   if(w == undefined){
    this.width = 100;
    } 
    else 
    {
    this.width = w;
    }

    // set up height
    if(h == undefined)
    {
    this.height = 100; // had to change this.w to this.width
    } 
    else 
    {
    this.height = h;// had to change this.h to this.height
    }
        // set up color
    if (color==undefined){
        this.color = "rgb(80, 136, 255)" 
    }
    else 
    {
        this.color =color;
    }

        this.jumpSpeed = -20; // NEW

    // bounding Points! NEW

    this.left = function()
    {
        return{x: this.x - this.width/2, y:this.y};
    }
    this.right = function()
    {
        return{x:this.x + this.width/2, y:this.y};
    }
    this.top = function()
    {
        return{x:this.x, y:this.y - this.height/2};
    }
    this.bottom = function()
    {
        return{x:this.x, y:this.y + this.height/2};

    }

    this.prevX = x;
    this.canJump = true; // NEW


    // //bounding box

    // this.left = function()
    // {
    //     return this.x - this.width/2;
    // }
    // this.right = function()
    // {
    //     return this.x + this.width/2;
    // }
    // this.top = function()
    // {
    //     return this.y - this.height/2;
    // }
    // this.bottom = function()
    // {
    //     return this.y + this.height/2;
    // }


    // set up player velocity
    this.vx = 0;
    this.vy = 0;

    /// set up physics
    this.force = 1;
    this.ax = 1; // horizatial
    this.ay = 1;// vertical

    this.angle = 0;

    this.drawRect = function()
    {
        context.save();
            context.fillStyle = this.color;
            context.translate(this.x, this.y);
            context.fillRect((-this.width/2), (-this.height/2), this.width, this.height);
        context.restore();
    }

    this.drawCircle = function()
    {
        context.save();
            context.fillStyle = this.color;
            context.beginPath();
            context.translate(this.x,this.y);
            context.arc(0, 0, this.width/2, 0, 360 * Math.PI/180, true);
            context.closePath();
            context.fill();
        context.restore();
    }

    this.drawTriangle = function() // broken
    {
        context.save();
        context.fillStyle = this.color;
        context.translate(this.x,this.y)
        context.rotate(this.angle * Math.PI/180);
        context.beginPath();
            context.moveTo(0 + this.width/2, 0)
            context.lineTo(0 - this.width/2, 0 - this.width/4);
            context.lineTo(0 - this.width/2, 0 + this.width/4);
            context.closePath();
            context.fill();

        context.restore();
    }

    this.drawDebug = function()
    {
        var size = 10;
       
        context.save();
            context.fillStyle = "#000000" ;
            context.fillRect(this.x-size/2, this.y-size/2, size, size); // middle
            context.fillRect(this.left().x-size/2, this.left().y-size/2, size, size); // left
            context.fillRect(this.right().x-size/2, this.right().y-size/2, size, size); // right
            context.fillRect(this.top().x-size/2, this.top().y-size/2, size, size); // top
            context.fillRect(this.bottom().x-size/2, this.bottom().y-size/2, size, size); // bottom
        context.restore();
    }

    this.move = function()
    {
        this.x += this.vx;
        this.y += this.vy;
    }


    // collistion detection
    this.collistionCheck = function (obj)
        {
        if
        (
            this.left() < obj.right() && 
            this.right() > obj.left() &&
            this.top() < obj.bottom() &&
            this.bottom() > obj.top() 
        )
        {
            return true
        }
        return false
    }

    this.hitTestPoint = function(obj)
    {
        if(obj.x >= this.left().x &&
           obj.x <= this.right().x &&
           obj.y >= this.top().y &&
           obj.y <= this.bottom().y 
        )
        {
        return true;
        }
        return false;
    }
    this.hitTestObject = function(obj)
	{
		if(this.left().x <= obj.right().x && 
		   this.right().x >= obj.left().x &&
		   this.top().y <= obj.bottom().y &&
		   this.bottom().y >= obj.top().y)
		{
		return true
		}
		return false;
	}
		

    
}