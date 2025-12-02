import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Debug:', {
    urlExists: !!supabaseUrl,
    keyExists: !!supabaseAnonKey,
    urlLength: supabaseUrl ? supabaseUrl.length : 0
});

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url';

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({
            select: () => Promise.resolve({ data: [], error: null }),
            insert: () => Promise.resolve({ error: { message: 'Supabase가 설정되지 않았습니다.' } }),
            update: () => Promise.resolve({ error: { message: 'Supabase가 설정되지 않았습니다.' } }),
        }),
        storage: {
            from: () => ({
                upload: () => Promise.resolve({ error: { message: 'Supabase가 설정되지 않았습니다.' } }),
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
            }),
        },
        channel: () => ({
            on: () => ({
                subscribe: () => ({
                    unsubscribe: () => { },
                }),
            }),
        }),
    };

if (!isSupabaseConfigured) {
    console.warn('Supabase 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.');
}
