const pencil = () => {
  document.addEventListener('mousedown',()=>console.log("Pencil"))
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  document.getElementById("canvasMain").style.cursor =
    "url('data:image/x-icon;base64,AAACAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAEAAAAAAAAAAAAAAAhYWFAPqv6ADgm4sASkpKAJ/l7QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIAAAAAAAAAAAAAAAAAAAEiIAAAAAAAAAAAAAAAAAAxEiIAAAAAAAAAAAAAAAADMxEgAAAAAAAAAAAAAAAAMzMxAAAAAAAAAAAAAAAAAzMzMAAAAAAAAAAAAAAAADMzMwAAAAAAAAAAAAAAAAMzMzAAAAAAAAAAAAAAAAAzMzMAAAAAAAAAAAAAAAADMzMwAAAAAAAAAAAAAAAABTMzAAAAAAAAAAAAAAAAAFVTMAAAAAAAAAAAAAAAAABFVQAAAAAAAAAAAAAAAAAARAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////////////////////////////////////////////////////////////////////P////h////wP///4H///8D///+B////A////gf///wP///4H///+D////B////w////8///////////////w=='), auto";
    let painting = 0;
    document.addEventListener('mousedown', (e) => {
      painting = 1;
      ctx.beginPath()
    })
    document.addEventListener('mousemove', (e) => {
      if (painting == 1) {
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(e.offsetX, e.offsetY);

      }

    })
    document.addEventListener('mouseup', (e) => {
      painting = 0;
      ctx.beginPath();
    })
  contextRef.current = ctx;
  ctx.strokeStyle = color;
  
};





const pen = () => {
  if (currentTool === "pen") return;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  contextRef.current = ctx;
  ctx.strokeStyle = color;
  setCurrentTool("pen");
  
  
  
  function redrawStoredLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (storedLines.length == 0) {
      return;
    }
    // redraw each stored line
    for (var i = 0; i < storedLines.length; i++) {
      ctx.beginPath();
      ctx.moveTo(storedLines[i].x1, storedLines[i].y1);
      ctx.lineTo(storedLines[i].x2, storedLines[i].y2);
      ctx.stroke();
    }
  }


  let painting = 0;
  let startX, startY;
  document.addEventListener('mousedown', (e) => {
    
    painting = 1;
    ctx.beginPath()
    startX = e.offsetX;
    startY = e.offsetY;
  })
  let t = 0;
  document.addEventListener('mousemove', (e) => {
    if (painting == 1) {
      console.log(storedLines[0])
      redrawStoredLines();
      ctx.beginPath()
      ctx.moveTo(startX, startY);
      ctx.lineTo(e.offsetX, e.offsetY)
      ctx.stroke()


    }

  })
  document.addEventListener('mouseup', (e) => {
    painting = 0;
    if (t==1)
    {
      storedLines.length=0;
    }
    storedLines.push({
      x1: startX,
      y1: startY,
      x2: e.offsetX,
      y2: e.offsetY
    });
    redrawStoredLines();
  })
  
  document.addEventListener('mousedown',()=>console.log("Hmm"))

}