import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini SDK if API key is provided
let aiClient: any = null;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (GEMINI_API_KEY && GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    aiClient = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Successfully initialized GoogleGenAI client with server key.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
  }
} else {
  console.log("No custom GEMINI_API_KEY provided in env. Server running in simulated AI mode with highly polished fallbacks.");
}

const app = express();
app.use(express.json());

// In-Memory Data Storage
interface Order {
  id: string;
  userName: string;
  targetAudience: string;
  creationReason: string;
  keyMemories: string;
  coreMessage: string;
  emotions: string;
  scenes: string;
  musicStyle: string;
  singerGender: string;
  referenceSong: string;
  language: string;
  tempo: string;
  songTitle: string;
  lyricsStyle: string;
  mustIncludeWords: string;
  mustAvoidWords: string;
  planPrice: number;
  planName: string;
  addons: Array<{ name: string; price: number }>;
  totalPrice: number;
  paymentMemo: string;
  userWechat: string;
  referralChannel: string;
  status: 'pending' | 'reconciled' | 'processing' | 'completed';
  lyrics?: string;
  melodyAdvice?: string;
  aiNotes?: string;
  createdAt: string;
}

interface Lead {
  id: string;
  platform: 'xiaohongshu' | 'douyin' | 'pinduoduo';
  username: string;
  avatarColor: string;
  commentText: string;
  matchedKeyword: string;
  postTitle?: string;
  postedTime: string;
  sentiment: 'positive' | 'neutral' | 'high_intent';
  status: 'new' | 'pitched' | 'converted';
  pitchMessage?: string;
  pushedAt?: string;
}

interface Feedback {
  id: string;
  ratingScore: number;
  comment: string;
  timestamp: string;
}

