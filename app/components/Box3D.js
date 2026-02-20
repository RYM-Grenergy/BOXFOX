"use client";
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function Box3D({ type = "pizza", size = { w: 12, h: 1.5, d: 12 } }) {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const boxRef = useRef(null);
    const rendererRef = useRef(null);

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#f9fafb");
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(35, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        camera.position.set(5, 4, 5);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(10, 10, 10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-10, -10, -10);
        scene.add(pointLight);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.minPolarAngle = Math.PI / 4;
        controls.maxPolarAngle = Math.PI / 1.5;
        controls.update();

        // Box Setup
        const scale = 0.2;
        const geometry = new THREE.BoxGeometry(size.w * scale, size.h * scale, size.d * scale);

        const colors = {
            pizza: "#f3f4f6",
            rigid: "#1a1a1a",
            corrugated: "#d2b48c",
            bakery: "#ffffff"
        };

        const material = new THREE.MeshStandardMaterial({
            color: colors[type] || colors.pizza,
            roughness: 0.4,
            metalness: 0.1
        });

        const box = new THREE.Mesh(geometry, material);
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);
        boxRef.current = box;

        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.1, transparent: true }));
        box.add(line);

        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            if (boxRef.current) boxRef.current.rotation.y += 0.005;
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!mountRef.current) return;
            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            edges.dispose();
        };
    }, [size, type]);

    return (
        <div className="w-full h-full min-h-[400px] bg-gray-50 rounded-[2rem] overflow-hidden relative cursor-grab active:cursor-grabbing">
            <div className="absolute top-6 left-6 z-10">
                <span className="px-3 py-1 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Interactive 3D Preview (Vanilla JS Mode)
                </span>
            </div>

            <div ref={mountRef} className="w-full h-full" />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                <span className="text-[11px] font-bold text-gray-400 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gray-100">
                    Drag to Rotate &bull; Scroll to Zoom
                </span>
            </div>
        </div>
    );
}
