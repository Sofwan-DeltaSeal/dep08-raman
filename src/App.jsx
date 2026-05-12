import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// ==================== LOGO ====================
function RamanLogo({ size = 48, showText = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: showText ? 12 : 0 }}>
      <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="100" rx="88" ry="62" fill="none" stroke="#1a3a6e" strokeWidth="18" strokeDasharray="420 60" strokeDashoffset="30" strokeLinecap="round"/>
        <path d="M 28 120 Q 60 170 140 155 Q 180 148 175 110" fill="none" stroke="#3b82f6" strokeWidth="14" strokeLinecap="round"/>
        <circle cx="100" cy="95" r="38" fill="#dbeafe" opacity="0.7"/>
        <g fill="#1a3a6e">
          <circle cx="108" cy="64" r="10"/>
          <path d="M100 74 L92 108 L82 130 L90 132 L100 112 L108 130 L118 128 L106 104 L112 80 Z"/>
          <path d="M100 80 L80 92 L78 100 L85 101 L100 92" fill="#3b82f6"/>
          <path d="M108 78 L124 88 L126 96 L120 97 L108 86" fill="#3b82f6"/>
          <path d="M92 108 L76 125 L80 130 L95 116 Z" fill="#3b82f6"/>
          <path d="M106 104 L120 118 L118 125 L105 112 Z" fill="#3b82f6"/>
          <ellipse cx="78" cy="131" rx="9" ry="5" fill="#3b82f6"/>
          <ellipse cx="120" cy="126" rx="9" ry="5" fill="#3b82f6"/>
        </g>
      </svg>
      {showText && (
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontFamily: "'Sarabun', sans-serif", fontWeight: 700, fontSize: 13, color: "#1a3a6e", letterSpacing: "0.08em", textTransform: "uppercase" }}>PHYSICAL THERAPY</div>
          <div style={{ fontFamily: "'Sarabun', sans-serif", fontWeight: 500, fontSize: 11, color: "#3b82f6", letterSpacing: "0.14em", textTransform: "uppercase" }}>RAMAN HOSPITAL</div>
        </div>
      )}
    </div>
  );
}

// ==================== DATA ====================
const ASSESSMENT_CRITERIA = {
  section1: {
    title: "ส่วนที่ 1: กิจกรรมการใช้มือและแขน (การรับประทานอาหาร / การดูแลตนเอง)",
    description: "ประเมินโดยใช้มือข้างที่ขาดหรืออ่อนแรง โดยไม่มีเครื่องช่วยหรือคนช่วย",
    items: [
      { id: "s1q1", question: "ไม่สามารถตักอาหารเข้าปากได้เอง หรือต้องมีคนป้อน/เตรียมให้", positive: true },
      { id: "s1q2", question: "ต้องใช้สายยางให้อาหาร (Tube feeding) ตลอดชีวิต", positive: true },
      { id: "s1q3", question: "ไม่สามารถล้างหน้า แปรงฟัน โกนหนวด หวีผม อาบน้ำ หรือแต่งตัวได้ด้วยตนเอง ต้องอาศัยผู้ช่วย", positive: true },
    ],
  },
  section2: {
    title: "ส่วนที่ 2: การเดินและการเคลื่อนไหว",
    description: "ประเมินโดยไม่ใช้เครื่องพยุงหรือคนช่วย",
    items: [
      { id: "s2q1", question: "เดินไม่ได้เลย", positive: true },
      { id: "s2q2", question: "ยืนไม่ได้", positive: true },
      { id: "s2q3", question: "เดินบนพื้นราบได้ไม่ถึง 50 เมตร เนื่องจากเหนื่อยหอบมาก หรือไม่มีแรงที่จะเดินต่อ", positive: true },
      { id: "s2q4", question: "เดินได้แต่ทรงตัวไม่ดี เช่น ล้มบ่อย เดินก้าวสั้น ๆ สั่น หรือเกร็งมาก", positive: true },
      { id: "s2q5", question: "เดินแล้วตัวโยกไปมาเนื่องจากขาสั้นยาวไม่เท่ากัน ≥ 5 เซนติเมตร", positive: true },
      { id: "s2q6", question: "เดินแล้วปลายเท้าตกหรือข้อเท้ามีข้อยึดติดมาก", positive: true },
    ],
  },
  section3: {
    title: "ส่วนที่ 3: ความบกพร่องทางร่างกายที่มองเห็นได้ชัด (Physical Impairment)",
    description: "ภาพลักษณ์ภายนอกที่มีผลต่อชีวิตประจำวันหรือการมีส่วนร่วมทางสังคม",
    items: [
      { id: "s3q1", question: "คนแคระ (Dwarfism): เพศหญิงสูง ≤ 120 ซม. / เพศชายสูง ≤ 130 ซม. (อายุ > 18 ปี)", positive: true },
      { id: "s3q2", question: "หลังคดรุนแรง (Cobb angle >40°) หรือหลังค่อม (Kyphosis >70-75°) ที่รักษาไม่ได้หรือหลังผ่าตัดแล้วยังคงอยู่", positive: true },
      { id: "s3q3", question: "ใบหน้าหรือศีรษะผิดรูปอย่างชัดเจน เช่น หู ตา จมูก ปากผิดรูปผิดตำแหน่ง จากอุบัติเหตุหรือสารเคมี", positive: true },
      { id: "s3q4", question: "โรคผิวหนังเรื้อรังรักษาไม่หายที่มองเห็นชัด พื้นที่รอยโรค >50% ของใบหน้าหรือลำตัวนอกร่มผ้า", positive: true },
    ],
  },
  section4: {
    title: "ส่วนที่ 4: ความพิการที่เห็นได้โดยประจักษ์ (ไม่ต้องผ่านการประเมินแพทย์)",
    description: "นายทะเบียนสามารถออกบัตรคนพิการได้โดยตรง",
    items: [
      { id: "s4q1", question: "แขนขาดข้างหนึ่งข้างใด หรือมือขาด (นิ้วขาด ≥2 ข้อ อย่างน้อย 3 นิ้ว หรือนิ้วโป้งขาดทั้ง 2 ข้อ)", positive: true },
      { id: "s4q2", question: "ขาขาดข้างหนึ่งข้างใด ตั้งแต่ระดับข้อเท้าขึ้นไปอย่างน้อยหนึ่งข้าง", positive: true },
      { id: "s4q3", question: "ความสูงผิดปกติ (อายุ >18 ปี): เพศหญิง ≤120 ซม. หรือเพศชาย ≤130 ซม.", positive: true },
    ],
  },
};

