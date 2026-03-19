# Family Violence Dashboard

Next.js + Recharts dashboard สำหรับข้อมูลเหตุความรุนแรงในครอบครัว

## วิธีใช้งาน

### 1. วาง CSV ที่ export จาก notebook
```
public/
  data/
    incident_clean.csv
    offender_clean.csv
    victim_clean.csv
```

### 2. รันในเครื่อง
```bash
npm install
npm run dev
# เปิด http://localhost:3000
```

### 3. Deploy ขึ้น Vercel
```bash
# ติดตั้ง Vercel CLI (ครั้งเดียว)
npm i -g vercel

# Deploy
vercel

# ครั้งต่อไปที่แก้ code
vercel --prod
```

หรือ push ขึ้น GitHub แล้ว import ที่ vercel.com/new ได้เลย

## โครงสร้าง project
```
src/
  app/
    page.tsx          ← หน้าหลัก dashboard
    layout.tsx        ← HTML wrapper + font
    globals.css       ← design tokens + font import
  components/
    KpiCard.tsx       ← ตัวเลข KPI 5 การ์ด
    FilterBar.tsx     ← dropdown filter ภูมิภาค / เวลา / เพศ
    ButterflyChart.tsx ← กราฟ butterfly อายุ-เพศ
    HeatmapChart.tsx  ← heatmap จังหวัด × เวลา
    RiskChart.tsx     ← grouped bar ปัจจัยเสี่ยง
    MiniCharts.tsx    ← bar ช่วงเวลา + ภูมิภาค
  lib/
    constants.ts      ← ค่าคงที่ ลำดับ label ต่าง ๆ
    data.ts           ← โหลด CSV + คำนวณข้อมูลแต่ละ chart
```
