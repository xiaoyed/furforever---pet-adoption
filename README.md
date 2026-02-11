# FurForever - 宠物领养平台

这是一个完整的宠物领养平台，包含前端和后端，使用Supabase作为数据库。

## 技术栈

- 前端: React/Vite + TypeScript
- 后端: Node.js/Express
- 数据库: Supabase (PostgreSQL)
- 认证: Supabase Auth

## 功能特性

- 浏览可领养的宠物
- 收藏喜欢的宠物
- 提交领养申请
- 查看申请进度
- 接收系统消息通知
- 用户认证系统

## 安装与运行

### 前端设置

1. 安装依赖：
```bash
npm install
```

2. 创建环境变量文件 `.env.local`：
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. 运行前端：
```bash
npm run dev
```

### 后端设置

1. 进入server目录并安装依赖：
```bash
cd server
npm install
```

2. 创建环境变量文件 `server/.env`：
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. 运行后端服务：
```bash
npm run dev
```

## 项目结构

```
furforever---pet-adoption/
├── components/           # React组件
│   ├── ApplicationFormScreen.tsx
│   ├── BottomNav.tsx
│   ├── DiscoveryScreen.tsx
│   ├── FavoritesScreen.tsx
│   ├── MessagesScreen.tsx
│   ├── PetDetailScreen.tsx
│   ├── ProfileScreen.tsx
│   └── WelcomeScreen.tsx
├── server/              # 后端服务器
│   ├── server.js       # 主服务器文件
│   ├── addSamplePets.js # 示例数据脚本
│   └── package.json
├── App.tsx             # 主应用组件
├── apiService.ts       # API服务
├── authService.ts      # 认证服务
├── types.ts            # 类型定义
└── README.md
```

## Supabase配置

1. 在Supabase控制台创建新项目
2. 在SQL编辑器中运行以下SQL创建表：

```sql
-- 宠物表
CREATE TABLE pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  breed VARCHAR(100) NOT NULL,
  age VARCHAR(20),
  gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
  location TEXT,
  distance VARCHAR(20),
  image TEXT,
  category VARCHAR(20) CHECK (category IN ('dog', 'cat', 'other')),
  description TEXT,
  vaccinated BOOLEAN DEFAULT false,
  neutered BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'adopted', 'pending')),
  tags TEXT[],
  gallery TEXT[],
  shelter_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 领养申请表
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT, -- Changed to TEXT to match user ID format
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  pet_name VARCHAR(100),
  pet_image TEXT,
  status VARCHAR(20) DEFAULT '审核中' CHECK (status IN ('审核中', '已通过', '未通过')),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pet_id)
);

-- 收藏表
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT, -- Changed to TEXT to match user ID format
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pet_id)
);

-- 消息表
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT, -- Changed to TEXT to match user ID format
  title VARCHAR(200) NOT NULL,
  content TEXT,
  type VARCHAR(20) DEFAULT 'system' CHECK (type IN ('system', 'notification', 'chat')),
  is_read BOOLEAN DEFAULT false,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 上传到GitHub

要将此项目上传到GitHub，请按照以下步骤操作：

1. 确保您已安装Git
2. 在项目根目录打开终端
3. 运行以下命令：
```bash
git init
git add .
git commit -m "Initial commit: FurForever Pet Adoption App"
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

注意：项目中的环境变量文件（.env, .env.local）已被.gitignore忽略，以保护敏感信息。

## 版权

此项目为开源项目，欢迎贡献和改进。