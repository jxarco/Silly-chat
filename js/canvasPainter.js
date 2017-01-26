function CanvasPainter( canvas ){
	this.canvas = document.querySelector(canvas);

	var parent = this.canvas.parentNode;
	var rect = parent.getBoundingClientRect();

	this.canvas.width = rect.width - 50; // -25 por el padding
	this.canvas.height = rect.height - 50;


	this.animate();

	//var dragging = false;
}

//animations
CanvasPainter.prototype.animate = function(){
	var that = this;

	function loop(){
		that.draw();
		requestAnimationFrame(loop);
	}

	loop();
}

/*CanvasPainter.prototype.bindEvents = function(){
	this.canvas.addEventListener("mousedown", this.onMouseEvent.bind(this));
	this.canvas.addEventListener("mousemove", this.onMouseEvent.bind(this));
	this.canvas.addEventListener("mouseup", this.onMouseEvent.bind(this));
}*/

/*CanvasPainter.prototype.onMouseEvent = function(e){
	console.log(e);

	if(e.type == "mousemove"){
			var x = e.offSetX;
			var y = e.offSetY;
			this.ctx.fillStyle = "white"
			this.ctx.fillRect(x, y, 10, 10);		
	}

	if(e.type == "mousedown"){
		this.dragging = true;		
	}

	if(e.type == "mouseup"){
		this.dragging = false;
		
	}
}*/

CanvasPainter.prototype.draw = function(){
	var ctx = this.canvas.getContext("2d");

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	ctx.strokeStyle = "white";
	ctx.strokeRect(Math.sin(performance.now()*0.001)*100+200, 0, 100, 100);
}