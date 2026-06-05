import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, NavLink, Route, Routes, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronRight, ScrollText, Tags, X } from "lucide-react";
import "./styles.css";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const topics = {
  marriage: {
    number: "01",
    title: "婚姻感情",
    description: "配偶星、夫妻宫、合冲刑害、桃花与关系模式。",
    summary: "先看日支夫妻宫，再看配偶星状态，最后用大运流年判断关系事件何时被引动。",
    divination: {
      ask: "占恋爱、结婚、婚期、关系稳定度、分合反复、伴侣类型。",
      palaceStars: ["日支夫妻宫", "男命财星", "女命官杀", "桃花与合冲刑害"],
      sequence: ["定日支静动", "看配偶星清浊", "查合冲刑害", "分静局喜动或动局喜静", "用大运流年落应期"],
      rules: [
        "静局喜动：原局夫妻宫稳定，遇到合适冲动更容易触发恋爱、订婚、结婚。",
        "动局喜静：原局夫妻宫动荡，反而要大运流年合住、扶住、化解冲刑才容易落实。",
        "不能只凭一个桃花、一个冲、一个合直接断婚姻，要宫星运年同看。"
      ],
    source: "/content/婚姻方面.md"
    },
    questions: [
      "配偶星是清、混、旺、弱，还是被冲克合化？",
      "夫妻宫坐什么十神，是否被冲、刑、穿、合？",
      "命局里的关系模式是依赖、控制、消耗、互补，还是反复拉扯？",
      "哪一步大运流年会触发恋爱、结婚、分离或关系升级？"
    ],
    posts: [
      "如何从夫妻宫看亲密关系底色",
      "男命财星与女命官杀不能机械套",
      "桃花、合局与暧昧关系的区别",
      "婚姻应期：原局、大运、流年怎么串起来"
    ]
  },
  wealth: {
    number: "02",
    title: "财运赚钱",
    description: "财星来源、担财能力、食伤生财、合伙与投资风险。",
    summary: "财运不是看有没有财星，而是看财从哪里来、日主能否承担、结构能否把能力变成收入。",
    divination: {
      ask: "占赚钱方式、收入上限、破财风险、合伙、投资、现金流。",
      palaceStars: ["财星", "食伤", "比劫", "日主强弱"],
      sequence: ["看财星有无根气", "看财从哪里来", "判断日主能否担财", "查比劫夺财与财星受损", "用运年判断进财破财"],
      rules: ["有财不等于有钱，能承接财才算财运成形。", "食伤生财偏技能与市场，比劫重则先看合伙和竞争风险。"]
    },
    questions: [
      "财星有没有根，是否透出，是否被比劫争夺？",
      "食伤能不能生财，印星是否阻断输出？",
      "日主能否担财，是工资财、生意财、投资财还是资源财？",
      "大运流年是否把财星引出，并带来真实交易场景？"
    ],
    posts: [
      "工资财、生意财、投资财的命局差异",
      "食伤生财为什么适合产品、销售和内容",
      "比劫夺财：合伙、竞争与现金流风险",
      "偏财不是横财：机会型收入怎么判断"
    ]
  },
  career: {
    number: "03",
    title: "事业职业",
    description: "官杀、印星、食伤、财星如何组成职业路径。",
    summary: "事业看一个人如何进入社会分工：靠组织、专业、表达、资源，还是靠竞争与个人驱动。",
    divination: {
      ask: "占职业方向、升迁、转型、创业、贵人、压力来源。",
      palaceStars: ["官杀", "印星", "食伤", "财星"],
      sequence: ["看官杀是否成势", "看印星能否承接资质", "看食伤是否输出能力", "看财星是否连接市场", "用大运判断事业阶段"],
      rules: ["官印相生偏体系与资质，食伤生财偏产品、销售、内容和技术变现。", "杀印相生适合高压专业，但要看杀是否被正确制化。"]
    },
    questions: [
      "官杀是否有制化，能不能形成职位、压力和目标？",
      "印星是否提供学历、资质、系统保护和贵人资源？",
      "食伤是否能输出技能，财星是否承接市场回报？",
      "命局适合体系内、自由职业、经营管理还是技术专家？"
    ],
    posts: [
      "官印相生：体系路径和资质型职业",
      "杀印相生：高压专业与竞争环境",
      "食伤生财：技能变现与商业表达",
      "职业转型什么时候看大运，什么时候看流年"
    ]
  },
  study: {
    number: "04",
    title: "学业成长",
    description: "印星吸收、食伤表达、官杀约束与考试节奏。",
    summary: "学业不是单看印旺，而是看吸收、表达、纪律和考试压力之间是否配合。",
    divination: {
      ask: "占学习方式、考试发挥、升学节点、专业方向。",
      palaceStars: ["印星", "食伤", "官杀", "大运流年"],
      sequence: ["看印星吸收", "看食伤表达", "看官杀纪律", "看印食官是否配合", "用运年判断考试节点"],
      rules: ["印旺不一定成绩好，印太重可能保守依赖。", "食伤旺适合理解表达，但过旺也可能抗拒规则。"]
    },
    questions: [
      "印星代表吸收能力，是否太重而保守依赖？",
      "食伤代表理解表达，是否被压制或过度发散？",
      "官杀能否形成纪律、目标和考试压力？",
      "哪类学习方式更适合：记忆型、理解型、项目型还是竞赛型？"
    ],
    posts: [
      "印星旺的人为什么不一定考试强",
      "食伤旺的孩子适合怎样学习",
      "官杀压力与考试发挥",
      "升学节点如何看大运流年"
    ]
  },
  family: {
    number: "05",
    title: "家庭六亲",
    description: "父母、兄弟、子女、伴侣与上级关系的宫星同看。",
    summary: "六亲要宫位、十神、旺衰和实际关系一起看，不能用一个符号粗暴代替一个人。",
    divination: {
      ask: "占父母缘分、兄弟朋友、子女、家庭压力、长辈关系。",
      palaceStars: ["年柱月柱", "财印", "比劫", "食伤时柱"],
      sequence: ["先定所问六亲", "取对应宫位", "取对应十神", "看生克合冲", "用运年判断事件"],
      rules: ["六亲不能只用一个十神断，要宫位、星、结构和现实关系一起看。", "比劫不是朋友好坏，而是同辈支持与竞争并存。"]
    },
    questions: [
      "年柱、月柱、日柱、时柱分别代表怎样的家庭层次？",
      "父母、兄弟、子女、伴侣对应的十神状态如何？",
      "六亲星是否被冲克，还是能成为资源与支持？",
      "家庭事件在什么大运流年被引动？"
    ],
    posts: [
      "父母星与年柱月柱怎么合看",
      "比劫不是朋友好坏，而是竞争与同辈关系",
      "子女星看食伤，但不能只看食伤",
      "家庭压力如何在命局里显形"
    ]
  },
  health: {
    number: "06",
    title: "健康倾向",
    description: "寒暖燥湿、五行太过不及、冲刑引动的生活提醒。",
    summary: "健康分类只做倾向提醒：看寒暖燥湿、五行偏枯、冲刑引动，不替代医学判断。",
    divination: {
      ask: "占体质倾向、压力节点、作息风险、生活方式提醒。",
      palaceStars: ["五行偏枯", "寒暖燥湿", "冲刑位置", "运年引动"],
      sequence: ["看整体气候", "找太过不及", "看冲刑集中处", "看运年是否重复引动", "只给生活提醒"],
      rules: ["健康分类只讲倾向，不做医学诊断。", "缺什么补什么很粗糙，寒暖燥湿和结构失衡更重要。"]
    },
    questions: [
      "命局是偏寒、偏热、偏燥，还是偏湿？",
      "某个五行是否太过或严重不及？",
      "冲刑集中在哪些支，是否在大运流年被重复触发？",
      "生活方式上应该提醒作息、饮食、运动还是压力管理？"
    ],
    posts: [
      "寒暖燥湿比缺什么更重要",
      "五行偏枯只能看倾向，不能当诊断",
      "冲刑引动与身体压力节点",
      "健康内容的边界：只提醒，不恐吓"
    ]
  },
  luck: {
    number: "07",
    title: "大运流年",
    description: "原局埋伏、大运成势、流年触发与应期复盘。",
    summary: "原局决定伏笔，大运决定阶段气候，流年负责触发具体事件。",
    divination: {
      ask: "占某年某阶段发生什么、机会何时来、压力何时显现。",
      palaceStars: ["原局结构", "大运十神", "流年干支", "合冲刑害"],
      sequence: ["先看原局伏笔", "再看大运气候", "最后看流年触发", "确认主题落点", "回案例复盘"],
      rules: ["流年不能脱离原局和大运单看。", "同一年有人发财有人破财，差别在原局承接方式。"]
    },
    questions: [
      "原局里已经有什么结构和矛盾？",
      "大运带来的十神是在帮结构，还是破坏结构？",
      "流年触发哪个宫位、哪个十神、哪组冲合刑害？",
      "事件属于机会、压力、转折、结束还是复发？"
    ],
    posts: [
      "原局、大运、流年的三层关系",
      "为什么同一年有人发财，有人破财",
      "应期判断：先看成势，再看触发",
      "案例复盘表：如何验证一次判断"
    ]
  },
  temperament: {
    number: "08",
    title: "性格底盘",
    description: "日主、月令、十神结构与一个人的底层驱动力。",
    summary: "性格先看日主与月令，再看十神组合，最后落到真实行为，而不是贴标签。",
    divination: {
      ask: "占性格底色、行为模式、优势短板、适合环境。",
      palaceStars: ["日主", "月令", "主导十神", "格局结构"],
      sequence: ["定日主", "看月令旺衰", "找主导十神", "看结构流通", "落到行为表现"],
      rules: ["十神不是性格标签，而是行为动力。", "优势和问题往往是同一股力量在不同环境下的两面。"]
    },
    questions: [
      "日主在月令中处于什么状态？",
      "命局主导十神是谁：印、比劫、食伤、财、官杀？",
      "这个人解决问题主要靠安全感、表达、资源、规则还是竞争？",
      "性格优势在什么环境下变成问题？"
    ],
    posts: [
      "十神不是性格标签，而是行为动力",
      "印重、食伤旺、财旺、官杀重分别怎么表现",
      "身强身弱如何影响人的行动方式",
      "从命局结构写人物画像"
    ]
  }
};

