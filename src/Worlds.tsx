import { Gltf, useGLTF, useMask } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { useEffect } from "react";
import { MeshStandardMaterial } from "three";

export const ForestWorld = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
};

export const DesertWorld = () => {
  const stencile = useMask(3, false);
  return (
    <Gltf src="/Family Room.glb" scale={3} position={[0, 0, 0]} {...stencile}>
      <meshStandardMaterial {...stencile} />
    </Gltf>
  );
};

type ModelProps = GroupProps & {
  portalId?: number;
  invert?: boolean;
};
export function OrangeRoom({
  portalId = 3,
  invert = true,
  ...props
}: ModelProps) {
  const { nodes, materials } = useGLTF("/Family Room.glb");
  const stencile = useMask(portalId, !invert);
  Object.keys(materials).forEach((key) => {
    Object.assign(materials[key], stencile);
  });
  useEffect(() => {
    console.log("stencile", stencile, invert);
  }, [stencile]);
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh"].geometry}
        material={materials.mat23}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh_1"].geometry}
        material={materials.mat17}
        onClick={() => console.log("clicked")}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh_2"].geometry}
        material={materials.mat16}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh_3"].geometry}
        material={materials.mat20}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh_4"].geometry}
        material={materials.mat21}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh_5"].geometry}
        material={materials.mat24}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh_6"].geometry}
        material={materials.mat22}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh_7"].geometry}
        material={materials.mat19}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh_8"].geometry}
        material={materials.mat2}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh_9"].geometry}
        material={materials.mat25}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh_10"].geometry}
        material={materials.mat5}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh_11"].geometry}
        material={materials.mat4}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh_12"].geometry}
        material={materials.mat13}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh_13"].geometry}
        material={materials.mat14}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh_14"].geometry}
        material={materials.mat8}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Node-Mesh_15"].geometry}
        material={materials.mat12}
      />
    </group>
  );
}

export const OceanWorld = () => {
  return (
    <scene>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </scene>
  );
};
