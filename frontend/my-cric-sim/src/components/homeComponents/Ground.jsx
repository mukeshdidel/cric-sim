
import {Stage, Layer, Circle, Rect, Shape} from 'react-konva'
import { useState, useEffect, useRef, useContext } from 'react';
import { matchContext } from './Match';
function isCollision(c1,c2){
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const d = Math.sqrt(dx*dx + dy*dy);
    if (c1.z > 10) return false;
    return 10 >= d
}

function isOutOfBounds(x, y) {
    const dx = x - 370;
    const dy = y - 370;
    return Math.sqrt(dx * dx + dy * dy) > 340;
}


function intercept(player, ball, ballVel,ivZ, playerSpeed) {
    const dx = ball.x - player.x;
    const dy = ball.y - player.y;
    const vx = ballVel.x;
    const vy = ballVel.y;
    const vz = ivZ || 0;
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
    

    let interceptPoint = interceptT >= 0
        ? { x: ball.x + vx * interceptT, y: ball.y + vy * interceptT }
        : null;


    let landingPoint = null;
    if (vz.current > 0) {
        const g = 0.0132;
        const a = -0.5 * g;
        const b = vz.current;
        const c = ball.z; // current z-position of the ball

        const discriminant = b * b - 4 * a * c;
    
        if (discriminant >= 0) {
            const sqrtD = Math.sqrt(discriminant);
            const t1 = (-b + sqrtD) / (2 * a);
            const t2 = (-b - sqrtD) / (2 * a);
            const landingT = Math.max(t1, t2); // choose the positive root
    
            landingPoint = {
                x: ball.x + vx * landingT,
                y: ball.y + vy * landingT
            };
        }
    }
    

    let target;
    if (interceptPoint && landingPoint) {
        const d1 = Math.hypot(interceptPoint.x - 370, interceptPoint.y - (370-48));
        const d2 = Math.hypot(landingPoint.x - 370, landingPoint.y - (370-48));
        target = d2 > d1 ? landingPoint : interceptPoint;
    }
    if(!(interceptPoint &&  Math.hypot(370 - interceptPoint.x, 370-interceptPoint.y ) < 340 )) {
        const t = 340 / Math.hypot(ballVel.x, ballVel.y);
        const x = 370 + ballVel.x * t 
        const y = 370 + ballVel.y * t 
        interceptPoint ={x: x, y: y};
        target = interceptPoint;
    }
    if(Math.hypot(370 - landingPoint.x, 370 - landingPoint.y) > 340 ){
        const t = 340 / Math.hypot(ballVel.x, ballVel.y);
        const x = 370 + ballVel.x * t 
        const y = 370 + ballVel.y * t 
        landingPoint ={x: x, y: y};
        target = landingPoint;       
    }


    const dirX = target.x - player.x;
    const dirY = target.y - player.y;

    const mag = Math.hypot(dirX, dirY) || 1;
    return {
        direction: { x: dirX / mag, y: dirY / mag },
        target,
        landingPoint
    };
}

