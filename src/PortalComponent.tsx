import { useRef, useMemo } from "react";
import { Gltf, Mask } from "@react-three/drei";
import { GroupProps, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSignal } from "@preact/signals-react";

type PortalProps = GroupProps & {
  children?: React.ReactNode;
  portalId?: number;
  onEnterPortal?: () => void;
  onLeavePortal?: () => void;
};

export function PortalComponent({
  children,
  portalId = 2,
  onEnterPortal,
  onLeavePortal,
  ...rest
}: PortalProps) {
  const planeRef = useRef<THREE.Mesh>(null);

  /**
   * `isInside` holds our current "inside/outside" toggle state
   * (i.e. have we crossed into the portal an odd or even number of times).
   */
  const isInside = useSignal(false);

  /**
   * We'll keep track of whether the camera was inside the Box3 at the end of the *previous frame*.
   */
  const wasInBox = useRef(false);

  /**
   * 1. Define the Box3 in local space around the portal plane.
   *    For a plane that is 1.3 wide and 3 tall, we set half-width=0.65, half-height=1.5,
   *    and a small thickness in z to detect crossing.
   */
  const portalBox = useMemo(() => {
    return new THREE.Box3(
      new THREE.Vector3(-0.65, -1.5, -0.6), // min corner
      new THREE.Vector3(0.65, 1.5, 0.2), // max corner
    );
  }, []);

  useFrame(({ camera }) => {
    if (!planeRef.current) return;

    // 2. Get the camera’s world position.
    const cameraWorldPos = new THREE.Vector3();
    camera.getWorldPosition(cameraWorldPos);

    // 3. Convert that world position to the portal plane’s local space.
    const localCameraPos = planeRef.current.worldToLocal(
      cameraWorldPos.clone(),
    );

    // 4. Check whether we're inside the Box3 this frame.
    const isInBoxThisFrame = portalBox.containsPoint(localCameraPos);

    // 5. If we have *changed* from outside => inside OR inside => outside, toggle.
    if (isInBoxThisFrame == false && wasInBox.current == true) {
      // Toggle the "isInside" signal.
      isInside.value = !isInside.value;

      // Fire the appropriate callback.
      if (isInside.value) {
        onEnterPortal?.();
      } else {
        onLeavePortal?.();
      }
    }

    // 6. Update the reference for next frame.
    wasInBox.current = isInBoxThisFrame;
  });

  return (
    <group {...rest}>
      <Gltf src="/Wall Doorway.glb" scale={3} position={[1.5, -0.5, 0]} />
      <Mask
        ref={planeRef}
        id={portalId}
        position={[0, 1, 0]}
        colorWrite={false}
      >
        <planeGeometry args={[1.3, 3]} />
        <meshBasicMaterial color="black" side={THREE.DoubleSide} />
      </Mask>

      {/* Hidden scene (only visible through the mask) */}
      <group>{children}</group>
    </group>
  );
}
