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
import { Container, Content, Fullscreen, Root } from "@react-three/uikit";
import { EnterXRButton } from "./EnterXRButton";
import { useSignal } from "@preact/signals-react";

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

        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </XR>
    </Canvas>
  );
}

function TestLayer() {
  const show = useSignal(true);
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
    <group position={[0, 1, -1]}>
      <Root
        //anchor causes the XR layer to shift.

        borderColor={"green"}
        borderWidth={1}
        backgroundColor={"pink"}
      >
        <Container
          width={30}
          height={30}
          backgroundColor={"purple"}
          onClick={() => (show.value = !show.value)}
        ></Container>
        <Content
          width={100}
          height={45}
          depthAlign={"back"}
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
          depthTest={false}
          depthWrite={false}
        >
          {/* type="stereo" informs XR the source is side-by-side */}
          <XRLayer
            src={video}
            type=""
            scale={show.value ? baseHeight : 0}
            quality="graphics-optimized"
            layout="stereo-top-bottom"
            renderPriority={9999}
            renderOrder={9999}
          />
        </Content>
      </Root>
    </group>
  );
}
