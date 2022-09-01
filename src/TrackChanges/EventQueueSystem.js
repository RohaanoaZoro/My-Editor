

export const EventQueueHandler = (content, operation, pos, UndoStack) => {

    var lastEvent = UndoStack[UndoStack.length-1]
    var EventDetails = {}

    if(operation === "insert")
    {
        EventDetails = EventOperationHandler(content, operation, pos, lastEvent, content.length)
    }
    else if(operation === "remove")
    {
        EventDetails = EventOperationHandler(content, operation, pos, lastEvent, -1*content.length)
    }
    else if(operation === "delete")
    {
        EventDetails = EventOperationHandler(content, "remove", pos, lastEvent, 0)

    }

    if(EventDetails.isNewEvent)
    {
        UndoStack.push(EventDetails.event)

        return UndoStack
    }

    UndoStack[UndoStack.length-1] = EventDetails.event    

    return UndoStack

}

const EventOperationHandler = (content, operation, pos, lastEvent, posDifference) => {

    if( lastEvent && lastEvent.operation === operation && pos ===  lastEvent.pos + posDifference){

        if(posDifference < 0) 
        {
            lastEvent.content = content+lastEvent.content
        }
        else 
        {
            lastEvent.content += content
        }

        lastEvent.pos = pos

        return {isNewEvent: false, event: lastEvent}
    }

    var newEvent = {
        isNewEvent: true, 
        event: {
            operation: operation,
            content: content,
            pos: pos
        }
    }

    return newEvent


}