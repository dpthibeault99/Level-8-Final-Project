var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

// time and frames
var interval = 1000/60;
var timer = setInterval(animate, interval);
var score = 0;
var hit = 0;
var canBeHit = true;

var states = [];
var currentState = 0;
// 0 title
// 1 game
// 2 instructions
// 3 credits
// 4 lose
// 5 win

// the power up
var gameStartTime = 0;
var showAfter30Seconds = false;
var hasUpgrade = false;

// Start Button
var startButtonX = 412;
var startButtonY = 250;
var startButtonW = 200;
var startButtonH = 70;

// Instructions Button
var controlsButtonX = 412;
var controlsButtonY = 340;
var controlsButtonW = 200;
var controlsButtonH = 70;

// Credits Button
var creditsButtonX = 412;
var creditsButtonY = 430;
var creditsButtonW = 200;
var creditsButtonH = 70;

canvas.addEventListener("click", onClicked);

function onClicked(e)
{
    var rect = canvas.getBoundingClientRect();

    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;

    if(currentState != 1)
    {
        // Start Button
        if(
            mouseX >= startButtonX &&
            mouseX <= startButtonX + startButtonW &&
            mouseY >= startButtonY &&
            mouseY <= startButtonY + startButtonH
        )
        {
            console.log("Clicked Start Button!");
            resetGame();
            currentState = 1;
        }
    }

    if(currentState == 0 || currentState == 2 || currentState == 3 || currentState == 4 || currentState == 5)
    {
        // Instructions Button
        if(
            mouseX >= controlsButtonX &&
            mouseX <= controlsButtonX + controlsButtonW &&
            mouseY >= controlsButtonY &&
            mouseY <= controlsButtonY + controlsButtonH
        )
        {
            console.log("Clicked Instructions Button!");
            currentState = 2;
        }

        // Credits Button
        if(
            mouseX >= creditsButtonX &&
            mouseX <= creditsButtonX + creditsButtonW &&
            mouseY >= creditsButtonY &&
            mouseY <= creditsButtonY + creditsButtonH
        )
        {
            console.log("Clicked Credits Button!");
            currentState = 3;
        }
    }
}

var player = new gameObject(canvas.width/2, canvas.height/2, 75, 75, "#ff0000");
var pointer = new gameObject(450, 450, 50, 100);
var upgradePointer = new gameObject(450, 450, 50, 100, "#00ffff");

// Upgrade ball
var upgrade = new gameObject(-20, -20, 40, 40, "#0000ff");
upgrade.vx = 1;
upgrade.vy = 1;

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

function resetGame()
{
    score = 0;
    hit = 0;
    canBeHit = true;
    hasUpgrade = false;
    showAfter30Seconds = false;
    gameStartTime = Date.now();

    player.x = canvas.width/2;
    player.y = canvas.height/2;
    player.width = 75;
    player.height = 75;
    player.vx = 0;
    player.vy = 0;

    bullets = [];

    leftTargets = [];
    topTargets = [];
    rightTargets = [];
    bottomTargets = [];

    makeLeftTargets();
    makeTopTargets();
    makeRightTargets();
    makeBottomTargets();

    upgrade.x = -20;
    upgrade.y = -20;
    upgrade.vx = 1;
    upgrade.vy = 1;
    upgrade.color = "#0000ff";
}

function animate()
{
    context.clearRect(0, 0, canvas.width, canvas.height);

    states[currentState]();
}

states[0] = function() 
{
    // title

    context.fillStyle = "#b700f4";
    context.font = "30px Arial";
    context.fillText("Asteriods, but....", 360, 100);

    drawMenuButtons();
}

states[1] = function()
{
    // game

    context.fillStyle = "#b700f4";
    context.font = "30px Arial";
    context.fillText("Score: " + score, 400, 50);
    context.fillText("Hit: " + hit, 550, 50);

    var gameTime = Date.now() - gameStartTime;

    if(gameTime >= 30000 && gameTime <= 35000)
    {
        context.fillStyle = pointer.color;
        context.font = "40px Arial";
        context.fillText("30 seconds passed!", 330, 200);
    }

    if(gameTime >= 30000 && hasUpgrade == false)
    {
        upgrade.move();
        upgrade.drawCircle();
    }

    orbit();
    wasd();
    shoot();
    upgradeShoot();
    moveBullets();
    drawTargets();
    hitTargets();
    hitPlayer();
    hitUpgrade();

    player.drawCircle();
    pointer.drawTriangle();

    if(hasUpgrade)
    {
        upgradePointer.drawTriangle();
    }

    player.move();

    if(hit >= 70 && score >= 200)
    {
        canBeHit = false;
        player.width = 100;
        player.height = 100;
        currentState = 5;
    }
    else if(hit >= 70)
    {
        canBeHit = false;
        player.width = 100;
        player.height = 100;
        currentState = 4;
    }
}

states[2] = function()
{
    // Instructions

    context.fillStyle = "#b700f4";
    context.font = "24px Arial";
    context.fillText("WASD to move", 400, 150);
    context.fillText("SPACE to shoot", 400, 180);
    context.fillText("If you grow too big, you lose", 400, 210);
    context.fillText("200 Points to win", 400, 240);

    drawMenuButtons();
}

