//index x, y to slot[20*20] num
function index2slot(x, y){
	return (Math.floor((y * COL + x) / bodyW));	//取整
}
//get index x from slot[20*20] num
function getX(num){
	return ((num % COL) * bodyW);
}
//get index y from slot[20*20] num
function getY(num){
	return (Math.floor(num / COL) * bodyH);
}


/*
 * create a class of snake's body
 */
function createBody(slotNum){
	var BODY = new Object;
	BODY.x = getX(slotNum);
	BODY.y = getY(slotNum);
	BODY.color = bodyColor;
	
	BODY.isEqual = function(B){
		if(this.x == B.x && this.y == B.y)
			return 1;
		return 0;
	}
	BODY.copyFrom = function(B){
		this.x = B.x;
		this.y = B.y;
		this.color = B.color;
	}
	BODY.rand = function(){
		var num = Math.floor(Math.random() * ROW * COL);
		this.x = getX(num);
		this.y = getY(num);
	}
	BODY.show = function(){
		var context = document.getElementById("canvasBg").getContext("2d");
		//context.clearRect(this.x+X, this.y+Y, bodyW, bodyH);
		context.fillStyle = this.color;
		context.fillRect(this.x+X, this.y+Y, bodyW, bodyH);
		context.lineWidth = 0.2;
		context.strokeStyle = "rgb(0, 128, 128)";
		context.strokeRect(this.x+X, this.y+Y, bodyW, bodyH);
	}
	BODY.wipe = function(){
		var context = document.getElementById("canvasBg").getContext("2d");
		//context.clearRect(this.x+X, this.y+Y, bodyW, bodyH);
	}
	BODY.canMoveLeft = function(){
		if((this.x - bodyW) >= 0)
			return true;
		return false;
	}
	BODY.canMoveRight = function(){
		if((this.x + bodyW) < backgroundW)
			return true;
		return false;
	}
	BODY.canMoveUp = function(){
		if((this.y - bodyH) >= 0)
			return true;
		return false;
	}
	BODY.canMoveDown = function(){
		if((this.y + bodyH) < backgroundH)
			return true;
		return false;
	}
	BODY.moveLeft = function(){
		if (this.canMoveLeft()) {
			this.x = this.x - bodyW;
			return true;
		}
		return false;
	}
	BODY.moveRight = function(){
		if (this.canMoveRight()) {
			this.x = this.x + bodyW;
			return true;
		}
		return false;
	}
	BODY.moveUp = function(){
		if(this.canMoveUp()) {
			this.y = this.y - bodyH;
			return true;
		}
		return false;
	}
	BODY.moveDown = function(){
		if(this.canMoveDown()){
			this.y = this.y + bodyH;
			return true;
		}
		return false;
	}
	
	return BODY;
}


/*
 * create a class of snake
 */
