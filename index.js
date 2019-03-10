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

var level = [[3,0,0,4,0],
             [0,0,0,0,4],
             [0,0,0,4,0],
             [0,0,4,0,4],
             [2,0,0,0,0]];

var empty_cells = 25;
var pointerdown = false;
var from_x, from_y, to_x, to_y;

function div(val, by){
    return (val - val % by) / by;
}

function find_coords()
{
  from_x_div = div(from_x, 100)
  from_y_div = div(from_y, 100)
  to_x_div = div(to_x, 100)
  to_y_div = div(to_y, 100)
  mas_x_cells = [];
  if (to_x_div >= from_x_div)
  {
    var index = 0;
    for (var i = from_x_div; i <= to_x_div; i++)
      {
        mas_x_cells[index] = i * 100;
        index++;
      }
  }
  else {
      var index = 0;
      for (var i = to_x_div; i <= from_x_div; i++)
        {
          mas_x_cells[index] = i * 100;
          index++;
    }
  }
  mas_y_cells = [];
  index = 0;
  if (to_y_div >= from_y_div)
  {
    for (var i = from_y_div; i <= to_y_div; i++)
      {
        mas_y_cells[index] = i * 100;
        console.log(i*100);
        index++;
      }
  }
  else
  {
    for (var i = to_y_div; i <= from_y_div; i++)
      {
        mas_y_cells[index] = i * 100;
        console.log(i*100);
        index++;
      }
  }
    return [mas_x_cells, mas_y_cells]
}

function find_sprites(fieldArray)
{
  var chosen_cells = [];
  var counter = 0;
  cells_chosen = find_coords();
  for (var i = 0; i < cells_chosen[0].length; i++)
  {
    for (var j = 0; j < cells_chosen[1].length; j++)
    {
      for (var k = 0; k < fieldArray.length; k++)
      {
        for (var l = 0; l < fieldArray.length; l++)
        {
          x = cells_chosen[0][i]
          y = cells_chosen[1][j]
          var cell = fieldArray[k][l].tileSprite;
          var cell_val = fieldArray[k][l].tileValue;
          var fig_coords = cell.getTopLeft(fig_coords);
          x_fig = fig_coords['x'];
          y_fig = fig_coords['y'];
          if ((x == x_fig) & (y == y_fig) & (cell_val == -1))
            {
              chosen_cells[counter] = fieldArray[k][l];
              counter++;
              console.log("Cell found");
            }
          if ((x == x_fig) & (y == y_fig) & (cell_val == 1))
          {
            console.log("Cell has already chosen");
            return;
          }
        }
      }
    }
  }
  for (var i = 0; i < chosen_cells.length; i++)
  {
    chosen_cells[i].tileSprite.blendMode = 2;
    chosen_cells[i].tileValue = 1;
  }
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
      timer(this);
      setTimeout(function() { console.log(window.timeScore); }, 5000);

      game.input.mouse.capture = true;

      this.fieldArray = [];
      this.fieldGroup = this.add.group();
      for (var i = 0; i < 5; i++)
      {
        this.fieldArray[i] = [];
        for (var j = 0; j < 5; j++)
        {
          var cell = this.add.sprite(50 + i*100, 50 +  j*100, "tile");
          cell.data = [i,j]
          this.fieldGroup.add(cell);
          this.fieldArray[i][j] = {
            tileValue: -1,
            tileSprite: cell,
            canUpgrade: true,
            bright: 0
        }
        this.fieldArray[i][j].tileSprite.setInteractive();
      //  this.fieldArray[i][j].tileSprite.on('clicked', function (tileSprite) { tileSprite.input.enabled = false; console.log(tileSprite); tileSprite.setVisible(false); }, this);
      }
    }
    this.input.on('gameobjectup', function (pointer, gameObject)
    {
      gameObject.emit('clicked', gameObject);
    }, this);
    this.input.on('pointerdown', function (pointer, gameObject) { pointerdown = true; from_x = pointer.x; from_y = pointer.y; }, this);
    this.input.on('pointerup', function (pointer, gameObject) { pointerdown = false; to_x = pointer.x; to_y = pointer.y; console.log(" from", from_x," ", from_y, " to ", to_x, " ", to_y); find_sprites(this.fieldArray);}, this);
    console.log(this.fieldArray);
  }

    update()
    {
    }
}

var config = {
              type: Phaser.AUTO,
              width: 1000,
              height: 1000,
              backgroundColor: "#4488AA",
              scene: [mainScene]
};
var game = new Phaser.Game(config);
