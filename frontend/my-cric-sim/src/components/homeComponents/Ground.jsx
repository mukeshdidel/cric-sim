
import {Stage, Layer, Circle, Rect, Shape} from 'react-konva'
import { useState, useEffect, useRef } from 'react';

function isCollision(c1,c2){
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const d = Math.sqrt(dx*dx + dy*dy);
    if (c1.z > 10) return false;
    return 20 >= d
}

function isOutOfBounds(x, y) {
    const dx = x - 370;
    const dy = y - 370;
    return Math.sqrt(dx * dx + dy * dy) > 340;
}


function intercept(player, ball, ballVel, playerSpeed) { // 
    const dx = ball.x - player.x;
    const dy = ball.y - player.y;
    const vx = ballVel.x;
    const vy = ballVel.y;
    const vz = ballVel.z || 0;
    const z = ball.z || 0;

    const a = vx ** 2 + vy ** 2 - playerSpeed ** 2;
    const b = 2 * (dx * vx + dy * vy);
    const c = dx ** 2 + dy ** 2;
    const d = b ** 2 - 4 * a * c;

    let interceptT = -1;
    if (d >= 0 && a !== 0) {
        const sqrtD = Math.sqrt(d);
        const t1 = (-b + sqrtD) / (2 * a);
        const t2 = (-b - sqrtD) / (2 * a);
        const tCandidates = [t1, t2].filter(t => t >= 0);
        interceptT = tCandidates.length > 0 ? Math.min(...tCandidates) : -1;
    }

    const interceptPoint = interceptT >= 0
        ? { x: ball.x + vx * interceptT, y: ball.y + vy * interceptT }
        : null;

    let landingPoint = null;
    if (z > 0) {
        const g = 0.013;
        const landingT = (-vz - Math.sqrt(vz ** 2 + 2 * g * z)) / (-g);
        landingPoint = {
            x: ball.x + vx * landingT,
            y: ball.y + vy * landingT
        };
    }

    let target;
    if (interceptPoint && landingPoint) {
        const d1 = Math.hypot(interceptPoint.x - player.x, interceptPoint.y - player.y);
        const d2 = Math.hypot(landingPoint.x - player.x, landingPoint.y - player.y);
        target = d2 > d1 ? landingPoint : interceptPoint;
    } else if (landingPoint) {
        target = landingPoint;
    } else if (interceptPoint) {
        target = interceptPoint;
    } else {
 
        const t = 340 / Math.sqrt(vx * vx + vy * vy);
        target = { x: 370 + vx * t, y: 370 + vy * t };
    }

    const dirX = target.x - player.x;
    const dirY = target.y - player.y;
    const mag = Math.hypot(dirX, dirY) || 1;
    return {
        direction: { x: dirX / mag, y: dirY / mag },
        target
    };
}

