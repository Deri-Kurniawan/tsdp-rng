const getInitialGradeRules = () => [
  {
    predicate: "A",
    lowerLimit: 70,
    upperLimit: 100,
    description: "Sangat Baik",
    color: "#00ff6e",
  },
  {
    predicate: "B",
    lowerLimit: 60,
    upperLimit: 69,
    description: "Baik",
    color: "#0000ff",
  },
  {
    predicate: "C",
    lowerLimit: 50,
    upperLimit: 59,
    description: "Cukup",
    color: "#e9ff00",
  },
  {
    predicate: "D",
    lowerLimit: 40,
    upperLimit: 49,
    description: "Kurang",
    color: "#ff8900",
  },
  {
    predicate: "E",
    lowerLimit: 0,
    upperLimit: 39,
    description: "Gagal",
    color: "#ff3300",
  },
];

const getInitialData = () => [
  {
    id: "kehadiran",
    label: "Kehadiran",
    value: 12,
    valueWeight: 10,
    maxValue: 16,
    maxValueWeight: 100,
  },
  {
    id: "tugas",
    label: "Tugas",
    value: 80,
    valueWeight: 20,
    maxValue: 100,
    maxValueWeight: 100,
  },
  {
    id: "uts",
    label: "UTS",
    value: 80,
    valueWeight: 20,
    maxValue: 100,
    maxValueWeight: 100,
  },
  {
    id: "uas",
    label: "UAS",
    value: 80,
    valueWeight: 50,
    maxValue: 100,
    maxValueWeight: 100,
  },
  {
    id: "project",
    label: "Project",
    value: 0,
    valueWeight: 0,
    maxValue: 100,
    maxValueWeight: 100,
  },
];

export const keyBindings = [
  { key: "R", action: "Mengacak Nilai Rata-Rata Mahasiswa" },
  {
    key: "I",
    action:
      "Membuka & Menutup Informasi Pop-up Tentang Bagaimana Aplikasi Bekerja",
  },
];

export { getInitialGradeRules, getInitialData };
