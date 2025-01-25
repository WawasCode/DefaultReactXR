import { useThree, useFrame } from "@react-three/fiber";
import { useMask } from "@react-three/drei";
import * as THREE from "three";
import { useState, useRef } from "react";

export const StencilWrite = {
  stencilWrite: true,
  stencilRef: 1,
  stencilFunc: THREE.AlwaysStencilFunc,
  stencilFail: THREE.ReplaceStencilOp,
  stencilZFail: THREE.ReplaceStencilOp,
  stencilZPass: THREE.ReplaceStencilOp,
};

export const StencilRead = {
  stencilWrite: false,
  stencilRef: 1,
  stencilFunc: THREE.EqualStencilFunc,
  stencilFail: THREE.KeepStencilOp,
  stencilZFail: THREE.KeepStencilOp,
  stencilZPass: THREE.KeepStencilOp,
};
// Portal Frame Component
function PortalFrame({ children }) {
  // Create a circular frame for the portal
  return (
    <mesh>
      <ringGeometry args={[2, 2.2, 32]} />
      <meshBasicMaterial color="white" />
      {children}
    </mesh>
  );
}

// Portal View Component
function PortalView({ children, scene }) {
  const stencil = useMask(1); // Create a mask for the portal

  return (
    <group>
      {/* Write to stencil buffer */}
      <mesh>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial {...stencil} colorWrite={false} depthWrite={false} />
      </mesh>

      {/* Render the other scene where the stencil test passes */}
      <group>{scene}</group>
    </group>
  );
}

// Alternative Scene Component
function AlternativeScene() {
  return (
    <group>
      <ambientLight intensity={0.5} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="blue" />
      </mesh>
      {/* Add more elements to your alternative scene */}
    </group>
  );
}

// Main Portal Component
export function Portal({ position = [0, 0, 0] }) {
  const portalRef = useRef();
  const [isNear, setIsNear] = useState(false);
  const { camera } = useThree();

  useFrame(() => {
    if (portalRef.current) {
      // Calculate distance to portal
      const distance = camera.position.distanceTo(portalRef.current.position);

      // Check if camera is near the portal
      if (distance < 2 && !isNear) {
        setIsNear(true);
      } else if (distance >= 2 && isNear) {
        setIsNear(false);
      }

      // If very close to portal, transition to other scene
      if (distance < 0.5) {
        // Implement transition logic here
        camera.position.z = -camera.position.z; // Simple flip to other side
      }
    }
  });

  return (
    <group ref={portalRef} position={position}>
      <PortalFrame>
        <PortalView scene={<AlternativeScene />} />
      </PortalFrame>
    </group>
  );
}
