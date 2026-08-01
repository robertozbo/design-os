import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { AvatarState } from '@/../product/sections/assistente-nymos/types'

interface Avatar3DProps {
  state: AvatarState
  className?: string
  trackPointer?: boolean
}

const STATE_COLOR: Record<AvatarState, { vertex: string; scatter: string; glow: string }> = {
  idle: { vertex: '#5eead4', scatter: '#0d9488', glow: '#14b8a6' },
  listening: { vertex: '#99f6e4', scatter: '#2dd4bf', glow: '#2dd4bf' },
  thinking: { vertex: '#2dd4bf', scatter: '#0f766e', glow: '#0d9488' },
  speaking: { vertex: '#a7f3d0', scatter: '#5eead4', glow: '#5eead4' },
}

// Lee Perry Smith — a classic free 3D head model used in three.js examples.
const HEAD_MODEL_URL =
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb'

interface HeadProps {
  state: AvatarState
  trackPointer: boolean
}

function makeSquareTexture() {
  const size = 16
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#fff'
  ctx.fillRect(2, 2, size - 4, size - 4)
  const tex = new THREE.CanvasTexture(canvas)
  tex.magFilter = THREE.NearestFilter
  tex.minFilter = THREE.NearestFilter
  return tex
}

function Head({ state, trackPointer }: HeadProps) {
  const groupRef = useRef<THREE.Group>(null)
  const facePointsRef = useRef<THREE.Points>(null)
  const scatterRef = useRef<THREE.Points>(null)
  const { pointer } = useThree()

  const color = STATE_COLOR[state]
  const squareTex = useMemo(makeSquareTexture, [])

  const gltf = useLoader(GLTFLoader, HEAD_MODEL_URL) as unknown as { scene: THREE.Object3D }

  // Extract a single mesh geometry from the loaded head model, normalize to unit size,
  // and convert to a point cloud.
  const facePositions = useMemo(() => {
    let extracted: THREE.BufferGeometry | null = null
    let worldMatrix: THREE.Matrix4 | null = null
    gltf.scene.traverse((obj) => {
      const m = obj as THREE.Mesh
      if (m.isMesh && !extracted) {
        extracted = m.geometry
        m.updateWorldMatrix(true, false)
        worldMatrix = m.matrixWorld.clone()
      }
    })
    if (!extracted) return new Float32Array(0)

    const geom = (extracted as THREE.BufferGeometry).clone()
    if (worldMatrix) geom.applyMatrix4(worldMatrix)

    // Center + normalize to fit a unit sphere
    geom.computeBoundingBox()
    const box = geom.boundingBox!
    const center = new THREE.Vector3()
    box.getCenter(center)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 1.6 / maxDim // head fits in ~1.6 unit cube

    const src = geom.attributes.position
    const total = src.count
    const stride = 2 // subsample for performance
    const kept = Math.floor(total / stride)
    const out = new Float32Array(kept * 3)
    for (let i = 0, j = 0; i < total && j < kept; i += stride, j++) {
      out[j * 3 + 0] = (src.getX(i) - center.x) * scale
      out[j * 3 + 1] = (src.getY(i) - center.y) * scale
      out[j * 3 + 2] = (src.getZ(i) - center.z) * scale
    }
    return out
  }, [gltf])

  // Scatter particles around the head — sampled from same positions with random outward displacement
  const scatterPositions = useMemo(() => {
    if (facePositions.length === 0) return new Float32Array(0)
    const N = Math.floor(facePositions.length / 3)
    const SCATTER_PER_POINT = 0.8 // ~80% as many scatter points as face points
    const scatterCount = Math.floor(N * SCATTER_PER_POINT)
    const out = new Float32Array(scatterCount * 3)
    const v = new THREE.Vector3()
    for (let i = 0; i < scatterCount; i++) {
      const srcIdx = Math.floor(Math.random() * N)
      v.set(
        facePositions[srcIdx * 3 + 0],
        facePositions[srcIdx * 3 + 1],
        facePositions[srcIdx * 3 + 2],
      )
      // Scatter outward — random direction, biased toward radial
      const radial = v.clone().normalize()
      const jitter = new THREE.Vector3(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
      )
      const dist = Math.pow(Math.random(), 1.6) * 0.6 // most close, few far
      v.addScaledVector(radial, dist).add(jitter)
      out[i * 3 + 0] = v.x
      out[i * 3 + 1] = v.y
      out[i * 3 + 2] = v.z
    }
    return out
  }, [facePositions])

  const faceGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(facePositions, 3))
    return g
  }, [facePositions])

  const scatterGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(scatterPositions, 3))
    return g
  }, [scatterPositions])

  // Plexus lines — connect key face points with thin edges (k-nearest neighbors).
  // Only points near the front-facing area of the head qualify so the lines focus on the face.
  const plexusGeometry = useMemo(() => {
    if (facePositions.length === 0) return new THREE.BufferGeometry()
    const N = Math.floor(facePositions.length / 3)
    // Filter to front-facing key points (z > 0 roughly), then subsample heavily
    const keyPoints: Array<[number, number, number]> = []
    for (let i = 0; i < N; i++) {
      const x = facePositions[i * 3 + 0]
      const y = facePositions[i * 3 + 1]
      const z = facePositions[i * 3 + 2]
      // Front-facing: z positive (anatomy depends on model orientation)
      // We accept ALL but heavier sample from the front. With Lee Perry Smith the face is +Z.
      if (z > -0.1) keyPoints.push([x, y, z])
    }
    // Subsample to ~280 plexus anchors
    const target = 280
    const step = Math.max(1, Math.floor(keyPoints.length / target))
    const plexus: Array<[number, number, number]> = []
    for (let i = 0; i < keyPoints.length; i += step) plexus.push(keyPoints[i])

    // For each plexus point, find K=4 nearest neighbors and emit an edge
    const K = 4
    const MAX_DIST_SQ = 0.16 // cap so we don't get long cross-face lines
    const edgesOut: number[] = []
    for (let i = 0; i < plexus.length; i++) {
      const [ax, ay, az] = plexus[i]
      // Collect distances to all other points
      const dists: Array<{ idx: number; d: number }> = []
      for (let j = 0; j < plexus.length; j++) {
        if (i === j) continue
        const [bx, by, bz] = plexus[j]
        const dx = ax - bx
        const dy = ay - by
        const dz = az - bz
        const d = dx * dx + dy * dy + dz * dz
        if (d < MAX_DIST_SQ) dists.push({ idx: j, d })
      }
      dists.sort((a, b) => a.d - b.d)
      for (let k = 0; k < Math.min(K, dists.length); k++) {
        const j = dists[k].idx
        if (j > i) {
          // emit edge i-j once
          edgesOut.push(ax, ay, az, plexus[j][0], plexus[j][1], plexus[j][2])
        }
      }
    }
    const arr = new Float32Array(edgesOut)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [facePositions])

  const stateAnim = useMemo(() => {
    switch (state) {
      case 'listening':
        return { breatheSpeed: 4.2, breatheAmp: 0.04, scatterDrift: 0.6, rotSpeed: 0 }
      case 'thinking':
        return { breatheSpeed: 1.6, breatheAmp: 0.012, scatterDrift: 0.25, rotSpeed: 0.35 }
      case 'speaking':
        return { breatheSpeed: 2.4, breatheAmp: 0.015, scatterDrift: 0.9, rotSpeed: 0 }
      case 'idle':
      default:
        return { breatheSpeed: 1.0, breatheAmp: 0.012, scatterDrift: 0.18, rotSpeed: 0 }
    }
  }, [state])

  useFrame((stt, delta) => {
    const t = stt.clock.elapsedTime
    if (!groupRef.current) return

    if (trackPointer) {
      const targetY = pointer.x * 0.55
      const targetX = -pointer.y * 0.32
      groupRef.current.rotation.y +=
        (targetY - groupRef.current.rotation.y) * 0.08 + stateAnim.rotSpeed * delta * 0.05
      groupRef.current.rotation.x +=
        (targetX - groupRef.current.rotation.x) * 0.08
    } else {
      groupRef.current.rotation.y += stateAnim.rotSpeed * delta
    }

    const breathe = 1 + Math.sin(t * stateAnim.breatheSpeed) * stateAnim.breatheAmp
    groupRef.current.scale.set(breathe, breathe, breathe)

    // Scatter drift — slow vertical floating effect
    if (scatterRef.current) {
      scatterRef.current.rotation.y = Math.sin(t * 0.4) * 0.06 * stateAnim.scatterDrift
      scatterRef.current.position.y = Math.sin(t * 0.6) * 0.015 * stateAnim.scatterDrift
    }
  })

  return (
    <group ref={groupRef} scale={1.15} position={[0, -0.05, 0]}>
      {/* Plexus lines connecting nearby face points */}
      <lineSegments geometry={plexusGeometry}>
        <lineBasicMaterial
          color={color.vertex}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </lineSegments>

      {/* Head point cloud — voxel-like squares */}
      <points ref={facePointsRef} geometry={faceGeometry}>
        <pointsMaterial
          size={0.024}
          color={color.vertex}
          map={squareTex}
          alphaTest={0.5}
          transparent
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Scatter particles around the silhouette */}
      <points ref={scatterRef} geometry={scatterGeometry}>
        <pointsMaterial
          size={0.012}
          color={color.scatter}
          map={squareTex}
          alphaTest={0.5}
          transparent
          sizeAttenuation
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

function FallbackOrb() {
  return (
    <points>
      <icosahedronGeometry args={[0.9, 2]} />
      <pointsMaterial size={0.04} color="#2dd4bf" sizeAttenuation transparent opacity={0.6} />
    </points>
  )
}

function ScanLine() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((stt) => {
    if (!ref.current) return
    const t = stt.clock.elapsedTime
    const cycle = (t % 4) / 4
    ref.current.position.y = 1.4 - cycle * 3.0
    const m = ref.current.material as THREE.MeshBasicMaterial
    m.opacity = cycle < 0.05 || cycle > 0.95 ? 0 : 0.45
  })
  return (
    <mesh ref={ref} position={[0, 1.4, 0.6]}>
      <planeGeometry args={[3.4, 0.014]} />
      <meshBasicMaterial color="#99f6e4" transparent opacity={0} />
    </mesh>
  )
}

export function Avatar3D({ state, className = '', trackPointer = true }: Avatar3DProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<FallbackOrb />}>
          <ambientLight intensity={0.5} />
          <Head state={state} trackPointer={trackPointer} />
          <ScanLine />
        </Suspense>
      </Canvas>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-teal-500/15 blur-3xl"
        style={{ animation: 'nymos3d-halo 4s ease-in-out infinite' }}
      />

      <style>{`
        @keyframes nymos3d-halo {
          0%, 100% { transform: scale(0.95); opacity: 0.35; }
          50% { transform: scale(1.06); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
