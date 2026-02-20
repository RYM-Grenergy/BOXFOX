"use client";
import React, { useState } from 'react';
import { Layers, BoxSelect, Maximize2, Palette, Save, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LabSettingsPage() {
    const [activeTab, setActiveTab] = useState('models');

    const labPresets = [
        { id: 1, name: 'Standard 3Ply Mailer', material: 'Kraft', status: 'Active' },
        { id: 2, name: 'Premium Duplex Cake Box', material: 'White Duplex', status: 'Active' },
        { id: 3, name: 'Eco-Pizza Single Wall', material: 'Recycled Kraft', status: 'Inactive' },
    ];

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-gray-950 tracking-tighter">Lab Settings</h1>
                    <p className="text-gray-400 font-medium tracking-tight">Configure the 3D visualization engine and product mockups.</p>
                </div>
                <button className="px-8 py-4 bg-gray-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-gray-200 flex items-center gap-2">
                    <Plus size={18} /> Add New Preset
                </button>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-50">
                    {['Models', 'Materials', 'Lighting', 'MOQs'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`px-10 py-6 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab.toLowerCase() ? 'border-emerald-500 text-gray-950' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-8">
                            <h2 className="text-xl font-black text-gray-950">Active Lab Presets</h2>
                            <div className="space-y-4">
                                {labPresets.map(preset => (
                                    <div key={preset.id} className="p-6 bg-gray-50 rounded-2xl flex items-center justify-between border border-transparent hover:border-gray-200 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400">
                                                <BoxSelect size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-950">{preset.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{preset.material}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${preset.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                                                {preset.status}
                                            </span>
                                            <button className="text-[10px] font-black uppercase tracking-widest text-emerald-500 underline">Configure</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-xl font-black text-gray-950">Quick Actions</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <button className="p-6 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center gap-4 hover:bg-emerald-100 transition-all text-left">
                                    <Palette size={20} />
                                    <div>
                                        <p className="font-black text-xs uppercase tracking-widest">Material Editor</p>
                                        <p className="text-[10px] font-bold opacity-70">Define PBR textures & colors</p>
                                    </div>
                                </button>
                                <button className="p-6 bg-blue-50 text-blue-600 rounded-3xl flex items-center gap-4 hover:bg-blue-100 transition-all text-left">
                                    <Maximize2 size={20} />
                                    <div>
                                        <p className="font-black text-xs uppercase tracking-widest">Dimension Logic</p>
                                        <p className="text-[10px] font-bold opacity-70">Set fold & glue constraints</p>
                                    </div>
                                </button>
                                <button className="p-6 bg-gray-950 text-white rounded-3xl flex items-center gap-4 hover:bg-gray-900 transition-all text-left shadow-2xl shadow-gray-200 mt-4">
                                    <Save size={20} className="text-emerald-500" />
                                    <div>
                                        <p className="font-black text-xs uppercase tracking-widest">Global Deploy</p>
                                        <p className="text-[10px] font-bold opacity-50">Push updates to live shop</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
