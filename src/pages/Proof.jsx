import React, { useState, useEffect, useRef } from 'react';
import { Camera, Heart, Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Proof = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [title, setTitle] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [posts, setPosts] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error);
        } else {
            setPosts(data || []);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const clearSelection = () => {
        setFile(null);
        setPreviewUrl(null);
        setTitle('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = async () => {
        if (!file || !title) return;

        setIsUploading(true);
        try {
            // 1. Upload image to Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('photos')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('photos')
                .getPublicUrl(fileName);

            // 3. Insert into Database
            const { error: dbError } = await supabase
                .from('posts')
                .insert([{ title, image_url: publicUrl }]);

            if (dbError) throw dbError;

            // 4. Reset and Refresh
            clearSelection();
            fetchPosts();
            alert('인증샷이 성공적으로 업로드되었습니다!');

        } catch (error) {
            console.error('Upload error:', error);
            alert('업로드 중 오류가 발생했습니다. (Supabase 설정을 확인해주세요)');
        } finally {
            setIsUploading(false);
        }
    };

    const handleLike = async (id, currentLikes) => {
        // Optimistic update
        setPosts(posts.map(post =>
            post.id === id ? { ...post, likes: currentLikes + 1 } : post
        ));

        const { error } = await supabase
            .from('posts')
            .update({ likes: currentLikes + 1 })
            .eq('id', id);

        if (error) {
            console.error('Error updating likes:', error);
            fetchPosts(); // Revert on error
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in pb-4">
            <div className="text-center space-y-1 shrink-0">
                <h2 className="text-2xl font-bold text-gradient animate-slide-up">인증샷 갤러리</h2>
                <p className="text-sm text-gray-700 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    오늘의 활동을 사진으로 남겨보세요.
                </p>
            </div>

            {/* Upload Section */}
            <div className="glass-panel p-4 rounded-2xl animate-slide-up shrink-0" style={{ animationDelay: '0.2s' }}>
                {!previewUrl ? (
                    <div
                        onClick={() => fileInputRef.current.click()}
                        className="w-full aspect-[3/1] bg-white/40 rounded-xl border-2 border-dashed border-nh-green/30 flex flex-col items-center justify-center text-nh-green hover:bg-white/60 transition-colors cursor-pointer"
                    >
                        <Camera size={32} className="mb-1 opacity-70" />
                        <span className="text-sm font-bold">사진 촬영 / 업로드</span>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden shadow-md">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={clearSelection}
                                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="제목을 입력하세요 (예: 퀴즈 완료!)"
                                className="flex-1 px-3 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-nh-green/50 text-sm"
                            />
                            <button
                                onClick={handleUpload}
                                disabled={isUploading || !title}
                                className="px-4 py-2 bg-nh-green text-white font-bold rounded-lg shadow-md btn-press disabled:opacity-50 flex items-center space-x-1"
                            >
                                {isUploading ? (
                                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                                ) : (
                                    <>
                                        <Upload size={16} />
                                        <span>등록</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-1">
                {posts.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        <p>아직 등록된 인증샷이 없습니다.<br />첫 번째 주인공이 되어보세요!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 pb-4">
                        {posts.map((post) => (
                            <div key={post.id} className="glass-panel rounded-xl overflow-hidden shadow-sm animate-fade-in break-inside-avoid">
                                <div className="aspect-square w-full overflow-hidden">
                                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-gray-800 text-sm truncate mb-2">{post.title}</h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-gray-500">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={() => handleLike(post.id, post.likes || 0)}
                                            className="flex items-center space-x-1 text-red-500 hover:bg-red-50 px-2 py-1 rounded-full transition-colors"
                                        >
                                            <Heart size={14} fill={post.likes > 0 ? "currentColor" : "none"} />
                                            <span className="text-xs font-bold">{post.likes || 0}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Proof;