// Pre-populate with realistic orders to make the admin panel interactive and rich on boot
let orders: Order[] = [
  {
    id: "SG20260621154210982",
    userName: "张先生",
    targetAudience: "结婚十周年的妻子（林静）",
    creationReason: "纪念我们风风雨雨走过的十个年头。从一无所有的大学恋情，到如今在上海安家，有了一儿一女。想给妻子一个特别的十周年惊喜，感谢她对这个家庭的无限付出。",
    keyMemories: "大学时我们常一起吃学校门口5块钱一碗的牛肉拉面。她那时候穿一件白裙子，在自习室把半边耳机塞给我，听周杰伦的《晴天》。后来搬家搬了5次，她从来不嫌累，每次都在新家里放一盆栀子花。",
    coreMessage: "静静，谢谢你陪我从一无所有到如今万家灯火，这辈子娶到你是我最大的福气，往后余生我继续牵着你的手走下去。",
    emotions: "深情告白, 温暖治愈",
    scenes: "下雨天/屋檐/雨伞, 校园/课桌/操场",
    musicStyle: "流行(Pop) - 朗朗上口大众喜爱",
    singerGender: "温暖少年/温柔男声",
    referenceSong: "周杰伦的《晴天》风格，有些轻快的原声吉他和弦乐",
    language: "纯国语",
    tempo: "中速 - 缓和舒服",
    songTitle: "栀子花开的晴天",
    lyricsStyle: "故事叙事 - 像在讲一个连续的故事",
    mustIncludeWords: "牛肉面, 栀子花, 上海, 林静",
    mustAvoidWords: "分开, 痛苦, 吵架",
    planPrice: 998,
    planName: "进阶款 · 专属版",
    addons: [{ name: "AI精美歌词MV制作", price: 399 }],
    totalPrice: 1397,
    paymentMemo: "微信支付：昵称小张，尾号2398",
    userWechat: "zhang_jin_1992",
    referralChannel: "小红书",
    status: 'completed',
    lyrics: `[Verse 1]\n五块钱拉面的热气 模糊了自习室玻璃\n你把半边耳机 轻轻塞进我的掌心里\n《晴天》的旋律里 栀子花悄悄地开起\n那时候上海的夜 只有自行车和雨\n\n[Verse 2]\n搬了五次家的小屋 见证过多少次日出\n你总是笑着说 只要有我在就不觉得苦\n那盆栀子花 如今开在阳台最深处\n风雨打湿过的裙摆 变成了最美的礼物\n\n[Chorus]\n静静 谢谢你陪我走过这泥泞的旅途\n从一无所有 走到万家灯火的归宿\n往后余生有多长 都有我来为你挡风遮雨\n十年的栀子花开 依然像当年那样纯洁美丽\n\n[Bridge]\n时间带走了青春 却留下了最深的印记\n手心里的温热 是我们最坚固的默契\n\n[Chorus]\n静静 谢谢你陪我走过这泥泞的旅途\n从一无所有 走到万家灯火的归宿\n往后余生有多长 都有我来为你挡风遮雨\n十年的栀子花开 依然像当年那样纯洁美丽`,
    melodyAdvice: "编曲建议以清脆的原声吉他扫弦开场，营造《晴天》般的叙事感。副歌部分加入温润的大提琴与弦乐群，层层推高情感。人声选择温暖治愈、带有一点点气声的男中音，像是枕边的轻声诉说。",
    aiNotes: "主创总监阿紫已完成多轨混音，高精度精修音准，已上线网易云音乐和QQ音乐，生成精美动态MV，客户非常满意，给出了全五星好评。",
    createdAt: "2026-06-21 15:42"
  },
  {
    id: "SG20260622091544201",
    userName: "陈同学",
    targetAudience: "毕业班全体同学（高三八班）",
    creationReason: "高考结束了，大家即将各奔东西。高中的生活虽然辛苦，但是有大家的陪伴变得无比灿烂。写一首歌送给八班，希望大家顶峰相见。",
    keyMemories: "夏天闷热的教室，不停旋转的吊扇，写满高考倒计时的黑板，班主任在后门窗户的凝视。晚上一起在操场上唱歌，看漫天繁星，约定十年后再聚。",
    coreMessage: "高三八班的伙伴们，愿我们不负韶华，此去繁花似锦，再见依然是少年！",
    emotions: "励志成长, 温暖治愈",
    scenes: "校园/课桌/操场, 星空/大海/远方",
    musicStyle: "民谣(Folk) - 吉他轻弹娓娓道来",
    singerGender: "甜美少女/清澈女声",
    referenceSong: "房东的猫/朴树《那些花儿》的感觉",
    language: "纯国语",
    tempo: "慢速 - 抒情催泪",
    songTitle: "起风的夏天，八班的歌",
    lyricsStyle: "诗意唯美 - 富有韵律和象征意象",
    mustIncludeWords: "高三八班, 吊扇, 倒计时, 顶峰相见",
    mustAvoidWords: "复读, 落榜",
    planPrice: 298,
    planName: "基础款 · 心意版",
    addons: [],
    totalPrice: 298,
    paymentMemo: "支付宝：陈雨欣，单号8812",
    userWechat: "yuxin_ch_08",
    referralChannel: "朋友推荐",
    status: 'processing',
    createdAt: "2026-06-22 09:15"
  },
  {
    id: "SG20260623113055102",
    userName: "小林",
    targetAudience: "送给异地三年的男朋友（阿杰）",
    creationReason: "我们在北京和广州异地恋三年了。一共攒了上百张高铁票。下个月是他生日，也是我们相恋三周年，想写一首歌送给他，纪念这段艰辛却甜蜜的坚持。",
    keyMemories: "火车站每一次的拥抱和告别。屏幕两端的晚安，时差和天气。每次去广州他都会带我去吃桥头的那家牛杂，下雨天我们共撑一把伞，他总是把伞歪向我这一边，自己湿了半边肩膀。",
    coreMessage: "阿杰，三年的高铁票铺满了我们的青春。虽然距离很远，但我的心一直都在你身边，生日快乐，我们要一直走下去。",
    emotions: "甜蜜热恋, 温暖治愈",
    scenes: "雨天/屋檐/雨伞, 星空/大海/远方",
    musicStyle: "R&B/蓝调 - 丝滑律动情感细腻",
    singerGender: "御姐/治愈系厚实女声",
    referenceSong: "尤长靖或单依纯风格的情歌",
    language: "国语中夹杂少量英文",
    tempo: "中速 - 缓和舒服",
    songTitle: "高铁票里的晴雨天",
    lyricsStyle: "直白大话 - 大白话最真诚直接",
    mustIncludeWords: "高铁票, 北京, 广州, 歪了的雨伞",
    mustAvoidWords: "分手, 放弃",
    planPrice: 99,
    planName: "体验款 · 盲盒版",
    addons: [],
    totalPrice: 99,
    paymentMemo: "微信支付：备注小林1999",
    userWechat: "forest_jerry",
    referralChannel: "小红书",
    status: 'pending',
    createdAt: "2026-06-23 11:30"
  },
  {
    id: "SG20250621154210001",
    userName: "张先生",
    targetAudience: "恋人（林静）",
    creationReason: "恋爱九周年纪念礼物，我们刚来上海安顿下来。",
    keyMemories: "大学门口的5块钱牛肉拉面，把半边耳机塞给我的下午，自习室的栀子花香。",
    coreMessage: "静静，谢谢你陪着我，有你在的地方就是家。",
    emotions: "深情告白",
    scenes: "校园, 上海出租屋",
    musicStyle: "民谣(Folk)",
    singerGender: "温柔男声",
    referenceSong: "周杰伦的《晴天》",
    language: "纯国语",
    tempo: "中速",
    songTitle: "那年栀子花开",
    lyricsStyle: "故事叙事",
    mustIncludeWords: "牛肉面, 栀子花",
    mustAvoidWords: "分手",
    planPrice: 298,
    planName: "基础款 · 心意版",
    addons: [],
    totalPrice: 298,
    paymentMemo: "支付宝：尾号001",
    userWechat: "zhang_jin_1992",
    referralChannel: "朋友圈",
    status: 'completed',
    lyrics: `[Verse 1]\n又是栀子花开的季节 上海的雨下个不停\n想起大学自习室的下午 你塞给我的那一半耳机\n那碗热气腾腾的牛肉面 是我们最暖的回忆\n虽然现在住着合租房 但只要有你生活就很甜蜜\n\n[Chorus]\n谢谢你 陪我来到这繁华的城市旅行\n九年的时光 每一个脚印都有你的背影\n栀子花香飘过上海的街角\n守护着属于我们的那一份坚定`,
    melodyAdvice: "清爽的古典吉他分解和弦，搭配暖洋洋的大提琴。歌手声音真诚纯粹，像老朋友在耳边诉说过去的故事。",
    aiNotes: "该订单是去年的定制（九周年恋情纪念），客户今年再次来定制十周年结婚纪念歌曲，客户忠诚度极高，属于超高价值老客复购！",
    createdAt: "2025-06-21 15:42"
  },
  {
    id: "SG20250623113055001",
    userName: "小林",
    targetAudience: "异地恋两年的男朋友（阿杰）",
    creationReason: "异地恋两周年纪念，想送一份能鼓励彼此坚持下去的歌。",
    keyMemories: "攒下的几十张北京到广州的高铁票，每一次火车站的重逢与分别，雨天歪向我这边的伞。",
    coreMessage: "阿杰，距离拉不长我们的思念，相信我们很快能在一起，两周年快乐！",
    emotions: "异地坚守",
    scenes: "火车站, 广州牛杂店",
    musicStyle: "流行情歌",
    singerGender: "治愈女声",
    referenceSong: "温暖的情歌",
    language: "纯国语",
    tempo: "中速",
    songTitle: "异地恋的第一张高铁票",
    lyricsStyle: "直白真诚",
    mustIncludeWords: "高铁票, 歪了的雨伞",
    mustAvoidWords: "放弃",
    planPrice: 99,
    planName: "体验款 · 盲盒版",
    addons: [],
    totalPrice: 99,
    paymentMemo: "微信支付：备注两周年",
    userWechat: "forest_jerry",
    referralChannel: "小红书",
    status: 'completed',
    lyrics: `[Verse 1]\n第一张高铁票的日期 躺在日记本的最底里\n北京的雪花和广州的细雨 隔着一千多公里的距离\n你总是笑着把雨伞歪向我 自己却湿透了半边外衣\n\n[Chorus]\n两周年的陪伴 隔着屏幕也觉得温暖\n相信我们终会跨过山海 迎来最美好的执手相看`,
    melodyAdvice: "轻快的钢琴铺底，副歌加入浪漫抒情的电声吉他和弦。清澈女声深情演绎，给异地恋人们带去力量。",
    aiNotes: "去年两周年异地恋定制。今年是他们三周年，并且他们即将结束异地奔现，在小红书被我们抓取到了有高意向（见线索L003），且今年又下了一单。是完美的客情跟进和周年转化案例！",
    createdAt: "2025-06-23 11:30"
  }
];

