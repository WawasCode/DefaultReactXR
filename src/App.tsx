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
        <TestLayer />
        </IfInSessionMode>
      </XR>
    </Canvas>
  );
}

function TestLayer() {
  const video = useMemo(() => {
    const v = document.createElement("video");
    v.src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    v.crossOrigin = "anonymous";
    v.loop = true;
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.setAttribute("webkit-playsinline", "true");
    v.load();
    return v;
  }, []);

  const baseHeight = 0.001; // Why? I have no clue
  const width = 1920;
  const height = 1080;
  const aspect = width / height;

  return (
    <group position={[0,0,-10]} >
      <Root borderColor={"green"} borderWidth={1}>
        <Content
          width={1920}
          height={1080}
          // Uncomment this so its not floating anymore.
          // depthAlign={"center"}
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
          <XRLayer src={video} scale={baseHeight} quality="graphics-optimized" />
        </Content>
      </Root>
    </group>
  );
}
