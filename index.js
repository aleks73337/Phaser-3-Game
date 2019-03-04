var timeScore = 0;
function timer(scene)
{
  //объявляем переменные
    var base = 60;
    var clocktimer,dateObj,dh,dm,ds,ms;
    var readout='';
    var h=1,m=1,tm=1,s=0,ts=0,ms=0,init=0;

      //функция для очистки поля
      function ClearСlock() {
     clearTimeout(clocktimer);
     h=1;m=1;tm=1;s=0;ts=0;ms=0;
     init=0;
     readout='00:00:00.00';
      }

      //функция для старта секундомера
    function StartTIME(scene, timeScore) {
     var cdateObj = new Date();
     var t = (cdateObj.getTime() - dateObj.getTime())-(s*1000);
     if (t>999) { s++; }
     if (s>=(m*base)) {
       ts=0;
       m++;
     } else {
       ts=parseInt((ms/100)+s);
       if(ts>=base) { ts=ts-((m-1)*base); }
     }
     if (m>(h*base)) {
       tm=1;
       h++;
     } else {
       tm=parseInt((ms/100)+m);
       if(tm>=base) { tm=tm-((h-1)*base); }
     }
     ms = Math.round(t/10);
     if (ms>99) {ms=0;}
     if (ms==0) {ms='00';}
     if (ms>0&&ms<=9) { ms = '0'+ms; }
     if (ts>0) { ds = ts; if (ts<10) { ds = '0'+ts; }} else { ds = '00'; }
     dm=tm-1;
     if (dm>0) { if (dm<10) { dm = '0'+dm; }} else { dm = '00'; }
     dh=h-1;
     if (dh>0) { if (dh<10) { dh = '0'+dh; }} else { dh = '00'; }
     readout = dh + ':' + dm + ':' + ds + '.' + ms;
     window.timeScore = readout;
     scoreText = scene.add.text(30, 30, readout, { font: "1px Arial", fill: "#ff0044", align: "center" });
     clocktimer = setTimeout(function(obj, text) { scoreText.destroy(); StartTIME(scene); }, 1000);
    }

    //Функция запуска и остановки
   if (init==0){
     ClearСlock();
     dateObj = new Date();
     StartTIME(scene);
     init=1;
   } else {
     clearTimeout(clocktimer);
     init=0;
  }
}

var level;
var layer = [];

function clickHandler(sprite)
{
  console.log('clicked');
}

class mainScene extends Phaser.Scene{
  constructor()
  {
    super({key:'mainScene'});
  }
    preload()
    {
        this.load.setBaseURL('http://localhost/game/');
        this.load.image('ball', 'img/index.jpg');
        this.load.image('play', 'img/play.png');
        this.load.image('tile', 'img/tile.jpg');
    }

    create()
    {
      //var map = this.make.tilemap({ key: 'map' });
      //var tiles = map.addTilesetImage('tile');
      //var layer = map.createStaticLayer('gameField', tiles, 0, 0);
      //layer.setScrollFactor(0.5);
      //layer.setAlpha(0.75);
      timer(this);
      setTimeout(function() { console.log(window.timeScore); }, 5000);

      this.fieldArray = [];
      this.fieldGroup = this.add.group();
      for (var i = 0; i < 4; i++)
      {
        this.fieldArray[i] = [];
        for (var j = 0; j < 4; j++)
        {
          var cell = this.add.sprite(150 + i*120, 150 + j*120, "tile").setInteractive();
          cell.on('clicked', function () { console.log('clicked'); }, this);
          cell.emit('clicked');
          this.fieldGroup.add(cell);
          this.fieldArray[i][j] = {
            tileValue: 1,
            tileSprite: cell,
            canUpgrade: true
        }
      }
    }

    console.log(this.fieldArray[0][0]);
  }

    update()
    {
    }
}

var config = {
              type: Phaser.AUTO,
              width: 800,
              height: 600,
              backgroundColor: "#4488AA",
              scene: [mainScene]
};
var game = new Phaser.Game(config);
