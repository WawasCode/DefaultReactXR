import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitHandles } from "@react-three/handle";
import { type Mesh } from "three";
import {
  createXRStore,
  IfInSessionMode,
  noEvents,
  PointerEvents,
  XR,
  XRStoreOptions,
} from "@react-three/xr";
import { Container, Fullscreen } from "@react-three/uikit";

function FlexWrap() {
  return (
    <Container gap={10} padding={10} backgroundColor={"hotPink"}>
      <Container flexDirection="column" alignItems="center">
        {/* this is also breaking center and column */}
        <Container borderColor="red" borderWidth={2}>
          {/* <Container width={100} height={50} backgroundColor="green" /> */}
          {/* above is breaking when added */}
          <Container
            gap={5}
            alignContent="space-around"
            flexWrap="wrap"
            borderColor="blue"
            borderWidth={2}
          >
            <Container width={250} height={50} backgroundColor="gray" />
            <Container width={250} height={50} backgroundColor="gray" />
            <Container width={250} height={50} backgroundColor="gray" />
          </Container>
        </Container>
      </Container>
    </Container>
  );
}
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
    <Canvas events={noEvents}>
      <XR store={store}>
        <PointerEvents batchEvents={false} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <SpinningCube />
        <OrbitHandles damping />
        <IfInSessionMode deny={["immersive-ar", "immersive-vr"]}>
          <Fullscreen
            pointerEvents="listener"
            flexDirection="row"
            padding={20}
            paddingRight={50}
            alignItems="flex-start"
            justifyContent="flex-end"
            pointerEventsOrder={2}
          >
            <FlexWrap />
          </Fullscreen>
        </IfInSessionMode>
      </XR>
    </Canvas>
  );
}
