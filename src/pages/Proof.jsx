className = "flex items-center space-x-1 text-red-500 hover:bg-red-50 px-2 py-1 rounded-full transition-colors"
    >
                                            <Heart size={14} fill={post.likes > 0 ? "currentColor" : "none"} />
                                            <span className="text-xs font-bold">{post.likes || 0}</span>
                                        </button >
                                    </div >
                                </div >
                            </div >
                        ))}
                    </div >
                )}
            </div >
        </div >
    );
};

export default Proof;
