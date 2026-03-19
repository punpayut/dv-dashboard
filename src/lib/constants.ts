export const REGIONS = ['ภาคกลาง', 'ภาคเหนือ', 'ภาคตะวันออกเฉียงเหนือ', 'ภาคใต้']
export const PERIODS = ['00:01 – 06:00', '06:01 – 12:00', '12:01 – 18:00', '18:01 – 00:00']
export const GENDERS = ['ชาย', 'หญิง']
export const AGE_ORDER = [
  'วัยเด็กเล็กแรกเกิด - 6 ปี',
  'วัยเด็กตอนกลาง 7 - 12 ปี',
  'วัยรุ่น 13 - 18 ปี',
  'วัยผู้ใหญ่ตอนต้น 19 - 35 ปี',
  'วัยกลางคน 36 - 59 ปี',
  'วัยสูงอายุ 60 ปีขึ้นไป',
]
export const AGE_SHORT: Record<string, string> = {
  'วัยเด็กเล็กแรกเกิด - 6 ปี': '0–6',
  'วัยเด็กตอนกลาง 7 - 12 ปี': '7–12',
  'วัยรุ่น 13 - 18 ปี': '13–18',
  'วัยผู้ใหญ่ตอนต้น 19 - 35 ปี': '19–35',
  'วัยกลางคน 36 - 59 ปี': '36–59',
  'วัยสูงอายุ 60 ปีขึ้นไป': '60+',
}
export const RISK_LABEL: Record<string, string> = {
  Alcohol: 'แอลกอฮอล์',
  Drug: 'ยาเสพติด',
  Authoritative: 'ใช้อำนาจ',
  Rage: 'ความโกรธ',
  Jealous: 'หึงหวง',
  Divorce: 'แยกทาง',
  'Health Problem': 'สุขภาพกาย',
  'Mental Problem': 'สุขภาพจิต',
  'Gambling Addict': 'ติดพนัน',
  'Economics Stress': 'เครียดเศรษฐกิจ',
}
export const RISK_COLS = Object.keys(RISK_LABEL)

export type IncidentRow = {
  Regional: string
  Province: string
  Period: string
  Locale: string
  'Source Type': string
  Channel: string
}
export type OffenderRow = {
  Gender: string
  Age: string
  'Age Range': string
  Relation: string
  risk_count: string
  risk_profile: string
  [key: string]: string
}
export type VictimRow = {
  Gender: string
  Age: string
  'Age Range': string
  'Relation Type': string
  'Relation Type Group': string
  [key: string]: string
}
