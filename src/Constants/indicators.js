const indicators = [
  { name: "totalPopulation", id: "SP.POP.TOTL", unit: "" },
  { name: "gdpTotalinUSD", id: "NY.GDP.MKTP.CD", unit: "" },
  { name: "populationGrowth", id: "SP.POP.GROW", unit: "%" },
  { name: "centralGovernmentDebtTotal", id: "GC.DOD.TOTL.GD.ZS", unit: "%" },
  { name: "gdpPerCapita", id: "NY.GDP.PCAP.CD", unit: "" },
  { name: "gdpAnnualGrowth", id: "NY.GDP.MKTP.KD.ZG", unit: "%" },
  { name: "annualConsumerPriceInflation", id: "FP.CPI.TOTL.ZG", unit: "%" },
  { name: "totalLabourForce", id: "SL.TLF.TOTL.IN", unit: "" },
  { name: "totalUnemployment", id: "SL.UEM.TOTL.ZS", unit: "%" },
  { name: "currentAccountBalance", id: "BN.CAB.XOKA.CD", unit: "" },
  { name: "netMigration", id: "SM.POP.NETM", unit: "" },
  { name: "taxRevenue", id: "GC.TAX.TOTL.GD.ZS", unit: "%" },
  { name: "residentPatentApplication", id: "IP.PAT.RESD", unit: "" },
  { name: "importOfGoodsAndServices", id: "NE.IMP.GNFS.ZS", unit: "%" },
  { name: "exportOfGoodsAndServices", id: "NE.EXP.GNFS.ZS", unit: "%" },
];

const totalPopulation = "SP.POP.TOTL";
const gdpTotalinUSD = "NY.GDP.MKTP.CD";
const populationGrowth = "SP.POP.GROW";
const centralGovernmentDebtTotal = "GC.DOD.TOTL.GD.ZS";
const gdpPerCapita = "NY.GDP.PCAP.CD";
const gdpAnnualGrowth = "NY.GDP.MKTP.KD.ZG";
const annualConsumerPriceInflation = "FP.CPI.TOTL.ZG";
const totalLabourForce = "SL.TLF.TOTL.IN";
const totalUnemployment = "SL.UEM.TOTL.ZS";
const currentAccountBalance = "BN.CAB.XOKA.CD";
const netMigration = "SM.POP.NETM";
const taxRevenue = "GC.TAX.TOTL.GD.ZS";
const residentPatentApplication = "IP.PAT.RESD";
const importOfGoodsAndServices = "NE.IMP.GNFS.ZS";
const exportOfGoodsAndServices = "NE.EXP.GNFS.ZS";

export {
  indicators,
  totalLabourForce,
  totalPopulation,
  totalUnemployment,
  gdpPerCapita,
  gdpTotalinUSD,
  gdpAnnualGrowth,
  netMigration,
  currentAccountBalance,
  populationGrowth,
  annualConsumerPriceInflation,
  taxRevenue,
  importOfGoodsAndServices,
  exportOfGoodsAndServices,
  residentPatentApplication,
  centralGovernmentDebtTotal,
};
