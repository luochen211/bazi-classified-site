import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronRight, ScrollText, Tags, X } from "lucide-react";
import "./styles.css";
import WorkbenchPage from "./workbench/Workbench.jsx";

import {
  topics,
  topicList,
  basicsDirectoryItems,
  advancedDirectoryItems,
  grassrootsSystems,
  grassrootsRules,
  bodyImageSources,
  grassrootsCaseIds,
  readingMethodStages,
  readingMethodRules,
  readingReportSections,
  readingMethodCaseIds,
  stemClassicPrinciples,
  stemClassicEntries,
  stemClassicCaseIds,
  dayHourClassicPrinciples,
  dayHourClassicTables,
  dayHourClassicCaseIds,
  practiceFlow,
  pillarMeanings,
  seasonalWood,
  seasonalEarthIntro,
  seasonalEarth,
  seasonalFireIntro,
  seasonalFire,
  seasonalMetalIntro,
  seasonalMetal,
  seasonalWaterIntro,
  seasonalWater,
  seasonalImageGroups,
  stemBranchActions,
  fetalLifeBody,
  shenShaPrinciples,
  shenShaGroups,
  shenShaEntries,
  shenShaCaseIds,
  shenShaBasicPrinciples,
  shenShaBasicSections,
  shenShaBasicTranslations,
  shenShaBasicCaseIds,
  shenShaOriginPrinciples,
  shenShaOriginUses,
  shenShaOriginTexts,
  shenShaOriginCaseIds,
  healthRiskPrinciples,
  healthRiskSections,
  healthRiskWorkflow,
  healthRiskTranslations,
  healthRiskCaseIds,
  luckCycleLayers,
  luckCycleRules,
  luckCycleCaseIds,
  luckCycleTablePrinciples,
  luckCycleMonthHourTable,
  luckCycleDetailRules,
  luckCycleDetailCaseIds,
  luckCycleStructurePrinciples,
  luckCycleStructureSections,
  luckCycleStructureTranslations,
  luckCycleStructureCheckpoints,
  luckCycleStructureCaseIds,
  tenGodRulePrinciples,
  tenGodRuleCards,
  tenGodFamilyRules,
  tenGodRulesCaseIds,
  peerFoundationPrinciples,
  peerFoundationSections,
  peerFoundationComparisons,
  peerFoundationWorkflow,
  peerFoundationCaseIds,
  sealWealthFoundationPrinciples,
  sealWealthFoundationSections,
  sealWealthFoundationComparisons,
  sealWealthFoundationWorkflow,
  sealWealthFoundationCaseIds,
  officerKillingOrderPrinciples,
  officerKillingOrderSections,
  officerKillingOrderComparisons,
  officerKillingOrderWorkflow,
  officerKillingOrderCaseIds,
  fourSeeMissingGodPrinciples,
  fourSeeMissingGodSections,
  fourSeeMissingGodComparisons,
  fourSeeMissingGodWorkflow,
  fourSeeMissingGodCaseIds,
  practicalCombinationSections,
  practicalCombinationCaseIds,
  femaleChartSections,
  femaleChartCaseIds,
  femalePoemPrinciples,
  femalePoemRules,
  femalePoemExamples,
  femalePoemCaseIds,
  foodHurtOutputPrinciples,
  foodHurtOutputSections,
  foodHurtOutputComparisons,
  foodHurtOutputWorkflow,
  foodHurtOutputCaseIds,
  partialSealSpiritPrinciples,
  partialSealSpiritSections,
  partialSealSpiritComparisons,
  partialSealSpiritWorkflow,
  partialSealSpiritCaseIds,
  indirectWealthPrinciples,
  indirectWealthSections,
  indirectWealthComparisons,
  indirectWealthWorkflow,
  indirectWealthCaseIds,
  peerRobWealthPrinciples,
  peerRobWealthSections,
  peerRobWealthComparisons,
  peerRobWealthWorkflow,
  peerRobWealthCaseIds,
  patternFoundationPrinciples,
  patternFoundationSections,
  patternFoundationWorkflow,
  patternFoundationCaseIds,
  eightPatternPrinciples,
  eightPatternRows,
  eightPatternWorkflow,
  eightPatternTranslations,
  eightPatternCaseIds,
  patternUseGodSections,
  patternUseGodCaseIds,
  zipingThreeWavesPrinciples,
  zipingThreeWavesSections,
  zipingThreeWavesWarnings,
  zipingThreeWavesWorkflow,
  zipingThreeWavesCaseIds,
  jinLuckCyclePrinciples,
  jinLuckCycleSections,
  jinLuckCycleWarnings,
  jinLuckCycleWorkflow,
  jinLuckCycleCaseIds,
  useGodHistoryPrinciples,
  useGodHistorySections,
  useGodHistoryTranslations,
  useGodHistoryCaseIds,
  twoSidedUseGodPrinciples,
  twoSidedUseGodSections,
  twoSidedUseGodTranslations,
  twoSidedUseGodCaseIds,
  favorablePatternPrinciples,
  favorablePatternSections,
  favorablePatternTranslations,
  favorablePatternCaseIds,
  lifePalaceStars,
  lifePalaceCyclePrinciples,
  lifePalaceCycleSections,
  lifePalaceCycleFortunes,
  lifePalaceCycleWorkflow,
  lifePalaceCycleCaseIds,
  elementBasics,
  elementOverview,
  elementRelations,
  heavenlyStems,
  earthlyBranches,
  tenGods,
  tenGodRouteMeta,
  tenGodKeyByName,
  tenGodNameByKey,
  tenGodRawSections,
  tenGodFirstStageSections,
  tenGodAppliedSections,
  tenGodCombinationBreakpoints,
  stateRules,
  flowSections,
  caseStudies,
  caseNumber,
  tenGodCaseMap,
  tenGodCaseNotes
} from "./data/siteData.js";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <SiteShell />
    </BrowserRouter>
  );
}

function SiteShell() {
  const location = useLocation();
  const isWorkbench = location.pathname.startsWith("/workbench");

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
          <NavLink to="/cases">案例库</NavLink>
          <NavLink to="/workbench">工作台</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/basics" element={<BasicsPage />} />
        <Route path="/basics/practice-flow" element={<PracticeFlowPage />} />
        <Route path="/basics/elements/overview" element={<ElementOverviewPage />} />
        <Route path="/basics/elements/relations" element={<ElementRelationsPage />} />
        <Route path="/basics/elements/patterns" element={<ElementPatternsPage />} />
        <Route path="/basics/elements/seasonal-wood" element={<SeasonalWoodPage />} />
        <Route path="/basics/elements/seasonal-fire" element={<SeasonalFirePage />} />
        <Route path="/basics/elements/seasonal-earth" element={<SeasonalEarthPage />} />
        <Route path="/basics/elements/seasonal-metal" element={<SeasonalMetalPage />} />
        <Route path="/basics/elements/seasonal-water" element={<SeasonalWaterPage />} />
        <Route path="/basics/stems" element={<HeavenlyStemsPage />} />
        <Route path="/basics/branches" element={<EarthlyBranchesPage />} />
        <Route path="/basics/ten-gods" element={<Navigate to="/basics/ten-gods/zheng-yin" replace />} />
        <Route path="/basics/ten-gods/combinations" element={<TenGodCombinationsPage />} />
        <Route path="/basics/ten-gods/:godKey" element={<TenGodDetailPage />} />
        <Route path="/advanced" element={<AdvancedPage />} />
        <Route path="/advanced/flow" element={<FlowPage />} />
        <Route path="/advanced/stem-branch-actions" element={<StemBranchActionsPage />} />
        <Route path="/advanced/fetal-life-body" element={<FetalLifeBodyPage />} />
        <Route path="/advanced/shen-sha" element={<ShenShaPage />} />
        <Route path="/advanced/shen-sha-basics" element={<ShenShaBasicsPage />} />
        <Route path="/advanced/shen-sha-origin" element={<ShenShaOriginPage />} />
        <Route path="/advanced/health-risk" element={<HealthRiskPage />} />
        <Route path="/advanced/luck-cycle" element={<LuckCyclePage />} />
        <Route path="/advanced/life-palace-cycle" element={<LifePalaceCyclePage />} />
        <Route path="/advanced/luck-cycle-tables" element={<LuckCycleTablesPage />} />
        <Route path="/advanced/luck-cycle-structure" element={<LuckCycleStructurePage />} />
        <Route path="/advanced/jin-luck-cycle" element={<JinLuckCyclePage />} />
        <Route path="/advanced/ten-god-rules" element={<TenGodRulesPage />} />
        <Route path="/advanced/peer-foundation" element={<PeerFoundationPage />} />
        <Route path="/advanced/peer-rob-wealth" element={<PeerRobWealthPage />} />
        <Route path="/advanced/food-hurt-output" element={<FoodHurtOutputPage />} />
        <Route path="/advanced/partial-seal-spirit" element={<PartialSealSpiritPage />} />
        <Route path="/advanced/indirect-wealth" element={<IndirectWealthPage />} />
        <Route path="/advanced/seal-wealth-foundation" element={<SealWealthFoundationPage />} />
        <Route path="/advanced/officer-killing-order" element={<OfficerKillingOrderPage />} />
        <Route path="/advanced/four-see-missing-god" element={<FourSeeMissingGodPage />} />
        <Route path="/advanced/practical-combinations" element={<PracticalCombinationsPage />} />
        <Route path="/advanced/stem-classics" element={<StemClassicsPage />} />
        <Route path="/advanced/day-hour-classics" element={<DayHourClassicsPage />} />
        <Route path="/advanced/reading-method" element={<ReadingMethodPage />} />
        <Route path="/advanced/grassroots-method" element={<GrassrootsMethodPage />} />
        <Route path="/advanced/female-chart" element={<FemaleChartPage />} />
        <Route path="/advanced/female-chart-poems" element={<FemalePoemsPage />} />
        <Route path="/advanced/pattern-foundation" element={<PatternFoundationPage />} />
        <Route path="/advanced/eight-patterns" element={<EightPatternsPage />} />
        <Route path="/advanced/ziping-three-waves" element={<ZipingThreeWavesPage />} />
        <Route path="/advanced/pattern-use-god" element={<PatternUseGodPage />} />
        <Route path="/advanced/use-god-history" element={<UseGodHistoryPage />} />
        <Route path="/advanced/two-sided-use-god" element={<TwoSidedUseGodPage />} />
        <Route path="/advanced/favorable-patterns" element={<FavorablePatternsPage />} />
        <Route path="/cases" element={<CaseLibraryPage />} />
        <Route path="/classified" element={<ClassifiedIndexPage />} />
        <Route path="/classified/:topicKey" element={<ClassifiedTopicPage />} />
        <Route path="/workbench" element={<WorkbenchPage />} />
      </Routes>

      {!isWorkbench ? (
        <footer className="footer">
          <p>八字分类占内容库 · 先建基础，再进阶，最后分类占。</p>
        </footer>
      ) : null}
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
    <BasicsLayout title="基础篇" copy="先把五行、十天干、十二地支、十神的基础关系看明白，再进入状态和分类占。">
      <BasicsIndex />
    </BasicsLayout>
  );
}

function PracticeFlowPage() {
  return (
    <BasicsLayout title="实战流程" copy="先立日元太极点，再定月令气候与用神基调，最后用四柱宫位和大运流年落到事件。">
      <PracticeFlow />
    </BasicsLayout>
  );
}

function ElementOverviewPage() {
  return (
    <BasicsLayout title="五行总论" copy="五行先看木、火、土、金、水各自代表什么气，再看它在命局里是太过、不及，还是可用。">
      <ElementOverview />
    </BasicsLayout>
  );
}

function ElementRelationsPage() {
  return (
    <BasicsLayout title="生克关系" copy="生克不是简单吉凶。生是来源，克是约束，太过和不及都会让象发生变化。">
      <ElementRelations />
    </BasicsLayout>
  );
}

function ElementPatternsPage() {
  return (
    <BasicsLayout title="五行象法" copy="水多木浮、木多火塞这类口诀，属于五行生克太过、不及之后形成的具体象。">
      <ElementPatterns />
    </BasicsLayout>
  );
}

function SeasonalWoodPage() {
  return (
    <BasicsLayout title="四季取用：木" copy="木的取用不能离开月份气候：春木重温养扎根，夏木重润燥，秋木重固本成器，冬木重暖土筑堤。">
      <SeasonalWood />
    </BasicsLayout>
  );
}

function SeasonalFirePage() {
  return (
    <BasicsLayout title="四季取用：火" copy="火的价值在文明传达与光明照耀，但四季火势有强弱：春火要显，夏火要济，秋火要载，冬火要生。">
      <SeasonalFire />
    </BasicsLayout>
  );
}

function SeasonalEarthPage() {
  return (
    <BasicsLayout title="四季取用：土" copy="土的价值在承载孕育，但四季状态不同：春土培木，夏土润燥，秋土育金，冬土暖藏防水。">
      <SeasonalEarth />
    </BasicsLayout>
  );
}

function SeasonalMetalPage() {
  return (
    <BasicsLayout title="四季取用：金" copy="金重收敛成器，春金先立身，夏金怕火逼，秋金可火炼水淘，冬金要火土护持。">
      <SeasonalMetal />
    </BasicsLayout>
  );
}

function SeasonalWaterPage() {
  return (
    <BasicsLayout title="四季取用：水" copy="水贵有源、有度、有去处。春防泛滥，夏防枯竭，秋防过旺，冬重火土成既济。">
      <SeasonalWater />
    </BasicsLayout>
  );
}

function HeavenlyStemsPage() {
  return (
    <BasicsLayout title="十天干" copy="天干看外显之气。透在天上，事情容易被看见；有没有根，要回到地支判断。">
      <HeavenlyStems />
    </BasicsLayout>
  );
}

