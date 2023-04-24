import React from 'react';
import { useRef, useState } from 'react';

import circle from '../assets/circle.svg'



 function Main(){
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const [descChange, setDescChange] = useState(false)
    const [percent, setPercentText] = useState("XX.X%")
    const [color, setColor] = useState('black');
    const [distance, setDistance] = useState(0)
    const [distanceMove, setDistanceMove] = useState(0)
    const lastMoveTime = useRef(0);

    function handleMouseDown(event) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const { clientX, clientY } = event;

      setDescChange(true)
      setPercentText("XX.X%")
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      setDistance(Math.sqrt(dx * dx + dy * dy));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = performance.now()
      lastMoveTime.current = now;
      if(distance>100){
        isDrawingRef.current = true;
        ctx.beginPath();
        ctx.moveTo(clientX, clientY);
      }else{
        isDrawingRef.current = false;
        setPercentText("It is too close!")
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  
    function handleMouseMove(event) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const { clientX, clientY } = event;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      setDistanceMove(Math.sqrt(dx * dx + dy * dy));
  
      if (isDrawingRef.current) {
        if (distanceMove < 150) {
          setColor("red")
        } else {
          setColor("black")
        }
        ctx.strokeStyle = color;
        if(distanceMove>100){
          const now = performance.now();
          if (lastMoveTime.current && now - lastMoveTime.current > 500) {
            isDrawingRef.current = false;
            setPercentText("it is too slowly")
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            lastMoveTime.current = now;
          }else{
            lastMoveTime.current = now;
            ctx.lineTo(clientX, clientY);
            const similarity = Math.max(0, 1 - (Math.abs(distanceMove)) / (2 * distance));
            setPercentText((similarity*100).toFixed(1))
            ctx.stroke();
          }
        }else{
          isDrawingRef.current = false;
          setPercentText("It is too close!")
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }      
    }
  
    function handleMouseUp() {
      isDrawingRef.current = false;
    }
  
    return (
        <main className='main'>
            <canvas
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                width={window.innerWidth}
                height={window.innerHeight}
                ref={canvasRef}
            />
            <div className='main-desc' style={{transition: "1s"}}>
              { descChange === false ?
              <>
                <h1>Draw circle around this</h1>
                <img src={circle} alt=""/>
                <h1>around this</h1>
              </>
              : 
              <h1 style={{color: "red", fontWeight: "800"}} >{/^\d$/.test(percent.charAt(0)) ? percent+"%" : percent}</h1>
              }
            </div>
      </main>
    );
  }
    

export default Main;