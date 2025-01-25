import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { type Mesh } from "three";
import {
  createXRStore,
  IfInSessionMode,
  noEvents,
  PointerEvents,
  XR,
  XRStoreOptions,
} from "@react-three/xr";
import { Fullscreen } from "@react-three/uikit";
import { EnterXRButton } from "./EnterXRButton";
import * as THREE from "three";
import { PlaneMask } from "./PlaneMask";
function SpinningCube() {
  const cubeRef = useRef<Mesh>(null);

  // Animate rotation using useFrame
  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01;
      cubeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
}

export default function App() {
  const options: XRStoreOptions = {
    handTracking: true,
    foveation: 0,
    domOverlay: false,
    hand: {
      touchPointer: {
        cursorModel: {
          color: "blue",
          size: 0.2,
        },
      },
      grabPointer: {
        cursorModel: {
          color: "hotpink",
          size: 0.2,
        },
      },
      rayPointer: {
        rayModel: { color: "green" },
        cursorModel: {
          color: "green",
          size: 0.2,
        },
      },
      teleportPointer: false,
    },
    controller: {
      grabPointer: {
        cursorModel: {
          color: "hotpink",
          size: 0.2,
        },
      },
      rayPointer: {
        rayModel: { color: "green" },
        cursorModel: {
          color: "green",
          size: 0.2,
        },
      },
      teleportPointer: false,
    },
  };
  const store = createXRStore(options);
  return (
    <Canvas events={noEvents} gl={{ stencil: true }}>
      <XR store={store}>
        <PointerEvents batchEvents={false} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        {/* <SpinningCube /> */}
        <OrbitControls />
        <IfInSessionMode deny={["immersive-ar", "immersive-vr"]}>
          <Fullscreen
            flexDirection="row"
            padding={20}
            paddingRight={50}
            alignItems="flex-start"
            justifyContent="flex-end"
            pointerEvents="listener"
            pointerEventsOrder={3}
          >
            <EnterXRButton />
          </Fullscreen>
        </IfInSessionMode>
      </XR>
      <PlaneMask
        stencilRef={2}
        position={[2, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {/* 
           The box is rendered AFTER the plane, so set a higher renderOrder.
           We do an EqualStencilFunc, so it only shows where stencilRef == 2.
        */}
        <mesh renderOrder={2} position={[2, -2, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="blue"
            stencilWrite
            stencilRef={2}
            stencilFunc={THREE.EqualStencilFunc}
            stencilFail={THREE.KeepStencilOp}
            stencilZFail={THREE.KeepStencilOp}
            stencilZPass={THREE.KeepStencilOp}
          />
        </mesh>
      </PlaneMask>
    </Canvas>
  );
}