function EarthlyBranchesPage() {
  return (
    <BasicsLayout title="十二地支" copy="地支看根基、环境与暗线。支中藏干决定主题是已显、藏待透，还是等待引动。">
      <EarthlyBranches />
    </BasicsLayout>
  );
}

function TenGodDetailPage() {
  const { godKey } = useParams();
  const godName = tenGodNameByKey[godKey];
  const god = tenGods.find(([name]) => name === godName);

  if (!god) {
    return <Navigate to="/basics/ten-gods" replace />;
  }

  return (
    <BasicsLayout title={godName} copy={`${godName}独立页：完整落地六亲取象、心性喜忌、十神功能、其他含义和柱位提示。`}>
      <TenGodDetail god={god} />
    </BasicsLayout>
  );
}

function TenGodCombinationsPage() {
  return (
    <BasicsLayout
      title="十神组合断点"
      copy="把散在讲义里的过多、坐空亡、羊刃、枭神夺食、食伤克官等细则，整理成可查、可复盘、可连接案例的组合卡片。"
    >
      <TenGodCombinations />
    </BasicsLayout>
  );
}

function BasicsLayout({ title, copy, children }) {
  return (
    <main className="page-shell">
      <PageHeader eyebrow="Basics" title={title} copy={copy} />
      <ContentLayout title="基础篇目录" items={basicsDirectoryItems}>
        {children}
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
        items={advancedDirectoryItems.map((item) => ({
          ...item,
          href: item.href === "/advanced" ? "#state-rules" : item.href,
          active: item.href === "/advanced"
        }))}
      >
        <StateRules />
        <Method />
      </ContentLayout>
    </main>
  );
}

function FlowPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Flow"
        title="流通"
        copy="流通看命局里的气能不能从源头走到结果：有源、有路、有承载，才是真正能成事。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/flow" })),
          ...flowSections.map((section) => ({ label: section.title, href: `#flow-${section.title}` }))
        ]}
      >
        <FlowTheory />
      </ContentLayout>
    </main>
  );
}

function StemBranchActionsPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Actions"
        title="干支作用"
        copy="干支作用先看会合成势，再看冲刑害破如何引动宫位。合能成事，也能合走；冲能破局，也能冲开。"
      />
      <ContentLayout title="进阶目录" items={advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/stem-branch-actions" }))}>
        <StemBranchActions />
      </ContentLayout>
    </main>
  );
}

function FetalLifeBodyPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Palace"
        title="胎命身"
        copy="胎元看先天秉气，命宫看后天自我，身宫看财帛行运。它们不是主线断法，但能补充体质、房产、人际和财运侧面。"
      />
      <ContentLayout title="进阶目录" items={advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/fetal-life-body" }))}>
        <FetalLifeBody />
      </ContentLayout>
    </main>
  );
}

function ShenShaPage() {
  const shenShaCases = shenShaCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Shen Sha"
        title="神煞"
        copy="神煞不是单独论吉凶的标签，而是补足事件类型、风险形态和古法源流的辅助系统。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/shen-sha" })),
          ...shenShaGroups.map((group) => ({ label: group.title, href: `#shen-sha-${group.title}` })),
          { label: "具体条目库", href: "#shen-sha-entries" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <ShenSha />
        <CaseStudies detail={{ title: "神煞" }} items={shenShaCases} />
      </ContentLayout>
    </main>
  );
}

function ShenShaBasicsPage() {
  const basicCases = shenShaBasicCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Shen Sha Basics"
        title="神煞入门"
        copy="把传承班里的桃花、驿马、贵人、天月德讲法整理成入门纠偏：神煞先看现象，再看和日主的克入克出。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/shen-sha-basics" })),
          { label: "四个原则", href: "#shen-sha-basic-principles" },
          ...shenShaBasicSections.map((section) => ({ label: section.title, href: `#shen-sha-basic-${section.title}` })),
          { label: "现实转译", href: "#shen-sha-basic-translations" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <ShenShaBasics />
        <CaseStudies detail={{ title: "神煞入门" }} items={basicCases} />
      </ContentLayout>
    </main>
  );
}

function ShenShaOriginPage() {
  const originCases = shenShaOriginCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Shen Sha Origin"
        title="神煞源流"
        copy="神煞不是一套单一规则，而是两千年卦理、历法、统计、字形、数理与特殊排列的混合体系。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/shen-sha-origin" })),
          { label: "八种成因", href: "#shen-origin-principles" },
          { label: "使用边界", href: "#shen-origin-uses" },
          { label: "古籍源流", href: "#shen-origin-texts" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <ShenShaOrigin />
        <CaseStudies detail={{ title: "神煞源流" }} items={originCases} />
      </ContentLayout>
    </main>
  );
}

function HealthRiskPage() {
  const healthCases = healthRiskCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Health Risk"
        title="健康风险"
        copy="把神煞、十神、调候、岁运里的健康和灾厄内容改写成风险提示、触发条件和案例复盘，不做医学诊断。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/health-risk" })),
          { label: "边界原则", href: "#health-risk-principles" },
          { label: "风险类型", href: "#health-risk-flow" },
          { label: "复盘流程", href: "#health-risk-workflow" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <HealthRisk />
        <CaseStudies detail={{ title: "健康风险" }} items={healthCases} />
      </ContentLayout>
    </main>
  );
}

function LuckCyclePage() {
  const luckCases = luckCycleCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Luck Cycle"
        title="大运流年"
        copy="原局埋伏，大运成势，流年触发，流月落点。应期不是看单一年份，而是看四层如何接力。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/luck-cycle" })),
          ...luckCycleRules.map((rule) => ({ label: rule.title, href: `#luck-${rule.title}` })),
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <LuckCycle />
        <CaseStudies detail={{ title: "大运流年" }} items={luckCases} />
      </ContentLayout>
    </main>
  );
}

function LifePalaceCyclePage() {
  const palaceCases = lifePalaceCycleCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Life Palace"
        title="命宫流年"
        copy="把《大流年判例》的命宫查法、十二星、命坐十二运和岁运冲刑，接到胎命身与大运流年的判断流程。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/life-palace-cycle" })),
          { label: "使用原则", href: "#life-palace-principles" },
          ...lifePalaceCycleSections.map((section) => ({ label: section.title, href: `#life-palace-${section.title}` })),
          { label: "十二星表", href: "#life-palace-stars-table" },
          { label: "十二运转译", href: "#life-palace-fortunes" },
          { label: "判断流程", href: "#life-palace-workflow" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <LifePalaceCycle />
        <CaseStudies detail={{ title: "命宫流年" }} items={palaceCases} />
      </ContentLayout>
    </main>
  );
}

function LuckCycleTablesPage() {
  const detailCases = luckCycleDetailCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Flow Tables"
        title="流年细表"
        copy="把《大流年判例》里的月时对查、双边喜忌、运岁流月和神煞流年拆成可检索的细表。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/luck-cycle-tables" })),
          { label: "使用边界", href: "#luck-table-principles" },
          { label: "月时对查", href: "#luck-month-hour" },
          { label: "运岁规则", href: "#luck-detail-rules" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <LuckCycleTables />
        <CaseStudies detail={{ title: "流年细表" }} items={detailCases} />
      </ContentLayout>
    </main>
  );
}

function LuckCycleStructurePage() {
  const structureCases = luckCycleStructureCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Year Structure"
        title="流年架构"
        copy="承接传承班流年部分：把新旧事、四正四生四库、流月大运、三合会透干和填实拱冲拆成可复盘的判断链。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/luck-cycle-structure" })),
          { label: "架构原则", href: "#luck-structure-principles" },
          { label: "流年断点", href: "#luck-structure-flow" },
          { label: "九个方面", href: "#luck-structure-checkpoints" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <LuckCycleStructure />
        <CaseStudies detail={{ title: "流年架构" }} items={structureCases} />
      </ContentLayout>
    </main>
  );
}

function TenGodRulesPage() {
  const ruleCases = tenGodRulesCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Ten Gods"
        title="十神细则"
        copy="把《命学精华》的十神过多、同柱、空亡、十二运和六亲定位整理成可检索的进阶规则。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/ten-god-rules" })),
          { label: "使用边界", href: "#ten-god-rule-principles" },
          { label: "十神细则", href: "#ten-god-rule-cards" },
          { label: "六亲定位", href: "#ten-god-family-rules" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <TenGodRules />
        <CaseStudies detail={{ title: "十神细则" }} items={ruleCases} />
      </ContentLayout>
    </main>
  );
}

function PeerFoundationPage() {
  const peerFoundationCases = peerFoundationCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Peer Foundation"
        title="比肩入门"
        copy="把第一、二节开章提要和比肩拆成学习边界、神煞生克、本运太岁、比肩扶身、过多和柱位年限。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/peer-foundation" })),
          { label: "判断原则", href: "#peer-foundation-principles" },
          ...peerFoundationSections.map((section) => ({ label: section.title, href: `#peer-foundation-${section.title}` })),
          { label: "四类对照", href: "#peer-foundation-comparisons" },
          { label: "判断流程", href: "#peer-foundation-workflow" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <PeerFoundation />
        <CaseStudies detail={{ title: "比肩入门" }} items={peerFoundationCases} />
      </ContentLayout>
    </main>
  );
}

function PeerRobWealthPage() {
  const peerCases = peerRobWealthCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Peer Wealth"
        title="比劫禄刃"
        copy="把第三节劫财、羊刃拆成成重标准、柱位年限、建禄羊刃、比劫扶身和六亲财务的实务判断。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/peer-rob-wealth" })),
          { label: "判断原则", href: "#peer-rob-principles" },
          ...peerRobWealthSections.map((section) => ({ label: section.title, href: `#peer-rob-${section.title}` })),
          { label: "四类对照", href: "#peer-rob-comparisons" },
          { label: "判断流程", href: "#peer-rob-workflow" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <PeerRobWealth />
        <CaseStudies detail={{ title: "比劫禄刃" }} items={peerCases} />
      </ContentLayout>
    </main>
  );
}

function FoodHurtOutputPage() {
  const foodHurtCases = foodHurtOutputCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Food Hurt"
        title="食伤坐引"
        copy="把第八节食神、伤官拆成坐引流程、性格差异、女命子息、格局喜忌和单项问事的实务判断。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/food-hurt-output" })),
          { label: "判断原则", href: "#food-hurt-principles" },
          ...foodHurtOutputSections.map((section) => ({ label: section.title, href: `#food-hurt-${section.title}` })),
          { label: "四类对照", href: "#food-hurt-comparisons" },
          { label: "判断流程", href: "#food-hurt-workflow" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <FoodHurtOutput />
        <CaseStudies detail={{ title: "食伤坐引" }} items={foodHurtCases} />
      </ContentLayout>
    </main>
  );
}

function PartialSealSpiritPage() {
  const partialSealCases = partialSealSpiritCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Partial Seal"
        title="偏印枭神"
        copy="把第五节偏印拆成正偏印分野、同性相生、枭神夺食、财制偏印、柱位年限和偏印格喜忌。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/partial-seal-spirit" })),
          { label: "判断原则", href: "#partial-seal-principles" },
          ...partialSealSpiritSections.map((section) => ({ label: section.title, href: `#partial-seal-${section.title}` })),
          { label: "四类对照", href: "#partial-seal-comparisons" },
          { label: "判断流程", href: "#partial-seal-workflow" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <PartialSealSpirit />
        <CaseStudies detail={{ title: "偏印枭神" }} items={partialSealCases} />
      </ContentLayout>
    </main>
  );
}

function IndirectWealthPage() {
  const indirectWealthCases = indirectWealthCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Indirect Wealth"
        title="偏财机会"
        copy="把第六节偏财格拆成机会财、父亲偏缘、柱位年限、坐引禄绝、单向生克和偏财格喜忌。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/indirect-wealth" })),
          { label: "判断原则", href: "#indirect-wealth-principles" },
          ...indirectWealthSections.map((section) => ({ label: section.title, href: `#indirect-wealth-${section.title}` })),
          { label: "四类对照", href: "#indirect-wealth-comparisons" },
          { label: "判断流程", href: "#indirect-wealth-workflow" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <IndirectWealth />
        <CaseStudies detail={{ title: "偏财机会" }} items={indirectWealthCases} />
      </ContentLayout>
    </main>
  );
}

function SealWealthFoundationPage() {
  const sealWealthCases = sealWealthFoundationCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Seal Wealth"
        title="正印正财"
        copy="把第九节正印、正财拆成市民实务、母亲妻财、财印相战、顺用格局、柱位年限和案例复盘。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/seal-wealth-foundation" })),
          { label: "判断原则", href: "#seal-wealth-principles" },
          ...sealWealthFoundationSections.map((section) => ({ label: section.title, href: `#seal-wealth-${section.title}` })),
          { label: "四类对照", href: "#seal-wealth-comparisons" },
          { label: "判断流程", href: "#seal-wealth-workflow" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <SealWealthFoundation />
        <CaseStudies detail={{ title: "正印正财" }} items={sealWealthCases} />
      </ContentLayout>
    </main>
  );
}

function OfficerKillingOrderPage() {
  const officerCases = officerKillingOrderCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Officer Killing"
        title="官杀秩序"
        copy="把第七节正官、七杀拆成规则压力、官杀混杂、夫子兴衰、反克制化、贵人神煞和案例复盘。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/officer-killing-order" })),
          { label: "判断原则", href: "#officer-killing-principles" },
          ...officerKillingOrderSections.map((section) => ({ label: section.title, href: `#officer-killing-${section.title}` })),
          { label: "四类对照", href: "#officer-killing-comparisons" },
          { label: "判断流程", href: "#officer-killing-workflow" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <OfficerKillingOrder />
        <CaseStudies detail={{ title: "官杀秩序" }} items={officerCases} />
      </ContentLayout>
    </main>
  );
}

