import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://vqninneaoiavwczhjpmc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbmlubmVhb2lhdndjemhqcG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyMTE5MzgsImV4cCI6MjA0NDc4NzkzOH0.l97Yh1OC7m_nyF6HkOiWdii0cYV8-hqbZeB1DgR7CMs';
export const supabase = createClient(supabaseUrl, supabaseKey)

//生产环境配置
const prodConfig = {
    redis: {
        port: 6379,
        host: 'localhost',
        db: 0,
        password: 'root'
    }
}

//开发环境配置
const devConfig = {
    redis: {
        port: 6379,
        host: 'localhost',
        db: 0,
        password: 'root'
    }
}
// 本地运行是没有 process.env.NODE_ENV 的，借此来区分[开发环境]和[生产环境]
const config = process.env.NODE_ENV ? prodConfig : devConfig;

export default config;