const topicList = Object.entries(topics);

const elementBasics = [
  {
    formula: "水多木浮",
    relation: "水生木太过",
    meaning: "木本来要得水滋养，但水太多则木根不稳，容易漂浮无依。",
    use: "看日主为木、木为用神、或婚姻事业主题落在木时，先判断水是否过旺。"
  },
  {
    formula: "木多火塞",
    relation: "木生火太过",
    meaning: "木能生火，但木太多反而压住火路，火不一定明亮。",
    use: "看表达、名气、食伤、眼界、行动力时，要分清是木来生火，还是木重火闷。"
  },
  {
    formula: "火多土焦",
    relation: "火生土太过",
    meaning: "火能生土，但火太烈则土燥焦，承载力下降。",
    use: "看稳定、资产、脾胃、落地能力时，火土过燥不能只当作生扶。"
  },
  {
    formula: "土多金埋",
    relation: "土生金太过",
    meaning: "土能生金，但土太厚则金被埋，才华、规则、锋芒不易显露。",
    use: "看官杀、技术、判断力、制度资源时，要看金是否被厚土困住。"
  },
  {
    formula: "金多水浊",
    relation: "金生水太过",
    meaning: "金能生水，但金多水寒水浊，聪明可能变成迟疑、冷硬或杂念。",
    use: "看印星、思考、信息流、流动性时，金水太重未必是清明。"
  },
  {
    formula: "水少木枯",
    relation: "木少滋养",
    meaning: "木失水养，生发力不足，容易干枯、急躁、缺耐性。",
    use: "看成长、学习、规划、关系生机时，先看木有没有水源。"
  },
  {
    formula: "木少火虚",
    relation: "火少源头",
    meaning: "火无木源，光热不续，热情容易一阵一阵。",
    use: "看输出、名声、创作、表达时，要看火有没有持续燃料。"
  },
  {
    formula: "火少土寒",
    relation: "土少温养",
    meaning: "土无火温，土寒湿滞，承载和落实会慢。",
    use: "看执行、稳定、家庭、资产时，要看土是温土还是寒土。"
  },
  {
    formula: "土少金寒",
    relation: "金少承托",
    meaning: "金无土生，金气孤寒，规则和能力不容易落到现实。",
    use: "看职业规范、专业技能、权力边界时，要看金有没有土来承托。"
  },
  {
    formula: "金少水散",
    relation: "水少源头",
    meaning: "水无金源，流动难续，信息、资源、情绪容易散。",
    use: "看智慧、流通、迁移、人脉时，要看水有没有源。"
  }
];

