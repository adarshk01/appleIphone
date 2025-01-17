import { PerspectiveCamera, View } from "@react-three/drei";
import { Dispatch, MutableRefObject, SetStateAction, Suspense } from "react";
import * as THREE from "three";
import Lights from "./Lights";
import { div } from "three/tsl";

interface ModelViewProps {
  index: number; // Index to identify the model view
  groupRef: MutableRefObject<THREE.Group>; // Reference to a 3D object group
  gsapType: string; // Animation type for GSAP (e.g., "view1")
  controlRef: MutableRefObject<any>; // Reference to camera control (can be more specific if type is known)
  setRotationState: Dispatch<SetStateAction<number>>; // State updater for rotation value
  item: {
    title: string; // Title of the model
    color: string[]; // Array of color hex codes
    img: string; // Image source for the model
  };
  size: string; // Size of the model (e.g., "small", "large")
}

export function ModelView({
  index,
  groupRef,
  gsapType,
  controlRef,
  setRotationState,
  item,
  size,
}: ModelViewProps) {
  return (
    <View
      index={index}
      id={gsapType}
      className={`border-2 border-red-500 w-full h-full ${
        index == 2 ? "right-[-100%]" : ""
      }`}
    >
      <ambientLight intensity={0.3} />
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />
      <Lights />
      <Suspense fallback={<div>loading</div>}></Suspense>
    </View>
  );
}