const DURATION_OPTIONS = [
  { value: "", label: "-- เลือกระยะเวลา --" },
  { value: "immediate", label: "ประเมินได้ทันที (แขนขาขาด / ปลายเท้าเขย่งแต่กำเนิด)" },
  { value: "3months", label: "≥ 3 เดือน (อ่อนแรงจากโรคระบบประสาท)" },
  { value: "6months", label: "≥ 6 เดือน (โรคเรื้อรัง / ปวดหลัง / ข้อเสื่อม / หลังโก่ง / กลืนลำบาก)" },
  { value: "doctor_discretion", label: "ตามดุลยพินิจแพทย์ (กรณีโรคไม่ดีขึ้น)" },
];

// ==================== LOGIN PAGE ====================
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("กรุณากรอกอีเมลและรหัสผ่าน"); return; }
    setLoading(true);
    setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      setLoading(false);
      return;
    }
    // ดึงข้อมูล profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();
    setLoading(false);
    onLogin({ ...data.user, ...profile });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <RamanLogo size={80} showText={false} />
          <h1>ระบบประเมินความพิการ</h1>
          <p>ทางการเคลื่อนไหวและทางร่างกาย</p>
          <div style={{ marginTop: 8 }}><RamanLogo size={28} showText={true} /></div>
          <span className="badge">กรมส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ</span>
        </div>
        <div className="form-group">
          <label>อีเมล</label>
          <input type="email" placeholder="example@raman.go.th" value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        </div>
        <div className="form-group">
          <label>รหัสผ่าน</label>
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        </div>
        {error && <div className="error-msg">{error}</div>}
        <button className="btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
        <p className="login-note">สำหรับบุคลากรทางการแพทย์ที่ได้รับอนุญาต</p>
      </div>
    </div>
  );
}