function FourSeeMissingGodPage() {
  const fourSeeCases = fourSeeMissingGodCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Four See"
        title="四见缺一"
        copy="把第二层次的四见、多根、三式合论和十神缺一拆成可判断的结构：先分入格与多根，再看缺的一神能否被岁运补出。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/four-see-missing-god" })),
          { label: "判断原则", href: "#four-see-principles" },
          ...fourSeeMissingGodSections.map((section) => ({ label: section.title, href: `#four-see-${section.title}` })),
          { label: "四类对照", href: "#four-see-comparisons" },
          { label: "判断流程", href: "#four-see-workflow" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <FourSeeMissingGod />
        <CaseStudies detail={{ title: "四见缺一" }} items={fourSeeCases} />
      </ContentLayout>
    </main>
  );
}

function PracticalCombinationsPage() {
  const combinationCases = practicalCombinationCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Combinations"
        title="实务组合"
        copy="第二层次重点不在背更多名词，而是看生旺库、罗网、四见、拱夹如何在运岁里成事。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/practical-combinations" })),
          ...practicalCombinationSections.map((section) => ({ label: section.title, href: `#combination-${section.title}` })),
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <PracticalCombinations />
        <CaseStudies detail={{ title: "实务组合" }} items={combinationCases} />
      </ContentLayout>
    </main>
  );
}

function StemClassicsPage() {
  const stemCases = stemClassicCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Stem Classics"
        title="十干高级"
        copy="把《天元巫咸经》的十干注释转成现代读盘入口：秀、通月气、四见、合神、禄旺和案例承接。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/stem-classics" })),
          { label: "古法总纲", href: "#stem-classic-principles" },
          ...stemClassicEntries.map((entry) => ({ label: `${entry.stem}${entry.element}`, href: `#stem-classic-${entry.stem}` })),
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <StemClassics />
        <CaseStudies detail={{ title: "十干高级" }} items={stemCases} />
      </ContentLayout>
    </main>
  );
}

function DayHourClassicsPage() {
  const dayHourCases = dayHourClassicCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Day Hour"
        title="日时组合"
        copy="把《天元巫咸经》十干日时统计拆成可查表：先看时柱晚年承接，再回到月气、调候、财官印贵人与案例反馈。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/day-hour-classics" })),
          { label: "使用原则", href: "#day-hour-principles" },
          ...dayHourClassicTables.map((table) => ({ label: `${table.stem}日`, href: `#day-hour-${table.stem}` })),
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <DayHourClassics />
        <CaseStudies detail={{ title: "日时组合" }} items={dayHourCases} />
      </ContentLayout>
    </main>
  );
}

function ReadingMethodPage() {
  const methodCases = readingMethodCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Reading Method"
        title="学习批命"
        copy="第二层次不只是更多术语，而是把基础常识转成实务流程：怎样学习，怎样下判断，怎样写一份完整批命。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/reading-method" })),
          { label: "学习阶段", href: "#reading-stages" },
          ...readingMethodRules.map((rule) => ({ label: rule.title, href: `#reading-rule-${rule.title}` })),
          { label: "批命例式", href: "#reading-report" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <ReadingMethod />
        <CaseStudies detail={{ title: "学习批命" }} items={methodCases} />
      </ContentLayout>
    </main>
  );
}

function GrassrootsMethodPage() {
  const methodCases = grassrootsCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Grassroots Method"
        title="基层命学"
        copy="第十一、十二节把财官论、格局论、十神定位论分开：三者术语相同，层次不同，不能混成一套话。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/grassroots-method" })),
          ...grassrootsSystems.map((system) => ({ label: system.title, href: `#grassroots-${system.title}` })),
          { label: "实务提要", href: "#grassroots-rules" },
          { label: "干支体象", href: "#body-image-sources" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <GrassrootsMethod />
        <CaseStudies detail={{ title: "基层命学" }} items={methodCases} />
      </ContentLayout>
    </main>
  );
}

function FemaleChartPage() {
  const femaleCases = femaleChartCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Female Chart"
        title="女命专题"
        copy="女命不只看夫星。夫星清浊、食伤子女、财印承接、婚姻宫岁运，要合在一张图里看。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/female-chart" })),
          ...femaleChartSections.map((section) => ({ label: section.title, href: `#female-${section.title}` })),
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <FemaleChart />
        <CaseStudies detail={{ title: "女命专题" }} items={femaleCases} />
      </ContentLayout>
    </main>
  );
}

function FemalePoemsPage() {
  const poemCases = femalePoemCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Female Rules"
        title="女命诗诀"
        copy="把传承班里的女命诗诀拆成夫星、子息、官杀混杂、暗夫拱夹和岁运问事的细则。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/female-chart-poems" })),
          { label: "使用边界", href: "#female-poem-principles" },
          { label: "诗诀细则", href: "#female-poem-rules" },
          { label: "现实转译", href: "#female-poem-examples" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <FemalePoems />
        <CaseStudies detail={{ title: "女命诗诀" }} items={poemCases} />
      </ContentLayout>
    </main>
  );
}

function PatternFoundationPage() {
  const foundationCases = patternFoundationCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Pattern Foundation"
        title="格局基础"
        copy="把特别格、通根透藏、十干禄绝、根轻根重和五种用神先讲清楚，避免一上来就困在身强身弱。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/pattern-foundation" })),
          { label: "基础原则", href: "#pattern-foundation-principles" },
          ...patternFoundationSections.map((section) => ({ label: section.title, href: `#pattern-foundation-${section.title}` })),
          { label: "实务流程", href: "#pattern-foundation-workflow" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <PatternFoundation />
        <CaseStudies detail={{ title: "格局基础" }} items={foundationCases} />
      </ContentLayout>
    </main>
  );
}

function EightPatternsPage() {
  const patternCases = eightPatternCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Eight Patterns"
        title="八格总论"
        copy="把正官、财、正印、食神、伤官、偏印、七杀、羊刃拆成顺逆用、破格和现实转译，作为格局用神页的前置入口。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/eight-patterns" })),
          { label: "总原则", href: "#eight-pattern-principles" },
          ...eightPatternRows.map((row) => ({ label: row.title, href: `#eight-pattern-${row.title}` })),
          { label: "判断流程", href: "#eight-pattern-workflow" },
          { label: "现实转译", href: "#eight-pattern-translations" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <EightPatterns />
        <CaseStudies detail={{ title: "八格总论" }} items={patternCases} />
      </ContentLayout>
    </main>
  );
}

function PatternUseGodPage() {
  const patternCases = patternUseGodCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Pattern"
        title="格局用神"
        copy="格局、调候、扶抑、休囚、四联合参，是为了找到结构最卡的地方，不是为了背一个万能用神。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/pattern-use-god" })),
          ...patternUseGodSections.map((section) => ({ label: section.title, href: `#pattern-${section.title}` })),
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <PatternUseGod />
        <CaseStudies detail={{ title: "格局用神" }} items={patternCases} />
      </ContentLayout>
    </main>
  );
}

function ZipingThreeWavesPage() {
  const waveCases = zipingThreeWavesCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Three Waves"
        title="子平三波限"
        copy="把第三阶段的学习瓶颈拆成三层：基础法则熟练、日主格局双边冲突、临界定义与格局休囚。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/ziping-three-waves" })),
          { label: "四个原则", href: "#three-waves-principles" },
          ...zipingThreeWavesSections.map((section) => ({ label: section.title, href: `#three-waves-${section.title}` })),
          { label: "误区边界", href: "#three-waves-warnings" },
          { label: "判断流程", href: "#three-waves-workflow" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <ZipingThreeWaves />
        <CaseStudies detail={{ title: "子平三波限" }} items={waveCases} />
      </ContentLayout>
    </main>
  );
}

function JinLuckCyclePage() {
  const jinCases = jinLuckCycleCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Luck Cycle"
        title="金氏大运"
        copy="把第三阶段摘抄2与第二层次金不换大运，整理成大运地支、月令临界、顺逆运和墓库停滞的判断模块。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/jin-luck-cycle" })),
          { label: "四个原则", href: "#jin-luck-principles" },
          ...jinLuckCycleSections.map((section) => ({ label: section.title, href: `#jin-luck-${section.title}` })),
          { label: "误区边界", href: "#jin-luck-warnings" },
          { label: "判断流程", href: "#jin-luck-workflow" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <JinLuckCycle />
        <CaseStudies detail={{ title: "金氏大运" }} items={jinCases} />
      </ContentLayout>
    </main>
  );
}

function UseGodHistoryPage() {
  const historyCases = useGodHistoryCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Method"
        title="用神沿革"
        copy="把《渊海随笔》里的禄命史观、明清异同、格局即用神、支藏生旺库，整理成读盘时能落地的方法边界。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/use-god-history" })),
          { label: "四个入口", href: "#use-god-history-principles" },
          ...useGodHistorySections.map((section) => ({ label: section.title, href: `#use-god-history-${section.title}` })),
          { label: "实务转译", href: "#use-god-history-translations" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <UseGodHistory />
        <CaseStudies detail={{ title: "用神沿革" }} items={historyCases} />
      </ContentLayout>
    </main>
  );
}

function TwoSidedUseGodPage() {
  const twoSidedCases = twoSidedUseGodCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Method"
        title="双边用神"
        copy="把《渊海随笔》的双边用神拆成日主、格局、调停三层：一个用神不能替代所有判断。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/two-sided-use-god" })),
          { label: "四个原则", href: "#two-sided-use-god-principles" },
          ...twoSidedUseGodSections.map((section) => ({ label: section.title, href: `#two-sided-use-god-${section.title}` })),
          { label: "现实转译", href: "#two-sided-use-god-translations" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <TwoSidedUseGod />
        <CaseStudies detail={{ title: "双边用神" }} items={twoSidedCases} />
      </ContentLayout>
    </main>
  );
}

function FavorablePatternsPage() {
  const patternCases = favorablePatternCaseIds.map((id) => caseStudies.find((item) => item.id === id)).filter(Boolean);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Advanced / Pattern"
        title="顺用格局"
        copy="把传承班里的正官格、财格、印格、食伤生财整理成顺用格判断：先看能否成格，再看有没有破格和通关。"
      />
      <ContentLayout
        title="进阶目录"
        items={[
          ...advancedDirectoryItems.map((item) => ({ ...item, active: item.href === "/advanced/favorable-patterns" })),
          { label: "四个原则", href: "#favorable-pattern-principles" },
          ...favorablePatternSections.map((section) => ({ label: section.title, href: `#favorable-pattern-${section.title}` })),
          { label: "实务转译", href: "#favorable-pattern-translations" },
          { label: "案例复盘", href: "#case-studies" }
        ]}
      >
        <FavorablePatterns />
        <CaseStudies detail={{ title: "顺用格局" }} items={patternCases} />
      </ContentLayout>
    </main>
  );
}

