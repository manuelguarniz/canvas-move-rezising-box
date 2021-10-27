const canvas = document.getElementById("lienzo");
const HEIGHT_BOX = 150;
const WIDTH_BOX = 150;
const WIDTH_BOX_ANGLE = 10;
const HEIGHT_BOX_ANGLE = 10;
const CENTER_X_CANVAS = canvas.width / 4;
const CENTER_Y_CANVAS = canvas.height / 4;

const canvasProps = {
  elementSelected: null,
  idAngleSelected: null,
  // Offset segun cuadrante
  boxOffset: {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    x3: 0,
    y3: 0,
    x4: 0,
    y4: 0,
  },
};

const boxs = [
  {
    id: "box1",
    x: 50,
    y: 50,
    width: WIDTH_BOX,
    height: HEIGHT_BOX,
    weight: 1,
    type: "stroke",
    color: "#000080",
    angleMoved: [],
  },
  {
    id: "box2",
    x: 175,
    y: 125,
    width: WIDTH_BOX,
    height: HEIGHT_BOX,
    weight: 1,
    type: "stroke",
    color: "#800080",
    angleMoved: [],
  },
  {
    id: "box3",
    x: 245,
    y: 189,
    width: WIDTH_BOX,
    height: HEIGHT_BOX,
    weight: 1,
    type: "stroke",
    color: "#008080",
    angleMoved: [],
  },
];

const onAddAnglesBoxs = () => {
  boxs.forEach((item) => {
    item.angleMoved = [
      (self) => ({
        id: "top_left",
        x: self.x,
        y: self.y,
        width: WIDTH_BOX_ANGLE,
        height: HEIGHT_BOX_ANGLE,
        weight: 1,
        type: "fill",
        color: self.color,
      }),
      (self) => ({
        id: "top_right",
        x: self.x + self.width - WIDTH_BOX_ANGLE,
        y: self.y,
        width: WIDTH_BOX_ANGLE,
        height: HEIGHT_BOX_ANGLE,
        weight: 1,
        type: "fill",
        color: self.color,
      }),
      (self) => ({
        id: "bottom_left",
        x: self.x,
        y: self.y + self.height - HEIGHT_BOX_ANGLE,
        width: WIDTH_BOX_ANGLE,
        height: HEIGHT_BOX_ANGLE,
        weight: 1,
        type: "fill",
        color: self.color,
      }),
      (self) => ({
        id: "bottom_right",
        x: self.x + self.width - WIDTH_BOX_ANGLE,
        y: self.y + self.height - HEIGHT_BOX_ANGLE,
        width: WIDTH_BOX_ANGLE,
        height: HEIGHT_BOX_ANGLE,
        weight: 1,
        type: "fill",
        color: self.color,
      }),
    ];
  });
};

const oMousePosition = (event) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.round(event.clientX - rect.left),
    y: Math.round(event.clientY - rect.top),
  };
};

const identifyBoxClicked = (mousePosition, item) =>
  mousePosition.x >= item.x &&
  mousePosition.x <= item.x + item.width &&
  mousePosition.y >= item.y &&
  mousePosition.y <= item.y + item.height;

const angleSelected = (mousePosition, boxSelected) => {
  const anglesSelected = boxSelected.angleMoved
    .map((item) => item(boxSelected))
    .find((item) => identifyBoxClicked(mousePosition, item));

  return anglesSelected?.id;
};

