import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Camera, Upload, Trash2, Heart, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Proof = () => {
    const { isAdmin } = useOutletContext();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [title, setTitle] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchPosts();

        // Realtime subscription
        const channel = supabase
            .channel('public:posts')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
                fetchPosts();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        setUploadFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setTitle(''); // Reset title
    };

    const handleUpload = async () => {
        if (!uploadFile) return;
        if (!title.trim()) {
            alert('인증샷 멘트를 입력해주세요!');
            return;
        }
        if (!confirm('인증샷을 등록하시겠습니까?')) return;

        setIsUploading(true);
        try {
            // 1. Upload image to Storage
            const fileExt = uploadFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('photos')
                .upload(filePath, uploadFile);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('photos')
                .getPublicUrl(filePath);

            // 3. Insert into Database
            const { error: dbError } = await supabase
                .from('posts')
                .insert([
                    {
                        image_url: publicUrl,
                        likes: 0,
                        title: title
                    }
                ]);

            if (dbError) throw dbError;

            // Reset state
            setUploadFile(null);
            setPreviewUrl(null);
            setTitle('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            alert('인증샷이 등록되었습니다!');

        } catch (error) {
            console.error('Error uploading:', error);
            alert('업로드 중 오류가 발생했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id, imageUrl) => {
        if (!confirm('정말로 이 인증샷을 삭제하시겠습니까?')) return;

        try {
            // 1. Delete from Storage (Optional but recommended)
            if (imageUrl) {
                const fileName = imageUrl.split('/').pop();
                await supabase.storage.from('photos').remove([fileName]);
            }

            // 2. Delete from Database
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', id);

            if (error) throw error;
            alert('삭제되었습니다.');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    const handleLike = async (id, currentLikes) => {
        try {
            const { error } = await supabase
                .from('posts')
                .update({ likes: currentLikes + 1 })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4 pb-20">
            {/* Header / Upload Section */}
            <div className="glass-panel p-4 rounded-2xl sticky top-0 z-10">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Camera className="text-nh-green" />
                        인증샷 갤러리
                    </h2>
                    <span className="text-sm text-gray-500 font-medium">{posts.length}개의 인증</span>
                </div>

                {!previewUrl ? (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 border-2 border-dashed border-nh-green/30 rounded-xl flex justify-center items-center gap-2 text-nh-green hover:bg-green-50 transition-colors"
                    >
                        <Upload size={20} />
                        <span className="font-medium">사진 업로드하기</span>
                    </button>
                ) : (
                    <div className="relative rounded-xl overflow-hidden bg-black/5 space-y-2 p-2">
                        <div className="relative rounded-lg overflow-hidden">
                            <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain bg-gray-100" />
                            <button
                                onClick={() => { setPreviewUrl(null); setUploadFile(null); setTitle(''); }}
                                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="인증샷 멘트를 입력하세요 (필수)"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-nh-green text-sm"
                            maxLength={50}
                        />

                        <button
                            onClick={handleUpload}
                            disabled={isUploading || !title.trim()}
                            className="w-full py-2 bg-nh-green text-white rounded-lg font-bold shadow-md disabled:opacity-50 hover:bg-[#00854d] transition-colors"
                        >
                            {isUploading ? '업로드 중...' : '등록하기'}
                        </button>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center py-10">
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
                                            onClick={() => handleDelete(post.id, post.image_url)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors z-10"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="p-3">
                                    <p className="text-sm font-bold text-gray-800 mb-1 truncate">{post.title}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={() => handleLike(post.id, post.likes)}
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