// ==================== PATIENT INFO PAGE ====================
function PatientInfoPage({ data, onChange, onNext }) {
  const fields = [
    { key: "firstName", label: "ชื่อ", placeholder: "ชื่อ", half: true },
    { key: "lastName", label: "นามสกุล", placeholder: "นามสกุล", half: true },
    { key: "hn", label: "เลข HN", placeholder: "Hospital Number", half: true },
    { key: "idCard", label: "เลขบัตรประชาชน", placeholder: "X-XXXX-XXXXX-XX-X", half: true },
    { key: "age", label: "อายุ (ปี)", placeholder: "อายุ", half: true },
    { key: "gender", label: "เพศ", type: "select", options: ["-- เลือก --", "ชาย", "หญิง"], half: true },
    { key: "diagnosis", label: "วินิจฉัยโรค (Diagnosis)", placeholder: "ระบุโรคหรือภาวะที่วินิจฉัย", full: true },
    { key: "duration", label: "ระยะเวลาที่เป็นโรค / ได้รับการรักษา", type: "select", options: DURATION_OPTIONS.map(o => ({ value: o.value, label: o.label })), full: true, isObj: true },
    { key: "icdCode", label: "รหัส ICD-10 (ถ้ามี)", placeholder: "เช่น I63.9, G82.5", half: true },
    { key: "ward", label: "หน่วยงาน / แผนก", placeholder: "ชื่อแผนก", half: true },
  ];
  const isValid = data.firstName && data.lastName && data.hn && data.idCard && data.diagnosis && data.duration;

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="step-indicator">ขั้นตอนที่ 1/4</div>
        <h2>ข้อมูลทั่วไปของผู้เข้ารับการประเมิน</h2>
        <p>กรุณากรอกข้อมูลให้ครบถ้วนก่อนดำเนินการประเมิน</p>
      </div>
      <div className="form-grid">
        {fields.map((f) => (
          <div key={f.key} className={`form-group ${f.full ? "full" : "half"}`}>
            <label>{f.label} {["firstName","lastName","hn","idCard","diagnosis","duration"].includes(f.key) ? <span className="req">*</span> : null}</label>
            {f.type === "select" ? (
              <select value={f.isObj ? data[f.key] : data[f.key] || ""} onChange={(e) => onChange(f.key, e.target.value)}>
                {(f.isObj ? f.options : f.options.map(o => ({ value: o, label: o }))).map((opt) => (
                  <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
                ))}
              </select>
            ) : (
              <input type={f.type || "text"} placeholder={f.placeholder} value={data[f.key] || ""} onChange={(e) => onChange(f.key, e.target.value)} />
            )}
          </div>
        ))}
      </div>
      <div className="page-actions">
        <button className="btn-primary" onClick={onNext} disabled={!isValid}>ดำเนินการประเมิน →</button>
        {!isValid && <p className="helper-text">* กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน</p>}
      </div>
    </div>
  );
}

// ==================== ASSESSMENT PAGE ====================
function AssessmentPage({ answers, onChange, onNext, onBack }) {
  const [activeSection, setActiveSection] = useState(0);
  const sections = Object.entries(ASSESSMENT_CRITERIA);
  const allAnswered = sections.every(([, sec]) => sec.items.every((item) => answers[item.id] !== undefined));
  const sectionComplete = (items) => items.every((i) => answers[i.id] !== undefined);
  const sectionPositive = (items) => items.some((i) => answers[i.id] === true);

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="step-indicator">ขั้นตอนที่ 2/4</div>
        <h2>แบบประเมินความพิการทางการเคลื่อนไหวหรือทางร่างกาย</h2>
        <p>กรุณาประเมินตามผลการตรวจจริงโดยไม่ใช้อุปกรณ์ช่วย</p>
      </div>
      <div className="section-tabs">
        {sections.map(([key, sec], idx) => (
          <button key={key} className={`tab-btn ${activeSection === idx ? "active" : ""} ${sectionComplete(sec.items) ? (sectionPositive(sec.items) ? "done-pos" : "done-neg") : ""}`} onClick={() => setActiveSection(idx)}>
            <span className="tab-num">ส่วนที่ {idx + 1}</span>
            <span className="tab-status">{sectionComplete(sec.items) ? (sectionPositive(sec.items) ? "✓ พบเกณฑ์" : "✓ ไม่พบ") : "○ ยังไม่ประเมิน"}</span>
          </button>
        ))}
      </div>
      {sections.map(([key, sec], idx) => (
        <div key={key} className={`section-panel ${activeSection === idx ? "visible" : "hidden"}`}>
          <div className="section-header">
            <h3>{sec.title}</h3>
            <p className="section-desc">{sec.description}</p>
          </div>
          <div className="items-list">
            {sec.items.map((item, iIdx) => (
              <div key={item.id} className={`assessment-item ${answers[item.id] === true ? "ans-yes" : answers[item.id] === false ? "ans-no" : ""}`}>
                <div className="item-text"><span className="item-num">{iIdx + 1}.</span>{item.question}</div>
                <div className="item-btns">
                  <button className={`btn-ans ${answers[item.id] === true ? "selected-yes" : ""}`} onClick={() => onChange(item.id, true)}>ใช่</button>
                  <button className={`btn-ans ${answers[item.id] === false ? "selected-no" : ""}`} onClick={() => onChange(item.id, false)}>ไม่ใช่</button>
                </div>
              </div>
            ))}
          </div>
          <div className="section-nav">
            {idx > 0 && <button className="btn-outline" onClick={() => setActiveSection(idx - 1)}>← ส่วนก่อนหน้า</button>}
            {idx < sections.length - 1 && <button className="btn-secondary" onClick={() => setActiveSection(idx + 1)}>ส่วนถัดไป →</button>}
          </div>
        </div>
      ))}
      <div className="page-actions">
        <button className="btn-outline" onClick={onBack}>← กลับ</button>
        <button className="btn-primary" onClick={onNext} disabled={!allAnswered}>ดูผลสรุป →</button>
      </div>
    </div>
  );
}