// Pre-populate with realistic social media leads
let leads: Lead[] = [
  {
    id: "L001",
    platform: "xiaohongshu",
    username: "拾光者阿猫",
    avatarColor: "from-pink-500 to-red-400",
    postTitle: "大家结婚纪念日都送了什么特别的礼物啊？",
    commentText: "求助！和老公结婚五周年了，送腻了鞋子手表，想送点能记一辈子的。听闺蜜说现在有私人订制写歌的？有做过这行的姐妹推荐下靠谱的店吗，预算一千以内。",
    matchedKeyword: "定制写歌, 结婚纪念日礼物, 预算一千",
    postedTime: "1小时前",
    sentiment: "high_intent",
    status: "new"
  },
  {
    id: "L002",
    platform: "douyin",
    username: "治愈系民谣老王",
    avatarColor: "from-blue-600 to-cyan-500",
    postTitle: "视频：吉他弹唱《写给三十岁的自己》",
    commentText: "听哭了。我今年也正好三十岁，一个人在深圳打拼。真希望也有一首属于我自己的歌，把我这些年搬过的十次家、深夜喝过的啤酒、还有丢掉的梦想都唱进去。有人能写吗？",
    matchedKeyword: "属于我自己的歌, 把我这些年唱进去",
    postedTime: "3小时前",
    sentiment: "positive",
    status: "new"
  },
  {
    id: "L003",
    platform: "xiaohongshu",
    username: "爱喝奶茶的小满",
    avatarColor: "from-purple-500 to-indigo-500",
    postTitle: "异地恋三年，终于要结束异地奔现了！",
    commentText: "下周我就要飞去他的城市定居了。结束三年的异地，好想在机场见面的时候，给他一个超级浪漫的惊喜！比如放一首专属于我们异地恋爱故事的歌，有人知道哪家工作室做得好吗？求推荐！",
    matchedKeyword: "专属于我们故事的歌, 异地恋爱",
    postedTime: "5小时前",
    sentiment: "high_intent",
    status: "new"
  },
  {
    id: "L004",
    platform: "pinduoduo",
    username: "pd_user_99812",
    avatarColor: "from-yellow-500 to-orange-500",
    postTitle: "拼多多商品：创意私人订制歌曲宝贝",
    commentText: "咨询商家：你们这个写歌能写粤语吗？我想送给暗恋的女生的。她是广州人，我们是一起在学校合唱团认识的。如果写得好，我可以直接拍千元那个档次。",
    matchedKeyword: "合唱团, 暗恋写歌, 拍千元档次",
    postedTime: "1天前",
    sentiment: "high_intent",
    status: "pitched",
    pitchMessage: "哈喽，拼多多的朋友！我们阿紫音乐内容工作室支持完美的粤语写歌。我们有专业的粤语母语词作人和歌手，为您定制独一无二的合唱团暗恋心事。您可以点击我们的专属故事通道预约哦：https://ais-dev-pnu7gkoqqrsurnue75tjuw-633275765568.us-west2.run.app"
  }
];

let feedbackList: Feedback[] = [
  { id: "F001", ratingScore: 5, comment: "流程非常顺畅，温润的红茶色调暗咖色看起来非常高级，很有工作室的匠人情怀。很喜欢这个故事填报的细节，阿紫加油！", timestamp: "2026-06-23 18:45" },
  { id: "F002", ratingScore: 5, comment: "AI生成歌词太惊艳了，写得比我自己想的还要有画面感，爱了爱了！已拍下298的心意款，期待总监帮我打磨音轨！", timestamp: "2026-06-23 20:10" }
];

// System Configurations
let systemSettings = {
  wechatId: "wanwan2026_8",
  alipayQrCodeText: "HTTPS://QR.ALIPAY.COM/MOCK_ALIPAY_RECEIVE_CODE_AZI_STUDIO",
  wechatQrCodeText: "WECHAT_MOCK_PAY_CODE_AZI_STUDIO_WANWAN",
  aiSystemPrompt: `你是一个殿堂级的中国独立音乐唱作人，艺名叫做“阿紫”。你擅长将普通人的真实经历，雕琢成极具情感共鸣、富有诗意、画面感和音乐张力的歌词。
请根据用户的问卷需求（包括称呼、送歌对象、原因、细节、画面感、曲风、音色等），为他们创作一首定制的歌曲方案。

你必须输出符合以下 JSON 格式的内容（不要有任何 markdown 标记之外的代码，也不要在 JSON 外部包裹其他文字）：
{
  "songTitle": "构思一个极具画面感和文艺气息的歌曲名字",
  "lyrics": "包含完整歌词，使用 [Verse 1], [Chorus], [Verse 2], [Bridge], [Chorus] 等格式，把用户的关键事件、栀子花、下雨天、高铁票等细节巧妙、自然、感人地融入其中。避免平铺直叙，要押韵，用诗意的意象传达最深沉的爱。歌词字数大约 300-500 字左右。",
  "melodyAdvice": "详细分析和建议该采用什么编曲配器（如木吉他、弦乐、钢琴或电子合成器），和弦走势，以及如何指导歌手去演绎（比如哪里需要气声，哪里需要高亢爆发，哪里需要娓娓道来）。",
  "aiNotes": "以主创总监“阿紫”的身份写一段极具人情味、温暖诚挚的致客户信，点评他们的故事为什么动人，以及我们工作室接下来将如何用心雕琢这一情感资产，字数在 150 字以内。"
}`
};

// 1. API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. API: Submit Client Order
app.post("/api/order/submit", (req, res) => {
  const data = req.body;
  if (!data.user_name || !data.target_audience) {
    return res.status(400).json({ error: "Missing required fields: user_name and target_audience" });
  }

  const now = new Date();
  const formatTime = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const newOrder: Order = {
    id: data.order_id || `SG${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(Math.floor(1000 + Math.random() * 9000))}`,
    userName: data.user_name,
    targetAudience: data.target_audience,
    creationReason: data.creation_reason || "未填写",
    keyMemories: data.key_memories || "未填写",
    coreMessage: data.core_message || "未填写",
    emotions: data.emotions || "温暖治愈",
    scenes: data.scenes || "生活常态",
    musicStyle: data.music_style || "流行(Pop)",
    singerGender: data.singer_gender || "温暖男声",
    referenceSong: data.reference_song || "未指定",
    language: data.language || "纯国语",
    tempo: data.tempo || "中速",
    songTitle: data.song_title || "待创作",
    lyricsStyle: data.lyrics_style || "故事叙事",
    mustIncludeWords: data.must_include_words || "",
    mustAvoidWords: data.must_avoid_words || "",
    planPrice: Number(data.order_total_price) || 998,
    planName: data.selected_plan_name || "进阶款 · 专属版",
    addons: [], // Loaded from payload if any
    totalPrice: Number(data.order_total_price) || 998,
    paymentMemo: data.payment_memo || "未备注",
    userWechat: data.user_wechat || "未填写",
    referralChannel: data.referral_channel || "直达",
    status: 'pending',
    createdAt: formatTime(now)
  };

  orders.unshift(newOrder);
  res.json({ success: true, orderId: newOrder.id, order: newOrder });
});

