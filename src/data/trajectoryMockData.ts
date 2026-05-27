// src/data/trajectoryMockData.ts

export interface MockPerson {
  id: number
  name: string
  gender: string
  workId: string
  role: 'employee' | 'visitor'
  roleLabel: string
}

export interface MockActivity {
  seq: number
  time: string
  location: string
  device: string
}

export const LOCATION_COORDS: Record<string, { x: number; y: number }> = {
  '1号楼': { x: 0.36, y: 0.36 },
  '2号楼': { x: 0.54, y: 0.58 },
  '3号楼': { x: 0.74, y: 0.32 },
  '4号楼': { x: 0.88, y: 0.62 },
  '5号楼': { x: 0.48, y: 0.78 },
}

const NAMES = ['前红军', '李明华', '王芳', '张伟', '刘强']
const DEVICES = ['门禁设备', '摆闸', '监控']
const LOCATIONS = Object.keys(LOCATION_COORDS)

export const mockPersons: MockPerson[] = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: NAMES[i % NAMES.length],
  gender: i % 3 === 2 ? '女' : '男',
  workId: String(2782782 + i * 3),
  role: i % 7 === 3 ? 'visitor' : 'employee',
  roleLabel: i % 7 === 3 ? '访客' : '员工',
}))

/** 简单线性同余 PRNG,保证同一 id 多次调用结果一致 */
function seededRand(seed: number) {
  let s = (seed * 9301 + 49297) % 233280
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

/** 给定人员 id,输出确定性活动表(6–10 条,覆盖 2–4 个楼栋,时间递增) */
export function getActivitiesForPerson(id: number): MockActivity[] {
  const rand = seededRand(id || 1)
  const rowCount = 6 + Math.floor(rand() * 5)            // 6..10
  const visitCount = 2 + Math.floor(rand() * 3)          // 2..4
  const visited = LOCATIONS.slice(0, visitCount)

  // 把 rowCount 行按访问顺序分配到 visitCount 个楼栋
  const rows: MockActivity[] = []
  let seq = 1
  let hour = 12
  let minute = 21
  for (let i = 0; i < visitCount; i++) {
    const isLast = i === visitCount - 1
    const remaining = rowCount - rows.length
    const slotsLeft = visitCount - i
    const stay = isLast ? remaining : Math.max(1, Math.floor(remaining / slotsLeft))
    for (let j = 0; j < stay; j++) {
      const time = `2025-03-19 ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:21`
      rows.push({
        seq,
        time,
        location: visited[i],
        device: DEVICES[Math.floor(rand() * DEVICES.length)],
      })
      seq++
      minute++
      if (minute >= 60) { hour++; minute = 0 }
    }
  }
  return rows
}
