/*
 * main function to start game here
 */
function init(){
	/*curSnake = createSnake();
	curSnake.randFood();
	
	isGameing = 1;*/
	drawBg();
	
	window.addEventListener('keydown', anyKey, false);	//keyboard event listenner, function is "anyKey"
	var interId = window.setInterval(onTimer, gameInterval);
}

function restart(){
	curSnake = createSnake();
	curSnake.randFood();
	isGameing = 1;
	drawBg();
}

function exitGame(){
	isGameing = 0;
	window.clearInterval(interId);
}

function game(){
	drawBg();	///
	curSnake.show();
}

function onTimer(){
	if(0 == isGameing)
		return ;
	if(1 == curSnake.upDate()){
		isGameing = 0;
		var r=confirm("Game Over! Continue?");
		if (r==true){
		 	restart();
		}
		else{
			exitGame();
		}
	}
	else {
		game();
	}
}

function drawLine(color, x1, y1, x2, y2, value){
	var context = document.getElementById("canvasBg").getContext("2d");
	context.strokeStyle = color;
	context.lineWidth = value;
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.stroke();
}

//draw background
function drawBg(){
	var context = document.getElementById("canvasBg").getContext("2d");
	context.clearRect(X, Y, backgroundW, backgroundH);
	context.strokeStyle = bgColor;
	context.strokeRect(X-1, Y-1, backgroundW+2, backgroundH+2);
	
	/*for(i=0; i<20; i++){
		drawLine(context.strokeStyle, X+20*i, Y, X+20*i, Y+400, 1);
		drawLine(context.strokeStyle, X, Y+20*i, X+400, Y+20*i, 1);
	}*/
}

//get key from keyboard
function anyKey(){
	if(null == event){
		keyCode = window.event.keyCode;
		window.event.preventDefault();
	}
	else {
		keyCode = event.keyCode;
		event.preventDefault();
	}
	switch(keyCode)
	{
		case 37:	//left arrow
		case 65:	//A
			if(curSnake.curDirection != 1)
				curSnake.nextDirection = 0;
			break;
		case 38:	//up arrow
		case 87:	//W
			if(curSnake.curDirection != 3)
				curSnake.nextDirection = 2;
			break;
		case 39:	//right arrow
		case 68:	//D
			if(curSnake.curDirection != 0)
				curSnake.nextDirection = 1;
			break;
		case 40:	//down arrow
		case 83:	//S
			if(curSnake.curDirection != 2)
				curSnake.nextDirection = 3;
			break;
		default:
			//alert("You just pressed keycode : " + keyCode);
	}
}

