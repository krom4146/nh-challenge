import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Camera, Upload, Trash2, Heart, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Proof = () => {
    type = "file"
    ref = { fileInputRef }
    onChange = { handleFileChange }
    accept = "image/*"
    className = "hidden"
        />
            </div >

    {/* Gallery Grid */ }
    < div className = "flex-1 overflow-y-auto" >
    {
        isLoading?(
                    <div className = "flex justify-center py-10" >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nh-green"></div>
                    </div>
                ) : posts.length === 0 ? (
    <div className="text-center py-10 text-gray-500">
        <Camera size={48} className="mx-auto mb-2 opacity-20" />
        <p>아직 등록된 인증샷이 없습니다.</p>
    </div>
) : (
    <div className="grid grid-cols-2 gap-3">
        {posts.map((post) => (
            <div key={post.id} className="glass-panel rounded-xl overflow-hidden group relative">
                <div className="aspect-square bg-gray-100 relative">
                    <img
                        src={post.image_url}
                        alt="인증샷"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    {/* Admin Delete Button */}
                    {isAdmin && (
                        <button
};

                    export default Proof;
