
import {Stage, Layer, Circle, Rect, Shape} from 'react-konva'

export default function Component(){
    return (
        <>                    
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                <Circle             
                    x={window.innerWidth / 2} 
                    y={window.innerHeight / 2}

                    radius={350} 
                    fill='#228B22'
                />
                <Circle 
                    x={window.innerWidth / 2}             
                    y={window.innerHeight / 2}

                    radius={340} 
                    stroke='white'
                />
                <Shape 
                    sceneFunc = {(context, shape) => { 
                        context.beginPath();
                        context.arc(
                        window.innerWidth/2 , window.innerHeight/2 - 48.57, 130 ,Math.PI,0, false
                        );
                        context.lineTo(window.innerWidth / 2 + 130, window.innerHeight/2 + 45.57);
                        context.arc(
                        window.innerWidth/2 , window.innerHeight/2 + 48.57, 130 ,0, Math.PI, false
                        );
                        context.lineTo(window.innerWidth / 2 - 130, window.innerHeight/2 - 45.57);
                        context.closePath();
                        context.fillStrokeShape(shape);
                    }}
                    stroke='white'
                    dash={[3,9.991]}
                />

                <Rect
                    y={window.innerHeight / 2 - 50} x={window.innerWidth / 2 - 7.5} width={15} height={100} fill='#A9745B'
                />
                </Layer>
                <Layer>
                <Circle
                    x={window.innerWidth/2}
                    y={window.innerHeight/2}
                    z={50}
                    radius={5}
                    stroke='white'
                    fill='black'
                    draggable
                    />
                </Layer>
            </Stage>
        </>
    );
}