const heavenlyStems = [
  ["甲", "阳木", "大树、栋梁、向上生发", "重在根气与疏通，怕被金伤，也怕水泛木浮。"],
  ["乙", "阴木", "花草、藤蔓、柔韧生长", "重在依附与环境，喜有水养、火发、支中有根。"],
  ["丙", "阳火", "太阳、光明、外放热力", "重在照耀与显达，怕被水晦，也怕土厚晦光。"],
  ["丁", "阴火", "灯火、炉火、细密温度", "重在持续与专注，喜木来续焰，怕湿寒压灭。"],
  ["戊", "阳土", "高山、堤坝、厚重承载", "重在稳定与边界，喜火暖土，怕木重疏土太过。"],
  ["己", "阴土", "田园、湿土、包容孕育", "重在培植与转化，喜温润平衡，怕寒湿泥滞。"],
  ["庚", "阳金", "刀斧、矿石、刚健执行", "重在锻炼与决断，喜火炼土生，怕土厚金埋。"],
  ["辛", "阴金", "珠玉、首饰、精致规则", "重在清洁与雕琢，喜水洗火炼，怕浊土埋没。"],
  ["壬", "阳水", "江河、大海、奔流信息", "重在流动与格局，喜有堤岸，怕泛滥无归。"],
  ["癸", "阴水", "雨露、泉水、细密滋养", "重在渗透与润泽，喜金源木承，怕土浊水塞。"]
];

const earthlyBranches = [
  ["子", "水", "冬至前后", "癸", "水气专旺，主流动、信息、暗线与情绪。"],
  ["丑", "湿土", "冬末", "己、癸、辛", "寒湿之库，藏土水金，常看蓄积、迟滞与收纳。"],
  ["寅", "木", "初春", "甲、丙、戊", "木气发动，带火土生机，主开始、扩张与行动。"],
  ["卯", "木", "仲春", "乙", "木气纯粹，主生发、人缘、审美与关系牵连。"],
  ["辰", "湿土", "春末", "戊、乙、癸", "水库兼湿土，藏木水余气，主转折、蓄水与复杂关系。"],
  ["巳", "火", "初夏", "丙、戊、庚", "火气渐旺，藏金受炼，主表达、技术、变化与外显。"],
  ["午", "火", "仲夏", "丁、己", "火气极旺，主热度、名声、礼法，也看燥烈过度。"],
  ["未", "燥土", "夏末", "己、丁、乙", "木库兼燥土，藏火木余气，主承接、养成与内在牵挂。"],
  ["申", "金", "初秋", "庚、壬、戊", "金气发动，带水土，主规则、工具、竞争与机动。"],
  ["酉", "金", "仲秋", "辛", "金气纯粹，主精确、审美、边界、口舌与制度。"],
  ["戌", "燥土", "秋末", "戊、辛、丁", "火库兼燥土，藏金火余气，主收束、防守与旧事复燃。"],
  ["亥", "水", "初冬", "壬、甲", "水气发动，藏木生机，主迁移、暗流、远方与孕育。"]
];

const tenGods = [
  ["比肩", "同我、同阴阳", "自我、同辈、坚持、分担", "可成帮身，也可成竞争，要看日主强弱与财官状态。"],
  ["劫财", "同我、异阴阳", "夺财、行动、朋友、冲劲", "身弱可助身，身旺易争财，合伙与现金流要谨慎。"],
  ["食神", "我生、同阴阳", "表达、享受、作品、福气", "偏稳定输出，能生财，也能制杀，但怕被枭印夺食。"],
  ["伤官", "我生、异阴阳", "才华、锋芒、反规则、突破", "有创造力，也容易冲官，必须看是否有财印承接。"],
  ["偏财", "我克、同阴阳", "机会财、市场、人脉、父亲", "偏流动和机会，身弱不胜财时反成压力。"],
  ["正财", "我克、异阴阳", "稳定收入、经营、妻星、责任", "重秩序与现实回报，怕比劫夺财，也怕财多身弱。"],
  ["七杀", "克我、同阴阳", "压力、竞争、风险、权力", "杀要制化，制得好是胆识与执行，失控则成压迫。"],
  ["正官", "克我、异阴阳", "规则、职位、名分、约束", "喜清不喜混，官印相生多见体系路径与资质保护。"],
  ["偏印", "生我、同阴阳", "灵感、偏门、保护、孤高", "能护身也能夺食，常看学习方式与非标准资源。"],
  ["正印", "生我、异阴阳", "学历、贵人、吸收、安全感", "主系统支持与资质，太重则依赖保守、输出不足。"]
];

const stateRules = [
  {
    title: "显隐",
    items: [
      ["藏待透", "藏在地支里的信息，要等天干透出或运年引出才明显。"],
      ["浮待根", "天干浮露无根，要等地支给根，事情才有承载。"],
      ["无待现", "原局没有的主题，等运年出现才有事象。"],
      ["有待无", "原局已有之物，运年去掉、冲掉、合走时也会成事。"]
    ]
  },
  {
    title: "清浊",
    items: [
      ["独怕重", "单一清纯之物，最怕重复太过，重则变浊。"],
      ["混喜清", "原局混杂，喜运年去杂留清，让主题变得可用。"],
      ["阴见阳", "阴性信息遇阳，事情容易外显、明朗、被推动。"],
      ["阳见阴", "阳性信息遇阴，事情容易内化、沉淀、转入暗线。"]
    ]
  },
  {
    title: "动静",
    items: [
      ["合待冲", "被合住的信息，要等冲开才动。"],
      ["冲待合", "被冲散的信息，要等合住才稳。"],
      ["静待动", "原局太静，喜运年来引动。"],
      ["强待冲", "力量太强太固，反而要冲开才有变化。"]
    ]
  },
  {
    title: "盛衰",
    items: [
      ["旺怕生", "已经太旺，再被生扶容易过度。"],
      ["弱怕克", "已经太弱，再被克制容易受损。"],
      ["旺待墓", "旺极之物，待墓库收束才成形。"],
      ["强待助", "强但未成势，得助才能真正成局。"]
    ]
  },
  {
    title: "出入",
    items: [
      ["墓待邀", "入墓入库的信息，要等冲、合、刑等方式打开。"],
      ["空待出", "落空的信息，要等出空、填实、冲实才落地。"],
      ["生待死", "处在生发状态的事，要看何时收束、定型、结束。"],
      ["死待生", "处在死绝状态的事，要看何时得生机、重新被激活。"]
    ]
  },
  {
    title: "成破",
    items: [
      ["待局成", "条件未齐时，等三合、三会、合化成局。"],
      ["成局破", "已经成局时，重点看哪里被冲破、刑破、穿破。"],
      ["一冲三", "一个流年或大运冲动三方，事情牵连面大。"],
      ["三冲一", "三方压力集中冲一处，主题容易爆发。"]
    ]
  }
];

