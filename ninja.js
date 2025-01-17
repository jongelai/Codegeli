let width = 600;
let height = 500;

let velocidad = 0.2
let vidas=3
let miraderecha=true
let doorOpen=false

const config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    backgroundColor: '#BDD8E6',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 600 }, debug: true }
    },
    scene: { preload: preload, create: create, update: update }
};

let game = new Phaser.Game(config);
let fondo, warrior, enemigos,puerta,llave,numLlave

// FUNCION PRELOAD-------------------------------------------------------------------
function preload() {
    this.load.image("fondo", "fondomovil0.png")
    this.load.image("llave", "llave.png")
    this.load.image("suelo1", "suelo1.png");
    this.load.image("suelo2", "suelo2.png");
    this.load.image("movil1", "movil1.png");
    this.load.spritesheet("warrior", "NinjaWalk.png", { frameWidth: 128, frameHeight: 36 });
    this.load.spritesheet("warriorStop", "NinjaStop.png", { frameWidth: 1024 / 8, frameHeight: 36 });
    this.load.spritesheet("warriorDeath", "NinjaDeath.png", { frameWidth: 1792 / 14, frameHeight: 47 });
    this.load.spritesheet("calavera", "calaveraRun.png", { frameWidth: 384 / 6, frameHeight: 32 });
    this.load.spritesheet("puerta", "door.png",{ frameWidth: 245 / 4, frameHeight: 60 });
   
   
    this.load.audio("Llave", "llaveWaw.wav");
    this.load.audio("salto", "saltoWaw.wav");
    this.load.audio("paso", "paso.wav");
    this.load.audio("puerta", "puertaWaw.wav");
    this.load.audio("muerto", "muerteWaw.wav");
    this.load.audio('musicaFondo', 'musica.wav');
}

