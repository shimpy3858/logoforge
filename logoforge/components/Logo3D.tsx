"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { MutableRefObject, useMemo, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

export type Mode3D = "icon" | "tile" | "phone" | "coin" | "cube" | "gold" | "glass" | "neon" | "orb" | "badge" | "podium" | "laptop";
type Drag = { x: number; y: number; down: boolean; lx: number; ly: number };

function iconGeometry(path: string, depth: number) {
  const data = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${path}"/></svg>`);
  const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  const geo = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness: 2, bevelSize: 1.5, bevelSegments: 3, curveSegments: 16 });
  geo.center();
  return geo;
}

function rrect(w: number, h: number, r: number) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

const bevel = { bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 4, curveSegments: 24 };

type Geo = THREE.BufferGeometry | null;

function Glyph({ geo, k, z = 0, color, rotY = 0, metal = 0.35, rough = 0.3, glow }: { geo: Geo; k: number; z?: number; color: string; rotY?: number; metal?: number; rough?: number; glow?: string }) {
  return geo ? (
    <mesh geometry={geo} scale={[k, -k, k]} position={[0, 0, z]} rotation={[0, rotY, 0]}>
      <meshStandardMaterial color={color} metalness={metal} roughness={rough} emissive={glow ?? "#000000"} emissiveIntensity={glow ? 0.4 : 0} />
    </mesh>
  ) : (
    <mesh position={[0, 0, z]}><boxGeometry args={[1, 1, 0.3]} /><meshStandardMaterial color={color} /></mesh>
  );
}

