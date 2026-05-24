var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

// time and frames
var interval = 1000/60;
var timer = setInterval(animate, interval);
var score = 0;

var player = new gameObject(canvas.width/2, canvas.height/2, 75, 75, "#ff0000");
var pointer = new gameObject(450, 450, 50, 100);

var frictionX = .9;
var frictionY = .9;

var leftTargets = [];
var topTargets = [];
var rightTargets = [];
var bottomTargets = [];
var numTargets = 3;

makeLeftTargets();
makeTopTargets();
makeRightTargets();
makeBottomTargets();


var canShoot = true;
var bullets = [];

function animate()
{
    context.clearRect(0, 0, canvas.width, canvas.height);

    // the score
	context.fillStyle = "#b700f4";
    context.font = "30px Arial";
    context.fillText("Score: "+ score, 400, 50);

    orbit();
    wasd();
    shoot();
    moveBullets();
    drawTargets();
    hitTargets();

    player.drawCircle();
    pointer.drawTriangle();
    player.move();
}

function wasd()
{
    player.vx *= frictionX;
    player.vy *= frictionY;

    if(w)
    {
        player.vy -= player.force;
    }

    if(s)
    {
        player.vy += player.force;
    }

    if(a)
    {
        player.vx -= player.force;
    }

    if(d)
    {
        player.vx += player.force;
    }
}

var orbitAngle = 0;

function orbit()
{
    var speed = 0.02;

    pointer.x = player.x + player.width / 2 * Math.cos(orbitAngle);
    pointer.y = player.y + player.width / 2 * Math.sin(orbitAngle);

    orbitAngle += speed;
    pointer.angle = orbitAngle * 180 / Math.PI;
}

function shoot()
{
    if(spaceBar && canShoot)
    {
        canShoot = false;

        var radians = pointer.angle * Math.PI / 180;

        var tipX = pointer.x + Math.cos(radians) * (pointer.width / 2);
        var tipY = pointer.y + Math.sin(radians) * (pointer.width / 2);

        var bullet = new gameObject(tipX, tipY, 10, 10, "#0000ff");

        bullet.vx = Math.cos(radians) * 8;
        bullet.vy = Math.sin(radians) * 8;

        bullets.push(bullet);
    }

    if(!spaceBar)
    {
        canShoot = true;
    }
}

function moveBullets()
{
    for(var i = 0; i < bullets.length; i++)
    {
        bullets[i].move();
        bullets[i].drawCircle();

        if(
            bullets[i].x < 0 ||
            bullets[i].x > canvas.width ||
            bullets[i].y < 0 ||
            bullets[i].y > canvas.height
        )
        {
            bullets.splice(i, 1);
            i--;
        }
    }
}

function makeLeftTargets()
{
    for(var i = 0; i < numTargets; i++)
    {
        var target = new gameObject(10, rand(0, canvas.height), 20, 20, "#000000");

        target.vx = rand(2, 4);
        target.vy = 0;

        leftTargets.push(target);
    }
}

function makeTopTargets()
{
    for(var i = 0; i < numTargets; i++)
    {
        var target = new gameObject(rand(0, canvas.width), 10, 20, 20, "#000000");

        target.vx = 0;
        target.vy = rand(2, 4);

        topTargets.push(target);
    }
}
function makeRightTargets()
{
      for(var i = 0; i < numTargets; i++)
    {
        var target = new gameObject(canvas.width, rand(0, canvas.height), 20, 20, "#000000");

        target.vx = -rand(2, 4);
        target.vy = 0;

        rightTargets.push(target);
    }
}
function makeBottomTargets()
{
    for(var i = 0; i < numTargets; i++)
    {
        var target = new gameObject(rand(0, canvas.width), canvas.height, 20, 20, "#000000");

        target.vx = 0;
        target.vy = -rand(2, 4);

        bottomTargets.push(target);
    }
}


