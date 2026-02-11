
import { Pet, Shelter } from './types';

// 这些常量将在应用启动时从API加载
export const DEFAULT_SHELTER: Shelter = {
  id: '',
  name: '暂无数据',
  avatar: '',
  publishedCount: 0,
};

// 宠物数据将从API获取，此处保留类型定义
