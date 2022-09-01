import React, { useEffect, useRef } from 'react';
import './App.css';

import { HandleCharChange } from "./TrackChanges/CharModification"
import {EventQueueHandler} from "./TrackChanges/EventQueueSystem"
import {HandleNodeRemoval} from "./TrackChanges/NodeRemoval"


function App() {

  const UndoStack = useRef([])
  const MutationQueue = useRef([])
  const MutationQueueItems = useRef(0)
  const isHandlingQueueEvent = useRef(false)

  useEffect(() => {


    const AddMutationObserver = (editorNode) => {
      
      console.error("Add Mutation Observer")

      var EditorTimer
      let observer = new MutationObserver(mutationRecords => {

        if(EditorTimer != null){
          clearTimeout(EditorTimer);
        }

        MutationQueue.current.push(mutationRecords)

        EditorTimer = setTimeout(() => MutationQueueHandler(), 2000);

        
      });

      // observe everything except attributes
      observer.observe(editorNode, {
        childList: true, // observe direct children
        subtree: true, // and lower descendants too
        characterDataOldValue: true // pass old data to callback
      });



    }

    const MutationQueueHandler = () => {

      if(MutationQueueItems.current === 0){
        isHandlingQueueEvent.current=false
      }
      
      MutationQueueItems.current+=1

      if(isHandlingQueueEvent.current) {
        return
      }

      ConsumeFromMutationQueue()

      isHandlingQueueEvent.current = true
    }

    const ConsumeFromMutationQueue = async () => {


      var mutationRecords = MutationQueue.current[0]
      var mutationArr = await RemoveDuplicateMutationEvents(mutationRecords)

      console.log(mutationArr)
      let error = await HandleMutationQueue(mutationArr)
      if(error !== null) {
        console.log("error in Mutation ", error)
      }

      MutationQueueItems.current-=1

    }


    const HandleMutationQueue = async (mutationArr) => {

      for (const mutation of mutationArr) {

        var err = null
        if (mutation.type === 'childList') {
          err = HandleChildList(mutation)
        }
        else if (mutation.type === 'attributes') {
          console.log(`The ${mutation.attributeName} attribute was modified.`);
        }
        else if (mutation.type === 'characterData') {
          err = HandleCharDataChange(mutation)
          
        }

        if(err != null){
          return err
        }
      }

      return null

    }
    
    var editor = document.getElementById("my-editor")

    editor.appendChild(AddDataToEditor())

    //Add the mutation observer
    AddMutationObserver(editor)

    //Add event listner to handle paste events
    editor.addEventListener("paste", (e) => HandlePasteEvent(e));

  }, []);


  const AddDataToEditor = () => {

    var pNode = document.createElement("P");
  
    var textNode = document.createTextNode("My name are Rohaan "); 

    var Hightlight = document.createTextNode("Highlight"); 
    var SpanNode = document.createElement("span"); 
    SpanNode.appendChild(Hightlight)

    var textNode2 = document.createTextNode(" I are an Enginear "); 

    var Hightlight2 = document.createTextNode("Highlight2"); 
    var SpanNode2 = document.createElement("span"); 
    SpanNode2.appendChild(Hightlight2)


    var textNode3 = document.createTextNode(", please "); 

    pNode.appendChild(textNode); 
    pNode.appendChild(SpanNode);
    pNode.appendChild(textNode2); 
    pNode.appendChild(SpanNode2);
    pNode.appendChild(textNode3); 
    

    return pNode

  }

  const HandlePasteEvent = (e) => {
    // cancel paste
    e.preventDefault();

    // get text representation of clipboard
    // var text = (e.originalEvent || e).clipboardData.getData('text/plain');

    // insert text manually
    // document.execCommand("insertHTML", false, text);
  }

  const RemoveDuplicateMutationEvents = async (mutationRecords) => {

    var oldValueArr = []
    var mutationArr = []
    for (const mutation of mutationRecords) {

      for(var i=0; (oldValueArr.length === 0 || i< oldValueArr.length); i++ ) {
        if(mutation.oldValue) {

          var oldValue = oldValueArr[i]
          var mutationOldValue = mutation.oldValue

          if(oldValue !== mutationOldValue){
            oldValueArr.push(mutationOldValue)
            mutationArr.push(mutation)
          }
          
        }
        else {
          oldValueArr.push("x009")
        }
      }
    }

    return mutationArr
  }

  const HandleCharDataChange = (mutation) => {

      if (!mutation.target) {
        return "mutaion targer null"
      }

      var modifiedInfo = HandleCharChange(mutation)

      if(modifiedInfo.modifiedChar.length === 0){
        return "No Modified Characters"
      }

      if(modifiedInfo.operation==="nodeRemove")
      {
        modifiedInfo.operation="remove"
        modifiedInfo.position=UndoStack.current[UndoStack.current.length-1].pos - 1
      }

      UndoStack.current = EventQueueHandler(modifiedInfo.modifiedChar, modifiedInfo.operation, modifiedInfo.position, UndoStack.current)
      
      console.log("Undo Stack", UndoStack.current)
  }

  const HandleChildList = (mutation) => {

    if(mutation.removedNodes.length > 0){

     return "No Removed Nodes Present"
    }

    var modifiedInfo  = HandleNodeRemoval(mutation.removedNodes, mutation.previousSibling)

    if(modifiedInfo.removedContent.length > 0){
      return "No Characters Removed"
    }

    UndoStack.current = EventQueueHandler(modifiedInfo.removedContent, modifiedInfo.operation, modifiedInfo.position, UndoStack.current)
    
  }


  return (
    <div className="App">
      <div contentEditable suppressContentEditableWarning="true" id="my-editor" unselectable="on">
      </div>
    </div>
  );
}

export default App;
