var elem = document.getElementById("force");
var force = 0;
document.onkeydown = shoot;
document.onkeyup = release;

function shoot(){
	force++;
	if(force==100){
		force = 0;
		document.getElementById("force").style.width = 0 + '%';
	}
	
	document.getElementById("force").style.width = force + '%';
	console.log("Force: " + force);
}

function release(){
	var final_force = force;
	console.log('final_force: '+ final_force);
	force = 0;
}