// ==================== RESULT PAGE ====================
function ResultPage({ patient, answers, onNext, onBack }) {
  const calcResult = () => {
    const secs = Object.entries(ASSESSMENT_CRITERIA);
    const positives = {};
    let isDisabled = false;
    let disabilityType = [];
    secs.forEach(([key, sec]) => {
      const hasPositive = sec.items.some((i) => answers[i.id] === true);
      positives[key] = hasPositive;
      if (hasPositive) {
        isDisabled = true;
        if (key === "section1" || key === "section2") disabilityType.push("ความพิการทางการเคลื่อนไหว");
        if (key === "section3" || key === "section4") { if (!disabilityType.includes("ความพิการทางร่างกาย")) disabilityType.push("ความพิการทางร่างกาย"); }
      }
    });
    return { isDisabled, disabilityType: [...new Set(disabilityType)], positives };
  };
  const { isDisabled, disabilityType, positives } = calcResult();

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="step-indicator">ขั้นตอนที่ 3/4</div>
        <h2>สรุปผลการประเมิน</h2>
      </div>
      <div className={`result-card ${isDisabled ? "result-disabled" : "result-not-disabled"}`}>
        <div className="result-icon">{isDisabled ? "⚠" : "✓"}</div>
        <div className="result-text">
          <h3>{isDisabled ? "เข้าเกณฑ์ความพิการ" : "ไม่เข้าเกณฑ์ความพิการ"}</h3>
          {isDisabled && disabilityType.length > 0 && <p>ประเภท: <strong>{disabilityType.join(" / ")}</strong></p>}
        </div>
      </div>
      <div className="patient-summary">
        <h4>ข้อมูลผู้รับการประเมิน</h4>
        <div className="summary-grid">
          <div><span>ชื่อ-สกุล</span><strong>{patient.firstName} {patient.lastName}</strong></div>
          <div><span>HN</span><strong>{patient.hn}</strong></div>
          <div><span>เลขบัตร ปชช.</span><strong>{patient.idCard}</strong></div>
          <div><span>วินิจฉัยโรค</span><strong>{patient.diagnosis}</strong></div>
        </div>
      </div>
      <div className="section-results">
        <h4>ผลการประเมินแต่ละส่วน</h4>
        {Object.entries(ASSESSMENT_CRITERIA).map(([key, sec], idx) => (
          <div key={key} className={`section-result-row ${positives[key] ? "pos" : "neg"}`}>
            <span className="sr-title">ส่วนที่ {idx + 1}: {sec.title.replace(`ส่วนที่ ${idx+1}: `,"")}</span>
            <span className={`sr-badge ${positives[key] ? "badge-pos" : "badge-neg"}`}>{positives[key] ? "พบเกณฑ์" : "ไม่พบเกณฑ์"}</span>
          </div>
        ))}
      </div>
      {!isDisabled && <div className="exclusion-note"><strong>หมายเหตุ:</strong> ผู้รับการประเมินไม่เข้าเกณฑ์ความพิการทางการเคลื่อนไหวหรือทางร่างกาย ตามประกาศกระทรวงการพัฒนาสังคมและความมั่นคงของมนุษย์ พ.ศ. 2568</div>}
      <div className="page-actions">
        <button className="btn-outline" onClick={onBack}>← แก้ไขการประเมิน</button>
        <button className="btn-primary" onClick={onNext}>ลงนามและบันทึก →</button>
      </div>
    </div>
  );
}