function CaseLibraryPage() {
  const allCases = [...caseStudies].sort((a, b) => caseNumber(a.id) - caseNumber(b.id));

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Case Library"
        title="案例库"
        copy="所有原始案例图片统一归档在这里。专题页会抽取其中一部分，案例库保留完整原图入口。"
      />
      <ContentLayout
        title="案例目录"
        items={[
          { label: "全部案例", href: "#case-studies" },
          { label: "案例总索引", href: assetUrl("/content/案例总索引.md") },
          { label: "原图清单", href: assetUrl("/assets/cases/manifest.tsv") }
        ]}
      >
        <CaseStudies detail={{ title: "全部案例" }} items={allCases} />
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
  const location = useLocation();
  const currentHref = `${location.pathname}${location.hash}`;

  const compactLocalAnchors = (directoryItems) => {
    if (title !== "进阶目录") {
      return directoryItems;
    }

    const localAnchors = directoryItems.filter((item) => !item.href.startsWith("/") && !item.children);
    if (localAnchors.length < 2) {
      return directoryItems;
    }

    return [
      ...directoryItems.filter((item) => item.href.startsWith("/") || item.children),
      { label: "本页内容", href: localAnchors[0].href, children: localAnchors }
    ];
  };

  const directoryItems = compactLocalAnchors(items);

  const itemMatchesCurrent = (item) =>
    item.active ||
    item.href === currentHref ||
    item.href === location.pathname ||
    item.href === location.hash;

  const renderDirectoryItem = (item) => {
    const isCurrent = itemMatchesCurrent(item) || item.children?.some(itemMatchesCurrent);
    const link = item.href.startsWith("/") ? (
      <NavLink className={() => (isCurrent ? "is-active" : "")} end to={item.href}>
        {item.label}
      </NavLink>
    ) : (
      <a className={isCurrent ? "is-active" : ""} href={item.href}>
        {item.label}
      </a>
    );

    return (
      <div className="directory-item" key={item.href}>
        {link}
        {item.children ? (
          <div className="directory-children">
            {item.children.map((child) =>
              child.href.startsWith("/") ? (
                <NavLink
                  className={() => (itemMatchesCurrent(child) ? "is-active" : "")}
                  end
                  key={child.href}
                  to={child.href}
                >
                  {child.label}
                </NavLink>
              ) : (
                <a className={itemMatchesCurrent(child) ? "is-active" : ""} key={child.href} href={child.href}>
                  {child.label}
                </a>
              )
            )}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="content-layout">
      <aside className="side-directory">
        <h2>{title}</h2>
        <nav aria-label={title}>{directoryItems.map(renderDirectoryItem)}</nav>
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
          <strong>5</strong> 组神煞资料
        </span>
        <span>
          <strong>68</strong> 个案例归档
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
      copy: "状态理论诀、流通、干支作用、胎命身、神煞与五步框架。"
    },
    {
      title: "分类占",
      href: "/classified",
      eyebrow: "Classified",
      copy: "婚姻、财运、事业、学业、六亲、健康、大运流年。"
    },
    {
      title: "案例库",
      href: "/cases",
      eyebrow: "Cases",
      copy: "68 个原始案例编号、88 张原图统一归档，专题页按需要抽取复盘。"
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

function BasicsIndex() {
  const entries = [
    {
      title: "实战流程",
      href: "/basics/practice-flow",
      eyebrow: "Practice",
      copy: "从日元太极点、月令气候、四柱宫位到岁运触发，建立实战判断顺序。"
    },
    {
      title: "五行总论",
      href: "/basics/elements/overview",
      eyebrow: "Five Elements",
      copy: "木火土金水各自代表什么气，先建立五行的基本象。"
    },
    {
      title: "生克关系",
      href: "/basics/elements/relations",
      eyebrow: "Relations",
      copy: "相生、相克、太过、不及，是后面所有判断的底层结构。"
    },
    {
      title: "五行象法",
      href: "/basics/elements/patterns",
      eyebrow: "Patterns",
      copy: "水多木浮、木多火塞等，归在五行太过与不及的具体象。"
    },
    {
      title: "四季木",
      href: "/basics/elements/seasonal-wood",
      eyebrow: "Seasonal",
      copy: "春木温养扎根，夏木润燥，秋木固本成器，冬木暖土筑堤。"
    },
    {
      title: "四季火",
      href: "/basics/elements/seasonal-fire",
      eyebrow: "Seasonal",
      copy: "丙重壬水映照，丁重甲木为载，四季先看火势强弱。"
    },
    {
      title: "四季土",
      href: "/basics/elements/seasonal-earth",
      eyebrow: "Seasonal",
      copy: "春土培木，夏土润燥，秋土育金，冬土暖藏防水。"
    },
    {
      title: "四季金",
      href: "/basics/elements/seasonal-metal",
      eyebrow: "Seasonal",
      copy: "春金立身，夏金润照，秋金火炼水淘，冬金火土护持。"
    },
    {
      title: "四季水",
      href: "/basics/elements/seasonal-water",
      eyebrow: "Seasonal",
      copy: "水贵有源，有土不泛，有火成既济，有木成去处。"
    },
    {
      title: "十天干",
      href: "/basics/stems",
      eyebrow: "Stems",
      copy: "天干看外显之气，先定阴阳五行，再看有没有根。"
    },
    {
      title: "十二地支",
      href: "/basics/branches",
      eyebrow: "Branches",
      copy: "地支看根基、环境与暗线，支中藏干决定主题如何被引动。"
    },
    {
      title: "十神",
      href: "/basics/ten-gods",
      eyebrow: "Ten Gods",
      copy: "十神不是吉凶标签，而是以日主为中心的行为动力。"
    }
  ];

  return (
    <section className="home-entries basics-index" aria-labelledby="basics-index-title">
      <div className="section-heading">
        <p className="eyebrow">Basics Index</p>
        <h2 id="basics-index-title">基础篇目录</h2>
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

function PracticeFlow() {
  return (
    <section className="basics-module" id="practice-flow" aria-labelledby="practice-flow-title">
      <div className="section-heading">
        <p className="eyebrow">Practice Flow</p>
        <h2 id="practice-flow-title">实战判断流程</h2>
      </div>
      <div className="basics-lead">
        <p>实战不是见一个字就断，而是先定“我”和环境，再看四柱宫位、十神六亲、岁运触发。</p>
        <a className="source-link" href={assetUrl("/content/实战流程.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看实战流程
        </a>
      </div>
      <div className="theory-grid">
        {practiceFlow.map((item, index) => (
          <article className="theory-card" key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <div className="matrix-panel" id="pillar-meanings">
        <h3>四柱宫位速览</h3>
        <div className="matrix-list">
          {pillarMeanings.map(([name, text]) => (
            <div className="matrix-row" key={name}>
              <strong>{name}</strong>
              <p>{text}</p>
            </div>
          ))}
        </div>
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
      <ElementOverview />
      <ElementRelations />
      <ElementPatterns />
    </section>
  );
}

function ElementOverview() {
  return (
    <section className="element-basics" id="element-overview" aria-labelledby="element-overview-title">
      <div className="section-heading">
        <p className="eyebrow">Five Elements</p>
        <h2 id="element-overview-title">五行总论</h2>
      </div>
      <div className="element-lead">
        <p>五行不是五种物质，而是五种气的运动方式。看八字先看这个气在命局里是生发、显现、承载、收敛，还是流动。</p>
      </div>
      <div className="element-overview-grid">
        {elementOverview.map(([name, meaning]) => (
          <article className="element-overview-card" key={name}>
            <strong>{name}</strong>
            <p>{meaning}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ElementRelations() {
  return (
    <section className="element-basics" id="element-relations" aria-labelledby="element-relations-title">
      <div className="section-heading">
        <p className="eyebrow">Relations</p>
        <h2 id="element-relations-title">生克关系</h2>
      </div>
      <div className="element-lead">
        <p>生不是一定好，克也不是一定坏。关键在于是否适度：太过会偏，不及会虚，适中才可用。</p>
      </div>
      <div className="relation-grid">
        {elementRelations.map(([name, meaning]) => (
          <article className="relation-card" key={name}>
            <strong>{name}</strong>
            <p>{meaning}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ElementPatterns() {
  return (
    <section className="element-basics" id="element-patterns" aria-labelledby="element-patterns-title">
      <div className="section-heading">
        <p className="eyebrow">Patterns</p>
        <h2 id="element-patterns-title">五行象法</h2>
      </div>
      <div className="element-lead">
        <p>五行象法是把生克太过、不及落成可观察的判断。比如水能生木，但水太多就不是单纯生木，而是水多木浮。</p>
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

function SeasonalWood() {
  return (
    <SeasonalElement
      data={seasonalWood}
      elementKey="wood"
      intro="同样是木，春夏秋冬的状态完全不同。取用先看月令气候，再谈扶抑、通关和格局。"
      markdown="/content/四季取用-木.md"
      title="木的四季取用"
    />
  );
}

function SeasonalFire() {
  return (
    <SeasonalElement
      data={seasonalFire}
      elementKey="fire"
      intro="同样是火，春夏秋冬的火势有显、烈、衰、微之别。丙火重壬水映照，丁火重甲木承载。"
      introCards={seasonalFireIntro}
      markdown="/content/四季取用-火.md"
      title="火的四季取用"
    />
  );
}

function SeasonalEarth() {
  return (
    <SeasonalElement
      data={seasonalEarth}
      elementKey="earth"
      intro="同样是土，辰、未、戌、丑四季交接之土各有气候。土不只是“厚重”，还要分寒暖燥湿、承载对象和泄秀方向。"
      introCards={seasonalEarthIntro}
      markdown="/content/四季取用-土.md"
      title="土的四季取用"
    />
  );
}

function SeasonalMetal() {
  return (
    <SeasonalElement
      data={seasonalMetal}
      elementKey="metal"
      intro="同样是金，春夏秋冬的成器方式不同。春金先立身，夏金防火逼，秋金可火炼水淘，冬金要火土护持。"
      introCards={seasonalMetalIntro}
      markdown="/content/四季取用-金.md"
      title="金的四季取用"
    />
  );
}

function SeasonalWater() {
  return (
    <SeasonalElement
      data={seasonalWater}
      elementKey="water"
      intro="同样是水，四季最怕失去源头、尺度和去处。春防泛滥，夏防枯竭，秋防过旺，冬重既济。"
      introCards={seasonalWaterIntro}
      markdown="/content/四季取用-水.md"
      title="水的四季取用"
    />
  );
}

function SeasonalElement({ data, elementKey, intro, introCards = null, markdown, title }) {
  const groups = seasonalImageGroups[elementKey];

  return (
    <section className="element-basics" id={`seasonal-${elementKey}`} aria-labelledby={`seasonal-${elementKey}-title`}>
      <div className="section-heading">
        <p className="eyebrow">Seasonal {elementKey}</p>
        <h2 id={`seasonal-${elementKey}-title`}>{title}</h2>
      </div>
      <div className="element-lead">
        <p>{intro}</p>
        <a className="source-link" href={assetUrl(markdown)}>
          <ScrollText size={18} aria-hidden="true" />
          查看 Markdown
        </a>
      </div>
      {introCards ? (
        <div className="element-overview-grid">
          {introCards.map(([cardTitle, text]) => (
            <article className="element-overview-card" key={cardTitle}>
              <strong>{cardTitle}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      ) : null}
      <SeasonalImageStrip elementKey={elementKey} imageNumbers={groups.intro} title={`${title} 概论图`} />
      <SeasonalImageStrip elementKey={elementKey} imageNumbers={groups.charts} title="干支图示与例盘素材" />
      <div className="flow-sections seasonal-sections">
        {data.map((section, sectionIndex) => (
          <article className="flow-section" id={`${elementKey}-${section.season}`} key={section.season}>
            <div>
              <p className="eyebrow">{elementKey}</p>
              <h3>{section.season}</h3>
              <p>{section.focus}</p>
            </div>
            <div>
              <div className="flow-items">
                {section.items.map(([title, text]) => (
                  <div className="flow-item" key={title}>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
              <div className="example-pillar-list" aria-label={`${section.season}例盘`}>
                {(section.examples || []).map((example) => (
                  <span key={example}>{example}</span>
                ))}
              </div>
              <SeasonalImageStrip
                elementKey={elementKey}
                imageNumbers={groups.sections[sectionIndex] || []}
                title={`${section.season} PPT 图`}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SeasonalImageStrip({ elementKey, imageNumbers, title }) {
  if (!imageNumbers.length) return null;

  const images = imageNumbers.map((number) => {
    const padded = String(number).padStart(2, "0");
    return {
      number: padded,
      path: `/assets/seasonal/${elementKey}/${elementKey}-${padded}.jpg`
    };
  });

  return (
    <div className="seasonal-image-strip" aria-label={title}>
      <h4>{title}</h4>
      <div className="seasonal-image-grid">
        {images.map((image) => (
          <a href={assetUrl(image.path)} key={image.path} target="_blank" rel="noreferrer">
            <img src={assetUrl(image.path)} alt={`${title} ${image.number}`} decoding="async" loading="lazy" />
            <span>{image.number}</span>
          </a>
        ))}
      </div>
    </div>
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

function TenGodDetail({ god }) {
  const [name, relation, image, note, detail] = god;
  const rawSections = [
    ...(tenGodRawSections[name] ?? []),
    ...(tenGodFirstStageSections[name] ?? []),
    ...(tenGodAppliedSections[name] ?? [])
  ];
  const relatedCases = (tenGodCaseMap[name] ?? [])
    .map((id) => caseStudies.find((item) => item.id === id))
    .filter(Boolean);

  return (
    <section className="basics-module ten-god-detail-page" id={`ten-god-${tenGodKeyByName[name]}`} aria-labelledby="ten-god-detail-title">
      <div className="section-heading">
        <p className="eyebrow">Ten God Detail</p>
        <h2 id="ten-god-detail-title">{name}</h2>
      </div>
      <div className="ten-god-hero">
        <div>
          <span>{relation}</span>
          <h3>{image}</h3>
          <p>{note}</p>
        </div>
        <NavLink className="source-link" to="/basics/ten-gods">
          <ArrowLeft size={18} aria-hidden="true" />
          返回十神目录
        </NavLink>
      </div>
      <div className="ten-god-summary-grid">
        <article>
          <strong>六亲取象</strong>
          <p>{detail.kin}</p>
        </article>
        <article>
          <strong>为喜</strong>
          <p>{detail.favorable}</p>
        </article>
        <article>
          <strong>为忌</strong>
          <p>{detail.unfavorable}</p>
        </article>
        <article>
          <strong>功能</strong>
          <p>{detail.function}</p>
        </article>
        <article>
          <strong>柱位提示</strong>
          <p>{detail.pillars}</p>
        </article>
      </div>
      <div className="raw-theory-list" aria-label={`${name}课件原文`}>
        {rawSections.map((section) => (
          <article className="raw-theory-card" key={section.title}>
            <h3>{section.title}</h3>
            <div>
              {section.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
      <TenGodRelatedCases cases={relatedCases} name={name} />
    </section>
  );
}

function TenGodCombinations() {
  const grouped = tenGodCombinationBreakpoints.reduce((acc, item) => {
    acc[item.group] = [...(acc[item.group] ?? []), item];
    return acc;
  }, {});

  return (
    <section className="basics-module ten-god-combinations-section" id="ten-god-combinations" aria-labelledby="ten-god-combinations-title">
      <div className="section-heading">
        <p className="eyebrow">Ten God Combinations</p>
        <h2 id="ten-god-combinations-title">组合断点不是单字断语</h2>
      </div>
      <div className="rules-lead">
        <p>同一个十神，单独看是行为动力，组合起来才会落成财务、婚姻、职业、健康和应期。这里先给第一版可查断点。</p>
        <a className="source-link" href={assetUrl("/content/十神组合断点.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看十神组合断点整理稿
        </a>
      </div>
      <div className="combination-groups">
        {Object.entries(grouped).map(([group, items]) => (
          <section className="combination-group" id={`combination-${group}`} key={group} aria-labelledby={`combination-${group}-title`}>
            <div className="combination-group-heading">
              <p className="eyebrow">Breakpoint Group</p>
              <h3 id={`combination-${group}-title`}>{group}</h3>
            </div>
            <div className="combination-grid">
              {items.map((item) => (
                <article className="combination-card" key={item.title}>
                  <div className="case-card-header">
                    <span>{item.source}</span>
                    <Tags size={18} aria-hidden="true" />
                  </div>
                  <h4>{item.title}</h4>
                  <div className="tag-list" aria-label={`${item.title}涉及十神`}>
                    {item.gods.map((god) => (
                      <span key={god}>{god}</span>
                    ))}
                  </div>
                  <strong>触发</strong>
                  <p>{item.trigger}</p>
                  <strong>断点</strong>
                  <p>{item.reading}</p>
                  <div className="tag-list case-tags" aria-label={`${item.title}相关案例`}>
                    {item.cases.map((id) => (
                      <span key={id}>{id}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function TenGodRelatedCases({ cases, name }) {
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

  if (!cases.length) return null;

  return (
    <div className="ten-god-related-cases" aria-labelledby={`ten-god-${tenGodKeyByName[name]}-cases`}>
      <div className="section-heading">
        <p className="eyebrow">Case Links</p>
        <h3 id={`ten-god-${tenGodKeyByName[name]}-cases`}>{name}相关案例</h3>
      </div>
      <p className="case-note">{tenGodCaseNotes[name]}</p>
      <div className="case-grid">
        {cases.map((item) => (
          <article className="case-card" key={item.id}>
            <div className="case-images" aria-label={`${item.id} 原图`}>
              {item.images.slice(0, 2).map((caseImage, index) => (
                <button
                  aria-label={`查看${item.id} 原图 ${index + 1}`}
                  key={caseImage}
                  onClick={() =>
                    setPreview({
                      alt: `${item.id} 原图 ${index + 1}`,
                      image: caseImage,
                      title: item.title,
                      meta: `${item.id} · 第 ${index + 1} 张`
                    })
                  }
                  type="button"
                >
                  <img src={assetUrl(caseImage)} alt={`${item.id} 原图 ${index + 1}`} decoding="async" />
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
    </div>
  );
}

function StemBranchActions() {
  return (
    <section className="flow-theory" id="stem-branch-actions" aria-labelledby="stem-branch-actions-title">
      <div className="section-heading">
        <p className="eyebrow">Stem Branch</p>
        <h2 id="stem-branch-actions-title">干支作用要点</h2>
      </div>
      <div className="flow-lead">
        <p>干支应用的关键，是把合、会、冲、刑、害、破放回宫位和十神中看：谁被引动，谁被合住，谁被冲开。</p>
        <a className="source-link" href={assetUrl("/content/干支作用.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看干支作用
        </a>
      </div>
      <div className="flow-sections">
        {stemBranchActions.map((section) => (
          <article className="flow-section" id={`action-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">Actions</p>
              <h3>{section.title}</h3>
              <p>先辨作用类型，再看力量大小、宫位落点和喜忌方向。</p>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FetalLifeBody() {
  return (
    <section className="state-rules" id="fetal-life-body" aria-labelledby="fetal-life-body-title">
      <div className="section-heading">
        <p className="eyebrow">Fetal / Life / Body</p>
        <h2 id="fetal-life-body-title">胎元、命宫、身宫</h2>
      </div>
      <div className="rules-lead">
        <p>胎命身属于辅助观察：看先天体质、后天自我、财帛行运。使用时仍要回到原局结构和岁运作用。</p>
        <a className="source-link" href={assetUrl("/content/胎命身.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看胎命身
        </a>
      </div>
      <div className="theory-grid">
        {fetalLifeBody.map((item) => (
          <article className="theory-card" key={item.title}>
            <span>{item.subtitle}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <div className="matrix-panel" id="life-palace-stars">
        <h3>命宫十二星</h3>
        <div className="palace-grid">
          {lifePalaceStars.map(([branch, star, text]) => (
            <article className="palace-card" key={branch}>
              <strong>{branch}</strong>
              <span>{star}</span>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShenSha() {
  return (
    <section className="shen-sha-section" id="shen-sha" aria-labelledby="shen-sha-title">
      <div className="section-heading">
        <p className="eyebrow">Shen Sha</p>
        <h2 id="shen-sha-title">神煞要先立边界</h2>
      </div>
      <div className="rules-lead">
        <p>神煞资料单独成模块：它可以提示火灾、伤残、孤寡、罗网、迁动、空亡等具体象，但必须回到原局、宫位、十神和岁运触发。</p>
        <a className="source-link" href={assetUrl("/content/神煞.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看神煞整理稿
        </a>
      </div>

      <div className="theory-grid shen-sha-principles">
        {shenShaPrinciples.map((item) => (
          <article className="theory-card" key={item.title}>
            <span>{item.subtitle}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="shen-sha-groups">
        {shenShaGroups.map((group) => (
          <article className="shen-sha-group" id={`shen-sha-${group.title}`} key={group.title}>
            <div>
              <p className="eyebrow">{group.source}</p>
              <h3>{group.title}</h3>
            </div>
            <div className="shen-sha-group-body">
              <p>{group.focus}</p>
              <small>{group.use}</small>
              {group.examples.length ? (
                <div className="tag-list" aria-label={`${group.title}相关案例`}>
                  {group.examples.map((id) => (
                    <span key={id}>{id}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <div className="shen-sha-entry-panel" id="shen-sha-entries">
        <div className="section-heading compact">
          <p className="eyebrow">Entry Library</p>
          <h3>具体条目库</h3>
          <p>每个条目都按“象意、用法、边界、案例”拆开，避免神煞变成一句吓人的标签。</p>
        </div>
        <div className="shen-sha-entry-grid">
          {shenShaEntries.map((entry) => (
            <article className="shen-sha-entry-card" key={`${entry.source}-${entry.name}`}>
              <div className="entry-card-head">
                <span>{entry.source}</span>
                <strong>{entry.category}</strong>
              </div>
              <h4>{entry.name}</h4>
              <p>{entry.focus}</p>
              <dl>
                <div>
                  <dt>用法</dt>
                  <dd>{entry.use}</dd>
                </div>
                <div>
                  <dt>边界</dt>
                  <dd>{entry.boundary}</dd>
                </div>
              </dl>
              {entry.cases.length ? (
                <div className="case-tags" aria-label={`${entry.name}相关案例`}>
                  {entry.cases.map((id) => (
                    <span key={id}>{id}</span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
        <a className="source-link" href={assetUrl("/content/神煞条目库.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看神煞条目库整理稿
        </a>
      </div>
    </section>
  );
}

function ShenShaBasics() {
  return (
    <section className="shen-sha-basic-section" id="shen-sha-basics" aria-labelledby="shen-sha-basic-title">
      <div className="section-heading">
        <p className="eyebrow">Shen Sha Basics</p>
        <h2 id="shen-sha-basic-title">神煞先看“怎么作用到我”</h2>
      </div>
      <div className="rules-lead">
        <p>桃花、驿马、贵人都不是单独的吉凶标签。先看它们是生我、我生、克我、我克，再判断它们落成关系、迁动、帮助还是压力。</p>
        <a className="source-link" href={assetUrl("/content/神煞入门.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看神煞入门整理稿
        </a>
      </div>
      <div className="source-matrix" id="shen-sha-basic-principles">
        {shenShaBasicPrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections shen-sha-basic-flow">
        {shenShaBasicSections.map((section) => (
          <article className="flow-section" id={`shen-sha-basic-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="shen-sha-basic-translations">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Practice Translation</p>
            <h3>把神煞话转成现实话</h3>
          </div>
          <p>神煞入门最需要去掉吓人断语，转成可验证的生活场景。</p>
        </div>
        <div className="family-rule-grid">
          {shenShaBasicTranslations.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShenShaOrigin() {
  return (
    <section className="shen-sha-origin-section" id="shen-sha-origin" aria-labelledby="shen-sha-origin-title">
      <div className="section-heading">
        <p className="eyebrow">Origin System</p>
        <h2 id="shen-sha-origin-title">先辨源流，再谈应验</h2>
      </div>
      <div className="rules-lead">
        <p>《子平秘要》摘抄 5 与照抄 6 的价值，不是再堆神煞名词，而是说明神煞为何混乱、如何成形、何时能补格局用神之不足。</p>
        <a className="source-link" href={assetUrl("/content/神煞源流.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看神煞源流整理稿
        </a>
      </div>

      <div className="source-matrix" id="shen-origin-principles">
        {shenShaOriginPrinciples.map(([title, text]) => (
          <article className="source-matrix-card" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>

      <div className="report-template-panel" id="shen-origin-uses">
        <div className="section-heading compact">
          <p className="eyebrow">Boundaries</p>
          <h3>使用边界</h3>
          <p>神煞既不能轻信，也不能全弃。它的正确位置，是补足具体事件类型，并接受案例反馈校验。</p>
        </div>
        <div className="report-template-grid">
          {shenShaOriginUses.map((item, index) => (
            <article className="report-template-card" key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="body-image-panel" id="shen-origin-texts">
        <div className="section-heading compact">
          <p className="eyebrow">Source Texts</p>
          <h3>古籍源流索引</h3>
          <p>摘抄 5 是大量古籍散录，适合做源流索引，不适合把每条古文都直接变成现代断语。</p>
        </div>
        <div className="body-image-grid">
          {shenShaOriginTexts.map((item) => (
            <article className="body-image-card" key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HealthRisk() {
  return (
    <section className="health-risk-section" id="health-risk" aria-labelledby="health-risk-title">
      <div className="section-heading">
        <p className="eyebrow">Health Risk</p>
        <h2 id="health-risk-title">先设边界，再谈风险</h2>
      </div>
      <div className="rules-lead">
        <p>健康风险页不是算病页，而是把古法里最容易吓人的词，重新放回结构、宫位、岁运和已发生反馈里。</p>
        <a className="source-link" href={assetUrl("/content/健康风险.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看健康风险整理稿
        </a>
      </div>

      <div className="source-matrix" id="health-risk-principles">
        {healthRiskPrinciples.map((item) => (
          <article className="source-matrix-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="flow-sections health-risk-flow" id="health-risk-flow">
        {healthRiskSections.map((section) => (
          <article className="flow-section" key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>把古法名目转成可复盘的风险形态。</p>
            </div>
            <div className="flow-items single">
              <div className="flow-item">
                <strong>读法</strong>
                <p>{section.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="report-template-panel" id="health-risk-workflow">
        <div className="section-heading">
          <p className="eyebrow">Workflow</p>
          <h3>健康风险五步复盘</h3>
          <p>所有健康相关内容，都先经过这条流程再输出。</p>
        </div>
        <div className="flow-checklist">
          {healthRiskWorkflow.map((item) => (
            <div className="flow-check" key={item}>{item}</div>
          ))}
        </div>
      </div>

      <div className="report-template-panel">
        <div className="section-heading">
          <p className="eyebrow">Rewrite</p>
          <h3>四类古法词汇的现代改写</h3>
        </div>
        <div className="family-rule-grid">
          {healthRiskTranslations.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LuckCycle() {
  return (
    <section className="luck-cycle-section" id="luck-cycle" aria-labelledby="luck-cycle-title">
      <div className="section-heading">
        <p className="eyebrow">Luck Cycle</p>
        <h2 id="luck-cycle-title">应期要分四层看</h2>
      </div>
      <div className="rules-lead">
        <p>大运流年不是单看某一年干支，而是把原局伏笔、大运气候、流年触发和流月落点串起来复盘。</p>
        <a className="source-link" href={assetUrl("/content/大运流年.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看大运流年整理稿
        </a>
      </div>

      <div className="flow-checklist luck-cycle-layers" aria-label="大运流年四层">
        {luckCycleLayers.map((layer, index) => (
          <div className="flow-check" key={layer.title}>
            <span>{String(index + 1).padStart(2, "0")} / {layer.subtitle}</span>
            <strong>{layer.title}</strong>
            <p>{layer.text}</p>
          </div>
        ))}
      </div>

      <div className="flow-sections">
        {luckCycleRules.map((rule) => (
          <article className="flow-section" id={`luck-${rule.title}`} key={rule.title}>
            <div>
              <p className="eyebrow">{rule.source}</p>
              <h3>{rule.title}</h3>
              <p>先定层级，再看触发方式，最后回到案例反馈。</p>
            </div>
            <div className="flow-items">
              {rule.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LifePalaceCycle() {
  return (
    <section className="life-palace-cycle-section" id="life-palace-cycle" aria-labelledby="life-palace-title">
      <div className="section-heading">
        <p className="eyebrow">Life Palace / Luck Cycle</p>
        <h2 id="life-palace-title">命宫要接到岁运才有落点</h2>
      </div>
      <div className="rules-lead">
        <p>命宫不是另起一套断命法，而是补充后天自我、机遇圈、房产人际和岁运触发。用它时仍要回到四柱主线。</p>
        <a className="source-link" href={assetUrl("/content/命宫流年.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看命宫流年整理稿
        </a>
      </div>
      <div className="source-matrix" id="life-palace-principles">
        {lifePalaceCyclePrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections life-palace-flow">
        {lifePalaceCycleSections.map((section) => (
          <article className="flow-section" id={`life-palace-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="matrix-panel" id="life-palace-stars-table">
        <h3>命宫十二星</h3>
        <div className="palace-grid">
          {lifePalaceStars.map(([branch, star, text]) => (
            <article className="palace-card" key={branch}>
              <strong>{branch}</strong>
              <span>{star}</span>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="report-template-panel" id="life-palace-fortunes">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Twelve Fortunes</p>
            <h3>命坐十二运的现实转译</h3>
          </div>
          <p>十二运在这里不直接等同扶身强弱，而是看后天姿态、环境适配和关系稳定度。</p>
        </div>
        <div className="family-rule-grid">
          {lifePalaceCycleFortunes.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="report-template-panel" id="life-palace-workflow">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workflow</p>
            <h3>命宫流年五步判断</h3>
          </div>
          <p>从查宫位到岁运触发，命宫只作为辅助层进入复盘。</p>
        </div>
        <div className="family-rule-grid">
          {lifePalaceCycleWorkflow.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LuckCycleTables() {
  return (
    <section className="luck-cycle-table-section" id="luck-cycle-tables" aria-labelledby="luck-cycle-table-title">
      <div className="section-heading">
        <p className="eyebrow">Flow Tables</p>
        <h2 id="luck-cycle-table-title">把细表放回应期流程里</h2>
      </div>
      <div className="rules-lead">
        <p>这一页把《大流年判例》里可查、可复盘的内容拆开：月时对查先作辅助，真正断事仍看原局、大运、流年、流月四层接力。</p>
        <a className="source-link" href={assetUrl("/content/流年细表.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看流年细表整理稿
        </a>
      </div>

      <div className="source-matrix luck-principles-grid" id="luck-table-principles">
        {luckCycleTablePrinciples.map((item) => (
          <article className="source-matrix-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="report-template-panel" id="luck-month-hour">
        <div className="section-heading">
          <p className="eyebrow">Month / Hour</p>
          <h3>月时对查十二组</h3>
          <p>每组保留该月的主象、忌运提示和三条代表性条目。完整原文仍以资料文件为准，网站先把可复盘的骨架立起来。</p>
        </div>
        <div className="month-hour-grid">
          {luckCycleMonthHourTable.map((item) => (
            <article className="month-hour-card" key={item.month}>
              <div>
                <span>{item.month}</span>
                <h4>{item.focus}</h4>
                <p>忌运提示：{item.avoid}</p>
              </div>
              <ul>
                {item.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <div className="flow-sections" id="luck-detail-rules">
        {luckCycleDetailRules.map((rule) => (
          <article className="flow-section" key={rule.title}>
            <div>
              <p className="eyebrow">{rule.source}</p>
              <h3>{rule.title}</h3>
              <p>用于把查表、喜忌和案例反馈接到同一条判断链上。</p>
            </div>
            <div className="flow-items single">
              <div className="flow-item">
                <strong>断法</strong>
                <p>{rule.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LuckCycleStructure() {
  return (
    <section className="luck-cycle-structure-section" id="luck-cycle-structure" aria-labelledby="luck-cycle-structure-title">
      <div className="section-heading">
        <p className="eyebrow">Year Structure</p>
        <h2 id="luck-cycle-structure-title">把流年放进命、运、月的连锁里</h2>
      </div>
      <div className="rules-lead">
        <p>传承班流年部分的重点不是多背一句吉凶，而是先分旧事新事，再看四正四生四库是否会全，最后用流月确认哪几个月连续触发。</p>
        <a className="source-link" href={assetUrl("/content/流年架构.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看流年架构整理稿
        </a>
      </div>

      <div className="source-matrix" id="luck-structure-principles">
        {luckCycleStructurePrinciples.map((item) => (
          <article className="source-matrix-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="flow-sections luck-cycle-structure-flow" id="luck-structure-flow">
        {luckCycleStructureSections.map((section) => (
          <article className="flow-section" key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>把资料里的口授规则转成复盘时的入口问题。</p>
            </div>
            <div className="flow-items single">
              <div className="flow-item">
                <strong>断法</strong>
                <p>{section.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="report-template-panel" id="luck-structure-checkpoints">
        <div className="section-heading">
          <p className="eyebrow">Nine Checks</p>
          <h3>流年九个方面</h3>
          <p>先把这九项过一遍，再决定该进入哪一个细表、案例或流月层。</p>
        </div>
        <div className="flow-checklist">
          {luckCycleStructureCheckpoints.map((item) => (
            <div className="flow-check" key={item}>{item}</div>
          ))}
        </div>
      </div>

      <div className="report-template-panel">
        <div className="section-heading">
          <p className="eyebrow">Translation</p>
          <h3>落到实战时，先避开四个误区</h3>
        </div>
        <div className="family-rule-grid">
          {luckCycleStructureTranslations.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TenGodRules() {
  return (
    <section className="ten-god-rules-section" id="ten-god-rules" aria-labelledby="ten-god-rules-title">
      <div className="section-heading">
        <p className="eyebrow">Ten Gods Rules</p>
        <h2 id="ten-god-rules-title">从基础十神进入细则判断</h2>
      </div>
      <div className="rules-lead">
        <p>十神基础页解决“这是什么”，细则页解决“什么时候过多、坐什么会变、对应哪位六亲、岁运怎么引动”。</p>
        <a className="source-link" href={assetUrl("/content/十神细则.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看十神细则整理稿
        </a>
      </div>

      <div className="source-matrix" id="ten-god-rule-principles">
        {tenGodRulePrinciples.map((item) => (
          <article className="source-matrix-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="ten-god-rule-grid" id="ten-god-rule-cards">
        {tenGodRuleCards.map((item) => (
          <article className="ten-god-rule-card" id={`ten-god-rule-${item.god}`} key={item.god}>
            <div className="ten-god-rule-head">
              <p className="eyebrow">{item.source}</p>
              <h3>{item.god}</h3>
            </div>
            <dl>
              <div>
                <dt>过多标准</dt>
                <dd>{item.excess}</dd>
              </div>
              <div>
                <dt>细则断点</dt>
                <dd>
                  <ul>
                    {item.rules.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt>六亲落点</dt>
                <dd>{item.family}</dd>
              </div>
            </dl>
            <div className="case-tags" aria-label={`${item.god}相关案例`}>
              {item.cases.map((caseId) => (
                <span key={caseId}>{caseId}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="report-template-panel" id="ten-god-family-rules">
        <div className="section-heading">
          <p className="eyebrow">Family Mapping</p>
          <h3>六亲定位要一对一回看</h3>
          <p>《命学精华》的十神细则不是为了套标签，而是把父母、夫妻、子息、兄弟各自放回十神和宫位。</p>
        </div>
        <div className="family-rule-grid">
          {tenGodFamilyRules.map((rule) => (
            <article className="family-rule-card" key={rule.title}>
              <h4>{rule.title}</h4>
              <ul>
                {rule.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PeerFoundation() {
  return (
    <section className="peer-foundation-section" id="peer-foundation" aria-labelledby="peer-foundation-title">
      <div className="section-heading">
        <p className="eyebrow">Peer Foundation</p>
        <h2 id="peer-foundation-title">比肩先从入门边界讲起</h2>
      </div>
      <div className="rules-lead">
        <p>第一、二节的价值，是先建立学习顺序，再讲比肩。它不是只说“帮身、克财”，而是把日主、神煞、本运、太岁和比肩过多一起放进实务框架。</p>
        <a className="source-link" href={assetUrl("/content/比肩入门.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看比肩入门整理稿
        </a>
      </div>
      <div className="source-matrix" id="peer-foundation-principles">
        {peerFoundationPrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections peer-foundation-flow">
        {peerFoundationSections.map((section) => (
          <article className="flow-section" id={`peer-foundation-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="peer-foundation-comparisons">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Comparison</p>
            <h3>比肩、禄位、食伤、官杀四类对照</h3>
          </div>
          <p>比肩页的重点，是让初学者把同类力量、禄位承重、输出和规则收束分开看。</p>
        </div>
        <div className="family-rule-grid">
          {peerFoundationComparisons.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="report-template-panel" id="peer-foundation-workflow">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workflow</p>
            <h3>比肩入门五步判断</h3>
          </div>
          <p>先排盘背规则，再落年限、看比重、接问事，不急着把比肩套成单句吉凶。</p>
        </div>
        <div className="family-rule-grid">
          {peerFoundationWorkflow.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PeerRobWealth() {
  return (
    <section className="peer-rob-section" id="peer-rob-wealth" aria-labelledby="peer-rob-title">
      <div className="section-heading">
        <p className="eyebrow">Peer / Rob Wealth</p>
        <h2 id="peer-rob-title">比劫不是只看破财</h2>
      </div>
      <div className="rules-lead">
        <p>第三节的重点，是把劫财、羊刃从“自信、刚强、破财”的入门标签里拿出来，改成可判断的结构：成重、柱位、禄刃、制化、问事。</p>
        <a className="source-link" href={assetUrl("/content/比劫禄刃.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看比劫禄刃整理稿
        </a>
      </div>
      <div className="source-matrix" id="peer-rob-principles">
        {peerRobWealthPrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections peer-rob-flow">
        {peerRobWealthSections.map((section) => (
          <article className="flow-section" id={`peer-rob-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="peer-rob-comparisons">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Comparison</p>
            <h3>比肩、劫财、建禄、羊刃四类对照</h3>
          </div>
          <p>同样是同类力量，实务里的速度、性格、喜忌和问事落点并不一样。</p>
        </div>
        <div className="family-rule-grid">
          {peerRobWealthComparisons.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="report-template-panel" id="peer-rob-workflow">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workflow</p>
            <h3>比劫禄刃五步判断</h3>
          </div>
          <p>先确认是否成重，再分普通比劫与禄刃格，最后落回财、婚姻、事业、健康四类问题。</p>
        </div>
        <div className="family-rule-grid">
          {peerRobWealthWorkflow.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FoodHurtOutput() {
  return (
    <section className="food-hurt-section" id="food-hurt-output" aria-labelledby="food-hurt-title">
      <div className="section-heading">
        <p className="eyebrow">Food / Hurt Output</p>
        <h2 id="food-hurt-title">食伤不是只看才华</h2>
      </div>
      <div className="rules-lead">
        <p>第八节真正重要的，是把食神、伤官放进坐、引、拱的流程里：先看问事，再看柱位年限、六亲、财印承接和案例反馈。</p>
        <a className="source-link" href={assetUrl("/content/食伤坐引.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看食伤坐引整理稿
        </a>
      </div>
      <div className="source-matrix" id="food-hurt-principles">
        {foodHurtOutputPrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections food-hurt-flow">
        {foodHurtOutputSections.map((section) => (
          <article className="flow-section" id={`food-hurt-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="food-hurt-comparisons">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Comparison</p>
            <h3>食神、伤官、财印四类对照</h3>
          </div>
          <p>同样是输出，实务里要分温和承福、锋芒破规、市场承接和印星截断。</p>
        </div>
        <div className="family-rule-grid">
          {foodHurtOutputComparisons.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="report-template-panel" id="food-hurt-workflow">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workflow</p>
            <h3>食伤坐引五步判断</h3>
          </div>
          <p>先把问题收窄，再分食神伤官，随后查坐引、财印和案例，不让术语盖过现实问题。</p>
        </div>
        <div className="family-rule-grid">
          {foodHurtOutputWorkflow.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartialSealSpirit() {
  return (
    <section className="partial-seal-section" id="partial-seal-spirit" aria-labelledby="partial-seal-title">
      <div className="section-heading">
        <p className="eyebrow">Partial Seal / Owl Spirit</p>
        <h2 id="partial-seal-title">偏印不是一句阴沉</h2>
      </div>
      <div className="rules-lead">
        <p>第五节的价值，是把偏印从抽象喜忌里拿出来，落实到术业、性格、人际、六亲、枭神夺食、财制偏印和偏印格成败。</p>
        <a className="source-link" href={assetUrl("/content/偏印枭神.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看偏印枭神整理稿
        </a>
      </div>
      <div className="source-matrix" id="partial-seal-principles">
        {partialSealSpiritPrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections partial-seal-flow">
        {partialSealSpiritSections.map((section) => (
          <article className="flow-section" id={`partial-seal-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="partial-seal-comparisons">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Comparison</p>
            <h3>正印、偏印、夺食、制印四类对照</h3>
          </div>
          <p>偏印页的关键，是分清“保护、孤高、压住输出、现实承接”四种不同作用。</p>
        </div>
        <div className="family-rule-grid">
          {partialSealSpiritComparisons.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="report-template-panel" id="partial-seal-workflow">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workflow</p>
            <h3>偏印枭神五步判断</h3>
          </div>
          <p>先辨正偏印，再看过多、夺食、财贵和问事落点，避免把偏印粗暴等同于负面标签。</p>
        </div>
        <div className="family-rule-grid">
          {partialSealSpiritWorkflow.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function IndirectWealth() {
  return (
    <section className="indirect-wealth-section" id="indirect-wealth" aria-labelledby="indirect-wealth-title">
      <div className="section-heading">
        <p className="eyebrow">Indirect Wealth</p>
        <h2 id="indirect-wealth-title">偏财不是横财标签</h2>
      </div>
      <div className="rules-lead">
        <p>第六节的偏财，是父亲、女友、机会、市场、人脉、异地和资源调度。判断重点不是“有没有财”，而是机会从哪里来、能不能落袋、会不会被分夺。</p>
        <a className="source-link" href={assetUrl("/content/偏财机会.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看偏财机会整理稿
        </a>
      </div>
      <div className="source-matrix" id="indirect-wealth-principles">
        {indirectWealthPrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections indirect-wealth-flow">
        {indirectWealthSections.map((section) => (
          <article className="flow-section" id={`indirect-wealth-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="indirect-wealth-comparisons">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Comparison</p>
            <h3>正财、偏财、食伤、比劫四类对照</h3>
          </div>
          <p>偏财页的关键，是分清稳定现金流、机会资源、变现来源和分夺风险。</p>
        </div>
        <div className="family-rule-grid">
          {indirectWealthComparisons.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="report-template-panel" id="indirect-wealth-workflow">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workflow</p>
            <h3>偏财机会五步判断</h3>
          </div>
          <p>先定年限和六亲，再看根气、来源、分夺和案例反馈，避免把偏财粗暴说成横财。</p>
        </div>
        <div className="family-rule-grid">
          {indirectWealthWorkflow.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SealWealthFoundation() {
  return (
    <section className="seal-wealth-section" id="seal-wealth-foundation" aria-labelledby="seal-wealth-title">
      <div className="section-heading">
        <p className="eyebrow">Seal / Wealth</p>
        <h2 id="seal-wealth-title">正印正财要一起看财印拉扯</h2>
      </div>
      <div className="rules-lead">
        <p>第九节的重点，是把正印和正财从“学历贵人、稳定钱财”的标签里拉出来，落到母亲、妻财、清高、现实经营、财克印和顺用格局。</p>
        <a className="source-link" href={assetUrl("/content/正印正财.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看正印正财整理稿
        </a>
      </div>
      <div className="source-matrix" id="seal-wealth-principles">
        {sealWealthFoundationPrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections seal-wealth-flow">
        {sealWealthFoundationSections.map((section) => (
          <article className="flow-section" id={`seal-wealth-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="seal-wealth-comparisons">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Comparison</p>
            <h3>正印、正财、财克印、官杀生印四类对照</h3>
          </div>
          <p>正印正财页的关键，是分清保护与现实、清气与现金流、母亲与妻财、格局顺用与生克破坏。</p>
        </div>
        <div className="family-rule-grid">
          {sealWealthFoundationComparisons.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="report-template-panel" id="seal-wealth-workflow">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workflow</p>
            <h3>正印正财五步判断</h3>
          </div>
          <p>先问主题，再定柱位、查生克、看顺用，最后回到案例验证，不把财印误读成两个孤立标签。</p>
        </div>
        <div className="family-rule-grid">
          {sealWealthFoundationWorkflow.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OfficerKillingOrder() {
  return (
    <section className="officer-killing-section" id="officer-killing-order" aria-labelledby="officer-killing-title">
      <div className="section-heading">
        <p className="eyebrow">Officer / Seven Killing</p>
        <h2 id="officer-killing-title">官杀先看能不能成秩序</h2>
      </div>
      <div className="rules-lead">
        <p>第七节从女命夫星进入，但真正的价值，是把正官、七杀拆成规则、压力、混杂、制化、贵人和年限，不再只说“官杀旺”。</p>
        <a className="source-link" href={assetUrl("/content/官杀秩序.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看官杀秩序整理稿
        </a>
      </div>
      <div className="source-matrix" id="officer-killing-principles">
        {officerKillingOrderPrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections officer-killing-flow">
        {officerKillingOrderSections.map((section) => (
          <article className="flow-section" id={`officer-killing-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="officer-killing-comparisons">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Comparison</p>
            <h3>正官、七杀、混杂、夫子四类对照</h3>
          </div>
          <p>官杀页的重点，是分清规则与压力、公开与暗藏、顺用与逆用、夫星与子星。</p>
        </div>
        <div className="family-rule-grid">
          {officerKillingOrderComparisons.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="report-template-panel" id="officer-killing-workflow">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workflow</p>
            <h3>官杀秩序五步判断</h3>
          </div>
          <p>先分正杀，再落问事、年限、明暗、制化和案例，避免把官杀混成单一吉凶。</p>
        </div>
        <div className="family-rule-grid">
          {officerKillingOrderWorkflow.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PracticalCombinations() {
  return (
    <section className="practical-combinations-section" id="practical-combinations" aria-labelledby="practical-combinations-title">
      <div className="section-heading">
        <p className="eyebrow">Practice Combinations</p>
        <h2 id="practical-combinations-title">组合要看成势和触发</h2>
      </div>
      <div className="rules-lead">
        <p>第二层次资料的核心，是把地支状态、合会冲刑、暗拱夹带和岁运触发合起来看，判断一个主题何时成、何时破。</p>
        <a className="source-link" href={assetUrl("/content/实务组合.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看实务组合整理稿
        </a>
      </div>
      <div className="flow-sections">
        {practicalCombinationSections.map((section) => (
          <article className="flow-section" id={`combination-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((id) => (
                  <span key={id}>{id}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FourSeeMissingGod() {
  return (
    <section className="four-see-section" id="four-see-missing-god" aria-labelledby="four-see-title">
      <div className="section-heading">
        <p className="eyebrow">Four See / Missing God</p>
        <h2 id="four-see-title">四见不是只数到四个</h2>
      </div>
      <div className="rules-lead">
        <p>这一页把“四见”拆成入格、多根、混杂、岁运触发，也把“十神缺一”放回日主喜忌、调候、六亲和代用边界里。</p>
        <a className="source-link" href={assetUrl("/content/四见缺一.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看四见缺一整理稿
        </a>
      </div>
      <div className="source-matrix" id="four-see-principles">
        {fourSeeMissingGodPrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections four-see-flow">
        {fourSeeMissingGodSections.map((section) => (
          <article className="flow-section" id={`four-see-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="four-see-comparisons">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Comparison</p>
            <h3>入格、多根、缺一、补出四类对照</h3>
          </div>
          <p>同样是数量或缺位，入格看事件，多根看习性，缺一看不可替代，补出看岁运方向。</p>
        </div>
        <div className="family-rule-grid">
          {fourSeeMissingGodComparisons.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="report-template-panel" id="four-see-workflow">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workflow</p>
            <h3>四见缺一五步判断</h3>
          </div>
          <p>先定结构，再接十神、缺位、岁运和案例反馈。</p>
        </div>
        <div className="family-rule-grid">
          {fourSeeMissingGodWorkflow.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StemClassics() {
  return (
    <section className="stem-classics-section" id="stem-classics" aria-labelledby="stem-classics-title">
      <div className="section-heading">
        <p className="eyebrow">Tian Yuan Wu Xian</p>
        <h2 id="stem-classics-title">十干高级看“能否承接”</h2>
      </div>
      <div className="rules-lead">
        <p>第二层次的《天元巫咸经》资料，不是基础象义表，而是把日主、日时、禄旺、合神、四见和年限放在一起判断。网站里只取可复盘的推理，不照搬古文里的恐吓式吉凶。</p>
        <a className="source-link" href={assetUrl("/content/十干高级.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看十干高级整理稿
        </a>
      </div>

      <div className="theory-grid stem-classic-principles" id="stem-classic-principles">
        {stemClassicPrinciples.map((item) => (
          <article className="theory-card" key={item.title}>
            <span>{item.subtitle}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="stem-classic-grid">
        {stemClassicEntries.map((entry) => (
          <article className="stem-classic-card" id={`stem-classic-${entry.stem}`} key={entry.stem}>
            <div className="stem-classic-symbol">
              <span>{entry.element}</span>
              <strong>{entry.stem}</strong>
            </div>
            <div className="stem-classic-body">
              <p className="eyebrow">{entry.source}</p>
              <h3>{entry.stem}日高级断点</h3>
              <dl>
                <div>
                  <dt>古法摘点</dt>
                  <dd>{entry.classic}</dd>
                </div>
                <div>
                  <dt>判断入口</dt>
                  <dd>{entry.method}</dd>
                </div>
                <div>
                  <dt>使用边界</dt>
                  <dd>{entry.risk}</dd>
                </div>
              </dl>
              <div className="case-tags" aria-label={`${entry.stem}日相关案例`}>
                {entry.cases.map((id) => (
                  <span key={id}>{id}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DayHourClassics() {
  return (
    <section className="day-hour-classics-section" id="day-hour-classics" aria-labelledby="day-hour-classics-title">
      <div className="section-heading">
        <p className="eyebrow">Day / Hour Classics</p>
        <h2 id="day-hour-classics-title">十干日时组合查表</h2>
      </div>
      <div className="rules-lead">
        <p>这组资料是古法日时统计。使用时不能直接拿一句吉凶定案，要先问时柱代表的晚年承接、子女作品、财官印贵人之根，再回到月令和调候。</p>
        <a className="source-link" href={assetUrl("/content/日时组合.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看日时组合整理稿
        </a>
      </div>

      <div className="source-matrix" id="day-hour-principles">
        {dayHourClassicPrinciples.map((item) => (
          <article className="source-matrix-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="day-hour-table-stack">
        {dayHourClassicTables.map((table) => (
          <article className="day-hour-table-panel" id={`day-hour-${table.stem}`} key={table.stem}>
            <div className="day-hour-table-head">
              <div className="stem-classic-symbol">
                <span>日主</span>
                <strong>{table.stem}</strong>
              </div>
              <div>
                <p className="eyebrow">{table.source}</p>
                <h3>{table.stem}日十二时</h3>
                <p>{table.summary}</p>
              </div>
            </div>
            <div className="day-hour-table-wrap">
              <table className="day-hour-table">
                <thead>
                  <tr>
                    <th scope="col">时柱</th>
                    <th scope="col">源文断点</th>
                    <th scope="col">现代读法</th>
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map(([hour, classic, reading]) => (
                    <tr key={`${table.stem}-${hour}`}>
                      <th scope="row">{hour}</th>
                      <td>{classic}</td>
                      <td>{reading}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReadingMethod() {
  return (
    <section className="reading-method-section" id="reading-method" aria-labelledby="reading-method-title">
      <div className="section-heading">
        <p className="eyebrow">Learning Path</p>
        <h2 id="reading-method-title">从会看书到会批命</h2>
      </div>
      <div className="rules-lead">
        <p>第二层次序言把学习分成基础、常识、实务、细批终身四段；何重建先生批命例式则提供了一份完整报告的骨架。这个页面把两者合成网站的学习与写作模板。</p>
        <a className="source-link" href={assetUrl("/content/学习批命.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看学习批命整理稿
        </a>
      </div>

      <div className="learning-stage-grid" id="reading-stages">
        {readingMethodStages.map((stage) => (
          <article className="learning-stage-card" key={stage.title}>
            <span>{stage.subtitle}</span>
            <h3>{stage.title}</h3>
            <p>{stage.text}</p>
          </article>
        ))}
      </div>

      <div className="flow-sections">
        {readingMethodRules.map((rule) => (
          <article className="flow-section" id={`reading-rule-${rule.title}`} key={rule.title}>
            <div>
              <p className="eyebrow">{rule.source}</p>
              <h3>{rule.title}</h3>
              <p>{rule.intro}</p>
            </div>
            <div className="flow-items">
              {rule.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="report-template-panel" id="reading-report">
        <div className="section-heading compact">
          <p className="eyebrow">Report Template</p>
          <h3>批命例式拆成六段</h3>
          <p>何重建先生例式的价值，不在某一句断语，而在报告顺序：先结构，后用神，再运年，最后给现实边界。</p>
        </div>
        <div className="report-template-grid">
          {readingReportSections.map((section, index) => (
            <article className="report-template-card" key={section.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h4>{section.title}</h4>
              <p>{section.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GrassrootsMethod() {
  return (
    <section className="grassroots-method-section" id="grassroots-method" aria-labelledby="grassroots-method-title">
      <div className="section-heading">
        <p className="eyebrow">Foundation Systems</p>
        <h2 id="grassroots-method-title">三套系统不要混用</h2>
      </div>
      <div className="rules-lead">
        <p>第十一、十二节的核心，是把“财官论、格局论、十神定位论”拆开。它们共用十神术语，但判断目的不同：有的看阶段有用，有的看结构成败，有的看普通人的夫妻、性格和现实吉凶。</p>
        <a className="source-link" href={assetUrl("/content/基层命学.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看基层命学整理稿
        </a>
      </div>

      <div className="grassroots-system-grid">
        {grassrootsSystems.map((system) => (
          <article className="grassroots-system-card" id={`grassroots-${system.title}`} key={system.title}>
            <p className="eyebrow">{system.source}</p>
            <h3>{system.title}</h3>
            <dl>
              <div>
                <dt>看什么</dt>
                <dd>{system.focus}</dd>
              </div>
              <div>
                <dt>怎么用</dt>
                <dd>{system.method}</dd>
              </div>
              <div>
                <dt>边界</dt>
                <dd>{system.boundary}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="report-template-panel" id="grassroots-rules">
        <div className="section-heading compact">
          <p className="eyebrow">Practice Notes</p>
          <h3>基层实务提要</h3>
          <p>这一页的目的不是再背术语，而是让用户知道：什么时候用财官，什么时候用格局，什么时候先用十神定位开口。</p>
        </div>
        <div className="report-template-grid grassroots-rule-grid">
          {grassrootsRules.map((rule, index) => (
            <article className="report-template-card" key={rule.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h4>{rule.title}</h4>
              <p>{rule.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="body-image-panel" id="body-image-sources">
        <div className="section-heading compact">
          <p className="eyebrow">Body Images</p>
          <h3>干支体象是源流，不是速断</h3>
          <p>《滴天髓》《神峰通考》和十二地支体象，更多是调候、格局、用神的历史底层，不适合直接做一句断语。</p>
        </div>
        <div className="body-image-grid">
          {bodyImageSources.map((item) => (
            <article className="body-image-card" key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FemaleChart() {
  return (
    <section className="female-chart-section" id="female-chart" aria-labelledby="female-chart-title">
      <div className="section-heading">
        <p className="eyebrow">Female Chart</p>
        <h2 id="female-chart-title">女命要宫星运同看</h2>
      </div>
      <div className="rules-lead">
        <p>女命专题把夫星、子女、财印、人际资源和婚姻宫放在同一套顺序里，不用单个“官杀”或“桃花”粗暴定性。</p>
        <a className="source-link" href={assetUrl("/content/女命专题.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看女命专题整理稿
        </a>
      </div>
      <div className="flow-sections">
        {femaleChartSections.map((section) => (
          <article className="flow-section" id={`female-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((id) => (
                  <span key={id}>{id}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FemalePoems() {
  return (
    <section className="female-poem-section" id="female-poems" aria-labelledby="female-poem-title">
      <div className="section-heading">
        <p className="eyebrow">Female Rules</p>
        <h2 id="female-poem-title">诗诀要转成问事顺序</h2>
      </div>
      <div className="rules-lead">
        <p>传承班女命诗诀的重点，不是背几句古文，而是把夫星、子息、年龄、明暗关系和岁运变化转成可问、可验、可复盘的顺序。</p>
        <a className="source-link" href={assetUrl("/content/女命诗诀.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看女命诗诀整理稿
        </a>
      </div>

      <div className="source-matrix" id="female-poem-principles">
        {femalePoemPrinciples.map((item) => (
          <article className="source-matrix-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="flow-sections" id="female-poem-rules">
        {femalePoemRules.map((rule) => (
          <article className="flow-section" id={`female-poem-${rule.title}`} key={rule.title}>
            <div>
              <p className="eyebrow">{rule.source}</p>
              <h3>{rule.title}</h3>
              <p>{rule.text}</p>
            </div>
            <div className="flow-items">
              {rule.cues.map((cue) => (
                <div className="flow-item" key={cue}>
                  <strong>看点</strong>
                  <p>{cue}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="report-template-panel" id="female-poem-examples">
        <div className="section-heading">
          <p className="eyebrow">Translation</p>
          <h3>把诗诀翻译成现实话</h3>
          <p>这些条目用于写案例和面对具体问题：尽量讲结构、阶段和选择，不把古籍里的重话直接丢给来问者。</p>
        </div>
        <div className="family-rule-grid">
          {femalePoemExamples.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h4>{item.title}</h4>
              <ul>
                <li>{item.text}</li>
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PatternFoundation() {
  return (
    <section className="pattern-foundation-section" id="pattern-foundation" aria-labelledby="pattern-foundation-title">
      <div className="section-heading">
        <p className="eyebrow">Pattern Foundation</p>
        <h2 id="pattern-foundation-title">别被“身强身弱”卡住</h2>
      </div>
      <div className="rules-lead">
        <p>第四节辅助教材的价值，是让学习者从会排盘，走到会看根气、透藏、轻重和用神层次。它不是高阶玄谈，而是防止初学误判的底层检查表。</p>
        <a className="source-link" href={assetUrl("/content/格局基础.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看格局基础整理稿
        </a>
      </div>
      <div className="source-matrix" id="pattern-foundation-principles">
        {patternFoundationPrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections pattern-foundation-flow">
        {patternFoundationSections.map((section) => (
          <article className="flow-section" id={`pattern-foundation-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="pattern-foundation-workflow">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workflow</p>
            <h3>从排盘到判断的五步</h3>
          </div>
          <p>这五步把第四节的辅助教材转成实务检查顺序，后面再进入八格、格局用神和岁运。</p>
        </div>
        <div className="family-rule-grid">
          {patternFoundationWorkflow.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function EightPatterns() {
  return (
    <section className="eight-pattern-section" id="eight-patterns" aria-labelledby="eight-pattern-title">
      <div className="section-heading">
        <p className="eyebrow">Eight Patterns</p>
        <h2 id="eight-pattern-title">先分顺逆，再看成败</h2>
      </div>
      <div className="rules-lead">
        <p>八格总论的目的，是把格局名词从“吉凶标签”拉回判断流程：月令入口、顺逆用、破格通关、日主承载和岁运触发。</p>
        <a className="source-link" href={assetUrl("/content/八格总论.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看八格总论整理稿
        </a>
      </div>
      <div className="source-matrix" id="eight-pattern-principles">
        {eightPatternPrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections eight-pattern-flow">
        {eightPatternRows.map((row) => (
          <article className="flow-section" id={`eight-pattern-${row.title}`} key={row.title}>
            <div>
              <p className="eyebrow">{row.source}</p>
              <h3>{row.title}</h3>
              <p>{row.intro}</p>
              <div className="tag-list" aria-label={`${row.title}类型与案例`}>
                <span>{row.type}</span>
                {row.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {row.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="eight-pattern-workflow">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workflow</p>
            <h3>八格判断五步</h3>
          </div>
          <p>先把格局判清，再进入调候、扶抑、四联合参和岁运复盘。</p>
        </div>
        <div className="family-rule-grid">
          {eightPatternWorkflow.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="report-template-panel" id="eight-pattern-translations">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Practice Translation</p>
            <h3>把格局术语翻译成人话</h3>
          </div>
          <p>同一句古书术语，必须回到承接、路径、破坏点和现实场景。</p>
        </div>
        <div className="family-rule-grid">
          {eightPatternTranslations.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PatternUseGod() {
  return (
    <section className="pattern-use-god-section" id="pattern-use-god" aria-labelledby="pattern-use-god-title">
      <div className="section-heading">
        <p className="eyebrow">Pattern / Use God</p>
        <h2 id="pattern-use-god-title">先找结构卡点</h2>
      </div>
      <div className="rules-lead">
        <p>格局用神页先处理方法论：格局是否成形，气候是否失衡，强弱能否承接，用神解决的是哪一个问题。</p>
        <a className="source-link" href={assetUrl("/content/格局用神.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看格局用神整理稿
        </a>
      </div>
      <div className="flow-sections">
        {patternUseGodSections.map((section) => (
          <article className="flow-section" id={`pattern-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((id) => (
                  <span key={id}>{id}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ZipingThreeWaves() {
  return (
    <section className="three-waves-section" id="ziping-three-waves" aria-labelledby="three-waves-title">
      <div className="section-heading">
        <p className="eyebrow">Three Waves</p>
        <h2 id="three-waves-title">学习瓶颈要分层处理</h2>
      </div>
      <div className="rules-lead">
        <p>子平三波限不是知识点清单，而是学习顺序：先熟规则，再合并日主与格局，最后处理临界定义。</p>
        <a className="source-link" href={assetUrl("/content/子平三波限.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看子平三波限整理稿
        </a>
      </div>
      <div className="source-matrix" id="three-waves-principles">
        {zipingThreeWavesPrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections three-waves-flow">
        {zipingThreeWavesSections.map((section) => (
          <article className="flow-section" id={`three-waves-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="three-waves-warnings">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Boundaries</p>
            <h3>四个常见误区</h3>
          </div>
          <p>三波限的价值，是把学习卡点和断语边界说清楚。</p>
        </div>
        <div className="family-rule-grid">
          {zipingThreeWavesWarnings.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="report-template-panel" id="three-waves-workflow">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workflow</p>
            <h3>三波限五步复盘</h3>
          </div>
          <p>从基础熟练度到临界条件，最后回到案例反馈。</p>
        </div>
        <div className="family-rule-grid">
          {zipingThreeWavesWorkflow.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function JinLuckCycle() {
  return (
    <section className="jin-luck-section" id="jin-luck-cycle" aria-labelledby="jin-luck-title">
      <div className="section-heading">
        <p className="eyebrow">Jin Luck Cycle</p>
        <h2 id="jin-luck-title">大运要先校正地支</h2>
      </div>
      <div className="rules-lead">
        <p>金氏大运页解决一个问题：常规格局、调候、扶抑说不通某步运时，如何用月令、运支和金不换边界重新校正。</p>
        <a className="source-link" href={assetUrl("/content/金氏大运.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看金氏大运整理稿
        </a>
      </div>
      <div className="source-matrix" id="jin-luck-principles">
        {jinLuckCyclePrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections jin-luck-flow">
        {jinLuckCycleSections.map((section) => (
          <article className="flow-section" id={`jin-luck-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="jin-luck-warnings">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Boundaries</p>
            <h3>四个误判边界</h3>
          </div>
          <p>金氏大运的重点，是把“某步运为什么不按常法应验”的边界讲清楚。</p>
        </div>
        <div className="family-rule-grid">
          {jinLuckCycleWarnings.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="report-template-panel" id="jin-luck-workflow">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workflow</p>
            <h3>金氏大运五步复盘</h3>
          </div>
          <p>从原局到运支，再到月令表和案例反馈。</p>
        </div>
        <div className="family-rule-grid">
          {jinLuckCycleWorkflow.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseGodHistory() {
  return (
    <section className="use-god-history-section" id="use-god-history" aria-labelledby="use-god-history-title">
      <div className="section-heading">
        <p className="eyebrow">History / Use God</p>
        <h2 id="use-god-history-title">先把“用神”这个词说清楚</h2>
      </div>
      <div className="rules-lead">
        <p>《渊海随笔》的价值，不是给出一个新的万能用神，而是让读者知道不同法脉说的“用神”并不完全是同一个东西。</p>
        <a className="source-link" href={assetUrl("/content/用神沿革.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看用神沿革整理稿
        </a>
      </div>
      <div className="source-matrix" id="use-god-history-principles">
        {useGodHistoryPrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections use-god-history-flow">
        {useGodHistorySections.map((section) => (
          <article className="flow-section" id={`use-god-history-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="use-god-history-translations">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Practice Translation</p>
            <h3>把史观转成实务话</h3>
          </div>
          <p>用户最终要看的不是朝代考据，而是为什么这个八字不能只用一句“喜某神”结束。</p>
        </div>
        <div className="family-rule-grid">
          {useGodHistoryTranslations.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TwoSidedUseGod() {
  return (
    <section className="two-sided-use-god-section" id="two-sided-use-god" aria-labelledby="two-sided-use-god-title">
      <div className="section-heading">
        <p className="eyebrow">Two-sided Use God</p>
        <h2 id="two-sided-use-god-title">日主和格局要两边同时成立</h2>
      </div>
      <div className="rules-lead">
        <p>双边用神不是再选一个更神秘的字，而是提醒读者：日主强弱、格局成败、调停之神，是三个不同层次。</p>
        <a className="source-link" href={assetUrl("/content/双边用神.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看双边用神整理稿
        </a>
      </div>
      <div className="source-matrix" id="two-sided-use-god-principles">
        {twoSidedUseGodPrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections two-sided-use-god-flow">
        {twoSidedUseGodSections.map((section) => (
          <article className="flow-section" id={`two-sided-use-god-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="two-sided-use-god-translations">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Practice Translation</p>
            <h3>把双边用神转成判断问题</h3>
          </div>
          <p>每次看到“喜某神”，都要追问它解决的是哪一层问题。</p>
        </div>
        <div className="family-rule-grid">
          {twoSidedUseGodTranslations.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FavorablePatterns() {
  return (
    <section className="favorable-pattern-section" id="favorable-patterns" aria-labelledby="favorable-pattern-title">
      <div className="section-heading">
        <p className="eyebrow">Favorable Patterns</p>
        <h2 id="favorable-pattern-title">顺用格先看有没有被破</h2>
      </div>
      <div className="rules-lead">
        <p>顺用格局不是把财官印食背成好字，而是看它能否成格、是否被克、有没有通关，以及最后能不能落到现实主题。</p>
        <a className="source-link" href={assetUrl("/content/顺用格局.md")}>
          <ScrollText size={18} aria-hidden="true" />
          查看顺用格局整理稿
        </a>
      </div>
      <div className="source-matrix" id="favorable-pattern-principles">
        {favorablePatternPrinciples.map((principle) => (
          <article className="source-matrix-card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
      <div className="flow-sections favorable-pattern-flow">
        {favorablePatternSections.map((section) => (
          <article className="flow-section" id={`favorable-pattern-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">{section.source}</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
              <div className="tag-list" aria-label={`${section.title}案例`}>
                {section.cases.map((caseId) => (
                  <span key={caseId}>{caseId}</span>
                ))}
              </div>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-template-panel" id="favorable-pattern-translations">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Practice Translation</p>
            <h3>把格局话转成现实话</h3>
          </div>
          <p>用户问的是钱、职位、婚姻和选择，不是术语本身。每条格局都要转成可复盘的现实机制。</p>
        </div>
        <div className="family-rule-grid">
          {favorablePatternTranslations.map((item) => (
            <article className="family-rule-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
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

function FlowTheory() {
  const checkpoints = ["源头从哪里来", "中间有没有路", "主题是否被截断", "结果能否承载", "运年是疏通还是添堵"];

  return (
    <section className="flow-theory" id="flow-theory" aria-labelledby="flow-theory-title">
      <div className="section-heading">
        <p className="eyebrow">Flow Theory</p>
        <h2 id="flow-theory-title">流通不是顺生，而是成事路径</h2>
      </div>
      <div className="flow-lead">
        <p>
          八字看流通，不是看到木生火、火生土就说好。真正要看的是一股气从哪里来，经过哪里，在哪里被挡住，最后能不能落成现实结果。
        </p>
      </div>
      <div className="flow-checklist" aria-label="流通五问">
        {checkpoints.map((item, index) => (
          <div className="flow-check" key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item}</strong>
          </div>
        ))}
      </div>
      <div className="flow-sections">
        {flowSections.map((section) => (
          <article className="flow-section" id={`flow-${section.title}`} key={section.title}>
            <div>
              <p className="eyebrow">Flow</p>
              <h3>{section.title}</h3>
              <p>{section.intro}</p>
            </div>
            <div className="flow-items">
              {section.items.map(([title, text]) => (
                <div className="flow-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
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
  const closeButtonRef = React.useRef(null);
  const previewTriggerRef = React.useRef(null);

  const closePreview = React.useCallback(() => {
    setPreview(null);
  }, []);

  React.useEffect(() => {
    if (!preview) return undefined;

    const focusCloseButton = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closePreview();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = document.querySelector(".image-modal");
      const focusable = [...dialog.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")]
        .filter((element) => !element.disabled && element.offsetParent !== null);

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("modal-open");

    return () => {
      window.cancelAnimationFrame(focusCloseButton);
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
      previewTriggerRef.current?.focus();
    };
  }, [closePreview, preview]);

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
                  onClick={(event) => {
                    previewTriggerRef.current = event.currentTarget;
                    setPreview({
                      alt: `${item.id} 原图 ${index + 1}`,
                      image,
                      title: item.title,
                      meta: `${item.id} · 第 ${index + 1} 张`
                    });
                  }}
                  type="button"
                >
                  <img src={assetUrl(image)} alt={`${item.id} 原图 ${index + 1}`} decoding="async" />
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
        <div className="image-modal" aria-labelledby="image-modal-title" aria-modal="true" role="dialog">
          <button className="image-modal-backdrop" aria-label="关闭预览" onClick={closePreview} tabIndex={-1} type="button" />
          <div className="image-modal-panel">
            <div className="image-modal-header">
              <div>
                <span>{preview.meta}</span>
                <strong id="image-modal-title">{preview.title}</strong>
              </div>
              <button aria-label="关闭预览" className="image-modal-close" onClick={closePreview} ref={closeButtonRef} type="button">
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
