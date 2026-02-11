# FurForever宠物领养平台 - Vercel部署完整指南

## 项目状态
- 代码已更新至最新版本
- 环境变量前缀已标准化为 VITE_* 格式
- 构建验证通过

## Vercel部署步骤

### 第1步：访问Vercel
访问 https://vercel.com 并使用您的GitHub账户登录

### 第2步：创建新项目
1. 点击 "New Project"
2. 选择 "Import Git Repository"
3. 找到并选择 `xiaoyed/furforever---pet-adoption` 仓库
4. 点击 "Import"

### 第3步：配置项目设置
在项目配置页面，请确认以下设置：

#### 构建设置
- **Framework**: Vite (自动检测)
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `dist` (默认)

#### 环境变量设置（非常重要）
在 "Environment Variables" 部分添加以下变量：

```
VITE_SUPABASE_URL=https://cowrbghrwupfmclintsc.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_q_pKMmhczmbs6sn22FoBDA__71eYK_Q
```

**注意**：
- 变量名必须是 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`
- 使用您自己的Supabase项目URL和密钥
- 确保 `VITE_SUPABASE_ANON_KEY` 是完整的anon密钥（以eyJ开头的长字符串）

### 第4步：部署
1. 点击 "Deploy" 按钮
2. 等待构建过程完成（通常需要1-3分钟）
3. 构建成功后，您将看到分配的URL

### 第5步：验证部署
1. 访问分配的Vercel URL
2. 检查页面是否正常加载（不再是空白页）
3. 打开浏览器开发者工具（F12）检查控制台是否有错误

## 重要说明

### 环境变量配置
- **关键**：必须使用 `VITE_` 前缀，而不是 `VITE_REACT_APP_`
- 这是因为我们已更新代码以使用Vite的标准环境变量前缀
- 如果继续使用旧的前缀，会导致环境变量无法加载，造成空白页面

### Supabase密钥获取
如果您不确定您的Supabase anon密钥：
1. 登录 https://app.supabase.com/
2. 选择您的项目
3. 进入 "Project Settings" → "API"
4. 复制 "anon public" 密钥

### CORS配置
在Supabase控制台中，确保允许来自Vercel域名的请求：
1. 进入 "Authentication" → "URL Configuration"
2. 在 "Redirect URLs" 中添加您的Vercel URL
3. 在 "Site URL" 中设置Vercel URL

## 故障排除

### 如果仍然出现空白页面
1. 检查浏览器控制台错误
2. 确认环境变量名称正确（VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY）
3. 确认Supabase密钥完整且正确
4. 验证Vercel构建日志中无错误

### 如果构建失败
1. 检查Vercel构建日志
2. 确认package.json依赖项正确
3. 验证构建命令为 `npm run build`

## 项目维护

### 更新代码
1. 在本地进行更改
2. 提交并推送至main分支
3. Vercel将自动重新部署

### 回滚版本
1. 在Vercel项目页面的"Deployments"选项卡
2. 选择之前的稳定版本
3. 点击"Promote"将其设为生产版本

## 支持
如遇到问题，请检查：
- 环境变量名称和值是否正确
- Supabase项目是否正确配置
- 构建日志中的错误信息

现在您可以开始在Vercel上部署您的FurForever宠物领养平台了！