// FUNCION CREATE-------------------------------------------------------------------
function create() 
{
    this.llave = this.sound.add("Llave");
    this.salto = this.sound.add("salto");
    this.paso = this.sound.add("paso");
    this.puerta = this.sound.add("puerta");
    this.muerto = this.sound.add("muerto");


    fondo = this.add.tileSprite(0, 0, 1200, 500, "fondo").setOrigin(0, 0)


    puntosText = this.add.text(80, 16, 'Puntos: 0', { fontSize: '20px', fill: '#FFFF00' });
    LlavesText = this.add.text(250, 16, 'Llaves: 10', { fontSize: '20px', fill: '#FFFF00' });
    vidasText = this.add.text(440, 16, 'Vidas: 3', { fontSize: '20px', fill: '#FFFF00' });
    musicaText = this.add.text(440, 2, 'Musica on/off (M)', { fontSize: '15px', fill: '#FFF00' }); 
    
    let hierbaGroup = this.physics.add.staticGroup();
    let objetosGroup = this.physics.add.staticGroup()
    let movilGroup = this.physics.add.group()

    let posLlaves = [
        {x:580, y:30},
        { x: 330, y: 145 },
        { x: 100, y: 220 },{x:580,y:220},
        { x: 330, y: 295 },
        { x: 100, y: 370 },{ x: 580, y: 370 },
        { x: 20, y: 450 },{ x: 350, y: 450 },{ x: 580, y: 450 } ];

    numLlave=posLlaves.length
    
        posLlaves.forEach(pos => {
        let llave = objetosGroup.create(pos.x, pos.y, "llave");
        llave.displayWidth = 20; llave.displayHeight=20
    });

    puerta = this.physics.add.sprite(40, 60, "puerta");
    puerta.displayWidth = 70;
    puerta.displayHeight = 80;  
    // Ajusta el ancho si es necesario
    puerta.body.allowGravity = false;  // Desactiva la gravedad para que no caiga
    puerta.setImmovable(true);  // Evita que se mueva si otro objeto l

    movil1 = movilGroup.create(270, 100, "movil1"); movil1.displayHeight = 20
    movil1.body.allowGravity = false
    movil1.setVelocityX(100);
    movil1.setCollideWorldBounds(true)
    movil1.setImmovable(true);
    
    function creaHierba() {
        //suelo
        for (let i = 0; i < width / 16; i++) {
            suelo = hierbaGroup.create(i * 16, height - 16, "suelo1"); suelo.displayHeight = 30;
        }
        for (let i = 0; i < width / 40; i++) { suelo = hierbaGroup.create(i * 16, 100, "suelo2") }
        //for (let i = 34; i < width / 16;  i++) { suelo= hierbaGroup.create(i * 16, 100, "suelo2") }
        for (let i = 20; i < width / 26; i++) { suelo = hierbaGroup.create(i * 16, 175, "suelo2") }
        for (let i = 34; i < width / 16; i++) { suelo = hierbaGroup.create(i * 16, 250, "suelo2") }
        for (let i = 5; i < width / 40; i++) { suelo = hierbaGroup.create(i * 16, 250, "suelo2") }
        for (let i = 20; i < width / 20; i++) { suelo = hierbaGroup.create(i * 16, 325, "suelo2") }
        for (let i = 5; i < width / 40; i++) { suelo = hierbaGroup.create(i * 16, 400, "suelo2") }
        for (let i = 34; i < width / 16; i++) { suelo = hierbaGroup.create(i * 16, 400, "suelo2") }
    }
    creaHierba.call(this);

    //Crea enemigos
    
    enemigos = this.physics.add.group()
  
   
    
    function creaEnemigos(){
         let posiciones = [
        [20,400,20,580],
        [100, 300,80,220],
        [100, 150,80,230],
        [350, 250,320,460] ];
    
        posiciones.forEach(pos => {
        let enemigo = enemigos.create(pos[0], pos[1], "calavera");
        enemigo.setScale(1.2);

        enemigo.Vel = Phaser.Math.Between(90,120)
        enemigo.setVelocityX(enemigo.Vel);
        enemigo.setSize(30,32)
        enemigo.setCollideWorldBounds(true) 
        enemigo.minX = pos[2]; 
        enemigo.maxX = pos[3];
        enemigo.anims.play("RunEnemigo", true); 
        })}

    creaEnemigos()

    warrior = this.physics.add.sprite(100, 0, "warrior").setScale(1.4);
    warrior.body.setSize(28, 34);
    warrior.setCollideWorldBounds(true);
 

    //animación warrior
    this.anims.create({ key: "Run",
        frames: this.anims.generateFrameNumbers("warrior", { start: 0, end: 9 }),
        frameRate: 12, repeat: -1 });
    this.anims.create({ key: "Stop",
        frames: this.anims.generateFrameNumbers("warriorStop", { start: 0, end: 7 }),
        frameRate: 12, repeat: -1 });
    this.anims.create({ key: "Death",
        frames: this.anims.generateFrameNumbers("warriorDeath", { start: 0, end: 13 }),
        frameRate: 10, repeat: 0 });

    //Animacion Enemigo
    this.anims.create({ key: "RunEnemigo",
        frames: this.anims.generateFrameNumbers("calavera", { start: 0, end: 5 }),
        frameRate:10, repeat: -1 });

    this.anims.create({ key: "abre",
        frames: this.anims.generateFrameNumbers("puerta", { start: 0, end: 3 }),
        frameRate: 6, repeat: 0 });

    //Colisiones
    this.physics.add.collider(enemigos, hierbaGroup);
    this.physics.add.collider(warrior, hierbaGroup);
    this.physics.add.collider(warrior, movilGroup, subido, null, this);
    this.physics.add.overlap(warrior, enemigos,muerto,null,this);  
    this.physics.add.overlap(warrior, objetosGroup,cogeLlave,null,this)
    
    function cogeLlave(warrior,llave){
        llave.disableBody(true,true)
        numLlave =numLlave-1;
        LlavesText.setText('Llaves: ' + numLlave); 
        this.llave.play()
         if (numLlave===0) {
            puerta.anims.play("abre", true);
            doorOpen=true  }}

    function muerto(warrior, enemigo){       
        warrior.anims.play("Death", true);
        warrior.setVelocityX(0); warrior.setVelocityY(0); 
        warrior.setCollideWorldBounds(false);
        enemigo.destroy()
        vidas -=1; 
        vidasText.setText('Vidas: ' + vidas);
        this.muerto.play()

        warrior.on('animationcomplete', function () {// Al finalizar la animación, reiniciar la posición
           
            if (vidas===0) {
            console.log("Estas Muerto")}
            warrior.x = 100;
            warrior.y = 0;
            enemigos.clear(true, true);
            creaEnemigos()
            warrior.setCollideWorldBounds(true);             
             
        }, this); }

    function subido(warrior, movil) {         }

    //Teclas
    cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    let musicaFondo = this.sound.add('musicaFondo', { volume: 2, loop: true });
    musicaFondo.play();
    let teclaM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    let teclaP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

    // Evento para detener/reanudar la música al presionar "M"
    teclaM.on('down', () => {
        if (musicaFondo.isPlaying) {
            musicaFondo.stop();
        } else {
            musicaFondo.play();
        }
    });

    
} 
// FUNCION ACTUALIZAR-------------------------------------------------------------------
function update()
{

    if (warrior.anims.currentAnim && warrior.anims.currentAnim.key === "Death" && warrior.anims.isPlaying) {
        return;  }
   
    if (doorOpen) { 
        this.puerta.play()
        doorOpen=false }

    warrior.setVelocityX(0); 
    fondo.tilePositionX += velocidad

    enemigos.children.iterate(function (enemigo) {
        if (enemigo.x <= enemigo.minX) {
            enemigo.setVelocityX(enemigo.Vel);
            enemigo.setFlipX(false); 
            enemigo.anims.play("RunEnemigo", true);  }
                
        if (enemigo.x >= enemigo.maxX) {
            enemigo.setVelocityX(-enemigo.Vel); 
            enemigo.setFlipX(true); 
            enemigo.anims.play("RunEnemigo", true);  }  
        });

    if (movil1.x > 500) movil1.setVelocityX(-100);
    if (movil1.x < 270) movil1.setVelocityX(100)

    
    if (!cursors.left.isDown && !cursors.right.isDown) 
        if (miraderecha)
            {warrior.anims.play("Stop", true);}
        if (!miraderecha){
            warrior.setFlipX(true);
            warrior.anims.play("Stop", true); }
        
    // Movimiento a la izquierda
    if (cursors.left.isDown) {
        warrior.setVelocityX(-160);
        warrior.setFlipX(true);
        warrior.anims.play("Run", true);
        if (!this.paso.isPlaying) this.paso.play();   }

    // Movimiento a la derecha
    if (cursors.right.isDown) {
        warrior.setVelocityX(160);
        warrior.setFlipX(false);
        warrior.anims.play("Run", true);
        if (!this.paso.isPlaying) this.paso.play();
        miraderecha=true                   }
 
    // Movimiento hacia arriba (salto)
    if (this.spaceKey.isDown || cursors.up.isDown) {
        
        if (warrior.body.touching.down) {
            warrior.setVelocityY(-350);
            this.salto.play()
        }
    }
    
}