const caseStudies = [
  {
    topics: ["marriage", "career", "study", "health", "family"],
    id: "案例 1",
    title: "冲婚姻宫，但三会引动可成婚",
    tags: ["婚姻宫受冲", "奉子成婚", "妻子助力"],
    images: [
      "/assets/cases/case-analysis-1/case-001-01.png",
      "/assets/cases/case-analysis-1/case-001-02.png"
    ],
    point: "寅申冲日支婚姻宫，妻宫受伤；己酉大运申酉戌三会金，引动夫妻子女宫，可奉子成婚。",
    feedback: "妻宫食神，食财为喜，感情好，妻子可助力；偏财多，流年不好时仍有离婚风险。"
  },
  {
    topics: ["marriage", "wealth", "study", "family", "health"],
    id: "案例 15",
    title: "财星妻星被合动，结婚应期明确",
    tags: ["结婚应期", "财星妻星", "子午冲化解"],
    images: ["/assets/cases/case-analysis-1/case-015-01.jpeg"],
    point: "己酉运甲子年结婚；辰酉合金见财星妻星，子辰半合水见子女星。",
    feedback: "夫妻感情没问题，但子女星受损，子女方面不佳。"
  },
  {
    topics: ["marriage"],
    id: "案例 22",
    title: "比劫临财与第三方关系",
    tags: ["第三方", "比劫临财", "出轨结构"],
    images: [
      "/assets/cases/case-analysis-1/case-022-01.jpeg",
      "/assets/cases/case-analysis-1/case-022-02.jpeg",
      "/assets/cases/case-analysis-1/case-022-03.jpeg",
      "/assets/cases/case-analysis-1/case-022-04.jpeg",
      "/assets/cases/case-analysis-1/case-022-05.jpeg",
      "/assets/cases/case-analysis-1/case-022-06.jpeg",
      "/assets/cases/case-analysis-1/case-022-07.jpeg"
    ],
    point: "身弱、比劫临财，容易与有对象的人发生关系；出轨还要看夫妻宫相害暗合与桃花制化。",
    feedback: "同组案例可区分涉入他人、离过婚但不涉入他人、主动争夺等不同层次。"
  },
  {
    topics: ["marriage", "wealth"],
    id: "案例 33",
    title: "墙内桃花与配偶助力",
    tags: ["墙内桃花", "金舆", "夫妻感情好"],
    images: ["/assets/cases/case-analysis-1/case-033-01.jpeg"],
    point: "墙内桃花、金舆，配偶资助；墙内婚姻美丽，夫妻感情好。",
    feedback: "妻子能力大，命主女人缘好，处对象能得到对方支持。"
  },
  {
    topics: ["marriage", "wealth", "luck", "family"],
    id: "案例 64",
    title: "刑冲合婚姻宫动而结婚",
    tags: ["结婚应期", "刑冲合", "婚姻宫动"],
    images: ["/assets/cases/case-analysis-2/case-064-01.jpeg"],
    point: "辛丑年结婚；卯戌合火，两丑刑戌，刑冲合婚姻宫动。",
    feedback: "婚姻宫被合、被刑，动象集中，关系事件被触发。"
  },
  {
    topics: ["marriage", "family"],
    id: "案例 78",
    title: "巳亥冲婚姻宫坏",
    tags: ["婚姻宫冲坏", "比劫夺财", "配偶背景"],
    images: [
      "/assets/cases/case-analysis-2/case-078-01.jpeg",
      "/assets/cases/case-analysis-2/case-078-02.jpeg"
    ],
    point: "年柱比劫夺财，日柱正财带官；巳亥冲婚姻宫坏，妻子被比劫冲走带走。",
    feedback: "娶得老婆离异带儿子。"
  },
  {
    topics: ["marriage", "study", "luck"],
    id: "案例 80",
    title: "早恋与性应期",
    tags: ["早恋", "婚姻宫冲动", "性应期"],
    images: ["/assets/cases/case-analysis-2/case-080-01.jpeg"],
    point: "官杀早现年上，早恋很早；2014 年子午冲婚姻宫初恋。",
    feedback: "2016 丙申，申子辰引动日支时支，为性应期。"
  },
  {
    topics: ["marriage", "luck"],
    id: "案例 81",
    title: "财星多，婚姻宫刑明显",
    tags: ["多婚", "财星多", "婚姻宫刑"],
    images: ["/assets/cases/case-analysis-2/case-081-01.jpeg"],
    point: "财星多，婚姻宫刑得明显，关系对象不唯一，婚姻承载点也不稳定。",
    feedback: "1999 己卯、2009 己丑、2021 辛丑，三婚。"
  },
  {
    topics: ["career", "health", "study"],
    id: "案例 2",
    title: "土晦火光，水木为真用",
    tags: ["调候", "官杀生印", "学历"],
    images: ["/assets/cases/case-analysis-1/case-002-01.jpeg"],
    point: "丙火生戌月，地支一片土晦火光，妙在壬水透出，水木为真用神。",
    feedback: "癸亥大运寅亥合木，官杀生印枭，水木喜神，学历可以。"
  },
  {
    topics: ["health", "temperament", "marriage"],
    id: "案例 5",
    title: "枭神夺食与身心问题",
    tags: ["枭神夺食", "纯阴", "夫妻宫伏吟"],
    images: ["/assets/cases/case-analysis-1/case-005-01.jpeg"],
    point: "冬季辛金冻，病在土重；偏印多，枭神夺食，身心与生殖系统都要看。",
    feedback: "偏印忌神见抑郁、敏感通阴；卯木受伤、夫妻宫伏吟，婚姻不好。"
  },
  {
    topics: ["family", "marriage", "health"],
    id: "案例 9",
    title: "比劫夺财与家庭落难",
    tags: ["比劫夺财", "水泛滥", "夫妻子女宫"],
    images: ["/assets/cases/case-analysis-1/case-009-01.jpeg"],
    point: "比劫夺财，周围汪洋水，子午冲冲夫妻子女宫。",
    feedback: "妻子父亲落水落难，水泛滥时取土为用。"
  },
  {
    topics: ["wealth", "family", "marriage", "health", "luck"],
    id: "案例 10",
    title: "身杀两停与多主题应期",
    tags: ["身杀两停", "兄弟宫", "妻星应期"],
    images: ["/assets/cases/case-analysis-1/case-010-01.jpeg"],
    point: "比劫抗住官杀旺，子午冲兄弟宫；没有妻星、子午冲夫妻宫，等流年来送。",
    feedback: "丁未年见妻星应期；2019 己亥大运己亥流年，巳亥冲用神，脸部受伤。"
  },
  {
    topics: ["wealth", "temperament"],
    id: "案例 51",
    title: "有钱不会用，聪明反被聪明误",
    tags: ["食伤盗气", "土晦火光", "主见"],
    images: [
      "/assets/cases/case-analysis-2/case-051-01.jpeg",
      "/assets/cases/case-analysis-2/case-051-02.jpeg"
    ],
    point: "食伤盗气、土晦火光，甲木又没有庚金，容易有钱不会用。",
    feedback: "没有庚只能按部就班，推一步走一步；有庚后主见才出来。"
  },
  {
    topics: ["study", "career", "wealth", "health"],
    id: "案例 52",
    title: "水多木漂，根基不足",
    tags: ["寒局", "水多木漂", "学历职业"],
    images: ["/assets/cases/case-analysis-2/case-052-01.jpeg"],
    point: "命局寒，水多木漂，冻水伤根基，扎根的土也没有。",
    feedback: "初中毕业，当兵出来当辅警，一个月 2100。"
  },
  {
    topics: ["luck", "career", "health"],
    id: "案例 53",
    title: "官杀克身与牢狱应期",
    tags: ["官杀克身", "天罗地网", "牢狱"],
    images: ["/assets/cases/case-analysis-2/case-053-01.jpeg"],
    point: "官杀克身严重，巳带天罗地网、官杀傍身，失去自由的信息明显。",
    feedback: "火土为关押应期，申也能引动。"
  },
  {
    topics: ["wealth", "luck"],
    id: "案例 55",
    title: "丁酉年被坑钱",
    tags: ["身弱", "食伤盗气", "破财"],
    images: ["/assets/cases/case-analysis-2/case-055-01.jpeg"],
    point: "身弱食伤盗气，用火土；丁壬合杀，通关的水被合走，金木相战。",
    feedback: "丁酉年被坑钱，身弱只能靠比劫硬抗。"
  },
  {
    topics: ["study", "career"],
    id: "案例 56",
    title: "未月炎燥与学历层次",
    tags: ["学历", "癸水", "土厚木折"],
    images: ["/assets/cases/case-analysis-2/case-056-01.jpeg"],
    point: "未月炎燥，癸水第一用，庚金发水为第二用，土厚木折为病。",
    feedback: "一本大学，水木庚都可用。"
  },
  {
    topics: ["career", "study", "luck"],
    id: "案例 57",
    title: "金木相战与职位提升",
    tags: ["职业提升", "金木相战", "磨练"],
    images: ["/assets/cases/case-analysis-2/case-057-01.jpeg"],
    point: "身旺，病在金木相战；水火可用，火为辛金的锻炼磨练，水让辛金发亮。",
    feedback: "大专学历，当年得到磨练和提升，职位从助理转医师。"
  },
  {
    topics: ["health", "family", "temperament"],
    id: "案例 58",
    title: "纯阳八字与祖坟信号",
    tags: ["纯阳", "十恶大败", "祖坟"],
    images: [
      "/assets/cases/case-analysis-2/case-058-01.jpeg",
      "/assets/cases/case-analysis-2/case-058-02.jpeg"
    ],
    point: "纯阳八字，杀旺食神泄身，寅月初春寒气，有杀先用印火。",
    feedback: "一片竹林，祖坟让树根穿了；小时候曾从三楼掉下来。"
  },
  {
    topics: ["wealth", "career", "luck"],
    id: "案例 63",
    title: "创业发财后赌博破财",
    tags: ["创业", "赌博破财", "金木相战"],
    images: ["/assets/cases/case-analysis-2/case-063-01.jpeg"],
    point: "辛金虽身弱，有水盗气，但需要火炼；水洗金清脆，火锻金成器。",
    feedback: "做手机通讯生意，01 年创业开店，08 年左右赌博破财，输了几千万。"
  },
  {
    topics: ["marriage", "health", "career"],
    id: "案例 66",
    title: "财旺身弱与旺夫命",
    tags: ["旺夫", "枭神夺食", "人际圈"],
    images: ["/assets/cases/case-analysis-2/case-066-01.jpeg"],
    point: "辛有壬，出身可以；亥卯未木旺，财旺身弱论，用火即可。",
    feedback: "人际交往圈子大，是旺夫命；今年丑未、子丑引动，枭神夺食，不是怀孕就是打胎。"
  },
  {
    topics: ["career", "study", "family"],
    id: "案例 67",
    title: "杀印相生与医学博士",
    tags: ["杀印相生", "医学", "学历"],
    images: ["/assets/cases/case-analysis-2/case-067-01.jpeg"],
    point: "杀印相生，地支成水局，官杀不杂、气纯，层次不错。",
    feedback: "早运木火助长土势，出身不好；后运起来，医学博士。"
  },
  {
    topics: ["career", "study", "marriage"],
    id: "案例 70",
    title: "职业不错但婚姻未落地",
    tags: ["律师", "杀纯", "未婚"],
    images: ["/assets/cases/case-analysis-2/case-070-01.jpeg"],
    point: "坐下一片根气，官杀不杂，身旺杀旺，得月令强根，用火土。",
    feedback: "北京律师，中等偏上层次；童子煞、华盖在婚姻宫，未婚。"
  },
  {
    topics: ["career", "study", "wealth", "marriage"],
    id: "案例 75",
    title: "杀印相生与执行力",
    tags: ["高学历", "七杀", "财旺出轨"],
    images: [
      "/assets/cases/case-analysis-2/case-075-01.jpeg",
      "/assets/cases/case-analysis-2/case-075-02.jpeg"
    ],
    point: "乙坐卯强根，杀有力，杀印相生可用，官杀不杂，七杀气纯。",
    feedback: "断高学历，精力满、执行力强；财旺、墙外桃花、桃花比劫，异性缘多，容易出轨。"
  }
];

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <SiteShell />
    </BrowserRouter>
  );
}

