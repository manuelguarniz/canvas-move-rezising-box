let moveBox = false;
const delta = {};
const canvas = document.getElementById("lienzo");
let x = canvas.width / 4;
let y = canvas.height / 4;
const heightBox = 150;
const widthBox = 150;

let canvasSelected = null;

console.log("Width", canvas.width);
console.log("Height:", canvas.height);

const graphs = [
  [x, y, widthBox, heightBox, "#000080"],
  [x + 50, y + 50, widthBox, heightBox, "#800080"],
  [x + 100, y + 100, widthBox, heightBox, "#008080"],
]

console.log(graphs);

const onDrawBox = (ctx, x, y, width, height, color = "#000000") => {
  // ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  // ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

const oMousePosition = (event) => {
  const rect = canvas.getBoundingClientRect();
  // console.log("clicked:", rect);
  return {
    x: Math.round(event.clientX - rect.left),
    y: Math.round(event.clientY - rect.top),
  };
}

const onEvents = (ctx) => {
  
  canvas.addEventListener(
    "mousedown",
    function (event) {
      const mousePosition = oMousePosition(event);
      console.log("position mouse clicked! ", mousePosition)
      
      drawMultiBox(ctx);

      moveBox = true;

      const graphReverse = [...graphs];

      canvasSelected = graphReverse.reverse().find(item =>
        mousePosition.x >= item[0] && mousePosition.x <= (item[0] + item[2])
        && mousePosition.y >= item[1] && mousePosition.y <= (item[1] + item[3]));

      // delta.x = 0;
      // delta.y = 0;
      delta.x = Math.abs(mousePosition.x - canvasSelected[0]);
      delta.y = Math.abs(mousePosition.y - canvasSelected[1]);

      console.log("element selected:", canvasSelected);
    },
    false
  );

  canvas.addEventListener(
    "mousemove",
    function (event) {
      const mousePosition = oMousePosition(event);


      if (moveBox && canvasSelected) {
        console.log("current position mouse:", mousePosition)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        x = mousePosition.x - delta.x;
        y = mousePosition.y - delta.y;

        canvasSelected[0] = x;
        canvasSelected[1] = y;

        const graphIndex = graphs.findIndex(item => item[4] === canvasSelected[4]);

        graphs[graphIndex] = canvasSelected;

        console.log("element modified:", canvasSelected);

        drawMultiBox(ctx);
      }
    },
    false
  );

  canvas.addEventListener(
    "mouseup",
    function (event) {
      moveBox = false;
      console.log("new position:", canvasSelected);
      canvasSelected = null;
    },
    false
  );
}

const drawMultiBox = (ctx) => {
  for (const graph of graphs) {
    onDrawBox(ctx, graph[0], graph[1], graph[2], graph[3], graph[4]);
  }
}

const onInitialDraw = () => {
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // onDrawBox(ctx, x-50, y-50, widthBox, heightBox);
      // onDrawBox(ctx, x, y, widthBox, heightBox);
      drawMultiBox(ctx);
      onEvents(ctx);
    }
  }
}

onInitialDraw();