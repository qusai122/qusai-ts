const fs = require("fs")
const path = require("path")
const getData = function (filename){
    let data = fs.readFileSync(path.join(__dirname,filename));
    if(!data){return []}
    const json = JSON.parse(data);
    return json
}

const deleteFile = function (filename) {
    try{
        fs.unlinkSync(path.join(__dirname,filename))
    }catch (e) {
        console.log(e.message + ' ' + e.errorCode)
    }
}

const replaceData = function (filename, data){
    fs.writeFile(path.join(__dirname, filename), JSON.stringify(data), err => {
        if(err){
            console.log(err)
        }
        console.log("File has been updated")
    })
}

const getHTML = function (filename){
    try {
        return fs.readFileSync(path.join(__dirname,filename), "utf-8");
    }catch (e) {
        console.log(e.message)
    }

    return undefined
}
//CRUD
/*
   * Create
   * Read
   * Update
   * Delete
 */
// const arr1 = [
//     {"id": 100, "name": "dummy name 1"},
//     {"id": 200, "name": "dummy name 2"},
// ];
// const arr2 = getData("data.json")
//
// const arr3 = arr1.push(arr2)//[[elements-of-arr1], [elements-of-arr2]]
// console.log(arr3)
// // const arr3 = [...arr1, ...arr2]// ES6 [...elements-of-arr1, ...elements-of-arr2]
// // replaceData("data.json", arr3)
//

module.exports = {
    getData,
    getHTML
}