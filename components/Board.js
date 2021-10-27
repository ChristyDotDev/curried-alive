import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';

const Board = (props) => {
  const canvasRef = useRef(null);
  const colorsRef = useRef(null);
  const socketRef = useRef(io.connect(props.socketURL));
  const room = useRef(props.room);

  useEffect(() => {

    // --------------- getContext() method returns a drawing context on the canvas-----

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // ----------------------- Colors --------------------------------------------------

    const colors = document.getElementsByClassName('color');
    // set the current color
    const current = {
      color: 'black',
    };

    // helper that will update the current color
    const onColorUpdate = (e) => {
      current.color = e.target.className.split(' ')[1];
    };

    // loop through the color elements and add the click event listeners
    for (let i = 0; i < colors.length; i++) {
      colors[i].addEventListener('click', onColorUpdate, false);
    }
    let drawing = false;

    // ------------------------------- create the drawing ----------------------------

    const drawLine = (x0, y0, x1, y1, color, emit) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
      context.closePath();

      if (!emit) { return; }
      const w = canvas.width;
      const h = canvas.height;

      socketRef.current.emit('drawing', {
        room: room.current,
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color,
      });
    };

    // ---------------- mouse movement --------------------------------------

    const onMouseDown = (e) => {
      drawing = true;
      const point = getCorrectedPoint("whiteboard-canvas", e)
      current.x = point.x;
      current.y = point.y;
    };

    const getCorrectedPoint = (id, e) => {
      var doc = document.documentElement;
      var scrollX = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
      var scrollY = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

      var target = document.getElementById(id);
      const originalX = e.clientX || e.touches && e.touches[0].clientX;
      const originalY = e.clientY || e.touches && e.touches[0].clientY;
      return {'x':originalX-(target.offsetLeft || 0) + scrollX,'y':originalY-(target.offsetTop || 0) + scrollY};
      
  }

    const onMouseMove = (e) => {
      if (!drawing) { return; }
      const point = getCorrectedPoint("whiteboard-canvas", e)
      drawLine(current.x, current.y, point.x, point.y, current.color, true);
      current.x = point.x;
      current.y = point.y;
    };

    const onMouseUp = (e) => {
      if (!drawing) { return; }
      drawing = false;
      const point = getCorrectedPoint("whiteboard-canvas", e)
      drawLine(current.x, current.y, point.x, point.y, current.color, true);
    };

    // ----------- limit the number of events per second -----------------------

    const throttle = (callback, delay) => {
      let previousCall = new Date().getTime();
      return function() {
        const time = new Date().getTime();

        if ((time - previousCall) >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    };

    // -----------------add event listeners to our canvas ----------------------

    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

    // Touch support for mobile devices
    canvas.addEventListener('touchstart', onMouseDown, false);
    canvas.addEventListener('touchend', onMouseUp, false);
    canvas.addEventListener('touchcancel', onMouseUp, false);
    canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

    // -------------- make the canvas fill its parent component -----------------

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', onResize, false);
    onResize();

    // ----------------------- socket.io connection ----------------------------
    const onDrawingEvent = (data) => {
      console.log("drawing event received");
      const w = canvas.width;
      const h = canvas.height;
      drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    }

    socketRef.current.emit('joinGame', room.current);
    socketRef.current.on('drawing', onDrawingEvent);
  }, []);

  // ------------- The Canvas and color elements --------------------------

  return (
    <div class='wb-container'>
      <canvas ref={canvasRef} className="whiteboard" id="whiteboard-canvas" />

      <div ref={colorsRef} className="colors">
        <div className="color black" />
        <div className="color red" />
        <div className="color green" />
        <div className="color blue" />
        <div className="color yellow" />
      </div>
    </div>
  );
};

export default Board;
