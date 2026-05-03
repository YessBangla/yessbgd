import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  className?: string;
};

/**
 * Lightweight Three.js hero ornament: a soft, slowly-rotating icosahedron
 * with a wireframe overlay, tinted with the brand teal/coral palette.
 *
 * Performance & a11y:
 * - Container has fixed aspect-square — no layout shift.
 * - Uses IntersectionObserver to pause when off-screen.
 * - Pauses when document is hidden.
 * - Caps DPR at 1.5 and uses low-poly geometry.
 * - Skips animation entirely under prefers-reduced-motion (renders one frame).
 * - Pointer/touch drag rotates the object; passive listeners; no scroll hijack.
 * - aria-hidden — purely decorative.
 */
export function HeroThreeOrb({ className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = mount.clientWidth || 320;
    const height = mount.clientHeight || 320;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "pan-y"; // allow vertical scroll on mobile

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 3.2;

    // Soft palette aligned with brand: teal primary + warm coral accent.
    const teal = new THREE.Color("#3CC9C2");
    const coral = new THREE.Color("#F08A5D");

    // Filled core
    const geom = new THREE.IcosahedronGeometry(1, 1);
    const mat = new THREE.MeshPhongMaterial({
      color: teal,
      emissive: new THREE.Color("#0c5a55"),
      shininess: 60,
      flatShading: true,
      transparent: true,
      opacity: 0.88,
    });
    const mesh = new THREE.Mesh(geom, mat);
    scene.add(mesh);

    // Wireframe halo
    const wireGeom = new THREE.IcosahedronGeometry(1.18, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: coral,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wire = new THREE.Mesh(wireGeom, wireMat);
    scene.add(wire);

    // Lighting
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(2, 2, 3);
    scene.add(key);
    const rim = new THREE.DirectionalLight(coral, 0.6);
    rim.position.set(-3, -1, -2);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // Pointer / drag interaction
    let targetRotX = 0.2;
    let targetRotY = 0.4;
    let curRotX = targetRotX;
    let curRotY = targetRotY;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      renderer.domElement.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) {
        // Hover-driven subtle parallax (desktop only)
        const rect = renderer.domElement.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotY = 0.4 + px * 0.6;
        targetRotX = 0.2 + py * 0.4;
        return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      targetRotY += dx * 0.008;
      targetRotX += dy * 0.008;
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      renderer.domElement.releasePointerCapture?.(e.pointerId);
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);
    renderer.domElement.addEventListener("pointerleave", () => {
      // Ease back to baseline when pointer leaves (desktop)
      if (!dragging) {
        targetRotX = 0.2;
        targetRotY = 0.4;
      }
    });

    // Resize
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    // Visibility / intersection pausing
    let visible = true;
    let docVisible = !document.hidden;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    io.observe(mount);
    const onDocVis = () => {
      docVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onDocVis);

    // Render loop
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (visible && docVisible) {
        if (!reduce && !dragging) {
          targetRotY += dt * 0.25; // slow auto-rotation
        }
        curRotX += (targetRotX - curRotX) * 0.08;
        curRotY += (targetRotY - curRotY) * 0.08;
        mesh.rotation.x = curRotX;
        mesh.rotation.y = curRotY;
        wire.rotation.x = curRotX * 0.6;
        wire.rotation.y = -curRotY * 0.6;
        renderer.render(scene, camera);
      }

      raf = requestAnimationFrame(tick);
    };

    if (reduce) {
      // Render a single frame at baseline orientation, then stop.
      mesh.rotation.x = curRotX;
      mesh.rotation.y = curRotY;
      wire.rotation.x = curRotX * 0.6;
      wire.rotation.y = -curRotY * 0.6;
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onDocVis);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      geom.dispose();
      wireGeom.dispose();
      mat.dispose();
      wireMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className={className}
      style={{ touchAction: "pan-y" }}
    />
  );
}