// 3. API: Get Orders (Admin)
app.get("/api/admin/orders", (req, res) => {
  res.json({ orders });
});

// 4. API: Update Order Status (Admin)
app.post("/api/admin/order/update-status", (req, res) => {
  const { orderId, status, lyrics, melodyAdvice, aiNotes } = req.body;
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (status) order.status = status;
  if (lyrics !== undefined) order.lyrics = lyrics;
  if (melodyAdvice !== undefined) order.melodyAdvice = melodyAdvice;
  if (aiNotes !== undefined) order.aiNotes = aiNotes;

  res.json({ success: true, order });
});

// 5. API: Delete Order (Admin)
app.delete("/api/admin/order/:id", (req, res) => {
  const { id } = req.params;
  const index = orders.findIndex(o => o.id === id);
  if (index !== -1) {
    orders.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

// 6. API: Get Social Leads (Admin)
app.get("/api/admin/leads", (req, res) => {
  res.json({ leads });
});

// 7. API: Trigger Simulated Social Web Crawl (Admin)
app.post("/api/admin/leads/crawl", (req, res) => {
  const { keyword } = req.body;
  
  // Create a realistic new lead
  const platforms: Array<'xiaohongshu' | 'douyin'> = ['xiaohongshu', 'douyin'];
  const usernames = ["晚安小徐", "桔子汽水", "南方有乔木", "风继续吹", "恋爱日记bot", "AI艺术探索家"];
  const colors = [
    "from-purple-500 to-pink-500", 
    "from-emerald-500 to-teal-500", 
    "from-blue-500 to-cyan-500", 
    "from-orange-500 to-red-500"
  ];
  const comments = [
    `想在女朋友下个月生日的时候送她一个超级难忘的定制礼物。我们以前常去鼓浪屿听海，有人能把这段经历写成一首小清新吉他民谣吗？预算500以内，写词曲都可以！`,
    `求推荐！结婚一周年想给老婆写一首《爱在周年纪念》。我们是在广州合唱团认识的，想写首温暖甜蜜的纯粤语流行歌。请问有哪家写歌工作室歌手声音好听、制作靠谱？`,
    `有没有适合毕业季送给全班的励志写歌？高考倒计时30天，想要一首能唱哭大家的毕业之歌，纪念我们一起流汗吃拉面拼搏的岁月。顶峰相见！`,
    `送异地恋男朋友的告白定制！攒了整整三年、上百张的高铁票。他经常把雨伞歪向我，想写首《歪了的雨伞》当做惊喜，希望能协助上线网易云，有做这个的工作室吗？`
  ];
  
  const randPlatform = platforms[Math.floor(Math.random() * platforms.length)];
  const randUsername = usernames[Math.floor(Math.random() * usernames.length)];
  const randColor = colors[Math.floor(Math.random() * colors.length)];
  const randComment = comments[Math.floor(Math.random() * comments.length)];
  
  const newLead: Lead = {
    id: `L${String(leads.length + 1).padStart(3, '0')}`,
    platform: randPlatform,
    username: randUsername,
    avatarColor: randColor,
    postTitle: randPlatform === 'xiaohongshu' ? "求集思广益！恋爱纪念日最特别的礼物是什么？" : "视频评论区精选：情感树洞",
    commentText: randComment,
    matchedKeyword: keyword || "定制写歌, 纪念礼物",
    postedTime: "刚刚",
    sentiment: "high_intent",
    status: "new"
  };

  leads.unshift(newLead);
  res.json({ success: true, lead: newLead, total: leads.length });
});

// 8. API: Pitch Social Lead (Admin Agent)
app.post("/api/admin/leads/pitch", (req, res) => {
  const { leadId, customMessage } = req.body;
  const lead = leads.find(l => l.id === leadId);
  if (!lead) {
    return res.status(404).json({ error: "Lead not found" });
  }

  lead.status = 'pitched';
  lead.pitchMessage = customMessage || `哈喽@${lead.username}！我们是阿紫姑娘音乐内容工作室。读到了你的心声，我们特别擅长帮你把这些闪光细节（如高铁票、歪了的雨伞、牛肉拉面）融进歌词中。你可以点击我们高保真的专属下单连接定制一首人生之歌，阿紫总监全套负责哦：${process.env.APP_URL || "https://ai.studio/build"}`;
  lead.pushedAt = new Date().toLocaleTimeString();

  // Simulate passive income: 20% chance that pitch converts to "converted" immediately!
  const roll = Math.random();
  if (roll < 0.3) {
    lead.status = 'converted';
    // Create a new order automatically based on the lead!
    const now = new Date();
    const formatTime = (d: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const isGraduation = lead.commentText.includes("毕业");
    const isAnniversary = lead.commentText.includes("周年");
    const title = isGraduation ? "风吹起的高三八班" : (isAnniversary ? "我们结婚五周年" : "雨中歪斜的温柔");

    const newOrder: Order = {
      id: `SG${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(Math.floor(1000 + Math.random() * 9000))}`,
      userName: lead.username,
      targetAudience: isGraduation ? "毕业班全体同学" : "亲爱的高铁恋人 / 结婚爱人",
      creationReason: lead.commentText,
      keyMemories: "来源于社交媒体拓客留言：" + lead.commentText.slice(0, 80) + "...",
      coreMessage: isGraduation ? "顶峰相见，不负韶华！" : "谢谢你陪我走过这几年，生日快乐/纪念日快乐。",
      emotions: "温暖治愈, 励志成长",
      scenes: "校园/课桌/操场, 雨天/屋檐/雨伞",
      musicStyle: "流行(Pop)",
      singerGender: "温暖少年/温柔男声",
      referenceSong: "民谣或抒情流行风",
      language: "纯国语",
      tempo: "中速",
      songTitle: title,
      lyricsStyle: "故事叙事",
      mustIncludeWords: "高铁票, 雨伞, 牛肉拉面",
      mustAvoidWords: "",
      planPrice: 998,
      planName: "进阶款 · 专属版",
      addons: [],
      totalPrice: 998,
      paymentMemo: "社交AI自动裂变 · 已支付对账中",
      userWechat: `${lead.username}_wechat`,
      referralChannel: lead.platform === 'xiaohongshu' ? "小红书AI获客" : "抖音AI获客",
      status: 'reconciled', // Reconciled because payment was simulated
      createdAt: formatTime(now)
    };
    orders.unshift(newOrder);
  }

  res.json({ success: true, lead });
});

// 9. API: Submit User Feedback
app.post("/api/feedback/submit", (req, res) => {
  const { rating_score, comment } = req.body;
  const newFeedback: Feedback = {
    id: `F00${feedbackList.length + 1}`,
    ratingScore: Number(rating_score) || 5,
    comment: comment || "无言的信任，默认五星好评！",
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  feedbackList.unshift(newFeedback);
  res.json({ success: true, feedback: newFeedback });
});

app.get("/api/feedback/list", (req, res) => {
  res.json({ feedback: feedbackList });
});

// 10. API: Read/Update Settings (Admin)
app.get("/api/admin/settings", (req, res) => {
  res.json({ settings: systemSettings });
});

app.post("/api/admin/settings/update", (req, res) => {
  const { wechatId, alipayQrCodeText, wechatQrCodeText, aiSystemPrompt } = req.body;
  if (wechatId) systemSettings.wechatId = wechatId;
  if (alipayQrCodeText) systemSettings.alipayQrCodeText = alipayQrCodeText;
  if (wechatQrCodeText) systemSettings.wechatQrCodeText = wechatQrCodeText;
  if (aiSystemPrompt) systemSettings.aiSystemPrompt = aiSystemPrompt;
  res.json({ success: true, settings: systemSettings });
});

// 11. API: Core Gemini AI Song & Lyrics Writer
app.post("/api/gemini/write-song", async (req, res) => {
  const params = req.body;
  const {
    user_name,
    target_audience,
    creation_reason,
    key_memories,
    core_message,
    emotions,
    scenes,
    music_style,
    singer_gender,
    reference_song,
    language,
    tempo,
    song_title,
    lyrics_style,
    must_include_words,
    must_avoid_words
  } = params;

  if (!user_name || !target_audience) {
    return res.status(400).json({ error: "Please provide user_name and target_audience to write a song." });
  }

  const promptText = `
  请为以下客户专属定制一首高情感共鸣的歌曲：
  - 客户称呼: ${user_name}
  - 送给谁: ${target_audience}
  - 为什么要写这首歌（起因/契机）: ${creation_reason || '抒发情感'}
  - 关键事件/共同画面/细节: ${key_memories || '一些日常小幸福'}
  - 最想对TA说的一句话（核心情感锚点）: ${core_message}
  - 核心情绪: ${emotions || '温暖治愈'}
  - 歌词画面色彩: ${scenes || '日常美好'}
  - 曲风偏好: ${music_style || '流行(Pop)'}
  - 歌手声音: ${singer_gender || '温暖少年/温柔男声'}
  - 参考歌曲/风格: ${reference_song || '无指定'}
  - 语言倾向: ${language || '纯国语'}
  - 节奏速度: ${tempo || '中速'}
  - 拟定歌名: ${song_title || '待定'}
  - 歌词文风: ${lyrics_style || '故事叙事'}
  - 必须出现的特定词汇/名字: ${must_include_words || '无'}
  - 绝对不要提起的敏感词汇: ${must_avoid_words || '无'}
  `;

  // Check if Gemini is initialized, otherwise use an extremely customized and beautiful server-side fallback
  if (aiClient) {
    try {
      console.log("Calling Gemini 3.5 Flash for customized song lyric writing...");
      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction: systemSettings.aiSystemPrompt,
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "";
      console.log("Raw response from Gemini received.");
      try {
        const parsedJson = JSON.parse(responseText.trim());
        return res.json({ success: true, ...parsedJson, isRealAi: true });
      } catch (parseError) {
        console.error("Failed to parse Gemini output as JSON. Output was:", responseText);
        // Clean JSON formatting if there was a markdown codeblock wrapping
        const cleanedText = responseText
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();
        try {
          const parsedCleaned = JSON.parse(cleanedText);
          return res.json({ success: true, ...parsedCleaned, isRealAi: true });
        } catch (innerErr) {
          // Fallback if parsing fails altogether
          throw new Error("JSON parsing failed");
        }
      }
    } catch (apiError) {
      console.error("Gemini API call failed, invoking high-quality fallback generator...", apiError);
    }
  }

  // High-Quality Fallback Lyric Generator in Chinese
  const title = song_title || `${target_audience.replace(/给|送给/g, '')}的专属旋律`;
  const styleDesc = music_style || "抒情流行";
  const emotionsList = emotions || "温暖治愈";
  
  const defaultLyrics = `[Verse 1]
清晨的阳光 穿透窗前的薄纱
桌上热气腾腾 盛着你最爱的清茶
你的笑声像一阵微风 吹拂过仲夏
在时间的相册里 留下了最美的画

[Verse 2]
那些起落的旅途 那些奋斗的喧嚣
因为有你的手 握紧着才不会动摇
你说生活虽然平凡 却也有它的骄傲
每一个日落黄昏 都有你温柔的拥抱

[Chorus]
这是专属于我们的歌 唱着往昔和执着
在茫茫的人海中 谢谢你选择了我
那些深情的话语 不必说得太多
往后的风霜雪雨 都有我陪着你走过

[Bridge]
回忆里每一个画面 都是你最真的容颜
岁月的长河里 我们的爱永远不灭

[Chorus]
这是专属于我们的歌 唱着往昔和执着
在茫茫的人海中 谢谢你选择了我
那些深情的话语 不必说得太多
往后的风霜雪雨 都有我陪着你走过`;

  const fallbackResult = {
    success: true,
    songTitle: title,
    lyrics: `// [系统提示：当前处于AI模拟定制模式]\n${defaultLyrics}`,
    melodyAdvice: `【编曲色彩推荐】
由于您选择了【${styleDesc}】风格和【${tempo}】节奏，主创团队建议：
1. 配器：选用温暖的【原声马丁吉他】进行节奏铺底，在副歌高潮处引入【古典大提琴】与【温润钢琴】，烘托出【${emotionsList}】的氛围。
2. 唱腔指导：建议歌手（${singer_gender}）采用【微气声唱法】，主歌娓娓道来，副歌深情倾诉，在Bridge段落加入重力和声，让声音富有空气感与空间厚度。`,
    aiNotes: `亲爱的 ${user_name}，我是阿紫。你的故事里带着深沉的感动。写歌是一门时间的艺术，生活揉碎了是故事，拼起来就是旋律。我们工作室将通过多轨混音，倾力为您打造这首《${title}》，让它成为您与【${target_audience}】之间最宝贵的声音资产！`,
    isRealAi: false
  };

  return res.json(fallbackResult);
});

// 12. API: AI Business Operations & Marketing Advisory Report Generator
app.post("/api/gemini/business-report", async (req, res) => {
  const { orders: clientOrders } = req.body;
  const targetOrders: Order[] = Array.isArray(clientOrders) && clientOrders.length > 0 ? clientOrders : orders;

  // 📈 1. Perform client-side dynamic data analytics for fallback AND prompt feeding
  const totalGmv = targetOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalCount = targetOrders.length;
  
  // Calculate repeat customers rate
  const customerOrdersMap: { [key: string]: number } = {};
  targetOrders.forEach(o => {
    const key = (o.userWechat || o.userName || "").trim().toLowerCase();
    if (key) {
      customerOrdersMap[key] = (customerOrdersMap[key] || 0) + 1;
    }
  });
  const repeatCustomersCount = Object.values(customerOrdersMap).filter(count => count > 1).length;
  const totalCustomersCount = Object.keys(customerOrdersMap).length;
  const repeatRate = totalCustomersCount > 0 ? ((repeatCustomersCount / totalCustomersCount) * 100).toFixed(1) : "0.0";

  // Group by months to find GMV fluctuations
  const monthlyDataMap: { [key: string]: { amount: number; count: number } } = {};
  targetOrders.forEach(o => {
    if (!o.createdAt) return;
    const datePart = o.createdAt.split(' ')[0];
    const parts = datePart.split('-');
    if (parts.length >= 2) {
      const monthKey = `${parts[0]}-${parts[1]}`;
      if (!monthlyDataMap[monthKey]) {
        monthlyDataMap[monthKey] = { amount: 0, count: 0 };
      }
      monthlyDataMap[monthKey].amount += o.totalPrice || 0;
      monthlyDataMap[monthKey].count += 1;
    }
  });

  const sortedMonths = Object.keys(monthlyDataMap).sort();
  let gmvFluctuationText = "";
  if (sortedMonths.length >= 2) {
    const prevMonth = sortedMonths[0];
    const latestMonth = sortedMonths[sortedMonths.length - 1];
    const prevAmt = monthlyDataMap[prevMonth].amount;
    const latestAmt = monthlyDataMap[latestMonth].amount;
    const diff = latestAmt - prevAmt;
    const percent = prevAmt > 0 ? ((diff / prevAmt) * 100).toFixed(1) : "0.0";
    gmvFluctuationText = `从较早周期的 ${prevMonth}（GMV ¥${prevAmt}）到最新的 ${latestMonth}（GMV ¥${latestAmt}），业绩呈 ${diff >= 0 ? "正向增长" : "轻微回撤"} 趋势，增幅/波动率为 ${percent}%。`;
  } else if (sortedMonths.length === 1) {
    gmvFluctuationText = `当前仅记录有单月（${sortedMonths[0]}）数据，GMV 为 ¥${monthlyDataMap[sortedMonths[0]].amount}，订单共计 ${monthlyDataMap[sortedMonths[0]].count} 笔，属于平稳初始积累期。`;
  } else {
    gmvFluctuationText = `暂无多月份趋势对比，累计 GMV 为 ¥${totalGmv}。`;
  }

  // Detect geographic hotspots from memories and descriptions
  let shanghaiCount = 0;
  let guangzhouCount = 0;
  let beijingCount = 0;
  targetOrders.forEach(o => {
    const text = ((o.keyMemories || "") + (o.creationReason || "") + (o.mustIncludeWords || "")).toLowerCase();
    if (text.includes("上海")) shanghaiCount++;
    if (text.includes("广州")) guangzhouCount++;
    if (text.includes("北京")) beijingCount++;
  });
  
  let peakRegion = "全国一线城市";
  if (shanghaiCount > guangzhouCount && shanghaiCount > beijingCount) {
    peakRegion = "上海市 (高客单占比最高)";
  } else if (guangzhouCount > shanghaiCount && guangzhouCount > beijingCount) {
    peakRegion = "广州市 (老客异地相恋复购显著)";
  } else if (beijingCount > shanghaiCount && beijingCount > guangzhouCount) {
    peakRegion = "北京市 (校园民谣及纪念日重合区)";
  } else {
    peakRegion = "江浙沪 ＆ 粤港澳 (高价值复购两翼)";
  }

  // 🤖 2. If Gemini SDK client is available, make the real API request
  if (aiClient) {
    try {
      console.log("Calling Gemini 3.5 Flash for customized Business Advisory Report...");
      const systemPrompt = `You are a Senior Strategic Operations and Marketing Specialist at a customized music workshop/studio (阿紫音乐工作室). 
Your task is to analyze the workshop's actual order data and produce an extremely insightful, professional, and action-oriented Business Advisory Report (经营建议报告) in Chinese.
Focus heavily on:
1. GMV fluctuations: Show detailed comparison between months and tiers (Premium version ¥1397 vs basic ¥298 vs blindbox ¥99).
2. High-value repeat customer frequencies: Identify the percentage of users ordering multiple times (such as '张先生' or '小林' who customized songs in both 2025 and 2026), and how to deepen relationship with them.
3. Marketing focus suggestions: Provide 3 concrete, actionable marketing goals for the next month, e.g., 'Strengthen customer acquisition in Shanghai high-end segment', 'Leverage student communities with low-tier R&B packages', or 'Automate reactivation loops on Xiaohongshu'.

You must respond in a valid JSON object matching the requested schema. Avoid any extra text or conversational wrap. Keep the tone professional, business-fluent, and encouraging.`;

      const userPrompt = `
      这是我们工作室当前的所有真实订单数据汇总：
      - 累计 GMV: ¥${totalGmv}
      - 订单总数: ${totalCount} 笔
      - 老客复购率: ${repeatRate}% (总客户数: ${totalCustomersCount}，复购客户数: ${repeatCustomersCount})
      - 历史月份表现: ${JSON.stringify(monthlyDataMap)}
      - 地理热度（上海/北京/广州出现的订单词频统计）: 上海(${shanghaiCount}), 北京(${beijingCount}), 广州(${guangzhouCount})
      
      请结合上述数据，为下月生成一份【AI智能商业经营建议报告】。
      `;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              gmvAnalysis: {
                type: Type.STRING,
                description: "一到两段深度的关于GMV波动和增长趋势的中文分析。应包含具体的GMV数据、环比/同比趋势，并总结高、中、低端套餐的贡献。"
              },
              repurchaseInsight: {
                type: Type.STRING,
                description: "关于老客复购频率、高价值客户忠诚度、纪念日二次转化模式的深度中文分析。引用具体的复购案例（如张先生或小林从去年到今年的周年定制演变）。"
              },
              marketingSuggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "建议标题，如：‘重仓上海高客单价中产私域拉新’" },
                    desc: { type: Type.STRING, description: "具体的实操策略和建议背景分析。" },
                    priority: { type: Type.STRING, description: "优先级：HIGH, MEDIUM, LOW" },
                    targetRegion: { type: Type.STRING, description: "目标市场/区域，如‘江浙沪中产私域’或‘全国高校社群’" }
                  },
                  required: ["title", "desc", "priority", "targetRegion"]
                }
              },
              visualKpis: {
                type: Type.OBJECT,
                properties: {
                  repurchaseRate: { type: Type.STRING, description: "复购率百分比，如：‘40.0%’" },
                  growthTrend: { type: Type.STRING, description: "增长势头描述，如：‘稳步增长 (环比+38%)’" },
                  peakRegion: { type: Type.STRING, description: "订单量最高或客单价最高的区域，如：‘上海徐汇/江浙沪’" },
                  suggestedChannel: { type: Type.STRING, description: "下月主攻渠道，如：‘小红书情感KOL + 老客私域回访’" }
                },
                required: ["repurchaseRate", "growthTrend", "peakRegion", "suggestedChannel"]
              }
            },
            required: ["gmvAnalysis", "repurchaseInsight", "marketingSuggestions", "visualKpis"]
          }
        }
      });

      const responseText = response.text || "";
      try {
        const parsedJson = JSON.parse(responseText.trim());
        return res.json({ success: true, ...parsedJson, isRealAi: true });
      } catch (parseError) {
        // Clean JSON formatting if there was a markdown codeblock wrapping
        const cleanedText = responseText
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();
        const parsedCleaned = JSON.parse(cleanedText);
        return res.json({ success: true, ...parsedCleaned, isRealAi: true });
      }
    } catch (apiError) {
      console.error("Gemini business-report API call failed, invoking high-quality dynamic fallback...", apiError);
    }
  }

  // 💎 3. High-Fidelity Dynamic Fallback Analyser
  const fallbackSuggestions = [
    {
      title: "针对高价值复购用户，推行「周年情感复刻计划」",
      desc: `当前客户复购率高达 ${repeatRate}%。以客户张先生（Wechat: zhang_jin_1992）为例，其在2025年定制了九周年恋情歌《那年栀子花开》，在2026年升级定制了十周年结婚专属款《栀子花开的晴天》，单笔客单价从¥298大幅攀升至¥1397。建议在系统内引入「纪念日老客提醒工作流」，提前30天由AI客服自动推送「老客专属复刻优惠」，实现情感伴随式裂变，锁死高净值复购。`,
      priority: "HIGH",
      targetRegion: "上海、北京、广州异地恋高粘性人群"
    },
    {
      title: "上海徐汇等长三角地区高品质「专属版」精准拉新",
      desc: "数据统计显示，上海提及频次在订单故事中排名居首，且上海客户多选择包含「AI精美歌词MV」增值服务的 ¥1397 进阶定制款。这表明上海等华东中产阶层对高端定制音乐接受度高、付费意愿极强。下月应集中预算，在微信朋友圈、小红书同城，定向投放华东高净值中产家庭，拉新主推「进阶款·专属版」套餐。",
      priority: "HIGH",
      targetRegion: "上海徐汇及华东高净值中产商圈"
    },
    {
      title: "利用异地恋「双城故事」及高铁票场景，重仓小红书KOL情感投放",
      desc: "广州、北京等地的异地恋群体（如客户小林）对 ¥99 或 ¥298 低门槛「体验款盲盒版」具有极高付费裂变热情。异地恋情侣攒下的「双城高铁票、歪了的雨伞、广州牛杂店」是天然的爆款宣传文案素材。下个月建议与小红书上5k-2w粉的情感树洞、情侣日常Vlog博主合作，进行软文合集投放，主打‘高铁票里的晴雨天’定制，提升转化效率。",
      priority: "MEDIUM",
      targetRegion: "广州、北京、深圳等高校及白领群体"
    }
  ];

  const fallbackReport = {
    success: true,
    gmvAnalysis: `本阶段阿紫音乐工作室财务大盘表现亮眼。系统内有效订单累计 GMV 已达 ¥${totalGmv}.00，共计成交 ${totalCount} 首定制单曲。${gmvFluctuationText} 在产品组合上，单价 ¥1397 元的进阶专属版及 ¥298 元的基础心意版为 GMV 绝对支柱，¥99 元的盲盒体验款则扮演了重要的社交获客与流量裂变杠杆。`,
    repurchaseInsight: `在用户忠诚度及复购表现上，当前工作室的老客复购率达到了惊人的 ${repeatRate}%（在 ${totalCustomersCount} 名独立客户中，有 ${repeatCustomersCount} 名进行了多次跨年度复购）。其中张先生（九周年民谣 → 十周年进阶专属款）、小林（两周年盲盒版 → 三周年R&B深情款）是极佳的长期情感定制代言。这说明私人定制写歌在结婚纪念、恋爱周年、奔现节点具有强大的生命力，属于长效、复购频次高的家庭资产，老客终身价值（LTV）极高。`,
    marketingSuggestions: fallbackSuggestions,
    visualKpis: {
      repurchaseRate: `${repeatRate}%`,
      growthTrend: totalGmv > 2000 ? "强劲上升 (复购驱动+38.5%)" : "健康起步 (老客二次唤醒中)",
      peakRegion: peakRegion,
      suggestedChannel: "小红书情感博主联署 + 纪念日老客私域唤醒"
    },
    isRealAi: false
  };

  return res.json(fallbackReport);
});

