function MyChessboard(scene, du, dv, textureref, su, sv, c1, c2, cs){
	CGFobject.call(this,scene);
	this.initBuffers();
	this.scene = scene;
	this.du = du;
	this.dv = dv;
	this.textureref = textureref;
	this.texture = new CGFtexture(this.scene,this.textureref);
	this.su = su;
	this.sv = sv;
	this.c1 = c1;
	this.c2 = c2;
	this.cs = cs;

	var dimension = 1;
	var offX = dimension/this.du;
	var offY = dimension/this.dv;


	this.chessShader = new CGFshader(this.scene.gl,"shaders/chess.vert", "shaders/chess.frag");

	this.chessShader.setUniformsValues({uSampler: 1});

	this.chessShader.setUniformsValues({c1: [this.c1[0], this.c1[1], this.c1[2], this.c1[3]]});
	this.chessShader.setUniformsValues({c2: [this.c2[0], this.c2[1], this.c2[2], this.c2[3]]});
	this.chessShader.setUniformsValues({cs: [this.cs[0], this.cs[1], this.cs[2], this.cs[3]]});
	this.chessShader.setUniformsValues({distX: offX});
	this.chessShader.setUniformsValues({distY: offY});
	this.chessShader.setUniformsValues({su: this.su});
	this.chessShader.setUniformsValues({sv: this.sv});
	this.chessShader.setUniformsValues({du: this.du});
	this.chessShader.setUniformsValues({dv: this.dv});

	this.plane = new MyPlane(this.scene, this.du, this.dv, this.du, this.dv);

};

MyChessboard.prototype = Object.create(CGFobject.prototype);
MyChessboard.prototype.constructor = MyChessboard;

MyChessboard.prototype.display = function(){

	this.texture.bind(0);
	this.scene.setActiveShader(this.chessShader);
	this.plane.display();
	this.scene.setActiveShader(this.scene.defaultShader);
}
