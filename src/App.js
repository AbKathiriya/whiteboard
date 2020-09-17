import React, { useRef, useEffect, useState } from "react";
import "./App.css";

const current = {
  color: "black",
  stroke: 1,
  opacity: 1,
};
var canvas;
var context;
var drawing = false;

const App = () => {
  const [brush, setBrush] = useState("pen");
  const canvasRef = useRef(null);
  const colorsRef = useRef(null);

  const drawLine = (x0, y0, x1, y1) => {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.globalAlpha = current.opacity;
    context.strokeStyle = current.color;
    context.lineWidth = current.stroke;
    context.stroke();
    context.closePath();
  };

  const onMouseDown = (e) => {
    drawing = true;
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
  };

  const onMouseMove = (e) => {
    if (!drawing) {
      return;
    }
    drawLine(
      current.x,
      current.y,
      e.clientX || e.touches[0].clientX,
      e.clientY || e.touches[0].clientY
    );
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
  };

  const onMouseUp = (e) => {
    if (!drawing) {
      return;
    }
    drawing = false;
    drawLine(
      current.x,
      current.y,
      e.clientX || e.touches[0].clientX,
      e.clientY || e.touches[0].clientY
    );
  };

  const throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    return function () {
      const time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  };

  const onResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const onColorUpdate = (e) => {
    console.log(brush);
    if (brush !== "eraser") {
      current.color = e.target.dataset.color;
    }
  };

  const onBrushChange = (e) => {
    let brushType = e.target.dataset.brush;

    switch (brushType) {
      case "pen":
        current.stroke = 1;
        current.opacity = 1;
        if (current.color === "white") current.color = "black";
        setBrush("pen");
        break;
      case "highlighter":
        current.stroke = 5;
        current.opacity = 0.5;
        if (current.color === "white") current.color = "black";
        setBrush("highlighter");
        break;
      case "eraser":
        current.stroke = 3;
        current.color = "white";
        current.opacity = 1;
        setBrush("eraser");
        break;
    }
  };

  const onBrushSizeChange = (e) => {
    e.stopPropagation();
    let brushSize = e.target.dataset.size;
    switch (brushSize) {
      case "1":
        current.stroke = 1;
        break;
      case "3":
        current.stroke = 3;
        break;
      case "5":
        current.stroke = 5;
        break;
      case "10":
        current.stroke = 10;
        break;
      case "15":
        current.stroke = 15;
        break;
    }
  };

  const onClearCanvas = () => {
    if(context) context.clearRect(0, 0, canvas.width, canvas.height);
  }

  useEffect(() => {
    canvas = canvasRef.current;
    context = canvas.getContext("2d");

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseout", onMouseUp);
    canvas.addEventListener("mousemove", throttle(onMouseMove, 10));
    window.addEventListener("resize", onResize);
    onResize();
  }, []);

  return (
    <div className="container">
      <div className="toolbox">
        <div ref={colorsRef} className="colors">
          <div className="color black" data-color="black" onClick={onColorUpdate} />
          <div className="color red" data-color="red" onClick={onColorUpdate} />
          <div className="color green" data-color="green" onClick={onColorUpdate} />
          <div className="color blue" data-color="blue" onClick={onColorUpdate} />
          <div className="color yellow" data-color="yellow" onClick={onColorUpdate} />
        </div>
        <div className="brushes">
          <div
            className={`brush ${brush === "pen" ? "selected" : ""}`}
            data-brush="pen"
            onClick={onBrushChange}
          >
            Pen
            {brush === "pen" && (
              <div className="brush-palatte">
                <div
                  className="brush-size brush-size-1"
                  data-size="1"
                  onClick={onBrushSizeChange}
                ></div>
                <div
                  className="brush-size brush-size-3"
                  data-size="3"
                  onClick={onBrushSizeChange}
                ></div>
                <div
                  className="brush-size brush-size-5"
                  data-size="5"
                  onClick={onBrushSizeChange}
                ></div>
              </div>
            )}
          </div>
          <div
            className={`brush ${brush === "highlighter" ? "selected" : ""}`}
            data-brush="highlighter"
            onClick={onBrushChange}
          >
            Highlighter
            {brush === "highlighter" && (
              <div className="brush-palatte">
                <div
                  className="brush-size brush-size-1"
                  data-size="5"
                  onClick={onBrushSizeChange}
                ></div>
                <div
                  className="brush-size brush-size-3"
                  data-size="10"
                  onClick={onBrushSizeChange}
                ></div>
                <div
                  className="brush-size brush-size-5"
                  data-size="15"
                  onClick={onBrushSizeChange}
                ></div>
              </div>
            )}
          </div>
          <div
            className={`brush ${brush === "eraser" ? "selected" : ""}`}
            data-brush="eraser"
            onClick={onBrushChange}
          >
            Eraser
            {brush === "eraser" && (
              <div className="brush-palatte">
                <div
                  className="brush-size brush-size-1"
                  data-size="5"
                  onClick={onBrushSizeChange}
                ></div>
                <div
                  className="brush-size brush-size-3"
                  data-size="10"
                  onClick={onBrushSizeChange}
                ></div>
                <div
                  className="brush-size brush-size-5"
                  data-size="15"
                  onClick={onBrushSizeChange}
                ></div>
              </div>
            )}
          </div>
        </div>
        <div className="clear-all" onClick={onClearCanvas}>Clear All</div>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default App;