function drawTargets()
{
    // LEFT TARGETS
    for(var i = 0; i < leftTargets.length; i++)
    {
        leftTargets[i].move();
        leftTargets[i].drawCircle();

        if(leftTargets[i].x - leftTargets[i].width / 2 >= canvas.width)
        {
            leftTargets.splice(i, 1);
            i--;

            var target = new gameObject(10, rand(0, canvas.height), 20, 20, "#000000");

            target.vx = rand(2, 4);
            target.vy = 0;

            leftTargets.push(target);
        }
    }

    // TOP TARGETS
    for(var i = 0; i < topTargets.length; i++)
    {
        topTargets[i].move();
        topTargets[i].drawCircle();

        if(topTargets[i].y - topTargets[i].height / 2 >= canvas.height)
        {
            topTargets.splice(i, 1);
            i--;

            var target = new gameObject(rand(0, canvas.width), 10, 20, 20, "#000000");

            target.vx = 0;
            target.vy = rand(2, 4);

            topTargets.push(target);
        }
    }
    // RIGHT TARGETS
    for(var i = 0; i < rightTargets.length; i++)
    {
        rightTargets[i].move();
        rightTargets[i].drawCircle();

        if(rightTargets[i].x  <= 0)
        {
            rightTargets.splice(i, 1);
            i--;

            var target = new gameObject(canvas.width, rand(0, canvas.height), 20, 20, "#000000");

            target.vx = -rand(2, 4);
            target.vy = 0;

            rightTargets.push(target);
        }
    }
    // BOTTOM TARGETS
    for(var i = 0; i < bottomTargets.length; i++)
    {
        bottomTargets[i].move();
        bottomTargets[i].drawCircle();

        if(bottomTargets[i].y < 0)
        {
            bottomTargets.splice(i, 1);
            i--;

            var target = new gameObject(rand(0, canvas.width), canvas.height, 20, 20, "#000000");

            
            target.vx = 0;
            target.vy = -rand(2, 4);

            bottomTargets.push(target);
        }
    }
}

function hitTargets()
{
    // LEFT TARGETS
    for(var i = 0; i < bullets.length; i++)
    {
        for(var j = 0; j < leftTargets.length; j++)
        {
            if(bullets[i].hitTestObject(leftTargets[j]))
            {
                score++;

                bullets.splice(i, 1);
                leftTargets.splice(j, 1);

                i--;

                var target = new gameObject(10, rand(0, canvas.height), 20, 20, "#000000");

                target.vx = rand(2, 4);
                target.vy = 0;

                leftTargets.push(target);

                break;
            }
        }
    }

    // TOP TARGETS
    for(var i = 0; i < bullets.length; i++)
    {
        for(var j = 0; j < topTargets.length; j++)
        {
            if(bullets[i].hitTestObject(topTargets[j]))
            {
                score++;

                bullets.splice(i, 1);
                topTargets.splice(j, 1);

                i--;

                var target = new gameObject(rand(0, canvas.width), 10, 20, 20, "#000000");

                target.vx = 0;
                target.vy = rand(2, 4);

                topTargets.push(target);

                break;
            }
        }
    }
    // RIGHT TARGETS
    for(var i = 0; i < bullets.length; i++)
    {
        for(var j = 0; j < leftTargets.length; j++)
        {
            if(bullets[i].hitTestObject(rightTargets[j]))
            {
                score++;
                bullets.splice(i, 1);
                rightTargets.splice(j, 1);

                i--;

                var target = new gameObject(canvas.width, rand(0, canvas.height), 20, 20, "#000000");

                target.vx = -rand(2, 4);
                target.vy = 0;

                rightTargets.push(target);

                break;
            }
        }
    }
    // BOTTOM TARGETS
    for(var i = 0; i < bullets.length; i++)
    {
        for(var j = 0; j < bottomTargets.length; j++)
        {
            if(bullets[i].hitTestObject(bottomTargets[j]))
            {
                score++;
                bullets.splice(i, 1);
                bottomTargets.splice(j, 1);

                i--;

                var target = new gameObject(rand(0, canvas.width), canvas.height, 20, 20, "#000000");

                target.vx = 0;
                target.vy = -rand(2, 4);
                bottomTargets.push(target);

                break;
            }
        }
    }
}