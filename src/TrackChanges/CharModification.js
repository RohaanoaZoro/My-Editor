
const TextContentChangeHandler = (oldValue, newValue) => {

    const oldCharArr = Array.from(oldValue);
    const newCharArr = Array.from(newValue);


    if (oldCharArr.length === newCharArr.length) {

        return {
            "modifiedChar": "", "operation": "", "position": 0
        }
    }

    // console.log("change", oldCharArr, newCharArr)

    if (oldCharArr.length < newCharArr.length) {
        return GetModifiedPos(newCharArr, oldCharArr, "insert")
    }
    else {
        return GetModifiedPos(oldCharArr, newCharArr, "remove")
    }   
    
}



const GetModifiedPos = (greaterArr, lesserArr, op) => {


    var j = 0
    var modifiedChar = ""

    for (var i = 0; i < greaterArr.length; i++) {


        if(j>=lesserArr.length){
            modifiedChar += greaterArr[i]
            break
        }

        if (greaterArr[i] !== lesserArr[j]) {

            modifiedChar += greaterArr[i]
        }
        else
        {
            j+=1
        }
    }

    if(modifiedChar.length > 1)
    {
        op="delete"
    }

    return {
        "modifiedChar": modifiedChar, "operation": op, "position": 0
    }
}



export const GetTextNodePos = (currentNode) => {

    var pos = 0

    var sel=window.getSelection().getRangeAt(0)
    pos = sel.startOffset

    //Traverse the nodes till the parent node is the editor
    while (currentNode.parentElement && currentNode.parentElement.parentElement && currentNode.parentElement.parentElement.id !== "my-editor") {
        currentNode = currentNode.parentElement
    }

    while (currentNode.previousSibling) {
        pos += currentNode.previousSibling.textContent.length
        currentNode = currentNode.previousSibling
    }

    return pos
}


export const HandleCharChange = (mutation) => {


    var pattern = /\s/g;

    var oldValue = mutation.oldValue
    var newValue = mutation.target.textContent
    var modifiedNode = mutation.target

    var prevpos = GetTextNodePos(modifiedNode)

    var modifiedInfo = TextContentChangeHandler(oldValue, newValue)

    if(modifiedInfo.operation==="remove" && oldValue.length===1 && newValue.length===0 && prevpos===-1){
        modifiedInfo.operation="nodeRemove"
    }

    //add the position of previos nodes to array
    modifiedInfo.position += prevpos

    return modifiedInfo
}
