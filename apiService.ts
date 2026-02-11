// apiService.ts - 前端API服务
const API_BASE_URL = 'http://localhost:3001/api';

// 宠物相关API
export const petApi = {
  // 获取所有宠物
  getPets: async () => {
    const response = await fetch(`${API_BASE_URL}/pets`);
    if (!response.ok) {
      throw new Error('获取宠物列表失败');
    }
    return response.json();
  },

  // 根据ID获取单个宠物
  getPetById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`);
    if (!response.ok) {
      throw new Error('获取宠物详情失败');
    }
    return response.json();
  }
};

// 用户相关API
export const userApi = {
  // 获取用户的收藏
  getFavorites: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/favorites/${userId}`);
    if (!response.ok) {
      throw new Error('获取收藏列表失败');
    }
    return response.json();
  },

  // 添加收藏
  addFavorite: async (userId: string, petId: string) => {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, pet_id: petId }),
    });
    if (!response.ok) {
      throw new Error('添加收藏失败');
    }
    return response.json();
  },

  // 移除收藏
  removeFavorite: async (userId: string, petId: string) => {
    const response = await fetch(`${API_BASE_URL}/favorites/${userId}/${petId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('移除收藏失败');
    }
    return response.json();
  },

  // 提交领养申请
  submitApplication: async (userId: string, pet: any) => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        pet_id: pet.id,
        pet_name: pet.name,
        pet_image: pet.image,
      }),
    });
    if (!response.ok) {
      throw new Error('提交申请失败');
    }
    return response.json();
  },

  // 获取用户申请列表
  getApplications: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/applications/${userId}`);
    if (!response.ok) {
      throw new Error('获取申请列表失败');
    }
    return response.json();
  },

  // 获取用户消息
  getMessages: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/messages/${userId}`);
    if (!response.ok) {
      throw new Error('获取消息列表失败');
    }
    return response.json();
  },

  // 标记消息为已读
  markMessageAsRead: async (messageId: string, isRead: boolean = true) => {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_read: isRead }),
    });
    if (!response.ok) {
      throw new Error('更新消息状态失败');
    }
    return response.json();
  }
};