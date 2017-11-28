let fs = require("fs")
let what = "followers"

let ff = [];
let oldList = fs.readFileSync(`${what}/${what}.json`)
oldList = JSON.parse(oldList);
let aryoldList = [];

//let newList = listgettemp;
let newList = fs.readFileSync(`${what}/test.json`)
newList = JSON.parse(newList);
let arynewList = [];

for (let i = 0; i < Object.keys(oldList.users).length; i++) {
  aryoldList.push([oldList.users[i].id, oldList.users[i].name, oldList.users[i].screen_name])
}
for (let i = 0; i < Object.keys(newList.users).length; i++) {
  arynewList.push([newList.users[i].id, newList.users[i].name, newList.users[i].screen_name])
}

//for (let i = 0; i < arynewList.length; i++) {
let i = 0
while (arynewList[0] != undefined) {
  if(aryoldList[0] == undefined){
    break;
  }
  let flag
  console.log(i)
  for (let j = 0; j < aryoldList.length; j++) {
    if (arynewList[i] != undefined) {
      if (aryoldList[j] != undefined) {
        if (arynewList[i][0] === aryoldList[j][0]) {
          ff.push(arynewList[i]);
          if (i != 0) {
            i--;
          }
          arynewList.splice(i, 1);
          aryoldList.splice(j, 1);
          flag = 1
          break;
        }
      }
    }
  }
  if(flag==1){
    flag=undefined
  }else{
    i++
  }
}
console.log("リムられ")
console.log()
console.log()
console.log(aryoldList)
console.log()
console.log()
console.log()
console.log("新規フォロ")
console.log(arynewList)
console.log()
console.log()
console.log("FF")
console.log(ff.length)
console.log()