export default function Component(){

    const [fielders, setFielders] = useState(() => {

        const circleFielders = Array.from({ length: 11 }, (_, i) => {
          
            if(i=== 9){
                return{
                    x: 370,
                    y: 370 + 48,
                    color: 'green',
                    isSpecial: true
                }
            }
            if(i=== 10){
                return{
                    x: 370,
                    y: 370-50,
                    color: 'green',
                    isSpecial: true 
                }
            }
            if(i !== 9 && i !== 10){
                return {
                    id: i,
                    x: 370 + (i%2 === 0 ? 300 : 150 )* Math.cos((2*Math.PI*i)/10),
                    y: 370 + ((i%2 === 0 ? 300 : 150 ))* Math.sin((2*Math.PI*i)/10),
                    color: 'green',
                    isSpecial: false,

                }          
            };

        });
    
        return circleFielders;
      });

      const [ball, setBall] = useState({x: 370, y: 370-48, z:0.1});
      const [velocity, setvelocity] = useState({x: 0, y:0, z:0});
      const [ballRadius, setBallRadius] =useState(5)
      const g = 0.013;
      const startTime = useRef();

      const animationRef = useRef();
      useEffect(()=>{
        const velo = Math.random()*3;
        const angle = Math.random() * 2 *Math.PI;
        const vx = Math.cos(angle)*velo;
        const vy = Math.sin(angle)*velo;

        const vz = Math.random()*1.5;
        startTime.current = performance.now()
        setvelocity({x: vx, y:vy, z: vz});

      },[])

      useEffect(()=>{
        function animateBall(){

            setBall((prev)=>{
                return {x: prev.x + velocity.x, y: prev.y + velocity.y, z: Math.max(0,prev.z + velocity.z)}
            })

            if(ball.z > 0) setvelocity(prev=>({...prev, z: prev.z - g}))

            animationRef.current = requestAnimationFrame(animateBall);
        };

        animationRef.current = requestAnimationFrame(animateBall)
        return () => cancelAnimationFrame(animationRef.current);
      },[velocity])
      
      useEffect(()=>{
        const updatedFielders = fielders.map((f)=>{
            const isHit = isCollision({x: ball.x, y: ball.y, z: ball.z},{x: f.x, y:f.y})
            setBallRadius(Math.max(5,5+ ball.z/10))
            if(isHit){                
                if(ball.z === 0 && !f.isSpecial) 
                {                    
                    cancelAnimationFrame(animationRef.current)
                    
                    const endTime = performance.now();
                    const time = (endTime - startTime.current)/1000;

                    if(time < 5){
                        alert('no runs')                       
                    }
                    else if(time >= 5 && time < 10){
                        alert('one run')
                    }
                    else if(time >= 10){
                        alert('two runs')
                    }
                }
                if(ball.z !== 0 && !f.isSpecial){
                    cancelAnimationFrame(animationRef.current)
                    alert('player is out');
                }
            }


            if (!f.isSpecial) {
                const { direction } = intercept(f, ball, velocity, 0.25);
                return {
                  ...f,
                  x: f.x + direction.x,
                  y: f.y + direction.y,
                  color: isHit ? 'yellow' : 'green'
                };
              }
              return f;

        });

        if(isOutOfBounds(ball.x, ball.y)){
            if(ball.z>0){
                alert('its a six');
            }
            else{
                alert('its a four');
            }
            cancelAnimationFrame(animationRef.current)

        }
        setFielders(updatedFielders);
      },[ball])
  
    return (
        <>                    
            <Stage width={740} height={740} >
                <Layer>
                <Circle             
                    x={370} 
                    y={370}
                    radius={350} 
                    fill='#228B22'
                />
                <Circle 
                    x={370}             
                    y={370}

                    radius={340} 
                    stroke='white'
                />
                <Shape 
                    sceneFunc = {(context, shape) => { 
                        context.beginPath();
                        context.arc(
                            370 , 370 - 48.57, 130 ,Math.PI,0, false
                        );
                        context.lineTo(370 + 130, 370 + 45.57);
                        context.arc(
                            370 , 370 + 48.57, 130 ,0, Math.PI, false
                        );
                        context.lineTo(370 - 130, 370 - 45.57);
                        context.closePath();
                        context.fillStrokeShape(shape);
                    }}
                    stroke='white'
                    dash={[3,9.991]}
                />

                <Rect
                    y={370 - 50} x={370 - 7.5} width={15} height={100} fill='#A9745B'
                />
                </Layer>
                <Layer>
                {
                    fielders.map(f=>(
                        <Circle
                            key={f.id}
                            x={f.x}
                            y={f.y}
                            radius={5}
                            fill={f.color}
                            stroke='black'
                        />
                    ))
                }

                <Circle
                    x={ball.x}
                    y={ball.y}
                    radius={ballRadius}
                    stroke='white'
                    fill='black'
                    draggable
                    onDragMove={(e)=> setBall({x :e.target.x(), y: e.target.y()})}
                    />
                </Layer>
            </Stage>
        </>
    );
}