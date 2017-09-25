class StopWatch{
  constructor(){
    this.timerID = undefined;
    this.time = 0;
    this.tshow = document.getElementById("tshow");
    this.trecord = document.getElementById("trecord");
    var button = document.getElementsByTagName("button")
    button[0].onclick = this.start_stop.bind(this);
    button[1].onclick = this.reset.bind(this);
    button[2].onclick = this.record.bind(this);
    document.onkeypress = this.keyz.bind(this);
  }
  format(time){
    return (time/100).toFixed(2);
  }
  start_stop(){
    if(this.timerID!==undefined){
      clearInterval(this.timerID);
      this.timerID=undefined;
      return;
    }

    this.timerID = setInterval(()=>{
      this.time++;
      this.tshow.innerHTML = this.format(this.time);
    },1)
  }
  reset(){
    clearInterval(this.timerID);
    this.time = 0;
    this.timerID = undefined;
    tshow.innerHTML = this.time
    trecord.innerHTML = ""
  }
  record(){
    trecord.innerHTML += this.format(this.time)+"<br/>";
  }
  keyz(e) {
    if (e.key == 'r') this.reset()
    else if (e.key == 's') this.start_stop()
    else if (e.key == 't') this.record()
  }
}

var stopwatch = new StopWatch();