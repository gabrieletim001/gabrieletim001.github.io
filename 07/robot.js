Robot = function (x, y, z) {
	// head, neck, torso
	var fromHelper = HELPER.cylinderSkeletonMesh(3, 5, "red");
	var geometry = fromHelper[0];
	var material = fromHelper[1];
	var bones = fromHelper[2];

	var mesh = new THREE.SkinnedMesh(geometry, material);
	var skeleton = new THREE.Skeleton(bones);
	mesh.add(bones[0]); // anchor for our skeleton
	mesh.bind(skeleton);

	this.root = bones[0];
	this.root.position.set(x, y, z);

	this.head = bones[1]; // new THREE.Bone();

	this.neck = bones[2]; // new THREE.Bone();
	this.neck.position.y = 25;

	this.torso = bones[3]; // new THREE.Bone();
	this.torso.position.y = -35;

	this.body_mesh = mesh;

	// left arm and hand
	var fromHelper = HELPER.cylinderSkeletonMesh(3, 5, "red");
	var geometry = fromHelper[0];
	var material = fromHelper[1];
	var bones = fromHelper[2];

	var mesh = new THREE.SkinnedMesh(geometry, material);
	var skeleton = new THREE.Skeleton(bones);
	mesh.add(bones[0]);
	mesh.bind(skeleton);

	this.neck.add(bones[0]);

	this.left_upperarm = bones[1]; // new THREE.Bone();
	this.left_upperarm.position.y = -5;
	this.left_upperarm.position.x = 5;

	this.left_lowerarm = bones[2]; 
	this.left_lowerarm.position.y = -15;
	this.left_lowerarm.position.x = 5;

	this.left_hand = bones[3]; 
	this.left_hand.position.x = 5;
	this.left_hand.position.y = -5;

	this.leftarm_mesh = mesh;

	// left leg and foot
	var fromHelper = HELPER.cylinderSkeletonMesh(3, 5, "white");
	var geometry = fromHelper[0];
	var material = fromHelper[1];
	var bones = fromHelper[2];

	var mesh = new THREE.SkinnedMesh(geometry, material);
	var skeleton = new THREE.Skeleton(bones);
	mesh.add(bones[0]); 
	mesh.bind(skeleton);

	this.torso.add(bones[0]);

	this.left_upperleg = bones[1]; 
	this.left_upperleg.position.x = 5;
	this.left_upperleg.position.y = -5;

	this.left_lowerleg = bones[2]; 
	this.left_lowerleg.position.x = 5;
	this.left_lowerleg.position.y = -15;

	this.left_foot = bones[3]; 
	this.left_foot.position.x = 5;
	this.left_foot.position.y = -5;

	this.leftleg_mesh = mesh;

	// right arm and hand
	var fromHelper = HELPER.cylinderSkeletonMesh(3, 5, "red");
	var geometry = fromHelper[0];
	var material = fromHelper[1];
	var bones = fromHelper[2];

	var mesh = new THREE.SkinnedMesh(geometry, material);
	var skeleton = new THREE.Skeleton(bones);
	mesh.add(bones[0]); 
	mesh.bind(skeleton);

	this.neck.add(bones[0]);

	this.right_upperarm = bones[1]; 
	this.right_upperarm.position.y = -5;
	this.right_upperarm.position.x = -5;

	this.right_lowerarm = bones[2]; 
	this.right_lowerarm.position.y = -15;
	this.right_lowerarm.position.x = -5;

	this.right_hand = bones[3]; 
	this.right_hand.position.x = -5;
	this.right_hand.position.y = -5;

	this.rightarm_mesh = mesh;

	// right leg and foot
	var fromHelper = HELPER.cylinderSkeletonMesh(3, 5, "red");
	var geometry = fromHelper[0];
	var material = fromHelper[1];
	var bones = fromHelper[2];

	var mesh = new THREE.SkinnedMesh(geometry, material);
	var skeleton = new THREE.Skeleton(bones);
	mesh.add(bones[0]); 
	mesh.bind(skeleton);

	this.torso.add(bones[0]);

	this.right_upperleg = bones[1]; 
	this.right_upperleg.position.x = -5;
	this.right_upperleg.position.y = -5;

	this.right_lowerleg = bones[2]; 
	this.right_lowerleg.position.x = -5;
	this.right_lowerleg.position.y = -15;

	this.right_foot = bones[3]; 
	this.right_foot.position.x = -5;
	this.right_foot.position.y = -5;

	this.rightleg_mesh = mesh;

	this.movement = null;
};

Robot.prototype.show = function (scene) {
	scene.add(this.body_mesh);
	scene.add(this.leftarm_mesh);
	scene.add(this.leftleg_mesh);
	scene.add(this.rightarm_mesh);
	scene.add(this.rightleg_mesh);
};

Robot.prototype.raise_left_arm = function () {
	this.movement = "raise left arm";
};

Robot.prototype.lower_left_arm = function () {
	this.movement = "lower left arm";
};

Robot.prototype.kick = function () {
	this.movement = "kick";
};

Robot.prototype.dance = function () {
	this.movement = "dance";
};

Robot.prototype.onAnimate = function () {
	if (this.movement == "raise left arm") {
		var T = Math.PI;
		this.left_upperarm.quaternion.slerp(
			new THREE.Quaternion(
				Math.sin(-T / 2), // w
				0, // x
				0, // y
				Math.cos(-T / 2)
			), // z
			0.1
		);
	} else if (this.movement == "lower left arm") {
		this.left_upperarm.quaternion.slerp(new THREE.Quaternion(0, 0, 0, 1), 0.1);
	} else if (this.movement == "kick") {
		// check if slerp reached almost the end
		if (this.right_upperleg.quaternion.w < 0.72) {
			this.movement = "kick done";
		} else {
			var T = -Math.PI / 2;
			this.right_upperleg.quaternion.slerp(
				new THREE.Quaternion(
					Math.sin(T / 2), // x
					0, // y
					0, // z
					Math.cos(T / 2)
				), // w
				0.1
			);
		}
	} else if (this.movement == "kick done") {
		// reset leg back to identity
		this.right_upperleg.quaternion.slerp(new THREE.Quaternion(0, 0, 0, 1), 0.1);
	} else if (this.movement == "dance") {
		if (typeof this.dancer === "undefined") {
			this.dancer = setInterval(
				function () {
				
					var shakehead = 3 * Math.random();
					if (Math.random() < 0.5) {
						shakehead *= -1;
					}

					var shakeneck = 3 * Math.random();
					if (Math.random() < 0.5) {
						shakeneck *= -1;
					}

					var shaketorso = 3 * Math.random();
					if (Math.random() < 0.5) {
						shaketorso *= -1;
					}

					this.head.position.x += shakehead;

					this.neck.position.x += shakeneck;

					this.torso.position.x += shaketorso;

					//
					// use actions
					//
					if (Math.random() < 0.3) {
						this.raise_left_arm();
					}

					if (Math.random() < 0.3) {
						this.lower_left_arm();
					}

					if (Math.random() < 0.3) {
						this.kick();
					}

					if (Math.random() < 0.3) {
						this.movement = "kick done";
					}
				}.bind(this),
				500
			);
		}
	}
};
