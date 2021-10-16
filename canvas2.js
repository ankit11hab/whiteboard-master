window.addEventListener('load', () => {

    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    canvas.height = window.innerHeight - 30
    canvas.width = window.innerWidth - 30

    var storedLines = [];
    let painting = 0;
    let startX, startY;
    document.addEventListener('mousedown', (e) => {
        painting = 1;
        //img = context.getImageData(0,0,canvas.height,canvas.width)
        ctx.beginPath()
        startX = e.clientX;
        startY = e.clientY;
    })
    let t = 0;
    restore_array = []
    document.addEventListener('mousemove', (e) => {
        if (painting == 1) {
            redrawStoredLines();
            ctx.beginPath()
            ctx.moveTo(startX, startY);
            ctx.lineTo(e.clientX, e.clientY)
            ctx.stroke()


        }

    })
    document.addEventListener('mouseup', (e) => {
        painting = 0;
        storedLines.push({
            x1: startX,
            y1: startY,
            x2: e.clientX,
            y2: e.clientY
          });
          redrawStoredLines();
    })
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
})