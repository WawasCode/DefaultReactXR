import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitHandles } from "@react-three/handle";
import {
  createXRStore,
  IfInSessionMode,
  noEvents,
  PointerEvents,
  XR,
  XRLayer,
  XRStoreOptions,
} from "@react-three/xr";
import { Content, Fullscreen, Root } from "@react-three/uikit";
import { EnterXRButton } from "./EnterXRButton";

export default function App() {
  const options: XRStoreOptions = {
    handTracking: true,
    foveation: 0,
    domOverlay: false,
  };
  const store = createXRStore(options);
  return (
    <Canvas events={noEvents}>
      <XR store={store}>
        <PointerEvents batchEvents={false} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
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
            <EnterXRButton />
          </Fullscreen>
        </IfInSessionMode>
        <TestLayer />

        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </XR>
    </Canvas>
  );
}

function TestLayer() {
  const video = useMemo(() => {
    const v = document.createElement("video");
    // Side-by-side stereo (left-right) public domain Big Buck Bunny sample
    // 640x360 where left eye is left half and right eye is right half.
    v.src =
      "http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_60fps_stereo_abl.mp4";
    v.crossOrigin = "anonymous";
    v.loop = true;
    v.playsInline = true;
    v.autoplay = true;
    v.preload = "auto";
    return v;
  }, []);

  const baseHeight = 0.001; // Why? I have no clue
  const width = 1920;
  const height = 1080;
  const aspect = width / height;

  return (
    <group position={[0, 0, -5]}>
      <Root
        //anchor causes the XR layer to shift.
        anchorX="center"
        anchorY="bottom"
        borderColor={"green"}
        borderWidth={1}
        backgroundColor={"black"}
      >
        <Content
          width={100}
          height={45}
          onClick={() => {
            console.log("clicked");
            video.play().catch((e) => console.warn("Video play blocked", e));
            console.log("Video height ratio:", video.videoHeight);
            console.log("Video width ratio:", video.videoWidth);
          }}
          borderColor={"Red"}
          borderWidth={4}
          aspectRatio={aspect}
          keepAspectRatio={false}
        >
          {/* type="stereo" informs XR the source is side-by-side */}
          <XRLayer
            src={video}
            type=""
            scale={baseHeight}
            quality="graphics-optimized"
            layout="stereo-top-bottom"
          />
        </Content>
      </Root>
    </group>
  );
}