function SiteShell() {
  return (
    <>
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="八字分类占内容库首页">
          <span className="brand-mark">命</span>
          <span>八字分类占</span>
        </NavLink>
        <nav className="nav" aria-label="主导航">
          <NavLink to="/">首页</NavLink>
          <NavLink to="/basics">基础篇</NavLink>
          <NavLink to="/advanced">进阶</NavLink>
          <NavLink to="/classified">分类占</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/basics" element={<BasicsPage />} />
        <Route path="/advanced" element={<AdvancedPage />} />
        <Route path="/classified" element={<ClassifiedIndexPage />} />
        <Route path="/classified/:topicKey" element={<ClassifiedTopicPage />} />
      </Routes>

      <footer className="footer">
        <p>八字分类占内容库 · 先建基础，再进阶，最后分类占。</p>
      </footer>
    </>
  );
}

function HomePage() {
  return (
    <main id="top">
      <Hero />
      <Intro />
      <HomeEntries />
    </main>
  );
}

function BasicsPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Basics"
        title="基础篇"
        copy="先把五行、十天干、十二地支、十神的基础关系看明白，再进入状态和分类占。"
      />
      <ContentLayout
        title="基础篇目录"
        items={[
          { label: "五行基础", href: "#element-basics" },
          { label: "十天干", href: "#heavenly-stems" },
          { label: "十二地支", href: "#earthly-branches" },
          { label: "十神", href: "#ten-gods" }
        ]}
      >
        <ElementBasics />
        <HeavenlyStems />
        <EarthlyBranches />
        <TenGods />
      </ContentLayout>
    </main>
  );
}

function AdvancedPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced"
        title="进阶"
        copy="基础看五行，进阶看状态。先判断一个字、一个十神、一个宫位处在什么状态，再判断它等待什么条件。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          { label: "状态理论诀", href: "#state-rules" },
          ...stateRules.map((group) => ({ label: group.title, href: `#state-${group.title}` })),
          { label: "分析框架", href: "#method" }
        ]}
      >
        <StateRules />
        <Method />
      </ContentLayout>
    </main>
  );
}

function ClassifiedIndexPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Classified Reading"
        title="分类占"
        copy="同一个八字，每次只围绕一个问题重组命局。先选主题，再看宫位、十神、状态与运年触发。"
      />
      <ContentLayout title="分类占目录" items={topicList.map(([key, topic]) => ({ label: topic.title, href: `/classified/${key}` }))}>
        <Catalog />
        <Roadmap />
      </ContentLayout>
    </main>
  );
}

function ClassifiedTopicPage() {
  const { topicKey } = useParams();
  const detail = topics[topicKey];

  if (!detail) {
    return <Navigate to="/classified/marriage" replace />;
  }

  const topicCases = caseStudies.filter((item) => item.topic === topicKey || item.topics?.includes(topicKey));

  return (
    <main className="page-shell">
      <TopicHeader topicKey={topicKey} detail={detail} />
      <ContentLayout
        title="分类占目录"
        items={[
          ...topicList.map(([key, topic]) => ({ label: topic.title, href: `/classified/${key}`, active: key === topicKey })),
          { label: "当前分类占", href: "#divination" },
          ...(topicCases.length > 0 ? [{ label: "案例复盘", href: "#case-studies" }] : [])
        ]}
      >
        <TopicNav activeTopic={topicKey} />
        <DetailPanel detail={detail} />
        {topicCases.length > 0 ? <CaseStudies detail={detail} items={topicCases} /> : null}
      </ContentLayout>
    </main>
  );
}

function TopicHeader({ topicKey, detail }) {
  return (
    <section className="topic-header">
      <div>
        <p className="eyebrow">Classified / {topicKey}</p>
        <h1>{detail.title}</h1>
        <p>{detail.summary}</p>
      </div>
      <div className="header-actions">
        <NavLink className="button ghost dark" to="/">
          <ArrowLeft size={18} aria-hidden="true" />
          返回首页
        </NavLink>
        <NavLink className="button ghost dark" to="/classified">
          <BookOpen size={18} aria-hidden="true" />
          分类目录
        </NavLink>
      </div>
    </section>
  );
}

function PageHeader({ eyebrow, title, copy }) {
  return (
    <section className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      <NavLink className="button ghost dark" to="/">
        <ArrowLeft size={18} aria-hidden="true" />
        返回首页
      </NavLink>
    </section>
  );
}