const onEvents = (ctx) => {
  canvas.addEventListener(
    "mousedown",
    function (event) {
      const mousePosition = oMousePosition(event);

      drawMultiBox(ctx);

      const boxReverse = [...boxs];

      // Invertir el orden para que la seleccion empiece desde el ultimo renderizado
      const boxSelected = boxReverse
        .reverse()
        .find((item) => identifyBoxClicked(mousePosition, item));

      if (boxSelected) {
        canvasProps.elementSelected = boxSelected;
        canvasProps.boxOffset.x1 = Math.abs(
          boxSelected.x + boxSelected.width - mousePosition.x
        );
        canvasProps.boxOffset.y1 = Math.abs(mousePosition.y - boxSelected.y);
        canvasProps.boxOffset.x2 = Math.abs(mousePosition.x - boxSelected.x);
        canvasProps.boxOffset.y2 = Math.abs(mousePosition.y - boxSelected.y);
        canvasProps.boxOffset.x3 = canvasProps.boxOffset.x2;
        canvasProps.boxOffset.y3 = Math.abs(
          boxSelected.height + boxSelected.y - mousePosition.y
        );
        canvasProps.boxOffset.x4 = canvasProps.boxOffset.x1;
        canvasProps.boxOffset.y4 = canvasProps.boxOffset.y3;
        canvasProps.idAngleSelected = angleSelected(mousePosition, boxSelected);
      }
    },
    false
  );

  const calculateRenderizeBox = (mousePosition) => {
    if (canvasProps.idAngleSelected === "top_left") {
      const newPositionX = mousePosition.x - canvasProps.boxOffset.x2;
      const newPositionY = mousePosition.y - canvasProps.boxOffset.y2;
      const desplazamientoX = canvasProps.elementSelected.x - newPositionX;
      const desplazamientoY = canvasProps.elementSelected.y - newPositionY;

      return {
        x: newPositionX,
        y: newPositionY,
        width: canvasProps.elementSelected.width + desplazamientoX,
        height: canvasProps.elementSelected.height + desplazamientoY,
      };
    }
    if (canvasProps.idAngleSelected === "top_right") {
      const newPositionX = mousePosition.x + canvasProps.boxOffset.x1;
      const newPositionY = mousePosition.y - canvasProps.boxOffset.y1;
      const desplazamientoX =
        newPositionX -
        canvasProps.elementSelected.width -
        canvasProps.elementSelected.x;
      const desplazamientoY = canvasProps.elementSelected.y - newPositionY;

      return {
        y: newPositionY,
        width: canvasProps.elementSelected.width + desplazamientoX,
        height: canvasProps.elementSelected.height + desplazamientoY,
      };
    }
    if (canvasProps.idAngleSelected === "bottom_left") {
      const newPositionX = mousePosition.x - canvasProps.boxOffset.x3;
      const desplazamientoX = canvasProps.elementSelected.x - newPositionX;

      const currentHeigth =
        canvasProps.elementSelected.height + canvasProps.elementSelected.y;
      const desplazamientoY =
        mousePosition.y + canvasProps.boxOffset.y3 - currentHeigth;

      return {
        x: newPositionX,
        width: canvasProps.elementSelected.width + desplazamientoX,
        height: canvasProps.elementSelected.height + desplazamientoY,
      };
    }
    if (canvasProps.idAngleSelected === "bottom_right") {
      return {
        width:
          mousePosition.x -
          canvasProps.elementSelected.x +
          canvasProps.boxOffset.x4,
        height:
          mousePosition.y -
          canvasProps.elementSelected.y +
          canvasProps.boxOffset.y4,
      };
    }
  };

  const calculatePositionBox = (mousePosition) => {
    return {
      x: mousePosition.x - canvasProps.boxOffset.x2,
      y: mousePosition.y - canvasProps.boxOffset.y2,
    };
  };

  canvas.addEventListener(
    "mousemove",
    function (event) {
      const mousePosition = oMousePosition(event);

      if (canvasProps.elementSelected) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const newPosition = canvasProps.idAngleSelected
          ? calculateRenderizeBox(mousePosition)
          : calculatePositionBox(mousePosition);

        canvasProps.elementSelected = {
          ...canvasProps.elementSelected,
          ...newPosition,
        };

        const graphIndex = boxs.findIndex(
          (item) => item.id === canvasProps.elementSelected.id
        );

        boxs[graphIndex] = canvasProps.elementSelected;

        drawMultiBox(ctx);
      }
    },
    false
  );

  canvas.addEventListener(
    "mouseup",
    function (event) {
      canvasProps.elementSelected = null;
      canvasProps.idAngleSelected = null;
    },
    false
  );
};

const onDrawBox = (
  ctx,
  { x, y, width, height, weight, type, color = "#000000" }
) => {
  ctx.lineWidth = weight;
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  if (type === "fill") {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.stroke();
  }
  ctx.closePath();
};

const drawMultiBox = (ctx) => {
  for (const box of boxs) {
    onDrawBox(ctx, box);

    box.angleMoved
      .map((item) => item(box))
      .forEach((item) => onDrawBox(ctx, item));

    for (const angle of box.angleMoved || []) {
      onDrawBox(ctx, angle(box));
    }
  }
};

const onInitialDraw = () => {
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");

    if (ctx) {
      drawMultiBox(ctx);
      onEvents(ctx);
    }
  }
};

onAddAnglesBoxs();
onInitialDraw();
