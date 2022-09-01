
export const HandleNodeRemoval = (removedNodes, prevNode) => {

    var removedContent = ""
    for(var j=0; j<removedNodes.length; j++){
        removedContent += removedNodes[j].textContent
    }

    var pos = GetPos(prevNode)

    return {
        "removedContent": removedContent, "operation": "delete", "position": pos
    }

}

const GetPos = (prevNode) => {

    var pos = 0
    while(prevNode){

        pos+=prevNode.textContent.length

        // console.log("prevNode", prevNode.textContent, pos, prevNode)

        prevNode=prevNode.previousSibling
    }

    return pos

}