function Model({ path, colors, mode, drag }: { path: string; colors: [string, string]; mode: Mode3D; drag: MutableRefObject<Drag> }) {
  const g = useRef<THREE.Group>(null!);
  const icon = useMemo<Geo>(() => { try { return iconGeometry(path, 14); } catch { return null; } }, [path]);
  const edges = useMemo(() => (icon ? new THREE.EdgesGeometry(icon, 25) : null), [icon]);
  const G = useMemo(() => {
    const hex = new THREE.CylinderGeometry(1.9, 1.9, 0.4, 6); hex.rotateX(Math.PI / 2);
    const hexIn = new THREE.CylinderGeometry(1.6, 1.6, 0.1, 6); hexIn.rotateX(Math.PI / 2);
    const coin = new THREE.CylinderGeometry(1.7, 1.7, 0.32, 64); coin.rotateX(Math.PI / 2);
    return {
      tile: new THREE.ExtrudeGeometry(rrect(3.4, 3.4, 0.7), { depth: 0.5, ...bevel }),
      phone: new THREE.ExtrudeGeometry(rrect(2.1, 4.2, 0.32), { depth: 0.28, ...bevel }),
      screen: new THREE.ShapeGeometry(rrect(1.86, 3.96, 0.22)),
      lid: new THREE.ExtrudeGeometry(rrect(4.2, 2.7, 0.12), { depth: 0.1, ...bevel }),
      lidScreen: new THREE.ShapeGeometry(rrect(3.9, 2.4, 0.08)),
      hex, hexIn, coin,
      rim: new THREE.TorusGeometry(1.6, 0.08, 16, 64),
    };
  }, []);

  const spin = mode === "coin" || mode === "cube";
  const tilt = mode === "cube" ? 0.4 : mode === "laptop" ? 0.3 : mode === "podium" ? 0.25 : 0;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    g.current.rotation.y = drag.current.x + (spin ? t * 0.8 : Math.sin(t * 0.7) * 0.45);
    g.current.rotation.x = drag.current.y + tilt + Math.sin(t * 0.5) * 0.08;
    g.current.position.y = Math.sin(t * 1.2) * 0.08;
  });

  const [c0, c1] = colors;
  return (
    <group ref={g}>
      {mode === "icon" && <Glyph geo={icon} k={0.034} color={c0} />}

      {mode === "gold" && <Glyph geo={icon} k={0.034} color="#f5c542" metal={0.55} rough={0.28} glow="#a86a00" />}

      {mode === "tile" && (
        <>
          <mesh geometry={G.tile} position={[0, 0, -0.25]}><meshStandardMaterial color={c0} metalness={0.25} roughness={0.35} /></mesh>
          <Glyph geo={icon} k={0.019} z={0.45} color="#ffffff" />
        </>
      )}

      {mode === "glass" && (
        <>
          <mesh position={[-1.1, 0.7, -1.4]}><sphereGeometry args={[0.9, 32, 32]} /><meshStandardMaterial color={c0} emissive={c0} emissiveIntensity={0.6} /></mesh>
          <mesh position={[1.2, -0.8, -1.4]}><sphereGeometry args={[0.8, 32, 32]} /><meshStandardMaterial color={c1} emissive={c1} emissiveIntensity={0.6} /></mesh>
          <mesh geometry={G.tile} position={[0, 0, -0.25]}>
            <meshPhysicalMaterial color="#ffffff" transmission={0.95} thickness={0.8} roughness={0.08} ior={1.45} metalness={0} transparent />
          </mesh>
          <Glyph geo={icon} k={0.019} z={0.45} color="#ffffff" rough={0.1} />
        </>
      )}

      {mode === "phone" && (
        <>
          <mesh geometry={G.phone} position={[0, 0, -0.14]}><meshStandardMaterial color="#111827" metalness={0.6} roughness={0.25} /></mesh>
          <mesh geometry={G.screen} position={[0, 0, 0.235]}><meshStandardMaterial color={c0} emissive={c1} emissiveIntensity={0.25} /></mesh>
          <Glyph geo={icon} k={0.013} z={0.33} color="#ffffff" />
        </>
      )}

      {mode === "coin" && (
        <>
          <mesh geometry={G.coin}><meshStandardMaterial color={c0} metalness={0.8} roughness={0.25} /></mesh>
          <mesh geometry={G.rim} position={[0, 0, 0.16]}><meshStandardMaterial color={c1} metalness={0.8} roughness={0.25} /></mesh>
          <mesh geometry={G.rim} position={[0, 0, -0.16]}><meshStandardMaterial color={c1} metalness={0.8} roughness={0.25} /></mesh>
          <Glyph geo={icon} k={0.02} z={0.2} color="#ffffff" metal={0.5} />
          <Glyph geo={icon} k={0.02} z={-0.2} rotY={Math.PI} color="#ffffff" metal={0.5} />
        </>
      )}

      {mode === "cube" && (
        <>
          <mesh><boxGeometry args={[2.4, 2.4, 2.4]} /><meshStandardMaterial color={c0} metalness={0.25} roughness={0.35} /></mesh>
          {[0, 1, 2, 3].map((q) => (
            <group key={q} rotation={[0, (q * Math.PI) / 2, 0]}><Glyph geo={icon} k={0.018} z={1.2} color="#ffffff" /></group>
          ))}
          <group rotation={[-Math.PI / 2, 0, 0]}><Glyph geo={icon} k={0.018} z={1.2} color={c1} /></group>
        </>
      )}

      {mode === "neon" && (
        <>
          {icon && (
            <mesh geometry={icon} scale={[0.034, -0.034, 0.034]}>
              <meshStandardMaterial color="#05060a" emissive={c0} emissiveIntensity={0.18} metalness={0.3} roughness={0.5} />
            </mesh>
          )}
          {icon && (
            <mesh geometry={icon} scale={[0.0365, -0.0365, 0.0365]}>
              <meshBasicMaterial color={c1} side={THREE.BackSide} />
            </mesh>
          )}
          {edges && <lineSegments geometry={edges} scale={[0.034, -0.034, 0.034]}><lineBasicMaterial color="#ffffff" /></lineSegments>}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.1, 0]}><torusGeometry args={[1.7, 0.03, 8, 64]} /><meshBasicMaterial color={c1} /></mesh>
        </>
      )}

      {mode === "orb" && (
        <>
          <mesh><sphereGeometry args={[1.7, 64, 64]} /><meshPhysicalMaterial color={c0} metalness={0.2} roughness={0.15} clearcoat={1} clearcoatRoughness={0.1} /></mesh>
          <Glyph geo={icon} k={0.012} z={1.62} color="#ffffff" />
        </>
      )}

      {mode === "badge" && (
        <>
          <mesh geometry={G.hex}><meshStandardMaterial color={c0} metalness={0.45} roughness={0.3} /></mesh>
          <mesh geometry={G.hexIn} position={[0, 0, 0.2]}><meshStandardMaterial color={c1} metalness={0.3} roughness={0.35} /></mesh>
          <Glyph geo={icon} k={0.02} z={0.3} color="#ffffff" />
        </>
      )}

      {mode === "podium" && (
        <group position={[0, 0.5, 0]}>
          <mesh position={[0, -1.7, 0]}><cylinderGeometry args={[1.9, 2.1, 0.5, 48]} /><meshStandardMaterial color="#e5e7eb" metalness={0.2} roughness={0.4} /></mesh>
          <mesh position={[0, -1.3, 0]}><cylinderGeometry args={[1.5, 1.5, 0.3, 48]} /><meshStandardMaterial color={c0} metalness={0.4} roughness={0.3} /></mesh>
          <mesh position={[0, -1.12, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.5, 0.04, 12, 64]} /><meshStandardMaterial color={c1} emissive={c1} emissiveIntensity={0.8} /></mesh>
          <group position={[0, 0.5, 0]}><Glyph geo={icon} k={0.026} color={c1} /></group>
        </group>
      )}

      {mode === "laptop" && (
        <group position={[0, -0.1, 0]}>
          <mesh position={[0, -1.1, 0]}><boxGeometry args={[4.2, 0.14, 2.8]} /><meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} /></mesh>
          <mesh position={[0, -1.02, 0.15]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[3.6, 1.5]} /><meshStandardMaterial color="#1f2937" /></mesh>
          <group position={[0, -1.03, -1.4]} rotation={[-0.2, 0, 0]}>
            <mesh geometry={G.lid} position={[0, 1.35, -0.1]}><meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.3} /></mesh>
            <mesh geometry={G.lidScreen} position={[0, 1.35, 0.05]}><meshStandardMaterial color={c0} emissive={c1} emissiveIntensity={0.3} /></mesh>
            <group position={[0, 1.35, 0.06]}><Glyph geo={icon} k={0.012} z={0.05} color="#ffffff" /></group>
          </group>
        </group>
      )}
    </group>
  );
}

