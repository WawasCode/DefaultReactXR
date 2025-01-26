import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
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
import { OrangeRoom } from "./Worlds";
import { useSignal } from "@preact/signals-react";
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
  const portalOrangeRoomID = useSignal(2);
  const orangeRoomID = useSignal(2);
  const invertOrangeRoomStencile = useSignal(true);
  const onEnterOrangeRoom = () => {
    invertOrangeRoomStencile.value = false;
    portalOrangeRoomID.value = 1;
  };
  const onLeaveOrangeRoom = () => {
    invertOrangeRoomStencile.value = true;
    portalOrangeRoomID.value = 2;
  };
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
        <group position={[-2, 0, 0]} scale={[0.6, 0.6, 0.6]}>
          <PortalComponent
            portalId={portalOrangeRoomID.value}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            onEnterPortal={onEnterOrangeRoom}
            onLeavePortal={onLeaveOrangeRoom}
          />
          <OrangeRoom
            portalId={orangeRoomID.value}
            scale={3}
            position={[-3, 1.3, 3]}
            invert={invertOrangeRoomStencile.value}
          />
        </group>
      </XR>
    </Canvas>
  );
}
