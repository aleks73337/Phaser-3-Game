var timeScore = 0;
var field_size = 5;
var level = [[3,-1,-1, 4,-1],
             [-1,-1,-1,-1,4],
             [-1,-1,-1,4,-1],
             [-1,-1, 4,-1,4],
             [2,-1,-1,-1,-1]];

var empty_cells = field_size*field_size;
var pointerdown = false;
var from_x, from_y, to_x, to_y;


function save_score(score)
{
  var gameService  = new App42Game();
  var scoreBoardService  = new App42ScoreBoard();
  App42.initialize("583bafed380bd828863b5ad474e4871081f34c9c0e8f6ab5d5c8e8fb91aab2bb","0d7e936e444e06ab988d45bc495dcbe891227120ccef0a5302c717ce37c921f5");

  var gameName = "Shikaka";
  userName = "Guest";
  gameScore = score;
  result ;
  scoreBoardService.saveUserScore(gameName,userName,gameScore,{
      success: function(object)
      {
          var game = JSON.parse(object);
          result = game.app42.response.games.game;
          console.log("gameName is : " + result.name)
          var scoreList = result.scores.score;
          console.log("userName is : " + scoreList.userName)
          console.log("scoreId is : " + scoreList.scoreId)
          console.log("value is : " + scoreList.value)
      },
      error: function(error) {
      }
  });
}


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
     readout = dm + ':' + ds;
     window.timeScore = readout;
     document.getElementsByTagName("h5")[0].innerHTML = readout;
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

function find_num_cells(chosen_cells)
{
  var counter = 0;
  var ret_val = 0;
  for (var i = 0; i < chosen_cells.length; i++)
  {
    if (chosen_cells[i].tileValue > 0)
      {
          counter++;
          ret_val = chosen_cells[i].tileValue;
          console.log(ret_val);
      }
  }
  console.log(counter);
  return ((counter == 1) ?  ret_val : 0);
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
          if ((x == x_fig) & (y == y_fig) & (cell_val != 0))
            {
              chosen_cells[counter] = fieldArray[k][l];
              counter++;
              console.log("Cell found");
            }
          if ((x == x_fig) & (y == y_fig) & (cell_val == 0))
          {
            console.log("Cell has already chosen");
            return;
          }
        }
      }
    }
  }
  num_cells = find_num_cells(chosen_cells);
  if (num_cells == 0)
    return;
  if (chosen_cells.length == num_cells)
  {
    for (var i = 0; i < chosen_cells.length; i++)
    {
      chosen_cells[i].tileSprite.blendMode = 2;
      chosen_cells[i].tileValue = 0;
    }
    empty_cells = empty_cells - num_cells;
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
        for (var i = 1; i < 10; i++)
          this.load.image(i,"img/" + i + ".jpg")
    }

    create()
    {
      timer(this);
      setTimeout(function() { console.log(window.timeScore); }, 5000);

      game.input.mouse.capture = true;

      this.fieldArray = [];
      this.fieldGroup = this.add.group();
      for (var i = 0; i < field_size; i++)
      {
        this.fieldArray[i] = [];
        for (var j = 0; j < field_size; j++)
        {
          var cell = this.add.sprite(50 + i*100, 50 +  j*100, (level[j][i] > 0) ? level[j][i] : 'tile');
          cell.data = 0;
          this.fieldGroup.add(cell);
          this.fieldArray[i][j] = {
            tileValue: level[j][i],
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
              width: 500,
              height: 500,
              backgroundColor: "#4488AA",
              scene: [mainScene],
              parent: "phaser_game"
};
var game = new Phaser.Game(config);
