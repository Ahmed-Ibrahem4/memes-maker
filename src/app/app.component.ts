
import { Component, ElementRef,QueryList ,ViewChildren,Renderer2} from '@angular/core';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // @ViewChild('html',{static:false}) body:ElementRef<HTMLElement>;
  @ViewChildren('memeTextDiv') memeTextsArr:QueryList<ElementRef>;
  constructor(private rd: Renderer2) {}
  func1: () => void;
  func2: () => void;
  func1Touch: () => void;
  func2Touch: () => void;
  getElementListener:()=> void;
  getElementListener2:()=> void;
  getElementListenerTemp:()=> void;
  selectedTextIndex:number;
  arrOfTexts:ElementRef<any>[];
  textWidth:number = 0;
  textHeight:number = 0;
  objs:{ id: number, text: string, top: string, left: string,color:string ,fontSize:string, active:boolean}[] = [];
  title = 'meme-maker';
  imgURL:any = '';
  memeText:string = '';
  topPx:string = '30px';
  leftPx:string = '0px';
  colorText:string = '#ffff00';
  fontSize:number = 25;
  tempMemeWidth:number = 450;
  tempMemeHeight:number = 550;
  memeWidth:string = '450px';
  memeHeight:string = '550px';
  textClicked:boolean = false;
  submit(file){
    file = file[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    } 
    // console.log(this.imgURL);
  }
  // clearBody=()=>{
  //   this.objs.map(property => property.active = false);
  //   // console.log("body clicked")
  // }
  save(){
    this.objs.map(property => property.active = false);
    this.textClicked = false;
    setTimeout(()=>{
      
    let element:HTMLElement = document.querySelector("#memeDownload");
    html2canvas(element ,{ scale: 2,allowTaint: true , scrollX:0, scrollY: -window.scrollY })
    .then(function(canvas) {
      // console.log(canvas);
        // Convert the canvas to blob
        canvas.toBlob(function(blob){
            // To download directly on browser default 'downloads' location
            let link = document.createElement("a");
            link.download = "Generated-MEME.jpg";
            link.href = URL.createObjectURL(blob);
            link.click();

            // To save manually somewhere in file explorer
            // window.saveAs(blob, 'image.png');

        },'image/jpg');
    });
    },1000)
    // html2canvas(document.body).then((canvas) => {
    //   document.body.appendChild(canvas);
    // });
  }
  
  oldX = 0;
  oldY = 0;
  pos1 = 0; pos2 = 0; pos3 = 0; pos4 = 0;
  pos1Touch = 0; pos2Touch = 0; pos3Touch = 0; pos4Touch = 0;
    
  // }
  dragText=(e)=>{
    // console.log("drag:",e);
    e.preventDefault();
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
      //
    //On Mobile Mode
    if(window.innerWidth < 768){
      this.pos3Touch = e.touches[0].clientX;
      this.pos4Touch = e.touches[0].clientY;
      this.func1Touch = this.rd.listen(this.arrOfTexts[this.selectedTextIndex].nativeElement,'touchend',this.colsedragText); 
      this.func2Touch = this.rd.listen(this.arrOfTexts[this.selectedTextIndex].nativeElement,'touchmove',this.elementragText); 
      
    }
      this.func1 = this.rd.listen(this.arrOfTexts[this.selectedTextIndex].nativeElement,'mouseup',this.colsedragText); 
      this.func2 = this.rd.listen(this.arrOfTexts[this.selectedTextIndex].nativeElement,'mousemove',this.elementragText);
      //
      this.textHeight = this.arrOfTexts[this.selectedTextIndex].nativeElement.offsetHeight;
      this.textWidth = this.arrOfTexts[this.selectedTextIndex].nativeElement.offsetWidth;
      // console.log(this.arrOfTexts[this.selectedTextIndex].nativeElement.style.top );
  }
  
  colsedragText=(e)=>{
      if(this.func1 && this.func2){
        this.func2();
        this.func1();
      }
      if(this.func1Touch && this.func2Touch){
        this.func2Touch();
        this.func1Touch();
      }
  }
  endDragging(){
    if(this.func1 && this.func2){
      this.func2();
      this.func1();
    }
    if(this.func1Touch && this.func2Touch){
      this.func2Touch();
      this.func1Touch();
    }
    // console.log("Ended")
  }
  elementragText=(e)=>{
    // console.log("dragTouch:");
    e.preventDefault();
    //
    if(window.innerWidth >= 768){
      this.pos1 = this.pos3 - e.clientX;
      this.pos2 = this.pos4 - e.clientY;
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
      let topVal = +this.objs[this.selectedTextIndex].top.replace('px','') - this.pos2;
      let leftVal = +this.objs[this.selectedTextIndex].left.replace('px','') - this.pos1;
      this.objs[this.selectedTextIndex].top = (topVal - 0) + "px";
      this.objs[this.selectedTextIndex].left = (leftVal + 0) + "px";
    }
    //On Mobile Mode
    if(window.innerWidth < 768){
      this.pos1Touch = this.pos3Touch - e.touches[0].clientX;
      this.pos2Touch = this.pos4Touch - e.touches[0].clientY;
      this.pos3Touch = e.touches[0].clientX;
      this.pos4Touch = e.touches[0].clientY;
      let topVal = +this.objs[this.selectedTextIndex].top.replace('px','') - this.pos2Touch;
      let leftVal = +this.objs[this.selectedTextIndex].left.replace('px','') - this.pos1Touch;
      this.objs[this.selectedTextIndex].top = (topVal - 0) + "px";
      this.objs[this.selectedTextIndex].left = (leftVal + 0) + "px";
      // console.log("Here:",this.objs[this.selectedTextIndex])
      // console.log(this.objs[this.selectedTextIndex].top ,this.objs[this.selectedTextIndex].left);
    }
  }
  check=(id:number)=>{
    // this.selectedTextIndex
    // console.log(this.view.nativeElement.children);
    this.objs.map(property => property.active = false);
     this.objs.filter((property,index)=> {
      if(property.id == id){
        this.selectedTextIndex = index;
      }
    });
    this.objs[this.selectedTextIndex].active = true;
    // console.log("ind:",this.selectedTextIndex);
    this.textClicked = true;
  }
  deleteText(){
    this.objs.splice(this.selectedTextIndex,1);
    this.arrOfTexts.splice(this.selectedTextIndex,1);
    this.textClicked = false;
    this.objs.map(property => property.active = false);
    // this.memeTextsArr.reset;
    // console.log("Del:",this.selectedTextIndex);
  }
  setTextColor(){
    this.objs[this.selectedTextIndex].color = this.colorText;
    // console.log();
  }
  setFontSize(){
    // console.log("font")
    if(this.objs[this.selectedTextIndex]){
      this.objs[this.selectedTextIndex].fontSize = this.fontSize+'px';
    }
  }
  setDimentions(){
    this.memeHeight = this.tempMemeHeight + 'px';
    this.memeWidth = this.tempMemeWidth + 'px';
  }
  counter:number = 0;
   addText(){
    //  this.selectedTextIndex = this.counter;
     let currentIndex = this.counter;
    // console.log("Before:",this.counter);
    this.objs.push({
      id:currentIndex,
      text:this.memeText,
      top:'10px',
      left:'10px',
      color:'#ff0',
      active:false,
      fontSize:'25px'
    });
     this.memeTextsArr.changes.subscribe((next)=> { 
      
      if(this.getElementListener ){
        this.getElementListener();
      }
      if(this.getElementListener2 ){
        this.getElementListener2();
      }
      this.arrOfTexts = this.memeTextsArr.toArray();
      // console.log("sub:",currentIndex);
      // this.selectedTextIndex = currentObjsLength;
      if(this.memeTextsArr.last){
        this.getElementListener =  this.rd.listen(this.memeTextsArr.last.nativeElement,'mousedown',this.dragText);
        this.getElementListener2 =  this.rd.listen(this.memeTextsArr.last.nativeElement,'touchstart',this.dragText);
    }
    this.objs.filter((property,index)=> {
      if(property.id == currentIndex){
        this.selectedTextIndex = index;
      }
    });
    // console.log("after:",this.memeTextsArr.last);
    return;
    });
    this.counter++;
    
    
  }
}
