var a = false;
var d = false;
var w = false;
var s = false;
var spaceBar = false;

document.addEventListener("keydown", press);
document.addEventListener("keyup", release);


function press(e)
{
    // console.log("Pressed " + e.keyCode);
    if (e.keyCode == 65)
    {
        a=true;
    }
    if (e.keyCode == 68)
    {
        d=true;
    }
    if (e.keyCode == 87)
    {
        w=true;
    }
    if (e.keyCode == 83)
    {
        s=true;
    }
    if(e.keyCode == 32)
    {
        spaceBar=true;
    }
}

function release(e)
{
    // console.log("Pressed " + e.keyCode);
    if (e.keyCode == 65)
    {
        a=false;
    }
    if (e.keyCode == 68)
    {
        d=false;
    }
     if (e.keyCode == 87)
    {
        w=false;
    }
    if (e.keyCode == 83)
    {
        s=false;
    }
     if(e.keyCode == 32)
    {
        spaceBar=false;
    }
}