// 13. API: AI Copywriting Template Optimizer
app.post("/api/gemini/optimize-template", async (req, res) => {
  const { templateTitle, currentDesc, currentConversionRate } = req.body;

  if (!templateTitle) {
    return res.status(400).json({ error: "templateTitle is required" });
  }

  const systemPrompt = `You are a Senior Conversion Rate Optimization (CRO) Copywriting Specialist. 
Your goal is to optimize a customized music studio's (阿紫音乐工作室) low-converting marketing template to boost its user response and purchase rates.
You will receive:
- Template Title
- Current Description
- Current Conversion Rate

Please generate exactly 3 highly persuasive, alternative versions in Chinese that solve the low conversion rate (either by raising emotional touch, reducing friction, or clarifying value).
Each version must include:
1. title: A catchy, actionable new title.
2. desc: A highly-persuasive, detailed outreach message/strategy description.

You must respond with a valid JSON object matching the requested schema. Avoid any conversational wrappers.`;

  const userPrompt = `
  - 话术标题: ${templateTitle}
  - 当前内容/策略: ${currentDesc || "暂无描述"}
  - 当前成交转化率: ${currentConversionRate || "0.0"}% (处于警戒线，急需优化!)
  
  请为我们提供三个高转化、高触动人心、实操性极强的改进版方案。
  `;

  if (aiClient) {
    try {
      console.log("Calling Gemini 3.5 Flash to optimize copywriting template:", templateTitle);
      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              optimizedVersions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "改进版的标题" },
                    desc: { type: Type.STRING, description: "具体的营销文案、策略或首选触达话术" }
                  },
                  required: ["title", "desc"]
                }
              }
            },
            required: ["optimizedVersions"]
          }
        }
      });

      const responseText = response.text || "";
      try {
        const parsedJson = JSON.parse(responseText.trim());
        return res.json({ success: true, ...parsedJson, isRealAi: true });
      } catch (e) {
        const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsedCleaned = JSON.parse(cleanedText);
        return res.json({ success: true, ...parsedCleaned, isRealAi: true });
      }
    } catch (apiError) {
      console.error("Gemini optimize-template API call failed, using high-quality dynamic fallback...", apiError);
    }
  }

  // Fallback optimized versions based on the specific templateTitle
  const fallbackOptimizations: { [key: string]: any[] } = {
    "针对高价值复购用户，推行「周年情感复刻计划」": [
      {
        title: "✨「结婚十年·真爱复刻」特惠金婚专属计划",
        desc: "针对已定制过结婚周年的高端老客，由原班作词/作曲老师亲手制作续作。提供更宏大的弦乐实录，前奏无缝拼接当年的旧作，创造时空穿梭的极致感动，并随单附赠定制黑胶唱片与全家福歌词纪念册。专属首发特惠仅 ¥998 (原价 ¥1397)。"
      },
      {
        title: "💖「让旋律见证时光」老客专属周年温暖回访",
        desc: "发送亲切、无推销感的温情私信：‘张先生您好，还记得去年的《那年栀子花开》吗？又是一年纪念日将至，阿紫老师特别为您准备了专属音轨升华体验券。老客特惠，仅需 ¥298 即可续写你们最新的生活篇章，把这一年的新故事谱进歌里。’"
      },
      {
        title: "🎁「情感盲盒复购」周年低门槛朋友圈裂变礼券",
        desc: "推出裂变方案：‘老客定制周年纪念，可额外免费获得 2 张价值 ¥99 的「双人盲盒音乐贺卡」兑换券，可赠予闺蜜或备婚好友。’大幅度降低信任门槛，让老客心甘情愿发朋友圈推荐，拉新复购双管齐下。"
      }
    ],
    "利用异地恋「双城故事」及高铁票场景，重仓小红书KOL情感投放": [
      {
        title: "🎫「高铁票拼出的歌」小红书现象级情侣打卡文案",
        desc: "主打视觉泪点：将情侣积攒的一叠异地高铁票作为MV封面背景，文案：‘113张车票，5万公里奔波，终于变成了这首专属我们的《双城日记》。写歌，是异地恋最奢侈的告白。’重点投放异地恋、情感树洞类KOL，买单率直接提升200%。"
      },
      {
        title: "💌「异地恋救赎热线」盲盒款写歌低门槛切入",
        desc: "主推 ¥99 极速体验款。广告策略：‘只要提供你们相隔的两座城市，和最想和对方说的 3 句话，AI 音乐助手 10 分钟内为你们定制一首民谣。异地不孤单，歌声陪你过夜。’大大降低决策阻力，极易在高校社群和抖音形成自主传播。"
      },
      {
        title: "🚄「双城晴雨卡」异地恋微信温情自动触达",
        desc: "管理员私信：‘小林您好，注意到您在广州定制了盲盒，听对方说今天北京下大雨了，阿紫特别为你们调音了下雨背景声。这里有一份异地专属的 ¥50 加购券，可以直接将盲盒升级为 ¥298 完整R&B温暖版，要不要给TA今晚一个惊喜？’"
      }
    ],
    "上海徐汇等长三角地区高品质「专属版」精准拉新": [
      {
        title: "🏙️「徐汇中产私域」轻奢交响乐定制",
        desc: "放弃廉价词汇，改用‘艺术资产’、‘声音纪念碑’等雅致词汇。搭配上海地标航拍作为MV底片。主打 ¥1397 元专属版套餐，赠送全铜定制复古留声机U盘，迎合上海及长三角中产阶层对高品质艺术格调与仪式感的追求。"
      },
      {
        title: "🎻「浪漫法租界」老法师手作定制音乐展演",
        desc: "线下线上联动：‘长三角客户写下的每一首音乐故事，都将有机会免费入选上海衡复风貌区「浪漫秋日微音乐展」。’以此极大地提升客户的荣誉感、分享欲和朋友圈自发传播率，吸引高溢价客户。"
      },
      {
        title: "🍷「红酒与唱针」周年高端沙龙特邀回访话术",
        desc: "‘尊贵的上海老客您好，阿紫音乐工作室徐汇首发体验店特惠，本月定制「专属交响版」可免费尊享由专业咖啡师/调酒师为您定制的「双人音乐品鉴下午茶沙龙」。定制音乐，不止于听，更在于一次充满仪式感的高雅生活美学体验。’"
      }
    ]
  };

  const selectedOptimizations = fallbackOptimizations[templateTitle] || [
    {
      title: `✨「情感升华款」${templateTitle} 改进版`,
      desc: `基于当前低于5%的低转化转化率进行重新润色：‘亲爱的老客，阿紫老师记得您定制的那首歌。在这个值得纪念的日子，我们全新推出了2026最新高保真重低音版，原价¥1397老客专属特惠仅需¥498，把时间定格在歌声里。’`
    },
    {
      title: `🎁「低门槛限时特惠」${templateTitle} 改进版`,
      desc: "采用限时饥饿营销话术，增加倒计时或名额限制：‘本月仅限前20名定制，随单附赠高档发光水晶音乐盒。如果您觉得之前的歌还不错，一定要看看这次的升级，成交率成倍提升！’"
    },
    {
      title: `🎯「痛点爆款直击」${templateTitle} 改进版`,
      desc: "直击受众痛点和核心利益点，采用更加富有动感和小红书风格的排版：‘异地恋/结婚周年送什么？送包包会过期，写首歌听一辈子！支持一键同步微信，免费制作精美歌词海报视频。’"
    }
  ];

  return res.json({
    success: true,
    optimizedVersions: selectedOptimizations,
    isRealAi: false
  });
});

// Start Full-Stack App Port Binding
async function startServer() {
  const PORT = 3000;

  if (process.env.DISABLE_HMR === 'true') {
    console.log("Hot Module Replacement is disabled by the AI Studio system control plane.");
  }

  // Vite integration for dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULL-STACK DEV SERVER] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
