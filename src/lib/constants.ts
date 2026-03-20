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

export const RISK_LABEL = {
  Alcohol: 'แอลกอฮอล์',
  Drug: 'ยาเสพติด',
  Authoritative: 'ใช้อำนาจ',
  Rage: 'ความโกรธ',
  Jealous: 'หึงหวง',
  Divorce: 'การแยกทาง',
  'Health Problem': 'ปัญหาสุขภาพกาย',
  'Mental Problem': 'ปัญหาสุขภาพจิต',
  'Gambling Addict': 'การพนัน',
  'Economics Stress': 'ความเครียดเศรษฐกิจ',
} as const

export type RiskColumn = keyof typeof RISK_LABEL

export const RISK_COLS = Object.keys(RISK_LABEL) as RiskColumn[]

export const YES = 'ใช่'
export const PRIVATE_LOCATION = 'สถานที่ส่วนบุคคล'
export const NO_RISK_PROFILE = '⚪ ไม่มีปัจจัยทั้ง 3'

export type IncidentRow = {
  Regional: string
  Province: string
  District: string
  'Sub-District': string
  Derivation: string
  Source: string
  'Source Type': string
  'Other Source Type': string
  Channel: string
  Period: string
  Locale: string
}

type BasePersonRow = {
  Regional: string
  Province: string
  District: string
  'Sub-District': string
  Gender: string
  Age: string
  'Age Range': string
  Relation: string
  'Mariage Registration': string
  Alcohol: string
  Drug: string
  Authoritative: string
  Rage: string
  Jealous: string
  Divorce: string
  'Health Problem': string
  'Mental Problem': string
  'Gambling Addict': string
  'Economics Stress': string
}

export type OffenderRow = BasePersonRow & {
  risk_count: string
  risk_profile: string
  [key: string]: string
}

export type VictimRow = BasePersonRow & {
  'Relation Type': string
  'Relation Type Group': string
  [key: string]: string
}
