import React, { useContext, useEffect, useRef, useState } from "react";
import { db } from "../Context/firebase.js";
import { Create, Delete, Undo, Redo,BorderColor } from "@material-ui/icons";
import { Slider } from "@material-ui/core";
import userContext from "../Context/userContext.js";
import TutorControls from "../TutorControls/TutorControls.js";
import Chat from "../Chat/Chat.js";
import firebase from "firebase";

export default function CanvasProvider({
  roomID,
  leaveRoom,
  setRoomID,
  requestToJoin,
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [currentTool, setCurrentTool] = useState(null);
  const [color, setColor] = useState("black");
  const [undoArray, setUndoArray] = useState([]);
  const [redoArray, setRedoArray] = useState([]);
  const [lineWidth, setLineWidth] = useState(3);
  const [tutorControls, setTutorControls] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [requestLimit, setRequestLimit] = useState(null);
  const [intervalID, setIntervalID] = useState(null);

  const { isTutor } = useContext(userContext);
  const [students, setStudents] = useState([]);

  const { user } = useContext(userContext);

  useEffect(() => {
    db.collection("tutors")
      .doc(user.uid)
      .collection("currentStudents")
      .onSnapshot((snap) => {
        setStudents(snap.docs);
      });
  }, [user]);

  useEffect(() => {
    if (intervalID === null || isTutor) return;
    clearInterval(intervalID);
    setRequestLimit(null);
  }, [roomID]);

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 100;
    canvas.style.width = `${window.innerWidth - 50}px`;
    canvas.style.height = `${window.innerHeight - 100}px`;

    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // context.scale(2, 2);
    context.lineCap = "round";
  };

  const pushToDb = () => {
    const canvas = canvasRef.current;
    const lastDraw = canvas.toDataURL();
    db.collection("rooms").doc(roomID).update({
      data: lastDraw,
    });
  };
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [storedLines,setStoredLines] = useState([])

  const [imgData,setImgData] = useState('')
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const canvas = canvasRef.current;
    contextRef.current.beginPath();
    if (currentTool === "pen") {
      setImgData(contextRef.current.getImageData(0,0,canvas.width,canvas.height));
	    setStartX(offsetX)
	    setStartY(offsetY)
	    console.log(startX,startY)
    }
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = ({ nativeEvent }) => {
    if (currentTool !== "eraser") {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
	    if(currentTool==='pen')
	    {
		    const { offsetX, offsetY } = nativeEvent;
		    setStoredLines(oldArray => [...oldArray, {
            x1: startX,
            y1: startY,
            x2: offsetX,
            y2: offsetY
        }]);
        
		    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
        contextRef.current.putImageData(imgData,0,0);
		    contextRef.current.moveTo(startX, startY);
        contextRef.current.lineTo( offsetX, offsetY);
        contextRef.current.stroke();
        if (storedLines.length !== 0) {
          for (var i = 0; i < storedLines.length; i++) {
            contextRef.current.beginPath();
            contextRef.current.moveTo(storedLines[i].x1, storedLines[i].y1);
            contextRef.current.lineTo(storedLines[i].x2, storedLines[i].y2);
            contextRef.current.stroke();
          }
        }
        
	    }
      setUndoArray((p) => [
        ...p,
        context.getImageData(0, 0, canvas.width, canvas.height),
      ]);
      setRedoArray([]);
    }
    setIsDrawing(false);
    pushToDb();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    if (currentTool === "pen") {
		  const canvas = canvasRef.current;
		  contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
      contextRef.current.putImageData(imgData,0,0);
      if (storedLines.length !== 0) {
      	for (var i = 0; i < storedLines.length; i++) {
          contextRef.current.beginPath();
          contextRef.current.moveTo(storedLines[i].x1, storedLines[i].y1);
          contextRef.current.lineTo(storedLines[i].x2, storedLines[i].y2);
          contextRef.current.stroke();
        }
        console.log("start: ",startX, startY)
    	  
    	}
      
      contextRef.current.beginPath();
      contextRef.current.moveTo(startX, startY);
	    contextRef.current.lineTo(offsetX, offsetY);
    	contextRef.current.stroke();
    }
	  else
	  {
		  contextRef.current.lineTo(offsetX, offsetY);
    	contextRef.current.stroke();
	  }
    
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
	  setStoredLines([]);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    pushToDb();
  };

  const pencil = () => {
    if (currentTool === "pencil") return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    document.getElementById("canvasMain").style.cursor =
      "url('data:image/x-icon;base64,AAACAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAEAAAAAAAAAAAAAAAhYWFAPqv6ADgm4sASkpKAJ/l7QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIAAAAAAAAAAAAAAAAAAAEiIAAAAAAAAAAAAAAAAAAxEiIAAAAAAAAAAAAAAAADMxEgAAAAAAAAAAAAAAAAMzMxAAAAAAAAAAAAAAAAAzMzMAAAAAAAAAAAAAAAADMzMwAAAAAAAAAAAAAAAAMzMzAAAAAAAAAAAAAAAAAzMzMAAAAAAAAAAAAAAAADMzMwAAAAAAAAAAAAAAAABTMzAAAAAAAAAAAAAAAAAFVTMAAAAAAAAAAAAAAAAABFVQAAAAAAAAAAAAAAAAAARAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////////////////////////////////////////////////////////////////////P////h////wP///4H///8D///+B////A////gf///wP///4H///+D////B////w////8///////////////w=='), auto";
    contextRef.current = context;
    context.strokeStyle = color;
    setCurrentTool("pencil");
  };
  const pen = () => {
    if (currentTool === "pen") return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    
    document.getElementById("canvasMain").style.cursor =
      "url('data:image/x-icon;base64,AAACAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAEAAAAAAAAAAAAAAAhYWFAPqv6ADgm4sASkpKAJ/l7QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIAAAAAAAAAAAAAAAAAAAEiIAAAAAAAAAAAAAAAAAAxEiIAAAAAAAAAAAAAAAADMxEgAAAAAAAAAAAAAAAAMzMxAAAAAAAAAAAAAAAAAzMzMAAAAAAAAAAAAAAAADMzMwAAAAAAAAAAAAAAAAMzMzAAAAAAAAAAAAAAAAAzMzMAAAAAAAAAAAAAAAADMzMwAAAAAAAAAAAAAAAABTMzAAAAAAAAAAAAAAAAAFVTMAAAAAAAAAAAAAAAAABFVQAAAAAAAAAAAAAAAAAARAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////////////////////////////////////////////////////////////////////P////h////wP///4H///8D///+B////A////gf///wP///4H///+D////B////w////8///////////////w=='), auto";
    contextRef.current = context;
    context.strokeStyle = color;
    setCurrentTool("pen");
  };

  const eraser = () => {
    if (currentTool === "eraser") return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = "#fff";
    document.getElementById("canvasMain").style.cursor =
      "url('data:image/x-icon;base64,AAACAAEAICACAAAAAAAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAgAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAA66TnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAC4AAABuAAAA4AAAAdwAAAO4AAAHcAAABuAAAAXAAAADgAAAAAAAAA///////////////////////////////////////////////////////////////////////////////////////////////////////////+D////A////gP///wD///4A///8Af//+AP///AH///wD///8B////A////wf///8='), auto";
    setCurrentTool("eraser");
  };

  const undo = () => {
    if (undoArray.length <= 1) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const tempArr = undoArray;
    const lastDraw = tempArr.pop();
    setRedoArray((p) => [...p, lastDraw]);
    setUndoArray(tempArr);
    context.putImageData(undoArray[undoArray.length - 1], 0, 0);
    pushToDb();
  };

  const redo = () => {
    if (redoArray.length <= 0) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const tempArr = redoArray;
    context.putImageData(redoArray[redoArray.length - 1], 0, 0);
    const lastDraw = tempArr.pop();
    setUndoArray((p) => [...p, lastDraw]);
    setRedoArray(tempArr);
    pushToDb();
  };

  useEffect(() => {
    if (!roomID) return;
    prepareCanvas();
    pencil();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const endListener = db
      .collection("rooms")
      .doc(roomID)
      .onSnapshot((snap) => {
        const imgData = snap.data().data;
        const img = new Image();
        img.src = imgData;
        img.onload = () => {
          context.drawImage(img, 0, 0);
        };
      });
    return endListener;
  }, [roomID]);

  const removeStudent = (s) => {
    db.collection("students").doc(s.data().uid).update({ currentRoomID: null });
    db.collection("tutors")
      .doc(user.uid)
      .update({
        currentNumberOfStudents: firebase.firestore.FieldValue.increment(-1),
      });
    s.ref.delete();
  };

  useEffect(() => {
    // to change the color of the tool
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (currentTool !== "eraser") context.strokeStyle = color;
    context.lineWidth = lineWidth;
  }, [color, lineWidth, currentTool]);

  const request = () => {
    requestToJoin();
    let time = 60;
    const ID = setInterval(() => {
      --time;
      setRequestLimit(time);
      if (time === 0) {
        clearInterval(ID);
        setRequestLimit(null);
      }
    }, 1000);
    setIntervalID(ID);
  };

  return (
    <div>
      {requestLimit && (
        <div className="requestingTutor">
          <h2>Requesting a tutor - {requestLimit} seconds</h2>
        </div>
      )}
      <div id="tools">
        <button className="toolBtn" onClick={clearCanvas}>
          <Delete />
        </button>
        <button className="toolBtn" onClick={pencil}>
          <Create />
        </button>
        <button className="toolBtn" onClick={pen}>
          <BorderColor />
        </button>
        <button className="toolBtn" onClick={eraser}>
          <img src={require("../assets/eraser.png")} alt="eraser"></img>
        </button>
        <button className="toolBtn" onClick={undo}>
          <Undo />
        </button>
        <button className="toolBtn" onClick={redo}>
          <Redo />
        </button>
        <input
          type="color"
          id="colorPicker"
          onChange={(e) => setColor(e.target.value)}
        />
        <Slider
          min={1}
          max={50}
          value={lineWidth}
          onChange={(e, newVal) => setLineWidth(newVal)}
          id="lineWidthSlider"
        />
        {isTutor && (
          <button
            className="btn-canvasTool "
            onClick={() => setTutorControls(true)}
          >
            Tutor Controls
          </button>
        )}
        {isTutor && tutorControls && (
          <TutorControls
            back={() => setTutorControls(false)}
            setRoomID={setRoomID}
          />
        )}
        {!isTutor && (
          <button className="btn-canvasTool" onClick={request}>
            Request a tutor
          </button>
        )}
        <button className="btn-canvasTool" onClick={leaveRoom}>
          Leave Room
        </button>
      </div>
      <div className="tabs">
        {students.map((s) => (
          <div className={`tab ${s.data().ID === currentEmail && "activeTab"}`}>
            <button
              onClick={() => {
                setRoomID(s.data().roomID);
                setCurrentEmail(s.data().ID); // was previously email, now changed to ID
              }}
            >
              <h3>{s.data().ID}</h3>
            </button>
            <button
              onClick={() => {
                removeStudent(s);
              }}
            >
              <h3>X</h3>
            </button>
            {/* <button onClick={() => removeStudent(s)}>Remove</button> */}
          </div>
        ))}
      </div>
      <div className="canvasContainer">
        {/* {isTutor && <p className="currentEmail">{currentEmail || "None"}</p>} */}
        <canvas
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={finishDrawing}
          onTouchMove={draw}
          ref={canvasRef}
          id="canvasMain"
        />
      </div>
      {(roomID || !isTutor) && <Chat roomID={roomID} />}
    </div>
  );
}