function ContentLayout({ title, items, children }) {
  return (
    <div className="content-layout">
      <aside className="side-directory">
        <h2>{title}</h2>
        <nav aria-label={title}>
          {items.map((item) =>
            item.href.startsWith("/") ? (
              <NavLink className={item.active ? "is-active" : ""} key={item.href} to={item.href}>
                {item.label}
              </NavLink>
            ) : (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            )
          )}
        </nav>
      </aside>
      <div className="content-main">{children}</div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img src={assetUrl("/assets/hero-bazi-desk.png")} alt="八字学习书桌、罗盘与传统纸页" />
      <div className="hero-shade" />
      <div className="hero-content">
        <p className="eyebrow">分类占内容体系</p>
        <h1 id="hero-title">把八字拆成可学习、可写作、可复盘的专题库</h1>
        <p className="hero-copy">
          从婚姻、财运、事业到大运流年，每个主题都有固定入口、判断顺序和文章模板。
        </p>
        <div className="hero-actions">
          <NavLink className="button primary" to="/classified/marriage">
            <ChevronRight size={18} aria-hidden="true" />
            进入分类占
          </NavLink>
          <a className="button ghost" href={assetUrl("/content/catalog.md")}>
            <BookOpen size={18} aria-hidden="true" />
            查看 Markdown 目录
          </a>
        </div>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="intro" aria-label="内容定位">
      <p>这个网站不是玄学断语合集，而是一个分类占写作系统：同一个八字，每次只围绕一个问题重组命局。</p>
      <div className="intro-stats" aria-label="目录统计">
        <span>
          <strong>4</strong> 组基础模块
        </span>
        <span>
          <strong>24</strong> 条状态口诀
        </span>
        <span>
          <strong>8</strong> 大分类占
        </span>
      </div>
    </section>
  );
}

function HomeEntries() {
  const entries = [
    {
      title: "基础篇",
      href: "/basics",
      eyebrow: "Basics",
      copy: "五行基础、太过不及、源头承载。先看五行，不急着断事。"
    },
    {
      title: "进阶",
      href: "/advanced",
      eyebrow: "Advanced",
      copy: "状态理论诀、显隐动静、盛衰出入、成破与五步框架。"
    },
    {
      title: "分类占",
      href: "/classified",
      eyebrow: "Classified",
      copy: "婚姻、财运、事业、学业、六亲、健康、大运流年。"
    }
  ];

  return (
    <section className="home-entries" aria-labelledby="home-entries-title">
      <div className="section-heading">
        <p className="eyebrow">Structure</p>
        <h2 id="home-entries-title">学习结构</h2>
      </div>
      <div className="entry-grid">
        {entries.map((entry) => (
          <NavLink className="entry-card" key={entry.href} to={entry.href}>
            <span>{entry.eyebrow}</span>
            <h3>{entry.title}</h3>
            <p>{entry.copy}</p>
            <small>进入</small>
          </NavLink>
        ))}
      </div>
    </section>
  );
}

