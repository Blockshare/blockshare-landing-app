
// opsiyonlardan odak noktasi center olabilir
(function ( $ ) {

	var tileSize = 480;
	var tileSize2 = 320;

	var SHTile = function(x,y){
		this.x = x;
		this.y = y;
		this.animationPath = new Array();
		this.currentAnimation = 0; 
		this.delay = 0;
		this.reset = false;
		this.animation = 1;

		this.generateAnimationPath = function(ctx,radius,intensity){
			this.animationPath = new Array();
			var getAPoint = this.getAPoint(radius);
			var curX = getAPoint.x;
			var curY = getAPoint.y;
			var itemCount = intensity;//Math.floor(Math.random()*4)+1;
			for(var i = 0; i < itemCount; i++){
				var anim = this.generateAnim(ctx,radius,curX,curY);
				
				if(anim.endX == -1){
					getAPoint = this.getAPoint(radius);
					curX = getAPoint.x;
					curY = getAPoint.y;
				}else{
					curX = anim.endX;
					curY = anim.endY;
					this.animationPath.push(anim);
				}
		
			}			
		}

		this.getAPoint = function(radius){
			if(Math.random()*10 < 4){
				return {x:this.x+tileSize2/2,y:this.y+tileSize2/2};
			}else{
				var rndAngle = 2*Math.PI/6*Math.floor(Math.random()*6)-Math.PI/2;
				var rndRadius = radius*(Math.floor(Math.random()*2)+1);	
				var rv = {
					x:Math.cos(rndAngle)*rndRadius+this.x+tileSize2/2,
					y:Math.sin(rndAngle)*rndRadius+this.y+tileSize2/2,

				};
				return rv;
			}
		}

		this.generateAnim = function(ctx,radius,x,y){
			var anim = {
				startX: x,
				startY: y,
				endX:-1,
				endY:-1,
				time:0
			};
			var rndAngle = 2*Math.PI/6*Math.floor(Math.random()*6)-Math.PI/2;
			var desiredUnitCnt = Math.floor(Math.random()*5);
			for(var i = 1; i <= desiredUnitCnt; i++){
				var rndRadius = radius*(i)-2;	
				var testX = Math.cos(rndAngle)*rndRadius+anim.startX;
				var testY = Math.sin(rndAngle)*rndRadius+anim.startY;
				var imgData=ctx.getImageData(testX,testY,1,1);
				if(imgData.data[0] == 0){
					break;
				}else{
					anim.endX = testX;
					anim.endY = testY;
				}
			}
			return anim;
		}

		this.isVisible = function(){
			// canvas center buraya etki etmeli
			return ($(window).width() >= this.x+tileSize2/2 && $(window).height() >= this.y+tileSize2/2);
		}

	};
 
    $.fn.sparklingHexagons = function( optionsActions,param ) {

	   /* this.dosh_test = function(){
	    	alert(this.sh_test);
	    }*/

    	if(typeof optionsActions == 'string'){
    		if(optionsActions != "settings") return this;
    		clearInterval(this.interval);
			this.removeClass("sh-layer");
			this.removeClass("sh-element");
			this.html("");
			this.sparklingHexagons(param);
    		return this;
    	}
 
        var opts = $.extend( {}, $.fn.sparklingHexagons.defaults, optionsActions );
        this.opts = opts;
        if(this.opts.mode == "background")
        	this.addClass("sh-layer");
        else
        	this.addClass("sh-element");

        var t_ = this;
        
        var sh_canvas = $("<canvas class=\"sh-canvas\"></canvas>");
        this.append(sh_canvas);
        this.sh_ctx = sh_canvas[0].getContext("2d");
       	this.sh_canvas = sh_canvas;

		this.sizing = function(){
        	if(this.opts.mode == "background"){
	            if(typeof this.opts.radius == "undefined"){
	            	this.opts.radius = 165;  
	            }
		        this.sh_canvas[0].width = $(window).width();
		        this.sh_canvas[0].height = $(window).height();
		        $(window).off("resize");
		        $(window).on("resize",function(){
		        	t_.sh_canvas[0].width = $(window).width();
		        	t_.sh_canvas[0].height = $(window).height();
		        	t_.sh_draw();
		        });
		    }else{
		    	if(typeof this.opts.radius == "undefined"){
		    		this.opts.radius = 50;
		    	}
		    		
		    	this.sh_canvas[0].width = Math.sqrt(this.opts.radius*this.opts.radius-this.opts.radius/2*this.opts.radius/2)*6+50;
		        this.sh_canvas[0].height = this.opts.radius*6+50;

		    }
        }

        this.sizing();

        

        
        this.sh_tiles = new Array();

        function drawWrapper(){
        	t_.sh_draw();
        }

        

        this.sh_start = function(){

        	this.sh_createTiles();

        	this.sh_draw();

        	this.interval = setInterval(drawWrapper,80);

        	
        }

        this.sh_createTiles = function(){
        	var numWidthHeight = this.sh_calTileNums();
        	$.fn.sparklingHexagons[this.opts.mode].call(this,numWidthHeight);

        }

        this.sh_clear = function(){  

        	this.sh_ctx.globalCompositeOperation="source-over";
        	this.sh_ctx.clearRect(0,0,sh_canvas[0].width, sh_canvas[0].height);
			this.sh_ctx.fillStyle = this.opts.backgroundColor;
			this.sh_ctx.fillRect(0,0,sh_canvas[0].width, sh_canvas[0].height);
        }

        this.time = 0;

        this.sh_draw = function(){
        	this.sh_clear();
        	this.sh_ctx.lineWidth=1;

        	var len = this.sh_tiles.length;
        	for(var i = 0; i < len; i++){
        		var tile = this.sh_tiles[i];
				this.sh_drawTile(tile);
        	}

        	this.sh_ctx.save();

			this.sh_ctx.globalCompositeOperation="lighter";
	        this.sh_ctx.strokeStyle=this.opts.sparklingColor;
	        this.sh_ctx.shadowBlur=20;
			this.sh_ctx.shadowColor="#ffffff";	

			for(var i = 0; i < len; i++){
        		var tile = this.sh_tiles[i];
        		if(tile.isVisible() == false) continue;
        		if(tile.reset){
					tile.delay -= this.opts.speed/1000;
					if(tile.delay <= 0){
        				tile.animationPath = [];
        				tile.reset = false;
        			}
        		}
				if(tile.animationPath.length == 0){
					
						tile.generateAnimationPath(t_.sh_ctx,this.opts.radius,this.opts.intensity);	
					
					
				}
				
				if(tile.animation == 1){
					for(var j = 0; j < tile.animationPath.length; j++){

						var anim = tile.animationPath[j];

						var nextTime = anim.time + this.opts.speed/1000;

						if(nextTime >= 1){
							anim.time = 1;
							this.sh_drawSparkLine(anim.startX,anim.startY,anim.time*(anim.endX-anim.startX)+anim.startX,anim.time*(anim.endY-anim.startY)+anim.startY);
						}else{
							this.sh_drawSparkLine(anim.startX,anim.startY,anim.time*(anim.endX-anim.startX)+anim.startX,anim.time*(anim.endY-anim.startY)+anim.startY);
							anim.time = nextTime;

						}

						var finishAnimationCount = 0;
						for(var k = 0; k < tile.animationPath.length; k++){
							if(tile.animationPath[k].time == 1){
								finishAnimationCount++;
							}
						}	

						if(finishAnimationCount >= tile.animationPath.length){
							tile.animation = 2;
							break;
						}

					}
				}else if(tile.animation == 2){
					for(var j = 0; j < tile.animationPath.length; j++){

						var anim = tile.animationPath[j];

						var nextTime = anim.time + this.opts.speed/1000;

						if(nextTime >= 2){
							anim.time = 2;
							var x1 = (anim.time-1)*(anim.endX-anim.startX)+anim.startX;
							var y1 = (anim.time-1)*(anim.endY-anim.startY)+anim.startY;
							this.sh_drawSparkLine(x1, y1,anim.endX,anim.endY);
						}else{
							var x1 = (anim.time-1)*(anim.endX-anim.startX)+anim.startX;
							var y1 = (anim.time-1)*(anim.endY-anim.startY)+anim.startY;
							this.sh_drawSparkLine(x1, y1,anim.endX,anim.endY);
							anim.time = nextTime;
						}

						var finishAnimationCount = 0;
						for(var k = 0; k < tile.animationPath.length; k++){
							if(tile.animationPath[k].time == 2){
								finishAnimationCount++;
							}
						}	

						if(tile.reset == false && finishAnimationCount >= tile.animationPath.length){
							tile.reset = true;
							tile.delay = Math.random()*3;
							tile.animation = 1;
							break;
						}


					}
				}

        	}


        	this.sh_ctx.restore();
        	

        	
        	
        	
        }

        this.sh_drawSparkLine = function(x1,y1,x2,y2){
        	
        	this.sh_ctx.beginPath();
        	var angle = 2*Math.PI/6*1-Math.PI/2;
			this.sh_ctx.moveTo(x1,y1);
			this.sh_ctx.lineTo(x2,y2);
			this.sh_ctx.stroke();
        }

        this.sh_drawTile = function(tile){

        	var xstep = Math.sqrt(this.opts.radius*this.opts.radius-(this.opts.radius/2*(this.opts.radius/2)))*2;
        	var ystep = this.opts.radius*2;
        	for(var j = 0; j < 2; j++){
	        	for(var i = 0; i < 3; i++){
	        		if(i == 1){
						this.sh_drawHexagon(tile,i*xstep-xstep,j*ystep-ystep/2-ystep/2);	
						this.sh_drawHexagon(tile,i*xstep-xstep,j*ystep+ystep/2-ystep/2);	
	        		}else{
	        			this.sh_drawHexagon(tile,i*xstep-xstep,j*ystep-ystep/2);	
	        		}
	        		
	        	}
	        }
        	
        }

        this.sh_drawHexagon = function(tile,offsetX,offsetY){
        	this.sh_ctx.beginPath(); 
        	var x1 = tile.x+tileSize2/2+offsetX;
        	var y1 = tile.y+tileSize2/2+offsetY;
        	var framePoints = new Array();
        	for(var i = 0; i < 6; i++){
        		var angle = 2*Math.PI/6*i-Math.PI/2;
        		var x2 = Math.cos(angle)*this.opts.radius+tile.x+tileSize2/2+offsetX;
        		var y2 = Math.sin(angle)*this.opts.radius+tile.y+tileSize2/2+offsetY;
        		this.sh_ctx.moveTo(x1,y1);
        		this.sh_ctx.lineTo(x2,y2);
        		framePoints.push({x:x2,y:y2});
        	}
        	
        	this.sh_ctx.moveTo(framePoints[0].x,framePoints[0].y);
        	for(var i = 1; i < framePoints.length; i++){
        		this.sh_ctx.lineTo(framePoints[i].x,framePoints[i].y);
        	}
        	this.sh_ctx.lineTo(framePoints[0].x,framePoints[0].y);
			this.sh_ctx.strokeStyle=this.opts.tileStrokeColor;
			this.sh_ctx.fillStyle=this.opts.tileFillColor;
			
			this.sh_ctx.fill();
			this.sh_ctx.stroke();
        }

        this.sh_calTileNums = function(){
        	var winWidth = $(window).width();
        	var winHeight = $(window).height();
        	return {h:Math.ceil(winWidth/tileSize),v:Math.ceil(winHeight/tileSize)};
        }

		this.sh_start();
        return this;
 
    };


	$.fn.sparklingHexagons.defaults = {
    	mode:"background", //"element / background"
    	backgroundColor:"rgba(0,0,0,1)",
    	tileStrokeColor:"#0a0000",
    	tileFillColor:"#000000",
    	sparklingColor:"#0189ff",//"#cc5500",//#743f25",//"#482574"
    	speed:25,
    	intensity:25
    };
    $.fn.sparklingHexagons.background = function(numWidthHeight){
    	for(var x = 0; x < numWidthHeight.h; x++){
    		for(var y = 0; y < numWidthHeight.v; y++){
    			var tile = new SHTile(tileSize*x+tileSize/2-tileSize2/2,tileSize*y+tileSize/2-tileSize2/2);
    			this.sh_tiles.push(tile);
    		}		
    	}
    }

    $.fn.sparklingHexagons.element = function(){

    	var tile = new SHTile(this.sh_canvas[0].width/2-tileSize2/2,this.sh_canvas[0].height/2-tileSize2/2);
    	this.sh_tiles.push(tile);
    }
 
}( jQuery ));