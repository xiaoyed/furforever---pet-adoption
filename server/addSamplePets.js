// addSamplePets.js - 脚本用于添加示例宠物数据到数据库
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

// 示例宠物数据
const samplePets = [
  {
    name: '奶茶',
    breed: '英短蓝猫',
    age: '1岁',
    gender: 'female',
    location: '北京市 · 朝阳区',
    distance: '2.1km',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'cat',
    description: '温柔可爱的英短蓝猫，喜欢与人亲近，适合家庭饲养。',
    vaccinated: true,
    neutered: true,
    status: 'available',
    tags: ['温顺', '亲人', '爱干净'],
    gallery: [
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: '旺财',
    breed: '金毛寻回犬',
    age: '8个月',
    gender: 'male',
    location: '北京市 · 海淀区',
    distance: '3.5km',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'dog',
    description: '活泼好动的金毛幼犬，聪明听话，是理想的家庭伴侣犬。',
    vaccinated: true,
    neutered: false,
    status: 'available',
    tags: ['活泼', '聪明', '友善'],
    gallery: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  }
];

// 添加宠物到数据库
async function addPets() {
  for (const pet of samplePets) {
    try {
      console.log(`正在添加宠物: ${pet.name}`);
      const response = await axios.post(`${API_BASE_URL}/pets`, pet);
      console.log(`成功添加宠物: ${response.data.name} (ID: ${response.data.id})`);
    } catch (error) {
      console.error(`添加宠物 ${pet.name} 时出错:`, error.response?.data || error.message);
    }
  }
}

// 运行脚本
addPets().then(() => {
  console.log('所有宠物已尝试添加完毕！');
}).catch(console.error);