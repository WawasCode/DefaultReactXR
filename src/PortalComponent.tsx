import { useRef, useMemo, useEffect } from "react";
import { Mask, useMask } from "@react-three/drei";
import { GroupProps, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useComputed, useSignal } from "@preact/signals-react";

type PortalProps = GroupProps & {
  children?: React.ReactNode;
  PortalToWorldID: number;
  WorldToPortalID: number;
  PlaneSize?: [number, number];
  colliderZWidth?: [number, number];
  onEnterPortal?: () => void;
  onLeavePortal?: () => void;
  debug?: boolean;
};

export function PortalComponent({
  children,
  PortalToWorldID,
  WorldToPortalID,
  PlaneSize = [1.3, 3],
  colliderZWidth = [-0.5, 0.5],
  onEnterPortal,
  onLeavePortal,
  debug = false,
  ...props
}: PortalProps) {
  const maskRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const maskID = useSignal(WorldToPortalID);
  const exitTargetID = useSignal(PortalToWorldID);
  const wasInBox = useRef(false);
  const invert = useSignal(false);
  const stencilProps = useMask(WorldToPortalID, invert.value);
  const planeSide = useComputed(() =>
    invert.value ? THREE.BackSide : THREE.FrontSide,
  );
  const portalBox = useMemo(() => {
    const [zMin, zMax] = colliderZWidth;
    return new THREE.Box3(
      new THREE.Vector3(-PlaneSize[0] / 2, -PlaneSize[1] / 2, zMin),
      new THREE.Vector3(PlaneSize[0] / 2, PlaneSize[1] / 2, zMax),
    );
  }, []);

  const { size, center } = useMemo(() => {
    const s = new THREE.Vector3();
    const c = new THREE.Vector3();
    portalBox.getSize(s);
    portalBox.getCenter(c);
    return { size: s, center: c };
  }, [portalBox]);

  // On every frame, detect crossing from inside <-> outside
  useFrame(({ camera }) => {
    if (!maskRef.current) return;

    // 1. Convert camera’s world position to plane's local space
    const localCameraPos = maskRef.current.worldToLocal(
      camera.getWorldPosition(new THREE.Vector3()),
    );

    // 2. Check if inside the box this frame
    const isInBoxThisFrame = portalBox.containsPoint(localCameraPos);

    // 3. If crossing from inside->outside or outside->inside, fire events
    if (isInBoxThisFrame === false && wasInBox.current === true) {
      onLeavePortal?.(); // inside -> outside
      maskID.value = WorldToPortalID;
    } else if (isInBoxThisFrame === true && wasInBox.current === false) {
      onEnterPortal?.(); // outside -> inside
      invert.value = !invert.value;
      maskID.value = exitTargetID.value;
    }
    wasInBox.current = isInBoxThisFrame;
  });

  // After mount or whenever stencilProps changes,
  // traverse children and apply the mask/stencil settings
  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        if (!mesh.material) return;
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        for (const mat of mats) {
          Object.assign(mat, stencilProps);
        }
      }
    });
  }, [stencilProps]);

  return (
    <group {...props}>
      <Mask ref={maskRef} id={maskID.value} colorWrite={debug}>
        <planeGeometry args={[...PlaneSize]} />
        <meshBasicMaterial side={planeSide.value} color="black" />
      </Mask>
      {debug && (
        <mesh position={center}>
          <boxGeometry args={[size.x, size.y, size.z]} />
          <meshBasicMaterial wireframe color="red" />
        </mesh>
      )}

      <group ref={groupRef}>{children}</group>
    </group>
  );
}
