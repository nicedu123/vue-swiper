document.body.style.overflow='hidden';
document.body.style.marginLeft='0px';

var imgvue = new Vue({
	el:'#imageblock',
	data:{
		images:[1,2,3,4,5],
		actcolor: 'green',
		directX:'',
		movedistent:0,
		innertext:'',
		animating: false,
		bTouch: false,
		isMove: false,
		index : 0,
		divs :'',
		classes:["swiper-waitleft","swiper-left","swiper-center","swiper-right","swiper-waitright"],
		leftKeyframes:["none","leftLeft","centerLeft","rightLeft","waitRightLeft"],
		rightKeyframes:["waitLeftRight","leftRight","centerRight","rightRight","none"]
	},
	methods:{
	    touchs : function () {
            var e = event;
            var XYrec = this.getdirection(e);
           	document.getElementById("test").innerHTML = XYrec[0] + '   ' + XYrec[1];
           	this.directX = XYrec[0];
           	this.divs=this.$el.children;
           	event.preventDefault();
			if(this.animating) {
				return;
			}
			this.startX = event.touches ? event.touches[0].pageX : event.pageX;
			this.bTouch = true;
			this.isMove = false;
	    },
	    touchm : function () {
				event.preventDefault();
				this.isMove = true;
				this.endX = event.touches ? event.touches[0].pageX : event.pageX;

				if(this.animating || this.bTouch == false) {
					return;
				}
				var dec = this.endX - this.startX;
				var absDec = Math.abs(dec);
				var speed = 0.2/400;

				var scales = [0.8, 0.8, 1, 0.8, 0.8];
				scales[0] = dec >= 400 ? (dec-400)*speed + 0.8 : 0.8;
				scales[0] > 1 ? scales[0] = 1 : true;

				scales[1] = dec > 0 ? dec*speed + 0.8 : 0.8;
				dec > 400 ? scales[1] = 1 - (dec-400)*speed : true;
				
				scales[2] = 1-speed*absDec;
				scales[2] < 0.8 ? scales[2] = 0.8 : true;

				scales[3] = dec < 0 ? -dec*speed + 0.8 : 0.8;
				dec < -400 ? scales[3] = 1 + (dec + 400)*speed : true;


				scales[4] = dec <= -400 ? (400-dec)*speed + 0.8 : 0.8;
				scales[4] > 1 ? scales[4] = 0.8 : true;

				var trans = [-800 + dec, -400 + dec, dec, 400+dec, 800+dec];
				for(var i=0;i<this.$el.children.length;i++) {
					// console.log(scales);
					this.divs[i].style.webkitTransform = "scale(" + scales[i] + ") translate(" + trans[i] + "px, 0) translateZ(0)";
				}
  
	    },
	    touche : function () {
            	event.preventDefault();
				this.bTouch = false;
				// console.log(this.endX +" "+this.startX);
				if ( (!this.isMove&&this.endX==0) || this.endX==undefined || this.endX==this.startX) {
					if (this.startX<100) {
						this._turnRight(180);
					}
					else if(this.startX>400) {
						this._turnLeft(180);
					}
					else
					{
						picClick();
					}
				}
				else
				{
					var dec = this.endX - this.startX;
					var absDec = Math.abs(dec);
					if(dec > 60) {
						this._turnRight(180);
					}
					else if(dec > -60) {
						this.animating = true;

						for(var i=0;i<this.divs.length;i++) {
							this.divs[i].style.webkitTransition = "transform 0.1s ease-out";
						}
						setTimeout(function(){
							for(var i=0;i<this.divs.length;i++) {
								this.divs[i].style.webkitTransform = "";
							}	
							setTimeout(function(){
								for(var i=0;i<this.divs.length;i++) {
									this.divs[i].style.webkitTransition = "";
								}
								this.animating = false;
							}.bind(this), 180);
						}.bind(this), 100);
					}
					else {
						this._turnLeft(180);
					}
					this.endX = 0;
				}
	    },
	    _turnLeft: function(time) {
				if(this.animating) {
					return;
				}
				time == undefined ? time = 360 : true;
				this.animating = true;

				for(var i = 0;i<this.divs.length;i++) {
					this.divs[i].style.webkitAnimation = this.leftKeyframes[i] + " " + time/1000 + "s ease-out 0s 1 both";
				}
				// this.index++;
				setTimeout(function(){
					this.index = (this.index + 1) % this.images.length;
					// this.index++;
					this.$el.insertBefore(this.divs[0], null);

					for(var i = 0;i<this.divs.length;i++) {
						this.divs[i].style.backgroundImage = "url(" + this.images[(i-1+this.images.length-1 + this.index)%this.images.length]["showimg"] + ")";
						this.divs[i].className = this.classes[i];
						this.divs[i].style.webkitAnimation = "";
						this.divs[i].style.webkitTransform = "";
					}
					this.animating = false;

					index = this.index;
					this.nextCB && this.nextCB(this.index);
				}.bind(this), time + 100);
			},
		_turnRight: function(time) {
				if(this.animating) {
					return;
				}
				time == undefined ? time = 360 : true;
				this.animating = true;

				for(var i = 0;i<this.divs.length;i++) {
					this.divs[i].style.webkitAnimation = this.rightKeyframes[i] + " " + time/1000 + "s ease-out 0s 1 both";
				}
				setTimeout(function(){
					this.index = (this.index - 1 + this.images.length) % this.images.length;
					this.$el.insertBefore(this.divs[this.divs.length-1], this.divs[0]);

					for(var i = 0;i<this.divs.length;i++) {
						this.divs[i].style.backgroundImage = "url(" + this.images[(i-1+this.images.length-1 + this.index)%this.images.length]["showimg"] + ")";
						this.divs[i].className = this.classes[i];
						this.divs[i].style.webkitAnimation = "";
						this.divs[i].style.webkitTransform = "";
					}
					this.animating = false;

					index = this.index;
					this.lastCB && this.lastCB(this.index);
				}.bind(this), time + 100);
		},
	    getdirection : function (e) {
	    	var XYdirection = [];
	    	XYdirection[0] = e.changedTouches["0"].clientX;
	    	XYdirection[1] = e.changedTouches["0"].clientY;
	    	return XYdirection;
	    }
	}

});