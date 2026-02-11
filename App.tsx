
import React, { useState, useEffect } from 'react';
import { AppScreen, Pet, Application, Message } from './types';
import { petApi, userApi } from './apiService';
import { getCurrentUser, onAuthStateChange } from './authService';
import WelcomeScreen from './components/WelcomeScreen';
import DiscoveryScreen from './components/DiscoveryScreen';
import PetDetailScreen from './components/PetDetailScreen';
import ApplicationFormScreen from './components/ApplicationFormScreen';
import ProfileScreen from './components/ProfileScreen';
import FavoritesScreen from './components/FavoritesScreen';
import MessagesScreen from './components/MessagesScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 监听认证状态变化
    const subscription = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user);
        setUserId(session?.user?.id);
        setIsAuthenticated(true);
        // 登录成功后跳转到发现页面
        setCurrentScreen('discovery');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserId(null);
        setIsAuthenticated(false);
        // 清空用户数据
        setFavorites([]);
        setApplications([]);
        setMessages([]);
        // 重定向到欢迎页面
        setCurrentScreen('welcome');
      }
    });

    // 检查初始认证状态
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setUserId(currentUser.id);
        setIsAuthenticated(true);
        // 如果用户已登录，直接进入发现页面
        setCurrentScreen('discovery');
      } else {
        // 如果用户未登录，进入欢迎页面
        setIsAuthenticated(false);
        setCurrentScreen('welcome');
      }
      setIsLoading(false);
    };

    checkUser();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userId && isAuthenticated) {
      loadInitialData();
    }
  }, [userId, isAuthenticated]);

  const loadInitialData = async () => {
    try {
      // 加载宠物数据
      const petsData = await petApi.getPets();
      setPets(petsData);
      
      // 加载用户收藏 - 后端返回的是宠物对象数组
      const favData = await userApi.getFavorites(userId!);
      setFavorites(favData.map((fav: any) => fav.id));
      
      // 加载用户申请
      const appsData = await userApi.getApplications(userId!);
      setApplications(appsData);
      
      // 加载用户消息
      const msgsData = await userApi.getMessages(userId!);
      setMessages(msgsData);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateTo = (screen: AppScreen, pet?: Pet) => {
    if (pet) setSelectedPet(pet);
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const toggleFavorite = async (petId: string) => {
    if (!userId) {
      alert('请先登录');
      navigateTo('welcome');
      return;
    }
    
    const isCurrentlyFavorite = favorites.includes(petId);
    
    try {
      if (isCurrentlyFavorite) {
        // 移除收藏
        await userApi.removeFavorite(userId, petId);
        setFavorites(prev => prev.filter(id => id !== petId));
      } else {
        // 添加收藏
        await userApi.addFavorite(userId, petId);
        setFavorites(prev => [...prev, petId]);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      alert('操作失败，请稍后重试');
    }
  };

  const addApplication = async (pet: Pet) => {
    if (!userId) {
      alert('请先登录');
      navigateTo('welcome');
      return;
    }
    
    try {
      const newApp = await userApi.submitApplication(userId, pet);
      setApplications(prev => [newApp, ...prev]);
      
      // 消息会由后端自动创建，但我们可以本地添加一个以提供即时反馈
      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        title: '申请提交成功',
        content: `您对"${pet.name}"的领养申请已成功提交，请耐心等待审核。`,
        date: new Date().toLocaleString('zh-CN'),
        isRead: false,
        type: 'system'
      };
      setMessages(prev => [newMessage, ...prev]);
      
      // 重新加载消息以确保与后端同步
      try {
        const msgsData = await userApi.getMessages(userId);
        setMessages(msgsData);
      } catch (error) {
        console.error('Failed to reload messages:', error);
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('提交申请失败，请稍后重试');
    }
  };

  const renderScreen = () => {
    // 如果用户未登录，显示欢迎页面
    if (!isAuthenticated) {
      return <WelcomeScreen onStart={() => {
        // 登录成功后，认证状态监听器会自动跳转到发现页面
        // 这里不需要手动跳转，因为onAuthStateChange会处理
      }} />;
    }
    
    // 用户已登录，根据currentScreen显示相应页面
    switch (currentScreen) {
      case 'discovery':
        return (
          <DiscoveryScreen 
            onSelectPet={(pet) => navigateTo('detail', pet)} 
            onTabChange={(tab) => navigateTo(tab as any)}
          />
        );
      case 'favorites':
        return (
          <FavoritesScreen 
            userId={userId}
            favorites={favorites}
            pets={pets}
            onSelectPet={(pet) => navigateTo('detail', pet)}
            onTabChange={(tab) => navigateTo(tab as any)}
          />
        );
      case 'messages':
        return (
          <MessagesScreen 
            userId={userId}
            messages={messages}
            onTabChange={(tab) => navigateTo(tab as any)}
          />
        );
      case 'detail':
        return (
          <PetDetailScreen 
            pet={selectedPet || pets[0]} 
            userId={userId}
            isFavorite={favorites.includes(selectedPet?.id || '')}
            onToggleFavorite={() => toggleFavorite(selectedPet?.id || '')}
            onBack={() => navigateTo('discovery')} 
            onApply={() => navigateTo('form')}
          />
        );
      case 'form':
        return (
          <ApplicationFormScreen 
            pet={selectedPet || pets[0]} 
            onBack={() => navigateTo('detail')} 
            onSubmit={() => {
              addApplication(selectedPet!);
              navigateTo('profile');
            }}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            userId={userId}
            applications={applications}
            onBack={() => navigateTo('discovery')} 
            onTabChange={(tab) => navigateTo(tab as any)}
          />
        );
      default:
        return <DiscoveryScreen 
          onSelectPet={(pet) => navigateTo('detail', pet)} 
          onTabChange={(tab) => navigateTo(tab as any)}
        />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background-light dark:bg-background-dark shadow-2xl relative overflow-x-hidden">
      {renderScreen()}
    </div>
  );
};

export default App;
