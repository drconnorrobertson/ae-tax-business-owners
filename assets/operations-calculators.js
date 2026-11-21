import { calculate } from './operations-models.js';
const number=new Intl.NumberFormat('en-US',{maximumFractionDigits:2});
const money=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'});
const preciseMoney=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:4});
const format=(value,unit)=>unit==='money'?money.format(value):unit==='money4'?preciseMoney.format(value):unit==='percent'?number.format(value)+'%':number.format(value);
for(const form of document.querySelectorAll('[data-operations-calculator]')){
 const output=form.querySelector('[data-results]');
 const clear=()=>output.replaceChildren();
 function render(){
  clear();if(!form.reportValidity())return;
  try{
   const values={};for(const input of form.querySelectorAll('input[name]')){if(!input.value.trim())throw new Error('Complete every input before calculating.');values[input.name]=Number(input.value);}
   const result=calculate(form.dataset.operationsCalculator,values);
   const list=document.createElement('dl');
   for(const [label,value,unit] of result){const term=document.createElement('dt'),description=document.createElement('dd');term.textContent=label;description.textContent=format(value,unit);list.append(term,description);}
   output.append(list);
  }catch(error){const message=document.createElement('p');message.setAttribute('role','alert');message.textContent=error.message;output.append(message);}
 }
 form.addEventListener('input',clear);form.addEventListener('change',clear);
 form.addEventListener('submit',event=>{event.preventDefault();render();});
 form.querySelector('button[type=submit]').disabled=false;render();
}
