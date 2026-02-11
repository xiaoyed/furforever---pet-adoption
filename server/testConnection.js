// testConnection.js - 测试Supabase连接和表结构
const { createClient } = require('@supabase/supabase-js');

// 从环境变量加载配置
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Not found');
console.log('Supabase Key:', supabaseKey ? 'Found' : 'Not found');

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and/or ANON_KEY not set in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // 测试查询现有数据
    console.log('\n正在测试连接并查询现有宠物数据...');
    const { data: pets, error: queryError } = await supabase
      .from('pets')
      .select('*');
    
    if (queryError) {
      console.error('查询错误:', queryError);
      return;
    }
    
    console.log('现有宠物数量:', pets.length);
    
    // 尝试插入一个测试宠物（使用一个特殊的测试模式）
    console.log('\n正在尝试插入测试宠物...');
    const { data: insertedPet, error: insertError } = await supabase
      .from('pets')
      .insert([
        {
          name: '测试宠物',
          breed: '测试品种',
          image: 'https://example.com/test-image.jpg',
          description: '这是一个测试宠物，用于验证数据库连接'
        }
      ])
      .select()
      .single();
    
    if (insertError) {
      console.error('插入错误:', insertError);
      console.log('这通常是由于行级安全策略(RLS)造成的。');
      console.log('您可能需要在Supabase仪表板中调整策略或使用服务角色密钥。');
    } else {
      console.log('成功插入测试宠物:', insertedPet.name);
    }
  } catch (error) {
    console.error('连接测试失败:', error);
  }
}

testConnection();