export default function Logo3D({ path, colors, mode, canvasRef }: { path: string; colors: [string, string]; mode: Mode3D; canvasRef: MutableRefObject<HTMLCanvasElement | null> }) {
  const drag = useRef<Drag>({ x: 0, y: 0, down: false, lx: 0, ly: 0 });
  return (
    <div
      className="h-[420px] w-full cursor-grab touch-none active:cursor-grabbing"
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); Object.assign(drag.current, { down: true, lx: e.clientX, ly: e.clientY }); }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d.down) return;
        d.x += (e.clientX - d.lx) * 0.01;
        d.y = Math.max(-0.9, Math.min(0.9, d.y + (e.clientY - d.ly) * 0.01));
        d.lx = e.clientX; d.ly = e.clientY;
      }}
      onPointerUp={() => { drag.current.down = false; }}
      onPointerCancel={() => { drag.current.down = false; }}
    >
      <Canvas camera={{ position: [0, 0, 7], fov: 40 }} dpr={[1, 2]} gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }} onCreated={({ gl }) => { canvasRef.current = gl.domElement; }}>
        <ambientLight intensity={0.8} />
        <hemisphereLight args={["#ffffff", "#555566", 0.9]} />
        <directionalLight position={[4, 5, 6]} intensity={2.2} />
        <pointLight position={[-4, -2, 4]} intensity={60} color={colors[1]} />
        <Model path={path} colors={colors} mode={mode} drag={drag} />
      </Canvas>
    </div>
  );
}
