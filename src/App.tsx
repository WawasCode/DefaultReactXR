import { Canvas } from "@react-three/fiber";
import { Gltf, OrbitControls } from "@react-three/drei";
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
import { PortalComponent } from "./PortalComponent";
import { Doorway } from "./Doorway";
const OPTIONS: XRStoreOptions = {
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
export default function App() {
  const store = createXRStore(OPTIONS);

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
        <group position={[3, 1, -1]} scale={0.4}>
          <Doorway scale={[3, 3, 3]} position={[1.5, -1.5, 0]} />
          <PortalComponent
            WorldToPortalID={2}
            PortalToWorldID={1}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
          >
            <Gltf
              src="/Spike Room with Ceiling.glb"
              scale={3}
              position={[0, 0, -2]}
              rotation={[0, -Math.PI / 2, 0]}
            />
          </PortalComponent>
        </group>
        <group position={[0, 0.8, -1]} scale={0.5}>
          <Doorway scale={[3, 4, 3]} position={[1.5, -1.8, 0]} />
          <PortalComponent
            WorldToPortalID={4}
            PortalToWorldID={1}
            position={[0, 0.2, 0]}
            rotation={[0, 0, 0]}
            PlaneSize={[1.3, 4]}
          >
            <Gltf
              src="/Family Room.glb"
              scale={3}
              position={[-3, 0, -4]}
              rotation={[0, -Math.PI / 2, 0]}
            />
          </PortalComponent>
        </group>
        {/* <mesh position={[0, 0, -1]} scale={0.5} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="blue" />
        </mesh> */}
      </XR>
    </Canvas>
  );
}
