const GetModifiedPosRemove = (greaterArr, lesserArr, op) => {


    var j = 0
    var modifiedChar = ""

    var SpaceReplaceArr = ["#", "x", "0", "0", "q"]
    var SpaceArrIndexGreater = 0
    var TotalWhiteSpaceGreater = 0
    var SpaceArrIndexLesser = 0
    var TotalWhiteSpaLesser = 0

    var WhiteSpaceInfo

    for (var i = 0; i < greaterArr.length; i++) {

        WhiteSpaceInfo = CalculateSpaces(greaterArr[i], SpaceReplaceArr[SpaceArrIndexGreater], TotalWhiteSpaceGreater, SpaceArrIndexGreater)
        TotalWhiteSpaceGreater = WhiteSpaceInfo[0]
        SpaceArrIndexGreater = WhiteSpaceInfo[1]

        if(i< lesserArr.length){
            WhiteSpaceInfo = CalculateSpaces(lesserArr[i], SpaceReplaceArr[SpaceArrIndexLesser], TotalWhiteSpaLesser, SpaceArrIndexLesser)
            TotalWhiteSpaLesser = WhiteSpaceInfo[0]
            SpaceArrIndexLesser = WhiteSpaceInfo[1]    
        }

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

    modifiedChar.replaceAll("#x00q", " ")

    return {
        "modifiedChar": modifiedChar, "operation": op, "position": 0
    }
}

const CalculateSpaces = (Character, CompareChar, TotalWhiteSpace, SpaceArrIndex) => {

    if(Character === CompareChar){
        if(SpaceArrIndex < 4){
            SpaceArrIndex+=1
        }
        else {
            TotalWhiteSpace+=1
            SpaceArrIndex=0
        }
    }
    else {
        SpaceArrIndex=0
    }

    return [TotalWhiteSpace, SpaceArrIndex]
}