states[3] = function()
{
    // Credits

    context.fillStyle = "#b700f4";
    context.font = "24px Arial";
    context.fillText("Made by Daniel Thibeault", 400, 200);

    drawMenuButtons();
}

states[4] = function()
{
    // you lose

    context.fillStyle = "#b700f4";
    context.font = "24px Arial";
    context.fillText("You Lose", 400, 200);

    drawMenuButtons();
}

states[5] = function()
{
    // you win

    context.fillStyle = "#b700f4";
    context.font = "24px Arial";
    context.fillText("You Win", 400, 200);

    drawMenuButtons();
}

function drawMenuButtons()
{
    // Start Button
    context.fillStyle = "#222222";
    context.fillRect(startButtonX, startButtonY, startButtonW, startButtonH);

    context.fillStyle = "#ffffff";
    context.font = "24px Arial";
    context.fillText("START", startButtonX + 65, startButtonY + 43);

    // Instructions Button
    context.fillStyle = "#222222";
    context.fillRect(controlsButtonX, controlsButtonY, controlsButtonW, controlsButtonH);

    context.fillStyle = "#ffffff";
    context.font = "24px Arial";
    context.fillText("INSTRUCTIONS", controlsButtonX + 15, controlsButtonY + 43);

    // Credits Button
    context.fillStyle = "#222222";
    context.fillRect(creditsButtonX, creditsButtonY, creditsButtonW, creditsButtonH);

    context.fillStyle = "#ffffff";
    context.font = "24px Arial";
    context.fillText("CREDITS", creditsButtonX + 55, creditsButtonY + 43);
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
    pointer.angle = orbitAngle * 180 / Math.PI;

    upgradePointer.x = player.x + player.width / 2 * Math.cos(orbitAngle + Math.PI);
    upgradePointer.y = player.y + player.width / 2 * Math.sin(orbitAngle + Math.PI);
    upgradePointer.angle = (orbitAngle + Math.PI) * 180 / Math.PI;

    orbitAngle += speed;
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

function upgradeShoot()
{
    if(hasUpgrade)
    {
        var radians = upgradePointer.angle * Math.PI / 180;

        var tipX = upgradePointer.x + Math.cos(radians) * (upgradePointer.width / 2);
        var tipY = upgradePointer.y + Math.sin(radians) * (upgradePointer.width / 2);

        var bullet = new gameObject(tipX, tipY, 10, 10, "#00ffff");

        bullet.vx = Math.cos(radians) * 8;
        bullet.vy = Math.sin(radians) * 8;

        bullets.push(bullet);
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

    for(var i = 0; i < rightTargets.length; i++)
    {
        rightTargets[i].move();
        rightTargets[i].drawCircle();

        if(rightTargets[i].x <= 0)
        {
            rightTargets.splice(i, 1);
            i--;

            var target = new gameObject(canvas.width, rand(0, canvas.height), 20, 20, "#000000");
            target.vx = -rand(2, 4);
            target.vy = 0;
            rightTargets.push(target);
        }
    }

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

function hitPlayer()
{
    if(canBeHit == false)
    {
        return;
    }

    for(var i = 0; i < leftTargets.length; i++)
    {
        if(player.hitTestObject(leftTargets[i]))
        {
            playerGotHit();
            leftTargets.splice(i, 1);
            leftTargets.push(new gameObject(10, rand(0, canvas.height), 20, 20, "#000000"));
            leftTargets[leftTargets.length - 1].vx = rand(2, 4);
            return;
        }
    }

    for(var i = 0; i < topTargets.length; i++)
    {
        if(player.hitTestObject(topTargets[i]))
        {
            playerGotHit();
            topTargets.splice(i, 1);
            topTargets.push(new gameObject(rand(0, canvas.width), 10, 20, 20, "#000000"));
            topTargets[topTargets.length - 1].vy = rand(2, 4);
            return;
        }
    }

    for(var i = 0; i < rightTargets.length; i++)
    {
        if(player.hitTestObject(rightTargets[i]))
        {
            playerGotHit();
            rightTargets.splice(i, 1);
            rightTargets.push(new gameObject(canvas.width, rand(0, canvas.height), 20, 20, "#000000"));
            rightTargets[rightTargets.length - 1].vx = -rand(2, 4);
            return;
        }
    }

    for(var i = 0; i < bottomTargets.length; i++)
    {
        if(player.hitTestObject(bottomTargets[i]))
        {
            playerGotHit();
            bottomTargets.splice(i, 1);
            bottomTargets.push(new gameObject(rand(0, canvas.width), canvas.height, 20, 20, "#000000"));
            bottomTargets[bottomTargets.length - 1].vy = -rand(2, 4);
            return;
        }
    }
}

function playerGotHit()
{
    hit++;

    player.width += 10;
    player.height += 10;

    if(player.width > 1000)
    {
        player.width = 1000;
    }

    if(player.height > 1000)
    {
        player.height = 1000;
    }

    console.log(hit);
}

function hitTargets()
{
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

    for(var i = 0; i < bullets.length; i++)
    {
        for(var j = 0; j < rightTargets.length; j++)
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

function hitUpgrade()
{
    if(player.hitTestObject(upgrade))
    {
        hasUpgrade = true;
        upgrade.color = "#ffffff";
        console.log("upgraded");
    }
}