function ElementBasics() {
  return (
    <section className="element-basics" id="element-basics" aria-labelledby="element-basics-title">
      <div className="section-heading">
        <p className="eyebrow">Five Elements</p>
        <h2 id="element-basics-title">五行基础篇</h2>
      </div>
      <div className="element-lead">
        <p>
          先看五行不是缺什么，而是看生克是否过度、是否有源、是否能承载。五行一偏，十神和宫位的象也会跟着变。
        </p>
        <a className="source-link" href={assetUrl("/content/五行基础篇.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看五行基础篇
        </a>
      </div>
      <div className="element-grid">
        {elementBasics.map((item) => (
          <article className="element-card" id={`element-${item.formula}`} key={item.formula}>
            <span>{item.relation}</span>
            <h3>{item.formula}</h3>
            <p>{item.meaning}</p>
            <small>{item.use}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function HeavenlyStems() {
  return (
    <section className="basics-module" id="heavenly-stems" aria-labelledby="heavenly-stems-title">
      <div className="section-heading">
        <p className="eyebrow">Heavenly Stems</p>
        <h2 id="heavenly-stems-title">十天干</h2>
      </div>
      <div className="basics-lead">
        <p>天干看外显之气：透在天上，事情容易被看见。先定阴阳五行，再看有没有地支给根。</p>
      </div>
      <div className="symbol-grid stems-grid">
        {heavenlyStems.map(([name, nature, image, note]) => (
          <article className="symbol-card" key={name}>
            <strong>{name}</strong>
            <span>{nature}</span>
            <p>{image}</p>
            <small>{note}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function EarthlyBranches() {
  return (
    <section className="basics-module earthy" id="earthly-branches" aria-labelledby="earthly-branches-title">
      <div className="section-heading">
        <p className="eyebrow">Earthly Branches</p>
        <h2 id="earthly-branches-title">十二地支</h2>
      </div>
      <div className="basics-lead">
        <p>地支看根基、环境与暗线。支中藏干决定一个主题是已经透出、藏待透，还是要等大运流年引动。</p>
      </div>
      <div className="symbol-grid branches-grid">
        {earthlyBranches.map(([name, element, season, hidden, note]) => (
          <article className="symbol-card branch-card" key={name}>
            <strong>{name}</strong>
            <span>{element} · {season}</span>
            <p>藏干：{hidden}</p>
            <small>{note}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function TenGods() {
  return (
    <section className="basics-module" id="ten-gods" aria-labelledby="ten-gods-title">
      <div className="section-heading">
        <p className="eyebrow">Ten Gods</p>
        <h2 id="ten-gods-title">十神</h2>
      </div>
      <div className="basics-lead">
        <p>十神以日主为中心，不是固定吉凶标签，而是五行生克关系落到人的行为动力和现实角色。</p>
      </div>
      <div className="ten-god-list">
        {tenGods.map(([name, relation, image, note]) => (
          <article className="ten-god-item" key={name}>
            <div>
              <strong>{name}</strong>
              <span>{relation}</span>
            </div>
            <p>{image}</p>
            <small>{note}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function StateRules() {
  return (
    <section className="state-rules" id="state-rules" aria-labelledby="state-rules-title">
      <div className="section-heading">
        <p className="eyebrow">Status Theory</p>
        <h2 id="state-rules-title">状态理论诀</h2>
      </div>
      <div className="rules-lead">
        <p>
          先判断一个字、一个十神、一个宫位处在什么状态，再判断它等待什么条件。分类占不是见字就断，而是看状态如何被运年触发。
        </p>
      </div>
      <div className="rule-groups">
        {stateRules.map((group) => (
          <article className="rule-group" id={`state-${group.title}`} key={group.title}>
            <h3>{group.title}</h3>
            <div className="rule-pairs">
              {group.items.map(([formula, meaning]) => (
                <div className="rule-pair" key={formula}>
                  <strong>{formula}</strong>
                  <span>{meaning}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Catalog() {
  return (
    <section className="catalog-section" id="catalog" aria-labelledby="catalog-title">
      <div className="section-heading">
        <p className="eyebrow">Catalog</p>
        <h2 id="catalog-title">分类目录</h2>
      </div>

      <div className="catalog-grid">
        {topicList.map(([key, topic]) => (
          <NavLink
            className={({ isActive }) => `topic ${isActive ? "is-active" : ""}`}
            data-topic={key}
            key={key}
            to={`/classified/${key}`}
          >
            <span className="topic-number">{topic.number}</span>
            <span className="topic-title">{topic.title}</span>
            <span className="topic-description">{topic.description}</span>
          </NavLink>
        ))}
      </div>
    </section>
  );
}

function TopicNav({ activeTopic }) {
  return (
    <nav className="topic-nav" aria-label="分类占类型">
      {topicList.map(([key, topic]) => (
        <NavLink className={key === activeTopic ? "is-active" : ""} key={key} to={`/classified/${key}`}>
          <span>{topic.number}</span>
          {topic.title}
        </NavLink>
      ))}
    </nav>
  );
}

function DetailPanel({ detail }) {
  return (
    <section className="detail-panel" id="divination" aria-live="polite">
      <div>
        <p className="eyebrow">当前分类占</p>
        <h2>{detail.title}</h2>
        <p id="detail-summary">{detail.summary}</p>
        {detail.divination.source ? (
          <a className="source-link" href={assetUrl(detail.divination.source)}>
            <ScrollText size={18} aria-hidden="true" />
            查看已写内容
          </a>
        ) : null}
      </div>
      <div className="detail-columns">
        <ListColumn title="核心问题" items={detail.questions} />
        <ListColumn title="文章栏目" items={detail.posts} />
      </div>
      <DivinationBoard divination={detail.divination} />
    </section>
  );
}

function DivinationBoard({ divination }) {
  return (
    <div className="divination-board">
      <div className="board-cell is-wide">
        <span>占什么</span>
        <p>{divination.ask}</p>
      </div>
      <BoardList title="看什么" items={divination.palaceStars} />
      <BoardList title="判断顺序" items={divination.sequence} ordered />
      <BoardList title="核心规则" items={divination.rules} />
    </div>
  );
}

function BoardList({ title, items, ordered = false }) {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <div className="board-cell">
      <span>{title}</span>
      <ListTag>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ListTag>
    </div>
  );
}

function ListColumn({ title, items }) {
  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function CaseStudies({ detail, items }) {
  const [preview, setPreview] = React.useState(null);

  React.useEffect(() => {
    if (!preview) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setPreview(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [preview]);

  return (
    <section className="case-studies" id="case-studies" aria-labelledby="case-studies-title">
      <div className="section-heading">
        <p className="eyebrow">Case Review</p>
        <h2 id="case-studies-title">{detail.title}案例复盘</h2>
      </div>
      <div className="case-lead">
        <p>案例按“原图、编号、标签、断点、反馈”收纳。同一案例可以进入多个分类，页面只显示当前分类相关案例。</p>
        <a className="source-link" href={assetUrl("/content/案例总索引.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看案例总索引
        </a>
        <a className="source-link" href={assetUrl("/assets/cases/manifest.tsv")}>
          <ScrollText size={18} aria-hidden="true" />
          查看全部原图清单
        </a>
      </div>
      <div className="case-grid">
        {items.map((item) => (
          <article className="case-card" key={item.id}>
            <div className="case-images" aria-label={`${item.id} 原图`}>
              {item.images.map((image, index) => (
                <button
                  aria-label={`查看${item.id} 原图 ${index + 1}`}
                  key={image}
                  onClick={() =>
                    setPreview({
                      alt: `${item.id} 原图 ${index + 1}`,
                      image,
                      title: item.title,
                      meta: `${item.id} · 第 ${index + 1} 张`
                    })
                  }
                  type="button"
                >
                  <img src={assetUrl(image)} alt={`${item.id} 原图 ${index + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
            <div className="case-card-header">
              <span>{item.id}</span>
              <Tags size={18} aria-hidden="true" />
            </div>
            <h3>{item.title}</h3>
            <div className="tag-list" aria-label={`${item.id} 标签`}>
              {item.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <p>{item.point}</p>
            <small>{item.feedback}</small>
          </article>
        ))}
      </div>
      {preview ? (
        <div className="image-modal" aria-label="案例原图预览" aria-modal="true" role="dialog">
          <button className="image-modal-backdrop" aria-label="关闭预览" onClick={() => setPreview(null)} type="button" />
          <div className="image-modal-panel">
            <div className="image-modal-header">
              <div>
                <span>{preview.meta}</span>
                <strong>{preview.title}</strong>
              </div>
              <button aria-label="关闭预览" className="image-modal-close" onClick={() => setPreview(null)} type="button">
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <img src={assetUrl(preview.image)} alt={preview.alt} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Method() {
  const steps = [
    ["定主题", "只问一个问题：婚姻、财运、事业或某一年发生什么。"],
    ["取宫位", "找到主题对应的宫位，比如夫妻宫、事业环境、年柱家庭源头。"],
    ["取十神", "找主题星：财、官杀、印、食伤、比劫，判断它们是否成气候。"],
    ["看结构", "分析生克、合冲刑害、清浊、流通、阻滞，而不是只数五行。"],
    ["落应期", "用大运流年判断什么时候被激活，并回到真实案例复盘。"]
  ];

  return (
    <section className="method" id="method" aria-labelledby="method-title">
      <div className="section-heading">
        <p className="eyebrow">Framework</p>
        <h2 id="method-title">每个分类都按这 5 步写</h2>
      </div>
      <ol className="steps">
        {steps.map(([title, text]) => (
          <li key={title}>
            <span>{title}</span>
            {text}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Roadmap() {
  return (
    <section className="roadmap" id="roadmap" aria-labelledby="roadmap-title">
      <div className="section-heading">
        <p className="eyebrow">Roadmap</p>
        <h2 id="roadmap-title">建议更新顺序</h2>
      </div>
      <div className="timeline">
        <p>
          <strong>第一阶段</strong>：先写性格底盘、事业职业、财运赚钱，建立读盘骨架。
        </p>
        <p>
          <strong>第二阶段</strong>：补婚姻感情、家庭六亲、学业成长，扩展人生主题。
        </p>
        <p>
          <strong>第三阶段</strong>：写大运流年、健康倾向和案例复盘，把静态判断变成动态判断。
        </p>
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
