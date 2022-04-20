function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var tableId = ev.target.id;
    var item = ev.dataTransfer.getData("text");
    var price = Number(document.getElementById(item).getAttributeNode("value").value);
    addPrice(tableId,price);
    incCount(tableId);
    setItem(tableId,item,price);
    displayItems(tableId,item,price);
}
function addPrice(tableId,price){
    var index = Number(tableId.charAt(5));
    tableTotal[index-1]+=price;
    document.getElementById(tableId+"total").innerHTML=tableTotal[index-1];
}
function incCount(tableId){
    var index = Number(tableId.charAt(5));
    tableItemCount[index-1]+=1;
    document.getElementById(tableId+"ItemCount").innerHTML=tableItemCount[index-1];
}
function decCount(tableId){
    var index = Number(tableId.charAt(5));
    tableItemCount[index-1]-=1;
    document.getElementById(tableId+"ItemCount").innerHTML=tableItemCount[index-1];
}
function displayItems(tableId,item,price){
    var tableitems = document.getElementById(tableId+"Items");
    var itemString = sessionStorage.getItem(tableId);
    var itemList = JSON.parse(itemString);
    tableitems.innerHTML="";
    var text ="";
    text+='<table><tr><th>Dish</th><th>Price</th><th>Serving</th></tr>';
    for(var i = 0; i < itemList.length; i++){
        text += "<tr class='modalItem'><td>"+itemList[i].name.toUpperCase()+"</td><td>"+itemList[i].price+"</td><td><button id='"+tableId+itemList[i].name+"' class='myBtn' onclick='plusQuant(event)'>+</button>  "+itemList[i].quantity+"  <button class='myBtn' id='minus"+tableId+itemList[i].name+"' onclick='minusQuant(event)'>-</button></td></tr>";
        console.log(itemList[i].name+"  "+itemList[i].price+"  "+itemList[i].quantity);
    }
    text+="</table>";
    tableitems.innerHTML=text;
    tableitems.appendChild(document.createElement('br'));
    tableitems.appendChild(document.createTextNode("Total:"+tableTotal[tableId.charAt(5)-1]));
}
function plusQuant(ev){
    var id = ev.target.id;
    var tableId= id.substring(0,6);
    var item= id.substring(6);
    console.log(tableId+" "+item);
    var itemString = sessionStorage.getItem(tableId);
    var itemList = JSON.parse(itemString);
    var i = findItem(itemList,item)
    if(i>=0){
        itemList[i].quantity+=1;
    }
    addPrice(tableId,itemList[i].price);
    incCount(tableId);
    itemString=JSON.stringify(itemList);
    sessionStorage.setItem(tableId,itemString);
    displayItems(tableId);    
}
function minusQuant(ev){
    var id = ev.target.id;
    var tableId= id.substring(5,11);
    var item= id.substring(11);
    console.log(tableId+" "+item);
    var itemString = sessionStorage.getItem(tableId);
    var itemList = JSON.parse(itemString);
    var i = findItem(itemList,item);
    var price=-itemList[i].price;
    if(i>=0){
        if(itemList[i].quantity===1){
            itemList.splice(i,1);
            console.log(itemList);
        }else{
            itemList[i].quantity-=1;
        }        
    }
    addPrice(tableId,price);
    decCount(tableId);
    itemString=JSON.stringify(itemList);
    sessionStorage.setItem(tableId,itemString);
    displayItems(tableId);
}
function setItem(tableId,item,price){
    var itemString = sessionStorage.getItem(tableId);
    var itemList = JSON.parse(itemString);
    var i = findItem(itemList,item)
    if(i>=0){
        itemList[i].quantity+=1;
    }
    else{
        itemList.push({name:item,price:price,quantity:1});
    }
    itemString=JSON.stringify(itemList);
    console.log(itemList+" "+itemString);
    sessionStorage.setItem(tableId,itemString);
}
function findItem(itemList,item){    
    for(var i = 0; i < itemList.length; i++){
        if(itemList[i].name === item)  {
            return i;
        }
    }
    return -1;
}

function makeTotalZero(ev){
    var i = ev.target.id.charAt(5);
    tableTotal[i-1]=0;
    tableItemCount[i-1]=0;
    sessionStorage.setItem("table"+i,"[]");
    document.getElementById("table"+i+"total").innerHTML=tableTotal[i-1];
    document.getElementById("table"+i+"ItemCount").innerHTML=tableItemCount[i-1];
    document.getElementById("table"+i+"Items").innerHTML="";
}
function search(){
    var i,filter,input;
    input = document.getElementById("searchmenu").value.toLowerCase();
    var items = document.getElementsByClassName("itemName");
    var length = document.getElementsByClassName("itemName").length;
    console.log(input);
    for(i = 0; i < length; i++){
        filter = items[i].innerHTML.toLowerCase();
        console.log(filter);
        if(filter.startsWith(input)){
            document.getElementsByClassName("item")[i].style.display="block";
        }
        else{
            document.getElementsByClassName("item")[i].style.display="none";
        }
    }
}
let tableTotal=[0,0,0,0];
let tableItemCount=[0,0,0,0];
sessionStorage.setItem("table1","[]");
sessionStorage.setItem("table2","[]");
sessionStorage.setItem("table3","[]");
sessionStorage.setItem("table4","[]");

localStorage.setItem("mutton briyani",150);
localStorage.setItem("chicken briyani",120);
localStorage.setItem("chicken 65",140);
localStorage.setItem("chicken tikka",160);
localStorage.setItem("rumali roti",15);
localStorage.setItem("watter bottle",20);
localStorage.setItem("soft drink",20);
function loadMenu(){
    var menu1 = document.getElementsByClassName('menu')[0];
    var text="";
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const id= key.split(" ").join("");
        console.log(`${key}: ${localStorage.getItem(key)}`);
        text += "<div class='item' id='"+id+"' value='"+localStorage.getItem(key)+"' draggable='true' ondragstart='drag(event)'><p class='itemName'>"+key.toUpperCase()+"</p><p class='itemPrice'>Price:"+localStorage.getItem(key)+"</p></div>";

    }
    menu1.innerHTML=text;
}
loadMenu();