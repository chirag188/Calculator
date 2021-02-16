import { Component, HostListener, OnInit } from '@angular/core';
import { Cal } from './Cal.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'Calculator';
  lastExpression = "";
  lastOprator!:string;
  lastvalue!:number;
  flag = true;
  pointFlag = false;
  alertForInvalidInput = "";
  recent = false;
  inputValue!:string;
  calculation!:Cal[]
  ngOnInit(){
    this.inputValue = "0";
    this.lastvalue = 0;
    this.lastOprator = "";
    this.calculation = [];
    const data = localStorage.getItem("Calculator");
    if(data){
      for(let i of JSON.parse(data)){
        this.calculation.push(new Cal(i.op1,i.op2,i.op,i.result));
      }
    }
  }
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(document.getElementById(event.key)){
      document.getElementById(event.key)?.focus();
      document.getElementById(event.key)?.click();
    }
    else{
      console.log(event.key,"is not valid");
      this.alertForInvalidInput = event.key + " is not valid";
      setTimeout(() => {
        this.alertForInvalidInput = "";
      },3000);
    }
    // if(this.isNumber(event.key)){
    //   this.inNumber(+event.key);
    // }
    // else{
    //   console.log(event.key);
    //   switch(event.key){
    //     case "Backspace":
    //       document.getElementById(event.key)?.focus();
    //       this.removeLastDigit();
    //       break;
    //     case "." || "=":
    //       this.op(event.key);
    //       break;
    //     case "+" || "-" || "/":
    //       this.oprator(event.key);
    //       break;
    //     case "Enter":
    //       this.op("=");
    //       break;
    //     default:
    //       console.log("wrong input");
    //   }
    // }
  }
  // isNumber(i:string):boolean{
  //   if(!isNaN(+i))
  //     return true;
  //   return false;
  // }
  inNumber(n:number){
    if(this.flag){
      this.inputValue = n.toString();
      this.flag = false;
    }
    else
      this.inputValue = this.inputValue + n.toString();
  }
  clearInput(){
    this.inputValue = "0";
  }
  removeLastDigit(){
    const n = this.inputValue.length;
    if(this.inputValue.charAt(n-1) === "."){
      this.pointFlag = false;
    }
    this.inputValue = this.inputValue.slice(0,this.inputValue.length-1);
    this.flag = false;
  }
  clearExpression(){
    this.lastvalue = 0;
    this.lastExpression = "";
    this.inputValue = "0";
  }
  operationWithX(n:number){
    this.inputValue = Math.pow(+this.inputValue,n).toFixed(4).toString();
    this.lastExpression = "";
  }
  oprator(op:string){
    if(this.lastvalue === 0){
      this.lastvalue = +this.inputValue;
    } else if(!this.flag){
      const cal = new Cal(this.lastvalue,+this.inputValue,op,this.lastvalue);
    switch(this.lastOprator){
      case "+":
        this.lastvalue += +this.inputValue;
        break;
      case "-":
        this.lastvalue -= +this.inputValue;
        break;
      case "x":
        this.lastvalue *= +this.inputValue;
        break;
      case "/":
        console.log(this.inputValue);
        this.lastvalue /= +this.inputValue;
        break;
      case "%":
        this.lastvalue = this.lastvalue % +this.inputValue;
        break;
    }
    cal.result = this.lastvalue;
    this.calculation.push(cal);
    localStorage.setItem("Calculator",JSON.stringify(this.calculation));
    }
    this.flag = true;
    this.lastOprator = op;
    this.lastExpression = this.lastvalue + " " + op + " ";
    this.pointFlag = false;
  }
  op(op:string){
    switch(op){
      case "+-":
        this.inputValue = (- +this.inputValue).toString();
        return;
      case ".":
        if(!this.pointFlag && !this.flag){
          this.inputValue += ".";
          this.pointFlag = true;
        }
        return;
      case "=":
        this.flag = false;
        this.oprator(this.lastOprator);
        if(+this.inputValue === 0 && this.lastOprator === "/")
          this.inputValue = "Can't divide by Zero";
        else
          this.inputValue = (+this.lastvalue).toString();
        this.lastvalue = 0;
        this.lastExpression = "";
        return;
    }
  }
  recentCalculation(){
    this.recent = !this.recent;
  }
}