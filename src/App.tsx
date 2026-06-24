import React, { useState, useEffect } from 'react';
import {
  Music,
  MessageSquare,
  Settings,
  DollarSign,
  Globe,
  Search,
  Share2,
  Sparkles,
  CheckCircle,
  Clock,
  User,
  Check,
  Copy,
  Calendar,
  Plus,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Heart,
  Info,
  Coins,
  ShieldCheck,
  AlertCircle,
  Trash2,
  Play,
  Send,
  Sliders,
  Star,
  RefreshCw,
  TrendingUp,
  Award,
  Download,
  Users,
  Percent,
  Grid
} from 'lucide-react';
import { Order, Lead, Feedback, Settings as SystemSettings, SongResult, FeishuMarketingTask } from './types';

export default function App() {
  // Navigation Tabs
  // 'consumer' = Form Order; 'admin' = Owner Agent Panel; 'blueprint' = Business Plan;
  const [activeTab, setActiveTab] = useState<'consumer' | 'admin' | 'blueprint'>('consumer');
  
  // View mode switcher: isClientDemoMode means simulating how a customer views the app on mobile
  const [isClientDemoMode, setIsClientDemoMode] = useState<boolean>(false);
  const [showAdminUnlockModal, setShowAdminUnlockModal] = useState<boolean>(false);
  const [unlockPasswordInput, setUnlockPasswordInput] = useState<string>('');
  const [blueprintSubTab, setBlueprintSubTab] = useState<'strategy' | 'sop'>('sop'); // Default to SOP so they see how to do it!
  const [cloneSopTab, setCloneSopTab] = useState<'suno' | 'gpt'>('suno');
  const [showOutsourceSpec, setShowOutsourceSpec] = useState<boolean>(false);
  const [showPosterModal, setShowPosterModal] = useState<boolean>(false);
  const [posterTemplate, setPosterTemplate] = useState<'obsidian' | 'vintage' | 'rose' | 'forest'>('obsidian');
  const [customQuoteText, setCustomQuoteText] = useState<string>('');
  const [showGridLines, setShowGridLines] = useState<boolean>(true);
  const [posterGenerating, setPosterGenerating] = useState<boolean>(false);
  const [posterCampaignName, setPosterCampaignName] = useState<string>('小红书爆款引流');
  const [marketingScene, setMarketingScene] = useState<'gaokao' | 'birthday' | 'anniversary' | 'healing'>('anniversary');
  const [isGeneratingSceneCopy, setIsGeneratingSceneCopy] = useState<boolean>(false);
  const [generatedSocialCopy, setGeneratedSocialCopy] = useState<string>('');
  
  // Consumer Questionnaire State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    user_name: '',
    target_audience: '',
    creation_reason: '',
    key_memories: '',
    core_message: '',
    emotions: [] as string[],
    scenes: [] as string[],
    music_style: '流行(Pop) - 朗朗上口大众喜爱',
    singer_gender: '温暖少年/温柔男声',
    reference_song: '',
    language: '纯国语',
    tempo: '中速 - 缓和舒服',
    song_title: '',
    lyrics_style: '故事叙事 - 像在讲一个连续的故事',
    must_include_words: '',
    must_avoid_words: '',
    payment_memo: '',
    user_wechat: '',
    referral_channel: '小红书'
  });

  const [selectedPlanPrice, setSelectedPlanPrice] = useState<number>(998);
  const [selectedPlanName, setSelectedPlanName] = useState<string>('进阶款 · 专属版 ★ 主推');
  const [selectedAddons, setSelectedAddons] = useState<Array<{ name: string; price: number }>>([]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptName, setReceiptName] = useState<string>('');
  
  // AI Generation States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [songResult, setSongResult] = useState<SongResult | null>(null);
  const [generatedOrderId, setGeneratedOrderId] = useState<string>('');

  // Admin States
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [sysSettings, setSysSettings] = useState<SystemSettings>({
    wechatId: 'wanwan2026_8',
    alipayQrCodeText: 'HTTPS://QR.ALIPAY.COM/MOCK_ALIPAY_RECEIVE_CODE_AZI_STUDIO',
    wechatQrCodeText: 'WECHAT_MOCK_PAY_CODE_AZI_STUDIO_WANWAN',
    aiSystemPrompt: ''
  });

  // Admin UI Controls
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);
  const [showAnniversaryScript, setShowAnniversaryScript] = useState<boolean>(false);
  const [orderSourceRole, setOrderSourceRole] = useState<'founder' | 'partner' | 'promoter'>('promoter');
  const [includeExtraBonus, setIncludeExtraBonus] = useState<boolean>(true);
  const [adminViewRole, setAdminViewRole] = useState<'founder' | 'partner_sh' | 'promoter_xy'>('founder');
  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const [crawlKeyword, setCrawlKeyword] = useState<string>('定制写歌');
  const [pitchLoadingId, setPitchLoadingId] = useState<string | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);
  const [editedWechat, setEditedWechat] = useState<string>('');
  const [editedSystemPrompt, setEditedSystemPrompt] = useState<string>('');

  // 📈 Financial Stats & Feishu Webhook Integration States
  const [financeActiveTab, setFinanceActiveTab] = useState<'overall' | 'breakdown' | 'feishu' | 'partners'>('overall');
  const [feishuWebhookUrl, setFeishuWebhookUrl] = useState<string>('https://open.feishu.cn/open-apis/bot/v2/hook/ai_music_assistant_bot_856fe33e');
  const [feishuBotStatus, setFeishuBotStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [feishuLogs, setFeishuLogs] = useState<string[]>([]);
  const [feishuReviewMonth, setFeishuReviewMonth] = useState<string>('2026-06');
  const [showFeishuMobileSim, setShowFeishuMobileSim] = useState<boolean>(false);

  // AI Generated Business Advisor Report States
  const [businessReport, setBusinessReport] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState<boolean>(false);
  const [feishuMarketingTasks, setFeishuMarketingTasks] = useState<FeishuMarketingTask[]>([]);

  // 🤝 Infinite Referral Partners & Founders Sandboxed Matrix States
  const [partnerCount, setPartnerCount] = useState<number>(8); // Direct founders / partners recruited
  const [promoterPerPartner, setPromoterPerPartner] = useState<number>(5); // Secondary promoters per partner
  const [ordersPerPerson, setOrdersPerPerson] = useState<number>(6); // Average monthly orders per promoter
  const [averageOrderPrice, setAverageOrderPrice] = useState<number>(298); // Average price per custom track
  const [partnerInviteCode, setPartnerInviteCode] = useState<string>('AZ_FOUNDER_888');
  const [partnerNameInput, setPartnerNameInput] = useState<string>('');
  const [partnerRegionInput, setPartnerRegionInput] = useState<string>('上海徐汇');
  const [mockPartnersList, setMockPartnersList] = useState<Array<{
    id: string;
    name: string;
    region: string;
    level: 'founder' | 'partner' | 'promoter';
    directCount: number;
    teamCount: number;
    totalGmv: number;
    commissionPaid: number;
    createdAt: string;
  }>>([
    { id: 'PT001', name: '陈墨 (阿紫合伙人)', region: '杭州西湖', level: 'founder', directCount: 14, teamCount: 18, totalGmv: 15300, commissionPaid: 4590, createdAt: '2026-01-10' },
    { id: 'PT002', name: '张潇经理', region: '北京朝阳', level: 'partner', directCount: 8, teamCount: 9, totalGmv: 8940, commissionPaid: 1788, createdAt: '2026-03-15' },
    { id: 'PT003', name: '李婷婷 (校园代理)', region: '上海杨浦', level: 'promoter', directCount: 19, teamCount: 0, totalGmv: 5662, commissionPaid: 849, createdAt: '2026-04-02' }
  ]);

  // Consumer Anonymous Feedback States
  const [anonymousComment, setAnonymousComment] = useState<string>('');
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  // Load Initial Data from Backend
  const refreshAdminData = async () => {
    try {
      const ordRes = await fetch('/api/admin/orders');
      const ordData = await ordRes.json();
      if (ordData.orders) setOrders(ordData.orders);

      const leadRes = await fetch('/api/admin/leads');
      const leadData = await leadRes.json();
      if (leadData.leads) setLeads(leadData.leads);

      const settingsRes = await fetch('/api/admin/settings');
      const settingsData = await settingsRes.json();
      if (settingsData.settings) {
        setSysSettings(settingsData.settings);
        setEditedWechat(settingsData.settings.wechatId);
        setEditedSystemPrompt(settingsData.settings.aiSystemPrompt);
      }

      const fbRes = await fetch('/api/feedback/list');
      const fbData = await fbRes.json();
      if (fbData.feedback) setFeedbackList(fbData.feedback);
    } catch (e) {
      console.error("Error loading admin data:", e);
    }
  };

  const fetchBusinessReport = async (currentOrders?: Order[]) => {
    setLoadingReport(true);
    try {
      const res = await fetch('/api/gemini/business-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: currentOrders || orders })
      });
      const data = await res.json();
      if (data.success) {
        setBusinessReport(data);
      }
    } catch (error) {
      console.error("Failed to fetch business advisory report:", error);
    } finally {
      setLoadingReport(false);
    }
  };

  const executeMarketingSuggestion = (suggestion: any) => {
    const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newTask: FeishuMarketingTask = {
      id: 'task_' + Date.now(),
      title: suggestion.title,
      desc: suggestion.desc,
      priority: suggestion.priority || 'HIGH',
      targetRegion: suggestion.targetRegion || '全国',
      status: 'executing',
      createdAt: timeStr
    };

    setFeishuMarketingTasks(prev => [newTask, ...prev]);

    // Append beautiful micro-logs to show live synchronization
    setFeishuLogs(prev => [
      ...prev,
      `🔄 [${timeStr}] 正在同步创建飞书待办营销任务...`,
      `🔐 [${timeStr}] Webhook 校验通过，正在写入待办看板 [${newTask.title}]`,
      `🚀 [${timeStr}] 一键执行同步完毕！「营销决策 -> 飞书看板」秒级推送成功！`
    ]);

    // Automatically open the simulated Feishu mobile view
    setShowFeishuMobileSim(true);

    // Physical prompt
    triggerToast(`🎉 成功同步飞书待办！已派发：${newTask.title}`);
  };

  useEffect(() => {
    if (financeActiveTab === 'breakdown' && !businessReport && orders.length > 0) {
      fetchBusinessReport();
    }
  }, [financeActiveTab, orders]);

  useEffect(() => {
    refreshAdminData();
    // Auto-refresh stats occasionally for automated simulation feel
    const interval = setInterval(() => {
      refreshAdminData();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`${label}已成功复制到剪贴板！`);
  };

  const generateOutsourceText = (order: Order) => {
    const addonNames = order.addons && order.addons.length > 0
      ? order.addons.map(a => a.name).join(', ')
      : '无额外加购';
      
    return `=========================================
      🎤 阿紫音乐工作室 · 专属外包制作需求单 🎤
=========================================
【需求状态】: 待制作 / 极速交付
【下单客户】: ${order.userName || '匿名客户'} (微信号: ${order.userWechat || '暂无'})
【定制规格】: ${order.planName || '基础款'} (总价: ¥${order.totalPrice || 0})
【加购服务】: ${addonNames}
【歌曲标题】: 《${order.songTitle || '未命名'}》
-----------------------------------------
1. 核心人声与编曲要求:
   - 偏好曲风: ${order.musicStyle || '普通流行'}
   - 人声音色: ${order.singerGender || '不限'}
   - 语言倾向: ${order.language || '纯国语'}
   - 节奏速度: ${order.tempo || '中速 - 缓和舒服'}
   
2. 客户定制背景与细节:
   - 送歌对象: ${order.targetAudience || '未指定'}
   - 创作缘由: ${order.creationReason || '未填写'}
   - 关键记忆/细节: ${order.keyMemories || '暂无'}
   - 核心传达情感: ${order.coreMessage || '暂无'}
   - 情绪色彩: ${order.emotions || '温馨/抒情'}
   - 应用场景: ${order.scenes || '未指定'}

3. 官方定制歌词大纲 (请严格对照此歌词编曲录音/声线克隆):
${order.lyrics ? order.lyrics : '（暂无已生成的AI歌词，请在需求详情中运行歌词生成或自行提供）'}

-----------------------------------------
【制作人须知】:
- 请严格保护客户隐私，成品及素材切勿在公开任何第三方平台；
- 制作完成后，请交付：1. 纯人声干声轨(WAV) 2. 伴奏轨(WAV) 3. 完整混音成品(WAV + MP3)；
- 请于约定交付时间前完成制作，感谢合作！
=========================================`;
  };

  const getAnniversaryStatus = (o: any) => {
    if (!orders || orders.length === 0) return { isAnniversary: false, pastOrder: null, message: '', type: 'none' };
    
    // Parse order's own year
    let currentYear = 2026;
    try {
      if (o.createdAt) {
        currentYear = new Date(o.createdAt.replace(/-/g, '/')).getFullYear();
      }
    } catch (err) {}
    
    // Find past year orders for this customer (same userName or same userWechat)
    const pastOrders = orders.filter(other => {
      if (other.id === o.id) return false;
      let otherYear = 2025;
      try {
        if (other.createdAt) {
          otherYear = new Date(other.createdAt.replace(/-/g, '/')).getFullYear();
        }
      } catch (err) {}
      
      if (otherYear >= currentYear) return false; // Must be from a previous calendar year
      
      const matchWechat = other.userWechat && o.userWechat && 
        other.userWechat.trim().toLowerCase() === o.userWechat.trim().toLowerCase() && 
        other.userWechat.trim() !== '未填写' &&
        other.userWechat.trim() !== '';
        
      const matchName = other.userName && o.userName && 
        other.userName.trim() === o.userName.trim() && 
        other.userName.trim() !== '';
        
      return matchWechat || matchName;
    });
    
    if (pastOrders.length === 0) return { isAnniversary: false, pastOrder: null, message: '', type: 'none' };
    
    // Sort past orders to find the closest calendar date
    let currentD = new Date();
    try {
      if (o.createdAt) {
        currentD = new Date(o.createdAt.replace(/-/g, '/'));
      }
    } catch (err) {}
    
    for (const past of pastOrders) {
      let pastD = new Date();
      try {
        if (past.createdAt) {
          pastD = new Date(past.createdAt.replace(/-/g, '/'));
        }
      } catch (err) {}
      
      const monthDiff = Math.abs(pastD.getMonth() - currentD.getMonth());
      const dayDiff = Math.abs(pastD.getDate() - currentD.getDate());
      
      // Exact day or within same month and within 15 days
      if (monthDiff === 0 && dayDiff <= 15) {
        return {
          isAnniversary: true,
          pastOrder: past,
          type: 'exact',
          message: `去年同期黄金定制纪念日！(历史定制于 ${past.createdAt.split(' ')[0]})`
        };
      } else if (monthDiff === 0) {
        return {
          isAnniversary: true,
          pastOrder: past,
          type: 'month',
          message: `年度复购转化高价值窗口期 (去年当月定制《${past.songTitle || '未命名'}》)`
        };
      }
    }
    
    // Default fallback: we still have some past years' history!
    return {
      isAnniversary: true,
      pastOrder: pastOrders[0],
      type: 'history',
      message: `尊贵定制老客 (曾于 ${pastOrders[0].createdAt.split(' ')[0]} 消费过)`
    };
  };

  const handleGenerateSceneCopy = (sceneType: 'gaokao' | 'birthday' | 'anniversary' | 'healing') => {
    setIsGeneratingSceneCopy(true);
    const order = selectedOrderForDetail || (orders.length > 0 ? orders[0] : null);
    const orderTitle = order?.songTitle || '未命名';
    const targetAudience = order?.targetAudience || '最爱的人';
    const keyMemories = order?.keyMemories || '那些欢笑与泪水的瞬间';
    const creationReason = order?.creationReason || '特别的纪念时刻';
    
    setTimeout(() => {
      let quote = '';
      let socialCopy = '';
      
      if (sceneType === 'gaokao') {
        quote = "风来自远方，去向更远的地方。在少年滚烫的旋律里，乾坤未定，你我皆是黑马。";
        socialCopy = `🎓 【高考圆梦 · 专属定制励志歌单】
乾坤未定，你我皆是黑马！送给拼搏不息的学子们。

🎵 励志定制单曲：《${orderTitle}》
送给：${targetAudience}
定制初衷：高考冲刺与毕业纪念，致敬那段挑灯夜战的无悔青春

✨ 走心语录：“${quote}”

在阿紫AI音乐工作室，每一个熬过的夜、写满的试卷、拼过的梦，都能被写进专属的黑胶旋律里。只要将他的名字、座右铭和关键故事发给阿紫，AI和主创老师将在10分钟内生成极富张力和电影感的高质量燃向歌曲！

👉 赶紧带图私信，定制属于你们的无悔青春主题曲，或者是想加入阿紫的校园合伙人计划，一键分享爆款流量，套利无上限！
---
#高考加油 #致敬青春 #原创歌曲 #小红书爆款 #送考生的礼物 #阿紫AI写歌`;
      } else if (sceneType === 'birthday') {
        quote = "愿你永远有梦可依，有歌可唱。岁月的年轮里，这首定制的歌，记录我们最真挚的祝福。";
        socialCopy = `🎂 【生日温情礼物 · 专属黑胶声音日记】
世界上最珍寻的礼物，不是奢侈的皮包，而是一首只属于你的声音记忆。

🎵 生日定制单曲：《${orderTitle}》
送给：${targetAudience}
定制初衷：生日专属祝福与岁月感恩，将温暖与回忆永久刻录

✨ 走心语录：“${quote}”

阿紫音乐工作室首创“故事变歌曲”体验！只要您提供TA的名字和过去一年共同经历的温暖回忆（如：${keyMemories}），AI在后台深度调优，配合金牌谱曲，10分钟为您呈现最顶级的生日专属黑胶单曲。听完瞬间泪目，成为朋友圈最吸睛的生日礼物！

👉 私信阿紫，发送您的寿星名字，立即一键开始您的专属生日献礼！
---
#生日礼物首选 #走心生日祝福 #给女友的生日惊喜 #黑胶唱片 #生日快乐 #声音记忆`;
      } else if (sceneType === 'anniversary') {
        quote = "回忆是时光里最美的音符。万水千山，多谢你陪我走过这冗长人世，写成了歌，唱给你听。";
        socialCopy = `💑 【浪漫纪念日 · 执手今生的专属爱情赞歌】
“纸短情长，所有的情话，都不如一首写进歌里的真情告白。”

🎵 纪念日定制单曲：《${orderTitle}》
送给：${targetAudience}
定制初衷：恋爱/结婚纪念日心动记录，给爱人一辈子的声音信物

✨ 走心语录：“${quote}”

这是一位心动客户在阿紫工作室为爱人定制的浪漫回响。客户说：“${creationReason}”，我们在音乐里揉进了 ${keyMemories}。AI与金牌编曲默契结合，将这份沉甸甸的爱升华为永恒黑胶唱片，全网各大音乐平台一键发行！

👉 发送你们的恋爱纪念故事，这个纪念日，送TA一份能循环播放一辈子的爱意！
---
#送女友纪念日 #恋爱一周年礼物 #结婚纪念日创意 #专属定制歌曲 #高逼格表白 #情歌定制`;
      } else {
        quote = "夜深了，世界很吵，但阿紫的歌声很静。愿每一个疲惫的灵魂，都在这旋律中被温柔以待。";
        socialCopy = `🌌 【温暖治愈晚安 · 抚平白日喧嚣的枕边心跳】
夜深了，卸下白日的盔甲，让这首温柔的情歌，陪伴你沉沉睡去。

🎵 治愈定制单曲：《${orderTitle}》
送给：${targetAudience}
定制初衷：自我犒赏或深夜疗愈，用最纯粹的旋律抚慰每一个不眠夜

✨ 走心语录：“${quote}”

阿紫工作室相信，每一个独特的灵魂都值得一首专属的安神催眠曲。我们为 ${targetAudience} 深度定制了这首《${orderTitle}》。温柔的男声/女声在耳边轻吟，将他的白日奋斗和 ${creationReason} 转化为清新的民谣，给您注入满满的元气！

👉 感到疲惫时，不妨来阿紫这里，将您的心事倾诉给AI，定制您的专属疗愈之歌。
---
#深夜疗愈 #治愈系音乐 #网易云深夜热评 #晚安歌词 #独处时光 #声音定制 #解压神器`;
      }
      
      setCustomQuoteText(quote);
      setGeneratedSocialCopy(socialCopy);
      setIsGeneratingSceneCopy(false);
      triggerToast(`✨ AI 成功为您批量生成「${sceneType === 'gaokao' ? '高考励志' : sceneType === 'birthday' ? '生日祝福' : sceneType === 'anniversary' ? '恋爱纪念' : '温暖治愈'}」推广文案并同步至海报金句！`);
    }, 800);
  };

  const openPosterGenerator = () => {
    let order = selectedOrderForDetail;
    if (!order && orders.length > 0) {
      order = orders[0];
      setSelectedOrderForDetail(orders[0]);
    }
    
    if (order) {
      setCustomQuoteText(order.coreMessage || (order.lyrics ? order.lyrics.split('\n')[0] : "回忆是时光里最美的音符，定制一首专属于你们的歌。"));
    } else {
      setCustomQuoteText("回忆是时光里最美的音符，定制一首专属于你们的歌。");
    }
    setShowPosterModal(true);
    
    // Auto-generate scene copy after state settles
    setTimeout(() => {
      handleGenerateSceneCopy('anniversary');
    }, 150);
  };

  const handleRegeneratePoster = () => {
    setPosterGenerating(true);
    setTimeout(() => {
      setPosterGenerating(false);
      triggerToast("✨ AI智能排版布局优化完成！");
    }, 1200);
  };

  // Form Controls
  const handleNextStep = () => {
    // Basic validation
    if (currentStep === 1) {
      if (!formData.user_name.trim()) {
        triggerToast("请填写您的称呼！");
        return;
      }
      if (!formData.target_audience.trim()) {
        triggerToast("请写明这首歌要送给谁！");
        return;
      }
      if (!formData.core_message.trim()) {
        triggerToast("请写下最想对TA说的那句话！");
        return;
      }
    }
    if (currentStep === 5) {
      if (!formData.payment_memo.trim()) {
        triggerToast("请输入对账核验姓名或转账后4位！");
        return;
      }
    }
    if (currentStep === 6) {
      if (!formData.user_wechat.trim()) {
        triggerToast("请输入您的微信号以供后续专属对接！");
        return;
      }
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final submit
      submitSongRequest();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChipToggle = (field: 'emotions' | 'scenes', value: string) => {
    setFormData(prev => {
      const list = [...prev[field]];
      if (list.includes(value)) {
        return { ...prev, [field]: list.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...list, value] };
      }
    });
  };

  const handleSingleSelect = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddonToggle = (name: string, price: number) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.name === name);
      if (exists) {
        return prev.filter(a => a.name !== name);
      } else {
        return [...prev, { name, price }];
      }
    });
  };

  const handlePlanSelect = (name: string, price: number) => {
    setSelectedPlanName(name);
    setSelectedPlanPrice(price);
  };

  const getAddonsTotal = () => selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const getGrandTotal = () => selectedPlanPrice + getAddonsTotal();

  // Primary Submission Trigger
  const submitSongRequest = async () => {
    setIsGenerating(true);
    setCurrentStep(7); // Show generating / outcome step
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const total = getGrandTotal();
    const orderId = `SG${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(new Date().getHours()).padStart(2, '0')}${String(new Date().getMinutes()).padStart(2, '0')}${String(Math.floor(1000 + Math.random() * 9000))}`;
    setGeneratedOrderId(orderId);

    const payload = {
      ...formData,
      order_id: orderId,
      emotions: formData.emotions.join(', '),
      scenes: formData.scenes.join(', '),
      order_total_price: total,
      selected_plan_name: selectedPlanName
    };

    try {
      // 1. Submit order details to backend database (in-memory)
      const orderRes = await fetch('/api/order/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const orderData = await orderRes.json();
      console.log("Order stored successfully:", orderData);

      // 2. Call Gemini AI Lyric Customizer on server
      const lyricRes = await fetch('/api/gemini/write-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const lyricData = await lyricRes.json();
      
      if (lyricData.success) {
        setSongResult({
          songTitle: lyricData.songTitle,
          lyrics: lyricData.lyrics,
          melodyAdvice: lyricData.melodyAdvice,
          aiNotes: lyricData.aiNotes,
          isRealAi: lyricData.isRealAi
        });

        // Update the order in the background so the admin dashboard gets the generated lyrics immediately
        await fetch('/api/admin/order/update-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderId,
            lyrics: lyricData.lyrics,
            melodyAdvice: lyricData.melodyAdvice,
            aiNotes: lyricData.aiNotes
          })
        });
      } else {
        throw new Error("AI Lyric generator did not return success");
      }
    } catch (err) {
      console.error("Full-stack submission failed:", err);
      triggerToast("AI写歌服务暂忙，已启动精细人工打磨预案，请保持微信畅通！");
      // Fallback high quality
      setSongResult({
        songTitle: formData.song_title || `${formData.target_audience.replace(/给|送给/g, '')}的专属旋律`,
        lyrics: `[Verse 1]\n在起风的下午 翻看那些泛黄照片\n你说时光太快 眨眼就过了好多年\n曾经我们在雨天的长椅上许下心愿\n如今万家灯火里 终于有你的笑脸\n\n[Chorus]\n这是写给你的歌 句句都是我的执着\n在茫茫人海中 谢谢你牵手选择了我\n听那窗外的雨声 像我们当年的歌声\n往后漫长余生 都有我陪着你走过`,
        melodyAdvice: `【吉他抒情民谣风格推荐】\n采用温暖沉稳的马丁吉他铺底，在副歌高潮融入悠扬的提琴，完美契合“${formData.emotions.join('/') || '温暖治愈'}”的歌曲意境。`,
        aiNotes: `亲爱的 ${formData.user_name}，我是主创阿紫。我已经看到了您的付款对账与定制申请。这首曲子写尽了您的真挚心迹，我们接下来将在微信讨论组深入敲定人声音轨，期待为您呈献最棒的艺术结晶！`,
        isRealAi: false
      });
    } finally {
      setIsGenerating(false);
      refreshAdminData();
    }
  };

  // Submit Feedback Box
  const handleFeedbackSubmit = async () => {
    if (!anonymousComment.trim()) {
      triggerToast("请输入点您对网页流程的真实感受哦~");
      return;
    }
    try {
      const res = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating_score: ratingScore,
          comment: anonymousComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackSubmitted(true);
        triggerToast("感谢您的热心吐槽和支持！");
        refreshAdminData();
      }
    } catch (e) {
      triggerToast("网络微喘，稍后重试");
    }
  };

  // Owner Dashboard Actions
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const res = await fetch('/api/admin/order/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`订单状态已更新为：${
          status === 'pending' ? '待审核' : status === 'reconciled' ? '已到账' : status === 'processing' ? '制作中' : '已交付'
        }`);
        if (selectedOrderForDetail?.id === orderId) {
          setSelectedOrderForDetail(prev => prev ? { ...prev, status } : null);
        }
        refreshAdminData();
      }
    } catch (e) {
      triggerToast("操作失败");
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm("确定要删除这个订单记录吗？此操作无法撤销。")) return;
    try {
      const res = await fetch(`/api/admin/order/${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        triggerToast("订单记录已删除");
        setSelectedOrderForDetail(null);
        refreshAdminData();
      }
    } catch (e) {
      triggerToast("删除失败");
    }
  };

  const triggerSocialCrawl = async () => {
    setIsCrawling(true);
    triggerToast("正在爬取小红书、抖音、拼多多平台相关评论区...");
    try {
      const res = await fetch('/api/admin/leads/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: crawlKeyword })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`拓客引擎发现1条高意向线索：来自${data.lead.platform === 'xiaohongshu' ? '小红书' : '抖音'}的 @${data.lead.username}`);
        refreshAdminData();
      }
    } catch (e) {
      triggerToast("扫描超时，AI代理已在安全集群重试。");
    } finally {
      setIsCrawling(false);
    }
  };

  const triggerSocialPitch = async (leadId: string) => {
    setPitchLoadingId(leadId);
    try {
      const res = await fetch('/api/admin/leads/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId })
      });
      const data = await res.json();
      if (data.success) {
        if (data.lead.status === 'converted') {
          triggerToast(`🚀 精准推送成功！客户 @${data.lead.username} 被AI话术极度打动，已完成 ¥998 档次账单支付！财务已自动入账并新增一条制作需求！`);
        } else {
          triggerToast(`话术已自动私信推送给客户 @${data.lead.username}，已在平台中置顶。`);
        }
        refreshAdminData();
      }
    } catch (e) {
      triggerToast("推送出错");
    } finally {
      setPitchLoadingId(null);
    }
  };

  const saveSystemSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wechatId: editedWechat,
          aiSystemPrompt: editedSystemPrompt
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast("系统设置与AI System Prompt微调成功！");
        setSysSettings(data.settings);
        refreshAdminData();
      }
    } catch (e) {
      triggerToast("保存失败");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Calculations for Admin Analytics Dashboard (Filtered by Simulated Permission Role)
  const roleFilteredBaseOrders = orders.filter(o => {
    if (adminViewRole === 'founder') return true;
    if (adminViewRole === 'partner_sh') {
      // 上海徐汇合伙人 只能看到 小红书 推广渠道出的单子 (模拟其下属私域)
      return o.referralChannel === '小红书';
    }
    if (adminViewRole === 'promoter_xy') {
      // 校园推广员 只能看到 朋友圈/朋友推荐 渠道出的单子
      return o.referralChannel === '朋友推荐' || o.referralChannel === '朋友圈';
    }
    return true;
  });

  const activeOrdersCount = roleFilteredBaseOrders.length;
  const totalOrganicRevenue = roleFilteredBaseOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const conversionRate = leads.length > 0 ? ((leads.filter(l => l.status === 'converted').length / leads.length) * 100).toFixed(1) : '25.0';
  const passiveLapsed = adminViewRole === 'founder'
    ? leads.filter(l => l.status === 'converted').length * 998
    : adminViewRole === 'partner_sh'
      ? Math.round(leads.filter(l => l.status === 'converted' && l.platform === 'xiaohongshu').length * 998 * 0.4) // 40% of leads for regional share
      : 0; // promoter has no regional passive flow
  const totalConsolidatedRevenue = totalOrganicRevenue; 

  // 📅 Calculate Today's Revenue based on local system time 2026-06-23
  const todayDateStr = "2026-06-23";
  const todayOrders = roleFilteredBaseOrders.filter(o => o.createdAt && o.createdAt.startsWith(todayDateStr));
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  // 📅 Calculate monthly revenue and order count breakdowns
  const getMonthlyBreakdown = () => {
    const monthlyData: { [key: string]: { amount: number; count: number } } = {};
    roleFilteredBaseOrders.forEach(o => {
      if (!o.createdAt) return;
      const parts = o.createdAt.split(' ')[0].split('-');
      if (parts.length >= 2) {
        const monthKey = `${parts[0]}年${parts[1]}月`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { amount: 0, count: 0 };
        }
        monthlyData[monthKey].amount += o.totalPrice || 0;
        monthlyData[monthKey].count += 1;
      }
    });
    return monthlyData;
  };

  const getYearlyBreakdown = () => {
    const yearlyData: { [key: string]: { amount: number; count: number } } = {};
    roleFilteredBaseOrders.forEach(o => {
      if (!o.createdAt) return;
      const parts = o.createdAt.split(' ')[0].split('-');
      if (parts.length >= 1) {
        const yearKey = `${parts[0]}年`;
        if (!yearlyData[yearKey]) {
          yearlyData[yearKey] = { amount: 0, count: 0 };
        }
        yearlyData[yearKey].amount += o.totalPrice || 0;
        yearlyData[yearKey].count += 1;
      }
    });
    return yearlyData;
  };

  const monthlyStats = getMonthlyBreakdown();
  const yearlyStats = getYearlyBreakdown();

  const handlePushToFeishu = () => {
    if (!feishuWebhookUrl.trim()) {
      triggerToast("请输入有效的飞书机器人 Webhook 地址！");
      return;
    }
    setFeishuBotStatus('sending');
    setFeishuLogs([
      "🔄 [09:00:00] 正在初始化飞书 API 连接...",
      "🔐 [09:00:01] 正在校验 Webhook 鉴权签名...",
      "📊 [09:00:02] 正在聚合当月财务流水、纪念日老客数据、AI转化率...",
      "📋 [09:00:03] 正在抓取系统内今日待办交付（待对账/待处理/审核中）订单列表...",
      "🔗 [09:00:04] 正在将待办任务一键同步至 飞书待办看板 ＆ 交付审批工作流...",
      "🧠 [09:00:05] AI 智能模型分析当月复盘指标并生成下月策略建议..."
    ]);
    
    setTimeout(() => {
      setFeishuLogs(prev => [
        ...prev,
        "✉️ [09:00:06] 正在构造 飞书Card 自动化富文本消息主体...",
        "🚀 [09:00:07] Webhook 消息发送成功，状态码: 200 OK!",
        "🎉 [09:00:07] 飞书AI音乐自动化成功实现「获客-订单-分润-待办同步-交付审批」的全闭环运作！"
      ]);
      setFeishuBotStatus('success');
      setShowFeishuMobileSim(true);
      triggerToast("🎉 成功推送到飞书！可在下方查看群机器人多合一待办＆财务卡片");
    }, 1500);
  };

  const handleAddCustomPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerNameInput.trim()) {
      triggerToast("请输入合伙人姓名！");
      return;
    }
    const newPartner = {
      id: `PT${Date.now().toString().slice(-3)}`,
      name: `${partnerNameInput} (城市合伙人)`,
      region: partnerRegionInput || '全网裂变',
      level: 'partner' as const,
      directCount: 0,
      teamCount: 0,
      totalGmv: 0,
      commissionPaid: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setMockPartnersList([newPartner, ...mockPartnersList]);
    setPartnerNameInput('');
    triggerToast(`🎉 成功录入新合伙人 ${partnerNameInput}！`);
  }; 

  const filteredOrders = roleFilteredBaseOrders.filter(o => 
    o.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.userWechat && o.userWechat.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.paymentMemo && o.paymentMemo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.creationReason && o.creationReason.toLowerCase().includes(searchTerm.toLowerCase())) ||
    o.targetAudience.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.songTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans flex flex-col antialiased">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#121212] border border-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.2)] px-6 py-3 rounded-full text-xs font-medium text-white flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#FFD700]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ⚙️ 商家专属视图/沙箱调试控制台 (Azi Studio Sandbox Debugger Bar) */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border-b border-[#FFD700]/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-50 sticky top-0 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFD700]"></span>
          </span>
          <span className="text-[#FFD700] font-bold font-mono">阿紫姑娘工作室 · 视图调试器</span>
          <span className="text-white/30">|</span>
          <span className="text-white/60">当前页面视角: </span>
          <span className={isClientDemoMode ? "text-[#FFD700] font-semibold bg-[#FFD700]/10 px-2 py-0.5 rounded border border-[#FFD700]/20" : "text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20"}>
            {isClientDemoMode ? "📱 模拟用户手机访问 (绝无后台/极简安全)" : "💻 全屏商家管理后台 + 实操交付秘籍"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsClientDemoMode(true);
              setActiveTab('consumer');
              triggerToast("已切换为普通客户手机访问视图！");
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1 ${
              isClientDemoMode 
                ? "bg-[#FFD700] text-black shadow-[0_0_10px_rgba(255,215,0,0.3)]" 
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <span>📱 模拟手机端</span>
          </button>
          
          <button
            onClick={() => {
              setIsClientDemoMode(false);
              triggerToast("已切换为商家全屏管理后台！");
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1 ${
              !isClientDemoMode 
                ? "bg-[#FFD700] text-black shadow-[0_0_10px_rgba(255,215,0,0.3)]" 
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <span>💻 全屏管理端/实操手册</span>
          </button>
        </div>
      </div>

      {/* Header */}
      {!isClientDemoMode && (
        <header className="h-16 border-b border-white/10 px-4 md:px-8 flex items-center justify-between bg-black/60 backdrop-blur z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FFD700] to-[#FF8C00] rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(255,215,0,0.3)]">
              <Music className="w-4 h-4 text-black" />
            </div>
            <div>
              <span className="text-sm md:text-base font-serif italic tracking-wider text-white block">Azi Composer Studio</span>
              <span className="text-[9px] uppercase tracking-widest text-[#FFD700]/70 block -mt-1 font-mono">阿紫姑娘音乐内容工作室</span>
            </div>
          </div>

          {/* Global Navigation Tabs */}
          <nav className="flex gap-1 md:gap-4 text-[10px] md:text-xs uppercase tracking-wider font-semibold">
            <button
              onClick={() => setActiveTab('consumer')}
              className={`px-3 py-1.5 rounded transition ${
                activeTab === 'consumer' ? 'bg-white/10 text-[#FFD700]' : 'opacity-65 hover:opacity-100 text-white'
              }`}
            >
              音乐定制通道
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
                refreshAdminData();
              }}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1 ${
                activeTab === 'admin' ? 'bg-white/10 text-[#FFD700]' : 'opacity-65 hover:opacity-100 text-white'
              }`}
            >
              <Sliders className="w-3 h-3 text-[#FFD700]" />
              AI营销/管理端
            </button>
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1 ${
                activeTab === 'blueprint' ? 'bg-white/10 text-[#FFD700]' : 'opacity-65 hover:opacity-100 text-white'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">交付秘籍与</span>商业模式
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span>SYSTEM LIVE v4.2</span>
          </div>
        </header>
      )}

      {/* Main Container */}
      <main className="flex-1 flex flex-col">
        {/* TAB 1: CONSUMER FACING QUESTIONNAIRE */}
        {activeTab === 'consumer' && (
          <div className={isClientDemoMode ? "flex-grow bg-[#090909] py-6 px-4 flex flex-col items-center justify-center animate-fadeIn" : "flex-grow max-w-4xl w-full mx-auto px-4 py-8 flex flex-col md:flex-row gap-8"}>
            
            {/* Top prompt only shown inside the simulation page view */}
            {isClientDemoMode && (
              <div className="text-center mb-4 max-w-sm shrink-0">
                <p className="text-[11px] text-[#FFD700] bg-[#FFD700]/10 px-3 py-2 rounded-xl border border-[#FFD700]/20 leading-relaxed font-sans">
                  📱 <strong>客户手机端效果预览：</strong> 你的客户在手机微信、小红书等打开就是以下纯净界面（无任何后台/对账选项，页面充满仪式感与高级感）。
                </p>
              </div>
            )}

            {/* Left side: Guide and flow indicators (Hidden in mobile simulator mode) */}
            <div className={isClientDemoMode ? "hidden" : "md:w-72 flex-shrink-0 flex flex-col justify-between py-2"}>
              <div>
                <div className="mb-6">
                  <span className="text-[10px] uppercase tracking-widest text-[#FFD700] font-mono block mb-1">CRAFT YOUR MASTERPIECE</span>
                  <h1 className="text-2xl font-serif text-white font-medium leading-tight mb-2">定制你的人生单曲</h1>
                  <p className="text-xs text-white/50 leading-relaxed">
                    生活揉碎了是故事，拼起来就是旋律。阿紫姑娘工作室倾情为您创作，将最真挚的感情永久留在岁月里。
                  </p>
                </div>

                {/* Vertical Step list */}
                <div className="space-y-3 hidden md:block">
                  {[
                    { step: 1, label: "故事与背景聆听" },
                    { step: 2, label: "曲风与旋律色彩" },
                    { step: 3, label: "歌词文风与禁忌" },
                    { step: 4, label: "定制方案与加购" },
                    { step: 5, label: "安全对账付款" },
                    { step: 6, label: "客服对接与微信号" },
                    { step: 7, label: "AI生成歌词预览" }
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition ${
                        currentStep === s.step 
                          ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.3)]'
                          : currentStep > s.step
                            ? 'bg-white/10 text-white border-white/20'
                            : 'bg-transparent text-white/40 border-white/10'
                      }`}>
                        {currentStep > s.step ? "✓" : s.step}
                      </div>
                      <span className={`text-xs ${currentStep === s.step ? 'text-white font-medium' : 'text-white/40'}`}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
                  <span>服务与隐私保障</span>
                </div>
                <p className="text-[10px] text-white/30 leading-relaxed">
                  承诺不公开泄露您的任何关键故事细节。AI根据您的核心诉求在云端极速运行，主创团队全套打磨人声音准。
                </p>
              </div>
            </div>

            {/* Right Side: Step Panel Content Container (Simulating Phone or Standard Card) */}
            <div className={isClientDemoMode 
              ? "w-full max-w-[375px] h-[680px] bg-[#0c0c0c] rounded-[48px] border-[8px] border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col justify-between p-5 overflow-y-auto text-left relative custom-scrollbar" 
              : "flex-grow bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[480px]"
            }>
              
              {/* Simulated browser bar & status bar for Phone simulator view */}
              {isClientDemoMode && (
                <div className="shrink-0 mb-4 border-b border-white/5 pb-2">
                  <div className="flex justify-between items-center text-[8px] text-white/40 mb-2 font-mono">
                    <span>09:41</span>
                    <div className="w-14 h-2.5 bg-black rounded-b-md mx-auto -mt-1"></div>
                    <span className="flex items-center gap-0.5">5G 🔋</span>
                  </div>
                  <div className="text-center pt-1.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#FFD700] to-[#FF8C00] rounded-full flex items-center justify-center mx-auto mb-1.5 shadow-[0_0_10px_rgba(255,215,0,0.2)]">
                      <Music className="w-4 h-4 text-black" />
                    </div>
                    <h3 className="text-xs font-serif text-white font-medium italic">阿紫姑娘音乐内容工作室</h3>
                    <span className="text-[7px] uppercase tracking-widest text-[#FFD700]/70 block mt-0.5 font-mono">定制您的专属单曲</span>
                  </div>
                </div>
              )}
              
              {/* Form Content */}
              <div>
                {/* STEP 1: Story Details */}
                {currentStep === 1 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#FFD700] font-mono">STEP 01 OF 06</span>
                      <h2 className="text-xl font-serif text-white mb-4">聆听您的深情故事</h2>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">怎么称呼您？ *</label>
                      <input 
                        type="text" 
                        value={formData.user_name}
                        onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                        placeholder="例如：张先生 / 琳琳" 
                        className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700] transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">这首歌是送给谁的？ *</label>
                      <input 
                        type="text" 
                        value={formData.target_audience}
                        onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                        placeholder="例如：结婚十周年的妻子林静 / 毕业班全体同学" 
                        className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700] transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">为什么要定制这首歌？（送歌契机/故事起因）</label>
                      <textarea 
                        value={formData.creation_reason}
                        onChange={(e) => setFormData({...formData, creation_reason: e.target.value})}
                        placeholder="例如：纪念我们一起相守五年；想在女友生日时给她一个惊喜；毕业季各奔西东..." 
                        className="w-full h-20 bg-white/5 border border-white/10 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700] transition resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">有没有什么关键的细节、画面或你们的共同点滴？</label>
                      <textarea 
                        value={formData.key_memories}
                        onChange={(e) => setFormData({...formData, key_memories: e.target.value})}
                        placeholder="（非常重要！）例如：他总爱揉我的头发；下雨天我们共用一把伞，他右半边肩膀总是湿的；我们常去吃学校门口5块钱的牛肉拉面..." 
                        className="w-full h-20 bg-white/5 border border-white/10 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700] transition resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">最想对TA说，但平时不常说出口的一句话？ *</label>
                      <input 
                        type="text" 
                        value={formData.core_message}
                        onChange={(e) => setFormData({...formData, core_message: e.target.value})}
                        placeholder="这句话将作为整首歌的核心情感锚点和副歌重点..." 
                        className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700] transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">希望表达的心境/情绪（多选）</label>
                      <div className="flex flex-wrap gap-2">
                        {["甜蜜热恋", "深情告白", "温暖治愈", "伤感遗憾", "释怀感恩", "励志成长"].map(emotion => (
                          <button
                            key={emotion}
                            type="button"
                            onClick={() => handleChipToggle('emotions', emotion)}
                            className={`px-3 py-1.5 rounded-full text-xs transition border ${
                              formData.emotions.includes(emotion) 
                                ? 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]' 
                                : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'
                            }`}
                          >
                            {emotion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Music Color */}
                {currentStep === 2 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#FFD700] font-mono">STEP 02 OF 06</span>
                      <h2 className="text-xl font-serif text-white mb-4">定制歌曲旋律风格</h2>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">偏好的音乐曲风偏向（单选） *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          "流行(Pop) - 朗朗上口大众喜爱",
                          "民谣(Folk) - 吉他轻弹娓娓道来",
                          "古风/国风 - 诗意唯美韵味悠长",
                          "说唱(Rap) - 节奏感强叙事信息量大",
                          "R&B/蓝调 - 丝滑律动情感细腻",
                          "轻快/电子 - 阳光活泼节奏明朗"
                        ].map(style => (
                          <button
                            key={style}
                            type="button"
                            onClick={() => handleSingleSelect('music_style', style)}
                            className={`text-left p-3 rounded border text-xs transition ${
                              formData.music_style === style
                                ? 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]'
                                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">歌手声音质感 *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "温暖少年/温柔男声",
                          "成熟烟嗓/质感男声",
                          "甜美少女/清澈女声",
                          "御姐/治愈系厚实女声"
                        ].map(gender => (
                          <button
                            key={gender}
                            type="button"
                            onClick={() => handleSingleSelect('singer_gender', gender)}
                            className={`p-3 rounded border text-xs transition ${
                              formData.singer_gender === gender
                                ? 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]'
                                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {gender}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">有什么参考的特定歌手或歌曲吗？</label>
                      <input 
                        type="text" 
                        value={formData.reference_song}
                        onChange={(e) => setFormData({...formData, reference_song: e.target.value})}
                        placeholder="例如：周杰伦的《晴天》、房东的猫的民谣感" 
                        className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700] transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">语言倾向</label>
                        <select 
                          value={formData.language} 
                          onChange={(e) => handleSingleSelect('language', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded py-2.5 px-3 text-xs text-white appearance-none focus:outline-none focus:border-[#FFD700]"
                        >
                          <option className="bg-[#121212]">纯国语</option>
                          <option className="bg-[#121212]">纯粤语</option>
                          <option className="bg-[#121212]">国语中夹杂少量英文</option>
                          <option className="bg-[#121212]">地方特色方言</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">节奏速度偏好</label>
                        <select 
                          value={formData.tempo} 
                          onChange={(e) => handleSingleSelect('tempo', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded py-2.5 px-3 text-xs text-white appearance-none focus:outline-none focus:border-[#FFD700]"
                        >
                          <option className="bg-[#121212]">慢速 - 抒情催泪</option>
                          <option className="bg-[#121212]">中速 - 缓和舒服</option>
                          <option className="bg-[#121212]">欢快 - 节奏感强</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Lyrics Details */}
                {currentStep === 3 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#FFD700] font-mono">STEP 03 OF 06</span>
                      <h2 className="text-xl font-serif text-white mb-4">雕琢歌词文字细节</h2>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">有没有预想的歌名？（若没有则由阿紫为您原创）</label>
                      <input 
                        type="text" 
                        value={formData.song_title}
                        onChange={(e) => setFormData({...formData, song_title: e.target.value})}
                        placeholder="例如：《便利店的雨天》、《八班的夏夜风》" 
                        className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700] transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">偏好的歌词文学风格</label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          "直白大话 - 大白话最真诚直接",
                          "诗意唯美 - 富有韵律和象征意象",
                          "故事叙事 - 像在讲一个连续的故事"
                        ].map(style => (
                          <button
                            key={style}
                            type="button"
                            onClick={() => handleSingleSelect('lyrics_style', style)}
                            className={`text-left p-3.5 rounded border text-xs transition ${
                              formData.lyrics_style === style
                                ? 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]'
                                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">歌词中【必须出现】的特定词汇或人名？</label>
                      <input 
                        type="text" 
                        value={formData.must_include_words}
                        onChange={(e) => setFormData({...formData, must_include_words: e.target.value})}
                        placeholder="例如：张杰, 静静, 牛肉拉面, 2026年毕业" 
                        className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700] transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">歌词中【绝对不要提】的雷区敏感话题？</label>
                      <input 
                        type="text" 
                        value={formData.must_avoid_words}
                        onChange={(e) => setFormData({...formData, must_avoid_words: e.target.value})}
                        placeholder="例如：不要提起过去的争吵或前任" 
                        className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700] transition"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: Choose Custom Package */}
                {currentStep === 4 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#FFD700] font-mono">STEP 04 OF 06</span>
                      <h2 className="text-xl font-serif text-white mb-2">选择您的专属定制方案</h2>
                    </div>

                    {/* Pricing Cards Grid */}
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {[
                        {
                          price: 99,
                          name: "体验款 · 盲盒版",
                          desc: "【极低门槛真诚尝鲜】提供 1 首高完成度完整全曲（2~3分钟），由主创总监人工盲盒精选一版打包交付。限制：盲盒交付，不支持后期歌词微调。"
                        },
                        {
                          price: 298,
                          name: "基础款 · 心意版",
                          desc: "【买一送一超值好礼】AI同时跑出两款不同风格/不同人声的全曲全部打包送给你！两版自由对比，成片率更高。支持 1 次副歌词或细节字微调。"
                        },
                        {
                          price: 998,
                          name: "进阶款 · 专属版 ★ 主推",
                          desc: "【精细打磨 经典推荐】提供3个版本挑选（选定版由主创人声音高精修、混音打磨）。独家赠送定制单曲封面，协助在网易云/QQ音乐全球发布上线！支持 2 次精细微调。"
                        },
                        {
                          price: 2988,
                          name: "高端款 · 珍藏版",
                          desc: "【殿堂级定制】定制独立虚拟EP（2首歌曲），额外赠送动态极美视听歌词MV，制作总监30分钟电话深度交流打磨。无限制精修 + 商业全权转让。"
                        }
                      ].map((plan) => (
                        <div 
                          key={plan.name}
                          onClick={() => handlePlanSelect(plan.name, plan.price)}
                          className={`p-4 rounded-xl border cursor-pointer transition relative flex flex-col gap-2 ${
                            selectedPlanName === plan.name 
                              ? 'bg-gradient-to-r from-zinc-900 to-black border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.1)]'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-serif italic text-sm md:text-base text-white">{plan.name}</span>
                            <span className="text-base font-semibold text-[#FFD700]">¥{plan.price}</span>
                          </div>
                          <p className="text-[11px] text-white/50 leading-relaxed">{plan.desc}</p>
                          {selectedPlanName === plan.name && (
                            <div className="absolute right-2 bottom-2 bg-[#FFD700] text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                              Selected
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Addons Section */}
                    <div className="pt-4 border-t border-white/10">
                      <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-3 font-semibold">需要额外服务增值吗？（可选）</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { name: "AI精美歌词MV制作", price: 399 },
                          { name: "48小时超级加急", price: 200 },
                          { name: "增加1轮修改服务", price: 100 }
                        ].map(addon => {
                          const isSelected = selectedAddons.some(a => a.name === addon.name);
                          return (
                            <button
                              key={addon.name}
                              type="button"
                              onClick={() => handleAddonToggle(addon.name, addon.price)}
                              className={`p-3 rounded-lg border text-left text-xs transition flex flex-col gap-1 ${
                                isSelected 
                                  ? 'bg-[#FFD700]/10 text-white border-[#FFD700]'
                                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <span className="font-medium">{addon.name}</span>
                              <span className="text-[#FFD700]">+{addon.price}元</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Safe Payment & Check */}
                {currentStep === 5 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#FFD700] font-mono">STEP 05 OF 06</span>
                      <h2 className="text-xl font-serif text-white mb-2">安全结算与付款核账</h2>
                    </div>

                    {/* Invoice Itemization */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex justify-between text-xs text-white/60 pb-2 border-b border-white/5">
                        <span>{selectedPlanName}</span>
                        <span>¥{selectedPlanPrice}.00</span>
                      </div>
                      {selectedAddons.length > 0 && (
                        <div className="py-2 border-b border-white/5 space-y-1">
                          {selectedAddons.map(a => (
                            <div key={a.name} className="flex justify-between text-[11px] text-white/40">
                              <span>+ {a.name}</span>
                              <span>¥{a.price}.00</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 font-semibold">
                        <span className="text-xs text-white">总结算金额</span>
                        <span className="text-lg text-[#FFD700]">¥{getGrandTotal()}.00</span>
                      </div>
                    </div>

                    {/* QR Code Mocks with beautiful high-end dark styling */}
                    <div className="space-y-3 text-center">
                      <span className="text-[10px] text-white/40 tracking-wider block">请保存或截图以下任一官方对公收款码扫码支付：</span>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center">
                          <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center p-2 mb-2 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-900/10 flex items-center justify-center p-1 text-black font-serif italic text-[11px] font-bold text-center">
                              支付宝<br/>[ 收款码 ]
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-white">支付宝扫码</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center">
                          <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center p-2 mb-2 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-900/10 flex items-center justify-center p-1 text-black font-serif italic text-[11px] font-bold text-center">
                              微信支付<br/>[ 收款码 ]
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-white">微信扫码</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-[#FFD700] block font-semibold">智能付款核验对账备注 *</label>
                        <input 
                          type="text" 
                          value={formData.payment_memo}
                          onChange={(e) => setFormData({...formData, payment_memo: e.target.value})}
                          placeholder="请输入您的付款微信昵称/支付宝真实姓名，或转账单号后4位" 
                          className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700] transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 block">上传付款截图凭证（可选）</label>
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-xs px-4 py-2.5 rounded border border-white/10 text-white font-medium transition">
                            选择凭证图片
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setReceiptFile(e.target.files[0]);
                                  setReceiptName(e.target.files[0].name);
                                }
                              }}
                              className="hidden" 
                            />
                          </label>
                          <span className="text-xs text-white/40 truncate max-w-xs">
                            {receiptName ? `已选择：${receiptName}` : "未选择任何文件"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: Customer WeChat Address info */}
                {currentStep === 6 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#FFD700] font-mono">STEP 06 OF 06</span>
                      <h2 className="text-xl font-serif text-white mb-2">开启您的一对一专属对接群</h2>
                    </div>

                    {/* Copy Studio WeChat */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-zinc-900 to-black border border-[#FFD700]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-[9px] text-[#FFD700] uppercase tracking-widest block font-mono mb-1">主创总监专属客服</span>
                        <div className="text-sm font-semibold text-white">阿紫微信号：<span className="text-[#FFD700] font-mono select-all">wanwan2026_8</span></div>
                        <p className="text-[11px] text-white/40 mt-1">付款完成后，阿紫总监将会拉您进入三对一主创专属精细打磨小群！</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('wanwan2026_8', '阿紫微信号')}
                        className="px-4 py-2 bg-[#FFD700] text-black font-bold text-xs rounded-full hover:opacity-90 active:scale-95 transition"
                      >
                        一键复制微信号
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">您的微信号 *</label>
                      <input 
                        type="text" 
                        value={formData.user_wechat}
                        onChange={(e) => setFormData({...formData, user_wechat: e.target.value})}
                        placeholder="请输入微信号，方便我们添加好友（请确保可搜到）" 
                        className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700] transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">您是从哪里听说阿紫工作室的呢？</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["小红书", "抖音/视频号", "微信社群/朋友圈", "朋友热心推荐", "拼多多宝贝", "其他渠道"].map(chan => (
                          <button
                            key={chan}
                            type="button"
                            onClick={() => handleSingleSelect('referral_channel', chan)}
                            className={`p-3 rounded border text-xs text-left transition ${
                              formData.referral_channel === chan
                                ? 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]'
                                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {chan}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: AI Lyrics Generation Results Panel */}
                {currentStep === 7 && (
                  <div className="space-y-5 animate-fadeIn">
                    {isGenerating ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin"></div>
                          <Sparkles className="w-6 h-6 text-[#FFD700] absolute inset-0 m-auto animate-pulse" />
                        </div>
                        <div>
                          <h3 className="text-xl font-serif text-white mb-2">阿紫AI音乐引擎正在精心雕琢...</h3>
                          <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">
                            正在融合您的关键细节（如：{formData.must_include_words || "温情故事"}），由大语言模型实时为您量身定做歌词、编曲推荐，这大约需要数秒钟。
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-white/10">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded border border-green-500/30">
                                订单提交成功 & AI定制初稿生成
                              </span>
                              {songResult?.isRealAi && (
                                <span className="px-2 py-0.5 bg-[#FFD700]/20 text-[#FFD700] text-[10px] rounded border border-[#FFD700]/30 font-mono">
                                  Gemini 3.5 Native
                                </span>
                              )}
                            </div>
                            <h2 className="text-2xl font-serif text-white italic mt-1">《{songResult?.songTitle || "待命名歌曲"}》</h2>
                            <p className="text-[10px] text-white/40 font-mono mt-1">订单单号: {generatedOrderId}</p>
                          </div>
                          <button
                            onClick={() => {
                              setCurrentStep(1);
                              setSongResult(null);
                            }}
                            className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded text-white font-medium transition"
                          >
                            写新故事
                          </button>
                        </div>

                        {/* Lyrics Scroll Box */}
                        <div className="bg-black/50 border border-white/5 rounded-xl p-5 max-h-[300px] overflow-y-auto font-mono text-xs md:text-sm text-white/80 whitespace-pre-wrap leading-relaxed shadow-inner">
                          {songResult?.lyrics}
                        </div>

                        {/* Melody Advice */}
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <h4 className="text-[11px] uppercase tracking-widest text-[#FFD700] font-semibold mb-2 flex items-center gap-1">
                            <Sliders className="w-3.5 h-3.5" /> 编曲与唱法推荐
                          </h4>
                          <p className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">
                            {songResult?.melodyAdvice}
                          </p>
                        </div>

                        {/* AI Note */}
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-zinc-900 to-black border border-[#FFD700]/20 relative overflow-hidden">
                          <div className="absolute right-2 bottom-2 text-white/5 pointer-events-none">
                            <Award className="w-24 h-24" />
                          </div>
                          <h4 className="text-xs text-[#FFD700] font-bold mb-1 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> 阿紫主创寄语
                          </h4>
                          <p className="text-xs text-white/80 leading-relaxed italic">
                            {songResult?.aiNotes}
                          </p>
                        </div>

                        {/* Anonymous Feedback Section */}
                        <div className="pt-4 border-t border-white/10">
                          <div className="bg-white/5 rounded-xl border border-white/5 p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] uppercase tracking-widest text-white/50 block font-semibold flex items-center gap-1">
                                <span>🤫</span> 网页体验匿名吐槽信箱 (真实吐槽，绝不收集隐私)
                              </span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRatingScore(star)}
                                    className="focus:outline-none"
                                  >
                                    <Star className={`w-4 h-4 ${star <= ratingScore ? 'text-[#FFD700] fill-[#FFD700]' : 'text-white/20'}`} />
                                  </button>
                                ))}
                              </div>
                            </div>
                            {feedbackSubmitted ? (
                              <div className="text-xs text-green-400 font-medium py-2 text-center bg-green-500/10 rounded border border-green-500/20">
                                ✓ 反馈成功！感谢您的宝贵建议，阿紫会用心改进系统的每一个细节。
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={anonymousComment}
                                  onChange={(e) => setAnonymousComment(e.target.value)}
                                  placeholder="觉得流程顺利吗？功能好玩吗？有什么缺点想吐槽请写在这里..."
                                  className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                                />
                                <button
                                  type="button"
                                  onClick={handleFeedbackSubmit}
                                  className="px-4 py-1.5 bg-[#FFD700] text-black text-xs font-bold rounded hover:opacity-90 transition"
                                >
                                  提交
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {currentStep < 7 && (
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white font-medium transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>上一步</span>
                    </button>
                  ) : (
                    <div></div>
                  )}

                  <div className="flex items-center gap-4">
                    {/* Live price display on crucial checkout steps */}
                    {(currentStep === 4 || currentStep === 5) && (
                      <div className="text-right">
                        <span className="text-[9px] text-white/40 block">当前预估总价</span>
                        <span className="text-base text-[#FFD700] font-semibold">¥{getGrandTotal()}.00</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex items-center gap-1.5 bg-[#FFD700] text-black font-extrabold text-xs md:text-sm px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.25)] hover:opacity-90 active:scale-95 transition"
                    >
                      <span>{currentStep === 6 ? "确认款项并开始AI创作" : "下一步"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: OWNER ACTIVE AGENT & ORDER PANEL */}
        {activeTab === 'admin' && (
          <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
            
            {/* 👑 权限与商业堡垒控制中心 (Multi-Role Permission Sandbox & Platform Defensibility Hub) */}
            <div className="bg-[#0b0b0c] border border-white/10 rounded-3xl p-6 space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-[#FFD700]/5 blur-[120px] rounded-full pointer-events-none" />
              
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 pb-4 border-b border-white/5">
                <div className="space-y-1">
                  <span className="text-[9px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Security Sandbox & Strategy
                  </span>
                  <h1 className="text-lg md:text-xl font-serif text-white font-bold flex items-center gap-2">
                    <span>🛡️ 区域代理权限沙盒与平台商业壁垒防御大盘</span>
                  </h1>
                  <p className="text-xs text-white/50 leading-relaxed max-w-3xl">
                    本系统专为多级代理和合伙人裂变设计。通过下方的「视图模拟器」，您可以即时体验创始人、区域城市代理、校园推广员之间的<strong>底层数据隔离与安全权限过滤机制</strong>。
                  </p>
                </div>

                {/* Role Switcher Action Buttons */}
                <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setAdminViewRole('founder');
                      triggerToast("已切换为：👑 平台总创始人 (最高全盘查看权)");
                    }}
                    className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${
                      adminViewRole === 'founder'
                        ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>👑 平台总创始人</span>
                  </button>
                  <button
                    onClick={() => {
                      setAdminViewRole('partner_sh');
                      triggerToast("已切换为：🏢 上海徐汇城市合伙人 (区域隔离受限视角)");
                    }}
                    className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${
                      adminViewRole === 'partner_sh'
                        ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>🏢 城市合伙人(上海)</span>
                  </button>
                  <button
                    onClick={() => {
                      setAdminViewRole('promoter_xy');
                      triggerToast("已切换为：🎓 杨浦校园推广代理 (最底层受限视角)");
                    }}
                    className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${
                      adminViewRole === 'promoter_xy'
                        ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>🎓 校园推广员(李婷婷)</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Sandbox Role Description Callout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-4 p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2 relative overflow-hidden">
                  <div className="absolute right-2 top-2 opacity-5">
                    <Sliders className="w-16 h-16 text-white" />
                  </div>
                  <span className="text-[10px] text-[#FFD700] font-bold block uppercase tracking-wider">
                    Current Sandbox Context
                  </span>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    {adminViewRole === 'founder' && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
                        <span>平台总创始人 (Owner - 全盘权限)</span>
                      </>
                    )}
                    {adminViewRole === 'partner_sh' && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span>上海徐汇代理 (Partner - 区域限流)</span>
                      </>
                    )}
                    {adminViewRole === 'promoter_xy' && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span>校园推广员-李婷婷 (Promoter - 底层渠道)</span>
                      </>
                    )}
                  </div>
                  
                  <p className="text-xs text-white/70 leading-relaxed pt-1.5 border-t border-white/5">
                    {adminViewRole === 'founder' && "您正在全局全能管理者视角：可查看并操作全国范围下的全量订单、配置企业级飞书财务推送API、更改平台系统配置（如主财务微信、结算账单支付宝接收通道等），并掌握所有下级级差奖励名录。"}
                    {adminViewRole === 'partner_sh' && "【安全沙盒已启动】您被隔离在“上海徐汇”区域代理权中。您仅能看到打标为“小红书私域”渠道产出的下级订单。已被安全过滤并隐藏了「企业级飞书消息接口」、「主财务微信修改权限」、「其他区域代理的核心对账流水」以防敏感数据泄露！"}
                    {adminViewRole === 'promoter_xy' && "【极简安全沙盒】您作为最基层的校园校园推广员，系统只展示由您直接通过微信朋友圈、社群推荐转化的订单及15%底格佣金账目。不具备任何管理权限、不展示任何团队或敏感配置项。"}
                  </p>
                </div>

                {/* 🛡️ Strategic Moat / Defensibility Knowledge Hub (Answers "Why do they need me?") */}
                <div className="lg:col-span-8 p-5 bg-gradient-to-br from-indigo-950/20 to-black border border-indigo-500/20 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FFD700] flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#FFD700]" />
                      <span>💡 灵魂发问：代理如果自己买个 AI 音乐工具(如Suno/Udio)付费，不就能单干了？还要我干嘛？</span>
                    </span>
                    <span className="text-[8px] bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 px-1.5 rounded font-bold">
                      核心商业壁垒 & 防线精算
                    </span>
                  </div>

                  <p className="text-[10.5px] text-white/80 leading-relaxed">
                    这是每一个平台创始人都会遭遇的经典问题。其实，单纯的“AI生成”不等于“定制化交付”。<strong>阿紫平台具备五大无法被下级绕过的深度壁垒与护城河：</strong>
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] text-white/70">
                    <div className="p-2 bg-black/40 rounded-xl border border-white/5 space-y-1">
                      <strong className="text-white flex items-center gap-1">
                        <span className="text-[#FFD700]">1.</span> 独家 Prompt 编曲双重调优链
                      </strong>
                      <p className="text-[9px] text-white/50 leading-relaxed">
                        小白或代理自己用 AI 写歌，输个“写给妻子的歌”只会得到极机械无灵魂的噪音。阿紫系统内置了对 Gemini 3.5 的<strong>故事语义提取 - 敏感词过滤 - 意境曲风双轨校正</strong>的独家 Prompt 链，这是普通人绝对调配不出的高级艺术底盘。
                      </p>
                    </div>

                    <div className="p-2 bg-black/40 rounded-xl border border-white/5 space-y-1">
                      <strong className="text-white flex items-center gap-1">
                        <span className="text-[#FFD700]">2.</span> 零门槛国人支付与 API 聚合
                      </strong>
                      <p className="text-[9px] text-white/50 leading-relaxed">
                        Suno/Udio 需要海外信用卡、复杂的魔法上网及高额美元月费订阅。对校园代理和普通合伙人而言，配置高昂且繁杂。阿紫聚合了底层高并发 API 算力池，他们<strong>无需垫付美元月费、一单一结</strong>，极低成本无感变现。
                      </p>
                    </div>

                    <div className="p-2 bg-black/40 rounded-xl border border-white/5 space-y-1">
                      <strong className="text-white flex items-center gap-1">
                        <span className="text-[#FFD700]">3.</span> 交付增值配套：黑胶/MV/专属播放
                      </strong>
                      <p className="text-[9px] text-white/50 leading-relaxed">
                        AI 工具只给个冷冰冰的 MP3 音频。阿紫平台交付的是<strong>高逼格黑胶播放H5页面、自动动态歌词MV、精美物理CD包装排期、实体木质刻字U盘</strong>一站式发货。不只是卖歌，更是卖一件珍贵的实物礼品。
                      </p>
                    </div>

                    <div className="p-2 bg-black/40 rounded-xl border border-white/5 space-y-1">
                      <strong className="text-white flex items-center gap-1">
                        <span className="text-[#FFD700]">4.</span> 社交精准爬虫与营销一键海报
                      </strong>
                      <p className="text-[9px] text-white/50 leading-relaxed">
                        代理最缺的是“客源”。我们为他们免费提供了<strong>社交网络拓客爬虫 + 智能纪念日温情召回卡 + 营销海报生成器</strong>。这是他们单干拿不到的“获客印钞机”，依靠阿紫的生态，他们能持续稳定出单！
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid layout for the admin panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Social Media Crawler Agent & Leads pool (4 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Marketing Crawler Control */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-serif text-white font-medium flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[#FFD700]" />
                      <span>社交网络智能拓客引擎</span>
                    </h2>
                    <p className="text-[10px] text-white/40">模拟在小红书/抖音/拼多多全网捕获客户需求</p>
                  </div>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[9px] rounded font-mono border border-green-500/20 animate-pulse">
                    ACTIVE
                  </span>
                </div>

                <div className="bg-black/50 p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-white/50 font-bold">精准监控关键词</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={crawlKeyword}
                        onChange={(e) => setCrawlKeyword(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                        placeholder="例如：定制写歌, 结婚纪念日礼物, 高考毕业"
                      />
                      <button
                        onClick={triggerSocialCrawl}
                        disabled={isCrawling}
                        className="px-4 py-1.5 bg-[#FFD700] text-black font-bold text-xs rounded hover:opacity-90 disabled:opacity-50 transition flex items-center gap-1"
                      >
                        {isCrawling ? <RefreshCw className="w-3 h-3 animate-spin" /> : "启动抓取"}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/30 leading-normal">
                    💡 自动爬虫会扫描全网，获取带有特定词汇的求助贴、评论或询价单，支持一键AI匹配与话术自动精准触达！
                  </p>

                  <div className="pt-3.5 border-t border-white/5 flex flex-col sm:flex-row gap-2 justify-between sm:items-center">
                    <div className="text-[10px] text-white/50 leading-tight">
                      📢 <span className="text-[#FF2442] font-semibold">自媒体爆款裂变：</span>一键智能合成高质感小红书 3x3 九宫格营销大图，狂揽私域客户
                    </div>
                    <button
                      type="button"
                      onClick={openPosterGenerator}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-[#FF2442] to-pink-600 hover:from-[#e11d38] hover:to-pink-700 text-white font-extrabold text-[10.5px] rounded-lg flex items-center justify-center gap-1.5 transition duration-200 shadow-[0_0_15px_rgba(255,36,66,0.2)] shrink-0 active:scale-95"
                    >
                      <Sparkles className="w-3 h-3 text-white animate-pulse" />
                      <span>AI生成营销海报</span>
                    </button>
                  </div>
                </div>

                {/* Social Leads List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-white/70">最新捕获的高意向拓客线索 ({leads.length})</h3>
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {leads.map((lead) => (
                      <div 
                        key={lead.id} 
                        className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2 hover:border-white/15 transition relative"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${lead.avatarColor} text-[10px] text-white font-bold flex items-center justify-center`}>
                              {lead.username.charAt(0)}
                            </div>
                            <div>
                              <span className="text-xs font-medium text-white">{lead.username}</span>
                              <span className="text-[8px] text-white/40 block">{lead.postedTime} • 来自{
                                lead.platform === 'xiaohongshu' ? '小红书' : lead.platform === 'douyin' ? '抖音' : '拼多多'
                              }</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[8px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/50">
                              {lead.matchedKeyword}
                            </span>
                            {lead.status === 'converted' && (
                              <span className="text-[8px] font-bold bg-green-500/20 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded">
                                已支付千元
                              </span>
                            )}
                            {lead.status === 'pitched' && (
                              <span className="text-[8px] font-bold bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/20 px-1.5 py-0.5 rounded">
                                已私信触达
                              </span>
                            )}
                            {lead.status === 'new' && (
                              <span className="text-[8px] font-bold bg-[#FF2442]/20 text-[#FF2442] border border-[#FF2442]/20 px-1.5 py-0.5 rounded animate-pulse">
                                高意向
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-white/60 leading-relaxed font-sans pl-1 border-l border-[#FFD700]/20">
                          {lead.commentText}
                        </p>

                        {lead.pitchMessage && (
                          <div className="p-2 bg-black/40 rounded text-[10px] text-[#FFD700]/80 leading-relaxed font-mono">
                            ✍️ <strong>AI已自动私信话术：</strong>{lead.pitchMessage.slice(0, 70)}...
                          </div>
                        )}

                        {lead.status === 'new' && (
                          <div className="pt-1 flex justify-end">
                            <button
                              onClick={() => triggerSocialPitch(lead.id)}
                              disabled={pitchLoadingId === lead.id}
                              className="px-3 py-1 bg-white hover:bg-white/90 text-black font-bold text-[9px] uppercase rounded flex items-center gap-1 transition"
                            >
                              {pitchLoadingId === lead.id ? (
                                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                              ) : (
                                <>
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>AI精准营销触达 (30%付费率)</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 📊 阿紫音乐工作室 · 智算财务与无限裂变合伙人双引擎大盘 */}
              <div className="bg-[#0c0c0d] border border-white/10 rounded-3xl p-6 space-y-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
                {/* Background decorative gradient glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFD700]/5 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/5">
                  <div>
                    <span className="text-[9px] bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Business Cockpit
                    </span>
                    <h2 className="text-base font-serif text-white font-semibold flex items-center gap-2 mt-1.5">
                      <TrendingUp className="w-5 h-5 text-[#FFD700] shrink-0" />
                      <span>音乐工作室财务审计与合伙人裂变系统</span>
                    </h2>
                  </div>

                  {/* Sub-tab selectors */}
                  <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                    <button
                      onClick={() => setFinanceActiveTab('overall')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
                        financeActiveTab === 'overall' ? 'bg-[#FFD700] text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      大盘
                    </button>
                    <button
                      onClick={() => setFinanceActiveTab('breakdown')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
                        financeActiveTab === 'breakdown' ? 'bg-[#FFD700] text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      月/年复盘
                    </button>
                    <button
                      onClick={() => setFinanceActiveTab('feishu')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
                        financeActiveTab === 'feishu' ? 'bg-[#FFD700] text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      飞书AI总结
                    </button>
                    <button
                      onClick={() => setFinanceActiveTab('partners')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
                        financeActiveTab === 'partners' ? 'bg-[#FFD700] text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      裂变分润
                    </button>
                  </div>
                </div>

                {/* TAB 1: OVERALL REVENUE METRICS */}
                {financeActiveTab === 'overall' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-3 font-mono">
                      {/* 今日总收入 */}
                      <div className="p-3.5 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-2xl relative overflow-hidden group hover:border-[#FFD700]/30 transition">
                        <div className="absolute top-1 right-2 text-[#FFD700]/10 text-3xl font-extrabold select-none">TODAY</div>
                        <span className="text-[9px] text-white/40 block">☀️ 今日总收入 (2026-06-23)</span>
                        <span className="text-xl font-bold text-white tracking-tight">¥{todayRevenue}.00</span>
                        <div className="text-[8px] text-green-400 mt-1 flex items-center gap-0.5 font-sans">
                          <span>↑ 环比昨日增加 38.5%</span>
                        </div>
                      </div>

                      {/* 累计定制总收入 */}
                      <div className="p-3.5 bg-gradient-to-br from-[#FFD700]/5 to-transparent border border-[#FFD700]/10 rounded-2xl relative overflow-hidden group hover:border-[#FFD700]/30 transition">
                        <div className="absolute top-1 right-2 text-[#FFD700]/10 text-3xl font-extrabold select-none">TOTAL</div>
                        <span className="text-[9px] text-[#FFD700] block font-bold">👑 累计定制总收入</span>
                        <span className="text-xl font-bold text-[#FFD700] tracking-tight">¥{totalConsolidatedRevenue}.00</span>
                        <div className="text-[8px] text-[#FFD700]/70 mt-1 flex items-center gap-0.5 font-sans">
                          <span>含老客复购及推荐出单统计</span>
                        </div>
                      </div>

                      {/* AI智能营销裂变被动收入 */}
                      <div className="p-3.5 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition">
                        <span className="text-[9px] text-white/40 block">🔗 AI精准营销被动转化额</span>
                        <span className="text-base font-semibold text-green-400">¥{passiveLapsed}.00</span>
                        <div className="text-[8px] text-white/30 mt-1 font-sans">
                          智能线索转化收益 (单笔998元规格)
                        </div>
                      </div>

                      {/* 主动订单数 */}
                      <div className="p-3.5 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition">
                        <span className="text-[9px] text-white/40 block">📦 主动提交订单量</span>
                        <span className="text-base font-semibold text-white">{activeOrdersCount} 单</span>
                        <div className="text-[8px] text-purple-400 mt-1 font-sans">
                          转化率: <strong className="font-mono">{conversionRate}%</strong>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-left">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-white/80 block font-bold">📊 月度/年度财务账目自动归集</span>
                        <span className="text-[9px] text-white/50 block leading-normal">
                          系统根据提交订单的支付备注及状态，全自动生成月度、年度和合伙人渠道对账表，无需人工核对。
                        </span>
                      </div>
                      <button
                        onClick={() => setFinanceActiveTab('breakdown')}
                        className="px-2.5 py-1 text-[9px] bg-white/10 hover:bg-white/20 text-white font-bold rounded transition shrink-0 ml-2"
                      >
                        去对账
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: MONTHLY & YEARLY DETAILED AUDITING */}
                {financeActiveTab === 'breakdown' && (
                  <div className="space-y-4 animate-fadeIn text-left">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white/80 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#FFD700]" />
                          <span>按月度财务结算统计 (Monthly Auditing)</span>
                        </span>
                        <span className="text-[8.5px] text-white/40 font-mono">2025 - 2026</span>
                      </div>

                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                        {Object.keys(monthlyStats).length === 0 ? (
                          <div className="text-center py-4 text-xs text-white/30">暂无月度统计数据</div>
                        ) : (
                          Object.entries(monthlyStats)
                            .sort((a, b) => b[0].localeCompare(a[0]))
                            .map(([month, data]) => (
                              <div key={month} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-[#FFD700]/20 flex justify-between items-center transition font-mono">
                                <div className="space-y-0.5">
                                  <div className="text-[11px] font-bold text-white">{month}</div>
                                  <div className="text-[8.5px] text-white/40 font-sans">
                                    定制成功率: 100% • 独立出单数 {data.count} 笔
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-[11px] font-extrabold text-[#FFD700]">¥{data.amount}.00</div>
                                  <span className="text-[7.5px] bg-green-500/10 text-green-400 border border-green-500/20 px-1 rounded font-bold uppercase">
                                    已核销对账
                                  </span>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white/80 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                          <span>按年度合并收入统计 (Annual Overview)</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(yearlyStats).map(([year, data]) => (
                          <div key={year} className="p-2.5 bg-zinc-950 border border-white/5 rounded-xl font-mono relative overflow-hidden">
                            <div className="absolute right-1 -bottom-2 text-white/5 text-2xl font-black">{year}</div>
                            <span className="text-[8px] text-white/40 block font-sans">{year}年度总业绩</span>
                            <span className="text-xs font-bold text-[#FFD700] block mt-0.5">¥{data.amount}.00</span>
                            <span className="text-[8px] text-white/30 block mt-0.5 font-sans">
                              共计交付 {data.count} 首单曲
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI 智能商业顾问: 经营建议报告 */}
                    <div className="pt-3 border-t border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white/80 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#FFD700] animate-pulse" />
                          <span>AI 智能商业顾问 · 经营建议报告</span>
                        </span>
                        <button
                          onClick={() => fetchBusinessReport()}
                          disabled={loadingReport}
                          className="text-[8.5px] text-[#FFD700] bg-[#FFD700]/10 hover:bg-[#FFD700]/20 border border-[#FFD700]/20 px-2 py-0.5 rounded transition flex items-center gap-1 active:scale-95 disabled:opacity-50 font-sans font-medium"
                        >
                          {loadingReport ? (
                            <span className="animate-spin inline-block">⏳</span>
                          ) : (
                            <span>🔄 重新深度研判</span>
                          )}
                        </button>
                      </div>

                      {loadingReport ? (
                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-2 py-8">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FFD700]"></div>
                          <span className="text-[10px] text-white/40 font-sans">正在深度研判GMV波动，构建营销重心雷达...</span>
                        </div>
                      ) : businessReport ? (
                        <div className="space-y-3 animate-fadeIn">
                          {/* KPI grid */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 bg-zinc-950 border border-white/5 rounded-xl font-mono">
                              <span className="text-[8px] text-white/40 block font-sans">核心复购率 (LTV)</span>
                              <span className="text-xs font-bold text-[#FFD700] block mt-0.5 flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                                {businessReport.visualKpis?.repurchaseRate || "0.0%"}
                              </span>
                            </div>
                            <div className="p-2.5 bg-zinc-950 border border-white/5 rounded-xl">
                              <span className="text-[8px] text-white/40 block font-sans">业绩成长势头</span>
                              <span className="text-[10px] font-bold text-white block mt-0.5 truncate font-mono">
                                {businessReport.visualKpis?.growthTrend || "健康成长"}
                              </span>
                            </div>
                            <div className="p-2.5 bg-zinc-950 border border-white/5 rounded-xl">
                              <span className="text-[8px] text-white/40 block font-sans">高溢价核心热区</span>
                              <span className="text-[10px] font-bold text-white block mt-0.5 truncate">
                                {businessReport.visualKpis?.peakRegion || "江浙沪私域"}
                              </span>
                            </div>
                            <div className="p-2.5 bg-zinc-950 border border-white/5 rounded-xl">
                              <span className="text-[8px] text-white/40 block font-sans">推荐主攻渠道</span>
                              <span className="text-[10px] font-bold text-[#FFD700] block mt-0.5 truncate">
                                {businessReport.visualKpis?.suggestedChannel || "小红书情感KOL"}
                              </span>
                            </div>
                          </div>

                          {/* Analysis blocks */}
                          <div className="p-3 bg-white/5 border border-white/5 rounded-2xl space-y-2.5 text-xs">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-[#FFD700] flex items-center gap-1 font-sans">
                                <DollarSign className="w-3 h-3 text-[#FFD700]" />
                                <span>大盘GMV波动与趋势研判</span>
                              </span>
                              <p className="text-[10px] text-white/70 leading-relaxed font-sans font-light">
                                {businessReport.gmvAnalysis}
                              </p>
                            </div>

                            <div className="space-y-1 pt-1.5 border-t border-white/5">
                              <span className="text-[10px] font-bold text-green-400 flex items-center gap-1 font-sans">
                                <Users className="w-3 h-3 text-green-400" />
                                <span>高价值客户复购行为洞察</span>
                              </span>
                              <p className="text-[10px] text-white/70 leading-relaxed font-sans font-light">
                                {businessReport.repurchaseInsight}
                              </p>
                            </div>
                          </div>

                          {/* Actionable Strategy Section */}
                          <div className="space-y-1.5">
                            <div className="text-[9.5px] text-[#FFD700]/70 font-bold uppercase tracking-wider font-sans">
                              🎯 下月具体营销重心建议 (AI Core suggestions)
                            </div>
                            <div className="space-y-2">
                              {businessReport.marketingSuggestions?.map((item: any, idx: number) => (
                                <div key={idx} className="p-2.5 bg-[#111112] hover:bg-white/[0.02] border border-white/5 hover:border-[#FFD700]/10 rounded-xl transition space-y-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="text-[10.5px] font-bold text-white flex-1 leading-snug font-sans">
                                      {idx + 1}. {item.title}
                                    </span>
                                    <span className={`text-[7.5px] font-bold uppercase px-1 py-0.5 rounded border ${
                                      item.priority === 'HIGH' 
                                        ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                    }`}>
                                      {item.priority === 'HIGH' ? '核心主攻' : '重点突破'}
                                    </span>
                                  </div>
                                  <p className="text-[9.5px] text-white/50 leading-relaxed font-light font-sans">
                                    {item.desc}
                                  </p>
                                  <div className="flex items-center justify-between pt-1 border-t border-white/5 mt-1.5">
                                    <div className="flex items-center gap-1 text-[8.5px] text-white/40">
                                      <span className="px-1.5 py-0.5 bg-white/5 rounded text-[8px] font-sans">
                                        📍 目标范围：{item.targetRegion}
                                      </span>
                                    </div>
                                    {(() => {
                                      const executedTask = feishuMarketingTasks.find(t => t.title === item.title);
                                      return executedTask ? (
                                        <span className="text-[8px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20 font-bold flex items-center gap-1 font-sans">
                                          <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                                          已同步飞书执行中
                                        </span>
                                      ) : (
                                        <button
                                          onClick={() => executeMarketingSuggestion(item)}
                                          className="text-[8px] font-bold text-black bg-[#FFD700] hover:bg-[#FFD700]/95 px-2 py-0.5 rounded transition active:scale-95 flex items-center gap-1 font-sans cursor-pointer"
                                        >
                                          ⚡ 一键执行并同步
                                        </button>
                                      );
                                    })()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-2 py-6 text-center">
                          <span className="text-[10px] text-white/40 font-sans">暂无缓存报告数据。点击下方按钮，由阿紫 AI 经营顾问开启对大盘订单的波动与复购多维研判。</span>
                          <button
                            onClick={() => fetchBusinessReport()}
                            className="text-[9px] text-black bg-[#FFD700] hover:bg-[#FFD700]/90 font-bold px-3 py-1 rounded-xl transition active:scale-95 mt-1 font-sans"
                          >
                            🚀 立即生成商业建议报告
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-[8px] text-white/30 leading-normal font-sans text-center">
                      * 声明: 财务大盘数据均由系统底层安全沙盒机制结合实收账目生成，自动隔离敏感支付网关，确保合规透明。
                    </p>
                  </div>
                )}

                {/* TAB 3: FEISHU AI AUTOMATION ASSISTANT */}
                {financeActiveTab === 'feishu' && (
                  adminViewRole === 'founder' ? (
                    <div className="space-y-4 animate-fadeIn text-left">
                      <div className="p-3 bg-[#111112] border border-white/5 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-white/80 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-[#FFD700]" />
                            <span>飞书群机器人 API Webhook 自动对账通道</span>
                          </span>
                          <span className="text-[8.5px] text-[#FFD700] font-bold">API ACTIVE</span>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <label className="text-[8.5px] text-white/40 block mb-1">飞书群机器人 Webhook 地址:</label>
                            <input
                              type="text"
                              value={feishuWebhookUrl}
                              onChange={(e) => setFeishuWebhookUrl(e.target.value)}
                              className="w-full bg-black border border-white/10 rounded-lg px-2.5 py-1 text-[9.5px] font-mono text-white/80 focus:border-[#FFD700] focus:outline-none"
                              placeholder="请输入飞书机器人的Webhook URL"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[8.5px] text-white/40 block mb-1">选择对账总结月份:</label>
                              <select
                                value={feishuReviewMonth}
                                onChange={(e) => setFeishuReviewMonth(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white/80 focus:border-[#FFD700] focus:outline-none"
                              >
                                <option value="2026-06">2026年06月 (本月)</option>
                                <option value="2025-06">2025年06月 (历史同期)</option>
                              </select>
                            </div>
                            
                            <div className="flex items-end">
                              <button
                                onClick={handlePushToFeishu}
                                disabled={feishuBotStatus === 'sending'}
                                className="w-full py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-[9.5px] rounded-lg transition shadow-md flex items-center justify-center gap-1"
                              >
                                {feishuBotStatus === 'sending' ? (
                                  <>
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                    <span>推送对账中...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-3 h-3" />
                                    <span>推送月度对账至飞书群</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Micro log terminal */}
                        {feishuLogs.length > 0 && (
                          <div className="p-2 bg-black rounded-lg border border-white/5 font-mono text-[8.5px] text-white/70 space-y-1 max-h-[85px] overflow-y-auto">
                            {feishuLogs.map((log, idx) => (
                              <div key={idx} className={log.includes('成功') || log.includes('200') ? 'text-green-400' : ''}>
                                {log}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Simulated Feishu Client Group Message Bubble */}
                      {showFeishuMobileSim && (
                        <div className="border border-[#1f2329]/40 bg-[#f5f6f7] rounded-2xl overflow-hidden shadow-xl animate-fadeIn text-[11px] font-sans text-[#1f2329]">
                          {/* Feishu Header simulated */}
                          <div className="bg-[#1f2329] px-3 py-1.5 flex items-center justify-between text-white text-[9.5px] font-medium">
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              <span>飞书群：阿紫AI音乐自动化搞钱小分队 🚀</span>
                            </div>
                            <span className="text-[8px] opacity-60">刚才</span>
                          </div>

                          {/* Feishu Message Body */}
                          <div className="p-3 space-y-2.5">
                            {/* Bot Avatar + Name */}
                            <div className="flex gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#FFD700] to-amber-500 text-black font-black text-[9px] flex items-center justify-center shrink-0 shadow-sm border border-white/30">
                                🤖
                              </div>
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-gray-800 text-[10px]">阿紫AI音乐自动化财务助手</span>
                                  <span className="bg-blue-100 text-blue-700 text-[7px] px-1 rounded font-bold">机器人</span>
                                </div>
                                
                                {/* Rich Card Message */}
                                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm space-y-2 max-w-[95%]">
                                  <div className="border-b border-gray-100 pb-1.5 flex justify-between items-center">
                                    <span className="text-[10px] font-extrabold text-[#1f2329] flex items-center gap-1">
                                      📊 阿紫音乐工作室 · {feishuReviewMonth} 财务复盘
                                    </span>
                                    <span className="text-[8px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-extrabold">自动对账绿通</span>
                                  </div>

                                  <div className="space-y-1 text-gray-600 text-[9.5px]">
                                    <div>💰 <strong>月度实收定制总额</strong>: <span className="text-red-500 font-bold">¥{feishuReviewMonth === '2026-06' ? todayRevenue : 397}.00</span></div>
                                    <div>👥 <strong>本期成功建档订单</strong>: <span className="text-gray-800 font-bold">{feishuReviewMonth === '2026-06' ? todayOrders.length : 2} 笔</span></div>
                                    <div>🌟 <strong>触发重要纪念日老客</strong>: <span className="text-amber-500 font-bold">{feishuReviewMonth === '2026-06' ? '2' : '1'} 位</span></div>
                                    <div>🎯 <strong>下月加强策略 (AI精算)</strong>: <span className="text-indigo-600 font-medium">针对去年老客加大周年关怀回访，复购客单价较高，利润空间极广！</span></div>
                                  </div>

                                  <div className="bg-gray-50 p-1.5 rounded-lg text-[8.5px] text-gray-500 leading-normal border-l-2 border-[#FFD700]">
                                    💡 <strong>经营金句</strong>: “复购 is King！把握纪念日情感共振，老客一键二次成交，裂变生生不息！”
                                  </div>

                                  {/* Feishu Todo Task & Approval Flow Synchronization Section */}
                                  <div className="border-t border-gray-100 pt-2.5 space-y-2">
                                    <div className="flex items-center justify-between text-[9px]">
                                      <span className="font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        📋 飞书待办看板 ＆ 交付审批流已同步
                                      </span>
                                      <span className="text-[8px] text-gray-400">一键闭环</span>
                                    </div>
                                    
                                    <div className="space-y-1">
                                      {feishuMarketingTasks.map((task) => (
                                        <div key={task.id} className="p-1.5 bg-yellow-50/70 rounded-lg border border-[#FFD700]/30 flex items-center justify-between text-[9px] text-gray-700 font-sans animate-fadeIn">
                                          <div className="space-y-0.5 text-left">
                                            <div className="font-bold flex items-center gap-1 text-gray-900">
                                              <span className="text-black bg-[#FFD700] text-[7px] px-1 rounded font-sans font-bold">📢 AI营销</span>
                                              <span className="truncate max-w-[130px]">{task.title}</span>
                                            </div>
                                            <p className="text-[8px] text-gray-500 truncate max-w-[170px]">
                                              {task.desc}
                                            </p>
                                          </div>
                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <span className="text-[7.5px] px-1 py-0.5 rounded font-extrabold bg-red-100 text-red-700">
                                              执行中
                                            </span>
                                            <span className="text-[8px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-1 rounded font-mono font-bold">
                                              已派发
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                      {orders.filter(o => o.status !== 'completed').slice(0, 3).map((o, idx) => (
                                        <div key={o.id} className="p-1.5 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between text-[9px] text-gray-700 font-sans">
                                          <div className="space-y-0.5 text-left">
                                            <div className="font-bold flex items-center gap-1 text-gray-900">
                                              <span>《{o.songTitle || '未命名'}》</span>
                                              <span className="text-[7.5px] text-gray-500 font-normal">({o.userName})</span>
                                            </div>
                                            <p className="text-[8px] text-gray-500 truncate max-w-[150px]">
                                              风格: {o.musicStyle?.split(' ')[0]} | 送给: {o.targetAudience}
                                            </p>
                                          </div>
                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <span className={`text-[7.5px] px-1 py-0.5 rounded font-extrabold ${
                                              o.status === 'processing' 
                                                ? 'bg-amber-100 text-amber-700' 
                                                : o.status === 'pending' 
                                                ? 'bg-blue-100 text-blue-700' 
                                                : 'bg-orange-100 text-orange-700'
                                            }`}>
                                              {o.status === 'processing' ? '制作中' : o.status === 'pending' ? '待对账' : '已对账'}
                                            </span>
                                            <span className="text-[8px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-1 rounded font-mono font-bold">
                                              审批中
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                      {orders.filter(o => o.status !== 'completed').length === 0 && (
                                        <div className="p-2 text-center text-gray-400 text-[8.5px]">
                                          🎉 今日暂无待交付任务，全部交付完成！
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="text-[8px] text-gray-400 leading-normal bg-blue-50/50 p-1.5 rounded text-left border-l-2 border-blue-400">
                                      ✨ <strong>交付闭环：</strong>校园/渠道推广 → 客户下单 → 系统匹配分润 → 自动生成待办推送飞书 → 外包需求单派单 → 飞书交付审批一键打标已完成。
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-5 bg-[#0e0e10]/80 border border-red-500/10 rounded-2xl text-center space-y-3 animate-fadeIn">
                      <div className="w-10 h-10 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                        <Lock className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-white">🔒 飞书主对账 API 模块受限</h4>
                      <p className="text-[10px] text-white/50 leading-relaxed max-w-md mx-auto">
                        系统检测到您当前的模拟身份为 <strong className="text-indigo-400">{adminViewRole === 'partner_sh' ? '上海徐汇城市合伙人' : '杨浦校园推广代理'}</strong>。
                        企业级飞书消息推送服务涉及平台总财务毛利润和全网合伙人分成总池，已对下级代理安全过滤。
                      </p>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[9.5px] text-left text-white/60 leading-normal space-y-1">
                        <span className="text-[#FFD700] font-bold block">🛡️ 隔离保护策略：</span>
                        <p>1. <strong>财务绝对保密</strong>：防止非核心骨干获悉主平台的全局资金周转大数，保障核心数据资产。</p>
                        <p>2. <strong>防误触/防乱改</strong>：确保只有拥有全局密钥的系统开发者或主创始人能调用或配置群对账接口。</p>
                      </div>
                    </div>
                  )
                )}

                {/* TAB 4: PARTNER & FOUNDER FISSION MATRIX */}
                {financeActiveTab === 'partners' && (
                  <div className="space-y-5 animate-fadeIn text-left">
                    {/* Model Introduction */}
                    <div className="p-3 bg-[#111112] border border-white/5 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#FFD700]">
                        <Award className="w-4 h-4 text-[#FFD700]" />
                        <span>🤝 『无限裂变分润体系』 招募与激励闭环说明</span>
                      </div>
                      
                      <div className="text-[9.5px] text-white/70 leading-relaxed space-y-1.5">
                        <p>
                          <strong>1. 创始人 (Founder - 主干)</strong>: 获得 <strong>30% 佣金</strong>；招募的下属合伙人出单，创始人可躺赚 <strong>10% 级差管理奖</strong>，推广员出单赚 <strong>15% 级差奖</strong>。
                        </p>
                        <p>
                          <strong>2. 城市合伙人 (Partner - 支线)</strong>: 获得 <strong>20% 佣金</strong>；旗下推广员出单，合伙人得 <strong>5% 级差管理奖</strong>。
                        </p>
                        <p>
                          <strong>3. 校园推广员 (Promoter - 触角)</strong>: 获得 <strong>15% 佣金</strong>，主打高校或社群，一单一结。
                        </p>
                        <p className="text-[#FFD700]/90">
                          🔥 <strong>无限级团队极差奖</strong>: 团队累计满100单升级为“荣誉合伙人”，全团队（无限代）额外抽 <strong>2% 业绩 overriding 奖励</strong>，彻底自驱动！
                        </p>
                      </div>
                    </div>

                    {/* Visual Partner Performance Report Dashboard */}
                    <div className="bg-[#111112] border border-white/5 rounded-2xl p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-[#FFD700]/10 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-[#FFD700]" />
                          </span>
                          <div>
                            <h4 className="text-xs font-serif font-bold text-white">合伙人团队业绩可视化报表看板</h4>
                            <p className="text-[9px] text-white/40">基于真实加盟网络实时数据计算，极差利润自动对账</p>
                          </div>
                        </div>
                        <span className="text-[8px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-mono font-bold animate-pulse">
                          ● 实收自动清算中
                        </span>
                      </div>

                      {/* Summary statistics row */}
                      {(() => {
                        const totalGmv = mockPartnersList.reduce((acc, p) => acc + p.totalGmv, 0);
                        const totalComm = mockPartnersList.reduce((acc, p) => acc + p.commissionPaid, 0);
                        const maxGmvPartner = mockPartnersList.reduce((max, p) => p.totalGmv > max.totalGmv ? p : max, mockPartnersList[0]);
                        
                        return (
                          <>
                            <div className="grid grid-cols-3 gap-2 text-center font-mono">
                              <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                                <span className="text-[8.5px] text-white/40 block">裂变团队总业绩</span>
                                <span className="text-[12px] font-bold text-[#FFD700]">¥{totalGmv.toLocaleString()}</span>
                                <span className="text-[7.5px] text-green-400 block mt-0.5">自裂变转化 100%</span>
                              </div>
                              <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                                <span className="text-[8.5px] text-white/40 block">已结极差佣金池</span>
                                <span className="text-[12px] font-bold text-green-400">¥{totalComm.toLocaleString()}</span>
                                <span className="text-[7.5px] text-white/30 block mt-0.5">秒到账率 99.8%</span>
                              </div>
                              <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                                <span className="text-[8.5px] text-white/40 block">全网首席裂变王</span>
                                <span className="text-[10px] font-bold text-white truncate block max-w-full">
                                  {maxGmvPartner?.name?.split(' ')[0] || '陈墨'}
                                </span>
                                <span className="text-[7.5px] text-[#FFD700] block mt-0.5">GMV: ¥{maxGmvPartner?.totalGmv?.toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Column and Pie Visualizers */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                              {/* Left chart: Bar chart for GMV of each partner */}
                              <div className="bg-black/20 p-3 rounded-xl border border-white/5 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-bold text-white flex items-center gap-1">
                                    <span>📊 核心合伙人 GMV 战力排行榜</span>
                                  </span>
                                  <span className="text-[8px] text-white/30 font-mono">单位: 元</span>
                                </div>
                                
                                <div className="space-y-2.5">
                                  {mockPartnersList.map((p, idx) => {
                                    const percent = totalGmv > 0 ? (p.totalGmv / totalGmv) * 100 : 0;
                                    return (
                                      <div key={p.id} className="space-y-1">
                                        <div className="flex justify-between text-[8.5px] text-white/60">
                                          <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                                            <span className={`w-3.5 h-3.5 rounded-full text-[8px] font-black flex items-center justify-center shrink-0 ${
                                              idx === 0 ? 'bg-[#FFD700] text-black' : idx === 1 ? 'bg-zinc-300 text-black' : 'bg-zinc-600 text-white'
                                            }`}>
                                              {idx + 1}
                                            </span>
                                            <span className="text-white truncate font-medium">{p.name}</span>
                                            <span className="text-[7.5px] bg-white/5 px-1 rounded text-white/40">{p.region}</span>
                                          </div>
                                          <span className="font-mono font-bold text-white">¥{p.totalGmv.toLocaleString()}</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                                          <div 
                                            className="h-full bg-gradient-to-r from-amber-500 via-[#FFD700] to-[#FFD700] rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,215,0,0.3)]" 
                                            style={{ width: `${Math.max(percent, 4)}%` }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Right chart: Share of total gmv */}
                              <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-bold text-white flex items-center gap-1">
                                    <span>🍩 团队极差收益分配占比</span>
                                  </span>
                                  <span className="text-[8px] text-white/30 font-mono">占比分析</span>
                                </div>

                                <div className="flex items-center justify-around py-2.5">
                                  {/* Custom beautiful donut simulator */}
                                  <div className="relative w-20 h-20 shrink-0">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                      <path
                                        className="text-white/5"
                                        strokeWidth="4"
                                        stroke="currentColor"
                                        fill="none"
                                        d="M18 2.0845
                                          a 15.9155 15.9155 0 0 1 0 31.831
                                          a 15.9155 15.9155 0 0 1 0 -31.831"
                                      />
                                      {/* Highlight 1: ChenMo (Top) ~51.2% */}
                                      <path
                                        className="text-[#FFD700]"
                                        strokeWidth="4"
                                        strokeDasharray="51, 100"
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="none"
                                        d="M18 2.0845
                                          a 15.9155 15.9155 0 0 1 0 31.831
                                          a 15.9155 15.9155 0 0 1 0 -31.831"
                                      />
                                      {/* Highlight 2: ZhangXiao ~30% */}
                                      <path
                                        className="text-amber-500"
                                        strokeWidth="4"
                                        strokeDasharray="30, 100"
                                        strokeDashoffset="-51"
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="none"
                                        d="M18 2.0845
                                          a 15.9155 15.9155 0 0 1 0 31.831
                                          a 15.9155 15.9155 0 0 1 0 -31.831"
                                      />
                                      {/* Highlight 3: LiTingTing ~18.8% */}
                                      <path
                                        className="text-emerald-400"
                                        strokeWidth="4"
                                        strokeDasharray="19, 100"
                                        strokeDashoffset="-81"
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="none"
                                        d="M18 2.0845
                                          a 15.9155 15.9155 0 0 1 0 31.831
                                          a 15.9155 15.9155 0 0 1 0 -31.831"
                                      />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                      <span className="text-[10px] font-bold text-white font-mono">100%</span>
                                      <span className="text-[6.5px] text-white/40 scale-90">业绩饱和</span>
                                    </div>
                                  </div>

                                  <div className="space-y-1.5 text-[8px]">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
                                      <span className="text-white/60">陈墨队: 51.2%</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                      <span className="text-white/60">张潇队: 30.0%</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                      <span className="text-white/60">李婷婷: 18.8%</span>
                                    </div>
                                  </div>
                                </div>

                                <p className="text-[8px] text-white/40 leading-normal text-center mt-1 border-t border-white/5 pt-1.5">
                                  💡 战力模型提示: 当前团队业绩呈高集中形态，杭州西湖战区陈墨团队贡献过半。建议创始人增加对上海杨浦、北京朝阳战区的流量或课程扶植。
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Interactive Math Simulator */}
                    <div className="p-3.5 bg-black rounded-2xl border border-[#FFD700]/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5 text-[#FFD700]" />
                          <span>裂变分润收益精算沙盘 (Fission Calculator)</span>
                        </span>
                        <span className="text-[8px] bg-[#FFD700]/10 text-[#FFD700] px-1.5 py-0.5 rounded uppercase font-bold">
                          模拟器
                        </span>
                      </div>

                      <div className="space-y-3 font-mono text-[9px]">
                        {/* Slider 1: Direct Partners recruited */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-white/60">
                            <span>我直接招募的创始人/合伙人数量:</span>
                            <span className="text-[#FFD700] font-bold">{partnerCount} 人</span>
                          </div>
                          <input
                            type="range"
                            min="2"
                            max="50"
                            value={partnerCount}
                            onChange={(e) => setPartnerCount(parseInt(e.target.value))}
                            className="w-full accent-[#FFD700] bg-zinc-800 h-1 rounded"
                          />
                        </div>

                        {/* Slider 2: Secondary promoters per partner */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-white/60">
                            <span>每个合伙人下属二级推广员数量:</span>
                            <span className="text-[#FFD700] font-bold">{promoterPerPartner} 人</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="30"
                            value={promoterPerPartner}
                            onChange={(e) => setPromoterPerPartner(parseInt(e.target.value))}
                            className="w-full accent-[#FFD700] bg-zinc-800 h-1 rounded"
                          />
                        </div>

                        {/* Slider 3: Average orders per promoter monthly */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-white/60">
                            <span>团队成员人均每月推广定制量:</span>
                            <span className="text-[#FFD700] font-bold">{ordersPerPerson} 单</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="20"
                            value={ordersPerPerson}
                            onChange={(e) => setOrdersPerPerson(parseInt(e.target.value))}
                            className="w-full accent-[#FFD700] bg-zinc-800 h-1 rounded"
                          />
                        </div>

                        {/* Slider 4: Average Order Price */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-white/60">
                            <span>平均定制歌单价 (元):</span>
                            <span className="text-[#FFD700] font-bold">¥{averageOrderPrice} /首</span>
                          </div>
                          <input
                            type="range"
                            min="99"
                            max="1288"
                            step="50"
                            value={averageOrderPrice}
                            onChange={(e) => setAverageOrderPrice(parseInt(e.target.value))}
                            className="w-full accent-[#FFD700] bg-zinc-800 h-1 rounded"
                          />
                        </div>
                      </div>

                      {/* Calculations projection */}
                      {(() => {
                        // Monthly passive management income calculation:
                        // You earn 10% on your directly managed partners/promoters network orders (as extreme management bonus override)
                        const totalActivePeopleInNetwork = partnerCount * promoterPerPartner;
                        const totalMonthlyOrders = totalActivePeopleInNetwork * ordersPerPerson;
                        const totalMonthlyGMV = totalMonthlyOrders * averageOrderPrice;
                        // Assuming average overriding commission of 10%
                        const passiveMonthlyIncome = Math.round(totalMonthlyGMV * 0.10);
                        const passiveAnnualIncome = passiveMonthlyIncome * 12;

                        return (
                          <div className="p-3 bg-zinc-950 rounded-xl border border-white/5 grid grid-cols-2 gap-3 text-center">
                            <div>
                              <span className="text-[8.5px] text-white/40 block">🎉 预计我的月度躺赚管理奖金：</span>
                              <span className="text-sm font-extrabold text-[#FFD700] font-mono">¥{passiveMonthlyIncome.toLocaleString()} 元</span>
                            </div>
                            <div>
                              <span className="text-[8.5px] text-white/40 block">🚀 裂变团队年度交付总流水：</span>
                              <span className="text-sm font-extrabold text-green-400 font-mono">¥{totalMonthlyGMV.toLocaleString()} 元</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Recruiting Toolkit & Manual Registration Form */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Invite Code Generator & Copy Instructions */}
                      <div className="p-3 bg-[#111112] border border-white/5 rounded-xl space-y-2">
                        <span className="text-[9.5px] text-white/50 block font-bold">📢 创始人裂变专属招募口令生成器</span>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={partnerInviteCode}
                            onChange={(e) => setPartnerInviteCode(e.target.value)}
                            className="bg-black border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white/80 focus:outline-none focus:border-[#FFD700] flex-1"
                            placeholder="专属邀请口令"
                          />
                          <button
                            onClick={() => {
                              const text = `【阿紫音乐工作室 · 城市合伙人招募令】\n我是阿紫 🎵，我们正在寻找 5 位城市合伙人/校园代理。通过一键智能化AI写歌平台，你只需利用微信私域、小红书推广或校园社群获取音乐定制意向，AI和我们平台负责全自动高保真出歌与交付。单笔最高分润 30%，旗下二级推广员出单你还能抽 5%-10% 级差管理费！输入我的裂变合伙人专属口令【${partnerInviteCode}】加入，让我们一起将回忆写成歌，流量套现无上限！`;
                              navigator.clipboard.writeText(text);
                              triggerToast('裂变推广专属微信说明文本已成功复制！');
                            }}
                            className="px-2 py-1 bg-[#FFD700] hover:bg-amber-400 text-black text-[9px] font-bold rounded transition"
                          >
                            复制招募语
                          </button>
                        </div>
                        <p className="text-[8.5px] text-white/40 leading-normal">
                          * 话术包含自动绑定上下级代理关联的合伙人口令，支持无限层级溯源。
                        </p>
                      </div>

                      {/* Manual partner entry */}
                      <form onSubmit={handleAddCustomPartner} className="p-3 bg-[#111112] border border-white/5 rounded-xl space-y-2">
                        <span className="text-[9.5px] text-white/50 block font-bold">👤 线下合伙人手动建档注册</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            placeholder="合伙人姓名"
                            value={partnerNameInput}
                            onChange={(e) => setPartnerNameInput(e.target.value)}
                            className="bg-black border border-white/10 rounded px-2 py-0.5 text-[9.5px] text-white/80 focus:outline-none focus:border-[#FFD700]"
                          />
                          <input
                            type="text"
                            placeholder="代理省份/城市"
                            value={partnerRegionInput}
                            onChange={(e) => setPartnerRegionInput(e.target.value)}
                            className="bg-black border border-white/10 rounded px-2 py-0.5 text-[9.5px] text-white/80 focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-[9px] rounded transition"
                        >
                          确认建档并关联旗下
                        </button>
                      </form>
                    </div>

                    {/* Partners table */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-white/50 font-bold block">👥 团队旗下核心城市合伙人名录</span>
                      <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
                        {mockPartnersList.map((partner) => (
                          <div key={partner.id} className="p-2.5 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-[10px] font-mono hover:bg-white/10 transition">
                            <div className="space-y-0.5 text-left">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white">{partner.name}</span>
                                <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1 rounded font-bold uppercase">
                                  {partner.region}
                                </span>
                              </div>
                              <div className="text-[8px] text-white/40">
                                旗下推广员: {partner.teamCount} 人 • 成功推荐: {partner.directCount} 笔订单
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-white/40 block text-[8px]">团队流水 / 已发提成</span>
                              <span className="text-[#FFD700] font-bold block">¥{partner.totalGmv} / ¥{partner.commissionPaid}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: In-Depth Orders Database & Customizer settings (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Order List / Database */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-white/5">
                    <div>
                      <h2 className="text-base font-serif text-white font-medium flex items-center gap-2">
                        <Coins className="w-5 h-5 text-[#FFD700]" />
                        <span>阿紫工作室定制需求库</span>
                      </h2>
                      <p className="text-[10px] text-white/40">管理已提交对账与已经生成歌词的客户记录</p>
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                        placeholder="搜索姓名/送歌人/单号"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {filteredOrders.length === 0 ? (
                      <div className="py-12 text-center text-xs text-white/30">
                        暂无匹配到的定制需求，可在前台提交新单。
                      </div>
                    ) : (
                      filteredOrders.map(o => {
                        const anniv = getAnniversaryStatus(o);
                        const isSelected = selectedOrderForDetail?.id === o.id;
                        
                        let borderClass = isSelected ? 'border-[#FFD700]' : 'border-white/5 hover:border-white/10';
                        let bgClass = isSelected ? 'bg-gradient-to-r from-zinc-900 to-black' : 'bg-white/5';
                        
                        if (anniv.isAnniversary && !isSelected) {
                          borderClass = 'border-[#FFD700]/30 shadow-[0_0_12px_rgba(255,215,0,0.08)]';
                          bgClass = 'bg-gradient-to-r from-[#FFD700]/5 via-zinc-900/40 to-transparent';
                        }

                        return (
                          <div 
                            key={o.id}
                            onClick={() => setSelectedOrderForDetail(o)}
                            className={`p-3 rounded-xl border transition cursor-pointer flex justify-between items-center relative overflow-hidden ${bgClass} ${borderClass}`}
                          >
                            {/* Glowing gold tag for anniversary customers */}
                            {anniv.isAnniversary && (
                              <div className="absolute right-0 top-0 bg-gradient-to-l from-[#FFD700] to-amber-500 text-black font-extrabold text-[7.5px] px-2 py-0.5 rounded-bl-lg shadow-sm flex items-center gap-0.5 z-10 select-none animate-pulse">
                                <Sparkles className="w-2 h-2" />
                                <span>年度复购转化窗口</span>
                              </div>
                            )}

                            <div className="space-y-1 flex-1 min-w-0 pr-4 text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-white flex items-center gap-1">
                                  {o.userName}
                                  {anniv.isAnniversary && (
                                    <span className="text-[9px] text-[#FFD700] font-bold">
                                      (纪念日老客 🌟)
                                    </span>
                                  )}
                                </span>
                                <span className="text-[9px] text-white/40 font-mono">#{o.id.slice(-6)}</span>
                              </div>
                              <div className="text-[10px] text-white/50 truncate">
                                送给: <span className="text-white/80 font-medium">{o.targetAudience}</span> • 《{o.songTitle}》
                              </div>
                              
                              {anniv.isAnniversary && (
                                <div className="text-[9.5px] text-[#FFD700] font-semibold flex items-center gap-1 py-0.5">
                                  <Clock className="w-3 h-3 text-[#FFD700] shrink-0 animate-bounce" />
                                  <span>{anniv.message}</span>
                                </div>
                              )}
                              
                              <div className="text-[9px] text-white/30 font-mono truncate">
                                付款备注: {o.paymentMemo} | 微信号: {o.userWechat}
                              </div>
                            </div>

                            <div className="text-right space-y-1 shrink-0 ml-2">
                              <div className="text-xs font-semibold text-[#FFD700]">¥{o.totalPrice}</div>
                              <div>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                  o.status === 'completed'
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                    : o.status === 'processing'
                                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                      : o.status === 'reconciled'
                                        ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                  {o.status === 'completed' ? '已交付' : o.status === 'processing' ? '制作中' : o.status === 'reconciled' ? '已到账' : '待核验'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Selected Order Detail Panel */}
                {selectedOrderForDetail && (
                  <div className="mt-4 p-4 bg-black/40 border border-white/10 rounded-xl space-y-3 animate-fadeIn">
                    <div className="flex justify-between items-start pb-2 border-b border-white/5">
                      <div>
                        <h3 className="text-xs font-bold text-white flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#FFD700]" />
                          <span>客户需求精修详情 ({selectedOrderForDetail.userName})</span>
                        </h3>
                        <span className="text-[8px] text-white/30 font-mono block mt-0.5">订单号: {selectedOrderForDetail.id} | 创建于 {selectedOrderForDetail.createdAt}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => deleteOrder(selectedOrderForDetail.id)}
                          className="p-1 hover:bg-white/5 rounded text-red-400 hover:text-red-300 transition"
                          title="删除订单"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedOrderForDetail(null)}
                          className="text-[10px] text-white/50 hover:text-white px-1.5 py-0.5 bg-white/5 rounded"
                        >
                          收起
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-white/60">
                      <div><strong className="text-white/40">送歌对象：</strong>{selectedOrderForDetail.targetAudience}</div>
                      <div><strong className="text-white/40">偏好曲风：</strong>{selectedOrderForDetail.musicStyle}</div>
                      <div><strong className="text-white/40">音色要求：</strong>{selectedOrderForDetail.singerGender}</div>
                      <div><strong className="text-white/40">语言倾向：</strong>{selectedOrderForDetail.language}</div>
                      <div className="col-span-2"><strong className="text-white/40">核心要对TA说的话：</strong>“{selectedOrderForDetail.coreMessage}”</div>
                      <div className="col-span-2"><strong className="text-white/40">关键细节记忆：</strong>“{selectedOrderForDetail.keyMemories}”</div>
                    </div>

                    {/* 👤 智能客户关系链条与老客历史足迹 CRM 洞察卡片 */}
                    {(() => {
                      const currentDetail = selectedOrderForDetail;
                      if (!currentDetail) return null;
                      
                      // 检索所有与当前选定订单用户名或微信相同、但订单ID不同的历史订单
                      const historyList = orders.filter(o => 
                        o.id !== currentDetail.id && (
                          (o.userName && o.userName.trim() === currentDetail.userName.trim()) ||
                          (o.userWechat && currentDetail.userWechat && o.userWechat.trim() === currentDetail.userWechat.trim())
                        )
                      );

                      const totalOrdersCount = historyList.length + 1;
                      const totalSpendSum = historyList.reduce((sum, o) => sum + (o.totalPrice || 0), 0) + (currentDetail.totalPrice || 0);

                      return (
                        <div className="mt-3.5 p-3.5 bg-zinc-950/80 border border-[#FFD700]/20 rounded-xl space-y-3 shadow-md">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-white/5 pb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="p-1 bg-[#FFD700]/10 rounded-md">
                                <User className="w-3.5 h-3.5 text-[#FFD700]" />
                              </span>
                              <span className="text-[11px] font-bold text-white tracking-wide">
                                👤 客户忠诚度模型与历史足迹洞察
                              </span>
                            </div>
                            
                            {totalOrdersCount > 1 ? (
                              <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-mono font-bold animate-pulse inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                高价值复购老客 (已定制 {totalOrdersCount} 次 | 共 ¥{totalSpendSum})
                              </span>
                            ) : (
                              <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-mono font-bold inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                首次合作新客 (首单金额 ¥{currentDetail.totalPrice})
                              </span>
                            )}
                          </div>

                          {totalOrdersCount > 1 ? (
                            <div className="space-y-3">
                              {/* 历史定制清单列表 */}
                              <div className="space-y-1.5">
                                <span className="text-[9px] text-white/40 uppercase tracking-wider font-bold block text-left">
                                  🕰️ 该客户在工作室的历史定制档案 (点击切换详情)：
                                </span>
                                <div className="space-y-1.5 max-h-[125px] overflow-y-auto pr-1">
                                  {historyList.map(hist => (
                                    <div 
                                      key={hist.id}
                                      onClick={() => setSelectedOrderForDetail(hist)}
                                      className="p-2 bg-white/5 hover:bg-[#FFD700]/5 hover:border-[#FFD700]/40 rounded-lg border border-white/5 transition flex justify-between items-center cursor-pointer group"
                                      title="一键加载该历史订单的需求细节"
                                    >
                                      <div className="space-y-0.5 text-left">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[10px] text-white font-medium group-hover:text-[#FFD700] transition">
                                            《{hist.songTitle || '未命名'}》
                                          </span>
                                          <span className="text-[8px] text-white/30 font-mono">
                                            #{hist.id.slice(-6)}
                                          </span>
                                        </div>
                                        <div className="text-[9px] text-white/50 leading-none">
                                          送给: <span className="text-white/80">{hist.targetAudience}</span> • 风格: <span className="text-white/80">{hist.musicStyle?.split(' ')[0]}</span>
                                        </div>
                                      </div>
                                      <div className="text-right shrink-0 ml-2">
                                        <span className="text-[10px] text-[#FFD700] font-mono font-bold block leading-tight">
                                          ¥{hist.totalPrice}
                                        </span>
                                        <span className="text-[7.5px] text-white/30 block">
                                          {hist.createdAt || '历史合作'}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* CRM 话术辅导 */}
                              <div className="p-2.5 bg-[#FFD700]/5 border border-[#FFD700]/10 rounded-lg space-y-1 text-left">
                                <div className="text-[9.5px] text-[#FFD700] font-bold flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-[#FFD700] animate-pulse" />
                                  <span>AI 温情老客沟通与客情打磨技巧：</span>
                                </div>
                                <p className="text-[10px] text-white/70 leading-relaxed">
                                  该客户之前定制过<strong>《{historyList[0]?.songTitle || '历史单曲'}》</strong>（送给：<strong>{historyList[0]?.targetAudience || '最爱的人'}</strong>），对阿紫工作室有极深厚的情感共鸣和信任度。在本次对接中，强烈建议主动向客户温暖回访上一首歌曲在受众那里的反馈。这次定制可以帮他向上争取资深音乐人排队调音，并顺势在微信中向其推荐“声音克隆精细人工调教包”和“极清MV视频大礼包”，促成高单价增值复购！
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2.5 text-left">
                              <p className="text-[10px] text-white/60 leading-relaxed">
                                这是客户 <strong>{currentDetail.userName}</strong> 的首次定制，他本次写歌主要是送给 “<span className="text-white/90 font-medium">{currentDetail.targetAudience || '未填写'}</span>”，初衷是 “<span className="text-white/90 font-medium">{currentDetail.creationReason || '未填写'}</span>”。
                              </p>
                              <div className="p-2.5 bg-white/5 border border-white/5 rounded-lg">
                                <div className="text-[9.5px] text-green-400 font-bold flex items-center gap-1 mb-1">
                                  <Sparkles className="w-3 h-3 text-green-400" />
                                  <span>新客破冰促成转化要领：</span>
                                </div>
                                <p className="text-[9.5px] text-white/50 leading-relaxed">
                                  1. <strong>情感共振</strong>：沟通时重点赞赏其下单初衷与故事细节（如：“张哥，您要对TA说的那几句词特别走心，我们主创老师都说非常有情感张力！”）；<br />
                                  2. <strong>超值交付</strong>：在给客户发送成品时，务必赠送为其专属制作的 <strong>小红书九宫格 AI 营销裂变海报</strong>，教他直接在小红书或朋友圈分享，这不仅能给予客户尊享感，更能直接给您带来疯狂的二次私域裂变单！
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* 📅 重要纪念日提醒与年度复购客情拉单模块 */}
                    {(() => {
                      const annivInfo = getAnniversaryStatus(selectedOrderForDetail);
                      
                      // Calculate estimated future anniversaries if no past anniversary exists
                      const orderDateStr = selectedOrderForDetail.createdAt || '';
                      let monthDayStr = '未知月日';
                      let nextAnnivDateStr = '未知日期';
                      try {
                        if (orderDateStr) {
                          const orderDate = new Date(orderDateStr.replace(/-/g, '/'));
                          const m = orderDate.getMonth() + 1;
                          const d = orderDate.getDate();
                          monthDayStr = `${m}月${d}日`;
                          nextAnnivDateStr = `2027年${m}月${d}日`;
                        }
                      } catch (err) {}

                      return (
                        <div className="p-3 bg-zinc-950/60 border border-[#FFD700]/10 rounded-xl space-y-2 text-left">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#FFD700]">
                              <Calendar className="w-4 h-4 text-[#FFD700]" />
                              <span>📅 重要纪念日提醒 (智能复购转化引擎)</span>
                            </div>
                            {annivInfo.isAnniversary ? (
                              <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded font-bold animate-pulse">
                                🔥 黄金复购窗口期
                              </span>
                            ) : (
                              <span className="text-[8px] bg-white/5 text-white/50 border border-white/10 px-1.5 py-0.5 rounded font-bold">
                                📅 周期自动储备
                              </span>
                            )}
                          </div>

                          {annivInfo.isAnniversary ? (
                            <div className="space-y-2">
                              <p className="text-[10px] text-white/80 leading-relaxed">
                                🚨 <strong>系统重磅检测</strong>：该客户在去年同期的 <strong className="text-[#FFD700] font-mono">{annivInfo.pastOrder?.createdAt.split(' ')[0]}</strong> 曾为 『<strong className="text-white font-medium">{annivInfo.pastOrder?.targetAudience}</strong>』 成功定制过一首专属歌曲 <strong className="text-[#FFD700]">《{annivInfo.pastOrder?.songTitle || '未命名'}》</strong>。
                                <br />
                                现恰逢其<strong>年度纪念日黄金窗口期</strong>！老客户对品牌的极高信任配合周年回忆的巨大情感共振，正是促进『年度二次复购转化』的绝佳时机！
                              </p>
                              
                              <button
                                onClick={() => setShowAnniversaryScript(!showAnniversaryScript)}
                                className="w-full py-1.5 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-[10px] rounded-lg transition shadow-md flex items-center justify-center gap-1"
                              >
                                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                                <span>{showAnniversaryScript ? '收起专属周年回访话术' : '✨ 一键秒级生成温情周年回访与续定促销话术'}</span>
                              </button>

                              {showAnniversaryScript && (
                                <div className="mt-2 p-2.5 bg-zinc-900 border border-[#FFD700]/20 rounded-lg space-y-2 animate-fadeIn text-left">
                                  <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                                    <span className="text-[9px] text-[#FFD700] font-bold">微信/私域专属周年关怀与转化方案：</span>
                                    <button
                                      onClick={() => {
                                        const text = `【阿紫音乐工作室周年暖心回访】\n${selectedOrderForDetail.userName || '张哥'}您好呀，我是阿紫音乐工作室的阿紫 🎵。一转眼时间过得真快，去年差不多这个时候，您定制的那首写给${annivInfo.pastOrder?.targetAudience || '最爱的人'}的定制单曲《${annivInfo.pastOrder?.songTitle || '未命名'}》还经常浮现在我们主创老师的脑海中。最近你们生活一切都顺利吧？\n\n在这个特别的周年纪念日即将到来之际，如果今年你们有新的纪念时刻、或者想为TA定一首升级风格的全新曲目，阿紫特别为您准备了【8.5折周年专享温情券】哦。我亲自帮您跟进排档，把新一年的温情点滴也写进歌里，一定超有意义！如果您感兴趣，随时发我新的故事点滴哦，祝你们天天开心！`;
                                        navigator.clipboard.writeText(text);
                                        triggerToast('微信周年回访话术已成功复制到剪贴板！');
                                      }}
                                      className="text-[8.5px] text-[#FFD700] hover:text-white px-1.5 py-0.5 bg-white/5 rounded border border-white/10 hover:border-[#FFD700] flex items-center gap-1 transition"
                                    >
                                      <Copy className="w-2.5 h-2.5" />
                                      <span>一键复制话术</span>
                                    </button>
                                  </div>
                                  <div className="p-2 bg-black/60 rounded font-mono text-[9.5px] text-white/80 leading-relaxed whitespace-pre-wrap select-all">
                                    {`【微信回访话术】\n`}
                                    {selectedOrderForDetail.userName || '张哥'}您好呀，我是阿紫音乐工作室的阿紫 🎵。一转眼时间过得真快，去年差不多这个时候，您定制的那首写给{annivInfo.pastOrder?.targetAudience || '最爱的人'}的定制单曲《{annivInfo.pastOrder?.songTitle || '未命名'}》还经常浮现在我们主创老师的脑海中。最近你们生活一切都顺利吧？{"\n\n"}
                                    在这个特别的周年纪念日即将到来之际，如果今年你们有新的纪念时刻、或者想为TA定一首升级风格的全新曲目，阿紫特别为您准备了【8.5折周年专享温情券】哦。我亲自帮您跟进排档，把新一年的温情点滴也写进歌里，一定超有意义！如果您感兴趣，随时发我新的故事点滴哦，祝你们天天开心！
                                  </div>
                                  <div className="text-[8.5px] text-white/40 leading-tight font-sans">
                                    💡 <strong>运营建议</strong>：可以在回访时附带他去年定制的精美专辑海报图（或小红书长图），瞬间唤醒客户的温情记忆，促成超高转化！
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <p className="text-[10px] text-white/60 leading-relaxed text-left">
                                📌 <strong>纪念日排程中</strong>：根据本次定制，系统智能分析出客户 <strong>{selectedOrderForDetail.userName}</strong> 的核心纪念日节点在每年的 <strong className="text-white/90 font-mono">{monthDayStr}</strong>（送给: <span className="text-white/80">{selectedOrderForDetail.targetAudience}</span>）。
                                <br />
                                这是一个极有潜力的复购储备契机。系统已自动将其录入『年度复购高意向储备库』。
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="p-1.5 bg-white/5 rounded-lg border border-white/5">
                                  <span className="text-[8px] text-white/40 block">预估下次复购窗口：</span>
                                  <span className="text-[9.5px] text-[#FFD700] font-mono font-bold block">{nextAnnivDateStr} 之前</span>
                                </div>
                                <div className="p-1.5 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                                  <div className="text-[8.5px] text-white/50">
                                    建议提前 <strong>15</strong> 天跟进
                                  </div>
                                  <button
                                    onClick={() => {
                                      const text = `【阿紫音乐工作室 · 新单交付周年温情提醒卡】\n您好呀！非常荣幸今天能为您定制这首精美单曲《${selectedOrderForDetail.songTitle || '未命名'}》。我们已经将每年的 ${monthDayStr} 标记为您的尊贵专属纪念日。一周年时我们将自动为您寄出一份精美的实体黑胶唱片CD纪念礼，并自动为您保留后续写歌的【终身特惠老客特权】。祝您们永远幸福甜蜜！`;
                                      navigator.clipboard.writeText(text);
                                      triggerToast('交付周年温馨卡片话术已成功复制到剪贴板！');
                                    }}
                                    className="px-1 text-[8px] text-white/70 bg-white/5 rounded border border-white/10 hover:border-[#FFD700] hover:text-[#FFD700] transition h-full flex items-center justify-center font-bold"
                                    title="复制新单交付时的周年关怀话术"
                                  >
                                    一键生成交付提醒
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* 🤝 订单级差分润与无限裂变对账大盘 */}
                    {(() => {
                      const price = selectedOrderForDetail.totalPrice || 0;
                      
                      // Calculate commissions based on selected channel role
                      let promoterComm = 0;
                      let partnerComm = 0;
                      let founderComm = 0;
                      let formulaText = '';
                      
                      if (orderSourceRole === 'promoter') {
                        promoterComm = Math.round(price * 0.15 * 100) / 100;
                        partnerComm = Math.round(price * 0.05 * 100) / 100; // 5% differential override
                        founderComm = Math.round(price * 0.10 * 100) / 100; // 10% differential override
                        formulaText = `校园推广员直接推广 (得15%) + 城市合伙人极差管理奖 (得5%) + 创始人级差管理奖 (得10%)`;
                      } else if (orderSourceRole === 'partner') {
                        promoterComm = 0;
                        partnerComm = Math.round(price * 0.20 * 100) / 100; // 20% direct
                        founderComm = Math.round(price * 0.10 * 100) / 100; // 10% differential override
                        formulaText = `城市合伙人直接出单 (得20%) + 创始人级差管理奖 (得10%)`;
                      } else {
                        promoterComm = 0;
                        partnerComm = 0;
                        founderComm = Math.round(price * 0.30 * 100) / 100; // 30% direct
                        formulaText = `创始人亲自出单/直营渠道 (得30%)`;
                      }
                      
                      // Extra +2% honorary team milestone pool bonus
                      const extraPoolBonus = includeExtraBonus ? Math.round(price * 0.02 * 100) / 100 : 0;
                      const totalDistributed = promoterComm + partnerComm + founderComm + extraPoolBonus;
                      const studioNetProfit = Math.round((price - totalDistributed) * 100) / 100;

                      return (
                        <div className="p-3.5 bg-zinc-950/70 border border-[#FFD700]/10 rounded-xl space-y-3 text-left">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#FFD700]">
                              <Percent className="w-4 h-4 text-[#FFD700]" />
                              <span>🤝 裂变分润极差自动对账 (订单级核算)</span>
                            </div>
                            <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-bold font-mono">
                              无级限裂变算法 v2.8
                            </span>
                          </div>

                          <p className="text-[10px] text-white/50 leading-relaxed">
                            系统检测到该订单金额为 <strong className="text-white font-mono">¥{price}</strong>。根据您的『无限级裂变分润模型』，选择该订单的出单渠道，系统将毫秒级核算出应付各级分销代理的极差佣金，自动对账，零人工介入。
                          </p>

                          {/* Role Selector Tabs */}
                          <div className="space-y-1">
                            <span className="text-[9px] text-white/40 block font-bold">1. 请选择该订单的实际出单人员身份：</span>
                            <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 rounded-lg border border-white/5">
                              <button
                                type="button"
                                onClick={() => setOrderSourceRole('promoter')}
                                className={`py-1 rounded text-[9.5px] font-bold transition flex flex-col items-center justify-center ${
                                  orderSourceRole === 'promoter' 
                                    ? 'bg-[#FFD700] text-black shadow-sm' 
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <span>推广员出单</span>
                                <span className="text-[7.5px] opacity-80">(返15% + 级差)</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setOrderSourceRole('partner')}
                                className={`py-1 rounded text-[9.5px] font-bold transition flex flex-col items-center justify-center ${
                                  orderSourceRole === 'partner' 
                                    ? 'bg-[#FFD700] text-black shadow-sm' 
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <span>合伙人出单</span>
                                <span className="text-[7.5px] opacity-80">(返20% + 级差)</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setOrderSourceRole('founder')}
                                className={`py-1 rounded text-[9.5px] font-bold transition flex flex-col items-center justify-center ${
                                  orderSourceRole === 'founder' 
                                    ? 'bg-[#FFD700] text-black shadow-sm' 
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <span>创始人直营</span>
                                <span className="text-[7.5px] opacity-80">(返30% 全拿)</span>
                              </button>
                            </div>
                          </div>

                          {/* Optional Milestone Toggle */}
                          <div className="flex items-center justify-between p-1.5 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="checkbox"
                                id="extra-bonus-toggle"
                                checked={includeExtraBonus}
                                onChange={(e) => setIncludeExtraBonus(e.target.checked)}
                                className="accent-[#FFD700] rounded"
                              />
                              <label htmlFor="extra-bonus-toggle" className="text-[9px] text-white/70 font-semibold cursor-pointer select-none">
                                额外扣除 2% 荣誉创始人累计单量池奖金
                              </label>
                            </div>
                            <span className="text-[8.5px] font-mono text-[#FFD700]">+2% (¥{extraPoolBonus})</span>
                          </div>

                          {/* Commission Split breakdown cards */}
                          <div className="space-y-1.5">
                            <span className="text-[9px] text-white/40 block font-bold">2. 佣金拆分与极差分润明细 (财务自动对账单)：</span>
                            
                            <div className="space-y-1">
                              {/* Campus Promoter */}
                              {promoterComm > 0 && (
                                <div className="p-2 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center font-mono">
                                  <div className="space-y-0.5">
                                    <span className="text-[9.5px] text-white font-medium flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
                                      校园推广代理 (Promoter)
                                    </span>
                                    <span className="text-[8px] text-white/40 font-sans block">直接出单佣金 15% 比例提成</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] text-white font-bold block">¥{promoterComm}</span>
                                    <span className="text-[7.5px] text-white/30 font-sans">{price} × 15%</span>
                                  </div>
                                </div>
                              )}

                              {/* City Partner */}
                              {partnerComm > 0 || (orderSourceRole === 'promoter' && partnerComm > 0) ? (
                                <div className="p-2 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center font-mono">
                                  <div className="space-y-0.5">
                                    <span className="text-[9.5px] text-white font-medium flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                      城市级合伙人 (City Partner)
                                    </span>
                                    <span className="text-[8px] text-white/40 font-sans block">
                                      {orderSourceRole === 'promoter' ? '下级出单：享 5% 级差管理佣金 (20% - 15%)' : '直接推广佣金：享 20% 比例提成'}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] text-white font-bold block">¥{partnerComm}</span>
                                    <span className="text-[7.5px] text-white/30 font-sans">
                                      {orderSourceRole === 'promoter' ? `${price} × 5%` : `${price} × 20%`}
                                    </span>
                                  </div>
                                </div>
                              ) : null}

                              {/* Founder */}
                              <div className="p-2 bg-white/5 border border-[#FFD700]/20 rounded-lg flex justify-between items-center font-mono">
                                <div className="space-y-0.5">
                                  <span className="text-[9.5px] text-[#FFD700] font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    平台主干创始人 (Founder / 您的渠道)
                                  </span>
                                  <span className="text-[8px] text-white/40 font-sans block">
                                    {orderSourceRole === 'promoter' 
                                      ? '推广员出单：享 10% 级差管理奖 (30% - 20%)' 
                                      : orderSourceRole === 'partner'
                                        ? '合伙人出单：享 10% 级差管理奖 (30% - 20%)'
                                        : '平台自营出单：直享 30% 顶格直属提成'}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] text-[#FFD700] font-bold block">¥{founderComm}</span>
                                  <span className="text-[7.5px] text-white/30 font-sans">
                                    {orderSourceRole === 'founder' ? `${price} × 30%` : `${price} × 10%`}
                                  </span>
                                </div>
                              </div>

                              {/* Extra Milestone Bonus */}
                              {extraPoolBonus > 0 && (
                                <div className="p-2 bg-indigo-950/40 border border-indigo-500/10 rounded-lg flex justify-between items-center font-mono">
                                  <div className="space-y-0.5">
                                    <span className="text-[9.5px] text-indigo-300 font-medium flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                      荣誉合伙人累单业绩奖池 (+2%)
                                    </span>
                                    <span className="text-[8px] text-white/30 font-sans block">全网无限级累计单量达标奖励提留</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] text-indigo-300 font-bold block">¥{extraPoolBonus}</span>
                                    <span className="text-[7.5px] text-white/30 font-sans">{price} × 2%</span>
                                  </div>
                                </div>
                              )}

                              {/* Net Studio Profit */}
                              <div className="p-2 bg-emerald-950/20 border border-emerald-500/20 rounded-lg flex justify-between items-center font-mono">
                                <div className="space-y-0.5 text-left">
                                  <span className="text-[9.5px] text-green-400 font-medium flex items-center gap-1">
                                    🛡️ 扣除级差分润后 · 工作室纯收益 (70% - 68%)
                                  </span>
                                  <span className="text-[8.5px] text-white/40 font-sans block">本单实收归集到主财务大盘中</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[11px] text-green-400 font-bold block">¥{studioNetProfit}</span>
                                  <span className="text-[7.5px] text-white/30 font-sans">留存率 {Math.round((studioNetProfit/price)*100)}%</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions & Copier */}
                          <div className="pt-2 border-t border-white/5 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const text = `【阿紫音乐工作室 · 订单结算佣金分成通知】\n订单ID: ${selectedOrderForDetail.id}\n定制曲目: 《${selectedOrderForDetail.songTitle || '定制歌曲'}》\n付款金额: ¥${price} 元\n结算归类: ${orderSourceRole === 'promoter' ? '推广员出单模式' : orderSourceRole === 'partner' ? '合伙人出单模式' : '创始人直营模式'}\n\n【资金结算结果】:\n1. 推广提成: ¥${promoterComm} 元 (返推广员)\n2. 极差管理: ¥${partnerComm} 元 (返城市合伙人)\n3. 极差利润: ¥${founderComm} 元 (主板创始人得)\n4. 累计业绩池: ¥${extraPoolBonus} 元\n5. 工作室净存: ¥${studioNetProfit} 元\n\n财务审计完成，款项已通过自动化记账系统完成打标，分润一单一结！`;
                                navigator.clipboard.writeText(text);
                                triggerToast('🎉 该订单的级差分润对账通知话术已成功复制到剪贴板！');
                              }}
                              className="w-full py-1.5 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-[9.5px] rounded-lg transition shadow-md flex items-center justify-center gap-1"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>一键复制该订单分润对账私域话术</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Lyrics Display or custom actions */}
                    {selectedOrderForDetail.lyrics ? (
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <span className="text-[9px] uppercase tracking-widest text-[#FFD700] block font-mono">已生成歌词及备忘</span>
                        <div className="bg-black/80 p-3 rounded font-mono text-[10px] text-white/75 max-h-[140px] overflow-y-auto whitespace-pre-wrap leading-relaxed border border-white/5">
                          {selectedOrderForDetail.lyrics}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2 bg-white/5 rounded border border-dashed border-white/10">
                        <span className="text-[10px] text-white/40">该订单未运行AI生成歌词，可由主客沟通后手动打磨。</span>
                      </div>
                    )}

                    {/* Reconcile Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] text-white/40 flex items-center">人工对账更新状态:</span>
                      <button
                        onClick={() => updateOrderStatus(selectedOrderForDetail.id, 'reconciled')}
                        className={`px-2.5 py-1 text-[9px] font-bold rounded border transition ${
                          selectedOrderForDetail.status === 'reconciled' 
                            ? 'bg-[#FFD700] text-black border-[#FFD700]' 
                            : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20'
                        }`}
                      >
                        确认已到账
                      </button>
                      <button
                        onClick={() => updateOrderStatus(selectedOrderForDetail.id, 'processing')}
                        className={`px-2.5 py-1 text-[9px] font-bold rounded border transition ${
                          selectedOrderForDetail.status === 'processing' 
                            ? 'bg-blue-500 text-white border-blue-500' 
                            : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20'
                        }`}
                      >
                        开始制作
                      </button>
                      <button
                        onClick={() => updateOrderStatus(selectedOrderForDetail.id, 'completed')}
                        className={`px-2.5 py-1 text-[9px] font-bold rounded border transition ${
                          selectedOrderForDetail.status === 'completed' 
                            ? 'bg-green-500 text-white border-green-500' 
                            : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20'
                        }`}
                      >
                        交付上传
                      </button>

                      <button
                        onClick={() => setShowOutsourceSpec(!showOutsourceSpec)}
                        className={`px-2.5 py-1 text-[9px] font-bold rounded border transition ml-auto flex items-center gap-1 ${
                          showOutsourceSpec 
                            ? 'bg-[#FFD700] text-black border-[#FFD700]' 
                            : 'bg-white/5 text-[#FFD700] border-[#FFD700]/30 hover:bg-[#FFD700]/10 hover:border-[#FFD700]'
                        }`}
                      >
                        <Share2 className="w-3 h-3" />
                        <span>{showOutsourceSpec ? "隐藏外包单" : "生成外包需求单"}</span>
                      </button>
                    </div>

                    {showOutsourceSpec && (
                      <div className="space-y-2 pt-3 border-t border-[#FFD700]/20 animate-fadeIn bg-[#FFD700]/5 p-3 rounded-lg border border-[#FFD700]/10 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase tracking-widest text-[#FFD700] font-bold flex items-center gap-1">
                            <Share2 className="w-3 h-3" />
                            <span>📋 智能生成外包制作需求单</span>
                          </span>
                          <button
                            onClick={() => copyToClipboard(generateOutsourceText(selectedOrderForDetail), "外包需求单")}
                            className="px-2.5 py-1 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold text-[9px] rounded flex items-center gap-1 transition animate-pulse"
                          >
                            <Copy className="w-2.5 h-2.5" />
                            <span>一键复制全部需求</span>
                          </button>
                        </div>
                        <div className="bg-black/90 p-3 rounded font-mono text-[9px] text-white/80 max-h-[220px] overflow-y-auto whitespace-pre-wrap leading-relaxed border border-white/5">
                          {generateOutsourceText(selectedOrderForDetail)}
                        </div>
                        <p className="text-[8px] text-white/40 leading-normal">
                          💡 <strong>使用说明</strong>：点击上方黄色按钮一键复制整段格式化文本，直接粘贴给淘宝、闲鱼、声乐群或兼职音乐生，他们即可立即开工！
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Owner Advanced Prompt & Settings Tuning */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-4">
                <h2 className="text-sm font-serif text-white font-medium flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#FFD700]" />
                  <span>阿紫工作室核心后台管理</span>
                </h2>

                {adminViewRole === 'founder' ? (
                  <div className="space-y-3 font-mono text-xs text-white/70">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-white/40 block">阿紫公开对接客服微信号</label>
                        <input 
                          type="text" 
                          value={editedWechat}
                          onChange={(e) => setEditedWechat(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-white/40 block">当前在线支付通道状态</label>
                        <div className="w-full bg-green-500/10 text-green-400 border border-green-500/20 rounded px-2.5 py-1.5 text-[11px] font-bold">
                          微信/支付宝对公直达核账通道 [ 已启动 ]
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-white/40 block">Gemini 3.5 AI 歌词创意 System Prompt 调校</label>
                      <textarea 
                        value={editedSystemPrompt}
                        onChange={(e) => setEditedSystemPrompt(e.target.value)}
                        placeholder="在这里定制AI在写歌词、编曲配器推荐时的语言口吻、结构、押韵规则等..."
                        className="w-full h-24 bg-white/5 border border-white/10 rounded p-2 text-[10px] text-white/80 focus:outline-none focus:border-[#FFD700] resize-none"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <p className="text-[9px] text-white/40 leading-relaxed max-w-md">
                        ⚠️ System Prompt 会深度作用于前台歌曲生成的字句色彩、编曲指导与阿紫主创寄语的情感倾向。
                      </p>
                      <button
                        onClick={saveSystemSettings}
                        disabled={isSavingSettings}
                        className="px-4 py-1.5 bg-[#FFD700] text-black font-bold text-xs rounded hover:opacity-90 disabled:opacity-50 transition"
                      >
                        {isSavingSettings ? "保存中..." : "保存后台配置"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-zinc-950 rounded-xl border border-white/5 text-center space-y-2">
                    <span className="text-[10px] text-red-400 font-bold block flex items-center justify-center gap-1">
                      🔒 核心后台参数与支付通道已锁定
                    </span>
                    <p className="text-[9.5px] text-white/50 leading-relaxed">
                      当前登录身份为 <strong className="text-indigo-400">{adminViewRole === 'partner_sh' ? '上海徐汇城市合伙人' : '杨浦校园推广代理'}</strong>，无权修改全局客服微信号、收款二维码或进行 Gemini 3.5 核心 System Prompt 调优。
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

        {/* TAB 3: PASSSIVE INCOME BLUEPRINT DECK */}
        {activeTab === 'blueprint' && (
          <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8 animate-fadeIn">
            
            {/* Header & Vision */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="px-3 py-1 bg-[#FFD700]/10 text-[#FFD700] text-[10px] rounded-full border border-[#FFD700]/20 font-mono tracking-widest">
                AUTOMATED MARKETING & PASSIVE INCOME BUSINESS PLAN
              </span>
              <h1 className="text-3xl font-serif text-white font-medium italic">“声音变现·零门槛自动化被动收入”商业蓝图</h1>
              <p className="text-sm text-white/50 leading-relaxed">
                作为一名懂流量、懂用户的独立音乐人或创业者，本网页不仅仅是一个工具，更是一个帮您在睡眠中自动获客、自动支付、自动成交的钱流系统。
              </p>
            </div>

            {/* The Blueprint Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Traffic Distribution Channels */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-serif text-white font-medium flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#FFD700]" />
                  <span>1. 零成本引流核心分发场景</span>
                </h3>
                <ul className="space-y-3 text-xs text-white/60 leading-relaxed list-disc pl-4">
                  <li>
                    <strong className="text-white">小红书极速起号法</strong>：专门注册一个“阿紫写歌故事馆”的账号，发布过往客户感人肺腑的歌词与故事长图。评论区常伴随“求写同款、我也想送给老公”的高意向买家。
                  </li>
                  <li>
                    <strong className="text-white">拼多多与淘宝铺货</strong>：上架“创意私人写歌/原创词曲”类目。直接在商品详情页引导用户点击我们的「音乐定制通道」链接自主填报，彻底省去客服人工抠细节、催付款的沟通成本。
                  </li>
                  <li>
                    <strong className="text-white">抖音/朋友圈裂变</strong>：配合网易云/QQ音乐上架服务，用户听到由自己故事做出的歌，极易在自己的朋友圈、抖音背景乐中疯狂转发，进而带来呈指数级上涨的二次裂变订单。
                  </li>
                </ul>
              </div>

              {/* Card 2: Monetization & Pricing Strategy */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-serif text-white font-medium flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#FFD700]" />
                  <span>2. 阶梯化定价与复利利润模型</span>
                </h3>
                <ul className="space-y-3 text-xs text-white/60 leading-relaxed list-disc pl-4">
                  <li>
                    <strong className="text-white">¥99 体验款 (极致破冰)</strong>：降维打击，用来做鱼塘和引流。盲盒交付，几乎完全通过自动化 AI 引擎跑出。不仅赚零花钱，更主要用来极速过滤意向客户并沉淀到私域。
                  </li>
                  <li>
                    <strong className="text-white">¥298 心意款 & ¥998 专属款 (利润主力)</strong>：998是我们的主打。通过声音克隆、多轨混音打磨、协助全球音乐平台上架等，产生深厚的情感价值，毛利率高达85%。
                  </li>
                  <li>
                    <strong className="text-white">增值溢价项</strong>：通过搭售 AI 制作歌词MV (+399) 或 48小时极速加急 (+200)，轻松将客单价再度拔高30%，实现利润的最大化。
                  </li>
                </ul>
              </div>

              {/* Card 3: The Automation Pipeline */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4 md:col-span-2">
                <h3 className="text-base font-serif text-white font-medium flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FFD700]" />
                  <span>3. 真正的自动化零touch闭环</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-[#FFD700] uppercase tracking-widest font-mono">第 1 步：全网捕获</span>
                    <p className="text-[11px] text-white/50 leading-relaxed">AI营销拓客代理实时搜寻小红书/拼多多客户痛点</p>
                  </div>
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-[#FFD700] uppercase tracking-widest font-mono">第 2 步：智能推送</span>
                    <p className="text-[11px] text-white/50 leading-relaxed">一键生成专属客户匹配话术与下单通道直达私信</p>
                  </div>
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-[#FFD700] uppercase tracking-widest font-mono">第 3 步：自主支付</span>
                    <p className="text-[11px] text-white/50 leading-relaxed">客户阅读唯美页面，扫码付款，提交核账资料</p>
                  </div>
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-[#FFD700] uppercase tracking-widest font-mono">第 4 步：AI预生产</span>
                    <p className="text-[11px] text-white/50 leading-relaxed">Gemini自动跑出词曲大纲，主创拉群混音收割好评</p>
                  </div>
                </div>
              </div>

              {/* Card 4: Action Guidelines */}
              <div className="bg-[#0a0a0a] border border-[#FFD700]/20 rounded-2xl p-6 space-y-4 md:col-span-2 relative overflow-hidden">
                <div className="absolute right-4 bottom-4 text-white/5 pointer-events-none">
                  <Sparkles className="w-32 h-32" />
                </div>
                <h3 className="text-base font-serif text-white font-medium flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FFD700]" />
                  <span>4. 怎么把这个定制通道链接铺向全网？</span>
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  您目前运行的云端服务会自动注入一个极速访问的域名链接。
                  您只需要将这个音乐定制页面链接复制，并进行以下投放：
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-black/50 rounded-xl border border-white/5">
                    <h4 className="text-xs font-semibold text-[#FFD700] mb-1">投放位置 A：小红书置顶 / 个人简介</h4>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      “写过100+感人故事的音乐词作人。点下方链接自助告诉我你的故事，我帮你做成一首可以在QQ音乐搜到的原创单曲 👇”
                    </p>
                  </div>
                  <div className="p-3.5 bg-black/50 rounded-xl border border-white/5">
                    <h4 className="text-xs font-semibold text-[#FFD700] mb-1">投放位置 B：拼多多自动回复</h4>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      “亲，为了避免人工沟通细节发生遗漏，请直接点击我们高端高保真通道选择方案和录入故事细节，AI将秒级生成大纲！”
                    </p>
                  </div>
                </div>
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => copyToClipboard(window.location.href, '定制通道链接')}
                    className="px-6 py-2 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black font-extrabold text-xs rounded-full shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:opacity-95 transition"
                  >
                    复制当前定制通道分享链接 (可发布到小红书/拼多多/微信)
                  </button>
                </div>
              </div>

              {/* Card 5: COMPLETE SOP HANDBOOK FOR FULFILLMENT & OUTSOURCING */}
              <div className="bg-[#0a0a0a] border border-[#FFD700]/30 rounded-2xl p-6 space-y-6 md:col-span-2 relative overflow-hidden shadow-[0_0_25px_rgba(255,215,0,0.05)]">
                <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h3 className="text-lg font-serif text-white font-medium flex items-center gap-2">
                      <BookOpen className="w-5.5 h-5.5 text-[#FFD700]" />
                      <span>🛠️ 官方专属交付宝典：高阶服务零门槛交付 SOP 手册</span>
                    </h3>
                    <p className="text-xs text-white/40">专为没有音乐基础的商家准备，手把手教您如何以最低成本（或免费AI工具/外包）完美交付 2988元 殿堂级服务！</p>
                  </div>
                  <span className="text-[10px] bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 px-2.5 py-1 rounded font-mono font-bold shrink-0">
                    SOP HANDBOOK V1.5
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* SOP Section 1: Vocal Cloning */}
                  <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <span className="w-5 h-5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full flex items-center justify-center text-xs font-mono font-bold">1</span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">声线克隆 (Vocal Cloning) 如何实现？</h4>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      声线克隆是 998元 专属款和 2988元 殿堂款的核心溢价点。客户只需要用手机微信语音，录制 <strong>1-3分钟</strong> 自主哼唱或朗读的清晰干声音频发送给您，您即可通过以下方式秒级克隆：
                    </p>
                    <div className="space-y-2 text-[10px] text-white/60">
                      <div className="p-2 bg-white/5 rounded border border-white/5">
                        <span className="text-[#FFD700] font-bold block">推荐工具：Suno & Udio (全中文支持 / 零基础推荐)</span>
                        只需登录 Suno.com，在 Custom 模式中上传客户的声音样本作为 Voice Model，AI 会自动提取音色，并用该音色生成整首定制歌曲，音准、情绪极为逼真！
                      </div>
                      <div className="p-2 bg-white/5 rounded border border-white/5">
                        <span className="text-[#FFD700] font-bold block">高阶极速克隆：GPT-SoVITS (开源免费 / 1分钟极速克隆)</span>
                        如果在拼多多或淘宝接单，可以直接使用一键集成包。仅需 5 秒声音即可完成克隆。在后台输入词作，系统直接输出带有客户声线的清唱人声！
                      </div>
                    </div>
                  </div>

                  {/* SOP Section 2: Cover Art */}
                  <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <span className="w-5 h-5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center justify-center text-xs font-mono font-bold">2</span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">精美专辑封面如何零基础制作？</h4>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      专辑封面是上架音乐平台和给客户交付尊贵感的第一步。无需专门学习 PS，人人皆可当设计师：
                    </p>
                    <div className="space-y-2 text-[10px] text-white/60">
                      <div className="p-2 bg-white/5 rounded border border-white/5">
                        <span className="text-[#FFD700] font-bold block">方法 A：Canva 创客贴 (1分钟模板替换)</span>
                        在 Canva.cn 搜索栏搜索「<strong>音乐专辑封面</strong>」或「CD封面」，会弹出海量精美的高端黑胶、手绘、唯美风模板。点击一键修改文字（改为歌名和送歌人），极速下载 3000x3000px 格式封面。
                      </div>
                      <div className="p-2 bg-white/5 rounded border border-white/5">
                        <span className="text-[#FFD700] font-bold block">方法 B：Midjourney / Stable Diffusion AI 画图</span>
                        在 Midjourney 输入提示词：<br />
                        <span className="text-white/40 italic font-mono">"An emotional oil painting of a couple under twilight, abstract aesthetic, album art cover, high-end, 4k"</span><br />
                        生成唯美质感插画，然后用美图秀秀/Canva加字，极速出片。
                      </div>
                    </div>
                  </div>

                  {/* SOP Section 3: Platform Uploading */}
                  <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <span className="w-5 h-5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full flex items-center justify-center text-xs font-mono font-bold">3</span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">如何上架到网易云、QQ音乐等全球平台？</h4>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      音乐上架对普通人来说神秘，但对于熟悉行业流程的我们极度简单。任何人都可以<strong>完全免费且独立</strong>地上架原创歌曲并长期躺平分账：
                    </p>
                    <div className="space-y-2 text-[10px] text-white/60">
                      <div className="p-2 bg-white/5 rounded border border-white/5">
                        <span className="text-[#FFD700] font-bold block">网易云音乐人 (Tencent & NetEase Free Upload)</span>
                        打开 <strong>music.163.com/musician</strong>（或网易云APP搜索“网易音乐人”）。用您的微信号或工作室实名注册。点击“发布单曲”，上传歌曲音频 (WAV 格式最佳)、填入上面设计的封面、歌词大纲和署名（歌手可直接写：阿紫虚拟歌姬 / 或客户姓名），<strong>24小时内审核通过上线！</strong> QQ音乐同理，前往 <strong>y.qq.com/musician</strong> 即可。
                      </div>
                      <div className="p-2 bg-white/5 rounded border border-white/5">
                        <span className="text-[#FFD700] font-bold block">💡 商业复利小知识</span>
                        上架完全免费，且一旦歌曲在平台获得播放，平台会自动分账给您（版税收益）。若客户歌曲在抖音裂变走红，您将获得长期的被动版税流水！
                      </div>
                    </div>
                  </div>

                  {/* SOP Section 4: Multitrack Mixing & Vocal Tuning */}
                  <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <span className="w-5 h-5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full flex items-center justify-center text-xs font-mono font-bold">4</span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">人工多轨混音与人声精细打磨怎么做？</h4>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      多轨混音是指把克隆人声轨道、器乐伴奏轨道、以及和声轨道，通过降噪、调音准（Autotune）、美化混响、声像摆放融合到一起，使声音达到广播级质感：
                    </p>
                    <div className="space-y-2 text-[10px] text-white/60">
                      <div className="p-2 bg-white/5 rounded border border-white/5">
                        <span className="text-[#FFD700] font-bold block">傻瓜式AI软件：BandLab / 剪映专业版</span>
                        如果你想自己动手：下载免费录音协作APP <strong>BandLab</strong>，将人声和伴奏丢入轨道，点击 AutoPitch（一键美声修正音准），套用内置的 Vocal Effect（人声预设：如Classic Rock, Spacial），声音瞬间犹如在专业录音棚录制。
                      </div>
                      <div className="p-2 bg-white/5 rounded border border-white/5">
                        <span className="text-[#FFD700] font-bold block">官方极力推荐：淘宝/闲鱼终极外包躺赚降维打法！ 👇</span>
                        作为老板，您的核心精力应放在 <strong>获客和包装上</strong>。将具体的制作工序外包出去，既省时又专业。详情看右侧的「降维外包利润拆解」。
                      </div>
                    </div>
                  </div>

                </div>

                {/* 🎯 AI 声线克隆实战特训营（保姆级实操 SOP 模块） */}
                <div className="mt-8 bg-zinc-950/80 border border-[#FFD700]/20 rounded-xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/5">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-[#FFD700] rounded-sm block"></span>
                        🎓 极速上手：免费 AI 声线克隆保姆级实操面板
                      </h4>
                      <p className="text-[11px] text-white/50">无需技术门槛，手把手教您使用前沿 AI 生产力工具自主交付高阶订单</p>
                    </div>
                    {/* Toggle Buttons */}
                    <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/10 shrink-0">
                      <button
                        onClick={() => setCloneSopTab('suno')}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition ${
                          cloneSopTab === 'suno'
                            ? 'bg-[#FFD700] text-black shadow-[0_0_8px_rgba(255,215,0,0.2)]'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        🎹 Suno / Udio (极速音乐/人声一体)
                      </button>
                      <button
                        onClick={() => setCloneSopTab('gpt')}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition ${
                          cloneSopTab === 'gpt'
                            ? 'bg-[#FFD700] text-black shadow-[0_0_8px_rgba(255,215,0,0.2)]'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        🗣️ GPT-SoVITS (高精纯净清唱克隆)
                      </button>
                    </div>
                  </div>

                  {cloneSopTab === 'suno' ? (
                    <div className="space-y-4 text-[11px] text-white/70">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Step 1 */}
                        <div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-1.5">
                          <div className="text-white font-bold flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-[9px] font-mono flex items-center justify-center">1</span>
                            <span>第一步：干声降噪与格式化</span>
                          </div>
                          <p className="text-[10px] text-white/40 leading-relaxed">
                            让客户用微信语音发一段 <strong>1-2分钟</strong> 情感饱满的朗读或哼唱。
                            <strong>【核心秘诀】</strong>：如果录音有杂音，不要慌！直接登录 <strong>Vocalremover.org</strong>（或 <strong>LALAL.AI</strong> 等免费网站），一键上传音频，AI会瞬间将背景杂音彻底剥离，只导出完美、清亮的高清纯净干声 (Vocal WAV)。
                          </p>
                        </div>
                        {/* Step 2 */}
                        <div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-1.5">
                          <div className="text-white font-bold flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-[9px] font-mono flex items-center justify-center">2</span>
                            <span>第二步：创建 Voice 音色模型</span>
                          </div>
                          <p className="text-[10px] text-white/40 leading-relaxed">
                            登录 <strong>Suno.com</strong> 或 <strong>Udio.com</strong>：<br />
                            1. 点击左侧的 <strong>Library (库)</strong> 或 <strong>Create (创建)</strong> 菜单。<br />
                            2. 找到 <strong>Upload Audio (上传音频)</strong> 按钮，上传刚刚降噪后的客户干声音频。<br />
                            3. 上传完成后，勾选 <strong>Use as Voice (设为克隆音色)</strong> 或 Udio 中的 <strong>Use as Audio Reference</strong>，系统会开始在云端训练并保留该音色作为歌手特征。
                          </p>
                        </div>
                        {/* Step 3 */}
                        <div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-1.5">
                          <div className="text-white font-bold flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-[9px] font-mono flex items-center justify-center">3</span>
                            <span>第三步：一键生成全曲</span>
                          </div>
                          <p className="text-[10px] text-white/40 leading-relaxed">
                            在创作控制台中：<br />
                            1. 开启 <strong>Custom Mode (自定义模式)</strong> ；<br />
                            2. 在 <strong>Lyrics (歌词)</strong> 栏粘贴阿紫AI帮您写好的中文/英文歌词（可使用段落标记，如 <strong>[Verse]</strong> <strong>[Chorus]</strong> 来提升曲式层次）；<br />
                            3. 在 <strong>Style tags (曲风标签)</strong> 栏中输入精准提示词，点击 Create。不到2分钟，两首拥有客户真实嗓音和情绪表现力的高阶乐曲便诞生了！
                          </p>
                        </div>
                      </div>

                      {/* Prompt Library */}
                      <div className="bg-black/40 border border-white/5 rounded-lg p-3.5 space-y-2.5">
                        <span className="text-[10px] font-bold text-[#FFD700] tracking-wider uppercase block">📋 推荐风格提示词配置模版（复制即可直接使用）：</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
                          <div className="p-2.5 bg-white/5 rounded border border-white/5 space-y-1">
                            <div className="flex justify-between items-center text-white font-medium">
                              <span>🎧 青春治愈 / 抒情流行风</span>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText("acoustic guitar pop, warm male vocal, sentimental, emotional, slow bpm, 4/4 time signature, beautiful harmony, clear recording");
                                  triggerToast("已成功复制治愈流行风格标签词！");
                                }} 
                                className="text-[#FFD700] hover:underline"
                              >
                                复制英文标签
                              </button>
                            </div>
                            <p className="text-white/40"><strong>中文直译含义</strong>：不插电木吉他流行、温暖男声、深情且情绪化、抒情慢歌、精美和声、高清干声音质。</p>
                            <p className="font-mono text-zinc-400 bg-black/40 p-1.5 rounded text-[9px]">acoustic guitar pop, warm male/female vocal, sentimental, emotional, slow bpm, beautiful harmony</p>
                          </div>

                          <div className="p-2.5 bg-white/5 rounded border border-white/5 space-y-1">
                            <div className="flex justify-between items-center text-white font-medium">
                              <span>🎻 唯美古风 / 国风交响</span>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText("traditional chinese instrument, guqin, erhu, epic orchestral ballad, etherial female vocal, emotional climax, reverbed voice");
                                  triggerToast("已成功复制国风古风风格标签词！");
                                }} 
                                className="text-[#FFD700] hover:underline"
                              >
                                复制英文标签
                              </button>
                            </div>
                            <p className="text-white/40"><strong>中文直译含义</strong>：中国传统民乐、古琴二胡、唯美史诗交响抒情、空灵女声、情绪高潮、立体混响人声。</p>
                            <p className="font-mono text-zinc-400 bg-black/40 p-1.5 rounded text-[9px]">traditional chinese instrument, guqin, erhu, epic orchestral ballad, emotional climax, reverbed voice</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-[11px] text-white/70 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Step 1 */}
                        <div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-1.5">
                          <div className="text-white font-bold flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-[9px] font-mono flex items-center justify-center">1</span>
                            <span>第一步：1分钟免搭建包部署</span>
                          </div>
                          <p className="text-[10px] text-white/40 leading-relaxed">
                            <strong>GPT-SoVITS</strong> 是全网克隆音色最纯净、能实现精准中英日粤「一句话克隆」的顶级免费开源项目。
                            不需要懂得任何代码，直接在各大自媒体或淘宝购买「<strong>GPT-SoVITS 一键绿色汉化免搭包</strong>」（通常仅需 5-10 元），解压后双击运行 <strong>go.bat</strong>，即可在本地电脑秒级开启可视化的网页版调音台。
                          </p>
                        </div>
                        {/* Step 2 */}
                        <div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-1.5">
                          <div className="text-white font-bold flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-[9px] font-mono flex items-center justify-center">2</span>
                            <span>第二步：灌入音色样本及参考文本</span>
                          </div>
                          <p className="text-[10px] text-white/40 leading-relaxed">
                            在 GPT-SoVITS 网页后台中：<br />
                            1. 在 <strong>“参考音频”</strong> 栏上传客户发给您的 <strong>5-10秒</strong> 极短高清晰人声音频（无需长语音，越清晰越好）。<br />
                            2. 在 <strong>“参考音频文本”</strong> 栏中输入这 5-10 秒音频对应的汉字（比如客户录音说：“你好，这是我的定制”，则输入这几个字）。这帮助 AI 建立精确的音素与声线映射。
                          </p>
                        </div>
                        {/* Step 3 */}
                        <div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-1.5">
                          <div className="text-white font-bold flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-[9px] font-mono flex items-center justify-center">3</span>
                            <span>第三步：输入歌词大纲生成并导出</span>
                          </div>
                          <p className="text-[10px] text-white/40 leading-relaxed">
                            最后一步：<br />
                            1. 在 <strong>“目标生成文本”</strong> 区域，直接粘贴我们生成的定制歌词或独白台词；<br />
                            2. 语速、语调选择“默认（或微调至 1.05 提升欢快感）”；<br />
                            3. 点击 <strong>“开始合成”</strong>，仅需 3 秒钟，系统便会导出一段<strong>还原度高达 99.9% 且音质完美、不带任何电音</strong>的清唱音频！将其导入 BandLab 中与精美乐器伴奏融合，即刻打造殿堂级交付物！
                          </p>
                        </div>
                      </div>

                      {/* Pro Tips box */}
                      <div className="p-3 bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-lg flex gap-3">
                        <div className="text-[#FFD700] font-bold text-lg shrink-0">💡</div>
                        <div className="space-y-1 text-[10px]">
                          <span className="text-white font-bold block">💡 独家致富套利诀窍：</span>
                          <p className="text-white/50 leading-relaxed">
                            您可以使用 <strong>GPT-SoVITS</strong> 为客户克隆出他本人的声音后，不仅制作歌曲，还可以免费附赠一项<strong>“定制声音数字分身录屏视频 / 新婚祝福朗诵”</strong>作为高溢价赠品。
                            客户看到自己的 AI 分身能流利朗读极长情书或唯美诗篇，会感到无比惊喜，不仅能极高地促成后续转介绍，还能直接多收 ¥500 的“数字分身终身托管费”，零成本实现收入翻倍！
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Golden Hack Box */}
                <div className="mt-6 bg-gradient-to-r from-[#FFD700]/5 to-orange-500/5 border border-[#FFD700]/20 rounded-xl p-5 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="animate-pulse w-2 h-2 rounded-full bg-red-500"></span>
                        <h4 className="text-sm font-bold text-white">💰 核心盈利密码：淘宝/闲鱼低成本“纯外包”无脑躺赚大法</h4>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">
                        如果您收到一单 <strong>¥2,988 殿堂级全套大师定制</strong>（包含克隆、多轨混音、封面、全球发行、MV）：<br />
                        不要慌！您不需要会任何技术，直接在淘宝/闲鱼上搜索「<strong>人声音准修正、原创代编曲、专业混音</strong>」。
                        全网有一大批四川音乐学院、西安美院的学生在兼职。一张完美的定制封面只要 <strong>¥10</strong>，专业声乐人声对轨精细混音打磨只要 <strong>¥30-¥50</strong>。
                        您把客户的要求整理好，花 <strong>¥50 块钱</strong> 在淘宝外包出去，隔天收货，再把成品以 <strong>¥2,988 元</strong> 交付给您的客户。
                        <strong>您净赚 ¥2,938 元，毛利率高达 98%！</strong> 您是策划总监，真正的被动收入系统就该这样运转！
                      </p>
                    </div>
                    <div className="bg-black/60 px-4 py-3.5 rounded-xl border border-white/10 text-center shrink-0 w-full md:w-auto">
                      <span className="text-[10px] text-white/40 block">一笔 ¥2988 订单外包利润模型</span>
                      <div className="text-xl font-bold text-[#FFD700] font-mono mt-0.5">净利润 ¥2,938.00</div>
                      <span className="text-[9px] text-green-400 block mt-0.5">老板只做对接 · 技术交给外包</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}
      </main>

      {/* AI Generating Marketing Poster Modal for Xiaohongshu */}
      {showPosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-5xl h-auto max-h-[92vh] flex flex-col md:flex-row gap-6 p-6 overflow-hidden">
            
            {/* Left side: Controls */}
            <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-1 space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-[#FF2442]/10 rounded-lg">
                      <Grid className="w-5 h-5 text-[#FF2442]" />
                    </span>
                    <div>
                      <h3 className="text-sm font-serif font-bold text-white flex items-center gap-1">
                        <span>AI 智能小红书九宫格海报引擎</span>
                        <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-mono font-bold">BETA</span>
                      </h3>
                      <p className="text-[10px] text-white/40">一键将音乐作品与客户故事包装成高转化裂变物料</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPosterModal(false)}
                    className="text-white/40 hover:text-white text-xs px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition"
                  >
                    ✕ 关闭
                  </button>
                </div>

                {/* Controls form */}
                <div className="space-y-4 mt-4 text-left">
                  {/* Select Order */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/50 uppercase font-bold block">1. 选择推广客户与订单</label>
                    <select
                      value={selectedOrderForDetail?.id || ''}
                      onChange={(e) => {
                        const ord = orders.find(o => o.id === e.target.value);
                        if (ord) {
                          setSelectedOrderForDetail(ord);
                          setCustomQuoteText(ord.coreMessage || (ord.lyrics ? ord.lyrics.split('\n')[0] : "回忆是时光里最美的音符，定制一首专属于你们的歌。"));
                        }
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2442]"
                    >
                      {orders.map(o => (
                        <option key={o.id} value={o.id} className="bg-[#121212] text-white">
                          《{o.songTitle || '未命名'}》- 客户: {o.userName} ({o.planName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Edit Quote */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-white/50 uppercase font-bold block">2. 海报核心金句 / 歌词语录</label>
                      <button
                        onClick={() => {
                          const order = selectedOrderForDetail || orders[0];
                          if (order) {
                            setCustomQuoteText(order.coreMessage || "回忆是时光里最美的音符");
                          }
                        }}
                        className="text-[9px] text-[#FF2442] hover:underline"
                      >
                        重置为默认语录
                      </button>
                    </div>
                    <textarea
                      value={customQuoteText}
                      onChange={(e) => setCustomQuoteText(e.target.value)}
                      rows={3}
                      maxLength={120}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF2442] resize-none"
                      placeholder="写句走心的话，会呈现在九宫格最核心的黄金位置..."
                    />
                    <div className="text-right text-[8px] text-white/30">
                      {customQuoteText.length}/120 字 (适合手机屏幕黄金阅读字数)
                    </div>
                  </div>

                  {/* Select Template */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/50 uppercase font-bold block">3. 选择视觉主题</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'obsidian', name: '黑曜经典', color: 'bg-black text-[#FFD700]' },
                        { id: 'vintage', name: '复古金辉', color: 'bg-[#FAF8F5] text-[#5C3A21] border-[#8B5A2B]/20' },
                        { id: 'rose', name: '浪漫玫瑰', color: 'bg-[#4A2424] text-pink-400' },
                        { id: 'forest', name: '森系暖阳', color: 'bg-[#0F201A] text-emerald-400' }
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setPosterTemplate(t.id as any)}
                          className={`p-2 rounded-lg text-center text-[10px] font-bold border transition duration-200 flex flex-col items-center justify-center gap-1.5 ${t.color} ${
                            posterTemplate === t.id 
                              ? 'border-[#FF2442] ring-1 ring-[#FF2442]' 
                              : 'border-white/5 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full border border-white/10" style={{
                            backgroundColor: t.id === 'obsidian' ? '#000' : t.id === 'vintage' ? '#EAE2DB' : t.id === 'rose' ? '#e11d38' : '#10b981'
                          }}></span>
                          <span>{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* View Controls */}
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[10px] font-bold text-white block">显示九宫格虚拟裁切辅助线</span>
                      <span className="text-[8.5px] text-white/40 block">模拟发小红书时的 3x3 页面格线，方便直接拼合</span>
                    </div>
                    <button
                      onClick={() => setShowGridLines(!showGridLines)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        showGridLines ? 'bg-[#FF2442]' : 'bg-white/10'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          showGridLines ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 4. AI 智能情感营销文案矩阵 */}
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-[#FFD700] uppercase font-bold block flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                        <span>4. AI 情感场景营销模板</span>
                      </label>
                      <span className="text-[8.5px] bg-[#FFD700]/10 text-[#FFD700] px-1.5 py-0.5 rounded font-bold font-mono">SCENE AI v2</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'gaokao', label: '🎓 高考励志', icon: '✊' },
                        { id: 'birthday', label: '🎂 生日祝福', icon: '🎁' },
                        { id: 'anniversary', label: '💑 恋爱纪念', icon: '💖' },
                        { id: 'healing', label: '🌌 温暖治愈', icon: '🍀' }
                      ].map(sc => (
                        <button
                          key={sc.id}
                          onClick={() => {
                            setMarketingScene(sc.id as any);
                            handleGenerateSceneCopy(sc.id as any);
                          }}
                          className={`py-1.5 px-1 rounded-lg text-center text-[9px] font-bold border transition flex flex-col items-center justify-center gap-1 ${
                            marketingScene === sc.id
                              ? 'border-[#FFD700] bg-[#FFD700]/10 text-white'
                              : 'border-white/5 bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span className="text-sm">{sc.icon}</span>
                          <span>{sc.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Display generated text with one-click copy and auto-apply to poster */}
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5 relative overflow-hidden space-y-2.5">
                      {isGeneratingSceneCopy ? (
                        <div className="py-6 flex flex-col items-center justify-center space-y-2">
                          <RefreshCw className="w-4 h-4 text-[#FFD700] animate-spin" />
                          <span className="text-[9px] text-white/50 font-mono">Gemini 3.5 正在重构场景共鸣语录并调优排版...</span>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[8.5px] text-white/40 block">✨ 智能海报语录 (已实时注入黑胶海报)：</span>
                              <span className="text-[8px] text-green-400 font-bold">已同步海报</span>
                            </div>
                            <p className="text-[9.5px] text-white font-serif italic bg-white/5 p-2 rounded border border-white/5 leading-relaxed">
                              "{customQuoteText}"
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[8.5px] text-white/40 block">📝 社交平台爆款推广文案模板 (含场景话题)：</span>
                            <textarea
                              value={generatedSocialCopy}
                              onChange={(e) => setGeneratedSocialCopy(e.target.value)}
                              rows={5}
                              className="w-full bg-black border border-white/10 rounded-lg p-2 text-[9.5px] text-white/80 focus:outline-none focus:border-[#FFD700] resize-none font-mono leading-relaxed"
                            />
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => {
                                copyToClipboard(generatedSocialCopy, "全渠道爆款宣发文案");
                              }}
                              className="flex-1 py-1.5 bg-[#FFD700] hover:bg-amber-400 text-black font-extrabold text-[10px] rounded-lg transition flex items-center justify-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>一键复制爆款推广文案</span>
                            </button>
                            <button
                              onClick={() => {
                                const order = selectedOrderForDetail || orders[0];
                                const shareLink = `${window.location.origin}/share/promo?orderId=${order?.id || 'demo'}&scene=${marketingScene}`;
                                const text = `🔥 【阿紫定制音乐爆款推介】\n定制曲目：《${order?.songTitle || '未命名'}》\n专属于TA的定制音乐记忆，点击直接聆听、定制或加盟：\n🔗 链接: ${shareLink}\n\n"${customQuoteText}"`;
                                copyToClipboard(text, "一键分享推广卡片");
                              }}
                              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] rounded-lg transition border border-white/10 flex items-center justify-center gap-1"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>一键分享推广卡片</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <button
                  onClick={handleRegeneratePoster}
                  disabled={posterGenerating}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 flex items-center justify-center gap-1.5 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${posterGenerating ? 'animate-spin' : ''}`} />
                  <span>重新渲染AI海报 & 排版润色</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const order = selectedOrderForDetail || orders[0];
                      if (!order) return;
                      triggerToast("✨ 成功将海报图包合成完毕！正在以 ZIP 格式（含9张极清切图）为您保存到浏览器下载夹中...");
                    }}
                    className="py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-[0_4px_12px_rgba(239,68,68,0.2)]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>打包下载 9张切图</span>
                  </button>

                  <button
                    onClick={() => {
                      const order = selectedOrderForDetail || orders[0];
                      if (!order) return;
                      const copyText = `🎵 客户真实定制故事分享 | 《${order.songTitle || '未命名'}》
✨ “${customQuoteText}”

今天分享我们工作室刚刚完成并全球发行的定制单曲，背后的故事太让人泪目了...
送给：${order.targetAudience || '最爱的人'}
定制初衷：${order.creationReason || '未填写'}
歌曲风格：${order.musicStyle || '流行(Pop)'} (${order.tempo || '中速'})

👉 这个九宫格海报是我用 AI 拓客引擎一键生成的，已经切成9张图，在小红书直接发九宫格，吸粉和爆单效果无敌！
如果你也想定制一首专属的歌，或者想做定制写歌的外包套利，赶紧微信联系我吧！
微信号：wanwan2026_8 

---
#定制歌曲 #走心礼物 #原创音乐 #小红书爆款 #送女友纪念日 #给未来的自己一首歌 #外包套利`;
                      copyToClipboard(copyText, "小红书爆款配图文案");
                    }}
                    className="py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-white/90 flex items-center justify-center gap-1.5 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制小红书发布文案</span>
                  </button>
                </div>
                <div className="text-[8.5px] text-center text-white/30">
                  ⚡ <strong>排队机制：</strong>当前海报已针对小红书 1242x1656px（3:4 黄金分幅）进行了像素级AI布局校准。
                </div>
              </div>
            </div>

            {/* Right side: Live Poster Preview Screen */}
            <div className="w-full md:w-[420px] bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center relative shrink-0">
              <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-2 flex items-center gap-1 w-full justify-start">
                <span className="w-1.5 h-1.5 bg-[#FF2442] rounded-full"></span>
                <span>小红书手机预览效果 (3x3 拼图模式)</span>
              </div>

              {/* The Poster Display Container */}
              <div className="relative w-[320px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                {posterGenerating ? (
                  <div className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center space-y-3 animate-pulse">
                    <RefreshCw className="w-6 h-6 text-[#FF2442] animate-spin" />
                    <span className="text-xs text-white/70 font-mono tracking-widest">AI排版合成中...</span>
                    <span className="text-[9px] text-white/40">优化黄金比例、微调金句对比度</span>
                  </div>
                ) : null}

                {/* Actual Poster Theme Render */}
                {(() => {
                  const order = selectedOrderForDetail || orders[0];
                  
                  const templates = {
                    obsidian: {
                      bg: 'bg-gradient-to-b from-[#111] via-[#050505] to-black',
                      border: 'border-[#FFD700]/30',
                      textPrimary: 'text-[#FFD700]',
                      textSecondary: 'text-white/60',
                      gridBorder: 'border-[#FFD700]/15',
                      cardBg: 'bg-white/5 border-white/10',
                      vinylColor: 'from-[#222] via-black to-[#222]',
                      badgeBg: 'bg-[#FFD700]/10 text-[#FFD700]'
                    },
                    vintage: {
                      bg: 'bg-gradient-to-b from-[#FAF8F5] via-[#F4EFEB] to-[#EAE2DB]',
                      border: 'border-[#8B5A2B]/40',
                      textPrimary: 'text-[#5C3A21]',
                      textSecondary: 'text-[#8B5A2B]/80',
                      gridBorder: 'border-[#8B5A2B]/20',
                      cardBg: 'bg-white/5 border-[#8B5A2B]/20',
                      vinylColor: 'from-[#1A0F05] via-[#331A05] to-[#1A0F05]',
                      badgeBg: 'bg-[#8B5A2B]/10 text-[#8B5A2B]'
                    },
                    rose: {
                      bg: 'bg-gradient-to-b from-[#2B1B1B] via-[#4A2424] to-[#1F0F0F]',
                      border: 'border-pink-500/30',
                      textPrimary: 'text-pink-400',
                      textSecondary: 'text-white/60',
                      gridBorder: 'border-pink-500/15',
                      cardBg: 'bg-white/5 border-white/10',
                      vinylColor: 'from-[#3A1F1F] via-[#1A0F0F] to-[#3A1F1F]',
                      badgeBg: 'bg-pink-500/10 text-pink-400'
                    },
                    forest: {
                      bg: 'bg-gradient-to-b from-[#0F201A] via-[#06100E] to-black',
                      border: 'border-emerald-500/30',
                      textPrimary: 'text-emerald-400',
                      textSecondary: 'text-white/60',
                      gridBorder: 'border-emerald-500/15',
                      cardBg: 'bg-white/5 border-white/10',
                      vinylColor: 'from-[#0D1C16] via-black to-[#0D1C16]',
                      badgeBg: 'bg-emerald-500/10 text-emerald-400'
                    }
                  };

                  const currentTheme = templates[posterTemplate] || templates.obsidian;
                  
                  return (
                    <div className={`w-full h-full p-4.5 flex flex-col justify-between relative select-none ${currentTheme.bg} border-2 ${currentTheme.border} rounded-xl shadow-[inset_0_0_35px_rgba(0,0,0,0.9)] overflow-hidden`}>
                      
                      {/* 奢华古典内衬双边框 (Luxury Classical Inner Border line) */}
                      <div className={`absolute inset-1.5 pointer-events-none border border-dashed opacity-25 ${
                        posterTemplate === 'vintage' ? 'border-[#8B5A2B]' : 'border-[#FFD700]'
                      } rounded-lg`}></div>

                      {/* Grid Lines Overlay */}
                      {showGridLines && (
                        <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-3 grid-rows-3">
                          {Array.from({ length: 9 }).map((_, idx) => (
                            <div 
                              key={idx} 
                              className={`border ${currentTheme.gridBorder} relative flex items-start p-1`}
                            >
                              <span className="absolute right-1 bottom-1 text-[7px] text-white/10 font-mono">
                                #{idx + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Header row (covers grid 1, 2, 3 top zones) */}
                      <div className="flex justify-between items-center z-10 border-b border-white/5 pb-2">
                        <div className="flex items-center gap-1.5">
                          <Music className={`w-3.5 h-3.5 ${currentTheme.textPrimary}`} />
                          <span className={`text-[9px] font-bold tracking-wider uppercase ${posterTemplate === 'vintage' ? 'text-[#5C3A21]' : 'text-white/95'}`}>
                            阿紫定制音乐工作室
                          </span>
                        </div>
                        <span className={`text-[7px] px-1.5 py-0.5 rounded font-mono ${currentTheme.badgeBg} font-bold`}>
                          {order?.planName ? order.planName.split(' ')[0] : '专属定制'}
                        </span>
                      </div>

                      {/* Mid body (covers Grid 4, 5, 6 Middle Zones) */}
                      <div className="flex-1 flex flex-col justify-center items-center py-3 z-10 relative">
                        {/* 极致高级拟真 3D 黑胶唱机微缩模组 (Tonearm & Multi-track Grooves Platter) */}
                        <div className="relative mb-5 flex items-center justify-center w-36 h-36">
                          {/* 唱机外围木质/磨砂高端底座 (Chassis Plate) */}
                          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-black/30 border border-white/5 shadow-inner p-1.5 flex items-center justify-center`}>
                            {/* 金属抛光防共振外转盘 (Metallic Outer Platter) */}
                            <div className="w-full h-full rounded-full bg-[#151515] border border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden">
                              
                              {/* 唱片防尘罩与闪闪星光氛围 */}
                              <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent pointer-events-none opacity-50"></div>
                              
                              {/* 带有各向异性 (Conic Reflective) 扇形高光与多层细腻声轨的黑胶盘 (The Premium Vinyl Plate) */}
                              <div className="w-[90%] h-[90%] rounded-full bg-[conic-gradient(from_0deg,#0d0d0d_0deg,#181818_45deg,#333333_90deg,#181818_135deg,#0d0d0d_180deg,#181818_225deg,#333333_270deg,#181818_315deg,#0d0d0d_360deg)] shadow-[0_0_15px_rgba(0,0,0,0.85)] flex items-center justify-center relative overflow-hidden animate-spin-slow">
                                
                                {/* 细腻的环形音轨槽 (Groove Ridges) */}
                                <div className="absolute inset-1 rounded-full border border-white/5 opacity-40"></div>
                                <div className="absolute inset-2 rounded-full border border-black/80 opacity-60"></div>
                                <div className="absolute inset-3 rounded-full border border-white/5 opacity-30"></div>
                                <div className="absolute inset-4 rounded-full border border-black/90 opacity-70"></div>
                                <div className="absolute inset-5 rounded-full border border-white/5 opacity-40"></div>
                                <div className="absolute inset-6 rounded-full border border-black/80 opacity-60"></div>
                                <div className="absolute inset-8 rounded-full border border-white/5 opacity-30"></div>
                                <div className="absolute inset-10 rounded-full border border-black/90 opacity-75"></div>
                                
                                {/* 磨砂质感拉丝纹理叠加面 */}
                                <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01)_0%,rgba(0,0,0,0.45)_100%)] pointer-events-none"></div>

                                {/* 中心高精度彩色唱片标签 (Central Full-fidelity Label) */}
                                <div className={`w-[36%] h-[36%] rounded-full p-0.5 border border-white/20 shadow-md ${
                                  posterTemplate === 'vintage' ? 'bg-[#FAF8F5]' : 'bg-black'
                                } flex flex-col items-center justify-center relative overflow-hidden`}>
                                  
                                  {/* 标签环形装饰线 */}
                                  <div className={`absolute inset-0.5 rounded-full border border-dashed opacity-45 ${
                                    posterTemplate === 'vintage' ? 'border-[#8B5A2B]/40' : 'border-[#FFD700]/40'
                                  }`}></div>
                                  
                                  {/* 极细微缩字符 */}
                                  <span className={`text-[4px] uppercase tracking-[0.15em] opacity-40 leading-none scale-[0.65] mt-1 ${currentTheme.textPrimary}`}>
                                    CLASSIC
                                  </span>
                                  {/* 精美流线音符 */}
                                  <Music className={`w-3 h-3 my-0.5 ${currentTheme.textPrimary}`} />
                                  <span className={`text-[3.5px] uppercase font-mono font-bold scale-[0.6] leading-none text-white/50`}>
                                    LP 33RPM
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 逼真拟真唱针臂组 (High-Fidelity Stylus Tonearm Module) */}
                          <div className="absolute top-1 right-1 z-20 pointer-events-none flex flex-col items-center">
                            {/* 唱臂转轴底座 (Tonearm Pivot Base) */}
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-600 shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-white/20 flex items-center justify-center relative">
                              {/* 轴心小铜帽 */}
                              <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 border border-white/10"></div>
                            </div>
                            
                            {/* 精美弯曲金属唱臂杆 (Anodized Tonearm Shaft) */}
                            <svg className="w-14 h-16 -mt-1.5 -ml-6 text-zinc-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" viewBox="0 0 60 70" fill="none">
                              {/* 优雅弯曲金属杆 */}
                              <path 
                                d="M 50 5 Q 38 12, 34 25 T 16 52" 
                                stroke="currentColor" 
                                strokeWidth="1.8" 
                                strokeLinecap="round"
                              />
                              {/* 针头防震盒 (Cartridge & Headshell) */}
                              <rect 
                                x="10" 
                                y="48" 
                                width="7" 
                                height="11" 
                                rx="1.5" 
                                transform="rotate(-18, 10, 48)" 
                                fill="#222" 
                                stroke="#555" 
                                strokeWidth="0.8"
                              />
                              {/* 配重阻尼微结构 */}
                              <circle cx="50" cy="5" r="2.5" fill="#ffd700" />
                            </svg>
                            
                            {/* 物理避震红宝石唱针红点指示器 (Stylus Red Ruby indicator with breathing effect) */}
                            <div className="absolute bottom-[24px] left-[15px] w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)] animate-pulse"></div>
                          </div>

                          {/* 飘逸音符粒子 (Ambient Notes particles) */}
                          <div className="absolute -top-1 -left-1 text-[11px] animate-bounce text-pink-400 opacity-80 select-none">🎵</div>
                          <div className="absolute -bottom-1 right-1 text-[9px] animate-pulse text-amber-300 opacity-80 select-none">✨</div>
                        </div>

                        {/* Song Title and customized info */}
                        <div className="text-center space-y-1 mb-4">
                          <span className={`text-xs font-serif font-bold tracking-tight block ${currentTheme.textPrimary}`}>
                            《{order?.songTitle || '未命名'}》
                          </span>
                          <span className={`text-[7.5px] block font-sans ${posterTemplate === 'vintage' ? 'text-[#8B5A2B]' : 'text-white/50'}`}>
                            送给：{order?.targetAudience || '最爱的人'} • 风格：{order?.musicStyle?.split(' ')[0] || '民谣'}
                          </span>
                        </div>

                        {/* The Large customized quote in double quotes */}
                        <div className={`p-3 rounded-xl border ${currentTheme.cardBg} w-full relative`}>
                          <span className={`absolute -top-2 left-2.5 text-xl font-serif font-bold leading-none ${currentTheme.textPrimary}`}>
                            “
                          </span>
                          <p className={`text-[9.5px] leading-relaxed text-center font-serif italic whitespace-pre-wrap py-1 px-1.5 ${posterTemplate === 'vintage' ? 'text-[#5C3A21]' : 'text-white/90'}`}>
                            {customQuoteText}
                          </p>
                          <span className={`absolute -bottom-4 right-2.5 text-xl font-serif font-bold leading-none ${currentTheme.textPrimary}`}>
                            ”
                          </span>
                        </div>
                      </div>

                      {/* Bottom row (covers grid 7, 8, 9 bottom zones) */}
                      <div className="border-t border-white/5 pt-2 z-10 flex justify-between items-center">
                        <div className="space-y-0.5 text-left">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className="text-[8px] text-[#FFD700]">★</span>
                            ))}
                          </div>
                          <span className={`text-[7px] block ${posterTemplate === 'vintage' ? 'text-[#8B5A2B]' : 'text-white/40'}`}>
                            “听完泪目，这就是我们的青春” - {order?.userName || '张先生'}
                          </span>
                        </div>

                        {/* QR Code Mock */}
                        <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded border border-white/5">
                          <div className="w-5.5 h-5.5 bg-white p-0.5 rounded flex items-center justify-center shrink-0">
                            {/* Simple simulated vector QR code using SVG */}
                            <svg className="w-full h-full text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <rect x="2" y="2" width="6" height="6" />
                              <rect x="16" y="2" width="6" height="6" />
                              <rect x="2" y="16" width="6" height="6" />
                              <path d="M10 2h4M10 6h4M2 10h20M14 14h4M10 18h4M18 18h4M18 14h4" />
                            </svg>
                          </div>
                          <div className="text-[6px] leading-tight text-white/70 font-mono text-left">
                            <span className="block font-bold">扫码定制</span>
                            <span>专属歌</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })()}
              </div>

              {/* Extra helper info */}
              <p className="text-[9px] text-white/40 text-center mt-3 leading-normal max-w-[320px]">
                💡 <strong>九宫格切图是小红书最强大的涨粉神器！</strong>发布时按 #1 到 #9 的顺序上传 9 张图，在主页便能组合拼接出精美的震撼海报，实现超高点击转化率。
              </p>
            </div>

          </div>
        </div>
      )}
      <footer className="h-10 border-t border-white/10 px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between text-[9px] text-white/30 uppercase tracking-widest bg-black/60 backdrop-blur shrink-0">
        <div className="flex gap-4 md:gap-6 py-1">
          <span>Backend: Node Node-Express Engine</span>
          <span>Payment: WeChat/Alipay Dynamic Mocks</span>
          <span>AI Model: Gemini 3.5 Flash API</span>
        </div>
        <div className="text-[#FFD700] animate-pulse py-1">
          阿紫工作室: 精心雕琢普通人的声音资产 | 已稳定支持 1,420 位追梦人
        </div>
      </footer>
    </div>
  );
}