function createSnake(){
	var SNAKE = new Object;
	SNAKE.curDirection = 1;	//0:left 1:right 2:up 3:down
	SNAKE.nextDirection = 1;
	SNAKE.food = createBody(0);
	SNAKE.food.color = foodColor;
	SNAKE.wipeBody = createBody(0);
	SNAKE.isWipeBody = 0;
	
	SNAKE.hashArray = new Array();	//标志对应的空格是否被占用 0:没被占用, 1:已被占用
	for(i=0; i<COL*ROW; i++){
		if(i < initSnakeLength){
			SNAKE.hashArray[i] = 1;
		}
		else{
			SNAKE.hashArray[i] = 0;
		}
	}
	
	SNAKE.body = new Array(initSnakeLength);	//snake 's body
	for (i = 0; i < SNAKE.body.length; i++) {
		SNAKE.body[i] = createBody(i);
	}
	
	SNAKE.randFood = function(){
		var counter = 10;
		while(counter>0){
			counter --;
			this.food.rand();
			if (0 == this.hashArray[index2slot(this.food.x, this.food.y)]) {
				return;
			}
		}
		for(i=(COL*ROW/2); i<COL*ROW; i++){
			if (this.hashArray[i] == 0) {
				this.food.x = getX(i);
				this.food.y = getY(i);
				return;
			}
		}
		for(i=(COL*ROW/2-1); i>=0; i--){
			if (this.hashArray[i] == 0) {
				this.food.x = getX(i);
				this.food.y = getY(i);
				return;
			}
		}
	}
	
	/*
	 * 贪吃蛇核心函数
	 * 0: ok
	 * 1: game over
	 */
	SNAKE.upDate = function(){
		var flag = 0;
		switch (this.nextDirection) {
			case 0:
				flag = this.goLeft();
				break;
			case 1:
				flag = this.goRight();
				break;
			case 2:
				flag = this.goUp();
				break;
			case 3:
				flag = this.goDown();
				break;
		}
		this.curDirection = this.nextDirection;
		if (1 != flag) {
			flag = this.updateFlag();
		}
		return flag;
	}
	
	SNAKE.updateFlag = function(){
		if (1 == this.hashArray[index2slot(SNAKE.body[SNAKE.body.length - 1].x, SNAKE.body[SNAKE.body.length - 1].y)]) {
			if(SNAKE.body[SNAKE.body.length - 1].isEqual(this.food)){	//eat a food
				//alert("ate.");
				var tmpBody = createBody(0);
				tmpBody.x = this.x;
				tmpBody.y = this.y;
				SNAKE.body.unshift(tmpBody);
				this.randFood();
			}
			else{
				return 1; //game over
			}
		}
		if(1 == this.isWipeBody){
			this.hashArray[index2slot(this.wipeBody.x, this.wipeBody.y)] = 0;
		}
		for(i=0; i<SNAKE.body.length; i++){
			this.hashArray[index2slot(SNAKE.body[i].x, SNAKE.body[i].y)] = 1;
		}
		this.hashArray[index2slot(this.food.x, this.food.y)] = 1;
		return 0;
	}
	
	SNAKE.show = function(){
		if(1 == this.isWipeBody){
			this.wipeBody.wipe();
			this.isWipeBody = 0;
		}
		for(i=0; i<SNAKE.body.length; i++){
			SNAKE.body[i].show();
		}
		this.food.show();
	}
	
	SNAKE.goLeft = function(){
		if(this.curDirection == 1){
			return -1;	//no move
		}
		if(!SNAKE.body[SNAKE.body.length-1].canMoveLeft()){
			return 1;	//game over
		}
		this.wipeBody.copyFrom(SNAKE.body[0]);
		this.isWipeBody = 1;
		for(i=0; i<(SNAKE.body.length-1); i++){
			SNAKE.body[i].copyFrom(SNAKE.body[i+1]);
		}
		SNAKE.body[SNAKE.body.length-1].moveLeft();
		this.curDirection = 0;
		return 0;	//move ok
	}
	SNAKE.goRight = function(){
		if(this.curDirection == 0){
			return -1;	//no move
		}
		if(!SNAKE.body[SNAKE.body.length-1].canMoveRight()){
			return 1;	//game over
		}
		this.wipeBody.copyFrom(SNAKE.body[0]);
		this.isWipeBody = 1;
		for(i=0; i<(SNAKE.body.length-1); i++){
			SNAKE.body[i].copyFrom(SNAKE.body[i+1]);
		}
		SNAKE.body[SNAKE.body.length-1].moveRight();
		this.curDirection = 1;
		return 0;	//move ok
	}
	SNAKE.goUp = function(){
		if(this.curDirection == 3){
			return -1;	//no move
		}
		if(!SNAKE.body[SNAKE.body.length-1].canMoveUp()){
			return 1;	//game over
		}
		this.wipeBody.copyFrom(SNAKE.body[0]);
		this.isWipeBody = 1;
		for(i=0; i<(SNAKE.body.length-1); i++){
			SNAKE.body[i].copyFrom(SNAKE.body[i+1]);
		}
		SNAKE.body[SNAKE.body.length-1].moveUp();
		this.curDirection = 2;
		return 0;	//move ok
	}
	SNAKE.goDown = function(){
		if(this.curDirection == 2){
			return -1;	//no move
		}
		if(!SNAKE.body[SNAKE.body.length-1].canMoveDown()){
			return 1;	//game over
		}
		this.wipeBody.copyFrom(SNAKE.body[0]);
		this.wipeBody.y = SNAKE.body[0].y;
		this.isWipeBody = 1;
		for(i=0; i<(SNAKE.body.length-1); i++){
			SNAKE.body[i].copyFrom(SNAKE.body[i+1]);
		}
		SNAKE.body[SNAKE.body.length-1].moveDown();
		this.curDirection = 3;
		return 0;	//move ok
	}
	SNAKE.getScore = function(){
		return SNAKE.body.length;
	}
	
	return SNAKE;
}