export default function Ground(){

    const { isAnimationDone, ballEvent, ballCalc, fields, fieldIndex } = useContext(matchContext);
    
    const field = fields?.[fieldIndex];
    const [fielders, setFielders] = useState(() => {

   
        
        const Fielders = Array.from({ length: 11 }, (_, i) => {
            if(i=== 10){
                return{
                    id: i,
                    x: 370,
                    y: 370 + 48,
                    color: 'green',
                    isSpecial: true,
                    vx: 0,
                    vy: 0,
                    tpx: 370,
                    tpy: 370+48
                }
            }
            if(i=== 9){
                return{
                    id:i,
                    x: 370,
                    y: 370-100,
                    color: 'green',
                    isSpecial: false ,
                    vx: 0,
                    vy: 0,
                    tpx: 370,
                    tpy: 370-80
                }
            }
            if(i !== 10 && i !== 9){
                return {
                    id: i,
                    x: field?.[i].x,
                    y: field?.[i].y,
                    color: 'green',
                    isSpecial: false,
                    vx: 0,
                    vy: 0,
                    tpx: field?.[i].x,
                    tpy: field?.[i].y
                }          
            };
 

        });
    
        return Fielders;
      });

/*       const [fielders, setFielders] = useState(()=>{
        const allFielders = [
            {
                id: 1, x: 490, y: 675 // long on
            },
            {
                id: 25, x: 560, y: 635 // fly slip 
            },
            {
                id: 2, x: 615, y: 580 // cow corner
            },
            {
                id: 26, x: 660, y: 520 // fly slip 
            },
            {
                id: 3, x: 685, y: 450 // deep mid wicket 
            },
            {
                id: 27, x: 700, y: 370 // fly slip 
            },
            {
                id: 4, x: 685, y: 290 // deep mid square
            },
            {
                id: 28, x: 660, y: 220 // fly slip 
            },
            {
                id: 5, x: 615, y: 160 // long leg
            },
            {
                id: 29, x: 560, y: 110 // fly slip 
            },
            {
                id: 6, x: 490, y: 65 // deep fine leg
            },
            {
                id: 12, x: 250, y: 65 // third man
            },
            {
                id: 34, x: 180, y: 110 // fly slip 
            },
            {
                id: 11, x: 125, y: 160 // deep backword point 
            },
            {
                id: 33, x: 80, y: 220 // fly slip 
            },
            {
                id: 10, x: 55, y: 290 // deep point 
            },
            {
                id: 32, x: 40, y: 370 // fly slip 
            },
            {
                id: 9, x: 55, y: 450 // deep cover
            },
            {
                id: 31, x: 80, y: 520 // fly slip 
            },
            {
                id: 8, x: 125, y: 580 // deep extra cover
            },
            {
                id: 30, x: 180, y: 635 // fly slip 
            },
            {
                id: 7, x: 250, y: 675 // long off
            },
            {
                id: 13, x: 435, y: 515 // mid on
            },
            {
                id: 35, x: 465, y: 480 // fly slip 
            },
            {
                id: 14, x: 485, y: 440 // extra mid wicket
            },
            {
                id: 36, x: 490, y: 405 // fly slip 
            },
            {
                id: 15, x: 490, y: 370 // mid wicket
            },
            {
                id: 37, x: 490, y: 340 // fly slip 
            },
            {
                id: 16, x: 490, y: 310 // square leg
            },
            {
                id: 38, x: 480, y: 280 // fly slip 
            },
            {
                id: 17, x: 470, y: 255 // backword square leg
            },
            {
                id: 39, x: 450, y: 230 // fly slip 
            },
            {
                id: 18, x: 420, y: 210 // fine leg
            },
            {
                id: 24, x: 320, y: 210 // fly slip 
            },
            {
                id: 44, x: 290, y: 230 // fly slip 
            },
            {
                id: 23, x: 270, y: 255 // backword point
            },
            {
                id: 43, x: 260, y: 280 // fly slip 
            },
            {
                id: 22, x: 250, y: 310 // point
            },
            {
                id: 42, x: 250, y: 340 // fly slip 
            },
            {
                id: 21, x: 250, y: 370 // cover
            },
            {
                id: 41, x: 250, y: 405 // fly slip 
            },
            {
                id: 20, x: 255, y: 440 // extra cover
            },            
            {
                id: 40, x: 270, y: 480 // fly slip 
            },
            {
                id: 19, x: 305, y: 515 // mid off
            },
        ]
        return allFielders
      }) */

      const Tpoint = useRef({ x: 370 , y: 370})
      const Lpoint = useRef({ x: 370 , y: 370 + 48})



      const [ball, setBall] = useState({x: 370, y: 370-48, z:0.001});
      const velocityRef = useRef({x: 0, y:0, z:0});
      const [ballRadius, setBallRadius] =useState(5)

      const g = 0.0132;
      const startTime = useRef();
      const initialVelocityZRef = useRef(0);

      const animationRef = useRef();
      const players_are_moving = useRef(false);
     

      useEffect(()=>{

        const velo = ballCalc?.velocity;
        const HAngle = ballCalc?.HAngle;
        const VAngle = ballCalc?.VAngle;  

        const vx = Math.cos(VAngle)*Math.cos(HAngle)*velo;
        const vy = Math.cos(VAngle)*Math.sin(HAngle)*velo;
        const vz = Math.sin(VAngle)*velo

        startTime.current = performance.now()
        velocityRef.current = {x: vx, y: vy, z: vz};
        initialVelocityZRef.current = vz;

      },[])

      useEffect(()=>{
        function animateBall(){

            if(!players_are_moving.current){
                setFielders(prev =>
                    prev.map(f => {
                        if (!f.isSpecial) {
                            const { direction, target, landingPoint } = intercept(f, ball, velocityRef.current, initialVelocityZRef, 0.6);
                            if(target){
                                Tpoint.current = {x: target.x, y: target.y};
                            }
                            if(landingPoint){
                                Lpoint.current ={x: landingPoint.x, y: landingPoint.y}
                            }

                            return {
                                ...f,
                                vx: direction.x*0.3,
                                vy: direction.y*0.3,
                                tpx: target.x,
                                tpy: target.y,
                            };
                        }
                        return f;
                    })
                );
                players_are_moving.current = true;
            }
            else{
                setFielders((prev) =>
                    prev.map((f) => {
                      if (!f.isSpecial) {
                        const dx = f.x - f.tpx;
                        const dy = f.y - f.tpy;
                        const dist = Math.hypot(dx, dy);
                  
                        if (dist < 3) {
                          return {
                            ...f,
                            vx: 0,
                            vy: 0,
                            x: f.tpx,
                            y: f.tpy,
                          };
                        }
                  
                        return {
                          ...f,
                          x: f.x + f.vx,
                          y: f.y + f.vy,
                        };
                      }
                      return f;
                    })
                  );
                  
            }


            setBall((prev)=>{
                return {x: prev.x + velocityRef.current.x, y: prev.y + velocityRef.current.y, z: Math.max(0,prev.z + velocityRef.current.z)}
            })

            if(ball.z > 0){
                const v = velocityRef.current;
                velocityRef.current = {...v, z: v.z - g}
            }
            animationRef.current = requestAnimationFrame(animateBall);
        };
 

        animationRef.current = requestAnimationFrame(animateBall)
        return () => cancelAnimationFrame(animationRef.current);
      },[velocityRef.current])
      
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

                    if(time < 3){
                        ballEvent.current = 1;
                        isAnimationDone.current = true;                     
                    }
                    else if(time >= 3 && time < 6){
                        ballEvent.current = 2;
                        isAnimationDone.current = true;
                    }
                    else {
                        ballEvent.current = 3;
                        isAnimationDone.current = true;
                    }
                }
                if(ball.z !== 0 && !f.isSpecial){
                    cancelAnimationFrame(animationRef.current)
                    ballEvent.current = -1;
                    isAnimationDone.current = true;
                }
            }


            if (!f.isSpecial) {
                return {
                  ...f,
                  x: f.x + f.vx,
                  y: f.y + f.vy,
                  color: isHit ? 'yellow' : 'green'
                };
              }
              return f;

        });

        if(isOutOfBounds(ball.x, ball.y)){
            if(ball.z>0){
                ballEvent.current = 6;
                isAnimationDone.current = true;
            }
            else{
                ballEvent.current = 4;
                isAnimationDone.current = true;
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
                            /* fill={f.color} */
                            fill = 'green'
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