// ==================== SIGNATURE PAGE ====================
function SignaturePage({ patient, answers, user, onBack, onSubmit }) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear() + 543}`;
  const [assessorName, setAssessorName] = useState(user?.full_name || "");
  const [assessorLicense, setAssessorLicense] = useState(user?.license_no || "");
  const [approverName, setApproverName] = useState("");
  const [approverLicense, setApproverLicense] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [liveTime, setLiveTime] = useState("");

  useEffect(() => {
    const update = () => { const n = new Date(); setLiveTime(`${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())} น.`); };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const calcResult = () => {
    let isDisabled = false; let disabilityType = [];
    Object.entries(ASSESSMENT_CRITERIA).forEach(([key, sec]) => {
      const hasPositive = sec.items.some((i) => answers[i.id] === true);
      if (hasPositive) {
        isDisabled = true;
        if (key === "section1" || key === "section2") disabilityType.push("ความพิการทางการเคลื่อนไหว");
        if (key === "section3" || key === "section4") disabilityType.push("ความพิการทางร่างกาย");
      }
    });
    return { isDisabled, disabilityType: [...new Set(disabilityType)] };
  };
  const { isDisabled, disabilityType } = calcResult();
  const canSubmit = assessorName && assessorLicense;

  const handleSubmit = async () => {
    setSaving(true);
    setSaveError("");
    try {
      // 1. บันทึกหรืออัปเดตข้อมูลผู้ป่วย
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .upsert({
          hn: patient.hn,
          id_card: patient.idCard,
          first_name: patient.firstName,
          last_name: patient.lastName,
          age: patient.age ? parseInt(patient.age) : null,
          gender: patient.gender === "-- เลือก --" ? null : patient.gender,
          created_by: user?.id,
        }, { onConflict: "hn" })
        .select()
        .single();

      if (patientError) throw patientError;

      // 2. บันทึกผลการประเมิน
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("assessments")
        .insert({
          patient_id: patientData.id,
          diagnosis: patient.diagnosis,
          icd_code: patient.icdCode || null,
          duration: patient.duration,
          ward: patient.ward || null,
          is_disabled: isDisabled,
          disability_types: disabilityType,
          assessor_name: assessorName,
          assessor_license: assessorLicense,
          approver_name: approverName || null,
          approver_license: approverLicense || null,
          notes: notes || null,
          assessed_by: user?.id,
        })
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      // 3. บันทึกคำตอบแต่ละข้อ
      const answerRows = [];
      Object.entries(ASSESSMENT_CRITERIA).forEach(([sectionKey, sec]) => {
        sec.items.forEach((item) => {
          answerRows.push({
            assessment_id: assessmentData.id,
            section: sectionKey,
            item_id: item.id,
            answer: answers[item.id],
          });
        });
      });

      const { error: answersError } = await supabase
        .from("assessment_answers")
        .insert(answerRows);

      if (answersError) throw answersError;

      setSubmitted(true);
      setTimeout(() => onSubmit(), 2000);
    } catch (err) {
      setSaveError("เกิดข้อผิดพลาด: " + err.message);
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="page-content center-content">
        <div className="success-anim">
          <div className="success-icon">✓</div>
          <h2>บันทึกสำเร็จ</h2>
          <p>ระบบได้บันทึกข้อมูลการประเมินเรียบร้อยแล้ว</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="step-indicator">ขั้นตอนที่ 4/4</div>
        <h2>ลงนามและบันทึกผลการประเมิน</h2>
      </div>
      <div className="datetime-banner">
        <div className="dt-item"><span className="dt-label">📅 วันที่</span><span className="dt-value">{dateStr}</span></div>
        <div className="dt-item"><span className="dt-label">🕐 เวลา (Real-Time)</span><span className="dt-value live">{liveTime}</span></div>
      </div>
      <div className="sign-summary">
        <h4>สรุปผลการประเมิน</h4>
        <div className={`mini-result ${isDisabled ? "mini-pos" : "mini-neg"}`}>
          {patient.firstName} {patient.lastName} (HN: {patient.hn}) — <strong>{isDisabled ? `เข้าเกณฑ์: ${disabilityType.join(" / ")}` : "ไม่เข้าเกณฑ์ความพิการ"}</strong>
        </div>
      </div>
      <div className="sign-grid">
        <div className="sign-section">
          <h4>ผู้ประเมิน (แพทย์ผู้ตรวจ) <span className="req">*</span></h4>
          <div className="form-group"><label>ชื่อ-สกุลแพทย์</label><input placeholder="นพ./พญ. ชื่อ นามสกุล" value={assessorName} onChange={e => setAssessorName(e.target.value)} /></div>
          <div className="form-group"><label>เลขที่ใบอนุญาต ว.</label><input placeholder="ว.XXXXX" value={assessorLicense} onChange={e => setAssessorLicense(e.target.value)} /></div>
          <div className="sign-box"><div className="sign-line"></div><p>ลายมือชื่อผู้ประเมิน</p></div>
        </div>
        <div className="sign-section">
          <h4>ผู้รับรอง (ถ้ามี)</h4>
          <div className="form-group"><label>ชื่อ-สกุลผู้รับรอง</label><input placeholder="นพ./พญ. ชื่อ นามสกุล" value={approverName} onChange={e => setApproverName(e.target.value)} /></div>
          <div className="form-group"><label>เลขที่ใบอนุญาต ว.</label><input placeholder="ว.XXXXX" value={approverLicense} onChange={e => setApproverLicense(e.target.value)} /></div>
          <div className="sign-box"><div className="sign-line"></div><p>ลายมือชื่อผู้รับรอง</p></div>
        </div>
      </div>
      <div className="form-group full">
        <label>หมายเหตุเพิ่มเติม</label>
        <textarea placeholder="ระบุข้อสังเกตหรือหมายเหตุเพิ่มเติม (ถ้ามี)" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
      {saveError && <div className="error-msg">{saveError}</div>}
      <div className="legal-note"><strong>📋 อ้างอิง:</strong> ประกาศกระทรวงการพัฒนาสังคมและความมั่นคงของมนุษย์ เรื่อง ประเภทและหลักเกณฑ์ความพิการ พ.ศ. 2568 และคู่มือการวินิจฉัยและตรวจประเมินความพิการ (DEP-08)</div>
      <div className="page-actions">
        <button className="btn-outline" onClick={onBack}>← กลับ</button>
        <button className="btn-primary" onClick={handleSubmit} disabled={!canSubmit || saving}>
          {saving ? "กำลังบันทึก..." : "บันทึกและออกเอกสาร ✓"}
        </button>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState({});
  const [answers, setAnswers] = useState({});
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ตรวจสอบ session เมื่อเปิดแอป
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setUser({ ...session.user, ...profile });
      }
      setCheckingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setStep(1); setPatient({}); setAnswers({});
  };

  const updatePatient = (key, val) => setPatient(prev => ({ ...prev, [key]: val }));
  const updateAnswer = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }));
  const handleSubmit = () => { setTimeout(() => { setStep(1); setPatient({}); setAnswers({}); }, 2000); };

  if (checkingAuth) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", fontFamily:"Sarabun,sans-serif", fontSize:18 }}>กำลังโหลด...</div>;

  if (!user) return (
    <><style>{STYLES}</style><LoginPage onLogin={(u) => setUser(u)} /></>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="app-shell">
        <header className="app-header">
          <div className="header-left"><RamanLogo size={44} showText={true} /></div>
          <div className="header-center">
            <div className="header-title">ระบบประเมินความพิการทางการเคลื่อนไหวและทางร่างกาย</div>
            <div className="header-sub">คู่มือการวินิจฉัยฯ DEP-08 | พ.ศ. 2568</div>
          </div>
          <div className="header-right">
            <span className="user-badge">👤 {user.full_name || user.email}</span>
            <button className="btn-logout" onClick={handleLogout}>ออกจากระบบ</button>
          </div>
        </header>
        <div className="progress-bar-wrap">
          {[1,2,3,4].map(s => (
            <div key={s} className={`progress-step ${step >= s ? "active" : ""} ${step === s ? "current" : ""}`}>
              <div className="ps-circle">{s}</div>
              <div className="ps-label">{["ข้อมูลผู้ป่วย","ประเมิน","ผลสรุป","ลงนาม"][s-1]}</div>
            </div>
          ))}
        </div>
        <main className="app-main">
          {step === 1 && <PatientInfoPage data={patient} onChange={updatePatient} onNext={() => setStep(2)} />}
          {step === 2 && <AssessmentPage answers={answers} onChange={updateAnswer} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <ResultPage patient={patient} answers={answers} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <SignaturePage patient={patient} answers={answers} user={user} onBack={() => setStep(3)} onSubmit={handleSubmit} />}
        </main>
      </div>
    </>
  );
}

// ==================== STYLES ====================
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&family=Noto+Serif+Thai:wght@400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #0d2137; --navy2: #1a3a5c; --teal: #0b7a75; --teal2: #0f9d97;
    --gold: #d4a017; --red: #c0392b; --green: #1a7a4a;
    --light: #f4f7fb; --white: #ffffff; --gray: #6b7280; --gray2: #e5eaf3;
    --text: #1a2638; --shadow: 0 4px 20px rgba(13,33,55,0.12); --radius: 12px;
  }
  body { font-family: 'Sarabun', sans-serif; background: var(--light); color: var(--text); font-size: 15px; line-height: 1.6; }
  .login-page { min-height: 100vh; background: linear-gradient(135deg, var(--navy) 0%, var(--navy2) 50%, #1a5a9e 100%); display: flex; align-items: center; justify-content: center; padding: 20px; }
  .login-card { background: white; border-radius: 20px; padding: 44px 40px; width: 100%; max-width: 440px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
  .login-logo { text-align: center; margin-bottom: 32px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .login-logo h1 { font-family: 'Noto Serif Thai', serif; font-size: 20px; color: var(--navy); font-weight: 700; margin-top: 4px; }
  .login-logo p { color: var(--gray); font-size: 13px; }
  .badge { display: inline-block; background: var(--navy); color: white; font-size: 11px; padding: 4px 10px; border-radius: 20px; margin-top: 4px; }
  .login-note { text-align: center; color: var(--gray); font-size: 12px; margin-top: 16px; }
  .error-msg { background: #fef2f2; border: 1px solid #fca5a5; color: var(--red); padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 12px; }
  .app-shell { min-height: 100vh; display: flex; flex-direction: column; }
  .app-header { background: linear-gradient(90deg, #0d2137 0%, #1a3a6e 60%, #1a5a9e 100%); color: white; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
  .header-left { flex-shrink: 0; }
  .header-center { flex: 1; text-align: center; }
  .header-title { font-weight: 600; font-size: 14px; color: white; }
  .header-sub { font-size: 11px; opacity: 0.7; color: white; }
  .header-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .user-badge { font-size: 13px; background: rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 20px; }
  .btn-logout { background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 8px; cursor: pointer; font-family: inherit; font-size: 13px; transition: background 0.2s; }
  .btn-logout:hover { background: rgba(255,255,255,0.22); }
  .progress-bar-wrap { background: #1a3a6e; display: flex; justify-content: center; gap: 0; padding: 0 20px; }
  .progress-step { display: flex; align-items: center; gap: 10px; padding: 12px 24px; color: rgba(255,255,255,0.4); font-size: 13px; transition: all 0.3s; }
  .progress-step.active { color: rgba(255,255,255,0.8); }
  .progress-step.current { color: white; }
  .ps-circle { width: 28px; height: 28px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; transition: all 0.3s; }
  .progress-step.active .ps-circle { border-color: #3b82f6; background: #1d4ed8; color: white; }
  .progress-step.current .ps-circle { border-color: var(--gold); background: var(--gold); color: var(--navy); }
  .ps-label { font-weight: 500; }
  .app-main { flex: 1; padding: 28px; max-width: 900px; margin: 0 auto; width: 100%; }
  .page-content { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .page-header { margin-bottom: 28px; padding-bottom: 20px; border-bottom: 2px solid var(--gray2); }
  .step-indicator { font-size: 12px; color: #1d4ed8; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .page-header h2 { font-family: 'Noto Serif Thai', serif; font-size: 22px; color: var(--navy); font-weight: 700; }
  .page-header p { color: var(--gray); margin-top: 4px; font-size: 14px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-group.full { grid-column: 1/-1; }
  .form-group.half { grid-column: span 1; }
  label { font-size: 13px; font-weight: 600; color: var(--navy); }
  .req { color: var(--red); }
  input, select, textarea { border: 1.5px solid var(--gray2); border-radius: 8px; padding: 10px 14px; font-family: inherit; font-size: 14px; color: var(--text); background: white; transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
  input:focus, select:focus, textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
  textarea { resize: vertical; }
  .btn-primary { background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%); color: white; border: none; padding: 12px 28px; border-radius: 10px; font-family: inherit; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(29,78,216,0.3); }
  .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(29,78,216,0.4); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-outline { background: white; color: var(--navy); border: 1.5px solid var(--gray2); padding: 12px 24px; border-radius: 10px; font-family: inherit; font-size: 14px; cursor: pointer; transition: all 0.2s; }
  .btn-outline:hover { border-color: var(--navy2); background: var(--light); }
  .btn-secondary { background: var(--navy); color: white; border: none; padding: 12px 24px; border-radius: 10px; font-family: inherit; font-size: 14px; cursor: pointer; transition: all 0.2s; }
  .btn-secondary:hover { background: var(--navy2); }
  .page-actions { display: flex; gap: 12px; align-items: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--gray2); }
  .helper-text { font-size: 13px; color: var(--gray); margin-left: auto; }
  .section-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
  .tab-btn { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 10px 16px; border-radius: 10px; border: 1.5px solid var(--gray2); background: white; cursor: pointer; font-family: inherit; transition: all 0.2s; min-width: 140px; }
  .tab-btn.active { border-color: #3b82f6; background: #eff6ff; }
  .tab-btn.done-pos { border-color: var(--red); background: #fff5f5; }
  .tab-btn.done-neg { border-color: #10b981; background: #f0fdf4; }
  .tab-num { font-size: 11px; font-weight: 700; color: var(--gray); text-transform: uppercase; }
  .tab-status { font-size: 12px; font-weight: 600; color: var(--navy); }
  .section-panel.hidden { display: none; }
  .section-panel.visible { display: block; animation: fadeIn 0.2s ease; }
  .section-header { margin-bottom: 16px; }
  .section-header h3 { font-size: 16px; font-weight: 700; color: var(--navy); }
  .section-desc { font-size: 13px; color: var(--gray); margin-top: 4px; }
  .items-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .assessment-item { background: white; border: 1.5px solid var(--gray2); border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px; transition: all 0.2s; }
  .assessment-item.ans-yes { border-color: #f87171; background: #fff8f8; }
  .assessment-item.ans-no { border-color: #86efac; background: #f8fff8; }
  .item-text { flex: 1; font-size: 14px; line-height: 1.5; }
  .item-num { font-weight: 700; color: #1d4ed8; margin-right: 8px; }
  .item-btns { display: flex; gap: 8px; flex-shrink: 0; }
  .btn-ans { padding: 7px 18px; border-radius: 8px; border: 1.5px solid var(--gray2); background: white; font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .btn-ans:hover { border-color: var(--navy2); }
  .btn-ans.selected-yes { background: #fee2e2; border-color: var(--red); color: var(--red); }
  .btn-ans.selected-no { background: #dcfce7; border-color: var(--green); color: var(--green); }
  .section-nav { display: flex; gap: 10px; justify-content: flex-end; padding-top: 12px; }
  .result-card { display: flex; align-items: center; gap: 20px; padding: 24px 28px; border-radius: 16px; margin-bottom: 28px; border: 2px solid; }
  .result-disabled { background: #fff5f5; border-color: #f87171; }
  .result-not-disabled { background: #f0fdf4; border-color: #86efac; }
  .result-icon { font-size: 36px; }
  .result-disabled .result-icon { color: var(--red); }
  .result-not-disabled .result-icon { color: var(--green); }
  .result-text h3 { font-size: 20px; font-weight: 700; }
  .result-disabled .result-text h3 { color: var(--red); }
  .result-not-disabled .result-text h3 { color: var(--green); }
  .patient-summary { background: white; border-radius: 12px; padding: 20px; border: 1px solid var(--gray2); margin-bottom: 20px; }
  .patient-summary h4 { font-size: 14px; font-weight: 700; color: var(--navy); margin-bottom: 12px; }
  .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .summary-grid div { font-size: 13px; }
  .summary-grid span { color: var(--gray); display: block; font-size: 12px; }
  .section-results { background: white; border-radius: 12px; padding: 20px; border: 1px solid var(--gray2); margin-bottom: 20px; }
  .section-results h4 { font-size: 14px; font-weight: 700; color: var(--navy); margin-bottom: 12px; }
  .section-result-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--gray2); gap: 12px; }
  .section-result-row:last-child { border-bottom: none; }
  .sr-title { font-size: 13px; flex: 1; }
  .sr-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; flex-shrink: 0; }
  .badge-pos { background: #fee2e2; color: var(--red); }
  .badge-neg { background: #dcfce7; color: var(--green); }
  .exclusion-note { background: #fffbeb; border: 1px solid #fcd34d; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #92400e; margin-bottom: 20px; }
  .datetime-banner { background: linear-gradient(135deg, var(--navy) 0%, #1a3a6e 100%); color: white; border-radius: 12px; padding: 16px 24px; display: flex; gap: 32px; margin-bottom: 24px; }
  .dt-item { display: flex; flex-direction: column; gap: 4px; }
  .dt-label { font-size: 12px; opacity: 0.7; }
  .dt-value { font-size: 20px; font-weight: 700; font-family: 'Noto Serif Thai', serif; }
  .dt-value.live { color: var(--gold); font-family: monospace; }
  .sign-summary { margin-bottom: 24px; }
  .sign-summary h4 { font-size: 14px; font-weight: 700; margin-bottom: 10px; color: var(--navy); }
  .mini-result { padding: 12px 16px; border-radius: 8px; font-size: 14px; }
  .mini-pos { background: #fff5f5; border: 1px solid #f87171; color: var(--red); }
  .mini-neg { background: #f0fdf4; border: 1px solid #86efac; color: var(--green); }
  .sign-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .sign-section { background: white; border: 1px solid var(--gray2); border-radius: 12px; padding: 20px; }
  .sign-section h4 { font-size: 14px; font-weight: 700; color: var(--navy); margin-bottom: 14px; }
  .sign-box { text-align: center; margin-top: 20px; padding-top: 16px; }
  .sign-line { border-top: 1.5px dashed var(--gray); margin-bottom: 8px; }
  .sign-box p { font-size: 12px; color: var(--gray); }
  .legal-note { background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #1e3a8a; margin-bottom: 8px; }
  .center-content { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
  .success-anim { text-align: center; animation: fadeIn 0.5s ease; }
  .success-icon { font-size: 64px; color: var(--green); margin-bottom: 16px; animation: pop 0.5s ease; }
  @keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 80% { transform: scale(1.1); } 100% { transform: scale(1); } }
  .success-anim h2 { font-family: 'Noto Serif Thai', serif; font-size: 24px; color: var(--navy); margin-bottom: 8px; }
  .success-anim p { color: var(--gray); font-size: 15px; }
`;
