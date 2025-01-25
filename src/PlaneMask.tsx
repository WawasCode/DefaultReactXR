import * as React from "react";
import * as THREE from "three";

type Props = {
  children?: React.ReactNode;
  stencilRef: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
};

export function PlaneMask({
  children,
  stencilRef,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: Props) {
  return (
    <group>
      <mesh position={position} rotation={rotation} renderOrder={1}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial
          //   side={THREE.DoubleSide}
          //   colorWrite={false}
          depthWrite={false}
          stencilWrite
          stencilRef={stencilRef}
          // stencilFuncMask={0xff}
          stencilFunc={THREE.AlwaysStencilFunc}
          // stencilFail={THREE.KeepStencilOp}
          // stencilZFail={THREE.KeepStencilOp}
          stencilFail={THREE.ReplaceStencilOp}
          stencilZFail={THREE.ReplaceStencilOp}
          stencilZPass={THREE.ReplaceStencilOp}
        />
      </mesh>
      {children}
    </group>
  );
}
